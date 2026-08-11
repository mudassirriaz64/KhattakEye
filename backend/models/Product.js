const mongoose = require('mongoose');
const { Schema } = mongoose;

const SpecSchema = new Schema({
  label: { type: String, required: true, trim: true },
  value: { type: String, required: true, trim: true }
}, { _id: false });

const ProductSchema = new Schema({
  name: { type: String, required: true, trim: true },
  brand: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, index: true, trim: true },
  category: { type: String, required: true, index: true, trim: true },
  subcategory: { type: String, trim: true },
  price: { type: Number, required: true, min: 0 },
  oldPrice: { type: Number, min: 0 },
  cost: { type: Number, min: 0 },
  description: { type: String, required: true, trim: true },
  shortDescription: { type: String, required: true, trim: true },
  images: { type: [String], required: true },
  hoverImage: { type: String, trim: true },
  videos: { type: [String], default: [] },
  rating: { type: Number, default: 0, min: 0, max: 5 },
  reviewCount: { type: Number, default: 0, min: 0 },
  badges: { type: [String], default: [] },
  specs: { type: [SpecSchema], default: [] },
  features: { type: [String], default: [] },
  stock: { type: Number, required: true, min: 0 },
  sku: { type: String, required: true, unique: true, index: true, trim: true },
  availability: { type: String, enum: ["in-stock", "out-of-stock", "preorder"], default: "in-stock" },
  discount: { type: Number, default: 0, min: 0, max: 100 },
  featured: { type: Boolean, default: false },
  isNewArrival: { type: Boolean, default: false },
  isBestSeller: { type: Boolean, default: false },
  isPolarized: { type: Boolean, default: false },
  isPremium: { type: Boolean, default: false },
  status: { type: String, enum: ["draft", "active", "archived"], default: "active" },
  model3d: { type: String, trim: true },
  isDeleted: { type: Boolean, default: false },
  deletedAt: { type: Date, default: null }
}, {
  discriminatorKey: 'kind',
  timestamps: true
});

// Text index for search
ProductSchema.index({ name: 'text', brand: 'text', description: 'text' });
ProductSchema.index({ kind: 1 });

module.exports = mongoose.model('Product', ProductSchema);
