// server/models/Review.js
const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
    coinId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Coin', // Reference to the Coin model (assuming you have a Coin model)
        required: true
    },
    username: {
        type: String,
        required: true
    },
    comment: {
        type: String,
        required: true
    },
    image: {
        data: Buffer,
        contentType: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Review', ReviewSchema);
