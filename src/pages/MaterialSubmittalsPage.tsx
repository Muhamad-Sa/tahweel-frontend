import { FilePlus2 } from "lucide-react";

import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { EmptyState } from "@/components/ui/EmptyState";
import { Skeleton } from "@/components/ui/Skeleton";
import { DocumentRow } from "@/features/documents/DocumentRow";
import { useDocuments } from "@/hooks/useDocuments";

export default function MaterialSubmittalsPage() {
  const { data, isLoading } = useDocuments({ document_type: "material_submittal", page_size: 50 });

  const grouped = (data?.results ?? []).reduce<Record<string, NonNullable<typeof data>["results"]>>((acc, doc) => {
    const key = doc.category?.name ?? "General";
    acc[key] = acc[key] ?? [];
    acc[key].push(doc);
    return acc;
  }, {});

  return (
    <div className="container-page py-10">
      <Breadcrumb items={[{ label: "Home", to: "/" }, { label: "Material Submittals" }]} />
      <div className="mt-3 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h1 className="font-display text-3xl font-bold text-charcoal-950">Material Submittals</h1>
          <p className="mt-1 max-w-2xl text-sm text-charcoal-500">
            Browse existing material submittal packages by product system, ready for project approval workflows.
          </p>
        </div>
        <ButtonLink to="/material-submittals/generate" variant="outline" icon={<FilePlus2 className="h-4 w-4" />}>
          Generate Material Submittal
        </ButtonLink>
      </div>

      <div className="mt-8">
        {isLoading ? (
          <div className="flex flex-col gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        ) : !data?.results.length ? (
          <EmptyState title="No material submittals published yet" />
        ) : (
          Object.entries(grouped).map(([category, docs]) => (
            <div key={category} className="mb-8">
              <h2 className="mb-3 font-display text-sm font-semibold uppercase tracking-wide text-charcoal-500">
                {category}
              </h2>
              <div className="rounded border border-charcoal-200 bg-white px-5">
                {docs.map((doc) => (
                  <DocumentRow key={doc.id} document={doc} />
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
