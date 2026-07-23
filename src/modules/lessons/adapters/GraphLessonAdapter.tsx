import { useEffect, useMemo, useState } from "react";
import SliderControl, { SliderGroup } from "../../../components/ui/SliderControl";
import { applyGraphParameters, samplePlotLayer, sampleTable, type GraphViewport, type PlotItem } from "../../../components/workspace/panels/graphPanelUtils";
import AdapterFrame from "../components/AdapterFrame";
import type { LessonAdapterProps } from "../types";

const viewport: GraphViewport = { xMin: -10, xMax: 10, yMin: -10, yMax: 10, width: 640, height: 360 };

function presetFor(title: string) {
  const name = title.toLowerCase();
  if (name.includes("polar")) return { expression: "r=a*sin(3*theta), theta=0..2*pi", parent: "r=sin(3*theta), theta=0..2*pi", kind: "polar" as const };
  if (name.includes("parametric")) return { expression: "x=a*cos(t), y=a*sin(t), t=0..2*pi", parent: "x=cos(t), y=sin(t), t=0..2*pi", kind: "parametric" as const };
  if (name.includes("inequal")) return { expression: "y<a*x+b", parent: "y<x", kind: "inequality" as const };
  if (name.includes("quadratic") || name.includes("parabola")) return { expression: "a*x^2+b", parent: "x^2", kind: "function" as const };
  if (name.includes("cubic")) return { expression: "a*x^3+b", parent: "x^3", kind: "function" as const };
  if (name.includes("absolute") || name.includes("modulus")) return { expression: "a*abs(x)+b", parent: "abs(x)", kind: "function" as const };
  if (name.includes("reciprocal") || name.includes("rational")) return { expression: "a/x+b", parent: "1/x", kind: "function" as const };
  if (name.includes("exponential")) return { expression: "a*2^x+b", parent: "2^x", kind: "function" as const };
  if (name.includes("logarith")) return { expression: "a*ln(x)+b", parent: "ln(x)", kind: "function" as const };
  if (name.includes("trig") || name.includes("sine") || name.includes("cosine")) return { expression: "a*sin(x)+b", parent: "sin(x)", kind: "function" as const };
  if (name.includes("circle") || name.includes("implicit")) return { expression: "x^2+y^2=a^2", parent: "x^2+y^2=9", kind: "implicit" as const };
  return { expression: "a*x+b", parent: "x", kind: "function" as const };
}

export default function GraphLessonAdapter({ lesson, resetToken, onInteraction }: LessonAdapterProps) {
  const preset = useMemo(() => presetFor(lesson.title), [lesson.title]);
  const initialA = lesson.id % 3 + 1;
  const initialB = lesson.id % 5 - 2;
  const [a, setA] = useState(initialA);
  const [b, setB] = useState(initialB);
  useEffect(() => { setA(initialA); setB(initialB); }, [initialA, initialB, resetToken]);
  const current = useMemo<PlotItem>(() => ({ id: `graph-${lesson.id}`, expression: preset.expression, color: "#06b6d4", kind: preset.kind, visible: true }), [lesson.id, preset]);
  const parent = useMemo<PlotItem>(() => ({ id: `parent-${lesson.id}`, expression: preset.parent, color: "#94a3b8", kind: preset.kind, visible: true }), [lesson.id, preset]);
  const currentLayer = useMemo(() => samplePlotLayer(current, viewport, a, b), [a, b, current]);
  const parentLayer = useMemo(() => samplePlotLayer(parent, viewport, 1, 0), [parent]);
  const expression = applyGraphParameters(preset.expression, a, b);
  const table = useMemo(() => sampleTable(expression, "f", -2, 2, 2).slice(0, 3), [expression]);
  const update = (setter: (value: number) => void) => (value: number) => { setter(value); onInteraction(); };
  return <AdapterFrame title={`${lesson.title} · linked graph`} value={expression} footer="Cyan is the live model; grey is the parent. The same sampler powers graph workspace plots and lesson tables.">
    <div className="grid gap-3 xl:grid-cols-[minmax(0,1fr)_280px]">
      <div className="overflow-hidden rounded-xl bg-slate-50 dark:bg-slate-900"><svg viewBox="0 0 640 360" className="h-[300px] w-full" role="img" aria-label={`Interactive plot of ${expression}`}><Grid />{parentLayer.paths.map((path, index) => <path key={`p${index}`} d={path} fill="none" stroke="#94a3b8" strokeWidth="2" strokeDasharray="8 6" />)}{parentLayer.cells.map((cell, index) => <rect key={`pc${index}`} {...cell} fill="#94a3b8" opacity=".12" />)}{currentLayer.cells.map((cell, index) => <rect key={`c${index}`} {...cell} fill="#06b6d4" opacity=".2" />)}{currentLayer.paths.map((path, index) => <path key={index} d={path} fill="none" stroke="#06b6d4" strokeWidth="4" strokeLinecap="round" />)}</svg></div>
      <div className="space-y-3"><SliderGroup title="Graph controls"><SliderControl density="compact" label="a" value={a} min={-5} max={5} step={0.25} onChange={update(setA)} /><SliderControl density="compact" label="b" value={b} min={-5} max={5} step={0.25} onChange={update(setB)} /></SliderGroup><div className="grid grid-cols-3 gap-2">{table.map((row) => <div key={row.x} className="rounded-xl bg-slate-100 p-2 text-center dark:bg-white/10"><span className="block text-[10px] font-bold text-slate-500">x={row.x}</span><strong className="font-mono text-sm">{row.y}</strong></div>)}</div>{currentLayer.error ? <p className="rounded-xl bg-amber-100 p-2 text-xs font-bold text-amber-900">{currentLayer.error}</p> : null}</div>
    </div>
  </AdapterFrame>;
}

function Grid() { return <g><rect width="640" height="360" fill="transparent" />{Array.from({ length: 21 }, (_, i) => <line key={`v${i}`} x1={i * 32} x2={i * 32} y1="0" y2="360" stroke="#cbd5e1" opacity=".3" />)}{Array.from({ length: 13 }, (_, i) => <line key={`h${i}`} x1="0" x2="640" y1={i * 30} y2={i * 30} stroke="#cbd5e1" opacity=".3" />)}<line x1="0" x2="640" y1="180" y2="180" stroke="#64748b" /><line x1="320" x2="320" y1="0" y2="360" stroke="#64748b" /></g>; }
