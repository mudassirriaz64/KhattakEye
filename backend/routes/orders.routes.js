const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const upload = require('../utils/upload');
const ordersController = require('../controllers/orders.controller');

// Public order creation and tracking routes
router.post('/', upload.single('prescriptionFile'), ordersController.createOrder);
router.post('/:id/resubmit-payment-proof', upload.single('paymentScreenshot'), ordersController.resubmitPaymentProof);
router.get('/:id', ordersController.getOrderById);

// Authenticated customer order history
router.get('/user/my-orders', auth.protect, ordersController.getUserOrders);

module.exports = router;
