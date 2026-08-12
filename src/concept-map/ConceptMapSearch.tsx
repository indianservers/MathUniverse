import { Search, X } from "lucide-react";
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
      <span className="concept-search-field"><Search aria-hidden="true" />
      <input
        aria-label="Search concepts, formulas, theorems, or real-life uses"
        value={filters.search ?? ""}
        onChange={(event) => onFilters({ ...filters, search: event.target.value })}
        placeholder="Search concepts, formulas, theorems, or real-life uses..."
      />
      {filters.search && <button type="button" aria-label="Clear concept search" onClick={() => onFilters({ ...filters, search: "" })}><X aria-hidden="true" /></button>}
      </span>
    </label>
  );
}
