const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const requireRole = require('../middleware/requireRole');
const upload = require('../utils/upload');
const adminController = require('../controllers/admin.controller');

// GET /api/admin/products
router.get(
  '/products',
  auth.protectAdmin,
  requireRole(['admin', 'manager', 'super-admin']),
  adminController.getProducts
);

// GET /api/admin/products/:id
router.get(
  '/products/:id',
  auth.protectAdmin,
  requireRole(['admin', 'manager', 'super-admin']),
  adminController.getProductById
);

const { validateProductPayload } = require('../validators/product.validator');

// POST /api/admin/products
// Requires auth, admin/manager/super-admin role, and handles multipart form data for images
router.post(
  '/products',
  auth.protectAdmin,
  requireRole(['admin', 'manager', 'super-admin']),
  upload.array('images', 5),
  validateProductPayload,
  adminController.createProduct
);

// PUT /api/admin/products/:id
router.put(
  '/products/:id',
  auth.protectAdmin,
  requireRole(['admin', 'manager', 'super-admin']),
  upload.array('images', 5),
  adminController.updateProduct
);

// DELETE /api/admin/products/:id
router.delete(
  '/products/:id',
  auth.protectAdmin,
  requireRole(['admin', 'manager', 'super-admin']),
  adminController.deleteProduct
);

// POST /api/admin/products/:id/generate-3d
router.post(
  '/products/:id/generate-3d',
  auth.protectAdmin,
  requireRole(['admin', 'manager', 'super-admin']),
  adminController.generateProduct3D
);

// GET /api/admin/orders
router.get(
  '/orders',
  auth.protectAdmin,
  requireRole(['admin', 'manager', 'super-admin']),
  adminController.getAdminOrders
);

// PATCH /api/admin/orders/:id/status
router.patch(
  '/orders/:id/status',
  auth.protectAdmin,
  requireRole(['admin', 'manager', 'super-admin']),
  adminController.updateOrderStatus
);

// GET /api/admin/dashboard-stats
router.get(
  '/dashboard-stats',
  auth.protectAdmin,
  requireRole(['admin', 'manager', 'super-admin']),
  adminController.getDashboardStats
);

// Category admin endpoints
router.post(
  '/categories',
  auth.protectAdmin,
  requireRole(['admin', 'manager', 'super-admin']),
  adminController.createCategory
);

router.put(
  '/categories/:id',
  auth.protectAdmin,
  requireRole(['admin', 'manager', 'super-admin']),
  adminController.updateCategory
);

router.delete(
  '/categories/:id',
  auth.protectAdmin,
  requireRole(['admin', 'manager', 'super-admin']),
  adminController.deleteCategory
);

// Brand admin endpoints
router.get(
  '/brands',
  auth.protectAdmin,
  requireRole(['admin', 'manager', 'super-admin']),
  adminController.getAdminBrands
);

router.post(
  '/brands',
  auth.protectAdmin,
  requireRole(['admin', 'manager', 'super-admin']),
  adminController.createBrand
);

router.delete(
  '/brands/:id',
  auth.protectAdmin,
  requireRole(['admin', 'manager', 'super-admin']),
  adminController.deleteBrand
);

const {
  upsertCMSPage,
  getAllCMSPages,
  getAllBannersAdmin,
  createBanner,
  updateBanner,
  deleteBanner,
  updateSettings
} = require('../controllers/cms.controller');

// CMS Page admin routes
router.get('/cms', auth.protectAdmin, requireRole(['admin', 'manager', 'super-admin']), getAllCMSPages);
router.put('/cms/:slug', auth.protectAdmin, requireRole(['admin', 'manager', 'super-admin']), upsertCMSPage);

// Banner admin routes
router.get('/banners', auth.protectAdmin, requireRole(['admin', 'manager', 'super-admin']), getAllBannersAdmin);
router.post('/banners', auth.protectAdmin, requireRole(['admin', 'manager', 'super-admin']), createBanner);
router.put('/banners/:id', auth.protectAdmin, requireRole(['admin', 'manager', 'super-admin']), updateBanner);
router.delete('/banners/:id', auth.protectAdmin, requireRole(['admin', 'manager', 'super-admin']), deleteBanner);

// Site Settings admin routes
router.put('/settings', auth.protectAdmin, requireRole(['admin', 'manager', 'super-admin']), updateSettings);

const {
  getPublicTestimonials,
  getAllTestimonialsAdmin,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial
} = require('../controllers/testimonials.controller');

// Testimonial admin routes
router.get('/testimonials', auth.protectAdmin, requireRole(['admin', 'manager', 'super-admin']), getAllTestimonialsAdmin);
router.post('/testimonials', auth.protectAdmin, requireRole(['admin', 'manager', 'super-admin']), createTestimonial);
router.put('/testimonials/:id', auth.protectAdmin, requireRole(['admin', 'manager', 'super-admin']), updateTestimonial);
router.delete('/testimonials/:id', auth.protectAdmin, requireRole(['admin', 'manager', 'super-admin']), deleteTestimonial);

const {
  getAllReviewsAdmin,
  updateReviewStatus,
  deleteReview
} = require('../controllers/adminReviews.controller');

// Review admin routes
router.get('/reviews', auth.protectAdmin, requireRole(['admin', 'manager', 'super-admin']), getAllReviewsAdmin);
router.put('/reviews/:id/status', auth.protectAdmin, requireRole(['admin', 'manager', 'super-admin']), updateReviewStatus);
router.delete('/reviews/:id', auth.protectAdmin, requireRole(['admin', 'manager', 'super-admin']), deleteReview);

const {
  getAllUsersAdmin,
  getUserDetailsAdmin,
  toggleBlockUser,
  deleteUserAdmin
} = require('../controllers/adminUsers.controller');

// User admin routes
router.get('/users', auth.protectAdmin, requireRole(['admin', 'manager', 'super-admin']), getAllUsersAdmin);
router.get('/users/:id', auth.protectAdmin, requireRole(['admin', 'manager', 'super-admin']), getUserDetailsAdmin);
router.put('/users/:id/block', auth.protectAdmin, requireRole(['admin', 'manager', 'super-admin']), toggleBlockUser);
router.delete('/users/:id', auth.protectAdmin, requireRole(['admin', 'manager', 'super-admin']), deleteUserAdmin);

const {
  getAllCouponsAdmin,
  createCoupon,
  updateCoupon,
  deleteCoupon
} = require('../controllers/adminCoupons.controller');

// Coupon admin routes
router.get('/coupons', auth.protectAdmin, requireRole(['admin', 'manager', 'super-admin']), getAllCouponsAdmin);
router.post('/coupons', auth.protectAdmin, requireRole(['admin', 'manager', 'super-admin']), createCoupon);
router.put('/coupons/:id', auth.protectAdmin, requireRole(['admin', 'manager', 'super-admin']), updateCoupon);
router.delete('/coupons/:id', auth.protectAdmin, requireRole(['admin', 'manager', 'super-admin']), deleteCoupon);

module.exports = router;
