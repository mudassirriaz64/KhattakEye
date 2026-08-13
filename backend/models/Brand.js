const mongoose = require('mongoose');
const { Schema } = mongoose;

const BrandSchema = new Schema({
  name: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, index: true, trim: true },
  logo: { type: String },
  tagline: { type: String, trim: true }
}, {
  timestamps: true
});

module.exports = mongoose.model('Brand', BrandSchema);
