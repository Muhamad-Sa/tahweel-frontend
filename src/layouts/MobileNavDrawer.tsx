import { NavLink } from "react-router-dom";

import { Drawer } from "@/components/ui/Drawer";
import { Wordmark } from "@/components/ui/Wordmark";
import { cn } from "@/utils/cn";

export function MobileNavDrawer({
  open,
  onClose,
  links,
}: {
  open: boolean;
  onClose: () => void;
  links: { to: string; label: string }[];
}) {
  return (
    <Drawer open={open} onClose={onClose} title="Menu" side="right">
      <div className="mb-6">
        <Wordmark className="h-6" />
      </div>
      <nav className="flex flex-col gap-1">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            onClick={onClose}
            className={({ isActive }) =>
              cn(
                "rounded px-3 py-2.5 text-sm font-medium text-charcoal-700 hover:bg-brand-50 hover:text-brand-800",
                isActive && "bg-brand-50 text-brand-800"
              )
            }
          >
            {link.label}
          </NavLink>
        ))}
      </nav>
    </Drawer>
  );
}
