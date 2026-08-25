import { Search, X } from "lucide-react";
import React from "react";

import { cn } from "@/utils/cn";

interface SearchInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  value: string;
  onChange: (value: string) => void;
  onClear?: () => void;
}

export const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  ({ value, onChange, onClear, className, placeholder = "Search…", ...props }, ref) => {
    return (
      <div className={cn("relative", className)}>
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-charcoal-400" />
        <input
          ref={ref}
          type="search"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="h-11 w-full rounded border border-charcoal-300 bg-white pl-10 pr-9 text-sm text-charcoal-900 placeholder:text-charcoal-400 focus:border-brand-600 focus:outline-none focus:ring-1 focus:ring-brand-600"
          {...props}
        />
        {value && (
          <button
            type="button"
            onClick={() => (onClear ? onClear() : onChange(""))}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-charcoal-400 hover:text-charcoal-700"
            aria-label="Clear search"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    );
  }
);
SearchInput.displayName = "SearchInput";
