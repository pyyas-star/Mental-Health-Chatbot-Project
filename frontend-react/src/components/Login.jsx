import React, { useContext, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import axiosInstance from "../axiosInstance";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../AuthProvider";

function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState({});
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});
        const userData = { username, password };

        try {
            const response = await axiosInstance.post("/token/", userData);
            localStorage.setItem('accessToken', response.data.access);
            localStorage.setItem('refreshToken', response.data.refresh);
            console.log("Login successful");
            setIsLoggedIn(true);
            navigate("/dashboard");

        } catch (error) {
            console.error("Invalid Credentials");
            setErrors({ general: "Invalid username or password" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container flex items-center justify-center flex-1">
            <div className="row justify-content-center">
                <div className="col-md-6 bg-light-dark p-5 rounded">
                    <h3 className="text-light text-center mb-4">
                        Login to Your Portal
                    </h3>
                    <form onSubmit={handleLogin}>
                        <div className="mb-3">
                            <input
                                type="text"
                                className="form-control mb-1"
                                placeholder="Enter Username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>
                        <div className="mb-3">
                            <input
                                type="password"
                                className="form-control mb-3"
                                placeholder="Enter Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        {errors.general && (
                            <div className="text-danger mb-3">
                                {errors.general}
                            </div>
                        )}

                        {loading ? (
                            <button
                                type="submit"
                                className="btn btn-info d-block mx-auto mt-3"
                                disabled
                            >
                                <FontAwesomeIcon icon={faSpinner} spin /> Logging in...
                            </button>
                        ) : (
                            <button
                                type="submit"
                                className="btn btn-info d-block mx-auto mt-3"
                            >
                                Login
                            </button>
                        )}
                    </form>
                    {success && (
                        <p className="text-success text-center mt-3">
                            Login successful!
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Login;
