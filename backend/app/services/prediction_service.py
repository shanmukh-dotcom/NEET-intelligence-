"""
NEET Prediction Intelligence Service.

Trains and evaluates ML models for predicting NEET status.
Supports logistic regression, random forest, gradient boosting, and XGBoost.
Provides SHAP-based explanations and subgroup performance analysis.

ALL RESULTS DERIVED FROM SYNTHETIC DATA ARE SYNTHETIC.
"""

import numpy as np
import pandas as pd
import uuid
from datetime import datetime
from typing import Optional

from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.metrics import (
    accuracy_score, precision_score, recall_score, f1_score,
    roc_auc_score, average_precision_score, confusion_matrix,
    classification_report, calibration_curve,
)

try:
    from xgboost import XGBClassifier
    HAS_XGBOOST = True
except ImportError:
    HAS_XGBOOST = False

try:
    import shap
    HAS_SHAP = True
except ImportError:
    HAS_SHAP = False


# ---------------------------------------------------------------------------
# In-memory model cache
# ---------------------------------------------------------------------------
_MODEL_CACHE: dict = {}

# Feature columns used for modelling
FEATURE_COLS = [
    "age", "gender", "rural_urban", "education_level",
    "marital_status", "income_quintile", "migration_status",
    "disability_status", "unpaid_care_hours", "wave",
]

CATEGORICAL_COLS = [
    "gender", "rural_urban", "education_level",
    "marital_status", "migration_status", "disability_status",
]


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def _prepare_features(df: pd.DataFrame,
                      label_encoders: Optional[dict] = None,
                      fit: bool = False) -> tuple:
    """
    Encode categorical features and return X matrix + encoders.

    Parameters
    ----------
    df : pd.DataFrame
    label_encoders : dict or None
    fit : bool
        Whether to fit encoders (training) or just transform (prediction).

    Returns
    -------
    tuple (X: np.ndarray, encoders: dict, feature_names: list)
    """
    available = [c for c in FEATURE_COLS if c in df.columns]
    data = df[available].copy()

    if label_encoders is None:
        label_encoders = {}

    for col in CATEGORICAL_COLS:
        if col not in data.columns:
            continue
        data[col] = data[col].fillna("Unknown")
        if fit:
            le = LabelEncoder()
            data[col] = le.fit_transform(data[col].astype(str))
            label_encoders[col] = le
        else:
            le = label_encoders.get(col)
            if le is None:
                le = LabelEncoder()
                data[col] = le.fit_transform(data[col].astype(str))
                label_encoders[col] = le
            else:
                # Handle unseen labels gracefully
                known = set(le.classes_)
                data[col] = data[col].astype(str).apply(
                    lambda x: x if x in known else "Unknown"
                )
                if "Unknown" not in known:
                    le.classes_ = np.append(le.classes_, "Unknown")
                data[col] = le.transform(data[col])

    # Fill remaining NAs with 0
    data = data.fillna(0)
    return data.values.astype(float), label_encoders, list(data.columns)


def _build_model(model_type: str, config: dict):
    """Instantiate an sklearn-compatible classifier."""
    seed = config.get("seed", 42)
    if model_type == "logistic_regression":
        return LogisticRegression(
            max_iter=1000, random_state=seed, class_weight="balanced"
        )
    elif model_type == "random_forest":
        return RandomForestClassifier(
            n_estimators=config.get("n_estimators", 200),
            max_depth=config.get("max_depth", 12),
            random_state=seed,
            class_weight="balanced",
            n_jobs=-1,
        )
    elif model_type == "gradient_boosting":
        return GradientBoostingClassifier(
            n_estimators=config.get("n_estimators", 200),
            max_depth=config.get("max_depth", 5),
            learning_rate=config.get("learning_rate", 0.1),
            random_state=seed,
        )
    elif model_type == "xgboost":
        if not HAS_XGBOOST:
            raise ImportError(
                "XGBoost is not installed. Install with: pip install xgboost"
            )
        return XGBClassifier(
            n_estimators=config.get("n_estimators", 200),
            max_depth=config.get("max_depth", 6),
            learning_rate=config.get("learning_rate", 0.1),
            random_state=seed,
            use_label_encoder=False,
            eval_metric="logloss",
        )
    else:
        raise ValueError(f"Unknown model type: {model_type}")


