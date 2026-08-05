const crypto = require('crypto');
const User = require('../models/User');
const { hashPassword, comparePassword } = require('../utils/password');
const { signToken } = require('../utils/jwt');
const { sendOTPEmail, sendResetEmail } = require('../utils/email');

// Helper to format user response profile
const formatUserProfile = (user) => ({
  id: user._id,
  fullName: user.fullName,
  email: user.email,
  phone: user.phone,
  avatar: user.avatar || null,
  gender: user.gender || '',
  dateOfBirth: user.dateOfBirth ? user.dateOfBirth.toISOString().split('T')[0] : '',
  isEmailVerified: user.isEmailVerified,
  role: user.role,
  createdAt: user.createdAt.toISOString().split('T')[0]
});

// Configure cookie options
const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
};

/**
 * Register a new user
 */
const register = async (req, res, next) => {
  const { fullName, email, phone, password } = req.body;

  try {
    if (!fullName || !email || !phone || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const emailLower = email.toLowerCase().trim();
    const existingUser = await User.findOne({ email: emailLower });

    if (existingUser) {
      return res.status(400).json({ message: 'Email is already registered' });
    }

    // Hash password
    const passwordHash = await hashPassword(password);

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 mins

    // Create user
    const user = new User({
      fullName,
      email: emailLower,
      phone,
      passwordHash,
      verificationOtp: otp,
      verificationOtpExpires: otpExpires
    });

    await user.save();

    // Send OTP
    await sendOTPEmail(user.email, otp);

    // Sign JWT token
    const token = signToken({ id: user._id }, 'customer');

    // Set cookie
    res.cookie('token', token, cookieOptions);

    res.status(201).json({
      message: 'Registration successful. Verification OTP sent to email.',
      token,
      user: formatUserProfile(user)
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Verify OTP code
 */
const verifyOtp = async (req, res, next) => {
  const { code } = req.body;

  try {
    if (!code) {
      return res.status(400).json({ message: 'OTP code is required' });
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.isEmailVerified) {
      return res.status(400).json({ message: 'Email is already verified' });
    }

    // Verify OTP and expiry
    if (user.verificationOtp !== code || user.verificationOtpExpires < new Date()) {
      return res.status(400).json({ message: 'Invalid or expired OTP code' });
    }

    // Update verification status
    user.isEmailVerified = true;
    user.verificationOtp = undefined;
    user.verificationOtpExpires = undefined;

    await user.save();

    res.status(200).json({
      message: 'Email verified successfully',
      user: formatUserProfile(user)
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Re-send OTP code
 */
const sendOtp = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.isEmailVerified) {
      return res.status(400).json({ message: 'Email is already verified' });
    }

    // Generate new OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.verificationOtp = otp;
    user.verificationOtpExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 mins

    await user.save();

    // Send OTP
    await sendOTPEmail(user.email, otp);

    res.status(200).json({ message: 'Verification OTP sent to email' });
  } catch (error) {
    next(error);
  }
};

/**
 * Login user
 */
const login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const emailLower = email.toLowerCase().trim();
    const user = await User.findOne({ email: emailLower });

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check password
    const isMatch = await comparePassword(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Sign JWT token
    const token = signToken({ id: user._id }, 'customer');

    // Set cookie
    res.cookie('token', token, cookieOptions);

    res.status(200).json({
      message: 'Login successful',
      token,
      user: formatUserProfile(user)
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Logout user
 */
const logout = async (req, res, next) => {
  try {
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    });
    res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    next(error);
  }
};

/**
 * Get current user profile
 */
const me = async (req, res, next) => {
  try {
    // req.user is populated by protect middleware
    res.status(200).json({ user: formatUserProfile(req.user) });
  } catch (error) {
    next(error);
  }
};

/**
 * Update user profile
 */
const updateProfile = async (req, res, next) => {
  const { fullName, phone, gender, dateOfBirth } = req.body;

  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (fullName) user.fullName = fullName;
    if (phone) user.phone = phone;
    if (gender !== undefined) user.gender = gender;
    if (dateOfBirth !== undefined) user.dateOfBirth = dateOfBirth ? new Date(dateOfBirth) : null;

    await user.save();

    res.status(200).json({
      message: 'Profile updated successfully',
      user: formatUserProfile(user)
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Change password
 */
const changePassword = async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;

  try {
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Current and new passwords are required' });
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Verify current password
    const isMatch = await comparePassword(currentPassword, user.passwordHash);
    if (!isMatch) {
      return res.status(400).json({ message: 'Incorrect current password' });
    }

    // Hash and save new password
    user.passwordHash = await hashPassword(newPassword);
    await user.save();

    res.status(200).json({ message: 'Password changed successfully' });
  } catch (error) {
    next(error);
  }
};

/**
 * Forgot password request
 */
const forgotPassword = async (req, res, next) => {
  const { email } = req.body;

  try {
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const emailLower = email.toLowerCase().trim();
    const user = await User.findOne({ email: emailLower });

    if (user) {
      // Generate a crypto reset token
      const token = crypto.randomBytes(32).toString('hex');
      user.resetPasswordToken = token;
      user.resetPasswordExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 mins

      await user.save();

      // Send Reset Email
      await sendResetEmail(user.email, token);
    }

    // Always send success to prevent email enumeration
    res.status(200).json({ message: 'If that email exists in our system, we sent a password reset link.' });
  } catch (error) {
    next(error);
  }
};

/**
 * Reset password
 */
const resetPassword = async (req, res, next) => {
  const { token, password } = req.body;

  try {
    if (!token || !password) {
      return res.status(400).json({ message: 'Reset token and new password are required' });
    }

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: new Date() }
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired password reset token' });
    }

    // Hash and save new password
    user.passwordHash = await hashPassword(password);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.status(200).json({ message: 'Password reset successful. You can now log in.' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  verifyOtp,
  sendOtp,
  login,
  logout,
  me,
  updateProfile,
  changePassword,
  forgotPassword,
  resetPassword
};
