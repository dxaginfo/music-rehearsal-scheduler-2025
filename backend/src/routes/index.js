const express = require('express');
const router = express.Router();

// Import route modules
const authRoutes = require('./authRoutes');
const userRoutes = require('./userRoutes');
const bandRoutes = require('./bandRoutes');
const rehearsalRoutes = require('./rehearsalRoutes');
const locationRoutes = require('./locationRoutes');
const pollRoutes = require('./pollRoutes');

// Register routes
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/bands', bandRoutes);
router.use('/rehearsals', rehearsalRoutes);
router.use('/locations', locationRoutes);
router.use('/polls', pollRoutes);

module.exports = router;