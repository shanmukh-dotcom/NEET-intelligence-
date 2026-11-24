import * as React from "react";
import { Sidebar } from "./sidebar";
import { Header } from "./header";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[var(--bg-base)] text-[var(--text-main)] font-sans antialiased transition-colors duration-200">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header />
        
        {/* Single Canonical Methodological Provenance Ribbon */}
        <div className="border-b border-[var(--border-hairline)] bg-[var(--bg-surface)] px-7 py-2 flex items-center justify-between text-[11px] text-[var(--text-muted)] select-none">
          <div className="flex items-center gap-2 truncate">
            <span className="font-serif italic text-saffron-500 font-semibold">Note.</span>
            <span className="truncate">
              Research demonstration environment calibrated to Indian youth longitudinal parameters (N=50,000 across 20 fictional localities, 2021–2026).
            </span>
          </div>
          <span className="shrink-0 font-mono text-[10px] text-[var(--text-faint)] tracking-tight ml-4">
            ILO/PLFS Activity Definition
          </span>
        </div>

        <main className="flex-1 overflow-y-auto px-6 py-8 lg:px-10 lg:py-10 bg-[var(--bg-base)]">
          <div className="max-w-6xl mx-auto space-y-10 animate-fade-in">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
