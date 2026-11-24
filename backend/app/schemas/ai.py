"""
Pydantic schemas for AI assistant interactions.
"""
from typing import Optional
from pydantic import BaseModel, Field


class AIQuery(BaseModel):
    question: str = Field(..., min_length=1, max_length=2000)
    context: Optional[str] = None  # e.g. "dataset_analysis", "policy_advice", "methodology"
    dataset_id: Optional[int] = None
    include_references: bool = True


class AIResponse(BaseModel):
    answer: str
    confidence: float = Field(default=0.0, ge=0.0, le=1.0)
    sources: list[dict] = []  # [{title, url, relevance}]
    follow_up_questions: list[str] = []
    related_analyses: list[str] = []
