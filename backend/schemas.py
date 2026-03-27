from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime

class SessionResponse(BaseModel):
    session_id: str
    created_at: datetime
    
    class Config:
        from_attributes = True

class SurveyInput(BaseModel):
    age: int = Field(..., ge=10, le=100)
    gender: str = Field(..., max_length=50)
    cgpa: float = Field(..., ge=0, le=4.0) # Max 4.0 to match the frontend GPA scale
    sleep_hours: float = Field(..., ge=0, le=24)
    study_hours: float = Field(..., ge=0, le=24)
    social_activity: float = Field(..., ge=0)
    physical_activity: float = Field(..., ge=0)
    academic_pressure: int = Field(..., ge=0)
    financial_stress: int = Field(..., ge=0)
    mental_health_history: int = Field(..., ge=0, le=1) # Example: 0 for No, 1 for Yes
    extra_features: Optional[Dict[str, Any]] = None

class RecommendationResponse(BaseModel):
    reco_id: int
    category: str
    title: str
    description: str

    class Config:
        from_attributes = True

class PredictionResponse(BaseModel):
    pred_id: int
    stress_level: int
    confidence_score: float
    feature_importance: Optional[Dict[str, float]] = None # Assuming we might add feature importance
    recommendations: Optional[List[RecommendationResponse]] = []

    class Config:
        from_attributes = True

class SurveySubmissionResponse(BaseModel):
    session_id: str
    prediction: PredictionResponse

class HistoryResponse(BaseModel):
    session_id: str
    created_at: datetime
    predictions: List[PredictionResponse]
    
    class Config:
        from_attributes = True

class AdminStatsResponse(BaseModel):
    total_sessions: int
    total_predictions: int
    high_stress_rate: float
