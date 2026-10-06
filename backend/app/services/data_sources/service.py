import json
import logging
import os
import shutil
from pathlib import Path
from threading import Lock
from typing import Any, Dict, List, Optional

import pandas as pd
from sqlalchemy import create_engine, inspect, text

from app.core.config import settings

logger = logging.getLogger(__name__)

DATA_SOURCE_MODES = {
    "sample": "sample",
    "uploaded": "uploaded",
    "supabase-primary": "supabase-primary",
    "supabase-secondary": "supabase-secondary",
}
REQUIRED_TABLES = (
    "assets",
    "vulnerabilities",
    "asset_relationships",
    "business_services",
    "control_status",
    "risk_scenarios",
    "threat_scenarios",
)
_activation_lock = Lock()
_active_mode = "unconfigured"
_active_uploaded_path: Optional[Path] = None
_materialized_paths: Dict[str, Path] = {}


class DataSourceNotConfiguredError(RuntimeError):
    """Raised when a calculation is requested before a customer data source is active."""


def _uploads_root() -> Path:
    return Path(__file__).resolve().parents[3] / "data" / "uploads"


def _saved_uploaded_path() -> Optional[Path]:
    marker = _uploads_root() / ".active_dataset"
    try:
        dataset_id = marker.read_text(encoding="utf-8").strip()
    except FileNotFoundError:
        return None

    if not dataset_id or Path(dataset_id).name != dataset_id:
        return None
    dataset_path = (_uploads_root() / dataset_id).resolve()
    if dataset_path.parent != _uploads_root().resolve() or not dataset_path.is_dir():
        return None

    from app.services.ingestion.service import REQUIRED_CSV_FILES

    if any(not (dataset_path / filename).is_file() for filename in REQUIRED_CSV_FILES):
        return None
    return dataset_path


def get_active_mode() -> str:
    global _active_mode, _active_uploaded_path
    saved_path = _saved_uploaded_path()
    if saved_path:
        _active_mode = "uploaded"
        _active_uploaded_path = saved_path
    return _active_mode


def get_mode_status(mode: str) -> Dict[str, Any]:
    if mode not in DATA_SOURCE_MODES:
        raise ValueError(f"Unsupported data source mode: {mode}")

    if mode == "sample":
        return {"mode": mode, "status": "disabled", "data_dir": None}
    if mode == "uploaded":
        saved_path = _saved_uploaded_path()
        if saved_path:
            return {"mode": mode, "status": "ready", "data_dir": str(saved_path)}
        return {
            "mode": mode,
            "status": "ready" if _active_uploaded_path and _active_uploaded_path.exists() else "not_configured",
            "data_dir": str(_active_uploaded_path) if _active_uploaded_path and _active_uploaded_path.exists() else None,
        }

    path = _materialized_paths.get(mode)
    return {
        "mode": mode,
        "status": "ready" if path and path.exists() else "not_configured",
        "data_dir": str(path) if path and path.exists() else None,
    }


def activate_mode(mode: str) -> Dict[str, Any]:
    global _active_mode, _active_uploaded_path

    if mode not in DATA_SOURCE_MODES:
        raise ValueError(f"Unsupported data source mode: {mode}")
    if mode == "sample":
        raise ValueError("Sample data cannot be activated. Upload or connect a customer data source.")
    with _activation_lock:
        if mode == "uploaded":
            saved_path = _saved_uploaded_path()
            if saved_path:
                _active_uploaded_path = saved_path
            if not _active_uploaded_path or not _active_uploaded_path.exists():
                raise ValueError("Upload a complete customer dataset before activating uploaded data.")
        else:
            _materialize_supabase_mode(mode)
        if mode != "uploaded":
            marker = _uploads_root() / ".active_dataset"
            if marker.exists():
                marker.unlink()
            _active_uploaded_path = None
        _active_mode = mode
    return get_mode_status(mode)


def activate_uploaded_dataset(dataset_id: str) -> Dict[str, Any]:
    global _active_mode, _active_uploaded_path

    uploads_root = _uploads_root().resolve()
    dataset_path = (uploads_root / dataset_id).resolve()
    if dataset_path.parent != uploads_root or not dataset_path.is_dir():
        raise ValueError("Uploaded dataset was not found.")

    from app.services.ingestion.service import REQUIRED_CSV_FILES

    missing_files = [filename for filename in REQUIRED_CSV_FILES if not (dataset_path / filename).is_file()]
    if missing_files:
        raise ValueError(f"Uploaded dataset is missing required files: {', '.join(missing_files)}")

    with _activation_lock:
        _active_uploaded_path = dataset_path
        _active_mode = "uploaded"
        marker = uploads_root / ".active_dataset"
        temporary_marker = uploads_root / ".active_dataset.tmp"
        temporary_marker.write_text(dataset_id, encoding="utf-8")
        temporary_marker.replace(marker)
    return get_mode_status("uploaded")


def _get_database_url(mode: str) -> Optional[str]:
    if mode == "supabase-primary":
        return settings.SUPABASE_PRIMARY_DATABASE_URL
    return settings.SUPABASE_SECONDARY_DATABASE_URL


def _materialize_supabase_mode(mode: str) -> None:
    database_url = _get_database_url(mode)
    if not database_url:
        raise ValueError(f"Database URL is not configured for {mode}")

    engine = create_engine(database_url, pool_pre_ping=True)
    inspector = inspect(engine)
    available_tables = set(inspector.get_table_names(schema="public"))
    missing_tables = [table for table in REQUIRED_TABLES if table not in available_tables]
    if missing_tables:
        raise ValueError(
            f"Supabase source is missing canonical tables: {', '.join(missing_tables)}"
        )

    target = _get_materialized_path(mode)
    temporary_target = target.with_name(f"{target.name}.tmp")
    if temporary_target.exists():
        shutil.rmtree(temporary_target)
    temporary_target.mkdir(parents=True, exist_ok=True)

    try:
        with engine.connect() as connection:
            for table in REQUIRED_TABLES:
                frame = pd.read_sql(text(f'SELECT * FROM "{table}"'), connection)
                frame.to_csv(temporary_target / f"{table}.csv", index=False)
        metadata = {"mode": mode, "tables": list(REQUIRED_TABLES)}
        (temporary_target / "source.json").write_text(json.dumps(metadata), encoding="utf-8")
        if target.exists():
            shutil.rmtree(target)
        temporary_target.rename(target)
        _materialized_paths[mode] = target
    except Exception:
        if temporary_target.exists():
            shutil.rmtree(temporary_target)
        raise
    finally:
        engine.dispose()


def _get_materialized_path(mode: str) -> Path:
    base_path = Path(settings.DATA_SOURCE_CACHE_DIR).resolve()
    return base_path / mode


def get_active_data_dir() -> str:
    global _active_mode, _active_uploaded_path
    saved_path = _saved_uploaded_path()
    if saved_path:
        _active_mode = "uploaded"
        _active_uploaded_path = saved_path
    if _active_mode in {"unconfigured", "sample"}:
        raise DataSourceNotConfiguredError(
            "No customer data source is active. Upload a dataset or connect a customer source in Data Sources."
        )
    if _active_mode == "uploaded":
        if not _active_uploaded_path or not _active_uploaded_path.exists():
            raise ValueError("Active uploaded dataset is no longer available.")
        return str(_active_uploaded_path)
    path = _materialized_paths.get(_active_mode)
    if not path or not path.exists():
        raise ValueError(f"Active data source has not been loaded: {_active_mode}")
    return str(path)