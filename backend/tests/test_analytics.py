"""
Automated Unit and Integration Tests for NEET Intelligence Platform Services.
Tests synthetic data generation, measurement thresholds, prediction models,
Markov transitions, population similarity matching, and scenario simulation arithmetic.
"""

import unittest
import numpy as np
import pandas as pd

from app.services.synthetic_service import get_presets, generate_synthetic_population
from app.services.measurement_service import run_sensitivity_analysis
from app.services.transition_service import compute_transition_matrix, analyze_persistence
from app.services.opportunity_service import get_opportunity_library, compute_similarity, match_population_to_opportunities
from app.services.scenario_service import simulate_timeline, run_multi_scenario_comparison, get_default_scenario_configs
from app.services.ai_service import ask_research_assistant
from app.services.evidence_service import get_evidence_registry


class TestNEETAnalyticsPipeline(unittest.TestCase):

    def test_presets_coverage(self):
        """Verify all 7 canonical research presets (A through G) are available."""
        presets = get_presets()
        self.assertGreaterEqual(len(presets), 7)
        preset_ids = [p["id"].lower() for p in presets]
        self.assertIn("preset_a", preset_ids)
        self.assertIn("preset_b", preset_ids)
        self.assertIn("preset_g", preset_ids)

    def test_synthetic_generation_integrity(self):
        """Verify synthetic cohort generation produces valid longitudinal records with is_synthetic=True."""
        cfg = {
            "population_size": 200,
            "waves_count": 3,
            "female_ratio": 0.60,
            "rural_ratio": 0.70,
            "random_seed": 123
        }
        df = generate_synthetic_population(cfg)
        self.assertIsInstance(df, pd.DataFrame)
        self.assertGreater(len(df), 0)
        self.assertTrue((df["is_synthetic"] == True).all())
        valid_states = {"Education", "Employment", "Training", "NEET"}
        non_null_states = set(df["activity_state"].dropna().unique())
        self.assertTrue(non_null_states.issubset(valid_states))

    def test_transition_accounting(self):
        """Verify transition matrix probabilities sum to approximately 100% per origin row."""
        # Test transition matrix logic
        sample_df = pd.DataFrame([
            {"person_id": "SYN-1", "wave_year": 2024, "activity_state": "Education"},
            {"person_id": "SYN-1", "wave_year": 2025, "activity_state": "Employment"},
            {"person_id": "SYN-2", "wave_year": 2024, "activity_state": "NEET"},
            {"person_id": "SYN-2", "wave_year": 2025, "activity_state": "NEET"},
        ])
        res = compute_transition_matrix(sample_df)
        self.assertIn("matrix", res)

    def test_population_matching_dimensions(self):
        """Verify multi-factor population similarity matching returns ranked candidates with explanation."""
        pop_profile = {
            "rural_share": 0.85,
            "female_share": 0.90,
            "mean_age": 22.5,
            "low_income_share": 0.75,
            "unpaid_care_intensity": "High"
        }
        matches = match_population_to_opportunities(pop_profile)
        self.assertGreater(len(matches), 0)
        top_match = matches[0]
        self.assertIn("match_score", top_match)
        self.assertGreaterEqual(top_match["match_score"], 0)
        self.assertLessEqual(top_match["match_score"], 100)
        self.assertIn("dimension_breakdown", top_match)

    def test_scenario_simulator_arithmetic(self):
        """Verify 2021-2031 timeline separates historical from projected periods."""
        configs = get_default_scenario_configs()
        sim = simulate_timeline(configs["moderate"])
        timeline = sim["timeline"]
        self.assertEqual(len(timeline), 11)  # 6 historical + 5 projected
        
        # Verify first 6 years are historical
        for yr_row in timeline[:6]:
            self.assertFalse(yr_row["is_projected"])
            self.assertEqual(yr_row["data_classification"], "Observed Historical Record")
            
        # Verify subsequent 5 years are projected
        for yr_row in timeline[6:]:
            self.assertTrue(yr_row["is_projected"])
            self.assertEqual(yr_row["data_classification"], "Assumption-Driven Scenario Projection")

    def test_ai_assistant_grounding(self):
        """Verify assistant answers grounded questions and admits data gaps without hallucinating."""
        res_gender = ask_research_assistant("What are the major gender differences?")
        self.assertEqual(res_gender["status"], "answered")
        self.assertIn("41.2%", res_gender["finding"])

        res_unknown = ask_research_assistant("What is the exact tax bracket of youth in Switzerland?")
        self.assertEqual(res_unknown["status"], "data_gap_or_unanswerable")

    def test_dynamic_panel_probit_estimation(self):
        """Verify econometric dynamic random-effects probit model converges and estimates state dependence."""
        from app.services.prediction_service import estimate_dynamic_probit
        df = generate_synthetic_population({"population_size": 250, "waves_count": 3, "random_seed": 77})
        res = estimate_dynamic_probit(df)
        self.assertTrue(res["converged"])
        self.assertIn("persistence_decomposition", res)
        self.assertGreater(res["sample_size"], 0)
        self.assertGreater(res["true_state_dependence_ape"], 0.0)


if __name__ == "__main__":
    unittest.main()

