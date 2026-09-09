from fastapi import APIRouter, Depends, HTTPException
from typing import List, Dict, Any

router = APIRouter(prefix="/vulnerabilities", tags=["vulnerabilities"])

@router.get("/")
def get_vulnerabilities_data():
    return {"status": "ok", "module": "vulnerabilities"}
