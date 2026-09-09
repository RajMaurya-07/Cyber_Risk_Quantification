from fastapi import APIRouter, Depends, HTTPException
from typing import List, Dict, Any

router = APIRouter(prefix="/compliance", tags=["compliance"])

@router.get("/")
def get_compliance_data():
    return {"status": "ok", "module": "compliance"}
