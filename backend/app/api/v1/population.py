"""
Population Intelligence API Endpoints.
Population summaries, age-gender pyramids, activity distributions, and high-risk segments.
"""

from fastapi import APIRouter
from typing import Dict, Any, Optional

from app.services.population_service import get_population_summary

router = APIRouter()

@router.get("/summary")
@router.get("/")
def get_population():
    """Returns demographic decomposition, population pyramid, and locality distributions."""
    return get_population_summary()
