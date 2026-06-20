import { conceptCategoryInfo } from "./conceptMapData";

const edgeItems = [
  ["Prerequisite", "prerequisite"],
  ["Builds into", "builds"],
  ["Related idea", "related"],
  ["Formula", "formula"],
  ["Theorem", "theorem"],
  ["Visual proof", "visual-proof"],
] as const;

export default function ConceptMapLegend() {
  return (
    <section className="concept-panel concept-legend" aria-label="Concept map legend">
      <div>
        <h2>Categories</h2>
        <div className="concept-legend-grid">
          {Object.values(conceptCategoryInfo).map((category) => (
            <span key={category.id}>
              <i style={{ background: category.color }} />
              {category.label}
            </span>
          ))}
        </div>
      </div>
      <div>
        <h2>Relationship types</h2>
        <div className="concept-edge-legend">
          {edgeItems.map(([label, className]) => (
            <span key={className}>
              <i className={className} />
              {label}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
