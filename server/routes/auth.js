const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const { AccountManager, User } = require('../models/Account');
const PendingUser = require('../models/PendingUser');
const { authMiddleware } = require('../middleware/auth');

router.post('/forgot-password', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(404).json({ message: 'No account with that email' });

    const token = crypto.randomBytes(20).toString('hex');
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000;
    await user.save({ validateBeforeSave: false });

    await transporter.sendMail({
      from: `"VolunteerHive" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: 'VolunteerHive — Password Reset',
      html: `
        <div style="font-family:sans-serif;max-width:480px;margin:0 auto">
          <h2 style="color:#7c5cb5">Reset Your Password</h2>
          <p>Use the token below to reset your password. It expires in <strong>1 hour</strong>.</p>
          <div style="background:#f3eeff;padding:16px;border-radius:8px;font-size:1.3rem;font-weight:bold;letter-spacing:2px;text-align:center;color:#7c5cb5">
            ${token}
          </div>
          <p style="color:#6b7280;font-size:0.9rem;margin-top:16px">If you didn't request this, you can ignore this email.</p>
        </div>
      `,
    });

    res.json({ message: 'Password reset token sent to your email.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

