"""
Intervention and Recommendation models.
"""
from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey, Text, JSON
from sqlalchemy.orm import relationship

from app.core.database import Base


class Intervention(Base):
    __tablename__ = "interventions"

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(255), nullable=False)
    category = Column(String(100), nullable=False)  # skills_training, wage_subsidy, education, social_protection, entrepreneurship
    description = Column(Text, nullable=True)

    # Targeting
    target_population = Column(String(255), nullable=True)
    target_age_min = Column(Integer, nullable=True)
    target_age_max = Column(Integer, nullable=True)
    target_gender = Column(String(20), nullable=True)
    target_neet_subcategory = Column(String(100), nullable=True)

    # Design
    duration_months = Column(Integer, nullable=True)
    delivery_mode = Column(String(100), nullable=True)  # in_person, online, hybrid
    implementing_agency = Column(String(255), nullable=True)
    partner_organizations = Column(Text, nullable=True)

    # Cost
    total_budget = Column(Float, nullable=True)
    cost_per_beneficiary = Column(Float, nullable=True)
    funding_source = Column(String(255), nullable=True)

    # Evidence
    evidence_grade = Column(String(10), nullable=True)
    expected_transition_rate = Column(Float, nullable=True)
    observed_transition_rate = Column(Float, nullable=True)
    effect_size = Column(Float, nullable=True)
    evidence_references = Column(JSON, nullable=True)

    # Status
    status = Column(String(50), default="proposed")  # proposed, approved, active, completed, archived
    is_approved = Column(Boolean, default=False)
    approved_by = Column(String(255), nullable=True)
    approved_at = Column(DateTime, nullable=True)

    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    # Relationships
    recommendations = relationship("Recommendation", back_populates="intervention", cascade="all, delete-orphan")


class Recommendation(Base):
    __tablename__ = "recommendations"

    id = Column(Integer, primary_key=True, autoincrement=True)
    intervention_id = Column(Integer, ForeignKey("interventions.id", ondelete="CASCADE"), nullable=False)

    # Who is it for
    target_group_description = Column(Text, nullable=True)
    locality_name = Column(String(255), nullable=True)
    neet_subcategory = Column(String(100), nullable=True)

    # Recommendation details
    priority = Column(String(20), nullable=True)  # high, medium, low
    rationale = Column(Text, nullable=True)
    expected_beneficiaries = Column(Integer, nullable=True)
    expected_impact = Column(Float, nullable=True)
    feasibility_score = Column(Float, nullable=True)
    cost_effectiveness_score = Column(Float, nullable=True)

    # Implementation
    suggested_timeline = Column(String(100), nullable=True)
    prerequisites = Column(Text, nullable=True)
    risks = Column(Text, nullable=True)
    mitigation_strategies = Column(Text, nullable=True)

    status = Column(String(50), default="generated")  # generated, reviewed, accepted, rejected

    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    # Relationships
    intervention = relationship("Intervention", back_populates="recommendations")
