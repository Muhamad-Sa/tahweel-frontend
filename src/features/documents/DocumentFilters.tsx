import { useCategories } from "@/hooks/useCategories";
import { useDocumentTypes, useStandards } from "@/hooks/useDocuments";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import type { DocumentListParams } from "@/api/endpoints";

interface Props {
  filters: DocumentListParams;
  onChange: (filters: DocumentListParams) => void;
}

const LANGUAGES = [
  { value: "", label: "All languages" },
  { value: "en", label: "English" },
  { value: "ar", label: "Arabic" },
  { value: "en_ar", label: "English / Arabic" },
];

const currentYear = new Date().getFullYear();
const YEARS = Array.from({ length: 6 }, (_, i) => currentYear - i);

export function DocumentFilters({ filters, onChange }: Props) {
  const { data: categories } = useCategories();
  const { data: types } = useDocumentTypes();
  const { data: standards } = useStandards();

  const set = (patch: Partial<DocumentListParams>) => onChange({ ...filters, ...patch, page: 1 });

  const hasFilters = Boolean(
    filters.category || filters.document_type || filters.language || filters.standard || filters.year
  );

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-sm font-semibold text-charcoal-900">Filters</h3>
        {hasFilters && (
          <Button variant="ghost" size="sm" onClick={() => onChange({ search: filters.search, page: 1 })}>
            Clear all
          </Button>
        )}
      </div>

      <Select
        label="Product family"
        value={filters.category ?? ""}
        onChange={(e) => set({ category: e.target.value || undefined })}
      >
        <option value="">All families</option>
        {categories?.results.map((c) => (
          <option key={c.id} value={c.slug}>
            {c.name}
          </option>
        ))}
      </Select>

      <Select
        label="Document type"
        value={filters.document_type ?? ""}
        onChange={(e) => set({ document_type: e.target.value || undefined })}
      >
        <option value="">All types</option>
        {types?.map((t) => (
          <option key={t.value} value={t.value}>
            {t.label}
          </option>
        ))}
      </Select>

      <Select
        label="Language"
        value={filters.language ?? ""}
        onChange={(e) => set({ language: e.target.value || undefined })}
      >
        {LANGUAGES.map((l) => (
          <option key={l.value} value={l.value}>
            {l.label}
          </option>
        ))}
      </Select>

      <Select
        label="Standard"
        value={filters.standard ?? ""}
        onChange={(e) => set({ standard: e.target.value || undefined })}
      >
        <option value="">All standards</option>
        {standards?.map((s) => (
          <option key={s.id} value={s.code}>
            {s.code}
          </option>
        ))}
      </Select>

      <Select
        label="Year"
        value={filters.year ?? ""}
        onChange={(e) => set({ year: e.target.value ? Number(e.target.value) : undefined })}
      >
        <option value="">All years</option>
        {YEARS.map((y) => (
          <option key={y} value={y}>
            {y}
          </option>
        ))}
      </Select>
    </div>
  );
}
