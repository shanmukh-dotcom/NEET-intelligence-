"""
Evidence Registry Service.
Maintains a rigorous, traceable audit trail of all analytical findings with
explicit evidence classifications (Descriptive, Predictive, Comparative, Causal).

CRITICAL RULE:
A finding must NEVER be classified as Causal solely based on regression or ML correlations.
"""

from typing import Dict, List, Any, Optional
from datetime import datetime
import uuid

EVIDENCE_REGISTRY: List[Dict[str, Any]] = [
    {
        "finding_id": "EVD-2026-001",
        "title": "Severe Female Youth Inactivity Gradient in Rural Districts",
        "evidence_classification": "Descriptive",
        "source_dataset": "NEET Synthetic Demo Cohort (SYN-2021-26)",
        "survey_wave": "Wave 6 (2026)",
        "population": "Rural youth aged 15-29 (N = 31,200)",
        "geographic_scope": "12 Rural Fictional Districts",
        "variable_definitions": "NEET defined as 0 weekly work hours, no educational enrollment, no formal vocational training participation.",
        "analytical_method": "Stratified cross-tabulation with survey wave expansion weights.",
        "sample_size": 31200,
        "result": "Observed NEET rate among rural females is 46.7%, compared to 14.1% for rural males, yielding a 32.6 percentage point gender gap.",
        "confidence_or_uncertainty": "95% CI: [46.1%, 47.3%]",
        "limitations": "Synthetic simulation. Does not reflect real government microdata. Informal home-based agricultural help may be under-recorded.",
        "model_version": "N/A (Descriptive Tabulation)",
        "created_at": "2026-10-15T09:00:00Z",
        "is_synthetic": True
    },
    {
        "finding_id": "EVD-2026-002",
        "title": "Daily Unpaid Care Hours as Leading Predictor of NEET Persistence",
        "evidence_classification": "Predictive",
        "source_dataset": "NEET Synthetic Demo Cohort (SYN-2021-26)",
        "survey_wave": "Waves 1-5 to predict Wave 6",
        "population": "Longitudinal youth panel (N = 46,140)",
        "geographic_scope": "All 20 Fictional Districts",
        "variable_definitions": "Unpaid care hours self-reported daily average for domestic cooking, cleaning, and child/elder assistance.",
        "analytical_method": "Gradient Boosted Decision Trees (XGBoost) with 5-fold cross-validation and TreeSHAP attribution.",
        "sample_size": 46140,
        "result": "Unpaid care hours (>4 hrs/day) exhibits highest mean absolute SHAP value (+0.42), conferring 3.2x increased odds of remaining NEET in subsequent waves.",
        "confidence_or_uncertainty": "Test ROC-AUC: 0.842 ± 0.008",
        "limitations": "Predictive association does NOT prove care duties cause NEET status; simultaneous joint household decisions may drive both.",
        "model_version": "XGBoost-NEET-v1.4",
        "created_at": "2026-10-20T11:30:00Z",
        "is_synthetic": True
    },
    {
        "finding_id": "EVD-2026-003",
        "title": "Vocational Training Completion Elevates Subsequent Employment Transition",
        "evidence_classification": "Comparative",
        "source_dataset": "NEET Synthetic Demo Cohort (SYN-2021-26)",
        "survey_wave": "Wave Pairs 2023-2024 and 2024-2025",
        "population": "Youth transitioning from active training vs untreated NEET status (N = 8,450)",
        "geographic_scope": "State-wide Fictional Training Centers",
        "variable_definitions": "Completion of accredited 8+ week technical or vocational training credential.",
        "analytical_method": "Propensity score matching comparing employment transition rates between training completers and matched non-participants.",
        "sample_size": 8450,
        "result": "Training completers exhibited a 45.2% employment transition rate in the subsequent wave compared to 15.1% for matched untreated NEET youth (relative difference +30.1 pts).",
        "confidence_or_uncertainty": "Matched p-value < 0.001; ATT = +0.284",
        "limitations": "Quasi-experimental comparison; unobserved motivation and family network advantages cannot be completely ruled out without true experimental randomization.",
        "model_version": "PSM-Match-v2.1",
        "created_at": "2026-10-25T14:15:00Z",
        "is_synthetic": True
    },
    {
        "finding_id": "EVD-2026-004",
        "title": "Randomized Rollout of Vernacular Digital Workstations Pilot",
        "evidence_classification": "Causal",
        "source_dataset": "Fictional Evaluative Pilot Trial Microdata",
        "survey_wave": "Baseline (2024) and Follow-up (2025)",
        "population": "Sub-district clusters of secondary-educated youth (N = 2,400 across 12 clusters)",
        "geographic_scope": "Fictional Districts A2 and B4",
        "variable_definitions": "Cluster-randomized access to community digital tasking workstation with guaranteed micro-task minimum wage floor.",
        "analytical_method": "Cluster-randomized controlled trial (RCT) with intention-to-treat (ITT) linear probability estimation.",
        "sample_size": 2400,
        "result": "Statistically significant causal reduction in NEET prevalence of 16.4 percentage points (p < 0.01) in treatment clusters compared to control clusters over 12 months.",
        "confidence_or_uncertainty": "ITT Effect = -0.164 (SE = 0.038, 95% CI: [-0.238, -0.090])",
        "limitations": "Synthetic pilot scenario for software demonstration. Causal external validity cannot be assumed for other cultural or economic regions.",
        "model_version": "RCT-ITT-Analysis-v1.0",
        "created_at": "2026-11-01T16:00:00Z",
        "is_synthetic": True
    }
]

def get_evidence_registry(classification: Optional[str] = None) -> List[Dict[str, Any]]:
    """Retrieve evidence records with optional classification filter."""
    if classification and classification != "All":
        return [e for e in EVIDENCE_REGISTRY if e["evidence_classification"].lower() == classification.lower()]
    return EVIDENCE_REGISTRY

def get_evidence_by_id(finding_id: str) -> Optional[Dict[str, Any]]:
    """Retrieve full evidence profile by finding ID."""
    for item in EVIDENCE_REGISTRY:
        if item["finding_id"] == finding_id:
            return item
    return None

def register_evidence_finding(data: Dict[str, Any]) -> Dict[str, Any]:
    """Add a new peer-reviewed analytical finding to the registry."""
    new_record = {
        "finding_id": f"EVD-{datetime.utcnow().year}-{str(uuid.uuid4())[:4].upper()}",
        "title": data.get("title", "New Analytical Finding"),
        "evidence_classification": data.get("evidence_classification", "Descriptive"),
        "source_dataset": data.get("source_dataset", "Uploaded Research Microdata"),
        "survey_wave": data.get("survey_wave", "Current Wave"),
        "population": data.get("population", "Sample Population"),
        "geographic_scope": data.get("geographic_scope", "Regional Scope"),
        "variable_definitions": data.get("variable_definitions", "Standard definitions applied"),
        "analytical_method": data.get("analytical_method", "Statistical estimation"),
        "sample_size": data.get("sample_size", 1000),
        "result": data.get("result", "Quantitative finding summary"),
        "confidence_or_uncertainty": data.get("confidence_or_uncertainty", "Uncertainty specified"),
        "limitations": data.get("limitations", "Methodological limitations documented"),
        "model_version": data.get("model_version", "v1.0"),
        "created_at": datetime.utcnow().isoformat() + "Z",
        "is_synthetic": data.get("is_synthetic", True)
    }
    EVIDENCE_REGISTRY.append(new_record)
    return new_record
