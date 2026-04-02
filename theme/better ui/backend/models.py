from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime, JSON
from sqlalchemy.orm import relationship
from database import Base
import uuid
from datetime import datetime

class Session(Base):
    __tablename__ = "sessions"
    session_id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()), index=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    responses = relationship("Response", back_populates="session")

class Response(Base):
    __tablename__ = "responses"
    response_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    session_id = Column(String(36), ForeignKey("sessions.session_id"))
    
    # Features từ Survey
    age = Column(Integer)
    gender = Column(String(50))
    academic_year = Column(String(50))
    major = Column(String(100))
    cgpa = Column(Float)
    sleep_hours = Column(Float)
    study_hours = Column(Float)
    social_activity = Column(Float)
    physical_activity = Column(Float)
    academic_pressure = Column(Float)
    financial_stress = Column(Float)
    mental_health_history = Column(String(50))
    relationship_status = Column(String(50))
    
    session = relationship("Session", back_populates="responses")
    prediction = relationship("Prediction", back_populates="response", uselist=False)

class Prediction(Base):
    __tablename__ = "predictions"
    pred_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    response_id = Column(Integer, ForeignKey("responses.response_id"))
    
    stress_level = Column(Integer) # 0: Low, 1: Medium, 2: High
    confidence_score = Column(Float)
    feature_importance = Column(JSON) # Lưu trữ dạng JSON
    
    response = relationship("Response", back_populates="prediction")
    recommendations = relationship("Recommendation", back_populates="prediction")

class Recommendation(Base):
    __tablename__ = "recommendations"
    reco_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    pred_id = Column(Integer, ForeignKey("predictions.pred_id"))
    
    category = Column(String(100))
    title = Column(String(200))
    description = Column(String(1000))
    
    prediction = relationship("Prediction", back_populates="recommendations")
