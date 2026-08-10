const mongoose = require('mongoose');
const { Schema } = mongoose;

const FAQSchema = new Schema({
  question: { type: String, required: true, trim: true },
  answer: { type: String, required: true, trim: true },
  // Target pages array allows an FAQ to be assigned to multiple pages (e.g., ["home", "blue-light", "computer", "anti-glare", "photochromic"])
  targetPages: [{ type: String, trim: true, lowercase: true }],
  category: { type: String, default: "General", trim: true },
  order: { type: Number, default: 1 },
  isActive: { type: Boolean, default: true }
}, {
  timestamps: true
});

module.exports = mongoose.model('FAQ', FAQSchema);
