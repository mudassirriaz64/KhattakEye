const mongoose = require('mongoose');
const { Schema } = mongoose;

const AdminUserSchema = new Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, index: true, trim: true, lowercase: true },
  passwordHash: { type: String, required: true },
  avatar: { type: String },
  role: { type: String, enum: ["super-admin", "admin", "manager"], required: true },
  isActive: { type: Boolean, default: true },
  lastLogin: { type: Date },
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date }
}, {
  timestamps: true
});

module.exports = mongoose.model('AdminUser', AdminUserSchema);
