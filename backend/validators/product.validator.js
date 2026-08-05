/**
 * Product payload validator middleware
 * Validates common base product fields and branches to glasses or lenses specific validations.
 */
function validateProductPayload(req, res, next) {
  const { kind, name, price, category } = req.body;
  const errors = [];

  if (!name || typeof name !== 'string' || !name.trim()) {
    errors.push('Product name is required');
  }

  if (price === undefined || isNaN(Number(price)) || Number(price) < 0) {
    errors.push('Valid non-negative price is required');
  }

  if (!category || typeof category !== 'string' || !category.trim()) {
    errors.push('Category is required');
  }

  const productKind = kind || 'glasses';

  if (productKind === 'glasses') {
    // Specific glasses field checks (if any required)
  } else if (productKind === 'lenses') {
    if (!req.body.wearDuration || !['daily', 'monthly', 'yearly'].includes(req.body.wearDuration)) {
      errors.push('Valid wearDuration (daily, monthly, yearly) is required for lenses');
    }
  } else {
    errors.push('Invalid product kind. Allowed values: glasses, lenses');
  }

  if (errors.length > 0) {
    return res.status(400).json({ success: false, errors, message: errors.join(', ') });
  }

  next();
}

module.exports = {
  validateProductPayload
};
