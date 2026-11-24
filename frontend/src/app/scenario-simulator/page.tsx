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
    <div className="space-y-8">
      {/* Editorial Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-[var(--border-hairline)]">
        <div>
          <div className="flex items-center gap-2 text-xs font-sans text-saffron-500">
            <span className="font-serif italic font-semibold">Chapter V</span>
            <span className="text-[var(--text-faint)]">/</span>
            <span>Scenario Projections</span>
          </div>
          <h2 className="text-xl font-serif font-semibold text-[var(--text-main)] mt-1">
            2021–2031 Forward Policy Scenario Simulator
          </h2>
          <p className="text-xs text-[var(--text-muted)] font-sans mt-0.5">
            Interactive multi-scenario projections, resource envelope sensitivity, and cumulative transition flows.
          </p>
        </div>
      </div>

      {/* Mathematical Integrity Banner */}
      <div className="p-4 rounded border border-[var(--border-hairline)] bg-[var(--bg-surface)] text-xs text-[var(--text-muted)] flex items-start gap-3">
        <span className="font-serif italic text-saffron-500 font-semibold shrink-0">Accounting Note.</span>
        <div className="font-sans leading-relaxed">
          The simulation engine strictly separates historical observations (2021–2026, solid line) from forward policy
          scenarios (2027–2031, projected trajectory). Future estimates reflect stated parametric coverage and arithmetic
          cohort flow accounting. They are not guaranteed empirically identified causal treatment effects.
        </div>
      </div>

      {/* Main Grid: Controls vs Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Controls Column */}
        <div className="lg:col-span-5 rounded border border-[var(--border-hairline)] bg-[var(--bg-surface)] p-6 space-y-5 text-xs font-sans">
          <div className="pb-3 border-b border-[var(--border-hairline)]">
            <h4 className="text-sm font-serif font-semibold text-[var(--text-main)]">Policy Scenario Controls</h4>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">Adjust intervention parameters to recalculate 2027–2031 trajectory</p>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <label className="text-[var(--text-main)] font-medium">Target Programme Coverage</label>
                <span className="text-saffron-500 font-mono font-bold">{coverage}%</span>
              </div>
              <input
                type="range"
                min="5"
                max="90"
                value={coverage}
                onChange={(e) => setCoverage(Number(e.target.value))}
                className="w-full accent-saffron-500 h-1.5 bg-[var(--bg-elevated)] rounded cursor-pointer"
              />
              <span className="text-[10px] text-[var(--text-faint)]">Share of high-risk eligible youth enrolled</span>
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <label className="text-[var(--text-main)] font-medium">Assumed Completion Rate</label>
                <span className="text-sage-500 font-mono font-bold">{completion}%</span>
              </div>
              <input
                type="range"
                min="30"
                max="95"
                value={completion}
                onChange={(e) => setCompletion(Number(e.target.value))}
                className="w-full accent-sage-500 h-1.5 bg-[var(--bg-elevated)] rounded cursor-pointer"
              />
              <span className="text-[10px] text-[var(--text-faint)]">Proportion completing full credential/apprenticeship</span>
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <label className="text-[var(--text-main)] font-medium">Employment / Training Transition</label>
                <span className="text-prussian-400 font-mono font-bold">{transitionRate}%</span>
              </div>
              <input
                type="range"
                min="15"
                max="75"
                value={transitionRate}
                onChange={(e) => setTransitionRate(Number(e.target.value))}
                className="w-full accent-prussian-500 h-1.5 bg-[var(--bg-elevated)] rounded cursor-pointer"
              />
              <span className="text-[10px] text-[var(--text-faint)]">Post-programme placement rate into non-NEET state</span>
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <label className="text-[var(--text-main)] font-medium">Budget Envelope (INR Crores)</label>
                <span className="text-ochre-400 font-mono font-bold">₹{investment} Cr</span>
              </div>
              <input
                type="range"
                min="2"
                max="60"
                step="0.5"
                value={investment}
                onChange={(e) => setInvestment(Number(e.target.value))}
                className="w-full accent-ochre-500 h-1.5 bg-[var(--bg-elevated)] rounded cursor-pointer"
              />
            </div>

            <div className="p-3.5 rounded bg-[var(--bg-elevated)] border border-[var(--border-hairline)] flex items-center justify-between">
              <div>
                <span className="font-serif font-semibold text-[var(--text-main)] block text-xs">Co-Provision Childcare & Crèches</span>
                <span className="text-[10px] text-[var(--text-muted)]">Unlocks female participation multiplier</span>
              </div>
              <input
                type="checkbox"
                checked={careSupport}
                onChange={(e) => setCareSupport(e.target.checked)}
                className="h-4 w-4 rounded accent-saffron-500 cursor-pointer"
              />
            </div>

            {/* Quick Stat Highlights */}
            <div className="p-4 rounded bg-[var(--bg-elevated)] border border-[var(--border-hairline)] space-y-2.5">
              <span className="text-[10px] text-[var(--text-faint)] uppercase tracking-wider block font-serif font-semibold">Simulated 2031 Outcome</span>
              <div className="flex justify-between items-baseline">
                <span className="text-[var(--text-muted)]">Projected NEET Rate:</span>
                <span className="text-2xl font-numeral font-bold text-saffron-500">{finalRate}%</span>
              </div>
              <div className="flex justify-between items-baseline">
                <span className="text-[var(--text-muted)]">Net Rate Reduction:</span>
                <span className="text-sm font-semibold text-sage-500 font-mono">▼ -{reductionPts}% pts</span>
              </div>
              <div className="flex justify-between items-baseline">
                <span className="text-[var(--text-muted)]">Cumulative Net Exits:</span>
                <span className="text-sm font-semibold text-[var(--text-main)] font-mono">{formatNumber(estimatedExits)} youth</span>
              </div>
            </div>
          </div>
        </div>

        {/* Timeline Visualization Column */}
        <div className="lg:col-span-7 space-y-4">
          <ChartCard
            title="NEET Prevalence Trajectory (2021–2026 Historical vs 2027–2031 Projected)"
            description="Comparison of Baseline Status Quo, Moderate, Expanded, and Custom Interactive Scenario"
            heightClass="h-96"
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={timelineData} margin={{ top: 12, right: 24, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="2 4" stroke="var(--border-hairline)" vertical={false} />
                <XAxis dataKey="year" stroke="var(--text-muted)" tickLine={false} tick={{ fontSize: 11, fontFamily: "JetBrains Mono" }} />
                <YAxis stroke="var(--text-muted)" tickLine={false} tick={{ fontSize: 11, fontFamily: "JetBrains Mono" }} domain={[10, 30]} unit="%" />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "12px", fontFamily: "Instrument Sans" }} />
                <Line type="monotone" dataKey="Baseline" name="Baseline (Status Quo)" stroke="#8a8e9b" strokeWidth={1.5} strokeDasharray="3 3" dot={false} />
                <Line type="monotone" dataKey="Moderate" name="Moderate Targeted" stroke="#c89547" strokeWidth={1.75} strokeDasharray="3 3" dot={false} />
                <Line type="monotone" dataKey="Expanded" name="Expanded Comprehensive" stroke="#446b82" strokeWidth={2} strokeDasharray="4 4" dot={false} />
                <Line type="monotone" dataKey="Custom" name="Your Custom Scenario" stroke="#d46539" strokeWidth={2.75} dot={{ r: 3, fill: "#d46539" }} activeDot={{ r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      </div>

      {/* Row 2: 3-Scenario Comparison Table */}
      <div className="rounded border border-[var(--border-hairline)] bg-[var(--bg-surface)] overflow-hidden text-xs">
        <div className="p-5 border-b border-[var(--border-hairline)]">
          <h4 className="text-sm font-serif font-semibold text-[var(--text-main)]">Canonical Policy Scenarios Comparison Dossier</h4>
          <p className="text-xs text-[var(--text-muted)] font-sans mt-0.5">Comprehensive side-by-side assessment across resource envelopes and projected outcomes</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left font-sans">
            <thead className="bg-[var(--bg-elevated)] text-[var(--text-muted)] border-b border-[var(--border-hairline)] font-serif">
              <tr>
                <th className="py-2.5 px-4 font-semibold">Policy Scenario</th>
                <th className="py-2.5 px-4 font-semibold">Coverage</th>
                <th className="py-2.5 px-4 font-semibold">Budget Required</th>
                <th className="py-2.5 px-4 font-semibold">Observed Rate (2026)</th>
                <th className="py-2.5 px-4 font-semibold">Projected Rate (2031)</th>
                <th className="py-2.5 px-4 font-semibold">Net Reduction</th>
                <th className="py-2.5 px-4 font-semibold">Cumulative Exits</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-hairline)] font-mono">
              {DEMO_SCENARIO_COMPARISON.summary_cards.map((s, idx) => (
                <tr key={idx} className="hover:bg-[var(--bg-elevated)]/50 transition-colors">
                  <td className="py-3 px-4 font-sans font-medium text-[var(--text-main)]">{s.scenario}</td>
                  <td className="py-3 px-4 text-[var(--text-muted)]">{s.coverage}</td>
                  <td className="py-3 px-4 text-ochre-400">₹{s.investment_cr} Cr</td>
                  <td className="py-3 px-4 text-[var(--text-muted)]">{s.rate_2026}%</td>
                  <td className="py-3 px-4 text-[var(--text-main)] font-bold">{s.rate_2031}%</td>
                  <td className="py-3 px-4 text-sage-500">▼ -{s.reduction_pts}% pts</td>
                  <td className="py-3 px-4 text-saffron-500 font-bold">{formatNumber(s.cumulative_exits)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
