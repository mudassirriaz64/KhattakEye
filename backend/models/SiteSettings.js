const mongoose = require('mongoose');
const { Schema } = mongoose;

const SiteSettingsSchema = new Schema({
  _id: { type: String, default: "site-settings" },
  contact: {
    phone: { type: String, trim: true },
    whatsapp: { type: String, trim: true },
    email: { type: String, trim: true },
    address: { type: String, trim: true },
    googleMapEmbedUrl: { type: String, trim: true }
  },
  socialLinks: {
    facebook: { type: String, trim: true },
    instagram: { type: String, trim: true },
    tiktok: { type: String, trim: true }
  },
  payment: {
    bankTransfer: {
      bankName: { type: String, trim: true },
      accountTitle: { type: String, trim: true },
      iban: { type: String, trim: true }
    },
    jazzcash: { type: String, trim: true },
    easypaisa: { type: String, trim: true }
  },
  shipping: {
    freeDeliveryThreshold: { type: Number, default: 0 },
    flatRate: { type: Number, default: 0 },
    estimatedDaysMin: { type: Number, default: 1 },
    estimatedDaysMax: { type: Number, default: 7 }
  },
  policies: {
    returnWindowDays: { type: Number, default: 0 },
    warrantyYears: { type: Number, default: 0 }
  },
  homepageSections: [
    {
      id: { type: String },
      section: { type: String },
      title: { type: String },
      subtitle: { type: String },
      visible: { type: Boolean, default: true },
      order: { type: Number, default: 1 }
    }
  ],
  logo: { type: String }
}, {
  timestamps: true,
  _id: false // Disable auto-generation of _id, since we hardcode it to "site-settings"
});

module.exports = mongoose.model('SiteSettings', SiteSettingsSchema);
