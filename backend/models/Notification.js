const mongoose = require('mongoose');
const { Schema } = mongoose;

const NotificationSchema = new Schema(
  {
    type: {
      type: String,
      enum: ['email', 'order', 'alert'],
      required: true,
      default: 'alert'
    },
    title: { type: String, required: true, trim: true },
    message: { type: String, required: true, trim: true },
    recipient: { type: String, default: 'Admin', trim: true },
    status: {
      type: String,
      enum: ['sent', 'pending', 'failed'],
      default: 'sent'
    },
    read: { type: Boolean, default: false },
    link: { type: String, trim: true },
    metadata: { type: Schema.Types.Mixed }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Notification', NotificationSchema);
