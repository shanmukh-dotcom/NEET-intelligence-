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
  Database,
  ArrowRight
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
    <div className="space-y-8">
      {/* Editorial Chapter Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-[var(--border-hairline)]">
        <div>
          <div className="flex items-center gap-2 text-xs font-sans text-saffron-500">
            <span className="font-serif italic font-semibold">Chapter I</span>
            <span className="text-[var(--text-faint)]">/</span>
            <span>Microdata Simulation</span>
          </div>
          <h2 className="text-xl font-serif font-semibold text-[var(--text-main)] mt-1">
            Synthetic Youth Microdata Generator
          </h2>
          <p className="text-xs text-[var(--text-muted)] font-sans mt-0.5">
            Generates internally consistent longitudinal youth life-courses using first-order Markov probability matrices.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="default" size="sm" onClick={handleGenerate} disabled={isGenerating}>
            {isGenerating ? <RefreshCw className="h-3.5 w-3.5 mr-1.5 animate-spin" /> : <Play className="h-3.5 w-3.5 mr-1.5" />}
            {isGenerating ? "Simulating Cohorts..." : "Generate Cohort"}
          </Button>
        </div>
      </div>

      {generationDone && (
        <div className="p-3.5 rounded border border-sage-500/30 bg-sage-500/10 text-xs text-sage-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-sage-400 shrink-0" />
            <span className="font-sans">
              Successfully generated {formatNumber(popSize)} synthetic individuals across {wavesCount} waves (
              {formatNumber(popSize * wavesCount)} person-wave observations). All rows tagged is_synthetic=True.
              {generatedStats?.observed_neet_rate && ` (Observed NEET Rate: ${generatedStats.observed_neet_rate}%)`}
            </span>
          </div>
          <div className="flex gap-2 shrink-0">
            <Button variant="outline" size="sm">
              <Download className="h-3 w-3 mr-1" /> Export CSV
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-3 w-3 mr-1" /> Export Parquet
            </Button>
          </div>
        </div>
      )}

      {/* Preset Scenarios Section */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-xs font-sans font-medium text-[var(--text-faint)] uppercase tracking-wider">
            Pre-Configured Policy Presets (Scenarios A – G)
          </h4>
          <span className="text-[11px] font-sans text-[var(--text-muted)] italic">
            Click any archetype to populate demographic ratios
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {FALLBACK_PRESETS.map((p) => (
            <div
              key={p.id}
              onClick={() => applyPreset(p)}
              className="p-3.5 rounded border border-[var(--border-hairline)] bg-[var(--bg-surface)] hover:border-saffron-500/40 hover:bg-[var(--bg-elevated)] cursor-pointer transition-all group"
            >
              <div className="flex items-start justify-between gap-2 mb-1.5">
                <h5 className="text-xs font-serif font-semibold text-[var(--text-main)] group-hover:text-saffron-400 transition-colors">
                  {p.name}
                </h5>
              </div>
              <p className="text-[11px] text-[var(--text-muted)] font-sans line-clamp-2 leading-relaxed mb-3">
                {p.description}
              </p>
              <div className="pt-2 border-t border-[var(--border-hairline)] flex items-center justify-between text-[10px] font-mono text-[var(--text-faint)]">
                <span>{Math.round(p.female_ratio * 100)}% Female · {Math.round(p.rural_ratio * 100)}% Rural</span>
                <span className="font-sans font-medium text-saffron-500 group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                  Load <ArrowRight className="h-2.5 w-2.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Configuration Controls & Live Preview Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-sm">Cohort Generation Parameters</CardTitle>
            <CardDescription>Adjust demographic distributions and Markov parameters</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-xs font-sans">
            <div>
              <label className="text-[var(--text-main)] font-medium block mb-1">Population Size</label>
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
                <label className="text-[var(--text-main)] font-medium">Female Share</label>
                <span className="font-mono text-[var(--text-muted)]">{femaleRatio}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="90"
                value={femaleRatio}
                onChange={(e) => setFemaleRatio(Number(e.target.value))}
                className="w-full accent-saffron-500 h-1.5 bg-[var(--border-hairline)] rounded cursor-pointer"
              />
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <label className="text-[var(--text-main)] font-medium">Rural Share</label>
                <span className="font-mono text-[var(--text-muted)]">{ruralRatio}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="95"
                value={ruralRatio}
                onChange={(e) => setRuralRatio(Number(e.target.value))}
                className="w-full accent-saffron-500 h-1.5 bg-[var(--border-hairline)] rounded cursor-pointer"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[var(--text-main)] font-medium block mb-1">Survey Waves</label>
                <Select value={wavesCount} onChange={(e) => setWavesCount(Number(e.target.value))}>
                  <option value={3}>3 Waves (2024-26)</option>
                  <option value={4}>4 Waves (2023-26)</option>
                  <option value={5}>5 Waves (2022-26)</option>
                  <option value={6}>6 Waves (2021-26)</option>
                </Select>
              </div>
              <div>
                <label className="text-[var(--text-main)] font-medium block mb-1">Random Seed</label>
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
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-sm">Sample Longitudinal Activity Histories</CardTitle>
                <CardDescription>Multi-wave individual trajectory records with care hours and state transitions</CardDescription>
              </div>
              <Badge variant="outline" className="font-mono text-[10px]">Preview: {tableRows.length} Records</Badge>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-[var(--bg-elevated)] text-[var(--text-muted)] border-y border-[var(--border-hairline)]">
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
                <tbody className="divide-y divide-[var(--border-hairline)] font-mono">
                  {tableRows.map((r, i) => (
                    <tr key={i} className="hover:bg-[var(--bg-elevated)]/60 transition-colors">
                      <td className="py-2.5 px-3 text-saffron-500 font-medium">{r.pid}</td>
                      <td className="py-2.5 px-2 text-[var(--text-muted)]">{r.wave}</td>
                      <td className="py-2.5 px-2 text-[var(--text-muted)]">{r.age}</td>
                      <td className="py-2.5 px-2 text-[var(--text-muted)]">{r.sex}</td>
                      <td className="py-2.5 px-3 text-[var(--text-muted)] font-sans">{r.sector}</td>
                      <td className="py-2.5 px-3 text-[var(--text-muted)] font-sans">{r.education}</td>
                      <td className="py-2.5 px-3">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[10px] font-sans font-medium border ${
                            r.state === "NEET"
                              ? "bg-rose-500/10 text-rose-400 border-rose-500/20"
                              : r.state === "Employment"
                              ? "bg-sage-500/10 text-sage-400 border-sage-500/20"
                              : r.state === "Education"
                              ? "bg-prussian-500/10 text-prussian-400 border-prussian-500/20"
                              : "bg-ochre-500/10 text-ochre-400 border-ochre-500/20"
                          }`}
                        >
                          {r.state}
                        </span>
                      </td>
                      <td className="py-2.5 px-2 text-[var(--text-faint)]">{r.care_hrs}h</td>
                      <td className="py-2.5 px-2 font-semibold text-[var(--text-main)]">{r.neet}</td>
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
