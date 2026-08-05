const mongoose = require('mongoose');
const { Schema } = mongoose;

const VariantSchema = new Schema({
  color: { type: String, required: true },
  colorName: { type: String, required: true },
  image: { type: String, required: true },
  hoverImage: { type: String },
  stock: { type: Number, required: true, min: 0 }
}, { _id: false });

const SpecSchema = new Schema({
  label: { type: String, required: true },
  value: { type: String, required: true }
}, { _id: false });

const ProductSchema = new Schema({
  name: { type: String, required: true, trim: true },
  brand: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, index: true, trim: true },
  category: { type: String, required: true, index: true, trim: true },
  subcategory: { type: String, trim: true },
  price: { type: Number, required: true, min: 0 },
  oldPrice: { type: Number, min: 0 },
  description: { type: String, required: true, trim: true },
  shortDescription: { type: String, required: true, trim: true },
  images: { type: [String], required: true },
  videos: { type: [String], default: [] },
  hoverImage: { type: String, trim: true },
  rating: { type: Number, default: 0, min: 0, max: 5 },
  reviewCount: { type: Number, default: 0, min: 0 },
  badges: { type: [String], default: [] },
  variants: { type: [VariantSchema], default: [] },
  specs: { type: [SpecSchema], default: [] },
  features: { type: [String], default: [] },
  stock: { type: Number, required: true, min: 0 },
  sku: { type: String, required: true, unique: true, index: true, trim: true },
  gender: { type: [String], enum: ["men", "women", "kids", "unisex"], default: [] },
  frameShape: { type: String, required: true, trim: true },
  frameMaterial: { type: String, required: true, trim: true },
  lensType: { type: String, required: true, trim: true },
  lensColor: { type: String, required: true, trim: true },
  frameColor: { type: String, required: true, trim: true },
  frameSize: { type: String, required: true, trim: true },
  weight: { type: String, trim: true },
  uvProtection: { type: Boolean, default: false },
  warranty: { type: String, required: true, trim: true },
  availability: { type: String, enum: ["in-stock", "out-of-stock", "preorder"], required: true },
  discount: { type: Number, default: 0, min: 0, max: 100 },
  featured: { type: Boolean, default: false },
  isNewArrival: { type: Boolean, default: false },
  isBestSeller: { type: Boolean, default: false }
}, {
  timestamps: true
});

// Text index for search
ProductSchema.index({ name: 'text', brand: 'text', description: 'text' });

module.exports = mongoose.model('Product', ProductSchema);
