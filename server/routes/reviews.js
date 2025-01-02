const express = require('express');
const router = express.Router();
const sharp = require('sharp');
const multer = require('multer');
const Review = require('../models/Review');

// Set up multer for handling file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Create a new review
router.post('/', upload.single('image'), async (req, res) => {
    const { coinId, username, comment } = req.body;
    let img = null;

    if (req.file) {
        try {
            const buffer = await sharp(req.file.buffer)
                .resize({ width: 200, height: 200 }) // Resize image to 200x200 pixels
                .jpeg({ quality: 80 }) // Compress the image
                .toBuffer();

            img = {
                data: buffer.toString('base64'), // Convert to base64
                contentType: 'image/jpeg'
            };
        } catch (error) {
            return res.status(500).json({ error: 'Error processing image' });
        }
    }

    try {
        const newReview = new Review({
            coinId,
            username,
            comment,
            image: img
        });
        const savedReview = await newReview.save();
        res.status(201).json(savedReview);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Get reviews for a specific coin
router.get('/coin/:coinId', async (req, res) => {
    const { coinId } = req.params;
    try {
        const reviews = await Review.find({ coinId });
        res.status(200).json(reviews);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Get a single review
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const review = await Review.findById(id);
        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }
        res.status(200).json(review);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Update a review
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { comment, image } = req.body;
    try {
        const updatedReview = await Review.findByIdAndUpdate(
            id,
            { comment, image },
            { new: true }
        );
        if (!updatedReview) {
            return res.status(404).json({ message: 'Review not found' });
        }
        res.status(200).json(updatedReview);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Delete a review
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const deletedReview = await Review.findByIdAndDelete(id);
        if (!deletedReview) {
            return res.status(404).json({ message: 'Review not found' });
        }
        res.status(200).json({ message: 'Review deleted successfully' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

module.exports = router;
