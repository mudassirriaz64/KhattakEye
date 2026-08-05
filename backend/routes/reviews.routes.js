const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const reviewsController = require('../controllers/reviews.controller');

// Public route to get published reviews for a product
router.get('/product/:productId', reviewsController.getProductReviews);

// Protected route to submit a new review
router.post('/', protect, reviewsController.createReview);

module.exports = router;
