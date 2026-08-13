const Promotion = require('../models/Promotion');

// GET /api/promotions/active
const getActivePromotions = async (req, res, next) => {
  try {
    const now = new Date();
    const activePromotions = await Promotion.find({
      isActive: true,
      startDate: { $lte: now },
      endDate: { $gte: now }
    })
      .populate('targetProduct', 'name brand slug price images')
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json(activePromotions);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getActivePromotions
};
