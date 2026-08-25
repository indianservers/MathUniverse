import {
  Check,
  ChevronRight,
  CircleAlert,
  Eye,
  Lightbulb,
  Maximize2,
  Minus,
  Pause,
  Play,
  Plus,
  RotateCcw,
  StepForward,
  Target,
  Trophy,
  X,
  ZoomIn,
} from "lucide-react";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { useSearchParams } from "react-router-dom";
import MathExpression from "../components/ui/MathExpression";
import { compileFunctionExpression } from "../utils/functionParser";
import "./CalculusLimitsStudio.css";

export type LimitMode =
  | "limits"
  | "continuity"
  | "discontinuities"
  | "asymptotes"
  | "lhopital";

type LearningView = "observe" | "understand" | "why" | "try" | "challenge";
type Viewport = { xMin: number; xMax: number; yMin: number; yMax: number };
type LimitAnalysis = {
  left: number;
  right: number;
  limit: number;
  value: number;
  defined: boolean;
  limitExists: boolean;
  continuous: boolean;
  classification: string;
};

type ModeConfig = {
  expression: string;
  point: number;
  distance: number;
  viewport: Viewport;
  summary: string;
  explanation: string;
};

const modeConfigs: Record<LimitMode, ModeConfig> = {
  limits: {
    expression: "sin(x)/x",
    point: 0,
    distance: 0.5,
    viewport: { xMin: -3.3, xMax: 3.3, yMin: -1.5, yMax: 1.5 },
    summary: "Compare both one-sided approaches to determine the limit.",
    explanation:
      "A two-sided limit exists only when the left-hand and right-hand limits approach the same value.",
  },
  continuity: {
    expression: "(x^2-1)/(x-1)",
    point: 1,
    distance: 0.4,
    viewport: { xMin: -3.2, xMax: 4.2, yMin: -2, yMax: 5 },
    summary: "Test the three conditions required for continuity at a point.",
    explanation:
      "Continuity at a requires f(a) to exist, the two-sided limit to exist, and those two values to agree.",
  },
  discontinuities: {
    expression: "1/x",
    point: 0,
    distance: 0.4,
    viewport: { xMin: -4, xMax: 4, yMin: -8, yMax: 8 },
    summary: "Classify removable, jump, infinite, and oscillatory behavior.",
    explanation:
      "A discontinuity is classified by how the function behaves from the left and right of the selected point.",
  },
  asymptotes: {
    expression: "1/(x-1)",
    point: 1,
    distance: 0.4,
    viewport: { xMin: -3, xMax: 5, yMin: -8, yMax: 8 },
    summary: "Inspect unbounded behavior near a vertical asymptote.",
    explanation:
      "A vertical asymptote occurs when function values grow without bound as x approaches a fixed value.",
  },
  lhopital: {
    expression: "sin(x)/x",
    point: 0,
    distance: 0.5,
    viewport: { xMin: -3.3, xMax: 3.3, yMin: -1.5, yMax: 1.5 },
    summary: "Resolve an indeterminate quotient using derivatives.",
    explanation:
      "For a 0/0 indeterminate form, L'Hopital's Rule replaces the quotient by the quotient of its derivatives.",
  },
};

const examples = [
  { expression: "sin(x)/x", label: "\\frac{\\sin(x)}{x}", point: 0 },
  { expression: "1/x", label: "\\frac{1}{x}", point: 0 },
  { expression: "(x^2-1)/(x-1)", label: "\\frac{x^2-1}{x-1}", point: 1 },
  { expression: "sqrt(x)", label: "\\sqrt{x}", point: 0 },
  { expression: "abs(x)", label: "|x|", point: 0 },
  { expression: "1/(x^2+1)", label: "\\frac{1}{x^2+1}", point: 0 },
];

const learningTabs: Array<{
  id: LearningView;
  label: string;
  subtitle: string;
  icon: typeof Eye;
  content: string;
}> = [
  { id: "observe", label: "Observe", subtitle: "What happens?", icon: Eye, content: "Move the approach points and compare the values reached from each side." },
  { id: "understand", label: "Understand", subtitle: "Key idea", icon: Lightbulb, content: "The value at a point and the value approached near it are separate ideas." },
  { id: "why", label: "Why", subtitle: "The reasoning", icon: CircleAlert, content: "Agreement between both sides is what makes a two-sided limit possible." },
  { id: "try", label: "Try", subtitle: "Practice it", icon: Target, content: "Choose an example, move a, and predict the result before reading the live analysis." },
  { id: "challenge", label: "Challenge", subtitle: "Take it further", icon: Trophy, content: "Find a function whose left and right limits exist but do not agree." },
];

