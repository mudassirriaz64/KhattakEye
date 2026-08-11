const Review = require('../models/Review');
const Product = require('../models/Product');
const Order = require('../models/Order');

// POST /api/reviews
const createReview = async (req, res, next) => {
  try {
    const { productId, rating, title, text, images } = req.body;

    if (!productId || !rating || !text) {
      return res.status(400).json({ message: 'Product ID, rating, and review text are required' });
    }

    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: 'You must be logged in to review products' });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Verify verified purchaser status: user must have a delivered order containing this product
    const verifiedOrder = await Order.findOne({
      $or: [
        { user: req.user._id },
        { customerEmail: req.user.email ? req.user.email.toLowerCase() : '' }
      ],
      status: 'delivered',
      'items.product': product._id
    });

    if (!verifiedOrder) {
      return res.status(403).json({
        message: 'Only verified buyers who have received a delivered order of this item can leave a review.'
      });
    }

    // Prevent duplicate reviews for the same product by the same user
    const existingReview = await Review.findOne({
      product: product._id,
      user: req.user._id
    });

    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this product.' });
    }

    const review = new Review({
      product: product._id,
      user: req.user._id,
      productName: product.name,
      productImage: (product.images && product.images[0]) || '',
      productBrand: product.brand || 'Khattak Atelier',
      rating: Number(rating),
      title: title || '',
      text,
      images: Array.isArray(images) ? images : [],
      status: 'published', // Auto-publish for verified purchasers
      verifiedPurchase: true
    });

    await review.save();

    // Recalculate average rating & review count for the product
    const allReviews = await Review.find({ product: product._id, status: 'published' });
    const totalRating = allReviews.reduce((sum, r) => sum + r.rating, 0);
    const avgRating = allReviews.length > 0 ? (totalRating / allReviews.length).toFixed(1) : 5.0;

    product.rating = Number(avgRating);
    product.reviewCount = allReviews.length;
    await product.save();

    res.status(201).json({
      success: true,
      message: 'Thank you! Your verified review has been published.',
      review
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/reviews/product/:productId
const getProductReviews = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const reviews = await Review.find({ product: productId, status: 'published' })
      .populate('user', 'fullName avatar')
      .sort({ createdAt: -1 });

    res.status(200).json({ items: reviews });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createReview,
  getProductReviews
};
