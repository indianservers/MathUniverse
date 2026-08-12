import { Crosshair, Expand, Focus, Maximize2, Minus, Plus, RotateCcw } from "lucide-react";
import { useEffect, useMemo, useRef, useState, type MouseEvent as ReactMouseEvent, type PointerEvent, type WheelEvent } from "react";
import { conceptCategoryInfo } from "./conceptMapData";
import type { ConceptEdge, ConceptNode } from "./conceptMapTypes";

const MAP_WIDTH = 1760;
const MAP_HEIGHT = 1060;
const MIN_ZOOM = 0.55;
const MAX_ZOOM = 2.4;

const edgeClass: Record<ConceptEdge["type"], string> = { prerequisite: "prerequisite", "builds-into": "builds", related: "related", "formula-link": "formula", "theorem-link": "theorem", "application-link": "application", "visual-proof-link": "visual-proof" };

function edgePath(source: ConceptNode, target: ConceptNode) {
  if (source.id === target.id) return `M ${source.x + 24} ${source.y - 10} C ${source.x + 76} ${source.y - 70}, ${source.x + 108} ${source.y + 48}, ${source.x + 34} ${source.y + 22}`;
  const midX = (source.x + target.x) / 2;
  const midY = (source.y + target.y) / 2 - Math.min(44, Math.abs(source.x - target.x) / 10);
  return `M ${source.x} ${source.y} Q ${midX} ${midY} ${target.x} ${target.y}`;
}

