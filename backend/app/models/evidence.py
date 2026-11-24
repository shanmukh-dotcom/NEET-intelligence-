"""
EvidenceRecord and Finding models.
"""
from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Float, DateTime, Text, JSON, ForeignKey
from sqlalchemy.orm import relationship

from app.core.database import Base


class EvidenceRecord(Base):
    __tablename__ = "evidence_records"

    id = Column(Integer, primary_key=True, autoincrement=True)
    title = Column(String(500), nullable=False)
    source_type = Column(String(100), nullable=False)  # journal_article, report, evaluation, policy_document, grey_literature
    authors = Column(Text, nullable=True)
    year = Column(Integer, nullable=True)
    journal = Column(String(255), nullable=True)
    doi = Column(String(255), nullable=True)
    url = Column(String(500), nullable=True)

    # Context
    country = Column(String(100), nullable=True)
    region = Column(String(100), nullable=True)
    population = Column(String(255), nullable=True)  # target population studied
    sample_size = Column(Integer, nullable=True)

    # Methodology
    study_design = Column(String(100), nullable=True)  # RCT, quasi-experimental, cohort, cross-sectional
    methodology = Column(Text, nullable=True)

    # Quality assessment
    quality_score = Column(Float, nullable=True)  # 0-10
    evidence_grade = Column(String(10), nullable=True)  # A, B, C, D
    risk_of_bias = Column(String(50), nullable=True)  # low, moderate, high

    # Content
    abstract = Column(Text, nullable=True)
    key_results = Column(Text, nullable=True)
    policy_implications = Column(Text, nullable=True)
    tags = Column(JSON, nullable=True)  # list of topic tags

    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    # Relationships
    findings = relationship("Finding", back_populates="evidence_record", cascade="all, delete-orphan")


class Finding(Base):
    __tablename__ = "findings"

    id = Column(Integer, primary_key=True, autoincrement=True)
    evidence_record_id = Column(Integer, ForeignKey("evidence_records.id", ondelete="CASCADE"), nullable=False)

    # Finding details
    finding_type = Column(String(100), nullable=True)  # risk_factor, protective_factor, intervention_effect, correlation
    variable = Column(String(255), nullable=True)
    direction = Column(String(20), nullable=True)  # positive, negative, null, mixed
    effect_size = Column(Float, nullable=True)
    confidence_interval = Column(String(100), nullable=True)
    p_value = Column(Float, nullable=True)
    statistical_significance = Column(String(20), nullable=True)  # significant, not_significant, marginal

    description = Column(Text, nullable=True)
    context_conditions = Column(Text, nullable=True)
    generalizability = Column(String(50), nullable=True)  # high, moderate, low

    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    # Relationships
    evidence_record = relationship("EvidenceRecord", back_populates="findings")
