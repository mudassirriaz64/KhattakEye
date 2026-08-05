/**
 * Admin role gating middleware.
 * Expects req.admin to be populated by protectAdmin middleware.
 * @param {string[]} roles - list of roles permitted to access endpoint (e.g. ['super-admin', 'admin'])
 */
module.exports = (roles = []) => {
  return (req, res, next) => {
    if (!req.admin) {
      return res.status(401).json({ message: 'Not authorized, admin context missing' });
    }

    if (!roles.includes(req.admin.role)) {
      return res.status(403).json({ 
        message: `Forbidden: Access requires one of the following roles: [${roles.join(', ')}]` 
      });
    }

    next();
  };
};
