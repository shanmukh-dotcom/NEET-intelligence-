# NEET Intelligence Platform — REST API Documentation
## API Version: v1.0.0 | Base Path: `/api/v1`

---

## 1. Authentication & Security
- `POST /api/v1/auth/login`: Authenticate user credentials, returns JWT bearer token.
- `POST /api/v1/auth/register`: Register new authorized stakeholder.
- `GET /api/v1/auth/me`: Retrieve current active session and RBAC roles.

---

## 2. Intelligence Overview & Dashboard
- `GET /api/v1/dashboard/overview`: Returns the 14 core overview metrics:
  - Total records analysed (50,000)
  - Localities represented (20)
  - NEET prevalence (overall, by gender, age bracket, sector)
  - Historical trajectory (2021-2026)
  - Activity state partitions
  - High-risk vulnerability segments
  - Live analytical alerts

---

## 3. Data Intelligence & Datasets
- `GET /api/v1/datasets/`: Retrieve list of all registered datasets.
- `GET /api/v1/datasets/{id}`: Detailed dataset profile.
- `GET /api/v1/datasets/{id}/inspect`: Automated schema inspection, recognized variables, and completeness audits.
- `POST /api/v1/datasets/upload`: Ingest new microdata file (CSV, Parquet, XLSX).
- `POST /api/v1/datasets/{id}/harmonise`: Apply harmonisation mapping while preserving raw layer.
- `POST /api/v1/datasets/{id}/validate`: Execute longitudinal consistency and age eligibility audits.
- `DELETE /api/v1/datasets/{id}`: Remove dataset from workspace.

---

## 4. Synthetic Data Generation Engine
- `GET /api/v1/synthetic/presets`: Return pre-configured research scenarios (Scenarios A through G).
- `POST /api/v1/synthetic/generate`: Execute longitudinal cohort generation with Markov transition parameters.
- `GET /api/v1/synthetic/demo-workspace`: Load the 50,000-individual demonstration benchmark cohort.

---

## 5. Population Explorer
- `GET /api/v1/population/summary`: Aggregated population statistics, age-gender pyramid data, and locality breakdowns.

---

## 6. NEET Measurement Engine
- `GET /api/v1/measurement/config`: Retrieve active measurement thresholds and standards.
- `PUT /api/v1/measurement/config`: Update age eligibility, work-hour thresholds, and reference periods.
- `GET /api/v1/measurement/sensitivity`: Sensitivity analysis across 0h, 1h, 15h, 30h work-hour cutoffs.

---

## 7. Prediction Intelligence
- `GET /api/v1/prediction/models`: List all trained predictive models (XGBoost, Random Forest, Logistic, Dynamic Panel).
- `GET /api/v1/prediction/models/{id}`: Retrieve model profile and hyperparameters.
- `GET /api/v1/prediction/models/{id}/results`: Full evaluation suite (confusion matrix, ROC-AUC, PR-AUC, feature importance, subgroup calibration).
- `GET /api/v1/prediction/models/{id}/shap`: TreeSHAP value explanations and feature interaction ranking.
- `POST /api/v1/prediction/train`: Train new model with specified temporal holdout partitions.

---

## 8. Transition Intelligence
- `GET /api/v1/transitions/matrix`: 4x4 Markov transition matrix with demographic filters.
- `GET /api/v1/transitions/persistence`: Longitudinal persistence decomposition (Transitory, Recurrent, Chronic, Never).
- `GET /api/v1/transitions/sequences`: Top modal longitudinal activity sequence trajectories.
- `GET /api/v1/transitions/survival`: Kaplan-Meier survival curves for time-to-NEET-exit hazards.

---

## 9. Opportunity Intelligence & Population Matching
- `GET /api/v1/opportunities/library`: Catalog of structured, evidence-graded livelihood pathways.
- `GET /api/v1/opportunities/{id}`: Detailed opportunity profile.
- `POST /api/v1/opportunities/match`: Transparent multi-factor similarity matching for target population.

---

## 10. Intervention Centre & Governance Review
- `GET /api/v1/interventions/`: List all structured policy proposals.
- `GET /api/v1/interventions/{id}`: Retrieve full proposal dossier.
- `POST /api/v1/interventions/`: Register new proposal with coverage arithmetic.
- `PUT /api/v1/interventions/{id}/approve`: Governance approval endpoint (Draft → Proposed → Under Review → Approved / Rejected).

---

## 11. Scenario Simulator
- `GET /api/v1/scenarios/`: Return canonical scenario configurations.
- `POST /api/v1/scenarios/simulate`: Execute live 2021-2031 interactive projection.
- `GET /api/v1/scenarios/compare`: Side-by-side comparison of Baseline, Moderate, and Expanded scenarios with sensitivity grid.

---

## 12. AI Research Assistant: 'Ask NEET Intelligence'
- `POST /api/v1/ai/ask`: Natural-language question answering strictly backed by verified empirical computation.

---

## 13. Research Reports & Evidence Registry
- `GET /api/v1/reports/`: Retrieve research reports catalog.
- `GET /api/v1/reports/{id}`: Read full academic research dossier.
- `GET /api/v1/reports/{id}/download-csv`: Download tabular report data as CSV.
- `GET /api/v1/evidence/registry`: Retrieve immutable evidence audit records across Descriptive, Predictive, Comparative, and Causal tiers.
