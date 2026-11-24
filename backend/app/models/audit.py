"""
AuditEvent model for tracking all user actions.
"""
from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text, JSON

from app.core.database import Base
from sqlalchemy.orm import relationship


class AuditEvent(Base):
    __tablename__ = "audit_events"

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    event_type = Column(String(100), nullable=False)  # login, upload, train, predict, export, delete, config_change
    resource_type = Column(String(100), nullable=True)  # dataset, model, report, scenario, user
    resource_id = Column(Integer, nullable=True)
    action = Column(String(50), nullable=False)  # create, read, update, delete, execute
    description = Column(Text, nullable=True)
    details = Column(JSON, nullable=True)

    # Context
    ip_address = Column(String(45), nullable=True)
    user_agent = Column(String(500), nullable=True)
    endpoint = Column(String(255), nullable=True)
    request_method = Column(String(10), nullable=True)
    response_status = Column(Integer, nullable=True)

    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    # Relationships
    user = relationship("User", back_populates="audit_events")
