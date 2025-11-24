import React, { useState } from "react";
import axiosInstance from '../axiosInstance';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';



function Register() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({});
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);


    const handleRegistration = async (e) => {
        e.preventDefault();

        const userData = { username, email, password };
        setLoading(true)

        try {
            const response = await axiosInstance.post('/register/', userData);

            setErrors({});
            setSuccess(true);
        } catch (error) {
            if (error.response) {
                setErrors(error.response.data);
                console.error('Registration error: ', error.response.data);
            } else if (error.request) {
                console.error("No response from server:", error.request);
                setErrors({ general: "No response from server. Please try again later." });
            } else {
                console.error("Unexpected error:", error.message);
                setErrors({ general: "Unexpected error: " + error.message });
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='container'>
            <div className='row justify-content-center'>
                <div className='col-md-6 bg-light-dark p-5 rounded'>
                    <h3 className='text-light text-center mb-4'>Create an Account</h3>

                    {errors.general && <div className="alert alert-danger">{errors.general}</div>}

                    <form onSubmit={handleRegistration}>
                        <div className="mb-3">
                            <input
                                type='text'
                                className='form-control mb-1'
                                placeholder='Enter Username'
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                            {errors.username && <small className='text-danger'>{errors.username}</small>}
                        </div>
                        <div className="mb-3">
                            <input
                                type='email'
                                className='form-control mb-1'
                                placeholder='Enter Email Address'
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            {errors.email && <small className='text-danger'>{errors.email}</small>}
                        </div>
                        <div className="mb-3">
                            <input
                                type='password'
                                className='form-control mb-3'
                                placeholder='Set Password'
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            {errors.password && <small className='text-danger'>{errors.password}</small>}
                        </div>
                        {success && <div className="alert alert-success" role='alert'>Registration Successful!</div>}
                        {loading ? (
                            <button type='submit' className='btn btn-info d-block mx-auto mt-3' disabled><FontAwesomeIcon icon={faSpinner} spin /> Please wait...</button>
                        ) : (
                            <button type='submit' className='btn btn-info d-block mx-auto mt-3'>Register</button>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Register;
