/**
 * Database Configuration
 * 
 * This file sets up the PostgreSQL connection pool and initializes
 * the database tables with seed data if they don't exist.
 */

// Load environment variables before anything else
require('dotenv').config();

const { Pool } = require('pg');

/**
 * PostgreSQL Connection Pool
 * 
 * A pool manages multiple database connections for better performance.
 * Connection details are read from environment variables for security.
 */
const pool = new Pool({
    host: process.env.DB_HOST,         // Database server address (localhost for dev)
    port: process.env.DB_PORT,         // PostgreSQL port (default: 5432)
    database: process.env.DB_NAME,     // Name of the database
    user: process.env.DB_USER,         // Database user
    password: process.env.DB_PASSWORD, // Database password (keep secret!)
});

// Log successful connection
pool.on('connect', () => {
    console.log('Connected to PostgreSQL database');
});

// Handle connection errors
pool.on('error', (err) => {
    console.error('Unexpected error on idle client', err);
    process.exit(-1);
});

/**
 * Initialize Database Tables
 * 
 * Creates all required tables if they don't exist and seeds
 * with initial data for categories and products.
 */
const initDatabase = async () => {
    const client = await pool.connect();
    try {
        // Create all tables using a single query
        await client.query(`
            -- Categories table: stores product categories
            CREATE TABLE IF NOT EXISTS categories (
                id SERIAL PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                description TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );

            -- Products table: stores all products
            CREATE TABLE IF NOT EXISTS products (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                price DECIMAL(10, 2) NOT NULL,
                description TEXT,
                image_url VARCHAR(500),              -- Cloudinary URL for product image
                stock INTEGER DEFAULT 0,
                category_id INTEGER REFERENCES categories(id),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );

            -- Users table: stores customer and admin accounts
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                email VARCHAR(255) UNIQUE NOT NULL,
                name VARCHAR(255) NOT NULL,
                password_hash VARCHAR(255) NOT NULL,  -- bcrypt hashed password
                role VARCHAR(20) DEFAULT 'user',      -- 'user' or 'admin'
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );

            -- Orders table: stores customer orders
            CREATE TABLE IF NOT EXISTS orders (
                id SERIAL PRIMARY KEY,
                user_id INTEGER REFERENCES users(id),
                total DECIMAL(10, 2) NOT NULL,
                status VARCHAR(50) DEFAULT 'pending', -- pending, completed, cancelled
                shipping_address TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );

            -- Order items table: stores products in each order
            CREATE TABLE IF NOT EXISTS order_items (
                id SERIAL PRIMARY KEY,
                order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
                product_id INTEGER REFERENCES products(id),
                quantity INTEGER NOT NULL,
                price DECIMAL(10, 2) NOT NULL  -- Price at time of purchase
            );
        `);

        // Seed categories if table is empty
        const categoryCheck = await client.query('SELECT COUNT(*) FROM categories');
        if (parseInt(categoryCheck.rows[0].count) === 0) {
            await client.query(`
                INSERT INTO categories (name, description) VALUES
                ('Electronics', 'Electronic devices and accessories'),
                ('Furniture', 'Home and office furniture'),
                ('Wearables', 'Smart watches and fitness trackers'),
                ('Clothing', 'Apparel and fashion items');
            `);
        }

        // Seed products if table is empty
        const productCheck = await client.query('SELECT COUNT(*) FROM products');
        if (parseInt(productCheck.rows[0].count) === 0) {
            await client.query(`
                INSERT INTO products (name, price, description, stock, category_id) VALUES
                ('Premium Wireless Headphones', 299.99, 'Experience high-fidelity sound with our premium wireless headphones. Featuring active noise cancellation and 30-hour battery life.', 50, 1),
                ('Ergonomic Office Chair', 199.50, 'Work in comfort with this ergonomic mesh chair. Adjustable lumbar support and headrest.', 30, 2),
                ('Mechanical Gaming Keyboard', 129.00, 'Tactile mechanical switches for the ultimate gaming experience. RGB backlighting included.', 100, 1),
                ('Smart Fitness Watch', 149.99, 'Track your health metrics with precision. Waterproof and durable design.', 75, 3),
                ('Noise Cancelling Earbuds', 179.99, 'Compact earbuds with powerful noise cancellation technology.', 60, 1),
                ('Standing Desk Converter', 249.00, 'Transform any desk into a standing workspace. Smooth height adjustment.', 25, 2);
            `);
        }

        console.log('Database tables initialized successfully');
    } finally {
        client.release(); // Always release the client back to the pool
    }
};

module.exports = { pool, initDatabase };
