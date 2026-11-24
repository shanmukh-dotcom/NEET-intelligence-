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
    <Card className={cn("overflow-hidden border border-slate-800 bg-slate-900/80 hover:border-slate-700/80 transition-all", className)}>
      <CardContent className="p-5">
        <div className="flex items-center justify-between">
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">{title}</p>
          <div className="flex items-center gap-2">
            {badge && <Badge variant="synthetic">{badge}</Badge>}
            {icon && <div className="text-slate-400 p-2 rounded-lg bg-slate-800/80">{icon}</div>}
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl font-bold tracking-tight text-white">{value}</span>
          {subValue && <span className="text-xs text-slate-400">{subValue}</span>}
        </div>
        {change && (
          <div className="mt-2.5 flex items-center text-xs">
            <span
              className={cn(
                "font-medium",
                changeType === "positive" && "text-emerald-400",
                changeType === "negative" && "text-rose-400",
                changeType === "neutral" && "text-slate-400"
              )}
            >
              {change}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
