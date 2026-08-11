const Review = require('../models/Review');
const Product = require('../models/Product');

// Recalculate product rating & reviewCount
const updateProductStats = async (productId) => {
  try {
    const publishedReviews = await Review.find({ product: productId, status: 'published' });
    const reviewCount = publishedReviews.length;
    const rating = reviewCount > 0 
      ? Number((publishedReviews.reduce((sum, r) => sum + r.rating, 0) / reviewCount).toFixed(1))
      : 5.0;

    await Product.findByIdAndUpdate(productId, { rating, reviewCount });
  } catch (err) {
    console.error("Error updating product stats:", err);
  }
};

// GET /api/admin/reviews
const getAllReviewsAdmin = async (req, res, next) => {
  try {
    const reviews = await Review.find()
      .populate('product', 'name images brand price slug')
      .populate('user', 'fullName email avatar')
      .sort({ createdAt: -1 });

    res.status(200).json({ items: reviews });
  } catch (error) {
    next(error);
  }
};

const mongoose = require('mongoose');

// PUT /api/admin/reviews/:id/status
const updateReviewStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, adminReply } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: `Invalid Review ID format: '${id}'` });
    }

    const review = await Review.findById(id);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    if (status) review.status = status;
    if (adminReply !== undefined) review.adminReply = adminReply;

    await review.save();

    // Recompute product rating and reviewCount if status changed
    if (review.product) {
      await updateProductStats(review.product);
    }

    res.status(200).json({ message: 'Review updated successfully', review });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/admin/reviews/:id
const deleteReview = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: `Invalid Review ID format: '${id}'` });
    }
    const review = await Review.findByIdAndDelete(id);
    if (review && review.product) {
      await updateProductStats(review.product);
    }
    res.status(200).json({ message: 'Review deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllReviewsAdmin,
  updateReviewStatus,
  deleteReview
};
