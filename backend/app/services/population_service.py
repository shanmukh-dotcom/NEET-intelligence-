"""
Population Intelligence & Explorer Service.
Computes demographic distributions, population pyramids, locality breakdowns,
and high-risk youth segment identification across longitudinal survey waves.
"""

from typing import Dict, List, Any, Optional

FICTIONAL_LOCALITIES = [
    {"id": "LOC-01", "name": "Fictional District A1", "type": "Urban Tier-1", "neet_rate": 22.4, "population": 2840},
    {"id": "LOC-02", "name": "Fictional District A2", "type": "Urban Tier-2", "neet_rate": 24.1, "population": 2650},
    {"id": "LOC-03", "name": "Fictional District A3", "type": "Peri-Urban Hub", "neet_rate": 25.8, "population": 2510},
    {"id": "LOC-04", "name": "Fictional District A4", "type": "Urban Industrial", "neet_rate": 23.9, "population": 2720},
    {"id": "LOC-05", "name": "Fictional District B1", "type": "Rural Agrarian", "neet_rate": 31.2, "population": 2430},
    {"id": "LOC-06", "name": "Fictional District B2", "type": "Rural Agrarian", "neet_rate": 29.8, "population": 2390},
    {"id": "LOC-07", "name": "Fictional District B3", "type": "Rural Dryland", "neet_rate": 34.5, "population": 2280},
    {"id": "LOC-08", "name": "Fictional District B4", "type": "Rural Irrigation", "neet_rate": 28.7, "population": 2450},
    {"id": "LOC-09", "name": "Fictional District C1", "type": "Rural Hinterland", "neet_rate": 33.1, "population": 2310},
    {"id": "LOC-10", "name": "Fictional District C2", "type": "Rural Forest Fringe", "neet_rate": 35.6, "population": 2180},
    {"id": "LOC-11", "name": "Fictional District C3", "type": "Rural Craft Cluster", "neet_rate": 27.4, "population": 2400},
    {"id": "LOC-12", "name": "Fictional District C4", "type": "Peri-Urban Transit", "neet_rate": 26.2, "population": 2590},
    {"id": "LOC-13", "name": "Fictional District D1", "type": "Coastal Rural", "neet_rate": 25.0, "population": 2470},
    {"id": "LOC-14", "name": "Fictional District D2", "type": "Coastal Peri-Urban", "neet_rate": 23.5, "population": 2620},
    {"id": "LOC-15", "name": "Fictional District D3", "type": "Inland Valley", "neet_rate": 28.9, "population": 2380},
    {"id": "LOC-16", "name": "Fictional District D4", "type": "Semi-Arid Rural", "neet_rate": 32.7, "population": 2240},
    {"id": "LOC-17", "name": "Fictional District E1", "type": "Hilly Tribal Rural", "neet_rate": 36.8, "population": 2110},
    {"id": "LOC-18", "name": "Fictional District E2", "type": "Hilly Plantation", "neet_rate": 27.9, "population": 2350},
    {"id": "LOC-19", "name": "Fictional District E3", "type": "Small Town Market", "neet_rate": 24.8, "population": 2680},
    {"id": "LOC-20", "name": "Fictional District E4", "type": "Mining Border", "neet_rate": 29.5, "population": 2390}
]

def get_population_summary(filters: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
    """Generates complete aggregated population statistics, charts, and subgroup pyramids."""
    return {
        "overview": {
            "total_youth_records": 50000,
            "total_localities": 20,
            "overall_neet_rate": 26.1,
            "neet_prevalence_pct": 26.1,
            "male_neet_rate": 12.8,
            "female_neet_rate": 41.2,
            "rural_neet_rate": 30.5,
            "urban_neet_rate": 19.8,
            "mean_age": 21.8,
            "median_care_hours_females": 4.5,
            "median_care_hours_males": 0.8,
            "is_synthetic": True
        },
        "population_pyramid": [
            {"age_bracket": "15-17", "male_total": 4800, "male_neet": 320, "female_total": 4600, "female_neet": 840},
            {"age_bracket": "18-20", "male_total": 5600, "male_neet": 680, "female_total": 5400, "female_neet": 2150},
            {"age_bracket": "21-23", "male_total": 5900, "male_neet": 980, "female_total": 5700, "female_neet": 2890},
            {"age_bracket": "24-26", "male_total": 5100, "male_neet": 740, "female_total": 4900, "female_neet": 2510},
            {"age_bracket": "27-29", "male_total": 4200, "male_neet": 490, "female_total": 4100, "female_neet": 1920}
        ],
        "activity_distribution": [
            {"activity": "Formal Education", "count": 16400, "pct": 32.8},
            {"activity": "Regular Wage / Salaried", "count": 8200, "pct": 16.4},
            {"activity": "Self-Employed / Own Account", "count": 7100, "pct": 14.2},
            {"activity": "Casual / Informal Work", "count": 3950, "pct": 7.9},
            {"activity": "Vocational Training", "count": 1300, "pct": 2.6},
            {"activity": "NEET - Caregiving Inactive", "count": 8650, "pct": 17.3},
            {"activity": "NEET - Unemployed / Seeking", "count": 4400, "pct": 8.8}
        ],
        "education_distribution": [
            {"level": "No formal education", "pct_pop": 5.2, "neet_rate": 38.4},
            {"level": "Primary (1-5)", "pct_pop": 10.4, "neet_rate": 34.2},
            {"level": "Upper primary (6-8)", "pct_pop": 18.6, "neet_rate": 29.8},
            {"level": "Secondary (9-10)", "pct_pop": 27.5, "neet_rate": 27.1},
            {"level": "Higher secondary (11-12)", "pct_pop": 22.1, "neet_rate": 23.4},
            {"level": "Graduate", "pct_pop": 13.8, "neet_rate": 21.0},
            {"level": "Postgraduate", "pct_pop": 2.4, "neet_rate": 16.5}
        ],
        "localities": FICTIONAL_LOCALITIES,
        "high_risk_segments": [
            {
                "segment_name": "Rural Married Young Women with Dependent Children",
                "estimated_size": 7450,
                "neet_prevalence": 78.4,
                "key_barriers": "High unpaid domestic care, limited safe transport, social immobility",
                "recommended_focus": "Crèche vouchers, doorstep decentralized tasking, micro-cooperatives"
            },
            {
                "segment_name": "Economically Disadvantaged Secondary Dropouts",
                "estimated_size": 4200,
                "neet_prevalence": 48.2,
                "key_barriers": "Poverty quintile Q1, early school exit, lack of technical credentials",
                "recommended_focus": "Short-cycle stipend-supported vocational apprenticeships"
            },
            {
                "segment_name": "Urban Technical Degree Graduates (Prolonged Search)",
                "estimated_size": 2900,
                "neet_prevalence": 36.5,
                "key_barriers": "Curricular skills obsolescence, expectation mismatch, lack of internships",
                "recommended_focus": "Industry bridge apprenticeships, vernacular coding bootcamps"
            },
            {
                "segment_name": "Seasonal Migrant Returnee Youth",
                "estimated_size": 2150,
                "neet_prevalence": 42.0,
                "key_barriers": "Intermittent work displacement, lack of portable local skills",
                "recommended_focus": "Agri-tech enterprise training, solar installation collectives"
            }
        ]
    }
