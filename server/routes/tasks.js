const express = require('express');
const Task = require('../models/Task');
const { protect, requireRole } = require('../middleware/auth');

const router = express.Router();

// @route GET /api/tasks  -  List tasks (can filter by zone)
router.get('/', protect, async (req, res) => {
  try {
    const { zone } = req.query;
    let query = {};
    if (zone) query.zoneCode = zone.toUpperCase();

    const tasks = await Task.find(query)
      .populate('assignedTo', 'name zoneCode')
      .sort('-createdAt');
    res.json({ success: true, data: tasks });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route POST /api/tasks  -  Dispatcher only: create a task
router.post('/', protect, requireRole('Dispatcher'), async (req, res) => {
  try {
    const { title, description, location, priority, zoneCode } = req.body;
    if (!title || !location || !zoneCode) {
      return res.status(400).json({ success: false, message: 'Title, location, and zoneCode are required' });
    }

    const task = await Task.create({
      title,
      description,
      location,
      priority: priority || 'Low',
      zoneCode: zoneCode.toUpperCase(),
    });

    // Notify all connected clients about the new task
    req.io.emit('task_created', task);

    res.status(201).json({ success: true, data: task });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route PUT /api/tasks/:id/claim  -  Driver or Volunteer claims a task
router.put('/:id/claim', protect, requireRole('Verified Driver', 'General Volunteer'), async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    // ⚠️ CONCURRENCY LOCK: Check if already claimed
    if (task.status !== 'Open') {
      return res.status(409).json({
        success: false,
        message: `CONFLICT: Task is already ${task.status} by ${task.assignedTo ? 'someone else' : 'the system'}.`,
        currentStatus: task.status,
      });
    }

    task.status = 'Claimed';
    task.assignedTo = req.user._id;
    await task.save();

    const updated = await Task.findById(task._id).populate('assignedTo', 'name zoneCode');

    // Real-time broadcast
    req.io.emit('task_claimed', updated);

    res.json({ success: true, data: updated, message: 'Task claimed successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route PUT /api/tasks/:id/complete  -  Mark task as completed
router.put('/:id/complete', protect, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ success: false, message: 'Task not found' });

    // Only allow dispatcher or the assigned user to complete
    if (req.user.role !== 'Dispatcher' && task.assignedTo?.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to complete this task' });
    }

    task.status = 'Completed';
    await task.save();

    req.io.emit('task_updated', task);

    res.json({ success: true, data: task, message: 'Task marked as completed' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
