# app/services/risk_engine/exceptions.py

from typing import Optional
from app.services.risk_engine.impact import MissingImpactDataError


class MissingLinkedRecordError(Exception):
    """
    Raised when a risk scenario references linked entities (asset, vulnerability, threat)
    that do not exist in the underlying data files.
    """

    def __init__(
        self,
        scenario_id: Optional[str] = None,
        record_type: str = "",
        record_id: str = "",
        reason: str = "",
    ):
        self.scenario_id = scenario_id
        self.record_type = record_type
        self.record_id = record_id
        self.reason = reason or f"Linked {record_type} '{record_id}' not found in dataset"
        super().__init__(
            f"Scenario '{scenario_id}' references missing {record_type} '{record_id}'"
        )


__all__ = ["MissingImpactDataError", "MissingLinkedRecordError"]
