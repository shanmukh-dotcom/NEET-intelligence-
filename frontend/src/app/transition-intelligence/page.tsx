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

  const matrixData = DEMO_TRANSITIONS.matrix;
  const persistenceData = DEMO_TRANSITIONS.persistence;
  const survivalData = DEMO_TRANSITIONS.survival_curve;

  return (
    <div className="space-y-6">
      {/* Warning Callout on State Dependence vs Heterogeneity */}
      <div className="p-4 rounded-xl border border-teal-500/30 bg-teal-950/20 text-xs text-teal-200 flex items-start gap-3">
        <Info className="h-5 w-5 text-teal-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-teal-300">METHODOLOGICAL CAUTION (STATE DEPENDENCE VS HETEROGENEITY): </span>
          A positive statistical association between past NEET status and current NEET status does NOT prove that past
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
        <TabsContent value="matrix" className="space-y-4 pt-2">
          <Card className="border-slate-800 bg-slate-900/90">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle className="text-sm">First-Order Markov Transition Matrix (Wave t → Wave t+1)</CardTitle>
                <CardDescription>Observed probability of moving between activity states across consecutive survey waves</CardDescription>
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
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-center border-collapse">
                  <thead className="bg-slate-950 text-slate-400 border-y border-slate-800">
                    <tr>
                      <th className="py-3 px-4 text-left font-medium">Origin State (Wave t)</th>
                      <th className="py-3 px-4 font-medium text-blue-400">→ Education</th>
                      <th className="py-3 px-4 font-medium text-emerald-400">→ Employment</th>
                      <th className="py-3 px-4 font-medium text-purple-400">→ Training</th>
                      <th className="py-3 px-4 font-medium text-rose-400">→ NEET Inactivity</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-mono">
                    {matrixData.map((row, idx) => (
                      <tr key={idx} className="hover:bg-slate-800/30">
                        <td className="py-3.5 px-4 text-left font-semibold text-slate-200 font-sans">{row.from_state}</td>
                        <td className="py-3.5 px-4">
                          <span className={`inline-block px-3 py-1 rounded text-xs ${row.to_education > 50 ? "bg-blue-600/20 text-blue-300 font-bold" : "text-slate-300"}`}>
                            {row.to_education}%
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className={`inline-block px-3 py-1 rounded text-xs ${row.to_employment > 50 ? "bg-emerald-600/20 text-emerald-300 font-bold" : "text-slate-300"}`}>
                            {row.to_employment}%
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className={`inline-block px-3 py-1 rounded text-xs ${row.to_training > 20 ? "bg-purple-600/20 text-purple-300 font-bold" : "text-slate-300"}`}>
                            {row.to_training}%
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className={`inline-block px-3 py-1 rounded text-xs ${row.to_neet > 50 ? "bg-rose-600/25 text-rose-300 font-bold" : "text-slate-300"}`}>
                            {row.to_neet}%
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Key Findings Callout */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-lg border border-slate-800 bg-slate-950/70 space-y-1">
              <span className="font-semibold text-rose-400 block">70.2% NEET Inactivity Persistence</span>
              <p className="text-slate-400">Individuals identified as NEET in Wave t face a 70.2% likelihood of remaining NEET in Wave t+1.</p>
            </div>
            <div className="p-4 rounded-lg border border-slate-800 bg-slate-950/70 space-y-1">
              <span className="font-semibold text-emerald-400 block">45.2% Training Transition Success</span>
              <p className="text-slate-400">Completing vocational training triples subsequent wave formal employment transition relative to untreated NEET (45.2% vs 15.1%).</p>
            </div>
            <div className="p-4 rounded-lg border border-slate-800 bg-slate-950/70 space-y-1">
              <span className="font-semibold text-blue-400 block">10.2% Education-to-NEET Drop</span>
              <p className="text-slate-400">10.2% of individuals exiting schooling enter immediate inactivity, disproportionately concentrated in rural females.</p>
            </div>
          </div>
        </TabsContent>

        {/* Tab 2: Persistence & Churn */}
        <TabsContent value="persistence" className="space-y-4 pt-2">
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
                    innerRadius={45}
                    paddingAngle={3}
                  >
                    {persistenceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", borderRadius: "8px", fontSize: "12px" }}
                  />
                  <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "10px" }} />
                </PieChart>
              </ResponsiveContainer>
            </ChartCard>

            <Card className="border-slate-800 bg-slate-900/90">
              <CardHeader>
                <CardTitle className="text-sm">Persistence Strata Breakdown (N = 42,100)</CardTitle>
                <CardDescription>Repeated observations do not automatically indicate uninterrupted persistence</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {persistenceData.map((p, i) => (
                  <div key={i} className="p-3 rounded-lg border border-slate-800 bg-slate-950/60 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2.5">
                      <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: p.color }} />
                      <div>
                        <span className="font-semibold text-slate-200 block">{p.pattern}</span>
                        <span className="text-[11px] text-slate-500 font-mono">{formatNumber(p.count)} individuals</span>
                      </div>
                    </div>
                    <span className="font-bold text-slate-100 font-mono text-sm">{p.percentage}%</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tab 3: Sequence Pathways */}
        <TabsContent value="sequences" className="space-y-4 pt-2">
          <Card className="border-slate-800 bg-slate-900/90">
            <CardHeader>
              <CardTitle className="text-sm">Modal Longitudinal Trajectories (6-Wave Life Course Sequence)</CardTitle>
              <CardDescription>Top activity sequences clustered across 2021-2026 panel</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {SEQUENCES.map((seq) => (
                <div key={seq.rank} className="p-3.5 rounded-lg border border-slate-800 bg-slate-950/60 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="h-5 w-5 rounded bg-slate-800 text-slate-300 font-mono text-[10px] flex items-center justify-center font-bold">
                        #{seq.rank}
                      </span>
                      <span className="font-semibold text-slate-200">{seq.label}</span>
                    </div>
                    <p className="font-mono text-blue-400 text-xs pl-7">{seq.path}</p>
                  </div>
                  <span className="font-mono font-bold text-slate-100 bg-slate-800/80 px-2.5 py-1 rounded text-xs">
                    {seq.share} of cohort
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 4: Survival Hazard Curves */}
        <TabsContent value="survival" className="space-y-4 pt-2">
          <ChartCard
            title="Kaplan-Meier Survival Curves (Probability of Remaining NEET)"
            description="Hazard of exit into employment or training across waves elapsed since initial NEET observation"
            heightClass="h-80"
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={survivalData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="wave" stroke="#94a3b8" tick={{ fontSize: 12 }} unit=" Waves" />
                <YAxis stroke="#94a3b8" tick={{ fontSize: 12 }} domain={[0, 1.0]} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", borderRadius: "8px", fontSize: "12px" }}
                />
                <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }} />
                <Line type="stepAfter" dataKey="General" name="General Youth Cohort" stroke="#3b82f6" strokeWidth={2.5} />
                <Line type="stepAfter" dataKey="With Training" name="Vocational Training Access" stroke="#10b981" strokeWidth={2.5} />
                <Line type="stepAfter" dataKey="Rural Female Care" name="Rural Females High Care Burden" stroke="#f43f5e" strokeWidth={2.5} />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>
        </TabsContent>
      </Tabs>
    </div>
  );
}
