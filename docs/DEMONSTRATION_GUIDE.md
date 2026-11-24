# NEET Intelligence Platform — Demonstration Guide
## Step-by-Step Walkthrough for Research Supervisors & Policy Stakeholders

This guide details how an independent evaluator or research supervisor can demonstrate the complete research intelligence workflow from start to finish.

---

## The 10-Step Guided Demonstration Journey

### Step 1: Open the Platform & Inspect Overview Dashboard
- **Route**: `/`
- **What to observe**:
  - Top summary cards: 50,000 synthetic youth records across 20 representative localities.
  - Overall NEET rate: 26.1% (Wave 2026), down from 28.4% in 2021.
  - Stark gender gradient: 41.2% female NEET vs. 12.8% male NEET (28.4 percentage point gap).
  - Activity partition: Education (32.8%), Regular Employment (16.4%), Self-Employed (14.2%), Casual (7.9%), Vocational Training (2.6%), Caregiving Inactive (17.3%), Seeking Unemployed (8.8%).
  - Priority high-risk segments and live analytical alerts.

### Step 2: Data Intelligence & Survey Comparability
- **Route**: `/data-intelligence`
- **What to demonstrate**:
  - 3 registered microdata sources: PLFS Calibrated Panel, IHDS Longitudinal Panel, and UDAYA Transition Cohort.
  - Click on any dataset to inspect its 3-tier preservation guarantee: Raw Microdata (read-only) → Harmonised Representation → Analytical Layer.
  - Review automated variable concept mapping (Person ID, Age, Gender, Sector, Activity, Care Hours).
  - Review the **Comparability Framework**: Explains why standard ILO NEET measures are comparable, why care hours are conditionally comparable, and why asset PCAs between PLFS and IHDS must *never* be pooled into a merged index.

### Step 3: Calibrate Synthetic Data & Markov Presets
- **Route**: `/synthetic-generator`
- **What to demonstrate**:
  - Review predefined research scenarios (Scenarios A through G).
  - Select **Scenario A** (Rural Women with heavy caregiving burden) or **Scenario B** (Urban Educated Unemployment).
  - Adjust the population slider, female ratio, and rural share.
  - Click **"Generate Cohort"** to watch the multi-wave Markov simulation generate individual life-course histories (e.g. `SYN-00012` transitioning through Education → NEET → Training → Employment).
  - Verify every record is strictly tagged `is_synthetic=True`.

### Step 4: Explore Demographic Pyramids & Geographic Localities
- **Route**: `/population-explorer`
- **What to demonstrate**:
  - Interactive population pyramid showing male vs female youth across 5 age brackets (15-17, 18-20, 21-23, 24-26, 27-29).
  - Educational attainment gradient: No formal schooling (38.4% NEET) down to Postgraduate (16.5% NEET).
  - Filter across all **20 Fictional Districts** (Districts A1–E4). Observe that rural dryland and forest fringe districts (B3, C2, E1) have the highest care hours (up to 5.6 hrs/day) and NEET rates (>34%).

### Step 5: Evaluate Machine Learning Predictions & TreeSHAP Explanations
- **Route**: `/neet-prediction`
- **What to demonstrate**:
  - Four trained model architectures: XGBoost, Random Forest, Regularized Logistic Regression, and the registered research Dynamic Random-Effects Probit equation:
    $$P(y_{it} = 1 \mid \dots) = \Phi(\alpha y_{i,t-1} + \gamma z_i + \beta x_{i,t-1} + c_i)$$
  - Confusion matrix evaluated on 9,228 holdout test records.
  - Core metrics: Accuracy (81.4%), Precision (77.1%), Recall (74.8%), F1 (0.759), ROC-AUC (0.842).
  - TreeSHAP feature importance ranking: Unpaid Daily Care Hours (>4h) is the top predictor (+0.42 mean |SHAP|), followed by Female Gender (+0.38) and Wealth Q1 (+0.29), while Vocational Training is the strongest protective factor (-0.31).
  - Ethical notice: Risk probabilities are used for community resource targeting, never to restrict individual benefits.

### Step 6: Transition Intelligence & Persistence Dynamics
- **Route**: `/transition-intelligence`
- **What to demonstrate**:
  - Interactive 4x4 Markov transition matrix. Observe that NEET-to-NEET persistence is 70.2% overall, but rises to 78.2% for rural females.
  - Key finding: Completing vocational training triples subsequent employment transition probability (45.2% vs 15.1%).
  - Persistence categories: Transitory (18.2%), Recurrent churning (12.4%), Chronic persistent (9.0%), and Never NEET (60.4%).
  - Sequence analysis: Top modal 6-wave paths.
  - Kaplan-Meier duration curves: Probability of remaining in NEET over time elapsed.

### Step 7: Discover Pathways & Match Populations
- **Route**: `/opportunity-discovery`
- **What to demonstrate**:
  - Catalog of 6 structured pathway opportunities (e.g. Community Food Processing Cooperative, Distributed Rural BPO Hub, Solar Micro-Grid Maintenance) with evidence grades (A, B, C).
  - Go to **Population Similarity Matching** tab.
  - Set target population parameters (e.g. 80% Rural, 85% Female, High Care Burden).
  - Click **"Execute Multi-Factor Matching"**.
  - Review the match scores (88.4% match for Food Processing Cooperative), dimensional breakdowns (geographic, gender, economic, care), key similarities, differences, and required local adaptations.

### Step 8: Policy Proposals & Governance Approval Workflows
- **Route**: `/intervention-centre`
- **What to demonstrate**:
  - Detailed proposal dossiers (e.g. `INT-001`: Decentralized Care Support & Vernacular Digital Tasking).
  - Review structural problem, empirical model evidence, implementation components, resource budget, and partners.
  - Transparent arithmetic accounting: Eligible (2,400) × Coverage (45%) × Completion (78%) × Transition (42%) = 354 projected exits.
  - Execute governance review actions: Click **"Formal Approval"** or **"Request Amendments"** and observe live state updates.

### Step 9: Interactive 2021–2031 Policy Simulator
- **Route**: `/scenario-simulator`
- **What to demonstrate**:
  - 11-year timeline comparing historical observations (2021–2026, solid line) with projected policy futures (2027–2031, dashed line).
  - Adjust the live sliders: Target Coverage (45%), Completion (78%), Transition Assumption (42%), Investment Envelope (₹18.5 Cr), and toggle Childcare Co-Provision.
  - Watch the green "Your Custom Scenario" line update dynamically.
  - Side-by-side comparison table: Baseline Status Quo (2031 rate: 25.4%), Moderate Targeted (20.4%), and Expanded Comprehensive (14.8% with 8,420 net cumulative exits).

### Step 10: Generate Research Dossiers & Exports
- **Route**: `/research-reports`
- **What to demonstrate**:
  - Peer-reviewed academic dossier reader: Executive summary, methodology, prevalence, transition dynamics, opportunities, scenarios, and documented limitations.
  - Click **"Export CSV Data"** to download reproducible tabular data.
  - Click **"Download Full Dossier"** to export the structured publication document.
