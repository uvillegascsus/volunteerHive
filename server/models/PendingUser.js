const mongoose = require('mongoose');

// Temporarily stores registration data + verification code
// Auto-deletes after 10 minutes via TTL index
const pendingUserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  formData: { type: Object, required: true },
  code: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: 600 },
});

module.exports = mongoose.model('PendingUser', pendingUserSchema);
