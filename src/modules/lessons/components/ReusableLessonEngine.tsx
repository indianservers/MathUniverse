import { useEffect, useMemo, useState, type PointerEvent, type ReactNode } from "react";
import SliderControl, { SliderGroup } from "../../../components/ui/SliderControl";
import { applyGraphParameters, samplePlotLayer, sampleTable, type GraphViewport, type PlotItem } from "../../../components/workspace/panels/graphPanelUtils";
import { distanceBetween, line, midpoint, polygonPerimeter, relationBetween, type KernelPoint } from "../../../workspace/geometry2dKernel";
import { solidMetrics, summarizeSurfaceSamples } from "../../../space3d/spaceStudio";
import { cone3, cylinder3, object3Measurement, point3, sphere3 } from "../../../workspace/geometry3dKernel";
import {
  symbolicDerivative,
  symbolicExpand,
  symbolicFactor,
  symbolicIntegral,
  symbolicPartialFractions,
  symbolicSimplify,
  symbolicSolve,
  symbolicSubstitute,
  type SymbolicResult,
} from "../../../utils/symbolic";
import { createLessonInteractionEvent } from "../engine/lessonInteraction";
import type { LessonInteractionEvent } from "../types";

export type ReusableLessonEngineKind = "graph-2d" | "graph-3d" | "geometry-2d" | "geometry-3d" | "cas";

export type ReusableLessonEngineParams = {
  title: string;
  expression?: string;
  parentExpression?: string;
  graphKind?: PlotItem["kind"];
  graphViewport?: Omit<GraphViewport, "width" | "height">;
  parameterA?: { label: string; value: number; min: number; max: number; step: number };
  parameterB?: { label: string; value: number; min: number; max: number; step: number };
  visualLabels?: string[];
  insight?: string;
  check?: string;
  solid?: "box" | "sphere" | "cylinder" | "cone" | "pyramid" | "triangular-prism" | "tetrahedron" | "regular-polyhedra" | "hemisphere" | "frustum" | "surface-of-revolution" | "extrusion" | "cross-section" | "volume" | "surface-area" | "x-ray" | "camera" | "orthographic" | "ar-placement";
  surfaceExpression?: string;
  casCommand?: string;
  casExpression?: string;
  casExecute?: (expression: string) => SymbolicResult;
  tools?: string[];
  isTransform?: boolean;
  geometryScene?: "segment" | "angle-between-lines" | "parallel-lines" | "perpendicular-lines" | "point-line-distance" | "polygon-area" | "angle" | "circle";
};

export type ReusableLessonEngineProps = {
  engine: ReusableLessonEngineKind;
  params: ReusableLessonEngineParams;
  resetToken: number;
  onInteraction: (event?: LessonInteractionEvent) => void;
};

const graphViewport: GraphViewport = { xMin: -10, xMax: 10, yMin: -10, yMax: 10, width: 640, height: 360 };
const sx = (x: number) => 320 + x * 38;
const sy = (y: number) => 180 - y * 38;
const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));
const roundTo = (value: number, step: number) => Math.round(value / step) * step;
const readInitialNumberFromUrl = (name: string, fallback: number, min: number, max: number) => {
  if (typeof window === "undefined") return fallback;
  const value = Number(new URLSearchParams(window.location.search).get(name));
  return Number.isFinite(value) ? clamp(value, min, max) : fallback;
};

export function reusableEngineParamsFor(engine: ReusableLessonEngineKind, title: string): ReusableLessonEngineParams {
  if (engine === "graph-2d") return graph2DParamsFor(title);
  if (engine === "graph-3d") return graph3DParamsFor(title);
  if (engine === "geometry-2d") return geometry2DParamsFor(title);
  if (engine === "geometry-3d") return geometry3DParamsFor(title);
  return casParamsFor(title);
}

export default function ReusableLessonEngine({ engine, params, resetToken, onInteraction }: ReusableLessonEngineProps) {
  if (engine === "graph-2d") return <ReusableGraph2DEngine params={params} resetToken={resetToken} onInteraction={onInteraction} />;
  if (engine === "graph-3d") return <ReusableGraph3DEngine params={params} resetToken={resetToken} onInteraction={onInteraction} />;
  if (engine === "geometry-2d") return <ReusableGeometry2DEngine params={params} resetToken={resetToken} onInteraction={onInteraction} />;
  if (engine === "geometry-3d") return <ReusableGeometry3DEngine params={params} resetToken={resetToken} onInteraction={onInteraction} />;
  return <ReusableCasEngine params={params} resetToken={resetToken} onInteraction={onInteraction} />;
}

function ReusableGraph2DEngine({ params, resetToken, onInteraction }: Omit<ReusableLessonEngineProps, "engine">) {
  const initialA = params.parameterA?.value ?? 2;
  const initialB = params.parameterB?.value ?? 0;
  const [a, setA] = useState(initialA);
  const [b, setB] = useState(initialB);
  useEffect(() => { setA(initialA); setB(initialB); }, [initialA, initialB, resetToken]);
  const expression = params.expression ?? "a*x+b";
  const parentExpression = params.parentExpression ?? "x";
  const graphKind = params.graphKind ?? "function";
  const viewport = useMemo<GraphViewport>(() => ({ ...(params.graphViewport ?? graphViewport), width: graphViewport.width, height: graphViewport.height }), [params.graphViewport]);
  const current = useMemo<PlotItem>(() => ({ id: "lesson-graph", expression, color: "#06b6d4", kind: graphKind, visible: true }), [expression, graphKind]);
  const parent = useMemo<PlotItem>(() => ({ id: "lesson-parent", expression: parentExpression, color: "#94a3b8", kind: graphKind, visible: true }), [graphKind, parentExpression]);
  const currentLayer = useMemo(() => samplePlotLayer(current, viewport, a, b), [a, b, current, viewport]);
  const parentLayer = useMemo(() => samplePlotLayer(parent, viewport, 1, 0), [parent, viewport]);
  const resolved = applyGraphParameters(expression, a, b);
  const table = useMemo(() => sampleTable(resolved, "f", -2, 2, 2).slice(0, 3), [resolved]);
  const update = (setter: (value: number) => void) => (value: number) => { setter(value); onInteraction(); };
  const updateGraphFromPointer = (event: PointerEvent<SVGSVGElement>) => {
    if (event.type === "pointermove" && event.buttons !== 1) return;
    if (event.type === "pointerdown") event.currentTarget.setPointerCapture?.(event.pointerId);
    const rect = event.currentTarget.getBoundingClientRect();
    const pointerX = clamp((event.clientX - rect.left) / rect.width, 0, 1);
    const pointerY = clamp((event.clientY - rect.top) / rect.height, 0, 1);
    const aMin = params.parameterA?.min ?? -5;
    const aMax = params.parameterA?.max ?? 5;
    const bMin = params.parameterB?.min ?? -5;
    const bMax = params.parameterB?.max ?? 5;
    const aStep = params.parameterA?.step ?? 0.25;
    const bStep = params.parameterB?.step ?? 0.25;
    setA(clamp(roundTo(aMin + pointerX * (aMax - aMin), aStep), aMin, aMax));
    setB(clamp(roundTo(bMax - pointerY * (bMax - bMin), bStep), bMin, bMax));
    onInteraction();
  };

  return (
    <div className="lesson-engine lesson-engine-2d-graph">
      <div className="lesson-engine-axis lesson-direct-surface" data-direct-interaction="true">
        <span className="lesson-direct-cue">Drag graph</span>
        <svg viewBox="0 0 640 360" className="h-[300px] w-full" role="img" aria-label={`Reusable 2D graph engine plotting ${resolved} for ${params.title}`} onPointerDown={updateGraphFromPointer} onPointerMove={updateGraphFromPointer}>
          <Grid2D viewport={viewport} />
          {parentLayer.paths.map((path, index) => <path key={`p${index}`} d={path} fill="none" stroke="#94a3b8" strokeWidth="2" strokeDasharray="8 6" />)}
          {parentLayer.cells.map((cell, index) => <rect key={`pc${index}`} {...cell} fill="#94a3b8" opacity=".12" />)}
          {currentLayer.cells.map((cell, index) => <rect key={`c${index}`} {...cell} fill="#06b6d4" opacity=".2" />)}
          {currentLayer.paths.map((path, index) => <path key={index} d={path} fill="none" stroke="#06b6d4" strokeWidth="4" strokeLinecap="round" />)}
          {params.visualLabels?.slice(0, 3).map((label, index) => <text key={label} x={28} y={40 + index * 24} fill={index ? "#334155" : "#0891b2"} fontSize="15" fontWeight="900">{label}</text>)}
        </svg>
      </div>
      <EngineControlPanel title="2D graph params" insight={params.insight} check={params.check}>
        <SliderControl density="compact" label={params.parameterA?.label ?? "a"} value={a} min={params.parameterA?.min ?? -5} max={params.parameterA?.max ?? 5} step={params.parameterA?.step ?? 0.25} onChange={update(setA)} />
        <SliderControl density="compact" label={params.parameterB?.label ?? "b"} value={b} min={params.parameterB?.min ?? -5} max={params.parameterB?.max ?? 5} step={params.parameterB?.step ?? 0.25} onChange={update(setB)} />
        <div className="grid grid-cols-3 gap-2">{table.map((row) => <MiniMetric key={row.x} label={`x=${row.x}`} value={String(row.y)} />)}</div>
        {currentLayer.error ? <p className="rounded-xl bg-amber-100 p-2 text-xs font-bold text-amber-900">{currentLayer.error}</p> : null}
      </EngineControlPanel>
    </div>
  );
}

