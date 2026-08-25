import { BookOpen, Download } from "lucide-react";
import { Link } from "react-router-dom";

import { ButtonAnchor } from "@/components/ui/ButtonLink";
import type { DocumentListItem } from "@/types";

export function CatalogueCard({ document }: { document: DocumentListItem }) {
  const rev = document.current_revision;

  return (
    <div className="group flex flex-col overflow-hidden rounded border border-charcoal-200 bg-white transition-shadow hover:shadow-card">
      <Link
        to={`/library/${document.slug}`}
        className="flex aspect-[3/4] items-center justify-center bg-gradient-to-br from-brand-800 to-brand-950 text-white"
      >
        {document.cover_image ? (
          <img src={document.cover_image} alt={document.title} className="h-full w-full object-cover" />
        ) : (
          <div className="flex flex-col items-center gap-2 px-6 text-center">
            <BookOpen className="h-8 w-8 opacity-70" strokeWidth={1.25} />
            <span className="font-display text-sm font-semibold leading-tight">{document.title}</span>
          </div>
        )}
      </Link>
      <div className="flex flex-col gap-2 p-4">
        <Link to={`/library/${document.slug}`} className="font-display text-sm font-semibold text-charcoal-900 group-hover:text-brand-700">
          {document.title}
        </Link>
        {rev && <p className="text-xs text-charcoal-500">{rev.file_size_display} &middot; PDF</p>}
        {rev?.file_url && (
          <ButtonAnchor
            href={rev.file_url}
            download
            variant="primary"
            size="sm"
            icon={<Download className="h-3.5 w-3.5" />}
            className="mt-1 self-start"
          >
            Download
          </ButtonAnchor>
        )}
      </div>
    </div>
  );
}
