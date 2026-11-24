"""
Pydantic schemas for scenario simulation.
"""
from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field


class ScenarioConfig(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = None
    baseline_dataset_id: Optional[int] = None
    start_year: int = Field(default=2024, ge=2000)
    end_year: int = Field(default=2030, ge=2000)
    programme_coverage: float = Field(default=0.5, ge=0.0, le=1.0)
    participation_rate: float = Field(default=0.7, ge=0.0, le=1.0)
    completion_rate: float = Field(default=0.6, ge=0.0, le=1.0)
    transition_assumption: str = "moderate"  # optimistic, moderate, conservative
    budget_constraint: Optional[float] = None
    target_group: Optional[str] = None
    interventions: Optional[list[int]] = None  # intervention IDs


class ScenarioResponse(BaseModel):
    id: int
    name: str
    description: Optional[str] = None
    start_year: Optional[int] = None
    end_year: Optional[int] = None
    programme_coverage: Optional[float] = None
    participation_rate: Optional[float] = None
    completion_rate: Optional[float] = None
    transition_assumption: Optional[str] = None
    status: str = "draft"
    created_at: Optional[datetime] = None

    model_config = {"from_attributes": True}


class ScenarioComparison(BaseModel):
    scenario_ids: list[int] = Field(..., min_length=2, max_length=10)


class SimulationResult(BaseModel):
    scenario_id: int
    scenario_name: str
    years: list[int]
    projected_neet_rates: list[float]
    baseline_neet_rates: list[float]
    neet_reduction: float
    total_transitions: int
    total_cost: float
    cost_per_transition: float
    benefit_cost_ratio: float
    results_by_year: list[dict]
    results_by_gender: Optional[dict] = None
    results_by_age_group: Optional[dict] = None
    confidence_interval: Optional[dict] = None
