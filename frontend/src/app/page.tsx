"use client";

import React, { useState } from "react";
import {
  TrendingDown,
  ArrowRight,
  AlertTriangle,
  CheckCircle2,
  Info
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
  Cell,
  PieChart,
  Pie
} from "recharts";

import { ChartCard } from "@/components/ui/chart-card";
import { DEMO_OVERVIEW } from "@/lib/demo-data";
import { formatNumber, formatPercent } from "@/lib/utils";
import { getDashboardOverview } from "@/lib/api-client";

const EDITORIAL_ACTIVITY_COLORS: Record<string, string> = {
  "Formal Education": "#446b82",
  "Regular Wage / Salaried": "#6f8d7b",
  "Self-Employed / Own Account": "#c89547",
  "Casual / Informal Work": "#8a8e9b",
  "Vocational Training": "#5e916a",
  "NEET - Caregiving Inactive": "#d46539",
  "NEET - Unemployed / Seeking": "#b84735",
};

export default function OverviewPage() {
  const [liveData, setLiveData] = useState<any>(null);

  React.useEffect(() => {
    getDashboardOverview().then((data) => {
      if (data) setLiveData(data);
    }).catch((err) => console.warn("Using offline dashboard fallback:", err));
  }, []);

  const trendData = liveData?.historical_trajectory || DEMO_OVERVIEW.historical_trend;
  const metrics = {
    ...DEMO_OVERVIEW.metrics,
    ...(liveData ? {
      total_youth_records: liveData.total_records || DEMO_OVERVIEW.metrics.total_youth_records,
      neet_prevalence_pct: liveData.overall_neet_rate || DEMO_OVERVIEW.metrics.neet_prevalence_pct,
      female_neet_rate: liveData.female_neet_rate || DEMO_OVERVIEW.metrics.female_neet_rate,
      male_neet_rate: liveData.male_neet_rate || DEMO_OVERVIEW.metrics.male_neet_rate,
      total_localities: liveData.localities_count || DEMO_OVERVIEW.metrics.total_localities,
    } : {})
  };

  const activityData = DEMO_OVERVIEW.activity_distribution.map((item) => ({
    ...item,
    color: EDITORIAL_ACTIVITY_COLORS[item.activity] || item.color,
  }));

  return (
    <div className="space-y-12">
      {/* Editorial Lead & Hero Focal Stat */}
      <section className="border-b border-[var(--border-hairline)] pb-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Heroic Metric Anchor */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center gap-2 text-xs font-sans text-saffron-500">
              <span className="font-serif italic font-semibold">§ 01</span>
              <span className="text-[var(--text-faint)]">/</span>
              <span>Longitudinal Youth Overview · 2026 Assessment</span>
            </div>

            <div className="flex flex-wrap items-baseline gap-4 pt-1">
              <span className="text-6xl lg:text-7xl font-serif font-bold text-[var(--text-main)] tracking-tight">
                {formatPercent(metrics.neet_prevalence_pct)}
              </span>
              <div className="space-y-0.5">
                <span className="text-xs font-serif italic text-[var(--text-muted)] block">
                  Observed youth NEET prevalence
                </span>
                <span className="text-[11px] font-sans text-sage-500 font-medium flex items-center gap-1">
                  <TrendingDown className="h-3 w-3" /> ▼ -2.3% since 2021 baseline (28.4%)
                </span>
              </div>
            </div>

            <p className="text-sm text-[var(--text-muted)] leading-relaxed max-w-2xl pt-2 font-sans">
              Across the 50,000-individual synthetic cohort spanning 20 representative localities, aggregate NEET prevalence shows a gradual secular contraction. However, macro stability conceals an acute gender divide: young women experience a <span className="text-saffron-500 font-semibold">{metrics.female_neet_rate}%</span> NEET incidence rate compared to <span className="text-prussian-400 font-semibold">{metrics.male_neet_rate}%</span> for young men — a <span className="text-[var(--text-main)] font-medium">28.4 percentage point disparity</span> anchored in unequal domestic caregiving burdens.
            </p>
          </div>

          {/* Secondary Stats Ledger Table */}
          <div className="lg:col-span-5 rounded border border-[var(--border-hairline)] bg-[var(--bg-surface)] p-6 space-y-4">
            <h4 className="text-xs font-serif font-semibold text-[var(--text-main)] uppercase tracking-wider pb-2 border-b border-[var(--border-hairline)]">
              Core Analytical Ledger
            </h4>
            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between py-1 border-b border-[var(--border-hairline)]">
                <span className="text-[var(--text-muted)]">Longitudinal Panel Records</span>
                <span className="font-mono font-medium text-[var(--text-main)]">{formatNumber(metrics.total_youth_records)}</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-[var(--border-hairline)]">
                <span className="text-[var(--text-muted)]">Localities Represented</span>
                <span className="font-mono font-medium text-[var(--text-main)]">{metrics.total_localities} Districts</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-[var(--border-hairline)]">
                <span className="text-[var(--text-muted)]">Female Inactivity Rate</span>
                <span className="font-mono font-semibold text-saffron-500">{metrics.female_neet_rate}%</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-[var(--border-hairline)]">
                <span className="text-[var(--text-muted)]">Male Inactivity Rate</span>
                <span className="font-mono font-semibold text-prussian-400">{metrics.male_neet_rate}%</span>
              </div>
              <div className="flex items-center justify-between py-1">
                <span className="text-[var(--text-muted)]">Best Predictive Model</span>
                <span className="font-mono text-sage-500 font-medium">AUC {metrics.best_model_auc} (XGBoost)</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trajectory & Strata Analysis */}
      <section className="space-y-6">
        <div className="flex items-baseline justify-between border-b border-[var(--border-hairline)] pb-3">
          <div>
            <h3 className="text-base font-serif font-semibold text-[var(--text-main)]">
              Historical Trajectory & Stratification
            </h3>
            <p className="text-xs text-[var(--text-muted)] font-sans mt-0.5">
              Six-wave evolution (2021–2026) disaggregated by demographic cohort
            </p>
          </div>
          <span className="text-[11px] font-mono text-[var(--text-faint)]">Waves W1–W6</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <ChartCard
            title="Six-Wave NEET Trajectory by Demographic Sub-Cohort"
            description="Longitudinal progression illustrating stubborn female inactivity versus fluctuating male transition"
            className="lg:col-span-8"
            heightClass="h-80"
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData} margin={{ top: 12, right: 24, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="2 4" stroke="var(--border-hairline)" vertical={false} />
                <XAxis dataKey="year" stroke="var(--text-muted)" tickLine={false} tick={{ fontSize: 11, fontFamily: "JetBrains Mono" }} />
                <YAxis stroke="var(--text-muted)" tickLine={false} tick={{ fontSize: 11, fontFamily: "JetBrains Mono" }} domain={[10, 50]} unit="%" />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "12px", fontFamily: "Instrument Sans" }} />
                <Line type="monotone" dataKey="female_rate" name="Female Youth" stroke="#d46539" strokeWidth={2.5} dot={{ r: 3, fill: "#d46539" }} activeDot={{ r: 5 }} />
                <Line type="monotone" dataKey="rural_rate" name="Rural Youth" stroke="#c89547" strokeWidth={1.75} strokeDasharray="3 3" dot={false} />
                <Line type="monotone" dataKey="overall_rate" name="Overall Cohort" stroke="#f4f2eb" strokeWidth={2} dot={{ r: 3, fill: "#f4f2eb" }} />
                <Line type="monotone" dataKey="male_rate" name="Male Youth" stroke="#446b82" strokeWidth={1.75} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard
            title="Incidence by Strata"
            description="Comparison across gender and geographic sector"
            className="lg:col-span-4"
            heightClass="h-80"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={[
                  { category: "Females", rate: metrics.female_neet_rate, fill: "#d46539" },
                  { category: "Rural", rate: metrics.rural_neet_rate, fill: "#c89547" },
                  { category: "Urban", rate: metrics.urban_neet_rate, fill: "#6f8d7b" },
                  { category: "Males", rate: metrics.male_neet_rate, fill: "#446b82" }
                ]}
                margin={{ top: 15, right: 15, left: -15, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="2 4" stroke="var(--border-hairline)" vertical={false} />
                <XAxis dataKey="category" stroke="var(--text-muted)" tickLine={false} tick={{ fontSize: 11, fontFamily: "Instrument Sans" }} />
                <YAxis stroke="var(--text-muted)" tickLine={false} tick={{ fontSize: 11, fontFamily: "JetBrains Mono" }} domain={[0, 50]} unit="%" />
                <Tooltip />
                <Bar dataKey="rate" name="NEET %" radius={[2, 2, 0, 0]}>
                  {[
                    <Cell key="0" fill="#d46539" />,
                    <Cell key="1" fill="#c89547" />,
                    <Cell key="2" fill="#6f8d7b" />,
                    <Cell key="3" fill="#446b82" />
                  ]}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      </section>

      {/* Age Cohort & Activity Decomposition */}
      <section className="space-y-6">
        <div className="flex items-baseline justify-between border-b border-[var(--border-hairline)] pb-3">
          <div>
            <h3 className="text-base font-serif font-semibold text-[var(--text-main)]">
              Life-Course Dynamics & Activity Partition
            </h3>
            <p className="text-xs text-[var(--text-muted)] font-sans mt-0.5">
              Age progression transitions and standard 4-state activity status decomposition
            </p>
          </div>
          <span className="text-[11px] font-mono text-[var(--text-faint)]">Ages 15–29</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartCard
            title="NEET Rate by Age Bracket (Life-Course Curve)"
            description="Peak vulnerability concentrates in the 21–23 window, reflecting marriage entry and post-study search"
            heightClass="h-72"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={DEMO_OVERVIEW.by_age_group} margin={{ top: 15, right: 20, left: -15, bottom: 0 }}>
                <CartesianGrid strokeDasharray="2 4" stroke="var(--border-hairline)" vertical={false} />
                <XAxis dataKey="age_group" stroke="var(--text-muted)" tickLine={false} tick={{ fontSize: 11, fontFamily: "JetBrains Mono" }} />
                <YAxis stroke="var(--text-muted)" tickLine={false} tick={{ fontSize: 11, fontFamily: "JetBrains Mono" }} domain={[0, 40]} unit="%" />
                <Tooltip />
                <Bar dataKey="neet_rate" name="NEET Rate %" fill="#c89547" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard
            title="Cohort Activity Distribution Partition"
            description="Decomposition into formal education, formal/informal labor, skilling, and inactive states"
            heightClass="h-72"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full items-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={activityData}
                    dataKey="pct"
                    nameKey="activity"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    innerRadius={50}
                    paddingAngle={1.5}
                  >
                    {activityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-1.5 text-xs pr-2">
                {activityData.map((item) => (
                  <div key={item.activity} className="flex items-center justify-between text-[11px]">
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                      <span className="text-[var(--text-muted)] truncate max-w-[140px]">{item.activity}</span>
                    </div>
                    <span className="font-mono font-medium text-[var(--text-main)]">{item.pct}%</span>
                  </div>
                ))}
              </div>
            </div>
          </ChartCard>
        </div>
      </section>

      {/* Priority Segments & Alerts */}
      <section className="space-y-6">
        <div className="flex items-baseline justify-between border-b border-[var(--border-hairline)] pb-3">
          <div>
            <h3 className="text-base font-serif font-semibold text-[var(--text-main)]">
              High-Risk Vulnerability Segments & Policy Alerts
            </h3>
            <p className="text-xs text-[var(--text-muted)] font-sans mt-0.5">
              Empirical priority clusters requiring targeted programmatic intervention
            </p>
          </div>
          <span className="text-[11px] font-mono text-[var(--text-faint)]">N=4 Clusters</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Segments Ruled Table */}
          <div className="lg:col-span-8 rounded border border-[var(--border-hairline)] bg-[var(--bg-surface)] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-[var(--bg-elevated)] text-[var(--text-muted)] border-b border-[var(--border-hairline)]">
                  <tr>
                    <th className="py-2.5 px-4 font-serif font-semibold">Priority Segment</th>
                    <th className="py-2.5 px-3 font-serif font-semibold">Est. Cohort</th>
                    <th className="py-2.5 px-3 font-serif font-semibold">Prevalence</th>
                    <th className="py-2.5 px-4 font-serif font-semibold">Primary Constraint</th>
                    <th className="py-2.5 px-4 font-serif font-semibold">Recommended Pathway</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border-hairline)] font-sans">
                  {DEMO_OVERVIEW.high_risk_segments.map((seg, idx) => (
                    <tr key={idx} className="hover:bg-[var(--bg-elevated)]/50 transition-colors">
                      <td className="py-3 px-4 font-medium text-[var(--text-main)]">{seg.segment_name}</td>
                      <td className="py-3 px-3 text-[var(--text-muted)] font-mono">{formatNumber(seg.estimated_size)}</td>
                      <td className="py-3 px-3">
                        <span className="font-mono font-bold text-saffron-500">{seg.neet_prevalence}%</span>
                      </td>
                      <td className="py-3 px-4 text-[var(--text-muted)]">{seg.key_barriers}</td>
                      <td className="py-3 px-4 text-prussian-400 font-medium">{seg.recommended_focus}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Analytical Intelligence Field Notes */}
          <div className="lg:col-span-4 rounded border border-[var(--border-hairline)] bg-[var(--bg-surface)] p-5 space-y-4">
            <h4 className="text-xs font-serif font-semibold text-[var(--text-main)] uppercase tracking-wider pb-2 border-b border-[var(--border-hairline)]">
              Analytical Field Dispatches
            </h4>
            <div className="space-y-3.5">
              {DEMO_OVERVIEW.analytical_alerts.map((alt) => (
                <div
                  key={alt.id}
                  className="p-3 rounded border border-[var(--border-hairline)] bg-[var(--bg-elevated)] text-xs space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-saffron-500 font-semibold uppercase tracking-wider">
                      {alt.severity} Dispatch
                    </span>
                    <span className="text-[10px] text-[var(--text-faint)] font-mono">2026.W6</span>
                  </div>
                  <h5 className="font-serif font-semibold text-[var(--text-main)] text-xs leading-snug">
                    {alt.title}
                  </h5>
                  <p className="text-[11px] text-[var(--text-muted)] leading-relaxed">
                    {alt.message}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

