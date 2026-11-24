# NEET Intelligence Platform — Research Methodology & Theoretical Framework
## Project Title: From NEET Status to NEET Persistence (India Youth Studies)

---

## 1. Research Problem & Theoretical Distinction
The NEET rate (**Not in Employment, Education, or Training**) is widely reported as a single cross-sectional headline statistic. However, cross-sectional prevalence cannot distinguish:
- **Transitory NEET**: Young people experiencing brief frictional search between educational completion and employment.
- **Recurrent NEET**: Youth churning between precarious informal jobs and spells of involuntary inactivity.
- **Chronic Persistent NEET**: Prolonged multi-year labor market exclusion driven by structural barriers (unpaid caregiving, lack of transport, geographic isolation).

The platform was engineered to implement the conceptual distinctions established in:
> *Beyond NEET Prevalence: A Critical Survey of Youth NEET Measurement, Longitudinal Evidence, and Data Gaps in India.*

---

## 2. Indian Data Sources & Survey Comparability

The research examines five major Indian microdata sources:
1. **Periodic Labour Force Survey (PLFS)** (NSSO / MoSPI)
2. **India Human Development Survey (IHDS)** (NCAER / University of Maryland)
3. **Understanding the Lives of Adolescents and Young Adults (UDAYA)** (Population Council)
4. **Young Lives India**
5. **Institute for Human Development (IHD)** Delhi-Ranchi longitudinal research

### Strict Comparability Rules:
- **Comparable**: Standard ILO activity definitions (0 hours worked in reference week, not enrolled in schooling, not in formal training).
- **Conditionally Comparable**: Daily unpaid care hours (PLFS captures principal activity codes; UDAYA captures recall time diaries). Comparison requires harmonized survey weights.
- **Not Comparable**: Household wealth index (PLFS uses monthly per-capita consumption expenditure; IHDS/UDAYA use durable asset rosters via Principal Component Analysis). These measures must *never* be pooled into a merged longitudinal dataset.

---

## 3. Econometric Panel Specification: Proposed Research Model

To separate true state dependence (scarring) from unobserved individual heterogeneity, the registered model implements a **Dynamic Random-Effects Probit** formulation:

$$P(y_{it} = 1 \mid y_{i,t-1}, x_{i,t-1}, z_i, c_i) = \Phi(\alpha y_{i,t-1} + \gamma z_i + \beta x_{i,t-1} + c_i)$$

Where:
- $y_{it}$: Youth NEET status at wave $t$ ($1 = \text{NEET}, 0 = \text{otherwise}$)
- $y_{i,t-1}$: Lagged NEET status at wave $t-1$
- $\alpha$: State dependence coefficient (measures genuine scarring vs spurious persistence)
- $z_i$: Time-invariant explanatory covariates (gender, caste category, initial birthplace locality)
- $x_{i,t-1}$: Time-varying covariates (daily unpaid domestic care hours, household income quintile, marital status, local agricultural shocks)
- $c_i$: Unobserved individual-specific latent heterogeneity
- $\Phi(\cdot)$: Standard normal cumulative distribution function

---

## 4. Machine Learning & Explainability Pipeline

- **Supervised Classifiers**: Evaluated on strict temporal holdout sets (80% training on Waves 1-4, 20% test on Waves 5-6).
- **Algorithms**: Regularized ElasticNet Logistic Regression, Random Forest (100 estimators), and Extreme Gradient Boosting (XGBoost).
- **Explainability**: **TreeSHAP** (Shapley Additive Explanations) decomposes non-linear feature interactions and directional risk pushes:
  $$\phi_i(x) = \sum_{S \subseteq F \setminus \{i\}} \frac{|S|!(|F| - |S| - 1)!}{|F|!} [f_x(S \cup \{i\}) - f_x(S)]$$
- **Fairness & Calibration**: Subgroup performance calibration across gender and rural/urban strata to prevent disparate impact.

---

## 5. Opportunity Discovery & Population Matching Formula

The platform calculates a transparent multi-factor Euclidean similarity index $S(P_s, P_t) \in [0, 100]$:

$$S(P_s, P_t) = 100 \times \left[ 1 - \sum_{k} w_k |d_{s,k} - d_{t,k}| \right]$$

Across dimensions:
1. Rurality proportion ($w_1 = 0.25$)
2. Female share ($w_2 = 0.25$)
3. Household low-income concentration ($w_3 = 0.20$)
4. Caregiving intensity score ($w_4 = 0.15$)
5. Mean age proximity ($w_5 = 0.15$)

---

## 6. Mathematical Integrity of Scenario Simulations

The scenario simulator implements cohort flow accounting over an 11-year timeline (2021–2031):
- **2021–2026**: Verified historical observation records.
- **2027–2031**: Parametric assumption projections.

For each projected year $t \in [2027, 2031]$:
$$\text{Projected Transitions}_t = \text{Eligible NEET Cohort}_t \times \text{Coverage} \times \text{Participation} \times \text{Completion} \times \text{Transition Assumption} \times R_t$$

Where $R_t$ represents the intervention maturity ramp-up factor.
> [!NOTE]
> Calculations are clearly marked as assumption-driven accounting and are never conflated with verified experimental treatment effects.
