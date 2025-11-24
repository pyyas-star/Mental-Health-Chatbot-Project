/**
 * Authentication Context Provider.
 * 
 * Manages global authentication state and provides it to all child components.
 * Listens for changes in localStorage to keep auth state synchronized.
 */

import { useState, createContext, useEffect } from 'react';

// Create authentication context
const AuthContext = createContext();

/**
 * AuthProvider component - wraps the app with authentication context.
 * 
 * @param {Object} props - Component props
 * @param {ReactNode} props.children - Child components
 */
const AuthProvider = ({ children }) => {
    // Initialize auth state from localStorage (safely check if window is available)
    const [isLoggedIn, setIsLoggedIn] = useState(() => {
        if (typeof window !== 'undefined') {
            return !!localStorage.getItem('accessToken');
        }
        return false;
    });

    // Listen for storage changes (e.g., when user logs in/out in another tab)
    useEffect(() => {
        const handleStorageChange = () => {
            setIsLoggedIn(!!localStorage.getItem('accessToken'));
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    return (
        <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
export { AuthContext };