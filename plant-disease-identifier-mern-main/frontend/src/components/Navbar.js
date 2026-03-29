/**
 * Navbar Component
 * Navigation header for the application
 * Provides consistent navigation across all pages
 */
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import AuthService from '../services/auth';

const Navbar = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);

    
    // Check if current path is active
    const isActive = (path) => location.pathname === path;
    
    // Check authentication status
    useEffect(() => {
        const checkAuth = () => {
            setIsAuthenticated(AuthService.isAuthenticated());
            setUser(AuthService.getCurrentUser());
        };
        
        checkAuth();
        
        // Listen for storage changes (for cross-tab sync)
        window.addEventListener('storage', checkAuth);
        
        // Custom event for auth changes within the app
        window.addEventListener('authChange', checkAuth);
        
        return () => {
            window.removeEventListener('storage', checkAuth);
            window.removeEventListener('authChange', checkAuth);
        };
    }, []);
    
    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-success">
            <div className="container">
                {/* Brand/Logo */}
                <Link className="navbar-brand fw-bold" to="/">
                    <i className="fas fa-leaf me-2"></i>
                    Horti-Helper
                </Link>
                
                {/* Mobile menu toggle */}
                <button 
                    className="navbar-toggler" 
                    type="button" 
                    data-bs-toggle="collapse" 
                    data-bs-target="#navbarNav"
                    aria-controls="navbarNav" 
                    aria-expanded="false" 
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>
                
                {/* Navigation items */}
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav ms-auto">
                        {isAuthenticated ? (
                            <>
                                <li className="nav-item">
                                    <Link 
                                        className={`nav-link ${isActive('/identify') ? 'active' : ''}`} 
                                        to="/identify"
                                    >
                                        <i className="fas fa-search me-1"></i>
                                        Identify Disease
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link 
                                        className={`nav-link ${isActive('/profile') ? 'active' : ''}`} 
                                        to="/profile"
                                    >
                                        <i className="fas fa-user-circle me-1"></i>
                                        {user?.name || 'Profile'}
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <button 
                                        className="nav-link btn btn-link" 
                                        onClick={() => {
                                            AuthService.logout();
                                            window.dispatchEvent(new Event('authChange'));
                                            navigate('/login');
                                        }}
                                    >
                                        <i className="fas fa-sign-out-alt me-1"></i>
                                        Logout
                                    </button>
                                </li>
                            </>
                        ) : (
                            <>
                                <li className="nav-item">
                                    <Link 
                                        className={`nav-link ${isActive('/login') ? 'active' : ''}`} 
                                        to="/login"
                                    >
                                        <i className="fas fa-sign-in-alt me-1"></i>
                                        Login
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link 
                                        className={`nav-link ${isActive('/register') ? 'active' : ''}`} 
                                        to="/register"
                                    >
                                        <i className="fas fa-user-plus me-1"></i>
                                        Register
                                    </Link>
                                </li>
                            </>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;