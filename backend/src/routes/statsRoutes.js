const express = require('express');
const router = express.Router();
const { pool } = require('../config/database');

// Get dashboard stats
router.get('/', async (req, res) => {
    try {
        // Get total revenue from orders
        const revenueResult = await pool.query('SELECT COALESCE(SUM(total), 0) as revenue FROM orders');

        // Get total orders count
        const ordersResult = await pool.query('SELECT COUNT(*) as count FROM orders');

        // Get total products count
        const productsResult = await pool.query('SELECT COUNT(*) as count FROM products');

        // Get total stock
        const stockResult = await pool.query('SELECT COALESCE(SUM(stock), 0) as total_stock FROM products');

        // Get recent orders
        const recentOrdersResult = await pool.query(`
            SELECT o.id, o.total, o.status, o.created_at
            FROM orders o
            ORDER BY o.created_at DESC
            LIMIT 5
        `);

        // Get top products (by stock for now, would be by sales in real app)
        const topProductsResult = await pool.query(`
            SELECT p.id, p.name, p.stock, c.name as category_name
            FROM products p
            LEFT JOIN categories c ON p.category_id = c.id
            ORDER BY p.stock DESC
            LIMIT 5
        `);

        res.json({
            stats: {
                revenue: parseFloat(revenueResult.rows[0].revenue),
                orders: parseInt(ordersResult.rows[0].count),
                products: parseInt(productsResult.rows[0].count),
                totalStock: parseInt(stockResult.rows[0].total_stock)
            },
            recentOrders: recentOrdersResult.rows,
            topProducts: topProductsResult.rows
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
