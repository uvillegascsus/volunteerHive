const express = require('express');
const router = express.Router();
const Registration = require('../models/Registration');
const Event = require('../models/Event');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

// GET /api/registrations/my
router.get('/my', authMiddleware, async (req, res) => {
  try {
    const regs = await Registration.find({ user: req.user.id })
      .populate('event')
      .sort({ createdAt: -1 });
    res.json(regs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/registrations/event/:eventId - admin only
router.get('/event/:eventId', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const regs = await Registration.find({ event: req.params.eventId }).populate('user', '-password');
    res.json(regs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/registrations/:eventId
router.post('/:eventId', authMiddleware, async (req, res) => {
  try {
    const event = await Event.findById(req.params.eventId);
    if (!event) return res.status(404).json({ message: 'Event not found' });
    if (event.spotsRemaining <= 0) return res.status(400).json({ message: 'Event is full' });
    if (event.status !== 'upcoming') return res.status(400).json({ message: 'Event is not open for registration' });

    const existing = await Registration.findOne({ user: req.user.id, event: req.params.eventId });
    if (existing) return res.status(400).json({ message: 'Already registered for this event' });

    const reg = await Registration.create({ user: req.user.id, event: req.params.eventId });
    event.spotsRemaining -= 1;
    await event.save();
    res.status(201).json(reg);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE /api/registrations/:eventId
router.delete('/:eventId', authMiddleware, async (req, res) => {
  try {
    const event = await Event.findById(req.params.eventId);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    if (new Date() >= new Date(event.eventDate)) {
      return res.status(400).json({ message: 'Cannot cancel after event has started' });
    }

    const reg = await Registration.findOneAndDelete({ user: req.user.id, event: req.params.eventId });
    if (!reg) return res.status(404).json({ message: 'Registration not found' });

    event.spotsRemaining += 1;
    await event.save();
    res.json({ message: 'Registration cancelled' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
