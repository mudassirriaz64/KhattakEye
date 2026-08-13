const Promotion = require('../models/Promotion');

// GET /api/admin/promotions
const getAllPromotions = async (req, res, next) => {
  try {
    const promotions = await Promotion.find()
      .populate('targetProduct', 'name brand slug price images')
      .sort({ createdAt: -1 });
    res.status(200).json({ items: promotions });
  } catch (error) {
    next(error);
  }
};

// POST /api/admin/promotions
const createPromotion = async (req, res, next) => {
  try {
    const {
      name,
      type,
      targetProduct,
      targetCategory,
      targetSubCategory,
      discountPercent,
      startDate,
      endDate,
      isActive,
      badgeText
    } = req.body;

    if (!name || !type || !startDate || !endDate) {
      return res.status(400).json({ message: 'Name, type, startDate, and endDate are required' });
    }

    if (type === 'bogo') {
      if (!targetProduct && !targetCategory && !targetSubCategory) {
        return res.status(400).json({ message: 'BOGO promotion requires a target product, category, or subcategory' });
      }
    } else if (type === 'category-percent-off') {
      if (!targetCategory && !targetSubCategory && !targetProduct) {
        return res.status(400).json({ message: 'Category percent-off promotion requires targetCategory or targetSubCategory' });
      }
      if (discountPercent === undefined || Number(discountPercent) <= 0) {
        return res.status(400).json({ message: 'Category percent-off promotion requires a positive discountPercent' });
      }
    } else {
      return res.status(400).json({ message: 'Invalid promotion type' });
    }

    const promotion = new Promotion({
      name: name.trim(),
      type,
      targetProduct: targetProduct || null,
      targetCategory: targetCategory ? targetCategory.trim() : null,
      targetSubCategory: targetSubCategory ? targetSubCategory.trim() : null,
      discountPercent: discountPercent ? Number(discountPercent) : 0,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      isActive: isActive !== undefined ? Boolean(isActive) : true,
      badgeText: badgeText ? badgeText.trim() : (type === 'bogo' ? 'BUY 1 GET 1 FREE' : `${discountPercent}% OFF`)
    });

    await promotion.save();
    const populated = await Promotion.findById(promotion._id).populate('targetProduct', 'name brand slug price images');
    res.status(201).json(populated);
  } catch (error) {
    next(error);
  }
};

// PUT /api/admin/promotions/:id
const updatePromotion = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    if (updateData.startDate) updateData.startDate = new Date(updateData.startDate);
    if (updateData.endDate) updateData.endDate = new Date(updateData.endDate);

    const promotion = await Promotion.findByIdAndUpdate(
      id,
      updateData,
      { returnDocument: 'after', runValidators: true }
    ).populate('targetProduct', 'name brand slug price images');

    if (!promotion) {
      return res.status(404).json({ message: 'Promotion not found' });
    }

    res.status(200).json(promotion);
  } catch (error) {
    next(error);
  }
};

// DELETE /api/admin/promotions/:id
const deletePromotion = async (req, res, next) => {
  try {
    const { id } = req.params;
    await Promotion.findByIdAndDelete(id);
    res.status(200).json({ message: 'Promotion deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllPromotions,
  createPromotion,
  updatePromotion,
  deletePromotion
};
