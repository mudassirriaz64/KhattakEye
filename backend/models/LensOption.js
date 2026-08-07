const mongoose = require('mongoose');
const { Schema } = mongoose;

const StrengthSchema = new Schema({
  label: { type: String, required: true, trim: true },
  value: { type: String, required: true, trim: true }
}, { _id: false });

const ColorSchema = new Schema({
  label: { type: String, required: true, trim: true },
  value: { type: String, required: true, trim: true },
  hex: { type: String, trim: true }
}, { _id: false });

const LensOptionSchema = new Schema({
  slug: { type: String, required: true, unique: true, index: true, trim: true },
  appliesTo: { type: String, enum: ["sunglasses", "eyeglasses"], required: true, index: true },
  name: { type: String, required: true, trim: true },
  price: { type: Number, required: true, min: 0 },
  description: { type: String, trim: true },
  info: { type: String, trim: true },
  icon: { type: String, trim: true },
  hasStrengthOptions: { type: Boolean, default: false },
  strengths: { type: [StrengthSchema], default: [] },
  hasColorOptions: { type: Boolean, default: false },
  colors: { type: [ColorSchema], default: [] },
  isActive: { type: Boolean, default: true },
  order: { type: Number, default: 0 }
}, {
  timestamps: true
});

module.exports = mongoose.model('LensOption', LensOptionSchema);
