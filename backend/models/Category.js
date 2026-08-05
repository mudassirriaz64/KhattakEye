const mongoose = require('mongoose');
const { Schema } = mongoose;

const SubcategorySchema = new Schema({
  name: { type: String, required: true, trim: true },
  slug: { type: String, required: true, trim: true },
  description: { type: String, trim: true },
  productCount: { type: Number, default: 0 }
}, { _id: true });

const CategorySchema = new Schema({
  name: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, index: true, trim: true },
  image: { type: String, default: "" },
  description: { type: String, trim: true },
  subcategories: { type: [SubcategorySchema], default: [] },
  featured: { type: Boolean, default: false },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' }
}, {
  timestamps: true
});

module.exports = mongoose.model('Category', CategorySchema);
