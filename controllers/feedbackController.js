const Feedback = require('../models/Feedback');

// @desc    Create new feedback
// @route   POST /api/feedback
// @access  Private
exports.createFeedback = async (req, res) => {
    try {
        const { rating, comment } = req.body;

        const feedback = await Feedback.create({
            userId: req.user._id,
            userName: req.user.name,
            rating,
            comment
        });

        res.status(201).json({
            message: '✅ Thank you for your feedback!',
            feedback
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get all feedback
// @route   GET /api/feedback
// @access  Public
exports.getAllFeedback = async (req, res) => {
    try {
        const feedback = await Feedback.find()
            .sort('-createdAt')
            .populate('userId', 'name');
            
        res.json(feedback);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get user's feedback
// @route   GET /api/feedback/me
// @access  Private
exports.getUserFeedback = async (req, res) => {
    try {
        const feedback = await Feedback.find({ userId: req.user._id })
            .sort('-createdAt');
            
        res.json(feedback);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};