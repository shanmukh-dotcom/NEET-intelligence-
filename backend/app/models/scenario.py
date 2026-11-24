"""
Scenario and ScenarioResult models.
"""
from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey, Text, JSON
from sqlalchemy.orm import relationship

from app.core.database import Base


class Scenario(Base):
    __tablename__ = "scenarios"

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    baseline_dataset_id = Column(Integer, ForeignKey("datasets.id", ondelete="SET NULL"), nullable=True)

    # Time horizon
    start_year = Column(Integer, nullable=True)
    end_year = Column(Integer, nullable=True)

    # Policy parameters
    programme_coverage = Column(Float, nullable=True)  # 0.0 to 1.0
    participation_rate = Column(Float, nullable=True)  # 0.0 to 1.0
    completion_rate = Column(Float, nullable=True)  # 0.0 to 1.0
    transition_assumption = Column(String(100), nullable=True)  # optimistic, moderate, conservative
    budget_constraint = Column(Float, nullable=True)
    target_group = Column(String(255), nullable=True)

    # Interventions included
    interventions = Column(JSON, nullable=True)  # list of intervention IDs and parameters
    policy_levers = Column(JSON, nullable=True)

    # Status
    status = Column(String(50), default="draft")  # draft, running, completed, failed
    error_message = Column(Text, nullable=True)

    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    # Relationships
    results = relationship("ScenarioResult", back_populates="scenario", cascade="all, delete-orphan")


class ScenarioResult(Base):
    __tablename__ = "scenario_results"

    id = Column(Integer, primary_key=True, autoincrement=True)
    scenario_id = Column(Integer, ForeignKey("scenarios.id", ondelete="CASCADE"), nullable=False)
    year = Column(Integer, nullable=True)
    period = Column(String(50), nullable=True)

    # Outcome metrics
    projected_neet_rate = Column(Float, nullable=True)
    projected_neet_count = Column(Integer, nullable=True)
    baseline_neet_rate = Column(Float, nullable=True)
    neet_reduction = Column(Float, nullable=True)
    employment_gain = Column(Integer, nullable=True)
    education_gain = Column(Integer, nullable=True)

    # Cost-benefit
    total_cost = Column(Float, nullable=True)
    cost_per_transition = Column(Float, nullable=True)
    economic_benefit = Column(Float, nullable=True)
    benefit_cost_ratio = Column(Float, nullable=True)
    roi_percent = Column(Float, nullable=True)

    # Disaggregated results
    results_by_gender = Column(JSON, nullable=True)
    results_by_age_group = Column(JSON, nullable=True)
    results_by_location = Column(JSON, nullable=True)
    detailed_results = Column(JSON, nullable=True)

    # Confidence
    confidence_level = Column(Float, nullable=True)
    sensitivity_results = Column(JSON, nullable=True)

    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    # Relationships
    scenario = relationship("Scenario", back_populates="results")
