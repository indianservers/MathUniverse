import { useMemo, useState } from "react";
import SectionCard from "../components/ui/SectionCard";
import SliderControl from "../components/ui/SliderControl";
import TopicHeader from "../components/ui/TopicHeader";
import { compileFunctionExpression } from "../utils/functionParser";
import { roundTo } from "../utils/math";

type PresetKind = "input" | "jump" | "removable" | "step";
type SamplePoint = { x: number; y: number; defined: boolean };

const presets: { title: string; expression: string; kind: PresetKind; description: string }[] = [
  { title: "x^2", expression: "x^2", kind: "input", description: "A continuous parabola." },
  { title: "sin(x)/x", expression: "sin(x)/x", kind: "input", description: "Undefined at 0 but limit exists." },
  { title: "1/x", expression: "1/x", kind: "input", description: "Infinite discontinuity at 0." },
  { title: "Piecewise jump", expression: "piecewise jump", kind: "jump", description: "Left and right limits disagree." },
  { title: "Removable discontinuity", expression: "removable discontinuity", kind: "removable", description: "Limit exists but f(a) is missing." },
  { title: "Step function", expression: "step function", kind: "step", description: "A floor-like jump at integers." },
  { title: "Absolute value", expression: "abs(x)", kind: "input", description: "Continuous with a sharp corner." },
  { title: "Floor function", expression: "floor(x)", kind: "input", description: "Jump discontinuities at integers." },
];

