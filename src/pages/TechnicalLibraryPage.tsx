import { LayoutGrid, List, SlidersHorizontal } from "lucide-react";
import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";

import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Button } from "@/components/ui/Button";
import { Drawer } from "@/components/ui/Drawer";
import { EmptyState } from "@/components/ui/EmptyState";
import { SearchInput } from "@/components/ui/SearchInput";
import { Skeleton } from "@/components/ui/Skeleton";
import { DocumentCard } from "@/features/documents/DocumentCard";
import { DocumentFilters } from "@/features/documents/DocumentFilters";
import { DocumentRow } from "@/features/documents/DocumentRow";
import { useDebounce } from "@/hooks/useDebounce";
import { useDocuments } from "@/hooks/useDocuments";
import { cn } from "@/utils/cn";
import type { DocumentListParams } from "@/api/endpoints";

export default function TechnicalLibraryPage() {
  const [params, setParams] = useSearchParams();
  const [view, setView] = useState<"table" | "grid">("table");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [searchInput, setSearchInput] = useState(params.get("search") ?? "");
  const debouncedSearch = useDebounce(searchInput, 350);

  const filters: DocumentListParams = useMemo(
    () => ({
      category: params.get("category") ?? undefined,
      document_type: params.get("document_type") ?? undefined,
      language: params.get("language") ?? undefined,
      standard: params.get("standard") ?? undefined,
      year: params.get("year") ? Number(params.get("year")) : undefined,
      search: debouncedSearch || undefined,
      // Results are grouped into headings client-side, so fetch them all in
      // one page rather than paginating mid-group.
      page_size: 100,
    }),
    [params, debouncedSearch]
  );

  const { data, isLoading, isFetching } = useDocuments(filters);

  const groupedByHeading = useMemo(() => {
    if (!data?.results.length) return [];
    const groups = new Map<string, { name: string; order: number; docs: typeof data.results }>();
    for (const doc of data.results) {
      // Datasheets are grouped by curated section; everything else (catalogues,
      // submittals, certificates…) falls back to product family.
      const heading = doc.section ?? doc.category;
      const key = heading ? `${heading.slug}` : "__other__";
      const name = heading ? heading.name : "Other Documents";
      const order = heading ? heading.display_order : 999;
      if (!groups.has(key)) groups.set(key, { name, order, docs: [] });
      groups.get(key)!.docs.push(doc);
    }
    return Array.from(groups.values()).sort((a, b) => a.order - b.order || a.name.localeCompare(b.name));
  }, [data]);

  const applyFilters = (next: DocumentListParams) => {
    const sp = new URLSearchParams();
    Object.entries(next).forEach(([key, value]) => {
      if (value !== undefined && value !== "") sp.set(key, String(value));
    });
    setParams(sp);
  };

  return (
    <div className="container-page py-10">
      <Breadcrumb items={[{ label: "Home", to: "/" }, { label: "Technical Library" }]} />
      <h1 className="mt-3 font-display text-3xl font-bold text-charcoal-950">Technical Library</h1>
      <p className="mt-1 max-w-2xl text-sm text-charcoal-500">
        Search and filter datasheets, catalogues, material submittals, certificates and more across
        every Tahweel product line.
      </p>

      <div className="mt-8 flex flex-col gap-8 lg:flex-row">
        <aside className="hidden w-64 flex-shrink-0 lg:block">
          <DocumentFilters filters={filters} onChange={applyFilters} />
        </aside>

        <div className="flex-1">
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <SearchInput
              value={searchInput}
              onChange={setSearchInput}
              placeholder="Search documents by title or code…"
              className="sm:max-w-sm"
            />
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="lg:hidden" icon={<SlidersHorizontal className="h-3.5 w-3.5" />} onClick={() => setMobileFiltersOpen(true)}>
                Filters
              </Button>
              <div className="flex overflow-hidden rounded border border-charcoal-300">
                <button
                  onClick={() => setView("table")}
                  className={cn("flex h-8 w-9 items-center justify-center", view === "table" ? "bg-brand-700 text-white" : "text-charcoal-500")}
                  aria-label="Table view"
                >
                  <List className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setView("grid")}
                  className={cn("flex h-8 w-9 items-center justify-center", view === "grid" ? "bg-brand-700 text-white" : "text-charcoal-500")}
                  aria-label="Grid view"
                >
                  <LayoutGrid className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="flex flex-col gap-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : !data?.results.length ? (
            <EmptyState
              title="No documents found"
              description="Try adjusting your filters or search terms."
              action={
                <Button variant="outline" size="sm" onClick={() => applyFilters({})}>
                  Clear filters
                </Button>
              }
            />
          ) : (
            <>
              <p className={cn("mb-3 text-sm text-charcoal-500", isFetching && "opacity-50")}>
                {data.count} document{data.count === 1 ? "" : "s"}
              </p>
              <div className="flex flex-col gap-10">
                {groupedByHeading.map((group) => (
                  <section key={group.name}>
                    <h2 className="mb-3 font-display text-lg font-semibold text-charcoal-900">
                      {group.name}
                      <span className="ml-2 text-sm font-normal text-charcoal-400">
                        {group.docs.length}
                      </span>
                    </h2>
                    {view === "table" ? (
                      <div className="rounded border border-charcoal-200 bg-white px-5">
                        {group.docs.map((doc) => (
                          <DocumentRow key={doc.id} document={doc} />
                        ))}
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                        {group.docs.map((doc) => (
                          <DocumentCard key={doc.id} document={doc} />
                        ))}
                      </div>
                    )}
                  </section>
                ))}
              </div>
              {data.count > 100 && (
                <p className="mt-6 text-center text-xs text-charcoal-400">
                  Showing the first 100 of {data.count} documents — refine your search or filters to narrow results.
                </p>
              )}
            </>
          )}
        </div>
      </div>

      <Drawer open={mobileFiltersOpen} onClose={() => setMobileFiltersOpen(false)} title="Filters">
        <DocumentFilters filters={filters} onChange={(f) => { applyFilters(f); setMobileFiltersOpen(false); }} />
      </Drawer>
    </div>
  );
}
