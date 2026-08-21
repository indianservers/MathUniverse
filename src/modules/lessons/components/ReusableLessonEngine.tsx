import { useEffect, useMemo, useState, type ReactNode } from "react";
import SliderControl, { SliderGroup } from "../../../components/ui/SliderControl";
import { applyGraphParameters, samplePlotLayer, sampleTable, type GraphViewport, type PlotItem } from "../../../components/workspace/panels/graphPanelUtils";
import { distanceBetween, line, midpoint, polygonArea, polygonPerimeter, relationBetween, type KernelPoint } from "../../../workspace/geometry2dKernel";
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
  insight?: string;
  check?: string;
  solid?: "box" | "sphere" | "cylinder" | "cone" | "pyramid" | "triangular-prism";
  surfaceExpression?: string;
  casCommand?: string;
  casExpression?: string;
  casExecute?: (expression: string) => SymbolicResult;
  tools?: string[];
  isTransform?: boolean;
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
  const [a, setA] = useState(2);
  const [b, setB] = useState(0);
  useEffect(() => { setA(2); setB(0); }, [resetToken]);
  const expression = params.expression ?? "a*x+b";
  const parentExpression = params.parentExpression ?? "x";
  const graphKind = params.graphKind ?? "function";
  const current = useMemo<PlotItem>(() => ({ id: "lesson-graph", expression, color: "#06b6d4", kind: graphKind, visible: true }), [expression, graphKind]);
  const parent = useMemo<PlotItem>(() => ({ id: "lesson-parent", expression: parentExpression, color: "#94a3b8", kind: graphKind, visible: true }), [graphKind, parentExpression]);
  const currentLayer = useMemo(() => samplePlotLayer(current, graphViewport, a, b), [a, b, current]);
  const parentLayer = useMemo(() => samplePlotLayer(parent, graphViewport, 1, 0), [parent]);
  const resolved = applyGraphParameters(expression, a, b);
  const table = useMemo(() => sampleTable(resolved, "f", -2, 2, 2).slice(0, 3), [resolved]);
  const update = (setter: (value: number) => void) => (value: number) => { setter(value); onInteraction(); };

  return (
    <div className="lesson-engine lesson-engine-2d-graph">
      <div className="lesson-engine-axis">
        <svg viewBox="0 0 640 360" className="h-[300px] w-full" role="img" aria-label={`Reusable 2D graph engine plotting ${resolved}`}>
          <Grid2D />
          {parentLayer.paths.map((path, index) => <path key={`p${index}`} d={path} fill="none" stroke="#94a3b8" strokeWidth="2" strokeDasharray="8 6" />)}
          {parentLayer.cells.map((cell, index) => <rect key={`pc${index}`} {...cell} fill="#94a3b8" opacity=".12" />)}
          {currentLayer.cells.map((cell, index) => <rect key={`c${index}`} {...cell} fill="#06b6d4" opacity=".2" />)}
          {currentLayer.paths.map((path, index) => <path key={index} d={path} fill="none" stroke="#06b6d4" strokeWidth="4" strokeLinecap="round" />)}
        </svg>
      </div>
      <EngineControlPanel title="2D graph params" insight={params.insight} check={params.check}>
        <SliderControl density="compact" label="a" value={a} min={-5} max={5} step={0.25} onChange={update(setA)} />
        <SliderControl density="compact" label="b" value={b} min={-5} max={5} step={0.25} onChange={update(setB)} />
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
  const update = (setter: (value: number) => void) => (value: number) => { setter(value); onInteraction(); };

  return (
    <div className="lesson-engine lesson-engine-3d-graph">
      <div className="lesson-engine-axis is-dark">
        <svg viewBox="0 0 640 360" className="h-[310px] w-full" role="img" aria-label="Reusable 3D graph engine surface workspace">
          <Axis3D orbit={orbit} />
          <SurfaceWireframe range={range} slice={slice} />
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
      </EngineControlPanel>
    </div>
  );
}

