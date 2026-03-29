/**
 * Plant Routes
 * This file contains all API endpoints related to plant management
 * Routes: GET /api/plants
 */

const express = require('express');
const Plant = require('../models/Plant');
const { AppError } = require('../middleware/errorHandler');

const router = express.Router();

/**
 * @route   GET /api/plants
 * @desc    Get all available plants
 * @access  Public
 * @returns {Array} List of all plants with their details
 */
router.get('/', async (req, res, next) => {
    try {
        console.log('📡 GET /api/plants - Fetching all plants');
        
        // Fetch all plants from database
        // Sort by name for consistent ordering
        const plants = await Plant.find({})
            .sort({ name: 1 })
            .select('-__v'); // Exclude version key
        
        console.log(`✅ Found ${plants.length} plants`);
        
        // Send success response
        res.status(200).json({
            success: true,
            count: plants.length,
            data: plants,
            message: plants.length > 0 ? 'Plants retrieved successfully' : 'No plants found'
        });
        
    } catch (error) {
        console.error('❌ Error fetching plants:', error.message);
        next(new AppError('Failed to fetch plants', 500));
    }
});

/**
 * @route   GET /api/plants/:id
 * @desc    Get a specific plant by ID
 * @access  Public
 * @param   {string} id - Plant ID
 * @returns {Object} Plant details
 */
router.get('/:id', async (req, res, next) => {
    try {
        console.log(`📡 GET /api/plants/${req.params.id} - Fetching plant by ID`);
        
        // Find plant by ID
        const plant = await Plant.findById(req.params.id).select('-__v');
        
        // Check if plant exists
        if (!plant) {
            console.log('❌ Plant not found');
            return next(new AppError('Plant not found with this ID', 404));
        }
        
        console.log('✅ Plant found:', plant.name);
        
        // Send success response
        res.status(200).json({
            success: true,
            data: plant,
            message: 'Plant retrieved successfully'
        });
        
    } catch (error) {
        console.error('❌ Error fetching plant:', error.message);
        next(new AppError('Failed to fetch plant', 500));
    }
});

module.exports = router;