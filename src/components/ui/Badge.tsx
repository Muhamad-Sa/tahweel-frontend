import React from "react";

import { cn } from "@/utils/cn";

type Variant = "neutral" | "brand" | "accent" | "success" | "warning" | "outline";

const variantClasses: Record<Variant, string> = {
  neutral: "bg-charcoal-100 text-charcoal-700",
  brand: "bg-brand-100 text-brand-800",
  accent: "bg-accent-100 text-accent-600",
  success: "bg-green-100 text-green-800",
  warning: "bg-amber-100 text-amber-800",
  outline: "border border-charcoal-300 text-charcoal-600",
};

export function Badge({
  variant = "neutral",
  className,
  children,
  ...rest
}: {
  variant?: Variant;
  className?: string;
  children: React.ReactNode;
} & React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded px-2 py-0.5 text-xs font-medium uppercase tracking-wide",
        variantClasses[variant],
        className
      )}
      {...rest}
    >
      {children}
    </span>
  );
}
