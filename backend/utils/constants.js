const ORDER_STATUSES = {
  PENDING: 'pending',
  PENDING_QUOTE: 'pending-quote',
  PAYMENT_VERIFICATION: 'payment-verification',
  CONFIRMED: 'confirmed',
  PROCESSING: 'processing',
  PACKED: 'packed',
  SHIPPED: 'shipped',
  OUT_FOR_DELIVERY: 'out-for-delivery',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
  CLOSED: 'closed'
};

const PROVINCES = {
  PUNJAB: 'Punjab',
  SINDH: 'Sindh',
  KPK: 'Khyber Pakhtunkhwa',
  KPK_ALT: 'KPK',
  BALOCHISTAN: 'Balochistan',
  ISLAMABAD: 'Islamabad Capital Territory',
  ISLAMABAD_ALT: 'Islamabad',
  GILGIT_BALTISTAN: 'Gilgit-Baltistan',
  AJK: 'Azad Jammu & Kashmir',
  AJK_ALT: 'AJK'
};

module.exports = {
  ORDER_STATUSES,
  ORDER_STATUS_LIST: Object.values(ORDER_STATUSES),
  PROVINCES,
  PROVINCE_LIST: Object.values(PROVINCES)
};
