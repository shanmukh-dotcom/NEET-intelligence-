"""
Transition Intelligence Service for NEET Intelligence Platform.

Computes transition matrices, persistence analysis, sequence patterns,
and survival analysis for NEET spells.

ALL RESULTS DERIVED FROM SYNTHETIC DATA ARE SYNTHETIC.
"""

import numpy as np
import pandas as pd
from typing import Optional
from collections import Counter

try:
    from lifelines import KaplanMeierFitter, CoxPHFitter
    HAS_LIFELINES = True
except ImportError:
    HAS_LIFELINES = False

ACTIVITY_STATES = ["Education", "Employment", "Training", "NEET"]


# ---------------------------------------------------------------------------
# Transition Matrix
# ---------------------------------------------------------------------------

def compute_transition_matrix(df: pd.DataFrame,
                               filters: Optional[dict] = None) -> dict:
    """
    Compute observed transition proportions between activity states.

    Parameters
    ----------
    df : pd.DataFrame
        Long-format data with person_id, wave, activity_state columns.
    filters : dict, optional
        Filter criteria: gender, rural_urban, age_min, age_max,
        education_level, income_quintile, wave_from, wave_to.

    Returns
    -------
    dict
        Transition matrix, counts, and methodological notes.
    """
    data = df.copy()
    if filters:
        if "gender" in filters:
            data = data[data["gender"] == filters["gender"]]
        if "rural_urban" in filters:
            data = data[data["rural_urban"] == filters["rural_urban"]]
        if "age_min" in filters:
            data = data[data["age"] >= filters["age_min"]]
        if "age_max" in filters:
            data = data[data["age"] <= filters["age_max"]]
        if "education_level" in filters:
            data = data[data["education_level"] == filters["education_level"]]
        if "income_quintile" in filters:
            data = data[data["income_quintile"] == filters["income_quintile"]]

    # Remove missing activity states
    data = data.dropna(subset=["activity_state"])
    data = data.sort_values(["person_id", "wave"])

    # Build transitions
    transitions = []
    for pid, group in data.groupby("person_id"):
        states = group["activity_state"].values
        waves = group["wave"].values
        for i in range(len(states) - 1):
            # Only count consecutive waves
            if waves[i + 1] - waves[i] <= 2:  # allow small gaps
                transitions.append((states[i], states[i + 1]))

    if not transitions:
        return {
            "matrix": {},
            "counts": {},
            "n_transitions": 0,
            "note": "No valid transitions found with given filters.",
        }

    # Count transitions
    count_matrix = {}
    for from_s in ACTIVITY_STATES:
        count_matrix[from_s] = {}
        for to_s in ACTIVITY_STATES:
            count_matrix[from_s][to_s] = 0

    for from_s, to_s in transitions:
        if from_s in count_matrix and to_s in count_matrix.get(from_s, {}):
            count_matrix[from_s][to_s] += 1

    # Compute proportions
    prop_matrix = {}
    for from_s in ACTIVITY_STATES:
        row_total = sum(count_matrix[from_s].values())
        prop_matrix[from_s] = {}
        for to_s in ACTIVITY_STATES:
            if row_total > 0:
                prop_matrix[from_s][to_s] = round(
                    count_matrix[from_s][to_s] / row_total, 4
                )
            else:
                prop_matrix[from_s][to_s] = 0.0

    return {
        "matrix": prop_matrix,
        "counts": count_matrix,
        "n_transitions": len(transitions),
        "n_individuals": data["person_id"].nunique(),
        "filters_applied": filters or {},
        "methodological_note": (
            "Transition probabilities are estimated from observed "
            "consecutive wave pairs.  They reflect CORRELATIONAL patterns "
            "and should NOT be interpreted as causal effects.  "
            "Observed state dependence may partly reflect unobserved "
            "heterogeneity rather than true state dependence.  "
            "Results from SYNTHETIC data."
        ),
    }


# ---------------------------------------------------------------------------
# Persistence Analysis
# ---------------------------------------------------------------------------

