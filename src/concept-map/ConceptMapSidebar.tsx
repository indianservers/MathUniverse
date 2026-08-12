import { ChevronDown, ChevronUp, GraduationCap } from "lucide-react";
import { useState } from "react";
import ConceptMapSearch from "./ConceptMapSearch";
import { conceptCategoryInfo, conceptNodes } from "./conceptMapData";
import type { ConceptCategory, ConceptEdgeType, ConceptMapFilters, LearningMode } from "./conceptMapTypes";

const relationshipFilters: Array<{ id: ConceptEdgeType; label: string; style: string }> = [
  { id: "prerequisite", label: "Prerequisite", style: "prerequisite" },
  { id: "builds-into", label: "Builds into", style: "builds" },
  { id: "related", label: "Related idea", style: "related" },
  { id: "formula-link", label: "Formula", style: "formula" },
  { id: "theorem-link", label: "Theorem", style: "theorem" },
  { id: "visual-proof-link", label: "Visual proof", style: "visual-proof" },
];

function toggleValue<T extends string>(values: T[] | undefined, value: T) {
  const current = values ?? [];
  return current.includes(value) ? current.filter((item) => item !== value) : [...current, value];
}

export default function ConceptMapSidebar({
  classroomMode, filters, learningMode, masteredVisible, onClassroomMode, onFilters, onLearningMode, onMasteredVisible, totalCount, visibleCount,
}: {
  classroomMode: boolean;
  filters: ConceptMapFilters;
  learningMode: LearningMode;
  masteredVisible: boolean;
  onClassroomMode: (enabled: boolean) => void;
  onFilters: (filters: ConceptMapFilters) => void;
  onLearningMode: (mode: LearningMode) => void;
  onMasteredVisible: (enabled: boolean) => void;
  totalCount: number;
  visibleCount: number;
}) {
  const [showAllCategories, setShowAllCategories] = useState(false);
  const categories = Array.from(new Set(conceptNodes.map((node) => node.category)));
  const shownCategories = showAllCategories ? categories : categories.slice(0, 8);

  return (
    <aside className="concept-panel concept-sidebar" aria-label="Concept map filters">
      <ConceptMapSearch filters={filters} onFilters={onFilters} />
      <p className="concept-count"><strong>{visibleCount}</strong> of {totalCount} concepts visible</p>

      <section>
        <div className="concept-section-title"><h2>Learning mode</h2><GraduationCap aria-hidden="true" /></div>
        <div className="concept-segmented" role="group" aria-label="Learning mode">
          {(["student", "teacher", "explorer"] as LearningMode[]).map((mode) => <button key={mode} type="button" className={learningMode === mode ? "active" : ""} onClick={() => onLearningMode(mode)}>{mode}</button>)}
        </div>
      </section>

      <div className="concept-toggle-list">
        <label className="concept-toggle"><span>Show mastered</span><input type="checkbox" checked={masteredVisible} onChange={(event) => onMasteredVisible(event.target.checked)} /></label>
        <label className="concept-toggle"><span>Classroom focus</span><input type="checkbox" checked={classroomMode} onChange={(event) => onClassroomMode(event.target.checked)} /></label>
      </div>

      <section>
        <h2>Categories</h2>
        <div className="concept-category-list">
          {shownCategories.map((category) => {
            const count = conceptNodes.filter((node) => node.category === category).length;
            const active = filters.categories?.includes(category);
            return <button key={category} type="button" className={active ? "active" : ""} onClick={() => onFilters({ ...filters, categories: toggleValue(filters.categories, category as ConceptCategory) })}><i style={{ background: conceptCategoryInfo[category].color }} /><span>{conceptCategoryInfo[category].label}</span><b>{count}</b></button>;
          })}
        </div>
        <button type="button" className="concept-show-more" onClick={() => setShowAllCategories((value) => !value)}>{showAllCategories ? <ChevronUp /> : <ChevronDown />}{showAllCategories ? "Show less" : `Show ${categories.length - shownCategories.length} more`}</button>
      </section>

      <section>
        <h2>Relationship types</h2>
        <div className="concept-relationship-list">
          {relationshipFilters.map((relationship) => {
            const checked = !filters.relationships?.length || filters.relationships.includes(relationship.id);
            return <label key={relationship.id}><i className={relationship.style} /><span>{relationship.label}</span><input type="checkbox" checked={checked} onChange={() => {
              const current = filters.relationships?.length ? filters.relationships : relationshipFilters.map((item) => item.id);
              const next = toggleValue(current, relationship.id);
              onFilters({ ...filters, relationships: next.length === relationshipFilters.length ? undefined : next });
            }} /></label>;
          })}
        </div>
      </section>

      <button type="button" className="concept-clear" onClick={() => onFilters({})}>Clear filters</button>
    </aside>
  );
}
