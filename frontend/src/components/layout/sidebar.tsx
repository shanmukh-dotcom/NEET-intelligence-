"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Database,
  Sparkles,
  Users,
  Brain,
  ArrowRightLeft,
  Lightbulb,
  Target,
  PlayCircle,
  MessageSquare,
  FileText,
  Settings,
  ShieldCheck,
  ChevronRight
} from "lucide-react";
import { NAVIGATION_ITEMS } from "@/lib/constants";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const ICON_MAP: Record<string, React.ReactNode> = {
  LayoutDashboard: <LayoutDashboard className="h-4 w-4" />,
  Database: <Database className="h-4 w-4" />,
  Sparkles: <Sparkles className="h-4 w-4" />,
  Users: <Users className="h-4 w-4" />,
  Brain: <Brain className="h-4 w-4" />,
  ArrowRightLeft: <ArrowRightLeft className="h-4 w-4" />,
  Lightbulb: <Lightbulb className="h-4 w-4" />,
  Target: <Target className="h-4 w-4" />,
  PlayCircle: <PlayCircle className="h-4 w-4" />,
  MessageSquare: <MessageSquare className="h-4 w-4" />,
  FileText: <FileText className="h-4 w-4" />,
  Settings: <Settings className="h-4 w-4" />
};

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r border-slate-800 bg-slate-950/95 flex flex-col h-screen select-none">
      {/* Brand Header */}
      <div className="h-16 border-b border-slate-800 flex items-center px-5 gap-3">
        <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white shadow-md shadow-blue-500/20">
          N
        </div>
        <div>
          <h1 className="text-sm font-bold tracking-tight text-white">NEET Intelligence</h1>
          <p className="text-[10px] text-slate-400 font-mono">INDIA YOUTH ANALYTICS</p>
        </div>
      </div>

      {/* Mode Indicator Banner */}
      <div className="px-4 py-2 border-b border-slate-800/60 bg-blue-950/20 flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-[11px] text-slate-300">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-medium">Research Workspace</span>
        </div>
        <Badge variant="synthetic">SYNTHETIC DEMO</Badge>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {NAVIGATION_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all group",
                isActive
                  ? "bg-blue-600/15 text-blue-400 border border-blue-500/30"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
              )}
            >
              <div className="flex items-center gap-2.5">
                <span className={cn(isActive ? "text-blue-400" : "text-slate-400 group-hover:text-slate-200")}>
                  {ICON_MAP[item.icon]}
                </span>
                <span>{item.name}</span>
              </div>
              {item.badge && (
                <span className="text-[10px] bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded font-mono">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* User Session Footer */}
      <div className="p-4 border-t border-slate-800 bg-slate-900/40">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-7 w-7 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-semibold text-slate-300">
              PR
            </div>
            <div>
              <p className="text-xs font-medium text-slate-200 leading-tight">Dr. A. Sharma</p>
              <p className="text-[10px] text-slate-400">Principal Researcher</p>
            </div>
          </div>
          <ShieldCheck className="h-4 w-4 text-emerald-400" />
        </div>
      </div>
    </aside>
  );
}
