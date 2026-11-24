"use client";

import React, { useState } from "react";
import {
  ArrowRightLeft,
  Clock,
  Layers,
  Info,
  TrendingDown,
  Repeat,
  CheckCircle,
  AlertTriangle
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { ChartCard } from "@/components/ui/chart-card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { DEMO_TRANSITIONS } from "@/lib/demo-data";
import { formatNumber } from "@/lib/utils";
import { getTransitionMatrix, getPersistenceBreakdown, getSurvivalCurves } from "@/lib/api-client";

const SEQUENCES = [
  { rank: 1, path: "EDU → EDU → EDU → EMP → EMP → EMP", share: "28.4%", label: "Direct School-to-Work Transition" },
  { rank: 2, path: "EMP → EMP → EMP → EMP → EMP → EMP", share: "18.6%", label: "Continuous Stable Employment" },
  { rank: 3, path: "EDU → NEET → NEET → NEET → NEET → NEET", share: "14.2%", label: "Post-School Inactivity Trap (Predominantly Female)" },
  { rank: 4, path: "EDU → EDU → NEET → EMP → EMP → EMP", share: "11.5%", label: "Frictional Search with Successful Re-entry" },
  { rank: 5, path: "NEET → TRN → EMP → EMP → EMP → EMP", share: "8.7%", label: "Training-Mediated Catalytic Recovery" },
  { rank: 6, path: "EMP → NEET → EMP → NEET → EMP → NEET", share: "7.4%", label: "Precarious Informal Churning" },
  { rank: 7, path: "NEET → NEET → NEET → NEET → NEET → NEET", share: "6.2%", label: "Continuous Multi-Year Chronic Inactivity" }
];

export default function TransitionIntelligencePage() {
  const [matrixFilter, setMatrixFilter] = useState("all");
  const [liveMatrix, setLiveMatrix] = useState<any>(null);
  const [livePersistence, setLivePersistence] = useState<any>(null);
  const [liveSurvival, setLiveSurvival] = useState<any>(null);

  React.useEffect(() => {
    const filters: Record<string, any> = {};
    if (matrixFilter === "female") filters["gender"] = "Female";
    if (matrixFilter === "male") filters["gender"] = "Male";
    if (matrixFilter === "rural") filters["rural_urban"] = "Rural";
    if (matrixFilter === "urban") filters["rural_urban"] = "Urban";

    getTransitionMatrix(Object.keys(filters).length > 0 ? filters : undefined)
      .then((data: any) => {
        if (data && data.matrix) setLiveMatrix(data.matrix);
      })
      .catch((err) => console.warn("Transition matrix offline fallback:", err));

    getPersistenceBreakdown()
      .then((data: any) => {
        if (data && data.breakdown) setLivePersistence(data.breakdown);
      })
      .catch((err) => console.warn("Persistence breakdown offline fallback:", err));

    getSurvivalCurves()
      .then((data: any) => {
        if (data && data.survival_curve) setLiveSurvival(data.survival_curve);
      })
      .catch((err) => console.warn("Survival curve offline fallback:", err));
  }, [matrixFilter]);

  const matrixData = liveMatrix || DEMO_TRANSITIONS.matrix;
  const persistenceData = livePersistence || DEMO_TRANSITIONS.persistence;
  const survivalData = liveSurvival || DEMO_TRANSITIONS.survival_curve;

  return (
    <div className="space-y-8">
      {/* Editorial Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-[var(--border-hairline)]">
        <div>
          <div className="flex items-center gap-2 text-xs font-sans text-saffron-500">
            <span className="font-serif italic font-semibold">Chapter III</span>
            <span className="text-[var(--text-faint)]">/</span>
            <span>Transition Dynamics</span>
          </div>
          <h2 className="text-xl font-serif font-semibold text-[var(--text-main)] mt-1">
            Transition Intelligence & Longitudinal Flow Dynamics
          </h2>
          <p className="text-xs text-[var(--text-muted)] font-sans mt-0.5">
            First-order Markov matrices, sequence pathways, and Kaplan-Meier duration hazard curves.
          </p>
        </div>
      </div>

      {/* Methodological Caution on State Dependence vs Heterogeneity */}
      <div className="p-4 rounded border border-[var(--border-hairline)] bg-[var(--bg-surface)] text-xs text-[var(--text-muted)] flex items-start gap-3">
        <span className="font-serif italic text-saffron-500 font-semibold shrink-0">Methodological Note.</span>
        <div className="font-sans leading-relaxed">
          A positive statistical association between past NEET status and current NEET status does not prove that past
          inactivity causally causes future scarring. Unobserved individual effects (health, family care norms, local labor demand)
          often drive both. Transition matrices describe empirical flows, not pure causal mechanisms.
        </div>
      </div>

      <Tabs defaultValue="matrix" className="w-full">
        <TabsList className="grid grid-cols-4 w-full max-w-xl">
          <TabsTrigger value="matrix">Transition Matrix</TabsTrigger>
          <TabsTrigger value="persistence">Persistence & Churn</TabsTrigger>
          <TabsTrigger value="sequences">Sequence Pathways</TabsTrigger>
          <TabsTrigger value="survival">Survival Hazard Curves</TabsTrigger>
        </TabsList>

        {/* Tab 1: Transition Matrix */}
        <TabsContent value="matrix" className="space-y-6 pt-4">
          <div className="rounded border border-[var(--border-hairline)] bg-[var(--bg-surface)] overflow-hidden">
            <div className="flex flex-row items-center justify-between p-5 border-b border-[var(--border-hairline)]">
              <div>
                <h4 className="text-sm font-serif font-semibold text-[var(--text-main)]">First-Order Markov Transition Matrix (Wave t → Wave t+1)</h4>
                <p className="text-xs text-[var(--text-muted)] font-sans mt-0.5">Observed probability of moving between activity states across consecutive survey waves</p>
              </div>
              <div className="w-48">
                <Select value={matrixFilter} onChange={(e) => setMatrixFilter(e.target.value)}>
                  <option value="all">All Youth Cohort</option>
                  <option value="female">Females Only</option>
                  <option value="male">Males Only</option>
                  <option value="rural">Rural Localities</option>
                  <option value="urban">Urban Localities</option>
                </Select>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-center border-collapse">
                <thead className="bg-[var(--bg-elevated)] text-[var(--text-muted)] border-b border-[var(--border-hairline)] font-serif">
                  <tr>
                    <th className="py-3 px-4 text-left font-semibold">Origin State (Wave t)</th>
                    <th className="py-3 px-4 font-semibold text-prussian-400">→ Education</th>
                    <th className="py-3 px-4 font-semibold text-sage-500">→ Employment</th>
                    <th className="py-3 px-4 font-semibold text-ochre-400">→ Training</th>
                    <th className="py-3 px-4 font-semibold text-saffron-500">→ NEET Inactivity</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border-hairline)] font-mono">
                  {matrixData.map((row, idx) => (
                    <tr key={idx} className="hover:bg-[var(--bg-elevated)]/50 transition-colors">
                      <td className="py-3.5 px-4 text-left font-semibold text-[var(--text-main)] font-sans">{row.from_state}</td>
                      <td className="py-3.5 px-4">
                        <span className={`inline-block px-2.5 py-0.5 rounded text-xs ${row.to_education > 50 ? "bg-prussian-500/15 text-prussian-300 font-bold" : "text-[var(--text-muted)]"}`}>
                          {row.to_education}%
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`inline-block px-2.5 py-0.5 rounded text-xs ${row.to_employment > 50 ? "bg-sage-500/15 text-sage-400 font-bold" : "text-[var(--text-muted)]"}`}>
                          {row.to_employment}%
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`inline-block px-2.5 py-0.5 rounded text-xs ${row.to_training > 20 ? "bg-ochre-500/15 text-ochre-400 font-bold" : "text-[var(--text-muted)]"}`}>
                          {row.to_training}%
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`inline-block px-2.5 py-0.5 rounded text-xs ${row.to_neet > 50 ? "bg-saffron-500/15 text-saffron-400 font-bold" : "text-[var(--text-muted)]"}`}>
                          {row.to_neet}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Key Findings Callout */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-sans">
            <div className="p-4 rounded border border-[var(--border-hairline)] bg-[var(--bg-surface)] space-y-1">
              <span className="font-serif font-semibold text-saffron-500 text-sm block">70.2% NEET Inactivity Persistence</span>
              <p className="text-[var(--text-muted)] leading-relaxed">Individuals identified as NEET in Wave t face a 70.2% likelihood of remaining NEET in Wave t+1.</p>
            </div>
            <div className="p-4 rounded border border-[var(--border-hairline)] bg-[var(--bg-surface)] space-y-1">
              <span className="font-serif font-semibold text-sage-500 text-sm block">45.2% Training Transition Success</span>
              <p className="text-[var(--text-muted)] leading-relaxed">Completing vocational training triples subsequent wave formal employment transition relative to untreated NEET (45.2% vs 15.1%).</p>
            </div>
            <div className="p-4 rounded border border-[var(--border-hairline)] bg-[var(--bg-surface)] space-y-1">
              <span className="font-serif font-semibold text-prussian-400 text-sm block">10.2% Education-to-NEET Drop</span>
              <p className="text-[var(--text-muted)] leading-relaxed">10.2% of individuals exiting schooling enter immediate inactivity, disproportionately concentrated in rural females.</p>
            </div>
          </div>
        </TabsContent>

        {/* Tab 2: Persistence & Churn */}
        <TabsContent value="persistence" className="space-y-4 pt-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ChartCard
              title="Longitudinal NEET Duration Decomposition"
              description="Classification of all youth across 6-wave observation history"
              heightClass="h-72"
            >
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={persistenceData}
                    dataKey="percentage"
                    nameKey="pattern"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    innerRadius={50}
                    paddingAngle={2}
                  >
                    {persistenceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color === "#f43f5e" ? "#d46539" : entry.color === "#10b981" ? "#5e916a" : entry.color === "#f59e0b" ? "#c89547" : "#446b82"} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "10px", fontFamily: "Instrument Sans" }} />
                </PieChart>
              </ResponsiveContainer>
            </ChartCard>

            <div className="rounded border border-[var(--border-hairline)] bg-[var(--bg-surface)] p-6 space-y-4">
              <div className="pb-3 border-b border-[var(--border-hairline)]">
                <h4 className="text-sm font-serif font-semibold text-[var(--text-main)]">Persistence Strata Breakdown (N = 42,100)</h4>
                <p className="text-xs text-[var(--text-muted)] font-sans mt-0.5">Repeated observations do not automatically indicate uninterrupted persistence</p>
              </div>
              <div className="space-y-3">
                {persistenceData.map((p, i) => (
                  <div key={i} className="p-3.5 rounded border border-[var(--border-hairline)] bg-[var(--bg-elevated)] flex items-center justify-between text-xs font-sans">
                    <div className="flex items-center gap-2.5">
                      <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: p.color === "#f43f5e" ? "#d46539" : p.color === "#10b981" ? "#5e916a" : p.color === "#f59e0b" ? "#c89547" : "#446b82" }} />
                      <div>
                        <span className="font-medium text-[var(--text-main)] block">{p.pattern}</span>
                        <span className="text-[11px] text-[var(--text-faint)] font-mono">{formatNumber(p.count)} individuals</span>
                      </div>
                    </div>
                    <span className="font-numeral font-bold text-[var(--text-main)] text-sm">{p.percentage}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Tab 3: Sequence Pathways */}
        <TabsContent value="sequences" className="space-y-4 pt-4">
          <div className="rounded border border-[var(--border-hairline)] bg-[var(--bg-surface)] p-6 space-y-4">
            <div className="pb-3 border-b border-[var(--border-hairline)]">
              <h4 className="text-sm font-serif font-semibold text-[var(--text-main)]">Modal Longitudinal Trajectories (6-Wave Sequence Clusters)</h4>
              <p className="text-xs text-[var(--text-muted)] font-sans mt-0.5">Top activity sequences clustered across 2021-2026 panel</p>
            </div>
            <div className="space-y-3">
              {SEQUENCES.map((seq) => (
                <div key={seq.rank} className="p-4 rounded border border-[var(--border-hairline)] bg-[var(--bg-elevated)] flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs font-sans">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="h-5 w-5 rounded border border-[var(--border-muted)] bg-[var(--bg-surface)] text-[var(--text-muted)] font-serif text-[11px] flex items-center justify-center font-bold">
                        {seq.rank}
                      </span>
                      <span className="font-medium text-[var(--text-main)]">{seq.label}</span>
                    </div>
                    <p className="font-mono text-saffron-500 text-xs pl-7">{seq.path}</p>
                  </div>
                  <span className="font-mono font-medium text-[var(--text-muted)] bg-[var(--bg-surface)] border border-[var(--border-hairline)] px-2.5 py-1 rounded text-xs shrink-0">
                    {seq.share} of cohort
                  </span>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* Tab 4: Survival Hazard Curves */}
        <TabsContent value="survival" className="space-y-4 pt-4">
          <ChartCard
            title="Kaplan-Meier Survival Curves (Probability of Remaining NEET)"
            description="Hazard of exit into employment or training across waves elapsed since initial NEET observation"
            heightClass="h-80"
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={survivalData} margin={{ top: 12, right: 24, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="2 4" stroke="var(--border-hairline)" vertical={false} />
                <XAxis dataKey="wave" stroke="var(--text-muted)" tickLine={false} tick={{ fontSize: 11, fontFamily: "JetBrains Mono" }} unit=" Waves" />
                <YAxis stroke="var(--text-muted)" tickLine={false} tick={{ fontSize: 11, fontFamily: "JetBrains Mono" }} domain={[0, 1.0]} />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "12px", fontFamily: "Instrument Sans" }} />
                <Line type="stepAfter" dataKey="General" name="General Youth Cohort" stroke="#446b82" strokeWidth={2} />
                <Line type="stepAfter" dataKey="With Training" name="Vocational Training Access" stroke="#5e916a" strokeWidth={2} />
                <Line type="stepAfter" dataKey="Rural Female Care" name="Rural Females High Care Burden" stroke="#d46539" strokeWidth={2.5} />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>
        </TabsContent>
      </Tabs>
    </div>
  );
}
