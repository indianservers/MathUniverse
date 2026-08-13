import { Copy, Eye, EyeOff, FunctionSquare, LineChart, ListTree, Lock, Palette, SlidersHorizontal, Table2, Trash2, Unlock } from "lucide-react";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import SmartMathInput from "../../math-input/SmartMathInput";
import SliderControl, { SliderGroup } from "../../ui/SliderControl";
import { isGraphValidationBlocking, validateGraphExpression } from "../../../workspace/graphValidation";
import type { GraphValidationResult } from "../../../workspace/types/graphValidation";
import { readLinkedParameters, saveLinkedParameter } from "../../../workspace/linkedParameters";
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
  const queryParameters = useMemo(() => typeof window === "undefined" ? new URLSearchParams() : new URLSearchParams(window.location.search), []);
  const [draft, setDraft] = useState(() => queryParameters.get("q")?.trim() || "cos(x)");
  const [activePanel, setActivePanel] = useState<"studio" | "table">("studio");
  const [selectedPlotId, setSelectedPlotId] = useState(() => plots[0]?.id ?? "");
  const [hoveredPlotId, setHoveredPlotId] = useState<string | null>(null);
  const [graphValidation, setGraphValidation] = useState<GraphValidationResult | null>(validationMessage);
  const [xMin, setXMin] = useState(-10);
  const [xMax, setXMax] = useState(10);
  const [yMin, setYMin] = useState(-10);
  const [yMax, setYMax] = useState(10);
  const initialParameters = useMemo(() => readLinkedParameters(), []);
  const [sliderA, setSliderA] = useState(() => numericParameter(queryParameters.get("v_a"), initialParameters.a?.value ?? 1));
  const [sliderB, setSliderB] = useState(() => numericParameter(queryParameters.get("v_b"), initialParameters.b?.value ?? 0));
  const visiblePlots = useMemo(() => plots.filter((plot) => plot.visible !== false), [plots]);
  const viewport = useMemo(() => ({ xMin, xMax, yMin, yMax, width: 640, height: 360 }), [xMin, xMax, yMin, yMax]);
  const sampledLayers = useMemo(() => visiblePlots.map((plot) => samplePlotLayer(plot, viewport, sliderA, sliderB)), [visiblePlots, viewport, sliderA, sliderB]);
  const tableRows = useMemo(() => visiblePlots.slice(0, 3).flatMap((plot) => sampleTable(applyGraphParameters(plot.expression, sliderA, sliderB), plot.expression, tableRange.start, tableRange.end, tableRange.step)), [visiblePlots, sliderA, sliderB, tableRange.start, tableRange.end, tableRange.step]);
  const regression = useMemo(() => regressionModel(regressionSeed, "linear"), [regressionSeed]);
  const activeValidation = validationMessage ?? graphValidation;
  const selectedPlot = plots.find((plot) => plot.id === selectedPlotId) ?? plots[0] ?? null;

  useEffect(() => { saveLinkedParameter({ name: "a", value: sliderA, min: -5, max: 5, step: 0.1, integer: false }); syncParameterQuery("v_a", sliderA); }, [sliderA]);
  useEffect(() => { saveLinkedParameter({ name: "b", value: sliderB, min: -10, max: 10, step: 0.1, integer: false }); syncParameterQuery("v_b", sliderB); }, [sliderB]);
  useEffect(() => {
    if (!plots.length) {
      setSelectedPlotId("");
      return;
    }
    if (!plots.some((plot) => plot.id === selectedPlotId)) setSelectedPlotId(plots[0].id);
  }, [plots, selectedPlotId]);

  const addPlot = (expression: string, kind?: PlotKind) => {
    const validation = validateGraphExpression(expression);
    setGraphValidation(validation);
    if (isGraphValidationBlocking(validation)) return;
    const nextPlots = buildAddedGraphPlots(plots, expression, colors, kind);
    setSelectedPlotId(nextPlots[0]?.id ?? "");
    onChange(nextPlots);
  };

  const updatePlot = (id: string, patch: Partial<PlotItem>) => onChange(plots.map((plot) => plot.id === id ? { ...plot, ...patch } : plot));
  const removePlot = (id: string) => {
    const nextPlots = removeGraphPlotById(plots, id);
    setSelectedPlotId(nextPlots[0]?.id ?? "");
    onChange(nextPlots);
  };
  const addRegression = () => {
    const regressionPlot = { id: crypto.randomUUID(), expression: regression.expression, color: "#ec4899", kind: "regression" as PlotKind, points: regressionSeed, visible: true };
    setSelectedPlotId(regressionPlot.id);
    onChange([regressionPlot, ...plots].slice(0, 10));
  };
  const duplicatePlot = (plot: PlotItem) => {
    const duplicate = { ...plot, id: crypto.randomUUID(), name: plot.name ? `${plot.name} copy` : undefined, color: colors[(plots.length + 1) % colors.length], locked: false };
    setSelectedPlotId(duplicate.id);
    onChange([duplicate, ...plots].slice(0, 10));
  };

  return (
    <div className="graph-workspace-panel space-y-3 rounded-2xl border border-slate-200 bg-white p-3 dark:border-white/10 dark:bg-slate-950/60">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="flex items-center gap-2 font-bold"><LineChart className="h-4 w-4 text-cyan-500" /> Interactive Graphing Lab<span className="sr-only"> (Desmos-style Graphing Lab)</span></h2>
        <div className="flex flex-wrap gap-2 text-xs font-semibold text-slate-500">
          <span className="mini-chip">Functions</span><span className="mini-chip">Parametric</span><span className="mini-chip">Implicit</span><span className="mini-chip">Polar</span><span className="mini-chip">Inequalities</span><span className="mini-chip">Tables</span>
        </div>
      </div>

      <div className="graph-workspace-panel-grid grid items-start gap-3 xl:grid-cols-[320px_minmax(0,1fr)]">
        <div className="graph-workspace-controls space-y-3 rounded-2xl border border-slate-200 bg-slate-50 p-2 dark:border-white/10 dark:bg-white/5">
          <div className="grid grid-cols-2 gap-1 rounded-xl bg-white p-1 dark:bg-slate-950/70">
            <GraphPanelTab active={activePanel === "studio"} icon={<FunctionSquare className="h-4 w-4" />} label="Studio" onClick={() => setActivePanel("studio")} />
            <GraphPanelTab active={activePanel === "table"} icon={<Table2 className="h-4 w-4" />} label="Table" onClick={() => setActivePanel("table")} />
          </div>

          <div hidden={activePanel !== "studio"} className="space-y-3">
            <div className="rounded-2xl bg-white p-3 shadow-sm ring-1 ring-slate-200 dark:bg-slate-950/70 dark:ring-white/10">
              <div className="flex items-center justify-between gap-2">
                <label className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400">Expression</label>
                <span className="rounded-full bg-cyan-50 px-2 py-1 text-[10px] font-black uppercase text-cyan-700 dark:bg-cyan-300/10 dark:text-cyan-100">Input + Plots</span>
              </div>
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

            <div className="space-y-2 rounded-2xl bg-slate-100 p-2 dark:bg-white/10">
              <div className="flex items-center justify-between px-1">
                <p className="flex items-center gap-2 text-xs font-black uppercase text-slate-500 dark:text-slate-300"><ListTree className="h-4 w-4" /> Graph objects</p>
                <span className="text-[10px] font-bold text-slate-500">{plots.length}/10</span>
              </div>
              {plots.map((plot) => (
                <div
                  key={plot.id}
                  onMouseEnter={() => setHoveredPlotId(plot.id)}
                  onMouseLeave={() => setHoveredPlotId(null)}
                  className={`grid grid-cols-[minmax(0,1fr)_auto] items-center gap-1 rounded-xl border p-2 transition ${selectedPlot?.id === plot.id ? "border-cyan-400 bg-white shadow-sm dark:border-cyan-300 dark:bg-cyan-300/10" : "border-slate-200 bg-white/75 hover:border-cyan-200 hover:bg-white dark:border-white/10 dark:bg-slate-950/50 dark:hover:border-cyan-300/30"}`}
                >
                  <button type="button" onClick={() => setSelectedPlotId(plot.id)} className="min-w-0 text-left" aria-label={`Select graph ${plot.name || plot.expression}`}>
                    <span className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-2">
                      <span className="h-4 w-4 rounded-full ring-2 ring-white dark:ring-slate-950" style={{ background: plot.color }} />
                      <span className="min-w-0">
                        <span className="block truncate font-mono text-xs font-black text-slate-900 dark:text-slate-100">{plot.name || plot.expression}</span>
                        <span className="mt-0.5 block text-[10px] font-bold uppercase text-slate-500">{plot.kind ?? inferPlotKind(plot.expression)}{plot.locked ? " | locked" : ""}</span>
                      </span>
                    </span>
                  </button>
                  <div className="flex gap-1">
                    <GraphIconButton label={plot.visible === false ? `Show ${plot.name || plot.expression}` : `Hide ${plot.name || plot.expression}`} onClick={() => updatePlot(plot.id, { visible: plot.visible === false })} icon={plot.visible === false ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />} />
                    <GraphIconButton label={plot.locked ? `Unlock ${plot.name || plot.expression}` : `Lock ${plot.name || plot.expression}`} onClick={() => updatePlot(plot.id, { locked: !plot.locked })} icon={plot.locked ? <Lock className="h-4 w-4" /> : <Unlock className="h-4 w-4" />} />
                  </div>
                </div>
              ))}
              {plots.length === 0 && <div className="rounded-xl bg-white p-3 text-sm font-bold text-slate-500 dark:bg-slate-950/60 dark:text-slate-300">No graph objects yet.</div>}
            </div>

            {selectedPlot ? (
              <div className="rounded-2xl border border-cyan-200 bg-white p-3 shadow-sm dark:border-cyan-300/20 dark:bg-slate-950/70">
                <div className="mb-3 flex items-center justify-between gap-2">
                  <p className="flex items-center gap-2 text-sm font-black"><Palette className="h-4 w-4 text-cyan-500" /> Selected graph</p>
                  <div className="flex gap-1">
                    <GraphIconButton label={selectedPlot.visible === false ? "Show graph" : "Hide graph"} onClick={() => updatePlot(selectedPlot.id, { visible: selectedPlot.visible === false })} icon={selectedPlot.visible === false ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />} />
                    <GraphIconButton label={selectedPlot.locked ? "Unlock graph" : "Lock graph"} onClick={() => updatePlot(selectedPlot.id, { locked: !selectedPlot.locked })} icon={selectedPlot.locked ? <Unlock className="h-4 w-4" /> : <Lock className="h-4 w-4" />} />
                    <GraphIconButton label="Duplicate graph" onClick={() => duplicatePlot(selectedPlot)} icon={<Copy className="h-4 w-4" />} />
                    <GraphIconButton label="Delete graph" danger onClick={() => removePlot(selectedPlot.id)} icon={<Trash2 className="h-4 w-4" />} />
                  </div>
                </div>
                <GraphTextField label="name" value={selectedPlot.name ?? ""} placeholder="f(x), circle, model A" onChange={(name) => updatePlot(selectedPlot.id, { name })} disabled={selectedPlot.locked} />
                <div className="mt-2">
                  <SmartMathInput
                    ariaLabel={`Edit graph expression ${selectedPlot.expression}`}
                    className="min-w-0 flex-1"
                    compact
                    mode="math"
                    onChange={(expression) => !selectedPlot.locked && updatePlot(selectedPlot.id, { expression, kind: inferPlotKind(expression) })}
                    placeholder="x^2, sin(x), A subset B"
                    rows={1}
                    showInsights={false}
                    showLegend={false}
                    value={selectedPlot.expression}
                  />
                </div>
                <div className="mt-3 grid grid-cols-[1fr_auto] items-end gap-2">
                  <label className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400">
                    Color
                    <input type="color" value={selectedPlot.color} disabled={selectedPlot.locked} onChange={(event) => updatePlot(selectedPlot.id, { color: event.target.value })} className="mt-1 h-10 w-full rounded-lg border border-slate-200 bg-white p-1 dark:border-white/10 dark:bg-slate-900" />
                  </label>
                  <span className="rounded-lg bg-slate-100 px-2 py-2 font-mono text-xs font-bold text-slate-600 dark:bg-white/10 dark:text-slate-200">{selectedPlot.color}</span>
                </div>
                <div className="mt-2 grid grid-cols-7 gap-1">
                  {colors.map((color) => (
                    <button key={color} type="button" disabled={selectedPlot.locked} aria-label={`Set selected graph color ${color}`} onClick={() => updatePlot(selectedPlot.id, { color })} className={`h-8 rounded-lg border transition ${selectedPlot.color.toLowerCase() === color.toLowerCase() ? "border-slate-950 ring-2 ring-cyan-300 dark:border-white" : "border-white/80 hover:scale-105 dark:border-slate-700"}`} style={{ background: color }} />
                  ))}
                </div>
                <p className="mt-3 rounded-xl bg-slate-100 p-2 text-xs font-bold text-slate-500 dark:bg-white/10 dark:text-slate-300">{selectedPlot.kind ?? inferPlotKind(selectedPlot.expression)} | {selectedPlot.visible === false ? "hidden" : "visible"} | {selectedPlot.locked ? "locked" : "editable"}</p>
              </div>
            ) : null}
          </div>

          <div className="grid grid-cols-2 gap-2">
            <GraphMiniNumber label="x min" value={xMin} onChange={setXMin} />
            <GraphMiniNumber label="x max" value={xMax} onChange={setXMax} />
            <GraphMiniNumber label="y min" value={yMin} onChange={setYMin} />
            <GraphMiniNumber label="y max" value={yMax} onChange={setYMax} />
          </div>

          <div hidden={activePanel !== "table"} className="rounded-2xl bg-slate-100 p-3 dark:bg-white/10">
            <p className="text-sm font-bold">Editable value table range</p>
            <div className="mt-2 grid grid-cols-3 gap-2">
              <GraphMiniNumber label="start" value={tableRange.start} onChange={(start) => onTableRangeChange({ ...tableRange, start })} />
              <GraphMiniNumber label="end" value={tableRange.end} onChange={(end) => onTableRangeChange({ ...tableRange, end })} />
              <GraphMiniNumber label="step" value={tableRange.step} onChange={(step) => onTableRangeChange({ ...tableRange, step: step || 1 })} />
            </div>
            <div className="mt-3 max-h-[420px] overflow-auto rounded-xl border border-slate-200 bg-white dark:border-white/10 dark:bg-slate-950">
              <table className="w-full min-w-[280px] text-left text-xs">
                <thead className="sticky top-0 bg-slate-100 text-slate-500 dark:bg-slate-900 dark:text-slate-300"><tr><th className="p-2">expr</th><th className="p-2">x</th><th className="p-2">y</th></tr></thead>
                <tbody>{tableRows.map((row, index) => <tr key={`${row.x}-${row.y}-${index}`} className="border-t border-slate-200 dark:border-white/10"><td className="max-w-[120px] truncate p-2 font-mono">{row.label}</td><td className="p-2 font-mono">{row.x}</td><td className="p-2 font-mono">{row.y}</td></tr>)}</tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="graph-workspace-visual min-w-0 space-y-3">
          <svg viewBox="0 0 640 360" className="graph-workspace-surface h-[240px] w-full rounded-xl bg-slate-50 dark:bg-slate-900 sm:h-[300px] xl:h-[340px]" data-testid="workspace-graph-surface">
            <GraphGrid viewport={viewport} />
            {sampledLayers.map((layer) => layer.cells.map((cell, index) => (
              <rect
                key={`${layer.id}-cell-${index}`}
                x={scaleX(cell.x, viewport)}
                y={scaleY(cell.y + cell.height, viewport)}
                width={Math.max(1, (cell.width / (viewport.xMax - viewport.xMin || 1)) * viewport.width)}
                height={Math.max(1, (cell.height / (viewport.yMax - viewport.yMin || 1)) * viewport.height)}
                fill={layer.color}
                opacity={layer.id === selectedPlot?.id || layer.id === hoveredPlotId ? 0.22 : layer.kind === "inequality" ? 0.12 : layer.kind === "implicit" ? 0.08 : 0.72}
                onClick={() => setSelectedPlotId(layer.id)}
                onMouseEnter={() => setHoveredPlotId(layer.id)}
                onMouseLeave={() => setHoveredPlotId(null)}
                className="cursor-pointer transition-opacity"
              />
            )))}
            {sampledLayers.map((layer) => layer.paths.map((path, index) => {
              const active = layer.id === selectedPlot?.id || layer.id === hoveredPlotId;
              return (
                <path
                  key={`${layer.id}-path-${index}`}
                  d={path}
                  fill="none"
                  stroke={layer.color}
                  strokeWidth={active ? "5" : layer.kind === "implicit" ? "2" : "3"}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  opacity={active ? 1 : 0.88}
                  filter={active ? "drop-shadow(0 0 5px rgba(8,145,178,.45))" : undefined}
                  onClick={() => setSelectedPlotId(layer.id)}
                  onMouseEnter={() => setHoveredPlotId(layer.id)}
                  onMouseLeave={() => setHoveredPlotId(null)}
                  className="cursor-pointer transition-opacity"
                />
              );
            }))}
            {visiblePlots.filter((plot) => plot.kind === "scatter" || plot.kind === "regression").flatMap((plot) => (plot.points ?? []).map((point, index) => {
              const active = plot.id === selectedPlot?.id || plot.id === hoveredPlotId;
              return (
                <circle
                  key={`${plot.id}-${point.x}-${point.y}-${index}`}
                  cx={scaleX(point.x, viewport)}
                  cy={scaleY(point.y, viewport)}
                  r={active ? "7" : "5"}
                  fill={plot.color}
                  stroke={active ? "#0891b2" : "#0f172a"}
                  strokeWidth={active ? "3" : "1.5"}
                  onClick={() => setSelectedPlotId(plot.id)}
                  onMouseEnter={() => setHoveredPlotId(plot.id)}
                  onMouseLeave={() => setHoveredPlotId(null)}
                  className="cursor-pointer"
                />
              );
            }))}
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
      <div className="graph-workspace-status" role="status">
        <span><strong>{visiblePlots.length}</strong> visible plot{visiblePlots.length === 1 ? "" : "s"}</span>
        <span>x: {xMin} to {xMax}</span>
        <span>y: {yMin} to {yMax}</span>
        <span><strong>a</strong> = {sliderA.toFixed(1)}</span>
        <span><strong>b</strong> = {sliderB.toFixed(1)}</span>
        <span className="graph-workspace-status-ready">Live sampling ready</span>
      </div>
    </div>
  );
}

