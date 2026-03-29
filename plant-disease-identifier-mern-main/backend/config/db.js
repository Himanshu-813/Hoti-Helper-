/**
 * Database Configuration
 * This module handles MongoDB connection using Mongoose
 * Provides a clean, reusable database connection function
 */

const mongoose = require('mongoose');

/**
 * Connect to MongoDB database
 * @param {string} mongoURI - MongoDB connection string
 * @returns {Promise} - Database connection promise
 */
const connectDB = async (mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/plant-disease-db') => {
    try {
        // Connection options for better performance and compatibility
        const options = {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            maxPoolSize: 10, // Maximum number of connections in the pool
            serverSelectionTimeoutMS: 5000, // Timeout after 5s
            socketTimeoutMS: 45000, // Close socket after 45s of inactivity
        };

        // Connect to MongoDB
        const conn = await mongoose.connect(mongoURI, options);
        
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
        console.log(`📊 Database: ${conn.connection.name}`);
        console.log(`🔗 Connection State: ${conn.connection.readyState}`);
        
        return conn;
        
    } catch (error) {
        console.error('❌ MongoDB Connection Error:', error.message);
        console.error('💡 Check if MongoDB is running on your system');
        console.error('📝 To start MongoDB: mongod (on Windows/Mac) or sudo systemctl start mongod (on Linux)');
        
        // Exit process with failure
        process.exit(1);
    }
};

// Handle connection events
//debugging is easy this way
mongoose.connection.on('connected', () => {
    console.log('📡 Mongoose connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
    console.error('❌ Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
    console.log('🔌 Mongoose disconnected from MongoDB');
});

// shutdown
process.on('SIGINT', async () => {
    try {
        await mongoose.connection.close();
        console.log('🔌 MongoDB connection closed due to app termination');
        process.exit(0);
    } catch (error) {
        console.error('Error closing MongoDB connection:', error);
        process.exit(1);
    }
});

module.exports = connectDB;