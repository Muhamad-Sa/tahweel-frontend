import { Download, FileText } from "lucide-react";
import { Link } from "react-router-dom";

import { Badge } from "@/components/ui/Badge";
import { ButtonAnchor } from "@/components/ui/ButtonLink";
import type { DocumentListItem } from "@/types";
import { documentTypeLabel, formatDate } from "@/utils/format";

export function DocumentCard({ document }: { document: DocumentListItem }) {
  const rev = document.current_revision;
  const image = document.product?.featured_image || document.cover_image;

  return (
    <div className="flex gap-4 rounded border border-charcoal-200 bg-white p-4 transition-shadow hover:shadow-card">
      <Link
        to={`/library/${document.slug}`}
        className="flex h-20 w-16 flex-none items-center justify-center overflow-hidden rounded border border-charcoal-100 bg-charcoal-50"
      >
        {image ? (
          <img
            src={image}
            alt={document.product?.name || document.title}
            className="h-full w-full object-contain p-1"
            loading="lazy"
          />
        ) : (
          <FileText className="h-6 w-6 text-brand-700" />
        )}
      </Link>
      <div className="flex flex-1 flex-col">
      <div className="mb-3 flex items-start justify-between gap-2">
        <Badge variant="outline">{documentTypeLabel(document.document_type)}</Badge>
      </div>
      <Link to={`/library/${document.slug}`} className="font-display text-sm font-semibold text-charcoal-900 hover:text-brand-700">
        {document.title}
      </Link>
      <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs text-charcoal-500">
        {document.category && <span>{document.category.name}</span>}
        {rev && (
          <>
            <span>{formatDate(rev.issue_date)}</span>
            <span className="font-medium text-charcoal-700">{rev.file_size_display}</span>
          </>
        )}
      </div>
      {rev?.file_url && (
        <ButtonAnchor
          href={rev.file_url}
          download
          variant="outline"
          size="sm"
          icon={<Download className="h-3.5 w-3.5" />}
          className="mt-4 self-start"
        >
          Download
        </ButtonAnchor>
      )}
      </div>
    </div>
  );
}
