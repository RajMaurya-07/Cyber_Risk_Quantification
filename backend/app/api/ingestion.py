from fastapi import APIRouter, Depends, HTTPException
from typing import List, Dict, Any

router = APIRouter(prefix="/ingestion", tags=["ingestion"])

@router.get("/")
def get_ingestion_data():
    return {"status": "ok", "module": "ingestion"}
