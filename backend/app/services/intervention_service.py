"""
Intervention Intelligence Service.
Translates youth NEET predictive risk and transition patterns into structured,
evidence-based, explainable intervention proposals with approval workflows.

All proposals are research recommendations requiring human governance review.
"""

from typing import Dict, List, Any, Optional
from datetime import datetime
import uuid

# In-memory store for demonstrations
INTERVENTION_REGISTRY: List[Dict[str, Any]] = [
    {
        "id": "INT-001",
        "title": "Decentralized Care Support & Vernacular Digital Tasking Initiative",
        "target_locality": "Fictional District B3 & C2",
        "target_population": "Young rural women (18-24) facing prolonged NEET status (>18 months) and heavy domestic care duties",
        "identified_problem": "Rural young women exhibit 68.4% observed NEET persistence over 3 survey waves, primarily mediated by unpaid domestic care burdens and absence of flexible, safe local work.",
        "supporting_evidence": "Observed transition matrix indicates NEET->NEET persistence of 74% for rural females versus 48% for rural males. Model SHAP values rank unpaid care hours as top positive NEET predictor.",
        "recommended_intervention": "Dual-component package: (1) Community-managed rotating crèche & elder assistance node; (2) Neighborhood solar-powered vernacular digital tasking center with flexible 3-hour shift blocks.",
        "implementation_components": [
            "Establishment of 6 community micro-crèches staffed by certified local care auxiliaries",
            "Deployment of 45 solar-supported workstation terminals across 3 Panchayat Bhavans",
            "Standardized 8-week vernacular data annotation and verification curriculum",
            "Childcare voucher stipend and transportation escort collective"
        ],
        "required_resources": "INR 28.5 Lakhs capital setup; INR 4.2 Lakhs monthly operational support; 6 Master Trainers; 12 Community mobilizers",
        "implementation_partners": [
            "District Rural Development Agency (DRDA)",
            "National Rural Livelihoods Mission (NRLM) State Chapter",
            "Fictional Women's Enterprise Federation",
            "Accredited Digital Services Social Enterprise"
        ],
        "estimated_eligible_population": 2400,
        "targeted_coverage_rate": 0.45,
        "estimated_participants": 1080,
        "assumed_completion_rate": 0.78,
        "expected_transition_rate": 0.42,
        "projected_successful_exits": 354,
        "outcome_indicators": [
            "Observed NEET exit rate at 6, 12, and 24 months post-enrollment",
            "Average monthly individual earnings from verified tasks",
            "Reduction in self-reported caregiving stress index",
            "Secondary enrollment continuation rate"
        ],
        "implementation_risks": [
            "Intermittent broadband connectivity during monsoon season",
            "Potential intra-household resistance to women's economic autonomy",
            "Risk of platform task price deflation without minimum wage floors"
        ],
        "monitoring_strategy": "Quarterly biometric-free digital attendance audit, bi-annual independent household welfare survey, and community social audit committee meetings.",
        "governance_status": "Proposed",
        "approval_history": [
            {"status": "Draft", "updated_at": "2026-09-15T10:00:00Z", "user": "Dr. A. Sharma (Lead Researcher)"},
            {"status": "Proposed", "updated_at": "2026-10-02T14:30:00Z", "user": "Dr. A. Sharma (Lead Researcher)"}
        ],
        "created_at": "2026-09-15T10:00:00Z",
        "is_synthetic": True
    },
    {
        "id": "INT-002",
        "title": "Urban Technical Graduate Transition & Bridge Apprenticeship Sprint",
        "target_locality": "Fictional District A1 & A4",
        "target_population": "Urban educated youth (diploma & graduates, 21-26) experiencing educated NEET transition (>12 months)",
        "identified_problem": "42.1% of technical graduates in urban nodes enter NEET status immediately following academic completion due to acute skill mismatch and absence of structured internship pathways.",
        "supporting_evidence": "Sequence analysis reveals high entry into NEET following education completion. Logistic regression confirms higher secondary and diploma holders have 1.8x odds of prolonged job-search inactivity compared to vocational certificate holders.",
        "recommended_intervention": "14-week industry-embedded bridge apprenticeship combining industry-standard tools, soft skills, and guaranteed interview pipelines with regional manufacturing and green-tech employers.",
        "implementation_components": [
            "Skill-gap diagnostic assessment and personalized learning track assignment",
            "Intensive 6-week hands-on industrial automation / green mobility workshop",
            "8-week paid apprentice placement with 50% state wage co-subsidy",
            "Weekly career mentorship and professional communication labs"
        ],
        "required_resources": "INR 42.0 Lakhs annual grant pool; 3 Advanced Polytechnic Labs; 25 Industry partner Memorandums of Understanding",
        "implementation_partners": [
            "State Skill Development Mission (SSDM)",
            "Confederation of Regional Industries",
            "Government Polytechnic Consortium"
        ],
        "estimated_eligible_population": 3100,
        "targeted_coverage_rate": 0.50,
        "estimated_participants": 1550,
        "assumed_completion_rate": 0.85,
        "expected_transition_rate": 0.58,
        "projected_successful_exits": 764,
        "outcome_indicators": [
            "Full-time formal wage employment placement within 90 days of completion",
            "Median starting wage relative to regional minimum wage standard",
            "Employer satisfaction rating on applied technical competency"
        ],
        "implementation_risks": [
            "Firms failing to convert apprentices to regularized staff",
            "Early dropouts due to competing civil service examination preparation schedules"
        ],
        "monitoring_strategy": "Mandatory employer payroll verification, longitudinal alumni quarterly tracking, and independent randomized verification.",
        "governance_status": "Under Review",
        "approval_history": [
            {"status": "Draft", "updated_at": "2026-08-20T11:00:00Z", "user": "Prof. M. Verma"},
            {"status": "Proposed", "updated_at": "2026-09-01T09:15:00Z", "user": "Prof. M. Verma"},
            {"status": "Under Review", "updated_at": "2026-10-18T16:00:00Z", "user": "Director of Policy Evaluation"}
        ],
        "created_at": "2026-08-20T11:00:00Z",
        "is_synthetic": True
    }
]

