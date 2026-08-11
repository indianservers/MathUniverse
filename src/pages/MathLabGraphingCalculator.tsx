import { ChevronDown, Dices, Download, Eye, EyeOff, FolderOpen, Grid3X3, Keyboard, LocateFixed, MoveHorizontal, MoveVertical, PanelLeftClose, PanelLeftOpen, Plus, RotateCcw, Save, Sigma, Table2, Trash2, ZoomIn, ZoomOut } from "lucide-react";
import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import FunctionGraphCanvas, { FunctionGraphView } from "../components/math-lab/FunctionGraphCanvas";
import MathKeyboardInput from "../components/math-keyboard/MathKeyboardInput";
import { FormulaBlock, MathErrorBox, MathLabLayout, ResultCard, StepPanel } from "../components/math-lab/MathLabShared";
import SectionCard from "../components/ui/SectionCard";
import { ApproxBadge, CopyResultButton, EmptyState, ExportImageButton, FullscreenButton, InfoCallout, LoadingSkeleton, PresetChips, ResetExampleButton } from "../components/ui/UiFeedback";
import { buildGraphingCalculatorWorkspaceObjects } from "../workspace/universalObjectGraph";
import { useUniversalObjectGraphPublisher } from "../workspace/useUniversalObjectGraphPublisher";
import { deleteGraphWorkspace, readSavedGraphWorkspaces, saveGraphWorkspace, type SavedGraphWorkspace } from "../utils/graphWorkspaceStorage";
import type { GraphSample } from "../utils/mathEngine/graphSampler";
import { compileFunctionExpression, compileTwoVariableExpression } from "../utils/functionParser";
import GraphExamplesGallery from "../graph-studio/GraphExamplesGallery";
import GraphStudioProjectBar from "../graph-studio/GraphStudioProjectBar";
import GraphVariableRack from "../graph-studio/GraphVariableRack";
import { substituteGraphVariables } from "../graph-studio/expressionEngine";
import { downloadGraphStudioFile } from "../graph-studio/projectStorage";
import { useGraphStudioProject } from "../graph-studio/useGraphStudioProject";
import type { GraphStudioVariable } from "../graph-studio/types";
import {
  approximateRoots,
  approximateVisibleRange,
  approximateYIntercept,
  detectDiscontinuities,
  generateTableValues,
  sampleFunction,
} from "../utils/mathEngine/graphSampler";

type FunctionRow = {
  id: string;
  input: string;
  color: string;
  visible: boolean;
};

type Graph2DWorkspaceState = {
  functions: FunctionRow[];
  view: FunctionGraphView;
  showGrid: boolean;
  showAxes: boolean;
  traceMode: boolean;
  integralStart: number;
  integralEnd: number;
};

type GraphExpressionSample = {
  points: GraphSample[];
  normalized: string;
  style: "line" | "points";
  error?: string;
};

const COLORS = ["#06b6d4", "#f97316", "#8b5cf6", "#10b981", "#ef4444", "#eab308", "#ec4899"];
const EXAMPLES = ["2x + 1", "x^2", "sin(x)", "x^2 + y^2 = 25", "(2, 3)", "cos(x)", "1/x", "sqrt(x)", "abs(x)"];
const GRAPH_2D_STORAGE_KEY = "math-universe-saved-2d-graphs";

