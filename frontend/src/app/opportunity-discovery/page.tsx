"use client";

import React, { useState } from "react";
import {
  Lightbulb,
  CheckCircle,
  Layers,
  ArrowRight,
  Sparkles,
  Award,
  Sliders,
  DollarSign,
  Building,
  GraduationCap
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input, Select } from "@/components/ui/input";

const OPPORTUNITIES = [
  {
    id: "OPP-001",
    name: "Community Food Processing & Digital Commerce Cooperative",
    category: "Community Enterprise",
    target: "Rural young women (18-29) with caregiving responsibilities and seasonal agricultural exposure",
    grade: "Grade B",
    grade_color: "blue",
    investment: "INR 4.5 - 6.0 Lakhs per SHG cluster",
    duration: "8 weeks",
    skills: "Batch preservation, food hygiene, digital order fulfillment, collective accounting",
    infrastructure: "Single-phase power, community storage depot, shared 4G tablet terminal",
    observed_exit: "34.2% NEET exit rate over 18 months"
  },
  {
    id: "OPP-002",
    name: "Distributed Rural BPO & Localized Data Annotation Hub",
    category: "Digital Employment",
    target: "Rural & peri-urban secondary and higher secondary educated youth (18-24)",
    grade: "Grade A",
    grade_color: "emerald",
    investment: "INR 8.0 - 12.0 Lakhs for 15-workstation solar hub",
    duration: "6 weeks",
    skills: "Vernacular keyboard literacy, OCR verification, audio transcription",
    infrastructure: "Uninterrupted fiber/4G, solar backup power, air-cooled workstations",
    observed_exit: "46.8% regularized digital tasking transition"
  },
  {
    id: "OPP-003",
    name: "Solar Micro-Grid & Decentralized EV Fleet Maintenance",
    category: "Green Apprenticeship",
    target: "Peri-urban & rural young men and women (18-28) seeking technical certifications",
    grade: "Grade B",
    grade_color: "blue",
    investment: "INR 5.0 - 7.5 Lakhs equipment lab per cohort",
    duration: "12 weeks",
    skills: "Multimeter diagnostics, battery load balancing, safety protocol compliance",
    infrastructure: "Dedicated workshop bay, test panels, battery diagnostic rig",
    observed_exit: "52.1% permanent wage or enterprise transition"
  },
  {
    id: "OPP-004",
    name: "Frontline Community Health & Early Childhood Care Auxiliary",
    category: "Community Care Economy",
    target: "Urban informal settlement and peri-urban young women (19-30)",
    grade: "Grade B",
    grade_color: "blue",
    investment: "INR 3.0 - 4.5 Lakhs clinical simulation setup",
    duration: "10 weeks",
    skills: "First aid, infant nutrition tracking, early childhood pedagogy",
    infrastructure: "Primary health clinic tie-up, accredited nurse trainer",
    observed_exit: "41.5% regularized employment transition"
  },
  {
    id: "OPP-005",
    name: "Precision Agro-Service & Drone Operation Collective",
    category: "Agri-Tech Enterprise",
    target: "Rural educated youth (18-29) with polytechnic or secondary background",
    grade: "Grade C",
    grade_color: "amber",
    investment: "INR 12.0 - 18.0 Lakhs per agri-drone van unit",
    duration: "14 weeks",
    skills: "Remote pilot basics, GPS map boundary setting, chemical dilution",
    infrastructure: "Battery charging station, chemical repository",
    observed_exit: "38.7% sustainable enterprise earnings"
  },
  {
    id: "OPP-006",
    name: "Vernacular Artisan E-Commerce & Craft Studio",
    category: "Creative Economy",
    target: "Handicraft-concentrated clusters, artisan family descendants (18-32)",
    grade: "Grade B",
    grade_color: "blue",
    investment: "INR 2.5 - 4.0 Lakhs studio photography kiosk",
    duration: "8 weeks",
    skills: "Design color harmonization, smartphone studio photography, cataloging",
    infrastructure: "Common facility workshop, high-speed internet, secure dispatch depot",
    observed_exit: "29.4% exit from underemployment"
  }
];

