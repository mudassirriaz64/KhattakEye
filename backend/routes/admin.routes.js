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

// POST /api/admin/products
// Requires auth, admin/manager/super-admin role, and handles multipart form data for images
router.post(
  '/products',
  auth.protectAdmin,
  requireRole(['admin', 'manager', 'super-admin']),
  upload.array('images', 5),
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

module.exports = router;
