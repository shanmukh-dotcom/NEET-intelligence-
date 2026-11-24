"""
Locality (geographic entity) model.
"""
from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Float, DateTime, Text, JSON
from sqlalchemy.orm import relationship

from app.core.database import Base


class Locality(Base):
    __tablename__ = "localities"

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(255), nullable=False)
    code = Column(String(50), nullable=True, index=True)
    level = Column(String(50), nullable=True)  # country, province, district, ward, municipality
    parent_code = Column(String(50), nullable=True)
    country = Column(String(100), nullable=True)
    province = Column(String(100), nullable=True)
    district = Column(String(100), nullable=True)

    # Geographic
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    area_sq_km = Column(Float, nullable=True)
    rural_urban = Column(String(20), nullable=True)

    # Socioeconomic context
    population = Column(Integer, nullable=True)
    youth_population = Column(Integer, nullable=True)
    unemployment_rate = Column(Float, nullable=True)
    youth_unemployment_rate = Column(Float, nullable=True)
    neet_rate = Column(Float, nullable=True)
    poverty_rate = Column(Float, nullable=True)
    gdp_per_capita = Column(Float, nullable=True)
    gini_coefficient = Column(Float, nullable=True)

    # Infrastructure
    internet_penetration = Column(Float, nullable=True)
    school_density = Column(Float, nullable=True)
    health_facility_density = Column(Float, nullable=True)
    transport_index = Column(Float, nullable=True)

    # Additional metadata
    metadata_json = Column(JSON, nullable=True)

    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    # Relationships
    individuals = relationship("Individual", back_populates="locality")
    opportunities = relationship("Opportunity", back_populates="locality")
