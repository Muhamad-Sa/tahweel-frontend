import { ArrowRight, Award, FileCheck2, Search, ShieldCheck, Wrench } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { ButtonLink } from "@/components/ui/ButtonLink";
import { SearchInput } from "@/components/ui/SearchInput";
import { SkeletonCard } from "@/components/ui/Skeleton";
import { CategoryCard } from "@/features/products/CategoryCard";
import { DocumentCard } from "@/features/documents/DocumentCard";
import { useCategories } from "@/hooks/useCategories";
import { useDocuments } from "@/hooks/useDocuments";

const QUICK_CHIPS = [
  { label: "Datasheets", type: "datasheet" },
  { label: "Catalogues", type: "catalogue" },
  { label: "Material Submittals", type: "material_submittal" },
  { label: "Certificates", type: "certificate" },
];

export default function HomePage() {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const { data: categories, isLoading: categoriesLoading } = useCategories();
  const { data: featuredDocs, isLoading: docsLoading } = useDocuments({ featured: true, page_size: 4 });

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/library${query ? `?search=${encodeURIComponent(query)}` : ""}`);
  };

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-charcoal-100 bg-gradient-to-b from-white to-surface-alt">
        <div className="container-page py-20 md:py-28">
          <div className="mx-auto max-w-3xl text-center">
            <p className="label-eyebrow">Saudi Made — German Technology</p>
            <h1 className="mt-4 font-display text-4xl font-extrabold tracking-tight text-charcoal-950 sm:text-5xl">
              Superior Sanitary Solutions
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-base text-charcoal-500">
              Engineering-grade PPR, UPVC, PVC and Silent pipe systems, plus sanitary fixtures and
              drainage solutions — built for Saudi Arabia's construction sector.
            </p>

            <form onSubmit={submitSearch} className="mx-auto mt-8 flex max-w-xl gap-2">
              <SearchInput
                value={query}
                onChange={setQuery}
                placeholder="Search datasheets, catalogues, products…"
                className="flex-1"
              />
              <button
                type="submit"
                className="flex h-11 items-center gap-2 rounded bg-brand-700 px-5 text-sm font-medium text-white hover:bg-brand-800"
              >
                <Search className="h-4 w-4" /> Search
              </button>
            </form>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
              {QUICK_CHIPS.map((chip) => (
                <button
                  key={chip.type}
                  onClick={() => navigate(`/library?document_type=${chip.type}`)}
                  className="rounded-full border border-brand-700 bg-brand-700 px-5 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:border-brand-800 hover:bg-brand-800"
                >
                  {chip.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Product systems grid */}
      <section className="container-page py-16">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <p className="label-eyebrow">Product Systems</p>
            <h2 className="mt-1 font-display text-2xl font-bold text-charcoal-950">Browse by category</h2>
          </div>
          <ButtonLink to="/products" variant="ghost" size="sm" icon={<ArrowRight className="h-4 w-4" />} iconPosition="right">
            View all products
          </ButtonLink>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categoriesLoading
            ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
            : categories?.results.map((cat) => <CategoryCard key={cat.id} category={cat} />)}
        </div>
      </section>

      {/* Engineering confidence */}
      <section className="border-y border-charcoal-100 bg-charcoal-950 py-16 text-white">
        <div className="container-page grid gap-10 md:grid-cols-3">
          <ConfidencePoint
            icon={ShieldCheck}
            title="Engineered to Standard"
            body="Products referenced against internationally recognized standards for material class and pressure rating."
          />
          <ConfidencePoint
            icon={Wrench}
            title="Saudi Manufacturing"
            body="Manufactured locally in Saudi Arabia, applying German-derived extrusion and molding technology."
          />
          <ConfidencePoint
            icon={Award}
            title="Full Technical Documentation"
            body="Datasheets, material submittals and catalogues available for every product line in our technical library."
          />
        </div>
      </section>

      {/* Featured documents */}
      <section className="container-page py-16">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <p className="label-eyebrow">Technical Library</p>
            <h2 className="mt-1 font-display text-2xl font-bold text-charcoal-950">Featured documents</h2>
          </div>
          <ButtonLink to="/library" variant="ghost" size="sm" icon={<ArrowRight className="h-4 w-4" />} iconPosition="right">
            Browse library
          </ButtonLink>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {docsLoading
            ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
            : featuredDocs?.results.map((doc) => <DocumentCard key={doc.id} document={doc} />)}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-brand-800">
        <div className="container-page flex flex-col items-center gap-5 py-16 text-center text-white">
          <FileCheck2 className="h-8 w-8 opacity-80" strokeWidth={1.5} />
          <h2 className="font-display text-2xl font-bold sm:text-3xl">Need a quotation or material submittal?</h2>
          <p className="max-w-lg text-brand-100">
            Our technical team can help you specify the right Tahweel system for your project.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <ButtonLink to="/contact" variant="secondary" size="lg">
              Contact Us
            </ButtonLink>
            <ButtonLink to="/material-submittals" variant="outline" size="lg" className="border-white/40 text-white hover:border-white">
              Browse Submittals
            </ButtonLink>
          </div>
        </div>
      </section>
    </div>
  );
}

function ConfidencePoint({
  icon: Icon,
  title,
  body,
}: {
  icon: typeof ShieldCheck;
  title: string;
  body: string;
}) {
  return (
    <div>
      <Icon className="mb-4 h-7 w-7 text-brand-400" strokeWidth={1.5} />
      <h3 className="font-display text-base font-semibold">{title}</h3>
      <p className="mt-2 text-sm text-charcoal-300">{body}</p>
    </div>
  );
}
