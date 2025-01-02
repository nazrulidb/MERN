const mongoose = require('mongoose');

const TradeSchema = new mongoose.Schema({
    walletAddress: {
        type: String,
        required: true
    },
    tradeType: {
        type: String,
        enum: ['Buy', 'Sell'],
        required: true
    },
    amountETH: {
        type: Number,
        required: true
    },
    tokenAddress: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    transactionId: {
        type: String,
        required: true
    }
});

const Trade = mongoose.model('Trade', TradeSchema);

module.exports = Trade;
