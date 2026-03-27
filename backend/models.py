import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Text
from sqlalchemy import String as CHAR
from sqlalchemy.orm import relationship
from .database import Base

class Session(Base):
    __tablename__ = "sessions"

    session_id = Column(CHAR(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    responses = relationship("Response", back_populates="session", cascade="all, delete-orphan")


class Response(Base):
    __tablename__ = "responses"

    response_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    session_id = Column(CHAR(36), ForeignKey("sessions.session_id"))

    # Survey Features
    age = Column(Integer)
    gender = Column(String(50))
    cgpa = Column(Float)
    sleep_hours = Column(Float)
    study_hours = Column(Float)
    social_activity = Column(Float)
    physical_activity = Column(Float)
    academic_pressure = Column(Integer)
    financial_stress = Column(Integer)
    mental_health_history = Column(Integer)
    # We will allow some flexibility if there are more features by adding JSON or just leaving it for now
    extra_features = Column(Text, nullable=True) # Storing stringified JSON if needed

    session = relationship("Session", back_populates="responses")
    prediction = relationship("Prediction", back_populates="response", uselist=False, cascade="all, delete-orphan")


class Prediction(Base):
    __tablename__ = "predictions"

    pred_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    response_id = Column(Integer, ForeignKey("responses.response_id"))
    
    stress_level = Column(Integer) # 0: Low, 1: Medium, 2: High
    confidence_score = Column(Float)
    
    response = relationship("Response", back_populates="prediction")
    recommendations = relationship("Recommendation", back_populates="prediction", cascade="all, delete-orphan")


class Recommendation(Base):
    __tablename__ = "recommendations"

    reco_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    pred_id = Column(Integer, ForeignKey("predictions.pred_id"))
    
    category = Column(String(100))
    title = Column(String(255))
    description = Column(Text)
    
    prediction = relationship("Prediction", back_populates="recommendations")
