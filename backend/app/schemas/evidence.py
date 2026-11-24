"""
Pydantic schemas for evidence registry.
"""
from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field


class EvidenceCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=500)
    source_type: str = "journal_article"
    authors: Optional[str] = None
    year: Optional[int] = None
    journal: Optional[str] = None
    doi: Optional[str] = None
    url: Optional[str] = None
    country: Optional[str] = None
    region: Optional[str] = None
    population: Optional[str] = None
    sample_size: Optional[int] = None
    study_design: Optional[str] = None
    methodology: Optional[str] = None
    quality_score: Optional[float] = None
    evidence_grade: Optional[str] = None
    abstract: Optional[str] = None
    key_results: Optional[str] = None
    policy_implications: Optional[str] = None
    tags: Optional[list[str]] = None


class EvidenceResponse(BaseModel):
    id: int
    title: str
    source_type: str
    authors: Optional[str] = None
    year: Optional[int] = None
    journal: Optional[str] = None
    country: Optional[str] = None
    study_design: Optional[str] = None
    quality_score: Optional[float] = None
    evidence_grade: Optional[str] = None
    abstract: Optional[str] = None
    key_results: Optional[str] = None
    policy_implications: Optional[str] = None
    tags: Optional[list[str]] = None
    created_at: Optional[datetime] = None

    model_config = {"from_attributes": True}


class FindingCreate(BaseModel):
    evidence_record_id: int
    finding_type: Optional[str] = None
    variable: Optional[str] = None
    direction: Optional[str] = None
    effect_size: Optional[float] = None
    p_value: Optional[float] = None
    description: Optional[str] = None
