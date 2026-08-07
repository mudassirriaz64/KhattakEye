const LensOption = require('../models/LensOption');

// GET /api/lens-options?appliesTo=sunglasses
exports.getLensOptions = async (req, res, next) => {
  try {
    const { appliesTo } = req.query;

    const filter = { isActive: true };
    if (appliesTo === 'sunglasses' || appliesTo === 'eyeglasses') {
      filter.appliesTo = appliesTo;
    }

    const lensOptions = await LensOption.find(filter).sort({ order: 1 });
    res.status(200).json(lensOptions);
  } catch (error) {
    next(error);
  }
};
