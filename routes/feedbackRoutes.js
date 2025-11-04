const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
const {
    createFeedback,
    getAllFeedback,
    getUserFeedback
} = require('../controllers/feedbackController');

// Create new feedback
router.post('/', protect, createFeedback);

// Get all feedback (public)
router.get('/', getAllFeedback);

// Get user's feedback
router.get('/me', protect, getUserFeedback);

module.exports = router;