def list_interventions(status: Optional[str] = None) -> List[Dict[str, Any]]:
    """Retrieve all structured intervention proposals with optional status filter."""
    if status and status != "All":
        return [i for i in INTERVENTION_REGISTRY if i["governance_status"].lower() == status.lower()]
    return INTERVENTION_REGISTRY

def get_intervention_by_id(intervention_id: str) -> Optional[Dict[str, Any]]:
    """Retrieve detailed intervention proposal by ID."""
    for item in INTERVENTION_REGISTRY:
        if item["id"] == intervention_id:
            return item
    return None

def update_intervention_status(intervention_id: str, new_status: str, user: str, comments: Optional[str] = None) -> Optional[Dict[str, Any]]:
    """Update governance review status (Draft, Proposed, Under Review, Approved, Rejected)."""
    for item in INTERVENTION_REGISTRY:
        if item["id"] == intervention_id:
            item["governance_status"] = new_status
            item["approval_history"].append({
                "status": new_status,
                "updated_at": datetime.utcnow().isoformat() + "Z",
                "user": user,
                "comments": comments or "Status updated through research governance review portal."
            })
            return item
    return None

def create_intervention_proposal(data: Dict[str, Any]) -> Dict[str, Any]:
    """Register a new intervention proposal generated from analytical findings."""
    eligible = data.get("estimated_eligible_population", 1000)
    coverage = data.get("targeted_coverage_rate", 0.40)
    completion = data.get("assumed_completion_rate", 0.75)
    transition = data.get("expected_transition_rate", 0.40)
    
    participants = int(eligible * coverage)
    exits = int(participants * completion * transition)
    
    new_record = {
        "id": f"INT-{str(uuid.uuid4())[:6].upper()}",
        "title": data.get("title", "New Targeted NEET Intervention Proposal"),
        "target_locality": data.get("target_locality", "Target Locality Cluster"),
        "target_population": data.get("target_population", "Identified High-Risk Youth Segment"),
        "identified_problem": data.get("identified_problem", "High observed NEET incidence and barrier concentration."),
        "supporting_evidence": data.get("supporting_evidence", "Derived from demographic segmentation and transition analyses."),
        "recommended_intervention": data.get("recommended_intervention", "Comprehensive skill and pathway facilitation package."),
        "implementation_components": data.get("implementation_components", ["Component 1: Targeted Mobilization", "Component 2: Modular Training"]),
        "required_resources": data.get("required_resources", "Subject to district budget allocation"),
        "implementation_partners": data.get("implementation_partners", ["District Administration", "Local Skill Providers"]),
        "estimated_eligible_population": eligible,
        "targeted_coverage_rate": coverage,
        "estimated_participants": participants,
        "assumed_completion_rate": completion,
        "expected_transition_rate": transition,
        "projected_successful_exits": exits,
        "outcome_indicators": data.get("outcome_indicators", ["NEET status exit at 12 months", "Sustained employment or training"]),
        "implementation_risks": data.get("implementation_risks", ["Budget delay", "Local infrastructure gaps"]),
        "monitoring_strategy": data.get("monitoring_strategy", "Quarterly progress monitoring and third-party impact assessment."),
        "governance_status": "Draft",
        "approval_history": [
            {"status": "Draft", "updated_at": datetime.utcnow().isoformat() + "Z", "user": data.get("author", "Lead Researcher")}
        ],
        "created_at": datetime.utcnow().isoformat() + "Z",
        "is_synthetic": True
    }
    INTERVENTION_REGISTRY.append(new_record)
    return new_record
