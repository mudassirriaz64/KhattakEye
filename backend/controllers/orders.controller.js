const mongoose = require('mongoose');
const fs = require('fs');
const os = require('os');
const path = require('path');
const Order = require('../models/Order');
const Product = require('../models/Product');
const LensOption = require('../models/LensOption');
const { sendOrderConfirmationEmail } = require('../utils/email');
const { sendWhatsAppPriceOnRequestNotification } = require('../utils/whatsapp');
const Coupon = require('../models/Coupon');
const { resolveImageUrl } = require('../utils/cloudinary');

// Helper to write buffer to temp file
const writeTempFile = (buffer, originalName) => {
  return new Promise((resolve, reject) => {
    const tempPath = path.join(os.tmpdir(), `temp_upload_${Date.now()}_${originalName}`);
    fs.writeFile(tempPath, buffer, (err) => {
      if (err) reject(err);
      else resolve(tempPath);
    });
  });
};

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
    let {
      customerName,
      customerPhone,
      customerEmail,
      shippingAddress,
      items,
      paymentMethod,
      couponCode
    } = req.body;

    // Parse stringified JSON fields if they are sent as strings in multipart request
    if (typeof shippingAddress === 'string') {
      try {
        shippingAddress = JSON.parse(shippingAddress);
      } catch (err) {
        return res.status(400).json({ message: 'Invalid shippingAddress JSON format' });
      }
    }

    if (typeof items === 'string') {
      try {
        items = JSON.parse(items);
      } catch (err) {
        return res.status(400).json({ message: 'Invalid items JSON format' });
      }
    }

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

    // Try to get authenticated user if not already set by middleware (since this is public endpoint)
    let authenticatedUserId = req.user ? req.user._id : null;
    if (!authenticatedUserId) {
      let token = null;
      if (req.cookies && req.cookies.token) {
        token = req.cookies.token;
      } else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
      }
      if (token) {
        try {
          const { verifyToken } = require('../utils/jwt');
          const User = require('../models/User');
          const decoded = verifyToken(token, 'customer');
          const user = await User.findById(decoded.id).select('_id');
          if (user) {
            authenticatedUserId = user._id;
          }
        } catch (err) {
          // Ignore invalid tokens for public order routing
        }
      }
    }

    // Handle payment proof upload / base64 if provided
    let paymentProofData = null;
    let screenshotFile = req.file || (req.files && req.files.paymentScreenshot ? req.files.paymentScreenshot[0] : null);
    
    // Check if base64 screenshot or file buffer was sent
    let screenshotBuffer = null;
    if (screenshotFile && screenshotFile.buffer) {
      screenshotBuffer = screenshotFile.buffer;
    } else if (req.body.paymentScreenshot && typeof req.body.paymentScreenshot === 'string' && req.body.paymentScreenshot.startsWith('data:image')) {
      const base64Data = req.body.paymentScreenshot.replace(/^data:image\/\w+;base64,/, '');
      screenshotBuffer = Buffer.from(base64Data, 'base64');
    }

    if (screenshotBuffer) {
      if (screenshotBuffer.length > 10 * 1024 * 1024) {
        return res.status(400).json({ message: 'Payment screenshot exceeds maximum size limit of 10MB' });
      }

      const crypto = require('crypto');
      const fileHash = crypto.createHash('sha256').update(screenshotBuffer).digest('hex');

      // Check duplicate payment screenshot in existing orders
      const existingDuplicate = await Order.findOne({ 'paymentProof.fileHash': fileHash });
      if (existingDuplicate) {
        return res.status(400).json({ message: 'Duplicate payment screenshot detected. Please upload a valid, unique transaction receipt.' });
      }

      let tempPath = null;
      let compressedPath = null;
      let screenshotUrl = null;
      try {
        const { compressMedia } = require('../utils/mediaCompression');
        const { uploadMedia, getCloudinaryFolder } = require('../utils/cloudinary');
        
        tempPath = await writeTempFile(screenshotBuffer, 'payment_screenshot.jpg');
        compressedPath = await compressMedia(tempPath, 'image');
        
        const folder = getCloudinaryFolder('payments');
        const cloudinaryResult = await uploadMedia(compressedPath, folder);
        screenshotUrl = cloudinaryResult.secure_url || cloudinaryResult.url;
      } catch (err) {
        console.error("Payment screenshot compression/upload error:", err);
        return res.status(500).json({ message: 'Failed to process and compress payment screenshot' });
      } finally {
        if (tempPath && fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
        if (compressedPath && fs.existsSync(compressedPath)) fs.unlinkSync(compressedPath);
      }

      paymentProofData = {
        transactionId: req.body.transactionId || undefined,
        screenshotUrl,
        fileHash,
        notes: req.body.paymentNotes || undefined,
        status: 'pending'
      };
    }

    // Upload prescription file if present
    let prescriptionFilePublicId = null;
    if (req.file && !paymentProofData) { // Logic adjusted if req.file is used for either
      let tempPath = null;
      let compressedPath = null;
      try {
        const { compressMedia } = require('../utils/mediaCompression');
        const { uploadMedia, getCloudinaryFolder } = require('../utils/cloudinary');
        
        tempPath = await writeTempFile(req.file.buffer, req.file.originalname);
        compressedPath = await compressMedia(tempPath, 'image');
        
        const folder = getCloudinaryFolder('prescriptions');
        const cloudinaryResult = await uploadMedia(compressedPath, folder);
        prescriptionFilePublicId = cloudinaryResult.public_id;
      } catch (err) {
        console.error("Prescription upload error:", err);
      } finally {
        if (tempPath && fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
        if (compressedPath && fs.existsSync(compressedPath)) fs.unlinkSync(compressedPath);
      }
    }

    let hasLensCustomization = false;
    let hasPriceOnRequest = false;
    let subtotal = 0;
    const formattedItems = [];

    // Resolve lens options server-side (authoritative pricing) for any customized items.
    // §6: sunglasses reference lensOptionSlug; eyeglasses reference lensCoating (both are LensOption slugs).
    const lensSlugs = [...new Set(
      items.flatMap((i) => {
        const c = i.customization;
        if (!c) return [];
        return [c.lensOptionSlug, c.lensCoating].filter(Boolean);
      })
    )];
    const lensOptionMap = new Map();
    if (lensSlugs.length > 0) {
      const lensOptions = await LensOption.find({ slug: { $in: lensSlugs }, isActive: true });
      lensOptions.forEach((lo) => lensOptionMap.set(lo.slug, lo));
    }

    for (const raw of items) {
      const qty = Math.floor(Number(raw.quantity));
      if (!Number.isFinite(qty) || qty < 1 || qty > 50) {
        return res.status(400).json({ message: `Invalid quantity for "${raw.name || 'item'}"` });
      }

      const product = await Product.findById(raw.product || raw.id).where('isDeleted').ne(true);
      if (!product || product.status !== 'active') {
        return res.status(404).json({ message: `Product "${raw.name || 'item'}" is unavailable` });
      }

      if (product.stock < qty) {
        return res.status(409).json({ message: `Insufficient stock for "${product.name}". Available: ${product.stock}` });
      }

      let customization = null;
      let priceAdded = 0;
      let priceOnRequest = false;

      if (raw.customization) {
        hasLensCustomization = true;
        const cust = raw.customization;

        // Server-authoritative lens price: resolve from the LensOption collection.
        // A client-sent priceAdded is only trusted when no lens option slug is provided
        // (legacy carts created before the slug fields existed).
        const primarySlug = cust.lensCoating || cust.lensOptionSlug;
        const mainOption = primarySlug ? lensOptionMap.get(primarySlug) : undefined;

        if (mainOption) {
          if (mainOption.delegatesToAppliesTo) {
            const delegatedOption = cust.lensOptionSlug ? lensOptionMap.get(cust.lensOptionSlug) : undefined;
            if (!delegatedOption || delegatedOption.appliesTo !== mainOption.delegatesToAppliesTo) {
              return res.status(400).json({ message: `Invalid delegated lens option "${cust.lensOptionSlug}" for coating "${primarySlug}"` });
            }
            priceAdded = delegatedOption.price;
          } else if (mainOption.collections && mainOption.collections.length > 0) {
            // collections → (brands) → lensTypes hierarchy (ERP.md §14)
            const collection = mainOption.collections.find((c) => c.slug === cust.lensOptionCollectionSlug);
            if (!collection) {
              return res.status(400).json({ message: `A valid collection is required for lens option "${primarySlug}"` });
            }
            const type = collection.brands && collection.brands.length > 0
              ? (() => {
                  const brand = collection.brands.find((b) => b.slug === cust.lensOptionBrandSlug);
                  return brand && brand.lensTypes.find((lt) => lt.slug === cust.lensOptionTypeSlug);
                })()
              : collection.lensTypes.find((lt) => lt.slug === cust.lensOptionTypeSlug);
            if (!type) {
              return res.status(400).json({ message: `A valid lens type is required for collection "${collection.slug}"` });
            }
            if (type.priceOnRequest || type.price === undefined || type.price === null) {
              priceOnRequest = true;
              priceAdded = null;
            } else {
              priceAdded = type.price;
            }
          } else {
            priceAdded = mainOption.price;
          }
        } else if (cust.lensOptionSlug || cust.lensCoating) {
          return res.status(400).json({ message: `Invalid or unavailable lens option "${cust.lensOptionSlug || cust.lensCoating}"` });
        } else {
          priceAdded = Number(cust.priceAdded) || 0;
        }

        // Resolve prescription file ID: use server-uploaded file ID if type is file
        let fileId = cust.prescriptionFilePublicId || null;
        if (cust.prescriptionType === 'file' && prescriptionFilePublicId) {
          fileId = prescriptionFilePublicId;
        }

        customization = {
          prescriptionType: cust.prescriptionType,
          prescriptionData: cust.prescriptionData || undefined,
          prescriptionFilePublicId: fileId || undefined,
          prescriptionText: cust.prescriptionText || undefined,
          lensOptionSlug: cust.lensOptionSlug || undefined,
          lensOptionCollectionSlug: cust.lensOptionCollectionSlug || undefined,
          lensOptionBrandSlug: cust.lensOptionBrandSlug || undefined,
          lensOptionTypeSlug: cust.lensOptionTypeSlug || undefined,
          lensType: cust.lensType || undefined,
          usageType: cust.usageType || undefined,
          lensCoating: cust.lensCoating || undefined,
          tintColor: cust.tintColor || undefined,
          tintStrength: cust.tintStrength || undefined,
          priceOnRequest,
          priceAdded
        };
      }

      if (priceOnRequest) {
        hasPriceOnRequest = true;
      }

      const itemPrice = product.price + (priceAdded || 0);
      subtotal += itemPrice * qty;

      formattedItems.push({
        product: product._id,
        name: product.name,
        brand: product.brand,
        image: (product.images && product.images[0]) || '',
        price: itemPrice,
        quantity: qty,
        color: raw.color || 'Default',
        customization
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

    const isPendingQuote = hasPriceOnRequest;
    const isPaymentVerificationNeeded = paymentMethod !== 'cod' && paymentProofData;
    const initialStatus = isPendingQuote ? 'pending-quote' : isPaymentVerificationNeeded ? 'payment-verification' : 'pending';

    const defaultTimeline = [
      {
        status: initialStatus,
        label: isPendingQuote ? 'Awaiting Price Quote' : isPaymentVerificationNeeded ? 'Payment Verification Pending' : 'Order Placed',
        date: new Date(),
        description: isPendingQuote
          ? 'Your order has been received. Lens price is pending admin confirmation.'
          : isPaymentVerificationNeeded
          ? 'Payment screenshot submitted. Awaiting admin verification.'
          : 'Your order has been received and confirmed.',
        completed: true
      },
      { status: 'processing', label: 'Lab Processing', date: new Date(), description: 'Lenses are being cut and fitted into frames.', completed: false },
      { status: 'processing', label: 'Quality Control', date: new Date(), description: 'Frame inspection and prescription alignment check.', completed: false },
      { status: 'shipped', label: 'Out for Delivery', date: new Date(), description: 'Dispatched with courier tracking.', completed: false },
      { status: 'delivered', label: 'Delivered', date: new Date(), description: 'Delivered to customer.', completed: false }
    ];

    const paymentType = hasLensCustomization ? 'advance' : 'full';

    const order = new Order({
      orderNumber: await buildOrderNumber(),
      user: authenticatedUserId,
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
      paymentProof: paymentProofData || undefined,
      paymentType,
      status: initialStatus,
      timeline: defaultTimeline,
      couponCode: appliedCoupon ? appliedCoupon.code : undefined,
      estimatedDelivery: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000)
    });

    await order.save();

    // Trigger order confirmation email notification.
    if (!isPendingQuote) {
      try {
        await sendOrderConfirmationEmail(order);
      } catch (err) {
        console.error("Order confirmation email failed:", err);
      }
    } else {
      try {
        await sendWhatsAppPriceOnRequestNotification(order);
      } catch (err) {
        console.error("WhatsApp notification dispatch failed:", err);
      }
    }

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

// POST /api/orders/:id/resubmit-payment-proof
exports.resubmitPaymentProof = async (req, res, next) => {
  try {
    const { id } = req.params;
    let order = await Order.findById(id);
    if (!order) {
      order = await Order.findOne({ orderNumber: id.toUpperCase() });
    }

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    let screenshotBuffer = null;
    if (req.file && req.file.buffer) {
      screenshotBuffer = req.file.buffer;
    } else if (req.body.paymentScreenshot && typeof req.body.paymentScreenshot === 'string' && req.body.paymentScreenshot.startsWith('data:image')) {
      const base64Data = req.body.paymentScreenshot.replace(/^data:image\/\w+;base64,/, '');
      screenshotBuffer = Buffer.from(base64Data, 'base64');
    }

    if (!screenshotBuffer) {
      return res.status(400).json({ message: 'Please provide a valid payment screenshot file or image' });
    }

    if (screenshotBuffer.length > 10 * 1024 * 1024) {
      return res.status(400).json({ message: 'Payment screenshot exceeds maximum size limit of 10MB' });
    }

    const crypto = require('crypto');
    const fileHash = crypto.createHash('sha256').update(screenshotBuffer).digest('hex');

    const existingDuplicate = await Order.findOne({ 'paymentProof.fileHash': fileHash, _id: { $ne: order._id } });
    if (existingDuplicate) {
      return res.status(400).json({ message: 'Duplicate payment screenshot detected. Please upload a unique, valid receipt.' });
    }

    let tempPath = null;
    let compressedPath = null;
    let screenshotUrl = null;
    try {
      const { compressMedia } = require('../utils/mediaCompression');
      const { uploadMedia, getCloudinaryFolder } = require('../utils/cloudinary');
      
      tempPath = await writeTempFile(screenshotBuffer, 'resubmitted_payment.jpg');
      compressedPath = await compressMedia(tempPath, 'image');
      
      const folder = getCloudinaryFolder('payments');
      const cloudinaryResult = await uploadMedia(compressedPath, folder);
      screenshotUrl = cloudinaryResult.secure_url || cloudinaryResult.url;
    } catch (err) {
      console.error("Resubmit payment upload error:", err);
      return res.status(500).json({ message: 'Failed to compress and upload payment proof' });
    } finally {
      if (tempPath && fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
      if (compressedPath && fs.existsSync(compressedPath)) fs.unlinkSync(compressedPath);
    }

    order.paymentProof = {
      transactionId: req.body.transactionId || order.paymentProof?.transactionId || undefined,
      screenshotUrl,
      fileHash,
      notes: req.body.paymentNotes || order.paymentProof?.notes || undefined,
      status: 'pending',
      rejectionReason: undefined
    };
    order.status = 'payment-verification';

    order.timeline.push({
      status: 'payment-verification',
      label: 'Payment Resubmitted',
      date: new Date(),
      description: 'Customer resubmitted payment proof for verification.',
      completed: true
    });

    await order.save();
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
