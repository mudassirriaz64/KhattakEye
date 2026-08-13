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
    tiktok: { type: String, trim: true },
    youtube: { type: String, trim: true },
    twitter: { type: String, trim: true }
  },
  social: {
    facebook: { type: String, trim: true },
    instagram: { type: String, trim: true },
    tiktok: { type: String, trim: true },
    youtube: { type: String, trim: true },
    twitter: { type: String, trim: true }
  },
  payment: {
    cod: {
      active: { type: Boolean, default: true },
      label: { type: String, default: "Cash on Delivery" },
      instructions: { type: String, default: "Pay cash upon delivery at your doorstep." }
    },
    bankTransfer: {
      active: { type: Boolean, default: true },
      bankName: { type: String, trim: true },
      accountTitle: { type: String, trim: true },
      accountNumber: { type: String, trim: true },
      iban: { type: String, trim: true }
    },
    jazzcash: {
      active: { type: Boolean, default: true },
      number: { type: String, trim: true },
      accountTitle: { type: String, trim: true }
    },
    easypaisa: {
      active: { type: Boolean, default: true },
      number: { type: String, trim: true },
      accountTitle: { type: String, trim: true }
    },
    customMethods: [
      {
        id: { type: String },
        name: { type: String, trim: true },
        instructions: { type: String, trim: true },
        active: { type: Boolean, default: true }
      }
    ]
  },
  shipping: {
    freeDeliveryThreshold: { type: Number, default: 15000 },
    freeThreshold: { type: Number, default: 15000 },
    flatRate: { type: Number, default: 350 },
    standardRate: { type: Number, default: 350 },
    expressRate: { type: Number, default: 750 },
    estimatedDaysMin: { type: Number, default: 1 },
    estimatedDaysMax: { type: Number, default: 7 },
    estimatedDays: { type: String, default: "3-5 business days" }
  },
  policies: {
    returnWindowDays: { type: Number, default: 0 },
    warrantyYears: { type: Number, default: 0 }
  },
  homepage: {
    featuredProductCount: { type: Number, default: 3 }
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
  _id: false
});

module.exports = mongoose.model('SiteSettings', SiteSettingsSchema);
