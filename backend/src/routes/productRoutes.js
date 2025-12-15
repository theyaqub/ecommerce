/**
 * Product Routes
 * 
 * CRUD operations for products.
 * GET routes are public, POST/PUT/DELETE require admin auth.
 * Supports image upload via Cloudinary.
 */

const express = require('express');
const router = express.Router();
const { pool } = require('../config/database');
const { upload } = require('../config/cloudinary');  // Multer with Cloudinary storage
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

/**
 * GET /api/products
 * 
 * Get all products with their category names.
 * Public route - no authentication required.
 * 
 * Response: Array of products with category_name
 */
router.get('/', async (req, res) => {
    try {
        // Join with categories to get category name
        const result = await pool.query(`
            SELECT p.*, c.name as category_name 
            FROM products p 
            LEFT JOIN categories c ON p.category_id = c.id
        `);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * GET /api/products/:id
 * 
 * Get a single product by ID.
 * Public route.
 * 
 * Response: Single product object
 */
router.get('/:id', async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT p.*, c.name as category_name FROM products p LEFT JOIN categories c ON p.category_id = c.id WHERE p.id = $1',
            [req.params.id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Product not found' });
        }

        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * POST /api/products
 * 
 * Create a new product with optional image upload.
 * ADMIN ONLY - requires authentication and admin role.
 * 
 * Request: multipart/form-data with 'image' file and product fields
 * Response: Created product object
 */
router.post('/', authMiddleware, adminMiddleware, upload.single('image'), async (req, res) => {
    const { name, price, description, stock, category_id } = req.body;

    // If image was uploaded, get the Cloudinary URL
    const image_url = req.file ? req.file.path : null;

    try {
        const result = await pool.query(
            'INSERT INTO products (name, price, description, image_url, stock, category_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [name, price, description, image_url, stock, category_id]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * PUT /api/products/:id
 * 
 * Update an existing product with optional new image.
 * ADMIN ONLY.
 * 
 * Request: multipart/form-data with optional 'image' file
 * Response: Updated product object
 */
router.put('/:id', authMiddleware, adminMiddleware, upload.single('image'), async (req, res) => {
    const { name, price, description, stock, category_id } = req.body;

    try {
        // If new image uploaded, use it; otherwise keep existing URL from request body
        let image_url = req.body.image_url;
        if (req.file) {
            image_url = req.file.path;  // New Cloudinary URL
        }

        const result = await pool.query(
            'UPDATE products SET name=$1, price=$2, description=$3, image_url=$4, stock=$5, category_id=$6 WHERE id=$7 RETURNING *',
            [name, price, description, image_url, stock, category_id, req.params.id]
        );

        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * DELETE /api/products/:id
 * 
 * Delete a product by ID.
 * ADMIN ONLY.
 * 
 * Response: { message: 'Product deleted' }
 */
router.delete('/:id', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        await pool.query('DELETE FROM products WHERE id = $1', [req.params.id]);
        res.json({ message: 'Product deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;