const mongoose = require('mongoose');

/**
 * Symptom Model Schema
 * This model stores all possible symptoms that plants can show
 * Used for: Displaying symptom checkboxes and disease identification
 */
const symptomSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Symptom name is required'],
        trim: true,
        unique: true
    },
    category: {
        type: String,
        required: [true, 'Symptom category is required'],
        enum: ['leaf', 'stem', 'fruit', 'root', 'flower', 'general'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Symptom description is required'],
        trim: true
    },
    severity: {
        type: String,
        enum: ['low', 'medium', 'high', 'critical'],
        default: 'medium'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Symptom', symptomSchema);