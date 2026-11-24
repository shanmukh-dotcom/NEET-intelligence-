"""
Report and ReportSection models.
"""
from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Text, JSON
from sqlalchemy.orm import relationship

from app.core.database import Base


class Report(Base):
    __tablename__ = "reports"

    id = Column(Integer, primary_key=True, autoincrement=True)
    title = Column(String(500), nullable=False)
    report_type = Column(String(100), nullable=False)  # neet_profile, prediction, transition, scenario, comprehensive, policy_brief
    description = Column(Text, nullable=True)
    owner_id = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True)

    # Configuration
    config = Column(JSON, nullable=True)  # parameters used to generate
    dataset_id = Column(Integer, nullable=True)
    model_id = Column(Integer, nullable=True)
    scenario_id = Column(Integer, nullable=True)

    # Output
    format = Column(String(20), default="html")  # html, pdf, docx, xlsx
    file_path = Column(String(500), nullable=True)
    content_html = Column(Text, nullable=True)

    # Status
    status = Column(String(50), default="generating")  # generating, completed, failed
    generation_time_secs = Column(Float, nullable=True)
    error_message = Column(Text, nullable=True)

    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    # Relationships
    owner = relationship("User", back_populates="reports")
    sections = relationship("ReportSection", back_populates="report", cascade="all, delete-orphan")


class ReportSection(Base):
    __tablename__ = "report_sections"

    id = Column(Integer, primary_key=True, autoincrement=True)
    report_id = Column(Integer, ForeignKey("reports.id", ondelete="CASCADE"), nullable=False)
    title = Column(String(255), nullable=False)
    section_order = Column(Integer, default=0)
    content_type = Column(String(50), nullable=True)  # text, table, chart, map, summary
    content = Column(Text, nullable=True)
    data = Column(JSON, nullable=True)  # structured data for tables/charts

    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    # Relationships
    report = relationship("Report", back_populates="sections")
