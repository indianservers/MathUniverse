import { type MouseEvent, useMemo, useState } from "react";
import { RotateCcw, Search, ZoomIn, ZoomOut } from "lucide-react";
import SectionCard from "../components/ui/SectionCard";
import SliderControl, { SliderGroup } from "../components/ui/SliderControl";
import TopicHeader from "../components/ui/TopicHeader";
import { compileFunctionExpression } from "../utils/functionParser";
import { roundTo } from "../utils/math";

type Point = { x: number; y: number; defined: boolean };

const presets = [
  { title: "Linear function", expression: "x", kind: "Linear" },
  { title: "Quadratic parabola", expression: "x^2", kind: "Quadratic" },
  { title: "Cubic curve", expression: "x^3", kind: "Cubic" },
  { title: "Sine wave", expression: "sin(x)", kind: "Trigonometric" },
  { title: "Cosine wave", expression: "cos(x)", kind: "Trigonometric" },
  { title: "Exponential growth", expression: "exp(x)", kind: "Exponential" },
  { title: "Logarithmic curve", expression: "log(x)", kind: "Logarithmic" },
  { title: "Reciprocal function", expression: "1/x", kind: "Rational" },
  { title: "Absolute value", expression: "abs(x)", kind: "Piecewise" },
  { title: "Square root function", expression: "sqrt(x)", kind: "Radical" },
];

