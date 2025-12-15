/**
 * API Service
 * 
 * Centralized API calls to the backend.
 * Uses axios for HTTP requests.
 * Handles authentication headers for protected routes.
 */

import axios from 'axios';

// Backend API base URL
const API_URL = 'http://localhost:5000/api';

/**
 * Get Authentication Header
 * 
 * Retrieves the JWT token from localStorage and returns
 * the Authorization header for protected API calls.
 * 
 * @returns Object with Authorization header or empty object
 */
const getAuthHeader = () => {
    // Only run on client side (not during SSR)
    if (typeof window !== 'undefined') {
        // Get auth data from Zustand's persist storage
        const authData = localStorage.getItem('auth-storage');

        if (authData) {
            const parsed = JSON.parse(authData);

            // Check if we have a token
            if (parsed.state?.token) {
                return { Authorization: `Bearer ${parsed.state.token}` };
            }
        }
    }
    return {};
};

/**
 * API Methods
 * 
 * All available API endpoints organized by feature.
 */
export const api = {
    // ==========================================
    // PRODUCTS - Public endpoints
    // ==========================================

    /** Get all products */
    getProducts: () => axios.get(`${API_URL}/products`),

    /** Get single product by ID */
    getProduct: (id: string) => axios.get(`${API_URL}/products/${id}`),

    // ==========================================
    // PRODUCTS - Admin endpoints (require auth)
    // ==========================================

    /** 
     * Create new product with image
     * Uses FormData for multipart upload
     */
    createProduct: (formData: FormData) =>
        axios.post(`${API_URL}/products`, formData, {
            headers: { ...getAuthHeader(), 'Content-Type': 'multipart/form-data' }
        }),

    /** 
     * Update existing product with optional new image
     */
    updateProduct: (id: string, formData: FormData) =>
        axios.put(`${API_URL}/products/${id}`, formData, {
            headers: { ...getAuthHeader(), 'Content-Type': 'multipart/form-data' }
        }),

    /** Delete product by ID */
    deleteProduct: (id: string) =>
        axios.delete(`${API_URL}/products/${id}`, { headers: getAuthHeader() }),

    // ==========================================
    // CATEGORIES
    // ==========================================

    /** Get all categories */
    getCategories: () => axios.get(`${API_URL}/categories`),

    // ==========================================
    // ORDERS
    // ==========================================

    /** Create new order with items and shipping info */
    createOrder: (data: { items: any[], total: number, shipping_address?: string }) =>
        axios.post(`${API_URL}/orders`, data),

    /** Get order by ID */
    getOrder: (id: string) => axios.get(`${API_URL}/orders/${id}`),

    // ==========================================
    // STATS - Admin Dashboard
    // ==========================================

    /** Get dashboard statistics (revenue, orders, etc.) */
    getStats: () => axios.get(`${API_URL}/stats`),

    // ==========================================
    // AUTHENTICATION
    // ==========================================

    /** 
     * Login user
     * Returns JWT token and user info
     */
    login: (email: string, password: string) =>
        axios.post(`${API_URL}/auth/login`, { email, password }),

    /** 
     * Register new user
     * Creates account with 'user' role
     */
    register: (email: string, name: string, password: string) =>
        axios.post(`${API_URL}/auth/register`, { email, name, password }),
};