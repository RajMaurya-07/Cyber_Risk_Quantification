from fastapi import APIRouter, Depends, HTTPException
from typing import List, Dict, Any

router = APIRouter(prefix="/what-if", tags=["what_if"])

@router.get("/")
def get_what_if_data():
    return {"status": "ok", "module": "what_if"}
