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
} from "lucide-react";
import { WORKSPACE_NAVIGATION } from "@/lib/constants";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const ICON_MAP: Record<string, React.ReactNode> = {
  LayoutDashboard: <LayoutDashboard className="h-3.5 w-3.5" />,
  Database: <Database className="h-3.5 w-3.5" />,
  Sparkles: <Sparkles className="h-3.5 w-3.5" />,
  Users: <Users className="h-3.5 w-3.5" />,
  Brain: <Brain className="h-3.5 w-3.5" />,
  ArrowRightLeft: <ArrowRightLeft className="h-3.5 w-3.5" />,
  Lightbulb: <Lightbulb className="h-3.5 w-3.5" />,
  Target: <Target className="h-3.5 w-3.5" />,
  PlayCircle: <PlayCircle className="h-3.5 w-3.5" />,
  MessageSquare: <MessageSquare className="h-3.5 w-3.5" />,
  FileText: <FileText className="h-3.5 w-3.5" />,
  Settings: <Settings className="h-3.5 w-3.5" />,
};

export function Sidebar() {
  const pathname = usePathname();

  const ROMAN_NUMERALS: Record<number, string> = {
    1: "I",
    2: "II",
    3: "III",
    4: "IV",
    5: "V",
  };

  return (
    <aside className="w-64 border-r border-[var(--border-hairline)] bg-[var(--bg-surface)] flex flex-col h-screen select-none shrink-0 transition-colors duration-200">
      {/* Editorial Wordmark Header */}
      <div className="h-16 border-b border-[var(--border-hairline)] flex items-center px-6 gap-3.5 shrink-0">
        <div className="h-8 w-8 rounded border border-[var(--border-muted)] bg-[var(--bg-elevated)] flex items-center justify-center font-serif text-sm font-semibold text-saffron-500 shadow-sm">
          <span>§</span>
        </div>
        <div className="flex flex-col">
          <div className="flex items-baseline gap-1">
            <span className="font-serif font-bold text-sm tracking-tight text-[var(--text-main)]">
              NEET
            </span>
            <span className="text-saffron-500 font-serif font-bold text-sm">·</span>
            <span className="font-serif italic text-xs text-[var(--text-muted)] font-normal">
              Intelligence
            </span>
          </div>
          <span className="text-[10px] font-sans text-[var(--text-faint)] tracking-normal">
            India Youth Analytics
          </span>
        </div>
      </div>

      {/* Chapters & Navigation */}
      <nav className="flex-1 overflow-y-auto px-4 py-5 space-y-6">
        {WORKSPACE_NAVIGATION.map((group, groupIdx) => (
          <div key={groupIdx} className="space-y-1.5">
            <div className="px-2 pb-1 text-[11px] font-sans text-[var(--text-faint)] flex items-center gap-2">
              {group.workspaceNumber ? (
                <span className="font-serif italic text-[11px] text-saffron-500 font-medium">
                  Chapter {ROMAN_NUMERALS[group.workspaceNumber]}.
                </span>
              ) : (
                <span className="font-serif italic text-[11px] text-[var(--text-faint)]">
                  Index.
                </span>
              )}
              <span className="tracking-normal font-medium text-[var(--text-muted)]">{group.label}</span>
            </div>

            <div className="space-y-0.5">
              {group.items.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "group relative flex items-center justify-between px-3 py-1.5 rounded text-xs transition-colors",
                      isActive
                        ? "text-[var(--text-main)] font-medium bg-[var(--bg-elevated)] shadow-subtle"
                        : "text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-base)]/50"
                    )}
                  >
                    {isActive && (
                      <span className="absolute left-0 top-1.5 bottom-1.5 w-[2px] bg-saffron-500 rounded-r" />
                    )}
                    <div className="flex items-center gap-2.5 truncate">
                      <span
                        className={cn(
                          "transition-colors",
                          isActive ? "text-saffron-500" : "text-[var(--text-faint)] group-hover:text-[var(--text-muted)]"
                        )}
                      >
                        {ICON_MAP[item.icon]}
                      </span>
                      <span className="truncate">{item.name}</span>
                    </div>
                    {item.badge && (
                      <span className="text-[10px] font-mono text-saffron-500/80 px-1 py-0.2 bg-saffron-500/10 rounded">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Institutional Researcher Footer */}
      <div className="p-4 border-t border-[var(--border-hairline)] bg-[var(--bg-elevated)]/50 shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-7 w-7 rounded border border-[var(--border-muted)] bg-[var(--bg-surface)] flex items-center justify-center text-[11px] font-serif font-medium text-[var(--text-muted)]">
              AS
            </div>
            <div>
              <p className="text-xs font-medium text-[var(--text-main)] leading-tight">Dr. A. Sharma</p>
              <p className="text-[10px] text-[var(--text-faint)] font-sans">Principal Researcher</p>
            </div>
          </div>
          <span className="text-[10px] font-mono text-[var(--text-faint)]" title="Verifiable Audit Provenance">
            v2.4
          </span>
        </div>
      </div>
    </aside>
  );
}
