const Product = require('../models/Product');
const Category = require('../models/Category');
const Brand = require('../models/Brand');
const Blog = require('../models/Blog');
const { resolveImageUrl } = require('../utils/cloudinary');

const escapeRegex = (text) => text ? String(text).replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&') : '';

// Helper to format products with resolved image URLs
const formatProduct = (product) => {
  const p = product;
  
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
      if (v.images && v.images.length > 0) {
        v.images = v.images.map(img => resolveImageUrl(img) || img);
      }
      if (v.hoverImage) v.hoverImage = resolveImageUrl(v.hoverImage) || v.hoverImage;
      return v;
    });
  }
  return p;
};

exports.getCategories = async (req, res, next) => {
  try {
    const { type, productKind, featured } = req.query;
    const filter = {};
    if (type) filter.type = type;
    if (productKind) filter.productKind = productKind;
    if (featured !== undefined) filter.featured = featured === 'true';

    const categories = await Category.find(filter).sort({ order: 1 }).lean();

    // Fast single DB aggregation for product counts across categories & subcategories
    const [catCounts, subCounts] = await Promise.all([
      Product.aggregate([
        { $match: { isDeleted: { $ne: true }, status: 'active' } },
        { $group: { _id: '$category', count: { $sum: 1 } } }
      ]),
      Product.aggregate([
        { $match: { isDeleted: { $ne: true }, status: 'active' } },
        { $group: { _id: '$subcategory', count: { $sum: 1 } } }
      ])
    ]);

    const catCountMap = new Map(catCounts.map(c => [String(c._id || '').toLowerCase(), c.count]));
    const subCountMap = new Map(subCounts.map(s => [String(s._id || '').toLowerCase(), s.count]));

    const formattedCategories = categories.map((cat) => {
      if (cat.image) cat.image = resolveImageUrl(cat.image) || cat.image;
      cat.productCount = catCountMap.get(String(cat.slug || '').toLowerCase()) || catCountMap.get(String(cat.name || '').toLowerCase()) || 0;
      
      if (Array.isArray(cat.subcategories)) {
        cat.subcategories = cat.subcategories.map((sub) => {
          sub.productCount = subCountMap.get(String(sub.slug || '').toLowerCase()) || subCountMap.get(String(sub.name || '').toLowerCase()) || 0;
          return sub;
        });
      }
      return cat;
    });

    res.status(200).json(formattedCategories);
  } catch (error) {
    next(error);
  }
};

