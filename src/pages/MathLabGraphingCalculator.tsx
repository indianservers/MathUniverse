import { Eye, EyeOff, Grid3X3, LocateFixed, Minus, MoveHorizontal, MoveVertical, Plus, RotateCcw, Table2, Trash2, ZoomIn, ZoomOut } from "lucide-react";
import { useMemo, useState } from "react";
import FunctionGraphCanvas, { FunctionGraphView } from "../components/math-lab/FunctionGraphCanvas";
import { FormulaBlock, MathErrorBox, MathLabLayout, ResultCard, StepPanel } from "../components/math-lab/MathLabShared";
import SectionCard from "../components/ui/SectionCard";
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

const COLORS = ["#06b6d4", "#f97316", "#8b5cf6", "#10b981", "#ef4444", "#eab308", "#ec4899"];
const EXAMPLES = ["x", "2x + 3", "x^2 - 4", "sin(x)", "cos(x)", "tan(x)", "1/x", "sqrt(x)", "abs(x)", "ln(x)", "e^x"];

export default function MathLabGraphingCalculator() {
  const [functions, setFunctions] = useState<FunctionRow[]>([
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

  const plotted = useMemo(() => functions.map((item) => {
    const sampled = sampleFunction(item.input, view.xMin, view.xMax, 900);
    return { ...item, points: sampled.points, error: sampled.error, normalized: sampled.normalized };
  }), [functions, view]);

  const selected = plotted.find((item) => item.id === selectedId) ?? plotted[0];
  const selectedFunction = functions.find((item) => item.id === selected?.id) ?? functions[0];
  const table = selectedFunction ? generateTableValues(selectedFunction.input, tableStart, tableEnd, tableStep) : { rows: [] };
  const roots = selectedFunction ? approximateRoots(selectedFunction.input, view.xMin, view.xMax) : { roots: [] };
  const yIntercept = selectedFunction ? approximateYIntercept(selectedFunction.input) : { y: null };
  const visibleRange = selectedFunction ? approximateVisibleRange(selectedFunction.input, view.xMin, view.xMax) : { min: null, max: null };
  const discontinuities = selected ? detectDiscontinuities(selected.points) : [];

  const notes = (
    <>
      <SectionCard title="How To Enter Functions">
        <div className="space-y-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
          <p>Enter either <span className="font-mono font-bold">y = f(x)</span> or the direct expression. Examples include <span className="font-mono">x^2</span>, <span className="font-mono">sin(x)</span>, <span className="font-mono">sqrt(x)</span>, and <span className="font-mono">(x+1)/(x-2)</span>.</p>
          <p>Numeric analysis is approximate over the current visible window.</p>
        </div>
      </SectionCard>
      <SectionCard title="Common Mistakes">
        <ul className="space-y-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
          <li>Use <span className="font-mono">2*x</span> or <span className="font-mono">2x</span> for multiplication.</li>
          <li><span className="font-mono">sqrt(x)</span> is only real for x greater than or equal to 0.</li>
          <li>x-intercepts are roots; the y-intercept is where x = 0.</li>
          <li><span className="font-mono">tan(x)</span> has repeating vertical breaks.</li>
        </ul>
      </SectionCard>
    </>
  );

  return (
    <MathLabLayout
      title="Graphing Calculator"
      subtitle="Plot multiple real functions, zoom, pan, trace coordinates, and inspect approximate intercepts, ranges, tables, and discontinuities."
      notes={notes}
    >
      <div className="grid gap-6 xl:grid-cols-[340px_minmax(0,1fr)]">
        <SectionCard title="Functions" description="Add several functions and compare them on the same live SVG graph.">
          <div className="space-y-4">
            {functions.map((item, index) => {
              const plottedItem = plotted.find((plot) => plot.id === item.id);
              return (
                <div key={item.id} className={`rounded-2xl border p-3 transition ${selectedId === item.id ? "border-cyan-300 bg-cyan-50 dark:border-cyan-400/30 dark:bg-cyan-400/10" : "border-slate-200 bg-white/70 dark:border-white/10 dark:bg-white/5"}`}>
                  <div className="mb-2 flex items-center gap-2">
                    <button type="button" title="Select function" className="h-5 w-5 rounded-full" style={{ backgroundColor: item.color }} onClick={() => setSelectedId(item.id)} />
                    <span className="text-xs font-black uppercase text-slate-500">f{index + 1}(x)</span>
                    <button type="button" className="ml-auto rounded-lg p-2 hover:bg-slate-100 dark:hover:bg-white/10" title={item.visible ? "Hide function" : "Show function"} onClick={() => updateFunction(item.id, { visible: !item.visible })}>
                      {item.visible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                    </button>
                    <button type="button" className="rounded-lg p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-400/10" title="Delete function" onClick={() => removeFunction(item.id)} disabled={functions.length === 1}>
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <input
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 font-mono text-sm outline-none focus:border-cyan-400 dark:border-white/10 dark:bg-slate-950"
                    value={item.input}
                    onFocus={() => setSelectedId(item.id)}
                    onChange={(event) => updateFunction(item.id, { input: event.target.value })}
                    aria-label={`Function ${index + 1}`}
                  />
                  <MathErrorBox error={plottedItem?.error} />
                </div>
              );
            })}
            <div className="flex flex-wrap gap-2">
              <button type="button" className="action-primary" onClick={addFunction}><Plus className="h-4 w-4" />Add Function</button>
              {EXAMPLES.slice(0, 6).map((example) => <button key={example} type="button" className="mini-chip" onClick={() => setSelectedExample(example)}>{example}</button>)}
            </div>
          </div>
        </SectionCard>

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
          </div>
          <FunctionGraphCanvas
            series={plotted.map((item) => ({ id: item.id, label: item.input || "function", color: item.color, points: item.points, visible: item.visible && !item.error }))}
            view={view}
            showGrid={showGrid}
            showAxes={showAxes}
            selectedSeriesId={selectedId}
            traceX={traceMode ? traceX : undefined}
            onTraceChange={traceMode ? setTraceX : undefined}
          />
          <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_220px]">
            <label className="rounded-2xl bg-slate-100 p-4 text-sm font-semibold dark:bg-white/10">
              Trace x: {formatNumber(traceX)}
              <input className="slider-range mt-3 w-full" type="range" min={view.xMin} max={view.xMax} step={(view.xMax - view.xMin) / 400} value={traceX} onChange={(event) => setTraceX(Number(event.target.value))} />
            </label>
            <button type="button" className={traceMode ? "action-primary justify-center" : "tool-button justify-center"} onClick={() => setTraceMode((value) => !value)}>Trace Mode</button>
          </div>
        </SectionCard>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <SectionCard title="Function Analysis" description="Results are numerical estimates from samples in the visible x-window.">
          {selectedFunction ? (
            <div className="grid gap-3 md:grid-cols-2">
              <AnalysisTile label="Selected function" value={selectedFunction.input} />
              <AnalysisTile label="y-intercept" value={typeof yIntercept.y === "number" ? `(0, ${formatNumber(yIntercept.y)})` : "Undefined at x = 0"} />
              <AnalysisTile label="Approximate roots" value={roots.roots.length ? roots.roots.map(formatNumber).join(", ") : "No visible root found"} />
              <AnalysisTile label="Approximate visible range" value={visibleRange.min !== null && visibleRange.max !== null ? `${formatNumber(visibleRange.min)} to ${formatNumber(visibleRange.max)}` : "No real visible values"} />
              <AnalysisTile label="Approximate asymptote or break" value={discontinuities.length ? discontinuities.map(formatNumber).join(", ") : "No large visible break detected"} />
              <AnalysisTile label="Domain warning" value={selected?.points.some((point) => !point.valid) ? "Some x-values are undefined in this window." : "All sampled x-values are real here."} />
            </div>
          ) : null}
        </SectionCard>

        <SectionCard title="Table Of Values" description="Generate sample values for the selected function.">
          <div className="grid gap-3 sm:grid-cols-3">
            <NumberInput label="Start" value={tableStart} onChange={setTableStart} />
            <NumberInput label="End" value={tableEnd} onChange={setTableEnd} />
            <NumberInput label="Step" value={tableStep} onChange={setTableStep} />
          </div>
          <div className="mt-4 max-h-80 overflow-auto rounded-2xl border border-slate-200 dark:border-white/10">
            <table className="w-full text-left text-sm">
              <thead className="sticky top-0 bg-slate-100 dark:bg-slate-900"><tr><th className="p-3">x</th><th className="p-3">y</th></tr></thead>
              <tbody>
                {table.rows.slice(0, 80).map((row) => <tr key={row.x} className="border-t border-slate-100 dark:border-white/10"><td className="p-3 font-mono">{formatNumber(row.x)}</td><td className="p-3 font-mono">{row.valid && row.y !== null ? formatNumber(row.y) : "undefined"}</td></tr>)}
              </tbody>
            </table>
          </div>
          <p className="mt-3 flex items-center gap-2 text-xs font-semibold text-slate-500"><Table2 className="h-4 w-4" />Up to 80 rows shown to keep the page responsive.</p>
        </SectionCard>
      </div>

      <StepPanel steps={[
        { title: "Normalize the input", explanation: "The graphing engine accepts direct expressions or y = f(x), then normalizes constants and multiplication.", formula: "y=f(x)" },
        { title: "Sample real points", explanation: "The visible x-window is sampled into hundreds of points. Undefined real values are skipped instead of crashing.", formula: "x_i \\mapsto f(x_i)" },
        { title: "Analyze visible behavior", explanation: "Roots, range, discontinuities, and table values are numerical approximations over the current view.", result: "Use zoom and pan to inspect a different window." },
      ]} />

      <ResultCard title="What This Tool Does" result={<p className="font-semibold">This is a live multi-function graphing calculator for real-valued functions. It supports polynomial, trigonometric, exponential, logarithmic, radical, absolute value, and rational examples without static fake graphs.</p>} />
      <FormulaBlock title="Supported Transformation Of Input" formula={"\\text{input } x^2-4 \\;\\text{or}\\; y=x^2-4 \\Rightarrow f(x)=x^2-4"} />
    </MathLabLayout>
  );

  function updateFunction(id: string, patch: Partial<FunctionRow>) {
    setFunctions((items) => items.map((item) => item.id === id ? { ...item, ...patch } : item));
  }

  function addFunction() {
    const id = `f${Date.now()}`;
    setFunctions((items) => [...items, { id, input: "cos(x)", color: COLORS[items.length % COLORS.length], visible: true }]);
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
