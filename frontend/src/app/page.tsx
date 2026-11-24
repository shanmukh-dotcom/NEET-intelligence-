"use client";

import React, { useState } from "react";
import {
  Users,
  MapPin,
  TrendingDown,
  Brain,
  Database,
  ArrowRight,
  AlertTriangle,
  CheckCircle2,
  Info,
  Calendar,
  Filter
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

import { StatCard } from "@/components/ui/stat-card";
import { ChartCard } from "@/components/ui/chart-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Select } from "@/components/ui/input";
import { DEMO_OVERVIEW, DEMO_LOCALITIES } from "@/lib/demo-data";
import { formatNumber, formatPercent } from "@/lib/utils";
import { getDashboardOverview } from "@/lib/api-client";

export default function OverviewPage() {
  const [selectedSector, setSelectedSector] = useState("all");
  const [selectedGender, setSelectedGender] = useState("all");
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

  return (
    <div className="space-y-6">
      {/* Disclaimer Banner */}
      <div className="rounded-xl border border-amber-500/30 bg-amber-950/20 p-4 text-xs text-amber-200/90 flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <Info className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-amber-300">DEMONSTRATION RESEARCH WORKSPACE (SYNTHETIC BENCHMARK): </span>
            All analytical statistics, Markov transition flows, and risk predictions displayed across this interface originate
            from a calibrated 50,000-individual synthetic demonstration panel. They do not represent official Indian government microdata.
          </div>
        </div>
        <Badge variant="synthetic">SYNTHETIC DATA</Badge>
      </div>

      {/* Row 1: Key Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          title="Total Youth Analysed"
          value={formatNumber(metrics.total_youth_records)}
          subValue="Across 6 waves"
          icon={<Users className="h-4 w-4" />}
          badge="SYNTHETIC"
        />
        <StatCard
          title="Localities Represented"
          value={metrics.total_localities}
          subValue="Agrarian & Urban"
          icon={<MapPin className="h-4 w-4" />}
          badge="20 DISTRICTS"
        />
        <StatCard
          title="Observed NEET Rate"
          value={formatPercent(metrics.neet_prevalence_pct)}
          subValue="Wave 6 (2026)"
          change="▼ -2.3% since 2021"
          changeType="positive"
          icon={<TrendingDown className="h-4 w-4" />}
        />
        <StatCard
          title="Female vs Male Gap"
          value={`${metrics.female_neet_rate}% / ${metrics.male_neet_rate}%`}
          subValue="28.4% point gap"
          changeType="negative"
          change="Severe disparity"
        />
        <StatCard
          title="Best Model AUC"
          value={metrics.best_model_auc}
          subValue="XGBoost Classifier"
          icon={<Brain className="h-4 w-4" />}
          change="Test ROC-AUC"
          changeType="positive"
        />
      </div>

      {/* Row 2: Historical Trajectory & Gender Decomposition */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ChartCard
          title="Historical Youth NEET Prevalence Trend (2021–2026)"
          description="Longitudinal trajectory stratified by demographic sub-cohorts"
          className="lg:col-span-2"
          heightClass="h-80"
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trendData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="year" stroke="#94a3b8" tick={{ fontSize: 12 }} />
              <YAxis stroke="#94a3b8" tick={{ fontSize: 12 }} domain={[10, 50]} unit="%" />
              <Tooltip
                contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", borderRadius: "8px", fontSize: "12px" }}
              />
              <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }} />
              <Line type="monotone" dataKey="overall_rate" name="Overall Cohort" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              <Line type="monotone" dataKey="female_rate" name="Female Youth" stroke="#f43f5e" strokeWidth={2} strokeDasharray="4 4" />
              <Line type="monotone" dataKey="rural_rate" name="Rural Youth" stroke="#f59e0b" strokeWidth={2} />
              <Line type="monotone" dataKey="male_rate" name="Male Youth" stroke="#10b981" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          title="Gender & Geographic Concentration"
          description="Observed NEET incidence rates across strata"
          heightClass="h-80"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={[
                { category: "Females", rate: metrics.female_neet_rate, fill: "#f43f5e" },
                { category: "Males", rate: metrics.male_neet_rate, fill: "#10b981" },
                { category: "Rural", rate: metrics.rural_neet_rate, fill: "#f59e0b" },
                { category: "Urban", rate: metrics.urban_neet_rate, fill: "#3b82f6" }
              ]}
              margin={{ top: 20, right: 20, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="category" stroke="#94a3b8" tick={{ fontSize: 12 }} />
              <YAxis stroke="#94a3b8" tick={{ fontSize: 12 }} domain={[0, 50]} unit="%" />
              <Tooltip
                contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", borderRadius: "8px", fontSize: "12px" }}
              />
              <Bar dataKey="rate" name="NEET %" radius={[6, 6, 0, 0]}>
                {[
                  <Cell key="0" fill="#f43f5e" />,
                  <Cell key="1" fill="#10b981" />,
                  <Cell key="2" fill="#f59e0b" />,
                  <Cell key="3" fill="#3b82f6" />
                ]}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Row 3: Age Bracket & Activity Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard
          title="NEET Prevalence by Age Bracket"
          description="Life-course transition from schooling to peak marriage/search window"
          heightClass="h-72"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={DEMO_OVERVIEW.by_age_group} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="age_group" stroke="#94a3b8" tick={{ fontSize: 12 }} />
              <YAxis stroke="#94a3b8" tick={{ fontSize: 12 }} domain={[0, 40]} unit="%" />
              <Tooltip
                contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", borderRadius: "8px", fontSize: "12px" }}
              />
              <Bar dataKey="neet_rate" name="NEET Rate %" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          title="Youth Activity Distribution Partition"
          description="Standard 4-State partition with NEET sub-activity decomposition"
          heightClass="h-72"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full items-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={DEMO_OVERVIEW.activity_distribution}
                  dataKey="pct"
                  nameKey="activity"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  innerRadius={45}
                  paddingAngle={2}
                >
                  {DEMO_OVERVIEW.activity_distribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", borderRadius: "8px", fontSize: "12px" }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-1.5 text-xs pr-4">
              {DEMO_OVERVIEW.activity_distribution.map((item) => (
                <div key={item.activity} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-slate-300 truncate max-w-[150px]">{item.activity}</span>
                  </div>
                  <span className="font-semibold text-slate-100">{item.pct}%</span>
                </div>
              ))}
            </div>
          </div>
        </ChartCard>
      </div>

      {/* Row 4: High-Risk Segments & Analytical Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 border-slate-800 bg-slate-900/90">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-sm">High-Risk Vulnerability Segments</CardTitle>
                <p className="text-xs text-slate-400 mt-1">Identified priority clusters requiring targeted policy response</p>
              </div>
              <Badge variant="outline">4 Priority Segments</Badge>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-950/80 text-slate-400 border-y border-slate-800">
                  <tr>
                    <th className="py-2.5 px-4 font-medium">Population Segment</th>
                    <th className="py-2.5 px-3 font-medium">Est. Cohort</th>
                    <th className="py-2.5 px-3 font-medium">NEET Rate</th>
                    <th className="py-2.5 px-4 font-medium">Key Driver / Barrier</th>
                    <th className="py-2.5 px-4 font-medium">Policy Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {DEMO_OVERVIEW.high_risk_segments.map((seg, idx) => (
                    <tr key={idx} className="hover:bg-slate-800/30 transition-colors">
                      <td className="py-3 px-4 font-medium text-slate-200">{seg.segment_name}</td>
                      <td className="py-3 px-3 text-slate-400 font-mono">{formatNumber(seg.estimated_size)}</td>
                      <td className="py-3 px-3">
                        <span className="font-bold text-rose-400">{seg.neet_prevalence}%</span>
                      </td>
                      <td className="py-3 px-4 text-slate-400">{seg.key_barriers}</td>
                      <td className="py-3 px-4 text-blue-400">{seg.recommended_focus}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Analytical Alerts Feed */}
        <Card className="border-slate-800 bg-slate-900/90">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm">Analytical Intelligence Alerts</CardTitle>
              <Badge variant="default">LIVE FEED</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3 p-4">
            {DEMO_OVERVIEW.analytical_alerts.map((alt) => (
              <div
                key={alt.id}
                className="p-3 rounded-lg border border-slate-800 bg-slate-950/60 text-xs space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    {alt.severity === "Warning" && <AlertTriangle className="h-3.5 w-3.5 text-amber-400" />}
                    {alt.severity === "Info" && <CheckCircle2 className="h-3.5 w-3.5 text-blue-400" />}
                    {alt.severity === "Notice" && <Info className="h-3.5 w-3.5 text-teal-400" />}
                    <span className="font-semibold text-slate-200">{alt.title}</span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono">Recent</span>
                </div>
                <p className="text-slate-400 leading-relaxed">{alt.message}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
