"""
Opportunity Discovery & Population Matching Service.
Identifies promising pathways associated with successful transitions and
matches comparable populations to candidate opportunities using multi-factor similarity.

ALL OPPORTUNITIES IN DEMO MODE ARE SYNTHETIC AND FICTIONAL.
"""

import numpy as np
import pandas as pd
from typing import Dict, List, Any, Optional
import uuid

# Fictional / Synthetic Opportunities Library for Demonstration
DEFAULT_OPPORTUNITIES: List[Dict[str, Any]] = [
    {
        "id": "OPP-001",
        "name": "Community Food Processing & Digital Commerce Cooperative",
        "category": "Community Enterprise",
        "description": "Flexible, cooperative-based agro-processing unit with packaging facilities and direct-to-consumer digital storefront access for value-added agricultural produce.",
        "target_population": "Rural women (18-29) with unpaid caregiving responsibilities and seasonal agricultural exposure",
        "required_skills": "Basic food hygiene, batch preservation, digital order fulfillment, collective accounting",
        "initial_investment": "Moderate (INR 4.5 - 6.0 Lakhs grant/microcredit per SHG cluster)",
        "infrastructure_requirements": "Single-phase power, clean water supply, community storage depot, shared 4G tablet terminal",
        "geographic_suitability": "Semi-arid and agrarian rural hinterlands with road connectivity within 15km",
        "market_requirements": "Local weekly haats and tie-ups with regional district aggregation platforms",
        "training_duration_weeks": 8,
        "evidence_source": "Fictional Demonstration Study (Cluster Evaluative Pilot 2023-25)",
        "evidence_grade": "Grade B (Multi-wave quasi-experimental comparison)",
        "observed_outcome": "Observed 34.2% NEET exit rate among active participants over 18 months, with 68% retention in cooperative activities.",
        "limitations": "Requires initial collective governance mediation; vulnerable to post-harvest price swings.",
        "is_synthetic": True,
        "similarity_profile": {
            "rural_share": 0.85,
            "female_share": 0.90,
            "mean_age": 22.5,
            "low_income_share": 0.75,
            "unpaid_care_intensity": "High",
            "education_cluster": "Secondary or below"
        }
    },
    {
        "id": "OPP-002",
        "name": "Distributed Rural BPO & Localized Data Annotation Hub",
        "category": "Digital Employment",
        "description": "Village-level digital services center providing micro-tasking, vernacular speech transcription, optical character validation, and public service record digitization.",
        "target_population": "Rural & peri-urban secondary and higher secondary educated youth (18-24)",
        "required_skills": "Vernacular keyboard literacy, basic computer operations, document verification",
        "initial_investment": "Moderate-High (INR 8 - 12 Lakhs for 15-workstation solar-supported micro-hub)",
        "infrastructure_requirements": "Uninterrupted fiber broadband / robust 4G/5G, solar backup power, air-cooled modular workstations",
        "geographic_suitability": "Block headquarters and well-connected hub villages",
        "market_requirements": "B2B client aggregation partnerships via state skill mission or social enterprise contractors",
        "training_duration_weeks": 6,
        "evidence_source": "Fictional Demonstration Evaluation (Rural Digital Tasking Pilot)",
        "evidence_grade": "Grade A (Randomized rollout across 12 fictional sub-districts)",
        "observed_outcome": "46.8% transition into steady digital micro-employment; 18.5% transition into higher technical training.",
        "limitations": "Strict client uptime and data accuracy SLAs; risk of task platform volume fluctuations.",
        "is_synthetic": True,
        "similarity_profile": {
            "rural_share": 0.65,
            "female_share": 0.55,
            "mean_age": 21.0,
            "low_income_share": 0.50,
            "unpaid_care_intensity": "Moderate",
            "education_cluster": "Secondary to Higher Secondary"
        }
    },
    {
        "id": "OPP-003",
        "name": "Solar Micro-Grid & Decentralized EV Fleet Maintenance",
        "category": "Green Apprenticeship",
        "description": "Hands-on apprenticeship curriculum tied to renewable rooftop installations, solar tube-well maintenance, and battery-swapping rickshaw diagnostics.",
        "target_population": "Peri-urban and rural young men and women (18-28) seeking technical certifications",
        "required_skills": "Electrical wiring basics, multimeter diagnostics, battery load balancing, safety protocol compliance",
        "initial_investment": "Moderate (INR 5.0 - 7.5 Lakhs equipment lab per training cohort)",
        "infrastructure_requirements": "Dedicated workshop bay, demonstration solar panels, lithium-ion battery testing rig",
        "geographic_suitability": "Tier-3 towns, industrial corridor margins, solar park periphery",
        "market_requirements": "Regional discom sub-contractors, green mobility fleet operators",
        "training_duration_weeks": 12,
        "evidence_source": "Fictional Demonstration Longitudinal Cohort (Green Tech Pathway)",
        "evidence_grade": "Grade B (Longitudinal matched control panel)",
        "observed_outcome": "52.1% permanent wage or enterprise employment transition within 6 months of apprenticeship completion.",
        "limitations": "Demands strict adherence to electrical safety gear; capital barrier for self-employed tooling kits.",
        "is_synthetic": True,
        "similarity_profile": {
            "rural_share": 0.45,
            "female_share": 0.30,
            "mean_age": 23.0,
            "low_income_share": 0.60,
            "unpaid_care_intensity": "Low",
            "education_cluster": "Upper Primary to Secondary"
        }
    },
    {
        "id": "OPP-004",
        "name": "Frontline Community Health & Early Childhood Care Auxiliary",
        "category": "Community Care Economy",
        "description": "Professionalized paramedical, crèche management, and geriatric care auxiliary training integrated with local public health and private elderly home services.",
        "target_population": "Urban informal settlement and peri-urban young women (19-30)",
        "required_skills": "First aid, maternal nutrition tracking, early childhood pedagogy, medication scheduling",
        "initial_investment": "Low-Moderate (INR 3.0 - 4.5 Lakhs clinical simulation equipment)",
        "infrastructure_requirements": "Community clinic tie-up, simulation lab, accredited nurse trainer",
        "geographic_suitability": "Urban clusters, peri-urban satellite settlements",
        "market_requirements": "Municipal primary health centers, urban crèches, home-care aggregator networks",
        "training_duration_weeks": 10,
        "evidence_source": "Fictional Care Economy Evidence Trial",
        "evidence_grade": "Grade B (Quasi-experimental cohort assessment)",
        "observed_outcome": "41.5% regularized employment transition; 22.0% uptake in accredited ANM/GNM diploma programs.",
        "limitations": "Compensation levels dependent on municipal institutional funding and fair-wage standards.",
        "is_synthetic": True,
        "similarity_profile": {
            "rural_share": 0.20,
            "female_share": 0.95,
            "mean_age": 24.5,
            "low_income_share": 0.80,
            "unpaid_care_intensity": "High",
            "education_cluster": "Secondary to Higher Secondary"
        }
    },
    {
        "id": "OPP-005",
        "name": "Precision Agro-Service & Drone Operation Collective",
        "category": "Agri-Tech Enterprise",
        "description": "Farmer-producer enterprise wing offering drone-based crop health monitoring, micronutrient spraying, and soil testing services directly to smallholder farming groups.",
        "target_population": "Rural educated youth (18-29) with polytechnic or secondary background",
        "required_skills": "Remote pilot certification basics, GPS map boundary setting, chemical dilution calibration",
        "initial_investment": "High (INR 12 - 18 Lakhs per custom agri-drone unit and mobile support van)",
        "infrastructure_requirements": "Battery charging facilities, locked storage, safe chemical repository",
        "geographic_suitability": "Intensive agricultural basins with high crop-cycling frequency",
        "market_requirements": "FPO farmer memberships, subsidized agricultural credit tie-ups",
        "training_duration_weeks": 14,
        "evidence_source": "Fictional High-Tech Agriculture Intervention Registry",
        "evidence_grade": "Grade C (Observational cohort with propensity re-weighting)",
        "observed_outcome": "38.7% sustainable self-employment earnings; service expansion to average 45 hectares per week per team.",
        "limitations": "High initial capital expenditure; weather and seasonal flight restrictions.",
        "is_synthetic": True,
        "similarity_profile": {
            "rural_share": 0.90,
            "female_share": 0.25,
            "mean_age": 23.8,
            "low_income_share": 0.45,
            "unpaid_care_intensity": "Low",
            "education_cluster": "Higher Secondary or Polytechnic"
        }
    },
    {
        "id": "OPP-006",
        "name": "Vernacular Artisan E-Commerce & Craft Studio",
        "category": "Creative Economy",
        "description": "Direct craft digitization, contemporary design adaptation, high-definition cataloging, and global handicraft marketplace integration for traditional weaver and artisan youth.",
        "target_population": "Handicraft-concentrated clusters, artisan family descendants (18-32)",
        "required_skills": "Design color harmonization, smartphone studio photography, packaging standards, digital pricing",
        "initial_investment": "Low-Moderate (INR 2.5 - 4.0 Lakhs photographic & digital kiosk setup)",
        "infrastructure_requirements": "Well-lit common facility workshop, high-speed internet, secure dispatch center",
        "geographic_suitability": "Traditional weaving and craft clusters across fictional districts",
        "market_requirements": "D2C online portal accounts, craft council certifications",
        "training_duration_weeks": 8,
        "evidence_source": "Fictional Traditional Livelihoods Digital Inclusion Audit",
        "evidence_grade": "Grade B (Panel survey of artisan clusters)",
        "observed_outcome": "29.4% exit from prolonged underemployment; 44% increase in net producer price capture.",
        "limitations": "Vulnerable to counterfeit industrial reproductions and return logistics costs.",
        "is_synthetic": True,
        "similarity_profile": {
            "rural_share": 0.70,
            "female_share": 0.60,
            "mean_age": 25.0,
            "low_income_share": 0.65,
            "unpaid_care_intensity": "Moderate",
            "education_cluster": "Primary to Secondary"
        }
    }
]

