import { Dices, Eye, EyeOff, RotateCcw } from "lucide-react";
import { useMemo, useState } from "react";
import FunctionGraphCanvas, { FunctionGraphView } from "../components/math-lab/FunctionGraphCanvas";
import { FormulaBlock, MathErrorBox, MathLabLayout, ResultCard, StepPanel } from "../components/math-lab/MathLabShared";
import SectionCard from "../components/ui/SectionCard";
import SliderControl from "../components/ui/SliderControl";
import { ApproxBadge, CopyResultButton, EmptyState, ExportImageButton, FullscreenButton, InfoCallout, LoadingSkeleton, PresetChips, ResetExampleButton } from "../components/ui/UiFeedback";
import { GraphSample, approximateRoots, approximateVisibleRange, compileFunction, generateTableValues, sampleFunction } from "../utils/mathEngine/graphSampler";

const DEFAULT_VIEW: FunctionGraphView = { xMin: -10, xMax: 10, yMin: -10, yMax: 10 };
const EXAMPLES = ["x^2", "abs(x)", "sin(x)", "sqrt(x)", "1/x", "x^3 - 2x"];

export default function MathLabFunctionExplorer() {
  const [base, setBase] = useState("x^2");
  const [a, setA] = useState(1);
  const [b, setB] = useState(1);
  const [h, setH] = useState(0);
  const [k, setK] = useState(0);
  const [showOriginal, setShowOriginal] = useState(true);
  const [showTransformed, setShowTransformed] = useState(true);
  const [view] = useState(DEFAULT_VIEW);
  const [traceX, setTraceX] = useState(1);

  const original = useMemo(() => sampleFunction(base, view.xMin, view.xMax, 800), [base, view.xMax, view.xMin]);
  const transformed = useMemo(() => sampleTransformed(base, a, b, h, k, view.xMin, view.xMax), [base, a, b, h, k, view.xMin, view.xMax]);
  const transformedTable = useMemo(() => transformed.points.filter((_, index) => index % 80 === 0).slice(0, 12), [transformed.points]);
  const originalTable = generateTableValues(base, -3, 3, 1);
  const roots = approximateRoots(base, view.xMin, view.xMax);
  const visibleRange = approximateVisibleRange(base, view.xMin, view.xMax);
  const symmetry = detectSymmetry(base);
  const behaviorSummary = [
    `Base function: ${base}`,
    `Transformation: g(x) = ${formatCoefficient(a)} f(${formatCoefficient(b)}(x - ${formatNumber(h)})) + ${formatNumber(k)}`,
    `Approx roots: ${roots.roots.length ? roots.roots.map(formatNumber).join(", ") : "none visible"}`,
    `Approx visible range: ${visibleRange.min !== null && visibleRange.max !== null ? `${formatNumber(visibleRange.min)} to ${formatNumber(visibleRange.max)}` : "no real visible values"}`,
    `Symmetry: ${symmetry}`,
  ].join("\n");

  const notes = (
    <>
      <InfoCallout title="Transformation meaning">
        <div className="space-y-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
          <p><strong>h</strong> shifts the graph horizontally. Positive h moves the graph right.</p>
          <p><strong>k</strong> shifts the graph vertically.</p>
          <p><strong>a</strong> stretches, compresses, or reflects the graph vertically.</p>
          <p><strong>b</strong> stretches or compresses the graph horizontally.</p>
        </div>
      </InfoCallout>
      <InfoCallout title="Real-world use" tone="success">
        <div className="flex flex-wrap gap-2">
          {["physics motion", "economics curves", "signal processing", "engineering design"].map((item) => <span key={item} className="mini-chip">{item}</span>)}
        </div>
      </InfoCallout>
    </>
  );

  return (
    <MathLabLayout
      title="Function Explorer"
      subtitle="Explore domain, range, intercepts, symmetry, and transformations with the live formula g(x) = a f(b(x-h)) + k."
      notes={notes}
    >
      <div className="grid gap-6 xl:grid-cols-[360px_minmax(0,1fr)]">
        <SectionCard title="Base Function" description="Enter f(x), then transform it with the sliders.">
          <div className="sticky top-20 z-20 mb-4 flex flex-wrap gap-2 rounded-2xl border border-slate-200 bg-white/90 p-2 backdrop-blur dark:border-white/10 dark:bg-slate-950/90">
            <ResetExampleButton onClick={() => { setBase("x^2"); reset(); }} />
            <button type="button" className="tool-button" onClick={tryRandom}><Dices className="h-4 w-4" />Try random</button>
            <CopyResultButton value={behaviorSummary} />
          </div>
          <label className="text-sm font-bold text-slate-600 dark:text-slate-300">
            f(x)
            <input
              className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-3 font-mono outline-none focus:border-cyan-400 dark:border-white/10 dark:bg-slate-950"
              value={base}
              onChange={(event) => setBase(event.target.value)}
            />
          </label>
          <MathErrorBox error={original.error ?? transformed.error} />
          <div className="mt-4"><PresetChips examples={EXAMPLES} onSelect={setBase} /></div>
          <div className="mt-6 space-y-4">
            <SliderControl label="Vertical stretch a" min={-3} max={3} step={0.1} value={a} onChange={setA} />
            <SliderControl label="Horizontal factor b" min={-3} max={3} step={0.1} value={b} onChange={(value) => setB(value === 0 ? 0.1 : value)} />
            <SliderControl label="Horizontal shift h" min={-6} max={6} step={0.1} value={h} onChange={setH} />
            <SliderControl label="Vertical shift k" min={-6} max={6} step={0.1} value={k} onChange={setK} />
          </div>
          <div className="mt-5 flex flex-wrap gap-2">
            <button type="button" className={showOriginal ? "action-primary" : "tool-button"} onClick={() => setShowOriginal((value) => !value)}>{showOriginal ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}Original</button>
            <button type="button" className={showTransformed ? "action-primary" : "tool-button"} onClick={() => setShowTransformed((value) => !value)}>{showTransformed ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}Transformed</button>
            <button type="button" className="tool-button" onClick={reset}><RotateCcw className="h-4 w-4" />Reset</button>
          </div>
        </SectionCard>

        <SectionCard title="Original And Transformed Graph" description="Blue is f(x). Orange is g(x). Move across the graph or slider to trace the transformed curve.">
          <div className="mb-4 flex flex-wrap gap-2">
            <span className="mini-chip"><span className="mr-1 inline-block h-2.5 w-2.5 rounded-full bg-cyan-500" />Original f(x)</span>
            <span className="mini-chip"><span className="mr-1 inline-block h-2.5 w-2.5 rounded-full bg-orange-500" />Transformed g(x)</span>
            <FullscreenButton targetId="function-explorer-graph" />
            <ExportImageButton targetId="function-explorer-graph" filename="function-explorer.png" />
          </div>
          <div id="function-explorer-graph">
          {original.error || transformed.error ? (
            <LoadingSkeleton label="Waiting for a valid base function" />
          ) : (
            <FunctionGraphCanvas
              view={view}
              showGrid
              showAxes
              traceX={traceX}
              selectedSeriesId="transformed"
              onTraceChange={setTraceX}
              series={[
                { id: "original", label: `f(x) = ${base}`, color: "#06b6d4", visible: showOriginal && !original.error, points: original.points },
                { id: "transformed", label: "g(x)", color: "#f97316", visible: showTransformed && !transformed.error, points: transformed.points },
              ]}
            />
          )}
          </div>
          <label className="mt-4 block rounded-2xl bg-slate-100 p-4 text-sm font-semibold dark:bg-white/10">
            Trace x: {formatNumber(traceX)}
            <input className="slider-range mt-3 w-full" type="range" min={view.xMin} max={view.xMax} step={(view.xMax - view.xMin) / 400} value={traceX} onChange={(event) => setTraceX(Number(event.target.value))} />
          </label>
        </SectionCard>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <SectionCard title="Transformation Formula">
          <FormulaBlock title="Live formula" formula={`g(x)=${formatCoefficient(a)}f(${formatCoefficient(b)}(x-${formatNumber(h)}))+${formatNumber(k)}`} />
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <AnalysisTile label="a" value={a < 0 ? "Reflects over x-axis and changes vertical scale." : "Changes vertical scale."} />
            <AnalysisTile label="b" value={Math.abs(b) > 1 ? "Compresses horizontally." : "Stretches horizontally."} />
            <AnalysisTile label="h" value={h === 0 ? "No horizontal shift." : h > 0 ? "Shifts right." : "Shifts left."} />
            <AnalysisTile label="k" value={k === 0 ? "No vertical shift." : k > 0 ? "Shifts up." : "Shifts down."} />
          </div>
        </SectionCard>

        <SectionCard title="Function Behavior" description="Analysis is approximate and uses real-valued samples in the visible window.">
          <ApproxBadge />
          <div className="grid gap-3 md:grid-cols-2">
            <AnalysisTile label="Original roots" value={roots.roots.length ? roots.roots.map(formatNumber).join(", ") : "No visible root found"} />
            <AnalysisTile label="Visible range" value={visibleRange.min !== null && visibleRange.max !== null ? `${formatNumber(visibleRange.min)} to ${formatNumber(visibleRange.max)}` : "No real values visible"} />
            <AnalysisTile label="Symmetry check" value={symmetry} />
            <AnalysisTile label="Domain warning" value={original.points.some((point) => !point.valid) ? "Some x-values are undefined." : "All sampled x-values are real here."} />
          </div>
        </SectionCard>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <SectionCard title="Original Table">
          <ValueTable rows={originalTable.rows.slice(0, 7)} />
        </SectionCard>
        <SectionCard title="Transformed Table">
          <ValueTable rows={transformedTable} />
        </SectionCard>
      </div>

      <StepPanel steps={[
        { title: "Start with the base function", explanation: "The blue curve is the graph of f(x).", formula: "y=f(x)" },
        { title: "Transform the input", explanation: "The expression b(x-h) shifts and horizontally scales the input before f is evaluated.", formula: "f(b(x-h))" },
        { title: "Transform the output", explanation: "The a and k controls stretch, reflect, and shift the output after f is evaluated.", formula: "g(x)=a f(b(x-h))+k" },
      ]} />

      <ResultCard title="Explorer Summary" result={<p className="font-semibold">This page uses real sampling of the entered function and transformed function. Intercepts, range, and symmetry are shown as numeric checks, so the labels stay honest when exact symbolic facts are not available.</p>} verification={<p className="text-sm leading-6 text-slate-600 dark:text-slate-300">Try <span className="font-mono">x^2</span> with h = 2 and k = -4 to see a vertex shift to the right and down.</p>} relatedTools={[{ label: "Graphing Calculator", route: "/math-lab/graphing-calculator" }, { label: "Calculus", route: "/math-lab/calculus" }]} />
    </MathLabLayout>
  );

  function reset() {
    setA(1);
    setB(1);
    setH(0);
    setK(0);
    setTraceX(1);
  }

  function tryRandom() {
    setBase(EXAMPLES[Math.floor(Math.random() * EXAMPLES.length)]);
    reset();
  }
}

