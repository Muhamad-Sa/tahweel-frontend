import { Box, ShieldCheck } from "lucide-react";
import React from "react";
import { useParams } from "react-router-dom";

import { Badge } from "@/components/ui/Badge";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { EmptyState } from "@/components/ui/EmptyState";
import { SkeletonText } from "@/components/ui/Skeleton";
import { DocumentRow } from "@/features/documents/DocumentRow";
import { useProduct, useProductDocuments } from "@/hooks/useProducts";
import NotFoundPage from "./NotFoundPage";

export default function ProductDetailPage() {
  const { slug } = useParams();
  const { data: product, isLoading, isError } = useProduct(slug);
  const { data: documents, isLoading: docsLoading } = useProductDocuments(slug);

  if (isError) return <NotFoundPage />;

  if (isLoading || !product) {
    return (
      <div className="container-page py-10">
        <SkeletonText lines={1} className="mb-6 w-64" />
        <div className="grid gap-10 md:grid-cols-2">
          <div className="aspect-square animate-pulse rounded bg-charcoal-100" />
          <SkeletonText lines={6} />
        </div>
      </div>
    );
  }

  const groupedSpecs = product.specifications.reduce<Record<string, typeof product.specifications>>((acc, spec) => {
    const key = spec.group || "General";
    acc[key] = acc[key] ?? [];
    acc[key].push(spec);
    return acc;
  }, {});

  return (
    <div className="container-page py-10">
      <Breadcrumb
        items={[
          { label: "Home", to: "/" },
          { label: "Products", to: "/products" },
          { label: product.category.name, to: `/products?category=${product.category.slug}` },
          { label: product.name },
        ]}
      />

      <div className="mt-6 grid gap-10 lg:grid-cols-2">
        <div className="flex aspect-square items-center justify-center overflow-hidden rounded border border-charcoal-200 bg-surface-alt">
          {product.featured_image ? (
            <img src={product.featured_image} alt={product.name} className="h-full w-full object-cover" />
          ) : (
            <Box className="h-16 w-16 text-charcoal-300" strokeWidth={1} />
          )}
        </div>

        <div>
          <Badge variant="outline">{product.category.name}</Badge>
          <h1 className="mt-3 font-display text-3xl font-bold text-charcoal-950">{product.name}</h1>
          {product.product_code && <p className="mt-1 text-sm text-charcoal-400">Code: {product.product_code}</p>}
          <p className="mt-4 text-sm leading-relaxed text-charcoal-600">{product.long_description}</p>

          <dl className="mt-6 grid grid-cols-2 gap-4 border-t border-charcoal-100 pt-6 text-sm">
            {product.material && (
              <div>
                <dt className="text-charcoal-400">Material</dt>
                <dd className="font-medium text-charcoal-800">{product.material}</dd>
              </div>
            )}
            {product.application && (
              <div>
                <dt className="text-charcoal-400">Application</dt>
                <dd className="font-medium text-charcoal-800">{product.application}</dd>
              </div>
            )}
            {product.country_of_origin && (
              <div>
                <dt className="text-charcoal-400">Origin</dt>
                <dd className="font-medium text-charcoal-800">{product.country_of_origin}</dd>
              </div>
            )}
            {product.warranty_info && (
              <div>
                <dt className="text-charcoal-400">Warranty</dt>
                <dd className="font-medium text-charcoal-800">{product.warranty_info}</dd>
              </div>
            )}
          </dl>

          {product.standards.length > 0 && (
            <div className="mt-6 flex flex-wrap items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-brand-600" />
              {product.standards.map((s) => (
                <Badge key={s.id} variant="brand" title={s.description}>
                  {s.code}
                </Badge>
              ))}
            </div>
          )}

          <div className="mt-8 flex gap-3">
            <ButtonLink to="/contact" size="lg">
              Request a Quotation
            </ButtonLink>
          </div>
        </div>
      </div>

      {product.specifications.length > 0 && (
        <section className="mt-16">
          <h2 className="font-display text-xl font-bold text-charcoal-950">Specifications</h2>
          <div className="mt-4 overflow-hidden rounded border border-charcoal-200">
            <table className="w-full text-sm">
              <tbody>
                {Object.entries(groupedSpecs).map(([group, specs]) => (
                  <React.Fragment key={group}>
                    <tr className="bg-surface-alt">
                      <td colSpan={2} className="px-4 py-2 text-xs font-semibold uppercase tracking-wide text-charcoal-500">
                        {group}
                      </td>
                    </tr>
                    {specs.map((spec) => (
                      <tr key={spec.id} className="border-t border-charcoal-100">
                        <td className="px-4 py-2.5 text-charcoal-500">{spec.name}</td>
                        <td className="px-4 py-2.5 font-medium text-charcoal-800">
                          {spec.value} {spec.unit}
                        </td>
                      </tr>
                    ))}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      <section className="mt-16">
        <h2 className="font-display text-xl font-bold text-charcoal-950">Technical Documents</h2>
        <div className="mt-4 rounded border border-charcoal-200 bg-white px-5">
          {docsLoading ? (
            <div className="py-6">
              <SkeletonText lines={3} />
            </div>
          ) : !documents?.length ? (
            <div className="py-6">
              <EmptyState title="No documents yet" description="Technical documents for this product will appear here once published." />
            </div>
          ) : (
            documents.map((doc) => <DocumentRow key={doc.id} document={doc} />)
          )}
        </div>
      </section>
    </div>
  );
}
