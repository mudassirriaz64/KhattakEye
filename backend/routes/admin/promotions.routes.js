const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const requireRole = require('../../middleware/requireRole');
const {
  getAllPromotions,
  createPromotion,
  updatePromotion,
  deletePromotion
} = require('../../controllers/adminPromotions.controller');

router.get(['/', '/promotions'], auth.protectAdmin, requireRole(['admin', 'manager', 'super-admin']), getAllPromotions);
router.post(['/', '/promotions'], auth.protectAdmin, requireRole(['admin', 'manager', 'super-admin']), createPromotion);
router.put(['/:id', '/promotions/:id'], auth.protectAdmin, requireRole(['admin', 'manager', 'super-admin']), updatePromotion);
router.delete(['/:id', '/promotions/:id'], auth.protectAdmin, requireRole(['admin', 'manager', 'super-admin']), deletePromotion);

module.exports = router;
