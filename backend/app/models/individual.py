"""
Individual, Observation, HouseholdCharacteristic models.
"""
from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship

from app.core.database import Base


class Individual(Base):
    __tablename__ = "individuals"

    id = Column(Integer, primary_key=True, autoincrement=True)
    person_id = Column(String(100), nullable=False, index=True)
    dataset_id = Column(Integer, ForeignKey("datasets.id", ondelete="CASCADE"), nullable=False)
    locality_id = Column(Integer, ForeignKey("localities.id", ondelete="SET NULL"), nullable=True)

    # Demographics
    age = Column(Integer, nullable=True)
    gender = Column(String(20), nullable=True)
    education_level = Column(String(100), nullable=True)
    rural_urban = Column(String(20), nullable=True)
    marital_status = Column(String(50), nullable=True)
    disability_status = Column(Boolean, nullable=True)
    migration_status = Column(String(50), nullable=True)
    ethnicity = Column(String(100), nullable=True)
    language = Column(String(100), nullable=True)

    # Household
    household_income_quintile = Column(Integer, nullable=True)
    household_size = Column(Integer, nullable=True)
    head_of_household = Column(Boolean, nullable=True)
    num_dependents = Column(Integer, nullable=True)

    # Flags
    is_synthetic = Column(Boolean, default=False)
    weight = Column(Float, nullable=True)  # survey sampling weight

    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    # Relationships
    dataset = relationship("Dataset", back_populates="individuals")
    locality = relationship("Locality", back_populates="individuals")
    observations = relationship("Observation", back_populates="individual", cascade="all, delete-orphan")
    household_characteristics = relationship("HouseholdCharacteristic", back_populates="individual", cascade="all, delete-orphan")
    predictions = relationship("Prediction", back_populates="individual", cascade="all, delete-orphan")


class Observation(Base):
    __tablename__ = "observations"

    id = Column(Integer, primary_key=True, autoincrement=True)
    individual_id = Column(Integer, ForeignKey("individuals.id", ondelete="CASCADE"), nullable=False)

    # Time
    year = Column(Integer, nullable=False)
    wave = Column(Integer, nullable=True)
    quarter = Column(Integer, nullable=True)

    # Labour / education status
    education_status = Column(String(50), nullable=True)  # enrolled, completed, dropped_out, never_enrolled
    employment_status = Column(String(50), nullable=True)  # employed, unemployed, inactive
    training_status = Column(String(50), nullable=True)  # in_training, not_in_training
    neet_status = Column(Boolean, nullable=True)

    # Employment details
    work_hours = Column(Float, nullable=True)
    unpaid_care_hours = Column(Float, nullable=True)
    job_quality = Column(String(50), nullable=True)
    contract_type = Column(String(50), nullable=True)  # permanent, temporary, casual, self_employed
    occupation_code = Column(String(20), nullable=True)
    industry_code = Column(String(20), nullable=True)
    earnings = Column(Float, nullable=True)
    is_underemployed = Column(Boolean, nullable=True)
    is_informal = Column(Boolean, nullable=True)

    # NEET sub-classification
    neet_subcategory = Column(String(50), nullable=True)  # unemployed, discouraged, care_duties, illness, other_inactive

    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    # Relationships
    individual = relationship("Individual", back_populates="observations")


class HouseholdCharacteristic(Base):
    __tablename__ = "household_characteristics"

    id = Column(Integer, primary_key=True, autoincrement=True)
    individual_id = Column(Integer, ForeignKey("individuals.id", ondelete="CASCADE"), nullable=False)
    year = Column(Integer, nullable=True)

    # Economic
    household_income = Column(Float, nullable=True)
    income_source = Column(String(100), nullable=True)
    receives_social_grant = Column(Boolean, nullable=True)
    grant_type = Column(String(100), nullable=True)

    # Housing
    dwelling_type = Column(String(100), nullable=True)
    access_electricity = Column(Boolean, nullable=True)
    access_water = Column(Boolean, nullable=True)
    access_internet = Column(Boolean, nullable=True)
    access_transport = Column(Boolean, nullable=True)

    # Parental
    parent_education = Column(String(100), nullable=True)
    parent_employment = Column(String(100), nullable=True)

    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    # Relationships
    individual = relationship("Individual", back_populates="household_characteristics")
