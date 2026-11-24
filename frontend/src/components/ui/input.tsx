import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-9 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-1 text-xs text-slate-100 placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <select
        className={cn(
          "flex h-9 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-1 text-xs text-slate-100 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      >
        {children}
      </select>
    );
  }
);
Select.displayName = "Select";

export function Spinner({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "inline-block h-5 w-5 animate-spin rounded-full border-2 border-solid border-blue-500 border-r-transparent align-[-0.125em]",
        className
      )}
    />
  );
}

export function Alert({
  title,
  children,
  variant = "info",
  className
}: {
  title?: string;
  children: React.ReactNode;
  variant?: "info" | "warning" | "error" | "success";
  className?: string;
}) {
  const styles = {
    info: "border-blue-500/30 bg-blue-950/20 text-blue-300",
    warning: "border-amber-500/30 bg-amber-950/20 text-amber-300",
    error: "border-rose-500/30 bg-rose-950/20 text-rose-300",
    success: "border-emerald-500/30 bg-emerald-950/20 text-emerald-300"
  };

  return (
    <div className={cn("rounded-lg border p-3.5 text-xs", styles[variant], className)}>
      {title && <h5 className="font-semibold mb-1 text-slate-100">{title}</h5>}
      <div className="leading-relaxed">{children}</div>
    </div>
  );
}
