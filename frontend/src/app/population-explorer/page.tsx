"use client";

import React, { useState } from "react";
import {
  Users,
  MapPin,
  Filter,
  GraduationCap,
  Briefcase,
  Home,
  Clock,
  ArrowUpDown
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
  Cell
} from "recharts";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { ChartCard } from "@/components/ui/chart-card";
import { Select } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { DEMO_LOCALITIES, DEMO_OVERVIEW } from "@/lib/demo-data";
import { formatNumber } from "@/lib/utils";

const PYRAMID_DATA = [
  { bracket: "15-17", male_total: 4800, male_neet: 320, female_total: 4600, female_neet: 840 },
  { bracket: "18-20", male_total: 5600, male_neet: 680, female_total: 5400, female_neet: 2150 },
  { bracket: "21-23", male_total: 5900, male_neet: 980, female_total: 5700, female_neet: 2890 },
  { bracket: "24-26", male_total: 5100, male_neet: 740, female_total: 4900, female_neet: 2510 },
  { bracket: "27-29", male_total: 4200, male_neet: 490, female_total: 4100, female_neet: 1920 }
];

const EDUCATION_LEVELS = [
  { level: "No formal education", pct_pop: 5.2, neet_rate: 38.4 },
  { level: "Primary (1-5)", pct_pop: 10.4, neet_rate: 34.2 },
  { level: "Upper primary (6-8)", pct_pop: 18.6, neet_rate: 29.8 },
  { level: "Secondary (9-10)", pct_pop: 27.5, neet_rate: 27.1 },
  { level: "Higher secondary (11-12)", pct_pop: 22.1, neet_rate: 23.4 },
  { level: "Graduate", pct_pop: 13.8, neet_rate: 21.0 },
  { level: "Postgraduate", pct_pop: 2.4, neet_rate: 16.5 }
];

