import { FunctionSquare, LineChart, ListTree, SlidersHorizontal, Table2 } from "lucide-react";
import { useMemo, useState, type ReactNode } from "react";
import SmartMathInput from "../../math-input/SmartMathInput";
import SliderControl, { SliderGroup } from "../../ui/SliderControl";
import { isGraphValidationBlocking, validateGraphExpression } from "../../../workspace/graphValidation";
import type { GraphValidationResult } from "../../../workspace/types/graphValidation";
import {
  buildAddedGraphPlots,
  graphInputPresets,
  inferPlotKind,
  regressionModel,
  removeGraphPlotById,
  samplePlotLayer,
  sampleTable,
  scaleX,
  scaleY,
  type GraphViewport,
  type PlotItem,
  type PlotKind,
  type ResultTableRow,
  applyGraphParameters,
} from "./graphPanelUtils";

export type { PlotItem, PlotKind, ResultTableRow } from "./graphPanelUtils";

export interface GraphWorkspacePanelProps {
  plots: PlotItem[];
  colors: string[];
  regressionSeed: ResultTableRow[];
  tableRange: { start: number; end: number; step: number };
  onChange: (plots: PlotItem[]) => void;
  onTableRangeChange: (range: { start: number; end: number; step: number }) => void;
  validationMessage?: GraphValidationResult | null;
}

