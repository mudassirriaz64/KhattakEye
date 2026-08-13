const mongoose = require('mongoose');
const { Schema } = mongoose;

const BannerSchema = new Schema({
  type: { type: String, enum: ["homepage-slider", "promotional", "popup", "seasonal"], required: true, default: "homepage-slider" },
  image: { type: String, required: true },
  link: { type: String, trim: true },
  title: { type: String, trim: true },
  subtitle: { type: String, trim: true },
  placement: { type: [String], default: [] },
  featuredProduct: { type: Schema.Types.ObjectId, ref: 'Product' },
  order: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true }
}, {
  timestamps: true
});

module.exports = mongoose.model('Banner', BannerSchema);
