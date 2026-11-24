"""
MLModel, ModelRun, Prediction models.
"""
from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey, Text, JSON
from sqlalchemy.orm import relationship

from app.core.database import Base


class MLModel(Base):
    __tablename__ = "ml_models"

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(255), nullable=False)
    model_type = Column(String(100), nullable=False)  # logistic_regression, random_forest, xgboost, gradient_boosting
    description = Column(Text, nullable=True)
    owner_id = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True)

    # Configuration
    target_variable = Column(String(100), nullable=False, default="neet_status")
    feature_columns = Column(JSON, nullable=True)
    hyperparameters = Column(JSON, nullable=True)
    preprocessing_config = Column(JSON, nullable=True)

    # Training info
    training_dataset_id = Column(Integer, nullable=True)
    training_rows = Column(Integer, nullable=True)
    training_duration_secs = Column(Float, nullable=True)
    model_file_path = Column(String(500), nullable=True)

    # Metrics
    accuracy = Column(Float, nullable=True)
    precision_score = Column(Float, nullable=True)
    recall = Column(Float, nullable=True)
    f1 = Column(Float, nullable=True)
    auc_roc = Column(Float, nullable=True)
    cross_val_mean = Column(Float, nullable=True)
    cross_val_std = Column(Float, nullable=True)
    confusion_matrix = Column(JSON, nullable=True)
    feature_importances = Column(JSON, nullable=True)

    # SHAP
    shap_values_path = Column(String(500), nullable=True)
    shap_summary = Column(JSON, nullable=True)

    # Status
    status = Column(String(50), default="created")  # created, training, trained, failed, deployed
    error_message = Column(Text, nullable=True)
    version = Column(Integer, default=1)

    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    # Relationships
    owner = relationship("User", back_populates="ml_models")
    runs = relationship("ModelRun", back_populates="model", cascade="all, delete-orphan")
    predictions = relationship("Prediction", back_populates="model", cascade="all, delete-orphan")


class ModelRun(Base):
    __tablename__ = "model_runs"

    id = Column(Integer, primary_key=True, autoincrement=True)
    model_id = Column(Integer, ForeignKey("ml_models.id", ondelete="CASCADE"), nullable=False)
    dataset_id = Column(Integer, ForeignKey("datasets.id", ondelete="SET NULL"), nullable=True)
    run_type = Column(String(50), nullable=False)  # training, prediction, evaluation
    status = Column(String(50), default="pending")  # pending, running, completed, failed

    # Results
    metrics = Column(JSON, nullable=True)
    log = Column(Text, nullable=True)
    num_predictions = Column(Integer, nullable=True)

    started_at = Column(DateTime, nullable=True)
    completed_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    # Relationships
    model = relationship("MLModel", back_populates="runs")
    dataset = relationship("Dataset", back_populates="model_runs")


class Prediction(Base):
    __tablename__ = "predictions"

    id = Column(Integer, primary_key=True, autoincrement=True)
    model_id = Column(Integer, ForeignKey("ml_models.id", ondelete="CASCADE"), nullable=False)
    individual_id = Column(Integer, ForeignKey("individuals.id", ondelete="CASCADE"), nullable=False)

    # Prediction
    predicted_class = Column(Integer, nullable=True)  # 0 or 1 for NEET
    probability = Column(Float, nullable=True)
    risk_score = Column(Float, nullable=True)  # normalized 0-100
    risk_category = Column(String(20), nullable=True)  # low, medium, high, very_high
    confidence = Column(Float, nullable=True)

    # SHAP explanations per individual
    shap_values = Column(JSON, nullable=True)
    top_factors = Column(JSON, nullable=True)  # top N features driving this prediction

    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    # Relationships
    model = relationship("MLModel", back_populates="predictions")
    individual = relationship("Individual", back_populates="predictions")
