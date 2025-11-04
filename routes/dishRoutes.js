const express = require('express');
const router = express.Router();
const { getDishes, createDish, updateDish, deleteDish } = require('../controllers/dishController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
    .get(getDishes)
    .post(protect, admin, createDish);

router.route('/:id')
    .put(protect, admin, updateDish)
    .delete(protect, admin, deleteDish);

module.exports = router;