function ReusableGraph3DEngine({ params, resetToken, onInteraction }: Omit<ReusableLessonEngineProps, "engine">) {
  const [range, setRange] = useState(3);
  const [slice, setSlice] = useState(0);
  const [orbit, setOrbit] = useState(25);
  useEffect(() => { setRange(3); setSlice(0); setOrbit(25); }, [resetToken]);
  const surface = useMemo(() => summarizeSurfaceSamples((x, y) => (params.surfaceExpression?.includes("x^2 - y^2") ? x * x - y * y : Math.sin(x) * Math.cos(y)), range, slice), [params.surfaceExpression, range, slice]);
  const graphDetails = graph3DDetails(params.title, range, slice);
  const update = (setter: (value: number) => void) => (value: number) => { setter(value); onInteraction(); };
  const updateSurfaceFromPointer = (event: PointerEvent<SVGSVGElement>) => {
    if (event.type === "pointermove" && event.buttons !== 1) return;
    if (event.type === "pointerdown") event.currentTarget.setPointerCapture?.(event.pointerId);
    const rect = event.currentTarget.getBoundingClientRect();
    const pointerX = clamp((event.clientX - rect.left) / rect.width, 0, 1);
    const pointerY = clamp((event.clientY - rect.top) / rect.height, 0, 1);
    setOrbit(roundTo(pointerX * 360, 5));
    setSlice(roundTo(3 - pointerY * 6, 0.25));
    onInteraction();
  };

  return (
    <div className="lesson-engine lesson-engine-3d-graph">
      <div className="lesson-engine-axis lesson-direct-surface is-dark" data-direct-interaction="true">
        <span className="lesson-direct-cue is-dark">Drag surface</span>
        <svg viewBox="0 0 640 360" className="h-[310px] w-full" role="img" aria-label={`${graphDetails.model} 3D graph workspace`} onPointerDown={updateSurfaceFromPointer} onPointerMove={updateSurfaceFromPointer}>
          <Axis3D orbit={orbit} />
          <SurfaceWireframe range={range} slice={slice} />
          <Graph3DOverlay model={graphDetails.model} slice={slice} range={range} />
          <text x="34" y="40" fill="#bae6fd" fontWeight="900">{params.surfaceExpression ?? "z = sin(x) cos(y)"}</text>
        </svg>
      </div>
      <EngineControlPanel title="3D graph params" insight={params.insight ?? "Two inputs x and y produce height z."} check={params.check ?? "Use slices and orbit before reading shape."}>
        <SliderControl density="compact" label="x/y range" value={range} min={1} max={8} step={0.25} onChange={update(setRange)} />
        <SliderControl density="compact" label="slice z" value={slice} min={-3} max={3} step={0.25} onChange={update(setSlice)} />
        <SliderControl density="compact" label="orbit" value={orbit} min={0} max={360} step={5} unit="degrees" onChange={update(setOrbit)} />
        <div className="grid grid-cols-2 gap-2">
          <MiniMetric label="z min" value={surface.min.toFixed(2)} />
          <MiniMetric label="z max" value={surface.max.toFixed(2)} />
        </div>
        <MiniMetric label="Model" value={graphDetails.model} />
        <MiniMetric label="Rule" value={graphDetails.rule} />
      </EngineControlPanel>
    </div>
  );
}

function ReusableGeometry2DEngine({ params, resetToken, onInteraction }: Omit<ReusableLessonEngineProps, "engine">) {
  const initialAx = readInitialNumberFromUrl("v_a_x", -3, -6, 6);
  const initialAy = readInitialNumberFromUrl("v_a_y", -1, -4, 4);
  const initialBx = readInitialNumberFromUrl("v_b_x", 3, -6, 6);
  const initialBy = readInitialNumberFromUrl("v_b_y", 2, -4, 4);
  const [ax, setAx] = useState(initialAx);
  const [ay, setAy] = useState(initialAy);
  const [bx, setBx] = useState(initialBx);
  const [by, setBy] = useState(initialBy);
  const [amount, setAmount] = useState(params.geometryScene === "angle-between-lines" || params.geometryScene === "angle" ? 55 : 2);
  useEffect(() => { setAx(initialAx); setAy(initialAy); setBx(initialBx); setBy(initialBy); setAmount(params.geometryScene === "angle-between-lines" || params.geometryScene === "angle" ? 55 : 2); }, [initialAx, initialAy, initialBx, initialBy, params.geometryScene, resetToken]);
  const a = useMemo(() => ({ x: ax, y: ay }), [ax, ay]);
  const b = useMemo(() => ({ x: bx, y: by }), [bx, by]);
  const isTransform = Boolean(params.isTransform);
  const transformed = transformPoint(params.title, b, amount);
  const mid = midpoint(a, b);
  const distance = distanceBetween(a, b);
  const relation = relationBetween(line(a, b), line(mid, { x: mid.x - (b.y - a.y), y: mid.y + (b.x - a.x) }));
  const polygon = [a, b, transformed];
  const scene = params.geometryScene ?? "segment";
  const angleMeasure = geometryAngleMeasure(scene, a, b, amount);
  const pointLineDistance = distancePointToLine(transformed, a, b);
  const update = (setter: (value: number) => void, controlId: string) => (value: number) => { setter(value); onInteraction(emitEngineEvent(controlId, value)); };
  const [activePoint, setActivePoint] = useState<"A" | "B">("B");
  const updatePointFromPointer = (event: PointerEvent<SVGSVGElement>) => {
    if (event.type === "pointermove" && event.buttons !== 1) return;
    if (event.type === "pointerdown") event.currentTarget.setPointerCapture?.(event.pointerId);
    const rect = event.currentTarget.getBoundingClientRect();
    const pointerX = ((event.clientX - rect.left) / rect.width) * 640;
    const pointerY = ((event.clientY - rect.top) / rect.height) * 360;
    const mathX = clamp(roundTo((pointerX - 320) / 38, 0.1), -6, 6);
    const mathY = clamp(roundTo((180 - pointerY) / 38, 0.1), -4, 4);
    const distanceToA = Math.hypot(pointerX - sx(a.x), pointerY - sy(a.y));
    const distanceToB = Math.hypot(pointerX - sx(b.x), pointerY - sy(b.y));
    const target = event.type === "pointerdown" ? (distanceToA < distanceToB ? "A" : "B") : activePoint;
    if (event.type === "pointerdown") setActivePoint(target);
    if (target === "A") {
      setAx(mathX);
      setAy(mathY);
    } else {
      setBx(mathX);
      setBy(mathY);
    }
    onInteraction();
  };

  return (
    <div className="lesson-engine lesson-engine-2d-geometry">
      <div className="lesson-engine-axis lesson-direct-surface" data-direct-interaction="true">
        <span className="lesson-direct-cue">Drag points</span>
        <svg viewBox="0 0 640 360" className="h-[310px] w-full" role="img" aria-label="Reusable 2D geometry engine construction area" onPointerDown={updatePointFromPointer} onPointerMove={updatePointFromPointer}>
          <Grid2D />
          <Geometry2DScene scene={scene} a={a} b={b} transformed={transformed} amount={amount} isTransform={isTransform} />
        </svg>
      </div>
      <EngineControlPanel title="2D geometry params" insight={params.insight} check={params.check}>
        <ToolChips tools={params.tools ?? ["Point", "Segment", "Measure"]} />
        <SliderControl density="compact" label="A x" value={ax} min={-6} max={6} step={0.5} onChange={update(setAx, "geometry-a-x")} />
        <SliderControl density="compact" label="A y" value={ay} min={-4} max={4} step={0.5} onChange={update(setAy, "geometry-a-y")} />
        <SliderControl density="compact" label="B x" value={bx} min={-6} max={6} step={0.5} onChange={update(setBx, "geometry-b-x")} />
        <SliderControl density="compact" label="B y" value={by} min={-4} max={4} step={0.5} onChange={update(setBy, "geometry-b-y")} />
        {isTransform || scene === "angle-between-lines" || scene === "angle" ? <SliderControl density="compact" label={scene === "angle-between-lines" || scene === "angle" ? "Angle offset" : "Transform"} value={amount} min={scene === "angle-between-lines" || scene === "angle" ? 5 : -4} max={scene === "angle-between-lines" || scene === "angle" ? 175 : 4} step={scene === "angle-between-lines" || scene === "angle" ? 1 : 0.5} unit={scene === "angle-between-lines" || scene === "angle" ? "degrees" : undefined} onChange={update(setAmount, "geometry-transform")} /> : null}
        <div className="grid grid-cols-2 gap-2">
          <MiniMetric label="Distance" value={distance.toFixed(2)} />
          <MiniMetric label="Angle" value={angleMeasure ? `${angleMeasure.toFixed(1)} deg` : relation.relation} />
          <MiniMetric label="Midpoint" value={`${mid.x.toFixed(1)}, ${mid.y.toFixed(1)}`} />
          <MiniMetric label={scene === "point-line-distance" ? "Point-line" : "Perimeter"} value={scene === "point-line-distance" ? pointLineDistance.toFixed(2) : polygonPerimeter(polygon).toFixed(1)} />
        </div>
      </EngineControlPanel>
    </div>
  );
}

