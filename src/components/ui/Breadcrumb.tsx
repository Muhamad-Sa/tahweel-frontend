import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

export interface Crumb {
  label: string;
  to?: string;
}

export function Breadcrumb({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-sm text-charcoal-500">
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-1.5">
          {i > 0 && <ChevronRight className="h-3.5 w-3.5 text-charcoal-300" />}
          {item.to ? (
            <Link to={item.to} className="hover:text-brand-700">
              {item.label}
            </Link>
          ) : (
            <span className="text-charcoal-800">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
