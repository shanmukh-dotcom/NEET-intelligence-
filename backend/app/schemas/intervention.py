"""
Pydantic schemas for interventions and recommendations.
"""
from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field


class InterventionCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    category: str
    description: Optional[str] = None
    target_population: Optional[str] = None
    target_age_min: Optional[int] = None
    target_age_max: Optional[int] = None
    target_gender: Optional[str] = None
    target_neet_subcategory: Optional[str] = None
    duration_months: Optional[int] = None
    delivery_mode: Optional[str] = None
    total_budget: Optional[float] = None
    cost_per_beneficiary: Optional[float] = None
    evidence_grade: Optional[str] = None
    expected_transition_rate: Optional[float] = None


class InterventionResponse(BaseModel):
    id: int
    name: str
    category: str
    description: Optional[str] = None
    target_population: Optional[str] = None
    duration_months: Optional[int] = None
    delivery_mode: Optional[str] = None
    total_budget: Optional[float] = None
    cost_per_beneficiary: Optional[float] = None
    evidence_grade: Optional[str] = None
    expected_transition_rate: Optional[float] = None
    status: str = "proposed"
    is_approved: bool = False
    created_at: Optional[datetime] = None

    model_config = {"from_attributes": True}


class RecommendationResponse(BaseModel):
    id: int
    intervention_id: int
    intervention_name: str
    target_group_description: Optional[str] = None
    locality_name: Optional[str] = None
    neet_subcategory: Optional[str] = None
    priority: Optional[str] = None
    rationale: Optional[str] = None
    expected_beneficiaries: Optional[int] = None
    expected_impact: Optional[float] = None
    feasibility_score: Optional[float] = None
    cost_effectiveness_score: Optional[float] = None
    status: str = "generated"
