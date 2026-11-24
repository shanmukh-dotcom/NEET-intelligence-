import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

export const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-saffron-500 disabled:pointer-events-none disabled:opacity-50 select-none",
  {
    variants: {
      variant: {
        default: "bg-saffron-500 text-white shadow-subtle hover:bg-saffron-600 active:bg-saffron-700 border border-saffron-600/40",
        destructive: "bg-crimson-600 text-white shadow-subtle hover:bg-crimson-500",
        outline: "border border-[var(--border-hairline)] bg-transparent text-[var(--text-main)] hover:bg-[var(--bg-elevated)]",
        secondary: "bg-[var(--bg-elevated)] text-[var(--text-main)] hover:bg-[var(--border-muted)] border border-[var(--border-hairline)]",
        ghost: "hover:bg-[var(--bg-elevated)] text-[var(--text-muted)] hover:text-[var(--text-main)]",
        link: "text-saffron-500 underline-offset-4 hover:underline",
        teal: "bg-prussian-600 text-white hover:bg-prussian-500 shadow-subtle"
      },
      size: {
        default: "h-8 px-3.5 py-1.5",
        sm: "h-7 rounded px-2.5 text-[11px]",
        lg: "h-9 rounded px-5 text-sm",
        icon: "h-8 w-8",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";
