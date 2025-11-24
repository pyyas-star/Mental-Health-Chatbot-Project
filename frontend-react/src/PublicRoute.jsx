/**
 * PublicRoute component - Route guard for public pages (login/register).
 * 
 * Redirects authenticated users to the dashboard.
 * Only renders children if user is not logged in.
 */

import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "./AuthProvider";

const PublicRoute = ({ children }) => {
    const { isLoggedIn } = useContext(AuthContext);
    
    return !isLoggedIn ? children : <Navigate to='/dashboard' />;
};

export default PublicRoute;
    return !isLoggedIn ? children : <Navigate to='/dashboard' />;
};

export default PublicRoute;
    return !isLoggedIn ? children : <Navigate to='/dashboard' />;
};

export default PublicRoute;
    return !isLoggedIn ? children : <Navigate to='/dashboard' />;
};

export default PublicRoute;