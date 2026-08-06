const mongoose = require('mongoose');
const { Schema } = mongoose;
const { ORDER_STATUS_LIST, PROVINCE_LIST } = require('../utils/constants');

const ShippingAddressSchema = new Schema({
  fullName: { type: String, required: true, trim: true },
  phone: { type: String, required: true, trim: true },
  street: { type: String, required: true, trim: true },
  area: { type: String, required: true, trim: true },
  city: { type: String, required: true, trim: true },
  province: { type: String, enum: PROVINCE_LIST, required: true },
  postalCode: { type: String, required: true, trim: true }
}, { _id: false });

const CustomizationSchema = new Schema({
  prescriptionType: { type: String, enum: ["manual", "file", "written"] },
  prescriptionData: {
    od: {
      sph: { type: Number },
      cyl: { type: Number },
      axis: { type: Number },
      add: { type: Number }
    },
    os: {
      sph: { type: Number },
      cyl: { type: Number },
      axis: { type: Number },
      add: { type: Number }
    },
    pd: { type: Schema.Types.Mixed },
    pdTwo: {
      od: { type: Number },
      os: { type: Number }
    }
  },
  prescriptionFilePublicId: { type: String },
  prescriptionText: { type: String },
  lensType: { type: String },
  tintColor: { type: String },
  tintStrength: { type: String },
  priceAdded: { type: Number, default: 0 }
}, { _id: false });

const OrderItemSchema = new Schema({
  product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  name: { type: String, required: true, trim: true },
  brand: { type: String, required: true, trim: true },
  image: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  quantity: { type: Number, required: true, min: 1 },
  color: { type: String, required: true },
  customization: { type: CustomizationSchema, default: null }
}, { _id: false });

const PaymentProofSchema = new Schema({
  transactionId: { type: String, trim: true },
  screenshotUrl: { type: String },
  notes: { type: String, trim: true },
  amountPaid: { type: Number },
  verifiedBy: { type: Schema.Types.ObjectId, ref: 'AdminUser', default: null },
  verifiedAt: { type: Date }
}, { _id: false });

const TimelineSchema = new Schema({
  status: { type: String, required: true, enum: ORDER_STATUS_LIST },
  label: { type: String, required: true },
  date: { type: Date, default: Date.now },
  description: { type: String },
  completed: { type: Boolean, default: false }
}, { _id: false });

const OrderSchema = new Schema({
  orderNumber: { type: String, required: true, unique: true, index: true, trim: true },
  user: { type: Schema.Types.ObjectId, ref: 'User', default: null },
  customerName: { type: String, required: true, trim: true },
  customerPhone: { type: String, required: true, trim: true },
  customerEmail: { type: String, required: true, trim: true, lowercase: true },
  shippingAddress: { type: ShippingAddressSchema, required: true },
  items: { type: [OrderItemSchema], required: true },
  subtotal: { type: Number, required: true, min: 0 },
  shipping: { type: Number, required: true, min: 0 },
  discount: { type: Number, default: 0, min: 0 },
  total: { type: Number, required: true, min: 0 },
  paymentMethod: {
    type: String,
    enum: ["bank-transfer", "jazzcash", "easypaisa", "cod"],
    required: true
  },
  paymentProof: { type: PaymentProofSchema },
  paymentType: { type: String, enum: ["full", "advance"], default: "full", required: true },
  status: {
    type: String,
    enum: ORDER_STATUS_LIST,
    required: true,
    default: "pending"
  },
  timeline: { type: [TimelineSchema], default: [] },
  estimatedDelivery: { type: Date },
  couponCode: { type: String, trim: true }
}, {
  timestamps: true
});

module.exports = mongoose.model('Order', OrderSchema);
