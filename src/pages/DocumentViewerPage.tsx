import { ArrowLeft, FileText } from "lucide-react";
import { Link, useParams, useSearchParams } from "react-router-dom";

import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Skeleton } from "@/components/ui/Skeleton";
import { useDocument } from "@/hooks/useDocuments";
import { embeddedDocumentUrl } from "@/utils/documentViewer";
import NotFoundPage from "./NotFoundPage";

export default function DocumentViewerPage() {
  const { slug } = useParams();
  const [searchParams] = useSearchParams();
  const { data: document, isLoading, isError } = useDocument(slug);

  if (isError) return <NotFoundPage />;

  if (isLoading || !document) {
    return (
      <div className="container-page py-10">
        <Skeleton className="mb-6 h-8 w-72" />
        <Skeleton className="h-[72vh] min-h-[520px] w-full" />
      </div>
    );
  }

  const revisionId = Number(searchParams.get("revision"));
  const revision = Number.isFinite(revisionId) && revisionId > 0
    ? document.revisions.find((item) => item.id === revisionId)
    : document.current_revision;

  if (!revision?.file_url) return <NotFoundPage />;

  return (
    <div className="container-page py-6 sm:py-10">
      <Breadcrumb
        items={[
          { label: "Home", to: "/" },
          { label: "Technical Library", to: "/library" },
          { label: document.title, to: `/library/${document.slug}` },
          { label: "View" },
        ]}
      />

      <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <p className="label-eyebrow mb-1">Document viewer</p>
          <h1 className="truncate font-display text-2xl font-bold text-charcoal-950">
            {document.title}
          </h1>
          <p className="mt-1 text-sm text-charcoal-500">
            Revision {revision.revision} · {revision.file_size_display}
          </p>
        </div>
        <ButtonLink
          to={`/library/${document.slug}`}
          variant="outline"
          icon={<ArrowLeft className="h-4 w-4" />}
          className="self-start sm:self-auto"
        >
          Document details
        </ButtonLink>
      </div>

      <section className="mt-5 overflow-hidden rounded-xl border border-charcoal-200 bg-charcoal-100 shadow-card">
        <div className="flex items-center gap-2 border-b border-charcoal-200 bg-white px-4 py-3 text-sm text-charcoal-600">
          <FileText className="h-4 w-4 text-brand-700" aria-hidden="true" />
          Viewing inside Tahweel
        </div>
        <iframe
          src={embeddedDocumentUrl(revision.file_url)}
          title={`${document.title} PDF viewer`}
          className="h-[75vh] min-h-[520px] w-full bg-white"
          allow="fullscreen"
        />
      </section>

      <p className="mt-3 text-center text-xs text-charcoal-400">
        Large documents can take a few moments to appear in the viewer.
      </p>
    </div>
  );
}
