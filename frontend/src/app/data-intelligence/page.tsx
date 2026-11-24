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
  },
  {
    id: "DS-YOUNGLIVES-SYNTH-04",
    name: "Young Lives India Longitudinal Cohort Study (Synthetic Representation)",
    source: "Young Lives India Panel (Oxford & CESS Prototype)",
    years: "2021-2026",
    waves: 5,
    records: 12000,
    columns: 38,
    status: "Harmonised",
    quality_score: 97.2,
    is_synthetic: true
  },
  {
    id: "DS-IHD-SYNTH-05",
    name: "Institute for Human Development (IHD) Rural Youth Panel",
    source: "Institute for Human Development Longitudinal Village Studies",
    years: "2022-2026",
    waves: 4,
    records: 9500,
    columns: 30,
    status: "Harmonised",
    quality_score: 95.0,
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
    <div className="space-y-8">
      {/* Editorial Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-[var(--border-hairline)]">
        <div>
          <div className="flex items-center gap-2 text-xs font-sans text-saffron-500">
            <span className="font-serif italic font-semibold">Chapter I</span>
            <span className="text-[var(--text-faint)]">/</span>
            <span>Data Foundations</span>
          </div>
          <h2 className="text-xl font-serif font-semibold text-[var(--text-main)] mt-1">
            Dataset Management & Ingestion Hub
          </h2>
          <p className="text-xs text-[var(--text-muted)] font-sans mt-0.5">
            Strict preservation of 3 analytical layers: Raw Ingestion → Harmonised Representation → Analytical Layer.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="default" size="sm" onClick={() => setUploadSuccess(true)}>
            <Upload className="h-3.5 w-3.5 mr-1.5" /> Ingest New Dataset
          </Button>
        </div>
      </div>

      {uploadSuccess && (
        <div className="p-3.5 rounded border border-sage-500/30 bg-sage-500/10 text-xs text-sage-300 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-sage-400" />
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
        <TabsContent value="catalog" className="space-y-6 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {REGISTERED_DATASETS.map((ds) => (
              <div
                key={ds.id}
                onClick={() => setSelectedDataset(ds)}
                className={`cursor-pointer rounded p-5 border transition-all ${
                  selectedDataset.id === ds.id
                    ? "border-saffron-500/70 bg-[var(--bg-elevated)] shadow-subtle ring-1 ring-saffron-500/20"
                    : "border-[var(--border-hairline)] bg-[var(--bg-surface)] hover:border-[var(--border-muted)]"
                }`}
              >
                <div className="flex items-center justify-between pb-2 border-b border-[var(--border-hairline)]">
                  <span className="text-[10px] font-mono text-[var(--text-faint)]">{ds.id}</span>
                  <Badge variant={ds.status === "Harmonised" ? "success" : "default"}>{ds.status}</Badge>
                </div>
                <h4 className="text-sm font-serif font-semibold text-[var(--text-main)] mt-2.5 line-clamp-1">{ds.name}</h4>
                <p className="text-xs text-[var(--text-muted)] font-sans mt-0.5 line-clamp-1">{ds.source}</p>
                
                <div className="grid grid-cols-2 gap-2 py-2.5 my-3 border-y border-[var(--border-hairline)] text-[11px] font-sans">
                  <div>
                    <span className="text-[var(--text-faint)] block text-[10px]">Records</span>
                    <span className="font-mono font-medium text-[var(--text-main)]">{formatNumber(ds.records)}</span>
                  </div>
                  <div>
                    <span className="text-[var(--text-faint)] block text-[10px]">Waves</span>
                    <span className="font-mono font-medium text-[var(--text-main)]">{ds.waves} ({ds.years})</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-[var(--text-muted)]">Quality Score:</span>
                  <span className="font-mono font-bold text-sage-500">{ds.quality_score}%</span>
                </div>
              </div>
            ))}
          </div>

          {/* Detailed Selected Dataset Dossier */}
          <div className="rounded border border-[var(--border-hairline)] bg-[var(--bg-surface)] p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border-hairline)]">
              <div>
                <h4 className="text-sm font-serif font-semibold text-[var(--text-main)]">
                  Active Inspection Dossier: {selectedDataset.name}
                </h4>
                <p className="text-xs text-[var(--text-muted)] font-sans mt-0.5">
                  Longitudinal individual-level microdata structure
                </p>
              </div>
              <Button variant="outline" size="sm">
                <Download className="h-3 w-3 mr-1" /> Export Schema
              </Button>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-sans">
              <div className="p-3.5 rounded bg-[var(--bg-elevated)] border border-[var(--border-hairline)]">
                <span className="text-[var(--text-faint)] block text-[11px]">Total Person-Waves</span>
                <span className="text-base font-numeral font-semibold text-[var(--text-main)] mt-1 block">{formatNumber(selectedDataset.records)}</span>
              </div>
              <div className="p-3.5 rounded bg-[var(--bg-elevated)] border border-[var(--border-hairline)]">
                <span className="text-[var(--text-faint)] block text-[11px]">Variables Tracked</span>
                <span className="text-base font-numeral font-semibold text-[var(--text-main)] mt-1 block">{selectedDataset.columns} Columns</span>
              </div>
              <div className="p-3.5 rounded bg-[var(--bg-elevated)] border border-[var(--border-hairline)]">
                <span className="text-[var(--text-faint)] block text-[11px]">Temporal Coverage</span>
                <span className="text-base font-numeral font-semibold text-[var(--text-main)] mt-1 block">{selectedDataset.years}</span>
              </div>
              <div className="p-3.5 rounded bg-[var(--bg-elevated)] border border-[var(--border-hairline)]">
                <span className="text-[var(--text-faint)] block text-[11px]">Raw Layer Immutability</span>
                <span className="text-base font-numeral font-semibold text-sage-500 mt-1 block">Preserved (Read-Only)</span>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Tab 2: Inspection */}
        <TabsContent value="inspection" className="space-y-4 pt-4">
          <div className="rounded border border-[var(--border-hairline)] bg-[var(--bg-surface)] overflow-hidden">
            <div className="p-5 border-b border-[var(--border-hairline)]">
              <h4 className="text-sm font-serif font-semibold text-[var(--text-main)]">Automated Concept Mapping & Variable Recognition</h4>
              <p className="text-xs text-[var(--text-muted)] font-sans mt-0.5">Mapped source columns to standardized NEET analytical taxonomy</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-[var(--bg-elevated)] text-[var(--text-muted)] border-b border-[var(--border-hairline)] font-serif">
                  <tr>
                    <th className="py-2.5 px-4 font-semibold">Source Column</th>
                    <th className="py-2.5 px-4 font-semibold">Mapped Standard Concept</th>
                    <th className="py-2.5 px-4 font-semibold">Detection Confidence</th>
                    <th className="py-2.5 px-4 font-semibold">Survey Comparability</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border-hairline)] font-sans">
                  {RECOGNIZED_VARIABLES.map((v, i) => (
                    <tr key={i} className="hover:bg-[var(--bg-elevated)]/50 transition-colors">
                      <td className="py-3 px-4 font-mono text-saffron-500 font-medium">{v.source_column}</td>
                      <td className="py-3 px-4 font-medium text-[var(--text-main)]">{v.mapped_concept}</td>
                      <td className="py-3 px-4">
                        <span className="inline-block px-2 py-0.5 rounded bg-sage-500/10 text-sage-400 font-mono text-[11px]">
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
            </div>
          </div>
        </TabsContent>

        {/* Tab 3: Validation */}
        <TabsContent value="validation" className="space-y-4 pt-4">
          <div className="rounded border border-[var(--border-hairline)] bg-[var(--bg-surface)] p-6 space-y-4">
            <div className="pb-3 border-b border-[var(--border-hairline)]">
              <h4 className="text-sm font-serif font-semibold text-[var(--text-main)]">Data Integrity & Longitudinal Consistency Audit</h4>
              <p className="text-xs text-[var(--text-muted)] font-sans mt-0.5">Automated econometric tests executed against person-wave records</p>
            </div>
            <div className="space-y-3">
              {[
                { test: "Person Identifier Uniqueness across waves", detail: "Zero cross-person collisions detected in SYN cohort.", status: "Passed" },
                { test: "Valid Age Range Eligibility (15-29)", detail: "100% of youth records satisfy age bounds.", status: "Passed" },
                { test: "Activity State Mutual Exclusivity", detail: "Education, Employment, Training, and NEET states strictly partitioned.", status: "Passed" },
                { test: "Unpaid Domestic Care Hours Range Check (0-16 hrs)", detail: "No extreme negative or implausible values.", status: "Passed" },
                { test: "Longitudinal Wave Ordering & Attrition Flagging", detail: "Wave temporal sequence monotonic. Attrition verified at 8.2% by Wave 6.", status: "Passed" }
              ].map((chk, i) => (
                <div key={i} className="p-3.5 rounded border border-[var(--border-hairline)] bg-[var(--bg-elevated)] flex items-center justify-between text-xs font-sans">
                  <div>
                    <span className="font-medium text-[var(--text-main)] block">{chk.test}</span>
                    <span className="text-[var(--text-faint)] text-[11px] mt-0.5 block">{chk.detail}</span>
                  </div>
                  <Badge variant="success">{chk.status}</Badge>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* Tab 4: Comparability Framework */}
        <TabsContent value="comparability" className="space-y-4 pt-4">
          <div className="rounded border border-[var(--border-hairline)] bg-[var(--bg-surface)] p-6 space-y-4">
            <div className="pb-3 border-b border-[var(--border-hairline)]">
              <h4 className="text-sm font-serif font-semibold text-[var(--text-main)]">Research Comparability Framework</h4>
              <p className="text-xs text-[var(--text-muted)] font-sans mt-0.5">
                Strict scientific rules preventing illegitimate merging of incompatible survey measures (PLFS, IHDS, UDAYA).
              </p>
            </div>
            <div className="space-y-4 text-xs font-sans">
              {COMPARABILITY_EXPLANATIONS.map((c, i) => (
                <div key={i} className="p-4 rounded border border-[var(--border-hairline)] bg-[var(--bg-elevated)] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-serif font-semibold text-[var(--text-main)] text-sm">{c.variable}</span>
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
                  <p className="text-[var(--text-muted)] leading-relaxed">{c.rationale}</p>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
