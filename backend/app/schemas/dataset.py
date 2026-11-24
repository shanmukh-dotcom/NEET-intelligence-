"""
Pydantic schemas for dataset operations.
"""
from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field


class DatasetUpload(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = None
    country: Optional[str] = None
    region: Optional[str] = None
    year_start: Optional[int] = None
    year_end: Optional[int] = None
    survey_name: Optional[str] = None
    is_panel: bool = False


class VariableInfo(BaseModel):
    name: str
    dtype: Optional[str] = None
    num_unique: Optional[int] = None
    num_missing: Optional[int] = None
    pct_missing: Optional[float] = None
    sample_values: Optional[list] = None


class DatasetInspection(BaseModel):
    dataset_id: int
    name: str
    num_rows: int
    num_columns: int
    variables: list[VariableInfo] = []
    missing_summary: Optional[dict] = None
    dtypes_summary: Optional[dict] = None


class DatasetResponse(BaseModel):
    id: int
    name: str
    description: Optional[str] = None
    filename: str
    file_format: str
    file_size_bytes: Optional[int] = None
    num_rows: Optional[int] = None
    num_columns: Optional[int] = None
    country: Optional[str] = None
    region: Optional[str] = None
    year_start: Optional[int] = None
    year_end: Optional[int] = None
    survey_name: Optional[str] = None
    is_panel: bool = False
    is_harmonised: bool = False
    is_synthetic: bool = False
    status: str = "uploaded"
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    model_config = {"from_attributes": True}


class VariableMappingRequest(BaseModel):
    mappings: list[dict] = Field(
        ...,
        description="List of {source_variable, target_variable, transformation, mapping_rules}"
    )


class VariableMappingResponse(BaseModel):
    dataset_id: int
    mappings_applied: int
    status: str


class HarmonisationRequest(BaseModel):
    target_schema: str = "neet_standard"  # which canonical schema to map to
    auto_detect: bool = True
    manual_overrides: Optional[dict] = None


class HarmonisationResponse(BaseModel):
    dataset_id: int
    variables_mapped: int
    variables_unmapped: int
    warnings: list[str] = []
    status: str


class ValidationResponse(BaseModel):
    dataset_id: int
    overall_score: float
    completeness_score: float
    consistency_score: float
    validity_score: float
    issues: list[dict] = []
    recommendations: list[str] = []
