"use client";

import React, { useState } from "react";
import {
  FileText,
  Download,
  Printer,
  Sparkles,
  CheckCircle,
  FileSpreadsheet,
  Layers,
  BookOpen,
  Calendar,
  User
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const REPORT_SECTIONS = [
  {
    id: "exec_summary",
    title: "1. Executive Summary",
    content: (
      "This report synthesizes six waves of longitudinal youth observation (2021-2026) across 20 representative " +
      "fictional localities. Observed youth NEET prevalence declined modestly from 28.4% in 2021 to 26.1% in 2026. " +
      "However, aggregate prevalence masks profound gender stratification: young women experience a 41.2% NEET rate " +
      "compared to 12.8% for young men. Unpaid domestic caregiving (>4 hours daily) emerges as the single strongest " +
      "predictor of persistent youth inactivity. Simulation of an Expanded Comprehensive Intervention (65% coverage " +
      "with crèche infrastructure and paid industry apprenticeships) projects a potential decline in youth NEET prevalence " +
      "to 14.8% by 2031, yielding an estimated 8,420 net cumulative transitions into sustainable activity states."
    )
  },
  {
    id: "methodology",
    title: "2. Data Provenance & Measurement Methodology",
    content: (
      "The analytical pipeline employs standard ILO/PLFS activity-state definitions: zero hours worked during the reference " +
      "week, combined with non-participation in formal schooling or recognized vocational training. Repeated observations " +
      "across survey waves distinguish transitory (single-wave), recurrent (intermittent), and chronic (>3 consecutive waves) " +
      "NEET spells. Machine learning models (Logistic Regression, Random Forest, and XGBoost) were evaluated under strict " +
      "80/20 train/test temporal separation with TreeSHAP feature attribution."
    )
  },
  {
    id: "prevalence",
    title: "3. Population Structure & NEET Prevalence Findings",
    content: (
      "Across the baseline cohort of 50,000 individuals, rural youth represent 62.4% of observations. Rural female youth " +
      "demonstrate the highest vulnerability (46.7% NEET rate), with substantial geographic concentration in agrarian hinterlands " +
      "(Districts B1, B3, C2). In urban centers (Districts A1, A4), educated unemployment among diploma and degree holders " +
      "accounts for 38.6% of urban NEET cases, driven by qualification-job expectation mismatch."
    )
  },
  {
    id: "transitions",
    title: "4. Transition Matrices & Persistence Dynamics",
    content: (
      "First-order Markovian transition matrices demonstrate significant persistence: 70.2% of individuals identified as NEET " +
      "in Wave t remain NEET in Wave t+1. Formal employment entry is 15.1% annually, while vocational training absorbs 7.1%. " +
      "Importantly, completing recognized vocational training raises subsequent employment transition to 45.2%, underscoring " +
      "the catalytic role of structured skilling."
    )
  },
  {
    id: "opportunity",
    title: "5. Opportunity Discovery & Intervention Recommendations",
    content: (
      "Multi-factor population similarity matching identified two high-potential interventions: (1) Community Food Processing " +
      "& Digital Cooperatives for rural female clusters (88.4% match score, Grade B evidence); and (2) Distributed Vernacular " +
      "Digital Tasking Hubs with integrated childcare vouchers (84.1% match score, Grade A evidence). Structured implementation " +
      "proposals have been registered and submitted to governance review."
    )
  },
  {
    id: "scenario",
    title: "6. Five-Year Forward Policy Projections (2027-2031)",
    content: (
      "Three comparative scenarios were modeled: Status Quo (projected 2031 rate: 25.4%), Moderate Targeted (20.4%, requiring " +
      "INR 14.5 Cr), and Expanded Comprehensive (14.8%, requiring INR 38.0 Cr). Multi-way sensitivity analysis demonstrates " +
      "that intervention success is heavily bounded by completion fidelity rather than initial nominal enrollment."
    )
  },
  {
    id: "limitations",
    title: "7. Research Integrity & Methodological Limitations",
    content: (
      "CRITICAL NOTICE: All quantitative findings in this report originate from the platform's synthetic demonstration " +
      "engine calibrated to plausible Indian labor market parameters. They do not represent real-world individual or district " +
      "statistics. Parametric forward projections reflect stated accounting assumptions and must not be interpreted as " +
      "empirically established causal treatment effects."
    )
  }
];

import { getReportCsvDownloadUrl, getReportsList, getReportById } from "@/lib/api-client";

export default function ResearchReportsPage() {
  const [downloadNotice, setDownloadNotice] = useState<string | null>(null);
  const [reportList, setReportList] = useState<any[]>([]);
  const [isLiveApi, setIsLiveApi] = useState(false);

  React.useEffect(() => {
    async function loadReports() {
      try {
        const res = await getReportsList();
        if (res && res.reports) {
          setReportList(res.reports);
          setIsLiveApi(true);
        }
      } catch (e) {
        setIsLiveApi(false);
      }
    }
    loadReports();
  }, []);

  const handleDownload = (format: string) => {
    if (format === "CSV") {
      setDownloadNotice("Exporting executive research indicators from live API (CSV)...");
      try {
        const directUrl = getReportCsvDownloadUrl("REP-FULL-01");
        const a = document.createElement("a");
        a.href = directUrl;
        a.download = "neet_report_REP-FULL-01.csv";
        a.target = "_blank";
        a.click();
        return;
      } catch (err) {
        console.warn("Direct CSV download fallback", err);
      }
    }

    setDownloadNotice(`Downloading complete research dossier (${format})... Generated with full audit provenance.`);
    setTimeout(() => {
      // Create a downloadable text file for demonstration
      const blob = new Blob([
        `# NEET INTELLIGENCE PLATFORM - RESEARCH REPORT\n\n` +
        `TITLE: Comprehensive Youth NEET Intelligence & Transition Assessment (2021-2026)\n` +
        `AUTHORS: NEET Research Consortium & Policy Analytics Unit\n` +
        `DATE: November 2026\n` +
        `NOTICE: SYNTHETIC RESEARCH DATA DEMONSTRATION\n\n` +
        REPORT_SECTIONS.map((s) => `## ${s.title}\n${s.content}\n\n`).join("")
      ], { type: "text/plain" });

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `NEET_Intelligence_Research_Report.${format === "CSV" ? "csv" : "txt"}`;
      a.click();
      URL.revokeObjectURL(url);
    }, 400);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-slate-100">Research Dossiers & Reproducible Reports</h3>
            <Badge variant="synthetic">SYNTHETIC RESEARCH PROVENANCE</Badge>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Generate and export academic policy monographs, executive summaries, and empirical transition tables.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => handleDownload("CSV")}>
            <FileSpreadsheet className="h-3.5 w-3.5 mr-1.5 text-emerald-400" /> Export CSV Data
          </Button>
          <Button variant="default" size="sm" onClick={() => handleDownload("TXT")}>
            <Download className="h-3.5 w-3.5 mr-1.5" /> Download Full Dossier
          </Button>
        </div>
      </div>

      {downloadNotice && (
        <div className="p-3.5 rounded-lg border border-emerald-500/30 bg-emerald-950/20 text-xs text-emerald-300 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-emerald-400" />
            <span>{downloadNotice}</span>
          </div>
          <Button variant="ghost" size="sm" onClick={() => setDownloadNotice(null)}>Dismiss</Button>
        </div>
      )}

      {/* Report Reader Card */}
      <Card className="border-slate-800 bg-slate-900/95 max-w-4xl mx-auto shadow-xl">
        <CardHeader className="p-8 pb-6 border-b border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <Badge variant="teal">PEER-REVIEWED RESEARCH DOSSIER</Badge>
            <span className="text-xs text-slate-500 font-mono">DOC ID: REP-2026-NEET-01</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">
              Comprehensive Youth NEET Intelligence & Transition Assessment (2021–2026)
            </h1>
            <p className="text-sm text-slate-300 mt-1">
              Longitudinal Microdata Evidence, Predictive Risk Stratification, and 2027–2031 Policy Scenarios
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-2 border-t border-slate-800/80">
            <div className="flex items-center gap-1.5">
              <User className="h-3.5 w-3.5 text-blue-400" />
              <span>NEET Research Consortium & Policy Analytics Unit</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-slate-500" />
              <span>November 2026</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Badge variant="synthetic">50,000 SYNTHETIC YOUTH COHORT</Badge>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-8 space-y-8 text-xs text-slate-300 leading-relaxed">
          {REPORT_SECTIONS.map((sec) => (
            <div key={sec.id} className="space-y-2 border-b border-slate-800/60 pb-6 last:border-b-0">
              <h3 className="text-sm font-bold text-slate-100 tracking-tight">{sec.title}</h3>
              <p className="text-slate-300 leading-relaxed text-xs">{sec.content}</p>
            </div>
          ))}
        </CardContent>

        <CardFooter className="p-8 pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-500">
          <span>Registered Research Project: From NEET Status to NEET Persistence</span>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => window.print()}>
              <Printer className="h-3.5 w-3.5 mr-1.5" /> Print Dossier
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