export default function ConceptMapCanvas({ edges, focusIds, onOpen, onSelect, pathIds, searchActive, searchMatchIds, selectedId, visibleConcepts }: {
  edges: ConceptEdge[];
  focusIds: Set<string>;
  onOpen: (concept: ConceptNode) => void;
  onSelect: (conceptId: string) => void;
  pathIds: Set<string>;
  searchActive: boolean;
  searchMatchIds: Set<string>;
  selectedId?: string;
  visibleConcepts: ConceptNode[];
}) {
  const shellRef = useRef<HTMLDivElement | null>(null);
  const [size, setSize] = useState({ width: 1000, height: 650 });
  const [view, setView] = useState({ x: 0, y: 0, zoom: 0.78 });
  const [hoveredId, setHoveredId] = useState<string>();
  const [isPanning, setIsPanning] = useState(false);
  const dragRef = useRef<{ pointerId: number; x: number; y: number; viewX: number; viewY: number } | null>(null);
  const conceptById = useMemo(() => new Map(visibleConcepts.map((concept) => [concept.id, concept])), [visibleConcepts]);
  const viewWidth = size.width / view.zoom;
  const viewHeight = size.height / view.zoom;

  useEffect(() => {
    const shell = shellRef.current;
    if (!shell) return;
    const observer = new ResizeObserver(([entry]) => setSize({ width: Math.max(320, entry.contentRect.width), height: Math.max(360, entry.contentRect.height) }));
    observer.observe(shell);
    return () => observer.disconnect();
  }, []);

  const clampView = (next: { x: number; y: number; zoom: number }) => {
    const zoom = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, Number(next.zoom.toFixed(2))));
    const width = size.width / zoom;
    const height = size.height / zoom;
    return { x: Math.min(Math.max(next.x, 0), Math.max(0, MAP_WIDTH - width)), y: Math.min(Math.max(next.y, 0), Math.max(0, MAP_HEIGHT - height)), zoom };
  };
  const fitView = () => setView(clampView({ x: 0, y: 0, zoom: Math.min(size.width / MAP_WIDTH, size.height / MAP_HEIGHT) * 0.94 }));
  const resetView = () => setView(clampView({ x: 0, y: 0, zoom: 0.78 }));
  const centerSelected = () => {
    const concept = selectedId ? conceptById.get(selectedId) : undefined;
    if (!concept) return fitView();
    setView((current) => clampView({ x: concept.x - size.width / current.zoom / 2, y: concept.y - size.height / current.zoom / 2, zoom: Math.max(current.zoom, 1.05) }));
  };
  const zoomAtCenter = (delta: number) => setView((current) => {
    const nextZoom = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, current.zoom + delta));
    return clampView({ x: current.x + (size.width / current.zoom - size.width / nextZoom) / 2, y: current.y + (size.height / current.zoom - size.height / nextZoom) / 2, zoom: nextZoom });
  });
  const toggleFullscreen = async () => document.fullscreenElement ? document.exitFullscreen() : shellRef.current?.requestFullscreen();
  const navigateMiniMap = (event: ReactMouseEvent<HTMLButtonElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * MAP_WIDTH;
    const y = ((event.clientY - rect.top) / rect.height) * MAP_HEIGHT;
    setView((current) => clampView({ x: x - size.width / current.zoom / 2, y: y - size.height / current.zoom / 2, zoom: current.zoom }));
  };

  useEffect(() => { centerSelected(); }, [selectedId]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => { if (event.key === "Escape") onSelect(""); if (event.key === "+" || event.key === "=") zoomAtCenter(.12); if (event.key === "-") zoomAtCenter(-.12); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const handleWheel = (event: WheelEvent<SVGSVGElement>) => { event.preventDefault(); zoomAtCenter(event.deltaY > 0 ? -.1 : .1); };
  const handlePointerDown = (event: PointerEvent<SVGSVGElement>) => { if ((event.target as Element).closest(".concept-node")) return; dragRef.current = { pointerId: event.pointerId, x: event.clientX, y: event.clientY, viewX: view.x, viewY: view.y }; setIsPanning(true); event.currentTarget.setPointerCapture(event.pointerId); };
  const handlePointerMove = (event: PointerEvent<SVGSVGElement>) => { const drag = dragRef.current; if (!drag || drag.pointerId !== event.pointerId) return; const rect = event.currentTarget.getBoundingClientRect(); setView((current) => clampView({ ...current, x: drag.viewX - (event.clientX - drag.x) * (viewWidth / rect.width), y: drag.viewY - (event.clientY - drag.y) * (viewHeight / rect.height) })); };
  const endPan = (event: PointerEvent<SVGSVGElement>) => { if (dragRef.current?.pointerId === event.pointerId) { dragRef.current = null; setIsPanning(false); event.currentTarget.releasePointerCapture(event.pointerId); } };

  return (
    <section ref={shellRef} className="concept-panel concept-canvas-card" aria-label="Interactive math concept graph">
      <div className="concept-floating-tools" aria-label="Graph controls">
        <button type="button" title="Zoom in" aria-label="Zoom in" onClick={() => zoomAtCenter(.12)}><Plus /></button>
        <button type="button" title="Zoom out" aria-label="Zoom out" onClick={() => zoomAtCenter(-.12)}><Minus /></button>
        <button type="button" title="Fit graph" aria-label="Fit graph" onClick={fitView}><Expand /></button>
        <button type="button" title="Centre selected concept" aria-label="Centre selected concept" onClick={centerSelected}><Crosshair /></button>
        <button type="button" title="Reset graph" aria-label="Reset graph" onClick={resetView}><RotateCcw /></button>
        <button type="button" title="Fullscreen graph" aria-label="Fullscreen graph" onClick={toggleFullscreen}><Maximize2 /></button>
      </div>
      <div className="concept-canvas-shell">
        <svg className={`concept-canvas ${isPanning ? "is-panning" : ""}`} viewBox={`${view.x} ${view.y} ${viewWidth} ${viewHeight}`} role="img" aria-label="Interactive mathematics knowledge graph" onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={endPan} onPointerCancel={endPan} onWheel={handleWheel}>
          <defs><marker id="concept-arrow" markerHeight="8" markerWidth="8" orient="auto" refX="7" refY="4"><path d="M0 0L8 4L0 8z" /></marker></defs>
          <g>{edges.map((edge) => { const source = conceptById.get(edge.source); const target = conceptById.get(edge.target); if (!source || !target) return null; const highlighted = pathIds.has(edge.source) && pathIds.has(edge.target); return <path key={edge.id} className={`concept-edge ${edgeClass[edge.type]} ${highlighted ? "path" : ""}`} d={edgePath(source, target)} markerEnd={edge.source === edge.target ? undefined : "url(#concept-arrow)"}><title>{edge.label}</title></path>; })}</g>
          <g>{visibleConcepts.map((concept) => { const category = conceptCategoryInfo[concept.category]; const selected = selectedId === concept.id; const focused = focusIds.has(concept.id); const inPath = pathIds.has(concept.id); const searchMatch = searchMatchIds.has(concept.id); const muted = searchActive && !searchMatch && !focused && !selected; return <g key={concept.id} aria-label={`${concept.title}, ${category.label}, ${concept.difficulty}`} className={`concept-node ${selected ? "selected" : ""} ${focused ? "focused" : ""} ${inPath ? "path" : ""} ${searchMatch ? "search-match" : ""} ${muted ? "muted" : ""}`} role="button" tabIndex={0} transform={`translate(${concept.x} ${concept.y})`} onClick={() => onSelect(concept.id)} onDoubleClick={() => onOpen(concept)} onKeyDown={(event) => { if (event.key === "Enter") onSelect(concept.id); }} onMouseEnter={() => setHoveredId(concept.id)} onMouseLeave={() => setHoveredId(undefined)}><circle r={selected ? 42 : 34} fill={category.softColor} stroke={category.color} /><circle className="concept-mastery-ring" r={selected ? 48 : 40} strokeDasharray={`${concept.masteryLevel ?? 0} 100`} /><text className="concept-node-title" textAnchor="middle" y="2">{concept.shortTitle ?? concept.title}</text>{(hoveredId === concept.id || selected) && <foreignObject x="-96" y="48" width="192" height="58"><div className="concept-node-tooltip"><strong>{concept.title}</strong><span>{category.label} · {concept.difficulty}</span></div></foreignObject>}</g>; })}</g>
        </svg>
      </div>
      <div className="concept-canvas-legend">{Object.values(conceptCategoryInfo).slice(0, 6).map((category) => <span key={category.id}><i style={{ background: category.color }} />{category.label}</span>)}<b>More</b></div>
      <button type="button" className="concept-minimap" aria-label="Navigate graph using minimap" onClick={navigateMiniMap}><svg viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}><rect x={view.x} y={view.y} width={viewWidth} height={viewHeight} /><g>{visibleConcepts.map((concept) => <circle key={concept.id} cx={concept.x} cy={concept.y} r="12" fill={conceptCategoryInfo[concept.category].color} />)}</g></svg><Focus /></button>
    </section>
  );
}
