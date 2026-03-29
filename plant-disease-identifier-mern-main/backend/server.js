/**
 * Plant Disease Identifier - Main Server File
 * Express server with MongoDB integration
 * Handles API routing and middleware configuration
 */

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const { errorHandler, notFound } = require('./middleware/errorHandler');

// Load environment variables from .env file
// This should be done before using any environment variables
dotenv.config();

// Import routes
const plantRoutes = require('./routes/plants');
const diseaseRoutes = require('./routes/diseases');
const authRoutes = require('./routes/auth');

// Initialize Express application
const app = express();

// ============================================
// MIDDLEWARE CONFIGURATION
// ============================================

// CORS (Cross-Origin Resource Sharing) configuration
// Allows frontend (React) to communicate with backend
const corsOptions = {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
    optionsSuccessStatus: 200,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};

// Apply CORS middleware
app.use(cors(corsOptions));

// Body parsing middleware
// This allows us to receive JSON data in requests
app.use(express.json({ limit: '10mb' })); // Limit request size to 10MB
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging middleware (for debugging)
app.use((req, res, next) => {
    console.log(`📥 ${req.method} ${req.originalUrl} - ${new Date().toISOString()}`);
    next();
});

// ============================================
// DATABASE CONNECTION
// ============================================

// Connect to MongoDB
// Uses connection string from environment variable or defaults to local MongoDB
connectDB();

// ============================================
// API ROUTES
// ============================================

// Welcome route - Root endpoint
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: '🌱 Welcome to Plant Disease Identifier API',
        version: '1.0.0',
        description: 'MERN stack application for identifying plant diseases through symptom analysis',
        endpoints: {
            plants: {
                getAll: 'GET /api/plants',
                description: 'Retrieve all available plants'
            },
            diseases: {
                identify: 'POST /api/diseases/identify',
                getAll: 'GET /api/diseases',
                description: 'Identify diseases based on symptoms'
            }
        },
        documentation: 'Check README.md for detailed API documentation',
        health: '✅ Server is running',
        database: mongoose.connection.readyState === 1 ? '✅ Connected' : '❌ Disconnected'
    });
});

// Health check route - For monitoring
app.get('/health', (req, res) => {
    res.json({
        success: true,
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
        memory: process.memoryUsage(),
        version: process.version
    });
});

// Mount API routes
// All plant-related routes
app.use('/api/plants', plantRoutes);

// All disease-related routes
app.use('/api/diseases', diseaseRoutes);

// All authentication-related routes
app.use('/api/auth', authRoutes);

// ============================================
// ERROR HANDLING
// ============================================

// Handle undefined routes (404)
// This should come after all defined routes
app.use(notFound);

// Global error handling middleware
// This catches all errors thrown in the application
app.use(errorHandler);

// ============================================
// SERVER STARTUP
// ============================================

// Get port from environment variable or use default
const PORT = process.env.PORT || 5000;

// Start the server
const server = app.listen(PORT, () => {
    console.log('🚀 ==========================================');
    console.log(`🌟 Server running on port ${PORT}`);
    console.log(`🔗 Local: http://localhost:${PORT}`);
    console.log(`📡 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log('🚀 ==========================================');
});

// ============================================
// GRACEFUL SHUTDOWN
// ============================================

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
    console.error('❌ UNCAUGHT EXCEPTION! Shutting down...');
    console.error(err.name, err.message);
    process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    console.error('❌ UNHANDLED REJECTION! Shutting down...');
    console.error(err.name, err.message);
    server.close(() => {
        process.exit(1);
    });
});

// Graceful shutdown on SIGTERM (e.g., from Docker/Kubernetes)
process.on('SIGTERM', () => {
    console.log('🛑 SIGTERM RECEIVED. Shutting down gracefully');
    server.close(() => {
        console.log('🔌 Process terminated');
    });
});

// Export for testing purposes
module.exports = app;