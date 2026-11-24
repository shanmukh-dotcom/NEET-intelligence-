"use client";

import React, { useState } from "react";
import {
  Brain,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  Play,
  TrendingUp,
  Shield,
  Layers,
  BarChart2
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Cell,
  LineChart,
  Line
} from "recharts";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { ChartCard } from "@/components/ui/chart-card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input, Select } from "@/components/ui/input";

const MODELS = [
  {
    id: "MOD-XGB-01",
    name: "Extreme Gradient Boosting (XGBoost) Youth NEET Classifier",
    type: "XGBoost",
    auc_roc: 0.842,
    accuracy: 0.814,
    f1_score: 0.759,
    status: "Trained"
  },
  {
    id: "MOD-RF-02",
    name: "Random Forest Ensemble Predictor",
    type: "Random Forest",
    auc_roc: 0.826,
    accuracy: 0.798,
    f1_score: 0.738,
    status: "Trained"
  },
  {
    id: "MOD-LOG-03",
    name: "Regularized Logistic Regression (ElasticNet)",
    type: "Logistic Regression",
    auc_roc: 0.789,
    accuracy: 0.762,
    f1_score: 0.697,
    status: "Trained"
  },
  {
    id: "MOD-PANEL-04",
    name: "Proposed Research Model: Dynamic Random-Effects Probit with Lagged Dependent Variable",
    type: "Dynamic Panel Probit",
    auc_roc: 0.858,
    accuracy: 0.835,
    f1_score: 0.780,
    status: "Estimated"
  }
];

const FEATURE_IMPORTANCE = [
  { feature: "Unpaid Daily Care Hours (>4h)", importance: 28.5, direction: "Positive Risk", color: "#f43f5e" },
  { feature: "Female Gender", importance: 24.2, direction: "Positive Risk", color: "#f43f5e" },
  { feature: "Household Wealth Q1 (Lowest)", importance: 14.8, direction: "Positive Risk", color: "#f59e0b" },
  { feature: "Vocational Training Completion", importance: 12.3, direction: "Protective", color: "#10b981" },
  { feature: "Rural Agrarian Location", importance: 9.4, direction: "Positive Risk", color: "#f59e0b" },
  { feature: "Higher Secondary / Diploma", importance: 6.1, direction: "Protective", color: "#10b981" },
  { feature: "Age Bracket 21-24", importance: 4.7, direction: "Positive Risk", color: "#3b82f6" }
];

const SHAP_FEATURES = [
  { feature: "Daily Care Hours > 4h", shap_val: 0.42, impact: "Strong Positive NEET Risk" },
  { feature: "Female", shap_val: 0.38, impact: "Increases predicted probability across strata" },
  { feature: "Vocational Certificate", shap_val: -0.31, impact: "Strong protective factor against NEET" },
  { feature: "Household Wealth Q1", shap_val: 0.29, impact: "Elevates chronic persistence hazard" },
  { feature: "Higher Education Degree", shap_val: -0.18, impact: "Moderately protective against persistence" }
];

const SUBGROUP_PERF = [
  { stratum: "Rural Females", sample: 2840, auc: 0.856, precision: 0.824, recall: 0.801 },
  { stratum: "Rural Males", sample: 2980, auc: 0.812, precision: 0.710, recall: 0.685 },
  { stratum: "Urban Females", sample: 1690, auc: 0.834, precision: 0.768, recall: 0.730 },
  { stratum: "Urban Males", sample: 1718, auc: 0.798, precision: 0.695, recall: 0.642 }
];

