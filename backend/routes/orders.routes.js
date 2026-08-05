const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const ordersController = require('../controllers/orders.controller');

// Public order creation and tracking routes
router.post('/', ordersController.createOrder);
router.get('/:id', ordersController.getOrderById);

// Authenticated customer order history
router.get('/user/my-orders', auth.protect, ordersController.getUserOrders);

module.exports = router;
