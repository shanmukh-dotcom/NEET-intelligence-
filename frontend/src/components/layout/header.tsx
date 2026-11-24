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

import React, { useState, useEffect } from "react";
import { Sun, Moon } from "lucide-react";

export function Header() {
  const pathname = usePathname();
  const [isPaperTheme, setIsPaperTheme] = useState(false);

  useEffect(() => {
    // Check initial theme
    const saved = localStorage.getItem("neet-theme");
    if (saved === "paper") {
      setIsPaperTheme(true);
      document.documentElement.setAttribute("data-theme", "paper");
      document.documentElement.classList.remove("dark");
      document.documentElement.classList.add("light");
    }
  }, []);

  const toggleTheme = () => {
    const next = !isPaperTheme;
    setIsPaperTheme(next);
    if (next) {
      document.documentElement.setAttribute("data-theme", "paper");
      document.documentElement.classList.remove("dark");
      document.documentElement.classList.add("light");
      localStorage.setItem("neet-theme", "paper");
    } else {
      document.documentElement.removeAttribute("data-theme");
      document.documentElement.classList.remove("light");
      document.documentElement.classList.add("dark");
      localStorage.setItem("neet-theme", "ink");
    }
  };

  const pageMeta = PAGE_TITLES[pathname] || {
    title: "NEET Intelligence Platform",
    subtitle: "Research-grade youth labor transition analytics"
  };

  return (
    <header className="h-14 border-b border-[var(--border-hairline)] bg-[var(--bg-base)]/90 backdrop-blur-sm flex items-center justify-between px-7 select-none z-10 sticky top-0 transition-colors duration-200">
      <div className="flex items-baseline gap-3">
        <h2 className="text-sm font-serif font-semibold text-[var(--text-main)] tracking-tight">
          {pageMeta.title}
        </h2>
        <span className="hidden md:inline text-[var(--text-faint)] text-xs">/</span>
        <p className="hidden md:inline text-xs text-[var(--text-muted)] font-sans">
          {pageMeta.subtitle}
        </p>
      </div>

      <div className="flex items-center gap-4">
        {/* Dataset Status Monogram */}
        <div className="hidden lg:flex items-center gap-2 text-[11px] font-data text-[var(--text-muted)]">
          <span>50,000 Cohort</span>
          <span className="text-[var(--text-faint)]">·</span>
          <span>20 Localities</span>
          <span className="text-[var(--text-faint)]">·</span>
          <span className="text-saffron-500 font-medium">Wave 6</span>
        </div>

        {/* Paper / Ink Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded border border-[var(--border-hairline)] bg-[var(--bg-surface)] hover:bg-[var(--bg-elevated)] text-[11px] text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors"
          title="Toggle between Deep Ink and Paper Reading Theme"
        >
          {isPaperTheme ? (
            <>
              <Moon className="h-3 w-3 text-saffron-500" />
              <span>Ink</span>
            </>
          ) : (
            <>
              <Sun className="h-3 w-3 text-ochre-400" />
              <span>Paper</span>
            </>
          )}
        </button>
      </div>
    </header>
  );
}
