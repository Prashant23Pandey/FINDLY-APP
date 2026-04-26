const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  enrollmentNo: { type: String, unique: true, sparse: true },
  phone: { type: String },
  password: { type: String, required: true },
  role: { type: String, enum: ['student', 'admin'], default: 'student' },
  branch: { type: String },
  year: { type: String },
  xp: { type: Number, default: 0 },
  level: { type: Number, default: 1 },
  itemsReported: { type: Number, default: 0 },
  itemsReturned: { type: Number, default: 0 },
  avatar: { type: String, default: '' },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Calculate level from XP
userSchema.methods.calculateLevel = function () {
  this.level = Math.floor(this.xp / 100) + 1;
};

module.exports = mongoose.model('User', userSchema);
