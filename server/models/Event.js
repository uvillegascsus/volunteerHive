const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    
    eventDate: { type: Date, required: true },
    
    eventTime: { type: String, required: true },
   location: { type: String, required: true, trim: true },
    volunteerLimit: { type: Number, required: true, min: 1 },
    spotsRemaining: { type: Number },

     requirements: { type: String, default: '' },
    category: { type: String, default: 'General' },
    
    status: {
      type: String,
      enum: ['upcoming', 'ongoing', 'completed', 'postponed', 'cancelled'],
      default: 'upcoming',
    },
   createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  },
    { timestamps: true }
  );
  //KALYA
module.exports = mongoose.model('Event', eventSchema);
    
    
