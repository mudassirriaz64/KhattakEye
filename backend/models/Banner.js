const mongoose = require('mongoose');
const { Schema } = mongoose;

const BannerSchema = new Schema({
  type: { type: String, enum: ["homepage-slider", "promotional"], required: true },
  image: { type: String, required: true },
  link: { type: String, trim: true },
  title: { type: String, trim: true },
  order: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true }
}, {
  timestamps: true
});

module.exports = mongoose.model('Banner', BannerSchema);
