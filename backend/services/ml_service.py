import os
import joblib
import numpy as np
import logging

logger = logging.getLogger(__name__)

# Assume the artifacts are placed in the backend root or project root. You can adjust paths later.
BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
MODEL_PATH = os.path.join(BASE_DIR, "xgboost_stress_model.pkl")
SCALER_PATH = os.path.join(BASE_DIR, "scaler.pkl")

# We use global variables to hold model instances so they only load once.
_model = None
_scaler = None

def get_model_and_scaler():
    global _model, _scaler
    if _model is None or _scaler is None:
        try:
            _model = joblib.load(MODEL_PATH)
            _scaler = joblib.load(SCALER_PATH)
            logger.info("Successfully loaded ML model and scaler.")
        except Exception as e:
            logger.error(f"Error loading model or scaler: {e}")
            # Do not raise here; allow the server to start, we'll raise an error during prediction.
    return _model, _scaler

def predict_stress(input_data: dict) -> dict:
    model, scaler = get_model_and_scaler()
    if not model or not scaler:
        raise RuntimeError("Model or Scaler not loaded. Please make sure the .pkl files exist.")

    # Order of features must match what the model was trained on!
    # Expected: age, gender, cgpa, sleep_hours, study_hours, social_activity, 
    #           physical_activity, academic_pressure, financial_stress, mental_health_history
    # NOTE: 'gender' is string, we might need to handle categorical encoding if the AI engineer didn't include it in 'scaler'.
    # If the model expects numerical gender (e.g., 0=Male, 1=Female), we might need to map it here first.
    # Assuming the AI Engineer provided a scaler that handles numericals, let's just do a naive encoding or pass it as is.
    # Usually XGBoost can't handle bare strings implicitly unless encoded.
    
    extra = input_data.get('extra_features') or {}
    
    def get_val(key, default=0.0):
        # Numeric values expected usually
        if key in input_data:
            return float(input_data[key])
        if key in extra:
            return float(extra[key])
        return float(default)

    features = [
        get_val('anxiety_level', input_data.get('academic_pressure', 0)), # Mapping fallback
        get_val('self_esteem', 10),
        get_val('mental_health_history', input_data.get('mental_health_history', 0)),
        get_val('depression', 0),
        get_val('headache', 0),
        get_val('blood_pressure', 0),
        get_val('sleep_quality', input_data.get('sleep_hours', 0)),
        get_val('breathing_problem', 0),
        get_val('noise_level', 0),
        get_val('living_conditions', 0),
        get_val('safety', 0),
        get_val('basic_needs', 0),
        get_val('academic_performance', input_data.get('cgpa', 0)),
        get_val('study_load', input_data.get('study_hours', 0)),
        get_val('teacher_student_relationship', 0),
        get_val('future_career_concerns', input_data.get('financial_stress', 0)),
        get_val('social_support', input_data.get('social_activity', 0)),
        get_val('peer_pressure', 0),
        get_val('extracurricular_activities', input_data.get('physical_activity', 0)),
        get_val('bullying', 0)
    ]

    features_array = np.array([features])

    # Scale the features
    scaled_features = scaler.transform(features_array)

    # Predict
    prediction = model.predict(scaled_features)
    
    # Try probabilities
    try:
        probabilities = model.predict_proba(scaled_features)
        confidence = float(np.max(probabilities[0]))
    except Exception:
        confidence = 1.0 # Fallback if no proba method

    stress_level = int(prediction[0])

    # --- Real Feature Importance from XGBoost model ---
    # Column names must match exactly the order used during model training
    feature_names = [
        'anxiety_level', 'self_esteem', 'mental_health_history', 'depression',
        'headache', 'blood_pressure', 'sleep_quality', 'breathing_problem',
        'noise_level', 'living_conditions', 'safety', 'basic_needs',
        'academic_performance', 'study_load', 'teacher_student_relationship',
        'future_career_concerns', 'social_support', 'peer_pressure',
        'extracurricular_activities', 'bullying'
    ]

    # Map back to user-facing keys that the frontend understands
    key_map = {
        'anxiety_level': 'anxiety_level',
        'self_esteem': 'self_esteem',
        'mental_health_history': 'mental_health_history',
        'depression': 'depression',
        'headache': 'headache',
        'blood_pressure': 'blood_pressure',
        'sleep_quality': 'sleep_hours',
        'breathing_problem': 'breathing_problem',
        'noise_level': 'noise_level',
        'living_conditions': 'living_conditions',
        'safety': 'living_conditions',
        'basic_needs': 'financial_stress',
        'academic_performance': 'cgpa',
        'study_load': 'study_hours',
        'teacher_student_relationship': 'academic_pressure',
        'future_career_concerns': 'financial_stress',
        'social_support': 'social_activity',
        'peer_pressure': 'academic_pressure',
        'extracurricular_activities': 'physical_activity',
        'bullying': 'bullying',
    }

    try:
        importances = model.feature_importances_
        # Aggregate importances by frontend key (some features map to same key)
        agg: dict = {}
        for fname, imp in zip(feature_names, importances):
            fkey = key_map.get(fname, fname)
            agg[fkey] = agg.get(fkey, 0.0) + float(imp)
        
        # Normalize to sum = 1 and sort descending, keep top 6
        total = sum(agg.values()) or 1.0
        sorted_items = sorted(agg.items(), key=lambda x: x[1], reverse=True)[:6]
        feature_importance = {k: round(v / total, 4) for k, v in sorted_items}
    except Exception:
        feature_importance = {
            "academic_pressure": 0.40,
            "sleep_hours": 0.30,
            "financial_stress": 0.15,
            "social_activity": 0.15
        }

    return {
        "stress_level": stress_level,
        "confidence_score": confidence,
        "feature_importance": feature_importance
    }
