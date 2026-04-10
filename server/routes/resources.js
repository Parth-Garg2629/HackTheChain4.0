const express = require('express');
const Resource = require('../models/Resource');
const { protect, requireRole } = require('../middleware/auth');

const router = express.Router();

// @route GET /api/resources  -  All users can view
router.get('/', protect, async (req, res) => {
  try {
    const resources = await Resource.find()
      .populate('assignedTo', 'name zoneCode')
      .sort('-updatedAt');
    res.json({ success: true, data: resources });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route POST /api/resources  -  Volunteer only: add a resource
router.post('/', protect, requireRole('General Volunteer'), async (req, res) => {
  try {
    const { name, type, quantity, notes } = req.body;
    if (!name || !type) {
      return res.status(400).json({ success: false, message: 'Name and type are required' });
    }
    const resource = await Resource.create({ name, type, quantity, notes });

    // Notify all connected clients about the new resource
    req.io.emit('resource_updated', { action: 'created', resource });

    res.status(201).json({ success: true, data: resource });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route PUT /api/resources/:id/request  -  Volunteer requests a resource
router.put('/:id/request', protect, requireRole('General Volunteer'), async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);

    if (!resource) {
      return res.status(404).json({ success: false, message: 'Resource not found' });
    }

    // ⚠️ CONFLICT DETECTION: Core Logic
    if (['Requested', 'In Transit', 'In Use', 'Maintenance', 'Allocated'].includes(resource.status)) {
      return res.status(409).json({
        success: false,
        message: `CONFLICT: Resource "${resource.name}" is already ${resource.status}. Cannot fulfill this request.`,
        conflictStatus: resource.status,
      });
    }

    resource.status = 'Requested';
    resource.assignedTo = req.user._id;
    resource.assignedZone = req.user.zoneCode;
    await resource.save();

    const updated = await Resource.findById(resource._id).populate('assignedTo', 'name zoneCode');

    // Real-time broadcast to all General Volunteer sockets
    req.io.to('General Volunteer').emit('resource_updated', {
      action: 'requested',
      resource: updated,
      requestedBy: { name: req.user.name, zone: req.user.zoneCode },
    });

    res.json({ success: true, data: updated, message: 'Resource requested successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route PUT /api/resources/:id/approve  -  Volunteer approves/dispatches resource
router.put('/:id/approve', protect, requireRole('General Volunteer'), async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id).populate('assignedTo', 'name zoneCode');

    if (!resource) {
      return res.status(404).json({ success: false, message: 'Resource not found' });
    }

    if (resource.status !== 'Requested') {
      return res.status(400).json({ success: false, message: `Cannot approve. Resource is ${resource.status}` });
    }

    resource.status = 'In Transit';
    await resource.save();

    // Notify the specific volunteer whose request was approved
    if (resource.assignedTo) {
      req.io.to(resource.assignedTo._id.toString()).emit('resource_updated', {
        action: 'approved',
        resource,
        message: `Your request for "${resource.name}" has been approved! It's on its way.`,
      });
    }

    req.io.emit('resource_updated', { action: 'approved', resource });

    res.json({ success: true, data: resource, message: 'Resource dispatched' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route PUT /api/resources/:id/return  -  Volunteer marks resource as returned
router.put('/:id/return', protect, async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);
    if (!resource) return res.status(404).json({ success: false, message: 'Resource not found' });

    resource.status = 'Available';
    resource.assignedTo = null;
    resource.assignedZone = null;
    await resource.save();

    req.io.emit('resource_updated', { action: 'returned', resource });

    res.json({ success: true, data: resource, message: 'Resource returned to pool' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route DELETE /api/resources/:id  -  Volunteer only
router.delete('/:id', protect, requireRole('General Volunteer'), async (req, res) => {
  try {
    const resource = await Resource.findByIdAndDelete(req.params.id);
    if (!resource) return res.status(404).json({ success: false, message: 'Resource not found' });

    req.io.emit('resource_updated', { action: 'deleted', resourceId: req.params.id });

    res.json({ success: true, message: 'Resource removed from inventory' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