function ReusableGeometry2DEngine({ params, resetToken, onInteraction }: Omit<ReusableLessonEngineProps, "engine">) {
  const [ax, setAx] = useState(-3);
  const [ay, setAy] = useState(-1);
  const [bx, setBx] = useState(3);
  const [by, setBy] = useState(2);
  const [amount, setAmount] = useState(2);
  useEffect(() => { setAx(-3); setAy(-1); setBx(3); setBy(2); setAmount(2); }, [resetToken]);
  const a = useMemo(() => ({ x: ax, y: ay }), [ax, ay]);
  const b = useMemo(() => ({ x: bx, y: by }), [bx, by]);
  const isTransform = Boolean(params.isTransform);
  const transformed = transformPoint(params.title, b, amount);
  const mid = midpoint(a, b);
  const distance = distanceBetween(a, b);
  const relation = relationBetween(line(a, b), line(mid, { x: mid.x - (b.y - a.y), y: mid.y + (b.x - a.x) }));
  const polygon = [a, b, transformed];
  const update = (setter: (value: number) => void, controlId: string) => (value: number) => { setter(value); onInteraction(emitEngineEvent(controlId, value)); };

  return (
    <div className="lesson-engine lesson-engine-2d-geometry">
      <div className="lesson-engine-axis">
        <svg viewBox="0 0 640 360" className="h-[310px] w-full" role="img" aria-label="Reusable 2D geometry engine construction area">
          <Grid2D />
          {isTransform ? <><polygon points={polygon.map((p) => `${sx(p.x)},${sy(p.y)}`).join(" ")} fill="#06b6d4" opacity=".16" stroke="#06b6d4" strokeWidth="3" /><line x1={sx(b.x)} y1={sy(b.y)} x2={sx(transformed.x)} y2={sy(transformed.y)} stroke="#f59e0b" strokeDasharray="7 5" strokeWidth="2" /></> : <><line x1={sx(a.x)} y1={sy(a.y)} x2={sx(b.x)} y2={sy(b.y)} stroke="#06b6d4" strokeWidth="4" /><circle cx={sx(mid.x)} cy={sy(mid.y)} r="6" fill="#f59e0b" /></>}
          <PointMark point={a} label="A" />
          <PointMark point={b} label="B" />
          {isTransform ? <PointMark point={transformed} label="B'" accent /> : null}
        </svg>
      </div>
      <EngineControlPanel title="2D geometry params" insight={params.insight} check={params.check}>
        <ToolChips tools={params.tools ?? ["Point", "Segment", "Measure"]} />
        <SliderControl density="compact" label="A x" value={ax} min={-6} max={6} step={0.5} onChange={update(setAx, "geometry-a-x")} />
        <SliderControl density="compact" label="A y" value={ay} min={-4} max={4} step={0.5} onChange={update(setAy, "geometry-a-y")} />
        <SliderControl density="compact" label="B x" value={bx} min={-6} max={6} step={0.5} onChange={update(setBx, "geometry-b-x")} />
        <SliderControl density="compact" label="B y" value={by} min={-4} max={4} step={0.5} onChange={update(setBy, "geometry-b-y")} />
        {isTransform ? <SliderControl density="compact" label="Transform" value={amount} min={-4} max={4} step={0.5} onChange={update(setAmount, "geometry-transform")} /> : null}
        <div className="grid grid-cols-2 gap-2">
          <MiniMetric label="Distance" value={distance.toFixed(2)} />
          <MiniMetric label="Invariant" value={isTransform ? `Area ${polygonArea(polygon).toFixed(1)}` : relation.relation} />
          <MiniMetric label="Midpoint" value={`${mid.x.toFixed(1)}, ${mid.y.toFixed(1)}`} />
          <MiniMetric label="Perimeter" value={polygonPerimeter(polygon).toFixed(1)} />
        </div>
      </EngineControlPanel>
    </div>
  );
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
  const volume = solid === "box" || solid === "pyramid" || solid === "triangular-prism" ? genericMetrics.volume : kernelMetrics.volume;
  const surfaceArea = solid === "box" ? genericMetrics.surfaceArea : kernelMetrics.surfaceArea;
  const update = (setter: (value: number) => void) => (value: number) => { setter(value); onInteraction(); };

  return (
    <div className="lesson-engine lesson-engine-3d-geometry">
      <div className="lesson-engine-axis is-dark">
        <svg viewBox="0 0 640 360" className="h-[310px] w-full" role="img" aria-label="Reusable 3D geometry engine solid workspace">
          <Axis3D orbit={orbit} />
          <Solid3D kind={solid} size={size} />
        </svg>
      </div>
      <EngineControlPanel title="3D geometry params" insight={params.insight} check={params.check}>
        <SliderControl density="compact" label="size" value={size} min={1} max={8} step={0.25} onChange={update(setSize)} />
        <SliderControl density="compact" label="height" value={height} min={1} max={10} step={0.25} onChange={update(setHeight)} />
        <SliderControl density="compact" label="orbit" value={orbit} min={0} max={360} step={5} unit="degrees" onChange={update(setOrbit)} />
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
  if (name.includes("quadratic") || name.includes("parabola")) return make("a*x^2+b", "x^2", "The squared term creates a turning point.", "Track the vertex as parameters move.");
  if (name.includes("exponential")) return make("a*2^x+b", "2^x", "Equal x-steps multiply outputs.", "Compare ratios, not differences.");
  if (name.includes("logarith")) return make("a*ln(x)+b", "ln(x)", "Inputs must be positive before taking a logarithm.", "Check the vertical asymptote.");
  if (name.includes("trig") || name.includes("sine") || name.includes("cosine")) return make("a*sin(x)+b", "sin(x)", "The graph repeats with a period.", "Check angle units before reading values.");
  if (name.includes("circle") || name.includes("implicit")) return make("x^2+y^2=a^2", "x^2+y^2=9", "Implicit graphs can relate x and y without y=f(x).", "A circle fails the vertical-line test.", "implicit");
  if (name.includes("polar")) return make("r=a*sin(3*theta), theta=0..2*pi", "r=sin(3*theta), theta=0..2*pi", "Polar graphs use angle and radius.", "The angle controls direction.", "polar");
  if (name.includes("parametric")) return make("x=a*cos(t), y=a*sin(t), t=0..2*pi", "x=cos(t), y=sin(t), t=0..2*pi", "A parameter traces both coordinates together.", "The parameter is not a coordinate.", "parametric");
  return make("a*x+b", "x", "Formula, curve, and table update together.", "Use the table to check one point.");
}

function graph3DParamsFor(title: string): ReusableLessonEngineParams {
  const name = title.toLowerCase();
  if (name.includes("saddle") || name.includes("quadric")) return { title, surfaceExpression: "z = x^2 - y^2", insight: "A saddle curves up in one direction and down in another.", check: "Rotate before deciding the curvature." };
  if (name.includes("sphere")) return { title, surfaceExpression: "z = sqrt(9 - x^2 - y^2)", insight: "A hemisphere is a height surface over a disk.", check: "The domain is a circular disk." };
  return { title, surfaceExpression: "z = sin(x) cos(y)", insight: "A 3D graph has two inputs and one height output.", check: "Use cross-sections to read shape." };
}

function geometry2DParamsFor(title: string): ReusableLessonEngineParams {
  const name = title.toLowerCase();
  const tools = /circle|arc|tangent/i.test(name) ? ["Point", "Circle", "Measure"] : /polygon|triangle|quadrilateral/i.test(name) ? ["Point", "Polygon", "Measure"] : ["Point", "Segment", "Relation"];
  return {
    title,
    tools,
    isTransform: /transform|reflect|rotat|translat|enlarg|dilat|loci|locus|symmetr/i.test(name),
    insight: name.includes("parallel") ? "Parallel lines keep the same direction." : name.includes("perpendicular") ? "Perpendicular objects meet at 90 degrees." : "Use the construction and measurements together.",
    check: name.includes("area") ? "Area uses square units." : name.includes("midpoint") ? "Average x and y coordinates separately." : "Drag points and verify the measured invariant.",
  };
}

function geometry3DParamsFor(title: string): ReusableLessonEngineParams {
  const name = title.toLowerCase();
  const solid = name.includes("sphere") ? "sphere" : name.includes("cone") ? "cone" : name.includes("cylinder") ? "cylinder" : name.includes("pyramid") ? "pyramid" : name.includes("prism") ? "triangular-prism" : "box";
  return { title, solid, insight: "Use x, y, and z axes with spatial measurements.", check: "Volume uses cubic units; surface area uses square units." };
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

function Grid2D() {
  return <g><rect width="640" height="360" fill="transparent" />{Array.from({ length: 21 }, (_, i) => <line key={`v${i}`} x1={i * 32} x2={i * 32} y1="0" y2="360" stroke="#cbd5e1" opacity=".3" />)}{Array.from({ length: 13 }, (_, i) => <line key={`h${i}`} x1="0" x2="640" y1={i * 30} y2={i * 30} stroke="#cbd5e1" opacity=".3" />)}<line x1="0" x2="640" y1="180" y2="180" stroke="#64748b" /><line x1="320" x2="320" y1="0" y2="360" stroke="#64748b" /></g>;
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

function Solid3D({ kind, size }: { kind: NonNullable<ReusableLessonEngineParams["solid"]>; size: number }) {
  const scale = 20 + size * 7;
  if (kind === "sphere") return <ellipse cx="320" cy="185" rx={scale} ry={scale * 0.72} fill="#06b6d4" opacity=".55" stroke="#67e8f9" strokeWidth="3" />;
  if (kind === "cylinder" || kind === "cone") return <g><ellipse cx="320" cy="250" rx={scale} ry={scale * 0.3} fill="#06b6d4" opacity=".5" /><path d={kind === "cone" ? `M${320 - scale},250 L320,75 L${320 + scale},250` : `M${320 - scale},250 L${320 - scale},100 M${320 + scale},250 L${320 + scale},100`} fill="none" stroke="#67e8f9" strokeWidth="4" /><ellipse cx="320" cy="100" rx={kind === "cone" ? 3 : scale} ry={kind === "cone" ? 3 : scale * 0.3} fill="#06b6d4" opacity=".6" stroke="#67e8f9" /></g>;
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