function Geometry2DScene({ scene, a, b, transformed, amount, isTransform }: { scene: NonNullable<ReusableLessonEngineParams["geometryScene"]>; a: KernelPoint; b: KernelPoint; transformed: KernelPoint; amount: number; isTransform: boolean }) {
  const mid = midpoint(a, b);
  const baseVector = normaliseVector({ x: b.x - a.x, y: b.y - a.y });
  const secondVector = scene === "perpendicular-lines"
    ? { x: -baseVector.y, y: baseVector.x }
    : scene === "parallel-lines"
      ? baseVector
      : rotateVector(baseVector, ((scene === "angle-between-lines" || scene === "angle" ? amount : 55) * Math.PI) / 180);
  const secondLineShift = scene === "parallel-lines" ? { x: -baseVector.y * 1.4, y: baseVector.x * 1.4 } : { x: 0, y: 0 };
  const secondOrigin = { x: mid.x + secondLineShift.x, y: mid.y + secondLineShift.y };
  const perpendicularFoot = projectPointToLine(transformed, a, b);
  if (scene === "circle") {
    const radius = Math.max(0.4, distanceBetween(a, b));
    return (
      <>
        <circle cx={sx(a.x)} cy={sy(a.y)} r={radius * 38} fill="#06b6d4" opacity=".12" stroke="#06b6d4" strokeWidth="4" />
        <line x1={sx(a.x)} y1={sy(a.y)} x2={sx(b.x)} y2={sy(b.y)} stroke="#f59e0b" strokeWidth="3" strokeDasharray="7 5" />
        <PointMark point={a} label="C" />
        <PointMark point={b} label="P" />
        <text x={sx(mid.x) + 10} y={sy(mid.y) - 12} fill="#b45309" fontWeight="900">radius</text>
      </>
    );
  }
  if (scene === "polygon-area") {
    const c = { x: a.x + 1.2, y: b.y + 0.6 };
    return (
      <>
        <polygon points={[a, b, c].map((p) => `${sx(p.x)},${sy(p.y)}`).join(" ")} fill="#06b6d4" opacity=".18" stroke="#06b6d4" strokeWidth="4" />
        <line x1={sx(c.x)} y1={sy(c.y)} x2={sx(c.x)} y2={sy(a.y)} stroke="#f59e0b" strokeDasharray="7 5" strokeWidth="3" />
        <PointMark point={a} label="A" />
        <PointMark point={b} label="B" />
        <PointMark point={c} label="C" accent />
        <text x={sx(c.x) + 10} y={sy((c.y + a.y) / 2)} fill="#b45309" fontWeight="900">height</text>
      </>
    );
  }
  if (scene === "point-line-distance") {
    return (
      <>
        <InfiniteLine origin={mid} vector={baseVector} label="line l" />
        <line x1={sx(transformed.x)} y1={sy(transformed.y)} x2={sx(perpendicularFoot.x)} y2={sy(perpendicularFoot.y)} stroke="#f59e0b" strokeWidth="4" strokeDasharray="7 5" />
        <RightAngleMark origin={perpendicularFoot} u={baseVector} v={{ x: transformed.x - perpendicularFoot.x, y: transformed.y - perpendicularFoot.y }} />
        <PointMark point={transformed} label="P" accent />
        <PointMark point={perpendicularFoot} label="F" />
        <text x={sx((transformed.x + perpendicularFoot.x) / 2) + 10} y={sy((transformed.y + perpendicularFoot.y) / 2)} fill="#b45309" fontWeight="900">shortest distance</text>
      </>
    );
  }
  if (scene === "angle-between-lines" || scene === "perpendicular-lines" || scene === "parallel-lines" || scene === "angle") {
    return (
      <>
        <InfiniteLine origin={mid} vector={baseVector} label={scene === "parallel-lines" ? "line l" : "line 1"} />
        <InfiniteLine origin={secondOrigin} vector={secondVector} label={scene === "parallel-lines" ? "line m" : "line 2"} accent />
        {scene !== "parallel-lines" ? <AngleArc origin={mid} first={baseVector} second={secondVector} /> : null}
        {scene === "perpendicular-lines" ? <RightAngleMark origin={mid} u={baseVector} v={secondVector} /> : null}
        <PointMark point={a} label="A" />
        <PointMark point={b} label="B" />
        <text x={sx(mid.x) + 18} y={sy(mid.y) - 18} fill="#7c3aed" fontWeight="900">{scene === "parallel-lines" ? "same direction" : `angle ${geometryAngleMeasure(scene, a, b, amount).toFixed(1)} deg`}</text>
      </>
    );
  }
  return (
    <>
      {isTransform ? <><polygon points={[a, b, transformed].map((p) => `${sx(p.x)},${sy(p.y)}`).join(" ")} fill="#06b6d4" opacity=".16" stroke="#06b6d4" strokeWidth="3" /><line x1={sx(b.x)} y1={sy(b.y)} x2={sx(transformed.x)} y2={sy(transformed.y)} stroke="#f59e0b" strokeDasharray="7 5" strokeWidth="2" /></> : <><line x1={sx(a.x)} y1={sy(a.y)} x2={sx(b.x)} y2={sy(b.y)} stroke="#06b6d4" strokeWidth="4" /><circle cx={sx(mid.x)} cy={sy(mid.y)} r="6" fill="#f59e0b" /></>}
      <PointMark point={a} label="A" />
      <PointMark point={b} label="B" />
      {isTransform ? <PointMark point={transformed} label="B'" accent /> : null}
    </>
  );
}

function InfiniteLine({ origin, vector, label, accent = false }: { origin: KernelPoint; vector: KernelPoint; label: string; accent?: boolean }) {
  const span = 11;
  const p1 = { x: origin.x - vector.x * span, y: origin.y - vector.y * span };
  const p2 = { x: origin.x + vector.x * span, y: origin.y + vector.y * span };
  return (
    <g>
      <line x1={sx(p1.x)} y1={sy(p1.y)} x2={sx(p2.x)} y2={sy(p2.y)} stroke={accent ? "#7c3aed" : "#06b6d4"} strokeWidth="4" strokeLinecap="round" />
      <text x={sx(p2.x) - 72} y={sy(p2.y) - 10} fill={accent ? "#6d28d9" : "#0e7490"} fontWeight="900">{label}</text>
    </g>
  );
}

function AngleArc({ origin, first, second }: { origin: KernelPoint; first: KernelPoint; second: KernelPoint }) {
  const radius = 54;
  const start = { x: sx(origin.x) + first.x * radius, y: sy(origin.y) - first.y * radius };
  const end = { x: sx(origin.x) + second.x * radius, y: sy(origin.y) - second.y * radius };
  const cross = first.x * second.y - first.y * second.x;
  return <path d={`M ${start.x} ${start.y} A ${radius} ${radius} 0 0 ${cross >= 0 ? 0 : 1} ${end.x} ${end.y}`} fill="none" stroke="#f59e0b" strokeWidth="5" strokeLinecap="round" />;
}

function RightAngleMark({ origin, u, v }: { origin: KernelPoint; u: KernelPoint; v: KernelPoint }) {
  const unitU = normaliseVector(u);
  const unitV = normaliseVector(v);
  const size = 0.45;
  const p1 = { x: origin.x + unitU.x * size, y: origin.y + unitU.y * size };
  const p2 = { x: p1.x + unitV.x * size, y: p1.y + unitV.y * size };
  const p3 = { x: origin.x + unitV.x * size, y: origin.y + unitV.y * size };
  return <polyline points={[p1, p2, p3].map((p) => `${sx(p.x)},${sy(p.y)}`).join(" ")} fill="none" stroke="#f59e0b" strokeWidth="3" />;
}

function geometryAngleMeasure(scene: NonNullable<ReusableLessonEngineParams["geometryScene"]>, a: KernelPoint, b: KernelPoint, amount: number) {
  if (scene === "parallel-lines") return 0;
  if (scene === "perpendicular-lines") return 90;
  if (scene === "angle-between-lines" || scene === "angle") return Math.min(amount, 180 - amount);
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  return Math.abs((Math.atan2(dy, dx) * 180) / Math.PI);
}

function normaliseVector(vector: KernelPoint) {
  const length = Math.hypot(vector.x, vector.y) || 1;
  return { x: vector.x / length, y: vector.y / length };
}

function rotateVector(vector: KernelPoint, radians: number) {
  return { x: vector.x * Math.cos(radians) - vector.y * Math.sin(radians), y: vector.x * Math.sin(radians) + vector.y * Math.cos(radians) };
}

function projectPointToLine(point: KernelPoint, a: KernelPoint, b: KernelPoint) {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const denominator = dx * dx + dy * dy || 1;
  const t = ((point.x - a.x) * dx + (point.y - a.y) * dy) / denominator;
  return { x: a.x + t * dx, y: a.y + t * dy };
}

function distancePointToLine(point: KernelPoint, a: KernelPoint, b: KernelPoint) {
  return distanceBetween(point, projectPointToLine(point, a, b));
}

function ReusableGeometry3DEngine({ params, resetToken, onInteraction }: Omit<ReusableLessonEngineProps, "engine">) {
  const [size, setSize] = useState(4);
  const [height, setHeight] = useState(5);
  const [orbit, setOrbit] = useState(25);
  useEffect(() => { setSize(4); setHeight(5); setOrbit(25); }, [resetToken]);
  const solid = params.solid ?? "box";
  const kernelObject = solid === "sphere" ? sphere3(point3(0, 0, 0), size / 2) : solid === "cylinder" ? cylinder3(point3(0, 0, 0), size / 2, height) : cone3(point3(0, 0, 0), size / 2, height);
  const kernelMetrics = object3Measurement(kernelObject);
  const genericMetrics = solidMetrics(solid, size);
  const solidDetails = solid3DDetails(solid, size, height);
  const tetrahedronBaseArea = (Math.sqrt(3) / 4) * size ** 2;
  const tetrahedronVolume = (tetrahedronBaseArea * height) / 3;
  const volume = solidDetails.volume ?? (solid === "tetrahedron" ? tetrahedronVolume : solid === "box" || solid === "pyramid" || solid === "triangular-prism" ? genericMetrics.volume : kernelMetrics.volume);
  const surfaceArea = solidDetails.surfaceArea ?? (solid === "box" || solid === "tetrahedron" ? genericMetrics.surfaceArea : kernelMetrics.surfaceArea);
  const update = (setter: (value: number) => void) => (value: number) => { setter(value); onInteraction(); };
  const updateSolidFromPointer = (event: PointerEvent<SVGSVGElement>) => {
    if (event.type === "pointermove" && event.buttons !== 1) return;
    if (event.type === "pointerdown") event.currentTarget.setPointerCapture?.(event.pointerId);
    const rect = event.currentTarget.getBoundingClientRect();
    const pointerX = clamp((event.clientX - rect.left) / rect.width, 0, 1);
    const pointerY = clamp((event.clientY - rect.top) / rect.height, 0, 1);
    setOrbit(roundTo(pointerX * 360, 5));
    setSize(clamp(roundTo(8 - pointerY * 7, 0.25), 1, 8));
    onInteraction();
  };

  return (
    <div className="lesson-engine lesson-engine-3d-geometry">
      <div className="lesson-engine-axis lesson-direct-surface is-dark" data-direct-interaction="true">
        <span className="lesson-direct-cue is-dark">Drag solid</span>
        <svg viewBox="0 0 640 360" className="h-[310px] w-full" role="img" aria-label={`${solid} spatial solid workspace`} onPointerDown={updateSolidFromPointer} onPointerMove={updateSolidFromPointer}>
          <Axis3D orbit={orbit} />
          <Solid3D kind={solid} size={size} height={height} />
        </svg>
      </div>
      <EngineControlPanel title="Solid params" insight={params.insight} check={params.check}>
        <SliderControl density="compact" label="size" value={size} min={1} max={8} step={0.25} onChange={update(setSize)} />
        <SliderControl density="compact" label="height" value={height} min={1} max={10} step={0.25} onChange={update(setHeight)} />
        <SliderControl density="compact" label="orbit" value={orbit} min={0} max={360} step={5} unit="degrees" onChange={update(setOrbit)} />
        <MiniMetric label="Model" value={solidDetails.model} />
        <MiniMetric label="Formula" value={solidDetails.formula} />
        <div className="grid grid-cols-2 gap-2">
          <MiniMetric label="Volume" value={volume.toFixed(2)} />
          <MiniMetric label="Surface" value={surfaceArea.toFixed(2)} />
        </div>
      </EngineControlPanel>
    </div>
  );
}