exports.getBrands = async (req, res, next) => {
  try {
    const { featured } = req.query;
    const filter = { status: { $ne: 'inactive' } };
    if (featured !== undefined) {
      filter.featured = featured === 'true';
    }

    let brands = await Brand.find(filter).sort({ name: 1 }).lean();
    if (!brands || brands.length === 0) {
      if (featured === undefined) {
        const defaultBrands = [
          { name: "Khattak Atelier", slug: "khattak-atelier", tagline: "Sculptural", featured: true, status: "active" },
          { name: "Khattak Signature", slug: "khattak-signature", tagline: "Distinctive", featured: true, status: "active" },
          { name: "Khattak Heritage", slug: "khattak-heritage", tagline: "Timeless", featured: true, status: "active" },
          { name: "Khattak Performance", slug: "khattak-performance", tagline: "Engineered", featured: true, status: "active" },
          { name: "Ray-Ban", slug: "ray-ban", tagline: "Iconic", featured: false, status: "active" },
          { name: "Oakley", slug: "oakley", tagline: "Performance", featured: false, status: "active" },
          { name: "Persol", slug: "persol", tagline: "Heritage", featured: false, status: "active" },
          { name: "Tom Ford", slug: "tom-ford", tagline: "Glamorous", featured: false, status: "active" }
        ];
        await Brand.insertMany(defaultBrands);
        brands = await Brand.find(filter).sort({ name: 1 }).lean();
      }
    }
    const formattedBrands = brands.map(b => {
      if (b.logo) b.logo = resolveImageUrl(b.logo) || b.logo;
      return b;
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
      subcategory,
      minPrice, 
      maxPrice, 
      brand, 
      frameShape, 
      frameMaterial,
      lensType,
      colour, 
      sort, 
      featured,
      isBestSeller,
      isNewArrival,
      gender,
      page = 1, 
      limit = 50 
    } = req.query;

    const filter = { status: { $ne: 'archived' }, isDeleted: { $ne: true } };

    if (kind) filter.kind = kind;
    if (featured !== undefined) filter.featured = featured === 'true';
    if (isBestSeller !== undefined) filter.isBestSeller = isBestSeller === 'true';
    if (isNewArrival !== undefined) filter.isNewArrival = isNewArrival === 'true';

    const buildRegexContains = (paramStr) => {
      const items = String(paramStr).split(',').map(s => s.trim()).filter(Boolean);
      if (items.length === 0) return null;
      if (items.length === 1) return new RegExp(escapeRegex(items[0]), 'i');
      return { $in: items.map(i => new RegExp(escapeRegex(i), 'i')) };
    };

    if (category) {
      const resFilter = buildRegexContains(category);
      if (resFilter) filter.category = resFilter;
    }
    if (subcategory) {
      const resFilter = buildRegexContains(subcategory);
      if (resFilter) filter.subcategory = resFilter;
    }
    if (brand) {
      const resFilter = buildRegexContains(brand);
      if (resFilter) filter.brand = resFilter;
    }
    if (gender) {
      const resFilter = buildRegexContains(gender);
      if (resFilter) filter.gender = resFilter;
    }
    if (frameShape) {
      const resFilter = buildRegexContains(frameShape);
      if (resFilter) filter.frameShape = resFilter;
    }
    if (frameMaterial) {
      const resFilter = buildRegexContains(frameMaterial);
      if (resFilter) filter.frameMaterial = resFilter;
    }
    if (lensType) {
      const resFilter = buildRegexContains(lensType);
      if (resFilter) filter.lensType = resFilter;
    }

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    
    if (colour) {
      const colRegex = buildRegexContains(colour);
      if (colRegex) {
        filter.$or = [
          { frameColor: colRegex },
          { 'variants.colorName': colRegex }
        ];
      }
    }

    if (q) {
      const qRegex = new RegExp(escapeRegex(q.trim()), 'i');
      filter.$or = [
        { name: qRegex },
        { brand: qRegex },
        { category: qRegex },
        { subcategory: qRegex },
        { description: qRegex }
      ];
    }

    let sortObj = { createdAt: -1 }; // default latest
    if (sort === 'price_asc') sortObj = { price: 1 };
    else if (sort === 'price_desc') sortObj = { price: -1 };
    else if (sort === 'popular') sortObj = { reviewCount: -1, rating: -1 };

    const skip = (Number(page) - 1) * Number(limit);

    const [products, total] = await Promise.all([
      Product.find(filter)
        .select('name brand slug price oldPrice images hoverImage badges category subcategory rating reviewCount stock availability discount kind featured isNewArrival isBestSeller gender frameShape frameMaterial lensType variants')
        .sort(sortObj)
        .skip(skip)
        .limit(Number(limit))
        .lean(),
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
    let product = await Product.findOne({ slug, isDeleted: { $ne: true } }).lean();
    if (!product && slug.match(/^[0-9a-fA-F]{24}$/)) {
      product = await Product.findById(slug).where('isDeleted').ne(true).lean();
    }
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json(formatProduct(product));
  } catch (error) {
    next(error);
  }
};

exports.getBlogs = async (req, res, next) => {
  try {
    const { page = 1, limit = 12, tag } = req.query;
    const filter = { status: 'published' };
    if (tag) filter.tags = tag;
    const total = await Blog.countDocuments(filter);
    const blogs = await Blog.find(filter)
      .sort({ publishedAt: -1, createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .lean();
    const formatted = blogs.map(b => {
      if (b.image) b.image = resolveImageUrl(b.image) || b.image;
      return b;
    });
    res.status(200).json({ blogs: formatted, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (error) { next(error); }
};

exports.getBlogBySlug = async (req, res, next) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug, status: 'published' }).lean();
    if (!blog) return res.status(404).json({ message: 'Blog not found' });
    await Blog.findByIdAndUpdate(blog._id, { $inc: { views: 1 } });
    if (blog.image) blog.image = resolveImageUrl(blog.image) || blog.image;
    res.status(200).json(blog);
  } catch (error) { next(error); }
};
