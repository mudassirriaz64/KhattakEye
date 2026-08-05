const mongoose = require('mongoose');
const { Schema } = mongoose;

const SubcategorySchema = new Schema({
  name: { type: String, required: true, trim: true },
  slug: { type: String, required: true, trim: true },
  description: { type: String, trim: true },
  group: { type: String, trim: true },
  productCount: { type: Number, default: 0 }
}, { _id: true });

const CategorySchema = new Schema({
  name: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, index: true, trim: true },
  image: { type: String, default: "" },
  description: { type: String, trim: true },
  subcategories: { type: [SubcategorySchema], default: [] },
  productKind: { type: String, enum: ['glasses', 'lenses'], default: 'glasses', index: true },
  type: { type: String, enum: ['category', 'style', 'collection'], default: 'category', index: true },
  badges: { type: [String], default: [] },
  discountLabel: { type: String, trim: true },
  featured: { type: Boolean, default: false },
  order: { type: Number, default: 0 },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' }
}, {
  timestamps: true
});

module.exports = mongoose.models.Category || mongoose.model('Category', CategorySchema);
