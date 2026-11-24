"use client";

import React, { useState } from "react";
import {
  Target,
  CheckCircle,
  Clock,
  AlertTriangle,
  Building,
  Users,
  Shield,
  FileText,
  ThumbsUp,
  ThumbsDown,
  ArrowRight
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input, Select } from "@/components/ui/input";
import { formatNumber } from "@/lib/utils";

const INITIAL_INTERVENTIONS = [
  {
    id: "INT-001",
    title: "Decentralized Care Support & Vernacular Digital Tasking Initiative",
    locality: "Fictional District B3 & C2",
    target: "Young rural women (18-24) facing prolonged NEET status (>18 months) and heavy domestic care duties",
    problem: "Rural young women exhibit 68.4% observed NEET persistence over 3 survey waves, mediated by domestic care burdens and absence of safe, flexible local work.",
    evidence: "Transition matrix shows 74% female NEET persistence. SHAP values rank unpaid care hours as top positive predictor.",
    components: [
      "Establishment of 6 community micro-crèches staffed by certified local care auxiliaries",
      "Deployment of 45 solar-supported workstation terminals across 3 Panchayat Bhavans",
      "Standardized 8-week vernacular data annotation and verification curriculum",
      "Childcare voucher stipend and transportation escort collective"
    ],
    resources: "INR 28.5 Lakhs capital setup; INR 4.2 Lakhs monthly operational support; 6 Master Trainers",
    partners: ["District Rural Development Agency (DRDA)", "National Rural Livelihoods Mission", "Fictional Women's Federation"],
    eligible: 2400,
    coverage: "45%",
    participants: 1080,
    completion: "78%",
    expected_transition: "42%",
    projected_exits: 354,
    status: "Proposed",
    author: "Dr. A. Sharma (Lead Researcher)"
  },
  {
    id: "INT-002",
    title: "Urban Technical Graduate Transition & Bridge Apprenticeship Sprint",
    locality: "Fictional District A1 & A4",
    target: "Urban educated youth (diploma & graduates, 21-26) experiencing educated NEET transition (>12 months)",
    problem: "42.1% of technical graduates in urban nodes enter NEET status immediately following academic completion due to acute skill mismatch.",
    evidence: "Sequence analysis reveals high entry into NEET following education completion. Logistic regression confirms higher secondary and diploma holders have 1.8x odds of prolonged job-search inactivity.",
    components: [
      "Skill-gap diagnostic assessment and personalized learning track assignment",
      "Intensive 6-week hands-on industrial automation / green mobility workshop",
      "8-week paid apprentice placement with 50% state wage co-subsidy",
      "Weekly career mentorship and professional communication labs"
    ],
    resources: "INR 42.0 Lakhs annual grant pool; 3 Advanced Polytechnic Labs; 25 Industry MoUs",
    partners: ["State Skill Development Mission", "Confederation of Regional Industries", "Government Polytechnic"],
    eligible: 3100,
    coverage: "50%",
    participants: 1550,
    completion: "85%",
    expected_transition: "58%",
    projected_exits: 764,
    status: "Under Review",
    author: "Prof. M. Verma"
  }
];

