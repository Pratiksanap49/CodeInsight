from typing import Dict, List
from pydantic import BaseModel

class Misconception(BaseModel):
    id: str

class ConfidenceRequest(BaseModel):
    features: Dict[str, float | bool | int]
    misconceptions: List[Misconception]

class MisconceptionWithConfidence(BaseModel):
    id: str
    confidence: float

class ConfidenceResponse(BaseModel):
    misconceptions: List[MisconceptionWithConfidence]