def _subgroup_metrics(y_true, y_pred, y_prob, df_orig, indices):
    """Compute metrics broken down by subgroups."""
    subgroup_cols = {
        "gender": "gender",
        "rural_urban": "rural_urban",
        "age_group": None,  # computed below
    }
    results = {}
    sub_df = df_orig.iloc[indices].copy()
    sub_df["y_true"] = y_true
    sub_df["y_pred"] = y_pred
    sub_df["y_prob"] = y_prob

    # Create age groups
    if "age" in sub_df.columns:
        sub_df["age_group"] = pd.cut(
            sub_df["age"],
            bins=[14, 19, 24, 29, 35],
            labels=["15-19", "20-24", "25-29", "30-35"],
        )

    for group_name in ["gender", "rural_urban", "age_group"]:
        if group_name not in sub_df.columns:
            continue
        group_results = {}
        for val in sub_df[group_name].dropna().unique():
            mask = sub_df[group_name] == val
            gt = sub_df.loc[mask, "y_true"].values
            gp = sub_df.loc[mask, "y_pred"].values
            gprob = sub_df.loc[mask, "y_prob"].values
            if len(gt) < 5 or len(np.unique(gt)) < 2:
                continue
            group_results[str(val)] = {
                "n": int(len(gt)),
                "accuracy": round(float(accuracy_score(gt, gp)), 4),
                "precision": round(float(precision_score(gt, gp, zero_division=0)), 4),
                "recall": round(float(recall_score(gt, gp, zero_division=0)), 4),
                "f1": round(float(f1_score(gt, gp, zero_division=0)), 4),
                "neet_prevalence": round(float(gt.mean()), 4),
            }
            try:
                group_results[str(val)]["roc_auc"] = round(
                    float(roc_auc_score(gt, gprob)), 4
                )
            except ValueError:
                pass
        results[group_name] = group_results

    return results


# ---------------------------------------------------------------------------
# Public API
# ---------------------------------------------------------------------------

