const mongoose = require('mongoose');
const Order = require('../models/Order');
const Product = require('../models/Product');
const Coupon = require('../models/Coupon');
const { resolveImageUrl } = require('../utils/cloudinary');

// Helper to format order images
const formatOrder = (order) => {
  const o = order.toObject ? order.toObject() : order;
  if (o.items && o.items.length > 0) {
    o.items = o.items.map(item => {
      if (item.image) item.image = resolveImageUrl(item.image) || item.image;
      return item;
    });
  }
  return o;
};

// Generate a unique order number, retrying on duplicate key collisions
const buildOrderNumber = async () => {
  const stamp = Date.now().toString().slice(-6);
  for (let attempt = 0; attempt < 5; attempt += 1) {
    const orderNumber = `KT-${stamp}${Math.floor(100 + Math.random() * 900)}`;
    const exists = await Order.exists({ orderNumber });
    if (!exists) return orderNumber;
  }
  return `KT-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
};

// POST /api/orders
exports.createOrder = async (req, res, next) => {
  const decremented = [];

  try {
    const {
      customerName,
      customerPhone,
      customerEmail,
      shippingAddress,
      items,
      paymentMethod,
      couponCode
    } = req.body;

    if (!customerName || !customerPhone || !customerEmail || !shippingAddress ||
        !Array.isArray(items) || items.length === 0 || !paymentMethod) {
      return res.status(400).json({ message: 'Missing required order fields' });
    }

    if (!shippingAddress.street || !shippingAddress.city || !shippingAddress.province) {
      return res.status(400).json({ message: 'Shipping address is incomplete' });
    }

    const validPaymentMethods = ['bank-transfer', 'jazzcash', 'easypaisa', 'cod'];
    if (!validPaymentMethods.includes(paymentMethod)) {
      return res.status(400).json({ message: 'Invalid payment method' });
    }

    // Pass 1: resolve products and compute totals using SERVER-side prices only.
    // Client-supplied prices are ignored. Nothing is mutated here, so any
    // validation error below leaves the database untouched.
    let subtotal = 0;
    const formattedItems = [];

    for (const raw of items) {
      const qty = Math.floor(Number(raw.quantity));
      if (!Number.isFinite(qty) || qty < 1 || qty > 50) {
        return res.status(400).json({ message: `Invalid quantity for "${raw.name || 'item'}"` });
      }

      const isObjectId = raw.product && String(raw.product).match(/^[0-9a-fA-F]{24}$/);
      const product = isObjectId
        ? await Product.findById(raw.product).select('name brand price images stock')
        : null;

      if (!product) {
        return res.status(400).json({ message: `Product "${raw.name || raw.product || 'unknown'}" not found` });
      }

      const price = product.price;
      subtotal += price * qty;

      formattedItems.push({
        product: product._id,
        name: product.name,
        brand: product.brand,
        image: (product.images && product.images[0]) || '',
        price,
        quantity: qty,
        color: raw.color || 'Default'
      });
    }

    // Coupon validation against the Coupon collection (authoritative).
    let discount = 0;
    let appliedCoupon = null;
    if (couponCode) {
      appliedCoupon = await Coupon.findOne({ code: String(couponCode).toUpperCase().trim() });
      if (!appliedCoupon || !appliedCoupon.isActive) {
        return res.status(400).json({ message: 'Invalid or inactive coupon code' });
      }
      if (appliedCoupon.expiryDate && new Date(appliedCoupon.expiryDate) < new Date()) {
        return res.status(400).json({ message: 'Coupon code has expired' });
      }
      if (appliedCoupon.minOrderValue && subtotal < appliedCoupon.minOrderValue) {
        return res.status(400).json({ message: `Coupon requires a minimum order of Rs. ${appliedCoupon.minOrderValue}` });
      }
      if (appliedCoupon.usageLimit && appliedCoupon.usedCount >= appliedCoupon.usageLimit) {
        return res.status(400).json({ message: 'Coupon usage limit reached' });
      }
      discount = Math.round((subtotal * appliedCoupon.discountPercent) / 100);
    }

    // Pass 2: atomically reserve stock. All validations have passed, so the only
    // failure mode left is a genuine stock shortage mid-reservation.
    for (const item of formattedItems) {
      const reserved = await Product.updateOne(
        { _id: item.product, stock: { $gte: item.quantity } },
        { $inc: { stock: -item.quantity } }
      );
      if (reserved.matchedCount === 0) {
        // Roll back reservations already made in this pass.
        for (const { id, qty } of decremented) {
          await Product.updateOne({ _id: id }, { $inc: { stock: qty } });
        }
        decremented.length = 0;
        return res.status(409).json({ message: `Insufficient stock for "${item.name}"` });
      }
      decremented.push({ id: item.product, qty: item.quantity });
    }

    const shipping = subtotal >= 3000 ? 0 : 350;
    const total = Math.max(0, subtotal + shipping - discount);

    const defaultTimeline = [
      { status: 'pending', label: 'Order Placed', date: new Date(), description: 'Your order has been received and confirmed.', completed: true },
      { status: 'processing', label: 'Lab Processing', date: new Date(), description: 'Lenses are being cut and fitted into frames.', completed: false },
      { status: 'processing', label: 'Quality Control', date: new Date(), description: 'Frame inspection and prescription alignment check.', completed: false },
      { status: 'shipped', label: 'Out for Delivery', date: new Date(), description: 'Dispatched with courier tracking.', completed: false },
      { status: 'delivered', label: 'Delivered', date: new Date(), description: 'Delivered to customer.', completed: false }
    ];

    const order = new Order({
      orderNumber: await buildOrderNumber(),
      user: req.user ? req.user._id : null,
      customerName,
      customerPhone,
      customerEmail,
      shippingAddress: {
        fullName: shippingAddress.fullName || customerName,
        phone: shippingAddress.phone || customerPhone,
        street: shippingAddress.street,
        area: shippingAddress.area || shippingAddress.city || 'Area',
        city: shippingAddress.city,
        province: shippingAddress.province,
        postalCode: shippingAddress.postalCode || ''
      },
      items: formattedItems,
      subtotal,
      shipping,
      discount,
      total,
      paymentMethod,
      status: 'pending',
      timeline: defaultTimeline,
      couponCode: appliedCoupon ? appliedCoupon.code : undefined,
      estimatedDelivery: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000)
    });

    await order.save();

    // Only after a successful order do we consume the coupon usage.
    if (appliedCoupon) {
      appliedCoupon.usedCount += 1;
      await appliedCoupon.save();
    }

    res.status(201).json(formatOrder(order));
  } catch (error) {
    // Roll back any stock reservations if order creation failed downstream.
    if (decremented.length > 0) {
      for (const { id, qty } of decremented) {
        await Product.updateOne({ _id: id }, { $inc: { stock: qty } });
      }
    }
    next(error);
  }
};

// GET /api/orders/:id
exports.getOrderById = async (req, res, next) => {
  try {
    const { id } = req.params;
    let order = null;

    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      order = await Order.findById(id);
    }
    if (!order) {
      order = await Order.findOne({ orderNumber: id.toUpperCase() });
    }

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json(formatOrder(order));
  } catch (error) {
    next(error);
  }
};

// GET /api/orders/user/my-orders
// Requires authentication (auth.protect). Only returns the logged-in user's orders.
exports.getUserOrders = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authorized, login required' });
    }

    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json(orders.map(formatOrder));
  } catch (error) {
    next(error);
  }
};
