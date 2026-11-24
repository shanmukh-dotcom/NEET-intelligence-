"""
Intervention Intelligence API Endpoints.
Intervention proposal management, parameter evaluation, and research governance review workflows.
"""

from fastapi import APIRouter, HTTPException
from typing import Dict, Any, List, Optional
from pydantic import BaseModel

from app.services.intervention_service import list_interventions, get_intervention_by_id, update_intervention_status, create_intervention_proposal

router = APIRouter()

class CreateInterventionRequest(BaseModel):
    title: str
    target_locality: str
    target_population: str
    identified_problem: str
    supporting_evidence: str
    recommended_intervention: str
    implementation_components: Optional[List[str]] = None
    required_resources: Optional[str] = None
    implementation_partners: Optional[List[str]] = None
    estimated_eligible_population: int = 2000
    targeted_coverage_rate: float = 0.45
    assumed_completion_rate: float = 0.75
    expected_transition_rate: float = 0.40
    outcome_indicators: Optional[List[str]] = None
    implementation_risks: Optional[List[str]] = None
    monitoring_strategy: Optional[str] = None
    author: Optional[str] = "Lead Policy Researcher"

class UpdateStatusRequest(BaseModel):
    status: str
    user: str = "Authorized Reviewer"
    comments: Optional[str] = None

@router.get("/")
def get_interventions(status: Optional[str] = None):
    """Retrieve all structured intervention proposals with governance status."""
    return {"interventions": list_interventions(status)}

@router.get("/recommendations")
def get_recommendations():
    """Retrieve high-priority recommended intervention packages."""
    return {"recommendations": list_interventions()}

@router.get("/{intervention_id}")
def get_intervention(intervention_id: str):
    """Retrieve full intervention detail by ID."""
    res = get_intervention_by_id(intervention_id)
    if not res:
        raise HTTPException(status_code=404, detail="Intervention not found")
    return res

@router.post("/")
def create_intervention(request: CreateInterventionRequest):
    """Register a new intervention proposal with complete components and assumption accounting."""
    created = create_intervention_proposal(request.dict())
    return {"status": "created", "intervention": created}

@router.put("/{intervention_id}/approve")
def approve_intervention(intervention_id: str, request: UpdateStatusRequest):
    """
    Governance approval workflow endpoint.
    Permits authorized stakeholders to advance status (Draft -> Proposed -> Under Review -> Approved / Rejected).
    """
    updated = update_intervention_status(intervention_id, request.status, request.user, request.comments)
    if not updated:
        raise HTTPException(status_code=404, detail="Intervention not found")
    return {"status": "updated", "intervention": updated}
