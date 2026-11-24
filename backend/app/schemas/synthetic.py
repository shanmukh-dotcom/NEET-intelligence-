"""
Pydantic schemas for synthetic data generation.
"""
from typing import Optional
from pydantic import BaseModel, Field


class SyntheticConfig(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = None
    num_individuals: int = Field(default=1000, ge=10, le=100000)
    num_time_periods: int = Field(default=3, ge=1, le=20)
    country: str = "India"
    region: Optional[str] = None

    # Population parameters
    age_min: int = Field(default=15, ge=10, le=35)
    age_max: int = Field(default=29, ge=15, le=65)
    female_pct: float = Field(default=0.50, ge=0.0, le=1.0)
    rural_pct: float = Field(default=0.65, ge=0.0, le=1.0)
    neet_rate: float = Field(default=0.27, ge=0.0, le=1.0)

    # Transition parameters
    neet_persistence_rate: float = Field(default=0.65, ge=0.0, le=1.0)
    neet_exit_rate: float = Field(default=0.15, ge=0.0, le=1.0)

    # Preset (if using a predefined configuration)
    preset: Optional[str] = None  # plfs_national, ihds_panel, udaya_adolescent, young_lives, ihd_delhi_ranchi


class SyntheticPreset(BaseModel):
    name: str
    label: str
    description: str
    country: str
    neet_rate: float
    num_individuals: int
    parameters: dict


class SyntheticResponse(BaseModel):
    dataset_id: int
    name: str
    num_individuals: int
    num_observations: int
    num_time_periods: int
    neet_rate: float
    message: str