export default function LimitsContinuityVisualizer() {
  const [expression, setExpression] = useState("sin(x)/x");
  const [draft, setDraft] = useState("sin(x)/x");
  const [kind, setKind] = useState<PresetKind>("input");
  const [a, setA] = useState(0);
  const [approach, setApproach] = useState(1.2);

  const compiled = useMemo(() => {
    try {
      if (kind !== "input") return { fn: specialFunction(kind), error: "" };
      return { fn: compileFunctionExpression(expression), error: "" };
    } catch (error) {
      return { fn: null, error: error instanceof Error ? error.message : "Invalid function" };
    }
  }, [expression, kind]);

  const samples = useMemo(() => compiled.fn ? sample(compiled.fn, -8, 8) : [], [compiled.fn]);
  const limitInfo = useMemo(() => compiled.fn ? analyzeLimit(compiled.fn, a, kind, expression) : null, [compiled.fn, a, kind, expression]);
  const leftX = a - approach;
  const rightX = a + approach;
  const leftPoint = compiled.fn ? pointAt(compiled.fn, leftX) : null;
  const rightPoint = compiled.fn ? pointAt(compiled.fn, rightX) : null;
  const atPoint = compiled.fn ? pointAt(compiled.fn, a) : null;

  const setPreset = (preset: typeof presets[number]) => {
    setExpression(preset.expression);
    setDraft(preset.expression);
    setKind(preset.kind);
    if (preset.kind !== "input") setA(0);
  };

  return (
    <div className="space-y-6">
      <TopicHeader title="Limits and Continuity Visualizer" subtitle="Compare left-hand limits, right-hand limits, two-sided limits, function values, and discontinuity types at a chosen point." difficulty="Calculus Foundations" estimatedMinutes={18} />

      <div className="grid gap-6 xl:grid-cols-[360px_minmax(0,1fr)]">
        <SectionCard title="Function and Limit Controls" description="Choose or type a function, then move the approach point a.">
          <div className="space-y-4">
            <label className="block">
              <span className="text-sm font-bold">f(x)</span>
              <div className="mt-2 flex gap-2">
                <input value={draft} onChange={(event) => { setDraft(event.target.value); setKind("input"); }} onKeyDown={(event) => { if (event.key === "Enter") setExpression(draft); }} className="premium-input min-h-11" />
                <button type="button" className="action-primary px-4" onClick={() => { setKind("input"); setExpression(draft); }}>Plot</button>
              </div>
              {compiled.error && <p className="mt-2 rounded-xl bg-rose-50 p-3 text-sm font-semibold text-rose-700 dark:bg-rose-400/10 dark:text-rose-200">{compiled.error}</p>}
            </label>
            <SliderControl label="Limit point a" value={a} min={-5} max={5} step={0.05} onChange={setA} />
            <SliderControl label="Approach distance" value={approach} min={0.05} max={3} step={0.05} onChange={setApproach} />
            <div className="grid grid-cols-2 gap-2">
              <Metric label="left x" value={roundTo(leftX, 3).toString()} />
              <Metric label="right x" value={roundTo(rightX, 3).toString()} />
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Limit Graph" description="Blue is the graph, orange and violet points approach x = a from left and right." tone="spotlight">
          <LimitGraph samples={samples} a={a} leftPoint={leftPoint} rightPoint={rightPoint} atPoint={atPoint} />
        </SectionCard>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_420px]">
        <SectionCard title="Continuity Checker">
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            <Metric label="Left-hand limit" value={formatValue(limitInfo?.left)} />
            <Metric label="Right-hand limit" value={formatValue(limitInfo?.right)} />
            <Metric label="f(a) defined" value={limitInfo?.defined ? "yes" : "no"} />
            <Metric label="Two-sided limit" value={limitInfo?.limitExists ? "exists" : "does not exist"} />
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <Metric label="Final status" value={limitInfo?.continuous ? "Continuous at x = a" : "Not continuous at x = a"} />
            <Metric label="Classification" value={limitInfo?.classification ?? "unknown"} />
          </div>
        </SectionCard>

        <SectionCard title="Concept Explanation">
          <div className="space-y-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
            <p>A function is continuous at <strong>x = a</strong> if:</p>
            <p className="rounded-2xl bg-slate-100 p-3 font-mono text-xs font-bold dark:bg-slate-950">f(a) exists, lim x-&gt;a f(x) exists, and lim x-&gt;a f(x) = f(a)</p>
            <p>The left-hand and right-hand limits must approach the same value. If the function value is missing or different, the graph has a discontinuity.</p>
          </div>
        </SectionCard>
      </div>

      <SectionCard title="Presets" description="Click a card to load common continuity examples.">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {presets.map((preset) => (
            <button key={preset.title} type="button" onClick={() => setPreset(preset)} className="cinematic-preset-button">
              <h3 className="font-black">{preset.title}</h3>
              <p className="mt-2 font-mono text-sm text-cyan-700 dark:text-cyan-300">{preset.expression}</p>
              <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{preset.description}</p>
            </button>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}

function LimitGraph({ samples, a, leftPoint, rightPoint, atPoint }: { samples: SamplePoint[]; a: number; leftPoint: SamplePoint | null; rightPoint: SamplePoint | null; atPoint: SamplePoint | null }) {
  const width = 760, height = 460, pad = 44, xMin = -8, xMax = 8, yMin = -8, yMax = 8;
  const sx = (x: number) => pad + ((x - xMin) / (xMax - xMin)) * (width - pad * 2);
  const sy = (y: number) => height - pad - ((y - yMin) / (yMax - yMin)) * (height - pad * 2);
  return (
    <svg viewBox="0 0 760 460" className="cinematic-svg-stage sm:h-[460px]">
      <defs>
        <radialGradient id="limit-bg" cx="50%" cy="45%" r="72%">
          <stop offset="0%" stopColor="#12395a" stopOpacity="0.72" />
          <stop offset="56%" stopColor="#07182d" stopOpacity="0.94" />
          <stop offset="100%" stopColor="#020617" />
        </radialGradient>
        <filter id="limit-glow" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="2.4" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
      </defs>
      <rect x="0" y="0" width="760" height="460" fill="url(#limit-bg)" />
      {gridLines(width, height, pad)}
      <line x1={sx(0)} x2={sx(0)} y1={pad} y2={height - pad} stroke="#e2e8f0" strokeOpacity="0.72" strokeWidth="2" />
      <line x1={pad} x2={width - pad} y1={sy(0)} y2={sy(0)} stroke="#e2e8f0" strokeOpacity="0.72" strokeWidth="2" />
      <line x1={sx(a)} x2={sx(a)} y1={pad} y2={height - pad} stroke="#ef4444" strokeWidth="3" strokeDasharray="8 7" />
      <text x={sx(a) + 6} y={pad + 18} fontSize="13" fontWeight="900" fill="#fecaca">x = a</text>
      <path d={pointsToPath(samples, sx, sy, yMin, yMax)} fill="none" stroke="#22d3ee" strokeWidth="4" filter="url(#limit-glow)" />
      {leftPoint?.defined && <GraphPoint x={sx(leftPoint.x)} y={sy(leftPoint.y)} label="left" color="#f59e0b" />}
      {rightPoint?.defined && <GraphPoint x={sx(rightPoint.x)} y={sy(rightPoint.y)} label="right" color="#8b5cf6" />}
      {atPoint?.defined && <GraphPoint x={sx(atPoint.x)} y={sy(atPoint.y)} label="f(a)" color="#ef4444" />}
    </svg>
  );
}

function specialFunction(kind: PresetKind) {
  if (kind === "jump") return (x: number) => x < 0 ? -1 : 2;
  if (kind === "removable") return (x: number) => Math.abs(x) < 1e-9 ? NaN : (x * x - 1) / (x - 1);
  if (kind === "step") return (x: number) => x < 0 ? -1 : 1;
  throw new Error("No special function");
}

function analyzeLimit(fn: (x: number) => number, a: number, kind: PresetKind, expression: string) {
  const eps = [0.2, 0.1, 0.05, 0.02, 0.01];
  const left = averageTail(eps.map((e) => safeValue(fn, a - e)));
  const right = averageTail(eps.map((e) => safeValue(fn, a + e)));
  const value = safeValue(fn, a);
  const defined = Number.isFinite(value);
  const close = Number.isFinite(left) && Number.isFinite(right) && Math.abs(left - right) < 0.12;
  const limit = close ? (left + right) / 2 : NaN;
  const continuous = defined && close && Math.abs(value - limit) < 0.12;
  const lower = expression.toLowerCase();
  const classification = continuous ? "Continuous" : !Number.isFinite(left) || !Number.isFinite(right) || lower.includes("1/x") ? "Infinite discontinuity" : close && !defined ? "Removable discontinuity" : close && defined ? "Removable/value mismatch" : kind === "step" || kind === "jump" || lower.includes("floor") ? "Jump discontinuity" : "Oscillatory / undefined behavior";
  return { left, right, defined, limitExists: close, continuous, classification };
}

function sample(fn: (x: number) => number, min: number, max: number) {
  return Array.from({ length: 520 }, (_, i) => pointAt(fn, min + (i / 519) * (max - min)));
}

function pointAt(fn: (x: number) => number, x: number): SamplePoint {
  const y = safeValue(fn, x);
  return { x, y, defined: Number.isFinite(y) && Math.abs(y) < 1e5 };
}

function safeValue(fn: (x: number) => number, x: number) {
  try {
    const y = fn(x);
    return Number.isFinite(y) ? y : NaN;
  } catch {
    return NaN;
  }
}

function averageTail(values: number[]) {
  const finite = values.filter(Number.isFinite);
  return finite.length ? finite.slice(-3).reduce((sum, value) => sum + value, 0) / Math.min(3, finite.length) : NaN;
}

function pointsToPath(points: SamplePoint[], sx: (x: number) => number, sy: (y: number) => number, yMin: number, yMax: number) {
  let open = false;
  return points.map((point) => {
    if (!point.defined || point.y < yMin - 8 || point.y > yMax + 8) {
      open = false;
      return "";
    }
    const command = open ? "L" : "M";
    open = true;
    return `${command}${sx(point.x)},${sy(point.y)}`;
  }).join(" ");
}

function gridLines(width: number, height: number, pad: number) {
  return <g>{Array.from({ length: 11 }).map((_, i) => <line key={`v-${i}`} x1={pad + i * (width - pad * 2) / 10} x2={pad + i * (width - pad * 2) / 10} y1={pad} y2={height - pad} stroke="#67e8f9" opacity="0.16" />)}{Array.from({ length: 9 }).map((_, i) => <line key={`h-${i}`} x1={pad} x2={width - pad} y1={pad + i * (height - pad * 2) / 8} y2={pad + i * (height - pad * 2) / 8} stroke="#67e8f9" opacity="0.16" />)}</g>;
}

function GraphPoint({ x, y, label, color }: { x: number; y: number; label: string; color: string }) {
  return <g filter="url(#limit-glow)"><circle cx={x} cy={y} r="8" fill={color} stroke="#020617" strokeWidth="2" /><text x={x + 12} y={y - 10} fontSize="13" fontWeight="900" fill="#f8fafc">{label}</text></g>;
}

function Metric({ label, value }: { label: string; value: string }) {
  return <div className="cinematic-stat"><p className="cinematic-stat-label">{label}</p><p className="cinematic-stat-value">{value}</p></div>;
}

function formatValue(value?: number) {
  return value === undefined || !Number.isFinite(value) ? "undefined" : roundTo(value, 4).toString();
}

