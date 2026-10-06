# app/services/ingestion/service.py

import os
import uuid
from io import BytesIO
import logging
from pathlib import Path
from typing import Dict, Any, List, Optional

import pandas as pd
from fastapi import UploadFile

logger = logging.getLogger(__name__)

DATA_BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "..", "data"))
UPLOADS_DIR = os.path.join(DATA_BASE_DIR, "uploads")

REQUIRED_CSV_FILES = [
    "assets.csv",
    "vulnerabilities.csv",
    "asset_relationships.csv",
    "business_services.csv",
    "controls.csv",
    "control_status.csv",
    "control_effectiveness.csv",
    "threat_scenarios.csv",
    "threat_asset_impacts.csv",
]
OPTIONAL_CSV_FILES = [
    "asset_type_mapping.csv",
    "business_units.csv",
    "relationship_weights.csv",
    "vulnerability_threat_rules.csv",
]
MAX_UPLOAD_SIZE_BYTES = 50 * 1024 * 1024
ALLOWED_DATA_FILES = {Path(filename).stem for filename in REQUIRED_CSV_FILES + OPTIONAL_CSV_FILES}


def save_customer_dataset(files: List[UploadFile]) -> Dict[str, Any]:
    """
    Saves uploaded CSV or XLSX inputs to canonical CSV filenames in an isolated dataset folder.
    """
    if not files:
        raise ValueError("No files uploaded.")

    dataset_id = f"ds_{uuid.uuid4().hex[:8]}"
    target_dir = os.path.join(UPLOADS_DIR, dataset_id)
    os.makedirs(target_dir, exist_ok=True)
    saved_files = []
    seen_stems = set()
    try:
        for file in files:
            raw_filename = (file.filename or "").replace("\\", "/").rsplit("/", 1)[-1]
            filename = Path(raw_filename)
            stem = filename.stem.lower()
            extension = filename.suffix.lower()
            if stem not in ALLOWED_DATA_FILES or extension not in {".csv", ".xlsx"}:
                raise ValueError(
                    f"Unsupported file '{raw_filename}'. Use a supported dataset filename with .csv or .xlsx."
                )
            if stem in seen_stems:
                raise ValueError(f"Only one file can be uploaded for {stem}.csv.")
            seen_stems.add(stem)

            contents = file.file.read(MAX_UPLOAD_SIZE_BYTES + 1)
            if len(contents) > MAX_UPLOAD_SIZE_BYTES:
                raise ValueError(f"{raw_filename} exceeds the 50 MB file size limit.")

            dest_path = os.path.join(target_dir, f"{stem}.csv")
            if extension == ".csv":
                with open(dest_path, "wb") as output:
                    output.write(contents)
            else:
                try:
                    dataframe = pd.read_excel(BytesIO(contents), engine="openpyxl")
                except Exception as error:
                    raise ValueError(f"Could not read Excel file '{raw_filename}': {error}") from error
                dataframe.to_csv(dest_path, index=False)
            saved_files.append(f"{stem}.csv")

        existing_files = os.listdir(target_dir)
        missing_required = [filename for filename in REQUIRED_CSV_FILES if filename not in existing_files]
        status = "ready" if not missing_required else "partially_valid"
    except Exception:
        for filename in os.listdir(target_dir):
            path = os.path.join(target_dir, filename)
            if os.path.isfile(path):
                os.remove(path)
        os.rmdir(target_dir)
        raise

    return {
        "status": "success",
        "dataset_id": dataset_id,
        "dataset_path": target_dir,
        "saved_files": saved_files,
        "all_files": existing_files,
        "missing_required": missing_required,
        "ingestion_status": status,
    }


def list_datasets() -> List[Dict[str, Any]]:
    """Lists all ingested datasets available on the backend."""
    datasets = []

    if os.path.exists(UPLOADS_DIR):
        for sub in os.listdir(UPLOADS_DIR):
            full_p = os.path.join(UPLOADS_DIR, sub)
            if os.path.isdir(full_p):
                datasets.append({
                    "dataset_id": sub,
                    "name": f"Customer Dataset ({sub})",
                    "path": full_p,
                    "is_default": False,
                })
    return datasets
