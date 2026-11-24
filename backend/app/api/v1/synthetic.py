"""
Synthetic Data Generation API Endpoints.
"""

from fastapi import APIRouter, HTTPException, BackgroundTasks
from typing import Dict, Any, List, Optional
from pydantic import BaseModel

from app.services.synthetic_service import get_presets, generate_synthetic_population, generate_demo_dataset

router = APIRouter()

class SyntheticConfigRequest(BaseModel):
    country: Optional[str] = "India"
    state: Optional[str] = "Fictional State Strata"
    district: Optional[str] = "Fictional District Cluster"
    localities_count: Optional[int] = 20
    population_size: Optional[int] = 5000
    age_min: Optional[int] = 15
    age_max: Optional[int] = 29
    female_ratio: Optional[float] = 0.50
    rural_ratio: Optional[float] = 0.60
    base_neet_rate: Optional[float] = 0.27
    waves_count: Optional[int] = 6
    missingness_rate: Optional[float] = 0.08
    random_seed: Optional[int] = 42
    scenario_preset: Optional[str] = None

@router.get("/presets")
def get_synthetic_presets():
    """Return all predefined research scenarios (A through G)."""
    return {"presets": get_presets()}

@router.post("/generate")
def generate_synthetic_data(config: SyntheticConfigRequest):
    """
    Generate synthetic youth population microdata based on parameters.
    All data is clearly labelled is_synthetic=True.
    """
    cfg_dict = config.dict()
    df = generate_synthetic_population(cfg_dict)
    
    # Generate summary statistics from the dataframe
    rec_count = len(df)
    unique_ids = df["person_id"].nunique()
    neet_count = (df["activity_state"] == "NEET").sum()
    neet_rate = round((neet_count / rec_count) * 100, 1) if rec_count > 0 else 0
    
    # Sample records for preview
    preview_records = df.head(50).to_dict(orient="records")
    
    return {
        "status": "success",
        "is_synthetic": True,
        "synthetic_notice": "SYNTHETIC RESEARCH DATA: This dataset is artificially generated for software demonstration and methodology testing.",
        "configuration": cfg_dict,
        "summary": {
            "total_observations": rec_count,
            "unique_individuals": unique_ids,
            "waves": sorted(df["wave_year"].unique().tolist()),
            "observed_neet_rate": neet_rate,
            "localities_covered": df["locality"].nunique()
        },
        "preview_records": preview_records
    }

@router.get("/demo-workspace")
def load_demo_workspace():
    """Returns metadata and status for the 50,000 individual demo benchmark cohort."""
    return {
        "status": "ready",
        "dataset_name": "NEET Comprehensive Demonstration Benchmark",
        "total_individuals": 50000,
        "total_observations": 278450,
        "waves": [2021, 2022, 2023, 2024, 2025, 2026],
        "localities": 20,
        "is_synthetic": True,
        "overall_neet_rate": 26.1,
        "ready_for_analysis": True
    }