def analyze_persistence(df: pd.DataFrame) -> dict:
    """
    Analyse NEET persistence patterns.

    Distinguishes:
    - Never NEET: no NEET episodes
    - One-time NEET: exactly one NEET wave
    - Repeated NEET: NEET in multiple non-consecutive waves
    - Consecutive NEET: NEET in 2+ consecutive waves
    - Chronic NEET: NEET in all observed waves

    Parameters
    ----------
    df : pd.DataFrame

    Returns
    -------
    dict
        Persistence categories, durations, and subgroup breakdown.
    """
    data = df.dropna(subset=["activity_state"]).copy()
    data = data.sort_values(["person_id", "wave"])

    results = {}
    person_categories = []

    for pid, group in data.groupby("person_id"):
        states = group["activity_state"].values
        waves = group["wave"].values
        n_waves = len(states)
        neet_mask = states == "NEET"
        n_neet = neet_mask.sum()

        # Compute consecutive NEET spells
        spells = []
        current_spell = 0
        for is_n in neet_mask:
            if is_n:
                current_spell += 1
            else:
                if current_spell > 0:
                    spells.append(current_spell)
                current_spell = 0
        if current_spell > 0:
            spells.append(current_spell)

        max_consecutive = max(spells) if spells else 0

        # Categorise
        if n_neet == 0:
            category = "never_neet"
        elif n_neet == n_waves:
            category = "chronic_neet"
        elif max_consecutive >= 2:
            category = "consecutive_neet"
        elif n_neet > 1:
            category = "repeated_neet"
        else:
            category = "one_time_neet"

        person_categories.append({
            "person_id": pid,
            "category": category,
            "n_waves_observed": n_waves,
            "n_neet_waves": int(n_neet),
            "max_consecutive_neet": int(max_consecutive),
            "n_spells": len(spells),
            "spell_durations": spells,
            "gender": group["gender"].iloc[0] if "gender" in group.columns else None,
            "rural_urban": group["rural_urban"].iloc[0] if "rural_urban" in group.columns else None,
        })

    cat_df = pd.DataFrame(person_categories)

    # Summary
    cat_counts = cat_df["category"].value_counts().to_dict()
    cat_pct = (cat_df["category"].value_counts(normalize=True) * 100).round(2).to_dict()

    # Subgroup breakdown
    subgroup_breakdown = {}
    for grp_col in ["gender", "rural_urban"]:
        if grp_col not in cat_df.columns or cat_df[grp_col].isna().all():
            continue
        breakdown = {}
        for val in cat_df[grp_col].dropna().unique():
            sub = cat_df[cat_df[grp_col] == val]
            breakdown[str(val)] = sub["category"].value_counts(normalize=True).mul(100).round(2).to_dict()
        subgroup_breakdown[grp_col] = breakdown

    # Spell duration statistics
    all_spells = []
    for s in cat_df["spell_durations"]:
        all_spells.extend(s)

    spell_stats = {}
    if all_spells:
        spell_stats = {
            "mean_spell_duration": round(float(np.mean(all_spells)), 2),
            "median_spell_duration": round(float(np.median(all_spells)), 2),
            "max_spell_duration": int(np.max(all_spells)),
            "total_spells": len(all_spells),
        }

    return {
        "n_individuals": len(cat_df),
        "category_counts": cat_counts,
        "category_percentages": cat_pct,
        "subgroup_breakdown": subgroup_breakdown,
        "spell_statistics": spell_stats,
        "categories_defined": {
            "never_neet": "No NEET episodes in any observed wave",
            "one_time_neet": "Exactly one NEET wave, not consecutive with another",
            "repeated_neet": "NEET in multiple non-consecutive waves",
            "consecutive_neet": "NEET in 2+ consecutive waves",
            "chronic_neet": "NEET in all observed waves",
        },
        "methodological_warning": (
            "Persistence categories depend on the number of observed waves "
            "and panel attrition.  Apparent state dependence may reflect "
            "unobserved heterogeneity.  Distinguish carefully between "
            "'being NEET causes future NEET' (state dependence) and "
            "'certain individuals are persistently NEET due to underlying "
            "characteristics' (heterogeneity).  SYNTHETIC data."
        ),
    }


