"use client";

import React, { useState } from "react";
import {
  Settings,
  Shield,
  User,
  Key,
  Clock,
  CheckCircle,
  FileText,
  Sliders,
  Database,
  Lock
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input, Select } from "@/components/ui/input";

const USERS = [
  { name: "Dr. A. Sharma", email: "a.sharma@neet-platform.ac.in", role: "Principal Researcher", access: "Full Analytics & Proposals" },
  { name: "Prof. M. Verma", email: "m.verma@policy-institute.res.in", role: "Research Supervisor", access: "Supervisory Governance Review" },
  { name: "S. Rao", email: "s.rao@rural-dev.gov.in", role: "Policy Analyst", access: "Read & Scenario Simulation" },
  { name: "Admin Console", email: "admin@neet.platform", role: "Platform Administrator", access: "System & User Management" }
];

const AUDIT_LOGS = [
  { id: "AUD-891", event: "Intervention Proposal Status Updated", details: "INT-001 updated to 'Proposed' by Dr. A. Sharma", timestamp: "2026-11-10 14:22:10" },
  { id: "AUD-890", event: "XGBoost Classifier Retrained", details: "Model MOD-XGB-01 trained on Waves 1-4, test ROC-AUC: 0.842", timestamp: "2026-11-09 11:15:32" },
  { id: "AUD-889", event: "Dataset Ingestion & Inspection", details: "DS-PLFS-SYNTH-01 inspected; 50,000 records validated", timestamp: "2026-11-08 09:40:18" },
  { id: "AUD-888", event: "Multi-Scenario Comparison Executed", details: "Simulated 2021-2031 trajectory across Baseline, Moderate, Expanded", timestamp: "2026-11-05 16:05:44" },
  { id: "AUD-887", event: "Demonstration Cohort Initialized", details: "50,000 synthetic youth records seeded across 20 localities", timestamp: "2026-11-01 08:00:00" }
];

