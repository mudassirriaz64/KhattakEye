const LensOption = require('../models/LensOption');

// GET /api/admin/lens-options?appliesTo=sunglasses
exports.getAllLensOptionsAdmin = async (req, res, next) => {
  try {
    const { appliesTo } = req.query;

    const filter = {};
    if (appliesTo === 'sunglasses' || appliesTo === 'eyeglasses' || appliesTo === 'common') {
      filter.appliesTo = appliesTo;
    }

    const lensOptions = await LensOption.find(filter).sort({ order: 1 });
    res.status(200).json(lensOptions);
  } catch (error) {
    next(error);
  }
};

// POST /api/admin/lens-options
exports.createLensOption = async (req, res, next) => {
  try {
    const payload = { ...req.body };
    delete payload._id;
    delete payload.createdAt;
    delete payload.updatedAt;

    const lensOption = await LensOption.create(payload);
    res.status(201).json(lensOption);
  } catch (error) {
    next(error);
  }
};

// PUT /api/admin/lens-options/:id
exports.updateLensOption = async (req, res, next) => {
  try {
    const { id } = req.params;

    const payload = { ...req.body };
    delete payload._id;
    delete payload.createdAt;
    delete payload.updatedAt;

    const updated = await LensOption.findByIdAndUpdate(id, payload, {
      returnDocument: 'after',
      runValidators: true
    });
    if (!updated) {
      return res.status(404).json({ message: 'Lens option not found' });
    }
    res.status(200).json(updated);
  } catch (error) {
    next(error);
  }
};

// DELETE /api/admin/lens-options/:id
exports.deleteLensOption = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await LensOption.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: 'Lens option not found' });
    }
    res.status(200).json({ message: 'Lens option deleted' });
  } catch (error) {
    next(error);
  }
};
