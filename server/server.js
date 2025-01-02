const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = require('./app');

// Load environment variables from .env file
dotenv.config();

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

// Verify if MONGO_URI is defined
if (!MONGO_URI) {
  console.error('MongoDB connection URI is not defined in .env file');
  process.exit(1); // Exit the process if MONGO_URI is not defined
}

// Connect to MongoDB
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Connection error', err.message);
    // Exit the process on connection error
    process.exit(1);
  });
