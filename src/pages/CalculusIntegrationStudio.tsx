import { useEffect, useMemo, useState } from "react";
import {
  BarChart3,
  CheckCircle2,
  Expand,
  Grid3X3,
  Minus,
  Pause,
  Play,
  Plus,
  RotateCcw,
  Sigma,
} from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { compileFunctionExpression } from "../utils/functionParser";
import {
  calculateIntegration,
  enforcePartitionCount,
  highPrecisionIntegral,
  type IntegrationMethod,
  type IntegrationResult,
} from "../utils/integrationStudioMath";
import "./CalculusIntegrationStudio.css";

type Props = { mode: string };
type LearningMode = "Observe" | "Understand" | "Why" | "Try" | "Challenge";

const methods: Array<{ id: IntegrationMethod; label: string }> = [
  { id: "left", label: "Left" },
  { id: "midpoint", label: "Midpoint" },
  { id: "right", label: "Right" },
  { id: "trapezoid", label: "Trapezoid" },
  { id: "simpson", label: "Simpson" },
];

const modeCopy: Record<string, { title: string; eyebrow: string; explanation: string }> = {
  antiderivative: {
    title: "Antiderivative family",
    eyebrow: "Reverse differentiation",
    explanation: "Every vertical shift has the same derivative. Move C to inspect the family F(x) + C.",
  },
  definite: {
    title: "Definite integral",
    eyebrow: "Signed accumulation",
    explanation: "The shaded region records signed accumulation between the selected bounds.",
  },
  ftc: {
    title: "Fundamental Theorem of Calculus",
    eyebrow: "Accumulation and rate",
    explanation: "Move x to build F(x) from the lower bound. The slope of F at x matches f(x).",
  },
  riemann: {
    title: "Riemann sum explorer",
    eyebrow: "From slices to area",
    explanation: "Compare sampling methods and increase n to watch the approximation converge.",
  },
  numerical: {
    title: "Numerical method comparison",
    eyebrow: "Accuracy at a glance",
    explanation: "All five methods use the same function, interval, and partition count for a fair comparison.",
  },
};

