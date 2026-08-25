import { Link } from "react-router-dom";

import { Wordmark } from "@/components/ui/Wordmark";

export function Footer() {
  return (
    <footer className="border-t border-charcoal-800 bg-charcoal-950 text-charcoal-300">
      <div className="container-page grid gap-10 py-14 md:grid-cols-4">
        <div>
          <Wordmark className="h-7 text-white" monochrome />
          <p className="mt-3 max-w-xs text-sm text-charcoal-400">
            Superior Sanitary Solutions. Saudi Made — German Technology.
          </p>
        </div>

        <FooterColumn
          title="Products"
          links={[
            { to: "/products?category=ppr-systems", label: "PPR Systems" },
            { to: "/products?category=upvc-systems", label: "UPVC Systems" },
            { to: "/products?category=drainage-systems", label: "Drainage Systems" },
            { to: "/products?category=silent-pipe-systems", label: "Silent Pipe Systems" },
          ]}
        />

        <FooterColumn
          title="Resources"
          links={[
            { to: "/library", label: "Technical Library" },
            { to: "/catalogues", label: "Catalogues" },
            { to: "/material-submittals", label: "Material Submittals" },
            { to: "/about", label: "About Tahweel" },
          ]}
        />

        <FooterColumn
          title="Company"
          links={[
            { to: "/contact", label: "Contact Us" },
            { to: "/contact", label: "Request a Quotation" },
          ]}
        />
      </div>

      <div className="border-t border-charcoal-800 py-6">
        <div className="container-page flex flex-col items-center justify-between gap-3 text-xs text-charcoal-500 sm:flex-row">
          <p>&copy; {new Date().getFullYear()} Tahweel Integrated Company. All rights reserved.</p>
          <p>Riyadh, Saudi Arabia</p>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, links }: { title: string; links: { to: string; label: string }[] }) {
  return (
    <div>
      <h4 className="mb-3 text-xs font-semibold uppercase tracking-wide text-charcoal-500">{title}</h4>
      <ul className="flex flex-col gap-2">
        {links.map((link, i) => (
          <li key={i}>
            <Link to={link.to} className="text-sm text-charcoal-300 hover:text-white">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
