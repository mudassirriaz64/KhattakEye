const Notification = require('../models/Notification');

// Helper function to create system notification
const createNotification = async ({ type, title, message, recipient = 'Admin', status = 'sent', link, metadata }) => {
  try {
    return await Notification.create({
      type,
      title,
      message,
      recipient,
      status,
      link,
      metadata
    });
  } catch (error) {
    console.error('Failed to create notification:', error);
  }
};

// GET /api/admin/notifications
const getNotifications = async (req, res, next) => {
  try {
    const { type, limit = 50, page = 1 } = req.query;
    const query = {};

    if (type && type !== 'all') {
      query.type = type;
    }

    const count = await Notification.countDocuments(query);
    
    // Seed initial notifications if database has 0 notifications
    if (count === 0 && !type) {
      await Notification.insertMany([
        {
          type: 'order',
          title: 'New Order Placed',
          message: 'Order KT-4B1C9A placed by Sara Ahmed — Rs. 59,900',
          recipient: 'Admin',
          status: 'sent',
          read: false,
          createdAt: new Date(Date.now() - 1000 * 60 * 30)
        },
        {
          type: 'email',
          title: 'Order Confirmation Sent',
          message: 'Order KT-2A3F9C confirmation email sent to ayesha@example.com',
          recipient: 'ayesha@example.com',
          status: 'sent',
          read: false,
          createdAt: new Date(Date.now() - 1000 * 60 * 120)
        },
        {
          type: 'alert',
          title: 'Low Stock Alert',
          message: 'Bella Glow Hazel stock is below low stock threshold (2 units left)',
          recipient: 'Admin',
          status: 'sent',
          read: false,
          createdAt: new Date(Date.now() - 1000 * 60 * 300)
        },
        {
          type: 'email',
          title: 'Newsletter Campaign Sent',
          message: 'Summer Collection 2026 newsletter sent to 892 subscribers',
          recipient: '892 subscribers',
          status: 'sent',
          read: true,
          createdAt: new Date(Date.now() - 1000 * 60 * 600)
        },
        {
          type: 'order',
          title: 'Payment Received',
          message: 'Payment of Rs. 43,580 received for order KT-2A3F9C',
          recipient: 'Admin',
          status: 'sent',
          read: true,
          createdAt: new Date(Date.now() - 1000 * 60 * 720)
        }
      ]);
    }

    const notifications = await Notification.find(query)
      .sort({ createdAt: -1 })
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit));

    const total = await Notification.countDocuments(query);
    const unreadCount = await Notification.countDocuments({ read: false });

    res.status(200).json({
      notifications,
      total,
      unreadCount,
      page: Number(page),
      totalPages: Math.ceil(total / Number(limit)) || 1
    });
  } catch (error) {
    next(error);
  }
};

// PUT /api/admin/notifications/mark-read
const markAllNotificationsRead = async (req, res, next) => {
  try {
    await Notification.updateMany({ read: false }, { $set: { read: true } });
    res.status(200).json({ message: 'All notifications marked as read' });
  } catch (error) {
    next(error);
  }
};

// PUT /api/admin/notifications/:id/read
const markNotificationRead = async (req, res, next) => {
  try {
    const { id } = req.params;
    const notification = await Notification.findByIdAndUpdate(
      id,
      { $set: { read: true } },
      { returnDocument: 'after' }
    );
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }
    res.status(200).json(notification);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createNotification,
  getNotifications,
  markAllNotificationsRead,
  markNotificationRead
};
