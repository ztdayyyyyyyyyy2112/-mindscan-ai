"""
Shared test fixtures for Mindscan AI backend tests.
"""
import pytest
from httpx import AsyncClient, ASGITransport
from backend.main import app


@pytest.fixture
def sample_survey():
    """Standard survey payload for testing."""
    return {
        "age": 20,
        "gender": "male",
        "anxiety_level": 14,
        "self_esteem": 10,
        "mental_health_history": 0,
        "depression": 12,
        "headache": 3,
        "blood_pressure": 2,
        "sleep_quality": 1.5,
        "breathing_problem": 2,
        "noise_level": 3,
        "living_conditions": 2,
        "safety": 3,
        "basic_needs": 2,
        "academic_performance": 2,
        "study_load": 4,
        "teacher_student_relationship": 3,
        "future_career_concerns": 4,
        "social_support": 1,
        "peer_pressure": 3,
        "extracurricular_activities": 2,
        "bullying": 1,
    }


@pytest.fixture
def low_stress_survey():
    """Low stress survey payload for testing."""
    return {
        "age": 22,
        "gender": "female",
        "anxiety_level": 3,
        "self_esteem": 25,
        "mental_health_history": 0,
        "depression": 2,
        "headache": 1,
        "blood_pressure": 1,
        "sleep_quality": 4,
        "breathing_problem": 1,
        "noise_level": 2,
        "living_conditions": 4,
        "safety": 4,
        "basic_needs": 4,
        "academic_performance": 4,
        "study_load": 2,
        "teacher_student_relationship": 4,
        "future_career_concerns": 2,
        "social_support": 3,
        "peer_pressure": 1,
        "extracurricular_activities": 4,
        "bullying": 0,
    }


@pytest.fixture
async def client():
    """Async HTTP test client using httpx."""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        yield ac


@pytest.fixture
async def session_id(client):
    """Create a test session and return its ID."""
    res = await client.post("/api/session")
    assert res.status_code == 201
    return res.json()["session_id"]
