const User = require('../models/User');
const AdminUser = require('../models/AdminUser');
const { verifyToken } = require('../utils/jwt');

/**
 * Protects customer endpoints.
 * Checks for token in cookie 'token' or Authorization Header.
 * Verifies that the JWT audience matches 'customer'.
 */
const protect = async (req, res, next) => {
  let token;

  // 1. Check for token in cookie
  if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }
  // 2. Fallback to Authorization Bearer header
  else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(418).json({ message: 'Not authorized, token missing' }); // Using 418 Tea Pot or 401
    // Let's use 401 for unauthorized
  }

  try {
    // Verify token with audience 'customer'
    const decoded = verifyToken(token, 'customer');

    // Get user from the database
    const user = await User.findById(decoded.id).select('-passwordHash');

    if (!user) {
      return res.status(401).json({ message: 'Not authorized, user not found' });
    }

    // Attach user to req
    req.user = user;
    next();
  } catch (error) {
    console.error(`Auth Middleware Error: ${error.message}`);
    return res.status(401).json({ message: 'Not authorized, token invalid or expired' });
  }
};

/**
 * Protects admin endpoints.
 * Checks for token in cookie 'admin_token' or Authorization Header.
 * Verifies that the JWT audience matches 'admin'.
 */
const protectAdmin = async (req, res, next) => {
  let token;

  // 1. Check for token in cookie
  if (req.cookies && req.cookies.admin_token) {
    token = req.cookies.admin_token;
  }
  // 2. Fallback to Authorization Bearer header
  else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, admin token missing' });
  }

  try {
    // Verify token with audience 'admin'
    const decoded = verifyToken(token, 'admin');

    // Get admin from the database
    const admin = await AdminUser.findById(decoded.id).select('-passwordHash');

    if (!admin) {
      return res.status(401).json({ message: 'Not authorized, admin not found' });
    }

    if (!admin.isActive) {
      return res.status(403).json({ message: 'Not authorized, admin account is disabled' });
    }

    // Attach admin to req
    req.admin = admin;
    next();
  } catch (error) {
    console.error(`Admin Auth Middleware Error: ${error.message}`);
    return res.status(401).json({ message: 'Not authorized, admin token invalid or expired' });
  }
};

module.exports = {
  protect,
  protectAdmin
};
