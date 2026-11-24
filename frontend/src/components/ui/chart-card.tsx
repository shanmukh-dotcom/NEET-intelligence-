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
  badge = "SYNTHETIC DEMO",
  actions,
  children,
  className,
  heightClass = "h-72"
}: ChartCardProps) {
  return (
    <Card className={cn("border border-slate-800 bg-slate-900/90 shadow-sm", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <CardTitle className="text-sm font-semibold text-slate-100">{title}</CardTitle>
            {badge && <Badge variant="synthetic">{badge}</Badge>}
          </div>
          {description && <CardDescription className="text-xs text-slate-400">{description}</CardDescription>}
        </div>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </CardHeader>
      <CardContent className="pt-4">
        <div className={cn("w-full", heightClass)}>
          {children}
        </div>
      </CardContent>
    </Card>
  );
}
