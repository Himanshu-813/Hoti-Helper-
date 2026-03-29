/**
 * ProtectedRoute Component
 * Higher-order component that wraps routes requiring authentication
 * Redirects to login page if user is not authenticated
 */

import React from 'react';
import { Navigate } from 'react-router-dom';
import AuthService from '../services/auth';

const ProtectedRoute = ({ children }) => {
    // Check if user is authenticated
    const isAuthenticated = AuthService.isAuthenticated();
    
    if (!isAuthenticated) {
        // Redirect to login page if not authenticated
        return <Navigate to="/login" replace />;
    }
    
    // Render the protected content if authenticated
    return children;
};

export default ProtectedRoute;