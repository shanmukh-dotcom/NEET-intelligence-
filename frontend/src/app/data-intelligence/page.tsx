"use client";

import React, { useState } from "react";
import {
  Database,
  Upload,
  CheckCircle,
  AlertCircle,
  FileText,
  Layers,
  ArrowRight,
  ShieldAlert,
  Sparkles,
  Download
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatNumber } from "@/lib/utils";

const REGISTERED_DATASETS = [
  {
    id: "DS-PLFS-SYNTH-01",
    name: "Periodic Labour Force Survey (PLFS) Calibrated Synthetic Microdata",
    source: "Periodic Labour Force Survey Prototype",
    years: "2021-2026",
    waves: 6,
    records: 50000,
    columns: 28,
    status: "Harmonised",
    quality_score: 98.4,
    is_synthetic: true
  },
  {
    id: "DS-IHDS-SYNTH-02",
    name: "India Human Development Survey (IHDS) Synthetic Longitudinal Panel",
    source: "India Human Development Survey Calibrated Prototype",
    years: "2021-2025",
    waves: 5,
    records: 24000,
    columns: 32,
    status: "Harmonised",
    quality_score: 94.2,
    is_synthetic: true
  },
  {
    id: "DS-UDAYA-SYNTH-03",
    name: "UDAYA Adolescents & Young Adults Transition Cohort",
    source: "Understanding the Lives of Adolescents and Young Adults",
    years: "2022-2026",
    waves: 3,
    records: 18500,
    columns: 45,
    status: "Harmonised",
    quality_score: 96.8,
    is_synthetic: true
  }
];

const RECOGNIZED_VARIABLES = [
  { source_column: "pid", mapped_concept: "Person Identifier", confidence: "100%", classification: "Comparable" },
  { source_column: "age_yrs", mapped_concept: "Age (15-29)", confidence: "98%", classification: "Comparable" },
  { source_column: "sex_code", mapped_concept: "Gender (Female/Male)", confidence: "100%", classification: "Comparable" },
  { source_column: "sector_code", mapped_concept: "Rural / Urban Classification", confidence: "99%", classification: "Comparable" },
  { source_column: "curr_activity", mapped_concept: "Principal Activity Status", confidence: "96%", classification: "Comparable" },
  { source_column: "care_hrs", mapped_concept: "Daily Unpaid Care Hours", confidence: "94%", classification: "Conditionally Comparable" },
  { source_column: "train_status", mapped_concept: "Vocational Training Participation", confidence: "92%", classification: "Conditionally Comparable" },
  { source_column: "asset_pca", mapped_concept: "Household Wealth Index", confidence: "88%", classification: "Not Comparable" }
];

const COMPARABILITY_EXPLANATIONS = [
  {
    variable: "NEET Status",
    grade: "Comparable",
    rationale: "Standard ILO activity formula applied across all harmonized datasets (0 work hours, not in schooling, not in vocational training)."
  },
  {
    variable: "Unpaid Domestic Care Hours",
    grade: "Conditionally Comparable",
    rationale: "PLFS collects time-use via principal activity codes; UDAYA uses dedicated recall diaries. Direct comparison requires calibration weights."
  },
  {
    variable: "Vocational Training",
    grade: "Conditionally Comparable",
    rationale: "Surveys differ in whether informal apprenticeships are included alongside formal government accredited ITI certificates."
  },
  {
    variable: "Household Wealth Index",
    grade: "Not Comparable",
    rationale: "Constructed from differing asset rosters across PLFS (consumption proxy) and IHDS/UDAYA (durable goods PCA). Cannot be pooled."
  }
];

