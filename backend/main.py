import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

dotenv_path = os.path.join(os.path.dirname(__file__), ".env")
load_dotenv(dotenv_path)

from backend.routers import user, admin
from backend.database import engine, Base

@asynccontextmanager
async def lifespan(app: FastAPI):
    print("Backend started")
    from backend.services.ml_service import get_model_and_scaler
    get_model_and_scaler()
    
    # Database schema management
    # Production: run `alembic upgrade head` before starting the server
    # Development fallback: create tables if they don't exist
    # NOTE: create_all() only creates NEW tables, it cannot ALTER existing ones.
    #       For schema changes (adding columns etc.), use Alembic migrations:
    #       alembic revision --autogenerate -m "description"
    #       alembic upgrade head
    if os.getenv("MINDSCAN_AUTO_CREATE_TABLES", "true").lower() == "true":
        async with engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)
            print("Database tables ensured (dev mode). Use Alembic for production.")
    
    yield
    print("Backend shutting down")

app = FastAPI(
    title="Mindscan AI API",
    description="Backend for Mindscan AI Survey & Recommendation System",
    version="1.0.0",
    lifespan=lifespan
)

# CORS setup for allowing requests from the frontend landing page
# Frontend runs on port 3000 (package.json --port=3000) but geminiService.ts calls port 8080;
# Add both common ports so both dev server configs can reach the backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(user.router)
app.include_router(admin.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to Mindscan AI API. Documentation available at /docs"}
