const User = require('../models/User');
const Order = require('../models/Order');

// GET /api/admin/users
const getAllUsersAdmin = async (req, res, next) => {
  try {
    const users = await User.find({ role: 'customer' }).select('-passwordHash').sort({ createdAt: -1 });

    // Aggregate user order counts and total spent
    const usersWithStats = await Promise.all(users.map(async (u) => {
      const userObj = u.toObject();
      const orders = await Order.find({ user: u._id });
      const ordersCount = orders.length;
      const totalSpent = orders.reduce((sum, o) => sum + (o.total || 0), 0);

      return {
        ...userObj,
        ordersCount,
        totalSpent
      };
    }));

    res.status(200).json({ items: usersWithStats });
  } catch (error) {
    next(error);
  }
};

// GET /api/admin/users/:id
const getUserDetailsAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-passwordHash').populate('wishlist');
    if (!user) return res.status(404).json({ message: 'User not found' });

    const orders = await Order.find({ user: user._id }).sort({ createdAt: -1 });
    res.status(200).json({ user, orders });
  } catch (error) {
    next(error);
  }
};

// PUT /api/admin/users/:id/block
const toggleBlockUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.isBlocked = !user.isBlocked;
    await user.save();

    res.status(200).json({ message: `User ${user.isBlocked ? 'blocked' : 'unblocked'} successfully`, isBlocked: user.isBlocked });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/admin/users/:id
const deleteUserAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Check if user has orders
    const orderCount = await Order.countDocuments({ user: user._id });
    if (orderCount > 0) {
      // Soft delete by blocking to avoid orphaning orders
      user.isBlocked = true;
      await user.save();
      return res.status(200).json({ message: 'User has existing orders. Account blocked instead of hard deleted.' });
    }

    await User.findByIdAndDelete(user._id);
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllUsersAdmin,
  getUserDetailsAdmin,
  toggleBlockUser,
  deleteUserAdmin
};
