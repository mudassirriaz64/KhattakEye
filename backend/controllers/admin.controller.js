const fs = require('fs');
const os = require('os');
const path = require('path');
const Product = require('../models/Product');
const Glasses = require('../models/Glasses');
const Lenses = require('../models/Lenses');
const Blog = require('../models/Blog');
const Order = require('../models/Order');
const Category = require('../models/Category');
const Brand = require('../models/Brand');
const { compressMedia } = require('../utils/mediaCompression');
const { cloudinary, uploadMedia, resolveImageUrl } = require('../utils/cloudinary');
const { ORDER_STATUS_LIST } = require('../utils/constants');

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

const createProduct = async (req, res, next) => {
  try {
    const {
      kind = 'glasses',
      name,
      brand,
      category,
      subcategory,
      shortDescription,
      description,
      price,
      oldPrice,
      cost,
      sku,
      stock,
      status,
      featured,
      weight,
      frameShape,
      frameMaterial,
      lensType,
      lensColor,
      frameColor,
      frameWidth,
      lensWidth,
      bridgeWidth,
      templeLength,
      wearDuration,
      disposalType,
      packSize,
      baseCurve,
      diameter,
      waterContent,
      powerMin,
      powerMax,
      isToric,
      isMultifocal,
      colorTint,
      variants
    } = req.body;

    // Require getVideoDuration helper
    const { getVideoDuration } = require('../utils/mediaCompression');

    // Process images and videos (general images, videos, and per-variant images)
    const publicIds = [];
    const videoPublicIds = [];
    const variantImageMap = {}; // vIdx -> array of uploaded image publicIds

    console.log("ADMIN CREATE/UPDATE PRODUCT — ACTUAL HANDLER RUNNING");
    if (req.files && req.files.length > 0) {
      console.log("1. RAW FIELDNAMES:", req.files.map(f => f.fieldname));
      for (const file of req.files) {
        let tempPath = null;
        let compressedPath = null;
        const isVideo = file.mimetype.startsWith('video/');

        try {
          tempPath = await writeTempFile(file.buffer, file.originalname);
          
          if (isVideo) {
            // Server-side video duration check via ffprobe
            const duration = await getVideoDuration(tempPath);
            if (duration > 60) {
              throw new Error(`Video duration (${Math.round(duration)}s) exceeds maximum allowed 60 seconds limit.`);
            }
          }

          compressedPath = await compressMedia(tempPath, isVideo ? 'video' : 'image');
          const folderName = isVideo ? 'khattak-eye/products/videos' : 'products';
          const cloudinaryResult = await uploadMedia(compressedPath, folderName, isVideo ? { resource_type: 'video' } : {});
          
          if (file.fieldname && file.fieldname.startsWith('variant_images_') && !file.fieldname.startsWith('variant_images_count_')) {
            const vIdx = file.fieldname.replace('variant_images_', '');
            if (!variantImageMap[vIdx]) variantImageMap[vIdx] = [];
            variantImageMap[vIdx].push(cloudinaryResult.public_id);
          } else if (isVideo || (file.fieldname && file.fieldname.startsWith('video'))) {
            videoPublicIds.push(cloudinaryResult.public_id);
          } else if (file.fieldname === 'images' || file.fieldname === 'image') {
            publicIds.push(cloudinaryResult.public_id);
          }
        } catch (err) {
          console.error("Media processing error:", err);
          return res.status(400).json({ success: false, message: err.message || "Failed to process media upload" });
        } finally {
          if (tempPath && fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
          if (compressedPath && fs.existsSync(compressedPath)) fs.unlinkSync(compressedPath);
        }
      }
    }
    console.log("2. variantImageMap AFTER LOOP:", JSON.stringify(variantImageMap));

    let parsedVariants = [];
    if (variants) {
      try {
        parsedVariants = typeof variants === 'string' ? JSON.parse(variants) : variants;
      } catch (err) {
        console.error("Failed to parse variants JSON:", err);
      }
    }

    // Merge uploaded variant images into parsedVariants
    if (Array.isArray(parsedVariants)) {
      parsedVariants = parsedVariants.map((v, i) => {
        const newImgs = variantImageMap[i] || [];
        const existingImgs = Array.isArray(v.images) ? v.images : [];
        const combined = [...existingImgs, ...newImgs];
        return {
          ...v,
          images: combined,
          image: combined[0] || v.image || ''
        };
      });
    }
    console.log("4. parsedVariants AFTER MERGE:", JSON.stringify(parsedVariants));

    const baseProductData = {
      name,
      slug: (name || 'product').toLowerCase().replace(/[\s_]+/g, '-').replace(/[^\w-]+/g, ''),
      brand: brand || 'Louis Vuitton',
      category: category || (kind === 'lenses' ? 'contact-lenses' : 'sunglasses'),
      subcategory: subcategory || '',
      shortDescription: shortDescription || '',
      description: description || '',
      price: Number(price) || 0,
      oldPrice: oldPrice ? Number(oldPrice) : null,
      cost: cost ? Number(cost) : null,
      sku: sku || `SKU-${Date.now()}`,
      stock: Number(stock) || 10,
      status: status || 'active',
      featured: featured === 'true' || featured === true,
      isNewArrival: req.body.isNewArrival === 'true' || req.body.isNewArrival === true,
      isBestSeller: req.body.isBestSeller === 'true' || req.body.isBestSeller === true,
      isPolarized: req.body.isPolarized === 'true' || req.body.isPolarized === true,
      isPremium: req.body.isPremium === 'true' || req.body.isPremium === true,
      images: publicIds.length > 0 ? publicIds : (Array.isArray(req.body.images) ? req.body.images : []),
      videos: videoPublicIds.length > 0 ? videoPublicIds : (Array.isArray(req.body.videos) ? req.body.videos : []),
      availability: (Number(stock) || 10) > 0 ? 'in-stock' : 'out-of-stock',
    };

    let newProduct;

    if (kind === 'lenses') {
      const lensesData = {
        ...baseProductData,
        wearDuration: wearDuration || 'daily',
        disposalType: disposalType || 'Daily Disposable',
        packSize: packSize ? Number(packSize) : 30,
        baseCurve: baseCurve ? Number(baseCurve) : 8.6,
        diameter: diameter ? Number(diameter) : 14.2,
        waterContent: waterContent ? Number(waterContent) : 58,
        powerRange: {
          min: powerMin ? Number(powerMin) : -10.0,
          max: powerMax ? Number(powerMax) : +6.0
        },
        isToric: isToric === 'true' || isToric === true,
        isMultifocal: isMultifocal === 'true' || isMultifocal === true,
        colorTint: colorTint || ''
      };
      newProduct = await Lenses.create(lensesData);
    } else {
      const glassesData = {
        ...baseProductData,
        frameShape: frameShape || 'Square',
        frameMaterial: frameMaterial || 'Acetate',
        lensType: lensType || 'UV400 Protected',
        lensColor: lensColor || 'Standard Tint',
        frameColor: frameColor || 'Black',
        frameSize: frameWidth ? `${lensWidth || 54}-${bridgeWidth || 18}-${templeLength || 145}` : '54-18-145',
        weight: weight ? `${weight}g` : '32g',
        uvProtection: req.body.uvProtection !== undefined ? (req.body.uvProtection === 'true' || req.body.uvProtection === true) : true,
        warranty: req.body.warranty || '1 Year Warranty',
        variants: parsedVariants
      };

      if (req.body.gender) {
        try {
          glassesData.gender = typeof req.body.gender === 'string' ? JSON.parse(req.body.gender) : req.body.gender;
        } catch (e) {
          glassesData.gender = typeof req.body.gender === 'string' ? req.body.gender.split(',') : req.body.gender;
        }
      }
      console.log("5. FINAL VARIANTS BEING SAVED:", JSON.stringify(glassesData.variants));
      newProduct = await Glasses.create(glassesData);
    }

    res.status(201).json({
      success: true,
      message: `${kind === 'lenses' ? 'Lenses' : 'Glasses'} product created successfully`,
      data: newProduct
    });
  } catch (error) {
    next(error);
  }
};

const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const getProducts = async (req, res, next) => {
  try {
    const { page = 1, limit = 50, kind, category, subcategory, brand, stock, featured, search, trashed } = req.query;
    const filter = {};
    if (trashed === 'true') filter.isDeleted = true;
    else filter.isDeleted = { $ne: true };
    if (kind) filter.kind = kind;
    if (category) filter.category = category;
    if (subcategory) filter.subcategory = subcategory;
    if (brand) filter.brand = new RegExp(`^${escapeRegex(brand)}$`, 'i');
    if (stock) filter.availability = stock;
    if (featured === 'true') filter.featured = true;
    else if (featured === 'false') filter.featured = false;
    if (search) filter.$or = [
      { name: new RegExp(escapeRegex(search), 'i') },
      { brand: new RegExp(escapeRegex(search), 'i') },
      { sku: new RegExp(escapeRegex(search), 'i') }
    ];

    const skip = (Number(page) - 1) * Number(limit);

    const [products, total] = await Promise.all([
      Product.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      Product.countDocuments(filter)
    ]);

    // Format products
    const formattedProducts = products.map(product => {
      const p = product.toObject();
      if (p.images && p.images.length > 0) {
        p.images = p.images.map(img => resolveImageUrl ? resolveImageUrl(img) : `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload/${img}`);
      }
      return p;
    });

    res.status(200).json({
      items: formattedProducts,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / Number(limit))
    });
  } catch (error) {
    next(error);
  }
};

const getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id).where('isDeleted').ne(true);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    const p = product.toObject();
    if (p.images && p.images.length > 0) {
      p.images = p.images.map(img => resolveImageUrl ? resolveImageUrl(img) : img);
    }
    res.status(200).json(p);
  } catch (error) {
    next(error);
  }
};

const generateProduct3D = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id).where('isDeleted').ne(true);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (!product.images || product.images.length === 0) {
      return res.status(400).json({ message: 'Product has no images to convert to 3D model' });
    }

    const { generate3DModel } = require('../utils/tripo3d');
    const mainImageUrl = resolveImageUrl(product.images[0]) || product.images[0];

    const glbUrl = await generate3DModel(mainImageUrl);
    product.model3d = glbUrl;
    await product.save();

    res.status(200).json({
      message: '3D Model generated successfully',
      model3d: glbUrl
    });
  } catch (error) {
    next(error);
  }
};

const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const existingProduct = await Product.findById(id).where('isDeleted').ne(true);
    if (!existingProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const {
      name,
      brand,
      category,
      subcategory,
      shortDescription,
      description,
      price,
      oldPrice,
      cost,
      sku,
      stock,
      status,
      featured,
      weight,
      frameShape,
      frameMaterial,
      lensType,
      lensColor,
      frameColor,
      frameWidth,
      lensWidth,
      bridgeWidth,
      templeLength,
      variants
    } = req.body;

    const publicIds = [];
    const videoPublicIds = [];
    const variantImageMap = {};

    console.log("ADMIN UPDATE PRODUCT — ACTUAL HANDLER RUNNING");
    if (req.files && req.files.length > 0) {
      console.log("1. RAW FIELDNAMES (UPDATE):", req.files.map(f => f.fieldname));
      for (const file of req.files) {
        let tempPath = null;
        let compressedPath = null;
        const isVideo = file.mimetype.startsWith('video/');

        try {
          tempPath = await writeTempFile(file.buffer, file.originalname);

          if (isVideo) {
            const { getVideoDuration } = require('../utils/mediaCompression');
            const duration = await getVideoDuration(tempPath);
            if (duration > 60) {
              throw new Error(`Video duration (${Math.round(duration)}s) exceeds maximum allowed 60 seconds limit.`);
            }
          }

          compressedPath = await compressMedia(tempPath, isVideo ? 'video' : 'image');
          const folderName = isVideo ? 'khattak-eye/products/videos' : 'products';
          const cloudinaryResult = await uploadMedia(compressedPath, folderName, isVideo ? { resource_type: 'video' } : {});
          
          if (file.fieldname && file.fieldname.startsWith('variant_images_') && !file.fieldname.startsWith('variant_images_count_')) {
            const vIdx = file.fieldname.replace('variant_images_', '');
            if (!variantImageMap[vIdx]) variantImageMap[vIdx] = [];
            variantImageMap[vIdx].push(cloudinaryResult.public_id);
          } else if (isVideo || (file.fieldname && file.fieldname.startsWith('video'))) {
            videoPublicIds.push(cloudinaryResult.public_id);
          } else if (file.fieldname === 'images' || file.fieldname === 'image') {
            publicIds.push(cloudinaryResult.public_id);
          }
        } catch (err) {
          console.error("Media processing error:", err);
          return res.status(400).json({ success: false, message: err.message || "Failed to process media upload" });
        } finally {
          if (tempPath && fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
          if (compressedPath && fs.existsSync(compressedPath)) fs.unlinkSync(compressedPath);
        }
      }
    }
    console.log("2. variantImageMap AFTER LOOP (UPDATE):", JSON.stringify(variantImageMap));

    let parsedVariants = null;
    if (variants !== undefined) {
      try {
        parsedVariants = typeof variants === 'string' ? JSON.parse(variants) : variants;
      } catch (err) {
        console.error("Failed to parse variants JSON:", err);
      }
    }

    if (Array.isArray(parsedVariants)) {
      parsedVariants = parsedVariants.map((v, i) => {
        const newImgs = variantImageMap[i] || [];
        const existingImgs = (Array.isArray(v.images) ? v.images : []).filter(img => typeof img === 'string' && !img.includes('blob:'));
        const combined = [...existingImgs, ...newImgs];
        return {
          ...v,
          images: combined,
          image: combined[0] || (v.image && !v.image.includes('blob:') ? v.image : '')
        };
      });
    }
    console.log("4. parsedVariants AFTER MERGE (UPDATE):", JSON.stringify(parsedVariants));

    const updateFields = {
      ...(name && { name, slug: name.toLowerCase().replace(/[\s_]+/g, '-').replace(/[^\w-]+/g, '') }),
      ...(brand && { brand }),
      ...(category && { category }),
      ...(subcategory !== undefined && { subcategory }),
      ...(shortDescription !== undefined && { shortDescription }),
      ...(description !== undefined && { description }),
      ...(price !== undefined && { price: Number(price) }),
      ...(oldPrice !== undefined && { oldPrice: oldPrice ? Number(oldPrice) : null }),
      ...(cost !== undefined && { cost: cost ? Number(cost) : null }),
      ...(sku && { sku }),
      ...(stock !== undefined && { stock: Number(stock), availability: Number(stock) > 0 ? 'in-stock' : 'out-of-stock' }),
      ...(status && { status }),
      ...(featured !== undefined && { featured: featured === 'true' || featured === true }),
      ...(req.body.isNewArrival !== undefined && { isNewArrival: req.body.isNewArrival === 'true' || req.body.isNewArrival === true }),
      ...(req.body.isBestSeller !== undefined && { isBestSeller: req.body.isBestSeller === 'true' || req.body.isBestSeller === true }),
      ...(req.body.isPolarized !== undefined && { isPolarized: req.body.isPolarized === 'true' || req.body.isPolarized === true }),
      ...(req.body.isPremium !== undefined && { isPremium: req.body.isPremium === 'true' || req.body.isPremium === true }),
    };

    if (publicIds.length > 0) {
      updateFields.images = [...(existingProduct.images || []), ...publicIds];
    }

    if (videoPublicIds.length > 0) {
      updateFields.videos = [...(existingProduct.videos || []), ...videoPublicIds];
    }

    if (parsedVariants) {
      updateFields.variants = parsedVariants;
    }

    if (existingProduct.kind === 'glasses') {
      if (frameShape) updateFields.frameShape = frameShape;
      if (frameMaterial) updateFields.frameMaterial = frameMaterial;
      if (lensType) updateFields.lensType = lensType;
      if (lensColor) updateFields.lensColor = lensColor;
      if (frameColor) updateFields.frameColor = frameColor;
      if (weight) updateFields.weight = `${weight}g`;
      if (req.body.gender) {
        try {
          updateFields.gender = typeof req.body.gender === 'string' ? JSON.parse(req.body.gender) : req.body.gender;
        } catch (e) {
          updateFields.gender = typeof req.body.gender === 'string' ? req.body.gender.split(',') : req.body.gender;
        }
      }
    }

    console.log("5. FINAL VARIANTS BEING SAVED (UPDATE):", JSON.stringify(updateFields.variants));
    const updated = await Product.findByIdAndUpdate(id, { $set: updateFields }, { returnDocument: 'after', runValidators: true });
    res.status(200).json(updated);
  } catch (error) {
    next(error);
  }
};