def train_model(df: pd.DataFrame, config: Optional[dict] = None) -> dict:
    """
    Train a prediction model for NEET status.

    Parameters
    ----------
    df : pd.DataFrame
        Must contain 'neet_binary' (target) and feature columns.
    config : dict, optional
        Keys: model_type, test_size, seed, n_estimators, max_depth, learning_rate

    Returns
    -------
    dict
        model_id, metrics, feature_importance, subgroup_metrics, metadata
    """
    if config is None:
        config = {}

    model_type = config.get("model_type", "random_forest")
    test_size = config.get("test_size", 0.20)
    seed = config.get("seed", 42)

    # Require target column
    target_col = config.get("target_col", "neet_binary")
    if target_col not in df.columns:
        raise ValueError(
            f"Target column '{target_col}' not found. "
            "Run measurement_service.classify_dataset first."
        )

    # Drop rows with missing target
    clean = df.dropna(subset=[target_col]).copy()
    clean[target_col] = clean[target_col].astype(int)

    if len(clean) < 50:
        raise ValueError(f"Too few observations ({len(clean)}) for modelling.")

    y = clean[target_col].values
    X, encoders, feature_names = _prepare_features(clean, fit=True)

    # Train/test split
    X_train, X_test, y_train, y_test, idx_train, idx_test = train_test_split(
        X, y, np.arange(len(clean)),
        test_size=test_size, random_state=seed, stratify=y,
    )

    # Scale features
    scaler = StandardScaler()
    X_train_s = scaler.fit_transform(X_train)
    X_test_s = scaler.transform(X_test)

    # Build and train
    model = _build_model(model_type, config)
    model.fit(X_train_s, y_train)

    # Predictions
    y_pred = model.predict(X_test_s)
    y_prob = model.predict_proba(X_test_s)[:, 1]

    # Metrics
    cm = confusion_matrix(y_test, y_pred).tolist()
    metrics = {
        "accuracy": round(float(accuracy_score(y_test, y_pred)), 4),
        "precision": round(float(precision_score(y_test, y_pred, zero_division=0)), 4),
        "recall": round(float(recall_score(y_test, y_pred, zero_division=0)), 4),
        "f1": round(float(f1_score(y_test, y_pred, zero_division=0)), 4),
        "confusion_matrix": cm,
        "n_train": int(len(y_train)),
        "n_test": int(len(y_test)),
        "neet_prevalence_train": round(float(y_train.mean()), 4),
        "neet_prevalence_test": round(float(y_test.mean()), 4),
    }

    try:
        metrics["roc_auc"] = round(float(roc_auc_score(y_test, y_prob)), 4)
    except ValueError:
        metrics["roc_auc"] = None

    try:
        metrics["pr_auc"] = round(float(average_precision_score(y_test, y_prob)), 4)
    except ValueError:
        metrics["pr_auc"] = None

    # Calibration curve
    try:
        fraction_of_positives, mean_predicted_value = calibration_curve(
            y_test, y_prob, n_bins=10
        )
        metrics["calibration"] = {
            "fraction_of_positives": fraction_of_positives.tolist(),
            "mean_predicted_value": mean_predicted_value.tolist(),
        }
    except Exception:
        metrics["calibration"] = None

    # Feature importance
    feat_imp = _extract_feature_importance(model, feature_names, model_type)

    # Subgroup performance
    subgroup = _subgroup_metrics(y_test, y_pred, y_prob, clean, idx_test)

    # Store model
    model_id = f"model-{model_type}-{uuid.uuid4().hex[:8]}"
    _MODEL_CACHE[model_id] = {
        "model": model,
        "scaler": scaler,
        "encoders": encoders,
        "feature_names": feature_names,
        "model_type": model_type,
        "metrics": metrics,
        "feature_importance": feat_imp,
        "subgroup_metrics": subgroup,
        "trained_at": datetime.utcnow().isoformat(),
        "config": config,
        "X_test": X_test_s,
        "y_test": y_test,
    }

    return {
        "model_id": model_id,
        "model_type": model_type,
        "metrics": metrics,
        "feature_importance": feat_imp,
        "subgroup_metrics": subgroup,
        "trained_at": _MODEL_CACHE[model_id]["trained_at"],
        "note": "Model trained on SYNTHETIC data. Results are illustrative only.",
    }


def _extract_feature_importance(model, feature_names: list,
                                 model_type: str) -> list[dict]:
    """Extract feature importance from the fitted model."""
    importances = None
    if hasattr(model, "feature_importances_"):
        importances = model.feature_importances_
    elif hasattr(model, "coef_"):
        importances = np.abs(model.coef_[0])

    if importances is None:
        return []

    pairs = sorted(
        zip(feature_names, importances),
        key=lambda x: x[1],
        reverse=True,
    )
    return [
        {"feature": name, "importance": round(float(imp), 6), "rank": i + 1}
        for i, (name, imp) in enumerate(pairs)
    ]


def predict(model_id: str, df: pd.DataFrame) -> dict:
    """
    Generate predictions using a trained model.

    Parameters
    ----------
    model_id : str
        ID returned by train_model.
    df : pd.DataFrame
        New data to predict on.

    Returns
    -------
    dict
        predictions, probabilities, summary statistics.
    """
    if model_id not in _MODEL_CACHE:
        raise KeyError(f"Model '{model_id}' not found in cache.")

    cache = _MODEL_CACHE[model_id]
    model = cache["model"]
    scaler = cache["scaler"]
    encoders = cache["encoders"]

    X, _, feature_names = _prepare_features(df, label_encoders=encoders, fit=False)
    X_s = scaler.transform(X)

    preds = model.predict(X_s)
    probs = model.predict_proba(X_s)[:, 1]

    return {
        "model_id": model_id,
        "predictions": preds.tolist(),
        "probabilities": probs.tolist(),
        "predicted_neet_count": int(preds.sum()),
        "predicted_neet_rate": round(float(preds.mean()), 4),
        "n_predictions": len(preds),
        "note": "Predictions based on SYNTHETIC training data.",
    }


