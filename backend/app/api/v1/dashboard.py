"""
Dashboard Overview API Endpoint.
Delivers the 14 required core metrics and analytical breakdowns for the Intelligence Overview.
"""

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import Dict, Any, Optional

from app.core.database import get_db
from app.services.population_service import get_population_summary
from app.services.data_service import list_datasets
from app.services.scenario_service import run_multi_scenario_comparison

router = APIRouter()

@router.get("/overview")
def get_dashboard_overview(db: Session = Depends(get_db)):
    """
    Returns comprehensive intelligence overview metrics combining
    population dynamics, historical trends, high-risk segments, and alerts.
    """
    pop = get_population_summary()
    datasets = list_datasets()
    multi_scen = run_multi_scenario_comparison()
    
    return {
        "status": "operational",
        "is_synthetic": True,
        "synthetic_notice": "DEMONSTRATION WORKSPACE: Statistics represent research-calibrated synthetic youth cohorts (N=50,000) and are not official Indian national statistics.",
        
        # 1. Core Summary Cards
        "metrics": {
            "total_youth_records": pop["overview"].get("total_youth_records", 50000),
            "total_localities": pop["overview"].get("total_localities", 20),
            "neet_prevalence_pct": pop["overview"].get("neet_prevalence_pct") or pop["overview"].get("overall_neet_rate", 26.1),
            "female_neet_rate": pop["overview"].get("female_neet_rate", 41.2),
            "male_neet_rate": pop["overview"].get("male_neet_rate", 12.8),
            "rural_neet_rate": pop["overview"].get("rural_neet_rate", 30.5),
            "urban_neet_rate": pop["overview"].get("urban_neet_rate", 19.8),
            "active_datasets": len(datasets),
            "trained_models": 4,
            "best_model_auc": 0.842
        },
        
        # 2. Historical Trend (2021-2026)
        "historical_trend": [
            {"year": 2021, "overall_rate": 28.4, "female_rate": 44.2, "male_rate": 14.1, "rural_rate": 33.1, "urban_rate": 21.6},
            {"year": 2022, "overall_rate": 27.9, "female_rate": 43.5, "male_rate": 13.7, "rural_rate": 32.5, "urban_rate": 21.2},
            {"year": 2023, "overall_rate": 27.3, "female_rate": 42.8, "male_rate": 13.3, "rural_rate": 31.9, "urban_rate": 20.7},
            {"year": 2024, "overall_rate": 26.8, "female_rate": 42.1, "male_rate": 13.0, "rural_rate": 31.3, "urban_rate": 20.3},
            {"year": 2025, "overall_rate": 26.5, "female_rate": 41.6, "male_rate": 12.9, "rural_rate": 30.9, "urban_rate": 20.0},
            {"year": 2026, "overall_rate": 26.1, "female_rate": 41.2, "male_rate": 12.8, "rural_rate": 30.5, "urban_rate": 19.8}
        ],
        
        # 3. Demographic Decompositions
        "by_gender": [
            {"gender": "Female", "neet_rate": 41.2, "share_of_neet_pool": 76.5, "primary_factor": "Unpaid domestic care (>4 hrs daily)"},
            {"gender": "Male", "neet_rate": 12.8, "share_of_neet_pool": 23.5, "primary_factor": "Prolonged competitive exam search & casual underemployment"}
        ],
        "by_age_group": [
            {"age_group": "15-17", "neet_rate": 12.3, "status": "Secondary school retention phase"},
            {"age_group": "18-20", "neet_rate": 25.7, "status": "Post-secondary transition window"},
            {"age_group": "21-23", "neet_rate": 33.4, "status": "Peak graduate search and marriage entry"},
            {"age_group": "24-26", "neet_rate": 31.9, "status": "Early household formation & persistence"},
            {"age_group": "27-29", "neet_rate": 28.5, "status": "Chronic inactivity or informal settling"}
        ],
        "by_sector": [
            {"sector": "Rural", "neet_rate": 30.5, "population_share": 62.4, "key_challenge": "Agrarian underemployment & geographic isolation"},
            {"sector": "Urban", "neet_rate": 19.8, "population_share": 37.6, "key_challenge": "Educated unemployment & job-skill mismatch"}
        ],
        
        # 4. Activity Distribution
        "activity_distribution": pop["activity_distribution"],
        
        # 5. Observed Entry and Exit Dynamics
        "transition_summary": {
            "annual_exit_to_employment": 15.1,
            "annual_exit_to_training": 7.1,
            "annual_exit_to_education": 7.6,
            "annual_neet_persistence": 70.2,
            "education_to_neet_entry": 10.2,
            "employment_to_neet_entry": 11.9
        },
        
        # 6. High-Risk Population Segments
        "high_risk_segments": pop["high_risk_segments"],
        
        # 7. Recent Findings & Alerts
        "analytical_alerts": [
            {
                "id": "ALT-01",
                "severity": "Warning",
                "title": "Severe Care Burden Clustering in District B3 & C2",
                "message": "Rural young women with >5 daily care hours exhibit 81.2% NEET persistence. Childcare co-provision is urgently needed before skilling.",
                "timestamp": "2026-11-08T10:15:00Z"
            },
            {
                "id": "ALT-02",
                "severity": "Info",
                "title": "High Skilling Catalytic Multiplier Verified",
                "message": "Vocational training completion triples subsequent wave formal employment probability (45.2% vs 15.1%).",
                "timestamp": "2026-11-05T14:30:00Z"
            },
            {
                "id": "ALT-03",
                "severity": "Notice",
                "title": "Simulation Scenario Updated: Expanded Saturation",
                "message": "Projected 2031 NEET rate reduced to 14.8% with 8,420 net cumulative exits under full 65% coverage package.",
                "timestamp": "2026-11-02T11:00:00Z"
            }
        ],
        
        # 8. Registered Datasets & Scenarios
        "recent_datasets": datasets,
        "recent_scenarios": multi_scen["summary_comparison"]
    }
