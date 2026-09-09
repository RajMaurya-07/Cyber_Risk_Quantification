import copy
from typing import Dict, Any, Optional

from app.schemas.what_if import WhatIfChangeset

def _apply_control_changes(modified: Dict[str, Any], changes: WhatIfChangeset) -> None:
    # merge control overrides
    if changes.control_overrides:
        for override in changes.control_overrides:
            for control in modified.get("control_status_list", []):
                if control.get("control_id") == override.control_id:
                    if override.status is not None:
                        control["status"] = override.status
                    if override.coverage is not None:
                        control["coverage"] = override.coverage
                    if override.maturity is not None:
                        control["maturity"] = override.maturity
                        
    # add new controls
    if changes.add_controls:
        for new_control in changes.add_controls:
            modified.setdefault("control_status_list", []).append(
                new_control.model_dump(exclude_none=True)
            )
            
    # remove controls
    if changes.remove_control_ids:
        modified["control_status_list"] = [
            c for c in modified.get("control_status_list", [])
            if c.get("control_id") not in changes.remove_control_ids
        ]

def apply_changes(
    scenario_data: Dict[str, Any],
    changes: WhatIfChangeset,
) -> Dict[str, Any]:
    modified = copy.deepcopy(scenario_data)
    
    # apply asset overrides
    if changes.asset_criticality is not None:
        modified.setdefault("asset_data", {})["criticality"] = changes.asset_criticality
    if changes.internet_exposed is not None:
        modified.setdefault("asset_data", {})["internet_exposed"] = changes.internet_exposed
        
    # apply vulnerability overrides
    if changes.cvss_score is not None:
        modified.setdefault("vuln_data", {})["cvss_score"] = changes.cvss_score
    if changes.known_exploited is not None:
        modified.setdefault("vuln_data", {})["known_exploited"] = changes.known_exploited
    if changes.days_open is not None:
        modified.setdefault("vuln_data", {})["days_open"] = changes.days_open
        
    # apply control overrides
    _apply_control_changes(modified, changes)
    
    # apply service overrides
    if changes.downtime_cost_per_hour is not None:
        modified.setdefault("service_data", {})["downtime_cost_per_hour"] = changes.downtime_cost_per_hour
        
    # apply threat overrides
    if changes.threat_activity is not None:
        modified.setdefault("threat_data", {})["activity_level"] = changes.threat_activity
        
    return modified

from app.schemas.what_if import WhatIfScenarioResult, ScenarioDelta
from app.services.risk_engine.engine import quantify_scenario
from app.services.risk_engine.exceptions import MissingImpactDataError
from app.schemas.risk import RiskQuantificationSchema

def compute_delta(
    baseline: Dict[str, Any],
    simulated: Dict[str, Any],
) -> Dict[str, ScenarioDelta]:
    metrics = ["probability", "eal", "mean_eal", "p90", "p95", "p99"]
    delta = {}
    for m in metrics:
        b = float(baseline.get(m, 0.0))
        s = float(simulated.get(m, 0.0))
        d = round(s - b, 4)
        pct = round((d / b * 100), 2) if b != 0.0 else 0.0
        delta[m] = ScenarioDelta(baseline=b, simulated=s, delta=d, delta_pct=pct)
    return delta

def _describe_applied_changes(changes: WhatIfChangeset) -> Dict[str, Any]:
    return changes.model_dump(exclude_none=True)

def simulate_scenario(
    scenario_data: Dict[str, Any],
    changes: WhatIfChangeset,
    data_dir: Optional[str] = None,
) -> WhatIfScenarioResult:
    baseline = quantify_scenario(scenario_data, data_dir=data_dir)
    modified = apply_changes(scenario_data, changes)
    
    try:
        simulated = quantify_scenario(modified, data_dir=data_dir)
    except MissingImpactDataError as e:
        simulated = {**baseline, "status": "impact_data_missing", "error": str(e)}
        
    delta = compute_delta(baseline, simulated)
    applied = _describe_applied_changes(changes)
    
    return WhatIfScenarioResult(
        scenario_id=baseline["scenario_id"],
        scenario_name=baseline["scenario_name"],
        baseline=RiskQuantificationSchema(**baseline),
        simulated=RiskQuantificationSchema(**simulated),
        delta=delta,
        applied_changes=applied,
    )
