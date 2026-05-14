const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const { AccountManager, User } = require('../models/Account');
const PendingUser = require('../models/PendingUser');
const { authMiddleware } = require('../middleware/auth');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
});

const generateToken = (user) =>
  jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });

const account = AccountManager.getInstance();

// POST /api/auth/send-code — step 1 of registration
router.post('/send-code', async (req, res) => {
  try {
    console.log('send-code hit for:', req.body.email);
    const { email } = req.body;

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Email already registered' });

    const code = Math.floor(100000 + Math.random() * 900000).toString();

    await PendingUser.findOneAndUpdate(
      { email },
      { formData: req.body, code },
      { upsert: true, new: true }
    );

    await transporter.sendMail({
      from: `"VolunteerHive" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'VolunteerHive — Verify Your Email',
      html: `
        <div style="font-family:sans-serif;max-width:480px;margin:0 auto">
          <h2 style="color:#7c5cb5">Verify Your Email 🐝</h2>
          <p>Enter this code to complete your VolunteerHive registration. It expires in <strong>10 minutes</strong>.</p>
          <div style="background:#f3eeff;padding:16px;border-radius:8px;font-size:2rem;font-weight:bold;letter-spacing:8px;text-align:center;color:#7c5cb5">
            ${code}
          </div>
          <p style="color:#6b7280;font-size:0.9rem;margin-top:16px">If you didn't request this, you can ignore this email.</p>
        </div>
      `,
    });

    res.json({ message: 'Verification code sent to your email.' });
  } catch (err) {
    console.error('send-code error:', err.message);
    res.status(500).json({ message: err.message });
  }
});

// POST /api/auth/register — step 2: verify code and create account
router.post('/register', async (req, res) => {
  try {
    const { email, code } = req.body;

    const pending = await PendingUser.findOne({ email });
    if (!pending) return res.status(400).json({ message: 'No verification pending for this email' });
    if (pending.code !== code) return res.status(400).json({ message: 'Incorrect verification code' });

    const user = await account.signUp(pending.formData);
    await PendingUser.deleteOne({ email });

    const token = generateToken(user);

    await transporter.sendMail({
      from: `"VolunteerHive" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: 'Welcome to VolunteerHive!',
      html: `
        <div style="font-family:sans-serif;max-width:480px;margin:0 auto">
          <h2 style="color:#7c5cb5">Welcome, ${user.firstName}! 🐝</h2>
          <p>Your VolunteerHive account has been created successfully.</p>
          <p>You can now browse and sign up for volunteer opportunities at the Sacramento State Career Center.</p>
          <a href="http://localhost:5173/events" style="display:inline-block;margin-top:16px;padding:12px 24px;background:#9b7fd4;color:white;border-radius:10px;text-decoration:none;font-weight:bold">
            Browse Events
          </a>
          <p style="color:#6b7280;font-size:0.9rem;margin-top:24px">Sacramento State Career Center — VolunteerHive</p>
        </div>
      `,
    });

    res.status(201).json({
      token,
      user: { id: user._id, firstName: user.firstName, lastName: user.lastName, email: user.email, role: user.role },
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const user = await account.signIn(req.body.email, req.body.password);
    const token = generateToken(user);
    res.json({
      token,
      user: { id: user._id, firstName: user.firstName, lastName: user.lastName, email: user.email, role: user.role },
    });
  } catch (err) {
    res.status(401).json({ message: err.message });
  }
});

// GET /api/auth/me
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/auth/forgot-password
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

// POST /api/auth/reset-password/:token
router.post('/reset-password/:token', async (req, res) => {
  try {
    await account.resetPassword(req.params.token, req.body.password);
    res.json({ message: 'Password reset successful' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
