export const APP_NAME = "NEET Intelligence Platform";
export const APP_SUBTITLE = "Youth NEET Prediction, Transition Analysis & Evidence-Based Intervention";
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

export interface NavItem {
  name: string;
  href: string;
  icon: string;
  badge?: string;
}

export interface NavGroup {
  workspaceNumber?: number;
  label: string;
  items: NavItem[];
}

export const WORKSPACE_NAVIGATION: NavGroup[] = [
  {
    label: "Main",
    items: [
      { name: "Overview Dashboard", href: "/", icon: "LayoutDashboard" }
    ]
  },
  {
    workspaceNumber: 1,
    label: "Data Intelligence",
    items: [
      { name: "Ingestion & Harmonisation", href: "/data-intelligence", icon: "Database" },
      { name: "Synthetic Cohort Generator", href: "/synthetic-generator", icon: "Sparkles", badge: "Demo" },
      { name: "Population Explorer", href: "/population-explorer", icon: "Users" }
    ]
  },
  {
    workspaceNumber: 2,
    label: "NEET Prediction",
    items: [
      { name: "Risk Models & SHAP", href: "/neet-prediction", icon: "Brain" }
    ]
  },
  {
    workspaceNumber: 3,
    label: "Transition Intelligence",
    items: [
      { name: "Markov Dynamics & Survival", href: "/transition-intelligence", icon: "ArrowRightLeft" }
    ]
  },
  {
    workspaceNumber: 4,
    label: "Opportunity Intelligence",
    items: [
      { name: "Pathways & Similarity", href: "/opportunity-discovery", icon: "Lightbulb" }
    ]
  },
  {
    workspaceNumber: 5,
    label: "Intervention & Simulation",
    items: [
      { name: "Intervention Centre", href: "/intervention-centre", icon: "Target" },
      { name: "2021-2031 Simulator", href: "/scenario-simulator", icon: "PlayCircle" }
    ]
  },
  {
    label: "Research Tools & Governance",
    items: [
      { name: "Ask NEET Assistant", href: "/ai-assistant", icon: "MessageSquare", badge: "AI" },
      { name: "Research Reports", href: "/research-reports", icon: "FileText" },
      { name: "Governance & Settings", href: "/settings", icon: "Settings" }
    ]
  }
];

// Flat array for backwards compatibility
export const NAVIGATION_ITEMS: NavItem[] = WORKSPACE_NAVIGATION.flatMap((group) => group.items);

export const USER_ROLES = [
  "Platform Administrator",
  "Principal Researcher",
  "Research Supervisor",
  "Policy Analyst",
  "Programme Officer",
  "Read-only Viewer"
];
