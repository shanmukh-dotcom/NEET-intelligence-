"""
Evidence Registry API Endpoints.
Audit trail of findings, evidence classifications, uncertainty bounds, and limitations.
"""

from fastapi import APIRouter, HTTPException
from typing import Dict, Any, List, Optional
from pydantic import BaseModel

from app.services.evidence_service import get_evidence_registry, get_evidence_by_id, register_evidence_finding

router = APIRouter()

class RegisterEvidenceRequest(BaseModel):
    title: str
    evidence_classification: str = "Descriptive"
    source_dataset: str
    survey_wave: str
    population: str
    geographic_scope: str
    variable_definitions: str
    analytical_method: str
    sample_size: int
    result: str
    confidence_or_uncertainty: str
    limitations: str
    model_version: Optional[str] = "v1.0"
    is_synthetic: bool = True

@router.get("/")
@router.get("/registry")
def get_registry(classification: Optional[str] = None):
    """Retrieve all logged evidence findings across Descriptive, Predictive, Comparative, and Causal tiers."""
    return {"evidence_registry": get_evidence_registry(classification)}

@router.get("/{finding_id}")
def get_evidence(finding_id: str):
    """Retrieve full audit profile for specific finding ID."""
    item = get_evidence_by_id(finding_id)
    if not item:
        raise HTTPException(status_code=404, detail="Finding not found in evidence registry")
    return item

@router.post("/")
def register_finding(request: RegisterEvidenceRequest):
    """Log an analytical finding into the immutable evidence registry."""
    created = register_evidence_finding(request.dict())
    return {"status": "registered", "finding": created}
