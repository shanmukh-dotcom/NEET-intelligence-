"use client";

import React, { useState } from "react";
import {
  PlayCircle,
  TrendingDown,
  Sliders,
  DollarSign,
  CheckCircle,
  AlertTriangle,
  Info,
  Layers,
  Sparkles,
  RefreshCw
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
  Legend
} from "recharts";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { ChartCard } from "@/components/ui/chart-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DEMO_SCENARIO_COMPARISON } from "@/lib/demo-data";
import { formatNumber } from "@/lib/utils";
import { simulatePolicyTimeline } from "@/lib/api-client";

export default function ScenarioSimulatorPage() {
  const [coverage, setCoverage] = useState(45);
  const [completion, setCompletion] = useState(78);
  const [transitionRate, setTransitionRate] = useState(42);
  const [careSupport, setCareSupport] = useState(true);
  const [investment, setInvestment] = useState(18.5);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulatedTimeline, setSimulatedTimeline] = useState<any[] | null>(null);

  const runLiveSimulation = async () => {
    setIsSimulating(true);
    try {
      const res: any = await simulatePolicyTimeline({
        name: "Custom Interactive Simulation",
        programme_coverage: coverage / 100,
        participation_rate: 0.90,
        completion_rate: completion / 100,
        transition_assumption: transitionRate / 100,
        investment_cr: investment,
        care_support_included: careSupport,
        initial_population: 50000,
      });

      if (res && res.timeline) {
        const mapped = res.timeline.map((r: any) => ({
          year: r.year,
          Observed: r.is_projected ? null : r.neet_rate_pct,
          Baseline: 26.1 - (r.is_projected ? (r.year - 2026) * 0.4 : 0),
          Custom: r.neet_rate_pct,
          is_projected: r.is_projected,
        }));
        setSimulatedTimeline(mapped);
      }
    } catch (e) {
      console.warn("Using local simulation math fallback:", e);
    } finally {
      setIsSimulating(false);
    }
  };

  // Dynamic projection calculation for 2027-2031 (fallback or instant preview)
  const timelineData = simulatedTimeline || DEMO_SCENARIO_COMPARISON.combined_timeline.map((row) => {
    if (!row.is_projected) return row;
    const yearOffset = row.year - 2026;
    const efficiency = (coverage / 100) * (completion / 100) * (transitionRate / 100);
    const dropFactor = efficiency * yearOffset * 1.8 * (careSupport ? 1.15 : 0.85);
    const customRate = Math.max(12.0, Number((26.1 - dropFactor).toFixed(1)));
    return {
      ...row,
      Custom: customRate
    };
  });

  const finalRate = timelineData[timelineData.length - 1]?.Custom || 18.2;
  const reductionPts = Number((26.1 - finalRate).toFixed(1));
  const estimatedExits = Math.round((50000 * (coverage / 100) * (completion / 100) * (transitionRate / 100) * 1.6));

  return (
    <div className="space-y-6">
      {/* Mathematical Integrity Banner */}
      <div className="p-4 rounded-xl border border-blue-500/30 bg-blue-950/20 text-xs text-blue-200 flex items-start gap-3">
        <Info className="h-5 w-5 text-blue-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-blue-300">MATHEMATICAL INTEGRITY & PROJECTION DISCLAIMER: </span>
          The simulation engine clearly separates historical observations (2021–2026, solid line) from forward policy
          scenarios (2027–2031, projected trajectory). Future estimates reflect stated parametric coverage and arithmetic
          cohort flow accounting. They are NOT guaranteed empirically identified causal effects.
        </div>
      </div>

      {/* Main Grid: Controls vs Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Controls Column */}
        <Card className="lg:col-span-1 border-slate-800 bg-slate-900/90 text-xs">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm">Policy Scenario Controls</CardTitle>
              <Badge variant="teal">LIVE SIMULATOR</Badge>
            </div>
            <CardDescription>Adjust intervention parameters to recalculate 2027-2031 trajectory</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <label className="text-slate-300 font-medium">Target Programme Coverage</label>
                <span className="text-blue-400 font-mono font-bold">{coverage}%</span>
              </div>
              <input
                type="range"
                min="5"
                max="90"
                value={coverage}
                onChange={(e) => setCoverage(Number(e.target.value))}
                className="w-full accent-blue-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              />
              <span className="text-[10px] text-slate-500">Share of high-risk eligible youth enrolled</span>
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <label className="text-slate-300 font-medium">Assumed Completion Rate</label>
                <span className="text-teal-400 font-mono font-bold">{completion}%</span>
              </div>
              <input
                type="range"
                min="30"
                max="95"
                value={completion}
                onChange={(e) => setCompletion(Number(e.target.value))}
                className="w-full accent-teal-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              />
              <span className="text-[10px] text-slate-500">Proportion completing full credential/apprenticeship</span>
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <label className="text-slate-300 font-medium">Employment / Training Transition</label>
                <span className="text-emerald-400 font-mono font-bold">{transitionRate}%</span>
              </div>
              <input
                type="range"
                min="15"
                max="75"
                value={transitionRate}
                onChange={(e) => setTransitionRate(Number(e.target.value))}
                className="w-full accent-emerald-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              />
              <span className="text-[10px] text-slate-500">Post-programme placement rate into non-NEET state</span>
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <label className="text-slate-300 font-medium">Budget Envelope (INR Crores)</label>
                <span className="text-amber-400 font-mono font-bold">₹{investment} Cr</span>
              </div>
              <input
                type="range"
                min="2"
                max="60"
                step="0.5"
                value={investment}
                onChange={(e) => setInvestment(Number(e.target.value))}
                className="w-full accent-amber-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              />
            </div>

            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="font-semibold text-slate-200 block">Co-Provision Childcare & Crèches</span>
                <span className="text-[10px] text-slate-400">Unlocks female participation multiplier</span>
              </div>
              <input
                type="checkbox"
                checked={careSupport}
                onChange={(e) => setCareSupport(e.target.checked)}
                className="h-4 w-4 rounded border-slate-700 accent-blue-500 cursor-pointer"
              />
            </div>

            {/* Quick Stat Highlights */}
            <div className="p-3.5 rounded-lg bg-slate-950/80 border border-slate-800 space-y-2">
              <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-semibold">Simulated 2031 Outcome</span>
              <div className="flex justify-between items-baseline">
                <span className="text-slate-400">Projected NEET Rate:</span>
                <span className="text-xl font-bold text-emerald-400 font-mono">{finalRate}%</span>
              </div>
              <div className="flex justify-between items-baseline">
                <span className="text-slate-400">Net Rate Reduction:</span>
                <span className="text-sm font-semibold text-blue-400 font-mono">▼ -{reductionPts}% pts</span>
              </div>
              <div className="flex justify-between items-baseline">
                <span className="text-slate-400">Cumulative Net Transitions:</span>
                <span className="text-sm font-semibold text-slate-200 font-mono">{formatNumber(estimatedExits)} youth</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Timeline Visualization Column */}
        <div className="lg:col-span-2 space-y-4">
          <ChartCard
            title="NEET Prevalence Trajectory (2021-2026 Historical vs 2027-2031 Projected)"
            description="Comparison of Baseline Status Quo, Moderate, Expanded, and Custom Interactive Scenario"
            heightClass="h-96"
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={timelineData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="year" stroke="#94a3b8" tick={{ fontSize: 12 }} />
                <YAxis stroke="#94a3b8" tick={{ fontSize: 12 }} domain={[10, 30]} unit="%" />
                <Tooltip
                  contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", borderRadius: "8px", fontSize: "12px" }}
                />
                <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }} />
                <Line type="monotone" dataKey="Baseline" name="Baseline (Status Quo)" stroke="#94a3b8" strokeWidth={2} strokeDasharray="3 3" />
                <Line type="monotone" dataKey="Moderate" name="Moderate Targeted" stroke="#f59e0b" strokeWidth={2} strokeDasharray="4 4" />
                <Line type="monotone" dataKey="Expanded" name="Expanded Comprehensive" stroke="#3b82f6" strokeWidth={2.5} strokeDasharray="4 4" />
                <Line type="monotone" dataKey="Custom" name="Your Custom Scenario" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      </div>

      {/* Row 2: 3-Scenario Comparison Table */}
      <Card className="border-slate-800 bg-slate-900/90 text-xs">
        <CardHeader>
          <CardTitle className="text-sm">Canonical Policy Scenarios Comparison Dossier</CardTitle>
          <CardDescription>Comprehensive side-by-side assessment across resource envelopes and projected outcomes</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-950 text-slate-400 border-y border-slate-800">
                <tr>
                  <th className="py-2.5 px-4 font-medium">Policy Scenario</th>
                  <th className="py-2.5 px-4 font-medium">Coverage</th>
                  <th className="py-2.5 px-4 font-medium">Budget Required</th>
                  <th className="py-2.5 px-4 font-medium">Observed Rate (2026)</th>
                  <th className="py-2.5 px-4 font-medium">Projected Rate (2031)</th>
                  <th className="py-2.5 px-4 font-medium">Net Reduction</th>
                  <th className="py-2.5 px-4 font-medium">Cumulative Exits</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {DEMO_SCENARIO_COMPARISON.summary_cards.map((s, idx) => (
                  <tr key={idx} className="hover:bg-slate-800/30">
                    <td className="py-3 px-4 font-sans font-semibold text-slate-200">{s.scenario}</td>
                    <td className="py-3 px-4 text-slate-300">{s.coverage}</td>
                    <td className="py-3 px-4 text-amber-400">₹{s.investment_cr} Cr</td>
                    <td className="py-3 px-4 text-slate-400">{s.rate_2026}%</td>
                    <td className="py-3 px-4 text-slate-100 font-bold">{s.rate_2031}%</td>
                    <td className="py-3 px-4 text-blue-400">▼ -{s.reduction_pts}% pts</td>
                    <td className="py-3 px-4 text-emerald-400 font-bold">{formatNumber(s.cumulative_exits)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
