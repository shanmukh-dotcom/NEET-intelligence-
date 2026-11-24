"""
Opportunity Intelligence API Endpoints.
Library catalog, evidence grading, and multi-factor population similarity matching.
"""

from fastapi import APIRouter, HTTPException
from typing import Dict, Any, List, Optional
from pydantic import BaseModel

from app.services.opportunity_service import get_opportunity_library, get_opportunity_by_id, match_population_to_opportunities, DEFAULT_OPPORTUNITIES

router = APIRouter()

class PopulationMatchingRequest(BaseModel):
    locality_name: Optional[str] = "Target Locality Cluster"
    rural_share: float = 0.80
    female_share: float = 0.85
    mean_age: float = 22.0
    low_income_share: float = 0.70
    unpaid_care_intensity: str = "High"
    education_cluster: str = "Secondary or below"

@router.get("/")
@router.get("/library")
def get_library(category: Optional[str] = None, grade: Optional[str] = None):
    """Retrieve catalogued pathway opportunities with evidence grades and requirements."""
    return {"opportunities": get_opportunity_library(category, grade)}

@router.get("/{opportunity_id}")
def get_opportunity(opportunity_id: str):
    """Retrieve detailed opportunity profile."""
    opp = get_opportunity_by_id(opportunity_id)
    if not opp:
        raise HTTPException(status_code=404, detail="Opportunity not found")
    return opp

@router.post("/match")
def match_population(request: PopulationMatchingRequest):
    """
    Computes transparent multi-factor similarity matching between
    the specified target population and benchmark pathway opportunities.
    """
    matches = match_population_to_opportunities(request.dict())
    return {
        "status": "success",
        "source_population": request.dict(),
        "matched_opportunities_ranked": matches,
        "methodological_notice": "High similarity indices denote demographic and contextual closeness. They do not constitute a guarantee of identical intervention efficacy without contextual local adaptation."
    }
