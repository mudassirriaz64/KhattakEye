const mongoose = require('mongoose');
const { Schema } = mongoose;

const ReviewSchema = new Schema({
  product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  order: { type: Schema.Types.ObjectId, ref: 'Order' },
  productName: { type: String, required: true, trim: true },
  productImage: { type: String, required: true },
  productBrand: { type: String, required: true, trim: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  title: { type: String, trim: true },
  text: { type: String, required: true, trim: true },
  images: { type: [String], default: [] },
  videos: { type: [String], default: [] },
  status: { type: String, enum: ["published", "pending", "rejected"], default: "pending" },
  adminReply: { type: String, trim: true }
}, {
  timestamps: true
});

module.exports = mongoose.model('Review', ReviewSchema);
