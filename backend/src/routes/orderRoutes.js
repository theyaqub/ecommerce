const express = require('express');
const router = express.Router();
const { pool } = require('../config/database');

// Get order by ID
router.get('/:id', async (req, res) => {
    try {
        const order = await pool.query('SELECT * FROM orders WHERE id = $1', [req.params.id]);
        const items = await pool.query(
            'SELECT oi.*, p.name FROM order_items oi JOIN products p ON oi.product_id = p.id WHERE oi.order_id = $1',
            [req.params.id]
        );
        res.json({ ...order.rows[0], items: items.rows });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Create new order
router.post('/', async (req, res) => {
    const { items, total, shipping_address } = req.body;
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        // Create order with shipping address
        const orderResult = await client.query(
            'INSERT INTO orders (total, shipping_address, status) VALUES ($1, $2, $3) RETURNING *',
            [total, shipping_address || '', 'pending']
        );
        const orderId = orderResult.rows[0].id;

        // Add order items
        for (const item of items) {
            await client.query(
                'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ($1, $2, $3, $4)',
                [orderId, item.product_id, item.quantity, item.price]
            );
        }

        await client.query('COMMIT');
        res.status(201).json(orderResult.rows[0]);
    } catch (err) {
        await client.query('ROLLBACK');
        res.status(500).json({ error: err.message });
    } finally {
        client.release();
    }
});

module.exports = router;