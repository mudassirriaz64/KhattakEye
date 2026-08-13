const express = require('express');
const router = express.Router();
const upload = require('../utils/upload');
const auth = require('../middleware/auth');
const requireRole = require('../middleware/requireRole');
const { uploadImage } = require('../controllers/uploads.controller');

router.post(
  '/image',
  auth.protectAdmin,
  requireRole(['admin', 'manager', 'super-admin']),
  upload.single('image'),
  uploadImage
);

module.exports = router;