export default function CalculusIntegrationStudio({ mode }: Props) {
  const [params, setParams] = useSearchParams();
  const initialMethod = parseMethod(params.get("v_method"));
  const [expression, setExpression] = useState(params.get("v_function") || "x^2");
  const [draft, setDraft] = useState(params.get("v_function") || "x^2");
  const [lower, setLower] = useState(numberParam(params.get("v_lower_a"), -2));
  const [upper, setUpper] = useState(numberParam(params.get("v_upper_b"), 3));
  const [partitions, setPartitions] = useState(enforcePartitionCount(numberParam(params.get("v_partitions_n"), 12), initialMethod));
  const [method, setMethod] = useState<IntegrationMethod>(initialMethod);
  const [constant, setConstant] = useState(0);
  const [probe, setProbe] = useState(numberParam(params.get("v_probe_x"), 1));
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [showGrid, setShowGrid] = useState(true);
  const [expanded, setExpanded] = useState(false);
  const [learning, setLearning] = useState<LearningMode>("Observe");

  const compiled = useMemo(() => {
    try { return { fn: compileFunctionExpression(expression), error: "" }; }
    catch (error) { return { fn: null, error: error instanceof Error ? error.message : "Invalid function" }; }
  }, [expression]);
  const draftError = useMemo(() => {
    try { compileFunctionExpression(draft); return ""; }
    catch (error) { return error instanceof Error ? error.message : "Invalid function"; }
  }, [draft]);
  const intervalValid = lower < upper;
  const result = useMemo(() => safeResult(compiled.fn, lower, upper, partitions, method), [compiled.fn, lower, upper, partitions, method]);
  const comparison = useMemo(() => methods.map((item) => ({ ...item, result: safeResult(compiled.fn, lower, upper, partitions, item.id) })), [compiled.fn, lower, upper, partitions]);
  const info = modeCopy[mode] ?? modeCopy.definite;

  useEffect(() => {
    setPlaying(false);
    setLearning("Observe");
  }, [mode]);

  useEffect(() => {
    if (!expanded) return;
    const close = (event: KeyboardEvent) => event.key === "Escape" && setExpanded(false);
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [expanded]);

  useEffect(() => {
    const next = new URLSearchParams(params);
    next.set("v_function", expression);
    next.set("v_lower_a", tidy(lower));
    next.set("v_upper_b", tidy(upper));
    next.set("v_partitions_n", String(partitions));
    next.set("v_method", method);
    next.set("v_probe_x", tidy(probe));
    if (next.toString() !== params.toString()) setParams(next, { replace: true });
  }, [expression, lower, method, params, partitions, probe, setParams, upper]);

  useEffect(() => {
    if (!playing) return;
    const timer = window.setInterval(() => {
      if (mode === "ftc") {
        setProbe((value) => value >= upper ? lower : Number(Math.min(upper, value + 0.04 * speed).toFixed(2)));
      } else if (mode === "antiderivative") {
        setConstant((value) => value >= 3 ? -3 : Number((value + 0.05 * speed).toFixed(2)));
      } else {
        setPartitions((value) => enforcePartitionCount(value >= 80 ? 2 : value + Math.max(1, Math.round(speed)), method));
      }
    }, 90);
    return () => window.clearInterval(timer);
  }, [lower, method, mode, playing, speed, upper]);

  const changeMethod = (next: IntegrationMethod) => {
    setMethod(next);
    setPartitions((value) => enforcePartitionCount(value, next));
  };
  const changePartitions = (value: number) => setPartitions(enforcePartitionCount(value, method));
  const plot = () => {
    if (!draftError) setExpression(draft);
  };
  const reset = () => {
    setExpression("x^2");
    setDraft("x^2");
    setLower(-2);
    setUpper(3);
    setPartitions(12);
    setMethod("midpoint");
    setConstant(0);
    setProbe(1);
    setPlaying(false);
    setSpeed(1);
    setShowGrid(true);
  };

  return (
    <div className="ci-studio" data-mode={mode} data-testid="calculus-integration-studio">
      <div className="ci-workspace">
        <aside className="ci-panel ci-controls" aria-label="Integration controls">
          <h2>Build the integral</h2>
          <label className="ci-function"><span>f(x) =</span><input aria-label="Function f of x" value={draft} onChange={(event) => setDraft(event.target.value)} onKeyDown={(event) => event.key === "Enter" && plot()} /><button type="button" onClick={plot} disabled={Boolean(draftError)} aria-label="Plot function" title="Plot function"><Sigma /></button></label>
          {draftError && <p className="ci-error">{draftError}</p>}

          {mode === "antiderivative" ? (
            <RangeControl label="Constant C" value={constant} min={-4} max={4} step={0.1} onChange={setConstant} />
          ) : (
            <section className="ci-section">
              <h3>Bounds</h3>
              <div className="ci-bound-row">
                <label><span>a (lower)</span><input aria-label="Lower bound a" type="number" value={lower} step="0.25" onChange={(event) => setLower(Number(event.target.value))} /></label>
                <label><span>b (upper)</span><input aria-label="Upper bound b" type="number" value={upper} step="0.25" onChange={(event) => setUpper(Number(event.target.value))} /></label>
              </div>
              {!intervalValid && <p className="ci-error">Choose a lower bound smaller than the upper bound.</p>}
            </section>
          )}

          {mode === "ftc" && <RangeControl label="Accumulation point x" value={probe} min={lower} max={upper} step={0.05} onChange={setProbe} />}
          {mode !== "antiderivative" && mode !== "ftc" && <RangeControl label="Partitions (n)" value={partitions} min={2} max={100} step={1} onChange={changePartitions} integer />}

          {mode !== "antiderivative" && mode !== "numerical" && (
            <section className="ci-section">
              <h3>Method</h3>
              <div className="ci-methods">
                {methods.map((item) => <button type="button" key={item.id} className={method === item.id ? "active" : ""} aria-pressed={method === item.id} onClick={() => changeMethod(item.id)}>{item.label}</button>)}
              </div>
            </section>
          )}

          <label className="ci-toggle"><input type="checkbox" checked={showGrid} onChange={(event) => setShowGrid(event.target.checked)} /><span>Show graph grid</span></label>
          <div className="ci-player">
            <button type="button" className="primary" onClick={() => setPlaying((value) => !value)}>{playing ? <Pause /> : <Play />}<span>{playing ? "Pause" : "Animate"}</span></button>
            <select aria-label="Animation speed" value={speed} onChange={(event) => setSpeed(Number(event.target.value))}><option value={0.5}>0.5x</option><option value={1}>1x</option><option value={2}>2x</option></select>
            <button type="button" onClick={reset}><RotateCcw /><span>Reset</span></button>
          </div>
        </aside>

        <section className={`ci-panel ci-visual-panel ${expanded ? "is-expanded" : ""}`}>
          <header>
            <div><span>{info.eyebrow}</span><h2>{info.title}</h2></div>
            <div className="ci-visual-actions"><button type="button" className={showGrid ? "active" : ""} onClick={() => setShowGrid((value) => !value)} title="Toggle grid"><Grid3X3 /></button><button type="button" className={expanded ? "active" : ""} aria-pressed={expanded} onClick={() => setExpanded((value) => !value)} title={expanded ? "Exit full screen" : "Full screen"}><Expand /></button></div>
          </header>
          <IntegrationVisual mode={mode} fn={compiled.fn} result={result} lower={lower} upper={upper} probe={probe} constant={constant} showGrid={showGrid} />
          <p className="ci-visual-note">{info.explanation}</p>
        </section>

        <aside className="ci-panel ci-results" aria-live="polite">
          <h2><BarChart3 /> Live results</h2>
          {mode === "antiderivative" ? <AntiderivativeResults expression={expression} constant={constant} /> : mode === "ftc" ? <FtcResults fn={compiled.fn} lower={lower} probe={probe} /> : mode === "numerical" ? <NumericalResults comparison={comparison} reference={result?.reference ?? null} /> : <DefiniteResults result={result} method={method} />}
          <section className="ci-theory">
            <h3><CheckCircle2 /> {mode === "riemann" ? "Convergence check" : "Fundamental idea"}</h3>
            <p>{result ? result.absoluteError < 0.01 ? "The approximation is already close to the high-precision reference." : "Increase the partition count to reduce the discretization error." : compiled.error || "Enter a valid interval and function."}</p>
          </section>
        </aside>
      </div>
      <LearningBar active={learning} onChange={setLearning} mode={mode} result={result} />
    </div>
  );
}

function RangeControl({ label, value, min, max, step, onChange, integer = false }: { label: string; value: number; min: number; max: number; step: number; onChange: (value: number) => void; integer?: boolean }) {
  const update = (value: number) => onChange(integer ? Math.round(value) : value);
  return <label className="ci-range"><span>{label}<b>{integer ? Math.round(value) : tidy(value)}</b></span><div><button type="button" onClick={() => update(Math.max(min, value - step))} aria-label={`Decrease ${label}`}><Minus /></button><input aria-label={label} type="range" min={min} max={max} step={step} value={Math.min(max, Math.max(min, value))} onChange={(event) => update(Number(event.target.value))} /><button type="button" onClick={() => update(Math.min(max, value + step))} aria-label={`Increase ${label}`}><Plus /></button></div></label>;
}

function IntegrationVisual({ mode, fn, result, lower, upper, probe, constant, showGrid }: { mode: string; fn: ((x: number) => number) | null; result: IntegrationResult | null; lower: number; upper: number; probe: number; constant: number; showGrid: boolean }) {
  const width = 860, height = mode === "ftc" ? 610 : 530, pad = 52, xMin = -4, xMax = 5, yMin = -3, yMax = 12;
  const sx = (x: number) => pad + (x - xMin) / (xMax - xMin) * (width - pad * 2);
  const sy = (y: number) => height - pad - (y - yMin) / (yMax - yMin) * (height - pad * 2);
  const curve = fn ? sample(fn, xMin, xMax, 440) : [];
  const activeUpper = mode === "ftc" ? Math.min(upper, Math.max(lower, probe)) : upper;
  const showSlices = mode === "definite" || mode === "riemann";
  const family = mode === "antiderivative" && fn ? [-2, 0, 2].map((shift) => sample((x) => primitive(fn, x) + constant + shift, xMin, xMax, 260)) : [];
  const accumulation = mode === "ftc" && fn ? sample((x) => x <= lower ? 0 : safeIntegral(fn, lower, Math.min(x, upper), 240), lower + 0.001, upper, 170) : [];
  return <svg className="ci-graph" viewBox={`0 0 ${width} ${height}`} role="img" aria-label={`${modeCopy[mode]?.title ?? "Integration"} graph`}>
    <rect width={width} height={height} rx="10" fill="#071d35" />
    {showGrid && <GraphGrid width={width} height={height} pad={pad} />}
    <line className="axis" x1={pad} x2={width - pad} y1={sy(0)} y2={sy(0)} /><line className="axis" x1={sx(0)} x2={sx(0)} y1={pad} y2={height - pad} />
    {fn && mode !== "antiderivative" && intervalPath(fn, lower, activeUpper, sx, sy)}
    {showSlices && result?.partitions.map((part) => <rect key={part.index} x={sx(part.x0)} y={sy(Math.max(0, part.sampleY))} width={Math.max(1, sx(part.x1) - sx(part.x0) - 1)} height={Math.abs(sy(part.sampleY) - sy(0))} className="slice" />)}
    {mode === "antiderivative" ? family.map((points, index) => <path key={index} d={path(points, sx, sy, yMin, yMax)} className={index === 1 ? "family active" : "family"} />) : <path d={path(curve, sx, sy, yMin, yMax)} className="curve" />}
    {mode === "ftc" && <><path d={path(accumulation, sx, sy, yMin, yMax)} className="accumulation" /><line x1={sx(activeUpper)} x2={sx(activeUpper)} y1={pad} y2={height - pad} className="probe" /><circle cx={sx(activeUpper)} cy={sy(fn ? safeValue(fn, activeUpper) : 0)} r="7" className="probe-dot" /></>}
    {mode !== "antiderivative" && <><line x1={sx(lower)} x2={sx(lower)} y1={pad} y2={height - pad} className="bound lower" /><line x1={sx(activeUpper)} x2={sx(activeUpper)} y1={pad} y2={height - pad} className="bound upper" /><text x={sx(lower) - 20} y={sy(0) + 30}>a = {tidy(lower)}</text><text x={sx(activeUpper) - 18} y={sy(0) + 30}>{mode === "ftc" ? "x" : "b"} = {tidy(activeUpper)}</text></>}
    <text x="68" y="38" className="formula">{mode === "antiderivative" ? `F(x) + C, C = ${tidy(constant)}` : "f(x) and accumulated area"}</text>
  </svg>;
}

function DefiniteResults({ result, method }: { result: IntegrationResult | null; method: IntegrationMethod }) {
  return <>{result ? <><ResultCard label={`${labelMethod(method)} approximation`} value={format(result.approximation, 4)} tone="amber" /><ResultCard label="High-precision integral" value={format(result.reference, 4)} tone="green" /><div className="ci-stat-grid"><ResultCard label="Absolute error" value={format(result.absoluteError, 5)} tone={result.absoluteError < 0.01 ? "green" : "red"} /><ResultCard label="Relative error" value={`${format(result.relativeError, 3)}%`} /></div><div className="ci-area-list"><p><span>Positive area</span><b>{format(result.positiveArea, 4)}</b></p><p><span>Negative area</span><b>{format(result.negativeArea, 4)}</b></p><p><span>Net area</span><b>{format(result.signedArea, 4)}</b></p></div></> : <EmptyResults />}</>;
}

function AntiderivativeResults({ expression, constant }: { expression: string; constant: number }) {
  const familiar = expression.replace(/\s/g, "") === "x^2";
  return <><ResultCard label="Integrand" value={`f(x) = ${expression}`} /><ResultCard label="One antiderivative" value={familiar ? "F(x) = x^3 / 3" : "F'(x) = f(x)"} tone="green" /><ResultCard label="Current family member" value={familiar ? `x^3 / 3 ${constant < 0 ? "-" : "+"} ${tidy(Math.abs(constant))}` : `F(x) + ${tidy(constant)}`} tone="violet" /><p className="ci-callout">Changing C shifts the graph vertically without changing its derivative.</p></>;
}

function FtcResults({ fn, lower, probe }: { fn: ((x: number) => number) | null; lower: number; probe: number }) {
  if (!fn || probe <= lower) return <EmptyResults />;
  const accumulation = safeIntegral(fn, lower, probe, 800);
  const derivative = safeValue(fn, probe);
  if (!Number.isFinite(accumulation) || !Number.isFinite(derivative)) return <EmptyResults />;
  return <><ResultCard label={`F(${tidy(probe)}) = integral from ${tidy(lower)} to ${tidy(probe)}`} value={format(accumulation, 5)} tone="green" /><ResultCard label="F'(x)" value={format(derivative, 5)} tone="violet" /><ResultCard label="f(x)" value={format(derivative, 5)} tone="amber" /><p className="ci-callout success">F'(x) and f(x) agree at the selected point.</p></>;
}

function NumericalResults({ comparison, reference }: { comparison: Array<{ id: IntegrationMethod; label: string; result: IntegrationResult | null }>; reference: number | null }) {
  return <><ResultCard label="Reference value" value={reference === null ? "Unavailable" : format(reference, 6)} tone="green" /><div className="ci-comparison">{comparison.map((item) => <div key={item.id}><span>{item.label}</span><b>{item.result ? format(item.result.approximation, 5) : "--"}</b><small>{item.result ? `error ${format(item.result.absoluteError, 5)}` : "invalid"}</small></div>)}</div></>;
}

function ResultCard({ label, value, tone = "plain" }: { label: string; value: string; tone?: string }) { return <div className={`ci-result-card ${tone}`}><span>{label}</span><strong>{value}</strong></div>; }
function EmptyResults() { return <p className="ci-empty">Results appear when the function and interval are valid.</p>; }

function LearningBar({ active, onChange, mode, result }: { active: LearningMode; onChange: (value: LearningMode) => void; mode: string; result: IntegrationResult | null }) {
  const tabs: LearningMode[] = ["Observe", "Understand", "Why", "Try", "Challenge"];
  const copy: Record<LearningMode, string> = {
    Observe: modeCopy[mode]?.explanation ?? modeCopy.definite.explanation,
    Understand: "The integral combines many small signed contributions over an interval.",
    Why: "As slice width approaches zero, the numerical sum approaches the definite integral.",
    Try: "Change the function, bounds, method, and partition count. Every result uses the current state.",
    Challenge: result ? `Can you make the absolute error smaller than ${format(Math.max(result.absoluteError / 2, 0.00001), 5)}?` : "Choose a valid function and interval to begin.",
  };
  return <section className="ci-learning"><nav>{tabs.map((tab) => <button type="button" key={tab} className={active === tab ? "active" : ""} onClick={() => onChange(tab)}>{tab}</button>)}</nav><p>{copy[active]}</p></section>;
}

function GraphGrid({ width, height, pad }: { width: number; height: number; pad: number }) { return <g>{Array.from({ length: 10 }, (_, index) => <line key={`v-${index}`} x1={pad + index * ((width - pad * 2) / 9)} x2={pad + index * ((width - pad * 2) / 9)} y1={pad} y2={height - pad} className="grid" />)}{Array.from({ length: 8 }, (_, index) => <line key={`h-${index}`} x1={pad} x2={width - pad} y1={pad + index * ((height - pad * 2) / 7)} y2={pad + index * ((height - pad * 2) / 7)} className="grid" />)}</g>; }

function intervalPath(fn: (x: number) => number, lower: number, upper: number, sx: (value: number) => number, sy: (value: number) => number) {
  if (!(lower < upper)) return null;
  const points = sample(fn, lower, upper, 180);
  const d = points.map((point, index) => `${index ? "L" : "M"}${sx(point.x)},${sy(point.y)}`).join(" ");
  return <path d={`${d} L${sx(upper)},${sy(0)} L${sx(lower)},${sy(0)} Z`} className="area" />;
}

function sample(fn: (x: number) => number, min: number, max: number, count: number) { return Array.from({ length: count }, (_, index) => { const x = min + index / (count - 1) * (max - min); try { return { x, y: finite(fn(x)) }; } catch { return { x, y: NaN }; } }); }
function path(points: Array<{ x: number; y: number }>, sx: (value: number) => number, sy: (value: number) => number, yMin: number, yMax: number) { let open = false; return points.map((point) => { if (!Number.isFinite(point.y) || point.y < yMin - 2 || point.y > yMax + 2) { open = false; return ""; } const command = open ? "L" : "M"; open = true; return `${command}${sx(point.x).toFixed(2)},${sy(point.y).toFixed(2)}`; }).join(" "); }
function primitive(fn: (x: number) => number, x: number) { if (Math.abs(x) < 0.001) return 0; return x > 0 ? safeIntegral(fn, 0, x, 160) : -safeIntegral(fn, x, 0, 160); }
function safeIntegral(fn: (x: number) => number, lower: number, upper: number, slices: number) { try { return highPrecisionIntegral(fn, lower, upper, slices); } catch { return NaN; } }
function safeValue(fn: (x: number) => number, x: number) { try { return finite(fn(x)); } catch { return NaN; } }
function safeResult(fn: ((x: number) => number) | null, lower: number, upper: number, partitions: number, method: IntegrationMethod) { if (!fn || !(lower < upper)) return null; try { return calculateIntegration(fn, lower, upper, partitions, method); } catch { return null; } }
function parseMethod(value: string | null): IntegrationMethod { return value === "left" || value === "right" || value === "trapezoid" || value === "simpson" ? value : "midpoint"; }
function numberParam(value: string | null, fallback: number) { const parsed = Number(value); return value !== null && Number.isFinite(parsed) ? parsed : fallback; }
function finite(value: number) { return Number.isFinite(value) ? value : NaN; }
function format(value: number, digits: number) { return Number.isFinite(value) ? value.toFixed(digits) : "--"; }
function tidy(value: number) { return Number.isFinite(value) ? Number(value.toFixed(2)).toString() : "--"; }
function labelMethod(method: IntegrationMethod) { return methods.find((item) => item.id === method)?.label ?? method; }
