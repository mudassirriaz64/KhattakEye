const Coupon = require('../models/Coupon');

// GET /api/admin/coupons
const getAllCouponsAdmin = async (req, res, next) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    res.status(200).json({ items: coupons });
  } catch (error) {
    next(error);
  }
};

// POST /api/admin/coupons
const createCoupon = async (req, res, next) => {
  try {
    const { code, discountPercent, expiryDate, isActive, minOrderValue, usageLimit } = req.body;
    if (!code || discountPercent === undefined || !expiryDate) {
      return res.status(400).json({ message: 'Code, discountPercent, and expiryDate are required' });
    }

    const existing = await Coupon.findOne({ code: code.toUpperCase() });
    if (existing) {
      return res.status(400).json({ message: 'Coupon code already exists' });
    }

    const coupon = new Coupon({
      code: code.toUpperCase(),
      discountPercent: Number(discountPercent),
      expiryDate: new Date(expiryDate),
      isActive: isActive !== undefined ? isActive : true,
      minOrderValue: minOrderValue ? Number(minOrderValue) : 0,
      usageLimit: usageLimit ? Number(usageLimit) : undefined
    });

    await coupon.save();
    res.status(201).json(coupon);
  } catch (error) {
    next(error);
  }
};

// PUT /api/admin/coupons/:id
const updateCoupon = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (req.body.code) req.body.code = req.body.code.toUpperCase();
    if (req.body.expiryDate) req.body.expiryDate = new Date(req.body.expiryDate);

    const coupon = await Coupon.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    if (!coupon) return res.status(404).json({ message: 'Coupon not found' });

    res.status(200).json(coupon);
  } catch (error) {
    next(error);
  }
};

// DELETE /api/admin/coupons/:id
const deleteCoupon = async (req, res, next) => {
  try {
    const { id } = req.params;
    await Coupon.findByIdAndDelete(id);
    res.status(200).json({ message: 'Coupon deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllCouponsAdmin,
  createCoupon,
  updateCoupon,
  deleteCoupon
};
