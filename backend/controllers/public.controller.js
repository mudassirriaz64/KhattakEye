const Product = require('../models/Product');
const Category = require('../models/Category');
const Brand = require('../models/Brand');
const { resolveImageUrl } = require('../utils/cloudinary');

// Helper to format products with resolved image URLs
const formatProduct = (product) => {
  const p = product.toObject ? product.toObject() : product;
  
  if (p.images && p.images.length > 0) {
    p.images = p.images.map(img => resolveImageUrl(img) || img);
  }
  if (p.hoverImage) {
    p.hoverImage = resolveImageUrl(p.hoverImage) || p.hoverImage;
  }
  if (p.videos && p.videos.length > 0) {
    p.videos = p.videos.map(vid => resolveImageUrl(vid, { resource_type: 'video' }) || vid);
  }
  if (p.variants && p.variants.length > 0) {
    p.variants = p.variants.map(v => {
      if (v.image) v.image = resolveImageUrl(v.image) || v.image;
      if (v.hoverImage) v.hoverImage = resolveImageUrl(v.hoverImage) || v.hoverImage;
      return v;
    });
  }
  return p;
};

exports.getCategories = async (req, res, next) => {
  try {
    const { type, productKind } = req.query;
    const filter = {};
    if (type) filter.type = type;
    if (productKind) filter.productKind = productKind;

    const categories = await Category.find(filter).sort({ order: 1 });
    
    // Format image URLs
    const formattedCategories = categories.map(c => {
      const cat = c.toObject();
      if (cat.image) cat.image = resolveImageUrl(cat.image) || cat.image;
      return cat;
    });

    res.status(200).json(formattedCategories);
  } catch (error) {
    next(error);
  }
};

exports.getBrands = async (req, res, next) => {
  try {
    const brands = await Brand.find().sort({ name: 1 });
    const formattedBrands = brands.map(b => {
      const brand = b.toObject();
      if (brand.logo) brand.logo = resolveImageUrl(brand.logo) || brand.logo;
      return brand;
    });
    res.status(200).json(formattedBrands);
  } catch (error) {
    next(error);
  }
};

exports.getProducts = async (req, res, next) => {
  try {
    const { 
      q,
      kind,
      category, 
      minPrice, 
      maxPrice, 
      brand, 
      frameShape, 
      colour, 
      sort, 
      page = 1, 
      limit = 50 
    } = req.query;

    const filter = {};

    if (kind) filter.kind = kind;

    if (q) {
      const regex = new RegExp(q.trim(), 'i');
      filter.$or = [
        { name: regex },
        { brand: regex },
        { category: regex },
        { subcategory: regex },
        { description: regex }
      ];
    }
    
    if (category) filter.category = new RegExp(category, 'i');
    if (brand) filter.brand = new RegExp(brand, 'i');
    if (frameShape) filter.frameShape = new RegExp(frameShape, 'i');
    
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    
    if (colour) {
      filter.$or = [
        { frameColor: new RegExp(colour, 'i') },
        { 'variants.colorName': new RegExp(colour, 'i') }
      ];
    }

    let sortObj = { createdAt: -1 }; // default latest
    if (sort === 'price_asc') sortObj = { price: 1 };
    else if (sort === 'price_desc') sortObj = { price: -1 };
    else if (sort === 'popular') sortObj = { reviewCount: -1, rating: -1 };

    const skip = (Number(page) - 1) * Number(limit);

    const [products, total] = await Promise.all([
      Product.find(filter).sort(sortObj).skip(skip).limit(Number(limit)),
      Product.countDocuments(filter)
    ]);

    const formattedProducts = products.map(formatProduct);

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

exports.getProductBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;
    let product = await Product.findOne({ slug });
    if (!product && slug.match(/^[0-9a-fA-F]{24}$/)) {
      product = await Product.findById(slug);
    }
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json(formatProduct(product));
  } catch (error) {
    next(error);
  }
};
