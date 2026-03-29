/**
 * Login Component
 * User login page with form validation and authentication
 * Handles user login and stores JWT token in localStorage
 */

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthService from '../services/auth';

const Login = () => {
    const navigate = useNavigate();
    
    // State management
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    
    // Check if user is already logged in
    useEffect(() => {
        if (AuthService.isAuthenticated()) {
            navigate('/');
        }
    }, [navigate]);
    
    /**
     * Handle input field changes
     */
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        
        // Clear error when user starts typing
        if (error) setError(null);
    };
    
    /**
     * Handle form submission
     */
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validation
        if (!formData.email || !formData.password) {
            setError('Please enter both email and password');
            return;
        }
        
        // Email format validation
        const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
        if (!emailRegex.test(formData.email)) {
            setError('Please enter a valid email address');
            return;
        }
        
        setLoading(true);
        setError(null);
        
        try {
            // Call login API
            const response = await AuthService.login(formData);
            
            if (response.success) {
                console.log('✅ Login successful:', response.data.user.name);
                window.dispatchEvent(new Event('authChange'));
                // Redirect to identification page (main app)
                navigate('/');
            } else {
                setError(response.message || 'Login failed');
            }
        } catch (err) {
            console.error('❌ Login error:', err.message);
            setError(err.message || 'Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };
    
    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-md-6 col-lg-5">
                    {/* Header */}
                    <div className="text-center mb-4">
                        <h1 className="h3 mb-3 fw-bold text-success">
                            <i className="fas fa-sign-in-alt me-2"></i>
                            Login to Your Account
                        </h1>
                        <p className="text-muted">
                            Access your plant disease identification history and profile
                        </p>
                    </div>
                    
                    {/* Error Display */}
                    {error && (
                        <div className="alert alert-danger alert-dismissible fade show" role="alert">
                            <i className="fas fa-exclamation-triangle me-2"></i>
                            {error}
                            <button 
                                type="button" 
                                className="btn-close" 
                                onClick={() => setError(null)}
                            ></button>
                        </div>
                    )}
                    
                    {/* Login Form */}
                    <div className="card shadow-sm">
                        <div className="card-body p-4">
                            <form onSubmit={handleSubmit}>
                                {/* Email Field */}
                                <div className="mb-3">
                                    <label htmlFor="email" className="form-label fw-bold">
                                        <i className="fas fa-envelope me-2 text-success"></i>
                                        Email Address
                                    </label>
                                    <input
                                        type="email"
                                        className="form-control form-control-lg"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="Enter your email"
                                        required
                                        disabled={loading}
                                    />
                                </div>
                                
                                {/* Password Field */}
                                <div className="mb-3">
                                    <label htmlFor="password" className="form-label fw-bold">
                                        <i className="fas fa-lock me-2 text-success"></i>
                                        Password
                                    </label>
                                    <div className="input-group">
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            className="form-control form-control-lg"
                                            id="password"
                                            name="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            placeholder="Enter your password"
                                            required
                                            disabled={loading}
                                        />
                                        <button
                                            type="button"
                                            className="btn btn-outline-secondary"
                                            onClick={() => setShowPassword(!showPassword)}
                                            disabled={loading}
                                        >
                                            <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                                        </button>
                                    </div>
                                </div>
                                
                                {/* Remember Me (Optional) */}
                                <div className="mb-3 form-check">
                                    <input
                                        type="checkbox"
                                        className="form-check-input"
                                        id="rememberMe"
                                        disabled={loading}
                                    />
                                    <label className="form-check-label" htmlFor="rememberMe">
                                        Remember me
                                    </label>
                                </div>
                                
                                {/* Submit Button */}
                                <div className="d-grid gap-2 mb-3">
                                    <button
                                        type="submit"
                                        className="btn btn-success btn-lg"
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                                Logging in...
                                            </>
                                        ) : (
                                            <>
                                                <i className="fas fa-sign-in-alt me-2"></i>
                                                Login
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                            
                            {/* Divider */}
                            <hr className="my-4" />
                            
                            {/* Links */}
                            <div className="text-center">
                                <p className="mb-2">
                                    Don't have an account?{' '}
                                    <Link to="/register" className="text-success fw-bold">
                                        Register here
                                    </Link>
                                </p>
                                <p className="mb-0">
                                    <Link to="/" className="text-muted">
                                        <i className="fas fa-home me-1"></i>
                                        Back to Home
                                    </Link>
                                </p>
                            </div>
                        </div>
                    </div>
                    
                    {/* Security Note */}
                    <div className="mt-4 text-center">
                        <div className="alert alert-info" role="alert">
                            <small>
                                <i className="fas fa-shield-alt me-1"></i>
                                Your information is secure and encrypted. We never store passwords in plain text.
                            </small>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;