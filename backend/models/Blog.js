const mongoose = require('mongoose');
const { Schema } = mongoose;

const BlogSchema = new Schema({
  title: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, index: true, trim: true },
  excerpt: { type: String, trim: true, maxlength: 500 },
  content: { type: String, required: true },
  image: { type: String, trim: true },
  tags: { type: [String], default: [] },
  author: { type: String, trim: true, default: 'Khattak Eyewear' },
  status: { type: String, enum: ['draft', 'published', 'archived'], default: 'draft' },
  featured: { type: Boolean, default: false },
  views: { type: Number, default: 0, min: 0 },
  publishedAt: { type: Date, default: null }
}, { timestamps: true });

BlogSchema.index({ title: 'text', content: 'text', tags: 'text' });
BlogSchema.index({ status: 1, createdAt: -1 });

module.exports = mongoose.model('Blog', BlogSchema);
