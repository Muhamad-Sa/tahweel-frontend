import { ArrowUpRight, Box } from "lucide-react";
import { Link } from "react-router-dom";

import { Badge } from "@/components/ui/Badge";
import type { ProductListItem } from "@/types";

export function ProductCard({ product }: { product: ProductListItem }) {
  return (
    <Link
      to={`/products/${product.slug}`}
      className="group flex flex-col overflow-hidden rounded border border-charcoal-200 bg-white transition-shadow hover:shadow-card"
    >
      <div className="flex aspect-[4/3] items-center justify-center overflow-hidden bg-surface-alt">
        {product.featured_image ? (
          <img
            src={product.featured_image}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          />
        ) : (
          <Box className="h-10 w-10 text-charcoal-300" strokeWidth={1.25} />
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-center justify-between gap-2">
          <Badge variant="outline">{product.category.name}</Badge>
          {product.featured && <Badge variant="accent">Featured</Badge>}
        </div>
        <h3 className="font-display text-sm font-semibold text-charcoal-900 group-hover:text-brand-700">
          {product.name}
        </h3>
        <p className="line-clamp-2 text-xs text-charcoal-500">{product.short_description}</p>
        <span className="mt-auto flex items-center gap-1 pt-1 text-xs font-semibold text-brand-700">
          View product <ArrowUpRight className="h-3.5 w-3.5" />
        </span>
      </div>
    </Link>
  );
}
