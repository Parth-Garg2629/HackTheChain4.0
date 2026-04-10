const express = require('express');
const Message = require('../models/Message');
const Task = require('../models/Task');
const { protect } = require('../middleware/auth');

const router = express.Router();

// @route GET /api/messages/:taskId  -  Fetch message history for a mission
router.get('/:taskId', protect, async (req, res) => {
  try {
    const task = await Task.findById(req.params.taskId);
    if (!task) {
      return res.status(404).json({ success: false, message: 'Mission not found' });
    }

    // Security check: Only the victim or the assigned volunteer (or general admin/volunteer) can see the chat
    // Actually, according to user requirement: "ek volunteer ki chat ek hi client se hogi... dusre volunteer ko visible nhi hogi"
    // So we check if the user is the victim, the assignedTo volunteer, or a General Volunteer (for auditing purposes, though user said invisible to others)
    // For the hackathon, we'll enforce the user's specific rule.
    const isVictim = task.victim?.toString() === req.user._id.toString();
    const isAssignedVolunteer = task.assignedTo?.toString() === req.user._id.toString();

    if (!isVictim && !isAssignedVolunteer) {
      return res.status(403).json({ success: false, message: 'Access denied. This conversation is private.' });
    }

    const messages = await Message.find({ taskId: req.params.taskId })
      .populate('sender', 'name role')
      .sort('createdAt');

    res.json({ success: true, data: messages });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
