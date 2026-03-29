/**
 * DiseaseIdentifier Component
 * Main form component for identifying plant diseases
 * Allows users to select plant type and symptoms
 */

import React, { useState, useEffect } from 'react';
import { PlantService, DiseaseService } from '../services/api';
import Results from './Results';

const DiseaseIdentifier = () => {
    // State management using React hooks
    const [plants, setPlants] = useState([]); // Available plants
    const [symptoms, setSymptoms] = useState([]); // Available symptoms
    const [selectedPlant, setSelectedPlant] = useState(''); // Selected plant ID
    const [selectedSymptoms, setSelectedSymptoms] = useState([]); // Selected symptom IDs
    const [results, setResults] = useState(null); // Disease identification results
    const [loading, setLoading] = useState(false); // Loading state
    const [error, setError] = useState(null); // Error state

    // Fetch plants and symptoms on component mount
    useEffect(() => {
        fetchInitialData();
    }, []);

    /**
     * Fetch initial data (plants and symptoms)
     * This runs when the component first loads
     */
    const fetchInitialData = async () => {
        try {
            setLoading(true);
            
            // Fetch plants
            const plantsResponse = await PlantService.getAllPlants();
            setPlants(plantsResponse.data);
            
            // For symptoms, we'll fetch them based on plant selection
            // This is more efficient than loading all symptoms at once
            
            setLoading(false);
        } catch (err) {
            setError('Failed to load initial data. Please refresh the page.');
            setLoading(false);
            console.error('Error fetching initial data:', err);
        }
    };

    /**
     * Handle plant selection change
     * When user selects a plant, we need to fetch its symptoms
     */
    const handlePlantChange = async (plantId) => {
        setSelectedPlant(plantId);
        setSelectedSymptoms([]); // Reset selected symptoms
        setResults(null); // Clear previous results
        
        if (plantId) {
            try {
                // Fetch diseases for this plant to get related symptoms
                const diseasesResponse = await DiseaseService.getDiseasesByPlant(plantId);
                
                // Extract unique symptoms from diseases
                const uniqueSymptoms = new Map();
                diseasesResponse.data.forEach(disease => {
                    disease.symptoms.forEach(symptom => {
                        if (!uniqueSymptoms.has(symptom._id)) {
                            uniqueSymptoms.set(symptom._id, symptom);
                        }
                    });
                });
                
                // Convert Map to array and sort by category
                const symptomsArray = Array.from(uniqueSymptoms.values())
                    .sort((a, b) => a.category.localeCompare(b.category));
                
                setSymptoms(symptomsArray);
            } catch (err) {
                setError('Failed to load symptoms for selected plant.');
                console.error('Error fetching symptoms:', err);
            }
        } else {
            setSymptoms([]);
        }
    };

    /**
     * Handle symptom selection/deselection
     */
    const handleSymptomToggle = (symptomId) => {
        setSelectedSymptoms(prev => {
            if (prev.includes(symptomId)) {
                // Remove if already selected
                return prev.filter(id => id !== symptomId);
            } else {
                // Add if not selected
                return [...prev, symptomId];
            }
        });
    };

    /**
     * Handle form submission for disease identification
     */
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validation
        if (!selectedPlant) {
            setError('Please select a plant type.');
            return;
        }
        
        if (selectedSymptoms.length === 0) {
            setError('Please select at least one symptom.');
            return;
        }
        
        setLoading(true);
        setError(null);
        
        try {
            // Call disease identification API
            const response = await DiseaseService.identifyDisease(selectedPlant, selectedSymptoms);
            setResults(response);
            
            // Scroll to results
            setTimeout(() => {
                const resultsSection = document.getElementById('results-section');
                if (resultsSection) {
                    resultsSection.scrollIntoView({ behavior: 'smooth' });
                }
            }, 100);
            
        } catch (err) {
            setError(err.message || 'Failed to identify disease. Please try again.');
            console.error('Error identifying disease:', err);
        } finally {
            setLoading(false);
        }
    };

    // Group symptoms by category for better display
    const groupedSymptoms = symptoms.reduce((groups, symptom) => {
        const category = symptom.category.charAt(0).toUpperCase() + symptom.category.slice(1);
        if (!groups[category]) {
            groups[category] = [];
        }
        groups[category].push(symptom);
        return groups;
    }, {});

    // Get selected plant details
    const selectedPlantDetails = plants.find(plant => plant._id === selectedPlant);

    if (loading && plants.length === 0) {
        return (
            <div className="container py-5 text-center">
                <div className="spinner-border text-success" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-3 text-muted">Loading plant data...</p>
            </div>
        );
    }

    return (
        <div className="container py-5">
            <div className="row">
                <div className="col-lg-8 mx-auto">
                    {/* Header */}
                    <div className="text-center mb-5">
                        <h1 className="display-5 fw-bold text-success mb-3">
                            <i className="fas fa-search me-3"></i>
                            Identify Plant Disease
                        </h1>
                        <p className="text-muted">
                            Select your plant type and choose the symptoms you observe to get an accurate diagnosis.
                        </p>
                    </div>

                    {/* Error Display */}
                    {error && (
                        <div className="alert alert-danger alert-dismissible fade show" role="alert">
                            <i className="fas fa-exclamation-triangle me-2"></i>
                            {error}
                            <button 
                                type="button" 
                                className="btn-close" 
                                onClick={() => setError(null)}
                            ></button>
                        </div>
                    )}

                    {/* Identification Form */}
                    <form onSubmit={handleSubmit} className="bg-light p-4 rounded shadow-sm">
                        {/* Plant Selection */}
                        <div className="mb-4">
                            <label htmlFor="plantSelect" className="form-label fw-bold">
                                <i className="fas fa-seedling me-2 text-success"></i>
                                Select Plant Type *
                            </label>
                            <select
                                id="plantSelect"
                                className="form-select form-select-lg"
                                value={selectedPlant}
                                onChange={(e) => handlePlantChange(e.target.value)}
                                required
                            >
                                <option value="">-- Choose a plant --</option>
                                {plants.map(plant => (
                                    <option key={plant._id} value={plant._id}>
                                        {plant.name} ({plant.scientificName})
                                    </option>
                                ))}
                            </select>
                            {selectedPlantDetails && (
                                <div className="form-text text-muted mt-2">
                                    <small>{selectedPlantDetails.description}</small>
                                </div>
                            )}
                        </div>

                        {/* Symptoms Selection */}
                        {selectedPlant && (
                            <div className="mb-4">
                                <label className="form-label fw-bold">
                                    <i className="fas fa-list-check me-2 text-success"></i>
                                    Select Observed Symptoms *
                                </label>
                                <div className="form-text mb-3 text-muted">
                                    Select all symptoms that apply to your plant. The more symptoms you select, the more accurate the identification will be.
                                </div>
                                
                                {symptoms.length === 0 ? (
                                    <div className="text-center py-4">
                                        <div className="spinner-border text-success" role="status">
                                            <span className="visually-hidden">Loading symptoms...</span>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="row">
                                        {Object.entries(groupedSymptoms).map(([category, categorySymptoms]) => (
                                            <div key={category} className="col-md-6 mb-3">
                                                <h6 className="fw-bold text-success mb-2">
                                                    <i className="fas fa-tag me-2"></i>
                                                    {category}
                                                </h6>
                                                <div className="list-group">
                                                    {categorySymptoms.map(symptom => (
                                                        <label
                                                            key={symptom._id}
                                                            className="list-group-item d-flex align-items-center"
                                                            style={{ cursor: 'pointer' }}
                                                        >
                                                            <input
                                                                className="form-check-input me-3"
                                                                type="checkbox"
                                                                value={symptom._id}
                                                                checked={selectedSymptoms.includes(symptom._id)}
                                                                onChange={() => handleSymptomToggle(symptom._id)}
                                                            />
                                                            <div>
                                                                <div className="fw-medium">{symptom.name}</div>
                                                                <small className="text-muted">{symptom.description}</small>
                                                            </div>
                                                        </label>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                
                                <div className="mt-3 text-center">
                                    <span className="badge bg-secondary">
                                        {selectedSymptoms.length} symptom(s) selected
                                    </span>
                                </div>
                            </div>
                        )}

                        {/* Submit Button */}
                        <div className="d-grid gap-2">
                            <button
                                type="submit"
                                className="btn btn-success btn-lg"
                                disabled={loading || !selectedPlant || selectedSymptoms.length === 0}
                            >
                                {loading ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                        Analyzing Symptoms...
                                    </>
                                ) : (
                                    <>
                                        <i className="fas fa-search me-2"></i>
                                        Identify Disease
                                    </>
                                )}
                            </button>
                        </div>
                    </form>

                    {/* Results Section */}
                    {results && (
                        <div id="results-section" className="mt-5">
                            <Results results={results} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DiseaseIdentifier;