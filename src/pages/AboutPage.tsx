import { Award, Factory, Globe2, ShieldCheck } from "lucide-react";

import { Breadcrumb } from "@/components/ui/Breadcrumb";

export default function AboutPage() {
  return (
    <div>
      <div className="border-b border-charcoal-100 bg-surface-alt">
        <div className="container-page py-14">
          <Breadcrumb items={[{ label: "Home", to: "/" }, { label: "About" }]} />
          <h1 className="mt-3 font-display text-4xl font-bold text-charcoal-950">About Tahweel</h1>
          <p className="mt-3 max-w-2xl text-base text-charcoal-600">
            Tahweel Integrated Company manufactures sanitary piping and drainage systems in Saudi
            Arabia, applying German-derived manufacturing technology to serve the Kingdom's
            construction sector.
          </p>
        </div>
      </div>

      <div className="container-page grid gap-12 py-14 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <h2 className="font-display text-xl font-bold text-charcoal-950">Our Story</h2>
          <p className="mt-3 text-sm leading-relaxed text-charcoal-600">
            Placeholder copy: detailed company history was not supplied for this build pass. Tahweel
            positions itself around the tagline "Superior Sanitary Solutions" and "Saudi Made — German
            Technology" — manufacturing PPR, UPVC, PVC and acoustic Silent pipe systems, alongside
            sanitary fixtures and drainage accessories, for residential, commercial and hospitality
            projects across Saudi Arabia. This section should be replaced with verified company copy
            before production launch.
          </p>

          <h2 className="mt-10 font-display text-xl font-bold text-charcoal-950">Manufacturing Standards</h2>
          <p className="mt-3 text-sm leading-relaxed text-charcoal-600">
            Products are referenced against internationally recognized standards appropriate to
            their material class (see individual product pages and datasheets in our{" "}
            <a href="/library" className="text-brand-700 hover:underline">
              Technical Library
            </a>
            ). Standards shown are cited for the material class as industry reference points and
            are not, on their own, an assertion of third-party certification unless a corresponding
            certificate document is published for that product.
          </p>
        </div>

        <div className="flex flex-col gap-6">
          <AboutStat icon={Factory} label="Manufactured in" value="Saudi Arabia" />
          <AboutStat icon={Globe2} label="Technology" value="German-derived processes" />
          <AboutStat icon={ShieldCheck} label="Product lines" value="6 system families" />
          <AboutStat icon={Award} label="Focus" value="Sanitary & drainage systems" />
        </div>
      </div>
    </div>
  );
}

function AboutStat({ icon: Icon, label, value }: { icon: typeof Factory; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3 rounded border border-charcoal-200 bg-white p-4">
      <Icon className="mt-0.5 h-5 w-5 flex-shrink-0 text-brand-600" strokeWidth={1.5} />
      <div>
        <p className="text-xs uppercase tracking-wide text-charcoal-400">{label}</p>
        <p className="mt-0.5 text-sm font-semibold text-charcoal-900">{value}</p>
      </div>
    </div>
  );
}
