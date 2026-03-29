/**
 * Disease Routes
 * This file contains all API endpoints related to disease identification and management
 * Routes: POST /api/diseases/identify, GET /api/diseases
 */

const express = require('express');
const Disease = require('../models/Disease');
const Plant = require('../models/Plant');
const Symptom = require('../models/Symptom');
const { AppError } = require('../middleware/errorHandler');

const router = express.Router();

/**
 * @route   POST /api/diseases/identify
 * @desc    Identify disease based on plant type and symptoms
 * @access  Public
 * @body    {string} plantId - The ID of the plant
 * @body    {Array} symptomIds - Array of symptom IDs
 * @returns {Array} List of matching diseases with confidence scores
 */
router.post('/identify', async (req, res, next) => {
    try {
        console.log('📡 POST /api/diseases/identify - Identifying disease');
        
        const { plantId, symptomIds } = req.body;
        
        // Validate input
        if (!plantId) {
            console.log('❌ Missing plant ID');
            return next(new AppError('Plant ID is required', 400));
        }
        
        if (!symptomIds || !Array.isArray(symptomIds) || symptomIds.length === 0) {
            console.log('❌ Missing or invalid symptom IDs');
            return next(new AppError('At least one symptom must be selected', 400));
        }
        
        console.log(`🔍 Searching for diseases for plant: ${plantId}`);
        console.log(`📝 Selected symptoms: ${symptomIds.length}`);
        
        // Find all diseases for the selected plant
        const allDiseases = await Disease.find({ plant: plantId })
            .populate('plant', 'name scientificName')
            .populate('symptoms', 'name category description')
            .select('-__v');
        
        console.log(`📊 Found ${allDiseases.length} total diseases for this plant`);
        
        // Disease identification logic - Rule-based matching
        const matchingDiseases = [];
        
        // Convert symptomIds to strings for comparison (MongoDB IDs are objects)
        const selectedSymptomIds = symptomIds.map(id => id.toString());
        
        for (const disease of allDiseases) {
            // Get disease symptom IDs as strings
            const diseaseSymptomIds = disease.symptoms.map(symptom => symptom._id.toString());
            
            // Count matching symptoms
            const matchingSymptoms = selectedSymptomIds.filter(id => 
                diseaseSymptomIds.includes(id)
            );
            
            // Calculate confidence score
            const confidence = (matchingSymptoms.length / diseaseSymptomIds.length) * 100;
            
            // Only include diseases with at least 30% confidence
            if (confidence >= 30) {
                matchingDiseases.push({
                    disease: disease,
                    confidence: Math.round(confidence),
                    matchedSymptoms: matchingSymptoms.length,
                    totalSymptoms: diseaseSymptomIds.length,
                    missingSymptoms: diseaseSymptomIds.filter(id => !selectedSymptomIds.includes(id)).length
                });
            }
        }
        
        // Sort by confidence score (highest first)
        matchingDiseases.sort((a, b) => b.confidence - a.confidence);
        
        console.log(`✅ Found ${matchingDiseases.length} matching diseases`);
        
        // If no diseases found, provide helpful message
        if (matchingDiseases.length === 0) {
            return res.status(200).json({
                success: true,
                message: 'No matching diseases found for the selected symptoms. Try selecting different symptoms or consult an agricultural expert.',
                data: [],
                suggestions: [
                    'Try selecting more specific symptoms',
                    'Ensure symptoms are correctly identified',
                    'Consider environmental factors',
                    'Consult local agricultural extension office'
                ]
            });
        }
        
        // Send success response with results
        res.status(200).json({
            success: true,
            count: matchingDiseases.length,
            data: matchingDiseases,
            message: `Found ${matchingDiseases.length} potential disease(s) matching your symptoms`,
            highestConfidence: matchingDiseases[0].confidence,
            recommendations: {
                nextSteps: [
                    'Review the identified diseases and their symptoms',
                    'Compare with your plant\'s actual condition',
                    'Follow the recommended treatment for the highest confidence match',
                    'Monitor plant response to treatment',
                    'Consult agricultural expert if symptoms persist'
                ],
                urgency: matchingDiseases[0].disease.severity === 'critical' ? 'High' : 
                         matchingDiseases[0].disease.severity === 'high' ? 'Medium' : 'Low'
            }
        });
        
    } catch (error) {
        console.error('❌ Error identifying disease:', error.message);
        next(new AppError('Failed to identify disease', 500));
    }
});

/**
 * @route   GET /api/diseases
 * @desc    Get all diseases (for debugging/admin purposes)
 * @access  Public
 * @returns {Array} List of all diseases with populated plant and symptom data
 */
router.get('/', async (req, res, next) => {
    try {
        console.log('📡 GET /api/diseases - Fetching all diseases');
        
        // Fetch all diseases with populated references
        const diseases = await Disease.find({})
            .populate('plant', 'name scientificName')
            .populate('symptoms', 'name category description')
            .sort({ name: 1 })
            .select('-__v');
        
        console.log(`✅ Found ${diseases.length} diseases`);
        
        // Send success response
        res.status(200).json({
            success: true,
            count: diseases.length,
            data: diseases,
            message: diseases.length > 0 ? 'Diseases retrieved successfully' : 'No diseases found'
        });
        
    } catch (error) {
        console.error('❌ Error fetching diseases:', error.message);
        next(new AppError('Failed to fetch diseases', 500));
    }
});

/**
 * @route   GET /api/diseases/:id
 * @desc    Get a specific disease by ID
 * @access  Public
 * @param   {string} id - Disease ID
 * @returns {Object} Disease details with plant and symptom information
 */
router.get('/:id', async (req, res, next) => {
    try {
        console.log(`📡 GET /api/diseases/${req.params.id} - Fetching disease by ID`);
        
        // Find disease by ID with populated references
        const disease = await Disease.findById(req.params.id)
            .populate('plant', 'name scientificName')
            .populate('symptoms', 'name category description');
        
        // Check if disease exists
        if (!disease) {
            console.log('❌ Disease not found');
            return next(new AppError('Disease not found with this ID', 404));
        }
        
        console.log('✅ Disease found:', disease.name);
        
        // Send success response
        res.status(200).json({
            success: true,
            data: disease,
            message: 'Disease retrieved successfully'
        });
        
    } catch (error) {
        console.error('❌ Error fetching disease:', error.message);
        next(new AppError('Failed to fetch disease', 500));
    }
});

/**
 * @route   GET /api/diseases/plant/:plantId
 * @desc    Get all diseases for a specific plant
 * @access  Public
 * @param   {string} plantId - Plant ID
 * @returns {Array} List of diseases affecting the specified plant
 */
router.get('/plant/:plantId', async (req, res, next) => {
    try {
        console.log(`📡 GET /api/diseases/plant/${req.params.plantId} - Fetching diseases by plant`);
        
        // Find diseases by plant ID
        const diseases = await Disease.find({ plant: req.params.plantId })
            .populate('plant', 'name scientificName')
            .populate('symptoms', 'name category description')
            .sort({ name: 1 })
            .select('-__v');
        
        console.log(`✅ Found ${diseases.length} diseases for plant ${req.params.plantId}`);
        
        // Send success response
        res.status(200).json({
            success: true,
            count: diseases.length,
            data: diseases,
            message: diseases.length > 0 ? 'Diseases retrieved successfully' : 'No diseases found for this plant'
        });
        
    } catch (error) {
        console.error('❌ Error fetching diseases by plant:', error.message);
        next(new AppError('Failed to fetch diseases for this plant', 500));
    }
});

module.exports = router;