const express = require('express');
const router = express.Router();
const { submitInquiry } = require('../controllers/contact.controller');

router.post('/', submitInquiry);

module.exports = router;
