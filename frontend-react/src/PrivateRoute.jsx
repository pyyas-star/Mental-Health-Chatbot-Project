/**
 * PrivateRoute component - Route guard for protected pages.
 * 
 * Redirects unauthenticated users to the login page.
 * Only renders children if user is logged in.
 */

import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "./AuthProvider";

function PrivateRoute({ children }) {
    const { isLoggedIn } = useContext(AuthContext);
    
    return isLoggedIn ? children : <Navigate to='/login' />;
}

export default PrivateRoute;