export default function CalculusLimitsStudio({ mode }: { mode: string }) {
  const [params, setParams] = useSearchParams();
  const activeMode = isLimitMode(mode) ? mode : "limits";
  const config = modeConfigs[activeMode];
  const initialExpression = params.get("v_expression") || config.expression;
  const [expression, setExpression] = useState(initialExpression);
  const [draft, setDraft] = useState(initialExpression);
  const [a, setA] = useState(numberParam(params.get("v_a"), config.point));
  const initialDistance = clamp(numberParam(params.get("v_b"), config.distance), 0.01, 2);
  const [leftDistance, setLeftDistance] = useState(clamp(numberParam(params.get("v_left"), initialDistance), 0.01, 2));
  const [rightDistance, setRightDistance] = useState(clamp(numberParam(params.get("v_right"), initialDistance), 0.01, 2));
  const [samples, setSamples] = useState(clamp(Math.round(numberParam(params.get("v_n"), 20)), 20, 200));
  const [showArrows, setShowArrows] = useState(true);
  const [tracePath, setTracePath] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [definedValue, setDefinedValue] = useState<number | null>(() => {
    const value = params.get("v_defined");
    return value === null ? null : numberParam(value, 0);
  });
  const [learning, setLearning] = useState<LearningView>("observe");
  const [viewport, setViewport] = useState(config.viewport);
  const [trace, setTrace] = useState<{ x: number; y: number } | null>(null);
  const previousMode = useRef(activeMode);

  const compiled = useMemo(() => compileExpression(expression), [expression]);
  const draftError = useMemo(() => compileExpression(draft).error, [draft]);
  const analysis = useMemo(
    () => analyzeLimit(compiled.fn, a, definedValue),
    [a, compiled.fn, definedValue],
  );

  useEffect(() => {
    const next = new URLSearchParams(params);
    next.set("v_a", trim(a));
    next.set("v_b", trim(Math.max(leftDistance, rightDistance)));
    next.set("v_left", trim(leftDistance));
    next.set("v_right", trim(rightDistance));
    next.set("v_n", String(samples));
    next.set("v_expression", expression);
    if (definedValue === null) next.delete("v_defined");
    else next.set("v_defined", trim(definedValue));
    if (next.toString() !== params.toString()) setParams(next, { replace: true });
  }, [a, definedValue, expression, leftDistance, params, rightDistance, samples, setParams]);

  useEffect(() => {
    if (previousMode.current === activeMode) return;
    previousMode.current = activeMode;
    setExpression(config.expression);
    setDraft(config.expression);
    setA(config.point);
    setLeftDistance(config.distance);
    setRightDistance(config.distance);
    setDefinedValue(null);
    setViewport(config.viewport);
    setPlaying(false);
  }, [activeMode, config]);

  useEffect(() => {
    if (!playing) return;
    const timer = window.setInterval(() => {
      let stopped = false;
      const advance = (value: number) => {
        const next = value - 0.012 * speed;
        if (next <= 0.012) stopped = true;
        return next <= 0.012 ? 0.01 : next;
      };
      setLeftDistance(advance);
      setRightDistance(advance);
      if (stopped) setPlaying(false);
    }, 40);
    return () => window.clearInterval(timer);
  }, [playing, speed]);

  const applyExpression = () => {
    if (draftError) return;
    setExpression(draft);
    setDefinedValue(null);
  };
  const selectExample = (item: (typeof examples)[number]) => {
    setExpression(item.expression);
    setDraft(item.expression);
    setA(item.point);
    setDefinedValue(null);
    setPlaying(false);
  };
  const reset = () => {
    setExpression(config.expression);
    setDraft(config.expression);
    setA(config.point);
    setLeftDistance(config.distance);
    setRightDistance(config.distance);
    setSamples(20);
    setDefinedValue(null);
    setViewport(config.viewport);
    setPlaying(false);
    setTrace(null);
  };
  const step = () => {
    setLeftDistance((value) => Math.max(0.01, value * 0.72));
    setRightDistance((value) => Math.max(0.01, value * 0.72));
  };
  const zoom = (factor: number) => setViewport((value) => zoomViewport(value, factor));

  return (
    <div className="cls-studio">
      <div className="cls-context" role="status">
        <span>{config.summary}</span>
        <button type="button" onClick={reset}><RotateCcw /> Reset experiment</button>
      </div>

      <div className="cls-workspace">
        <aside className="cls-controls" aria-label="Limit controls">
          <NumberedPanel number={1} title="Function">
            <div className="cls-expression-row">
              <span>f(x) =</span>
              <input aria-label="Function expression" value={draft} onChange={(event) => setDraft(event.target.value)} onKeyDown={(event) => event.key === "Enter" && applyExpression()} />
              <button type="button" onClick={applyExpression} disabled={Boolean(draftError)} aria-label="Apply function"><ChevronRight /></button>
            </div>
            {draftError && <p className="cls-error">{draftError}</p>}
            <span className="cls-small-label">Examples</span>
            <div className="cls-examples">
              {examples.map((item) => (
                <button type="button" key={item.expression} className={expression === item.expression ? "active" : ""} onClick={() => selectExample(item)}>
                  <MathExpression value={item.label} />
                </button>
              ))}
            </div>
          </NumberedPanel>

          <NumberedPanel number={2} title="Limit point a">
            <label className="cls-range orange">
              <input aria-label="Limit point" type="range" min="-5" max="5" step="0.05" value={a} onChange={(event) => { setA(Number(event.target.value)); setDefinedValue(null); }} />
              <span><i>-5</i><b>a = {trim(a)}</b><i>5</i></span>
            </label>
            <input className="cls-number-input" aria-label="Limit point value" type="number" step="0.05" value={a} onChange={(event) => { setA(Number(event.target.value)); setDefinedValue(null); }} />
          </NumberedPanel>

          <NumberedPanel number={3} title="Approach distance δ">
            <DistanceControl side="Left" color="orange" value={leftDistance} onChange={setLeftDistance} />
            <DistanceControl side="Right" color="violet" value={rightDistance} onChange={setRightDistance} />
          </NumberedPanel>

          <NumberedPanel number={4} title="Animate">
            <div className="cls-play-controls">
              <button className="primary" type="button" onClick={() => setPlaying(true)} disabled={playing}><Play /> Play</button>
              <button type="button" onClick={() => setPlaying(false)} disabled={!playing}><Pause /> Pause</button>
              <button type="button" onClick={step}><StepForward /> Step</button>
            </div>
            <label className="cls-speed">Speed <input aria-label="Animation speed" type="range" min="0.5" max="2" step="0.5" value={speed} onChange={(event) => setSpeed(Number(event.target.value))} /><b>{speed.toFixed(1)}x</b></label>
            <CheckControl label="Show approach arrows" checked={showArrows} onChange={setShowArrows} />
            <CheckControl label="Trace path" checked={tracePath} onChange={setTracePath} />
          </NumberedPanel>
        </aside>

        <LimitGraph
          fn={compiled.fn}
          expression={expression}
          a={a}
          leftDistance={leftDistance}
          rightDistance={rightDistance}
          analysis={analysis}
          viewport={viewport}
          samples={samples}
          showArrows={showArrows}
          tracePath={tracePath}
          trace={trace}
          onTrace={setTrace}
          onZoom={zoom}
          onResetView={() => setViewport(config.viewport)}
        />

        <aside className="cls-results" aria-label="Live limit analysis">
          <NumberedPanel number={5} title="Live Results">
            <div className="cls-result-list">
              <ResultLine tone="orange" formula={`\\lim_{x\\to ${trim(a)}^-}f(x)`} value={formatLimit(analysis.left)} passed={Number.isFinite(analysis.left) || !Number.isNaN(analysis.left)} />
              <ResultLine tone="violet" formula={`\\lim_{x\\to ${trim(a)}^+}f(x)`} value={formatLimit(analysis.right)} passed={Number.isFinite(analysis.right) || !Number.isNaN(analysis.right)} />
              <ResultLine tone="cyan" formula={`\\lim_{x\\to ${trim(a)}}f(x)`} value={formatLimit(analysis.limit)} passed={analysis.limitExists} />
              <ResultLine tone="red" formula={`f(${trim(a)})`} value={analysis.defined ? formatLimit(analysis.value) : "undefined"} passed={analysis.defined} />
            </div>
          </NumberedPanel>

          <NumberedPanel number={6} title={`Continuity Check at a = ${trim(a)}`}>
            <CheckRow passed={analysis.defined} label={`f(${trim(a)}) is defined`} />
            <CheckRow passed={analysis.limitExists} label="The two-sided limit exists" />
            <CheckRow passed={analysis.continuous} label={`The limit equals f(${trim(a)})`} />
            <p className={analysis.continuous ? "cls-conclusion pass" : "cls-conclusion"}>
              Conclusion: {analysis.continuous ? "Continuous" : analysis.classification} at x = {trim(a)}
            </p>
          </NumberedPanel>

          <NumberedPanel number={7} title="Explanation">
            {activeMode === "lhopital" && (
              <div className="cls-lhopital">
                <MathExpression value="\\frac{0}{0}\\Rightarrow\\lim_{x\\to0}\\frac{\\cos x}{1}=1" display />
              </div>
            )}
            <p className="cls-explanation">{explainAnalysis(analysis, a, config.explanation)}</p>
          </NumberedPanel>

          <NumberedPanel number={8} title="Make continuous">
            {analysis.limitExists && Number.isFinite(analysis.limit) && !analysis.continuous ? (
              <>
                <p>Define <MathExpression value={`f(${trim(a)})=${formatLimit(analysis.limit)}`} /> to remove the hole.</p>
                <button className="cls-repair" type="button" onClick={() => setDefinedValue(analysis.limit)}>Set <MathExpression value={`f(${trim(a)})=${formatLimit(analysis.limit)}`} /></button>
              </>
            ) : (
              <p>{analysis.continuous ? "All three continuity conditions now pass." : "A point value cannot repair this type of discontinuity."}</p>
            )}
          </NumberedPanel>
        </aside>
      </div>

      <section className="cls-learning" aria-label="Learning views">
        <div className="cls-learning-tabs">
          {learningTabs.map(({ id, label, subtitle, icon: Icon }) => (
            <button key={id} type="button" className={learning === id ? "active" : ""} onClick={() => setLearning(id)} aria-selected={learning === id}>
              <Icon /><span><b>{label}</b><small>{subtitle}</small></span>
            </button>
          ))}
        </div>
        <p>{learningTabs.find((item) => item.id === learning)?.content}</p>
      </section>
    </div>
  );
}

