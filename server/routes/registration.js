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