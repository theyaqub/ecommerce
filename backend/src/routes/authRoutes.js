/**
 * Authentication Routes
 * 
 * Handles user registration and login.
 * Returns JWT tokens for authenticated users.
 */

const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');   // For password hashing
const jwt = require('jsonwebtoken'); // For creating auth tokens
const { pool } = require('../config/database');

/**
 * POST /api/auth/register
 * 
 * Register a new user account.
 * Password is hashed before storing in database.
 * New users get 'user' role by default (set in database).
 * 
 * Request body: { email, name, password }
 * Response: { id, email, name }
 */
router.post('/register', async (req, res) => {
    const { email, name, password } = req.body;

    try {
        // Hash password with bcrypt (10 salt rounds)
        // Never store plain text passwords!
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert new user into database
        const result = await pool.query(
            'INSERT INTO users (email, name, password_hash) VALUES ($1, $2, $3) RETURNING id, email, name',
            [email, name, hashedPassword]
        );

        // Return created user (without password)
        res.status(201).json(result.rows[0]);
    } catch (err) {
        // Email already exists or other error
        res.status(400).json({ error: err.message });
    }
});

/**
 * POST /api/auth/login
 * 
 * Authenticate user and return JWT token.
 * Token contains user id, email, and role.
 * Token expires in 24 hours.
 * 
 * Request body: { email, password }
 * Response: { token, user: { id, email, name, role } }
 */
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find user by email
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

        // User not found
        if (result.rows.length === 0) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const user = result.rows[0];

        // Compare provided password with stored hash
        const validPassword = await bcrypt.compare(password, user.password_hash);

        // Wrong password
        if (!validPassword) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Create JWT token with user info
        // This token is sent with each request to protected routes
        const token = jwt.sign(
            {
                id: user.id,
                email: user.email,
                role: user.role  // Include role for authorization checks
            },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }  // Token expires in 24 hours
        );

        // Return token and user info
        res.json({
            token,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role
            }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;