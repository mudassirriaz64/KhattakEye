const express = require('express');
const router = express.Router();
const adminAuthController = require('../../controllers/admin/auth.controller');
const { protectAdmin } = require('../../middleware/auth');
const { authLimiter } = require('../../middleware/rateLimiter');

// Admin Auth endpoints
router.post('/login', authLimiter, adminAuthController.login);
router.post('/logout', protectAdmin, adminAuthController.logout);
router.get('/me', protectAdmin, adminAuthController.me);

module.exports = router;