function ReusableCasEngine({ params, resetToken, onInteraction }: Omit<ReusableLessonEngineProps, "engine">) {
  const execute = params.casExecute ?? symbolicSimplify;
  const [expression, setExpression] = useState(params.casExpression ?? "2*x+3*x-x+4-2");
  const [step, setStep] = useState(0);
  useEffect(() => { setExpression(params.casExpression ?? "2*x+3*x-x+4-2"); setStep(0); }, [params.casExpression, resetToken]);
  const output = useMemo(() => {
    try {
      return execute(expression);
    } catch (error) {
      return { result: "Input needs adjustment", detail: error instanceof Error ? error.message : "CAS error", steps: [] } as SymbolicResult;
    }
  }, [execute, expression]);

  return (
    <div className="lesson-engine lesson-engine-cas">
      <div className="lesson-engine-axis is-cas">
        <label className="text-[10px] font-black uppercase tracking-wide text-cyan-300">
          {params.casCommand ?? "Simplify"}
          <input value={expression} onChange={(event) => { setExpression(event.target.value); setStep(0); onInteraction(); }} className="mt-2 min-h-12 w-full rounded-xl border border-white/15 bg-white/10 px-3 font-mono text-sm text-white outline-none focus:border-cyan-400" aria-label="Reusable CAS expression" />
        </label>
        <div className="mt-4 rounded-xl bg-white/10 p-4">
          <span className="text-[10px] font-black uppercase text-emerald-300">Exact result</span>
          <output className="mt-2 block break-words font-mono text-lg font-black">{output.result}</output>
        </div>
      </div>
      <EngineControlPanel title="CAS params" insight={params.insight} check={params.check}>
        <div className="min-h-36 rounded-xl bg-slate-100 p-3 dark:bg-white/10">
          <span className="text-[10px] font-black uppercase text-cyan-600">Step {Math.min(step + 1, Math.max(1, output.steps.length))}</span>
          <p className="mt-2 text-sm leading-6">{output.steps[step] ?? output.detail}</p>
        </div>
        <button type="button" className="action-secondary w-full justify-center" onClick={() => { setStep((value) => Math.min(value + 1, Math.max(0, output.steps.length - 1))); onInteraction(); }}>Next symbolic step</button>
        {output.restrictions?.length ? <p className="rounded-xl bg-amber-100 p-2 text-xs font-bold text-amber-900">Domain: {output.restrictions.join(", ")}</p> : null}
      </EngineControlPanel>
    </div>
  );
}

function EngineControlPanel({ title, insight, check, children }: { title: string; insight?: string; check?: string; children: ReactNode }) {
  return (
    <div className="lesson-engine-controls">
      <SliderGroup title={title}>{children}</SliderGroup>
      <div className="rounded-xl bg-slate-100 p-3 text-sm font-semibold text-slate-700 dark:bg-white/10 dark:text-slate-100">
        <p>{insight ?? "Change one parameter and observe the linked output."}</p>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-300">{check ?? "Use the displayed measurements to justify your answer."}</p>
      </div>
    </div>
  );
}

function graph2DParamsFor(title: string): ReusableLessonEngineParams {
  const name = title.toLowerCase();
  const make = (expression: string, parentExpression: string, insight: string, check: string, graphKind: PlotItem["kind"] = "function") => ({ title, expression, parentExpression, graphKind, insight, check });
  if (name.includes("domain and range")) return make("sqrt(x)+b", "sqrt(x)", "Domain starts where the square-root input is valid.", "Range is read from y-values, not x-values.");
  if (name.includes("linear functions")) return make("a*x+b", "x", "Linear functions have equal x-steps make equal y-changes.", "Slope is constant across the whole line.");
  if (name.includes("quadratic") || name.includes("parabola")) return make("a*x^2+b", "x^2", "A quadratic graph turns at a vertex.", "Track the vertex as parameters move.");
  if (name.includes("cubic functions")) return make("a*x^3+b", "x^3", "A basic cubic shows origin symmetry when shifts are zero.", "Opposite inputs create opposite outputs.");
  if (name.includes("higher-degree")) return make("a*x^4+b", "x^4", "Polynomial degree limits roots and controls end behavior.", "Use turning points and roots together.");
  if (name.includes("reciprocal functions")) return make("a/x+b", "1/x", "For reciprocal functions, x=0 is excluded.", "The branches approach the axes as asymptotes.");
  if (name.includes("rational functions")) return make("a/(x-1)+b", "1/(x-1)", "For rational functions, denominator zeros are excluded.", "Find vertical asymptotes before plotting.");
  if (name.includes("square-root functions")) return make("a*sqrt(x)+b", "sqrt(x)", "For square-root functions, real inputs need x >= 0.", "The graph begins at its endpoint.");
  if (name.includes("cube-root functions")) return make("a*x^(1/3)+b", "x^(1/3)", "For cube-root functions, negative real inputs are allowed.", "The graph crosses through the center.");
  if (name.includes("absolute-value functions")) return make("a*abs(x)+b", "abs(x)", "Absolute-value distance makes a V-shape.", "The vertex is the turning point.");
  if (name.includes("exponential")) return make("a*2^x+b", "2^x", "For exponential graphs, equal x-steps multiply outputs.", "Compare ratios, not differences.");
  if (name.includes("logarith")) return make("a*ln(x)+b", "ln(x)", "For logarithmic graphs, inputs must be positive.", "Check the vertical asymptote.");
  if (name.includes("trig") || name.includes("sine") || name.includes("cosine")) return make("a*sin(x)+b", "sin(x)", "The graph repeats with a period.", "Check angle units before reading values.");
  if (name.includes("hyperbolic")) return make("a*(exp(x)-exp(-x))/2+b", "(exp(x)-exp(-x))/2", "Hyperbolic functions are not periodic like cosine.", "Compare growth against circular trigonometry.");
  if (name.includes("non-periodic")) return make("a*x^2*sin(x)+b", "x^2*sin(x)", "This graph is not periodic like cosine.", "Similar waves can still grow or shrink.");
  if (name.includes("floor")) return make("floor(a*x)+b", "floor(x)", "Floor outputs step down to integers.", "Watch the closed and open step ends.");
  if (name.includes("ceiling")) return make("ceil(a*x)+b", "ceil(x)", "Ceiling outputs step up to integers.", "The next integer is reached immediately after a boundary.");
  if (name.includes("sign function")) return make("sign(a*x+b)", "sign(x)", "The sign function outputs are -1, 0, or 1.", "Only the sign of the input matters.");
  if (name.includes("piecewise")) return make("if(x<0,a*x,b*x+1)", "if(x<0,-x,x+1)", "For piecewise functions, choose only the rule whose condition is true.", "Check the boundary condition carefully.", "piecewise");
  if (name.includes("composition") || name.includes("composite")) return make("a*(x^2)+b", "x^2", "In composition, the inner output becomes the outer input.", "Work from inside to outside.");
  if (name.includes("inverse functions")) return make("(x-b)/a", "x", "Inverse functions make inputs and outputs reverse.", "Reflecting across y=x is the visual check.");
  if (name.includes("even and odd")) return make("a*x^2+b", "x^2", "Even functions satisfy f(-x)=f(x).", "Odd functions have origin symmetry instead.");
  if (name.includes("periodic functions")) return make("a*sin(x)+b", "sin(x)", "A periodic function repeats after a fixed period.", "Measure the horizontal repeat distance.");
  if (name.includes("recursive functions")) return make("a^x+b", "2^x", "A recursive rule depends on an earlier value.", "Each term is built from a previous term.");
  if ((name.includes("vertical") && name.includes("translation")) || name.includes("vertical shifts")) return make("x^2+b", "x^2", "An outside addition moves the graph up or down.", "Every y-value changes by the same amount.");
  if ((name.includes("horizontal") && name.includes("translation")) || name.includes("horizontal shifts")) return make("(x-b)^2", "x^2", "An inside subtraction moves the graph left or right.", "Horizontal changes act opposite the sign.");
  if ((name.includes("vertical") && (name.includes("stretch") || name.includes("compression"))) || name.includes("vertical stretches")) return make("a*x^2", "x^2", "outside multiplication changes height.", "Distances from the x-axis scale.");
  if ((name.includes("horizontal") && (name.includes("stretch") || name.includes("compression"))) || name.includes("horizontal stretches")) return make("(a*x)^2", "x^2", "inside multiplication changes width.", "Horizontal distances scale inversely.");
  if ((name.includes("reflection") && name.includes("x-axis")) || name.includes("reflections over x")) return make("-a*x^2+b", "x^2", "reflection over the x-axis changes y to -y.", "Up becomes down.");
  if ((name.includes("reflection") && name.includes("y-axis")) || name.includes("reflections over y")) return make("a*(-x)^3+b", "x^3", "reflection over the y-axis changes x to -x.", "Left and right swap.");
  if (name.includes("combined transformations")) return make("a*(x-b)^2", "x^2", "For combined transformations, inside changes affect x.", "Track one transformation at a time.");
  if (name.includes("order of transformations") || name.includes("transformation order")) return make("a*(x-b)^2+1", "x^2", "Order matters because later transformations act on earlier ones.", "Write the sequence before graphing.");
  if (name.includes("parameterised functions") || name.includes("parameterized functions") || name.includes("parameter explorer") || name.includes("dynamic parameters")) return make("a*sin(x)+b", "sin(x)", "For parameterised functions, sliders change the graph family.", "Name what each parameter controls.");
  if (name.includes("parent functions") || name.includes("parent-function")) return make("a*x^2+b", "x^2", "A parent function is the simplest rule shows the base shape.", "Transformations start from this simplest graph.");
  if (name.includes("function families") || name.includes("graph matching")) return make("a*x^2+b", "x^2", "Function families share shape plus more than one point of variation.", "Compare the common structure and the changing parameter.");
  if (name.includes("circle") || name.includes("implicit")) return make("x^2+y^2=a^2", "x^2+y^2=9", "Implicit graphs can relate x and y without y=f(x).", "A circle fails the vertical-line test.", "implicit");
  if (name.includes("polar")) return make("r=a*sin(3*theta), theta=0..2*pi", "r=sin(3*theta), theta=0..2*pi", "Polar graphs use angle and radius.", "The angle controls direction.", "polar");
  if (name.includes("parametric")) return make("x=a*cos(t), y=a*sin(t), t=0..2*pi", "x=cos(t), y=sin(t), t=0..2*pi", "A parameter traces both coordinates together.", "The parameter is not a coordinate.", "parametric");
  return make("a*x+b", "x", "Formula, curve, and table update together.", "Use the table to check one point.");
}

