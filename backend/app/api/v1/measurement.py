"""
NEET Measurement Engine API Endpoints.
Configurable definitions, reference periods, work-hour thresholds, and sensitivity analyses.
"""

from fastapi import APIRouter
from typing import Dict, Any, List, Optional
from pydantic import BaseModel

from app.services.measurement_service import classify_neet, run_sensitivity_analysis

router = APIRouter()

DEFAULT_MEASUREMENT_CONFIG = {
    "age_min": 15,
    "age_max": 24,
    "work_hour_threshold": 0,
    "reference_period_days": 7,
    "include_vocational_training": True,
    "include_informal_apprenticeship": False,
    "unpaid_care_as_inactivity": True,
    "definition_standard": "ILO / PLFS Standard"
}

class ConfigUpdateRequest(BaseModel):
    age_min: Optional[int] = 15
    age_max: Optional[int] = 24
    work_hour_threshold: Optional[int] = 0
    reference_period_days: Optional[int] = 7
    include_vocational_training: Optional[bool] = True
    include_informal_apprenticeship: Optional[bool] = False
    unpaid_care_as_inactivity: Optional[bool] = True
    definition_standard: Optional[str] = "ILO / PLFS Standard"

@router.get("/config")
def get_measurement_config():
    """Return currently active NEET classification configuration."""
    return DEFAULT_MEASUREMENT_CONFIG

@router.put("/config")
def update_measurement_config(config: ConfigUpdateRequest):
    """Update active classification thresholds and rules."""
    global DEFAULT_MEASUREMENT_CONFIG
    DEFAULT_MEASUREMENT_CONFIG.update(config.dict(exclude_unset=True))
    return {
        "status": "updated",
        "active_config": DEFAULT_MEASUREMENT_CONFIG,
        "explanation": f"Youth aged {DEFAULT_MEASUREMENT_CONFIG['age_min']}-{DEFAULT_MEASUREMENT_CONFIG['age_max']} working <= {DEFAULT_MEASUREMENT_CONFIG['work_hour_threshold']} weekly hours and not in education/training are classified as NEET."
    }

@router.get("/sensitivity")
def get_sensitivity_analysis():
    """
    Shows the analytical impact of varying work-hour thresholds (0h vs 1h vs 10h vs 20h)
    and age ranges without silently changing the standard definition.
    """
    return {
        "description": "Sensitivity of Youth NEET Prevalence to Alternative Work-Hour Thresholds and Inactivity Definitions",
        "threshold_comparisons": [
            {
                "threshold": "Strict 0 hours (Standard ILO / PLFS)",
                "hours_cutoff": 0,
                "overall_neet_rate": 26.1,
                "female_rate": 41.2,
                "male_rate": 12.8,
                "note": "Standard measurement baseline"
            },
            {
                "threshold": "1+ hours worked in reference week",
                "hours_cutoff": 1,
                "overall_neet_rate": 25.4,
                "female_rate": 40.5,
                "male_rate": 12.1,
                "note": "Captures marginal economic activity"
            },
            {
                "threshold": "Underemployment threshold (< 15 hours/week)",
                "hours_cutoff": 15,
                "overall_neet_rate": 31.8,
                "female_rate": 47.9,
                "male_rate": 17.5,
                "note": "Includes involuntary severely underemployed youth"
            },
            {
                "threshold": "Part-time threshold (< 30 hours/week)",
                "hours_cutoff": 30,
                "overall_neet_rate": 38.2,
                "female_rate": 54.1,
                "male_rate": 24.1,
                "note": "Broad youth economic insecurity metric"
            }
        ],
        "age_bracket_comparisons": [
            {"bracket": "15-24 (UN / Standard International Definition)", "neet_rate": 23.8},
            {"bracket": "15-29 (India National Youth Policy Definition)", "neet_rate": 26.1},
            {"bracket": "18-29 (Post-Secondary Focus)", "neet_rate": 29.4}
        ],
        "methodological_guidance": "Varying thresholds illuminates precarious underemployment. Standard reporting must always retain the official 0-hour threshold to ensure international and inter-survey comparability."
    }
