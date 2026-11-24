"""
NEET Measurement Engine for NEET Intelligence Platform.

Classifies individuals and populations into NEET / non-NEET categories
using configurable definitions.  Supports sensitivity analysis across
different measurement thresholds.

ALL RESULTS DERIVED FROM SYNTHETIC DATA ARE SYNTHETIC.
"""

import numpy as np
import pandas as pd
from typing import Optional


# ---------------------------------------------------------------------------
# Default measurement config
# ---------------------------------------------------------------------------
DEFAULT_CONFIG = {
    "age_min": 15,
    "age_max": 24,
    "work_hour_threshold": 0,       # hours above which someone counts as employed
    "include_informal": True,       # count informal employment as employment
    "training_min_hours": 0,        # minimum hours to count as in training
    "education_formal_only": False, # if True only formal education counts
}


def _validate_config(config: dict) -> dict:
    """Merge user config with defaults."""
    merged = dict(DEFAULT_CONFIG)
    if config:
        merged.update(config)
    return merged


# ---------------------------------------------------------------------------
# Single-observation classifier
# ---------------------------------------------------------------------------

def classify_neet(observation: dict, config: Optional[dict] = None) -> dict:
    """
    Classify a single observation as NEET or non-NEET.

    Parameters
    ----------
    observation : dict
        Must contain at least 'activity_state'.  Optionally 'age',
        'work_hours', 'is_informal'.
    config : dict, optional
        Measurement configuration overrides.

    Returns
    -------
    dict
        Classification result with explanation.
    """
    cfg = _validate_config(config)

    age = observation.get("age")
    activity = observation.get("activity_state")
    work_hours = observation.get("work_hours", 0) or 0
    is_informal = observation.get("is_informal", False)

    # If activity_state is missing, we cannot classify
    if pd.isna(activity) or activity is None:
        return {
            "neet_status": None,
            "neet_binary": None,
            "classification_detail": "missing_data",
            "explanation": "Activity state is missing; cannot classify.",
            "in_age_range": None,
            "employment_intensity": None,
            "is_underemployed": None,
            "informality_flag": None,
        }

    # Age range check
    in_age_range = True
    if age is not None:
        in_age_range = cfg["age_min"] <= age <= cfg["age_max"]

    # Classification logic
    is_in_education = activity == "Education"
    is_in_training = activity == "Training"
    is_employed = activity == "Employment"

    # Apply work-hour threshold
    if is_employed and cfg["work_hour_threshold"] > 0:
        if work_hours < cfg["work_hour_threshold"]:
            is_employed = False  # below threshold → not counted as employed

    # Informal employment exclusion
    if is_employed and not cfg["include_informal"] and is_informal:
        is_employed = False

    is_neet = not (is_in_education or is_employed or is_in_training)

    # Supplementary indicators
    emp_intensity = "none"
    if activity == "Employment":
        if work_hours >= 35:
            emp_intensity = "full_time"
        elif work_hours >= 20:
            emp_intensity = "part_time"
        elif work_hours > 0:
            emp_intensity = "marginal"

    is_underemployed = observation.get("is_underemployed", False)
    informality_flag = is_informal if activity == "Employment" else False

    # Build explanation
    rules = []
    rules.append(f"Activity state: {activity}")
    if cfg["work_hour_threshold"] > 0:
        rules.append(
            f"Work-hour threshold: {cfg['work_hour_threshold']}h "
            f"(observed: {work_hours}h)"
        )
    if not cfg["include_informal"]:
        rules.append("Informal employment excluded")
    rules.append(f"Age range filter: {cfg['age_min']}-{cfg['age_max']}")

    detail = "neet" if is_neet else activity.lower()

    return {
        "neet_status": "NEET" if is_neet else "Non-NEET",
        "neet_binary": 1 if is_neet else 0,
        "classification_detail": detail,
        "explanation": "; ".join(rules),
        "in_age_range": in_age_range,
        "employment_intensity": emp_intensity,
        "is_underemployed": is_underemployed,
        "informality_flag": informality_flag,
    }


# ---------------------------------------------------------------------------
# Dataset classifier
# ---------------------------------------------------------------------------

def classify_dataset(df: pd.DataFrame, config: Optional[dict] = None) -> pd.DataFrame:
    """
    Classify an entire dataset, adding NEET columns.

    Parameters
    ----------
    df : pd.DataFrame
        Must contain 'activity_state' column.
    config : dict, optional
        Measurement configuration overrides.

    Returns
    -------
    pd.DataFrame
        Copy of input with added classification columns.
    """
    if df.empty:
        return df.copy()

    cfg = _validate_config(config)
    result = df.copy()

    classifications = []
    for _, row in result.iterrows():
        cls = classify_neet(row.to_dict(), cfg)
        classifications.append(cls)

    cls_df = pd.DataFrame(classifications)
    for col in cls_df.columns:
        result[col] = cls_df[col].values

    return result


