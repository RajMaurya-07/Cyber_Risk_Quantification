from fastapi import APIRouter, Depends, HTTPException
from typing import List, Dict, Any

router = APIRouter(prefix="/simulation", tags=["simulation"])

@router.get("/")
def get_simulation_data():
    return {"status": "ok", "module": "simulation"}
