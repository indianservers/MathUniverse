import { useMemo, useRef, useState, type PointerEvent, type WheelEvent } from "react";
import { conceptCategoryInfo } from "./conceptMapData";
import type { ConceptEdge, ConceptNode } from "./conceptMapTypes";
import { getAvailableModuleCount } from "./conceptMapUtils";

const MAP_WIDTH = 1760;
const MAP_HEIGHT = 1060;
const VIEWPORT_WIDTH = 1400;
const VIEWPORT_HEIGHT = 920;
const MIN_ZOOM = 0.65;
const MAX_ZOOM = 2.35;

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
  const [view, setView] = useState({ x: 0, y: 0, zoom: 1 });
  const [hoveredId, setHoveredId] = useState<string | undefined>();
  const [isPanning, setIsPanning] = useState(false);
  const dragRef = useRef<{ pointerId: number; x: number; y: number; viewX: number; viewY: number } | null>(null);
  const conceptById = useMemo(() => new Map(visibleConcepts.map((concept) => [concept.id, concept])), [visibleConcepts]);

  const viewWidth = VIEWPORT_WIDTH / view.zoom;
  const viewHeight = VIEWPORT_HEIGHT / view.zoom;

  const clampView = (nextView: { x: number; y: number; zoom: number }) => {
    const zoom = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, Number(nextView.zoom.toFixed(2))));
    const width = VIEWPORT_WIDTH / zoom;
    const height = VIEWPORT_HEIGHT / zoom;
    return {
      x: Math.min(Math.max(nextView.x, 0), Math.max(0, MAP_WIDTH - width)),
      y: Math.min(Math.max(nextView.y, 0), Math.max(0, MAP_HEIGHT - height)),
      zoom,
    };
  };

  const zoomAtCenter = (delta: number) => {
    setView((current) => {
      const nextZoom = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, Number((current.zoom + delta).toFixed(2))));
      const currentWidth = VIEWPORT_WIDTH / current.zoom;
      const currentHeight = VIEWPORT_HEIGHT / current.zoom;
      const nextWidth = VIEWPORT_WIDTH / nextZoom;
      const nextHeight = VIEWPORT_HEIGHT / nextZoom;
      return clampView({
        x: current.x + (currentWidth - nextWidth) / 2,
        y: current.y + (currentHeight - nextHeight) / 2,
        zoom: nextZoom,
      });
    });
  };

  const panBy = (dx: number, dy: number) => {
    setView((current) => clampView({ ...current, x: current.x + dx, y: current.y + dy }));
  };

  const resetView = () => setView({ x: 0, y: 0, zoom: 1 });
  const fitView = () => setView(clampView({ x: 0, y: 0, zoom: Math.min(VIEWPORT_WIDTH / MAP_WIDTH, VIEWPORT_HEIGHT / MAP_HEIGHT) }));

  const handleWheel = (event: WheelEvent<SVGSVGElement>) => {
    event.preventDefault();
    zoomAtCenter(event.deltaY > 0 ? -0.12 : 0.12);
  };

  const handlePointerDown = (event: PointerEvent<SVGSVGElement>) => {
    if ((event.target as Element).closest(".concept-node")) return;
    dragRef.current = { pointerId: event.pointerId, x: event.clientX, y: event.clientY, viewX: view.x, viewY: view.y };
    setIsPanning(true);
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: PointerEvent<SVGSVGElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const dx = (event.clientX - drag.x) * (viewWidth / rect.width);
    const dy = (event.clientY - drag.y) * (viewHeight / rect.height);
    setView((current) => clampView({ ...current, x: drag.viewX - dx, y: drag.viewY - dy }));
  };

  const endPan = (event: PointerEvent<SVGSVGElement>) => {
    if (dragRef.current?.pointerId === event.pointerId) {
      dragRef.current = null;
      setIsPanning(false);
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  return (
    <section className="concept-panel concept-canvas-card" aria-label="Interactive math concept graph">
      <div className="concept-canvas-toolbar">
        <div>
          <p className="eyebrow">Knowledge graph</p>
          <h2>Math concepts linked by prerequisites, proofs, formulas, and tools</h2>
        </div>
        <div className="concept-zoom-controls" aria-label="Graph zoom controls">
          <button type="button" aria-label="Zoom out" onClick={() => zoomAtCenter(-0.12)}>-</button>
          <button type="button" onClick={resetView}>Reset</button>
          <button type="button" onClick={fitView}>Fit</button>
          <button type="button" aria-label="Zoom in" onClick={() => zoomAtCenter(0.12)}>+</button>
          <span className="concept-zoom-value" aria-live="polite">{Math.round(view.zoom * 100)}%</span>
          <div className="concept-pan-controls" aria-label="Graph pan controls">
            <button type="button" aria-label="Pan up" onClick={() => panBy(0, -110)}>↑</button>
            <button type="button" aria-label="Pan left" onClick={() => panBy(-140, 0)}>←</button>
            <button type="button" aria-label="Pan right" onClick={() => panBy(140, 0)}>→</button>
            <button type="button" aria-label="Pan down" onClick={() => panBy(0, 110)}>↓</button>
          </div>
        </div>
      </div>

      <div className="concept-canvas-shell">
        <svg
          className={`concept-canvas ${isPanning ? "is-panning" : ""}`}
          viewBox={`${view.x} ${view.y} ${viewWidth} ${viewHeight}`}
          role="img"
          aria-label="Concept map showing connected math topics. Drag the background, use the mouse wheel, or use the controls to navigate."
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={endPan}
          onPointerCancel={endPan}
          onWheel={handleWheel}
        >
          <defs>
            <marker id="concept-arrow" markerHeight="8" markerWidth="8" orient="auto" refX="7" refY="4">
              <path d="M 0 0 L 8 4 L 0 8 z" />
            </marker>
          </defs>
          <g>
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
