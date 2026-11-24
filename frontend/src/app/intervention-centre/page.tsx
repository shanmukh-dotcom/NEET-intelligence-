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
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-slate-100">Intervention Intelligence & Policy Governance</h3>
            <Badge variant="synthetic">HUMAN APPROVAL MANDATORY</Badge>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Translate transition patterns into structured intervention proposals with transparent coverage and arithmetic accounting.
          </p>
        </div>
      </div>

      {actionNotice && (
        <div className="p-3.5 rounded-lg border border-blue-500/30 bg-blue-950/20 text-xs text-blue-300 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-blue-400" />
            <span>{actionNotice}</span>
          </div>
          <Button variant="ghost" size="sm" onClick={() => setActionNotice(null)}>Dismiss</Button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Proposals List */}
        <div className="space-y-3">
          <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Registered Policy Proposals</h4>
          {interventions.map((item) => (
            <Card
              key={item.id}
              onClick={() => setSelectedIntervention(item)}
              className={`cursor-pointer border transition-all ${
                selectedIntervention.id === item.id
                  ? "border-blue-500 bg-slate-900 shadow-md"
                  : "border-slate-800 bg-slate-950/60 hover:border-slate-700"
              }`}
            >
              <CardHeader className="p-4 pb-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-slate-500">{item.id}</span>
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
                <CardTitle className="text-xs font-semibold text-slate-200 mt-1.5 line-clamp-2">{item.title}</CardTitle>
                <CardDescription className="text-[11px] text-slate-400 mt-1">{item.locality}</CardDescription>
              </CardHeader>
              <CardContent className="p-4 pt-2 text-xs flex items-center justify-between">
                <span className="text-slate-400">Est. Exits:</span>
                <span className="font-bold text-emerald-400 font-mono">{item.projected_exits} youth</span>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Right Column: Detailed Proposal Dossier & Governance Actions */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="border-slate-800 bg-slate-900/90 text-xs">
            <CardHeader className="p-5 pb-3 border-b border-slate-800">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono text-blue-400">{selectedIntervention.id}</span>
                  <CardTitle className="text-sm font-bold text-slate-100 mt-1">{selectedIntervention.title}</CardTitle>
                  <CardDescription className="text-xs text-slate-400 mt-0.5">{selectedIntervention.locality}</CardDescription>
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
            </CardHeader>

            <CardContent className="p-5 space-y-4">
              {/* Problem & Evidence */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1 p-3 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="font-semibold text-rose-400 block">Identified Structural Problem</span>
                  <p className="text-slate-300 leading-relaxed">{selectedIntervention.problem}</p>
                </div>
                <div className="space-y-1 p-3 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="font-semibold text-blue-400 block">Empirical Model Evidence</span>
                  <p className="text-slate-300 leading-relaxed">{selectedIntervention.evidence}</p>
                </div>
              </div>

              {/* Implementation Components */}
              <div className="space-y-2">
                <span className="font-semibold text-slate-200 block">Core Implementation Components:</span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {selectedIntervention.components.map((c, i) => (
                    <div key={i} className="p-2.5 rounded bg-slate-950/70 border border-slate-800/80 text-slate-300 flex items-start gap-2">
                      <span className="text-blue-400 font-bold">•</span>
                      <span>{c}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Parametric Coverage & Arithmetic Accounting */}
              <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-200">Coverage & Exit Accounting Formula</span>
                  <Badge variant="outline">ARITHMETIC PROJECTION</Badge>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-center font-mono text-[11px] pt-1">
                  <div className="p-2 rounded bg-slate-900 border border-slate-800">
                    <span className="text-slate-500 block text-[10px]">Eligible Pool</span>
                    <span className="font-bold text-slate-200">{formatNumber(selectedIntervention.eligible)}</span>
                  </div>
                  <div className="p-2 rounded bg-slate-900 border border-slate-800">
                    <span className="text-slate-500 block text-[10px]">Target Coverage</span>
                    <span className="font-bold text-blue-400">{selectedIntervention.coverage}</span>
                  </div>
                  <div className="p-2 rounded bg-slate-900 border border-slate-800">
                    <span className="text-slate-500 block text-[10px]">Participants</span>
                    <span className="font-bold text-slate-200">{formatNumber(selectedIntervention.participants)}</span>
                  </div>
                  <div className="p-2 rounded bg-slate-900 border border-slate-800">
                    <span className="text-slate-500 block text-[10px]">Assumed Transition</span>
                    <span className="font-bold text-teal-400">{selectedIntervention.expected_transition}</span>
                  </div>
                  <div className="p-2 rounded bg-slate-900 border border-slate-800">
                    <span className="text-slate-500 block text-[10px]">Projected Exits</span>
                    <span className="font-bold text-emerald-400">{selectedIntervention.projected_exits}</span>
                  </div>
                </div>
                <p className="text-[10px] text-slate-500 italic mt-1">
                  Accounting: Eligible ({selectedIntervention.eligible}) × Coverage ({selectedIntervention.coverage}) × Completion ({selectedIntervention.completion}) × Transition ({selectedIntervention.expected_transition}) = {selectedIntervention.projected_exits} exits.
                </p>
              </div>

              {/* Resources & Partners */}
              <div className="text-xs text-slate-400 space-y-1">
                <div><span className="text-slate-300 font-semibold">Budget & Resources: </span>{selectedIntervention.resources}</div>
                <div><span className="text-slate-300 font-semibold">Implementation Partners: </span>{selectedIntervention.partners.join(", ")}</div>
              </div>
            </CardContent>

            {/* Governance Review Action Footer */}
            <CardFooter className="p-5 pt-3 border-t border-slate-800 flex items-center justify-between">
              <span className="text-[11px] text-slate-500">Proposal Author: {selectedIntervention.author}</span>
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
                  className="bg-emerald-600 hover:bg-emerald-500"
                  onClick={() => handleUpdateStatus(selectedIntervention.id, "Approved")}
                >
                  <ThumbsUp className="h-3.5 w-3.5 mr-1" /> Formal Approval
                </Button>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
