const express = require('express');
const router = express.Router();
const Coin = require('../models/Coin');
const User = require('../models/User'); // Import User model

// Route to get a user's owned, created, purchased, and sold coins
// router.get('/:userId/coins', async (req, res) => {
//     try {
//         const user = await User.findById(req.params.userId)
//             .populate('purchasedCoins')
//             .populate('soldCoins');
//         if (!user) {
//             return res.status(404).json({ error: 'User not found' });
//         }

//         // Fetch coins based on user's ownership and creation
//         const ownedCoins = await Coin.find({ owners: user._id });
//         const createdCoins = await Coin.find({ creator: user._id });

//         res.json({
//             ownedCoins,
//             createdCoins,
//             purchasedCoins: user.purchasedCoins,
//             soldCoins: user.soldCoins
//         });
//     } catch (error) {
//         res.status(500).json({ error: 'Server error' });
//     }
// });

// server/routes/users.js
router.get('/:walletAddress/coins', async (req, res) => {
    const { walletAddress } = req.params;

    try {
        const ownedCoins = await Coin.find({ owners: walletAddress });
        const createdCoins = await Coin.find({ creator: walletAddress });
        const purchasedCoins = await Coin.find({ purchasers: walletAddress });
        const soldCoins = await Coin.find({ sellers: walletAddress });

        res.json({ ownedCoins, createdCoins, purchasedCoins, soldCoins });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
