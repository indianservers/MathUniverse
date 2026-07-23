import { useEffect, useMemo, useState } from "react";
import SliderControl, { SliderGroup } from "../../../components/ui/SliderControl";
import { samplePlotLayer, type GraphViewport, type PlotItem } from "../../../components/workspace/panels/graphPanelUtils";
import { symbolicDerivative, symbolicIntegral } from "../../../utils/symbolic";
import AdapterFrame from "../components/AdapterFrame";
import type { LessonAdapterProps } from "../types";

const viewport: GraphViewport = { xMin: -5, xMax: 5, yMin: -6, yMax: 10, width: 640, height: 360 };
const scaleX = (x: number) => ((x + 5) / 10) * 640;
const scaleY = (y: number) => 360 - ((y + 6) / 16) * 360;

function functionFor(title: string) {
  const name = title.toLowerCase();
  if (name.includes("trig") || name.includes("sine")) return "sin(x)";
  if (name.includes("exponential")) return "exp(x/2)";
  if (name.includes("rational") || name.includes("asympt")) return "1/x";
  if (name.includes("absolute")) return "abs(x)";
  return "x^2";
}

function numericValue(expression: string, x: number) {
  if (expression === "sin(x)") return Math.sin(x);
  if (expression === "exp(x/2)") return Math.exp(x / 2);
  if (expression === "1/x") return 1 / x;
  if (expression === "abs(x)") return Math.abs(x);
  return x * x;
}

export default function CalculusLessonAdapter({ lesson, resetToken, onInteraction }: LessonAdapterProps) {
  const expression = useMemo(() => functionFor(lesson.title), [lesson.title]);
  const initialX = lesson.id % 4 - 1;
  const [x, setX] = useState(initialX || 1); const [h, setH] = useState(1); const [partitions, setPartitions] = useState(8);
  useEffect(() => { setX(initialX || 1); setH(1); setPartitions(8); }, [initialX, resetToken]);
  const plot = useMemo<PlotItem>(() => ({ id: `calculus-${lesson.id}`, expression, color: "#06b6d4", kind: "function", visible: true }), [expression, lesson.id]);
  const layer = useMemo(() => samplePlotLayer(plot, viewport, 1, 0), [plot]);
  const y = numericValue(expression, x); const nextY = numericValue(expression, x + h); const secant = (nextY - y) / h;
  const derivative = useMemo(() => symbolicDerivative(expression).result, [expression]);
  const integral = useMemo(() => symbolicIntegral(expression).result, [expression]);
  const isIntegral = /area|integral|antiderivative|riemann|accumulation|volume/i.test(lesson.title);
  const left = Math.min(0, x); const right = Math.max(0.1, x); const width = (right - left) / partitions;
  const rectangles = Array.from({ length: partitions }, (_, index) => { const rx = left + index * width; const height = numericValue(expression, rx + width / 2); return { rx, height }; });
  const update = (setter: (value: number) => void) => (value: number) => { setter(value); onInteraction(); };
  return <AdapterFrame title={`${lesson.title} · graph + CAS`} value={isIntegral ? `∫f dx = ${integral}` : `f′(x) = ${derivative}`} footer="The curve uses the graph sampler; exact derivative and antiderivative use the existing symbolic engine.">
    <div className="grid gap-3 xl:grid-cols-[minmax(0,1fr)_290px]"><div className="overflow-hidden rounded-xl bg-slate-50 dark:bg-slate-900"><svg viewBox="0 0 640 360" className="h-[310px] w-full" role="img" aria-label={`Calculus model for ${expression}`}><Grid />{isIntegral ? rectangles.map((item, index) => <rect key={index} x={scaleX(item.rx)} y={scaleY(Math.max(0, item.height))} width={Math.max(1, scaleX(item.rx + width) - scaleX(item.rx))} height={Math.abs(scaleY(0) - scaleY(item.height))} fill="#f59e0b" opacity=".25" stroke="#f59e0b" />) : <><line x1={scaleX(x)} y1={scaleY(y)} x2={scaleX(x + h)} y2={scaleY(nextY)} stroke="#f59e0b" strokeWidth="3" strokeDasharray="7 5" /><circle cx={scaleX(x)} cy={scaleY(y)} r="7" fill="#f59e0b" /><circle cx={scaleX(x + h)} cy={scaleY(nextY)} r="7" fill="#f59e0b" /></>}{layer.paths.map((path, index) => <path key={index} d={path} fill="none" stroke="#06b6d4" strokeWidth="4" />)}</svg></div><div className="space-y-3"><SliderGroup title="Linked controls"><SliderControl density="compact" label="x" value={x} min={-4} max={4} step={0.1} onChange={update(setX)} />{isIntegral ? <SliderControl density="compact" label="Rectangles" value={partitions} min={2} max={40} step={1} onChange={update(setPartitions)} /> : <SliderControl density="compact" label="h" value={h} min={0.05} max={2} step={0.05} onChange={update(setH)} />}</SliderGroup><div className="grid grid-cols-2 gap-2"><Metric label="f(x)" value={y.toFixed(3)} /><Metric label={isIntegral ? "Δx" : "Secant slope"} value={isIntegral ? width.toFixed(3) : secant.toFixed(3)} /><Metric label="Exact f′" value={derivative} /><Metric label="Exact ∫f" value={integral} /></div></div></div>
  </AdapterFrame>;
}
function Grid() { return <g>{Array.from({ length: 11 }, (_, i) => <line key={`v${i}`} x1={i * 64} x2={i * 64} y1="0" y2="360" stroke="#cbd5e1" opacity=".28" />)}{Array.from({ length: 9 }, (_, i) => <line key={`h${i}`} x1="0" x2="640" y1={i * 45} y2={i * 45} stroke="#cbd5e1" opacity=".28" />)}<line x1="0" x2="640" y1={scaleY(0)} y2={scaleY(0)} stroke="#64748b" /><line x1={scaleX(0)} x2={scaleX(0)} y1="0" y2="360" stroke="#64748b" /></g>; }
function Metric({ label, value }: { label: string; value: string }) { return <div className="rounded-xl bg-slate-100 p-2 text-center dark:bg-white/10"><span className="block text-[10px] font-bold text-slate-500">{label}</span><strong className="break-all font-mono text-xs">{value}</strong></div>; }
