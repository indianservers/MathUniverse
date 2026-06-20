import ConceptMapSearch from "./ConceptMapSearch";
import { conceptCategoryInfo, conceptNodes } from "./conceptMapData";
import type { ConceptCategory, ConceptDifficulty, ConceptMapFilters, ConceptModuleFilter, LearningMode } from "./conceptMapTypes";

const difficulties: ConceptDifficulty[] = ["foundation", "basic", "intermediate", "advanced", "olympiad"];

const moduleFilters: Array<{ id: ConceptModuleFilter; label: string }> = [
  { id: "formulaVisualization", label: "Formula" },
  { id: "theorem", label: "Theorem" },
  { id: "problemSolver", label: "Solver" },
  { id: "graph", label: "Graph" },
  { id: "visualization2D", label: "2D" },
  { id: "visualization3D", label: "3D" },
  { id: "visualProof", label: "Visual proof" },
  { id: "venn", label: "Venn" },
  { id: "practice", label: "Practice" },
  { id: "olympiad", label: "Olympiad" },
];

function toggleValue<T extends string>(values: T[] | undefined, value: T) {
  const current = values ?? [];
  return current.includes(value) ? current.filter((item) => item !== value) : [...current, value];
}

export default function ConceptMapSidebar({
  classroomMode,
  filters,
  learningMode,
  onClassroomMode,
  onFilters,
  onLearningMode,
  totalCount,
  visibleCount,
}: {
  classroomMode: boolean;
  filters: ConceptMapFilters;
  learningMode: LearningMode;
  onClassroomMode: (enabled: boolean) => void;
  onFilters: (filters: ConceptMapFilters) => void;
  onLearningMode: (mode: LearningMode) => void;
  totalCount: number;
  visibleCount: number;
}) {
  const categories = Array.from(new Set(conceptNodes.map((node) => node.category)));
  return (
    <aside className="concept-panel concept-sidebar" aria-label="Concept map filters">
      <ConceptMapSearch filters={filters} onFilters={onFilters} />
      <p className="concept-count">Showing {visibleCount} of {totalCount} concepts</p>

      <section>
        <h2>Learning mode</h2>
        <div className="concept-segmented" role="group" aria-label="Learning mode">
          {(["student", "teacher", "explorer"] as LearningMode[]).map((mode) => (
            <button key={mode} type="button" className={learningMode === mode ? "active" : ""} onClick={() => onLearningMode(mode)}>
              {mode}
            </button>
          ))}
        </div>
      </section>

      <label className="concept-toggle">
        <input type="checkbox" checked={classroomMode} onChange={(event) => onClassroomMode(event.target.checked)} />
        <span>Classroom Mode</span>
      </label>

      <section>
        <h2>Categories</h2>
        <div className="concept-chip-list">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              className={filters.categories?.includes(category) ? "active" : ""}
              onClick={() => onFilters({ ...filters, categories: toggleValue(filters.categories, category as ConceptCategory) })}
            >
              <span style={{ background: conceptCategoryInfo[category].color }} />
              {conceptCategoryInfo[category].label}
            </button>
          ))}
        </div>
      </section>

      <section>
        <h2>Difficulty</h2>
        <div className="concept-chip-list compact">
          {difficulties.map((difficulty) => (
            <button
              key={difficulty}
              type="button"
              className={filters.difficulties?.includes(difficulty) ? "active" : ""}
              onClick={() => onFilters({ ...filters, difficulties: toggleValue(filters.difficulties, difficulty) })}
            >
              {difficulty}
            </button>
          ))}
        </div>
      </section>

      <section className={classroomMode ? "concept-hide-classroom" : ""}>
        <h2>Available modules</h2>
        <div className="concept-chip-list compact">
          {moduleFilters.map((module) => (
            <button
              key={module.id}
              type="button"
              className={filters.modules?.includes(module.id) ? "active" : ""}
              onClick={() => onFilters({ ...filters, modules: toggleValue(filters.modules, module.id) })}
            >
              {module.label}
            </button>
          ))}
        </div>
      </section>

      <button type="button" className="concept-clear" onClick={() => onFilters({})}>
        Clear Filters
      </button>
    </aside>
  );
}
