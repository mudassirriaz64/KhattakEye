const mongoose = require('mongoose');
const { Schema } = mongoose;

const TestimonialSchema = new Schema({
  customerName: { type: String, required: true, trim: true },
  customerImage: { type: String },
  rating: { type: Number, required: true, min: 1, max: 5 },
  text: { type: String, required: true, trim: true },
  isActive: { type: Boolean, default: true },
  order: { type: Number, default: 0 }
}, {
  timestamps: true
});

module.exports = mongoose.model('Testimonial', TestimonialSchema);