export default function PopulationExplorerPage() {
  const [selectedGender, setSelectedGender] = useState("all");
  const [selectedSector, setSelectedSector] = useState("all");
  const [searchLocality, setSearchLocality] = useState("");

  const filteredLocalities = DEMO_LOCALITIES.filter((loc) => {
    if (selectedSector === "rural" && !loc.type.toLowerCase().includes("rural")) return false;
    if (selectedSector === "urban" && !loc.type.toLowerCase().includes("urban")) return false;
    if (searchLocality && !loc.name.toLowerCase().includes(searchLocality.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-8">
      {/* Editorial Chapter Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-[var(--border-hairline)]">
        <div>
          <div className="flex items-center gap-2 text-xs font-sans text-saffron-500">
            <span className="font-serif italic font-semibold">Chapter I</span>
            <span className="text-[var(--text-faint)]">/</span>
            <span>Demographic Stratification</span>
          </div>
          <h2 className="text-xl font-serif font-semibold text-[var(--text-main)] mt-1">
            Population & Locality Explorer
          </h2>
          <p className="text-xs text-[var(--text-muted)] font-sans mt-0.5">
            Cross-sectional demographic profiles, age pyramids, and district-level vulnerability breakdowns across 20 representative localities.
          </p>
        </div>
      </div>

      {/* Ruled Filter Bar */}
      <div className="p-4 rounded border border-[var(--border-hairline)] bg-[var(--bg-surface)] flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Filter className="h-3.5 w-3.5 text-saffron-500" />
          <span className="text-xs font-serif font-semibold text-[var(--text-main)]">Filter Sub-Cohorts:</span>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="w-40">
            <Select value={selectedGender} onChange={(e) => setSelectedGender(e.target.value)}>
              <option value="all">All Genders</option>
              <option value="female">Females Only</option>
              <option value="male">Males Only</option>
            </Select>
          </div>
          <div className="w-48">
            <Select value={selectedSector} onChange={(e) => setSelectedSector(e.target.value)}>
              <option value="all">All Sectors (Rural/Urban)</option>
              <option value="rural">Rural Localities</option>
              <option value="urban">Urban Localities</option>
            </Select>
          </div>
          <div className="w-48">
            <input
              type="text"
              placeholder="Search 20 Localities..."
              value={searchLocality}
              onChange={(e) => setSearchLocality(e.target.value)}
              className="flex h-9 w-full rounded border border-[var(--border-hairline)] bg-[var(--bg-elevated)] px-3 py-1 text-xs text-[var(--text-main)] placeholder:text-[var(--text-faint)] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-saffron-500 font-sans"
            />
          </div>
        </div>
      </div>

      {/* Row 1: Population Pyramid & Education Distribution Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard
          title="Age-Gender Population Pyramid & NEET Burden"
          description="Total youth vs active NEET sub-cohort across age brackets"
          heightClass="h-80"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={PYRAMID_DATA} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="2 2" stroke="var(--border-hairline)" vertical={false} />
              <XAxis dataKey="bracket" stroke="var(--text-faint)" tick={{ fontSize: 11 }} />
              <YAxis stroke="var(--text-faint)" tick={{ fontSize: 11 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--bg-elevated)",
                  borderColor: "var(--border-hairline)",
                  borderRadius: "4px",
                  fontSize: "12px",
                  color: "var(--text-main)"
                }}
              />
              <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "12px" }} />
              <Bar dataKey="female_total" name="Female Youth Total" fill="#94a3b8" radius={[2, 2, 0, 0]} />
              <Bar dataKey="female_neet" name="Female NEET" fill="#d46539" radius={[2, 2, 0, 0]} />
              <Bar dataKey="male_total" name="Male Youth Total" fill="#475569" radius={[2, 2, 0, 0]} />
              <Bar dataKey="male_neet" name="Male NEET" fill="#446b82" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          title="NEET Prevalence across Educational Attainment"
          description="Protective gradient of schooling, vocational credentials, and degrees"
          heightClass="h-80"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={EDUCATION_LEVELS} layout="vertical" margin={{ top: 10, right: 30, left: 100, bottom: 0 }}>
              <CartesianGrid strokeDasharray="2 2" stroke="var(--border-hairline)" horizontal={false} />
              <XAxis type="number" stroke="var(--text-faint)" domain={[0, 45]} unit="%" tick={{ fontSize: 11 }} />
              <YAxis type="category" dataKey="level" stroke="var(--text-faint)" tick={{ fontSize: 11 }} width={120} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--bg-elevated)",
                  borderColor: "var(--border-hairline)",
                  borderRadius: "4px",
                  fontSize: "12px",
                  color: "var(--text-main)"
                }}
              />
              <Bar dataKey="neet_rate" name="NEET Rate %" fill="#d46539" radius={[0, 2, 2, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Row 2: 20 Fictional Localities Breakdown Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-sm">Geographic Locality Distribution (All 20 Fictional Districts)</CardTitle>
              <CardDescription>Observed cohort population, classification, and domestic care burden</CardDescription>
            </div>
            <Badge variant="outline" className="font-mono text-[10px]">
              Showing {filteredLocalities.length} of 20 Localities
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto max-h-96">
            <table className="w-full text-xs text-left">
              <thead className="bg-[var(--bg-elevated)] text-[var(--text-muted)] border-y border-[var(--border-hairline)] sticky top-0">
                <tr>
                  <th className="py-2.5 px-4 font-medium">Locality ID</th>
                  <th className="py-2.5 px-4 font-medium">District Name</th>
                  <th className="py-2.5 px-4 font-medium">Ecological / Economic Type</th>
                  <th className="py-2.5 px-4 font-medium">Sample Youth Population</th>
                  <th className="py-2.5 px-4 font-medium">Observed NEET Rate</th>
                  <th className="py-2.5 px-4 font-medium">Median Care Hours</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-hairline)] font-mono">
                {filteredLocalities.map((loc) => (
                  <tr key={loc.id} className="hover:bg-[var(--bg-elevated)]/60 transition-colors">
                    <td className="py-2.5 px-4 text-[var(--text-faint)]">{loc.id}</td>
                    <td className="py-2.5 px-4 font-serif font-semibold text-[var(--text-main)]">{loc.name}</td>
                    <td className="py-2.5 px-4 text-[var(--text-muted)] font-sans">{loc.type}</td>
                    <td className="py-2.5 px-4 text-[var(--text-muted)]">{formatNumber(loc.population)}</td>
                    <td className="py-2.5 px-4">
                      <span
                        className={`font-semibold ${
                          loc.neet_rate > 32
                            ? "text-saffron-500"
                            : loc.neet_rate > 26
                            ? "text-ochre-500"
                            : "text-sage-500"
                        }`}
                      >
                        {loc.neet_rate}%
                      </span>
                    </td>
                    <td className="py-2.5 px-4 text-[var(--text-faint)]">{loc.care_hours} hrs/day</td>
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
