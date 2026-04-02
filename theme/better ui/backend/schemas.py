from pydantic import BaseModel
from typing import List, Dict, Any
from datetime import datetime

class SessionResponse(BaseModel):
    session_id: str
    created_at: datetime
    class Config:
        from_attributes = True

class SurveyInput(BaseModel):
    session_id: str
    age: int
    gender: str
    academic_year: str
    major: str
    cgpa: float
    sleep_hours: float
    study_hours: float
    social_activity: float
    physical_activity: float
    academic_pressure: float
    financial_stress: float
    mental_health_history: str
    relationship_status: str

class RecommendationSchema(BaseModel):
    category: str
    title: str
    description: str
    class Config:
        from_attributes = True

class PredictionResponse(BaseModel):
    pred_id: int
    stress_level: int
    confidence_score: float
    feature_importance: Dict[str, float]
    recommendations: List[RecommendationSchema]
    class Config:
        from_attributes = True
