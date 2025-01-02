const mongoose = require('mongoose');

const CoinSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        ticker: {
            type: String,
            required: true,
            unique: true
        },
        description: {
            type: String,
            required: true
        },
        website: {
            type: String,
            required: false
        },
        twitter: {
            type: String,
            required: false
        },
        telegram: {
            type: String,
            required: false
        },
        img: {
            data: Buffer,
            contentType: String
        },
        owners: {
            type: [String],
            default: []
        },
        creator: {
            type: String,
            required: true
        },
        address: {
            type: String,
            required: true // Make this required if every coin must have an address
        },
        purchasers: {
            type: [String], // New field for tracking purchasers
            default: []
        },
        sellers: {
            type: [String], // New field for tracking sellers
            default: []
        },
        marketcap: {
            type: Number,
            default: 0 // Initialize marketcap to 0
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    },
    { timestamps: true }
);

CoinSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Coin', CoinSchema);
