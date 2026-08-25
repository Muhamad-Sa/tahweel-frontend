import { LucideIcon, SearchX } from "lucide-react";
import React from "react";

export function EmptyState({
  icon: Icon = SearchX,
  title,
  description,
  action,
}: {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded border border-dashed border-charcoal-300 bg-white px-6 py-16 text-center">
      <Icon className="mb-4 h-10 w-10 text-charcoal-300" strokeWidth={1.5} />
      <h3 className="font-display text-base font-semibold text-charcoal-800">{title}</h3>
      {description && <p className="mt-1.5 max-w-sm text-sm text-charcoal-500">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
