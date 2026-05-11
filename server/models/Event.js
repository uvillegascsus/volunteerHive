// === randomperson starts here ===
const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema(
  {

    eventDate: { type: Date, required: true },

    volunteerLimit: { type: Number, required: true, min: 1 },

    status: {
      type: String,
      enum: ['upcoming', 'ongoing', 'completed', 'postponed', 'cancelled'],
      default: 'upcoming',
    },

})