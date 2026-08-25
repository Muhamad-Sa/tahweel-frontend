import { cn } from "@/utils/cn";

/**
 * Typographic TAHWEEL wordmark (no external logo asset was supplied).
 * Built as inline SVG so it scales cleanly and can be recolored via
 * currentColor for dark/light contexts (e.g. footer on charcoal).
 */
export function Wordmark({
  className,
  withTagline = false,
  monochrome = false,
}: {
  className?: string;
  withTagline?: boolean;
  monochrome?: boolean;
}) {
  return (
    <div className={cn("inline-flex flex-col leading-none", className)}>
      <svg viewBox="0 0 300 40" className="h-full w-auto" role="img" aria-label="TAHWEEL">
        <text
          x="0"
          y="30"
          fontFamily="'Archivo', 'Inter', sans-serif"
          fontWeight="800"
          fontSize="34"
          letterSpacing="0.5"
          fill={monochrome ? "currentColor" : "#183328"}
        >
          TAH
          <tspan fill={monochrome ? "currentColor" : "#2c5f48"}>WEEL</tspan>
        </text>
      </svg>
      {withTagline && (
        <span className="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-charcoal-400">
          Superior Sanitary Solutions
        </span>
      )}
    </div>
  );
}

export function WordmarkMark({ className }: { className?: string }) {
  // Compact square mark for favicons / small contexts: a "T" monogram in a
  // rounded-corner tile, echoing the wordmark's weight and green.
  return (
    <svg viewBox="0 0 40 40" className={className} role="img" aria-label="Tahweel">
      <rect width="40" height="40" rx="6" fill="#183328" />
      <text
        x="20"
        y="28"
        textAnchor="middle"
        fontFamily="'Archivo', 'Inter', sans-serif"
        fontWeight="800"
        fontSize="22"
        fill="#ffffff"
      >
        T
      </text>
    </svg>
  );
}
