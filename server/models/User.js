// server/models/User.js
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true
        },
        purchasedCoins: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Coin' // Reference to the Coin model
            }
        ],
        soldCoins: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Coin' // Reference to the Coin model
            }
        ]
    },
    { timestamps: true }
);

module.exports = mongoose.model('User', UserSchema);
