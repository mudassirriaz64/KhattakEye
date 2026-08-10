const fs = require('fs');
const os = require('os');
const path = require('path');
const Product = require('../models/Product');
const Glasses = require('../models/Glasses');
const Lenses = require('../models/Lenses');
const Order = require('../models/Order');
const Category = require('../models/Category');
const Brand = require('../models/Brand');
const { compressMedia } = require('../utils/mediaCompression');
const { uploadMedia, resolveImageUrl } = require('../utils/cloudinary');
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

    // Process images
    const publicIds = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        let tempPath = null;
        let compressedPath = null;
        try {
          tempPath = await writeTempFile(file.buffer, file.originalname);
          compressedPath = await compressMedia(tempPath, 'image');
          const cloudinaryResult = await uploadMedia(compressedPath, 'products');
          publicIds.push(cloudinaryResult.public_id);
        } catch (err) {
          console.error("Image processing error:", err);
        } finally {
          if (tempPath && fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
          if (compressedPath && fs.existsSync(compressedPath)) fs.unlinkSync(compressedPath);
        }
      }
    }

    let parsedVariants = [];
    if (variants) {
      try {
        parsedVariants = typeof variants === 'string' ? JSON.parse(variants) : variants;
      } catch (err) {
        console.error("Failed to parse variants JSON:", err);
      }
    }

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
      images: publicIds.length > 0 ? publicIds : (Array.isArray(req.body.images) ? req.body.images : []),
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
    const { page = 1, limit = 50, kind, category, subcategory, brand, stock, featured, search } = req.query;
    const filter = {};
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
    const product = await Product.findById(id);
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
    const product = await Product.findById(id);

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
    const updateData = { ...req.body };

    // Handle files if uploaded
    if (req.files && req.files.length > 0) {
      updateData.images = req.files.map(file => file.path || file.filename);
    }

    const updated = await Product.findByIdAndUpdate(id, updateData, { returnDocument: 'after', runValidators: true });
    if (!updated) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json(updated);
  } catch (error) {
    next(error);
  }
};

const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await Product.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json({ message: 'Product deleted successfully' });
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

    order.status = status;
    if (order.timeline && order.timeline.length > 0) {
      order.timeline = order.timeline.map((entry) => {
        if (entry.status === status) {
          return { ...entry, completed: true, date: new Date() };
        }
        return entry;
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
      Product.countDocuments(),
      Order.countDocuments(),
      Order.countDocuments({ status: 'pending' }),
      Order.find({ status: { $ne: 'cancelled' } }, 'total')
    ]);

    const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
    const lowStockCount = await Product.countDocuments({ stock: { $lte: 5 } });

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
    const { name, logo } = req.body;
    if (!name) return res.status(400).json({ message: 'Brand name is required' });
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    const brand = new Brand({ name, slug, logo: logo || '' });
    await brand.save();
    res.status(201).json(brand);
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

module.exports = {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getAdminOrders,
  updateOrderStatus,
  verifyPayment,
  getDashboardStats,
  createCategory,
  updateCategory,
  deleteCategory,
  getAdminBrands,
  createBrand,
  deleteBrand,
  generateProduct3D
};
