# app/schemas/scenario_generator.py
"""
Pydantic schemas for the Risk Scenario Generator API.
"""
from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field


class GeneratorScopeSchema(BaseModel):
    """
    Defines the scope of scenario generation.
    Empty lists = generate for the entire organization.
    """
    asset_ids: List[str] = Field(
        default_factory=list,
        description="Limit generation to specific asset IDs. Empty = all assets.",
    )
    service_ids: List[str] = Field(
        default_factory=list,
        description="Limit generation to assets belonging to these service IDs. Empty = all services.",
    )


class GenerateScenarioRequestSchema(BaseModel):
    """
    POST /api/v1/risk/scenarios/generate request body.
    """
    scope: GeneratorScopeSchema = Field(
        default_factory=GeneratorScopeSchema,
        description="Scope filter for the generation run.",
    )
    data_dir: Optional[str] = Field(
        None,
        description="Override path to the backend /data directory.",
    )


class CandidateScenarioSchema(BaseModel):
    """
    A single generated (candidate) risk scenario - no probability or EAL yet.
    """
    scenario_id:                    str
    asset_id:                       str
    asset_name:                     str
    asset_type:                     str
    vulnerability_id:               str
    cve_id:                         str
    threat_id:                      str
    threat_name:                    str
    service_id:                     str
    service_name:                   str
    attack_path:                    List[str]
    attack_path_reachable:          bool
    attack_path_length:             int
    asset_criticality:              int
    cvss_score:                     float
    known_exploited:                bool
    internet_exposed:               bool
    patch_available:                bool
    days_open:                      int
    exploitability:                 str
    active_controls:                List[str]
    contributing_vulnerabilities:   List[str]
    impact_profile:                 Dict[str, Any]
    downtime_cost_per_hour:         float
    data_sensitivity:               str


class GenerateScenarioResponseSchema(BaseModel):
    """
    POST /api/v1/risk/scenarios/generate response.
    """
    run_id:          str
    generated_at:    str
    status:          str
    scenario_count:  int
    scenarios:       List[CandidateScenarioSchema]


class PaginatedScenariosResponseSchema(BaseModel):
    """
    GET /api/v1/risk/scenarios/generated response (paginated).
    """
    total:           int
    limit:           int
    offset:          int
    scenario_count:  int
    scenarios:       List[Dict[str, Any]]
