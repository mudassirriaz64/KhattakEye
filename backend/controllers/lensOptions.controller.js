const LensOption = require('../models/LensOption');

// Remove the leaf options that a delegating option (e.g. Sun) reuses from a
// top-level list, so e.g. tints never show twice alongside Sun in eyeglasses.
const excludeDelegatedChildren = (list) => {
  const delegators = list.filter((o) => o.delegatesToAppliesTo);
  if (delegators.length === 0) return list;
  const childIds = new Set();
  for (const d of delegators) {
    for (const o of list) {
      if (o._id.toString() !== d._id.toString() && o.appliesTo === d.delegatesToAppliesTo) {
        childIds.add(o._id.toString());
      }
    }
  }
  return list.filter((o) => !childIds.has(o._id.toString()));
};

// GET /api/lens-options?appliesTo=eyeglasses|sunglasses|common
exports.getLensOptions = async (req, res, next) => {
  try {
    const { appliesTo } = req.query;

    const filter = { isActive: true };
    if (appliesTo === 'eyeglasses') {
      // Top-level eyeglasses choices: eyeglasses + common (e.g. Sun), but the
      // tints Sun reuses are nested under it, so they are excluded here.
      filter.appliesTo = { $in: ['eyeglasses', 'common'] };
    } else if (appliesTo === 'sunglasses') {
      // Sunglasses products list the tints directly, so include common too;
      // umbrella/delegating options like Sun are dropped below.
      filter.appliesTo = { $in: ['sunglasses', 'common'] };
    } else if (appliesTo === 'common') {
      // Sun's delegated list: only the leaf options (tints) are returned.
      filter.appliesTo = 'common';
    }

    let lensOptions = await LensOption.find(filter).sort({ order: 1 });

    if (appliesTo === 'eyeglasses') {
      lensOptions = excludeDelegatedChildren(lensOptions);
    } else if (appliesTo === 'sunglasses' || appliesTo === 'common') {
      lensOptions = lensOptions.filter((o) => !o.delegatesToAppliesTo);
    }

    res.status(200).json(lensOptions);
  } catch (error) {
    next(error);
  }
};
