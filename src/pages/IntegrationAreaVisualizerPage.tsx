import { useEffect, useMemo, useState } from "react";
import { Pause, Play, RotateCcw } from "lucide-react";
import SectionCard from "../components/ui/SectionCard";
import SliderControl from "../components/ui/SliderControl";
import TopicHeader from "../components/ui/TopicHeader";
import { compileFunctionExpression } from "../utils/functionParser";
import { roundTo } from "../utils/math";

type Method = "left" | "right" | "midpoint" | "trapezoid" | "simpson";
type Point = { x: number; y: number; defined: boolean };

const presets = ["x", "x^2", "x^3", "sin(x)", "cos(x)", "exp(x)", "1/x", "sqrt(x)", "x^2 + 2*x + 1"];
const methodLabels: Record<Method, string> = {
  left: "Left Riemann Sum",
  right: "Right Riemann Sum",
  midpoint: "Midpoint Riemann Sum",
  trapezoid: "Trapezoidal Rule",
  simpson: "Simpson's Rule",
};

export default function IntegrationAreaVisualizerPage() {
  const [expression, setExpression] = useState("x^2");
  const [draft, setDraft] = useState("x^2");
  const [secondExpression, setSecondExpression] = useState("x");
  const [secondDraft, setSecondDraft] = useState("x");
  const [useSecondCurve, setUseSecondCurve] = useState(false);
  const [lower, setLower] = useState(-2);
  const [upper, setUpper] = useState(3);
  const [partitions, setPartitions] = useState(12);
  const [method, setMethod] = useState<Method>("midpoint");
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    if (!animating) return;
    const id = window.setInterval(() => {
      setPartitions((value) => value >= 80 ? 4 : value + 2);
    }, 350);
    return () => window.clearInterval(id);
  }, [animating]);

  const compiled = useMemo(() => {
    try {
      return { fn: compileFunctionExpression(expression), error: "" };
    } catch (error) {
      return { fn: null, error: error instanceof Error ? error.message : "Invalid function" };
    }
  }, [expression]);

  const compiledSecond = useMemo(() => {
    try {
      return { fn: compileFunctionExpression(secondExpression), error: "" };
    } catch (error) {
      return { fn: null, error: error instanceof Error ? error.message : "Invalid second function" };
    }
  }, [secondExpression]);

  const intervalValid = lower !== upper;
  const left = Math.min(lower, upper);
  const right = Math.max(lower, upper);
  const n = Math.max(2, Math.round(partitions));
  const simpsonBlocked = method === "simpson" && n % 2 !== 0;
  const result = useMemo(() => {
    if (!compiled.fn || !intervalValid) return null;
    if (useSecondCurve && !compiledSecond.fn) return null;
    return calculateIntegral(compiled.fn, useSecondCurve ? compiledSecond.fn : null, left, right, n, method);
  }, [compiled.fn, compiledSecond.fn, intervalValid, left, right, n, method, useSecondCurve]);

  const graphData = useMemo(() => compiled.fn ? sampleCurves(compiled.fn, useSecondCurve ? compiledSecond.fn : null, -8, 8) : { f: [], g: [] }, [compiled.fn, compiledSecond.fn, useSecondCurve]);

  return (
    <div className="space-y-6">
      <TopicHeader title="Integration and Area Visualizer" subtitle="Explore definite integrals as accumulated area with Riemann sums, trapezoids, Simpson approximation, and area between curves." difficulty="Integral Calculus" estimatedMinutes={22} />

      <div className="grid gap-6 xl:grid-cols-[380px_minmax(0,1fr)]">
        <SectionCard title="Function Input and Method Controls" description="Enter functions, choose limits, and compare numerical approximation methods.">
          <div className="space-y-4">
            <FunctionInput label="f(x)" draft={draft} setDraft={setDraft} apply={() => setExpression(draft)} error={compiled.error} />
            <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-3 text-sm font-bold dark:border-white/10 dark:bg-white/5">
              <input type="checkbox" checked={useSecondCurve} onChange={(event) => setUseSecondCurve(event.target.checked)} />
              Area between f(x) and g(x)
            </label>
            {useSecondCurve && <FunctionInput label="g(x)" draft={secondDraft} setDraft={setSecondDraft} apply={() => setSecondExpression(secondDraft)} error={compiledSecond.error} />}

            <div className="grid grid-cols-2 gap-3">
              <NumberInput label="lower limit a" value={lower} onChange={setLower} />
              <NumberInput label="upper limit b" value={upper} onChange={setUpper} />
            </div>
            <SliderControl label="number of partitions n" value={n} min={2} max={100} step={1} onChange={setPartitions} />
            <label className="block">
              <span className="text-sm font-bold">Numerical method</span>
              <select value={method} onChange={(event) => setMethod(event.target.value as Method)} className="mt-2 min-h-11 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm font-bold outline-none focus:border-cyan-400 dark:border-white/10 dark:bg-slate-950">
                {Object.entries(methodLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
              </select>
            </label>
            <div className="flex flex-wrap gap-2">
              <button type="button" onClick={() => setAnimating((value) => !value)} className={animating ? "action-primary" : "action-secondary"}>{animating ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}{animating ? "Pause" : "Animate partitions"}</button>
              <button type="button" onClick={() => { setAnimating(false); setPartitions(12); }} className="action-secondary"><RotateCcw className="h-4 w-4" />Reset n</button>
            </div>
            {!intervalValid && <ErrorBox message="Lower and upper limits must be different." />}
            {simpsonBlocked && <ErrorBox message="Simpson's Rule requires an even number of partitions. Use an even n or choose another method." />}
          </div>
        </SectionCard>

        <SectionCard title="Graph and Area" description="Blue is f(x), violet is g(x) when enabled, orange shading shows the area being accumulated." tone="spotlight">
          <IntegralGraph f={graphData.f} g={graphData.g} fn={compiled.fn} gn={useSecondCurve ? compiledSecond.fn : null} lower={left} upper={right} n={n} method={method} useSecondCurve={useSecondCurve} />
        </SectionCard>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_420px]">
        <SectionCard title="Numerical Result Panel">
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            <Metric label="Approx integral" value={format(result?.approx)} />
            <Metric label="Method" value={methodLabels[method]} />
            <Metric label="Partitions" value={n.toString()} />
            <Metric label="Delta x" value={format(result?.dx)} />
            <Metric label="Positive area" value={format(result?.positiveArea)} />
            <Metric label="Negative area" value={format(result?.negativeArea)} />
            <Metric label="Net signed area" value={format(result?.signedArea)} />
            <Metric label="Area between curves" value={useSecondCurve ? format(result?.betweenArea) : "off"} />
          </div>
          {result?.undefinedCount ? <ErrorBox message={`${result.undefinedCount} sampled subinterval points were undefined or unstable. Try changing the interval or function.`} /> : null}
        </SectionCard>

        <SectionCard title="Educational Explanation">
          <div className="space-y-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
            <p>A definite integral adds tiny signed slices from <strong>x = a</strong> to <strong>x = b</strong>.</p>
            <p>Riemann sums use rectangles. Trapezoidal rule uses slanted tops. Simpson's rule uses parabolic arcs and usually becomes very accurate for smooth curves.</p>
            <p>More partitions make each slice thinner, so the approximation usually improves. Signed area counts region below the x-axis as negative, while geometric area counts all covered area as positive.</p>
          </div>
        </SectionCard>
      </div>

      <SectionCard title="Preset Examples" description="Load a common function and explore its accumulated area.">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {presets.map((preset) => (
            <button key={preset} type="button" onClick={() => { setDraft(preset); setExpression(preset); }} className="cinematic-preset-button font-mono">{preset}</button>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}

function IntegralGraph({ f, g, fn, gn, lower, upper, n, method, useSecondCurve }: { f: Point[]; g: Point[]; fn: ((x: number) => number) | null; gn: ((x: number) => number) | null; lower: number; upper: number; n: number; method: Method; useSecondCurve: boolean }) {
  const width = 760, height = 460, pad = 44, xMin = -8, xMax = 8, yMin = -8, yMax = 8;
  const sx = (x: number) => pad + ((x - xMin) / (xMax - xMin)) * (width - pad * 2);
  const sy = (y: number) => height - pad - ((y - yMin) / (yMax - yMin)) * (height - pad * 2);
  const dx = (upper - lower) / Math.max(1, n);
  const areaShapes = fn ? Array.from({ length: n }, (_, i) => {
    const x0 = lower + i * dx;
    const x1 = x0 + dx;
    const sampleX = method === "left" ? x0 : method === "right" ? x1 : (x0 + x1) / 2;
    const y0 = safe(fn, x0), y1 = safe(fn, x1), ys = safe(fn, sampleX);
    const base0 = useSecondCurve && gn ? safe(gn, x0) : 0;
    const base1 = useSecondCurve && gn ? safe(gn, x1) : 0;
    const baseS = useSecondCurve && gn ? safe(gn, sampleX) : 0;
    if (![y0, y1, ys, base0, base1, baseS].every(Number.isFinite)) return null;
    if (useSecondCurve) return <polygon key={i} points={`${sx(x0)},${sy(base0)} ${sx(x1)},${sy(base1)} ${sx(x1)},${sy(y1)} ${sx(x0)},${sy(y0)}`} fill="#f59e0b" opacity="0.24" stroke="#f59e0b" />;
    if (method === "trapezoid" || method === "simpson") return <polygon key={i} points={`${sx(x0)},${sy(0)} ${sx(x1)},${sy(0)} ${sx(x1)},${sy(y1)} ${sx(x0)},${sy(y0)}`} fill="#f59e0b" opacity="0.22" stroke="#f59e0b" />;
    return <rect key={i} x={sx(x0)} y={sy(Math.max(0, ys))} width={Math.max(1, sx(x1) - sx(x0))} height={Math.abs(sy(ys) - sy(0))} fill="#f59e0b" opacity="0.22" stroke="#f59e0b" />;
  }) : [];
  return (
    <svg viewBox="0 0 760 460" className="cinematic-svg-stage sm:h-[460px]">
      <defs>
        <radialGradient id="integral-bg" cx="50%" cy="45%" r="72%">
          <stop offset="0%" stopColor="#12395a" stopOpacity="0.72" />
          <stop offset="56%" stopColor="#07182d" stopOpacity="0.94" />
          <stop offset="100%" stopColor="#020617" />
        </radialGradient>
        <filter id="integral-glow" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="2.4" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
      </defs>
      <rect x="0" y="0" width="760" height="460" fill="url(#integral-bg)" />
      {grid(width, height, pad)}
      <line x1={sx(0)} x2={sx(0)} y1={pad} y2={height - pad} stroke="#e2e8f0" strokeOpacity="0.72" strokeWidth="2" />
      <line x1={pad} x2={width - pad} y1={sy(0)} y2={sy(0)} stroke="#e2e8f0" strokeOpacity="0.72" strokeWidth="2" />
      {areaShapes}
      <line x1={sx(lower)} x2={sx(lower)} y1={pad} y2={height - pad} stroke="#ef4444" strokeWidth="3" strokeDasharray="8 7" />
      <line x1={sx(upper)} x2={sx(upper)} y1={pad} y2={height - pad} stroke="#ef4444" strokeWidth="3" strokeDasharray="8 7" />
      <text x={sx(lower) + 5} y={pad + 18} fontSize="13" fontWeight="900" fill="#ef4444">a</text>
      <text x={sx(upper) + 5} y={pad + 18} fontSize="13" fontWeight="900" fill="#ef4444">b</text>
      <path d={path(f, sx, sy, yMin, yMax)} fill="none" stroke="#22d3ee" strokeWidth="4" filter="url(#integral-glow)" />
      {useSecondCurve && <path d={path(g, sx, sy, yMin, yMax)} fill="none" stroke="#c084fc" strokeWidth="4" filter="url(#integral-glow)" />}
      <text x="58" y="28" fontSize="13" fontWeight="900" fill="#67e8f9">f(x)</text>
      {useSecondCurve && <text x="112" y="28" fontSize="13" fontWeight="900" fill="#d8b4fe">g(x)</text>}
    </svg>
  );
}

function calculateIntegral(fn: (x: number) => number, gn: ((x: number) => number) | null, lower: number, upper: number, n: number, method: Method) {
  const dx = (upper - lower) / n;
  let approx = 0, signedArea = 0, positiveArea = 0, negativeArea = 0, betweenArea = 0, undefinedCount = 0;
  if (method === "simpson" && n % 2 === 0 && !gn) {
    let sum = safe(fn, lower) + safe(fn, upper);
    for (let i = 1; i < n; i += 1) {
      const y = safe(fn, lower + i * dx);
      if (!Number.isFinite(y)) undefinedCount += 1;
      sum += (i % 2 === 0 ? 2 : 4) * y;
    }
    approx = sum * dx / 3;
  }
  for (let i = 0; i < n; i += 1) {
    const x0 = lower + i * dx, x1 = x0 + dx, mid = (x0 + x1) / 2;
    const y0 = safe(fn, x0), y1 = safe(fn, x1), ym = safe(fn, mid);
    const g0 = gn ? safe(gn, x0) : 0, g1 = gn ? safe(gn, x1) : 0, gm = gn ? safe(gn, mid) : 0;
    if (![y0, y1, ym, g0, g1, gm].every(Number.isFinite)) {
      undefinedCount += 1;
      continue;
    }
    const signed = method === "left" ? y0 * dx : method === "right" ? y1 * dx : method === "trapezoid" ? (y0 + y1) * dx / 2 : ym * dx;
    if (!(method === "simpson" && n % 2 === 0 && !gn)) approx += gn ? Math.abs(ym - gm) * dx : signed;
    signedArea += signed;
    positiveArea += Math.max(0, ym) * dx;
    negativeArea += Math.min(0, ym) * dx;
    betweenArea += Math.abs(ym - gm) * dx;
  }
  return { approx, dx, signedArea, positiveArea, negativeArea, betweenArea, undefinedCount };
}

function sampleCurves(fn: (x: number) => number, gn: ((x: number) => number) | null, min: number, max: number) {
  const f: Point[] = [], g: Point[] = [];
  for (let i = 0; i < 520; i += 1) {
    const x = min + (i / 519) * (max - min);
    const y = safe(fn, x);
    f.push({ x, y, defined: Number.isFinite(y) && Math.abs(y) < 1e5 });
    if (gn) {
      const gy = safe(gn, x);
      g.push({ x, y: gy, defined: Number.isFinite(gy) && Math.abs(gy) < 1e5 });
    }
  }
  return { f, g };
}

function FunctionInput({ label, draft, setDraft, apply, error }: { label: string; draft: string; setDraft: (value: string) => void; apply: () => void; error: string }) {
  return (
    <label className="block">
      <span className="text-sm font-bold">{label}</span>
      <div className="mt-2 flex gap-2">
        <input value={draft} onChange={(event) => setDraft(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") apply(); }} className="premium-input min-h-11" />
        <button type="button" className="action-primary px-4" onClick={apply}>Plot</button>
      </div>
      {error && <ErrorBox message={error} />}
    </label>
  );
}

function NumberInput({ label, value, onChange }: { label: string; value: number; onChange: (value: number) => void }) {
  return <label className="block"><span className="text-xs font-black uppercase text-slate-500">{label}</span><input type="number" value={value} onChange={(event) => onChange(Number(event.target.value))} className="premium-input mt-1 min-h-10" /></label>;
}

function safe(fn: (x: number) => number, x: number) {
  try {
    const y = fn(x);
    return Number.isFinite(y) ? y : NaN;
  } catch {
    return NaN;
  }
}

function path(points: Point[], sx: (x: number) => number, sy: (y: number) => number, yMin: number, yMax: number) {
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

function grid(width: number, height: number, pad: number) {
  return <g>{Array.from({ length: 11 }).map((_, i) => <line key={`v-${i}`} x1={pad + i * (width - pad * 2) / 10} x2={pad + i * (width - pad * 2) / 10} y1={pad} y2={height - pad} stroke="#67e8f9" opacity="0.16" />)}{Array.from({ length: 9 }).map((_, i) => <line key={`h-${i}`} x1={pad} x2={width - pad} y1={pad + i * (height - pad * 2) / 8} y2={pad + i * (height - pad * 2) / 8} stroke="#67e8f9" opacity="0.16" />)}</g>;
}

function Metric({ label, value }: { label: string; value: string }) {
  return <div className="cinematic-stat"><p className="cinematic-stat-label">{label}</p><p className="cinematic-stat-value">{value}</p></div>;
}

function ErrorBox({ message }: { message: string }) {
  return <p className="mt-2 rounded-xl bg-rose-50 p-3 text-sm font-semibold text-rose-700 dark:bg-rose-400/10 dark:text-rose-200">{message}</p>;
}

function format(value?: number) {
  return value === undefined || !Number.isFinite(value) ? "undefined" : roundTo(value, 5).toString();
}

