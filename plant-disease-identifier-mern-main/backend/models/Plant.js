const mongoose = require('mongoose');

/**
 * Plant Model Schema
 * This model stores different types of plants that can be affected by diseases
 * Used for: Populating plant selection dropdown in frontend
 */
const plantSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Plant name is required'],
        trim: true,
        unique: true
    },
    scientificName: {
        type: String,
        required: [true, 'Scientific name is required'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Plant description is required'],
        trim: true
    },
    commonVarieties: [{
        type: String,
        trim: true
    }],
    image: {
        type: String, // URL to plant image
        default: null
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Plant', plantSchema);