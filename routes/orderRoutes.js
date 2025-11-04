const express = require('express');
const router = express.Router();
const { createOrder, getOrders, getAllOrders, updateOrderStatus } = require('../controllers/orderController');
const { protect, admin } = require('../middleware/authMiddleware');

// Regular user routes
router.route('/')
    .post(protect, createOrder)
    .get(protect, getOrders);

// Admin routes
router.route('/admin')
    .get(protect, admin, getAllOrders);

router.route('/:id')
    .put(protect, admin, updateOrderStatus);

module.exports = router;