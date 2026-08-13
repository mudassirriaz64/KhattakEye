const User = require('../models/User');
const Product = require('../models/Product');
const { resolveImageUrl } = require('../utils/cloudinary');

const formatProduct = (product) => {
  if (!product) return null;
  const p = product.toObject ? product.toObject() : product;
  if (p.images && p.images.length > 0) {
    p.images = p.images.map(img => resolveImageUrl(img) || img);
  }
  return p;
};

// GET /api/wishlist
const getWishlist = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate({
      path: 'wishlist',
      match: { isDeleted: { $ne: true } }
    });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const items = (user.wishlist || []).filter(Boolean).map(formatProduct);
    res.status(200).json({ items });
  } catch (error) {
    next(error);
  }
};

// POST /api/wishlist/:productId
const addToWishlist = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const product = await Product.findById(productId).where('isDeleted').ne(true);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $addToSet: { wishlist: productId } },
      { returnDocument: 'after' }
    ).populate({
      path: 'wishlist',
      match: { isDeleted: { $ne: true } }
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const items = (user.wishlist || []).filter(Boolean).map(formatProduct);
    res.status(200).json({ message: 'Product added to wishlist', items });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/wishlist/:productId
const removeFromWishlist = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $pull: { wishlist: productId } },
      { returnDocument: 'after' }
    ).populate({
      path: 'wishlist',
      match: { isDeleted: { $ne: true } }
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const items = (user.wishlist || []).filter(Boolean).map(formatProduct);
    res.status(200).json({ message: 'Product removed from wishlist', items });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getWishlist,
  addToWishlist,
  removeFromWishlist
};