function graph3DParamsFor(title: string): ReusableLessonEngineParams {
  const name = title.toLowerCase();
  const snippet = geometry3DGuidanceFor(title);
  if (name.includes("saddle") || name.includes("quadric")) return { title, surfaceExpression: "z = x^2 - y^2", insight: `${snippet}: a saddle curves up in one direction and down in another.`, check: "Rotate before deciding the curvature." };
  if (name.includes("sphere")) return { title, surfaceExpression: "z = sqrt(9 - x^2 - y^2)", insight: `${snippet}: a hemisphere is a height surface over a disk.`, check: "The domain is a circular disk." };
  if (name.includes("space curve")) return { title, surfaceExpression: "r(t)=<cos t, sin t, t/4>", insight: `${snippet}: a parameter moves a point through x, y, and z together.`, check: "The tangent vector follows the direction of motion." };
  if (name.includes("cylindrical coordinates")) return { title, surfaceExpression: "(r, theta, z) to (x, y, z)", insight: `${snippet}: radius, azimuth and height locate the same point.`, check: "Convert with x = r cos theta and y = r sin theta." };
  if (name.includes("spherical coordinates")) return { title, surfaceExpression: "(rho, theta, phi) to (x, y, z)", insight: `${snippet}: radius plus two angles locate a point on a globe.`, check: "Confirm which angle is measured from the z-axis." };
  if (name.includes("normal vector")) return { title, surfaceExpression: "n = r_u x r_v", insight: `${snippet}: the normal is perpendicular to both tangent directions.`, check: "Use dot products to verify perpendicularity." };
  if (name.includes("partial derivative")) return { title, surfaceExpression: "z = x^2 + y^2", insight: `${snippet}: hold one input fixed and read the directional slice rate.`, check: "Compare the x-slice and y-slice before naming the partial." };
  if (name.includes("tangent plane")) return { title, surfaceExpression: "z = sin(x) cos(y)", insight: `${snippet}: the plane matches the surface at one selected point.`, check: "Check both local slopes before trusting the plane." };
  if (name.includes("gradient")) return { title, surfaceExpression: "grad f = <f_x, f_y>", insight: `${snippet}: the gradient points toward steepest ascent.`, check: "The gradient is perpendicular to the contour." };
  if (name.includes("contour")) return { title, surfaceExpression: "f(x,y) = c", insight: `${snippet}: a horizontal slice becomes a contour curve.`, check: "Match the highlighted 3D slice to the 2D map." };
  if (name.includes("level surface")) return { title, surfaceExpression: "f(x,y,z) = c", insight: `${snippet}: an isovalue reveals every point with the same field value.`, check: "Changing c moves through nested surfaces." };
  return { title, surfaceExpression: "z = sin(x) cos(y)", insight: `${snippet}: two inputs x and y produce height z.`, check: "Use cross-sections to read shape." };
}

const geometry2DGuidance: Record<string, { snippet: string; tools?: string[]; isTransform?: boolean }> = {
  "cartesian plane": { snippet: "Cartesian rule", tools: ["Point", "Axes", "Coordinate"] },
  "plotting points": { snippet: "Plotting rule", tools: ["Point", "Axes", "Coordinate"] },
  "distance between points": { snippet: "Distance formula", tools: ["Point", "Segment", "Measure"] },
  "midpoint": { snippet: "Midpoint formula", tools: ["Point", "Segment", "Midpoint"] },
  "section formula": { snippet: "Section formula", tools: ["Point", "Ratio", "Measure"] },
  "gradient / slope": { snippet: "Slope formula", tools: ["Point", "Line", "Slope"] },
  "equation of a line": { snippet: "Line equation", tools: ["Point", "Line", "Equation"] },
  "parallel lines": { snippet: "Parallel test", tools: ["Line", "Slope", "Relation"] },
  "perpendicular lines": { snippet: "Perpendicular test", tools: ["Line", "Angle", "Relation"] },
  "angle between lines": { snippet: "Angle rule", tools: ["Line", "Angle", "Measure"] },
  "point-to-line distance": { snippet: "Shortest distance", tools: ["Point", "Line", "Perpendicular"] },
  "coordinate loci": { snippet: "Locus rule", tools: ["Point", "Trace", "Equation"], isTransform: true },
  "coordinate transformations": { snippet: "Transformation rule", tools: ["Point", "Transform", "Measure"], isTransform: true },
  "polar coordinates": { snippet: "Polar conversion", tools: ["Point", "Angle", "Radius"] },
  "parametric coordinates": { snippet: "Parametric rule", tools: ["Point", "Path", "Parameter"], isTransform: true },
  "barycentric coordinates": { snippet: "Barycentric rule", tools: ["Point", "Triangle", "Ratio"] },
  "free point": { snippet: "Free point", tools: ["Point", "Drag", "Measure"] },
  "point on object": { snippet: "Point on object", tools: ["Point", "Object", "Constraint"] },
  "intersection point": { snippet: "Intersection point", tools: ["Line", "Circle", "Intersect"] },
  "midpoint or centre": { snippet: "Midpoint or centre", tools: ["Point", "Segment", "Midpoint"] },
  "attach / detach point": { snippet: "Attach or detach", tools: ["Point", "Object", "Constraint"] },
  "line through two points": { snippet: "Line through two points", tools: ["Point", "Line", "Relation"] },
  "segment": { snippet: "Segment", tools: ["Point", "Segment", "Measure"] },
  "segment with given length": { snippet: "Fixed length segment", tools: ["Point", "Segment", "Length"] },
  "ray": { snippet: "Ray", tools: ["Point", "Ray", "Direction"] },
  "polyline": { snippet: "Polyline", tools: ["Point", "Polyline", "Measure"] },
  "perpendicular line": { snippet: "Perpendicular line", tools: ["Line", "Angle", "Relation"] },
  "parallel line": { snippet: "Parallel line", tools: ["Line", "Parallel", "Relation"] },
  "perpendicular bisector": { snippet: "Perpendicular bisector", tools: ["Segment", "Bisector", "Right angle"] },
  "angle bisector": { snippet: "Angle bisector", tools: ["Angle", "Bisector", "Measure"] },
  "tangent line": { snippet: "Tangent", tools: ["Point", "Circle", "Tangent"] },
  "best-fit line": { snippet: "Best-fit line", tools: ["Point", "Line", "Residual"] },
  "triangle constructor": { snippet: "Triangle constructor", tools: ["Point", "Triangle", "Measure"] },
  "regular polygon": { snippet: "Regular polygon", tools: ["Point", "Polygon", "Sides"] },
  "rigid polygon": { snippet: "Rigid polygon", tools: ["Point", "Polygon", "Measure"] },
  "general polygon": { snippet: "General polygon", tools: ["Point", "Polygon", "Measure"] },
  "circle: centre and point": { snippet: "Centre and point circle", tools: ["Point", "Circle", "Radius"] },
  "circle: centre and radius": { snippet: "Centre and radius circle", tools: ["Point", "Circle", "Radius"] },
  "circle through three points": { snippet: "Circle through three points", tools: ["Point", "Circle", "Intersect"] },
  "compass": { snippet: "Compass", tools: ["Point", "Circle", "Length"] },
  "semicircle": { snippet: "Semicircle", tools: ["Point", "Circle", "Arc"] },
  "circular arc": { snippet: "Circular arc", tools: ["Point", "Circle", "Arc"] },
  "circumcircular arc": { snippet: "Circumcircular arc", tools: ["Point", "Circle", "Arc"] },
  "circular sector": { snippet: "Circular sector", tools: ["Point", "Circle", "Area"] },
  "conic through five points": { snippet: "Conic through five points", tools: ["Point", "Conic", "Fit"] },
  "ellipse": { snippet: "Ellipse", tools: ["Point", "Conic", "Measure"] },
  "hyperbola": { snippet: "Hyperbola", tools: ["Point", "Conic", "Asymptote"] },
  "parabola": { snippet: "Parabola", tools: ["Point", "Conic", "Focus"] },
  "distance / length": { snippet: "Distance or length", tools: ["Point", "Segment", "Measure"] },
  "area": { snippet: "Area", tools: ["Point", "Polygon", "Area"] },
  "angle": { snippet: "Angle", tools: ["Point", "Angle", "Measure"] },
  "fixed angle": { snippet: "Fixed angle", tools: ["Point", "Angle", "Constraint"] },
  "relation checker": { snippet: "Relation checker", tools: ["Object", "Relation", "Measure"] },
  "construction steps": { snippet: "Construction steps", tools: ["Point", "Step", "Protocol"] },
  "translation by vector": { snippet: "Translation by vector", tools: ["Point", "Vector", "Translate"], isTransform: true },
  "reflection in line": { snippet: "Reflection in line", tools: ["Point", "Mirror", "Line"], isTransform: true },
  "reflection in point": { snippet: "Reflection in point", tools: ["Point", "Mirror", "Centre"], isTransform: true },
  "reflection in circle": { snippet: "Reflection in circle", tools: ["Point", "Circle", "Invert"], isTransform: true },
  "rotation around point": { snippet: "Rotation around point", tools: ["Point", "Rotate", "Angle"], isTransform: true },
  "dilation from point": { snippet: "Dilation from point", tools: ["Point", "Dilate", "Scale"], isTransform: true },
  "matrix transformation": { snippet: "Matrix transformation", tools: ["Point", "Matrix", "Transform"], isTransform: true },
  "composite transformations": { snippet: "Composite transformations", tools: ["Point", "Transform", "Order"], isTransform: true },
  "transformation mapping": { snippet: "Transformation mapping", tools: ["Point", "Map", "Image"], isTransform: true },
  "invariants": { snippet: "Invariants", tools: ["Point", "Measure", "Compare"], isTransform: true },
  "symmetry explorer": { snippet: "Symmetry explorer", tools: ["Point", "Mirror", "Compare"], isTransform: true },
  "locus generator": { snippet: "Locus generator", tools: ["Point", "Trace", "Path"], isTransform: true },
  "equidistant loci": { snippet: "Equidistant loci", tools: ["Point", "Distance", "Locus"], isTransform: true },
  "moving-linkage loci": { snippet: "Moving-linkage loci", tools: ["Point", "Linkage", "Trace"], isTransform: true },
  "envelope of lines": { snippet: "Envelope of lines", tools: ["Line", "Family", "Envelope"], isTransform: true },
  "dynamic trace": { snippet: "Dynamic trace", tools: ["Point", "Trace", "History"], isTransform: true },
  "conjecture testing": { snippet: "Conjecture testing", tools: ["Point", "Measure", "Verify"], isTransform: true },
  "exact proof": { snippet: "Exact proof", tools: ["Point", "Reason", "Proof"], isTransform: true },
  "collinearity test": { snippet: "Collinearity test", tools: ["Point", "Line", "Proof"] },
  "concurrency test": { snippet: "Concurrency test", tools: ["Line", "Intersect", "Proof"] },
  "concyclicity test": { snippet: "Concyclicity test", tools: ["Point", "Circle", "Proof"] },
};

