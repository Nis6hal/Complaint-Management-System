"""
FastAPI Request / Response Pydantic Schemas
"""

from pydantic import BaseModel, Field
from typing import List, Optional

class PredictRequest(BaseModel):
    complaint: str = Field(..., example="My internet disconnects after rain.")

class PredictResponse(BaseModel):
    category: str = Field(..., example="Internet Down")
    priority: str = Field(..., example="High")
    department: str = Field(..., example="Internet Support")
    confidence: float = Field(..., example=0.97)

class BatchPredictRequest(BaseModel):
    complaints: List[str]

class BatchPredictResponse(BaseModel):
    predictions: List[PredictResponse]
