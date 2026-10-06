import { useStudioState } from "../phase1/StudioModelProvider";
import { useMemo, useRef, useState, type PointerEvent } from "react";
import { Maximize2, Minus, Plus, RotateCcw } from "lucide-react";
import { contourSegments } from "./firstOrderMath";
import { vectorTrajectory, type VectorField, type XY } from "./phase2Math";

const emptyStarts: XY[] = [];

export function Phase2Portrait({ field, starts, backgroundStarts = emptyStarts, onStartChange, showField = true, showTrajectories = true, showNullclines = false, showEquilibrium = true, showSeparatrices = false, equilibrium = { x: 0, y: 0 }, separatrices = [], label = "Interactive phase portrait" }: {
  field: VectorField; starts: XY[]; backgroundStarts?: XY[]; onStartChange?: (index: number, point: XY) => void;
  showField?: boolean; showTrajectories?: boolean; showNullclines?: boolean; showEquilibrium?: boolean; showSeparatrices?: boolean;
  equilibrium?: XY; separatrices?: XY[][]; label?: string;
}) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [zoom, setZoom] = useStudioState("Phase2Portrait:Phase2Portrait:zoom", 1), [offset, setOffset] = useStudioState<XY>("Phase2Portrait:Phase2Portrait:offset", { x: 0, y: 0 });
  const [drag, setDrag] = useState<{ kind: "point"; index: number } | { kind: "pan"; x: number; y: number; offset: XY } | null>(null);
  const [inspector, setInspector] = useStudioState<XY | null>("Phase2Portrait:Phase2Portrait:inspector", null);
  const width = 600, height = 430, pad = 35;
  const scale = 3.5 / zoom;
  const bounds = { xMin: offset.x - scale, xMax: offset.x + scale, yMin: offset.y - scale * .69, yMax: offset.y + scale * .69 };
  const px = (x: number) => pad + (x - bounds.xMin) / (bounds.xMax - bounds.xMin) * (width - 2 * pad);
  const py = (y: number) => height - pad - (y - bounds.yMin) / (bounds.yMax - bounds.yMin) * (height - 2 * pad);
  const eventPoint = (event: PointerEvent<SVGSVGElement>): XY => {
    const rect = event.currentTarget.getBoundingClientRect();
    const sx = (event.clientX - rect.left) / rect.width * width, sy = (event.clientY - rect.top) / rect.height * height;
    return { x: bounds.xMin + (sx - pad) / (width - 2 * pad) * (bounds.xMax - bounds.xMin), y: bounds.yMin + (height - pad - sy) / (height - 2 * pad) * (bounds.yMax - bounds.yMin) };
  };
  const paths = useMemo(() => starts.map((point) => vectorTrajectory(field, point)), [field, starts]);
  const backgroundPaths = useMemo(() => backgroundStarts.map((point) => vectorTrajectory(field, point, 180, .04)), [field, backgroundStarts]);
  const arrows = showField ? Array.from({ length: 19 }, (_, i) => Array.from({ length: 13 }, (_, j) => {
    const x = bounds.xMin + (i + .5) * (bounds.xMax - bounds.xMin) / 19;
    const y = bounds.yMin + (j + .5) * (bounds.yMax - bounds.yMin) / 13;
    const [vx, vy] = field(x, y); const size = Math.hypot(vx, vy);
    if (!Number.isFinite(size) || size < 1e-8) return null;
    const dx = vx / size * 10, dy = vy / size * 10;
    return <line key={`${i}-${j}`} x1={px(x) - dx / 2} y1={py(y) + dy / 2} x2={px(x) + dx / 2} y2={py(y) - dy / 2} stroke="#4b90f8" strokeWidth="1.3" markerEnd="url(#de2-arrow)" opacity=".8" />;
  })) : null;
  const nullX = showNullclines ? contourSegments((x, y) => field(x, y)[0], 0, 31) : [];
  const nullY = showNullclines ? contourSegments((x, y) => field(x, y)[1], 0, 31) : [];
  const pathData = (points: XY[]) => points.filter((point) => Number.isFinite(point.x) && Number.isFinite(point.y)).map((point, index) => `${index ? "L" : "M"}${px(point.x).toFixed(1)},${py(point.y).toFixed(1)}`).join(" ");
  const reset = () => { setZoom(1); setOffset({ x: 0, y: 0 }); };
  const inspectorField = inspector ? field(inspector.x, inspector.y) : null;
  return <div className="de2-portrait-wrap"><div className="de1-graph-toolbar" aria-label="Phase portrait controls"><button type="button" aria-label="Zoom out" title="Zoom out" onClick={() => setZoom((value) => Math.max(.55, value / 1.25))}><Minus size={16} /></button><output>{Math.round(zoom * 100)}%</output><button type="button" aria-label="Zoom in" title="Zoom in" onClick={() => setZoom((value) => Math.min(5, value * 1.25))}><Plus size={16} /></button><button type="button" aria-label="Reset view" title="Reset view" onClick={reset}><RotateCcw size={15} /></button><button type="button" aria-label="Expand portrait" title="Expand portrait" onClick={() => svgRef.current?.requestFullscreen?.()}><Maximize2 size={15} /></button></div>
    <svg ref={svgRef} className={`de2-portrait${drag ? " is-dragging" : ""}`} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" role="img" aria-label={label} onPointerDown={(event) => { setDrag({ kind: "pan", x: event.clientX, y: event.clientY, offset }); event.currentTarget.setPointerCapture(event.pointerId); }} onPointerMove={(event) => { const point = eventPoint(event); setInspector(point); if (drag?.kind === "point") onStartChange?.(drag.index, point); if (drag?.kind === "pan") { const rect = event.currentTarget.getBoundingClientRect(); setOffset({ x: drag.offset.x - (event.clientX - drag.x) / rect.width * (bounds.xMax - bounds.xMin), y: drag.offset.y + (event.clientY - drag.y) / rect.height * (bounds.yMax - bounds.yMin) }); } }} onPointerUp={() => setDrag(null)} onPointerCancel={() => setDrag(null)}>
      <defs><marker id="de2-arrow" markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto"><path d="M0,0 L5,2.5 L0,5 Z" fill="#4b90f8" /></marker><clipPath id="de2-plot-clip"><rect x={pad} y={pad} width={width - 2 * pad} height={height - 2 * pad} /></clipPath></defs><rect width={width} height={height} fill="#fff" /><g stroke="#e8effa">{[-3,-2,-1,0,1,2,3].map((v) => <g key={v}><line x1={px(v)} x2={px(v)} y1={pad} y2={height-pad} /><line x1={pad} x2={width-pad} y1={py(v)} y2={py(v)} /></g>)}</g><g stroke="#344769" strokeWidth="1.4"><line x1={pad} x2={width-pad} y1={py(0)} y2={py(0)} /><line x1={px(0)} x2={px(0)} y1={pad} y2={height-pad} /></g><g clipPath="url(#de2-plot-clip)">{arrows}{nullX.map(([x1,y1,x2,y2], i) => <line key={`fx${i}`} x1={px(x1)} y1={py(y1)} x2={px(x2)} y2={py(y2)} stroke="#ff5b67" strokeWidth="2" />)}{nullY.map(([x1,y1,x2,y2], i) => <line key={`gy${i}`} x1={px(x1)} y1={py(y1)} x2={px(x2)} y2={py(y2)} stroke="#0085c7" strokeWidth="2" />)}{showSeparatrices && separatrices.map((points, i) => <path key={`sep${i}`} d={pathData(points)} fill="none" stroke="#8b4bea" strokeWidth="2" strokeDasharray="6 5" />)}{showTrajectories && backgroundPaths.map((points, i) => <path key={`background${i}`} d={pathData(points)} fill="none" stroke={["#0ba877", "#a04bea", "#ff9c20"][i % 3]} strokeWidth="1.8" opacity=".9" />)}{showTrajectories && paths.map((points, i) => <path key={`trajectory${i}`} d={pathData(points)} fill="none" stroke={["#185efa", "#a04bea", "#00a682", "#ff8a2a"][i % 4]} strokeWidth="2.3" />)}{showEquilibrium && <circle cx={px(equilibrium.x)} cy={py(equilibrium.y)} r="6" fill="#122447" stroke="#fff" strokeWidth="2" />}{starts.map((point, index) => <g key={index} className="de1-draggable-point" onPointerDown={(event) => { event.stopPropagation(); setDrag({ kind: "point", index }); event.currentTarget.ownerSVGElement?.setPointerCapture(event.pointerId); }}><circle cx={px(point.x)} cy={py(point.y)} r="15" fill="transparent" /><circle cx={px(point.x)} cy={py(point.y)} r="7" fill={["#1769f5", "#a04bea", "#00a682", "#ff8a2a"][index % 4]} stroke="#fff" strokeWidth="2" /></g>)}</g>
    </svg><div className="de2-plot-label"><span>Drag colored points to change trajectories. Drag empty space to pan.</span><strong>{inspector && inspectorField ? `(${inspector.x.toFixed(2)}, ${inspector.y.toFixed(2)}) → (${inspectorField[0].toFixed(2)}, ${inspectorField[1].toFixed(2)})` : "Hover to inspect x′, y′"}</strong></div></div>;
}
