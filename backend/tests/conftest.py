from pathlib import Path

import pytest

from app.services.data_sources import service as data_source_service


@pytest.fixture(autouse=True)
def active_test_dataset(monkeypatch):
    monkeypatch.setattr(data_source_service, "_active_mode", "uploaded")
    monkeypatch.setattr(
        data_source_service,
        "_active_uploaded_path",
        Path(__file__).resolve().parents[1] / "data",
    )
    monkeypatch.setattr(data_source_service, "_saved_uploaded_path", lambda: None)