# ---------------------------------------------------------------------------
# Sequence Analysis
# ---------------------------------------------------------------------------

def analyze_sequences(df: pd.DataFrame) -> dict:
    """
    Analyse activity state sequence patterns.

    Parameters
    ----------
    df : pd.DataFrame

    Returns
    -------
    dict
        Most common sequences, transition patterns, entropy.
    """
    data = df.dropna(subset=["activity_state"]).copy()
    data = data.sort_values(["person_id", "wave"])

    # Build sequences
    sequences = []
    sequence_details = []
    for pid, group in data.groupby("person_id"):
        seq = tuple(group["activity_state"].values)
        sequences.append(seq)
        sequence_details.append({
            "person_id": pid,
            "sequence": list(seq),
            "length": len(seq),
        })

    if not sequences:
        return {"n_individuals": 0, "note": "No valid sequences found."}

    # Most common sequences
    seq_counter = Counter(sequences)
    total = len(sequences)
    top_sequences = [
        {
            "sequence": list(seq),
            "count": count,
            "percentage": round(count / total * 100, 2),
        }
        for seq, count in seq_counter.most_common(20)
    ]

    # Sequence diversity (Shannon entropy)
    probs = np.array([c / total for c in seq_counter.values()])
    entropy = float(-np.sum(probs * np.log2(probs + 1e-10)))

    # Common NEET entry/exit patterns
    neet_entries = []
    neet_exits = []
    for seq in sequences:
        for i in range(1, len(seq)):
            if seq[i] == "NEET" and seq[i - 1] != "NEET":
                neet_entries.append(seq[i - 1])
            if seq[i] != "NEET" and seq[i - 1] == "NEET":
                neet_exits.append(seq[i])

    entry_counts = Counter(neet_entries)
    exit_counts = Counter(neet_exits)

    entry_total = sum(entry_counts.values()) or 1
    exit_total = sum(exit_counts.values()) or 1

    return {
        "n_individuals": total,
        "n_unique_sequences": len(seq_counter),
        "top_sequences": top_sequences,
        "sequence_entropy": round(entropy, 4),
        "neet_entry_from": {
            k: {"count": v, "percentage": round(v / entry_total * 100, 2)}
            for k, v in entry_counts.most_common()
        },
        "neet_exit_to": {
            k: {"count": v, "percentage": round(v / exit_total * 100, 2)}
            for k, v in exit_counts.most_common()
        },
        "note": (
            "Sequence analysis shows the most common longitudinal "
            "activity patterns.  Higher entropy indicates more diverse "
            "pathways.  SYNTHETIC data."
        ),
    }


# ---------------------------------------------------------------------------
# Survival Analysis – Time to NEET Exit
# ---------------------------------------------------------------------------