export default function OpportunityDiscoveryPage() {
  const [selectedOpp, setSelectedOpp] = useState<typeof OPPORTUNITIES[0] | null>(null);
  const [targetRural, setTargetRural] = useState(80);
  const [targetFemale, setTargetFemale] = useState(85);
  const [targetCare, setTargetCare] = useState("High");
  const [matchedResults, setMatchedResults] = useState<any[] | null>(null);

  const runMatching = () => {
    // Generate realistic multi-factor similarity matching
    const results = [
      {
        opp: OPPORTUNITIES[0],
        score: 88.4,
        dims: { geographic: "92%", gender: "94%", economic: "88%", care: "90%" },
        similarities: ["Highly comparable agrarian setting", "Identical female caregiving concentration (>4 hrs daily)"],
        differences: ["Slightly lower local road connectivity in target district"],
        adaptation: "Calibrate collective shifts around seasonal paddy harvesting cycles."
      },
      {
        opp: OPPORTUNITIES[1],
        score: 84.1,
        dims: { geographic: "82%", gender: "85%", economic: "86%", care: "84%" },
        similarities: ["Close demographic age profile (18-24)", "Moderate baseline literacy"],
        differences: ["Target locality lacks fiber broadband, requires 4G/solar hybrid terminal"],
        adaptation: "Integrate village crèche stipends to enable 3-hour micro-work blocks."
      },
      {
        opp: OPPORTUNITIES[3],
        score: 79.6,
        dims: { geographic: "75%", gender: "96%", economic: "80%", care: "82%" },
        similarities: ["High concentration of young mothers seeking doorstep care credentials"],
        differences: ["Target area is more rural than benchmark peri-urban pilot site"],
        adaptation: "Coordinate with District Health Mission for decentralized clinical rotations."
      }
    ];
    setMatchedResults(results);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-slate-100">Opportunity Intelligence & Pathway Matching</h3>
            <Badge variant="teal">EVIDENCE-GRADED</Badge>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Discover promising livelihood and skilling pathways associated with successful NEET exits, and match comparable populations.
          </p>
        </div>
      </div>

      <Tabs defaultValue="library" className="w-full">
        <TabsList className="grid grid-cols-2 w-full max-w-md">
          <TabsTrigger value="library">Opportunity Library</TabsTrigger>
          <TabsTrigger value="matching">Population Similarity Matching</TabsTrigger>
        </TabsList>

        {/* Tab 1: Library */}
        <TabsContent value="library" className="space-y-4 pt-2">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {OPPORTUNITIES.map((opp) => (
              <Card
                key={opp.id}
                className="border-slate-800 bg-slate-950/60 hover:border-slate-700 transition-all flex flex-col justify-between"
              >
                <CardHeader className="p-4 pb-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-slate-500">{opp.category}</span>
                    <Badge variant={opp.grade_color === "emerald" ? "success" : opp.grade_color === "blue" ? "default" : "warning"}>
                      {opp.grade}
                    </Badge>
                  </div>
                  <CardTitle className="text-xs font-semibold text-slate-100 mt-2 line-clamp-2">{opp.name}</CardTitle>
                  <CardDescription className="text-[11px] text-slate-400 mt-1 line-clamp-2">{opp.target}</CardDescription>
                </CardHeader>
                <CardContent className="p-4 pt-2 space-y-2 text-xs">
                  <div className="p-2.5 rounded bg-slate-900 border border-slate-800 space-y-1 text-[11px]">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Initial Setup:</span>
                      <span className="text-slate-200 font-medium">{opp.investment}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Duration:</span>
                      <span className="text-slate-200 font-medium">{opp.duration}</span>
                    </div>
                    <div className="flex justify-between border-t border-slate-800 pt-1">
                      <span className="text-slate-400">Observed Exit:</span>
                      <span className="text-emerald-400 font-bold">{opp.observed_exit}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="p-4 pt-0">
                  <Button variant="outline" size="sm" className="w-full text-xs" onClick={() => setSelectedOpp(opp)}>
                    View Full Profile & Evidence
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          {/* Modal / Detailed Drawer if selected */}
          {selectedOpp && (
            <Card className="border-blue-500/40 bg-slate-900/95 mt-4 p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <h4 className="text-sm font-bold text-white">{selectedOpp.name}</h4>
                  <p className="text-xs text-slate-400">{selectedOpp.category} | {selectedOpp.grade} Evidence</p>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setSelectedOpp(null)}>Close</Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="space-y-2">
                  <span className="font-semibold text-slate-300 block">Required Technical & Soft Skills:</span>
                  <p className="text-slate-400 bg-slate-950 p-3 rounded border border-slate-800">{selectedOpp.skills}</p>
                </div>
                <div className="space-y-2">
                  <span className="font-semibold text-slate-300 block">Required Local Infrastructure:</span>
                  <p className="text-slate-400 bg-slate-950 p-3 rounded border border-slate-800">{selectedOpp.infrastructure}</p>
                </div>
              </div>
            </Card>
          )}
        </TabsContent>

        {/* Tab 2: Matching */}
        <TabsContent value="matching" className="space-y-4 pt-2">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-1 border-slate-800 bg-slate-900/90">
              <CardHeader>
                <CardTitle className="text-sm">Define Target Population Profile</CardTitle>
                <CardDescription>Specify demographic and institutional characteristics for matching</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-xs">
                <div>
                  <label className="text-slate-300 font-medium block mb-1">Target Locality Cluster</label>
                  <Select defaultValue="B3">
                    <option value="B3">Fictional District B3 (Rural Dryland)</option>
                    <option value="C2">Fictional District C2 (Forest Fringe)</option>
                    <option value="A4">Fictional District A4 (Urban Industrial)</option>
                  </Select>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <label className="text-slate-300 font-medium">Rural Share</label>
                    <span className="text-slate-400">{targetRural}%</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    value={targetRural}
                    onChange={(e) => setTargetRural(Number(e.target.value))}
                    className="w-full accent-blue-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                  />
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <label className="text-slate-300 font-medium">Female Share</label>
                    <span className="text-slate-400">{targetFemale}%</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    value={targetFemale}
                    onChange={(e) => setTargetFemale(Number(e.target.value))}
                    className="w-full accent-blue-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-medium block mb-1">Unpaid Caregiving Burden</label>
                  <Select value={targetCare} onChange={(e) => setTargetCare(e.target.value)}>
                    <option value="High">High (>4 hours/day average)</option>
                    <option value="Moderate">Moderate (2-4 hours/day)</option>
                    <option value="Low">Low (&lt;2 hours/day)</option>
                  </Select>
                </div>
                <Button onClick={runMatching} className="w-full">
                  <Sparkles className="h-3.5 w-3.5 mr-1.5" /> Execute Multi-Factor Matching
                </Button>
              </CardContent>
            </Card>

            {/* Results Display */}
            <div className="lg:col-span-2 space-y-4">
              {!matchedResults ? (
                <div className="h-80 rounded-xl border border-dashed border-slate-800 flex flex-col items-center justify-center text-center p-6 text-slate-500 text-xs">
                  <Lightbulb className="h-8 w-8 mb-2 opacity-50" />
                  <span>Configure your target population parameters on the left and click 'Execute Multi-Factor Matching'</span>
                </div>
              ) : (
                matchedResults.map((m, idx) => (
                  <Card key={idx} className="border-slate-800 bg-slate-900/90 text-xs">
                    <CardHeader className="p-4 pb-2">
                      <div className="flex items-center justify-between">
                        <Badge variant="teal">RANK #{idx + 1} MATCH</Badge>
                        <div className="flex items-center gap-1.5">
                          <span className="text-slate-400">Match Score:</span>
                          <span className="text-base font-bold text-blue-400 font-mono">{m.score}%</span>
                        </div>
                      </div>
                      <CardTitle className="text-sm font-semibold text-slate-100 mt-1">{m.opp.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-2 space-y-3">
                      <div className="grid grid-cols-4 gap-2 text-center font-mono text-[11px]">
                        <div className="p-2 rounded bg-slate-950 border border-slate-800">
                          <span className="text-slate-500 block text-[10px]">Geographic</span>
                          <span className="font-semibold text-slate-200">{m.dims.geographic}</span>
                        </div>
                        <div className="p-2 rounded bg-slate-950 border border-slate-800">
                          <span className="text-slate-500 block text-[10px]">Gender</span>
                          <span className="font-semibold text-slate-200">{m.dims.gender}</span>
                        </div>
                        <div className="p-2 rounded bg-slate-950 border border-slate-800">
                          <span className="text-slate-500 block text-[10px]">Economic</span>
                          <span className="font-semibold text-slate-200">{m.dims.economic}</span>
                        </div>
                        <div className="p-2 rounded bg-slate-950 border border-slate-800">
                          <span className="text-slate-500 block text-[10px]">Care Burden</span>
                          <span className="font-semibold text-slate-200">{m.dims.care}</span>
                        </div>
                      </div>

                      <div className="space-y-1.5 pt-1">
                        <span className="font-semibold text-slate-300 block">Key Similarities:</span>
                        <ul className="list-disc list-inside text-slate-400 space-y-0.5">
                          {m.similarities.map((s: string, i: number) => (
                            <li key={i}>{s}</li>
                          ))}
                        </ul>
                      </div>

                      <div className="p-3 rounded bg-blue-950/20 border border-blue-500/30 text-blue-300">
                        <span className="font-semibold block mb-0.5">Required Local Adaptation:</span>
                        {m.adaptation}
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
