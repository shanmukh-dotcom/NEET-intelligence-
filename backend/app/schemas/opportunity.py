"""
Pydantic schemas for opportunity mapping.
"""
from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field


class OpportunityCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    category: str
    description: Optional[str] = None
    locality_id: Optional[int] = None
    target_population: Optional[str] = None
    target_age_min: Optional[int] = None
    target_age_max: Optional[int] = None
    target_gender: Optional[str] = None
    required_skills: Optional[str] = None
    investment_needed: Optional[float] = None
    cost_per_beneficiary: Optional[float] = None
    infrastructure_requirements: Optional[str] = None
    geographic_suitability: Optional[str] = None
    evidence_grade: Optional[str] = None
    observed_outcome: Optional[str] = None
    success_rate: Optional[float] = None


class OpportunityResponse(BaseModel):
    id: int
    name: str
    category: str
    description: Optional[str] = None
    target_population: Optional[str] = None
    required_skills: Optional[str] = None
    investment_needed: Optional[float] = None
    infrastructure_requirements: Optional[str] = None
    geographic_suitability: Optional[str] = None
    evidence_grade: Optional[str] = None
    observed_outcome: Optional[str] = None
    success_rate: Optional[float] = None
    status: str = "draft"
    created_at: Optional[datetime] = None

    model_config = {"from_attributes": True}


class MatchingRequest(BaseModel):
    dataset_id: Optional[int] = None
    neet_subcategory: Optional[str] = None
    age_group: Optional[str] = None
    gender: Optional[str] = None
    locality_id: Optional[int] = None
    education_level: Optional[str] = None
    max_results: int = Field(default=10, ge=1, le=100)


class MatchingResult(BaseModel):
    opportunity_id: int
    opportunity_name: str
    category: str
    match_score: float  # 0-100
    rationale: str
    expected_beneficiaries: Optional[int] = None
    estimated_impact: Optional[float] = None
    feasibility: Optional[str] = None


class OpportunityLibraryItem(BaseModel):
    id: int
    name: str
    category: str
    evidence_grade: Optional[str] = None
    success_rate: Optional[float] = None
    geographic_suitability: Optional[str] = None
    target_population: Optional[str] = None
