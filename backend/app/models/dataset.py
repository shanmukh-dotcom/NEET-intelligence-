"""
Dataset, DatasetVariable, VariableMapping, DataQualityReport models.
"""
from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey, Text, JSON
from sqlalchemy.orm import relationship

from app.core.database import Base


class Dataset(Base):
    __tablename__ = "datasets"

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    filename = Column(String(255), nullable=False)
    file_path = Column(String(500), nullable=False)
    file_size_bytes = Column(Integer, nullable=True)
    file_format = Column(String(20), nullable=False)  # csv, xlsx, dta, sav
    owner_id = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True)

    # Metadata
    num_rows = Column(Integer, nullable=True)
    num_columns = Column(Integer, nullable=True)
    country = Column(String(100), nullable=True)
    region = Column(String(100), nullable=True)
    year_start = Column(Integer, nullable=True)
    year_end = Column(Integer, nullable=True)
    survey_name = Column(String(255), nullable=True)
    is_panel = Column(Boolean, default=False)
    is_harmonised = Column(Boolean, default=False)
    is_synthetic = Column(Boolean, default=False)

    # Status
    status = Column(String(50), default="uploaded")  # uploaded, inspected, mapped, harmonised, validated
    harmonisation_notes = Column(Text, nullable=True)

    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    # Relationships
    owner = relationship("User", back_populates="datasets")
    variables = relationship("DatasetVariable", back_populates="dataset", cascade="all, delete-orphan")
    mappings = relationship("VariableMapping", back_populates="dataset", cascade="all, delete-orphan")
    quality_reports = relationship("DataQualityReport", back_populates="dataset", cascade="all, delete-orphan")
    individuals = relationship("Individual", back_populates="dataset", cascade="all, delete-orphan")
    model_runs = relationship("ModelRun", back_populates="dataset", cascade="all, delete-orphan")


class DatasetVariable(Base):
    __tablename__ = "dataset_variables"

    id = Column(Integer, primary_key=True, autoincrement=True)
    dataset_id = Column(Integer, ForeignKey("datasets.id", ondelete="CASCADE"), nullable=False)
    name = Column(String(255), nullable=False)
    original_name = Column(String(255), nullable=True)
    dtype = Column(String(50), nullable=True)  # int64, float64, object, etc.
    num_unique = Column(Integer, nullable=True)
    num_missing = Column(Integer, nullable=True)
    pct_missing = Column(Float, nullable=True)
    sample_values = Column(Text, nullable=True)  # JSON string of sample values
    description = Column(Text, nullable=True)
    role = Column(String(50), nullable=True)  # identifier, feature, target, weight, time

    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    # Relationships
    dataset = relationship("Dataset", back_populates="variables")


class VariableMapping(Base):
    __tablename__ = "variable_mappings"

    id = Column(Integer, primary_key=True, autoincrement=True)
    dataset_id = Column(Integer, ForeignKey("datasets.id", ondelete="CASCADE"), nullable=False)
    source_variable = Column(String(255), nullable=False)
    target_variable = Column(String(255), nullable=False)  # canonical variable name
    transformation = Column(String(50), nullable=True)  # direct, recode, compute, derive
    mapping_rules = Column(JSON, nullable=True)  # e.g. {"1": "Male", "2": "Female"}
    is_confirmed = Column(Boolean, default=False)

    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    # Relationships
    dataset = relationship("Dataset", back_populates="mappings")


class DataQualityReport(Base):
    __tablename__ = "data_quality_reports"

    id = Column(Integer, primary_key=True, autoincrement=True)
    dataset_id = Column(Integer, ForeignKey("datasets.id", ondelete="CASCADE"), nullable=False)
    report_type = Column(String(50), nullable=False)  # completeness, consistency, validity, overall
    overall_score = Column(Float, nullable=True)
    completeness_score = Column(Float, nullable=True)
    consistency_score = Column(Float, nullable=True)
    validity_score = Column(Float, nullable=True)
    issues = Column(JSON, nullable=True)  # list of {field, issue_type, severity, description}
    recommendations = Column(JSON, nullable=True)

    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    # Relationships
    dataset = relationship("Dataset", back_populates="quality_reports")
