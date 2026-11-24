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
    <div className="space-y-6">
      {/* Filters Bar */}
      <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-blue-400" />
          <span className="text-xs font-semibold text-slate-200">Population Filters:</span>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="w-40">
            <Select value={selectedGender} onChange={(e) => setSelectedGender(e.target.value)}>
              <option value="all">All Genders</option>
              <option value="female">Females Only</option>
              <option value="male">Males Only</option>
            </Select>
          </div>
          <div className="w-44">
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
              className="flex h-9 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-1 text-xs text-slate-100 placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Row 1: Population Pyramid & Education Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard
          title="Age-Gender Population Pyramid & NEET Burden"
          description="Total youth vs active NEET sub-cohort across age brackets"
          heightClass="h-80"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={PYRAMID_DATA} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="bracket" stroke="#94a3b8" tick={{ fontSize: 12 }} />
              <YAxis stroke="#94a3b8" tick={{ fontSize: 12 }} />
              <Tooltip
                contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", borderRadius: "8px", fontSize: "12px" }}
              />
              <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }} />
              <Bar dataKey="female_total" name="Female Youth Total" fill="#475569" radius={[4, 4, 0, 0]} />
              <Bar dataKey="female_neet" name="Female NEET" fill="#f43f5e" radius={[4, 4, 0, 0]} />
              <Bar dataKey="male_total" name="Male Youth Total" fill="#334155" radius={[4, 4, 0, 0]} />
              <Bar dataKey="male_neet" name="Male NEET" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          title="NEET Prevalence across Educational Attainment"
          description="Protective gradient of schooling, vocational credentials, and degrees"
          heightClass="h-80"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={EDUCATION_LEVELS} layout="vertical" margin={{ top: 10, right: 30, left: 80, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis type="number" stroke="#94a3b8" domain={[0, 45]} unit="%" tick={{ fontSize: 11 }} />
              <YAxis type="category" dataKey="level" stroke="#94a3b8" tick={{ fontSize: 11 }} width={120} />
              <Tooltip
                contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", borderRadius: "8px", fontSize: "12px" }}
              />
              <Bar dataKey="neet_rate" name="NEET Rate %" fill="#3b82f6" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Row 2: 20 Fictional Localities Breakdown Table */}
      <Card className="border-slate-800 bg-slate-900/90">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-sm">Geographic Locality Distribution (All 20 Fictional Districts)</CardTitle>
              <CardDescription>Observed cohort population, classification, and domestic care burden</CardDescription>
            </div>
            <Badge variant="outline">Showing {filteredLocalities.length} of 20 Localities</Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto max-h-96">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-950 text-slate-400 border-y border-slate-800 sticky top-0">
                <tr>
                  <th className="py-2.5 px-4 font-medium">Locality ID</th>
                  <th className="py-2.5 px-4 font-medium">District Name</th>
                  <th className="py-2.5 px-4 font-medium">Ecological / Economic Type</th>
                  <th className="py-2.5 px-4 font-medium">Sample Youth Population</th>
                  <th className="py-2.5 px-4 font-medium">Observed NEET Rate</th>
                  <th className="py-2.5 px-4 font-medium">Median Care Hours</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {filteredLocalities.map((loc) => (
                  <tr key={loc.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-2.5 px-4 text-slate-500">{loc.id}</td>
                    <td className="py-2.5 px-4 font-semibold text-slate-200 font-sans">{loc.name}</td>
                    <td className="py-2.5 px-4 text-slate-300 font-sans">{loc.type}</td>
                    <td className="py-2.5 px-4 text-slate-300">{formatNumber(loc.population)}</td>
                    <td className="py-2.5 px-4">
                      <span
                        className={`font-bold ${
                          loc.neet_rate > 32
                            ? "text-rose-400"
                            : loc.neet_rate > 26
                            ? "text-amber-400"
                            : "text-emerald-400"
                        }`}
                      >
                        {loc.neet_rate}%
                      </span>
                    </td>
                    <td className="py-2.5 px-4 text-slate-400">{loc.care_hours} hrs/day</td>
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
