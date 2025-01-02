const express = require('express');
const router = express.Router();
const Trade = require('../models/Trade');
const Coin = require('../models/Coin');
const User = require('../models/User'); // Import User model

// Route to create a new trade
// Route to create a new trade
router.post('/new', async (req, res) => {
    console.log('Trying to create new trade');
    try {
        const {
            walletAddress,
            tradeType,
            amountETH,
            tokenAddress,
            transactionId
        } = req.body;

        const newTrade = new Trade({
            walletAddress,
            tradeType,
            amountETH,
            tokenAddress,
            transactionId
        });

        await newTrade.save();

        // Update the marketcap of the corresponding coin
        const coin = await Coin.findOne({ address: tokenAddress });
        if (coin) {
            if (tradeType === 'Buy') {
                coin.marketcap += amountETH; // Increase marketcap on buy
                // Add to purchasers if not already there
                if (!coin.purchasers.includes(walletAddress)) {
                    coin.purchasers.push(walletAddress);
                }
                // Update user's purchasedCoins
                await User.findOneAndUpdate(
                    { email: walletAddress }, // Assuming walletAddress is used as email for simplicity
                    { $addToSet: { purchasedCoins: coin._id } } // Use $addToSet to avoid duplicates
                );
            } else if (tradeType === 'Sell') {
                coin.marketcap -= amountETH; // Decrease marketcap on sell
                // Add to sellers if not already there
                if (!coin.sellers.includes(walletAddress)) {
                    coin.sellers.push(walletAddress);
                }
                // Update user's soldCoins
                await User.findOneAndUpdate(
                    { email: walletAddress }, // Assuming walletAddress is used as email for simplicity
                    { $addToSet: { soldCoins: coin._id } } // Use $addToSet to avoid duplicates
                );
            }
            await coin.save();
        }

        res.status(201).json(newTrade);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Route to get all trades
router.get('/', async (req, res) => {
    try {
        const trades = await Trade.find();
        res.status(200).json(trades);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Route to get trades by token address
router.get('/:tokenAddress', async (req, res) => {
    try {
        const trades = await Trade.find({
            tokenAddress: req.params.tokenAddress
        });
        res.json(trades);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;