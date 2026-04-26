const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  category: {
    type: String,
    enum: ['Electronics', 'ID/Wallets', 'Books', 'Bags', 'Clothing', 'Keys', 'Other'],
    required: true,
  },
  type: { type: String, enum: ['lost', 'found'], required: true },
  status: {
    type: String,
    enum: ['open', 'matched', 'returned', 'closed'],
    default: 'open',
  },
  location: { type: String, required: true },
  locationCoords: {
    lat: { type: Number },
    lng: { type: Number },
  },
  date: { type: Date, default: Date.now },
  image: { type: String, default: '' },
  rarity: {
    type: String,
    enum: ['COMMON', 'UNCOMMON', 'RARE', 'LEGENDARY'],
    default: 'COMMON',
  },
  xpReward: { type: Number, default: 50 },
  confidence: { type: Number, default: 85 },
  aiTags: [{ type: String }],
  reportedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  claimedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  contactInfo: { type: String },
  isApproved: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Item', itemSchema);
