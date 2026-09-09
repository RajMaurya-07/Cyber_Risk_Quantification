from pydantic import BaseModel, ConfigDict
from typing import List, Optional, Any

class OptimizationSchema(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: Optional[str] = None
