/**
 * Results Component
 * Displays disease identification results with detailed information
 * Shows confidence scores, disease details, and treatment recommendations
 */

import React, { useState } from 'react';

const Results = ({ results }) => {
    const [selectedDisease, setSelectedDisease] = useState(0); // Index of selected disease
    
    if (!results || !results.data || results.data.length === 0) {
        return (
            <div className="alert alert-info">
                <i className="fas fa-info-circle me-2"></i>
                No matching diseases found. Please try selecting different symptoms or consult an agricultural expert.
            </div>
        );
    }

    const currentDisease = results.data[selectedDisease];
    const disease = currentDisease.disease;
    
    // Get severity color for badges
    const getSeverityColor = (severity) => {
        switch (severity) {
            case 'critical': return 'bg-danger';
            case 'high': return 'bg-warning text-dark';
            case 'medium': return 'bg-info text-dark';
            case 'low': return 'bg-success';
            default: return 'bg-secondary';
        }
    };

    // Get confidence color
    const getConfidenceColor = (confidence) => {
        if (confidence >= 80) return 'bg-success';
        if (confidence >= 60) return 'bg-warning text-dark';
        return 'bg-danger';
    };

    return (
        <div className="bg-white p-4 rounded shadow">
            {/* Results Header */}
            <div className="mb-4">
                <h2 className="h4 text-success mb-3">
                    <i className="fas fa-stethoscope me-2"></i>
                    Disease Identification Results
                </h2>
                <p className="text-muted">
                    Found {results.count} potential disease(s) matching your symptoms.
                    {results.highestConfidence && (
                        <span className="ms-2">
                            Highest confidence: 
                            <span className={`badge ${getConfidenceColor(results.highestConfidence)} ms-1`}>
                                {results.highestConfidence}%
                            </span>
                        </span>
                    )}
                </p>
            </div>

            {/* Disease Selection Tabs */}
            {results.data.length > 1 && (
                <div className="mb-4">
                    <h6 className="mb-2">Select a disease to view details:</h6>
                    <div className="d-flex flex-wrap gap-2">
                        {results.data.map((item, index) => (
                            <button
                                key={index}
                                className={`btn btn-sm ${selectedDisease === index ? 'btn-success' : 'btn-outline-success'}`}
                                onClick={() => setSelectedDisease(index)}
                            >
                                {item.disease.name}
                                <span className="badge bg-light text-dark ms-2">
                                    {item.confidence}%
                                </span>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Current Disease Details */}
            <div className="row">
                <div className="col-12">
                    {/* Disease Header */}
                    <div className="d-flex justify-content-between align-items-start mb-3">
                        <div>
                            <h3 className="h5 text-dark mb-1">
                                {disease.name}
                                <span className={`badge ${getSeverityColor(disease.severity)} ms-2`}>
                                    {disease.severity.toUpperCase()}
                                </span>
                            </h3>
                            <p className="text-muted small mb-0">
                                <em>{disease.scientificName}</em>
                            </p>
                        </div>
                        <div className="text-end">
                            <div className={`badge ${getConfidenceColor(currentDisease.confidence)}`}>
                                {currentDisease.confidence}% Match
                            </div>
                        </div>
                    </div>

                    {/* Confidence Details */}
                    <div className="row mb-3">
                        <div className="col-md-4">
                            <div className="card bg-light">
                                <div className="card-body text-center">
                                    <div className="h4 text-success mb-1">{currentDisease.matchedSymptoms}</div>
                                    <div className="small text-muted">Matched Symptoms</div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="card bg-light">
                                <div className="card-body text-center">
                                    <div className="h4 text-info mb-1">{currentDisease.totalSymptoms}</div>
                                    <div className="small text-muted">Total Symptoms</div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="card bg-light">
                                <div className="card-body text-center">
                                    <div className="h4 text-warning mb-1">{currentDisease.missingSymptoms}</div>
                                    <div className="small text-muted">Missing Symptoms</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="mb-4">
                        <h6 className="fw-bold text-success mb-2">
                            <i className="fas fa-info-circle me-2"></i>
                            Description
                        </h6>
                        <p className="text-muted">{disease.description}</p>
                    </div>

                    {/* Cause */}
                    <div className="mb-4">
                        <h6 className="fw-bold text-success mb-2">
                            <i className="fas fa-virus me-2"></i>
                            Cause
                        </h6>
                        <p className="text-muted">{disease.cause}</p>
                    </div>

                    {/* Symptoms */}
                    <div className="mb-4">
                        <h6 className="fw-bold text-success mb-2">
                            <i className="fas fa-list-check me-2"></i>
                            Associated Symptoms
                        </h6>
                        <div className="row">
                            {disease.symptoms.map((symptom, index) => (
                                <div key={index} className="col-md-6 mb-2">
                                    <div className="d-flex align-items-center">
                                        <i className="fas fa-check-circle text-success me-2"></i>
                                        <span className="small">{symptom.name}</span>
                                        <span className="badge bg-light text-dark ms-2">
                                            {symptom.category}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Treatment Section */}
                    <div className="mb-4">
                        <h6 className="fw-bold text-success mb-3">
                            <i className="fas fa-pills me-2"></i>
                            Treatment & Management
                        </h6>

                        {/* Chemical Treatment */}
                        {disease.treatment.chemical && disease.treatment.chemical.length > 0 && (
                            <div className="mb-3">
                                <h7 className="fw-bold text-dark mb-2">
                                    <i className="fas fa-flask me-2"></i>
                                    Chemical Treatment
                                </h7>
                                <div className="list-group list-group-flush">
                                    {disease.treatment.chemical.map((chemical, index) => (
                                        <div key={index} className="list-group-item">
                                            <div className="fw-medium">{chemical.name}</div>
                                            <div className="small text-muted">
                                                <strong>Dosage:</strong> {chemical.dosage}
                                            </div>
                                            <div className="small text-muted">
                                                <strong>Application:</strong> {chemical.application}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Organic Treatment */}
                        {disease.treatment.organic && disease.treatment.organic.length > 0 && (
                            <div className="mb-3">
                                <h7 className="fw-bold text-dark mb-2">
                                    <i className="fas fa-leaf me-2"></i>
                                    Organic Treatment
                                </h7>
                                <div className="list-group list-group-flush">
                                    {disease.treatment.organic.map((organic, index) => (
                                        <div key={index} className="list-group-item">
                                            <div className="fw-medium">{organic.method}</div>
                                            <div className="small text-muted">{organic.instructions}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Cultural Practices */}
                        {disease.treatment.cultural && disease.treatment.cultural.length > 0 && (
                            <div className="mb-3">
                                <h7 className="fw-bold text-dark mb-2">
                                    <i className="fas fa-tools me-2"></i>
                                    Cultural Practices
                                </h7>
                                <div className="list-group list-group-flush">
                                    {disease.treatment.cultural.map((cultural, index) => (
                                        <div key={index} className="list-group-item">
                                            <div className="fw-medium">{cultural.practice}</div>
                                            <div className="small text-muted">{cultural.description}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Preventive Measures */}
                    <div className="mb-4">
                        <h6 className="fw-bold text-success mb-2">
                            <i className="fas fa-shield-alt me-2"></i>
                            Preventive Measures
                        </h6>
                        <div className="list-group list-group-flush">
                            {disease.preventiveMeasures.map((measure, index) => (
                                <div key={index} className="list-group-item">
                                    <i className="fas fa-check text-success me-2"></i>
                                    {measure}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Recommendations */}
                    {results.recommendations && (
                        <div className="alert alert-info">
                            <h6 className="fw-bold mb-2">
                                <i className="fas fa-lightbulb me-2"></i>
                                Recommendations
                            </h6>
                            <div className="mb-2">
                                <strong>Next Steps:</strong>
                                <ul className="mb-0 mt-1">
                                    {results.recommendations.nextSteps.map((step, index) => (
                                        <li key={index} className="small">{step}</li>
                                    ))}
                                </ul>
                            </div>
                            <div>
                                <strong>Urgency Level:</strong>
                                <span className={`badge ms-2 ${
                                    results.recommendations.urgency === 'High' ? 'bg-danger' :
                                    results.recommendations.urgency === 'Medium' ? 'bg-warning text-dark' : 'bg-success'
                                }`}>
                                    {results.recommendations.urgency}
                                </span>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-4 text-center">
                <button 
                    className="btn btn-outline-success me-2"
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                >
                    <i className="fas fa-arrow-up me-2"></i>
                    Back to Top
                </button>
                <button 
                    className="btn btn-success"
                    onClick={() => window.location.reload()}
                >
                    <i className="fas fa-redo me-2"></i>
                    Start New Identification
                </button>
            </div>
        </div>
    );
};

export default Results;