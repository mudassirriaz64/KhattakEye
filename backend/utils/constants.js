const ORDER_STATUSES = {
  PENDING: 'pending',
  PAYMENT_VERIFICATION: 'payment-verification',
  CONFIRMED: 'confirmed',
  PROCESSING: 'processing',
  PACKED: 'packed',
  SHIPPED: 'shipped',
  OUT_FOR_DELIVERY: 'out-for-delivery',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled'
};

const PROVINCES = {
  PUNJAB: 'Punjab',
  SINDH: 'Sindh',
  KPK: 'KPK',
  BALOCHISTAN: 'Balochistan',
  GILGIT_BALTISTAN: 'Gilgit-Baltistan',
  AJK: 'AJK'
};

module.exports = {
  ORDER_STATUSES,
  ORDER_STATUS_LIST: Object.values(ORDER_STATUSES),
  PROVINCES,
  PROVINCE_LIST: Object.values(PROVINCES)
};
