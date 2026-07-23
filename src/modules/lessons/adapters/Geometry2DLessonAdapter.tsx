import { useEffect, useMemo, useState } from "react";
import SliderControl, { SliderGroup } from "../../../components/ui/SliderControl";
import { distanceBetween, line, midpoint, polygonArea, polygonPerimeter, relationBetween, type KernelPoint } from "../../../workspace/geometry2dKernel";
import AdapterFrame from "../components/AdapterFrame";
import type { LessonAdapterProps } from "../types";

const sx = (x: number) => 320 + x * 38;
const sy = (y: number) => 180 - y * 38;

function transformFor(title: string, point: KernelPoint, amount: number): KernelPoint {
  const name = title.toLowerCase();
  if (name.includes("reflect")) return { x: -point.x, y: point.y };
  if (name.includes("rotat")) { const angle = amount * Math.PI / 12; return { x: point.x * Math.cos(angle) - point.y * Math.sin(angle), y: point.x * Math.sin(angle) + point.y * Math.cos(angle) }; }
  if (name.includes("enlarge") || name.includes("dilat") || name.includes("scale")) return { x: point.x * amount / 2, y: point.y * amount / 2 };
  return { x: point.x + amount, y: point.y + 1 };
}

export default function Geometry2DLessonAdapter({ lesson, resetToken, onInteraction }: LessonAdapterProps) {
  const [ax, setAx] = useState(-3); const [ay, setAy] = useState(-1); const [bx, setBx] = useState(3); const [by, setBy] = useState(2); const [amount, setAmount] = useState(2);
  useEffect(() => { setAx(-3); setAy(-1); setBx(3); setBy(2); setAmount(2); }, [resetToken]);
  const a = useMemo(() => ({ x: ax, y: ay }), [ax, ay]); const b = useMemo(() => ({ x: bx, y: by }), [bx, by]);
  const mid = midpoint(a, b); const transformed = transformFor(lesson.title, b, amount); const distance = distanceBetween(a, b);
  const relation = relationBetween(line(a, b), line(mid, { x: mid.x - (b.y - a.y), y: mid.y + (b.x - a.x) }));
  const polygon = [a, b, transformed];
  const isTransform = /transform|reflect|rotat|translat|enlarg|dilat|loci|locus|symmetr/i.test(lesson.title);
  const tools = /circle|arc|tangent/i.test(lesson.title) ? ["Point", "Circle", "Measure"] : /polygon|triangle|quadrilateral/i.test(lesson.title) ? ["Point", "Polygon", "Measure"] : ["Point", "Segment", "Relation"];
  const update = (setter: (value: number) => void) => (value: number) => { setter(value); onInteraction(); };
  return <AdapterFrame title={`${lesson.title} · construction`} value={isTransform ? `B′ (${transformed.x.toFixed(1)}, ${transformed.y.toFixed(1)})` : `AB = ${distance.toFixed(2)}`} footer={`Whitelisted tools: ${tools.join(", ")}. Checks use kernel distances, areas, and relations.`}>
    <div className="grid gap-3 xl:grid-cols-[minmax(0,1fr)_290px]"><div className="overflow-hidden rounded-xl bg-slate-50 dark:bg-slate-900"><svg viewBox="0 0 640 360" className="h-[310px] w-full" role="img" aria-label="Interactive coordinate construction"><GeometryGrid />{isTransform ? <><polygon points={polygon.map((p) => `${sx(p.x)},${sy(p.y)}`).join(" ")} fill="#06b6d4" opacity=".16" stroke="#06b6d4" strokeWidth="3" /><line x1={sx(b.x)} y1={sy(b.y)} x2={sx(transformed.x)} y2={sy(transformed.y)} stroke="#f59e0b" strokeDasharray="7 5" strokeWidth="2" /></> : <><line x1={sx(a.x)} y1={sy(a.y)} x2={sx(b.x)} y2={sy(b.y)} stroke="#06b6d4" strokeWidth="4" /><circle cx={sx(mid.x)} cy={sy(mid.y)} r="6" fill="#f59e0b" /></>}<PointMark point={a} label="A" /><PointMark point={b} label="B" />{isTransform ? <PointMark point={transformed} label="B′" accent /> : null}</svg></div><div className="space-y-3"><div className="flex flex-wrap gap-1">{tools.map((tool) => <span key={tool} className="rounded-full bg-cyan-50 px-2 py-1 text-[10px] font-black text-cyan-700 dark:bg-cyan-400/10 dark:text-cyan-100">{tool}</span>)}</div><SliderGroup title="Seeded points"><SliderControl density="compact" label="A x" value={ax} min={-6} max={6} step={0.5} onChange={update(setAx)} /><SliderControl density="compact" label="A y" value={ay} min={-4} max={4} step={0.5} onChange={update(setAy)} /><SliderControl density="compact" label="B x" value={bx} min={-6} max={6} step={0.5} onChange={update(setBx)} /><SliderControl density="compact" label="B y" value={by} min={-4} max={4} step={0.5} onChange={update(setBy)} /></SliderGroup>{isTransform ? <SliderControl density="compact" label="Transform" value={amount} min={-4} max={4} step={0.5} onChange={update(setAmount)} /> : null}<div className="grid grid-cols-2 gap-2 text-center text-xs"><Metric label="Midpoint" value={`${mid.x.toFixed(1)}, ${mid.y.toFixed(1)}`} /><Metric label="Invariant" value={isTransform ? `Area ${polygonArea(polygon).toFixed(1)}` : relation.relation} /><Metric label="Perimeter" value={polygonPerimeter(polygon).toFixed(1)} /><Metric label="Tolerance" value="10⁻⁷" /></div></div></div>
  </AdapterFrame>;
}
function GeometryGrid() { return <g>{Array.from({ length: 17 }, (_, i) => <line key={`v${i}`} x1={i * 38 + 16} x2={i * 38 + 16} y1="0" y2="360" stroke="#cbd5e1" opacity=".3" />)}{Array.from({ length: 11 }, (_, i) => <line key={`h${i}`} x1="0" x2="640" y1={i * 38 - 10} y2={i * 38 - 10} stroke="#cbd5e1" opacity=".3" />)}<line x1="0" x2="640" y1="180" y2="180" stroke="#64748b" /><line x1="320" x2="320" y1="0" y2="360" stroke="#64748b" /></g>; }
function PointMark({ point, label, accent = false }: { point: KernelPoint; label: string; accent?: boolean }) { return <g><circle cx={sx(point.x)} cy={sy(point.y)} r="8" fill={accent ? "#f59e0b" : "#0891b2"} /><text x={sx(point.x) + 11} y={sy(point.y) - 10} fontWeight="800" fill="#334155">{label}</text></g>; }
function Metric({ label, value }: { label: string; value: string }) { return <div className="rounded-xl bg-slate-100 p-2 dark:bg-white/10"><span className="block text-[10px] font-bold text-slate-500">{label}</span><strong>{value}</strong></div>; }
