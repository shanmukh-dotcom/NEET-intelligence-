import * as React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface ChartCardProps {
  title: string;
  description?: string;
  badge?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  heightClass?: string;
}

export function ChartCard({
  title,
  description,
  badge,
  actions,
  children,
  className,
  heightClass = "h-72"
}: ChartCardProps) {
  return (
    <div className={cn("rounded border border-[var(--border-hairline)] bg-[var(--bg-surface)] p-5 transition-colors", className)}>
      <div className="flex flex-row items-baseline justify-between pb-3 border-b border-[var(--border-hairline)] gap-4">
        <div>
          <div className="flex items-baseline gap-2.5">
            <h4 className="text-sm font-serif font-semibold text-[var(--text-main)] tracking-tight">{title}</h4>
            {badge && (
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded border border-[var(--border-hairline)] text-[var(--text-faint)] bg-[var(--bg-elevated)]">
                {badge}
              </span>
            )}
          </div>
          {description && <p className="text-xs text-[var(--text-muted)] font-sans mt-0.5">{description}</p>}
        </div>
        {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
      </div>
      <div className="pt-4">
        <div className={cn("w-full", heightClass)}>
          {children}
        </div>
      </div>
    </div>
  );
}