export default function MathLabGraphingCalculator() {
  const [searchParams] = useSearchParams();
  const prefilledFunction = searchParams.get("q")?.trim();
  const [functions, setFunctions] = useState<FunctionRow[]>(() => prefilledFunction ? [
    { id: "f1", input: prefilledFunction, color: COLORS[0], visible: true },
  ] : [
    { id: "f1", input: "x^2 - 4", color: COLORS[0], visible: true },
    { id: "f2", input: "sin(x)", color: COLORS[1], visible: true },
  ]);
  const [selectedId, setSelectedId] = useState("f1");
  const [view, setView] = useState<FunctionGraphView>({ xMin: -10, xMax: 10, yMin: -10, yMax: 10 });
  const [showGrid, setShowGrid] = useState(true);
  const [showAxes, setShowAxes] = useState(true);
  const [traceMode, setTraceMode] = useState(true);
  const [traceX, setTraceX] = useState(0);
  const [tableStart, setTableStart] = useState(-5);
  const [tableEnd, setTableEnd] = useState(5);
  const [tableStep, setTableStep] = useState(1);
  const [showFormula, setShowFormula] = useState(false);
  const [equationPanelOpen, setEquationPanelOpen] = useState(true);
  const [showDerivative, setShowDerivative] = useState(false);
  const [showIntegral, setShowIntegral] = useState(false);
  const [integralStart, setIntegralStart] = useState(-2);
  const [integralEnd, setIntegralEnd] = useState(2);
  const [saveName, setSaveName] = useState("My 2D graph");
  const [savedOpen, setSavedOpen] = useState(false);
  const [savedGraphs, setSavedGraphs] = useState<SavedGraphWorkspace<Graph2DWorkspaceState>[]>(() => readSavedGraphWorkspaces(GRAPH_2D_STORAGE_KEY));
  const [graphVariables, setGraphVariables] = useState<GraphStudioVariable[]>([]);
  const [mathKeyboardOpen, setMathKeyboardOpen] = useState(false);

  const graphStudioState = useMemo<Graph2DWorkspaceState>(() => ({ functions, view, showGrid, showAxes, traceMode, integralStart, integralEnd }), [functions, integralEnd, integralStart, showAxes, showGrid, traceMode, view]);
  const graphStudio = useGraphStudioProject({
    dimension: "2d",
    initialName: "Graph Studio 2D",
    state: graphStudioState,
    applyState: (state, variables) => {
      setFunctions(state.functions.length ? state.functions : [{ id: "f1", input: "x^2", color: COLORS[0], visible: true }]);
      setSelectedId(state.functions[0]?.id ?? "f1");
      setView(state.view);
      setShowGrid(state.showGrid);
      setShowAxes(state.showAxes);
      setTraceMode(state.traceMode);
      setIntegralStart(state.integralStart);
      setIntegralEnd(state.integralEnd);
      setGraphVariables(variables);
    },
  });

  const plotted = useMemo(() => functions.map((item) => {
    const sampled = sampleGraphExpression(substituteGraphVariables(item.input, graphVariables), view.xMin, view.xMax, 900);
    return { ...item, points: sampled.points, error: sampled.error, normalized: sampled.normalized, style: sampled.style };
  }), [functions, graphVariables, view]);

  const selected = plotted.find((item) => item.id === selectedId) ?? plotted[0];
  const selectedFunction = functions.find((item) => item.id === selected?.id) ?? functions[0];
  const selectedResolvedInput = selectedFunction ? substituteGraphVariables(selectedFunction.input, graphVariables) : "";
  const table = useMemo(() => selectedFunction ? generateTableValues(selectedResolvedInput, tableStart, tableEnd, tableStep) : { rows: [] }, [selectedFunction, selectedResolvedInput, tableEnd, tableStart, tableStep]);
  const roots = useMemo(() => selectedFunction ? approximateRoots(selectedResolvedInput, view.xMin, view.xMax) : { roots: [] }, [selectedFunction, selectedResolvedInput, view.xMax, view.xMin]);
  const yIntercept = useMemo(() => selectedFunction ? approximateYIntercept(selectedResolvedInput) : { y: null }, [selectedFunction, selectedResolvedInput]);
  const visibleRange = useMemo(() => selectedFunction ? approximateVisibleRange(selectedResolvedInput, view.xMin, view.xMax) : { min: null, max: null }, [selectedFunction, selectedResolvedInput, view.xMax, view.xMin]);
  const discontinuities = useMemo(() => selected ? detectDiscontinuities(selected.points) : [], [selected]);
  const derivativePoints = useMemo(() => selected ? approximateDerivativePoints(selected.points) : [], [selected]);
  const extrema = useMemo(() => selected ? approximateExtrema(selected.points) : { minima: [], maxima: [] }, [selected]);
  const intersections = useMemo(() => approximateIntersections(plotted.filter((item) => item.visible && !item.error)), [plotted]);
  const integralValue = useMemo(() => selected ? approximateIntegral(selected.points, Math.min(integralStart, integralEnd), Math.max(integralStart, integralEnd)) : null, [integralEnd, integralStart, selected]);
  const graphSeries = useMemo(() => [
    ...plotted.map((item) => ({ id: item.id, label: item.input || "function", color: item.color, points: item.points, visible: item.visible && !item.error, style: item.style })),
    ...(showDerivative && selected ? [{ id: `${selected.id}-derivative`, label: `d/dx ${selected.input}`, color: "#ec4899", points: derivativePoints, visible: true, style: "derivative" as const }] : []),
  ], [derivativePoints, plotted, selected, showDerivative]);
  const selectedSummary = selectedFunction
    ? [
      `Function: ${selectedFunction.input}`,
      `Y-intercept: ${typeof yIntercept.y === "number" ? `(0, ${formatNumber(yIntercept.y)})` : "undefined"}`,
      `Approx roots: ${roots.roots.length ? roots.roots.map(formatNumber).join(", ") : "none visible"}`,
      `Approx visible range: ${visibleRange.min !== null && visibleRange.max !== null ? `${formatNumber(visibleRange.min)} to ${formatNumber(visibleRange.max)}` : "no real visible values"}`,
    ].join("\n")
    : "";
  const workspaceObjects = useMemo(() => buildGraphingCalculatorWorkspaceObjects({
    functions: plotted.map((item) => ({
      id: item.id,
      input: item.input,
      color: item.color,
      visible: item.visible,
      normalized: item.normalized,
      error: item.error,
    })),
    selectedId,
    tableRows: table.rows,
    view,
    analysis: {
      roots: roots.roots,
      yIntercept: yIntercept.y,
      visibleRange,
      discontinuities,
    },
  }), [discontinuities, plotted, roots.roots, selectedId, table.rows, view, visibleRange, yIntercept.y]);
  useUniversalObjectGraphPublisher("graphing-calculator", workspaceObjects);

  const notes = (
    <>
      <SectionCard title="How To Enter Functions">
        <div className="space-y-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
          <p>Enter either <span className="font-mono font-bold">y = f(x)</span> or the direct expression. Examples include <span className="font-mono">x^2</span>, <span className="font-mono">sin(x)</span>, <span className="font-mono">sqrt(x)</span>, and <span className="font-mono">(x+1)/(x-2)</span>.</p>
          <p>Numeric analysis is approximate over the current visible window.</p>
        </div>
      </SectionCard>
      <InfoCallout title="Common mistakes" tone="warning">
        <ul className="space-y-2">
          <li>Use <span className="font-mono">2*x</span> or <span className="font-mono">2x</span> for multiplication.</li>
          <li><span className="font-mono">sqrt(x)</span> is only real for x greater than or equal to 0.</li>
          <li>x-intercepts are roots; the y-intercept is where x = 0.</li>
          <li><span className="font-mono">tan(x)</span> has repeating vertical breaks.</li>
        </ul>
      </InfoCallout>
    </>
  );

  return (
    <MathLabLayout
      title="Graphing Calculator"
      subtitle="Plot multiple real functions, zoom, pan, trace coordinates, and inspect approximate intercepts, ranges, tables, and discontinuities."
      notes={notes}
    >
      <GraphStudioProjectBar controller={graphStudio} variables={graphVariables} onVariablesChange={setGraphVariables} />
      <div className="flex flex-wrap items-center gap-2 rounded-lg border border-slate-200 bg-white/70 p-2 dark:border-white/10 dark:bg-slate-950/60">
        <GraphExamplesGallery dimension="2d" onOpen={(example) => openStudioExample(example.name, example.equation, example.accent)} />
        <button type="button" className={mathKeyboardOpen ? "action-primary" : "tool-button"} onClick={() => setMathKeyboardOpen((value) => !value)}><Keyboard className="h-4 w-4" />Math keyboard</button>
        <span className="ml-auto text-xs font-bold text-slate-500">Schema v{graphStudio.project.schemaVersion} · auto-saved offline</span>
      </div>
      <div className={`grid gap-4 ${equationPanelOpen ? "xl:grid-cols-[340px_minmax(0,1fr)]" : "xl:grid-cols-[64px_minmax(0,1fr)]"}`}>
        <aside className="min-w-0">
        <button type="button" className="tool-button mb-3 w-full justify-center" onClick={() => setEquationPanelOpen((value) => !value)} aria-label={equationPanelOpen ? "Collapse equation panel" : "Expand equation panel"}>
          {equationPanelOpen ? <PanelLeftClose className="h-4 w-4" /> : <PanelLeftOpen className="h-4 w-4" />}
          {equationPanelOpen && <span>Equations</span>}
        </button>
        {equationPanelOpen && <SectionCard title="Equations" description="Plot functions, points, and circles together on the same coordinate plane.">
          <div className="sticky top-20 z-20 mb-4 flex flex-wrap gap-2 rounded-2xl border border-slate-200 bg-white/90 p-2 backdrop-blur dark:border-white/10 dark:bg-slate-950/90">
            <ResetExampleButton onClick={resetExample} />
            <button type="button" className="tool-button" onClick={() => setFunctions([])} title="Clear every plotted function"><Trash2 className="h-4 w-4" />Clear all</button>
            <button type="button" className="tool-button" onClick={tryRandom}><Dices className="h-4 w-4" />Try random</button>
            <CopyResultButton value={selectedSummary} />
          </div>
          <div className="space-y-4">
            {functions.map((item, index) => {
              const plottedItem = plotted.find((plot) => plot.id === item.id);
              return (
                <div key={item.id} className={`rounded-2xl border p-3 transition ${selectedId === item.id ? "border-cyan-300 bg-cyan-50 dark:border-cyan-400/30 dark:bg-cyan-400/10" : "border-slate-200 bg-white/70 dark:border-white/10 dark:bg-white/5"}`}>
                  <div className="mb-2 flex items-center gap-2">
                    <input type="color" title="Equation color" aria-label={`Equation ${index + 1} color`} className="h-7 w-7 cursor-pointer rounded border-0 bg-transparent p-0" value={item.color} onChange={(event) => updateFunction(item.id, { color: event.target.value })} onFocus={() => setSelectedId(item.id)} />
                    <span className="text-xs font-black uppercase text-slate-500">f{index + 1}(x)</span>
                    <button type="button" className="ml-auto rounded-lg p-2 hover:bg-slate-100 dark:hover:bg-white/10" title={item.visible ? "Hide function" : "Show function"} onClick={() => updateFunction(item.id, { visible: !item.visible })}>
                      {item.visible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                    </button>
                    <button type="button" className="rounded-lg p-2 text-rose-500 hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-40 dark:hover:bg-rose-400/10" title={functions.length === 1 ? "Keep at least one function on the graph" : "Delete function"} onClick={() => removeFunction(item.id)} disabled={functions.length === 1}>
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <input
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 font-mono text-sm outline-none focus:border-cyan-400 dark:border-white/10 dark:bg-slate-950"
                    value={item.input}
                    onFocus={() => setSelectedId(item.id)}
                    onChange={(event) => updateFunction(item.id, { input: event.target.value })}
                    aria-label={`Function ${index + 1}`}
                    placeholder="y = f(x), (x, y), or x^2 + y^2 = r^2"
                  />
                  <MathErrorBox error={plottedItem?.error} />
                </div>
              );
            })}
            <div className="flex flex-wrap gap-2">
              <button type="button" className="action-primary" onClick={addFunction}><Plus className="h-4 w-4" />Add Function</button>
            </div>
            <PresetChips examples={EXAMPLES} onSelect={setSelectedExample} />
            {mathKeyboardOpen && selectedFunction && <MathKeyboardInput value={selectedFunction.input} onChange={(input) => updateFunction(selectedFunction.id, { input })} label={`Edit ${selectedFunction.input || "expression"}`} mode="formula" rows={2} defaultCompact={false} />}
            <div className="border-t border-slate-200 pt-4 dark:border-white/10">
              <label className="text-xs font-black uppercase text-slate-500 dark:text-slate-400">Saved graph name
                <input className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold dark:border-white/10 dark:bg-slate-950" value={saveName} onChange={(event) => setSaveName(event.target.value)} />
              </label>
              <div className="mt-2 flex gap-2">
                <button type="button" className="action-primary flex-1 justify-center" onClick={saveCurrentGraph}><Save className="h-4 w-4" />Save</button>
                <button type="button" className="tool-button flex-1 justify-center" onClick={() => setSavedOpen((value) => !value)} aria-expanded={savedOpen}><FolderOpen className="h-4 w-4" />Saved ({savedGraphs.length})<ChevronDown className={`h-4 w-4 transition ${savedOpen ? "rotate-180" : ""}`} /></button>
              </div>
              {savedOpen && <SavedGraphList saved={savedGraphs} onLoad={loadSavedGraph} onDelete={removeSavedGraph} />}
            </div>
          </div>
        </SectionCard>}
        {equationPanelOpen && <GraphVariableRack expressions={functions.map((item) => item.input)} variables={graphVariables} onChange={updateStudioVariables} />}
        </aside>

        <SectionCard title="Graph" description="Use the controls to zoom, pan, reset the view, and trace points along the selected function.">
          <div className="mb-4 flex flex-wrap gap-2">
            <button type="button" className="tool-button" onClick={() => zoom(0.72)}><ZoomIn className="h-4 w-4" />Zoom In</button>
            <button type="button" className="tool-button" onClick={() => zoom(1.38)}><ZoomOut className="h-4 w-4" />Zoom Out</button>
            <button type="button" className="tool-button" onClick={() => pan(-0.18, 0)}><MoveHorizontal className="h-4 w-4" />Left</button>
            <button type="button" className="tool-button" onClick={() => pan(0.18, 0)}><MoveHorizontal className="h-4 w-4" />Right</button>
            <button type="button" className="tool-button" onClick={() => pan(0, 0.18)}><MoveVertical className="h-4 w-4" />Up</button>
            <button type="button" className="tool-button" onClick={() => pan(0, -0.18)}><MoveVertical className="h-4 w-4" />Down</button>
            <button type="button" className="tool-button" onClick={() => setView({ xMin: -10, xMax: 10, yMin: -10, yMax: 10 })}><RotateCcw className="h-4 w-4" />Reset</button>
            <button type="button" className={showGrid ? "action-primary" : "tool-button"} onClick={() => setShowGrid((value) => !value)}><Grid3X3 className="h-4 w-4" />Grid</button>
            <button type="button" className={showAxes ? "action-primary" : "tool-button"} onClick={() => setShowAxes((value) => !value)}><LocateFixed className="h-4 w-4" />Axes</button>
            <FullscreenButton targetId="graphing-canvas-panel" />
            <ExportImageButton targetId="graphing-canvas-panel" filename="graphing-calculator.png" />
            <button type="button" className="tool-button" onClick={exportSelectedCsv}><Download className="h-4 w-4" />CSV</button>
            <button type="button" className="tool-button" onClick={exportSelectedSvg}><Download className="h-4 w-4" />SVG</button>
            <button type="button" className="tool-button" onClick={() => setShowFormula((value) => !value)}>{showFormula ? "Hide formula" : "Show formula"}</button>
            <button type="button" className={showDerivative ? "action-primary" : "tool-button"} onClick={() => setShowDerivative((value) => !value)}><Sigma className="h-4 w-4" />Derivative</button>
            <button type="button" className={showIntegral ? "action-primary" : "tool-button"} onClick={() => setShowIntegral((value) => !value)}><Sigma className="h-4 w-4" />Integral</button>
          </div>
          <div className="mb-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            <NumberInput label="X minimum" value={view.xMin} onChange={(value) => setView((current) => ({ ...current, xMin: Math.min(value, current.xMax - 0.1) }))} />
            <NumberInput label="X maximum" value={view.xMax} onChange={(value) => setView((current) => ({ ...current, xMax: Math.max(value, current.xMin + 0.1) }))} />
            <NumberInput label="Y minimum" value={view.yMin} onChange={(value) => setView((current) => ({ ...current, yMin: Math.min(value, current.yMax - 0.1) }))} />
            <NumberInput label="Y maximum" value={view.yMax} onChange={(value) => setView((current) => ({ ...current, yMax: Math.max(value, current.yMin + 0.1) }))} />
          </div>
          <div id="graphing-canvas-panel" className="rounded-2xl bg-white p-2 dark:bg-slate-950">
            <div className="mb-2 flex flex-wrap gap-2">
              {plotted.filter((item) => item.visible && !item.error).map((item) => <span key={item.id} className="mini-chip"><span className="mr-1 inline-block h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />{item.input}</span>)}
            </div>
            {plotted.some((item) => item.visible && !item.error && item.points.length) ? (
              <FunctionGraphCanvas
                series={graphSeries}
                view={view}
                showGrid={showGrid}
                showAxes={showAxes}
                selectedSeriesId={selectedId}
                traceX={traceMode ? traceX : undefined}
                onTraceChange={traceMode ? setTraceX : undefined}
                integralArea={showIntegral && selected ? { points: selected.points, color: selected.color, start: Math.min(integralStart, integralEnd), end: Math.max(integralStart, integralEnd) } : undefined}
              />
            ) : (
              <LoadingSkeleton label="Waiting for a valid function to plot" />
            )}
          </div>
          {showFormula && <div className="mt-4"><FormulaBlock title="Graph formula" formula={"y=f(x)"} /></div>}
          <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_220px]">
            <label className="rounded-2xl bg-slate-100 p-4 text-sm font-semibold dark:bg-white/10">
              Trace x: {formatNumber(traceX)}
              <input className="slider-range mt-3 w-full" type="range" min={view.xMin} max={view.xMax} step={(view.xMax - view.xMin) / 400} value={traceX} onChange={(event) => setTraceX(Number(event.target.value))} />
            </label>
            <button type="button" className={traceMode ? "action-primary justify-center" : "tool-button justify-center"} onClick={() => setTraceMode((value) => !value)}>Trace Mode</button>
          </div>
          {showIntegral && <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <NumberInput label="Integral start" value={integralStart} onChange={setIntegralStart} />
            <NumberInput label="Integral end" value={integralEnd} onChange={setIntegralEnd} />
          </div>}
        </SectionCard>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <SectionCard title="Function Analysis" description="Results are numerical estimates from samples in the visible x-window.">
          <ApproxBadge />
          {selectedFunction ? (
            <div className="grid gap-3 md:grid-cols-2">
              <AnalysisTile label="Selected function" value={selectedFunction.input} />
              <AnalysisTile label="y-intercept" value={typeof yIntercept.y === "number" ? `(0, ${formatNumber(yIntercept.y)})` : "Undefined at x = 0"} />
              <AnalysisTile label="Approximate roots" value={roots.roots.length ? roots.roots.map(formatNumber).join(", ") : "No visible root found"} />
              <AnalysisTile label="Approximate visible range" value={visibleRange.min !== null && visibleRange.max !== null ? `${formatNumber(visibleRange.min)} to ${formatNumber(visibleRange.max)}` : "No real visible values"} />
              <AnalysisTile label="Approximate asymptote or break" value={discontinuities.length ? discontinuities.map(formatNumber).join(", ") : "No large visible break detected"} />
              <AnalysisTile label="Domain warning" value={selected?.points.some((point) => !point.valid) ? "Some x-values are undefined in this window." : "All sampled x-values are real here."} />
              <AnalysisTile label="Intersections" value={intersections.length ? intersections.map((point) => `(${formatNumber(point.x)}, ${formatNumber(point.y)})`).join(", ") : "No visible intersections found"} />
              <AnalysisTile label="Local minima" value={extrema.minima.length ? extrema.minima.map((point) => `(${formatNumber(point.x)}, ${formatNumber(point.y)})`).join(", ") : "No sampled minimum"} />
              <AnalysisTile label="Local maxima" value={extrema.maxima.length ? extrema.maxima.map((point) => `(${formatNumber(point.x)}, ${formatNumber(point.y)})`).join(", ") : "No sampled maximum"} />
              <AnalysisTile label="Definite integral" value={integralValue === null ? "No valid interval" : `${formatNumber(integralValue)} from ${formatNumber(Math.min(integralStart, integralEnd))} to ${formatNumber(Math.max(integralStart, integralEnd))}`} />
            </div>
          ) : null}
        </SectionCard>

        <SectionCard title="Table Of Values" description="Generate sample values for the selected function.">
          <div className="grid gap-3 sm:grid-cols-3">
            <NumberInput label="Start" value={tableStart} onChange={setTableStart} />
            <NumberInput label="End" value={tableEnd} onChange={setTableEnd} />
            <NumberInput label="Step" value={tableStep} onChange={setTableStep} />
          </div>
          {table.rows.length ? (
            <div className="mt-4 max-h-80 overflow-auto rounded-2xl border border-slate-200 dark:border-white/10">
              <table className="w-full text-left text-sm">
                <thead className="sticky top-0 bg-slate-100 dark:bg-slate-900"><tr><th className="p-3">x</th><th className="p-3">y</th></tr></thead>
                <tbody>
                  {table.rows.slice(0, 80).map((row) => <tr key={row.x} className="border-t border-slate-100 dark:border-white/10"><td className="p-3 font-mono">{formatNumber(row.x)}</td><td className="p-3 font-mono">{row.valid && row.y !== null ? formatNumber(row.y) : "undefined"}</td></tr>)}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="mt-4"><EmptyState title="No table values yet" message="Select a valid function and table range to generate values." /></div>
          )}
          <p className="mt-3 flex items-center gap-2 text-xs font-semibold text-slate-500"><Table2 className="h-4 w-4" />Up to 80 rows shown to keep the page responsive.</p>
        </SectionCard>
      </div>

      <StepPanel steps={[
        { title: "Normalize the input", explanation: "The graphing engine accepts direct expressions or y = f(x), then normalizes constants and multiplication.", formula: "y=f(x)" },
        { title: "Sample real points", explanation: "The visible x-window is sampled into hundreds of points. Undefined real values are skipped instead of crashing.", formula: "x_i \\mapsto f(x_i)" },
        { title: "Analyze visible behavior", explanation: "Roots, range, discontinuities, and table values are numerical approximations over the current view.", result: "Use zoom and pan to inspect a different window." },
      ]} />

      <ResultCard title="What This Tool Does" result={<p className="font-semibold">This is a live multi-function graphing calculator for real-valued functions. It supports polynomial, trigonometric, exponential, logarithmic, radical, absolute value, and rational examples without static fake graphs.</p>} relatedTools={[{ label: "Function Explorer", route: "/math-lab/function-explorer" }, { label: "3D Graphing", route: "/math-lab/3d-graphing" }, { label: "Calculator", route: "/calculator" }]} />
      <FormulaBlock title="Supported Transformation Of Input" formula={"\\text{input } x^2-4 \\;\\text{or}\\; y=x^2-4 \\Rightarrow f(x)=x^2-4"} />
    </MathLabLayout>
  );

  function updateStudioVariables(variables: GraphStudioVariable[]) {
    setGraphVariables(variables);
    graphStudio.updateProject({ variables });
  }

  function openStudioExample(name: string, equation: string, color: string) {
    const input = equation.replace(/^y\s*=\s*/i, "");
    const id = `f${Date.now()}`;
    setFunctions([{ id, input, color, visible: true }]);
    setSelectedId(id);
    graphStudio.updateProject({ name });
    setView({ xMin: -10, xMax: 10, yMin: -10, yMax: 10 });
  }

  function exportSelectedCsv() {
    if (!selected) return;
    const csv = ["x,y,valid", ...selected.points.map((point) => `${point.x},${point.y ?? ""},${point.valid}`)].join("\n");
    downloadGraphStudioFile(`${fileSlug(selected.input)}.csv`, csv, "text/csv");
  }

  function exportSelectedSvg() {
    if (!selected) return;
    const width = 1200;
    const height = 800;
    const path = selected.points.map((point) => {
      if (!point.valid || point.y === null) return "";
      const x = ((point.x - view.xMin) / (view.xMax - view.xMin)) * width;
      const y = height - ((point.y - view.yMin) / (view.yMax - view.yMin)) * height;
      return `${x.toFixed(2)},${y.toFixed(2)}`;
    }).filter(Boolean).join(" ");
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"><rect width="100%" height="100%" fill="white"/><polyline points="${path}" fill="none" stroke="${selected.color}" stroke-width="3"/><text x="24" y="38" font-family="monospace" font-size="24" fill="#0f172a">${escapeSvg(selected.input)}</text></svg>`;
    downloadGraphStudioFile(`${fileSlug(selected.input)}.svg`, svg, "image/svg+xml");
  }

  function updateFunction(id: string, patch: Partial<FunctionRow>) {
    setFunctions((items) => items.map((item) => item.id === id ? { ...item, ...patch } : item));
  }

  function addFunction() {
    const id = `f${Date.now()}`;
    setFunctions((items) => [...items, { id, input: "cos(x)", color: COLORS[items.length % COLORS.length], visible: true }]);
    setSelectedId(id);
  }

  function tryRandom() {
    const example = EXAMPLES[Math.floor(Math.random() * EXAMPLES.length)];
    const id = `f${Date.now()}`;
    setFunctions((items) => [...items, { id, input: example, color: COLORS[items.length % COLORS.length], visible: true }]);
    setSelectedId(id);
  }

  function removeFunction(id: string) {
    setFunctions((items) => {
      const next = items.filter((item) => item.id !== id);
      if (selectedId === id && next[0]) setSelectedId(next[0].id);
      return next.length ? next : items;
    });
  }

  function setSelectedExample(example: string) {
    if (!selectedFunction) return;
    updateFunction(selectedFunction.id, { input: example });
  }

  function resetExample() {
    setFunctions([
      { id: "f1", input: "x^2 - 4", color: COLORS[0], visible: true },
      { id: "f2", input: "sin(x)", color: COLORS[1], visible: true },
    ]);
    setSelectedId("f1");
    setView({ xMin: -10, xMax: 10, yMin: -10, yMax: 10 });
    setTraceX(0);
  }

  function saveCurrentGraph() {
    const now = new Date().toISOString();
    const workspace: SavedGraphWorkspace<Graph2DWorkspaceState> = {
      id: `graph-2d-${Date.now()}`,
      name: saveName.trim() || "Untitled 2D graph",
      savedAt: now,
      state: { functions, view, showGrid, showAxes, traceMode, integralStart, integralEnd },
    };
    setSavedGraphs(saveGraphWorkspace(GRAPH_2D_STORAGE_KEY, workspace));
    setSavedOpen(true);
  }

  function loadSavedGraph(workspace: SavedGraphWorkspace<Graph2DWorkspaceState>) {
    setFunctions(workspace.state.functions.length ? workspace.state.functions : [{ id: "f1", input: "x^2", color: COLORS[0], visible: true }]);
    setSelectedId(workspace.state.functions[0]?.id ?? "f1");
    setView(workspace.state.view);
    setShowGrid(workspace.state.showGrid);
    setShowAxes(workspace.state.showAxes);
    setTraceMode(workspace.state.traceMode);
    setIntegralStart(workspace.state.integralStart);
    setIntegralEnd(workspace.state.integralEnd);
    setSaveName(workspace.name);
  }

  function removeSavedGraph(id: string) {
    setSavedGraphs(deleteGraphWorkspace<Graph2DWorkspaceState>(GRAPH_2D_STORAGE_KEY, id));
  }

  function zoom(factor: number) {
    setView((current) => {
      const cx = (current.xMin + current.xMax) / 2;
      const cy = (current.yMin + current.yMax) / 2;
      const halfX = ((current.xMax - current.xMin) * factor) / 2;
      const halfY = ((current.yMax - current.yMin) * factor) / 2;
      return { xMin: cx - halfX, xMax: cx + halfX, yMin: cy - halfY, yMax: cy + halfY };
    });
  }

  function pan(xRatio: number, yRatio: number) {
    setView((current) => {
      const dx = (current.xMax - current.xMin) * xRatio;
      const dy = (current.yMax - current.yMin) * yRatio;
      return { xMin: current.xMin + dx, xMax: current.xMax + dx, yMin: current.yMin + dy, yMax: current.yMax + dy };
    });
  }
}

function SavedGraphList({ saved, onLoad, onDelete }: { saved: SavedGraphWorkspace<Graph2DWorkspaceState>[]; onLoad: (workspace: SavedGraphWorkspace<Graph2DWorkspaceState>) => void; onDelete: (id: string) => void }) {
  if (!saved.length) return <p className="mt-3 text-sm font-semibold text-slate-500">No saved graphs yet.</p>;
  return (
    <div className="mt-3 max-h-56 space-y-2 overflow-auto" aria-label="Saved 2D graphs">
      {saved.map((workspace) => (
        <div key={workspace.id} className="flex items-center gap-2 rounded-xl border border-slate-200 p-2 dark:border-white/10">
          <button type="button" className="min-w-0 flex-1 text-left" onClick={() => onLoad(workspace)}>
            <span className="block truncate text-sm font-black">{workspace.name}</span>
            <span className="block text-xs text-slate-500">{workspace.state.functions.length} equation{workspace.state.functions.length === 1 ? "" : "s"}</span>
          </button>
          <button type="button" className="tooltip-icon rounded-lg p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-400/10" aria-label={`Delete ${workspace.name}`} data-tooltip="Delete saved graph" onClick={() => onDelete(workspace.id)}><Trash2 className="h-4 w-4" /></button>
        </div>
      ))}
    </div>
  );
}

function sampleGraphExpression(input: string, xMin: number, xMax: number, samples: number): GraphExpressionSample {
  const normalized = input.trim().replace(/\u00b2/g, "^2").replace(/\u00b3/g, "^3").replace(/\u03b8/g, "theta").replace(/\s+/g, "");
  const pointMatch = normalized.match(/^\((-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)\)$/);
  if (pointMatch) {
    return { points: [{ x: Number(pointMatch[1]), y: Number(pointMatch[2]), valid: true }] as GraphSample[], normalized, style: "points" as const };
  }
  const circleMatch = normalized.match(/^x\^2\+y\^2=(-?\d+(?:\.\d+)?)$/i);
  if (circleMatch) {
    const radiusSquared = Number(circleMatch[1]);
    if (radiusSquared < 0) return { points: [] as GraphSample[], normalized, error: "A real circle needs a non-negative squared radius.", style: "line" as const };
    const radius = Math.sqrt(radiusSquared);
    const points = Array.from({ length: 361 }, (_, index) => {
      const angle = index / 360 * Math.PI * 2;
      return { x: radius * Math.cos(angle), y: radius * Math.sin(angle), valid: true };
    });
    return { points, normalized, style: "line" as const };
  }
  const parametric = normalized.match(/^x=(.+),y=(.+)$/i);
  if (parametric) {
    try {
      const xFn = compileFunctionExpression(parametric[1].replace(/\bt\b/g, "x"));
      const yFn = compileFunctionExpression(parametric[2].replace(/\bt\b/g, "x"));
      const count = Math.max(240, Math.floor(samples / 2));
      const points = Array.from({ length: count }, (_, index) => {
        const t = -Math.PI * 2 + index / Math.max(1, count - 1) * Math.PI * 4;
        const x = xFn(t);
        const y = yFn(t);
        return Number.isFinite(x) && Number.isFinite(y) ? { x, y, valid: true } : { x: t, y: null, valid: false };
      });
      return { points, normalized, style: "line" };
    } catch (error) {
      return { points: [], normalized, style: "line", error: error instanceof Error ? error.message : "Invalid parametric curve." };
    }
  }
  const polar = normalized.match(/^r=(.+)$/i);
  if (polar) {
    try {
      const radiusFn = compileFunctionExpression(polar[1].replace(/theta/gi, "x"));
      const count = Math.max(360, Math.floor(samples / 2));
      const points = Array.from({ length: count }, (_, index) => {
        const theta = index / Math.max(1, count - 1) * Math.PI * 2;
        const radius = radiusFn(theta);
        return Number.isFinite(radius) ? { x: radius * Math.cos(theta), y: radius * Math.sin(theta), valid: true } : { x: theta, y: null, valid: false };
      });
      return { points, normalized, style: "line" };
    } catch (error) {
      return { points: [], normalized, style: "line", error: error instanceof Error ? error.message : "Invalid polar graph." };
    }
  }
  const sideways = normalized.match(/^x=(.+)$/i);
  if (sideways) {
    try {
      const fn = compileFunctionExpression(sideways[1].replace(/\by\b/g, "x"));
      const points = Array.from({ length: samples }, (_, index) => {
        const y = xMin + index / Math.max(1, samples - 1) * (xMax - xMin);
        const x = fn(y);
        return Number.isFinite(x) ? { x, y, valid: true } : { x: y, y: null, valid: false };
      });
      return { points, normalized, style: "line" };
    } catch (error) {
      return { points: [], normalized, style: "line", error: error instanceof Error ? error.message : "Invalid x = f(y) graph." };
    }
  }
  const relation = normalized.match(/^(.+?)(<=|>=|<|>|=)(.+)$/);
  if (relation && /[xy]/i.test(normalized)) {
    const [, left, operator, right] = relation;
    try {
      const fn = compileTwoVariableExpression(`(${left})-(${right})`);
      if (operator !== "=") return { points: sampleInequalityRegion(fn, operator, xMin, xMax, 72), normalized, style: "points" };
      return { points: sampleImplicitRelation(fn, xMin, xMax, 120), normalized, style: "points" };
    } catch (error) {
      return { points: [], normalized, style: "points", error: error instanceof Error ? error.message : "Invalid implicit relation." };
    }
  }
  return { ...sampleFunction(input, xMin, xMax, samples), style: "line" as const };
}

function sampleImplicitRelation(fn: (x: number, y: number) => number, min: number, max: number, resolution: number) {
  const points: GraphSample[] = [];
  const step = (max - min) / resolution;
  for (let row = 0; row < resolution; row += 1) {
    const y = min + row * step;
    for (let column = 0; column < resolution; column += 1) {
      const x = min + column * step;
      const a = fn(x, y);
      const b = fn(x + step, y);
      const c = fn(x, y + step);
      if (![a, b, c].every(Number.isFinite)) continue;
      if (a === 0 || a * b <= 0 || a * c <= 0) points.push({ x: x + step / 2, y: y + step / 2, valid: true });
    }
  }
  return points;
}

function sampleInequalityRegion(fn: (x: number, y: number) => number, operator: string, min: number, max: number, resolution: number) {
  const points: GraphSample[] = [];
  for (let row = 0; row < resolution; row += 1) {
    const y = min + row / (resolution - 1) * (max - min);
    for (let column = 0; column < resolution; column += 1) {
      const x = min + column / (resolution - 1) * (max - min);
      const value = fn(x, y);
      const inside = operator.includes("<") ? value <= 0 : value >= 0;
      if (inside && Number.isFinite(value)) points.push({ x, y, valid: true });
    }
  }
  return points;
}

function approximateDerivativePoints(points: GraphSample[]) {
  const derivative: GraphSample[] = [];
  for (let index = 1; index < points.length - 1; index += 1) {
    const previous = points[index - 1];
    const next = points[index + 1];
    if (!previous.valid || !next.valid || previous.y === null || next.y === null || next.x === previous.x) continue;
    derivative.push({ x: points[index].x, y: (next.y - previous.y) / (next.x - previous.x), valid: true });
  }
  return derivative;
}

function approximateExtrema(points: GraphSample[]) {
  const valid = points.filter((point): point is GraphSample & { y: number } => point.valid && point.y !== null);
  const minima: Array<{ x: number; y: number }> = [];
  const maxima: Array<{ x: number; y: number }> = [];
  for (let index = 1; index < valid.length - 1; index += 1) {
    const previous = valid[index - 1];
    const current = valid[index];
    const next = valid[index + 1];
    if (current.y < previous.y && current.y <= next.y) minima.push({ x: current.x, y: current.y });
    if (current.y > previous.y && current.y >= next.y) maxima.push({ x: current.x, y: current.y });
  }
  return { minima: minima.slice(0, 6), maxima: maxima.slice(0, 6) };
}

function approximateIntersections(series: Array<{ id: string; points: GraphSample[] }>) {
  const intersections: Array<{ x: number; y: number }> = [];
  for (let left = 0; left < series.length; left += 1) {
    for (let right = left + 1; right < series.length; right += 1) {
      const rightBuckets = new Map<string, GraphSample[]>();
      series[right].points.forEach((point) => {
        if (!point.valid || point.y === null) return;
        const key = point.x.toFixed(2);
        rightBuckets.set(key, [...(rightBuckets.get(key) ?? []), point]);
      });
      series[left].points.forEach((point) => {
        if (!point.valid || point.y === null) return;
        const candidates = rightBuckets.get(point.x.toFixed(2)) ?? [];
        const match = candidates.find((candidate) => candidate.y !== null && Math.abs(candidate.y - point.y!) < 0.06);
        if (match?.y !== null && match?.y !== undefined) intersections.push({ x: (point.x + match.x) / 2, y: (point.y + match.y) / 2 });
      });
    }
  }
  return intersections.filter((point, index, items) => items.findIndex((candidate) => Math.abs(candidate.x - point.x) < 0.08 && Math.abs(candidate.y - point.y) < 0.08) === index).slice(0, 12);
}

function approximateIntegral(points: GraphSample[], start: number, end: number) {
  const valid = points.filter((point): point is GraphSample & { y: number } => point.valid && point.y !== null && point.x >= start && point.x <= end);
  if (valid.length < 2) return null;
  let area = 0;
  for (let index = 1; index < valid.length; index += 1) area += (valid[index].x - valid[index - 1].x) * (valid[index].y + valid[index - 1].y) / 2;
  return area;
}

function NumberInput({ label, value, onChange }: { label: string; value: number; onChange: (value: number) => void }) {
  return (
    <label className="text-sm font-bold text-slate-600 dark:text-slate-300">
      {label}
      <input className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 font-mono dark:border-white/10 dark:bg-slate-950" type="number" value={value} onChange={(event) => onChange(Number(event.target.value))} />
    </label>
  );
}

function AnalysisTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-slate-100 p-4 dark:bg-white/10">
      <p className="text-xs font-black uppercase text-slate-500">{label}</p>
      <p className="mt-2 break-words font-mono text-sm font-bold">{value}</p>
    </div>
  );
}

function formatNumber(value: number) {
  if (!Number.isFinite(value)) return "undefined";
  if (Math.abs(value) >= 10000 || (Math.abs(value) > 0 && Math.abs(value) < 0.001)) return value.toExponential(3);
  return Number(value.toFixed(4)).toString();
}

function fileSlug(value: string) {
  return value.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 48) || "graph";
}

function escapeSvg(value: string) {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