function geometry2DParamsFor(title: string): ReusableLessonEngineParams {
  const name = title.toLowerCase();
  const specific = geometry2DGuidance[name];
  const tools = /circle|arc|tangent/i.test(name) ? ["Point", "Circle", "Measure"] : /polygon|triangle|quadrilateral/i.test(name) ? ["Point", "Polygon", "Measure"] : ["Point", "Segment", "Relation"];
  if (specific) {
    return {
      title,
      tools: specific.tools ?? tools,
      isTransform: specific.isTransform ?? /transform|reflect|rotat|translat|enlarg|dilat|loci|locus|symmetr/i.test(name),
      geometryScene: geometrySceneFor(name),
      insight: `${specific.snippet}: drag the construction and read the matching measurement.`,
      check: name.includes("proof") || name.includes("test") ? "Use exact relationships before accepting the visual evidence." : "The visible invariant should match the named rule.",
    };
  }
  return {
    title,
    tools,
    isTransform: /transform|reflect|rotat|translat|enlarg|dilat|loci|locus|symmetr/i.test(name),
    geometryScene: geometrySceneFor(name),
    insight: name.includes("parallel") ? "Parallel lines keep the same direction." : name.includes("perpendicular") ? "Perpendicular objects meet at 90 degrees." : "Use the construction and measurements together.",
    check: name.includes("area") ? "Area uses square units." : name.includes("midpoint") ? "Average x and y coordinates separately." : "Drag points and verify the measured invariant.",
  };
}

function geometrySceneFor(name: string): NonNullable<ReusableLessonEngineParams["geometryScene"]> {
  if (name.includes("angle between lines")) return "angle-between-lines";
  if (name.includes("parallel lines") || name === "parallel line") return "parallel-lines";
  if (name.includes("perpendicular lines") || name === "perpendicular line") return "perpendicular-lines";
  if (name.includes("point-to-line distance")) return "point-line-distance";
  if (name === "area" || name.includes("triangle constructor") || name.includes("polygon")) return "polygon-area";
  if (name === "angle" || name.includes("fixed angle") || name.includes("angle bisector")) return "angle";
  if (/circle|arc|sector|ellipse|hyperbola|parabola|conic|locus|loci/.test(name)) return "circle";
  return "segment";
}

function geometry3DParamsFor(title: string): ReusableLessonEngineParams {
  const name = title.toLowerCase();
  const solid = name.includes("regular polyhedra") || name.includes("euler") ? "regular-polyhedra" : name.includes("hemisphere") ? "hemisphere" : name.includes("frustum") ? "frustum" : name.includes("surface of revolution") ? "surface-of-revolution" : name.includes("extrusion") ? "extrusion" : name.includes("cross-section") ? "cross-section" : name === "volume" ? "volume" : name.includes("surface area") ? "surface-area" : name.includes("transparent") || name.includes("x-ray") ? "x-ray" : name.includes("camera") ? "camera" : name.includes("orthographic") ? "orthographic" : name.includes("ar placement") ? "ar-placement" : name.includes("sphere") ? "sphere" : name.includes("cone") ? "cone" : name.includes("cylinder") ? "cylinder" : name.includes("tetrahedron") ? "tetrahedron" : name.includes("pyramid") ? "pyramid" : name.includes("prism") ? "triangular-prism" : "box";
  const snippet = geometry3DGuidanceFor(title);
  return { title, solid, insight: `${snippet}: use x, y, and z axes with spatial measurements.`, check: "Volume uses cubic units; surface area uses square units." };
}

function geometry3DGuidanceFor(title: string) {
  const name = title.toLowerCase();
  const normalized = name.replace(/[–—]/g, "-");
  if (name.includes("coordinate system")) return "3D coordinate system";
  if (name.includes("3d points")) return "3D points";
  if (name.includes("distance in 3d")) return "Distance in 3D";
  if (name.includes("lines in 3d")) return "Lines in 3D";
  if (name === "planes") return "Planes";
  if (name.includes("parallel and perpendicular planes")) return "Parallel and perpendicular planes";
  if (normalized.includes("line-plane intersection")) return "Line-plane intersection";
  if (normalized.includes("plane-plane intersection")) return "Plane-plane intersection";
  if (name.includes("angle between lines")) return "Angle between lines";
  if (name.includes("angle between planes")) return "Angle between planes";
  if (name.includes("angle between line and plane")) return "Angle between line and plane";
  if (name.includes("point-to-plane distance")) return "Point-to-plane distance";
  if (name.includes("3d vectors")) return "3D vectors";
  if (name === "cube") return "Cube";
  if (name === "cuboid") return "Cuboid";
  if (name === "prism") return "Prism";
  if (name === "pyramid") return "Pyramid";
  if (name === "tetrahedron") return "Tetrahedron";
  if (name.includes("regular polyhedra")) return "Regular polyhedra";
  if (name === "cylinder") return "Cylinder";
  if (name === "cone") return "Cone";
  if (name === "sphere") return "Sphere";
  if (name === "hemisphere") return "Hemisphere";
  if (name === "frustum") return "Frustum";
  if (name.includes("surface of revolution")) return "Surface of revolution";
  if (name === "extrusion") return "Extrusion";
  if (name.includes("cross-section")) return "Cross-sections";
  if (name === "volume") return "Volume";
  if (name.includes("surface area")) return "Surface area";
  if (name.includes("euler")) return "Euler's polyhedron formula";
  if (name.includes("transparent") || name.includes("x-ray")) return "Transparent / X-Ray Mode";
  if (name.includes("camera controls")) return "Camera controls";
  if (name.includes("orthographic")) return "Orthographic views";
  if (name.includes("ar placement")) return "AR placement";
  if (name.includes("z=f(x,y)")) return "Surface z=f(x,y)";
  if (name.includes("implicit surfaces")) return "Implicit surfaces";
  if (name.includes("parametric surfaces")) return "Parametric surfaces";
  if (name.includes("space curves")) return "Space curves";
  if (name.includes("quadric")) return "Quadric surfaces";
  if (name.includes("cylindrical coordinates")) return "Cylindrical coordinates";
  if (name.includes("spherical coordinates")) return "Spherical coordinates";
  if (name.includes("contour")) return "Contour curves";
  if (name.includes("level surfaces")) return "Level surfaces";
  if (name.includes("partial derivative")) return "Partial derivatives";
  if (name.includes("gradient vector")) return "Gradient vector";
  if (name.includes("tangent plane")) return "Tangent plane";
  if (name.includes("normal vector")) return "Normal vector";
  if (name.includes("double integrals")) return "Double integrals";
  if (name.includes("multivariable optimisation") || name.includes("multivariable optimization")) return "Multivariable optimisation";
  return title;
}

function casParamsFor(title: string): ReusableLessonEngineParams {
  const name = title.toLowerCase();
  if (name.includes("expand")) return { title, casCommand: "Expand", casExpression: "(x+2)*(x-3)", casExecute: symbolicExpand, insight: "Expand every bracket term.", check: "Multiply back mentally to check." };
  if (name.includes("factor")) return { title, casCommand: "Factor", casExpression: "x^2-x-6", casExecute: symbolicFactor, insight: "Factor rewrites as a product.", check: "Expand factors to verify." };
  if (name.includes("solve")) return { title, casCommand: "Solve", casExpression: "x^2-5*x+6=0", casExecute: (value) => symbolicSolve(value), insight: "Solutions make the equation true.", check: "Substitute into the original equation." };
  if (name.includes("partial")) return { title, casCommand: "Partial fractions", casExpression: "1/((x+1)*(x+2))", casExecute: symbolicPartialFractions, insight: "Factor denominators before splitting.", check: "Keep denominator restrictions." };
  if (name.includes("substitut")) return { title, casCommand: "Substitute x=3", casExpression: "x^2+2*x", casExecute: (value) => symbolicSubstitute(value, [{ name: "x", value: "3" }]), insight: "Replace every matching variable.", check: "Do not miss repeated variables." };
  if (name.includes("derivative") || name.includes("differentiat")) return { title, casCommand: "Differentiate", casExpression: "x^3+2*x", casExecute: symbolicDerivative, insight: "Differentiate with respect to the chosen variable.", check: "State the variable clearly." };
  if (name.includes("integral") || name.includes("integrat")) return { title, casCommand: "Integrate", casExpression: "3*x^2+2", casExecute: symbolicIntegral, insight: "Integrals accumulate or undo derivatives.", check: "Use +C when needed." };
  return { title, casCommand: "Simplify", casExpression: "2*x+3*x-x+4-2", casExecute: symbolicSimplify, insight: "Simplify to an equivalent cleaner expression.", check: "Keep exactness and restrictions." };
}

