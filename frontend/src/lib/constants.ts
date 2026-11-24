export const APP_NAME = "NEET Intelligence Platform";
export const APP_SUBTITLE = "Youth NEET Prediction, Transition Analysis & Evidence-Based Intervention";
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

export interface NavItem {
  name: string;
  href: string;
  icon: string;
  badge?: string;
}

export const NAVIGATION_ITEMS: NavItem[] = [
  { name: "Overview Dashboard", href: "/", icon: "LayoutDashboard" },
  { name: "Data Intelligence", href: "/data-intelligence", icon: "Database" },
  { name: "Synthetic Generator", href: "/synthetic-generator", icon: "Sparkles", badge: "Demo" },
  { name: "Population Explorer", href: "/population-explorer", icon: "Users" },
  { name: "NEET Prediction", href: "/neet-prediction", icon: "Brain" },
  { name: "Transition Intelligence", href: "/transition-intelligence", icon: "ArrowRightLeft" },
  { name: "Opportunity Discovery", href: "/opportunity-discovery", icon: "Lightbulb" },
  { name: "Intervention Centre", href: "/intervention-centre", icon: "Target" },
  { name: "Scenario Simulator", href: "/scenario-simulator", icon: "PlayCircle" },
  { name: "Ask NEET Assistant", href: "/ai-assistant", icon: "MessageSquare", badge: "AI" },
  { name: "Research Reports", href: "/research-reports", icon: "FileText" },
  { name: "Governance & Settings", href: "/settings", icon: "Settings" }
];

export const USER_ROLES = [
  "Platform Administrator",
  "Principal Researcher",
  "Research Supervisor",
  "Policy Analyst",
  "Programme Officer",
  "Read-only Viewer"
];
