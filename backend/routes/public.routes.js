const express = require('express');
const router = express.Router();
const {
  getCategories,
  getBrands,
  getProducts,
  getProductBySlug
} = require('../controllers/public.controller');

const { getCMSPage, getBanners, getSettings, getSiteSettings } = require('../controllers/cms.controller');
const { getPublicTestimonials } = require('../controllers/testimonials.controller');
const { getLensOptions } = require('../controllers/lensOptions.controller');

// Public catalog routes (no auth required)
router.get('/categories', getCategories);
router.get('/brands', getBrands);
router.get('/products', getProducts);
router.get('/products/:slug', getProductBySlug);
router.get('/cms/:slug', getCMSPage);
router.get('/banners', getBanners);
router.get('/settings', getSettings);
router.get('/site-settings', getSiteSettings);
router.get('/testimonials', getPublicTestimonials);
router.get('/lens-options', getLensOptions);

module.exports = router;
