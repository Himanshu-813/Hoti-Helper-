/**
 * Error Handling Middleware
 * This middleware catches and processes all errors in the application
 * Provides consistent error responses and logging
 */

/**
 * Custom error class for application-specific errors
 */
class AppError extends Error {
    constructor(message, statusCode, status = 'error') {
        super(message);
        this.statusCode = statusCode;
        this.status = status;
        this.isOperational = true;

        Error.captureStackTrace(this, this.constructor);
    }
}

/**
 * Global Error Handling Middleware
 * Catches all errors and sends appropriate responses
 */
const errorHandler = (err, req, res, next) => {
    let error = { ...err };
    error.message = err.message;

    // Log error for debugging (in production, use proper logging service)
    console.error('❌ Error:', {
        message: err.message,
        stack: err.stack,
        url: req.url,
        method: req.method,
        timestamp: new Date().toISOString()
    });

    // Mongoose bad ObjectId
    if (err.name === 'CastError') {
        const message = 'Resource not found with this ID';
        error = new AppError(message, 404);
    }

    // Mongoose duplicate key
    if (err.code === 11000) {
        const message = 'Duplicate field value entered';
        error = new AppError(message, 400);
    }

    // Mongoose validation error
    if (err.name === 'ValidationError') {
        const message = Object.values(err.errors).map(val => val.message).join(', ');
        error = new AppError(message, 400);
    }

    // Default error response
    res.status(error.statusCode || 500).json({
        success: false,
        error: {
            message: error.message || 'Internal Server Error',
            ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
        },
        timestamp: new Date().toISOString(),
        path: req.originalUrl
    });
};

/**
 * 404 Not Found Middleware
 * Handles requests to undefined routes
 */
const notFound = (req, res, next) => {
    res.status(404).json({
        success: false,
        error: {
            message: `Cannot find ${req.originalUrl} on this server`,
            suggestion: 'Check the URL and HTTP method'
        },
        availableEndpoints: [
            'GET /api/plants',
            'POST /api/diseases/identify',
            'GET /api/diseases'
        ]
    });
};

module.exports = {
    errorHandler,
    notFound,
    AppError
};