const Order = require('../models/Order');
const Notification = require('../models/Notification');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
exports.createOrder = async (req, res) => {
    try {
        const { items, deliveryAddress } = req.body;

        // Validate items
        if (!items || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ message: 'No items provided in order' });
        }

        // Ensure each item has required fields
        const formattedItems = items.map(item => ({
            dishId: item.dishId || item._id || null,  // handle both frontend naming styles
            name: item.name,
            quantity: item.quantity,
            price: item.price
        }));

        // Calculate total amount
        const totalAmount = formattedItems.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0
        );

        const order = await Order.create({
            userId: req.user._id,
            userName: req.user.name,
            items: formattedItems,
            totalAmount,
            status: 'PLACED',
            deliveryAddress
        });

        res.status(201).json({
            message: '✅ Your order has been placed successfully!',
            order
        });
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get user orders
// @route   GET /api/orders
// @access  Private
exports.getOrders = async (req, res) => {
    try {
        const orders = await Order.find({ userId: req.user._id })
            .sort('-createdAt');
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all orders (admin only)
// @route   GET /api/orders/admin
// @access  Private/Admin
exports.getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate('userId', 'name email')
            .sort('-createdAt');
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update order status
// @route   PUT /api/orders/:id
// @access  Private/Admin
exports.updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        if (order.status !== 'PLACED') {
            return res.status(400).json({
                message: `Cannot update order. Order is already ${order.status.toLowerCase()}.`
            });
        }

        // Prepare notification message
        const foodItems = order.items.map(item => `${item.name} (${item.quantity}x)`).join(', ');
        const notificationMessage =
            status === 'DELIVERED'
                ? `Your order for ${foodItems} has been delivered!`
                : `Your order for ${foodItems} has been cancelled.`;

        // Create notification
        await Notification.create({
            userId: order.userId,
            orderId: order._id,
            message: notificationMessage,
            type: status.toLowerCase()
        });

        // Update order
        order.status = status;
        await order.save();

        res.json({
            success: true,
            message:
                status === 'DELIVERED'
                    ? '✅ Order marked as delivered successfully!'
                    : '✅ Order cancelled successfully!',
            order
        });
    } catch (error) {
        console.error('Error updating order status:', error);
        res.status(500).json({
            message: 'Failed to update order status. Please try again.'
        });
    }
};