export default function FunctionsGraphsVisualizer() {
  const [expression, setExpression] = useState("x^2");
  const [draft, setDraft] = useState("x^2");
  const [xMin, setXMin] = useState(-10);
  const [xMax, setXMax] = useState(10);
  const [yMin, setYMin] = useState(-10);
  const [yMax, setYMax] = useState(10);
  const [h, setH] = useState(0);
  const [k, setK] = useState(0);
  const [a, setA] = useState(1);
  const [b, setB] = useState(1);
  const [hover, setHover] = useState<Point | null>(null);

  const compiled = useMemo(() => {
    try {
      return { fn: compileFunctionExpression(expression), error: "" };
    } catch (error) {
      return { fn: null, error: error instanceof Error ? error.message : "Invalid function" };
    }
  }, [expression]);

  const original = useMemo(() => compiled.fn ? sampleFunction((x) => compiled.fn!(x), xMin, xMax) : [], [compiled.fn, xMin, xMax]);
  const transformed = useMemo(() => compiled.fn ? sampleFunction((x) => a * compiled.fn!(b * (x - h)) + k, xMin, xMax) : [], [compiled.fn, xMin, xMax, a, b, h, k]);
  const analysis = useMemo(() => analyzeFunction(original, compiled.fn, expression, xMin, xMax), [original, compiled.fn, expression, xMin, xMax]);
  const kind = detectKind(expression);

  const applyDraft = () => setExpression(draft);
  const resetView = () => { setXMin(-10); setXMax(10); setYMin(-10); setYMax(10); setH(0); setK(0); setA(1); setB(1); };
  const zoom = (factor: number) => {
    const cx = (xMin + xMax) / 2;
    const cy = (yMin + yMax) / 2;
    const halfX = ((xMax - xMin) * factor) / 2;
    const halfY = ((yMax - yMin) * factor) / 2;
    setXMin(roundTo(cx - halfX, 2));
    setXMax(roundTo(cx + halfX, 2));
    setYMin(roundTo(cy - halfY, 2));
    setYMax(roundTo(cy + halfY, 2));
  };

  return (
    <div className="space-y-6">
      <TopicHeader
        title="Functions and Graphs Visualizer"
        subtitle="Type or choose a function, compare original and transformed curves, inspect intercepts, domain behavior, symmetry, and graph movement."
        difficulty="Foundations / Calculus"
        estimatedMinutes={20}
      />

      <div className="grid gap-6 xl:grid-cols-[360px_minmax(0,1fr)]">
        <SectionCard title="Controls" description="Enter a function of x and adjust the viewing window and transformations.">
          <div className="space-y-4">
            <label className="block">
              <span className="text-sm font-bold">f(x)</span>
              <div className="mt-2 flex gap-2">
                <input value={draft} onChange={(event) => setDraft(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") applyDraft(); }} className="min-h-11 w-full rounded-2xl border border-slate-200 bg-white px-4 font-mono text-sm outline-none focus:border-cyan-400 dark:border-white/10 dark:bg-slate-950" />
                <button type="button" onClick={applyDraft} className="action-primary px-3"><Search className="h-4 w-4" /></button>
              </div>
              {compiled.error && <p className="mt-2 rounded-xl bg-rose-50 p-3 text-sm font-semibold text-rose-700 dark:bg-rose-400/10 dark:text-rose-200">{compiled.error}</p>}
            </label>

            <div className="grid grid-cols-2 gap-3">
              <NumberInput label="x min" value={xMin} onChange={setXMin} />
              <NumberInput label="x max" value={xMax} onChange={setXMax} />
              <NumberInput label="y min" value={yMin} onChange={setYMin} />
              <NumberInput label="y max" value={yMax} onChange={setYMax} />
            </div>

            <div className="flex flex-wrap gap-2">
              <button type="button" className="action-secondary" onClick={() => zoom(0.7)}><ZoomIn className="h-4 w-4" />Zoom in</button>
              <button type="button" className="action-secondary" onClick={() => zoom(1.35)}><ZoomOut className="h-4 w-4" />Zoom out</button>
              <button type="button" className="action-secondary" onClick={resetView}><RotateCcw className="h-4 w-4" />Reset</button>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-white/5">
              <SliderGroup title="Transformation">
                <SliderControl density="compact" label="Vertical shift k" value={k} min={-8} max={8} step={0.1} onChange={setK} />
                <SliderControl density="compact" label="Horizontal shift h" value={h} min={-8} max={8} step={0.1} onChange={setH} />
                <SliderControl density="compact" label="Vertical stretch a" value={a} min={-4} max={4} step={0.1} onChange={setA} />
                <SliderControl density="compact" label="Horizontal stretch b" value={b} min={-4} max={4} step={0.1} onChange={setB} />
              </SliderGroup>
              <p className="mt-3 rounded-xl bg-white p-3 font-mono text-xs font-bold dark:bg-slate-950">y = {roundTo(a, 2)} f({roundTo(b, 2)}(x - {roundTo(h, 2)})) + {roundTo(k, 2)}</p>
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Graph" description="Original curve is blue. Transformed curve is orange. Move over the graph to read coordinates.">
          <FunctionGraph original={original} transformed={transformed} xMin={xMin} xMax={xMax} yMin={yMin} yMax={yMax} onHover={setHover} />
          <div className="mt-3 grid gap-3 md:grid-cols-3">
            <Metric label="Hover x" value={hover?.defined ? roundTo(hover.x, 3).toString() : "move on graph"} />
            <Metric label="Hover y" value={hover?.defined ? roundTo(hover.y, 3).toString() : "-"} />
            <Metric label="Function type" value={kind} />
          </div>
        </SectionCard>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_420px]">
        <SectionCard title="Key Features Detection" description="Approximate numerical analysis from sampled graph points.">
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            <Metric label="x-intercepts" value={analysis.xIntercepts.length ? analysis.xIntercepts.map((x) => roundTo(x, 3)).join(", ") : "none visible"} />
            <Metric label="y-intercept" value={analysis.yIntercept ?? "undefined"} />
            <Metric label="Symmetry" value={analysis.symmetry} />
            <Metric label="Undefined / gaps" value={analysis.gaps ? `${analysis.gaps} sampled gaps` : "none sampled"} />
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <Metric label="Increasing intervals" value={analysis.increasing || "not clear"} />
            <Metric label="Decreasing intervals" value={analysis.decreasing || "not clear"} />
          </div>
        </SectionCard>

        <SectionCard title="Learning Explanation">
          <div className="space-y-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
            <p><strong className="text-slate-900 dark:text-white">{expression}</strong> is detected as a <strong>{kind}</strong> style function.</p>
            <p>The blue graph shows the original function. The orange graph applies <strong>y = a f(b(x-h)) + k</strong>.</p>
            <p>Changing <strong>k</strong> moves the graph up or down. Changing <strong>h</strong> moves it left or right. Changing <strong>a</strong> stretches or reflects vertically. Changing <strong>b</strong> compresses, stretches, or reflects horizontally.</p>
          </div>
        </SectionCard>
      </div>

      <SectionCard title="Example Presets" description="Choose a common parent function and then experiment with transformations.">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {presets.map((preset) => (
            <button key={preset.title} type="button" onClick={() => { setDraft(preset.expression); setExpression(preset.expression); }} className="rounded-2xl border border-slate-200 bg-white p-4 text-left transition hover:-translate-y-0.5 hover:border-cyan-300 hover:shadow-lg hover:shadow-cyan-500/10 dark:border-white/10 dark:bg-white/5">
              <p className="text-xs font-black uppercase text-cyan-600 dark:text-cyan-300">{preset.kind}</p>
              <h3 className="mt-2 font-black">{preset.title}</h3>
              <p className="mt-2 font-mono text-sm text-slate-600 dark:text-slate-300">{preset.expression}</p>
            </button>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}

function FunctionGraph({ original, transformed, xMin, xMax, yMin, yMax, onHover }: { original: Point[]; transformed: Point[]; xMin: number; xMax: number; yMin: number; yMax: number; onHover: (point: Point | null) => void }) {
  const width = 760;
  const height = 460;
  const pad = 44;
  const sx = (x: number) => pad + ((x - xMin) / (xMax - xMin)) * (width - pad * 2);
  const sy = (y: number) => height - pad - ((y - yMin) / (yMax - yMin)) * (height - pad * 2);
  const path = (points: Point[]) => pointsToPath(points, sx, sy, yMin, yMax);
  const [active, setActive] = useState<Point | null>(null);
  const originVisible = xMin <= 0 && xMax >= 0 && yMin <= 0 && yMax >= 0;

  const handleMove = (event: MouseEvent<SVGSVGElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const px = ((event.clientX - rect.left) / rect.width) * width;
    const x = xMin + ((px - pad) / (width - pad * 2)) * (xMax - xMin);
    const nearest = nearestPoint(transformed, x);
    setActive(nearest);
    onHover(nearest);
  };

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="h-[340px] w-full rounded-2xl bg-slate-50 dark:bg-slate-950 sm:h-[460px]" onMouseMove={handleMove} onMouseLeave={() => { setActive(null); onHover(null); }}>
      <rect width={width} height={height} rx="22" fill="currentColor" className="text-slate-50 dark:text-slate-950" />
      {Array.from({ length: 11 }).map((_, i) => <line key={`vx-${i}`} x1={pad + i * (width - pad * 2) / 10} x2={pad + i * (width - pad * 2) / 10} y1={pad} y2={height - pad} stroke="#cbd5e1" opacity="0.65" />)}
      {Array.from({ length: 9 }).map((_, i) => <line key={`hy-${i}`} x1={pad} x2={width - pad} y1={pad + i * (height - pad * 2) / 8} y2={pad + i * (height - pad * 2) / 8} stroke="#cbd5e1" opacity="0.65" />)}
      {xMin <= 0 && xMax >= 0 && <line x1={sx(0)} x2={sx(0)} y1={pad} y2={height - pad} stroke="#0f172a" strokeWidth="2" />}
      {yMin <= 0 && yMax >= 0 && <line x1={pad} x2={width - pad} y1={sy(0)} y2={sy(0)} stroke="#0f172a" strokeWidth="2" />}
      {originVisible && <text x={sx(0) + 6} y={sy(0) - 8} fontSize="13" fontWeight="800" fill="#0f172a">O</text>}
      <path d={path(original)} fill="none" stroke="#0891b2" strokeWidth="4" />
      <path d={path(transformed)} fill="none" stroke="#f59e0b" strokeWidth="4" />
      <text x="58" y="28" fontSize="13" fontWeight="900" fill="#0891b2">original</text>
      <text x="145" y="28" fontSize="13" fontWeight="900" fill="#f59e0b">transformed</text>
      {active?.defined && yMin <= active.y && active.y <= yMax && (
        <g>
          <line x1={sx(active.x)} x2={sx(active.x)} y1={pad} y2={height - pad} stroke="#64748b" strokeDasharray="6 6" />
          <circle cx={sx(active.x)} cy={sy(active.y)} r="7" fill="#ef4444" stroke="#0f172a" strokeWidth="2" />
          <rect x={Math.min(width - 190, sx(active.x) + 12)} y={Math.max(52, sy(active.y) - 42)} width="172" height="34" rx="10" fill="#0f172a" />
          <text x={Math.min(width - 180, sx(active.x) + 22)} y={Math.max(74, sy(active.y) - 20)} fontSize="13" fontWeight="800" fill="#fff">{`(${roundTo(active.x, 2)}, ${roundTo(active.y, 2)})`}</text>
        </g>
      )}
    </svg>
  );
}

function NumberInput({ label, value, onChange }: { label: string; value: number; onChange: (value: number) => void }) {
  return (
    <label className="block">
      <span className="text-xs font-black uppercase text-slate-500">{label}</span>
      <input type="number" value={value} onChange={(event) => onChange(Number(event.target.value))} className="mt-1 min-h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-bold outline-none focus:border-cyan-400 dark:border-white/10 dark:bg-slate-950" />
    </label>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return <div className="rounded-2xl bg-slate-100 p-3 dark:bg-white/10"><p className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400">{label}</p><p className="mt-1 break-words font-mono text-sm font-bold">{value}</p></div>;
}

function sampleFunction(fn: (x: number) => number, min: number, max: number) {
  const count = 520;
  return Array.from({ length: count }, (_, i) => {
    const x = min + (i / (count - 1)) * (max - min);
    try {
      const y = fn(x);
      return { x, y, defined: Number.isFinite(y) && Math.abs(y) < 1e6 };
    } catch {
      return { x, y: NaN, defined: false };
    }
  });
}

function pointsToPath(points: Point[], sx: (x: number) => number, sy: (y: number) => number, yMin: number, yMax: number) {
  let open = false;
  return points.map((point) => {
    if (!point.defined || point.y < yMin - Math.abs(yMax - yMin) || point.y > yMax + Math.abs(yMax - yMin)) {
      open = false;
      return "";
    }
    const command = open ? "L" : "M";
    open = true;
    return `${command}${sx(point.x)},${sy(point.y)}`;
  }).join(" ");
}

function nearestPoint(points: Point[], x: number) {
  return points.reduce((best, point) => Math.abs(point.x - x) < Math.abs(best.x - x) ? point : best, points[0] ?? { x, y: NaN, defined: false });
}

function analyzeFunction(points: Point[], fn: ((x: number) => number) | null, expression: string, xMin: number, xMax: number) {
  const defined = points.filter((point) => point.defined);
  const xIntercepts: number[] = [];
  for (let i = 1; i < defined.length; i += 1) {
    const prev = defined[i - 1], current = defined[i];
    if (Math.abs(current.y) < 0.025) xIntercepts.push(current.x);
    else if (prev.y * current.y < 0) xIntercepts.push(prev.x - prev.y * (current.x - prev.x) / (current.y - prev.y));
  }
  const yIntercept = fn && xMin <= 0 && xMax >= 0 ? safeValue(fn, 0) : null;
  const gaps = points.filter((point) => !point.defined).length;
  return {
    xIntercepts: dedupeApprox(xIntercepts).slice(0, 8),
    yIntercept: yIntercept === null ? "outside view" : Number.isFinite(yIntercept) ? roundTo(yIntercept, 4).toString() : "undefined",
    symmetry: detectSymmetry(fn),
    gaps,
    increasing: intervalSummary(defined, true),
    decreasing: intervalSummary(defined, false),
    kind: detectKind(expression),
  };
}

function safeValue(fn: (x: number) => number, x: number) {
  try {
    const value = fn(x);
    return Number.isFinite(value) ? value : NaN;
  } catch {
    return NaN;
  }
}

function detectSymmetry(fn: ((x: number) => number) | null) {
  if (!fn) return "unknown";
  const samples = [0.5, 1, 1.75, 2.5, 3.25];
  let evenError = 0, oddError = 0, usable = 0;
  samples.forEach((x) => {
    const a = safeValue(fn, x), b = safeValue(fn, -x);
    if (Number.isFinite(a) && Number.isFinite(b)) {
      evenError += Math.abs(a - b);
      oddError += Math.abs(a + b);
      usable += 1;
    }
  });
  if (!usable) return "unknown";
  if (evenError / usable < 0.05) return "even";
  if (oddError / usable < 0.05) return "odd";
  return "neither";
}

function intervalSummary(points: Point[], increasing: boolean) {
  const intervals: string[] = [];
  let start: number | null = null;
  for (let i = 1; i < points.length; i += 1) {
    const delta = points[i].y - points[i - 1].y;
    const match = increasing ? delta > 0.01 : delta < -0.01;
    if (match && start === null) start = points[i - 1].x;
    if ((!match || i === points.length - 1) && start !== null) {
      const end = points[i - 1].x;
      if (end - start > 0.5) intervals.push(`[${roundTo(start, 1)}, ${roundTo(end, 1)}]`);
      start = null;
    }
  }
  return intervals.slice(0, 3).join(", ");
}

function dedupeApprox(values: number[]) {
  return values.filter((value, index) => values.findIndex((item) => Math.abs(item - value) < 0.12) === index);
}

function detectKind(expression: string) {
  const value = expression.replace(/\s+/g, "").toLowerCase();
  if (/sin|cos|tan/.test(value)) return "trigonometric";
  if (/exp/.test(value)) return "exponential";
  if (/log|ln/.test(value)) return "logarithmic";
  if (/sqrt/.test(value)) return "radical";
  if (/abs/.test(value)) return "absolute value";
  if (/\/x|1\/\(?x/.test(value)) return "rational";
  if (/x\^3/.test(value)) return "cubic polynomial";
  if (/x\^2/.test(value)) return "quadratic polynomial";
  if (/x/.test(value)) return "linear or algebraic";
  return "constant";
}
