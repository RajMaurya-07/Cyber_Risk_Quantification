from fastapi.testclient import TestClient

from app.main import app
from app.services.data_sources import service as data_source_service


client = TestClient(app)


def test_calculation_routes_are_blocked_without_a_customer_source(monkeypatch):
    monkeypatch.setattr(data_source_service, "_active_mode", "unconfigured")
    monkeypatch.setattr(data_source_service, "_active_uploaded_path", None)
    monkeypatch.setattr(data_source_service, "_saved_uploaded_path", lambda: None)

    status = client.get("/api/v1/data-sources/status")
    assert status.status_code == 200
    assert status.json()["active_mode"] == "unconfigured"
    assert status.json()["calculations_enabled"] is False

    risk = client.get("/api/v1/risk")
    assert risk.status_code == 409
    assert risk.json()["code"] == "data_source_not_configured"

    optimization = client.post("/api/v1/optimization/evaluate", json={})
    assert optimization.status_code == 409
    assert optimization.json()["code"] == "data_source_not_configured"
