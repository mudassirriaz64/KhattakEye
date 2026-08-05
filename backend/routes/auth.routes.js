const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { protect } = require('../middleware/auth');
const { authLimiter } = require('../middleware/rateLimiter');

// Public endpoints with rate limiter
router.post('/register', authLimiter, authController.register);
router.post('/login', authLimiter, authController.login);
router.post('/forgot-password', authLimiter, authController.forgotPassword);
router.post('/reset-password', authLimiter, authController.resetPassword);

// OTP Verification endpoints
router.post('/verify-otp', authLimiter, protect, authController.verifyOtp);
router.post('/send-otp', authLimiter, protect, authController.sendOtp);

// Protected endpoints
router.post('/logout', protect, authController.logout);
router.get('/me', protect, authController.me);
router.put('/profile', protect, authController.updateProfile);
router.put('/change-password', protect, authController.changePassword);

module.exports = router;