function numericParameter(raw: string | null, fallback: number) {
  const value = Number(raw);
  return raw !== null && Number.isFinite(value) ? value : fallback;
}

function syncParameterQuery(name: string, value: number) {
  if (typeof window === "undefined") return;
  const url = new URL(window.location.href);
  url.searchParams.set(name, String(value));
  window.history.replaceState(window.history.state, "", url);
}

function GraphPanelTab({ active, icon, label, onClick }: { active: boolean; icon: ReactNode; label: string; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className={`inline-flex min-h-9 items-center justify-center gap-1.5 rounded-lg px-2 text-xs font-black transition ${active ? "bg-cyan-500 text-white shadow-sm dark:bg-cyan-300 dark:text-slate-950" : "text-slate-500 hover:bg-cyan-50 hover:text-cyan-800 dark:text-slate-300 dark:hover:bg-cyan-300/10 dark:hover:text-cyan-100"}`}>
      {icon}
      {label}
    </button>
  );
}

function GraphIconButton({ danger = false, icon, label, onClick }: { danger?: boolean; icon: ReactNode; label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      className={`grid h-8 w-8 place-items-center rounded-lg border text-xs transition ${danger ? "border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 dark:border-rose-300/20 dark:bg-rose-300/10 dark:text-rose-100" : "border-slate-200 bg-slate-50 text-slate-600 hover:border-cyan-200 hover:bg-cyan-50 hover:text-cyan-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-200 dark:hover:bg-cyan-300/10"}`}
    >
      {icon}
    </button>
  );
}

