const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    
    eventDate: { type: Date, required: true },
    
    eventTime: { type: String, required: true },
    
    volunteerLimit: { type: Number, required: true, min: 1 },
    
    
    status: {
      type: String,
      enum: ['upcoming', 'ongoing', 'completed', 'postponed', 'cancelled'],
      default: 'upcoming',
    },
    
