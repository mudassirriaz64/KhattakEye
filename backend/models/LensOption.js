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

const LensTypeEntrySchema = new Schema({
  slug: { type: String, required: true, trim: true },
  name: { type: String, required: true, trim: true },
  price: { type: Number, min: 0 },
  priceOnRequest: { type: Boolean, default: false },
  description: { type: String, trim: true },
  info: { type: String, trim: true }
}, { _id: false });

const BrandSchema = new Schema({
  slug: { type: String, required: true, trim: true },
  name: { type: String, required: true, trim: true },
  info: { type: String, trim: true },
  lensTypes: { type: [LensTypeEntrySchema], default: [] }
}, { _id: false });

const CollectionSchema = new Schema({
  slug: { type: String, required: true, trim: true },
  name: { type: String, required: true, trim: true },
  info: { type: String, trim: true },
  brands: { type: [BrandSchema], default: undefined },
  lensTypes: { type: [LensTypeEntrySchema], default: [] }
}, { _id: false });

const LensOptionSchema = new Schema({
  slug: { type: String, required: true, unique: true, index: true, trim: true },
  appliesTo: { type: String, enum: ["sunglasses", "eyeglasses", "common"], required: true, index: true },
  name: { type: String, required: true, trim: true },
  price: { type: Number, min: 0 },
  description: { type: String, trim: true },
  info: { type: String, trim: true },
  icon: { type: String, trim: true },
  hasStrengthOptions: { type: Boolean, default: false },
  strengths: { type: [StrengthSchema], default: [] },
  hasColorOptions: { type: Boolean, default: false },
  colors: { type: [ColorSchema], default: [] },
  collections: { type: [CollectionSchema], default: [] },
  delegatesToAppliesTo: { type: String, enum: ["sunglasses", "eyeglasses"] },
  isActive: { type: Boolean, default: true },
  order: { type: Number, default: 0 }
}, {
  timestamps: true
});

LensOptionSchema.pre('validate', function () {
  const hasOwnPrice = typeof this.price === 'number';
  const hasCollections = Array.isArray(this.collections) && this.collections.length > 0;
  const hasDelegation = Boolean(this.delegatesToAppliesTo);
  if (!hasOwnPrice && !hasCollections && !hasDelegation) {
    throw new Error(`Lens option "${this.slug}" must have a price, collections, or delegatesToAppliesTo`);
  }
});

module.exports = mongoose.model('LensOption', LensOptionSchema);
