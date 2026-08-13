const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const requireRole = require('../../middleware/requireRole');
const { getSettings, updateSettings } = require('../../controllers/cms.controller');

// Site Settings admin routes
router.get('/', auth.protectAdmin, requireRole(['admin', 'manager', 'super-admin']), getSettings);
router.put('/', auth.protectAdmin, requireRole(['admin', 'manager', 'super-admin']), updateSettings);

module.exports = router;
