/**
 * Authentication Middleware
 * 
 * This file contains middleware functions to protect routes.
 * It verifies JWT tokens and checks user roles.
 */

const jwt = require('jsonwebtoken');

/**
 * Auth Middleware - Verifies JWT Token
 * 
 * Checks if the request has a valid JWT token in the Authorization header.
 * If valid, adds the decoded user info to req.user
 * If invalid, returns 401 Unauthorized
 * 
 * Usage: router.get('/protected', authMiddleware, handler)
 */
const authMiddleware = (req, res, next) => {
    // Get the Authorization header (format: "Bearer <token>")
    const authHeader = req.headers.authorization;

    // No token provided
    if (!authHeader) {
        return res.status(401).json({ error: 'No token provided' });
    }

    // Extract token from "Bearer <token>" format
    const token = authHeader.split(' ')[1];

    try {
        // Verify and decode the token using our secret key
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Add user info to request object for use in route handlers
        req.user = decoded;

        // Continue to the next middleware/handler
        next();
    } catch (err) {
        // Token is invalid or expired
        return res.status(401).json({ error: 'Invalid token' });
    }
};

/**
 * Admin Middleware - Checks Admin Role
 * 
 * MUST be used AFTER authMiddleware.
 * Checks if the authenticated user has the 'admin' role.
 * 
 * Usage: router.post('/admin-only', authMiddleware, adminMiddleware, handler)
 */
const adminMiddleware = (req, res, next) => {
    // Check if user has admin role (set by authMiddleware)
    if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Admin access required' });
    }

    // User is admin, continue
    next();
};

/**
 * Combined Admin Auth Middleware
 * 
 * Convenience array that combines both auth and admin checks.
 * Use this for routes that require admin access.
 * 
 * Usage: router.delete('/products/:id', adminAuth, handler)
 */
const adminAuth = [authMiddleware, adminMiddleware];

module.exports = { authMiddleware, adminMiddleware, adminAuth };