import { useMemo, useState } from "react";
import { conceptCategoryInfo } from "./conceptMapData";
import type { ConceptEdge, ConceptNode } from "./conceptMapTypes";
import { getAvailableModuleCount } from "./conceptMapUtils";

const edgeClass: Record<ConceptEdge["type"], string> = {
  prerequisite: "prerequisite",
  "builds-into": "builds",
  related: "related",
  "formula-link": "formula",
  "theorem-link": "theorem",
  "application-link": "application",
  "visual-proof-link": "visual-proof",
};

function edgePath(source: ConceptNode, target: ConceptNode) {
  if (source.id === target.id) {
    return `M ${source.x + 24} ${source.y - 10} C ${source.x + 76} ${source.y - 70}, ${source.x + 108} ${source.y + 48}, ${source.x + 34} ${source.y + 22}`;
  }
  const midX = (source.x + target.x) / 2;
  const midY = (source.y + target.y) / 2 - Math.min(44, Math.abs(source.x - target.x) / 10);
  return `M ${source.x} ${source.y} Q ${midX} ${midY} ${target.x} ${target.y}`;
}

export default function ConceptMapCanvas({
  edges,
  focusIds,
  onSelect,
  pathIds,
  searchActive,
  selectedId,
  visibleConcepts,
}: {
  edges: ConceptEdge[];
  focusIds: Set<string>;
  onSelect: (conceptId: string) => void;
  pathIds: Set<string>;
  searchActive: boolean;
  selectedId?: string;
  visibleConcepts: ConceptNode[];
}) {
  const [zoom, setZoom] = useState(1);
  const [hoveredId, setHoveredId] = useState<string | undefined>();
  const conceptById = useMemo(() => new Map(visibleConcepts.map((concept) => [concept.id, concept])), [visibleConcepts]);

  const resetView = () => setZoom(1);

  return (
    <section className="concept-panel concept-canvas-card" aria-label="Interactive math concept graph">
      <div className="concept-canvas-toolbar">
        <div>
          <p className="eyebrow">Knowledge graph</p>
          <h2>Math concepts linked by prerequisites, proofs, formulas, and tools</h2>
        </div>
        <div className="concept-zoom-controls" aria-label="Graph zoom controls">
          <button type="button" onClick={() => setZoom((value) => Math.max(0.72, Number((value - 0.12).toFixed(2))))}>-</button>
          <button type="button" onClick={resetView}>Reset</button>
          <button type="button" onClick={() => setZoom((value) => Math.min(1.38, Number((value + 0.12).toFixed(2))))}>+</button>
        </div>
      </div>

      <div className="concept-canvas-shell">
        <svg className="concept-canvas" viewBox="0 0 1400 920" role="img" aria-label="Concept map showing connected math topics">
          <defs>
            <marker id="concept-arrow" markerHeight="8" markerWidth="8" orient="auto" refX="7" refY="4">
              <path d="M 0 0 L 8 4 L 0 8 z" />
            </marker>
          </defs>
          <g style={{ transform: `scale(${zoom})`, transformOrigin: "700px 460px" }}>
            {edges.map((edge) => {
              const source = conceptById.get(edge.source);
              const target = conceptById.get(edge.target);
              if (!source || !target) return null;
              const highlighted = pathIds.has(edge.source) && pathIds.has(edge.target);
              return (
                <path
                  key={edge.id}
                  className={`concept-edge ${edgeClass[edge.type]} ${highlighted ? "path" : ""}`}
                  d={edgePath(source, target)}
                  markerEnd={edge.source === edge.target ? undefined : "url(#concept-arrow)"}
                />
              );
            })}

            {visibleConcepts.map((concept) => {
              const category = conceptCategoryInfo[concept.category];
              const selected = selectedId === concept.id;
              const focused = focusIds.has(concept.id);
              const inPath = pathIds.has(concept.id);
              const muted = searchActive && !focused && !selected;
              const modules = getAvailableModuleCount(concept);
              return (
                <g
                  key={concept.id}
                  aria-label={`${concept.title}, ${category.label}, ${concept.difficulty}`}
                  className={`concept-node ${selected ? "selected" : ""} ${focused ? "focused" : ""} ${inPath ? "path" : ""} ${muted ? "muted" : ""}`}
                  role="button"
                  tabIndex={0}
                  transform={`translate(${concept.x} ${concept.y})`}
                  onClick={() => onSelect(concept.id)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      onSelect(concept.id);
                    }
                  }}
                  onMouseEnter={() => setHoveredId(concept.id)}
                  onMouseLeave={() => setHoveredId(undefined)}
                >
                  <circle r={selected ? 37 : 31} fill={category.softColor} stroke={category.color} />
                  <circle
                    className="concept-mastery-ring"
                    r={selected ? 43 : 37}
                    strokeDasharray={`${concept.masteryLevel ?? 0} 100`}
                  />
                  <text className="concept-node-title" textAnchor="middle" y="-2">
                    {concept.shortTitle ?? concept.title}
                  </text>
                  <text className="concept-node-meta" textAnchor="middle" y="17">
                    {modules} modules
                  </text>
                  {(hoveredId === concept.id || selected) && (
                    <foreignObject x="-94" y="42" width="188" height="72">
                      <div className="concept-node-tooltip">
                        <strong>{concept.title}</strong>
                        <span>{category.label} | {concept.difficulty}</span>
                      </div>
                    </foreignObject>
                  )}
                </g>
              );
            })}
          </g>
        </svg>
      </div>
    </section>
  );
}
