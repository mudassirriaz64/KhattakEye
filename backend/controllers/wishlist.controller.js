const User = require('../models/User');
const Product = require('../models/Product');
const { resolveImageUrl } = require('../utils/cloudinary');

const formatProduct = (product) => {
  const p = product.toObject ? product.toObject() : product;
  if (p.images && p.images.length > 0) {
    p.images = p.images.map(img => resolveImageUrl(img) || img);
  }
  return p;
};

// GET /api/wishlist
const getWishlist = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate('wishlist');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const items = (user.wishlist || []).map(formatProduct);
    res.status(200).json({ items });
  } catch (error) {
    next(error);
  }
};

// POST /api/wishlist/:productId
const addToWishlist = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const user = await User.findById(req.user._id);
    if (!user.wishlist.some(id => id.toString() === productId)) {
      user.wishlist.push(productId);
      await user.save();
    }

    await user.populate('wishlist');
    const items = (user.wishlist || []).map(formatProduct);
    res.status(200).json({ message: 'Product added to wishlist', items });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/wishlist/:productId
const removeFromWishlist = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const user = await User.findById(req.user._id);
    user.wishlist = user.wishlist.filter(id => id.toString() !== productId);
    await user.save();

    await user.populate('wishlist');
    const items = (user.wishlist || []).map(formatProduct);
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