function NumberedPanel({ number, title, children }: { number: number; title: string; children: React.ReactNode }) {
  return <section className="cls-panel"><h2><span>{number}</span>{title}</h2><div className="cls-panel-body">{children}</div></section>;
}

function DistanceControl({ side, color, value, onChange }: { side: "Left" | "Right"; color: "orange" | "violet"; value: number; onChange: (value: number) => void }) {
  return <label className={`cls-distance ${color}`}><span>{side} <MathExpression value={side === "Left" ? "(x\\to a^-)" : "(x\\to a^+)"} /></span><div><input aria-label={`${side} approach distance`} type="range" min="0.01" max="2" step="0.01" value={value} onChange={(event) => onChange(Number(event.target.value))} /><output>{value.toFixed(3)}</output></div></label>;
}

function CheckControl({ label, checked, onChange }: { label: string; checked: boolean; onChange: (value: boolean) => void }) {
  return <label className="cls-check-control"><input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} /><span>{label}</span></label>;
}

function ResultLine({ tone, formula, value, passed }: { tone: string; formula: string; value: string; passed: boolean }) {
  return <div className={`cls-result ${tone}`}><MathExpression value={formula} /><b>=&nbsp; {value}</b>{passed ? <Check /> : <CircleAlert />}</div>;
}