const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await Product.findOneAndUpdate(
      { _id: id, isDeleted: { $ne: true } },
      { $set: { isDeleted: true, deletedAt: new Date() } },
      { returnDocument: 'after' }
    );
    if (!deleted) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json({ message: 'Product moved to trash', product: deleted });
  } catch (error) {
    next(error);
  }
};

// Collect all Cloudinary public_ids referenced by a product document.
const collectCloudinaryPublicIds = (product) => {
  const publicIds = new Set();
  const add = (value) => {
    if (typeof value === 'string' && value && !value.startsWith('http')) {
      publicIds.add(value);
    }
  };
  (product.images || []).forEach(add);
  add(product.hoverImage);
  (product.videos || []).forEach(add);
  (product.variants || []).forEach((v) => {
    add(v.image);
    add(v.hoverImage);
    (v.images || []).forEach(add);
  });
  return [...publicIds];
};

const restoreProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const restored = await Product.findOneAndUpdate(
      { _id: id, isDeleted: true },
      { $set: { isDeleted: false, deletedAt: null } },
      { returnDocument: 'after' }
    );
    if (!restored) {
      return res.status(404).json({ message: 'Product not found in trash' });
    }
    res.status(200).json({ message: 'Product restored successfully', product: restored });
  } catch (error) {
    next(error);
  }
};

const permanentDeleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await Product.findOne({ _id: id });
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Destroy every Cloudinary asset first (image + video resource types).
    const publicIds = collectCloudinaryPublicIds(product);
    const videoIds = new Set(product.videos || []);
    const failures = [];

    for (const publicId of publicIds) {
      try {
        const result = await cloudinary.uploader.destroy(publicId, {
          resource_type: videoIds.has(publicId) ? 'video' : 'image'
        });
        if (result && result.result === 'error') {
          failures.push(publicId);
        }
      } catch (error) {
        console.error(`Cloudinary destroy failed for ${publicId}:`, error.message);
        failures.push(publicId);
      }
    }

    // Proceed with Mongo removal even if some Cloudinary assets failed to delete,
    // so the product is never stranded in Trash.
    await Product.findByIdAndDelete(id);

    res.status(200).json({
      message: 'Product permanently deleted',
      product: product.name,
      assetsDestroyed: publicIds.length - failures.length,
      failedAssets: failures
    });
  } catch (error) {
    next(error);
  }
};

const getAdminOrders = async (req, res, next) => {
  try {
    const { page = 1, limit = 50, status } = req.query;
    const filter = {};
    if (status) filter.status = status;

    const skip = (Number(page) - 1) * Number(limit);
    const [orders, total] = await Promise.all([
      Order.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      Order.countDocuments(filter)
    ]);

    res.status(200).json({
      items: orders,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / Number(limit))
    });
  } catch (error) {
    next(error);
  }
};

const updateOrderStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status || !ORDER_STATUS_LIST.includes(status)) {
      return res.status(400).json({ message: `Invalid order status. Allowed: ${ORDER_STATUS_LIST.join(', ')}` });
    }

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.status === 'closed') {
      return res.status(400).json({ message: 'Order is closed and its status is locked and cannot be modified.' });
    }

    if (status === 'closed' && order.status !== 'delivered') {
      return res.status(400).json({ message: 'Only delivered orders can be closed.' });
    }

    order.status = status;
    if (!order.timeline) {
      order.timeline = [];
    }

    const STATUS_METADATA = {
      'pending': { label: 'Order Placed', description: 'Order placed by customer.' },
      'pending-quote': { label: 'Awaiting Price Quote', description: 'Lens price pending admin confirmation.' },
      'payment-verification': { label: 'Payment Verification Pending', description: 'Payment screenshot submitted. Awaiting admin verification.' },
      'confirmed': { label: 'Confirmed', description: 'Order confirmed and payment verified.' },
      'processing': { label: 'Processing', description: 'Frames and lenses are being prepared by our artisans.' },
      'packed': { label: 'Packed', description: 'Order packed and ready for dispatch.' },
      'shipped': { label: 'Shipped', description: 'Handed over to courier with tracking.' },
      'out-for-delivery': { label: 'Out for Delivery', description: 'Dispatched with local courier for delivery.' },
      'delivered': { label: 'Delivered', description: 'Order delivered to customer.' },
      'cancelled': { label: 'Cancelled', description: 'Order has been cancelled.' },
      'closed': { label: 'Order Closed', description: 'Order has been fully closed and finalized by admin.' }
    };

    const existingIndex = order.timeline.findIndex((entry) => entry.status === status);
    if (existingIndex >= 0) {
      order.timeline[existingIndex].completed = true;
      order.timeline[existingIndex].date = new Date();
    } else {
      const meta = STATUS_METADATA[status] || { label: status, description: `Status updated to ${status}` };
      order.timeline.push({
        status,
        label: meta.label,
        description: meta.description,
        date: new Date(),
        completed: true
      });
    }

    await order.save();
    res.status(200).json(order);
  } catch (error) {
    next(error);
  }
};