function sampleTransformed(input: string, a: number, b: number, h: number, k: number, xMin: number, xMax: number) {
  const compiled = compileFunction(input);
  if (!compiled.fn) return { points: [] as GraphSample[], error: compiled.error };
  const count = 800;
  const points = Array.from({ length: count }, (_, index) => {
    const x = xMin + (index / (count - 1)) * (xMax - xMin);
    try {
      const y = a * compiled.fn!(b * (x - h)) + k;
      return Number.isFinite(y) ? { x, y, valid: true } : { x, y: null, valid: false };
    } catch {
      return { x, y: null, valid: false };
    }
  });
  return { points };
}

function detectSymmetry(input: string) {
  const compiled = compileFunction(input);
  if (!compiled.fn) return "Cannot check until the function is valid.";
  let evenError = 0;
  let oddError = 0;
  let count = 0;
  for (let x = 0.5; x <= 5; x += 0.5) {
    try {
      const y1 = compiled.fn(x);
      const y2 = compiled.fn(-x);
      if (!Number.isFinite(y1) || !Number.isFinite(y2)) continue;
      evenError += Math.abs(y1 - y2);
      oddError += Math.abs(y1 + y2);
      count += 1;
    } catch {
      continue;
    }
  }
  if (!count) return "Not enough real samples to check symmetry.";
  if (evenError / count < 0.01) return "Even function, approximately f(-x) = f(x).";
  if (oddError / count < 0.01) return "Odd function, approximately f(-x) = -f(x).";
  return "Neither even nor odd over sampled points.";
}

