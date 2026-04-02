import joblib
import pandas as pd
import os

# Đường dẫn tới file model (bạn sẽ upload các file .pkl vào cùng thư mục backend)
MODEL_PATH = os.getenv("MODEL_PATH", "rf_model_v1.pkl")
PREPROCESSOR_PATH = os.getenv("PREPROCESSOR_PATH", "preprocessor.pkl")

class StressPredictor:
    def __init__(self):
        self.model = None
        self.preprocessor = None
        self._load_models()

    def _load_models(self):
        try:
            if os.path.exists(MODEL_PATH):
                self.model = joblib.load(MODEL_PATH)
                print(f"Loaded model from {MODEL_PATH}")
            if os.path.exists(PREPROCESSOR_PATH):
                self.preprocessor = joblib.load(PREPROCESSOR_PATH)
                print(f"Loaded preprocessor from {PREPROCESSOR_PATH}")
        except Exception as e:
            print(f"Error loading models: {e}")

    def predict(self, data: dict):
        # Fallback logic nếu chưa có file .pkl
        if self.model is None:
            return self._dummy_predict(data)
            
        try:
            # Chuyển đổi data thành DataFrame
            df = pd.DataFrame([data])
            
            # Tiền xử lý dữ liệu (nếu có preprocessor)
            if self.preprocessor:
                df_processed = self.preprocessor.transform(df)
            else:
                df_processed = df
                
            # Dự đoán
            prediction = self.model.predict(df_processed)[0]
            
            # Lấy xác suất (confidence score)
            if hasattr(self.model, 'predict_proba'):
                probabilities = self.model.predict_proba(df_processed)[0]
                confidence = max(probabilities)
            else:
                confidence = 0.85 # Default nếu model không hỗ trợ predict_proba
            
            # Trích xuất Feature Importance (đối với Random Forest)
            feature_importance = {}
            if hasattr(self.model, 'feature_importances_'):
                importances = self.model.feature_importances_
                # Giả sử df_processed giữ nguyên tên cột hoặc bạn map lại
                feature_names = df.columns 
                feature_importance = dict(zip(feature_names, importances))
                
            return {
                "stress_level": int(prediction),
                "confidence_score": float(confidence),
                "feature_importance": feature_importance
            }
        except Exception as e:
            print(f"Prediction error: {e}")
            return self._dummy_predict(data)

    def _dummy_predict(self, data: dict):
        """Logic giả lập khi chưa gắn model thật"""
        stress_score = 0
        if data.get('sleep_hours', 8) < 6: stress_score += 1
        if data.get('academic_pressure', 0) > 3: stress_score += 1
        if data.get('financial_stress', 0) > 3: stress_score += 1
        
        level = 0
        if stress_score >= 2: level = 2
        elif stress_score == 1: level = 1
        
        return {
            "stress_level": level,
            "confidence_score": 0.88,
            "feature_importance": {
                "academic_pressure": 0.45,
                "sleep_hours": 0.35,
                "financial_stress": 0.20
            }
        }

predictor = StressPredictor()

def generate_recommendations(stress_level: int, survey_data: dict):
    """Rule-based Recommendation Engine"""
    recs = []
    
    # 1. Logic dựa trên Feature cụ thể
    if survey_data.get('sleep_hours', 8) < 5:
        recs.append({
            "category": "Giấc ngủ",
            "title": "Cải thiện vệ sinh giấc ngủ",
            "description": "Bạn đang ngủ dưới 5 tiếng mỗi ngày. Hãy thử thiết lập giờ ngủ cố định, tránh màn hình điện thoại 1 giờ trước khi ngủ và tạo không gian ngủ yên tĩnh."
        })
        
    if survey_data.get('academic_pressure', 0) >= 4:
        recs.append({
            "category": "Học tập",
            "title": "Quản lý áp lực học tập",
            "description": "Áp lực học tập của bạn đang ở mức cao. Hãy thử áp dụng phương pháp Pomodoro (học 25 phút, nghỉ 5 phút) và chia nhỏ khối lượng bài tập."
        })
        
    # 2. Logic dựa trên Stress Level tổng thể
    if stress_level == 2: # HIGH
        recs.append({
            "category": "Khẩn cấp",
            "title": "Hỗ trợ Tâm lý Chuyên nghiệp",
            "description": "Mức độ stress của bạn đang rất cao. Vui lòng liên hệ Hotline Tư vấn Tâm lý: 1800 599 920 để được hỗ trợ kịp thời từ chuyên gia."
        })
    elif stress_level == 1: # MEDIUM
        if len(recs) < 3: # Đảm bảo có đủ gợi ý
            recs.append({
                "category": "Thư giãn",
                "title": "Thực hành Chánh niệm",
                "description": "Dành 10-15 phút mỗi ngày để thiền hoặc tập hít thở sâu giúp giảm căng thẳng hiệu quả."
            })
    else: # LOW
        recs.append({
            "category": "Duy trì",
            "title": "Duy trì thói quen tốt",
            "description": "Bạn đang quản lý stress rất tốt! Hãy tiếp tục duy trì lối sống cân bằng hiện tại."
        })
        
    return recs
