const express = require('express');
const router = express.Router();
const {
  getCategories,
  getBrands,
  getProducts,
  getProductBySlug
} = require('../controllers/public.controller');

// Public catalog routes (no auth required)
router.get('/categories', getCategories);
router.get('/brands', getBrands);
router.get('/products', getProducts);
router.get('/products/:slug', getProductBySlug);

module.exports = router;