export default function SettingsPage() {
  const [ageMin, setAgeMin] = useState(15);
  const [ageMax, setAgeMax] = useState(24);
  const [workHours, setWorkHours] = useState(0);
  const [savedNotice, setSavedNotice] = useState(false);

  const handleSave = () => {
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2500);
  };

  return (
    <div className="space-y-8">
      {/* Editorial Chapter Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-[var(--border-hairline)]">
        <div>
          <div className="flex items-center gap-2 text-xs font-sans text-saffron-500">
            <span className="font-serif italic font-semibold">Governance</span>
            <span className="text-[var(--text-faint)]">/</span>
            <span>Measurement Standards & Security</span>
          </div>
          <h2 className="text-xl font-serif font-semibold text-[var(--text-main)] mt-1">
            Platform Governance & Measurement Configuration
          </h2>
          <p className="text-xs text-[var(--text-muted)] font-sans mt-0.5">
            Operational definitions, role-based privileges, and immutable cryptographic audit trails.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="font-mono text-[10px]">
            ILO / PLFS Harmonised
          </Badge>
        </div>
      </div>

      {savedNotice && (
        <div className="p-3.5 rounded border border-sage-500/30 bg-sage-500/10 text-xs text-sage-300 flex items-center gap-2">
          <CheckCircle className="h-4 w-4 text-sage-400" />
          <span className="font-sans">Measurement configuration updated and recorded in platform audit ledger.</span>
        </div>
      )}

      <Tabs defaultValue="measurement" className="w-full">
        <TabsList className="grid grid-cols-3 w-full max-w-lg">
          <TabsTrigger value="measurement">Measurement Defaults</TabsTrigger>
          <TabsTrigger value="roles">Access & Roles (RBAC)</TabsTrigger>
          <TabsTrigger value="audit">Immutable Audit Log</TabsTrigger>
        </TabsList>

        {/* Tab 1: Measurement Defaults */}
        <TabsContent value="measurement" className="space-y-4 pt-4">
          <Card className="max-w-2xl text-xs">
            <CardHeader>
              <CardTitle className="text-sm">Active NEET Classification Standard</CardTitle>
              <CardDescription>Configure default operational thresholds applied during microdata classification</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 font-sans">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[var(--text-main)] font-medium block mb-1">Minimum Eligible Age</label>
                  <Input type="number" value={ageMin} onChange={(e) => setAgeMin(Number(e.target.value))} />
                </div>
                <div>
                  <label className="text-[var(--text-main)] font-medium block mb-1">Maximum Eligible Age</label>
                  <Input type="number" value={ageMax} onChange={(e) => setAgeMax(Number(e.target.value))} />
                </div>
              </div>

              <div>
                <label className="text-[var(--text-main)] font-medium block mb-1">Weekly Work-Hour Threshold (0 = Standard ILO)</label>
                <Input type="number" value={workHours} onChange={(e) => setWorkHours(Number(e.target.value))} />
                <span className="text-[10px] text-[var(--text-faint)] mt-1 block">
                  Standard definition classifies individuals working 0 hours in reference week as potential NEET.
                </span>
              </div>

              <div>
                <label className="text-[var(--text-main)] font-medium block mb-1">Measurement Benchmark Standard</label>
                <Select defaultValue="ilo">
                  <option value="ilo">ILO / PLFS Reference Week Activity Definition</option>
                  <option value="un">UN Sustainable Development Goals (SDG 8.6.1)</option>
                  <option value="nyp">India National Youth Policy (Ages 15-29)</option>
                </Select>
              </div>

              <div className="pt-2">
                <Button onClick={handleSave} size="default">
                  Save Classification Configuration
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 2: Roles */}
        <TabsContent value="roles" className="space-y-4 pt-4">
          <Card className="text-xs">
            <CardHeader>
              <CardTitle className="text-sm">Authorized Stakeholders & Role-Based Permissions</CardTitle>
              <CardDescription>Granular privileges governing dataset mutation, model runs, and policy approvals</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <table className="w-full text-left">
                <thead className="bg-[var(--bg-elevated)] text-[var(--text-muted)] border-y border-[var(--border-hairline)] font-sans">
                  <tr>
                    <th className="py-2.5 px-4 font-medium">Authorized User</th>
                    <th className="py-2.5 px-4 font-medium">Institution / Email</th>
                    <th className="py-2.5 px-4 font-medium">Assigned Role</th>
                    <th className="py-2.5 px-4 font-medium">Permission Scope</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border-hairline)] font-mono">
                  {USERS.map((u, i) => (
                    <tr key={i} className="hover:bg-[var(--bg-elevated)]/60 transition-colors">
                      <td className="py-3 px-4 font-serif font-semibold text-[var(--text-main)]">{u.name}</td>
                      <td className="py-3 px-4 text-[var(--text-muted)]">{u.email}</td>
                      <td className="py-3 px-4">
                        <Badge variant="outline" className="font-sans text-[11px]">{u.role}</Badge>
                      </td>
                      <td className="py-3 px-4 font-sans text-[var(--text-muted)]">{u.access}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 3: Audit Log */}
        <TabsContent value="audit" className="space-y-4 pt-4">
          <Card className="text-xs">
            <CardHeader>
              <CardTitle className="text-sm">Platform Audit Ledger</CardTitle>
              <CardDescription>Cryptographically traceable trail of all analytical runs, harmonisations, and policy decisions</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-[var(--border-hairline)]">
                {AUDIT_LOGS.map((log) => (
                  <div key={log.id} className="p-4 flex items-center justify-between hover:bg-[var(--bg-elevated)]/60 transition-colors">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-saffron-500 text-[11px] font-medium">{log.id}</span>
                        <span className="font-serif font-semibold text-[var(--text-main)]">{log.event}</span>
                      </div>
                      <p className="text-[var(--text-muted)] font-sans text-[11px]">{log.details}</p>
                    </div>
                    <span className="font-mono text-[10px] text-[var(--text-faint)] shrink-0">{log.timestamp}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