function transformPoint(title: string, point: KernelPoint, amount: number): KernelPoint {
  const name = title.toLowerCase();
  if (name.includes("reflect")) return { x: -point.x, y: point.y };
  if (name.includes("rotat")) {
    const angle = (amount * Math.PI) / 12;
    return { x: point.x * Math.cos(angle) - point.y * Math.sin(angle), y: point.x * Math.sin(angle) + point.y * Math.cos(angle) };
  }
  if (name.includes("enlarge") || name.includes("dilat") || name.includes("scale")) return { x: (point.x * amount) / 2, y: (point.y * amount) / 2 };
  return { x: point.x + amount, y: point.y + 1 };
}

function emitEngineEvent(controlId: string, value: number) {
  return createLessonInteractionEvent({ controlId, kind: "slider", before: null, after: value, affectedOutputs: ["lesson-engine"] });
}

function Grid2D({ viewport }: { viewport?: GraphViewport }) {
  const axisX = viewport ? ((0 - viewport.xMin) / (viewport.xMax - viewport.xMin || 1)) * viewport.width : 320;
  const axisY = viewport ? viewport.height - ((0 - viewport.yMin) / (viewport.yMax - viewport.yMin || 1)) * viewport.height : 180;
  return <g><rect width="640" height="360" fill="transparent" />{Array.from({ length: 21 }, (_, i) => <line key={`v${i}`} x1={i * 32} x2={i * 32} y1="0" y2="360" stroke="#cbd5e1" opacity=".3" />)}{Array.from({ length: 13 }, (_, i) => <line key={`h${i}`} x1="0" x2="640" y1={i * 30} y2={i * 30} stroke="#cbd5e1" opacity=".3" />)}<line x1="0" x2="640" y1={axisY} y2={axisY} stroke="#64748b" /><line x1={axisX} x2={axisX} y1="0" y2="360" stroke="#64748b" /></g>;
}

function Axis3D({ orbit }: { orbit: number }) {
  const angle = (orbit * Math.PI) / 180;
  const dx = Math.cos(angle) * 70;
  const dy = Math.sin(angle) * 30;
  return <g><line x1="320" y1="190" x2={320 + dx * 2.5} y2={190 + dy * 2.5} stroke="#ef4444" strokeWidth="3" /><line x1="320" y1="190" x2={320 - dx * 2.2} y2={190 + dy * 2.2} stroke="#22c55e" strokeWidth="3" /><line x1="320" y1="300" x2="320" y2="40" stroke="#38bdf8" strokeWidth="3" /><text x="575" y="330" fill="#f87171" fontWeight="800">x</text><text x="65" y="330" fill="#4ade80" fontWeight="800">y</text><text x="330" y="45" fill="#7dd3fc" fontWeight="800">z</text></g>;
}

function SurfaceWireframe({ range, slice }: { range: number; slice: number }) {
  const rows = Array.from({ length: 9 }, (_, row) => Array.from({ length: 17 }, (_, index) => {
    const x = (index - 8) / 2;
    const y = (row - 4) / 2;
    const z = Math.sin(x) * Math.cos(y);
    return `${320 + x * 28},${185 + y * 15 - z * 35}`;
  }).join(" "));
  return <g>{rows.map((points, index) => <polyline key={index} points={points} fill="none" stroke="#67e8f9" strokeWidth="2" />)}<ellipse cx="320" cy={185 - slice * 35} rx={Math.max(25, range * 22)} ry="30" fill="none" stroke="#f59e0b" strokeWidth="3" strokeDasharray="7 5" /></g>;
}

function Graph3DOverlay({ model, slice, range }: { model: string; slice: number; range: number }) {
  if (model === "space curve") return <g><path d="M210,260 C245,190 310,250 325,180 C340,110 415,165 430,80" fill="none" stroke="#f59e0b" strokeWidth="5" /><circle cx="325" cy="180" r="7" fill="#fef3c7" /><path d="M325,180 l42,-28" stroke="#22c55e" strokeWidth="4" markerEnd="url(#arrow)" /><text x="372" y="150" fill="#bbf7d0" fontWeight="900">tangent</text></g>;
  if (model === "cylindrical coordinates") return <g><ellipse cx="320" cy="245" rx={range * 22} ry={range * 8} fill="none" stroke="#38bdf8" strokeDasharray="6 4" strokeWidth="3" /><path d={`M320,245 L${320 + range * 32},${245 - slice * 15} V125`} stroke="#f59e0b" strokeWidth="4" /><text x="365" y="128" fill="#fde68a" fontWeight="900">r, theta, z</text></g>;
  if (model === "spherical coordinates") return <g><ellipse cx="320" cy="185" rx="82" ry="62" fill="#38bdf8" opacity=".18" stroke="#67e8f9" strokeWidth="3" /><path d="M320,185 L390,126" stroke="#f59e0b" strokeWidth="4" /><path d="M320,185 A60 60 0 0 1 379 175" fill="none" stroke="#a78bfa" strokeWidth="3" /><text x="397" y="126" fill="#fde68a" fontWeight="900">rho, theta, phi</text></g>;
  if (model === "normal vector") return <g><polygon points="230,235 410,220 485,270 300,290" fill="#14b8a6" opacity=".28" stroke="#67e8f9" strokeWidth="3" /><path d="M340,245 V105" stroke="#f59e0b" strokeWidth="5" /><text x="352" y="116" fill="#fde68a" fontWeight="900">normal n</text></g>;
  if (model === "gradient") return <g><ellipse cx="320" cy="210" rx="94" ry="42" fill="none" stroke="#c4b5fd" strokeWidth="3" /><path d="M320,210 L405,162" stroke="#f59e0b" strokeWidth="5" /><text x="410" y="160" fill="#fde68a" fontWeight="900">grad f</text></g>;
  if (model === "contour" || model === "level surface") return <g><circle cx="486" cy="185" r="54" fill="none" stroke="#a78bfa" strokeWidth="3" /><circle cx="486" cy="185" r={Math.max(18, 36 + slice * 5)} fill="none" stroke="#f59e0b" strokeWidth="4" /><text x="440" y="258" fill="#ddd6fe" fontWeight="900">{model === "contour" ? "2D contour map" : "f(x,y,z)=c"}</text></g>;
  return <g><path d="M260,245 Q320,145 380,245" fill="none" stroke="#f59e0b" strokeWidth="4" /><text x="395" y="238" fill="#fde68a" fontWeight="900">{model}</text></g>;
}

function graph3DDetails(title: string, range: number, slice: number) {
  const name = title.toLowerCase();
  if (name.includes("space curve")) return { model: "space curve", rule: `t=${slice.toFixed(1)}, |r'|=${Math.hypot(1, 0.25).toFixed(2)}` };
  if (name.includes("quadric")) return { model: "quadric classifier", rule: "sign pattern -> surface type" };
  if (name.includes("cylindrical")) return { model: "cylindrical coordinates", rule: "x=r cos theta, y=r sin theta" };
  if (name.includes("spherical")) return { model: "spherical coordinates", rule: "rho with theta and phi" };
  if (name.includes("contour")) return { model: "contour", rule: "f(x,y)=c" };
  if (name.includes("level surface")) return { model: "level surface", rule: "f(x,y,z)=c" };
  if (name.includes("partial derivative")) return { model: "partial derivative slices", rule: `fx=${(2 * range).toFixed(1)}, fy=${(2 * slice).toFixed(1)}` };
  if (name.includes("gradient")) return { model: "gradient", rule: "grad f = <fx, fy>" };
  if (name.includes("tangent plane")) return { model: "tangent plane", rule: "z-z0=fx(x-x0)+fy(y-y0)" };
  if (name.includes("normal vector")) return { model: "normal vector", rule: "n perpendicular to tangents" };
  if (name.includes("implicit")) return { model: "implicit surface", rule: "F(x,y,z)=0" };
  if (name.includes("parametric")) return { model: "parametric surface", rule: "r(u,v)=<x,y,z>" };
  return { model: "height surface", rule: "z=f(x,y)" };
}

function solid3DDetails(solid: NonNullable<ReusableLessonEngineParams["solid"]>, size: number, height: number) {
  const radius = size / 2;
  const slant = Math.hypot(radius, height);
  if (solid === "regular-polyhedra") return { model: "Platonic solids carousel", formula: "V - E + F = 2", volume: undefined, surfaceArea: undefined };
  if (solid === "cylinder") return { model: "cylinder with net", formula: "V = pi r^2 h", volume: Math.PI * radius ** 2 * height, surfaceArea: 2 * Math.PI * radius * (height + radius) };
  if (solid === "cone") return { model: "cone with sector net", formula: "V = pi r^2 h / 3", volume: (Math.PI * radius ** 2 * height) / 3, surfaceArea: Math.PI * radius * (radius + slant) };
  if (solid === "sphere") return { model: "sphere with great circle", formula: "V = 4 pi r^3 / 3", volume: (4 / 3) * Math.PI * radius ** 3, surfaceArea: 4 * Math.PI * radius ** 2 };
  if (solid === "hemisphere") return { model: "hemisphere cut", formula: "V = 2 pi r^3 / 3", volume: (2 / 3) * Math.PI * radius ** 3, surfaceArea: 3 * Math.PI * radius ** 2 };
  if (solid === "frustum") return { model: "frustum with two radii", formula: "V = pi h(R^2+Rr+r^2)/3", volume: (Math.PI * height * (radius ** 2 + radius * radius * 0.55 + (radius * 0.55) ** 2)) / 3, surfaceArea: Math.PI * (radius + radius * 0.55) * Math.hypot(height, radius * 0.45) + Math.PI * radius ** 2 + Math.PI * (radius * 0.55) ** 2 };
  if (solid === "surface-of-revolution") return { model: "surface of revolution", formula: "rotate y=f(x)", volume: Math.PI * radius ** 2 * height, surfaceArea: 2 * Math.PI * radius * height };
  if (solid === "extrusion") return { model: "extruded prism", formula: "V = area x depth", volume: ((Math.sqrt(3) / 4) * size ** 2) * height, surfaceArea: undefined };
  if (solid === "cross-section") return { model: "moving slice plane", formula: "section changes with plane", volume: undefined, surfaceArea: undefined };
  if (solid === "volume") return { model: "capacity comparison", formula: "volume uses cubic units", volume: size ** 2 * height, surfaceArea: undefined };
  if (solid === "surface-area") return { model: "unfolded face net", formula: "sum exposed faces", volume: undefined, surfaceArea: 6 * size ** 2 };
  if (solid === "x-ray") return { model: "transparent x-ray solid", formula: "hidden edges visible", volume: undefined, surfaceArea: undefined };
  if (solid === "camera") return { model: "orbit pan zoom camera", formula: `orbit ${height.toFixed(1)}x`, volume: undefined, surfaceArea: undefined };
  if (solid === "orthographic") return { model: "front top side views", formula: "3D -> 2D projections", volume: undefined, surfaceArea: undefined };
  if (solid === "ar-placement") return { model: "AR placement anchor", formula: "scale and ground plane", volume: undefined, surfaceArea: undefined };
  if (solid === "tetrahedron") return { model: "tetrahedron", formula: "V = Bh / 3", volume: undefined, surfaceArea: undefined };
  return { model: solid, formula: "spatial measurement", volume: undefined, surfaceArea: undefined };
}

