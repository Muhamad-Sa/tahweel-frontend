import { Globe, Menu, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

import { Wordmark } from "@/components/ui/Wordmark";
import { cn } from "@/utils/cn";
import { SearchOverlay } from "@/features/search/SearchOverlay";
import { MobileNavDrawer } from "./MobileNavDrawer";

const NAV_LINKS = [
  { to: "/products", label: "Products" },
  { to: "/library", label: "Technical Library" },
  { to: "/catalogues", label: "Catalogues" },
  { to: "/material-submittals", label: "Material Submittals" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

export function Header() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <header className="sticky top-0 z-30 border-b border-charcoal-100 bg-white/95 backdrop-blur">
        <div className="container-page flex h-16 items-center justify-between gap-4">
          <NavLink to="/" className="flex-shrink-0">
            <Wordmark className="h-7" />
          </NavLink>

          <nav className="hidden items-center gap-6 lg:flex">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  cn(
                    "text-sm font-medium text-charcoal-600 hover:text-brand-700",
                    isActive && "text-brand-700"
                  )
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSearchOpen(true)}
              className="hidden items-center gap-2 rounded border border-charcoal-200 px-3 py-2 text-sm text-charcoal-400 hover:border-brand-400 sm:flex"
            >
              <Search className="h-4 w-4" />
              <span>Search…</span>
              <kbd className="ml-3 rounded bg-charcoal-100 px-1.5 py-0.5 text-[10px] text-charcoal-500">⌘K</kbd>
            </button>
            <button
              onClick={() => setSearchOpen(true)}
              aria-label="Search"
              className="flex h-9 w-9 items-center justify-center rounded text-charcoal-500 hover:bg-charcoal-100 sm:hidden"
            >
              <Search className="h-5 w-5" />
            </button>

            <button
              aria-label="Language: English (Arabic coming soon)"
              title="English — Arabic (عربي) coming soon"
              className="flex h-9 items-center gap-1.5 rounded px-2 text-xs font-medium text-charcoal-400"
              disabled
            >
              <Globe className="h-4 w-4" />
              EN
            </button>

            <button
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
              className="flex h-9 w-9 items-center justify-center rounded text-charcoal-600 hover:bg-charcoal-100 lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
      <MobileNavDrawer open={mobileOpen} onClose={() => setMobileOpen(false)} links={NAV_LINKS} />
    </>
  );
}
