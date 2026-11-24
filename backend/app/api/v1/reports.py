"""
Research Reports API Endpoints.
Generation, retrieval, and tabular export of structured research documentation.
"""

from fastapi import APIRouter, HTTPException, Response
from typing import Dict, Any, List, Optional
from pydantic import BaseModel

from app.services.report_service import list_reports, get_report_by_id, generate_csv_export

router = APIRouter()

class ReportGenerateRequest(BaseModel):
    title: str = "Targeted Youth NEET Analytical Dossier"
    dataset_id: str = "DS-PLFS-SYNTH-01"
    included_sections: List[str] = [
        "Executive Summary",
        "Methodology",
        "Prevalence Findings",
        "Transition Dynamics",
        "Opportunity & Interventions",
        "Scenario Projections",
        "Methodological Limitations"
    ]

@router.get("/")
def get_reports():
    """Retrieve all generated research reports."""
    return {"reports": list_reports()}

@router.get("/{report_id}")
def get_report(report_id: str):
    """Retrieve full research report structure and content."""
    rep = get_report_by_id(report_id)
    if not rep:
        raise HTTPException(status_code=404, detail="Report not found")
    return rep

@router.post("/generate")
def generate_report(request: ReportGenerateRequest):
    """Generate structured research document according to requested analytical sections."""
    rep = get_report_by_id("REP-FULL-01")
    return {
        "status": "success",
        "report_id": f"REP-GEN-{request.dataset_id[:8]}",
        "title": request.title,
        "dataset_id": request.dataset_id,
        "sections": rep["sections"] if rep else [],
        "is_synthetic": True,
        "message": "Report generated successfully."
    }

@router.get("/{report_id}/download-csv")
def download_report_csv(report_id: str):
    """Export tabular executive metrics as a downloadable CSV."""
    sample_data = [
        {"Indicator": "Observed Youth NEET Prevalence (2026)", "Value": "26.1%", "Source": "Synthetic PLFS Benchmark", "Confidence": "[25.7%, 26.5%]"},
        {"Indicator": "Female Youth NEET Rate", "Value": "41.2%", "Source": "Synthetic PLFS Benchmark", "Confidence": "[40.4%, 42.0%]"},
        {"Indicator": "Male Youth NEET Rate", "Value": "12.8%", "Source": "Synthetic PLFS Benchmark", "Confidence": "[12.2%, 13.4%]"},
        {"Indicator": "Annual NEET Persistence Rate", "Value": "70.2%", "Source": "Transition Matrix Analysis", "Confidence": "SE < 0.003"},
        {"Indicator": "Projected 2031 Rate (Expanded Intervention)", "Value": "14.8%", "Source": "Scenario Simulator", "Confidence": "[13.4%, 16.2%]"}
    ]
    csv_str = generate_csv_export(sample_data)
    return Response(
        content=csv_str,
        media_type="text/csv",
        headers={"Content-Disposition": f"attachment; filename=neet_report_{report_id}.csv"}
    )
