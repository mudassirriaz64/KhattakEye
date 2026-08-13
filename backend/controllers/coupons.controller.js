const Coupon = require('../models/Coupon');
const Order = require('../models/Order');

// Resolve an authenticated customer id from the token cookie / Bearer header (optional auth).
const resolveCustomerId = async (req) => {
  let token = null;
  if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  } else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) return null;
  try {
    const { verifyToken } = require('../utils/jwt');
    const User = require('../models/User');
    const decoded = verifyToken(token, 'customer');
    const user = await User.findById(decoded.id).select('_id');
    return user ? user._id : null;
  } catch (err) {
    return null;
  }
};

// A coupon can only be used once per customer, tracked against existing orders.
const hasCustomerUsedCoupon = async (code, userId, email) => {
  const or = [];
  if (userId) or.push({ user: userId });
  if (typeof email === 'string' && email.trim()) {
    or.push({ customerEmail: email.trim().toLowerCase() });
  }
  if (or.length === 0) return false;
  return Order.exists({ couponCode: code, $or: or });
};

// POST /api/coupons/validate
const validateCoupon = async (req, res, next) => {
  try {
    const code = String(req.body.code || '').trim();
    const subtotal = Number(req.body.subtotal);
    if (!code) {
      return res.status(400).json({ valid: false, message: 'Coupon code is required' });
    }

    const coupon = await Coupon.findOne({ code: code.toUpperCase() });
    if (!coupon || !coupon.isActive) {
      return res.status(400).json({ valid: false, message: 'Invalid coupon code' });
    }
    if (coupon.expiryDate && new Date(coupon.expiryDate) < new Date()) {
      return res.status(400).json({ valid: false, message: 'Coupon code has expired' });
    }
    if (coupon.minOrderValue && Number.isFinite(subtotal) && subtotal < coupon.minOrderValue) {
      return res.status(400).json({
        valid: false,
        message: `This coupon requires a minimum order of Rs. ${coupon.minOrderValue.toLocaleString()}`
      });
    }
    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
      return res.status(400).json({ valid: false, message: 'Coupon usage limit reached' });
    }

    const userId = await resolveCustomerId(req);
    const alreadyUsed = await hasCustomerUsedCoupon(coupon.code, userId, req.body.email);
    if (alreadyUsed) {
      return res.status(400).json({ valid: false, message: 'You have used this coupon' });
    }

    res.status(200).json({
      valid: true,
      coupon: {
        code: coupon.code,
        discountPercent: coupon.discountPercent,
        minOrderValue: coupon.minOrderValue || 0
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { validateCoupon, resolveCustomerId, hasCustomerUsedCoupon };
