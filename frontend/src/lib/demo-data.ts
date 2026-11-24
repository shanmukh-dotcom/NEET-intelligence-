export const DEMO_OVERVIEW = {
  metrics: {
    total_youth_records: 50000,
    total_localities: 20,
    neet_prevalence_pct: 26.1,
    female_neet_rate: 41.2,
    male_neet_rate: 12.8,
    rural_neet_rate: 30.5,
    urban_neet_rate: 19.8,
    active_datasets: 3,
    trained_models: 4,
    best_model_auc: 0.842
  },
  historical_trend: [
    { year: 2021, overall_rate: 28.4, female_rate: 44.2, male_rate: 14.1, rural_rate: 33.1, urban_rate: 21.6 },
    { year: 2022, overall_rate: 27.9, female_rate: 43.5, male_rate: 13.7, rural_rate: 32.5, urban_rate: 21.2 },
    { year: 2023, overall_rate: 27.3, female_rate: 42.8, male_rate: 13.3, rural_rate: 31.9, urban_rate: 20.7 },
    { year: 2024, overall_rate: 26.8, female_rate: 42.1, male_rate: 13.0, rural_rate: 31.3, urban_rate: 20.3 },
    { year: 2025, overall_rate: 26.5, female_rate: 41.6, male_rate: 12.9, rural_rate: 30.9, urban_rate: 20.0 },
    { year: 2026, overall_rate: 26.1, female_rate: 41.2, male_rate: 12.8, rural_rate: 30.5, urban_rate: 19.8 }
  ],
  by_gender: [
    { gender: "Female", neet_rate: 41.2, share_of_neet_pool: 76.5, primary_factor: "Unpaid domestic care (>4 hrs daily)" },
    { gender: "Male", neet_rate: 12.8, share_of_neet_pool: 23.5, primary_factor: "Prolonged competitive exam search & casual underemployment" }
  ],
  by_age_group: [
    { age_group: "15-17", neet_rate: 12.3, status: "Secondary school retention phase" },
    { age_group: "18-20", neet_rate: 25.7, status: "Post-secondary transition window" },
    { age_group: "21-23", neet_rate: 33.4, status: "Peak graduate search and marriage entry" },
    { age_group: "24-26", neet_rate: 31.9, status: "Early household formation & persistence" },
    { age_group: "27-29", neet_rate: 28.5, status: "Chronic inactivity or informal settling" }
  ],
  by_sector: [
    { sector: "Rural", neet_rate: 30.5, population_share: 62.4, key_challenge: "Agrarian underemployment & geographic isolation" },
    { sector: "Urban", neet_rate: 19.8, population_share: 37.6, key_challenge: "Educated unemployment & job-skill mismatch" }
  ],
  activity_distribution: [
    { activity: "Formal Education", count: 16400, pct: 32.8, color: "#3b82f6" },
    { activity: "Regular Wage Employment", count: 8200, pct: 16.4, color: "#10b981" },
    { activity: "Self-Employed / Own Account", count: 7100, pct: 14.2, color: "#14b8a6" },
    { activity: "Casual / Informal Work", count: 3950, pct: 7.9, color: "#f59e0b" },
    { activity: "Vocational Training", count: 1300, pct: 2.6, color: "#8b5cf6" },
    { activity: "NEET - Caregiving Inactive", count: 8650, pct: 17.3, color: "#f43f5e" },
    { activity: "NEET - Unemployed / Seeking", count: 4400, pct: 8.8, color: "#e11d48" }
  ],
  high_risk_segments: [
    {
      segment_name: "Rural Married Young Women with Dependent Children",
      estimated_size: 7450,
      neet_prevalence: 78.4,
      key_barriers: "High unpaid domestic care, limited safe transport, social immobility",
      recommended_focus: "Crèche vouchers, doorstep decentralized tasking, micro-cooperatives"
    },
    {
      segment_name: "Economically Disadvantaged Secondary Dropouts",
      estimated_size: 4200,
      neet_prevalence: 48.2,
      key_barriers: "Poverty quintile Q1, early school exit, lack of technical credentials",
      recommended_focus: "Short-cycle stipend-supported vocational apprenticeships"
    },
    {
      segment_name: "Urban Technical Degree Graduates (Prolonged Search)",
      estimated_size: 2900,
      neet_prevalence: 36.5,
      key_barriers: "Curricular skills obsolescence, expectation mismatch, lack of internships",
      recommended_focus: "Industry bridge apprenticeships, vernacular coding bootcamps"
    },
    {
      segment_name: "Seasonal Migrant Returnee Youth",
      estimated_size: 2150,
      neet_prevalence: 42.0,
      key_barriers: "Intermittent work displacement, lack of portable local skills",
      recommended_focus: "Agri-tech enterprise training, solar installation collectives"
    }
  ],
  analytical_alerts: [
    {
      id: "ALT-01",
      severity: "Warning",
      title: "Severe Care Burden Clustering in District B3 & C2",
      message: "Rural young women with >5 daily care hours exhibit 81.2% NEET persistence. Childcare co-provision is urgently needed before skilling.",
      timestamp: "2026-11-08T10:15:00Z"
    },
    {
      id: "ALT-02",
      severity: "Info",
      title: "High Skilling Catalytic Multiplier Verified",
      message: "Vocational training completion triples subsequent wave formal employment probability (45.2% vs 15.1%).",
      timestamp: "2026-11-05T14:30:00Z"
    },
    {
      id: "ALT-03",
      severity: "Notice",
      title: "Simulation Scenario Updated: Expanded Saturation",
      message: "Projected 2031 NEET rate reduced to 14.8% with 8,420 net cumulative exits under full 65% coverage package.",
      timestamp: "2026-11-02T11:00:00Z"
    }
  ]
};

