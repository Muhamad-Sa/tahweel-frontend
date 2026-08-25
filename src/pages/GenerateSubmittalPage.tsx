import { Construction } from "lucide-react";

import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { ButtonLink } from "@/components/ui/ButtonLink";

export default function GenerateSubmittalPage() {
  return (
    <div className="container-page py-10">
      <Breadcrumb
        items={[
          { label: "Home", to: "/" },
          { label: "Material Submittals", to: "/material-submittals" },
          { label: "Generate" },
        ]}
      />

      <div className="mx-auto mt-10 flex max-w-lg flex-col items-center rounded border border-dashed border-charcoal-300 bg-white px-8 py-16 text-center">
        <Construction className="mb-4 h-10 w-10 text-accent-500" strokeWidth={1.5} />
        <h1 className="font-display text-xl font-semibold text-charcoal-900">Coming soon</h1>
        <p className="mt-2 text-sm text-charcoal-500">
          Automatic material-submittal generation (selecting products and assembling a
          project-ready PDF package) is a planned feature and is not implemented yet. For now,
          browse our pre-built submittal packages or contact our technical team for a custom
          submittal.
        </p>
        <div className="mt-6 flex gap-3">
          <ButtonLink to="/material-submittals" variant="outline">
            Browse existing submittals
          </ButtonLink>
          <ButtonLink to="/contact">Contact technical team</ButtonLink>
        </div>
      </div>
    </div>
  );
}
