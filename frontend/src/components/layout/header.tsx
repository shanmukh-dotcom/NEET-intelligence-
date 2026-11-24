"use client";

import { usePathname } from "next/navigation";
import { Bell, Search, HelpCircle, Database, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const PAGE_TITLES: Record<string, { title: string; subtitle: string }> = {
  "/": {
    title: "Intelligence Overview",
    subtitle: "Youth NEET prevalence, historical trajectory, and emerging vulnerability patterns"
  },
  "/data-intelligence": {
    title: "Data Intelligence & Harmonisation",
    subtitle: "Ingestion, automated inspection, variable recognition, and survey comparability"
  },
  "/synthetic-generator": {
    title: "Synthetic Data Generator",
    subtitle: "Calibrate microdata cohorts, Markov transition parameters, and fictional presets"
  },
  "/population-explorer": {
    title: "Population Explorer & Segmentation",
    subtitle: "Age-gender pyramids, 20 fictional localities, and demographic cluster breakdowns"
  },
  "/neet-prediction": {
    title: "NEET Prediction Intelligence",
    subtitle: "Machine learning models, test calibration, and TreeSHAP feature explanations"
  },
  "/transition-intelligence": {
    title: "Transition Intelligence",
    subtitle: "First-order Markov matrices, sequence trajectories, and Kaplan-Meier duration curves"
  },
  "/opportunity-discovery": {
    title: "Opportunity Discovery & Matching",
    subtitle: "Catalogued pathway library and multi-factor transparent population similarity"
  },
  "/intervention-centre": {
    title: "Intervention Centre",
    subtitle: "Structured policy proposals, component resource accounting, and governance reviews"
  },
  "/scenario-simulator": {
    title: "NEET Scenario Simulator",
    subtitle: "Interactive 2021-2031 timeline projections, multi-scenario comparisons & sensitivity"
  },
  "/ai-assistant": {
    title: "Ask NEET Intelligence",
    subtitle: "Evidence-grounded research assistant backed by verifiable computation"
  },
  "/research-reports": {
    title: "Research Reports & Exports",
    subtitle: "Academic dossiers, executive summaries, and reproducible data exports"
  },
  "/settings": {
    title: "Governance & Settings",
    subtitle: "Role-based access control, measurement defaults, and immutable audit logs"
  }
};

export function Header() {
  const pathname = usePathname();
  const pageMeta = PAGE_TITLES[pathname] || {
    title: "NEET Intelligence Platform",
    subtitle: "Research-grade youth labor transition analytics"
  };

  return (
    <header className="h-16 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md flex items-center justify-between px-8 select-none z-10 sticky top-0">
      <div>
        <h2 className="text-sm font-bold text-white tracking-tight">{pageMeta.title}</h2>
        <p className="text-[11px] text-slate-400">{pageMeta.subtitle}</p>
      </div>

      <div className="flex items-center gap-3">
        {/* Dataset Status Pill */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs">
          <Database className="h-3.5 w-3.5 text-blue-400" />
          <span className="text-slate-300 font-medium">Cohort: 50,000 Records</span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-400">20 Localities</span>
        </div>

        {/* Global Demo Pill */}
        <Badge variant="synthetic">SYNTHETIC</Badge>

        <div className="h-4 w-px bg-slate-800 mx-1" />

        {/* Action Icons */}
        <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white">
          <Bell className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white">
          <HelpCircle className="h-4 w-4" />
        </Button>
      </div>
    </header>
  );
}
