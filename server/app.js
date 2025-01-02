const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const indexRoutes = require('./routes/index');
const reviewRoutes = require('./routes/reviews');
const userRoutes = require('./routes/users');
const tradeRoutes = require('./routes/trades');
const path = require('path');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Add this before your API routes
app.use(express.static(path.join(__dirname, '../client/build')));

// Routes
app.use('/api', indexRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/user', userRoutes); // Add the new users route
app.use('/api/trades', tradeRoutes); // Use trade routes

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
  });
  

module.exports = app;
