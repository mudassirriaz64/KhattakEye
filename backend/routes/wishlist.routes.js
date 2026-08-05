const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const wishlistController = require('../controllers/wishlist.controller');

router.use(protect);

router.get('/', wishlistController.getWishlist);
router.post('/:productId', wishlistController.addToWishlist);
router.delete('/:productId', wishlistController.removeFromWishlist);

module.exports = router;
