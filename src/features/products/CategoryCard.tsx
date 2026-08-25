import { ArrowUpRight, Droplets, Layers, LucideIcon, Package, VolumeX, Waves } from "lucide-react";
import { Link } from "react-router-dom";

import type { Category } from "@/types";

const ICON_MAP: Record<string, LucideIcon> = {
  pipe: Layers,
  waves: Waves,
  droplets: Droplets,
  "volume-x": VolumeX,
  package: Package,
};

function resolveIcon(name: string): LucideIcon {
  return ICON_MAP[name] ?? Package;
}

export function CategoryCard({ category }: { category: Category }) {
  const Icon = resolveIcon(category.icon || "package");

  return (
    <Link
      to={`/products?category=${category.slug}`}
      className="group flex flex-col justify-between rounded border border-charcoal-200 bg-white p-5 transition-shadow hover:shadow-card"
    >
      <div className="mb-6 flex h-11 w-11 items-center justify-center rounded bg-brand-50 text-brand-700">
        <Icon className="h-5 w-5" strokeWidth={1.75} />
      </div>
      <div>
        <h3 className="font-display text-base font-semibold text-charcoal-900 group-hover:text-brand-700">
          {category.name}
        </h3>
        <p className="mt-1 line-clamp-2 text-sm text-charcoal-500">{category.description}</p>
        <div className="mt-4 flex items-center justify-between text-xs">
          <span className="text-charcoal-400">{category.product_count} products</span>
          <ArrowUpRight className="h-4 w-4 text-brand-600 opacity-0 transition-opacity group-hover:opacity-100" />
        </div>
      </div>
    </Link>
  );
}
