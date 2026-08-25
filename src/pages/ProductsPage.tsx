import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";

import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { EmptyState } from "@/components/ui/EmptyState";
import { Pagination } from "@/components/ui/Pagination";
import { SearchInput } from "@/components/ui/SearchInput";
import { SkeletonCard } from "@/components/ui/Skeleton";
import { ProductCard } from "@/features/products/ProductCard";
import { useCategories } from "@/hooks/useCategories";
import { useProducts } from "@/hooks/useProducts";
import { cn } from "@/utils/cn";

export default function ProductsPage() {
  const [params, setParams] = useSearchParams();
  const { data: categories } = useCategories();

  const category = params.get("category") ?? undefined;
  const search = params.get("search") ?? "";
  const page = Number(params.get("page") ?? 1);

  const { data, isLoading, isFetching } = useProducts({ category, search: search || undefined, page });

  const pageCount = useMemo(() => (data ? Math.ceil(data.count / 20) : 1), [data]);

  const updateParams = (patch: Record<string, string | undefined>) => {
    const next = new URLSearchParams(params);
    Object.entries(patch).forEach(([key, value]) => {
      if (value) next.set(key, value);
      else next.delete(key);
    });
    if (!("page" in patch)) next.delete("page");
    setParams(next);
  };

  return (
    <div className="container-page py-10">
      <Breadcrumb items={[{ label: "Home", to: "/" }, { label: "Products" }]} />
      <h1 className="mt-3 font-display text-3xl font-bold text-charcoal-950">Products</h1>
      <p className="mt-1 max-w-2xl text-sm text-charcoal-500">
        Browse Tahweel's PPR, UPVC, PVC, silent pipe, drainage and sanitary fixture systems.
      </p>

      <div className="mt-8 flex flex-col gap-8 lg:flex-row">
        <aside className="w-full flex-shrink-0 lg:w-60">
          <SearchInput
            value={search}
            onChange={(v) => updateParams({ search: v || undefined })}
            placeholder="Search products…"
            className="mb-6"
          />
          <h3 className="mb-3 font-display text-sm font-semibold text-charcoal-900">Category</h3>
          <div className="flex flex-col gap-1">
            <button
              onClick={() => updateParams({ category: undefined })}
              className={cn(
                "rounded px-3 py-2 text-left text-sm text-charcoal-600 hover:bg-brand-50 hover:text-brand-800",
                !category && "bg-brand-50 font-medium text-brand-800"
              )}
            >
              All categories
            </button>
            {categories?.results.map((cat) => (
              <button
                key={cat.id}
                onClick={() => updateParams({ category: cat.slug })}
                className={cn(
                  "flex items-center justify-between rounded px-3 py-2 text-left text-sm text-charcoal-600 hover:bg-brand-50 hover:text-brand-800",
                  category === cat.slug && "bg-brand-50 font-medium text-brand-800"
                )}
              >
                <span>{cat.name}</span>
                <span className="text-xs text-charcoal-400">{cat.product_count}</span>
              </button>
            ))}
          </div>
        </aside>

        <div className="flex-1">
          {isLoading ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : !data?.results.length ? (
            <EmptyState
              title="No products found"
              description="Try a different search term or clear your filters."
            />
          ) : (
            <>
              <p className={cn("mb-4 text-sm text-charcoal-500", isFetching && "opacity-50")}>
                {data.count} product{data.count === 1 ? "" : "s"}
              </p>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {data.results.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
              <div className="mt-8">
                <Pagination page={page} pageCount={pageCount} onPageChange={(p) => updateParams({ page: String(p) })} />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