function GraphTextField({ disabled = false, label, onChange, placeholder, value }: { disabled?: boolean; label: string; onChange: (value: string) => void; placeholder?: string; value: string }) {
  return (
    <label className="block text-xs font-bold uppercase text-slate-500 dark:text-slate-400">
      {label}
      <input
        type="text"
        disabled={disabled}
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="mt-1 w-full rounded-lg border border-slate-200 bg-white p-2 text-sm font-bold text-slate-900 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 disabled:cursor-not-allowed disabled:opacity-60 dark:border-white/10 dark:bg-slate-900 dark:text-slate-100 dark:focus:ring-cyan-300/15"
      />
    </label>
  );
}

function GraphGrid({ viewport }: { viewport: GraphViewport }) {
  const zeroX = scaleX(0, viewport);
  const zeroY = scaleY(0, viewport);
  const xTicks = axisTicks(viewport.xMin, viewport.xMax, 10);
  const yTicks = axisTicks(viewport.yMin, viewport.yMax, 8);
  const xAxisVisible = zeroY >= 0 && zeroY <= viewport.height;
  const yAxisVisible = zeroX >= 0 && zeroX <= viewport.width;
  const xTickY = Math.min(viewport.height - 18, Math.max(18, zeroY + 18));
  const yTickX = Math.min(viewport.width - 32, Math.max(32, zeroX - 8));
  const unitX0 = scaleX(0, viewport);
  const unitX1 = scaleX(1, viewport);
  const unitY0 = scaleY(0, viewport);
  const unitY1 = scaleY(1, viewport);
  const showXUnit = xAxisVisible && isInRange(0, viewport.xMin, viewport.xMax) && isInRange(1, viewport.xMin, viewport.xMax);
  const showYUnit = yAxisVisible && isInRange(0, viewport.yMin, viewport.yMax) && isInRange(1, viewport.yMin, viewport.yMax);
  return (
    <g>
      {Array.from({ length: 21 }, (_, i) => <line key={`v-${i}`} x1={i * 32} x2={i * 32} y1="0" y2="360" stroke="rgba(148,163,184,.22)" />)}
      {Array.from({ length: 13 }, (_, i) => <line key={`h-${i}`} x1="0" x2="640" y1={i * 30} y2={i * 30} stroke="rgba(148,163,184,.22)" />)}
      <line x1={zeroX} x2={zeroX} y1="0" y2="360" stroke="#64748b" strokeWidth="2" />
      <line x1="0" x2="640" y1={zeroY} y2={zeroY} stroke="#64748b" strokeWidth="2" />
      {xTicks.map((tick) => {
        const x = scaleX(tick, viewport);
        return (
          <g key={`x-tick-${tick}`}>
            <line x1={x} x2={x} y1={xAxisVisible ? zeroY - 5 : viewport.height - 22} y2={xAxisVisible ? zeroY + 5 : viewport.height - 12} stroke="#475569" strokeWidth="1.5" />
            {tick !== 0 ? (
              <text x={x} y={xAxisVisible ? xTickY : viewport.height - 6} textAnchor="middle" className="fill-slate-600 text-[10px] font-bold dark:fill-slate-300">
                {formatAxisTick(tick)}
              </text>
            ) : null}
          </g>
        );
      })}
      {yTicks.map((tick) => {
        const y = scaleY(tick, viewport);
        return (
          <g key={`y-tick-${tick}`}>
            <line x1={yAxisVisible ? zeroX - 5 : 12} x2={yAxisVisible ? zeroX + 5 : 22} y1={y} y2={y} stroke="#475569" strokeWidth="1.5" />
            {tick !== 0 ? (
              <text x={yAxisVisible ? yTickX : 28} y={y + 3} textAnchor={yAxisVisible ? "end" : "start"} className="fill-slate-600 text-[10px] font-bold dark:fill-slate-300">
                {formatAxisTick(tick)}
              </text>
            ) : null}
          </g>
        );
      })}
      {showXUnit ? (
        <g>
          <line x1={unitX0} x2={unitX1} y1={zeroY - 18} y2={zeroY - 18} stroke="#0891b2" strokeWidth="2" />
          <line x1={unitX0} x2={unitX0} y1={zeroY - 22} y2={zeroY - 14} stroke="#0891b2" strokeWidth="2" />
          <line x1={unitX1} x2={unitX1} y1={zeroY - 22} y2={zeroY - 14} stroke="#0891b2" strokeWidth="2" />
          <text x={(unitX0 + unitX1) / 2} y={zeroY - 24} textAnchor="middle" className="fill-cyan-700 text-[10px] font-black dark:fill-cyan-200">
            1 unit
          </text>
        </g>
      ) : null}
      {showYUnit ? (
        <g>
          <line x1={zeroX + 18} x2={zeroX + 18} y1={unitY0} y2={unitY1} stroke="#0891b2" strokeWidth="2" />
          <line x1={zeroX + 14} x2={zeroX + 22} y1={unitY0} y2={unitY0} stroke="#0891b2" strokeWidth="2" />
          <line x1={zeroX + 14} x2={zeroX + 22} y1={unitY1} y2={unitY1} stroke="#0891b2" strokeWidth="2" />
          <text x={zeroX + 26} y={(unitY0 + unitY1) / 2 + 3} className="fill-cyan-700 text-[10px] font-black dark:fill-cyan-200">
            1 unit
          </text>
        </g>
      ) : null}
      <text x={viewport.width - 18} y={Math.min(viewport.height - 10, Math.max(18, zeroY - 8))} textAnchor="end" className="fill-slate-700 text-[12px] font-black dark:fill-slate-200">
        x
      </text>
      <text x={Math.min(viewport.width - 18, Math.max(18, zeroX + 10))} y="18" className="fill-slate-700 text-[12px] font-black dark:fill-slate-200">
        y
      </text>
    </g>
  );
}

