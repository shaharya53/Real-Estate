const express = require('express');
const User = require('../models/User');
const Property = require('../models/Property');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

const router = express.Router();

// Save a property
router.post('/save/:propertyId', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const propertyId = req.params.propertyId;
    if (!user.savedProperties.includes(propertyId)) {
      user.savedProperties.push(propertyId);
      await user.save();
    }

    res.json({ message: 'Property saved' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get saved properties
router.get('/saved', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('savedProperties');
    res.json(user.savedProperties);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
