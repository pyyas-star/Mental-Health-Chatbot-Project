/**
 * Header component - Navigation bar with authentication-aware menu.
 * 
 * Displays different navigation options based on user authentication status.
 * Shows login/register buttons for guests, dashboard/logout for authenticated users.
 */
import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../AuthProvider";

function Header() {
    const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        setIsLoggedIn(false);
        navigate("/login");
    };

    const handleDashboard = () => {
        navigate("/dashboard");
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
            <div className="container-fluid px-4">
                <Link to='/' className="navbar-brand d-flex align-items-center" style={{ fontSize: '24px', fontWeight: '600' }}>
                    <span style={{ marginRight: '8px' }}>💭</span>
                    Mental Health Companion
                </Link>

                <div className="ms-auto d-flex gap-2">
                    {isLoggedIn ? (
                        <>
                            <button
                                className="btn btn-light me-2"
                                onClick={handleDashboard}
                                style={{ fontWeight: '500' }}
                            >
                                Dashboard
                            </button>
                            <button
                                className="btn btn-outline-light"
                                onClick={handleLogout}
                                style={{ fontWeight: '500' }}
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link className="btn btn-light me-2" to="/login" style={{ fontWeight: '500' }}>Login</Link>
                            <Link className="btn btn-outline-light" to="/register" style={{ fontWeight: '500' }}>Register</Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}

export default Header;