export default function InterventionCentrePage() {
  const [interventions, setInterventions] = useState(INITIAL_INTERVENTIONS);
  const [selectedIntervention, setSelectedIntervention] = useState(INITIAL_INTERVENTIONS[0]);
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  const handleUpdateStatus = (id: string, newStatus: string) => {
    setInterventions((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
    );
    if (selectedIntervention.id === id) {
      setSelectedIntervention((prev) => ({ ...prev, status: newStatus }));
    }
    setActionNotice(`Governance decision recorded: ${selectedIntervention.id} updated to '${newStatus}'.`);
  };

  return (
    <div className="space-y-8">
      {/* Editorial Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-[var(--border-hairline)]">
        <div>
          <div className="flex items-center gap-2 text-xs font-sans text-saffron-500">
            <span className="font-serif italic font-semibold">Chapter V</span>
            <span className="text-[var(--text-faint)]">/</span>
            <span>Policy Interventions</span>
          </div>
          <h2 className="text-xl font-serif font-semibold text-[var(--text-main)] mt-1">
            Intervention Intelligence & Policy Governance
          </h2>
          <p className="text-xs text-[var(--text-muted)] font-sans mt-0.5">
            Translate transition patterns into structured intervention proposals with transparent coverage and arithmetic accounting.
          </p>
        </div>
      </div>

      {actionNotice && (
        <div className="p-3.5 rounded border border-sage-500/30 bg-sage-500/10 text-xs text-sage-300 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-sage-400" />
            <span>{actionNotice}</span>
          </div>
          <Button variant="ghost" size="sm" onClick={() => setActionNotice(null)}>Dismiss</Button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Proposals List */}
        <div className="space-y-3 font-sans">
          <h4 className="text-xs font-serif font-semibold text-[var(--text-muted)] uppercase tracking-wider">Registered Proposals</h4>
          {interventions.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedIntervention(item)}
              className={`cursor-pointer rounded p-4 border transition-all ${
                selectedIntervention.id === item.id
                  ? "border-saffron-500/70 bg-[var(--bg-elevated)] shadow-subtle ring-1 ring-saffron-500/20"
                  : "border-[var(--border-hairline)] bg-[var(--bg-surface)] hover:border-[var(--border-muted)]"
              }`}
            >
              <div className="flex items-center justify-between pb-1.5 border-b border-[var(--border-hairline)]">
                <span className="text-[10px] font-mono text-[var(--text-faint)]">{item.id}</span>
                <Badge
                  variant={
                    item.status === "Approved"
                      ? "success"
                      : item.status === "Under Review"
                      ? "warning"
                      : "default"
                  }
                >
                  {item.status}
                </Badge>
              </div>
              <h4 className="text-xs font-serif font-semibold text-[var(--text-main)] mt-2 line-clamp-2 leading-snug">{item.title}</h4>
              <p className="text-[11px] text-[var(--text-muted)] font-sans mt-0.5">{item.locality}</p>
              
              <div className="mt-3 pt-2 border-t border-[var(--border-hairline)] text-xs flex items-center justify-between">
                <span className="text-[var(--text-faint)] text-[11px]">Est. Exits:</span>
                <span className="font-bold text-sage-500 font-mono text-xs">{item.projected_exits} youth</span>
              </div>
            </div>
          ))}
        </div>

        {/* Right Column: Detailed Proposal Dossier & Governance Actions */}
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded border border-[var(--border-hairline)] bg-[var(--bg-surface)] text-xs font-sans">
            <div className="p-5 pb-3 border-b border-[var(--border-hairline)] flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono text-saffron-500">{selectedIntervention.id}</span>
                <h3 className="text-sm font-serif font-semibold text-[var(--text-main)] mt-1">{selectedIntervention.title}</h3>
                <p className="text-xs text-[var(--text-muted)] font-sans mt-0.5">{selectedIntervention.locality}</p>
              </div>
              <Badge
                variant={
                  selectedIntervention.status === "Approved"
                    ? "success"
                    : selectedIntervention.status === "Under Review"
                    ? "warning"
                    : "default"
                }
              >
                {selectedIntervention.status}
              </Badge>
            </div>

            <div className="p-5 space-y-5">
              {/* Problem & Evidence */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5 p-3.5 rounded bg-[var(--bg-elevated)] border border-[var(--border-hairline)]">
                  <span className="font-serif font-semibold text-crimson-400 block text-xs">Identified Structural Problem</span>
                  <p className="text-[var(--text-muted)] leading-relaxed text-[11px]">{selectedIntervention.problem}</p>
                </div>
                <div className="space-y-1.5 p-3.5 rounded bg-[var(--bg-elevated)] border border-[var(--border-hairline)]">
                  <span className="font-serif font-semibold text-prussian-400 block text-xs">Empirical Model Evidence</span>
                  <p className="text-[var(--text-muted)] leading-relaxed text-[11px]">{selectedIntervention.evidence}</p>
                </div>
              </div>

              {/* Implementation Components */}
              <div className="space-y-2">
                <span className="font-serif font-semibold text-[var(--text-main)] block text-xs">Core Implementation Components:</span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {selectedIntervention.components.map((c, i) => (
                    <div key={i} className="p-3 rounded bg-[var(--bg-elevated)] border border-[var(--border-hairline)] text-[var(--text-muted)] flex items-start gap-2 text-[11px]">
                      <span className="text-saffron-500 font-bold shrink-0">•</span>
                      <span className="leading-normal">{c}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Parametric Coverage & Arithmetic Accounting */}
              <div className="p-4 rounded bg-[var(--bg-elevated)] border border-[var(--border-hairline)] space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-[var(--border-hairline)]">
                  <span className="font-serif font-semibold text-[var(--text-main)] text-xs">Coverage & Exit Accounting Formula</span>
                  <span className="text-[10px] font-mono text-[var(--text-faint)]">Arithmetic Model</span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-center font-mono text-[11px]">
                  <div className="p-2.5 rounded bg-[var(--bg-surface)] border border-[var(--border-hairline)]">
                    <span className="text-[var(--text-faint)] block text-[10px]">Eligible Pool</span>
                    <span className="font-bold text-[var(--text-main)] mt-0.5 block">{formatNumber(selectedIntervention.eligible)}</span>
                  </div>
                  <div className="p-2.5 rounded bg-[var(--bg-surface)] border border-[var(--border-hairline)]">
                    <span className="text-[var(--text-faint)] block text-[10px]">Target Coverage</span>
                    <span className="font-bold text-prussian-400 mt-0.5 block">{selectedIntervention.coverage}</span>
                  </div>
                  <div className="p-2.5 rounded bg-[var(--bg-surface)] border border-[var(--border-hairline)]">
                    <span className="text-[var(--text-faint)] block text-[10px]">Participants</span>
                    <span className="font-bold text-[var(--text-main)] mt-0.5 block">{formatNumber(selectedIntervention.participants)}</span>
                  </div>
                  <div className="p-2.5 rounded bg-[var(--bg-surface)] border border-[var(--border-hairline)]">
                    <span className="text-[var(--text-faint)] block text-[10px]">Assumed Exit</span>
                    <span className="font-bold text-ochre-400 mt-0.5 block">{selectedIntervention.expected_transition}</span>
                  </div>
                  <div className="p-2.5 rounded bg-[var(--bg-surface)] border border-[var(--border-hairline)]">
                    <span className="text-[var(--text-faint)] block text-[10px]">Projected Exits</span>
                    <span className="font-bold text-sage-500 mt-0.5 block">{selectedIntervention.projected_exits}</span>
                  </div>
                </div>
                <p className="text-[10px] text-[var(--text-faint)] italic font-sans">
                  Accounting: Eligible ({selectedIntervention.eligible}) × Coverage ({selectedIntervention.coverage}) × Completion ({selectedIntervention.completion}) × Transition ({selectedIntervention.expected_transition}) = {selectedIntervention.projected_exits} exits.
                </p>
              </div>

              {/* Resources & Partners */}
              <div className="text-xs text-[var(--text-muted)] space-y-1.5 pt-1">
                <div><span className="text-[var(--text-main)] font-serif font-semibold">Budget & Resources: </span>{selectedIntervention.resources}</div>
                <div><span className="text-[var(--text-main)] font-serif font-semibold">Implementation Partners: </span>{selectedIntervention.partners.join(", ")}</div>
              </div>
            </div>

            {/* Governance Review Action Footer */}
            <div className="p-5 pt-3 border-t border-[var(--border-hairline)] flex flex-wrap items-center justify-between gap-3">
              <span className="text-[11px] text-[var(--text-faint)]">Proposal Author: {selectedIntervention.author}</span>
              <div className="flex items-center gap-2">
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleUpdateStatus(selectedIntervention.id, "Rejected")}
                >
                  <ThumbsDown className="h-3.5 w-3.5 mr-1" /> Reject
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => handleUpdateStatus(selectedIntervention.id, "Under Review")}
                >
                  Request Amendments
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  className="bg-sage-600 hover:bg-sage-500 border-sage-700/50"
                  onClick={() => handleUpdateStatus(selectedIntervention.id, "Approved")}
                >
                  <ThumbsUp className="h-3.5 w-3.5 mr-1" /> Formal Approval
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
