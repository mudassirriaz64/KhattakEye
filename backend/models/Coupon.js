const mongoose = require('mongoose');
const { Schema } = mongoose;

const CouponSchema = new Schema({
  code: { type: String, required: true, unique: true, index: true, trim: true, uppercase: true },
  discountPercent: { type: Number, required: true, min: 0, max: 100 },
  expiryDate: { type: Date, required: true },
  isActive: { type: Boolean, default: true },
  minOrderValue: { type: Number, min: 0 },
  usageLimit: { type: Number, min: 1 },
  usedCount: { type: Number, default: 0, min: 0 }
}, {
  timestamps: true
});

module.exports = mongoose.model('Coupon', CouponSchema);
