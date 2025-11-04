const Dish = require('../models/Dish');

// @desc    Get all dishes
// @route   GET /api/dishes
// @access  Public
exports.getDishes = async (req, res) => {
    try {
        const dishes = await Dish.find({});
        res.json(dishes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a dish
// @route   POST /api/dishes
// @access  Private/Admin
exports.createDish = async (req, res) => {
    try {
        const dish = await Dish.create(req.body);
        res.status(201).json(dish);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Update a dish
// @route   PUT /api/dishes/:id
// @access  Private/Admin
exports.updateDish = async (req, res) => {
    try {
        const dish = await Dish.findById(req.params.id);
        
        if (dish) {
            Object.assign(dish, req.body);
            const updatedDish = await dish.save();
            res.json(updatedDish);
        } else {
            res.status(404).json({ message: 'Dish not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Delete a dish
// @route   DELETE /api/dishes/:id
// @access  Private/Admin
exports.deleteDish = async (req, res) => {
    try {
        const dish = await Dish.findById(req.params.id);
        
        if (dish) {
            await dish.remove();
            res.json({ message: 'Dish removed' });
        } else {
            res.status(404).json({ message: 'Dish not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};