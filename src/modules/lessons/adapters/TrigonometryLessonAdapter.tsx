import { useEffect, useMemo, useState } from "react";
import SliderControl from "../../../components/ui/SliderControl";
import { samplePlotLayer, type GraphViewport, type PlotItem } from "../../../components/workspace/panels/graphPanelUtils";
import { computeTrigFormulaValues, formatTrigNumber } from "../../../trigonometry/utils/trigFormulaUtils";
import AdapterFrame from "../components/AdapterFrame";
import type { LessonAdapterProps } from "../types";

const viewport: GraphViewport = { xMin: -Math.PI * 2, xMax: Math.PI * 2, yMin: -2, yMax: 2, width: 640, height: 190 };

export default function TrigonometryLessonAdapter({ lesson, resetToken, onInteraction }: LessonAdapterProps) {
  const initial = [30, 45, 60][lesson.id % 3];
  const [angle, setAngle] = useState(initial);
  useEffect(() => setAngle(initial), [initial, resetToken]);
  const values = computeTrigFormulaValues(angle);
  const radians = values.radians; const px = 160 + values.cos * 112; const py = 150 - values.sin * 112;
  const family = /cos/i.test(lesson.title) ? "cos" : /tan/i.test(lesson.title) ? "tan" : "sin";
  const plot = useMemo<PlotItem>(() => ({ id: `trig-${lesson.id}`, expression: `${family}(x)`, color: "#06b6d4", kind: "function", visible: true }), [family, lesson.id]);
  const layer = useMemo(() => samplePlotLayer(plot, viewport, 1, 0), [plot]);
  const graphX = ((radians - viewport.xMin) / (viewport.xMax - viewport.xMin)) * 640;
  const graphValue = family === "cos" ? values.cos : family === "tan" ? values.tan ?? 0 : values.sin;
  const graphY = viewport.height - ((graphValue - viewport.yMin) / (viewport.yMax - viewport.yMin)) * viewport.height;
  return <AdapterFrame title={`${lesson.title} · linked angle`} value={`${angle}° · ${values.radiansLabel}`} footer="One angle drives the unit circle, triangle ratios, and sampled trig graph in the same update cycle.">
    <div className="grid gap-3 xl:grid-cols-[340px_minmax(0,1fr)_250px]"><div className="rounded-xl bg-slate-50 dark:bg-slate-900"><svg viewBox="0 0 320 300" className="h-[300px] w-full" role="img" aria-label={`Unit circle at ${angle} degrees`}><circle cx="160" cy="150" r="112" fill="none" stroke="#94a3b8" strokeWidth="2" /><line x1="30" x2="290" y1="150" y2="150" stroke="#94a3b8" /><line x1="160" x2="160" y1="20" y2="280" stroke="#94a3b8" /><line x1="160" y1="150" x2={px} y2={py} stroke="#06b6d4" strokeWidth="4" /><line x1={px} y1={py} x2={px} y2="150" stroke="#f59e0b" strokeWidth="3" strokeDasharray="6 4" /><circle cx={px} cy={py} r="8" fill="#06b6d4" /><text x={px + 8} y={py - 8} fontWeight="800" fill="#334155">(cos θ, sin θ)</text></svg></div><div className="overflow-hidden rounded-xl bg-slate-50 dark:bg-slate-900"><svg viewBox="0 0 640 190" className="h-[220px] w-full" role="img" aria-label={`${family} graph linked to angle`}><line x1="0" x2="640" y1="95" y2="95" stroke="#64748b" />{layer.paths.map((path, i) => <path key={i} d={path} fill="none" stroke="#06b6d4" strokeWidth="4" />)}<line x1={graphX} x2={graphX} y1="0" y2="190" stroke="#f59e0b" strokeDasharray="6 4" /><circle cx={graphX} cy={graphY} r="7" fill="#f59e0b" /></svg></div><div className="space-y-3"><SliderControl density="compact" label="Angle θ" value={angle} min={-360} max={360} step={1} unit="°" onChange={(value) => { setAngle(value); onInteraction(); }} /><div className="grid grid-cols-2 gap-2"><Metric label="sin θ" value={formatTrigNumber(values.sin)} /><Metric label="cos θ" value={formatTrigNumber(values.cos)} /><Metric label="tan θ" value={values.tan === null ? "undefined" : formatTrigNumber(values.tan)} /><Metric label="sin²+cos²" value={formatTrigNumber(values.identitySum)} /></div></div></div>
  </AdapterFrame>;
}
function Metric({ label, value }: { label: string; value: string }) { return <div className="rounded-xl bg-slate-100 p-2 text-center dark:bg-white/10"><span className="block text-[10px] font-bold text-slate-500">{label}</span><strong className="font-mono text-sm">{value}</strong></div>; }
