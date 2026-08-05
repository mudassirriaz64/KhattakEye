const mongoose = require('mongoose');
const { Schema } = mongoose;

const ActivityLogSchema = new Schema({
  adminUser: { type: Schema.Types.ObjectId, ref: 'AdminUser', required: true },
  action: { type: String, required: true, trim: true },
  targetType: { type: String, trim: true },
  targetId: { type: String, trim: true },
  details: { type: Schema.Types.Mixed }
}, {
  timestamps: true
});

module.exports = mongoose.model('ActivityLog', ActivityLogSchema);
