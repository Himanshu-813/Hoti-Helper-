/**
 * Authentication Routes
 * This file contains all API endpoints related to user authentication
 * Routes: POST /api/auth/register, POST /api/auth/login, GET /api/auth/profile
 */

const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { AppError } = require('../middleware/errorHandler');

const router = express.Router();

/**
 * JWT Token Generation Helper Function
 * @param {String} userId - The user's MongoDB ObjectId
 * @returns {String} JWT token
 */
const generateToken = (userId) => {
    return jwt.sign(
        { userId },
        process.env.JWT_SECRET || 'your-secret-key-here',
        { expiresIn: process.env.JWT_EXPIRE || '7d' }
    );
};

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 * @body    {string} name - User's full name
 * @body    {string} email - User's email address
 * @body    {string} password - User's password (min 6 characters)
 * @body    {string} location - User's location (optional)
 * @body    {string} occupation - User's occupation (optional)
 */
router.post('/register', async (req, res, next) => {
    try {
        console.log('📡 POST /api/auth/register - User registration');
        
        const { name, email, password, location, occupation } = req.body;
        
        // Validation
        if (!name || !email || !password) {
            console.log('❌ Missing required fields');
            return next(new AppError('Please provide name, email, and password', 400));
        }
        
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            console.log('❌ User already exists with this email');
            return next(new AppError('User already exists with this email', 400));
        }
        
        // Create new user
        const user = await User.create({
            name,
            email,
            password,
            profile: {
                location: location || '',
                occupation: occupation || ''
            }
        });
        
        // Generate JWT token
        const token = generateToken(user._id);
        
        console.log('✅ User registered successfully:', user.email);
        
        // Send response (exclude password)
        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            data: {
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    profile: user.profile,
                    createdAt: user.createdAt
                },
                token
            }
        });
        
    } catch (error) {
        console.error('❌ Registration error:', error.message);
        
        // Handle validation errors
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(err => err.message);
            return next(new AppError(messages.join(', '), 400));
        }
        
        next(new AppError('Registration failed', 500));
    }
});

/**
 * @route   POST /api/auth/login
 * @desc    Login user and return JWT token
 * @access  Public
 * @body    {string} email - User's email address
 * @body    {string} password - User's password
 */
router.post('/login', async (req, res, next) => {
    try {
        console.log('📡 POST /api/auth/login - User login');
        
        const { email, password } = req.body;
        
        // Validation
        if (!email || !password) {
            console.log('❌ Missing email or password');
            return next(new AppError('Please provide email and password', 400));
        }
        
        // Find user and include password field for comparison
        const user = await User.findOne({ email }).select('+password');
        
        if (!user) {
            console.log('❌ User not found');
            return next(new AppError('Invalid email or password', 401));
        }
        
        // Check if account is active
        if (!user.isActive) {
            console.log('❌ Account is deactivated');
            return next(new AppError('Account is deactivated', 401));
        }
        
        // Verify password
        const isPasswordCorrect = await user.comparePassword(password);
        
        if (!isPasswordCorrect) {
            console.log('❌ Incorrect password');
            return next(new AppError('Invalid email or password', 401));
        }
        
        // Update last login
        await user.updateLastLogin();
        
        // Generate JWT token
        const token = generateToken(user._id);
        
        console.log('✅ User logged in successfully:', user.email);
        
        // Send response
        res.status(200).json({
            success: true,
            message: 'Login successful',
            data: {
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    profile: user.profile,
                    lastLogin: user.lastLogin
                },
                token
            }
        });
        
    } catch (error) {
        console.error('❌ Login error:', error.message);
        next(new AppError('Login failed', 500));
    }
});

/**
 * @route   GET /api/auth/profile
 * @desc    Get current user profile
 * @access  Private (requires authentication)
 * @headers {string} Authorization - JWT token (Bearer <token>)
 */