def survival_analysis(df: pd.DataFrame) -> dict:
    """
    Estimate time to NEET exit using Kaplan-Meier and optionally Cox PH.

    Parameters
    ----------
    df : pd.DataFrame

    Returns
    -------
    dict
        Survival estimates, median duration, hazard ratios (if Cox).
    """
    data = df.dropna(subset=["activity_state"]).copy()
    data = data.sort_values(["person_id", "wave"])

    # Extract NEET spells
    spells = []
    for pid, group in data.groupby("person_id"):
        states = group["activity_state"].values
        waves = group["wave"].values
        gender = group["gender"].iloc[0] if "gender" in group.columns else None
        rural_urban = group["rural_urban"].iloc[0] if "rural_urban" in group.columns else None
        edu = group["education_level"].iloc[0] if "education_level" in group.columns else None

        in_spell = False
        spell_start = 0
        for i, (state, wave) in enumerate(zip(states, waves)):
            if state == "NEET" and not in_spell:
                in_spell = True
                spell_start = wave
            elif state != "NEET" and in_spell:
                duration = wave - spell_start
                spells.append({
                    "person_id": pid,
                    "duration": max(1, duration),
                    "event": 1,  # exited NEET
                    "gender": gender,
                    "rural_urban": rural_urban,
                    "education_level": edu,
                })
                in_spell = False

        # Right-censored spell (still NEET at last observation)
        if in_spell:
            duration = waves[-1] - spell_start + 1
            spells.append({
                "person_id": pid,
                "duration": max(1, duration),
                "event": 0,  # censored
                "gender": gender,
                "rural_urban": rural_urban,
                "education_level": edu,
            })

    if not spells:
        return {
            "n_spells": 0,
            "note": "No NEET spells found in the data.",
        }

    spell_df = pd.DataFrame(spells)

    result = {
        "n_spells": len(spell_df),
        "n_exits": int(spell_df["event"].sum()),
        "n_censored": int((spell_df["event"] == 0).sum()),
        "mean_duration": round(float(spell_df["duration"].mean()), 2),
        "median_duration": round(float(spell_df["duration"].median()), 2),
    }

    # Kaplan-Meier
    if HAS_LIFELINES:
        kmf = KaplanMeierFitter()
        kmf.fit(spell_df["duration"], event_observed=spell_df["event"])
        survival_table = kmf.survival_function_.reset_index()
        survival_table.columns = ["timeline", "survival_probability"]

        result["kaplan_meier"] = {
            "survival_table": survival_table.to_dict("records"),
            "median_survival_time": (
                round(float(kmf.median_survival_time_), 2)
                if not np.isinf(kmf.median_survival_time_) else None
            ),
        }

        # KM by gender
        km_by_gender = {}
        if "gender" in spell_df.columns and spell_df["gender"].notna().any():
            for g in spell_df["gender"].dropna().unique():
                sub = spell_df[spell_df["gender"] == g]
                if len(sub) >= 5:
                    kmf_g = KaplanMeierFitter()
                    kmf_g.fit(sub["duration"], event_observed=sub["event"])
                    km_by_gender[str(g)] = {
                        "median_survival_time": (
                            round(float(kmf_g.median_survival_time_), 2)
                            if not np.isinf(kmf_g.median_survival_time_) else None
                        ),
                        "n_spells": len(sub),
                    }
            result["kaplan_meier"]["by_gender"] = km_by_gender

        # Cox PH (simplified)
        try:
            cox_df = spell_df[["duration", "event"]].copy()
            if "gender" in spell_df.columns:
                cox_df["is_female"] = (spell_df["gender"] == "Female").astype(int)
            if "rural_urban" in spell_df.columns:
                cox_df["is_rural"] = (spell_df["rural_urban"] == "Rural").astype(int)
            cox_df = cox_df.dropna()

            cov_cols = [c for c in ["is_female", "is_rural"] if c in cox_df.columns]
            if cov_cols and len(cox_df) >= 20:
                cph = CoxPHFitter()
                cph.fit(cox_df, duration_col="duration", event_col="event")
                summary = cph.summary
                hazard_ratios = {}
                for var in cov_cols:
                    if var in summary.index:
                        hazard_ratios[var] = {
                            "hazard_ratio": round(float(summary.loc[var, "exp(coef)"]), 4),
                            "p_value": round(float(summary.loc[var, "p"]), 4),
                            "ci_lower": round(float(summary.loc[var, "exp(coef) lower 95%"]), 4),
                            "ci_upper": round(float(summary.loc[var, "exp(coef) upper 95%"]), 4),
                        }
                result["cox_ph"] = {
                    "hazard_ratios": hazard_ratios,
                    "concordance_index": round(float(cph.concordance_index_), 4),
                    "note": (
                        "Cox PH hazard ratios: HR < 1 means slower exit from NEET "
                        "(longer NEET duration).  CORRELATIONAL only – not causal."
                    ),
                }
        except Exception as e:
            result["cox_ph"] = {"error": str(e)}
    else:
        result["kaplan_meier"] = {
            "note": "lifelines library not installed. Install with: pip install lifelines"
        }

    result["methodological_note"] = (
        "Survival analysis estimates the probability of remaining in NEET "
        "over time.  Right-censored observations (individuals still in NEET "
        "at last survey wave) are handled by the Kaplan-Meier estimator.  "
        "Cox PH results are CORRELATIONAL, not causal.  SYNTHETIC data."
    )

    return result
