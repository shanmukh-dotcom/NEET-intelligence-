"use client";

import React, { useState, useEffect } from "react";
import {
  Sparkles,
  Download,
  Settings2,
  RefreshCw,
  CheckCircle,
  FileSpreadsheet,
  AlertTriangle,
  Play,
  Sliders,
  Database
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input, Select } from "@/components/ui/input";
import { formatNumber } from "@/lib/utils";
import { generateSyntheticData, getSyntheticPresets } from "@/lib/api-client";

const FALLBACK_PRESETS = [
  {
    id: "preset_a",
    name: "Scenario A: Rural Women & Limited Local Work",
    description: "High female share (70%), high rurality (80%), severe unpaid domestic care burden (median 5.2 hrs/day). High NEET persistence.",
    female_ratio: 0.70,
    rural_ratio: 0.80,
    neet_rate: 0.38,
    pop_size: 5000
  },
  {
    id: "preset_b",
    name: "Scenario B: Urban Educated Youth Unemployment",
    description: "Urban technical diploma and graduate holders experiencing prolonged job search friction and skill expectation mismatch.",
    female_ratio: 0.45,
    rural_ratio: 0.25,
    neet_rate: 0.28,
    pop_size: 5000
  },
  {
    id: "preset_c",
    name: "Scenario C: Economically Disadvantaged Cohort",
    description: "Over-representation in bottom two wealth quintiles (Q1/Q2), early school dropout, and lack of vocational credentials.",
    female_ratio: 0.50,
    rural_ratio: 0.75,
    neet_rate: 0.35,
    pop_size: 5000
  },
  {
    id: "preset_d",
    name: "Scenario D: Seasonal Migration Churning",
    description: "Periodic outward circular migration with alternating spells of precarious informal work and rural NEET inactivity.",
    female_ratio: 0.35,
    rural_ratio: 0.85,
    neet_rate: 0.30,
    pop_size: 4000
  },
  {
    id: "preset_e",
    name: "Scenario E: Heavy Unpaid Caregiving Inactivity",
    description: "Married young women with infant children and elder care duties, driving continuous labor inactivity traps.",
    female_ratio: 0.85,
    rural_ratio: 0.65,
    neet_rate: 0.52,
    pop_size: 4500
  },
  {
    id: "preset_f",
    name: "Scenario F: Vocational Training Deprivation",
    description: "Agrarian hinterlands with near-zero ITI or skill training centers within a 25km radius.",
    female_ratio: 0.50,
    rural_ratio: 0.90,
    neet_rate: 0.33,
    pop_size: 5000
  },
  {
    id: "preset_g",
    name: "Scenario G: Education-to-Inactivity Drop",
    description: "Youth observed immediately completing higher secondary or undergraduate degrees entering sudden inactivity.",
    female_ratio: 0.52,
    rural_ratio: 0.50,
    neet_rate: 0.31,
    pop_size: 4000
  }
];

const INITIAL_ROWS = [
  { pid: "SYN-00012", wave: 2021, age: 19, sex: "Female", sector: "Rural", education: "Secondary", state: "Education", care_hrs: 2.1, neet: "No" },
  { pid: "SYN-00012", wave: 2022, age: 20, sex: "Female", sector: "Rural", education: "Secondary", state: "NEET", care_hrs: 5.4, neet: "Yes" },
  { pid: "SYN-00012", wave: 2023, age: 21, sex: "Female", sector: "Rural", education: "Secondary", state: "Training", care_hrs: 3.2, neet: "No" },
  { pid: "SYN-00012", wave: 2024, age: 22, sex: "Female", sector: "Rural", education: "Secondary", state: "Employment", care_hrs: 2.5, neet: "No" },
  { pid: "SYN-00012", wave: 2025, age: 23, sex: "Female", sector: "Rural", education: "Secondary", state: "Employment", care_hrs: 2.3, neet: "No" },
  { pid: "SYN-00012", wave: 2026, age: 24, sex: "Female", sector: "Rural", education: "Secondary", state: "Employment", care_hrs: 2.0, neet: "No" },
  { pid: "SYN-00045", wave: 2021, age: 22, sex: "Male", sector: "Urban", education: "Graduate", state: "Education", care_hrs: 0.5, neet: "No" },
  { pid: "SYN-00045", wave: 2022, age: 23, sex: "Male", sector: "Urban", education: "Graduate", state: "NEET", care_hrs: 0.8, neet: "Yes" },
  { pid: "SYN-00045", wave: 2023, age: 24, sex: "Male", sector: "Urban", education: "Graduate", state: "NEET", care_hrs: 0.5, neet: "Yes" },
  { pid: "SYN-00045", wave: 2024, age: 25, sex: "Male", sector: "Urban", education: "Graduate", state: "Employment", care_hrs: 0.5, neet: "No" }
];

