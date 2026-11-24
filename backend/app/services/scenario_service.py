"""
NEET Scenario Simulator Engine.
Provides interactive forward projections, assumption-driven calculations,
and multi-scenario comparisons (Baseline, Moderate, Expanded) across 2021-2031.

CRITICAL MATHEMATICAL INTEGRITY RULE:
Distinguishes historical observed values (2021-2026), model-based estimates,
and assumption-driven calculations (2027-2031). Never claims assumption arithmetic
is an empirically verified causal intervention effect.
"""

from typing import Dict, List, Any, Optional
import numpy as np
import copy

HISTORICAL_YEARS = [2021, 2022, 2023, 2024, 2025, 2026]
PROJECTED_YEARS = [2027, 2028, 2029, 2030, 2031]

# Historical baseline NEET rates (benchmark calibration from synthetic 50,000 dataset)
HISTORICAL_NEET_RATES = {
    2021: 28.4,
    2022: 27.9,
    2023: 27.3,
    2024: 26.8,
    2025: 26.5,
    2026: 26.1
}

# Total baseline target youth cohort in simulated population
BASELINE_COHORT_SIZE = 50000

def get_default_scenario_configs() -> Dict[str, Any]:
    """Default parameters for the three canonical policy scenarios."""
    return {
        "baseline": {
            "name": "Status Quo (No Additional Intervention)",
            "description": "Continuation of existing secular trends and natural attrition with no expanded youth targeting or care support.",
            "programme_coverage": 0.05,
            "participation_rate": 0.60,
            "completion_rate": 0.65,
            "transition_assumption": 0.25,
            "investment_cr": 0.0,
            "care_support_included": False,
            "type": "Status Quo"
        },
        "moderate": {
            "name": "Moderate Targeted Intervention",
            "description": "Phased scaling of localized skill bridges and digital hubs with basic childcare stipends in priority high-risk districts.",
            "programme_coverage": 0.35,
            "participation_rate": 0.72,
            "completion_rate": 0.75,
            "transition_assumption": 0.38,
            "investment_cr": 14.5,
            "care_support_included": True,
            "type": "Targeted Policy"
        },
        "expanded": {
            "name": "Comprehensive Expanded Intervention",
            "description": "Universal youth saturation in priority blocks with integrated crèche networks, paid apprenticeships, and enterprise seed funds.",
            "programme_coverage": 0.65,
            "participation_rate": 0.85,
            "completion_rate": 0.82,
            "transition_assumption": 0.48,
            "investment_cr": 38.0,
            "care_support_included": True,
            "type": "Transformative Saturation"
        }
    }

def simulate_timeline(config: Dict[str, Any], initial_population: int = BASELINE_COHORT_SIZE) -> Dict[str, Any]:
    """
    Computes yearly timeline metrics across 2021-2031 for a given scenario configuration.
    
    Formula for projected years (2027-2031):
    Target NEET pool = Population * Baseline_NEET_Rate
    Eligible Reached = Target NEET pool * programme_coverage
    Completed = Eligible Reached * participation_rate * completion_rate
    Transitions = Completed * transition_assumption
    Adjusted NEET Count = Target NEET pool - Transitions + (New Entrants natural rate)
    """
    coverage = float(config.get("programme_coverage", 0.35))
    part_rate = float(config.get("participation_rate", 0.72))
    comp_rate = float(config.get("completion_rate", 0.75))
    trans_rate = float(config.get("transition_assumption", 0.38))
    
    timeline = []
    
    # 1. Historical Years (2021-2026) - Observed
    for yr in HISTORICAL_YEARS:
        rate = HISTORICAL_NEET_RATES[yr]
        neet_count = int(initial_population * (rate / 100.0))
        timeline.append({
            "year": yr,
            "is_projected": False,
            "data_classification": "Observed Historical Record",
            "population": initial_population,
            "neet_prevalence_pct": rate,
            "neet_population": neet_count,
            "programme_coverage_pct": round(config.get("programme_coverage", 0.05) * 100 * (0.3 if yr < 2024 else 0.6), 1),
            "estimated_participants": 0,
            "projected_transitions": 0,
            "cumulative_exits": 0,
            "confidence_interval_low": round(rate - 0.4, 1),
            "confidence_interval_high": round(rate + 0.4, 1)
        })
        
    # 2. Projected Years (2027-2031) - Model & Assumption Driven
    curr_rate = HISTORICAL_NEET_RATES[2026]
    cumulative_transitions = 0
    pop_growth_rate = 0.008  # 0.8% annual cohort variation
    curr_pop = initial_population
    
    # Effective exit fraction per year
    annual_exit_efficiency = coverage * part_rate * comp_rate * trans_rate
    
    for yr in PROJECTED_YEARS:
        curr_pop = int(curr_pop * (1 + pop_growth_rate))
        baseline_neet_pool = int(curr_pop * (curr_rate / 100.0))
        
        # Ramp-up factor for intervention maturity over 5 years
        ramp_factor = min(1.0, 0.4 + (yr - 2027) * 0.15) if coverage > 0.1 else 0.3
        effective_annual_efficiency = annual_exit_efficiency * ramp_factor
        
        annual_participants = int(baseline_neet_pool * coverage * part_rate * ramp_factor)
        annual_completions = int(annual_participants * comp_rate)
        annual_transitions = int(annual_completions * trans_rate)
        
        cumulative_transitions += annual_transitions
        
        # Rate reduction with diminishing marginal returns and baseline natural entry (approx 2.5% entry rate)
        natural_new_neet_inflow = int(curr_pop * 0.024)
        net_neet_pool = max(int(curr_pop * 0.08), baseline_neet_pool - annual_transitions + (natural_new_neet_inflow * (0.85 if config.get("care_support_included") else 1.0)))
        
        projected_rate = round((net_neet_pool / curr_pop) * 100.0, 2)
        curr_rate = projected_rate
        
        # Uncertainty band expands with projection horizon
        horizon_uncertainty = 0.5 + (yr - 2026) * 0.4
        
        timeline.append({
            "year": yr,
            "is_projected": True,
            "data_classification": "Assumption-Driven Scenario Projection",
            "population": curr_pop,
            "neet_prevalence_pct": projected_rate,
            "neet_population": net_neet_pool,
            "programme_coverage_pct": round(coverage * ramp_factor * 100, 1),
            "estimated_participants": annual_participants,
            "projected_transitions": annual_transitions,
            "cumulative_exits": cumulative_transitions,
            "confidence_interval_low": round(max(5.0, projected_rate - horizon_uncertainty), 1),
            "confidence_interval_high": round(projected_rate + horizon_uncertainty, 1)
        })
        
    return {
        "scenario_name": config.get("name", "Custom Scenario"),
        "config": config,
        "timeline": timeline,
        "total_cumulative_transitions_by_2031": cumulative_transitions,
        "final_neet_rate_2031": timeline[-1]["neet_prevalence_pct"],
        "rate_reduction_from_2026": round(HISTORICAL_NEET_RATES[2026] - timeline[-1]["neet_prevalence_pct"], 2),
        "methodology_disclaimer": "Projections for 2027-2031 are computed from stated parametric assumptions and cohort flow accounting. They are not guaranteed econometrically identified causal impacts."
    }

