"""
API endpoint tests for Mindscan AI backend.
Migrated from legacy test_backend_live.py to pytest format.
"""
import pytest


@pytest.mark.asyncio
async def test_root_endpoint(client):
    """Test the root endpoint returns welcome message."""
    res = await client.get("/")
    assert res.status_code == 200
    data = res.json()
    assert "message" in data
    assert "Mindscan AI API" in data["message"]


@pytest.mark.asyncio
async def test_create_session(client):
    """Test creating a new anonymous session."""
    res = await client.post("/api/session")
    assert res.status_code == 201
    data = res.json()
    assert "session_id" in data
    assert len(data["session_id"]) > 0


@pytest.mark.asyncio
async def test_predict_stress(client, session_id, sample_survey):
    """Test submitting survey and getting prediction."""
    res = await client.post(
        f"/api/predict?session_id={session_id}",
        json=sample_survey,
    )
    assert res.status_code == 200
    data = res.json()
    pred = data["prediction"]
    assert pred["stress_level"] in [0, 1, 2]
    assert 0 <= pred["confidence_score"] <= 1
    assert "model_version" in pred
    assert len(pred["recommendations"]) > 0
    assert "feature_importance" in pred


@pytest.mark.asyncio
async def test_predict_low_stress(client, low_stress_survey):
    """Test low-stress scenario returns appropriate results."""
    # Create session
    sess_res = await client.post("/api/session")
    sid = sess_res.json()["session_id"]

    res = await client.post(
        f"/api/predict?session_id={sid}",
        json=low_stress_survey,
    )
    assert res.status_code == 200
    pred = res.json()["prediction"]
    assert pred["stress_level"] in [0, 1, 2]
    assert len(pred["recommendations"]) > 0


@pytest.mark.asyncio
async def test_get_recommendations(client, session_id, sample_survey):
    """Test retrieving recommendations by prediction ID."""
    pred_res = await client.post(
        f"/api/predict?session_id={session_id}",
        json=sample_survey,
    )
    pred_id = pred_res.json()["prediction"]["pred_id"]

    res = await client.get(f"/api/recommend/{pred_id}")
    assert res.status_code == 200
    recs = res.json()
    assert isinstance(recs, list)
    assert len(recs) > 0
    for r in recs:
        assert "category" in r
        assert "title" in r
        assert "description" in r


@pytest.mark.asyncio
async def test_get_history(client, session_id, sample_survey):
    """Test retrieving session history."""
    # Submit a prediction first
    await client.post(
        f"/api/predict?session_id={session_id}",
        json=sample_survey,
    )

    res = await client.get(f"/api/history/{session_id}")
    assert res.status_code == 200
    data = res.json()
    assert data["session_id"] == session_id
    assert len(data["predictions"]) >= 1


@pytest.mark.asyncio
async def test_invalid_survey_returns_422(client, session_id):
    """Test that invalid survey data returns 422 validation error."""
    bad_data = {"age": 5, "gender": "x", "anxiety_level": 99}
    res = await client.post(
        f"/api/predict?session_id={session_id}",
        json=bad_data,
    )
    assert res.status_code == 422


@pytest.mark.asyncio
async def test_nonexistent_session_returns_404(client):
    """Test that a fake session ID returns 404."""
    res = await client.get("/api/history/fake-session-does-not-exist")
    assert res.status_code == 404


@pytest.mark.asyncio
async def test_admin_stats_without_token_returns_401_or_403(client):
    """Test that admin endpoints require JWT authentication."""
    res = await client.get("/api/admin/stats")
    assert res.status_code in [401, 403]
