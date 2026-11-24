from app.services.synthetic_service import generate_synthetic_population, get_presets, generate_demo_dataset
from app.services.measurement_service import classify_neet, classify_dataset, run_sensitivity_analysis
from app.services.prediction_service import train_model, get_model_results, get_models_list, get_shap_summary, estimate_dynamic_probit
from app.services.transition_service import compute_transition_matrix, analyze_persistence, analyze_sequences, compute_survival_curves
from app.services.opportunity_service import get_opportunity_library, match_population_to_opportunities, get_opportunity_by_id
from app.services.intervention_service import list_interventions, get_intervention_by_id, update_intervention_status, create_intervention_proposal
from app.services.scenario_service import simulate_timeline, run_multi_scenario_comparison, get_default_scenario_configs
from app.services.ai_service import ask_research_assistant
from app.services.report_service import list_reports, get_report_by_id, generate_csv_export
from app.services.evidence_service import get_evidence_registry, get_evidence_by_id, register_evidence_finding
from app.services.population_service import get_population_summary
from app.services.data_service import list_datasets, get_dataset_inspection

__all__ = [
    "generate_synthetic_population", "get_presets", "generate_demo_dataset",
    "classify_neet", "classify_dataset", "run_sensitivity_analysis",
    "train_model", "get_model_results", "get_models_list", "get_shap_summary", "estimate_dynamic_probit",
    "compute_transition_matrix", "analyze_persistence", "analyze_sequences", "compute_survival_curves",
    "get_opportunity_library", "match_population_to_opportunities", "get_opportunity_by_id",
    "list_interventions", "get_intervention_by_id", "update_intervention_status", "create_intervention_proposal",
    "simulate_timeline", "run_multi_scenario_comparison", "get_default_scenario_configs",
    "ask_research_assistant",
    "list_reports", "get_report_by_id", "generate_csv_export",
    "get_evidence_registry", "get_evidence_by_id", "register_evidence_finding",
    "get_population_summary",
    "list_datasets", "get_dataset_inspection"
]
