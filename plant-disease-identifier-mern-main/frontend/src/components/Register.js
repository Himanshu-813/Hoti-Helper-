/**
 * Register Component
 * User registration page with form validation
 * Creates new user accounts with secure password hashing
 */

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthService from '../services/auth';

const Register = () => {
    const navigate = useNavigate();
    
    // State management
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        location: '',
        occupation: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState({
        score: 0,
        label: '',
        color: ''
    });
    
    // Check if user is already logged in
    useEffect(() => {
        if (AuthService.isAuthenticated()) {
            navigate('/identify');
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
        
        // Check password strength when password changes
        if (name === 'password') {
            checkPasswordStrength(value);
        }
    };
    
    /**
     * Check password strength
     */
    const checkPasswordStrength = (password) => {
        let score = 0;
        let label = '';
        let color = '';
        
        if (password.length >= 6) score += 1;
        if (password.length >= 8) score += 1;
        if (/[a-z]/.test(password)) score += 1;
        if (/[A-Z]/.test(password)) score += 1;
        if (/[0-9]/.test(password)) score += 1;
        if (/[^A-Za-z0-9]/.test(password)) score += 1;
        
        if (score <= 2) {
            label = 'Weak';
            color = 'danger';
        } else if (score <= 4) {
            label = 'Medium';
            color = 'warning';
        } else {
            label = 'Strong';
            color = 'success';
        }
        
        setPasswordStrength({ score, label, color });
    };
    
    /**
     * Handle form submission
     */
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validation
        if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
            setError('Please fill in all required fields');
            return;
        }
        
        // Name validation
        if (formData.name.length < 2) {
            setError('Name must be at least 2 characters long');
            return;
        }
        
        // Email format validation
        const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
        if (!emailRegex.test(formData.email)) {
            setError('Please enter a valid email address');
            return;
        }
        
        // Password length validation
        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters long');
            return;
        }
        
        // Password match validation
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }
        
        setLoading(true);
        setError(null);
        
        try {
            // Prepare registration data (exclude confirmPassword)
            const { confirmPassword, ...registrationData } = formData;
            
            // Call registration API
            const response = await AuthService.register(registrationData);
            
            if (response.success) {
                console.log('✅ Registration successful:', response.data.user.name);
                
                // Show success message and redirect to main app
                alert('Registration successful! Welcome to Plant Disease Identifier.');
                navigate('/identify');
            } else {
                setError(response.message || 'Registration failed');
            }
        } catch (err) {
            console.error('❌ Registration error:', err.message);
            setError(err.message || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };
    
    /**
     * Get password strength progress bar width
     */
    const getPasswordStrengthWidth = () => {
        return Math.min((passwordStrength.score / 6) * 100, 100);
    };
    
    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-md-8 col-lg-6">
                    {/* Header */}
                    <div className="text-center mb-4">
                        <h1 className="h3 mb-3 fw-bold text-success">
                            <i className="fas fa-user-plus me-2"></i>
                            Create Your Account
                        </h1>
                        <p className="text-muted">
                            Join our community and start identifying plant diseases
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
                    
                    {/* Registration Form */}
                    <div className="card shadow-sm">
                        <div className="card-body p-4">
                            <form onSubmit={handleSubmit}>
                                {/* Name Field */}
                                <div className="mb-3">
                                    <label htmlFor="name" className="form-label fw-bold">
                                        <i className="fas fa-user me-2 text-success"></i>
                                        Full Name *
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control form-control-lg"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="Enter your full name"
                                        required
                                        disabled={loading}
                                    />
                                </div>
                                
                                {/* Email Field */}
                                <div className="mb-3">
                                    <label htmlFor="email" className="form-label fw-bold">
                                        <i className="fas fa-envelope me-2 text-success"></i>
                                        Email Address *
                                    </label>
                                    <input
                                        type="email"
                                        className="form-control form-control-lg"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="Enter your email address"
                                        required
                                        disabled={loading}
                                    />
                                    <div className="form-text">
                                        We'll never share your email with anyone else.
                                    </div>
                                </div>
                                
                                {/* Password Field */}
                                <div className="mb-3">
                                    <label htmlFor="password" className="form-label fw-bold">
                                        <i className="fas fa-lock me-2 text-success"></i>
                                        Password *
                                    </label>
                                    <div className="input-group">
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            className="form-control form-control-lg"
                                            id="password"
                                            name="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            placeholder="Create a password (min 6 characters)"
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
                                    
                                    {/* Password Strength Indicator */}
                                    {formData.password && (
                                        <div className="mt-2">
                                            <div className="d-flex justify-content-between align-items-center mb-1">
                                                <small className="text-muted">Password Strength:</small>
                                                <small className={`text-${passwordStrength.color}`}>
                                                    {passwordStrength.label}
                                                </small>
                                            </div>
                                            <div className="progress" style={{ height: '5px' }}>
                                                <div
                                                    className={`progress-bar bg-${passwordStrength.color}`}
                                                    role="progressbar"
                                                    style={{ width: `${getPasswordStrengthWidth()}%` }}
                                                    aria-valuenow={passwordStrength.score}
                                                    aria-valuemin="0"
                                                    aria-valuemax="6"
                                                ></div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                
                                {/* Confirm Password Field */}
                                <div className="mb-3">
                                    <label htmlFor="confirmPassword" className="form-label fw-bold">
                                        <i className="fas fa-lock me-2 text-success"></i>
                                        Confirm Password *
                                    </label>
                                    <div className="input-group">
                                        <input
                                            type={showConfirmPassword ? 'text' : 'password'}
                                            className="form-control form-control-lg"
                                            id="confirmPassword"
                                            name="confirmPassword"
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                            placeholder="Confirm your password"
                                            required
                                            disabled={loading}
                                        />
                                        <button
                                            type="button"
                                            className="btn btn-outline-secondary"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            disabled={loading}
                                        >
                                            <i className={`fas ${showConfirmPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                                        </button>
                                    </div>
                                </div>
                                
                                {/* Optional Fields */}
                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <label htmlFor="location" className="form-label fw-bold">
                                            <i className="fas fa-map-marker-alt me-2 text-success"></i>
                                            Location (Optional)
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control form-control-lg"
                                            id="location"
                                            name="location"
                                            value={formData.location}
                                            onChange={handleChange}
                                            placeholder="City, State"
                                            disabled={loading}
                                        />
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label htmlFor="occupation" className="form-label fw-bold">
                                            <i className="fas fa-briefcase me-2 text-success"></i>
                                            Occupation (Optional)
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control form-control-lg"
                                            id="occupation"
                                            name="occupation"
                                            value={formData.occupation}
                                            onChange={handleChange}
                                            placeholder="e.g., Farmer, Student"
                                            disabled={loading}
                                        />
                                    </div>
                                </div>
                                
                                {/* Terms and Conditions */}
                                <div className="mb-3 form-check">
                                    <input
                                        type="checkbox"
                                        className="form-check-input"
                                        id="terms"
                                        required
                                        disabled={loading}
                                    />
                                    <label className="form-check-label" htmlFor="terms">
                                        I agree to the terms and conditions and privacy policy *
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
                                                Creating Account...
                                            </>
                                        ) : (
                                            <>
                                                <i className="fas fa-user-plus me-2"></i>
                                                Create Account
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
                                    Already have an account?{' '}
                                    <Link to="/login" className="text-success fw-bold">
                                        Login here
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
                                Your password is securely hashed using bcrypt. We never store passwords in plain text.
                            </small>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;