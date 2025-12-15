/**
 * Authentication Store
 * 
 * Manages user authentication state using Zustand.
 * Persists auth data to localStorage so users stay logged in.
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * User Interface
 * 
 * Represents the logged-in user's data.
 */
interface User {
    id: number;
    email: string;
    name: string;
    role: string;  // 'user' or 'admin'
}

/**
 * Auth Store Interface
 * 
 * Defines the shape of our auth state and actions.
 */
interface AuthStore {
    token: string | null;      // JWT token for API calls
    user: User | null;         // Current user info
    isAuthenticated: boolean;  // Quick check if logged in
    login: (token: string, user: User) => void;   // Set auth state
    logout: () => void;        // Clear auth state
}

/**
 * Auth Store
 * 
 * Created with Zustand + persist middleware.
 * State is automatically saved to localStorage under 'auth-storage' key.
 * 
 * Usage:
 *   const { isAuthenticated, user, login, logout } = useAuthStore();
 */
export const useAuthStore = create<AuthStore>()(
    persist(
        (set) => ({
            // Initial state - not logged in
            token: null,
            user: null,
            isAuthenticated: false,

            /**
             * Login Action
             * 
             * Called after successful login API call.
             * Stores token and user info.
             */
            login: (token, user) => set({
                token,
                user,
                isAuthenticated: true
            }),

            /**
             * Logout Action
             * 
             * Clears all auth data.
             * User will need to login again.
             */
            logout: () => set({
                token: null,
                user: null,
                isAuthenticated: false
            }),
        }),
        {
            name: 'auth-storage',  // localStorage key
        }
    )
);
