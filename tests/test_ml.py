"""
ML service unit tests for Mindscan AI.
Migrated from legacy test_ml.py to pytest format.
"""
import pytest
from backend.services.ml_service import predict_stress, get_model_and_scaler, MODEL_VERSION


def test_model_loads_successfully():
    """Test that the ML model and scaler load without errors."""
    model, scaler = get_model_and_scaler()
    assert model is not None
    assert scaler is not None


def test_predict_stress_returns_valid_result(sample_survey):
    """Test that predict_stress returns expected structure."""
    result = predict_stress(sample_survey)
    assert "stress_level" in result
    assert "confidence_score" in result
    assert "feature_importance" in result
    assert "model_version" in result
    assert result["stress_level"] in [0, 1, 2]
    assert 0 <= result["confidence_score"] <= 1
    assert result["model_version"] == MODEL_VERSION


def test_predict_stress_with_low_values():
    """Test prediction with all-low values."""
    low_data = {
        "anxiety_level": 0, "self_esteem": 30, "mental_health_history": 0,
        "depression": 0, "headache": 0, "blood_pressure": 2,
        "sleep_quality": 5, "breathing_problem": 0, "noise_level": 0,
        "living_conditions": 5, "safety": 5, "basic_needs": 5,
        "academic_performance": 5, "study_load": 0,
        "teacher_student_relationship": 5, "future_career_concerns": 0,
        "social_support": 3, "peer_pressure": 0,
        "extracurricular_activities": 5, "bullying": 0
    }
    result = predict_stress(low_data)
    assert result["stress_level"] in [0, 1, 2]


def test_model_version_is_set():
    """Test that MODEL_VERSION constant is properly defined."""
    assert MODEL_VERSION is not None
    assert len(MODEL_VERSION) > 0
    assert MODEL_VERSION.startswith("v")
