/**
 * Express Server Entry Point
 * 
 * This is the main file that starts the Express server.
 * It configures middleware, routes, and initializes the database.
 */

const express = require('express');
const cors = require('cors');

// Import route handlers
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const orderRoutes = require('./routes/orderRoutes');
const statsRoutes = require('./routes/statsRoutes');

// Import database initialization function
const { initDatabase } = require('./config/database');

// Load environment variables
require('dotenv').config();

// Create Express app instance
const app = express();

/**
 * Middleware Configuration
 */

// Enable CORS for frontend requests
// This allows the frontend (localhost:3000) to call our API
app.use(cors({
    origin: 'http://localhost:3000', // Frontend URL
    credentials: true
}));

// Parse JSON request bodies
// This allows us to access req.body for JSON payloads
app.use(express.json());

/**
 * API Routes
 * 
 * All routes are prefixed with /api
 * Example: /api/products, /api/auth/login
 */
app.use('/api/products', productRoutes);     // Product CRUD
app.use('/api/categories', categoryRoutes);  // Category management
app.use('/api/orders', orderRoutes);         // Order management
app.use('/api/stats', statsRoutes);          // Admin dashboard stats
app.use('/api/auth', authRoutes);            // Authentication

/**
 * Health Check Endpoint
 * 
 * Used to verify the server is running.
 * Access at: GET /api/health
 */
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK' });
});

/**
 * Server Startup
 * 
 * 1. Initialize database tables (create if not exist)
 * 2. Start listening for requests
 */
const PORT = process.env.PORT || 5000;

initDatabase()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        });
    })
    .catch(err => {
        console.error('Failed to initialize database:', err);
        process.exit(1);
    });