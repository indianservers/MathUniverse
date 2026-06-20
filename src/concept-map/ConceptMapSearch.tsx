import type { ConceptMapFilters } from "./conceptMapTypes";

export default function ConceptMapSearch({
  filters,
  onFilters,
}: {
  filters: ConceptMapFilters;
  onFilters: (filters: ConceptMapFilters) => void;
}) {
  return (
    <label className="concept-search">
      <span>Search concepts</span>
      <input
        aria-label="Search concepts, formulas, theorems, or real-life uses"
        value={filters.search ?? ""}
        onChange={(event) => onFilters({ ...filters, search: event.target.value })}
        placeholder="Search concepts, formulas, theorems, or real-life uses..."
      />
    </label>
  );
}
