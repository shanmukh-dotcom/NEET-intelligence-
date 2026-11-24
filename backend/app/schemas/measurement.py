"""
Pydantic schemas for NEET measurement and classification.
"""
from typing import Optional
from pydantic import BaseModel, Field


class NEETConfig(BaseModel):
    dataset_id: int
    age_min: int = Field(default=15, ge=10)
    age_max: int = Field(default=35, ge=15)
    education_variable: Optional[str] = "education_status"
    employment_variable: Optional[str] = "employment_status"
    training_variable: Optional[str] = "training_status"
    include_subcategories: bool = True
    ilo_definition: bool = True  # Use ILO standard definition


class NEETClassificationResult(BaseModel):
    dataset_id: int
    total_population: int
    neet_count: int
    neet_rate: float
    non_neet_count: int

    # Subcategories
    unemployed_count: int = 0
    discouraged_count: int = 0
    care_duties_count: int = 0
    illness_count: int = 0
    other_inactive_count: int = 0

    # By demographics
    by_gender: Optional[dict] = None
    by_age_group: Optional[dict] = None
    by_rural_urban: Optional[dict] = None
    by_education_level: Optional[dict] = None

    classification_details: Optional[dict] = None
