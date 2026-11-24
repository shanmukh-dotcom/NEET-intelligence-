"""
Main API router combining all v1 sub-routers.
"""
from fastapi import APIRouter

from app.api.v1 import (
    auth,
    dashboard,
    datasets,
    synthetic,
    measurement,
    prediction,
    transitions,
    opportunities,
    interventions,
    scenarios,
    ai,
    reports,
    evidence,
    population
)

api_router = APIRouter(prefix="/api/v1")

api_router.include_router(auth.router, prefix="/auth", tags=["Authentication"])
api_router.include_router(dashboard.router, prefix="/dashboard", tags=["Dashboard"])
api_router.include_router(population.router, prefix="/population", tags=["Population Explorer"])
api_router.include_router(datasets.router, prefix="/datasets", tags=["Datasets"])
api_router.include_router(synthetic.router, prefix="/synthetic", tags=["Synthetic Data"])
api_router.include_router(measurement.router, prefix="/measurement", tags=["NEET Measurement"])
api_router.include_router(prediction.router, prefix="/prediction", tags=["Prediction & ML"])
api_router.include_router(transitions.router, prefix="/transitions", tags=["Transitions"])
api_router.include_router(opportunities.router, prefix="/opportunities", tags=["Opportunities"])
api_router.include_router(interventions.router, prefix="/interventions", tags=["Interventions"])
api_router.include_router(scenarios.router, prefix="/scenarios", tags=["Scenarios"])
api_router.include_router(ai.router, prefix="/ai", tags=["AI Assistant"])
api_router.include_router(reports.router, prefix="/reports", tags=["Reports"])
api_router.include_router(evidence.router, prefix="/evidence", tags=["Evidence Registry"])