function ValueTable({ rows }: { rows: GraphSample[] }) {
  if (!rows.length) return <EmptyState title="No table values" message="Enter a valid function to populate this table." />;
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-white/10">
      <table className="w-full text-left text-sm">
        <thead className="bg-slate-100 dark:bg-slate-900"><tr><th className="p-3">x</th><th className="p-3">y</th></tr></thead>
        <tbody>
          {rows.map((row) => <tr key={`${row.x}-${row.y}`} className="border-t border-slate-100 dark:border-white/10"><td className="p-3 font-mono">{formatNumber(row.x)}</td><td className="p-3 font-mono">{row.valid && row.y !== null ? formatNumber(row.y) : "undefined"}</td></tr>)}
        </tbody>
      </table>
    </div>
  );
}

function AnalysisTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-slate-100 p-4 dark:bg-white/10">
      <p className="text-xs font-black uppercase text-slate-500">{label}</p>
      <p className="mt-2 text-sm font-semibold leading-6 text-slate-700 dark:text-slate-200">{value}</p>
    </div>
  );
}

function formatCoefficient(value: number) {
  return Number(value.toFixed(3)).toString();
}

function formatNumber(value: number) {
  if (!Number.isFinite(value)) return "undefined";
  if (Math.abs(value) >= 10000 || (Math.abs(value) > 0 && Math.abs(value) < 0.001)) return value.toExponential(3);
  return Number(value.toFixed(4)).toString();
}
