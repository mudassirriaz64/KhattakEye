const express = require('express');
const router = express.Router();
const passport = require('passport');
const authController = require('../controllers/auth.controller');
const { protect } = require('../middleware/auth');
const { authLimiter } = require('../middleware/rateLimiter');

// Google OAuth Routes
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/auth/login?error=google_auth_failed' }),
  (req, res) => {
    const jwt = require('../utils/jwt');
    const token = jwt.signToken({ id: req.user._id }, 'customer', '7d');

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    const frontendUrl = process.env.CORS_ORIGIN || 'http://localhost:5173';
    res.redirect(`${frontendUrl}/auth/google/callback?token=${token}`);
  }
);

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
