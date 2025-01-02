const express = require('express');
const http = require('http'); // Import http module
const multer = require('multer');
const sharp = require('sharp');
const Coin = require('../models/Coin');
const fs = require('fs');
const { Server } = require('socket.io'); // Import Socket.io

const app = express();
const server = http.createServer(app); // Create an HTTP server
const io = new Server(server); // Create a new Socket.io server

const router = express.Router();

// Set up multer for image upload
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Create a new coin
router.post('/coins', upload.single('img'), async (req, res) => {
    console.log('Received request to create a new coin');
    try {
        const {
            name,
            ticker,
            description,
            website,
            twitter,
            telegram,
            address,
            creator
        } = req.body;

        let img = null;

        if (req.file) {
            const buffer = await sharp(req.file.buffer)
                .resize({ width: 500 }) // Resize image to width of 500 pixels, maintaining aspect ratio
                .jpeg({ quality: 80 }) // Compress the image
                .toBuffer();

            img = {
                data: buffer,
                contentType: 'image/jpeg'
            };
        }

        const newCoin = new Coin({
            name,
            ticker,
            description,
            website,
            twitter,
            telegram,
            address,
            creator,
            img
        });
        const savedCoin = await newCoin.save();
        io.emit('new-coin', savedCoin); // Emit an event with the new coin data
        res.status(201).json(savedCoin);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Get the list of coins
router.get('/coins', async (req, res) => {
    console.log('Received request to get the list of coins');
    try {
        const coins = await Coin.find();
        res.status(200).json(coins);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Fetch newest coins
router.get('/coins/newest', async (req, res) => {
    try {
        const newestCoins = await Coin.find().sort({ createdAt: -1 }).limit(5); // Adjust limit as needed
        res.status(200).json(newestCoins);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Fetch top 5 coins by market cap
router.get('/coins/market-cap', async (req, res) => {
    try {
        const topMarket = await Coin.find().sort({ marketcap: -1 }).limit(5); // Fetch top 5 coins by market cap
        res.status(200).json(topMarket);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Search for coins
router.get('/search', async (req, res) => {
    try {
        const { query } = req.query;
        const coins = await Coin.find({
            name: { $regex: query, $options: 'i' }
        });
        res.json(coins);
    } catch (error) {
        res.status(500).json({ error: 'Failed to search coins' });
    }
});

// Get a specific coin by ID
router.get('/coins/:id', async (req, res) => {
    try {
        const coin = await Coin.findById(req.params.id);
        if (!coin) {
            return res.status(404).json({ message: 'Coin not found' });
        }
        res.status(200).json(coin);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
