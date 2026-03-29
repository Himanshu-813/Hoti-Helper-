const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

/**
 * User Model Schema
 * This model stores user information for authentication and profile management
 * Used for: User registration, login, and maintaining user sessions
 */
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
        minlength: [2, 'Name must be at least 2 characters'],
        maxlength: [50, 'Name cannot exceed 50 characters']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [
            /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
            'Please enter a valid email address'
        ]
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters'],
        select: false  // Don't return password in queries by default
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    profile: {
        location: {
            type: String,
            trim: true,
            maxlength: [100, 'Location cannot exceed 100 characters']
        },
        occupation: {
            type: String,
            trim: true,
            maxlength: [50, 'Occupation cannot exceed 50 characters']
        },
        interests: [{
            type: String,
            trim: true
        }]
    },
    identificationHistory: [{
        plant: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Plant'
        },
        symptoms: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Symptom'
        }],
        disease: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Disease'
        },
        confidence: Number,
        identifiedAt: {
            type: Date,
            default: Date.now
        }
    }],
    createdAt: {
        type: Date,
        default: Date.now
    },
    lastLogin: {
        type: Date
    },
    isActive: {
        type: Boolean,
        default: true
    }
});

/**
 * Pre-save middleware to hash password before saving
 * This ensures passwords are never stored in plain text
 */
userSchema.pre('save', async function(next) {
    // Only hash the password if it has been modified (or is new)
    if (!this.isModified('password')) return next();
    
    try {
        // Generate salt and hash the password
        const salt = await bcrypt.genSalt(12);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

/**
 * Instance method to compare plain text password with hashed password
 * @param {String} candidatePassword - Plain text password to compare
 * @returns {Boolean} - True if passwords match, false otherwise
 */
userSchema.methods.comparePassword = async function(candidatePassword) {
    try {
        return await bcrypt.compare(candidatePassword, this.password);
    } catch (error) {
        throw new Error('Password comparison failed');
    }
};

/**
 * Instance method to add identification to user's history
 * @param {Object} identificationData - Plant, symptoms, disease, and confidence
 */
userSchema.methods.addToHistory = function(identificationData) {
    this.identificationHistory.push({
        plant: identificationData.plant,
        symptoms: identificationData.symptoms,
        disease: identificationData.disease,
        confidence: identificationData.confidence,
        identifiedAt: new Date()
    });
    
    // Keep only last 50 identifications to prevent array from growing too large
    if (this.identificationHistory.length > 50) {
        this.identificationHistory = this.identificationHistory.slice(-50);
    }
};

/**
 * Instance method to update last login timestamp
 */
userSchema.methods.updateLastLogin = function() {
    this.lastLogin = new Date();
    return this.save();
};

// Index for faster email lookups during login
userSchema.index({ email: 1 });

module.exports = mongoose.model('User', userSchema);