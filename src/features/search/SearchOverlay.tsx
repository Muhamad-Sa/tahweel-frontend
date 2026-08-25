import { Command, FileText, Loader2, Package, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { Modal } from "@/components/ui/Modal";
import { useGlobalSearch } from "@/hooks/useGlobalSearch";

export function SearchOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [query, setQuery] = useState("");
  const { data, isFetching } = useGlobalSearch(query);

  useEffect(() => {
    if (!open) setQuery("");
  }, [open]);

  const hasResults = data && (data.products.length || data.documents.length || data.catalogues.length);

  return (
    <Modal open={open} onClose={onClose} size="lg">
      <div className="flex items-center gap-3 border-b border-charcoal-100 pb-3">
        <Search className="h-4 w-4 text-charcoal-400" />
        <input
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search products, datasheets, catalogues…"
          className="flex-1 border-none text-sm text-charcoal-900 outline-none placeholder:text-charcoal-400"
        />
        {isFetching && <Loader2 className="h-4 w-4 animate-spin text-charcoal-300" />}
        <kbd className="hidden rounded border border-charcoal-200 px-1.5 py-0.5 text-[10px] text-charcoal-400 sm:block">
          Esc
        </kbd>
      </div>

      <div className="max-h-[60vh] overflow-y-auto pt-3">
        {query.trim().length < 2 && (
          <p className="flex items-center gap-2 py-8 text-center text-sm text-charcoal-400">
            <Command className="mx-auto h-5 w-5" /> Type at least 2 characters to search.
          </p>
        )}

        {query.trim().length >= 2 && !isFetching && !hasResults && (
          <p className="py-8 text-center text-sm text-charcoal-400">No results for "{query}".</p>
        )}

        {data && data.products.length > 0 && (
          <ResultSection title="Products">
            {data.products.map((p) => (
              <Link key={p.id} to={`/products/${p.slug}`} onClick={onClose} className="result-row">
                <Package className="h-4 w-4 text-brand-600" />
                <span>{p.name}</span>
              </Link>
            ))}
          </ResultSection>
        )}

        {data && data.documents.length > 0 && (
          <ResultSection title="Documents">
            {data.documents.map((d) => (
              <Link key={d.id} to={`/library/${d.slug}`} onClick={onClose} className="result-row">
                <FileText className="h-4 w-4 text-brand-600" />
                <span>{d.title}</span>
              </Link>
            ))}
          </ResultSection>
        )}

        {data && data.catalogues.length > 0 && (
          <ResultSection title="Catalogues">
            {data.catalogues.map((d) => (
              <Link key={d.id} to={`/library/${d.slug}`} onClick={onClose} className="result-row">
                <FileText className="h-4 w-4 text-brand-600" />
                <span>{d.title}</span>
              </Link>
            ))}
          </ResultSection>
        )}
      </div>
    </Modal>
  );
}

function ResultSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-3">
      <p className="mb-1 px-1 text-xs font-semibold uppercase tracking-wide text-charcoal-400">{title}</p>
      <div className="flex flex-col">{children}</div>
    </div>
  );
}
