const mongoose = require('mongoose');
const { Schema } = mongoose;

const CMSPageSchema = new Schema({
  slug: { type: String, required: true, unique: true, index: true, trim: true, lowercase: true },
  title: { type: String, required: true, trim: true },
  content: { type: String, required: true }
}, {
  timestamps: true
});

module.exports = mongoose.model('CMSPage', CMSPageSchema);
