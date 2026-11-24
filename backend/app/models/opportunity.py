"""
Opportunity and OpportunityEvidence models.
"""
from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey, Text, JSON
from sqlalchemy.orm import relationship

from app.core.database import Base


class Opportunity(Base):
    __tablename__ = "opportunities"

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(255), nullable=False)
    category = Column(String(100), nullable=False)  # employment, education, training, entrepreneurship, social_protection
    description = Column(Text, nullable=True)
    locality_id = Column(Integer, ForeignKey("localities.id", ondelete="SET NULL"), nullable=True)

    # Target
    target_population = Column(String(255), nullable=True)  # e.g. "female, 18-24, rural"
    target_age_min = Column(Integer, nullable=True)
    target_age_max = Column(Integer, nullable=True)
    target_gender = Column(String(20), nullable=True)
    target_education_level = Column(String(100), nullable=True)

    # Requirements
    required_skills = Column(Text, nullable=True)
    prerequisites = Column(Text, nullable=True)

    # Investment & resources
    investment_needed = Column(Float, nullable=True)  # USD
    cost_per_beneficiary = Column(Float, nullable=True)
    infrastructure_requirements = Column(Text, nullable=True)
    geographic_suitability = Column(String(50), nullable=True)  # urban, rural, both

    # Evidence
    evidence_grade = Column(String(10), nullable=True)  # A, B, C, D (strength of evidence)
    observed_outcome = Column(Text, nullable=True)
    success_rate = Column(Float, nullable=True)
    expected_impact = Column(Float, nullable=True)
    scalability = Column(String(50), nullable=True)  # high, medium, low

    # Status
    status = Column(String(50), default="draft")  # draft, active, completed, archived
    is_synthetic = Column(Boolean, default=False)
    source = Column(String(255), nullable=True)

    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    # Relationships
    locality = relationship("Locality", back_populates="opportunities")
    evidence = relationship("OpportunityEvidence", back_populates="opportunity", cascade="all, delete-orphan")


class OpportunityEvidence(Base):
    __tablename__ = "opportunity_evidence"

    id = Column(Integer, primary_key=True, autoincrement=True)
    opportunity_id = Column(Integer, ForeignKey("opportunities.id", ondelete="CASCADE"), nullable=False)
    study_name = Column(String(255), nullable=True)
    study_type = Column(String(100), nullable=True)  # RCT, quasi-experimental, observational, case_study
    authors = Column(String(500), nullable=True)
    year = Column(Integer, nullable=True)
    sample_size = Column(Integer, nullable=True)
    effect_size = Column(Float, nullable=True)
    confidence_interval = Column(String(100), nullable=True)
    p_value = Column(Float, nullable=True)
    context = Column(String(255), nullable=True)
    findings = Column(Text, nullable=True)
    limitations = Column(Text, nullable=True)
    url = Column(String(500), nullable=True)

    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    # Relationships
    opportunity = relationship("Opportunity", back_populates="evidence")