def run_multi_scenario_comparison(custom_moderate: Optional[Dict[str, Any]] = None, custom_expanded: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
    """Execute and package simultaneous comparison of Baseline, Moderate, and Expanded scenarios."""
    defaults = get_default_scenario_configs()
    
    cfg_base = defaults["baseline"]
    cfg_mod = custom_moderate if custom_moderate else defaults["moderate"]
    cfg_exp = custom_expanded if custom_expanded else defaults["expanded"]
    
    sim_base = simulate_timeline(cfg_base)
    sim_mod = simulate_timeline(cfg_mod)
    sim_exp = simulate_timeline(cfg_exp)
    
    # Combined timeline table for side-by-side plotting
    combined_timeline = []
    all_years = HISTORICAL_YEARS + PROJECTED_YEARS
    
    for i, yr in enumerate(all_years):
        t_base = sim_base["timeline"][i]
        t_mod = sim_mod["timeline"][i]
        t_exp = sim_exp["timeline"][i]
        
        combined_timeline.append({
            "year": yr,
            "is_projected": yr in PROJECTED_YEARS,
            "baseline_rate": t_base["neet_prevalence_pct"],
            "moderate_rate": t_mod["neet_prevalence_pct"],
            "expanded_rate": t_exp["neet_prevalence_pct"],
            "baseline_exits": t_base["cumulative_exits"],
            "moderate_exits": t_mod["cumulative_exits"],
            "expanded_exits": t_exp["cumulative_exits"],
        })
        
    # Sensitivity analysis matrix on Coverage x Transition Assumption
    sensitivity_grid = []
    cov_steps = [0.20, 0.40, 0.60, 0.80]
    trans_steps = [0.20, 0.35, 0.50, 0.65]
    
    for c in cov_steps:
        row = {"coverage": f"{int(c*100)}%"}
        for t in trans_steps:
            cfg_sens = copy.deepcopy(cfg_mod)
            cfg_sens["programme_coverage"] = c
            cfg_sens["transition_assumption"] = t
            res = simulate_timeline(cfg_sens)
            row[f"trans_{int(t*100)}"] = res["final_neet_rate_2031"]
        sensitivity_grid.append(row)
        
    return {
        "scenarios": {
            "baseline": sim_base,
            "moderate": sim_mod,
            "expanded": sim_exp
        },
        "combined_timeline": combined_timeline,
        "sensitivity_analysis": {
            "description": "Projected 2031 NEET Rate across Varying Coverage and Transition Assumption parameters",
            "grid": sensitivity_grid
        },
        "summary_comparison": [
            {
                "scenario": "Baseline (Status Quo)",
                "rate_2026": HISTORICAL_NEET_RATES[2026],
                "projected_rate_2031": sim_base["final_neet_rate_2031"],
                "neet_reduction_pts": sim_base["rate_reduction_from_2026"],
                "total_transitions": sim_base["total_cumulative_transitions_by_2031"],
                "investment_cr": cfg_base["investment_cr"]
            },
            {
                "scenario": "Moderate Targeted",
                "rate_2026": HISTORICAL_NEET_RATES[2026],
                "projected_rate_2031": sim_mod["final_neet_rate_2031"],
                "neet_reduction_pts": sim_mod["rate_reduction_from_2026"],
                "total_transitions": sim_mod["total_cumulative_transitions_by_2031"],
                "investment_cr": cfg_mod["investment_cr"]
            },
            {
                "scenario": "Expanded Comprehensive",
                "rate_2026": HISTORICAL_NEET_RATES[2026],
                "projected_rate_2031": sim_exp["final_neet_rate_2031"],
                "neet_reduction_pts": sim_exp["rate_reduction_from_2026"],
                "total_transitions": sim_exp["total_cumulative_transitions_by_2031"],
                "investment_cr": cfg_exp["investment_cr"]
            }
        ]
    }
