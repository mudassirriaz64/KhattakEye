const mongoose = require('mongoose');
const { Schema } = mongoose;
const Product = require('./Product');

const VariantSchema = new Schema({
  color: { type: String, required: true },
  colorName: { type: String, required: true },
  image: { type: String, required: true },
  hoverImage: { type: String },
  stock: { type: Number, required: true, min: 0 }
}, { _id: false });

const glassesSchema = new Schema({
  variants: { type: [VariantSchema], default: [] },
  gender: { type: [String], enum: ["men", "women", "kids", "unisex"], default: [] },
  frameShape: { type: String, trim: true },
  frameMaterial: { type: String, trim: true },
  lensType: { type: String, trim: true },
  lensColor: { type: String, trim: true },
  frameColor: { type: String, trim: true },
  frameSize: { type: String, trim: true },
  weight: { type: String, trim: true },
  uvProtection: { type: Boolean, default: false },
  warranty: { type: String, trim: true }
});

module.exports = Product.discriminator('glasses', glassesSchema);
