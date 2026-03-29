const mongoose = require('mongoose');

/**
 * Disease Model Schema
 * This model stores information about plant diseases and their associated symptoms
 * Used for: Disease identification based on symptom matching
 */
const diseaseSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Disease name is required'],
        trim: true,
        unique: true
    },
    scientificName: {
        type: String,
        required: [true, 'Scientific name is required'],
        trim: true
    },
    plant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Plant',
        required: [true, 'Associated plant is required']
    },
    symptoms: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Symptom',
        required: [true, 'At least one symptom is required']
    }],
    description: {
        type: String,
        required: [true, 'Disease description is required'],
        trim: true
    },
    cause: {
        type: String,
        required: [true, 'Disease cause is required'],
        trim: true
    },
    preventiveMeasures: [{
        type: String,
        required: [true, 'At least one preventive measure is required']
    }],
    treatment: {
        chemical: [{
            name: String,
            dosage: String,
            application: String
        }],
        organic: [{
            method: String,
            instructions: String
        }],
        cultural: [{
            practice: String,
            description: String
        }]
    },
    severity: {
        type: String,
        enum: ['low', 'medium', 'high', 'critical'],
        required: [true, 'Disease severity is required']
    },
    commonIn: {
        type: String,
        enum: ['spring', 'summer', 'monsoon', 'winter', 'all_season'],
        default: 'all_season'
    },
    images: [{
        type: String // URLs to disease images
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Index for faster queries
// This helps in quickly finding diseases by plant and symptoms
diseaseSchema.index({ plant: 1, symptoms: 1 });

module.exports = mongoose.model('Disease', diseaseSchema);