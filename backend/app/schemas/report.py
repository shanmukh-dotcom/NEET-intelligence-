"""
Pydantic schemas for report generation.
"""
from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field


class ReportConfig(BaseModel):
    title: str = Field(..., min_length=1, max_length=500)
    report_type: str = "comprehensive"  # neet_profile, prediction, transition, scenario, comprehensive, policy_brief
    description: Optional[str] = None
    dataset_id: Optional[int] = None
    model_id: Optional[int] = None
    scenario_id: Optional[int] = None
    format: str = "html"  # html, pdf, docx
    sections: Optional[list[str]] = None  # which sections to include


class ReportResponse(BaseModel):
    id: int
    title: str
    report_type: str
    description: Optional[str] = None
    format: str = "html"
    status: str = "generating"
    file_path: Optional[str] = None
    generation_time_secs: Optional[float] = None
    created_at: Optional[datetime] = None

    model_config = {"from_attributes": True}


class ReportListResponse(BaseModel):
    id: int
    title: str
    report_type: str
    status: str
    format: str
    created_at: Optional[datetime] = None

    model_config = {"from_attributes": True}
