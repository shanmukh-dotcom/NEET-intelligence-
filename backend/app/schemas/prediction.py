"""
Pydantic schemas for prediction / ML model operations.
"""
from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field


class ModelConfig(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    model_type: str = Field(default="xgboost")  # logistic_regression, random_forest, xgboost, gradient_boosting
    dataset_id: int
    target_variable: str = "neet_status"
    feature_columns: Optional[list[str]] = None
    test_size: float = Field(default=0.2, ge=0.05, le=0.5)
    cross_validation_folds: int = Field(default=5, ge=2, le=20)
    hyperparameters: Optional[dict] = None
    description: Optional[str] = None


class ModelMetrics(BaseModel):
    accuracy: Optional[float] = None
    precision: Optional[float] = None
    recall: Optional[float] = None
    f1: Optional[float] = None
    auc_roc: Optional[float] = None
    cross_val_mean: Optional[float] = None
    cross_val_std: Optional[float] = None
    confusion_matrix: Optional[list[list[int]]] = None


class ModelResult(BaseModel):
    model_id: int
    name: str
    model_type: str
    status: str
    metrics: Optional[ModelMetrics] = None
    feature_importances: Optional[dict] = None
    training_rows: Optional[int] = None
    training_duration_secs: Optional[float] = None
    created_at: Optional[datetime] = None

    model_config = {"from_attributes": True}


class ModelListResponse(BaseModel):
    id: int
    name: str
    model_type: str
    status: str
    accuracy: Optional[float] = None
    auc_roc: Optional[float] = None
    created_at: Optional[datetime] = None

    model_config = {"from_attributes": True}


class PredictionResponse(BaseModel):
    individual_id: int
    predicted_class: int
    probability: float
    risk_score: float
    risk_category: str
    top_factors: Optional[list[dict]] = None


class SHAPExplanation(BaseModel):
    model_id: int
    feature_names: list[str] = []
    mean_abs_shap: Optional[dict] = None  # feature -> mean |SHAP|
    sample_explanations: Optional[list[dict]] = None
    summary_plot_path: Optional[str] = None
