const express = require('express');
const Alert = require('../models/Alert');
const { protect, requireRole } = require('../middleware/auth');

const router = express.Router();

// @route POST /api/alerts  -  Volunteer sends SOS alert
router.post('/', protect, requireRole('Volunteer'), async (req, res) => {
  try {
    const { message, severity } = req.body;

    if (!message || !severity) {
      return res.status(400).json({ success: false, message: 'Message and severity are required' });
    }

    const alert = await Alert.create({
      message,
      severity,
      sentBy: req.user._id,
      zone: req.user.zoneCode,
    });

    const populated = await Alert.findById(alert._id).populate('sentBy', 'name zoneCode');

    // 🚨 REAL-TIME BROADCAST: Emit to ALL Admin sockets immediately
    req.io.to('Admin').emit('sos_alert', {
      alert: populated,
      timestamp: new Date().toISOString(),
    });

    // Also emit globally so volunteer's own dashboard updates
    req.io.emit('alert_created', populated);

    res.status(201).json({ success: true, data: populated, message: 'SOS alert sent to base camp!' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route GET /api/alerts  -  Get all alerts (sorted: Critical first, then newest)
router.get('/', protect, async (req, res) => {
  try {
    const severityOrder = { Critical: 0, Medium: 1, Low: 2 };

    const alerts = await Alert.find()
      .populate('sentBy', 'name zoneCode')
      .populate('resolvedBy', 'name')
      .sort('-createdAt');

    // Sort: unresolved Critical first, then by date
    const sorted = alerts.sort((a, b) => {
      if (a.isResolved !== b.isResolved) return a.isResolved ? 1 : -1;
      if (severityOrder[a.severity] !== severityOrder[b.severity]) {
        return severityOrder[a.severity] - severityOrder[b.severity];
      }
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

    res.json({ success: true, data: sorted });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route PUT /api/alerts/:id/resolve  -  Admin resolves an alert
router.put('/:id/resolve', protect, requireRole('Admin'), async (req, res) => {
  try {
    const alert = await Alert.findById(req.params.id);
    if (!alert) return res.status(404).json({ success: false, message: 'Alert not found' });

    alert.isResolved = true;
    alert.resolvedBy = req.user._id;
    await alert.save();

    const updated = await Alert.findById(alert._id)
      .populate('sentBy', 'name zoneCode')
      .populate('resolvedBy', 'name');

    // Notify the volunteer who sent it
    req.io.to(alert.sentBy.toString()).emit('alert_resolved', {
      alertId: alert._id,
      message: 'Your SOS alert has been acknowledged by Base Camp.',
    });

    req.io.emit('alert_resolved', { alertId: alert._id, resolvedBy: req.user.name });

    res.json({ success: true, data: updated, message: 'Alert resolved' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
