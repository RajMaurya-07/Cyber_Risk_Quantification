from fastapi import APIRouter, Depends, HTTPException
from typing import List, Dict, Any

router = APIRouter(prefix="/optimization", tags=["optimization"])

@router.get("/")
def get_optimization_data():
    return {"status": "ok", "module": "optimization"}
