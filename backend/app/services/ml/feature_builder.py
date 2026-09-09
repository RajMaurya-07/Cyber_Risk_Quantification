# app/services/ml/feature_builder.py

from typing import Dict, Any, List, Optional


def extract_exploitability_score(exploitability_str: str) -> float:
    """Converts exploitability string into numerical rating (0.0 to 1.0)."""
    val = str(exploitability_str).strip().lower()
    if val in ["high", "critical", "1.0", "1"]:
        return 1.0
    elif val in ["medium", "med", "0.5"]:
        return 0.5
    elif val in ["low", "0.2"]:
        return 0.2
    return 0.5


def build_feature_vector(
    asset_data: Dict[str, Any],
    vuln_data: Optional[Dict[str, Any]] = None,
    control_status_list: Optional[List[Dict[str, Any]]] = None,
    threat_data: Optional[Dict[str, Any]] = None,
    attack_path_info: Optional[Dict[str, Any]] = None,
    attack_path_length: int = 2,
    prior_incidents: int = 0,
) -> Dict[str, Any]:
    """
    Builds the standardized 12-feature ML feature vector required by the likelihood model.
    
    Features:
    - cvss_score (float)
    - exploitability (float: 0.0 to 1.0)
    - known_exploited (int: 0 or 1)
    - vulnerability_age_days (int)
    - internet_exposed (int: 0 or 1)
    - asset_criticality (int: 1-10)
    - attack_path_reachable (int: 0 or 1)
    - attack_path_length (int)
    - path_strength (float: 0.0 to 1.0)
    - control_coverage (float: 0.0 to 1.0)
    - control_maturity (float: 0.0 to 1.0)
    - threat_activity (float: 0.0 to 1.0)
    """
    vuln = vuln_data or {}
    controls = control_status_list or []
    threat = threat_data or {}
    path_info = attack_path_info or {}

    # Vulnerability & Asset features
    cvss_score = float(vuln.get("cvss_score", 5.0))
    exploitability_val = extract_exploitability_score(vuln.get("exploitability", "Medium"))
    known_exp = 1 if str(vuln.get("known_exploited", "")).strip().lower() in ["yes", "true", "1"] else 0
    vuln_age = int(vuln.get("days_open", vuln.get("vulnerability_age_days", 30)))
    is_internet = 1 if str(asset_data.get("internet_exposed", "")).strip().lower() in ["yes", "true", "1"] or asset_data.get("internet_exposed") is True else 0
    asset_crit = int(asset_data.get("criticality", 5))

    # Attack path features
    path_reachable = 1 if path_info.get("reachable", True) or is_internet == 1 else 0
    path_len = max(1, int(path_info.get("length", attack_path_length)))
    path_strength = float(path_info.get("strength", round(min(1.0, (cvss_score / 10.0) * 0.6 + (asset_crit / 10.0) * 0.4), 2)))

    # Control coverage and maturity calculation from control_status_list
    if controls:
        coverages = []
        maturities = []
        for c in controls:
            status = str(c.get("status", "")).strip().lower()
            cov = float(c.get("coverage", 0.0))
            mat = float(c.get("maturity", 0.0))
            if status == "implemented":
                coverages.append(cov if cov > 0 else 0.85)
                maturities.append(mat if mat > 0 else 4.0)
            elif status == "partially implemented":
                coverages.append(cov if cov > 0 else 0.45)
                maturities.append(mat if mat > 0 else 2.0)
            else:
                coverages.append(0.0)
                maturities.append(0.0)
        avg_coverage = round(sum(coverages) / len(coverages), 2)
        avg_maturity = round((sum(maturities) / len(maturities)) / 5.0, 2)  # Scale 0-5 to 0.0-1.0
    else:
        avg_coverage = 0.5
        avg_maturity = 0.5

    # Threat activity level rating (0.0 to 1.0)
    act_str = str(threat.get("activity_level", "medium")).strip().lower()
    if act_str in ["high", "critical", "1.0", "1"]:
        threat_act = 0.85
    elif act_str in ["medium", "med", "0.5"]:
        threat_act = 0.50
    elif act_str in ["low", "0.2"]:
        threat_act = 0.20
    else:
        threat_act = 0.50

    return {
        "cvss_score": cvss_score,
        "exploitability": exploitability_val,
        "known_exploited": known_exp,
        "vulnerability_age_days": vuln_age,
        "internet_exposed": is_internet,
        "asset_criticality": asset_crit,
        "attack_path_reachable": path_reachable,
        "attack_path_length": path_len,
        "path_strength": path_strength,
        "control_coverage": avg_coverage,
        "control_maturity": avg_maturity,
        "threat_activity": threat_act,
    }

