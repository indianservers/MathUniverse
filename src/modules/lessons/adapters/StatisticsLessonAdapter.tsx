import { useEffect, useMemo, useState } from "react";
import SliderControl from "../../../components/ui/SliderControl";
import { linearRegression, type ResultTableRow } from "../../../components/workspace/panels/graphPanelUtils";
import { mean, median, mode, range } from "../../../utils/mathEngine/statisticsUtils";
import { createStatisticsWorkspaceObject } from "../../../workspace/dataWorkspaceIntegration";
import AdapterFrame from "../components/AdapterFrame";
import type { LessonAdapterProps } from "../types";
import { BoxPlotActivity } from "./p0/PriorityConceptActivities";

const baseValues = [2, 3, 4, 4, 5, 6, 7, 8];

export default function StatisticsLessonAdapter(props: LessonAdapterProps) {
  if (props.lesson.preset.id === "statistics.box-plot") return <AdapterFrame title={`${props.lesson.title} · five-number-summary lab`} footer="Quartiles, whiskers, and outliers use the standard 1.5 × IQR rule and update from the editable sample."><BoxPlotActivity {...props}/></AdapterFrame>;
  return <LegacyStatisticsLessonAdapter {...props}/>;
}

function LegacyStatisticsLessonAdapter({ lesson, resetToken, onInteraction }: LessonAdapterProps) {
  const [shift, setShift] = useState(0); const [outlier, setOutlier] = useState(10);
  useEffect(() => { setShift(0); setOutlier(10); }, [resetToken]);
  const values = useMemo(() => [...baseValues.map((value) => value + shift), outlier], [outlier, shift]);
  const points = useMemo<ResultTableRow[]>(() => values.map((value, index) => ({ x: index + 1, y: value })), [values]);
  const fit = useMemo(() => linearRegression(points), [points]);
  const linked = useMemo(() => createStatisticsWorkspaceObject(values, { id: `lesson-statistics-${lesson.id}` }), [lesson.id, values]);
  const max = Math.max(...values, 1); const min = Math.min(...values, 0);
  const sx = (x: number) => 35 + ((x - 1) / Math.max(1, points.length - 1)) * 570;
  const sy = (y: number) => 320 - ((y - min) / Math.max(1, max - min)) * 270;
  const regressionY = (x: number) => fit.slope * x + fit.intercept;
  const change = (setter: (value: number) => void) => (value: number) => { setter(value); onInteraction(); };
  return <AdapterFrame title={`${lesson.title} · data + graph`} value={linked.value} footer="The editable sample publishes to the shared statistics object and the graph uses the existing least-squares engine.">
    <div className="grid gap-3 xl:grid-cols-[minmax(0,1fr)_280px]"><div className="overflow-hidden rounded-xl bg-slate-50 dark:bg-slate-900"><svg viewBox="0 0 640 350" className="h-[300px] w-full" role="img" aria-label="Linked statistical plot"><line x1="30" x2="620" y1="320" y2="320" stroke="#64748b" /><line x1="30" x2="30" y1="20" y2="320" stroke="#64748b" /><line x1={sx(1)} y1={sy(regressionY(1))} x2={sx(points.length)} y2={sy(regressionY(points.length))} stroke="#f59e0b" strokeWidth="3" strokeDasharray="8 5" />{points.map((point, index) => <g key={index}><line x1={sx(point.x)} x2={sx(point.x)} y1="320" y2={sy(point.y)} stroke="#06b6d4" strokeWidth="12" opacity=".18" /><circle cx={sx(point.x)} cy={sy(point.y)} r="7" fill="#0891b2" /></g>)}</svg></div><div className="space-y-3"><SliderControl density="compact" label="Shift sample" value={shift} min={-3} max={3} step={1} onChange={change(setShift)} /><SliderControl density="compact" label="Outlier" value={outlier} min={-5} max={25} step={1} onChange={change(setOutlier)} /><div className="grid grid-cols-2 gap-2"><Metric label="Mean" value={mean(values).toFixed(2)} /><Metric label="Median" value={median(values).toFixed(2)} /><Metric label="Mode" value={mode(values).toFixed(2)} /><Metric label="Range" value={range(values).toFixed(2)} /><Metric label="Slope" value={fit.slope.toFixed(2)} /><Metric label="n" value={String(values.length)} /></div><p className="rounded-xl bg-slate-100 p-2 font-mono text-xs dark:bg-white/10">{values.join(", ")}</p></div></div>
  </AdapterFrame>;
}
function Metric({ label, value }: { label: string; value: string }) { return <div className="rounded-xl bg-slate-100 p-2 text-center dark:bg-white/10"><span className="block text-[10px] font-bold text-slate-500">{label}</span><strong className="font-mono text-sm">{value}</strong></div>; }
