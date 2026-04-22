const express = require('express');
const router = express.Router();
const { AccountManager, User } = require('../models/Account');
const { authMiddleware } = require('../middleware/auth');

const account = AccountManager.getInstance();

router.put('/profile', authMiddleware, async (req, res) => {
  try {
    const { firstName, lastName, displayName, graduationYear, major, skills, contactInfo } = req.body;
    const user = await account.updateProfile(req.user.id, {
      firstName, lastName, displayName, graduationYear, major, skills, contactInfo,
    });
    res.json(user);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.put('/change-password', authMiddleware, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id);
    if (!(await user.matchPassword(currentPassword))) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }
    user.password = newPassword;
    await user.save();
    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
