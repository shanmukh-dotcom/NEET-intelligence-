"""
Pydantic schemas for transition analysis.
"""
from typing import Optional
from pydantic import BaseModel, Field


class TransitionMatrixRequest(BaseModel):
    dataset_id: Optional[int] = None
    period_from: Optional[int] = None
    period_to: Optional[int] = None
    cohort_filters: Optional[dict] = None


class TransitionMatrixResponse(BaseModel):
    states: list[str]
    matrix: list[list[float]]
    sample_sizes: Optional[list[list[int]]] = None
    period_from: Optional[int] = None
    period_to: Optional[int] = None
    persistence_rates: Optional[dict] = None
    steady_state: Optional[dict] = None


class PersistenceResult(BaseModel):
    neet_persistence_rate: float
    employment_persistence_rate: float
    education_persistence_rate: float
    average_neet_duration: Optional[float] = None
    by_gender: Optional[dict] = None
    by_age_group: Optional[dict] = None


class SequenceAnalysis(BaseModel):
    num_sequences: int
    most_common_sequences: list[dict]  # {sequence, count, pct}
    average_time_in_neet: Optional[float] = None
    median_time_in_neet: Optional[float] = None
    churning_rate: Optional[float] = None  # multiple NEET spells


class SurvivalResult(BaseModel):
    time_points: list[int]
    survival_probabilities: list[float]  # P(still NEET at time t)
    confidence_lower: Optional[list[float]] = None
    confidence_upper: Optional[list[float]] = None
    median_survival_time: Optional[float] = None
    hazard_ratios: Optional[dict] = None  # covariate -> HR
    by_subgroup: Optional[dict] = None
