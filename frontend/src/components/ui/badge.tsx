import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

export const badgeVariants = cva(
  "inline-flex items-center rounded px-2 py-0.5 text-[11px] font-sans font-medium transition-colors border",
  {
    variants: {
      variant: {
        default: "border-saffron-500/30 bg-saffron-500/10 text-saffron-400",
        secondary: "border-[var(--border-hairline)] bg-[var(--bg-elevated)] text-[var(--text-muted)]",
        destructive: "border-crimson-500/30 bg-crimson-500/10 text-crimson-400",
        outline: "border-[var(--border-hairline)] text-[var(--text-muted)] bg-transparent",
        success: "border-sage-500/30 bg-sage-500/10 text-sage-400",
        warning: "border-ochre-500/30 bg-ochre-500/10 text-ochre-400",
        teal: "border-prussian-500/30 bg-prussian-500/10 text-prussian-300",
        synthetic: "border-saffron-500/25 bg-saffron-500/10 text-saffron-400/90 font-mono text-[10px]"
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}
