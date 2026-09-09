from fastapi import APIRouter, Depends, HTTPException
from typing import List, Dict, Any

router = APIRouter(prefix="/ml", tags=["ml"])

@router.get("/")
def get_ml_data():
    return {"status": "ok", "module": "ml"}
