def validate_cve(cve_id: str) -> bool:
    return cve_id.startswith("CVE-")
