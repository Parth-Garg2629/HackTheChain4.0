const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

const router = express.Router();

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET || 'reliefsync_secret', { expiresIn: '7d' });

// @route POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, zoneCode, role, password } = req.body;

    if (!name || !zoneCode || !role || !password) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    // Validate zone code format (e.g., RJ-KOTA-01)
    const zoneRegex = /^[A-Z]{2}-[A-Z]+-\d{2}$/;
    if (!zoneRegex.test(zoneCode.toUpperCase())) {
      return res.status(400).json({
        success: false,
        message: 'Invalid zone code format. Use format: STATE-CITY-## (e.g., RJ-KOTA-01)',
      });
    }

    const existingUser = await User.findOne({ name, zoneCode: zoneCode.toUpperCase() });
    if (existingUser) {
      return res.status(409).json({ success: false, message: 'User already registered in this zone' });
    }

    const user = await User.create({ name, zoneCode: zoneCode.toUpperCase(), role, password });
    const token = signToken(user._id);

    res.status(201).json({
      success: true,
      token,
      user: { id: user._id, name: user.name, role: user.role, zoneCode: user.zoneCode },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { name, zoneCode, password } = req.body;

    if (!name || !zoneCode || !password) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    const user = await User.findOne({
      name: name.trim(),
      zoneCode: zoneCode.toUpperCase().trim(),
    }).select('+password');

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const token = signToken(user._id);

    res.json({
      success: true,
      token,
      user: { id: user._id, name: user.name, role: user.role, zoneCode: user.zoneCode },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route GET /api/auth/me
router.get('/me', protect, (req, res) => {
  res.json({ success: true, user: req.user });
});

// @route GET /api/auth/responders (To fetch all active responders)
router.get('/responders', protect, async (req, res) => {
  try {
    const responders = await User.find({ role: 'General Volunteer' }).select('-password').sort('-createdAt');
    res.json({ success: true, data: responders });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