function axisTicks(min: number, max: number, targetCount: number) {
  const span = Math.abs(max - min) || 1;
  const rawStep = span / targetCount;
  const magnitude = 10 ** Math.floor(Math.log10(rawStep));
  const normalized = rawStep / magnitude;
  const niceNormalized = normalized <= 1 ? 1 : normalized <= 2 ? 2 : normalized <= 5 ? 5 : 10;
  const step = niceNormalized * magnitude;
  const start = Math.ceil(min / step) * step;
  const ticks: number[] = [];
  for (let value = start; value <= max + step * 0.5; value += step) {
    const rounded = Number(value.toFixed(8));
    if (rounded >= min - 1e-8 && rounded <= max + 1e-8) ticks.push(rounded);
    if (ticks.length > 40) break;
  }
  return ticks;
}

function formatAxisTick(value: number) {
  return Number.isInteger(value) ? String(value) : value.toFixed(2).replace(/0+$/, "").replace(/\.$/, "");
}

function isInRange(value: number, min: number, max: number) {
  return value >= Math.min(min, max) && value <= Math.max(min, max);
}

function GraphMiniNumber({ label, value, onChange }: { label: string; value: number; onChange: (value: number) => void }) {
  return (
    <label className="rounded-xl bg-slate-100 p-2 text-xs font-bold dark:bg-white/10">
      {label}
      <input type="number" value={value} onChange={(event) => onChange(Number(event.target.value))} className="mt-1 w-full rounded-lg border border-slate-200 bg-white p-2 font-mono dark:border-white/10 dark:bg-slate-900" />
    </label>
  );
}