export const DEMO_LOCALITIES = [
  { id: "LOC-01", name: "Fictional District A1", type: "Urban Tier-1", neet_rate: 22.4, population: 2840, care_hours: 1.8 },
  { id: "LOC-02", name: "Fictional District A2", type: "Urban Tier-2", neet_rate: 24.1, population: 2650, care_hours: 2.1 },
  { id: "LOC-03", name: "Fictional District A3", type: "Peri-Urban Hub", neet_rate: 25.8, population: 2510, care_hours: 2.8 },
  { id: "LOC-04", name: "Fictional District A4", type: "Urban Industrial", neet_rate: 23.9, population: 2720, care_hours: 2.0 },
  { id: "LOC-05", name: "Fictional District B1", type: "Rural Agrarian", neet_rate: 31.2, population: 2430, care_hours: 4.2 },
  { id: "LOC-06", name: "Fictional District B2", type: "Rural Agrarian", neet_rate: 29.8, population: 2390, care_hours: 4.0 },
  { id: "LOC-07", name: "Fictional District B3", type: "Rural Dryland", neet_rate: 34.5, population: 2280, care_hours: 5.1 },
  { id: "LOC-08", name: "Fictional District B4", type: "Rural Irrigation", neet_rate: 28.7, population: 2450, care_hours: 3.8 },
  { id: "LOC-09", name: "Fictional District C1", type: "Rural Hinterland", neet_rate: 33.1, population: 2310, care_hours: 4.6 },
  { id: "LOC-10", name: "Fictional District C2", type: "Rural Forest Fringe", neet_rate: 35.6, population: 2180, care_hours: 5.4 },
  { id: "LOC-11", name: "Fictional District C3", type: "Rural Craft Cluster", neet_rate: 27.4, population: 2400, care_hours: 3.5 },
  { id: "LOC-12", name: "Fictional District C4", type: "Peri-Urban Transit", neet_rate: 26.2, population: 2590, care_hours: 2.9 },
  { id: "LOC-13", name: "Fictional District D1", type: "Coastal Rural", neet_rate: 25.0, population: 2470, care_hours: 3.2 },
  { id: "LOC-14", name: "Fictional District D2", type: "Coastal Peri-Urban", neet_rate: 23.5, population: 2620, care_hours: 2.4 },
  { id: "LOC-15", name: "Fictional District D3", type: "Inland Valley", neet_rate: 28.9, population: 2380, care_hours: 3.9 },
  { id: "LOC-16", name: "Fictional District D4", type: "Semi-Arid Rural", neet_rate: 32.7, population: 2240, care_hours: 4.7 },
  { id: "LOC-17", name: "Fictional District E1", type: "Hilly Tribal Rural", neet_rate: 36.8, population: 2110, care_hours: 5.6 },
  { id: "LOC-18", name: "Fictional District E2", type: "Hilly Plantation", neet_rate: 27.9, population: 2350, care_hours: 3.6 },
  { id: "LOC-19", name: "Fictional District E3", type: "Small Town Market", neet_rate: 24.8, population: 2680, care_hours: 2.5 },
  { id: "LOC-20", name: "Fictional District E4", type: "Mining Border", neet_rate: 29.5, population: 2390, care_hours: 3.7 }
];

