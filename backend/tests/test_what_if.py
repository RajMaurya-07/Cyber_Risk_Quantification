import pytest
from app.schemas.what_if import WhatIfChangeset

def test_schema_validation():
    changes = WhatIfChangeset(cvss_score=5.5)
    assert changes.cvss_score == 5.5
