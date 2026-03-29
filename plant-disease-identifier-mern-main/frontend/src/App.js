/**
 * App Component
 * Main application component that handles routing
 * Sets up the overall layout and navigation
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import DiseaseIdentifier from './components/DiseaseIdentifier';
import Login from './components/Login';
import Register from './components/Register';
import Profile from './components/Profile';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

function App() {
    return (
        <Router>
            <div className="App">
                {/* Navigation Bar - Always visible */}
                <Navbar />
                
                {/* Main Content Area */}
                <main className="main-content">
                    <Routes>
                        {/* Public Routes - No authentication required */}
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        
                        {/* Protected Routes - Authentication required */}
                        <Route path="/" element={
                            <ProtectedRoute>
                                <Home />
                            </ProtectedRoute>
                        } />
                        
                        <Route path="/identify" element={
                            <ProtectedRoute>
                                <DiseaseIdentifier />
                            </ProtectedRoute>
                        } />
                        
                        <Route path="/profile" element={
                            <ProtectedRoute>
                                <Profile />
                            </ProtectedRoute>
                        } />
                        
                        
                        
                        {/* 404 Page - Route for undefined paths */}
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </main>
                
                {/* Footer - Always visible */}
                <footer className="bg-light py-4 mt-5">
                    <div className="container text-center">
                        <p className="text-muted mb-2">
                            <i className="fas fa-leaf text-success me-2"></i>
                            Horti-Helper: Plant Disease Identifier
                        </p>
                        <p className="text-muted small mb-0">
                            Built with React, Node.js, Express, and MongoDB (MERN Stack)
                        </p>
                    </div>
                </footer>
            </div>
        </Router>
    );
}

/**
 * NotFound Component
 * Displays when user navigates to a non-existent route
 */
const NotFound = () => {
    return (
        <div className="container py-5 text-center">
            <div className="row">
                <div className="col-md-6 mx-auto">
                    <i className="fas fa-exclamation-triangle text-warning mb-4" style={{ fontSize: '80px' }}></i>
                    <h1 className="display-4 mb-3">404 - Page Not Found</h1>
                    <p className="text-muted mb-4">
                        The page you're looking for doesn't exist. 
                        Please check the URL or navigate using the menu above.
                    </p>
                    <a href="/" className="btn btn-success">
                        <i className="fas fa-home me-2"></i>
                        Go to Home
                    </a>
                </div>
            </div>
        </div>
    );
};

export default App;