function CheckRow({ passed, label }: { passed: boolean; label: string }) {
  return <div className={`cls-check-row ${passed ? "pass" : "fail"}`}>{passed ? <Check /> : <X />}<span>{label}</span>{passed ? <Check /> : <X />}</div>;
}

function LimitGraph({ fn, expression, a, leftDistance, rightDistance, analysis, viewport, samples, showArrows, tracePath, trace, onTrace, onZoom, onResetView }: {
  fn: ((x: number) => number) | null;
  expression: string;
  a: number;
  leftDistance: number;
  rightDistance: number;
  analysis: LimitAnalysis;
  viewport: Viewport;
  samples: number;
  showArrows: boolean;
  tracePath: boolean;
  trace: { x: number; y: number } | null;
  onTrace: (value: { x: number; y: number } | null) => void;
  onZoom: (factor: number) => void;
  onResetView: () => void;
}) {
  const width = 820, height = 650, pad = 34;
  const sx = (x: number) => pad + (x - viewport.xMin) / (viewport.xMax - viewport.xMin) * (width - pad * 2);
  const sy = (y: number) => height - pad - (y - viewport.yMin) / (viewport.yMax - viewport.yMin) * (height - pad * 2);
  const points = fn ? sampleFunction(fn, viewport.xMin, viewport.xMax, Math.max(420, samples * 22)) : [];
  const path = pointsToPath(points, sx, sy, viewport);
  const leftX = a - leftDistance, rightX = a + rightDistance;
  const leftY = fn ? safeValue(fn, leftX) : NaN, rightY = fn ? safeValue(fn, rightX) : NaN;
  const xTicks = ticks(viewport.xMin, viewport.xMax, 7);
  const yTicks = ticks(viewport.yMin, viewport.yMax, 7);
  const pointerMove = (event: ReactPointerEvent<SVGSVGElement>) => {
    if (!tracePath || !fn) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width * width;
    const x = viewport.xMin + (px - pad) / (width - pad * 2) * (viewport.xMax - viewport.xMin);
    const y = safeValue(fn, x);
    if (Number.isFinite(y)) onTrace({ x, y });
  };
  return (
    <section className="cls-graph-panel">
      <div className="cls-graph-toolbar">
        <strong><i /> <MathExpression value={`f(x)=${toLatex(expression)}`} /></strong>
        <div><button type="button" onClick={() => onZoom(0.82)}><ZoomIn /> Zoom</button><button type="button" aria-label="Zoom out" onClick={() => onZoom(1.22)}><Minus /></button><button type="button" aria-label="Zoom in" onClick={() => onZoom(0.82)}><Plus /></button><button type="button" aria-label="Reset graph view" onClick={onResetView}><Maximize2 /></button></div>
      </div>
      <svg className="cls-graph" viewBox={`0 0 ${width} ${height}`} role="img" aria-label={`Graph of ${expression} near x equals ${trim(a)}`} onPointerMove={pointerMove} onPointerLeave={() => onTrace(null)}>
        <defs><clipPath id="cls-plot-clip"><rect x={pad} y={pad} width={width-pad*2} height={height-pad*2} /></clipPath></defs>
        <g className="cls-grid">
          {xTicks.map((value) => <line key={`x${value}`} x1={sx(value)} x2={sx(value)} y1={pad} y2={height-pad} />)}
          {yTicks.map((value) => <line key={`y${value}`} x1={pad} x2={width-pad} y1={sy(value)} y2={sy(value)} />)}
        </g>
        <g className="cls-axes">
          {viewport.yMin <= 0 && viewport.yMax >= 0 && <line x1={pad} x2={width-pad} y1={sy(0)} y2={sy(0)} />}
          {viewport.xMin <= 0 && viewport.xMax >= 0 && <line x1={sx(0)} x2={sx(0)} y1={pad} y2={height-pad} />}
        </g>
        <g className="cls-tick-labels">
          {xTicks.map((value) => <text key={`xt${value}`} x={sx(value)} y={clamp(sy(0)+20,pad+16,height-8)}>{trim(value)}</text>)}
          {yTicks.filter((value) => Math.abs(value) > 1e-9).map((value) => <text key={`yt${value}`} x={clamp(sx(0)-10,18,width-18)} y={sy(value)+4} textAnchor="end">{trim(value)}</text>)}
        </g>
        <g clipPath="url(#cls-plot-clip)">
          {analysis.limitExists && Number.isFinite(analysis.limit) && <line className="cls-limit-guide" x1={pad} x2={width-pad} y1={sy(analysis.limit)} y2={sy(analysis.limit)} />}
          <line className="cls-point-guide" x1={sx(a)} x2={sx(a)} y1={pad} y2={height-pad} />
          <path className="cls-function-path" d={path} />
          {Number.isFinite(leftY) && <circle className="cls-left-point" cx={sx(leftX)} cy={sy(leftY)} r="8" />}
          {Number.isFinite(rightY) && <circle className="cls-right-point" cx={sx(rightX)} cy={sy(rightY)} r="8" />}
          {showArrows && Number.isFinite(leftY) && <g className="cls-arrow left"><line x1={sx(leftX)+16} y1={sy(leftY)} x2={sx(leftX)+75} y2={sy(leftY)} /><path d={`M${sx(leftX)+16},${sy(leftY)} l10,-6 v12 z`} /><text x={sx(leftX)+18} y={sy(leftY)+28}>x → a⁻</text></g>}
          {showArrows && Number.isFinite(rightY) && <g className="cls-arrow right"><line x1={sx(rightX)-16} y1={sy(rightY)} x2={sx(rightX)-75} y2={sy(rightY)} /><path d={`M${sx(rightX)-16},${sy(rightY)} l-10,-6 v12 z`} /><text x={sx(rightX)-72} y={sy(rightY)+28}>x → a⁺</text></g>}
          {analysis.limitExists && Number.isFinite(analysis.limit) && !analysis.defined && <circle className="cls-hole" cx={sx(a)} cy={sy(analysis.limit)} r="9" />}
          {analysis.defined && Number.isFinite(analysis.value) && <circle className="cls-defined-point" cx={sx(a)} cy={sy(analysis.value)} r="7" />}
          {trace && <g className="cls-trace"><line x1={sx(trace.x)} x2={sx(trace.x)} y1={pad} y2={height-pad} /><circle cx={sx(trace.x)} cy={sy(trace.y)} r="6" /><text x={sx(trace.x)+10} y={sy(trace.y)-10}>({trim(trace.x)}, {trim(trace.y)})</text></g>}
        </g>
      </svg>
      <div className="cls-graph-legend"><span><i className="cyan" />f(x)</span><span><i className="orange dot" />Left approach</span><span><i className="violet dot" />Right approach</span><span><i className="hole" />f(a) {analysis.defined ? "defined" : "undefined"}</span></div>
    </section>
  );
}