const verifyPayment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { action, rejectionReason } = req.body; // action: 'approve' | 'reject'

    if (!['approve', 'reject'].includes(action)) {
      return res.status(400).json({ message: 'Action must be "approve" or "reject"' });
    }

    if (action === 'reject' && (!rejectionReason || !rejectionReason.trim())) {
      return res.status(400).json({ message: 'A reason is required when rejecting a payment proof' });
    }

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const adminId = req.user ? req.user._id : null;

    if (!order.paymentProof) {
      order.paymentProof = { status: 'pending' };
    }

    if (action === 'approve') {
      order.paymentProof.status = 'approved';
      order.paymentProof.rejectionReason = undefined;
      order.paymentProof.verifiedBy = adminId;
      order.paymentProof.verifiedAt = new Date();
      order.status = 'confirmed';
      
      order.timeline.push({
        status: 'confirmed',
        label: 'Payment Verified & Confirmed',
        date: new Date(),
        description: 'Payment receipt verified and approved by admin.',
        completed: true
      });
    } else {
      order.paymentProof.status = 'rejected';
      order.paymentProof.rejectionReason = rejectionReason.trim();
      order.paymentProof.verifiedBy = adminId;
      order.paymentProof.verifiedAt = new Date();
      order.status = 'pending'; // Reset status so customer can resubmit

      order.timeline.push({
        status: 'pending',
        label: 'Payment Rejected',
        date: new Date(),
        description: `Payment rejected by admin: "${rejectionReason.trim()}". Please resubmit a valid proof of payment.`,
        completed: true
      });
    }

    await order.save();
    res.status(200).json(order);
  } catch (error) {
    next(error);
  }
};

const getDashboardStats = async (req, res, next) => {
  try {
    const [productsCount, ordersCount, pendingOrdersCount, orders] = await Promise.all([
      Product.countDocuments({ isDeleted: { $ne: true } }),
      Order.countDocuments(),
      Order.countDocuments({ status: 'pending' }),
      Order.find({ status: { $ne: 'cancelled' } }, 'total')
    ]);

    const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
    const lowStockCount = await Product.countDocuments({ stock: { $lte: 5 }, isDeleted: { $ne: true } });

    res.status(200).json({
      totalRevenue,
      totalOrders: ordersCount,
      pendingOrders: pendingOrdersCount,
      totalProducts: productsCount,
      lowStockProducts: lowStockCount
    });
  } catch (error) {
    next(error);
  }
};

const createCategory = async (req, res, next) => {
  try {
    const { name, description, image, productKind, type } = req.body;
    if (!name) return res.status(400).json({ message: 'Category name is required' });
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    const category = new Category({
      name,
      slug,
      description,
      image: image || '',
      productKind: productKind || 'glasses',
      type: type || 'category'
    });
    await category.save();
    res.status(201).json(category);
  } catch (error) {
    next(error);
  }
};

const deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    await Category.findByIdAndDelete(id);
    res.status(200).json({ message: 'Category deleted' });
  } catch (error) {
    next(error);
  }
};

const updateCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description, image, productKind, type, subcategories } = req.body;
    const updateData = {};
    if (name) {
      updateData.name = name;
      updateData.slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    }
    if (description !== undefined) updateData.description = description;
    if (image !== undefined) updateData.image = image;
    if (productKind !== undefined) updateData.productKind = productKind;
    if (type !== undefined) updateData.type = type;
    if (subcategories !== undefined) updateData.subcategories = subcategories;

    const category = await Category.findByIdAndUpdate(id, updateData, { returnDocument: 'after', runValidators: true });
    if (!category) return res.status(404).json({ message: 'Category not found' });
    res.status(200).json(category);
  } catch (error) {
    next(error);
  }
};

const getAdminBrands = async (req, res, next) => {
  try {
    const brands = await Brand.find().sort({ name: 1 });
    res.status(200).json(brands);
  } catch (error) {
    next(error);
  }
};

const createBrand = async (req, res, next) => {
  try {
    const { name, logo, tagline, description, website, featured, status } = req.body;
    if (!name) return res.status(400).json({ message: 'Brand name is required' });
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    const brand = new Brand({
      name,
      slug,
      logo: logo || '',
      tagline: tagline || '',
      description: description || '',
      website: website || '',
      featured: featured !== undefined ? Boolean(featured) : false,
      status: status === 'inactive' ? 'inactive' : 'active'
    });
    await brand.save();
    res.status(201).json(brand);
  } catch (error) {
    next(error);
  }
};

const updateBrand = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, logo, tagline, description, website, featured, status } = req.body;
    const updateData = {};
    if (name) {
      updateData.name = name;
      updateData.slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    }
    if (logo !== undefined) updateData.logo = logo;
    if (tagline !== undefined) updateData.tagline = tagline;
    if (description !== undefined) updateData.description = description;
    if (website !== undefined) updateData.website = website;
    if (featured !== undefined) updateData.featured = Boolean(featured);
    if (status !== undefined) updateData.status = status === 'inactive' ? 'inactive' : 'active';

    const brand = await Brand.findByIdAndUpdate(id, updateData, { returnDocument: 'after' });
    if (!brand) return res.status(404).json({ message: 'Brand not found' });
    res.status(200).json(brand);
  } catch (error) {
    next(error);
  }
};

const deleteBrand = async (req, res, next) => {
  try {
    const { id } = req.params;
    await Brand.findByIdAndDelete(id);
    res.status(200).json({ message: 'Brand deleted' });
  } catch (error) {
    next(error);
  }
};
const setOrderItemPrice = async (req, res, next) => {
  try {
    const { id, itemIndex } = req.params;
    const { price } = req.body;

    const priceNum = Number(price);
    if (!Number.isFinite(priceNum) || priceNum <= 0) {
      return res.status(400).json({ message: 'Price must be a positive number' });
    }

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const idx = parseInt(itemIndex, 10);
    if (isNaN(idx) || idx < 0 || idx >= order.items.length) {
      return res.status(400).json({ message: 'Invalid item index' });
    }

    const targetItem = order.items[idx];
    if (!targetItem.customization) {
      return res.status(400).json({ message: 'Target item has no customization' });
    }

    targetItem.customization.priceAdded = priceNum;
    targetItem.customization.priceOnRequest = false;

    const Product = require('../models/Product');
    const productDoc = await Product.findById(targetItem.product);
    const basePrice = productDoc ? productDoc.price : targetItem.price;
    targetItem.price = basePrice + priceNum;

    let newSubtotal = 0;
    for (const item of order.items) {
      newSubtotal += item.price * item.quantity;
    }
    order.subtotal = newSubtotal;
    order.shipping = newSubtotal >= 3000 ? 0 : 350;
    order.total = Math.max(0, order.subtotal + order.shipping - (order.discount || 0));

    const stillPending = order.items.some(
      (item) => item.customization && (item.customization.priceOnRequest || item.customization.priceAdded === null)
    );

    if (!stillPending && order.status === 'pending-quote') {
      const isPaymentVerificationNeeded = order.paymentMethod !== 'cod' && order.paymentProof && order.paymentProof.screenshotUrl;
      order.status = isPaymentVerificationNeeded ? 'payment-verification' : 'pending';
      
      if (!order.timeline) order.timeline = [];
      order.timeline.push({
        status: order.status,
        label: order.status === 'payment-verification' ? 'Payment Verification Pending' : 'Order Placed',
        description: `Custom lens price confirmed (Rs. ${priceNum}). Order total updated to Rs. ${order.total}.`,
        date: new Date(),
        completed: true
      });
    }

    await order.save();
    res.status(200).json(order);
  } catch (error) {
    next(error);
  }
};

