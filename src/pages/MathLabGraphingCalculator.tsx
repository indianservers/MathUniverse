import { Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import FunctionGraphCanvas, { FunctionGraphView } from "../components/math-lab/FunctionGraphCanvas";
import { buildGraphingCalculatorWorkspaceObjects } from "../workspace/universalObjectGraph";
import { useUniversalObjectGraphPublisher } from "../workspace/useUniversalObjectGraphPublisher";
import { deleteGraphWorkspace, readSavedGraphWorkspaces, saveGraphWorkspace, type SavedGraphWorkspace } from "../utils/graphWorkspaceStorage";
import type { GraphSample } from "../utils/mathEngine/graphSampler";
import { compileFunctionExpression, compileTwoVariableExpression } from "../utils/functionParser";
import GraphStudio2DWorkspace from "../graph-studio/GraphStudio2DWorkspace";
import { substituteGraphVariables } from "../graph-studio/expressionEngine";
import { downloadGraphStudioFile, exportGraphStudioProject } from "../graph-studio/projectStorage";
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
  variables?: GraphStudioVariable[];
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
  const [showDerivative, setShowDerivative] = useState(false);
  const [showIntegral, setShowIntegral] = useState(false);
  const [integralStart, setIntegralStart] = useState(-2);
  const [integralEnd, setIntegralEnd] = useState(2);
  const [saveName, setSaveName] = useState("My 2D graph");
  const [savedGraphs, setSavedGraphs] = useState<SavedGraphWorkspace<Graph2DWorkspaceState>[]>(() => readSavedGraphWorkspaces(GRAPH_2D_STORAGE_KEY));
  const [graphVariables, setGraphVariables] = useState<GraphStudioVariable[]>([]);

  const graphStudioState = useMemo<Graph2DWorkspaceState>(() => ({ functions, view, showGrid, showAxes, traceMode, integralStart, integralEnd, variables: graphVariables }), [functions, graphVariables, integralEnd, integralStart, showAxes, showGrid, traceMode, view]);
  const graphStudio = useGraphStudioProject({
    dimension: "2d",
    initialName: "My Function Study",
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
      setGraphVariables(state.variables ?? variables);
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

  return (
    <GraphStudio2DWorkspace
      projectName={graphStudio.project.name}
      onProjectNameChange={(name) => graphStudio.updateProject({ name })}
      canUndo={graphStudio.canUndo}
      canRedo={graphStudio.canRedo}
      onUndo={graphStudio.undo}
      onRedo={graphStudio.redo}
      onSave={() => { graphStudio.save(); saveCurrentGraph(); }}
      onExportProject={() => exportGraphStudioProject({ ...graphStudio.project, state: graphStudioState })}
      onExportCsv={exportSelectedCsv}
      onExportSvg={exportSelectedSvg}
      onCopyEquation={() => void navigator.clipboard?.writeText(selectedFunction?.input ?? "")}
      functions={functions}
      plotted={plotted}
      selectedId={selectedId}
      onSelect={setSelectedId}
      onUpdate={updateFunction}
      onAdd={addFunction}
      onDuplicate={duplicateFunction}
      onRemove={removeFunction}
      onRandom={tryRandom}
      onReset={resetExample}
      examples={EXAMPLES}
      onExample={setSelectedExample}
      variables={graphVariables}
      onVariablesChange={updateStudioVariables}
      view={view}
      onViewChange={setView}
      onResetView={() => setView({ xMin: -10, xMax: 10, yMin: -10, yMax: 10 })}
      showGrid={showGrid}
      showAxes={showAxes}
      traceMode={traceMode}
      traceX={traceX}
      onShowGridChange={setShowGrid}
      onShowAxesChange={setShowAxes}
      onTraceModeChange={setTraceMode}
      onTraceXChange={setTraceX}
      canvas={plotted.some((item) => item.visible && !item.error && item.points.length) ? <FunctionGraphCanvas series={graphSeries} view={view} onViewChange={setView} showGrid={showGrid} showAxes={showAxes} selectedSeriesId={selectedId} traceX={traceMode ? traceX : undefined} onTraceChange={traceMode ? setTraceX : undefined} integralArea={showIntegral && selected ? { points: selected.points, color: selected.color, start: Math.min(integralStart, integralEnd), end: Math.max(integralStart, integralEnd) } : undefined} featurePoints={[...roots.roots.map((x) => ({ x, y: 0, type: "root" as const })), ...(typeof yIntercept.y === "number" ? [{ x: 0, y: yIntercept.y, type: "intercept" as const }] : []), ...extrema.minima.map((point) => ({ ...point, type: "minimum" as const })), ...extrema.maxima.map((point) => ({ ...point, type: "maximum" as const })), ...intersections.map((point) => ({ ...point, type: "intersection" as const }))]} /> : <div className="gs2d-canvas-empty">Enter a valid expression to plot.</div>}
      roots={roots.roots}
      yIntercept={yIntercept.y}
      visibleRange={visibleRange}
      discontinuities={discontinuities}
      minima={extrema.minima}
      maxima={extrema.maxima}
      intersections={intersections}
      derivativePoints={derivativePoints}
      showDerivative={showDerivative}
      onShowDerivativeChange={setShowDerivative}
      showIntegral={showIntegral}
      onShowIntegralChange={setShowIntegral}
      integralStart={integralStart}
      integralEnd={integralEnd}
      integralValue={integralValue}
      onIntegralStartChange={setIntegralStart}
      onIntegralEndChange={setIntegralEnd}
      tableStart={tableStart}
      tableEnd={tableEnd}
      tableStep={tableStep}
      tableRows={table.rows}
      onTableStartChange={setTableStart}
      onTableEndChange={setTableEnd}
      onTableStepChange={setTableStep}
      stylePreset={graphStudio.project.stylePreset}
      onStylePresetChange={(stylePreset) => graphStudio.updateProject({ stylePreset })}
      savedLibrary={<SavedGraphList saved={savedGraphs} onLoad={loadSavedGraph} onDelete={removeSavedGraph} />}
    />
  );


  function updateStudioVariables(variables: GraphStudioVariable[]) {
    setGraphVariables(variables);
    graphStudio.updateProject({ variables });
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

  function duplicateFunction(id: string) {
    const source = functions.find((item) => item.id === id);
    if (!source) return;
    const nextId = `f${Date.now()}`;
    setFunctions((items) => [...items, { ...source, id: nextId, color: COLORS[items.length % COLORS.length] }]);
    setSelectedId(nextId);
  }

  function saveCurrentGraph() {
    const now = new Date().toISOString();
    const workspace: SavedGraphWorkspace<Graph2DWorkspaceState> = {
      id: `graph-2d-${Date.now()}`,
      name: saveName.trim() || "Untitled 2D graph",
      savedAt: now,
      state: { functions, view, showGrid, showAxes, traceMode, integralStart, integralEnd, variables: graphVariables },
    };
    setSavedGraphs(saveGraphWorkspace(GRAPH_2D_STORAGE_KEY, workspace));
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
    setGraphVariables(workspace.state.variables ?? []);
    setSaveName(workspace.name);
  }

  function removeSavedGraph(id: string) {
    setSavedGraphs(deleteGraphWorkspace<Graph2DWorkspaceState>(GRAPH_2D_STORAGE_KEY, id));
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
  if (normalized.includes(";") && normalized.split(";").every((item) => /^\(-?\d+(?:\.\d+)?,-?\d+(?:\.\d+)?\)$/.test(item))) {
    const points = normalized.split(";").map((item) => {
      const [x, y] = item.slice(1, -1).split(",").map(Number);
      return { x, y, valid: true };
    });
    return { points, normalized, style: "line" };
  }
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

function fileSlug(value: string) {
  return value.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 48) || "graph";
}

function escapeSvg(value: string) {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
