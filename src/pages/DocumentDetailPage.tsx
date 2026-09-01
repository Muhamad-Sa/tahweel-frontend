import { Download, Eye, FileText } from "lucide-react";
import { Link, useParams } from "react-router-dom";

import { Badge } from "@/components/ui/Badge";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { ButtonAnchor, ButtonLink } from "@/components/ui/ButtonLink";
import { SkeletonText } from "@/components/ui/Skeleton";
import { useDocument } from "@/hooks/useDocuments";
import { documentTypeLabel, formatDate, languageLabel } from "@/utils/format";
import { documentViewerPath } from "@/utils/documentViewer";
import NotFoundPage from "./NotFoundPage";

export default function DocumentDetailPage() {
  const { slug } = useParams();
  const { data: doc, isLoading, isError } = useDocument(slug);

  if (isError) return <NotFoundPage />;

  if (isLoading || !doc) {
    return (
      <div className="container-page py-10">
        <SkeletonText lines={6} />
      </div>
    );
  }

  const rev = doc.current_revision;

  return (
    <div className="container-page py-10">
      <Breadcrumb
        items={[
          { label: "Home", to: "/" },
          { label: "Technical Library", to: "/library" },
          { label: doc.title },
        ]}
      />

      <div className="mt-6 grid gap-10 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <Badge variant="brand">{documentTypeLabel(doc.document_type)}</Badge>
            {doc.category && <Badge variant="outline">{doc.category.name}</Badge>}
            <Badge variant="outline">{languageLabel(doc.language)}</Badge>
          </div>
          <h1 className="font-display text-3xl font-bold text-charcoal-950">{doc.title}</h1>
          {doc.product && (
            <p className="mt-2 text-sm text-charcoal-500">
              Related product:{" "}
              <Link to={`/products/${doc.product.slug}`} className="font-medium text-brand-700 hover:underline">
                {doc.product.name}
              </Link>
            </p>
          )}
          <p className="mt-4 text-sm leading-relaxed text-charcoal-600">{doc.description}</p>

          {doc.standards.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-2">
              {doc.standards.map((s) => (
                <Badge key={s.id} variant="brand" title={s.description}>
                  {s.code}
                </Badge>
              ))}
            </div>
          )}

          {doc.revisions.length > 1 && (
            <section className="mt-10">
              <h2 className="font-display text-lg font-semibold text-charcoal-900">Revision history</h2>
              <div className="mt-3 overflow-hidden rounded border border-charcoal-200">
                <table className="w-full text-sm">
                  <thead className="bg-surface-alt text-xs uppercase tracking-wide text-charcoal-500">
                    <tr>
                      <th className="px-4 py-2 text-left">Revision</th>
                      <th className="px-4 py-2 text-left">Date</th>
                      <th className="px-4 py-2 text-left">Size</th>
                      <th className="px-4 py-2 text-left">Status</th>
                      <th className="px-4 py-2 text-right">File</th>
                    </tr>
                  </thead>
                  <tbody>
                    {doc.revisions.map((r) => (
                      <tr key={r.id} className="border-t border-charcoal-100">
                        <td className="px-4 py-2.5 font-medium text-charcoal-800">{r.revision}</td>
                        <td className="px-4 py-2.5 text-charcoal-500">{formatDate(r.issue_date)}</td>
                        <td className="px-4 py-2.5 text-charcoal-500">{r.file_size_display}</td>
                        <td className="px-4 py-2.5">
                          <Badge variant={r.status === "current" ? "brand" : "neutral"}>{r.status}</Badge>
                        </td>
                        <td className="px-4 py-2.5 text-right">
                          {r.file_url && (
                            <Link
                              to={documentViewerPath(doc.slug, r.id)}
                              className="text-brand-700 hover:underline"
                            >
                              View
                            </Link>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}
        </div>

        <div className="rounded border border-charcoal-200 bg-white p-5">
          <div className="mb-4 flex aspect-[3/4] w-full items-center justify-center overflow-hidden rounded border border-charcoal-100 bg-charcoal-50">
            {doc.cover_image ? (
              <img src={doc.cover_image} alt="" className="h-full w-full object-cover" />
            ) : (
              <FileText className="h-10 w-10 text-brand-700" />
            )}
          </div>
          {rev ? (
            <>
              <dl className="flex flex-col gap-2 text-sm">
                <Row label="Revision" value={rev.revision} />
                <Row label="Issue date" value={formatDate(rev.issue_date)} />
                <Row label="File size" value={rev.file_size_display} />
                <Row label="Format" value={rev.mime_type || "PDF"} />
              </dl>
              <div className="mt-5 flex flex-col gap-2">
                <ButtonLink
                  to={documentViewerPath(doc.slug)}
                  variant="outline"
                  icon={<Eye className="h-4 w-4" />}
                >
                  View PDF
                </ButtonLink>
                <ButtonAnchor href={rev.file_url ?? "#"} download variant="primary" icon={<Download className="h-4 w-4" />}>
                  Download ({rev.file_size_display})
                </ButtonAnchor>
              </div>
            </>
          ) : (
            <p className="text-sm text-charcoal-400">No file available for this document yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-charcoal-100 pb-2">
      <dt className="text-charcoal-400">{label}</dt>
      <dd className="font-medium text-charcoal-800">{value}</dd>
    </div>
  );
}
