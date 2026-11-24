# NEET Intelligence Platform
## An AI-Powered Framework for Youth NEET Prediction, Transition Analysis, Opportunity Discovery and Evidence-Based Intervention in India

---

### Research Foundation
Originated from the registered research project:
**"From NEET Status to NEET Persistence"**
Examining longitudinal microdata evidence and survey comparability across:
1. Periodic Labour Force Survey (**PLFS**)
2. India Human Development Survey (**IHDS**)
3. Understanding the Lives of Adolescents and Young Adults (**UDAYA**)
4. Young Lives India
5. Institute for Human Development (**IHD**) Research

---

## 1. What does NEET mean?
In this research and platform, **NEET** means:
> **Not in Employment, Education, or Training.**

It refers to young people who are not employed, are not participating in education, and are not participating in training according to the relevant measurement definition. It is a multidimensional socioeconomic and labour-market issue, influenced by households, institutions, gender care norms, economic conditions, and local geographic opportunities.

---

## 2. Core Intelligence Capabilities

The platform combines four interconnected systems:

### 1. NEET Prediction Intelligence
Identifies population groups with characteristics associated with increased NEET entry and chronic persistence using:
- Regularized Logistic Regression (ElasticNet)
- Random Forest Ensembles
- Gradient Boosted Decision Trees (XGBoost) with **TreeSHAP** attribution
- **Dynamic Random-Effects Probit** panel model with lagged dependent variables:
  $$P(y_{it} = 1 \mid \dots) = \Phi(\alpha y_{i,t-1} + \gamma z_i + \beta x_{i,t-1} + c_i)$$

### 2. Transition Intelligence
Analyzes youth movement across four primary states (**Education**, **Employment**, **Training**, **NEET**):
- First-order Markovian transition probability matrices
- Decomposition of transitory vs. recurrent vs. chronic multi-year persistence
- Sequence analysis of modal 6-wave life-course trajectories
- Kaplan-Meier survival curves for time-to-NEET-exit

### 3. Opportunity Intelligence
Identifies promising pathways associated with successful transitions and discovers populations that may benefit from comparable opportunities:
- Structured catalog of evidence-graded livelihood pathways (Grades A, B, C)
- Multi-factor transparent population similarity matching (demographic, rurality, economic, care burden, skills)
- Required local adaptation guidelines

### 4. Intervention Intelligence & Policy Simulator
Translates analytical findings into structured policy proposals and interactive forward projections:
- Coverage & arithmetic accounting for eligible youth cohorts
- Governance review workflow (Draft → Proposed → Under Review → Approved / Rejected)
- **2021–2031 Timeline Simulator** separating observed historical records (2021–2026) from assumption-driven scenarios (2027–2031)
- Multi-way sensitivity analysis matrices

---

## 3. Technology Stack & Architecture

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS, Recharts, Lucide Icons, Radix UI primitives
- **Backend**: Python FastAPI, SQLAlchemy 2.0 ORM, Pydantic v2, Scikit-Learn, XGBoost, Statsmodels, SQLite
- **Data Layers**: 3-layer preservation (Raw Data → Harmonised Representation → Analytical Layer)
- **Demonstration Workspace**: Calibrated synthetic benchmark panel of 50,000 youth across 20 representative fictional districts over 6 waves

---

## 4. Running the Platform

### Running the Frontend
```bash
cd frontend
pnpm install
pnpm run build
pnpm start
# Server opens at http://localhost:3000
```

### Running the FastAPI Backend
```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
# API docs available at http://localhost:8000/docs
```

---

## 5. Screen & Module Directory

1. **Overview Dashboard** (`/`): High-level intelligence overview, trends, high-risk segments, and alerts.
2. **Data Intelligence** (`/data-intelligence`): Ingestion, schema inspection, variable mapping, validation, and comparability framework.
3. **Synthetic Generator** (`/synthetic-generator`): Microdata generator with Scenarios A through G presets and Markov controls.
4. **Population Explorer** (`/population-explorer`): Age-gender pyramid, 20 fictional localities, and education gradient.
5. **NEET Prediction** (`/neet-prediction`): Model evaluation, confusion matrix, ROC-AUC, PR-AUC, and TreeSHAP waterfall values.
6. **Transition Intelligence** (`/transition-intelligence`): 4x4 Markov transition matrices, persistence categories, and survival curves.
7. **Opportunity Discovery** (`/opportunity-discovery`): Pathway library and multi-factor similarity matching.
8. **Intervention Centre** (`/intervention-centre`): Structured proposals, component accounting, and governance reviews.
9. **Scenario Simulator** (`/scenario-simulator`): Interactive 2021–2031 timeline simulator and 3-scenario comparisons.
10. **Ask NEET Assistant** (`/ai-assistant`): Evidence-grounded natural-language assistant backed by computation.
11. **Research Reports** (`/research-reports`): Academic dossiers and CSV/TXT export engines.
12. **Governance & Settings** (`/settings`): RBAC roles, measurement defaults, and audit ledger.

---

## 6. Research Integrity Notice
> [!IMPORTANT]
> All figures in demonstration mode originate from calibrated synthetic youth cohorts. They do not represent official Indian government statistics. In accordance with ethical AI standards, risk scores must never be used to gate or deny individual benefits.
