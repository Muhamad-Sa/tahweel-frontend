import React from "react";

import { cn } from "@/utils/cn";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, className, id, ...props }, ref) => {
    const inputId = id ?? props.name;
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-charcoal-800">
            {label}
            {props.required && <span className="text-accent-600"> *</span>}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            "h-10 rounded border border-charcoal-300 bg-white px-3 text-sm text-charcoal-900 placeholder:text-charcoal-400",
            "focus:border-brand-600 focus:outline-none focus:ring-1 focus:ring-brand-600",
            error && "border-red-500 focus:border-red-500 focus:ring-red-500",
            className
          )}
          aria-invalid={Boolean(error)}
          {...props}
        />
        {error ? (
          <p className="text-xs text-red-600">{error}</p>
        ) : hint ? (
          <p className="text-xs text-charcoal-400">{hint}</p>
        ) : null}
      </div>
    );
  }
);
Input.displayName = "Input";
