const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Abstract base Account class (Singleton pattern)
// Only one AccountManager instance can exist — it serves as the
// single access point for all account operations (signUp, signIn, resetPassword).

class AccountManager {
  constructor() {
    if (AccountManager._instance) {
      return AccountManager._instance;
    }
    AccountManager._instance = this;
  }

  static getInstance() {
    if (!AccountManager._instance) {
      new AccountManager();
    }
    return AccountManager._instance;
  }

  // FR-1.1 Create account
  async signUp({ firstName, lastName, email, password, role, graduationYear, major }) {
    const existing = await User.findOne({ email });
    if (existing) throw new Error('Email already registered');
    return await User.create({ firstName, lastName, email, password, role, graduationYear, major });
  }

  // FR-1.2 Sign in
  async signIn(email, password) {
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      throw new Error('Invalid email or password');
    }
    return user;
  }

  // FR-1.3 Reset password
  async resetPassword(token, newPassword) {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });
    if (!user) throw new Error('Invalid or expired reset token');
    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();
    return user;
  }

  // FR-1.4 Update profile
  async updateProfile(userId, fields) {
    return await User.findByIdAndUpdate(userId, fields, { new: true, runValidators: true }).select('-password');
  }
}

AccountManager._instance = null;

// Mongoose schema (shared by UserAccount and AdminAccount via role field)
const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true, trim: true },
    lastName:  { type: String, required: true, trim: true },
    email: {
      type: String, required: true, unique: true, lowercase: true,
      match: [/^[^\s@]+@(csus\.edu|saclink\.csus\.edu)$/, 'Must be a valid Sac State email'],
    },
    password:    { type: String, required: true, minlength: 6 },
    role:        { type: String, enum: ['student', 'admin'], default: 'student' },
    // UserAccount fields
    graduationYear: { type: Number },
    major:          { type: String, trim: true },
    skills:         { type: String, trim: true },
    contactInfo:    { type: String, trim: true },
    // AdminAccount fields
    adminLevel:     { type: String, trim: true },
    // Profile
    displayName:    { type: String, trim: true },
    profilePicture: { type: String, default: '' },
    // Password reset
    resetPasswordToken:   { type: String },
    resetPasswordExpires: { type: Date },
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = { AccountManager, User };
