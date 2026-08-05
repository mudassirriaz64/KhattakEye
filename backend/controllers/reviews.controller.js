const Review = require('../models/Review');
const Product = require('../models/Product');

// POST /api/reviews
const createReview = async (req, res, next) => {
  try {
    const { productId, rating, title, text, images } = req.body;

    if (!productId || !rating || !text) {
      return res.status(400).json({ message: 'Product ID, rating, and review text are required' });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const review = new Review({
      product: product._id,
      user: req.user ? req.user._id : undefined,
      productName: product.name,
      productImage: (product.images && product.images[0]) || '',
      productBrand: product.brand || 'Khattak Atelier',
      rating: Number(rating),
      title: title || '',
      text,
      images: Array.isArray(images) ? images : [],
      status: 'pending'
    });

    await review.save();

    res.status(201).json({
      success: true,
      message: 'Thank you! Your review has been submitted and is pending approval.',
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