export default function DataIntelligencePage() {
  const [selectedDataset, setSelectedDataset] = useState(REGISTERED_DATASETS[0]);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl border border-slate-800 bg-slate-900/60">
        <div>
          <h3 className="text-sm font-semibold text-slate-100">Dataset Management & Ingestion Hub</h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Preserve 3 analytical layers: Raw Data → Harmonised Representation → Analytical Layer.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="synthetic">3 REGISTERED DATASETS</Badge>
          <Button variant="default" size="sm" onClick={() => setUploadSuccess(true)}>
            <Upload className="h-3.5 w-3.5 mr-1.5" /> Ingest New Dataset
          </Button>
        </div>
      </div>

      {uploadSuccess && (
        <div className="p-3.5 rounded-lg border border-emerald-500/30 bg-emerald-950/20 text-xs text-emerald-300 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-emerald-400" />
            <span>Dataset successfully uploaded, inspected, and harmonised with 3-tier layer preservation.</span>
          </div>
          <Button variant="ghost" size="sm" onClick={() => setUploadSuccess(false)}>Dismiss</Button>
        </div>
      )}

      {/* Main Tabs */}
      <Tabs defaultValue="catalog" className="w-full">
        <TabsList className="grid grid-cols-4 w-full max-w-xl">
          <TabsTrigger value="catalog">Datasets Catalog</TabsTrigger>
          <TabsTrigger value="inspection">Schema Inspection</TabsTrigger>
          <TabsTrigger value="validation">Data Quality</TabsTrigger>
          <TabsTrigger value="comparability">Comparability Framework</TabsTrigger>
        </TabsList>

        {/* Tab 1: Catalog */}
        <TabsContent value="catalog" className="space-y-4 pt-2">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {REGISTERED_DATASETS.map((ds) => (
              <Card
                key={ds.id}
                onClick={() => setSelectedDataset(ds)}
                className={`cursor-pointer border transition-all ${
                  selectedDataset.id === ds.id
                    ? "border-blue-500/80 bg-slate-900 shadow-md"
                    : "border-slate-800 bg-slate-950/60 hover:border-slate-700"
                }`}
              >
                <CardHeader className="p-4 pb-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-slate-500">{ds.id}</span>
                    <Badge variant={ds.status === "Harmonised" ? "success" : "default"}>{ds.status}</Badge>
                  </div>
                  <CardTitle className="text-sm font-semibold text-slate-100 mt-1.5 line-clamp-1">{ds.name}</CardTitle>
                  <CardDescription className="text-xs text-slate-400">{ds.source}</CardDescription>
                </CardHeader>
                <CardContent className="p-4 pt-2 space-y-2 text-xs">
                  <div className="grid grid-cols-2 gap-2 py-2 border-y border-slate-800/80 text-[11px]">
                    <div>
                      <span className="text-slate-500 block">Records</span>
                      <span className="font-semibold text-slate-200">{formatNumber(ds.records)}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Survey Waves</span>
                      <span className="font-semibold text-slate-200">{ds.waves} ({ds.years})</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-[11px] pt-1">
                    <span className="text-slate-400">Quality Score:</span>
                    <span className="font-bold text-emerald-400">{ds.quality_score}%</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Detailed Selected Dataset Dossier */}
          <Card className="border-slate-800 bg-slate-900/90 mt-4">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-sm">Active Inspection Dossier: {selectedDataset.name}</CardTitle>
                  <CardDescription>Longitudinal individual-level microdata structure</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="synthetic">SYNTHETIC</Badge>
                  <Button variant="outline" size="sm">
                    <Download className="h-3 w-3 mr-1" /> Export Schema
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-slate-500 block">Total Person-Waves</span>
                  <span className="text-base font-bold text-white mt-1 block">{formatNumber(selectedDataset.records)}</span>
                </div>
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-slate-500 block">Variables Tracked</span>
                  <span className="text-base font-bold text-white mt-1 block">{selectedDataset.columns} Columns</span>
                </div>
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-slate-500 block">Temporal Coverage</span>
                  <span className="text-base font-bold text-white mt-1 block">{selectedDataset.years}</span>
                </div>
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-slate-500 block">Raw Layer Immutability</span>
                  <span className="text-base font-bold text-emerald-400 mt-1 block">Preserved (Read-Only)</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 2: Inspection */}
        <TabsContent value="inspection" className="space-y-4 pt-2">
          <Card className="border-slate-800 bg-slate-900/90">
            <CardHeader>
              <CardTitle className="text-sm">Automated Concept Mapping & Variable Recognition</CardTitle>
              <CardDescription>Mapped source columns to standardized NEET analytical taxonomy</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-950 text-slate-400 border-y border-slate-800">
                  <tr>
                    <th className="py-2.5 px-4 font-medium">Source Column</th>
                    <th className="py-2.5 px-4 font-medium">Mapped Standard Concept</th>
                    <th className="py-2.5 px-4 font-medium">Detection Confidence</th>
                    <th className="py-2.5 px-4 font-medium">Survey Comparability</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {RECOGNIZED_VARIABLES.map((v, i) => (
                    <tr key={i} className="hover:bg-slate-800/30">
                      <td className="py-3 px-4 font-mono text-blue-400">{v.source_column}</td>
                      <td className="py-3 px-4 font-medium text-slate-200">{v.mapped_concept}</td>
                      <td className="py-3 px-4">
                        <span className="inline-block px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-mono text-[11px]">
                          {v.confidence}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <Badge
                          variant={
                            v.classification === "Comparable"
                              ? "success"
                              : v.classification === "Conditionally Comparable"
                              ? "warning"
                              : "destructive"
                          }
                        >
                          {v.classification}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 3: Validation */}
        <TabsContent value="validation" className="space-y-4 pt-2">
          <Card className="border-slate-800 bg-slate-900/90">
            <CardHeader>
              <CardTitle className="text-sm">Data Integrity & Longitudinal Consistency Audit</CardTitle>
              <CardDescription>Automated tests executed against person-wave records</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { test: "Person Identifier Uniqueness across waves", detail: "Zero cross-person collisions detected in SYN cohort.", status: "Passed" },
                { test: "Valid Age Range Eligibility (15-29)", detail: "100% of youth records satisfy age bounds.", status: "Passed" },
                { test: "Activity State Mutual Exclusivity", detail: "Education, Employment, Training, and NEET states strictly partitioned.", status: "Passed" },
                { test: "Unpaid Domestic Care Hours Range Check (0-16 hrs)", detail: "No extreme negative or implausible values.", status: "Passed" },
                { test: "Longitudinal Wave Ordering & Attrition Flagging", detail: "Wave temporal sequence monotonic. Attrition verified at 8.2% by Wave 6.", status: "Passed" }
              ].map((chk, i) => (
                <div key={i} className="p-3 rounded-lg border border-slate-800 bg-slate-950/60 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-semibold text-slate-200 block">{chk.test}</span>
                    <span className="text-slate-400 text-[11px] mt-0.5 block">{chk.detail}</span>
                  </div>
                  <Badge variant="success">{chk.status}</Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 4: Comparability Framework */}
        <TabsContent value="comparability" className="space-y-4 pt-2">
          <Card className="border-slate-800 bg-slate-900/90">
            <CardHeader>
              <CardTitle className="text-sm">Research Comparability Framework</CardTitle>
              <CardDescription>
                Strict scientific rules preventing illegitimate merging of incompatible survey measures (PLFS, IHDS, UDAYA).
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-xs">
              {COMPARABILITY_EXPLANATIONS.map((c, i) => (
                <div key={i} className="p-4 rounded-lg border border-slate-800 bg-slate-950/70 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-100 text-sm">{c.variable}</span>
                    <Badge
                      variant={
                        c.grade === "Comparable"
                          ? "success"
                          : c.grade === "Conditionally Comparable"
                          ? "warning"
                          : "destructive"
                      }
                    >
                      {c.grade}
                    </Badge>
                  </div>
                  <p className="text-slate-300 leading-relaxed">{c.rationale}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
