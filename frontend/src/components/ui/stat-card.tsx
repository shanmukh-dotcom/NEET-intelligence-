import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  subValue?: string;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon?: React.ReactNode;
  badge?: string;
  className?: string;
}

export function StatCard({
  title,
  value,
  subValue,
  change,
  changeType = "neutral",
  icon,
  badge,
  className
}: StatCardProps) {
  return (
    <div
      className={cn(
        "rounded border border-[var(--border-hairline)] bg-[var(--bg-surface)] p-5 transition-colors duration-150 flex flex-col justify-between",
        className
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs font-sans text-[var(--text-muted)]">{title}</p>
        {badge && (
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded border border-[var(--border-hairline)] text-[var(--text-faint)] bg-[var(--bg-elevated)]">
            {badge}
          </span>
        )}
      </div>

      <div className="mt-3">
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-numeral font-semibold tracking-tight text-[var(--text-main)]">
            {value}
          </span>
        </div>
        {subValue && (
          <p className="text-[11px] text-[var(--text-faint)] font-sans mt-0.5">
            {subValue}
          </p>
        )}
      </div>

      {change && (
        <div className="mt-3 pt-2.5 border-t border-[var(--border-hairline)] flex items-center text-[11px] font-sans">
          <span
            className={cn(
              "font-medium",
              changeType === "positive" && "text-sage-500",
              changeType === "negative" && "text-crimson-500",
              changeType === "neutral" && "text-[var(--text-muted)]"
            )}
          >
            {change}
          </span>
        </div>
      )}
    </div>
  );
}