export function analyzeLimit(fn: ((x: number) => number) | null, a: number, override: number | null = null): LimitAnalysis {
  if (!fn) return { left: NaN, right: NaN, limit: NaN, value: NaN, defined: false, limitExists: false, continuous: false, classification: "Invalid function" };
  const left = estimateSide(fn, a, -1);
  const right = estimateSide(fn, a, 1);
  const finiteAgreement = Number.isFinite(left) && Number.isFinite(right) && Math.abs(left-right) <= Math.max(0.015, Math.abs((left+right)/2)*0.01);
  const limit = finiteAgreement ? (left+right)/2 : NaN;
  const raw = override ?? safeValue(fn, a);
  const defined = Number.isFinite(raw);
  const continuous = defined && finiteAgreement && Math.abs(raw-limit) <= Math.max(0.015, Math.abs(limit)*0.01);
  let classification = "Limit does not exist";
  if (continuous) classification = "Continuous";
  else if (finiteAgreement) classification = "Removable discontinuity";
  else if (!Number.isFinite(left) || !Number.isFinite(right)) classification = "Infinite discontinuity";
  else if (Number.isFinite(left) && Number.isFinite(right)) classification = "Jump discontinuity";
  return { left, right, limit, value: raw, defined, limitExists: finiteAgreement, continuous, classification };
}

