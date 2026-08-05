const fs = require('fs');
const os = require('os');
const path = require('path');
const Product = require('../models/Product');
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
      lensMaterial,
      lensType,
      lensColor,
      frameColor,
      frameWidth,
      lensWidth,
      bridgeWidth,
      templeLength,
      metaTitle,
      metaDescription,
      metaKeywords,
      variants // will come in as JSON string
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
          // Clean up temp files
          if (tempPath && fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
          if (compressedPath && fs.existsSync(compressedPath)) fs.unlinkSync(compressedPath);
        }
      }
    }

    // Parse variants if they exist
    let parsedVariants = [];
    if (variants) {
      try {
        parsedVariants = JSON.parse(variants);
      } catch (err) {
        console.error("Failed to parse variants JSON:", err);
      }
    }

    // Map frontend fields to backend Mongoose Product schema
    const productData = {
      name,
      slug: (name || 'product').toLowerCase().replace(/[\s_]+/g, '-').replace(/[^\w-]+/g, ''),
      brand: brand || 'Louis Vuitton',
      category: category || 'sunglasses',
      subcategory: subcategory || 'fashion-luxury',
      shortDescription: shortDescription || '',
      description: description || '',
      price: Number(price) || 0,
      oldPrice: oldPrice ? Number(oldPrice) : null,
      cost: cost ? Number(cost) : null,
      sku: sku || `SKU-${Date.now()}`,
      stock: Number(stock) || 10,
      status: status || 'draft',
      featured: featured === 'true' || featured === true,
      isNewArrival: req.body.isNewArrival === 'true' || req.body.isNewArrival === true,
      isBestSeller: req.body.isBestSeller === 'true' || req.body.isBestSeller === true,
      
      // Images from Cloudinary
      images: publicIds,

      // Top-level schema properties required by Product.js
      frameShape: frameShape || 'Square',
      frameMaterial: frameMaterial || 'Acetate',
      lensType: lensType || 'UV400 Protected',
      lensColor: lensColor || 'Standard Tint',
      frameColor: frameColor || 'Black',
      frameSize: frameWidth ? `${lensWidth || 54}-${bridgeWidth || 18}-${templeLength || 145}` : '54-18-145',
      weight: weight ? `${weight}g` : '32g',
      uvProtection: true,
      warranty: '1 Year Warranty',
      availability: (Number(stock) || 10) > 0 ? 'in-stock' : 'out-of-stock',

      variants: parsedVariants,

      seo: {
        metaTitle: metaTitle || name,
        metaDescription: metaDescription || shortDescription,
        metaKeywords: metaKeywords ? metaKeywords.split(',').map(k => k.trim()) : [],
      }
    };

    if (req.body.gender) {
      try {
        productData.gender = JSON.parse(req.body.gender);
      } catch (e) {
        productData.gender = req.body.gender.split(',');
      }
    }

    const newProduct = await Product.create(productData);

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: newProduct
    });
  } catch (error) {
    next(error);
  }
};

const getProducts = async (req, res, next) => {
  try {
    const { page = 1, limit = 50 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const [products, total] = await Promise.all([
      Product.find().sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      Product.countDocuments()
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

    const updated = await Product.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
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
    const { name, description, image } = req.body;
    if (!name) return res.status(400).json({ message: 'Category name is required' });
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    const category = new Category({ name, slug, description, image: image || '' });
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
  getDashboardStats,
  createCategory,
  deleteCategory,
  getAdminBrands,
  createBrand,
  deleteBrand,
  generateProduct3D
};
