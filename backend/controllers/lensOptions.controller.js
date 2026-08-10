const LensOption = require('../models/LensOption');

// GET /api/lens-options?appliesTo=sunglasses
exports.getLensOptions = async (req, res, next) => {
  try {
    const { appliesTo } = req.query;

    const filter = { isActive: true };
    // Common options (e.g. Sun) serve the eyeglasses flow; the sunglasses flow
    // stays pure so delegated tints never re-list a delegating option.
    if (appliesTo === 'eyeglasses') {
      filter.appliesTo = { $in: ['eyeglasses', 'common'] };
    } else if (appliesTo === 'sunglasses') {
      filter.appliesTo = 'sunglasses';
    } else if (appliesTo === 'common') {
      filter.appliesTo = 'common';
    }

    const lensOptions = await LensOption.find(filter).sort({ order: 1 });
    res.status(200).json(lensOptions);
  } catch (error) {
    next(error);
  }
};
