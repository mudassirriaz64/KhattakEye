const mongoose = require('mongoose');
const { Schema } = mongoose;

const PromotionSchema = new Schema({
  name: { type: String, required: true, trim: true },
  type: { type: String, enum: ['bogo', 'category-percent-off'], required: true },
  targetProduct: { type: Schema.Types.ObjectId, ref: 'Product', default: null },
  targetCategory: { type: String, trim: true, default: null },
  targetSubCategory: { type: String, trim: true, default: null },
  discountPercent: { type: Number, min: 0, max: 100, default: 0 },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  isActive: { type: Boolean, default: true },
  badgeText: { type: String, trim: true }
}, {
  timestamps: true
});

PromotionSchema.pre('save', function() {
  if (this.type === 'bogo') {
    if (!this.targetProduct && !this.targetCategory && !this.targetSubCategory) {
      throw new Error('BOGO promotion requires a targetProduct, targetCategory, or targetSubCategory');
    }
  } else if (this.type === 'category-percent-off') {
    if (!this.targetCategory && !this.targetSubCategory && !this.targetProduct) {
      throw new Error('Category percent-off promotion requires targetCategory or targetSubCategory');
    }
    if (!this.discountPercent || this.discountPercent <= 0) {
      throw new Error('Category percent-off promotion requires a positive discountPercent');
    }
  }
});

module.exports = mongoose.model('Promotion', PromotionSchema);