def classify_dataset_fast(df: pd.DataFrame, config: Optional[dict] = None) -> pd.DataFrame:
    """
    Vectorised (fast) classification for large datasets.

    Parameters
    ----------
    df : pd.DataFrame
    config : dict, optional

    Returns
    -------
    pd.DataFrame
    """
    if df.empty:
        return df.copy()

    cfg = _validate_config(config)
    result = df.copy()

    activity = result["activity_state"]
    work_hours = result.get("work_hours", pd.Series(0, index=result.index))
    is_informal_col = result.get("is_informal", pd.Series(False, index=result.index))

    in_education = activity == "Education"
    in_training = activity == "Training"
    employed = activity == "Employment"

    # Work-hour threshold
    if cfg["work_hour_threshold"] > 0:
        employed = employed & (work_hours >= cfg["work_hour_threshold"])

    # Informal exclusion
    if not cfg["include_informal"]:
        employed = employed & (~is_informal_col)

    is_neet = ~(in_education | employed | in_training) & activity.notna()

    result["neet_binary"] = np.where(activity.isna(), np.nan, np.where(is_neet, 1, 0))
    result["neet_status"] = np.where(
        activity.isna(), None,
        np.where(is_neet, "NEET", "Non-NEET")
    )

    # Employment intensity
    result["employment_intensity"] = "none"
    result.loc[activity == "Employment", "employment_intensity"] = np.where(
        work_hours[activity == "Employment"] >= 35, "full_time",
        np.where(work_hours[activity == "Employment"] >= 20, "part_time", "marginal")
    )

    # Age range
    if "age" in result.columns:
        result["in_age_range"] = result["age"].between(cfg["age_min"], cfg["age_max"])
    else:
        result["in_age_range"] = True

    result["informality_flag"] = (activity == "Employment") & (is_informal_col == True)

    return result


# ---------------------------------------------------------------------------
# Sensitivity Analysis
# ---------------------------------------------------------------------------

def sensitivity_analysis(df: pd.DataFrame,
                         thresholds: Optional[list] = None) -> dict:
    """
    Compute NEET prevalence under different work-hour thresholds.

    Parameters
    ----------
    df : pd.DataFrame
        Dataset with activity_state and work_hours.
    thresholds : list[int], optional
        Work-hour thresholds to test.  Default [0, 1, 10, 20].

    Returns
    -------
    dict
        {
            "thresholds": [...],
            "results": [
                {
                    "threshold": int,
                    "neet_count": int,
                    "total_classified": int,
                    "neet_rate": float,
                    "by_gender": {...},
                    "by_rural_urban": {...},
                }
            ],
            "note": str,
        }
    """
    if thresholds is None:
        thresholds = [0, 1, 10, 20]

    results = []
    for thr in sorted(thresholds):
        cfg = {"work_hour_threshold": thr}
        classified = classify_dataset_fast(df, cfg)
        valid = classified[classified["neet_binary"].notna()]

        neet_count = int(valid["neet_binary"].sum())
        total = len(valid)
        neet_rate = neet_count / total if total > 0 else 0.0

        # Subgroup breakdowns
        by_gender = {}
        if "gender" in valid.columns:
            for g in valid["gender"].dropna().unique():
                sub = valid[valid["gender"] == g]
                by_gender[g] = {
                    "neet_count": int(sub["neet_binary"].sum()),
                    "total": len(sub),
                    "neet_rate": float(sub["neet_binary"].mean()),
                }

        by_ru = {}
        if "rural_urban" in valid.columns:
            for ru in valid["rural_urban"].dropna().unique():
                sub = valid[valid["rural_urban"] == ru]
                by_ru[ru] = {
                    "neet_count": int(sub["neet_binary"].sum()),
                    "total": len(sub),
                    "neet_rate": float(sub["neet_binary"].mean()),
                }

        results.append({
            "threshold": thr,
            "neet_count": neet_count,
            "total_classified": total,
            "neet_rate": round(neet_rate, 4),
            "by_gender": by_gender,
            "by_rural_urban": by_ru,
        })

    return {
        "thresholds": thresholds,
        "results": results,
        "note": (
            "Sensitivity analysis shows how NEET prevalence changes under "
            "different work-hour thresholds.  Higher thresholds reclassify "
            "marginally employed individuals as NEET.  "
            "Results derived from SYNTHETIC data."
        ),
    }

# Alias for backwards compatibility with service exports
run_sensitivity_analysis = sensitivity_analysis
