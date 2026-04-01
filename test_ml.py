from backend.services.ml_service import predict_stress, FEATURE_NAMES
import traceback

input_data = { 'age': 20, 'gender': 'male', 'anxiety_level': 5, 'depression': 5, 'self_esteem': 15, 'mental_health_history': 0, 'blood_pressure': 2, 'sleep_quality': 3, 'headache': 0, 'breathing_problem': 0, 'study_load': 3, 'academic_performance': 3, 'teacher_student_relationship': 3, 'future_career_concerns': 3, 'social_support': 1, 'peer_pressure': 0, 'extracurricular_activities': 2, 'bullying': 0, 'noise_level': 0, 'living_conditions': 3, 'safety': 3, 'basic_needs': 3 }

try:
    result = predict_stress(input_data)
    contribs = result.get("feature_contributions", [])
    assert contribs, "Feature contributions should not be empty"
    assert len(contribs) == len(FEATURE_NAMES), "Each feature must have a contribution"
    print("Stress level:", result["stress_level"])
    print("Top importance:", result["feature_importance"])
except Exception as e:
    traceback.print_exc()
