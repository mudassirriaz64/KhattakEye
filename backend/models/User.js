const mongoose = require('mongoose');
const { Schema } = mongoose;
const { PROVINCE_LIST } = require('../utils/constants');

const AddressSchema = new Schema({
  label: { type: String, trim: true },
  fullName: { type: String, required: true, trim: true },
  phone: { type: String, required: true, trim: true },
  street: { type: String, required: true, trim: true },
  area: { type: String, required: true, trim: true },
  city: { type: String, required: true, trim: true },
  province: { type: String, enum: PROVINCE_LIST, required: true },
  postalCode: { type: String, required: true, trim: true },
  isDefault: { type: Boolean, default: false }
});

const UserSchema = new Schema({
  fullName: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, index: true, trim: true, lowercase: true },
  phone: { type: String, required: false, trim: true },
  passwordHash: { type: String, required: false },
  googleId: { type: String, sparse: true },
  authProvider: { type: String, enum: ['local', 'google'], default: 'local' },
  avatar: { type: String },
  gender: { type: String, trim: true },
  dateOfBirth: { type: Date },
  isEmailVerified: { type: Boolean, default: false },
  role: { type: String, enum: ["customer"], default: "customer" },
  isBlocked: { type: Boolean, default: false },
  addresses: { type: [AddressSchema], default: [] },
  wishlist: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
  verificationOtp: { type: String },
  verificationOtpExpires: { type: Date },
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date }
}, {
  timestamps: true
});

module.exports = mongoose.model('User', UserSchema);
