require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { PrismaClient } = require('@prisma/client');
const routes = require('./routes');
const { errorHandler } = require('./middleware/errorHandler');
const { authenticateJWT } = require('./middleware/auth');
const logger = require('./utils/logger');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 4000;

// Initialize Prisma client
const prisma = new PrismaClient();

// Middleware
app.use(helmet()); // Security headers
app.use(cors()); // Enable CORS
app.use(express.json()); // Parse JSON requests
app.use(morgan('dev', { stream: { write: message => logger.info(message.trim()) } })); // Request logging

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date() });
});

// API documentation
app.get('/api/docs', (req, res) => {
  res.status(200).json({
    api: 'Music Rehearsal Scheduler API',
    version: '1.0.0',
    documentation: 'API documentation will be available here'
  });
});

// Apply JWT authentication to all API routes except auth routes
app.use('/api', (req, res, next) => {
  if (req.path.startsWith('/auth')) {
    return next();
  }
  return authenticateJWT(req, res, next);
});

// Register all routes
app.use('/api', routes);

// Error handling middleware
app.use(errorHandler);

// Start the server
const server = app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM signal received: closing HTTP server');
  server.close(async () => {
    logger.info('HTTP server closed');
    await prisma.$disconnect();
    process.exit(0);
  });
});

module.exports = { app, prisma };