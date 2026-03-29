/**
 * Home Component
 * Landing page of the application
 * Provides overview and navigation to main features
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AuthService from '../services/auth';

const Home = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    
    // Check authentication status
    useEffect(() => {
        const checkAuth = () => {
            setIsAuthenticated(AuthService.isAuthenticated());
            setUser(AuthService.getCurrentUser());
        };
        
        checkAuth();
        
        // Listen for storage changes (for cross-tab sync)
        window.addEventListener('storage', checkAuth);
        window.addEventListener('authChange', checkAuth);
        
        return () => {
            window.removeEventListener('storage', checkAuth);
            window.removeEventListener('authChange', checkAuth);
        };
    }, []);
    
    return (
        <div className="container py-5">
            {/* Hero Section */}
            <div className="row align-items-center mb-5">
                <div className="col-lg-6">
                    {isAuthenticated && user ? (
                        <div className="alert alert-success mb-4">
                            <h4 className="alert-heading">
                                <i className="fas fa-user-circle me-2"></i>
                                Welcome back, {user.name}!
                            </h4>
                            <p className="mb-0">
                                <Link to="/profile" className="alert-link ms-2">
                                    View Profile
                                </Link>
                            </p>
                        </div>
                    ) : (
                        <div className="alert alert-info mb-4">
                            <h4 className="alert-heading">
                                <i className="fas fa-info-circle me-2"></i>
                                Welcome to Plant Disease Identifier!
                            </h4>
                            <p className="mb-0">
                                Please <Link to="/login" className="alert-link">login</Link> or 
                                <Link to="/register" className="alert-link">register</Link> to access all features and save your identification history.
                            </p>
                        </div>
                    )}
                    
                    <h1 className="display-4 fw-bold text-success mb-4">
                        <i className="fas fa-seedling me-3"></i>
                        Horti-Helper
                    </h1>
                    <p className="lead text-muted mb-4">
                        Identify plant diseases quickly and accurately using our symptom-based analysis system. 
                        Get immediate recommendations for treatment and prevention.
                    </p>
                    <p className="mb-4">
                        Our rule-based system analyzes the symptoms you observe and matches them with 
                        known plant diseases to provide you with the most likely diagnosis and actionable solutions.
                    </p>
                    <Link to="/identify" className="btn btn-success btn-lg">
                        <i className="fas fa-search me-2"></i>
                        Start Identifying
                    </Link>
                </div>
                <div className="col-lg-6">
                    <div className="text-center">
                        <i className="fas fa-leaf text-success" style={{ fontSize: '200px' }}></i>
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <div className="row g-4 mb-5">
                <div className="col-md-4">
                    <div className="card h-100 shadow-sm">
                        <div className="card-body text-center p-4">
                            <i className="fas fa-list-ul text-success mb-3" style={{ fontSize: '48px' }}></i>
                            <h5 className="card-title">Select Symptoms</h5>
                            <p className="card-text">
                                Choose your plant type and select the visible symptoms from our comprehensive list 
                                of common plant disease indicators.
                            </p>
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="card h-100 shadow-sm">
                        <div className="card-body text-center p-4">
                            <i className="fas fa-brain text-success mb-3" style={{ fontSize: '48px' }}></i>
                            <h5 className="card-title">Smart Analysis</h5>
                            <p className="card-text">
                                Our rule-based system analyzes your selected symptoms and compares them 
                                with our database of known plant diseases.
                            </p>
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="card h-100 shadow-sm">
                        <div className="card-body text-center p-4">
                            <i className="fas fa-lightbulb text-success mb-3" style={{ fontSize: '48px' }}></i>
                            <h5 className="card-title">Get Solutions</h5>
                            <p className="card-text">
                                Receive detailed information about identified diseases, including causes, 
                                preventive measures, and treatment recommendations.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* How It Works Section */}
            <div className="row mb-5">
                <div className="col-12">
                    <h2 className="text-center mb-5 text-success">How It Works</h2>
                </div>
                <div className="col-md-3 text-center">
                    <div className="mb-3">
                        <span className="badge bg-success rounded-pill" style={{ fontSize: '24px', width: '50px', height: '50px', lineHeight: '40px' }}>1</span>
                    </div>
                    <h5>Select Plant Type</h5>
                    <p className="text-muted">Choose the type of plant you're examining from our comprehensive list.</p>
                </div>
                <div className="col-md-3 text-center">
                    <div className="mb-3">
                        <span className="badge bg-success rounded-pill" style={{ fontSize: '24px', width: '50px', height: '50px', lineHeight: '40px' }}>2</span>
                    </div>
                    <h5>Identify Symptoms</h5>
                    <p className="text-muted">Select all the symptoms you observe on your plant's leaves, stems, or fruits.</p>
                </div>
                <div className="col-md-3 text-center">
                    <div className="mb-3">
                        <span className="badge bg-success rounded-pill" style={{ fontSize: '24px', width: '50px', height: '50px', lineHeight: '40px' }}>3</span>
                    </div>
                    <h5>Get Diagnosis</h5>
                    <p className="text-muted">Our system analyzes your input and provides the most likely disease matches.</p>
                </div>
                <div className="col-md-3 text-center">
                    <div className="mb-3">
                        <span className="badge bg-success rounded-pill" style={{ fontSize: '24px', width: '50px', height: '50px', lineHeight: '40px' }}>4</span>
                    </div>
                    <h5>Apply Treatment</h5>
                    <p className="text-muted">Follow the recommended treatment and prevention measures provided.</p>
                </div>
            </div>

            {/* Supported Plants Section */}
            <div className="row mb-5">
                <div className="col-12">
                    <h2 className="text-center mb-4 text-success">Supported Plants</h2>
                    <p className="text-center text-muted mb-4">
                        Our system currently supports identification of diseases in these common crops:
                    </p>
                </div>
                <div className="col-md-2 col-4 text-center mb-3">
                    <div className="p-3 border rounded">
                        <i className="fas fa-apple-alt text-success mb-2" style={{ fontSize: '24px' }}></i>
                        <div className="small">Tomato</div>
                    </div>
                </div>
                <div className="col-md-2 col-4 text-center mb-3">
                    <div className="p-3 border rounded">
                        <i className="fas fa-carrot text-success mb-2" style={{ fontSize: '24px' }}></i>
                        <div className="small">Potato</div>
                    </div>
                </div>
                <div className="col-md-2 col-4 text-center mb-3">
                    <div className="p-3 border rounded">
                        <i className="fas fa-wheat-awn text-success mb-2" style={{ fontSize: '24px' }}></i>
                        <div className="small">Rice</div>
                    </div>
                </div>
                <div className="col-md-2 col-4 text-center mb-3">
                    <div className="p-3 border rounded">
                        <i className="fas fa-bread-slice text-success mb-2" style={{ fontSize: '24px' }}></i>
                        <div className="small">Wheat</div>
                    </div>
                </div>
                <div className="col-md-2 col-4 text-center mb-3">
                    <div className="p-3 border rounded">
                        <i className="fas fa-pepper-hot text-success mb-2" style={{ fontSize: '24px' }}></i>
                        <div className="small">Chili</div>
                    </div>
                </div>
                <div className="col-md-2 col-4 text-center mb-3">
                    <div className="p-3 border rounded">
                        <i className="fas fa-plus text-success mb-2" style={{ fontSize: '24px' }}></i>
                        <div className="small">More Soon</div>
                    </div>
                </div>
            </div>

            {/* Call to Action */}
            <div className="row">
                <div className="col-12 text-center">
                    <div className="bg-light p-5 rounded">
                        <h3 className="mb-3 text-success">Ready to Identify Plant Diseases?</h3>
                        <p className="mb-4 text-muted">
                            Start by selecting your plant type and symptoms to get accurate disease identification.
                        </p>
                        <Link to="/identify" className="btn btn-success btn-lg">
                            <i className="fas fa-search me-2"></i>
                            Begin Identification
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;