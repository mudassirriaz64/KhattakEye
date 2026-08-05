const mongoose = require('mongoose');
const { Schema } = mongoose;

const NewsletterSubscriberSchema = new Schema({
  email: { type: String, required: true, unique: true, index: true, trim: true, lowercase: true },
  subscribedAt: { type: Date, default: Date.now }
}, {
  timestamps: true
});

module.exports = mongoose.model('NewsletterSubscriber', NewsletterSubscriberSchema);