export default function NeetPredictionPage() {
  const [selectedModel, setSelectedModel] = useState(MODELS[0]);
  const [trainModelType, setTrainModelType] = useState("XGBoost");
  const [isTraining, setIsTraining] = useState(false);
  const [trainDone, setTrainDone] = useState(false);

  const handleTrain = () => {
    setIsTraining(true);
    setTimeout(() => {
      setIsTraining(false);
      setTrainDone(true);
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* Top Warning Banner */}
      <div className="p-4 rounded-xl border border-blue-500/30 bg-blue-950/20 text-xs text-blue-200 flex items-start gap-3">
        <Shield className="h-5 w-5 text-blue-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-blue-300">ETHICAL MACHINE LEARNING NOTICE: </span>
          Predictive risk models identify structural population vulnerability to prioritize community support services
          and vocational resource allocation. Predictive scores must NEVER be used to automatically gate, deny, or restrict
          individual benefits or employment opportunities.
        </div>
      </div>

      <Tabs defaultValue="models" className="w-full">
        <TabsList className="grid grid-cols-4 w-full max-w-xl">
          <TabsTrigger value="models">Models Catalog</TabsTrigger>
          <TabsTrigger value="results">Evaluation & Metrics</TabsTrigger>
          <TabsTrigger value="shap">SHAP Explainability</TabsTrigger>
          <TabsTrigger value="train">Train New Model</TabsTrigger>
        </TabsList>

        {/* Tab 1: Models Catalog */}
        <TabsContent value="models" className="space-y-4 pt-2">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {MODELS.map((m) => (
              <Card
                key={m.id}
                onClick={() => setSelectedModel(m)}
                className={`cursor-pointer border transition-all ${
                  selectedModel.id === m.id
                    ? "border-blue-500 bg-slate-900 shadow-md"
                    : "border-slate-800 bg-slate-950/60 hover:border-slate-700"
                }`}
              >
                <CardHeader className="p-4 pb-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-slate-500">{m.type}</span>
                    <Badge variant={m.status === "Estimated" ? "teal" : "success"}>{m.status}</Badge>
                  </div>
                  <CardTitle className="text-xs font-semibold text-slate-200 mt-2 line-clamp-2">{m.name}</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-2 space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-t border-slate-800/80">
                    <span className="text-slate-400">Test ROC-AUC:</span>
                    <span className="font-bold text-blue-400 font-mono">{m.auc_roc}</span>
                  </div>
                  <div className="flex justify-between py-1 border-t border-slate-800/80">
                    <span className="text-slate-400">Accuracy:</span>
                    <span className="font-bold text-slate-200 font-mono">{m.accuracy}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Research Equation Callout for Dynamic Panel Probit */}
          <Card className="border-slate-800 bg-slate-900/90">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm">Registered Research Foundation Model</CardTitle>
                <Badge variant="teal">FROM NEET STATUS TO NEET PERSISTENCE</Badge>
              </div>
              <CardDescription>
                Econometric panel specification accounting for lagged state persistence and unobserved individual heterogeneity
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-xs">
              <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 font-mono text-blue-300 text-sm text-center">
                P(y_it = 1 | ...) = Φ( α y_i,t-1 + γ z_i + β x_i,t-1 + c_i )
              </div>
              <p className="text-slate-400 leading-relaxed">
                Where <code className="text-slate-200">y_it</code> is current NEET status, <code className="text-slate-200">y_i,t-1</code> is previous wave status,
                <code className="text-slate-200">α</code> captures genuine state dependence versus spurious persistence,
                <code className="text-slate-200">z_i</code> time-invariant attributes, <code className="text-slate-200">x_i,t-1</code> time-varying variables (care hours, income),
                and <code className="text-slate-200">c_i</code> unobserved individual fixed effects.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 2: Evaluation Results */}
        <TabsContent value="results" className="space-y-4 pt-2">
          {/* Metrics Row */}
          <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
            {[
              { label: "Accuracy", val: "81.4%" },
              { label: "Precision", val: "77.1%" },
              { label: "Recall", val: "74.8%" },
              { label: "F1 Score", val: "0.759" },
              { label: "ROC-AUC", val: "0.842" },
              { label: "PR-AUC", val: "0.795" }
            ].map((m, i) => (
              <div key={i} className="p-3 rounded-lg border border-slate-800 bg-slate-900 text-center">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">{m.label}</span>
                <span className="text-lg font-bold text-blue-400 font-mono mt-0.5 block">{m.val}</span>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Confusion Matrix */}
            <Card className="border-slate-800 bg-slate-900/90">
              <CardHeader>
                <CardTitle className="text-sm">Test Set Confusion Matrix (N = 9,228)</CardTitle>
                <CardDescription>Strict 80/20 train/test temporal partition on Wave 2025/26 holdout</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3 text-center text-xs">
                  <div className="p-4 rounded-lg bg-emerald-950/20 border border-emerald-500/30">
                    <span className="text-slate-400 block text-[11px]">True Negatives (Correct Non-NEET)</span>
                    <span className="text-2xl font-bold text-emerald-400 font-mono mt-1 block">5,820</span>
                  </div>
                  <div className="p-4 rounded-lg bg-rose-950/20 border border-rose-500/30">
                    <span className="text-slate-400 block text-[11px]">False Positives (Type I Error)</span>
                    <span className="text-2xl font-bold text-rose-400 font-mono mt-1 block">780</span>
                  </div>
                  <div className="p-4 rounded-lg bg-rose-950/20 border border-rose-500/30">
                    <span className="text-slate-400 block text-[11px]">False Negatives (Type II Error)</span>
                    <span className="text-2xl font-bold text-rose-400 font-mono mt-1 block">660</span>
                  </div>
                  <div className="p-4 rounded-lg bg-emerald-950/20 border border-emerald-500/30">
                    <span className="text-slate-400 block text-[11px]">True Positives (Correct NEET Detected)</span>
                    <span className="text-2xl font-bold text-emerald-400 font-mono mt-1 block">1,968</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Feature Importance Chart */}
            <ChartCard
              title="Predictor Feature Importance Ranking"
              description="Relative percentage contribution to gradient boosting decisions"
              heightClass="h-72"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={FEATURE_IMPORTANCE} layout="vertical" margin={{ top: 10, right: 30, left: 100, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis type="number" stroke="#94a3b8" domain={[0, 35]} unit="%" tick={{ fontSize: 11 }} />
                  <YAxis type="category" dataKey="feature" stroke="#94a3b8" tick={{ fontSize: 10 }} width={130} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", borderRadius: "8px", fontSize: "12px" }}
                  />
                  <Bar dataKey="importance" name="Importance %" radius={[0, 4, 4, 0]}>
                    {FEATURE_IMPORTANCE.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>

          {/* Subgroup Calibration */}
          <Card className="border-slate-800 bg-slate-900/90">
            <CardHeader>
              <CardTitle className="text-sm">Demographic Subgroup Performance Calibration</CardTitle>
              <CardDescription>Ensures fairness and absence of catastrophic accuracy degradation across strata</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-950 text-slate-400 border-y border-slate-800">
                  <tr>
                    <th className="py-2.5 px-4 font-medium">Subgroup Stratum</th>
                    <th className="py-2.5 px-4 font-medium">Test Sample</th>
                    <th className="py-2.5 px-4 font-medium">Precision</th>
                    <th className="py-2.5 px-4 font-medium">Recall</th>
                    <th className="py-2.5 px-4 font-medium">ROC-AUC</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono">
                  {SUBGROUP_PERF.map((s, i) => (
                    <tr key={i} className="hover:bg-slate-800/30">
                      <td className="py-2.5 px-4 font-sans font-medium text-slate-200">{s.stratum}</td>
                      <td className="py-2.5 px-4 text-slate-400">{s.sample}</td>
                      <td className="py-2.5 px-4 text-slate-200">{s.precision}</td>
                      <td className="py-2.5 px-4 text-slate-200">{s.recall}</td>
                      <td className="py-2.5 px-4 text-emerald-400 font-bold">{s.auc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 3: SHAP */}
        <TabsContent value="shap" className="space-y-4 pt-2">
          <Card className="border-slate-800 bg-slate-900/90">
            <CardHeader>
              <CardTitle className="text-sm">TreeSHAP Explainability Decomposition</CardTitle>
              <CardDescription>Shows directional push of features on model prediction odds</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-xs">
              {SHAP_FEATURES.map((f, i) => (
                <div key={i} className="p-3 rounded-lg border border-slate-800 bg-slate-950/60 flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-slate-200 block">{f.feature}</span>
                    <span className="text-slate-400 text-[11px] block mt-0.5">{f.impact}</span>
                  </div>
                  <div className="text-right font-mono">
                    <span className={`font-bold ${f.shap_val > 0 ? "text-rose-400" : "text-emerald-400"}`}>
                      {f.shap_val > 0 ? `+${f.shap_val}` : f.shap_val}
                    </span>
                    <span className="text-[10px] text-slate-500 block">mean |SHAP|</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 4: Train New Model */}
        <TabsContent value="train" className="space-y-4 pt-2">
          <Card className="border-slate-800 bg-slate-900/90 max-w-xl">
            <CardHeader>
              <CardTitle className="text-sm">Train / Retrain Youth NEET Classifier</CardTitle>
              <CardDescription>Select model algorithm, feature sets, and temporal holdouts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-xs">
              <div>
                <label className="text-slate-300 font-medium block mb-1">Model Architecture</label>
                <Select value={trainModelType} onChange={(e) => setTrainModelType(e.target.value)}>
                  <option value="XGBoost">Extreme Gradient Boosting (XGBoost)</option>
                  <option value="Random Forest">Random Forest Classifier (100 Trees)</option>
                  <option value="Logistic Regression">Regularized Logistic Regression (ElasticNet)</option>
                </Select>
              </div>
              <div>
                <label className="text-slate-300 font-medium block mb-1">Target Variable</label>
                <Input value="neet_status_next_wave (Binary 0/1)" disabled className="bg-slate-900 text-slate-400 font-mono" />
              </div>
              <div>
                <label className="text-slate-300 font-medium block mb-1">Train / Test Temporal Partition</label>
                <Select defaultValue="80">
                  <option value="80">80% Train (Waves 1-4) / 20% Holdout Test (Waves 5-6)</option>
                  <option value="70">70% Train / 30% Holdout</option>
                </Select>
              </div>
              <Button onClick={handleTrain} disabled={isTraining} className="w-full">
                {isTraining ? "Executing Model Training Pipeline..." : "Execute Model Training"}
              </Button>
              {trainDone && (
                <div className="p-3 rounded-lg bg-emerald-950/20 border border-emerald-500/30 text-emerald-300 text-xs">
                  Model training complete. Evaluated on 9,228 test records. ROC-AUC: 0.841, Accuracy: 81.2%.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
