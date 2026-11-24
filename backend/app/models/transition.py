"""
TransitionAnalysis and TransitionMatrix models.
"""
from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Text, JSON
from sqlalchemy.orm import relationship

from app.core.database import Base


class TransitionAnalysis(Base):
    __tablename__ = "transition_analyses"

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    dataset_id = Column(Integer, nullable=True)
    analysis_type = Column(String(50), nullable=False)  # matrix, sequence, survival, persistence

    # Configuration
    states = Column(JSON, nullable=True)  # e.g. ["employed", "unemployed", "neet", "student"]
    time_periods = Column(JSON, nullable=True)
    cohort_filters = Column(JSON, nullable=True)  # age, gender, location filters

    # Results
    results = Column(JSON, nullable=True)
    summary_statistics = Column(JSON, nullable=True)
    visualization_data = Column(JSON, nullable=True)

    status = Column(String(50), default="pending")  # pending, running, completed, failed
    error_message = Column(Text, nullable=True)

    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    # Relationships
    matrices = relationship("TransitionMatrix", back_populates="analysis", cascade="all, delete-orphan")


class TransitionMatrix(Base):
    __tablename__ = "transition_matrices"

    id = Column(Integer, primary_key=True, autoincrement=True)
    analysis_id = Column(Integer, ForeignKey("transition_analyses.id", ondelete="CASCADE"), nullable=False)
    period_from = Column(Integer, nullable=True)
    period_to = Column(Integer, nullable=True)
    cohort_label = Column(String(100), nullable=True)

    # The matrix itself (states x states)
    states = Column(JSON, nullable=False)  # list of state labels
    matrix_values = Column(JSON, nullable=False)  # 2D list of probabilities
    sample_sizes = Column(JSON, nullable=True)  # n for each cell
    confidence_intervals = Column(JSON, nullable=True)

    # Derived metrics
    persistence_rates = Column(JSON, nullable=True)  # diagonal values
    exit_rates = Column(JSON, nullable=True)
    entry_rates = Column(JSON, nullable=True)
    steady_state = Column(JSON, nullable=True)

    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    # Relationships
    analysis = relationship("TransitionAnalysis", back_populates="matrices")
