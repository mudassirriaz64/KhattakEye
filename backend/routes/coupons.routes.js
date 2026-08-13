const express = require('express');
const router = express.Router();
const { validateCoupon } = require('../controllers/coupons.controller');

router.post('/validate', validateCoupon);

module.exports = router;
