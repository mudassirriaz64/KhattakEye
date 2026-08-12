const AdminUser = require('../../models/AdminUser');
const { comparePassword } = require('../../utils/password');
const { signToken } = require('../../utils/jwt');

// Helper to format admin response profile
const formatAdminProfile = (admin) => ({
  id: admin._id,
  name: admin.name,
  email: admin.email,
  avatar: admin.avatar || null,
  role: admin.role,
  isActive: admin.isActive
});

// Configure admin cookie options
const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
};

/**
 * Login admin
 */
const login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const emailLower = email.toLowerCase().trim();
    const admin = await AdminUser.findOne({ email: emailLower });

    if (!admin) {
      return res.status(401).json({ message: 'Invalid admin credentials' });
    }

    if (!admin.isActive) {
      return res.status(403).json({ message: 'Admin account is deactivated' });
    }

    // Verify password
    const isMatch = await comparePassword(password, admin.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid admin credentials' });
    }

    // Update last login
    admin.lastLogin = new Date();
    await admin.save();

    // Sign JWT token
    const token = signToken({ id: admin._id }, 'admin');

    // Set cookie 'admin_token'
    res.cookie('admin_token', token, cookieOptions);

    res.status(200).json({
      message: 'Admin login successful',
      token,
      user: formatAdminProfile(admin)
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Logout admin
 */
const logout = async (req, res, next) => {
  try {
    res.clearCookie('admin_token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
    });
    res.status(200).json({ message: 'Admin logged out successfully' });
  } catch (error) {
    next(error);
  }
};

/**
 * Get current admin profile
 */
const me = async (req, res, next) => {
  try {
    // req.admin is populated by protectAdmin middleware
    res.status(200).json({ user: formatAdminProfile(req.admin) });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  login,
  logout,
  me
};
