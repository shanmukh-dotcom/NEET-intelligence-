import { API_BASE_URL } from "./constants";
import { DEMO_OVERVIEW } from "./demo-data";

/**
 * Universal fetch wrapper with error handling and fallback support.
 */
async function fetchFromApi<T>(
  endpoint: string,
  options?: RequestInit,
  fallback?: T
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;
  try {
    const res = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(options?.headers || {}),
      },
    });

    if (!res.ok) {
      throw new Error(`API error: ${res.status} ${res.statusText}`);
    }

    return await res.json();
  } catch (err) {
    if (fallback !== undefined) {
      console.warn(`[API Client] Falling back to demo data for ${endpoint}:`, err);
      return fallback;
    }
    throw err;
  }
}

// -------------------------------------------------------------
// 1. Dashboard & Overview
// -------------------------------------------------------------
export async function getDashboardOverview() {
  const fallback = {
    total_records: DEMO_OVERVIEW.metrics.total_youth_records,
    overall_neet_rate: DEMO_OVERVIEW.metrics.neet_prevalence_pct,
    female_neet_rate: DEMO_OVERVIEW.metrics.female_neet_rate,
    male_neet_rate: DEMO_OVERVIEW.metrics.male_neet_rate,
    rural_neet_rate: DEMO_OVERVIEW.metrics.rural_neet_rate,
    urban_neet_rate: DEMO_OVERVIEW.metrics.urban_neet_rate,
    localities_count: DEMO_OVERVIEW.metrics.total_localities,
    historical_trajectory: DEMO_OVERVIEW.historical_trend,
    activity_partition: DEMO_OVERVIEW.activity_distribution,
    vulnerable_segments: DEMO_OVERVIEW.high_risk_segments,
  };

  return fetchFromApi("/dashboard/overview", { method: "GET" }, fallback);
}

// -------------------------------------------------------------
// 2. Synthetic Microdata Generator
// -------------------------------------------------------------
export interface SyntheticGenerationConfig {
  country?: string;
  state?: string;
  district?: string;
  localities_count?: number;
  population_size: number;
  age_min: number;
  age_max: number;
  female_ratio: number;
  rural_ratio: number;
  base_neet_rate: number;
  waves_count: number;
  missingness_rate?: number;
  random_seed?: number;
  scenario_preset?: string;
}

export async function getSyntheticPresets() {
  return fetchFromApi<{ presets: Array<{ id: string; name: string; description: string; [key: string]: any }> }>(
    "/synthetic/presets",
    { method: "GET" },
    { presets: [] }
  );
}

export async function generateSyntheticData(config: SyntheticGenerationConfig) {
  return fetchFromApi(
    "/synthetic/generate",
    {
      method: "POST",
      body: JSON.stringify(config),
    }
  );
}

// -------------------------------------------------------------
// 3. NEET Prediction & ML Models
// -------------------------------------------------------------
export async function getPredictionModels() {
  return fetchFromApi<{ models: any[] }>("/prediction/models", { method: "GET" });
}

export async function getModelEvaluation(modelId: string) {
  return fetchFromApi(`/prediction/models/${modelId}/results`, { method: "GET" });
}

export async function getModelShapValues(modelId: string) {
  return fetchFromApi(`/prediction/models/${modelId}/shap`, { method: "GET" });
}

export async function trainPredictionModel(payload: {
  model_type: string;
  target_variable?: string;
  dataset_id?: string;
  train_split?: number;
}) {
  return fetchFromApi("/prediction/train", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function getDynamicProbitEstimates() {
  return fetchFromApi("/prediction/dynamic-probit", { method: "GET" });
}

// -------------------------------------------------------------
// 4. Transition Intelligence
// -------------------------------------------------------------
export async function getTransitionMatrix(filters?: Record<string, any>) {
  const query = filters ? `?${new URLSearchParams(filters).toString()}` : "";
  return fetchFromApi(`/transitions/matrix${query}`, { method: "GET" });
}

export async function getPersistenceBreakdown() {
  return fetchFromApi("/transitions/persistence", { method: "GET" });
}

export async function getSurvivalCurves() {
  return fetchFromApi("/transitions/survival", { method: "GET" });
}

// -------------------------------------------------------------
// 5. Opportunity Discovery & Matching
// -------------------------------------------------------------
export async function getOpportunityCatalog(category?: string, grade?: string) {
  const params = new URLSearchParams();
  if (category) params.set("category", category);
  if (grade) params.set("grade", grade);
  const q = params.toString() ? `?${params.toString()}` : "";
  return fetchFromApi<{ opportunities: any[] }>(`/opportunities/library${q}`, { method: "GET" });
}

export async function matchPopulationToOpportunities(profile: {
  locality_name?: string;
  rural_share: number;
  female_share: number;
  mean_age: number;
  low_income_share: number;
  unpaid_care_intensity: string;
  education_cluster: string;
}) {
  return fetchFromApi("/opportunities/match", {
    method: "POST",
    body: JSON.stringify(profile),
  });
}

// -------------------------------------------------------------
// 6. Scenario Timeline Simulator
// -------------------------------------------------------------
export async function getScenarioPresets() {
  return fetchFromApi("/scenarios/", { method: "GET" });
}

export async function simulatePolicyTimeline(params: {
  name?: string;
  programme_coverage: number;
  participation_rate: number;
  completion_rate: number;
  transition_assumption: number;
  investment_cr: number;
  care_support_included: boolean;
  initial_population?: number;
}) {
  return fetchFromApi("/scenarios/simulate", {
    method: "POST",
    body: JSON.stringify(params),
  });
}

// -------------------------------------------------------------
// 7. Contextual AI Research Assistant
// -------------------------------------------------------------
export async function queryResearchAssistant(query: string, context?: string) {
  return fetchFromApi("/ai/ask", {
    method: "POST",
    body: JSON.stringify({ query, context }),
  });
}

// -------------------------------------------------------------
// 8. Research Reports & Dossiers
// -------------------------------------------------------------
export async function getReportsList() {
  return fetchFromApi("/reports/", { method: "GET" });
}

export async function getReportById(reportId: string = "REP-FULL-01") {
  return fetchFromApi(`/reports/${reportId}`, { method: "GET" });
}

export function getReportCsvDownloadUrl(reportId: string = "REP-FULL-01") {
  return `${API_BASE_URL}/reports/${reportId}/download-csv`;
}