def get_opportunity_library(category: Optional[str] = None, grade: Optional[str] = None) -> List[Dict[str, Any]]:
    """Return all catalogued opportunities with optional category and evidence grade filtering."""
    results = DEFAULT_OPPORTUNITIES
    if category and category != "All":
        results = [o for o in results if o["category"] == category]
    if grade and grade != "All":
        results = [o for o in results if grade in o["evidence_grade"]]
    return results

def get_opportunity_by_id(opportunity_id: str) -> Optional[Dict[str, Any]]:
    """Retrieve detailed opportunity profile by ID."""
    for opp in DEFAULT_OPPORTUNITIES:
        if opp["id"] == opportunity_id:
            return opp
    return None

def compute_similarity(source_pop: Dict[str, Any], target_pop: Dict[str, Any], weights: Optional[Dict[str, float]] = None) -> Dict[str, Any]:
    """
    Multi-factor transparent similarity matching between a source locality/population
    and a benchmark opportunity or target population.
    
    Dimensions evaluated:
    - Demographic similarity (age, gender split)
    - Rurality and geographic setting
    - Socioeconomic and income profile
    - Unpaid caregiving burden
    - Education level distribution
    """
    if weights is None:
        weights = {
            "rural_share": 0.25,
            "female_share": 0.25,
            "age_proximity": 0.15,
            "income_profile": 0.20,
            "care_intensity": 0.15
        }
    
    # 1. Rurality difference
    s_rural = float(source_pop.get("rural_share", 0.5))
    t_rural = float(target_pop.get("rural_share", 0.5))
    rural_diff = abs(s_rural - t_rural)
    rural_sim = max(0.0, 1.0 - rural_diff)
    
    # 2. Gender share difference
    s_female = float(source_pop.get("female_share", 0.5))
    t_female = float(target_pop.get("female_share", 0.5))
    female_diff = abs(s_female - t_female)
    gender_sim = max(0.0, 1.0 - female_diff)
    
    # 3. Age proximity
    s_age = float(source_pop.get("mean_age", 22.0))
    t_age = float(target_pop.get("mean_age", 22.0))
    age_diff = abs(s_age - t_age)
    age_sim = max(0.0, 1.0 - (age_diff / 15.0))
    
    # 4. Income profile
    s_income = float(source_pop.get("low_income_share", 0.5))
    t_income = float(target_pop.get("low_income_share", 0.5))
    income_diff = abs(s_income - t_income)
    income_sim = max(0.0, 1.0 - income_diff)
    
    # 5. Care intensity match
    s_care = str(source_pop.get("unpaid_care_intensity", "Moderate")).lower()
    t_care = str(target_pop.get("unpaid_care_intensity", "Moderate")).lower()
    care_map = {"low": 1, "moderate": 2, "high": 3}
    care_diff = abs(care_map.get(s_care, 2) - care_map.get(t_care, 2))
    care_sim = 1.0 - (care_diff / 2.0)
    
    composite_score = (
        rural_sim * weights["rural_share"] +
        gender_sim * weights["female_share"] +
        age_sim * weights["age_proximity"] +
        income_sim * weights["income_profile"] +
        care_sim * weights["care_intensity"]
    )
    
    # Determine qualitative match explanation
    similarities = []
    differences = []
    
    if rural_diff < 0.15:
        similarities.append(f"Highly comparable geographic environment (Rural share: {int(s_rural*100)}% vs {int(t_rural*100)}%)")
    else:
        differences.append(f"Geographic variance in urbanicity ({int(s_rural*100)}% rural vs {int(t_rural*100)}% in benchmark)")
        
    if female_diff < 0.15:
        similarities.append(f"Similar gender composition ({int(s_female*100)}% female)")
    else:
        differences.append(f"Gender balance disparity ({int(s_female*100)}% vs {int(t_female*100)}% in target)")
        
    if income_diff < 0.18:
        similarities.append("Closely matched household income and deprivation quintiles")
    else:
        differences.append("Discrepancy in baseline household economic vulnerability")
        
    if care_diff == 0:
        similarities.append(f"Identical caregiving demand profile ({s_care.capitalize()} unpaid care burden)")
    else:
        differences.append(f"Differing unpaid caregiving requirements ({s_care.capitalize()} vs {t_care.capitalize()})")
        
    return {
        "similarity_score": round(composite_score * 100, 1),
        "dimensions": {
            "geographic_similarity": round(rural_sim * 100, 1),
            "gender_similarity": round(gender_sim * 100, 1),
            "age_proximity": round(age_sim * 100, 1),
            "economic_similarity": round(income_sim * 100, 1),
            "care_intensity_similarity": round(care_sim * 100, 1)
        },
        "similarities": similarities,
        "differences": differences,
        "methodological_note": "A high similarity index measures observable population profile closeness. It constitutes transferability rationale, NOT empirical proof of guaranteed intervention efficacy."
    }

def match_population_to_opportunities(source_pop: Dict[str, Any]) -> List[Dict[str, Any]]:
    """Rank opportunities by multi-factor suitability to a target population."""
    matches = []
    for opp in DEFAULT_OPPORTUNITIES:
        profile = opp.get("similarity_profile", {})
        comp = compute_similarity(source_pop, profile)
        matches.append({
            "opportunity_id": opp["id"],
            "opportunity_name": opp["name"],
            "category": opp["category"],
            "evidence_grade": opp["evidence_grade"],
            "match_score": comp["similarity_score"],
            "dimension_breakdown": comp["dimensions"],
            "key_similarities": comp["similarities"],
            "key_differences": comp["differences"],
            "required_adaptations": [
                f"Calibrate training delivery hours around {source_pop.get('unpaid_care_intensity', 'Moderate')} caregiving schedules.",
                "Establish local transport or doorstep connectivity if rural isolation index exceeds threshold.",
                "Engage local community leaders and family decision-makers to encourage female participation."
            ],
            "methodological_note": comp["methodological_note"]
        })
    matches.sort(key=lambda x: x["match_score"], reverse=True)
    return matches
