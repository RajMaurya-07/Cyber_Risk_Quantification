# app/schemas/attack_path.py

from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field


class GraphNodeSchema(BaseModel):
    id: str
    name: str
    type: str
    criticality: int
    internet_exposed: bool
    environment: str
    owner: Optional[str] = None
    service_id: Optional[str] = None
    service_name: Optional[str] = None
    max_cvss: float = 0.0
    vuln_count: int = 0


class GraphEdgeSchema(BaseModel):
    source: str
    target: str
    relationship: str
    access_type: str


class AssetRefSchema(BaseModel):
    id: str
    name: str
    type: str


class PathAssetDetailSchema(BaseModel):
    asset_id: str
    asset_name: str
    asset_type: str
    criticality: int
    max_cvss: float
    has_known_exploited: bool
    vuln_count: int


class AttackPathSchema(BaseModel):
    path_id: str
    source_asset: AssetRefSchema
    target_asset: AssetRefSchema
    asset_path: List[PathAssetDetailSchema]
    path_length: int
    score: float
    max_cvss: float
    vulnerabilities_encountered: int
    has_known_exploit: bool


class AttackGraphSummarySchema(BaseModel):
    total_nodes: int
    total_edges: int
    entry_points_count: int
    target_assets_count: int
    critical_paths_count: int


class AttackGraphResponseSchema(BaseModel):
    summary: AttackGraphSummarySchema
    nodes: List[GraphNodeSchema]
    edges: List[GraphEdgeSchema]
    entry_points: List[Dict[str, Any]]
    target_assets: List[Dict[str, Any]]
    critical_paths: List[AttackPathSchema]
