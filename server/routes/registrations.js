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
// POST /api/registrations/:eventId
router.post('/:eventId', authMiddleware, async (req, res) => {
  try {
    const event = await Event.findById(req.params.eventId);
    if (!event) return res.status(404).json({ message: 'Event not found' });
    //kayla
    //kayla
    
    // Ulises (SCRUM-28)

    // Kayla (SCRUM-30)
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

  //robert

    const reg = await Registration.findOneAndDelete({ user: req.user.id, event: req.params.eventId });
    if (!reg) return res.status(404).json({ message: 'Registration not found' });

//kayla 
    
    await event.save();
    res.json({ message: 'Registration cancelled' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
module.exports = router;
