import { Download, Eye, FileText } from "lucide-react";

import { Badge } from "@/components/ui/Badge";
import { ButtonAnchor } from "@/components/ui/ButtonLink";
import type { DocumentListItem } from "@/types";
import { documentTypeLabel, formatDate, languageLabel } from "@/utils/format";

export function DocumentRow({ document }: { document: DocumentListItem }) {
  const rev = document.current_revision;

  return (
    <div className="flex flex-col gap-3 border-b border-charcoal-100 py-4 last:border-b-0 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 items-start gap-3">
        <div className="flex h-12 w-9 flex-shrink-0 items-center justify-center overflow-hidden rounded border border-charcoal-100 bg-charcoal-50">
          {document.cover_image ? (
            <img src={document.cover_image} alt="" className="h-full w-full object-cover" loading="lazy" />
          ) : (
            <FileText className="h-4 w-4 text-brand-700" />
          )}
        </div>
        <div className="min-w-0">
          <p className="truncate font-display text-sm font-semibold text-charcoal-900">{document.title}</p>
          <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-charcoal-500">
            <Badge variant="outline">{documentTypeLabel(document.document_type)}</Badge>
            {document.category && <span>{document.category.name}</span>}
            <span>{languageLabel(document.language)}</span>
            {rev && (
              <>
                <span>{rev.revision}</span>
                <span>{formatDate(rev.issue_date)}</span>
                <span className="font-medium text-charcoal-700">{rev.file_size_display}</span>
              </>
            )}
          </div>
        </div>
      </div>
      <div className="flex flex-shrink-0 items-center gap-2 sm:ml-4">
        {rev?.file_url ? (
          <>
            <ButtonAnchor
              href={rev.file_url}
              target="_blank"
              rel="noreferrer"
              variant="outline"
              size="sm"
              icon={<Eye className="h-3.5 w-3.5" />}
            >
              View
            </ButtonAnchor>
            <ButtonAnchor
              href={rev.file_url}
              download
              variant="primary"
              size="sm"
              icon={<Download className="h-3.5 w-3.5" />}
            >
              Download
            </ButtonAnchor>
          </>
        ) : (
          <span className="text-xs text-charcoal-400">No file available</span>
        )}
      </div>
    </div>
  );
}
