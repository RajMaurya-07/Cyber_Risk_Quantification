from fastapi import APIRouter, Depends, HTTPException
from typing import List, Dict, Any

router = APIRouter(prefix="/copilot", tags=["copilot"])

@router.get("/")
def get_copilot_data():
    return {"status": "ok", "module": "copilot"}
