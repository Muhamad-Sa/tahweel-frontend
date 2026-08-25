import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { EmptyState } from "@/components/ui/EmptyState";
import { SkeletonCard } from "@/components/ui/Skeleton";
import { CatalogueCard } from "@/features/documents/CatalogueCard";
import { useCatalogues } from "@/hooks/useDocuments";

export default function CataloguesPage() {
  const { data, isLoading } = useCatalogues({ page_size: 50 });

  return (
    <div className="container-page py-10">
      <Breadcrumb items={[{ label: "Home", to: "/" }, { label: "Catalogues" }]} />
      <h1 className="mt-3 font-display text-3xl font-bold text-charcoal-950">Catalogues</h1>
      <p className="mt-1 max-w-2xl text-sm text-charcoal-500">
        Full product catalogues covering every Tahweel system, in downloadable PDF format.
      </p>

      <div className="mt-8 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
          : data?.results.map((doc) => <CatalogueCard key={doc.id} document={doc} />)}
      </div>

      {!isLoading && !data?.results.length && (
        <EmptyState title="No catalogues published yet" description="Check back soon." />
      )}
    </div>
  );
}
