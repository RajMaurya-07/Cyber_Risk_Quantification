# app/api/ingestion.py

from typing import List, Dict, Any, Optional
from fastapi import APIRouter, UploadFile, File, HTTPException

from app.services.ingestion.service import save_customer_dataset, list_datasets
from app.services.data_sources.service import activate_uploaded_dataset

router = APIRouter(prefix="/ingestion", tags=["ingestion"])


@router.get("")
@router.get("/")
def get_ingestion_data():
    """Lists available ingested datasets on the backend."""
    try:
        datasets = list_datasets()
        return {"status": "success", "count": len(datasets), "datasets": datasets}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/upload")
def upload_customer_dataset(files: List[UploadFile] = File(...)):
    """
    Accepts customer CSV or XLSX files and activates complete datasets for quantification.
    """
    if not files:
        raise HTTPException(status_code=400, detail="No files uploaded")
    try:
        res = save_customer_dataset(files)
        if res["ingestion_status"] == "ready":
            res["active_source"] = activate_uploaded_dataset(res["dataset_id"])
        return res
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e)) from e
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