export default function GraphWorkspacePanel({ plots, colors, regressionSeed, tableRange, onChange, onTableRangeChange, validationMessage = null }: GraphWorkspacePanelProps) {
  const [draft, setDraft] = useState("cos(x)");
  const [activePanel, setActivePanel] = useState<"input" | "plots" | "table">("input");
  const [graphValidation, setGraphValidation] = useState<GraphValidationResult | null>(validationMessage);
  const [xMin, setXMin] = useState(-10);
  const [xMax, setXMax] = useState(10);
  const [yMin, setYMin] = useState(-10);
  const [yMax, setYMax] = useState(10);
  const [sliderA, setSliderA] = useState(1);
  const [sliderB, setSliderB] = useState(0);
  const visiblePlots = useMemo(() => plots.filter((plot) => plot.visible !== false), [plots]);
  const viewport = useMemo(() => ({ xMin, xMax, yMin, yMax, width: 640, height: 360 }), [xMin, xMax, yMin, yMax]);
  const sampledLayers = useMemo(() => visiblePlots.map((plot) => samplePlotLayer(plot, viewport, sliderA, sliderB)), [visiblePlots, viewport, sliderA, sliderB]);
  const tableRows = useMemo(() => visiblePlots.slice(0, 3).flatMap((plot) => sampleTable(applyGraphParameters(plot.expression, sliderA, sliderB), plot.expression, tableRange.start, tableRange.end, tableRange.step)), [visiblePlots, sliderA, sliderB, tableRange.start, tableRange.end, tableRange.step]);
  const regression = useMemo(() => regressionModel(regressionSeed, "linear"), [regressionSeed]);
  const activeValidation = validationMessage ?? graphValidation;

  const addPlot = (expression: string, kind?: PlotKind) => {
    const validation = validateGraphExpression(expression);
    setGraphValidation(validation);
    if (isGraphValidationBlocking(validation)) return;
    onChange(buildAddedGraphPlots(plots, expression, colors, kind));
  };

  const updatePlot = (id: string, patch: Partial<PlotItem>) => onChange(plots.map((plot) => plot.id === id ? { ...plot, ...patch } : plot));
  const removePlot = (id: string) => onChange(removeGraphPlotById(plots, id));
  const addRegression = () => onChange([{ id: crypto.randomUUID(), expression: regression.expression, color: "#ec4899", kind: "regression" as PlotKind, points: regressionSeed, visible: true }, ...plots].slice(0, 10));

  return (
    <div className="space-y-3 rounded-2xl border border-slate-200 bg-white p-3 dark:border-white/10 dark:bg-slate-950/60">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="flex items-center gap-2 font-bold"><LineChart className="h-4 w-4 text-cyan-500" /> Interactive Graphing Lab</h2>
        <div className="flex flex-wrap gap-2 text-xs font-semibold text-slate-500">
          <span className="mini-chip">Functions</span><span className="mini-chip">Parametric</span><span className="mini-chip">Implicit</span><span className="mini-chip">Polar</span><span className="mini-chip">Inequalities</span><span className="mini-chip">Tables</span>
        </div>
      </div>

      <div className="grid items-start gap-3 2xl:grid-cols-[320px_minmax(0,1fr)]">
        <div className="space-y-3 rounded-2xl border border-slate-200 bg-slate-50 p-2 dark:border-white/10 dark:bg-white/5">
          <div className="grid grid-cols-3 gap-1 rounded-xl bg-white p-1 dark:bg-slate-950/70">
            <GraphPanelTab active={activePanel === "input"} icon={<FunctionSquare className="h-4 w-4" />} label="Input" onClick={() => setActivePanel("input")} />
            <GraphPanelTab active={activePanel === "plots"} icon={<ListTree className="h-4 w-4" />} label="Plots" onClick={() => setActivePanel("plots")} />
            <GraphPanelTab active={activePanel === "table"} icon={<Table2 className="h-4 w-4" />} label="Table" onClick={() => setActivePanel("table")} />
          </div>

          <div hidden={activePanel !== "input"} className="rounded-2xl bg-slate-100 p-3 dark:bg-white/10">
            <label className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400">Expression</label>
            <SmartMathInput
              ariaLabel="Smart graph expression editor"
              className="mt-2"
              compact
              mode="math"
              onChange={setDraft}
              onSubmit={() => addPlot(draft)}
              placeholder="sin(x), x^2+y^2=9, x=cos(t), y=sin(t), r=2*sin(theta)"
              rows={1}
              showLegend={false}
              value={draft}
            />
            <div className="mt-2 grid grid-cols-2 gap-2">
              <button type="button" onClick={() => addPlot(draft)} className="action-primary py-2">Add graph</button>
              <button type="button" onClick={() => addRegression()} className="action-secondary py-2">Regression</button>
            </div>
            {activeValidation && activeValidation.status !== "valid" ? (
              <div className={`mt-3 rounded-xl border p-3 text-xs font-bold leading-5 ${isGraphValidationBlocking(activeValidation) ? "border-amber-300 bg-amber-50 text-amber-900 dark:border-amber-300/30 dark:bg-amber-300/10 dark:text-amber-100" : "border-cyan-300 bg-cyan-50 text-cyan-900 dark:border-cyan-300/30 dark:bg-cyan-300/10 dark:text-cyan-100"}`} role="status" aria-live="polite" data-testid="workspace-graph-validation-message">
                <p>{activeValidation.message}</p>
                {activeValidation.suggestions?.length ? <p className="mt-1">Try: {activeValidation.suggestions.slice(0, 4).join(" | ")}</p> : null}
              </div>
            ) : null}
            <div className="mt-2 flex flex-wrap gap-1.5">
              {graphInputPresets.map((preset) => (
                <button key={preset.expression} type="button" onClick={() => setDraft(preset.expression)} className="mini-chip hover:bg-cyan-100 hover:text-cyan-800 dark:hover:bg-cyan-400/20 dark:hover:text-cyan-100">
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          <div hidden={activePanel !== "table"} className="rounded-2xl bg-slate-100 p-3 dark:bg-white/10">
            <p className="text-sm font-bold">Editable value table range</p>
            <div className="mt-2 grid grid-cols-3 gap-2">
              <GraphMiniNumber label="start" value={tableRange.start} onChange={(start) => onTableRangeChange({ ...tableRange, start })} />
              <GraphMiniNumber label="end" value={tableRange.end} onChange={(end) => onTableRangeChange({ ...tableRange, end })} />
              <GraphMiniNumber label="step" value={tableRange.step} onChange={(step) => onTableRangeChange({ ...tableRange, step: step || 1 })} />
            </div>
            <div className="mt-3 max-h-[320px] overflow-auto rounded-xl border border-slate-200 bg-white dark:border-white/10 dark:bg-slate-950">
              <table className="w-full min-w-[280px] text-left text-xs">
                <thead className="sticky top-0 bg-slate-100 text-slate-500 dark:bg-slate-900 dark:text-slate-300"><tr><th className="p-2">expr</th><th className="p-2">x</th><th className="p-2">y</th></tr></thead>
                <tbody>{tableRows.map((row, index) => <tr key={`${row.x}-${row.y}-${index}`} className="border-t border-slate-200 dark:border-white/10"><td className="max-w-[120px] truncate p-2 font-mono">{row.label}</td><td className="p-2 font-mono">{row.x}</td><td className="p-2 font-mono">{row.y}</td></tr>)}</tbody>
              </table>
            </div>
          </div>

          <div hidden={activePanel !== "plots"} className="space-y-2">
            {plots.map((plot) => (
              <div key={plot.id} className="rounded-2xl border border-slate-200 bg-white p-3 dark:border-white/10 dark:bg-white/5">
                <div className="grid grid-cols-[auto_auto_minmax(0,1fr)_auto] items-center gap-2">
                  <input type="checkbox" checked={plot.visible !== false} onChange={(event) => updatePlot(plot.id, { visible: event.target.checked })} />
                  <span className="h-3 w-3 rounded-full" style={{ background: plot.color }} />
                  <SmartMathInput
                    ariaLabel={`Edit graph expression ${plot.expression}`}
                    className="min-w-0 flex-1"
                    compact
                    mode="math"
                    onChange={(expression) => updatePlot(plot.id, { expression, kind: inferPlotKind(expression) })}
                    placeholder="x^2, sin(x), A subset B"
                    rows={1}
                    showInsights={false}
                    showLegend={false}
                    value={plot.expression}
                  />
                  <button type="button" onClick={() => removePlot(plot.id)} className="rounded-lg bg-rose-100 px-2 py-1 text-xs font-bold text-rose-700 dark:bg-rose-400/15 dark:text-rose-100">x</button>
                </div>
                <p className="mt-2 text-xs font-semibold text-slate-500">{plot.kind ?? inferPlotKind(plot.expression)}</p>
              </div>
            ))}
            {plots.length === 0 && <div className="rounded-xl bg-slate-100 p-3 text-sm font-bold text-slate-500 dark:bg-white/10 dark:text-slate-300">No graph objects yet.</div>}
          </div>

          <div className="grid grid-cols-2 gap-2">
            <GraphMiniNumber label="x min" value={xMin} onChange={setXMin} />
            <GraphMiniNumber label="x max" value={xMax} onChange={setXMax} />
            <GraphMiniNumber label="y min" value={yMin} onChange={setYMin} />
            <GraphMiniNumber label="y max" value={yMax} onChange={setYMax} />
          </div>
        </div>

        <div className="min-w-0 space-y-3">
          <svg viewBox="0 0 640 360" className="h-[240px] w-full rounded-xl bg-slate-50 dark:bg-slate-900 sm:h-[300px] 2xl:h-[340px]" data-testid="workspace-graph-surface">
            <GraphGrid viewport={viewport} />
            {sampledLayers.map((layer) => layer.cells.map((cell, index) => (
              <rect
                key={`${layer.id}-cell-${index}`}
                x={scaleX(cell.x, viewport)}
                y={scaleY(cell.y + cell.height, viewport)}
                width={Math.max(1, (cell.width / (viewport.xMax - viewport.xMin || 1)) * viewport.width)}
                height={Math.max(1, (cell.height / (viewport.yMax - viewport.yMin || 1)) * viewport.height)}
                fill={layer.color}
                opacity={layer.kind === "inequality" ? 0.12 : layer.kind === "implicit" ? 0.08 : 0.72}
              />
            )))}
            {sampledLayers.map((layer) => layer.paths.map((path, index) => <path key={`${layer.id}-path-${index}`} d={path} fill="none" stroke={layer.color} strokeWidth={layer.kind === "implicit" ? "2" : "3"} strokeLinecap="round" strokeLinejoin="round" />))}
            {visiblePlots.filter((plot) => plot.kind === "scatter" || plot.kind === "regression").flatMap((plot) => plot.points ?? []).map((point, index) => <circle key={`${point.x}-${point.y}-${index}`} cx={scaleX(point.x, viewport)} cy={scaleY(point.y, viewport)} r="5" fill="#ec4899" stroke="#0f172a" />)}
          </svg>

          <div className="grid items-start gap-3 lg:grid-cols-[minmax(0,1fr)_minmax(260px,320px)]">
            <div className="rounded-2xl bg-slate-100 p-3 dark:bg-white/10">
              <div className="mb-2 flex items-center gap-2 text-sm font-black"><SlidersHorizontal className="h-4 w-4 text-cyan-500" /> Parameters</div>
              <SliderGroup title="Parameter sliders">
                <SliderControl density="compact" label="a" value={sliderA} min={-5} max={5} step={0.1} onChange={setSliderA} />
                <SliderControl density="compact" label="b" value={sliderB} min={-10} max={10} step={0.1} onChange={setSliderB} />
              </SliderGroup>
              <p className="text-xs leading-5 text-slate-500 dark:text-slate-400">Use expressions like a*x+b or a*sin(x)+b.</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {sampledLayers.map((layer) => <span key={layer.id} className="mini-chip">{layer.kind}</span>)}
              </div>
            </div>
            <div className="max-h-[260px] overflow-auto rounded-2xl border border-slate-200 dark:border-white/10">
              <table className="min-w-[260px] w-full text-left text-xs">
                <thead className="bg-slate-100 text-slate-500 dark:bg-white/10 dark:text-slate-300"><tr><th className="p-2">expr</th><th className="p-2">x</th><th className="p-2">y</th></tr></thead>
                <tbody>{tableRows.map((row, index) => <tr key={`${row.x}-${row.y}-${index}`} className="border-t border-slate-200 dark:border-white/10"><td className="p-2 font-mono">{row.label}</td><td className="p-2 font-mono">{row.x}</td><td className="p-2 font-mono">{row.y}</td></tr>)}</tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function GraphPanelTab({ active, icon, label, onClick }: { active: boolean; icon: ReactNode; label: string; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className={`inline-flex min-h-9 items-center justify-center gap-1.5 rounded-lg px-2 text-xs font-black transition ${active ? "bg-cyan-500 text-white shadow-sm dark:bg-cyan-300 dark:text-slate-950" : "text-slate-500 hover:bg-cyan-50 hover:text-cyan-800 dark:text-slate-300 dark:hover:bg-cyan-300/10 dark:hover:text-cyan-100"}`}>
      {icon}
      {label}
    </button>
  );
}

function GraphGrid({ viewport }: { viewport: GraphViewport }) {
  const zeroX = scaleX(0, viewport);
  const zeroY = scaleY(0, viewport);
  return (
    <g>
      {Array.from({ length: 21 }, (_, i) => <line key={`v-${i}`} x1={i * 32} x2={i * 32} y1="0" y2="360" stroke="rgba(148,163,184,.22)" />)}
      {Array.from({ length: 13 }, (_, i) => <line key={`h-${i}`} x1="0" x2="640" y1={i * 30} y2={i * 30} stroke="rgba(148,163,184,.22)" />)}
      <line x1={zeroX} x2={zeroX} y1="0" y2="360" stroke="#64748b" strokeWidth="2" />
      <line x1="0" x2="640" y1={zeroY} y2={zeroY} stroke="#64748b" strokeWidth="2" />
    </g>
  );
}

function GraphMiniNumber({ label, value, onChange }: { label: string; value: number; onChange: (value: number) => void }) {
  return (
    <label className="rounded-xl bg-slate-100 p-2 text-xs font-bold dark:bg-white/10">
      {label}
      <input type="number" value={value} onChange={(event) => onChange(Number(event.target.value))} className="mt-1 w-full rounded-lg border border-slate-200 bg-white p-2 font-mono dark:border-white/10 dark:bg-slate-900" />
    </label>
  );
}