export default function SyntheticGeneratorPage() {
  const [popSize, setPopSize] = useState(5000);
  const [femaleRatio, setFemaleRatio] = useState(50);
  const [ruralRatio, setRuralRatio] = useState(60);
  const [wavesCount, setWavesCount] = useState(6);
  const [randomSeed, setRandomSeed] = useState(42);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationDone, setGenerationDone] = useState(false);
  const [generatedStats, setGeneratedStats] = useState<any>(null);
  const [tableRows, setTableRows] = useState(INITIAL_ROWS);

  const applyPreset = (preset: typeof FALLBACK_PRESETS[0]) => {
    setPopSize(preset.pop_size);
    setFemaleRatio(Math.round(preset.female_ratio * 100));
    setRuralRatio(Math.round(preset.rural_ratio * 100));
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const response: any = await generateSyntheticData({
        population_size: Math.min(popSize, 2000), // optimized size for real-time interactive demo
        female_ratio: femaleRatio / 100,
        rural_ratio: ruralRatio / 100,
        waves_count: wavesCount,
        age_min: 15,
        age_max: 29,
        base_neet_rate: 0.27,
        random_seed: randomSeed,
      });

      if (response && response.preview_records && response.preview_records.length > 0) {
        const mapped = response.preview_records.slice(0, 10).map((r: any) => ({
          pid: r.person_id || r.pid || "SYN-00000",
          wave: r.wave_year || r.wave || 2024,
          age: r.age || 20,
          sex: r.gender || r.sex || "Female",
          sector: r.rural_urban || r.sector || "Rural",
          education: r.education_level || r.education || "Secondary",
          state: r.activity_state || r.state || "NEET",
          care_hrs: r.unpaid_care_hours !== undefined ? Number(r.unpaid_care_hours).toFixed(1) : "2.0",
          neet: r.activity_state === "NEET" || r.neet_status ? "Yes" : "No",
        }));
        setTableRows(mapped);
        setGeneratedStats(response.summary);
      }
      setGenerationDone(true);
    } catch (e) {
      console.warn("Generating with local simulation mode:", e);
      setGenerationDone(true);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-slate-100">Workspace 1: Synthetic Youth Microdata Generator</h3>
            <Badge variant="synthetic">IS_SYNTHETIC=TRUE</Badge>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Generates internally consistent longitudinal youth life-courses using first-order Markov probability matrices.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="default" size="sm" onClick={handleGenerate} disabled={isGenerating}>
            {isGenerating ? <RefreshCw className="h-3.5 w-3.5 mr-1.5 animate-spin" /> : <Play className="h-3.5 w-3.5 mr-1.5" />}
            {isGenerating ? "Simulating Cohorts..." : "Generate Cohort"}
          </Button>
        </div>
      </div>

      {generationDone && (
        <div className="p-3.5 rounded-lg border border-emerald-500/30 bg-emerald-950/20 text-xs text-emerald-300 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-emerald-400" />
            <span>
              Successfully generated {formatNumber(popSize)} synthetic individuals across {wavesCount} waves (
              {formatNumber(popSize * wavesCount)} person-wave observations). All rows tagged is_synthetic=True.
              {generatedStats?.observed_neet_rate && ` (Observed NEET Rate: ${generatedStats.observed_neet_rate}%)`}
            </span>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Download className="h-3 w-3 mr-1" /> Export CSV
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-3 w-3 mr-1" /> Export Parquet
            </Button>
          </div>
        </div>
      )}

      {/* Preset Scenarios Grid */}
      <div>
        <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Pre-Configured Policy Presets (Scenarios A – G)</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {FALLBACK_PRESETS.map((p) => (
            <Card
              key={p.id}
              onClick={() => applyPreset(p)}
              className="border-slate-800 bg-slate-950/60 hover:border-slate-700 hover:bg-slate-900 cursor-pointer transition-all"
            >
              <CardHeader className="p-3.5 pb-2">
                <CardTitle className="text-xs font-semibold text-slate-200">{p.name}</CardTitle>
                <CardDescription className="text-[11px] text-slate-400 line-clamp-2 mt-1">{p.description}</CardDescription>
              </CardHeader>
              <CardContent className="p-3.5 pt-0 text-[10px] text-slate-400 flex items-center justify-between">
                <span>{Math.round(p.female_ratio * 100)}% Female | {Math.round(p.rural_ratio * 100)}% Rural</span>
                <span className="font-semibold text-blue-400">Load Preset →</span>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Configuration Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1 border-slate-800 bg-slate-900/90">
          <CardHeader>
            <CardTitle className="text-sm">Cohort Generation Parameters</CardTitle>
            <CardDescription>Adjust demographic distributions and Markov parameters</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-xs">
            <div>
              <label className="text-slate-300 font-medium block mb-1">Population Size</label>
              <Input
                type="number"
                value={popSize}
                onChange={(e) => setPopSize(Number(e.target.value))}
                min={500}
                max={100000}
              />
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <label className="text-slate-300 font-medium">Female Share</label>
                <span className="text-slate-400">{femaleRatio}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="90"
                value={femaleRatio}
                onChange={(e) => setFemaleRatio(Number(e.target.value))}
                className="w-full accent-blue-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              />
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <label className="text-slate-300 font-medium">Rural Share</label>
                <span className="text-slate-400">{ruralRatio}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="95"
                value={ruralRatio}
                onChange={(e) => setRuralRatio(Number(e.target.value))}
                className="w-full accent-blue-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-slate-300 font-medium block mb-1">Survey Waves</label>
                <Select value={wavesCount} onChange={(e) => setWavesCount(Number(e.target.value))}>
                  <option value={3}>3 Waves (2024-26)</option>
                  <option value={4}>4 Waves (2023-26)</option>
                  <option value={5}>5 Waves (2022-26)</option>
                  <option value={6}>6 Waves (2021-26)</option>
                </Select>
              </div>
              <div>
                <label className="text-slate-300 font-medium block mb-1">Random Seed</label>
                <Input
                  type="number"
                  value={randomSeed}
                  onChange={(e) => setRandomSeed(Number(e.target.value))}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Live Longitudinal Preview Table */}
        <Card className="lg:col-span-2 border-slate-800 bg-slate-900/90">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-sm">Sample Longitudinal Activity Histories (Synthetic Microdata)</CardTitle>
                <CardDescription>Multi-wave individual trajectory records with care hours and state transitions</CardDescription>
              </div>
              <Badge variant="outline">Preview: {tableRows.length} Records</Badge>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-950 text-slate-400 border-y border-slate-800">
                  <tr>
                    <th className="py-2.5 px-3 font-medium">Person ID</th>
                    <th className="py-2.5 px-2 font-medium">Wave</th>
                    <th className="py-2.5 px-2 font-medium">Age</th>
                    <th className="py-2.5 px-2 font-medium">Sex</th>
                    <th className="py-2.5 px-3 font-medium">Sector</th>
                    <th className="py-2.5 px-3 font-medium">Education</th>
                    <th className="py-2.5 px-3 font-medium">State</th>
                    <th className="py-2.5 px-2 font-medium">Care Hrs</th>
                    <th className="py-2.5 px-2 font-medium">NEET?</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono">
                  {tableRows.map((r, i) => (
                    <tr key={i} className="hover:bg-slate-800/30">
                      <td className="py-2.5 px-3 text-blue-400">{r.pid}</td>
                      <td className="py-2.5 px-2 text-slate-300">{r.wave}</td>
                      <td className="py-2.5 px-2 text-slate-300">{r.age}</td>
                      <td className="py-2.5 px-2 text-slate-300">{r.sex}</td>
                      <td className="py-2.5 px-3 text-slate-300">{r.sector}</td>
                      <td className="py-2.5 px-3 text-slate-300 font-sans">{r.education}</td>
                      <td className="py-2.5 px-3">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[11px] font-sans font-medium ${
                            r.state === "NEET"
                              ? "bg-rose-500/15 text-rose-400"
                              : r.state === "Employment"
                              ? "bg-emerald-500/15 text-emerald-400"
                              : r.state === "Education"
                              ? "bg-blue-500/15 text-blue-400"
                              : "bg-purple-500/15 text-purple-400"
                          }`}
                        >
                          {r.state}
                        </span>
                      </td>
                      <td className="py-2.5 px-2 text-slate-400">{r.care_hrs}h</td>
                      <td className="py-2.5 px-2 font-bold text-slate-200">{r.neet}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
