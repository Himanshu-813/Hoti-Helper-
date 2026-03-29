/**
 * Profile Component
 * User profile page - Simplified version without stats and history
 * Displays basic user information only
 */

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthService from '../services/auth';

const Profile = () => {
    const navigate = useNavigate();
    
    // State management
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // Check if user is logged in
    useEffect(() => {
        if (!AuthService.isAuthenticated()) {
            navigate('/login');
            return;
        }
        
        fetchProfile();
    }, [navigate]);
    
    /**
     * Fetch user profile
     */
    const fetchProfile = async () => {
        try {
            setLoading(true);
            const response = await AuthService.getProfile();
            
            if (response.success) {
                setUser(response.data.user);
            } else {
                setError(response.message || 'Failed to load profile');
            }
        } catch (err) {
            console.error('❌ Profile fetch error:', err.message);
            setError(err.message || 'Failed to load profile');
            
            // If unauthorized, redirect to login
            if (err.message.includes('No token found') || err.message.includes('Invalid or expired token')) {
                AuthService.logout();
                navigate('/login');
            }
        } finally {
            setLoading(false);
        }
    };
    
    /**
     * Handle logout
     */
    const handleLogout = () => {
        AuthService.logout();
        navigate('/login');
    };
    
    /**
     * Format date for display
     */
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };
    
    if (loading) {
        return (
            <div className="container py-5 text-center">
                <div className="spinner-border text-success" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-3 text-muted">Loading your profile...</p>
            </div>
        );
    }
    
    if (error) {
        return (
            <div className="container py-5">
                <div className="row justify-content-center">
                    <div className="col-md-6">
                        <div className="alert alert-danger" role="alert">
                            <i className="fas fa-exclamation-triangle me-2"></i>
                            {error}
                        </div>
                        <div className="text-center">
                            <Link to="/login" className="btn btn-success">
                                <i className="fas fa-sign-in-alt me-2"></i>
                                Login Again
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
    
    return (
        <div className="container py-5">
            <div className="row">
                <div className="col-12">
                    {/* Header */}
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <div>
                            <h1 className="h3 mb-1 fw-bold text-success">
                                <i className="fas fa-user-circle me-2"></i>
                                My Profile
                            </h1>
                            <p className="text-muted mb-0">
                                Welcome back, {user?.name}!
                            </p>
                        </div>
                        <div>
                            <button
                                className="btn btn-outline-danger"
                                onClick={handleLogout}
                            >
                                <i className="fas fa-sign-out-alt me-2"></i>
                                Logout
                            </button>
                        </div>
                    </div>
                    
                    {/* Profile Information */}
                    <div className="row">
                        <div className="col-md-8">
                            <div className="card shadow-sm">
                                <div className="card-header bg-success text-white">
                                    <h5 className="mb-0">
                                        <i className="fas fa-user me-2"></i>
                                        Profile Details
                                    </h5>
                                </div>
                                <div className="card-body">
                                    <div className="row">
                                        <div className="col-md-6 mb-3">
                                            <label className="fw-bold text-muted">Full Name</label>
                                            <p className="mb-0">{user?.name}</p>
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <label className="fw-bold text-muted">Email Address</label>
                                            <p className="mb-0">{user?.email}</p>
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <label className="fw-bold text-muted">Location</label>
                                            <p className="mb-0">{user?.profile?.location || 'Not provided'}</p>
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <label className="fw-bold text-muted">Occupation</label>
                                            <p className="mb-0">{user?.profile?.occupation || 'Not provided'}</p>
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <label className="fw-bold text-muted">Account Type</label>
                                            <p className="mb-0">
                                                <span className={`badge ${user?.role === 'admin' ? 'bg-danger' : 'bg-success'}`}>
                                                    {user?.role?.toUpperCase() || 'USER'}
                                                </span>
                                            </p>
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <label className="fw-bold text-muted">Member Since</label>
                                            <p className="mb-0">{user?.createdAt ? formatDate(user.createdAt) : 'Unknown'}</p>
                                        </div>
                                        {user?.lastLogin && (
                                            <div className="col-md-6 mb-3">
                                                <label className="fw-bold text-muted">Last Login</label>
                                                <p className="mb-0">{formatDate(user.lastLogin)}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="card shadow-sm">
                                <div className="card-header bg-info text-white">
                                    <h5 className="mb-0">
                                        <i className="fas fa-cog me-2"></i>
                                        Quick Actions
                                    </h5>
                                </div>
                                <div className="card-body">
                                    <div className="d-grid gap-2">
                                        <Link to="/identify" className="btn btn-success">
                                            <i className="fas fa-search me-2"></i>
                                            New Identification
                                        </Link>
                                        <Link to="/" className="btn btn-outline-secondary">
                                            <i className="fas fa-home me-2"></i>
                                            Back to Home
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;