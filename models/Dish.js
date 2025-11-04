const mongoose = require('mongoose');

const dishSchema = new mongoose.Schema({
    dishName: {
        type: String,
        required: [true, 'Please provide a dish name'],
        trim: true
    },
    restaurantName: {
        type: String,
        required: [true, 'Please provide a restaurant name'],
        trim: true
    },
    price: {
        type: Number,
        required: [true, 'Please provide a price'],
        min: 0
    },
    rating: {
        type: Number,
        required: [true, 'Please provide a rating'],
        min: 0,
        max: 5,
        default: 0
    },
    phone: {
        type: String,
        required: [true, 'Please provide a contact number'],
        trim: true
    },
    imageUrl: {
        type: String,
        required: [true, 'Please provide an image URL']
    },
    feedback: [{
        type: String,
        trim: true
    }]
}, {
    timestamps: true
});

const Dish = mongoose.model('Dish', dishSchema);
module.exports = Dish;