export function limitModeSnapshot(mode: LimitMode) {
  const config = modeConfigs[mode];
  const compiled = compileExpression(config.expression);
  return { mode, expression: config.expression, point: config.point, analysis: analyzeLimit(compiled.fn, config.point) };
}

function estimateSide(fn: (x: number) => number, a: number, direction: -1 | 1) {
  const values = [0.04, 0.02, 0.01, 0.005, 0.002].map((distance) => safeValue(fn, a + direction*distance));
  const finite = values.filter(Number.isFinite);
  if (finite.length < 3) return NaN;
  const tail = finite.slice(-3);
  const last = tail[tail.length-1];
  if (Math.abs(last) > 100 && Math.abs(tail[2]) > Math.abs(tail[1]) && Math.abs(tail[1]) > Math.abs(tail[0])) return last > 0 ? Infinity : -Infinity;
  const extrapolated = tail[2] + (0.002 / (0.005 - 0.002)) * (tail[2] - tail[1]);
  const nearestInteger = Math.round(extrapolated);
  return Math.abs(extrapolated-nearestInteger) < 0.00001 ? nearestInteger : extrapolated;
}

function compileExpression(expression: string): { fn: ((x: number) => number) | null; error: string } {
  try { return { fn: compileFunctionExpression(expression), error: "" }; }
  catch (error) { return { fn: null, error: error instanceof Error ? error.message : "Invalid expression" }; }
}
function isLimitMode(value: string): value is LimitMode { return value in modeConfigs; }
function numberParam(value: string | null, fallback: number) { if (value === null || value.trim() === "") return fallback; const parsed = Number(value); return Number.isFinite(parsed) ? parsed : fallback; }
function clamp(value: number, min: number, max: number) { return Math.min(max, Math.max(min, value)); }
function trim(value: number) { return Number.isFinite(value) ? Number(value.toFixed(3)).toString() : "—"; }
function safeValue(fn: (x: number) => number, x: number) { try { const value = fn(x); return Number.isFinite(value) ? value : NaN; } catch { return NaN; } }
function sampleFunction(fn: (x: number) => number, min: number, max: number, count: number) { return Array.from({ length: count }, (_, index) => { const x=min+index/(count-1)*(max-min); return { x, y: safeValue(fn,x) }; }); }
function pointsToPath(points: Array<{x:number;y:number}>, sx:(x:number)=>number, sy:(y:number)=>number, viewport:Viewport) { let open=false; return points.map((point) => { if (!Number.isFinite(point.y) || point.y < viewport.yMin-1 || point.y > viewport.yMax+1) { open=false; return ""; } const command=open?"L":"M"; open=true; return `${command}${sx(point.x).toFixed(2)},${sy(point.y).toFixed(2)}`; }).join(" "); }
function ticks(min: number, max: number, target: number) { const raw=(max-min)/target; const magnitude=10**Math.floor(Math.log10(raw)); const normalized=raw/magnitude; const step=(normalized<1.5?1:normalized<3.5?2:normalized<7.5?5:10)*magnitude; const result:number[]=[]; for(let value=Math.ceil(min/step)*step;value<=max;value+=step)result.push(Number(value.toFixed(8))); return result; }
function zoomViewport(value: Viewport, factor: number) { const cx=(value.xMin+value.xMax)/2,cy=(value.yMin+value.yMax)/2,hw=(value.xMax-value.xMin)*factor/2,hh=(value.yMax-value.yMin)*factor/2; return {xMin:cx-hw,xMax:cx+hw,yMin:cy-hh,yMax:cy+hh}; }
function formatLimit(value: number) { if (value === Infinity) return "+∞"; if (value === -Infinity) return "−∞"; if (!Number.isFinite(value)) return "DNE"; return Math.abs(value)<1e-7 ? "0.000000" : value.toFixed(6); }
function toLatex(expression: string) { return expression.replace(/sin\(x\)\/x/g,"\\frac{\\sin(x)}{x}").replace(/\(x\^2-1\)\/\(x-1\)/g,"\\frac{x^2-1}{x-1}").replace(/1\/\(x-1\)/g,"\\frac{1}{x-1}").replace(/1\/x/g,"\\frac{1}{x}").replace(/sqrt\(x\)/g,"\\sqrt{x}").replace(/abs\(x\)/g,"|x|"); }
function explainAnalysis(analysis: LimitAnalysis, a: number, concept: string) { if (analysis.continuous) return `Both one-sided limits agree with f(${trim(a)}), so the function is continuous. ${concept}`; if (analysis.limitExists) return `The left and right limits agree at ${formatLimit(analysis.limit)}, but f(${trim(a)}) is missing or different. This is a removable discontinuity. ${concept}`; return `The left and right behaviors do not approach the same finite value, so the two-sided limit does not exist. ${concept}`; }
