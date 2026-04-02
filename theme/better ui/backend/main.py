from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from fastapi.middleware.cors import CORSMiddleware

import models
import schemas
from database import engine, get_db
from ml_model import predictor, generate_recommendations

# Tự động tạo bảng trong DB (Dùng Alembic trong thực tế)
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="MindScan AI API", version="1.0.0")

# Cấu hình CORS để Frontend (React) có thể gọi API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Trong production, thay bằng URL của frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Welcome to MindScan AI Backend"}

# --- PUBLIC ROUTES ---

@app.post("/api/session", response_model=schemas.SessionResponse)
def create_session(db: Session = Depends(get_db)):
    """Tạo một phiên làm việc ẩn danh mới"""
    db_session = models.Session()
    db.add(db_session)
    db.commit()
    db.refresh(db_session)
    return db_session

@app.post("/api/predict", response_model=schemas.PredictionResponse)
def predict_stress(survey: schemas.SurveyInput, db: Session = Depends(get_db)):
    """Tiếp nhận dữ liệu survey, gọi model AI và lưu kết quả"""
    # 1. Kiểm tra session
    db_session = db.query(models.Session).filter(models.Session.session_id == survey.session_id).first()
    if not db_session:
        raise HTTPException(status_code=404, detail="Session not found")
        
    # 2. Lưu Response
    db_response = models.Response(**survey.model_dump())
    db.add(db_response)
    db.commit()
    db.refresh(db_response)
    
    # 3. Gọi AI Model
    survey_dict = survey.model_dump(exclude={"session_id"})
    prediction_result = predictor.predict(survey_dict)
    
    # 4. Lưu Prediction
    db_prediction = models.Prediction(
        response_id=db_response.response_id,
        stress_level=prediction_result["stress_level"],
        confidence_score=prediction_result["confidence_score"],
        feature_importance=prediction_result["feature_importance"]
    )
    db.add(db_prediction)
    db.commit()
    db.refresh(db_prediction)
    
    # 5. Tạo và Lưu Recommendations (Rule-based)
    recs_data = generate_recommendations(prediction_result["stress_level"], survey_dict)
    db_recs = []
    for rec in recs_data:
        db_rec = models.Recommendation(
            pred_id=db_prediction.pred_id,
            **rec
        )
        db.add(db_rec)
        db_recs.append(db_rec)
    db.commit()
    
    # 6. Trả về kết quả
    return {
        "pred_id": db_prediction.pred_id,
        "stress_level": db_prediction.stress_level,
        "confidence_score": db_prediction.confidence_score,
        "feature_importance": db_prediction.feature_importance,
        "recommendations": recs_data
    }

@app.get("/api/recommend/{pred_id}", response_model=List[schemas.RecommendationSchema])
def get_recommendations(pred_id: int, db: Session = Depends(get_db)):
    """Lấy danh sách gợi ý dựa trên ID dự đoán"""
    recs = db.query(models.Recommendation).filter(models.Recommendation.pred_id == pred_id).all()
    if not recs:
        raise HTTPException(status_code=404, detail="Recommendations not found")
    return recs

@app.get("/api/history/{session_id}")
def get_history(session_id: str, db: Session = Depends(get_db)):
    """Lấy lịch sử đánh giá của một session"""
    responses = db.query(models.Response).filter(models.Response.session_id == session_id).all()
    history = []
    for resp in responses:
        if resp.prediction:
            history.append({
                "response_id": resp.response_id,
                "created_at": resp.session.created_at,
                "stress_level": resp.prediction.stress_level,
                "confidence_score": resp.prediction.confidence_score,
                "features": {
                    "academic_pressure": resp.academic_pressure,
                    "sleep_hours": resp.sleep_hours,
                    "financial_stress": resp.financial_stress
                }
            })
    return history

# --- ADMIN ROUTES (Cần thêm JWT Auth trong thực tế) ---

@app.get("/api/admin/stats")
def get_admin_stats(db: Session = Depends(get_db)):
    """Thống kê tổng hợp cho Dashboard Admin"""
    return {
        "total_sessions": db.query(models.Session).count(),
        "total_predictions": db.query(models.Prediction).count(),
        "stress_distribution": {
            "low": db.query(models.Prediction).filter(models.Prediction.stress_level == 0).count(),
            "medium": db.query(models.Prediction).filter(models.Prediction.stress_level == 1).count(),
            "high": db.query(models.Prediction).filter(models.Prediction.stress_level == 2).count(),
        }
    }