function Solid3D({ kind, size, height }: { kind: NonNullable<ReusableLessonEngineParams["solid"]>; size: number; height: number }) {
  const scale = 20 + size * 7;
  if (kind === "sphere") return <ellipse cx="320" cy="185" rx={scale} ry={scale * 0.72} fill="#06b6d4" opacity=".55" stroke="#67e8f9" strokeWidth="3" />;
  if (kind === "hemisphere") return <g><path d={`M${320 - scale},200 A${scale},${scale * 0.72} 0 0 0 ${320 + scale},200 L${320 + scale},200 A${scale},${scale * 0.25} 0 0 1 ${320 - scale},200 Z`} fill="#06b6d4" opacity=".45" stroke="#67e8f9" strokeWidth="3" /><ellipse cx="320" cy="200" rx={scale} ry={scale * 0.25} fill="none" stroke="#f59e0b" strokeWidth="4" /><text x="338" y="195" fill="#fde68a" fontWeight="900">equator cut</text></g>;
  if (kind === "cylinder" || kind === "cone") return <g><ellipse cx="320" cy="250" rx={scale} ry={scale * 0.3} fill="#06b6d4" opacity=".5" /><path d={kind === "cone" ? `M${320 - scale},250 L320,75 L${320 + scale},250` : `M${320 - scale},250 L${320 - scale},100 M${320 + scale},250 L${320 + scale},100`} fill="none" stroke="#67e8f9" strokeWidth="4" /><ellipse cx="320" cy="100" rx={kind === "cone" ? 3 : scale} ry={kind === "cone" ? 3 : scale * 0.3} fill="#06b6d4" opacity=".6" stroke="#67e8f9" /></g>;
  if (kind === "frustum") return <g><ellipse cx="320" cy="250" rx={scale} ry={scale * 0.3} fill="#06b6d4" opacity=".42" stroke="#67e8f9" strokeWidth="3" /><ellipse cx="320" cy={250 - height * 17} rx={scale * 0.55} ry={scale * 0.18} fill="#06b6d4" opacity=".62" stroke="#67e8f9" strokeWidth="3" /><path d={`M${320 - scale},250 L${320 - scale * 0.55},${250 - height * 17} M${320 + scale},250 L${320 + scale * 0.55},${250 - height * 17}`} stroke="#67e8f9" strokeWidth="4" /><text x="385" y="110" fill="#fde68a" fontWeight="900">R, r, h</text></g>;
  if (kind === "regular-polyhedra") return <g><polygon points="320,75 415,145 378,260 262,260 225,145" fill="#06b6d4" opacity=".36" stroke="#67e8f9" strokeWidth="3" /><path d="M320,75 L378,260 M320,75 L262,260 M225,145 L415,145 M262,260 L415,145 M378,260 L225,145" stroke="#f59e0b" strokeWidth="2.5" /><text x="398" y="92" fill="#fde68a" fontWeight="900">V-E+F=2</text></g>;
  if (kind === "surface-of-revolution") return <g><path d="M215,235 C260,140 365,140 425,235" fill="none" stroke="#f59e0b" strokeWidth="4" /><ellipse cx="320" cy="235" rx="105" ry="30" fill="#06b6d4" opacity=".25" stroke="#67e8f9" strokeWidth="3" /><ellipse cx="320" cy="175" rx="70" ry="20" fill="none" stroke="#67e8f9" strokeWidth="3" /><path d="M320,80 V270" stroke="#c4b5fd" strokeDasharray="7 5" strokeWidth="3" /><text x="335" y="98" fill="#ddd6fe" fontWeight="900">axis</text></g>;
  if (kind === "extrusion") return <g><polygon points="235,250 300,170 370,250" fill="#a78bfa" opacity=".35" stroke="#ddd6fe" strokeWidth="3" /><polygon points="300,170 405,135 475,215 370,250" fill="#06b6d4" opacity=".32" stroke="#67e8f9" strokeWidth="3" /><path d="M235,250 L340,215 L405,135 M370,250 L475,215" stroke="#f59e0b" strokeWidth="3" /><text x="390" y="132" fill="#fde68a" fontWeight="900">depth</text></g>;
  if (kind === "cross-section" || kind === "x-ray") return <g><path d={`M${320 - scale},${220 - scale / 2} l${scale},${-scale / 2} l${scale},${scale / 2} v${scale} l${-scale},${scale / 2} l${-scale},${-scale / 2}z M320,${220 - scale} v${scale}`} fill="#06b6d4" opacity={kind === "x-ray" ? ".18" : ".32"} stroke="#67e8f9" strokeWidth="3" /><polygon points="230,210 405,155 500,210 320,270" fill="#a78bfa" opacity=".34" stroke="#f59e0b" strokeWidth="3" /><text x="420" y="150" fill="#fde68a" fontWeight="900">{kind === "x-ray" ? "hidden edges" : "slice plane"}</text></g>;
  if (kind === "surface-area") return <g><rect x="210" y="135" width="80" height="80" fill="#67e8f9" opacity=".5" stroke="#0e7490" strokeWidth="3" /><rect x="290" y="135" width="80" height="80" fill="#f59e0b" opacity=".5" stroke="#92400e" strokeWidth="3" /><rect x="370" y="135" width="80" height="80" fill="#a78bfa" opacity=".5" stroke="#6d28d9" strokeWidth="3" /><rect x="290" y="55" width="80" height="80" fill="#22c55e" opacity=".45" stroke="#15803d" strokeWidth="3" /><rect x="290" y="215" width="80" height="80" fill="#fb7185" opacity=".45" stroke="#be123c" strokeWidth="3" /><text x="462" y="180" fill="#fde68a" fontWeight="900">net faces</text></g>;
  if (kind === "volume" || kind === "camera" || kind === "orthographic" || kind === "ar-placement") return <g><path d={`M${320 - scale},${220 - scale / 2} l${scale},${-scale / 2} l${scale},${scale / 2} v${scale} l${-scale},${scale / 2} l${-scale},${-scale / 2}z M320,${220 - scale} v${scale} M${320 - scale},${220 - scale / 2} l${scale},${scale / 2} l${scale},${-scale / 2}`} fill="#06b6d4" opacity=".38" stroke="#67e8f9" strokeWidth="3" /><path d={kind === "orthographic" ? "M455,105 h60 v45 h-60z M455,170 h60 v45 h-60z" : kind === "ar-placement" ? "M210,285 h230 l60,-35 h-230z" : "M245,95 C305,45 420,75 455,145"} fill="none" stroke="#f59e0b" strokeWidth="4" /><text x="455" y="95" fill="#fde68a" fontWeight="900">{kind === "camera" ? "orbit" : kind === "orthographic" ? "views" : kind === "ar-placement" ? "ground" : "capacity"}</text></g>;
  if (kind === "tetrahedron") {
    const apexY = 235 - height * 18;
    const left = `${320 - scale},245`;
    const right = `${320 + scale},245`;
    const back = `320,${245 - scale * 0.62}`;
    const apex = `320,${apexY}`;
    return (
      <g>
        <polygon points={`${left} ${right} ${apex}`} fill="#06b6d4" opacity=".38" stroke="#67e8f9" strokeWidth="3" />
        <polygon points={`${left} ${back} ${apex}`} fill="#14b8a6" opacity=".24" stroke="#67e8f9" strokeWidth="3" />
        <polygon points={`${right} ${back} ${apex}`} fill="#38bdf8" opacity=".22" stroke="#67e8f9" strokeWidth="3" />
        <path d={`M${left} L${back} L${right} M320,245 L${apex}`} fill="none" stroke="#f59e0b" strokeDasharray="7 5" strokeWidth="3" />
        <circle cx="320" cy={apexY} r="5" fill="#f59e0b" />
        <text x="333" y={apexY - 8} fill="#fef3c7" fontSize="18" fontWeight="900">apex</text>
        <text x="330" y="268" fill="#cffafe" fontSize="16" fontWeight="900">base B</text>
      </g>
    );
  }
  return <path d={`M${320 - scale},${220 - scale / 2} l${scale},${-scale / 2} l${scale},${scale / 2} v${scale} l${-scale},${scale / 2} l${-scale},${-scale / 2}z M320,${220 - scale} v${scale} M${320 - scale},${220 - scale / 2} l${scale},${scale / 2} l${scale},${-scale / 2}`} fill="#06b6d4" opacity=".38" stroke="#67e8f9" strokeWidth="3" />;
}

function PointMark({ point, label, accent = false }: { point: KernelPoint; label: string; accent?: boolean }) {
  return <g><circle cx={sx(point.x)} cy={sy(point.y)} r="8" fill={accent ? "#f59e0b" : "#0891b2"} /><text x={sx(point.x) + 11} y={sy(point.y) - 10} fontWeight="800" fill="#334155">{label}</text></g>;
}

function MiniMetric({ label, value }: { label: string; value: string }) {
  return <div className="rounded-xl bg-slate-100 p-2 text-center text-xs dark:bg-white/10"><span className="block text-[10px] font-bold text-slate-500">{label}</span><strong>{value}</strong></div>;
}

function ToolChips({ tools }: { tools: string[] }) {
  return <div className="flex flex-wrap gap-1">{tools.map((tool) => <span key={tool} className="rounded-full bg-cyan-50 px-2 py-1 text-[10px] font-black text-cyan-700 dark:bg-cyan-400/10 dark:text-cyan-100">{tool}</span>)}</div>;
}
