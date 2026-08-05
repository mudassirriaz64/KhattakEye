const mongoose = require('mongoose');
const { Schema } = mongoose;
const Product = require('./Product');

const lensesSchema = new Schema({
  wearDuration: { type: String, enum: ["daily", "monthly", "yearly"], required: true },
  disposalType: { type: String, trim: true },
  packSize: { type: Number, min: 1 },
  baseCurve: { type: Number },
  diameter: { type: Number },
  waterContent: { type: Number },
  powerRange: {
    min: { type: Number },
    max: { type: Number }
  },
  isToric: { type: Boolean, default: false },
  isMultifocal: { type: Boolean, default: false },
  colorTint: { type: String, trim: true }
});

module.exports = Product.discriminator('lenses', lensesSchema);