export const DEMO_TRANSITIONS = {
  matrix: [
    { from_state: "Education", to_education: 64.8, to_employment: 15.2, to_training: 9.8, to_neet: 10.2 },
    { from_state: "Employment", to_education: 2.8, to_employment: 80.4, to_training: 4.9, to_neet: 11.9 },
    { from_state: "Training", to_education: 9.5, to_employment: 45.2, to_training: 30.1, to_neet: 15.2 },
    { from_state: "NEET", to_education: 7.6, to_employment: 15.1, to_training: 7.1, to_neet: 70.2 }
  ],
  persistence: [
    { pattern: "Never Observed NEET", count: 25420, percentage: 60.4, color: "#10b981" },
    { pattern: "Transitory NEET (1 wave)", count: 7660, percentage: 18.2, color: "#3b82f6" },
    { pattern: "Recurrent Churning (2-3 waves)", count: 5220, percentage: 12.4, color: "#f59e0b" },
    { pattern: "Chronic Persistent (4+ waves)", count: 3800, percentage: 9.0, color: "#f43f5e" }
  ],
  survival_curve: [
    { wave: 0, General: 1.0, "With Training": 1.0, "Rural Female Care": 1.0 },
    { wave: 1, General: 0.702, "With Training": 0.548, "Rural Female Care": 0.782 },
    { wave: 2, General: 0.521, "With Training": 0.310, "Rural Female Care": 0.654 },
    { wave: 3, General: 0.395, "With Training": 0.185, "Rural Female Care": 0.560 },
    { wave: 4, General: 0.312, "With Training": 0.114, "Rural Female Care": 0.485 },
    { wave: 5, General: 0.254, "With Training": 0.082, "Rural Female Care": 0.428 }
  ]
};

export const DEMO_SCENARIO_COMPARISON = {
  combined_timeline: [
    { year: 2021, Baseline: 28.4, Moderate: 28.4, Expanded: 28.4, is_projected: false },
    { year: 2022, Baseline: 27.9, Moderate: 27.9, Expanded: 27.9, is_projected: false },
    { year: 2023, Baseline: 27.3, Moderate: 27.3, Expanded: 27.3, is_projected: false },
    { year: 2024, Baseline: 26.8, Moderate: 26.8, Expanded: 26.8, is_projected: false },
    { year: 2025, Baseline: 26.5, Moderate: 26.5, Expanded: 26.5, is_projected: false },
    { year: 2026, Baseline: 26.1, Moderate: 26.1, Expanded: 26.1, is_projected: false },
    { year: 2027, Baseline: 25.9, Moderate: 24.8, Expanded: 23.2, is_projected: true },
    { year: 2028, Baseline: 25.8, Moderate: 23.5, Expanded: 20.4, is_projected: true },
    { year: 2029, Baseline: 25.6, Moderate: 22.2, Expanded: 18.1, is_projected: true },
    { year: 2030, Baseline: 25.5, Moderate: 21.2, Expanded: 16.2, is_projected: true },
    { year: 2031, Baseline: 25.4, Moderate: 20.4, Expanded: 14.8, is_projected: true }
  ],
  summary_cards: [
    {
      scenario: "Baseline (Status Quo)",
      rate_2026: 26.1,
      rate_2031: 25.4,
      reduction_pts: 0.7,
      cumulative_exits: 1120,
      investment_cr: 0.0,
      coverage: "5%"
    },
    {
      scenario: "Moderate Targeted",
      rate_2026: 26.1,
      rate_2031: 20.4,
      reduction_pts: 5.7,
      cumulative_exits: 4380,
      investment_cr: 14.5,
      coverage: "35%"
    },
    {
      scenario: "Expanded Comprehensive",
      rate_2026: 26.1,
      rate_2031: 14.8,
      reduction_pts: 11.3,
      cumulative_exits: 8420,
      investment_cr: 38.0,
      coverage: "65%"
    }
  ]
};
