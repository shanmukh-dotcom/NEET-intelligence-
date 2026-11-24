"""
Research Report Generation Service.
Generates comprehensive research documentation, analytical summaries,
and tabular exports (CSV/Excel) for policy stakeholders and research supervisors.
"""

from typing import Dict, List, Any, Optional
import io
import csv
from datetime import datetime

REPORT_TEMPLATES = [
    {
        "id": "REP-FULL-01",
        "title": "Comprehensive Youth NEET Intelligence & Transition Assessment (2021-2026)",
        "subtitle": "Longitudinal Microdata Evidence, Predictive Risk Stratification, and 2027-2031 Policy Scenarios",
        "author": "NEET Research Consortium & Policy Analytics Unit",
        "date": "November 2026",
        "dataset_name": "Synthetic Demonstration Panel (N=50,000 across 20 Fictional Localities)",
        "is_synthetic": True,
        "sections": [
            {
                "id": "exec_summary",
                "title": "1. Executive Summary",
                "content": (
                    "This report synthesizes six waves of longitudinal youth observation (2021-2026) across 20 representative "
                    "fictional localities. Observed youth NEET prevalence declined modestly from 28.4% in 2021 to 26.1% in 2026. "
                    "However, aggregate prevalence masks profound gender stratification: young women experience a 41.2% NEET rate "
                    "compared to 12.8% for young men. Unpaid domestic caregiving (>4 hours daily) emerges as the single strongest "
                    "predictor of persistent youth inactivity. Simulation of an Expanded Comprehensive Intervention (65% coverage "
                    "with crèche infrastructure and paid industry apprenticeships) projects a potential decline in youth NEET prevalence "
                    "to 14.8% by 2031, yielding an estimated 8,420 net cumulative transitions into sustainable activity states."
                )
            },
            {
                "id": "methodology",
                "title": "2. Data Provenance & Measurement Methodology",
                "content": (
                    "The analytical pipeline employs standard ILO/PLFS activity-state definitions: zero hours worked during the reference "
                    "week, combined with non-participation in formal schooling or recognized vocational training. Repeated observations "
                    "across survey waves distinguish transitory (single-wave), recurrent (intermittent), and chronic (>3 consecutive waves) "
                    "NEET spells. Machine learning models (Logistic Regression, Random Forest, and XGBoost) were evaluated under strict "
                    "80/20 train/test temporal separation with TreeSHAP feature attribution."
                )
            },
            {
                "id": "prevalence_findings",
                "title": "3. Population Structure & NEET Prevalence",
                "content": (
                    "Across the baseline cohort of 50,000 individuals, rural youth represent 62.4% of observations. Rural female youth "
                    "demonstrate the highest vulnerability (46.7% NEET rate), with substantial geographic concentration in agrarian hinterlands "
                    "(Districts B1, B3, C2). In urban centers (Districts A1, A4), educated unemployment among diploma and degree holders "
                    "accounts for 38.6% of urban NEET cases, driven by qualification-job expectation mismatch."
                )
            },
            {
                "id": "transition_analysis",
                "title": "4. Transition Matrices & Persistence Dynamics",
                "content": (
                    "First-order Markovian transition matrices demonstrate significant persistence: 70.2% of individuals identified as NEET "
                    "in Wave t remain NEET in Wave t+1. Formal employment entry is 15.1% annually, while vocational training absorbs 7.1%. "
                    "Importantly, completing recognized vocational training raises subsequent employment transition to 45.2%, underscoring "
                    "the catalytic role of structured skilling."
                )
            },
            {
                "id": "opportunity_intervention",
                "title": "5. Opportunity Discovery & Intervention Recommendations",
                "content": (
                    "Multi-factor population similarity matching identified two high-potential interventions: (1) Community Food Processing "
                    "& Digital Cooperatives for rural female clusters (88.4% match score, Grade B evidence); and (2) Distributed Vernacular "
                    "Digital Tasking Hubs with integrated childcare vouchers (84.1% match score, Grade A evidence). Structured implementation "
                    "proposals have been registered and submitted to governance review."
                )
            },
            {
                "id": "scenario_simulation",
                "title": "6. Five-Year Forward Policy Projections (2027-2031)",
                "content": (
                    "Three comparative scenarios were modeled: Status Quo (projected 2031 rate: 25.4%), Moderate Targeted (20.4%, requiring "
                    "INR 14.5 Cr), and Expanded Comprehensive (14.8%, requiring INR 38.0 Cr). Multi-way sensitivity analysis demonstrates "
                    "that intervention success is heavily bounded by completion fidelity rather than initial nominal enrollment."
                )
            },
            {
                "id": "limitations",
                "title": "7. Research Integrity & Methodological Limitations",
                "content": (
                    "CRITICAL NOTICE: All quantitative findings in this report originate from the platform's synthetic demonstration "
                    "engine calibrated to plausible Indian labor market parameters. They do not represent real-world individual or district "
                    "statistics. Parametric forward projections reflect stated accounting assumptions and must not be interpreted as "
                    "empirically established causal treatment effects."
                )
            }
        ]
    }
]

def list_reports() -> List[Dict[str, Any]]:
    """Retrieve catalog of generated research reports."""
    return [
        {
            "id": r["id"],
            "title": r["title"],
            "subtitle": r["subtitle"],
            "author": r["author"],
            "date": r["date"],
            "dataset_name": r["dataset_name"],
            "is_synthetic": r["is_synthetic"],
            "sections_count": len(r["sections"])
        }
        for r in REPORT_TEMPLATES
    ]

def get_report_by_id(report_id: str) -> Optional[Dict[str, Any]]:
    """Retrieve full report content by ID."""
    for r in REPORT_TEMPLATES:
        if r["id"] == report_id:
            return r
    return None

def generate_csv_export(data_rows: List[Dict[str, Any]], fieldnames: Optional[List[str]] = None) -> str:
    """Generate RFC 4180 compliant CSV string from record dictionaries."""
    if not data_rows:
        return ""
    if not fieldnames:
        fieldnames = list(data_rows[0].keys())
        
    output = io.StringIO()
    writer = csv.DictWriter(output, fieldnames=fieldnames, extrasaction='ignore')
    writer.writeheader()
    for row in data_rows:
        writer.writerow(row)
    return output.getvalue()