def get_feature_importance(model_id: str) -> dict:
    """
    Retrieve feature importance for a trained model.

    Parameters
    ----------
    model_id : str

    Returns
    -------
    dict
        Feature importance ranking.
    """
    if model_id not in _MODEL_CACHE:
        raise KeyError(f"Model '{model_id}' not found in cache.")

    cache = _MODEL_CACHE[model_id]
    return {
        "model_id": model_id,
        "model_type": cache["model_type"],
        "feature_importance": cache["feature_importance"],
        "note": (
            "Feature importance indicates the relative contribution of each "
            "feature to the model's predictions.  Importance does NOT imply "
            "causation.  These results are from SYNTHETIC data."
        ),
    }


def get_shap_values(model_id: str, df: pd.DataFrame) -> dict:
    """
    Compute SHAP values for model explanations.

    Parameters
    ----------
    model_id : str
    df : pd.DataFrame
        Data to explain (a sample is recommended for speed).

    Returns
    -------
    dict
        SHAP values summary.
    """
    if model_id not in _MODEL_CACHE:
        raise KeyError(f"Model '{model_id}' not found in cache.")

    cache = _MODEL_CACHE[model_id]
    model = cache["model"]
    scaler = cache["scaler"]
    encoders = cache["encoders"]
    feature_names = cache["feature_names"]

    X, _, _ = _prepare_features(df, label_encoders=encoders, fit=False)
    X_s = scaler.transform(X)

    # Limit sample size for performance
    max_samples = min(500, len(X_s))
    X_sample = X_s[:max_samples]

    if not HAS_SHAP:
        # Fallback: return feature importance instead
        return {
            "model_id": model_id,
            "shap_available": False,
            "fallback": "feature_importance",
            "feature_importance": cache["feature_importance"],
            "note": "SHAP library not installed. Returning feature importance instead.",
        }

    try:
        model_type = cache["model_type"]
        if model_type in ("random_forest", "gradient_boosting", "xgboost"):
            explainer = shap.TreeExplainer(model)
            shap_vals = explainer.shap_values(X_sample)
            if isinstance(shap_vals, list):
                shap_vals = shap_vals[1]  # class 1 (NEET)
        else:
            # Linear model
            explainer = shap.LinearExplainer(model, X_sample)
            shap_vals = explainer.shap_values(X_sample)

        # Mean absolute SHAP values
        mean_abs = np.abs(shap_vals).mean(axis=0)
        shap_ranking = sorted(
            zip(feature_names, mean_abs),
            key=lambda x: x[1],
            reverse=True,
        )

        return {
            "model_id": model_id,
            "shap_available": True,
            "n_samples_explained": max_samples,
            "mean_abs_shap": [
                {"feature": name, "mean_abs_shap": round(float(val), 6)}
                for name, val in shap_ranking
            ],
            "shap_values_shape": list(shap_vals.shape),
            "note": (
                "SHAP values show the contribution of each feature to "
                "individual predictions.  Positive values push toward "
                "NEET prediction.  SYNTHETIC data – illustrative only."
            ),
        }
    except Exception as e:
        return {
            "model_id": model_id,
            "shap_available": False,
            "error": str(e),
            "fallback": "feature_importance",
            "feature_importance": cache["feature_importance"],
        }


def list_models() -> list[dict]:
    """List all cached models."""
    return [
        {
            "model_id": mid,
            "model_type": info["model_type"],
            "trained_at": info["trained_at"],
            "accuracy": info["metrics"]["accuracy"],
            "f1": info["metrics"]["f1"],
        }
        for mid, info in _MODEL_CACHE.items()
    ]