const getAdminBlogs = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, search, status } = req.query;
    const filter = {};
    if (search) filter.title = { $regex: search, $options: 'i' };
    if (status) filter.status = status;
    const total = await Blog.countDocuments(filter);
    const blogs = await Blog.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));
    res.status(200).json({ blogs, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (error) { next(error); }
};

const adminGetBlogById = async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: 'Blog not found' });
    res.status(200).json(blog);
  } catch (error) { next(error); }
};

const createBlog = async (req, res, next) => {
  try {
    const { title, excerpt, content, tags, author, status, featured } = req.body;
    if (!title || !content) return res.status(400).json({ message: 'Title and content are required' });
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    let imagePublicId = null;
    if (req.files && req.files.length > 0) {
      const file = req.files[0];
      const tempPath = await writeTempFile(file.buffer, file.originalname);
      const compressedPath = await compressMedia(tempPath, 'image');
      const result = await uploadMedia(compressedPath, 'khattak-eye/blogs');
      imagePublicId = result.public_id;
      if (tempPath && fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
      if (compressedPath && fs.existsSync(compressedPath)) fs.unlinkSync(compressedPath);
    }

    const parsedTags = tags ? (typeof tags === 'string' ? tags.split(',').map(t => t.trim()).filter(Boolean) : tags) : [];

    const blog = await Blog.create({
      title,
      slug,
      excerpt: excerpt || '',
      content,
      image: imagePublicId || '',
      tags: parsedTags,
      author: author || 'Khattak Eyewear',
      status: status || 'draft',
      featured: featured === 'true' || featured === true,
      publishedAt: status === 'published' ? new Date() : null
    });

    res.status(201).json({ success: true, message: 'Blog created successfully', data: blog });
  } catch (error) { next(error); }
};

const updateBlog = async (req, res, next) => {
  try {
    const { id } = req.params;
    const existing = await Blog.findById(id);
    if (!existing) return res.status(404).json({ message: 'Blog not found' });

    const { title, excerpt, content, tags, author, status, featured } = req.body;
    const updateData = {};
    if (title) { updateData.title = title; updateData.slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''); }
    if (excerpt !== undefined) updateData.excerpt = excerpt;
    if (content) updateData.content = content;
    if (author !== undefined) updateData.author = author;
    if (featured !== undefined) updateData.featured = featured === 'true' || featured === true;
    if (status) {
      updateData.status = status;
      if (status === 'published' && existing.status !== 'published') updateData.publishedAt = new Date();
    }
    if (tags !== undefined) {
      updateData.tags = typeof tags === 'string' ? tags.split(',').map(t => t.trim()).filter(Boolean) : tags;
    }

    if (req.files && req.files.length > 0) {
      const file = req.files[0];
      const tempPath = await writeTempFile(file.buffer, file.originalname);
      const compressedPath = await compressMedia(tempPath, 'image');
      const result = await uploadMedia(compressedPath, 'khattak-eye/blogs');
      updateData.image = result.public_id;
      if (tempPath && fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
      if (compressedPath && fs.existsSync(compressedPath)) fs.unlinkSync(compressedPath);
    }

    const blog = await Blog.findByIdAndUpdate(id, { $set: updateData }, { returnDocument: 'after', runValidators: true });
    res.status(200).json({ success: true, message: 'Blog updated successfully', data: blog });
  } catch (error) { next(error); }
};

const deleteBlog = async (req, res, next) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);
    if (!blog) return res.status(404).json({ message: 'Blog not found' });
    res.status(200).json({ success: true, message: 'Blog deleted successfully' });
  } catch (error) { next(error); }
};

module.exports = {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  restoreProduct,
  permanentDeleteProduct,
  getAdminOrders,
  updateOrderStatus,
  setOrderItemPrice,
  verifyPayment,
  getDashboardStats,
  createCategory,
  updateCategory,
  deleteCategory,
  getAdminBrands,
  createBrand,
  updateBrand,
  deleteBrand,
  generateProduct3D,
  getAdminBlogs,
  adminGetBlogById,
  createBlog,
  updateBlog,
  deleteBlog
};
