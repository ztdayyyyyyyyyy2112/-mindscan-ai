# Hướng dẫn triển khai Backend MindScan AI

Thư mục `backend` này chứa toàn bộ mã nguồn Python/FastAPI để phục vụ cho dự án MindScan AI.

## 1. Cấu trúc thư mục
- `main.py`: File chạy chính của FastAPI, định nghĩa các API Endpoints.
- `database.py`: Kết nối CSDL (SQLAlchemy).
- `models.py`: Định nghĩa các bảng trong CSDL (Session, Response, Prediction, Recommendation).
- `schemas.py`: Định nghĩa cấu trúc dữ liệu Request/Response (Pydantic).
- `ml_model.py`: Chứa logic load file `.pkl` và hàm dự đoán, cũng như Rule-based Recommendation Engine.
- `requirements.txt`: Danh sách các thư viện cần thiết.

## 2. Cách chạy ở môi trường Local (Máy cá nhân)

1. Mở terminal, di chuyển vào thư mục `backend`:
   ```bash
   cd backend
   ```

2. Tạo môi trường ảo (Virtual Environment) và kích hoạt:
   ```bash
   python -m venv venv
   # Windows:
   venv\Scripts\activate
   # Mac/Linux:
   source venv/bin/activate
   ```

3. Cài đặt thư viện:
   ```bash
   pip install -r requirements.txt
   ```

4. Copy 2 file `.pkl` của bạn (`rf_model_v1.pkl` và `preprocessor.pkl`) vào thư mục `backend`.

5. Chạy server:
   ```bash
   uvicorn main:app --reload
   ```

6. Truy cập tài liệu API tự động (Swagger UI):
   Mở trình duyệt và vào: `http://127.0.0.1:8000/docs`

## 3. Cách triển khai lên Railway.app

1. Tạo một repository trên GitHub và đẩy toàn bộ thư mục `backend` lên đó.
2. Đăng nhập vào [Railway.app](https://railway.app/).
3. Tạo một project mới -> Chọn **Provision PostgreSQL** hoặc **MySQL** (Railway hỗ trợ tốt Postgres hơn, nếu dùng Postgres bạn cần đổi `pymysql` thành `psycopg2-binary` trong `requirements.txt`).
4. Thêm một service mới -> Chọn **Deploy from GitHub repo** -> Chọn repo chứa code backend của bạn.
5. Trong phần **Variables** của service backend trên Railway, thêm biến môi trường:
   - `DATABASE_URL`: Copy chuỗi kết nối từ Database service bạn vừa tạo ở bước 3.
6. Railway sẽ tự động nhận diện file `requirements.txt` và chạy FastAPI.

## 4. Tích hợp với Frontend (React)

Sau khi backend chạy (local hoặc trên Railway), bạn cần cập nhật URL trong Frontend React.
Thay vì gọi `geminiService.ts`, bạn sẽ dùng `fetch` hoặc `axios` gọi tới:
- `POST http://localhost:8000/api/session`
- `POST http://localhost:8000/api/predict`
