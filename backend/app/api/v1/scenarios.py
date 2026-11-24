"""
Scenario Simulator API Endpoints.
Configurable multi-parameter scenario projections, 2021-2031 timelines, and sensitivity grids.
"""

from fastapi import APIRouter
from typing import Dict, Any, List, Optional
from pydantic import BaseModel

from app.services.scenario_service import simulate_timeline, run_multi_scenario_comparison, get_default_scenario_configs

router = APIRouter()

class ScenarioSimulationRequest(BaseModel):
    name: Optional[str] = "Custom Scenario"
    description: Optional[str] = "User-configured policy projection"
    programme_coverage: float = 0.40
    participation_rate: float = 0.75
    completion_rate: float = 0.78
    transition_assumption: float = 0.40
    investment_cr: float = 16.0
    care_support_included: bool = True
    initial_population: int = 50000

@router.get("/")
def get_scenarios():
    """Return default canonical scenario configurations."""
    return get_default_scenario_configs()

@router.post("/simulate")
def simulate(request: ScenarioSimulationRequest):
    """
    Run an interactive timeline simulation across 2021-2031 with full transparency
    of historical observations versus parametric projections.
    """
    cfg = request.dict()
    pop = cfg.pop("initial_population", 50000)
    result = simulate_timeline(cfg, initial_population=pop)
    return result

@router.get("/compare")
@router.post("/compare")
def compare_scenarios():
    """
    Execute side-by-side comparison of Baseline (Status Quo), Moderate Targeted,
    and Expanded Comprehensive scenarios with sensitivity analysis matrix.
    """
    return run_multi_scenario_comparison()