router.get('/profile', async (req, res, next) => {
    try {
        console.log('📡 GET /api/auth/profile - Get user profile');
        
        // Get token from Authorization header
        const authHeader = req.headers.authorization;
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            console.log('❌ No token provided');
            return next(new AppError('No token provided', 401));
        }
        
        const token = authHeader.split(' ')[1];
        
        // Verify token
        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key-here');
        } catch (error) {
            console.log('❌ Invalid token');
            return next(new AppError('Invalid or expired token', 401));
        }
        
        // Find user by ID
        const user = await User.findById(decoded.userId)
            .populate('identificationHistory.plant', 'name scientificName')
            .populate('identificationHistory.symptoms', 'name category')
            .populate('identificationHistory.disease', 'name scientificName severity')
            .select('-password');
        
        if (!user) {
            console.log('❌ User not found');
            return next(new AppError('User not found', 404));
        }
        
        console.log('✅ Profile retrieved successfully:', user.email);
        
        res.status(200).json({
            success: true,
            data: {
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    profile: user.profile,
                    identificationHistory: user.identificationHistory,
                    createdAt: user.createdAt,
                    lastLogin: user.lastLogin
                }
            }
        });
        
    } catch (error) {
        console.error('❌ Profile retrieval error:', error.message);
        next(new AppError('Failed to retrieve profile', 500));
    }
});

/**
 * @route   PUT /api/auth/profile
 * @desc    Update user profile
 * @access  Private (requires authentication)
 * @headers {string} Authorization - JWT token (Bearer <token>)
 * @body    {string} name - Updated name (optional)
 * @body    {string} location - Updated location (optional)
 * @body    {string} occupation - Updated occupation (optional)
 */
router.put('/profile', async (req, res, next) => {
    try {
        console.log('📡 PUT /api/auth/profile - Update user profile');
        
        // Get token from Authorization header
        const authHeader = req.headers.authorization;
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            console.log('❌ No token provided');
            return next(new AppError('No token provided', 401));
        }
        
        const token = authHeader.split(' ')[1];
        
        // Verify token
        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key-here');
        } catch (error) {
            console.log('❌ Invalid token');
            return next(new AppError('Invalid or expired token', 401));
        }
        
        const { name, location, occupation } = req.body;
        
        // Find user and update
        const user = await User.findById(decoded.userId);
        
        if (!user) {
            console.log('❌ User not found');
            return next(new AppError('User not found', 404));
        }
        
        // Update fields if provided
        if (name !== undefined) user.name = name;
        if (location !== undefined) user.profile.location = location;
        if (occupation !== undefined) user.profile.occupation = occupation;
        
        await user.save();
        
        console.log('✅ Profile updated successfully:', user.email);
        
        res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
            data: {
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    profile: user.profile,
                    createdAt: user.createdAt,
                    lastLogin: user.lastLogin
                }
            }
        });
        
    } catch (error) {
        console.error('❌ Profile update error:', error.message);
        
        // Handle validation errors
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(err => err.message);
            return next(new AppError(messages.join(', '), 400));
        }
        
        next(new AppError('Failed to update profile', 500));
    }
});

/**
 * @route   POST /api/auth/logout
 * @desc    Logout user (client-side token removal)
 * @access  Private (requires authentication)
 * @note    Since JWT is stateless, logout is handled client-side by removing token
 *          This endpoint is optional and can be used for server-side logging
 */
router.post('/logout', async (req, res, next) => {
    try {
        console.log('📡 POST /api/auth/logout - User logout');
        
        // In JWT-based authentication, logout is typically handled
        // on the client-side by removing the token from storage
        // This endpoint can be used for logging or additional cleanup
        
        res.status(200).json({
            success: true,
            message: 'Logout successful. Please remove token on client-side.'
        });
        
    } catch (error) {
        console.error('❌ Logout error:', error.message);
        next(new AppError('Logout failed', 500));
    }
});

module.exports = router;