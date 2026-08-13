const mongoose = require('mongoose');
const { Schema } = mongoose;

const BrandSchema = new Schema({
  name: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, index: true, trim: true },
  logo: { type: String },
  tagline: { type: String, trim: true },
  description: { type: String, trim: true },
  website: { type: String, trim: true },
  featured: { type: Boolean, default: false },
  status: { type: String, enum: ["active", "inactive"], default: "active" }
}, {
  timestamps: true
});

module.exports = mongoose.model('Brand', BrandSchema);
