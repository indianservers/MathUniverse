import {
  Calculator,
  CheckCircle2,
  Grid3X3,
  Lightbulb,
  Minus,
  Move,
  Pause,
  Play,
  Plus,
  RotateCcw,
  Table2,
  Target,
  TrendingUp,
  ZoomIn,
  ZoomOut,
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
import "./CalculusDerivativesStudio.css";

export type DerivativeMode =
  "tangent" | "rules" | "chain" | "implicit" | "higher" | "linearization";
type BottomView = "graph" | "table" | "numerical" | "practice" | "insights";
type Viewport = { xMin: number; xMax: number; yMin: number; yMax: number };
type ModeConfig = {
  title: string;
  expression: string;
  derivative: string;
  secondDerivative: string;
  fn: (x: number) => number;
  df: (x: number) => number;
  d2f: (x: number) => number;
  range: Viewport;
  explanation: string;
  formula: string;
};

const modeConfigs: Record<DerivativeMode, ModeConfig> = {
  tangent: {
    title: "Tangent from secants",
    expression: "x^2",
    derivative: "2x",
    secondDerivative: "2",
    fn: (x) => x * x,
    df: (x) => 2 * x,
    d2f: () => 2,
    range: { xMin: -3.2, xMax: 3.4, yMin: -2.2, yMax: 8.8 },
    explanation:
      "As h approaches zero, the secant line approaches the tangent line and the difference quotient approaches f'(a).",
    formula: "f'(a)=\\lim_{h\\to0}\\frac{f(a+h)-f(a)}{h}",
  },
  rules: {
    title: "Derivative rules",
    expression: "x^4-3*x^2+2*x",
    derivative: "4x^3-6x+2",
    secondDerivative: "12x^2-6",
    fn: (x) => x ** 4 - 3 * x * x + 2 * x,
    df: (x) => 4 * x ** 3 - 6 * x + 2,
    d2f: (x) => 12 * x * x - 6,
    range: { xMin: -2.3, xMax: 2.5, yMin: -6, yMax: 10 },
    explanation:
      "The power, sum, and constant-multiple rules differentiate each polynomial term independently.",
    formula: "\\frac{d}{dx}x^n=nx^{n-1}",
  },
  chain: {
    title: "Chain rule",
    expression: "sin(x^2)",
    derivative: "2x\\cos(x^2)",
    secondDerivative: "2\\cos(x^2)-4x^2\\sin(x^2)",
    fn: (x) => Math.sin(x * x),
    df: (x) => 2 * x * Math.cos(x * x),
    d2f: (x) => 2 * Math.cos(x * x) - 4 * x * x * Math.sin(x * x),
    range: { xMin: -3.2, xMax: 3.2, yMin: -4, yMax: 4 },
    explanation:
      "Differentiate the outer function, keep the inside, then multiply by the inner derivative.",
    formula: "\\frac{d}{dx}f(g(x))=f'(g(x))g'(x)",
  },
  implicit: {
    title: "Implicit differentiation",
    expression: "sqrt(25-x^2)",
    derivative: "-x/\\sqrt{25-x^2}",
    secondDerivative: "-25/(25-x^2)^{3/2}",
    fn: (x) => Math.sqrt(Math.max(0, 25 - x * x)),
    df: (x) => -x / Math.sqrt(Math.max(0.0001, 25 - x * x)),
    d2f: (x) => -25 / Math.max(0.0001, 25 - x * x) ** 1.5,
    range: { xMin: -5.5, xMax: 5.5, yMin: -1, yMax: 6 },
    explanation:
      "Differentiate both sides of x²+y²=25 and solve 2x+2yy'=0 for y'.",
    formula: "x^2+y^2=25\\Rightarrow y'=-x/y",
  },
  higher: {
    title: "Higher derivatives",
    expression: "sin(x)",
    derivative: "\\cos x",
    secondDerivative: "-\\sin x",
    fn: Math.sin,
    df: Math.cos,
    d2f: (x) => -Math.sin(x),
    range: { xMin: -6.4, xMax: 6.4, yMin: -2, yMax: 2 },
    explanation:
      "Repeated differentiation reveals rate, concavity, and the four-step derivative cycle of sine.",
    formula: "f^{(n)}(x)=\\frac{d^n f}{dx^n}",
  },
  linearization: {
    title: "Linearization",
    expression: "exp(x)",
    derivative: "e^x",
    secondDerivative: "e^x",
    fn: Math.exp,
    df: Math.exp,
    d2f: Math.exp,
    range: { xMin: -3, xMax: 3, yMin: -2, yMax: 9 },
    explanation:
      "The tangent line L(x)=f(a)+f'(a)(x-a) is the best local linear approximation near a.",
    formula: "L(x)=f(a)+f'(a)(x-a)",
  },
};

const bottomTabs: Array<{
  id: BottomView;
  label: string;
  icon: typeof TrendingUp;
}> = [
  { id: "graph", label: "Graph", icon: TrendingUp },
  { id: "table", label: "Table", icon: Table2 },
  { id: "numerical", label: "Numerical Explorer", icon: Calculator },
  { id: "practice", label: "Practice", icon: Target },
  { id: "insights", label: "Insights", icon: Lightbulb },
];

export default function CalculusDerivativesStudio({ mode }: { mode: string }) {
  const [params, setParams] = useSearchParams();
  const activeMode = isDerivativeMode(mode) ? mode : "tangent";
  const config = modeConfigs[activeMode];
  const [expression, setExpression] = useState(
    params.get("v_expression") || config.expression,
  );
  const [draft, setDraft] = useState(
    params.get("v_expression") || config.expression,
  );
  const [a, setA] = useState(numberParam(params.get("v_a"), 1));
  const [h, setH] = useState(nonZero(numberParam(params.get("v_b"), 0.5)));
  const [samples, setSamples] = useState(
    clamp(Math.round(numberParam(params.get("v_n"), 20)), 12, 120),
  );
  const [order, setOrder] = useState(
    clamp(Math.round(numberParam(params.get("v_order"), 2)), 1, 4),
  );
  const [showTangent, setShowTangent] = useState(true);
  const [showSecant, setShowSecant] = useState(true);
  const [showDerivative, setShowDerivative] = useState(true);
  const [showGrid, setShowGrid] = useState(true);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [bottomView, setBottomView] = useState<BottomView>("graph");
  const [viewport, setViewport] = useState(config.range);
  const [panMode, setPanMode] = useState(false);
  const previousMode = useRef(activeMode);

  const compiled = useMemo(
    () => compileExpression(expression, config),
    [config, expression],
  );
  const analysis = useMemo(
    () => analyzeDerivative(compiled.fn, a, h),
    [a, compiled.fn, h],
  );
  const higherValue = useMemo(
    () => nthDerivative(compiled.fn, a, order),
    [a, compiled.fn, order],
  );

  useEffect(() => {
    const next = new URLSearchParams(params);
    next.set("v_a", trim(a));
    next.set("v_b", trim(h));
    next.set("v_n", String(samples));
    next.set("v_expression", expression);
    next.set("v_order", String(order));
    if (next.toString() !== params.toString())
      setParams(next, { replace: true });
  }, [a, expression, h, order, params, samples, setParams]);

  useEffect(() => {
    if (previousMode.current === activeMode) return;
    previousMode.current = activeMode;
    setExpression(config.expression);
    setDraft(config.expression);
    setA(activeMode === "implicit" ? 3 : 1);
    setH(0.5);
    setOrder(2);
    setViewport(config.range);
    setPlaying(false);
    setBottomView("graph");
  }, [activeMode, config]);

  useEffect(() => {
    if (!playing) return;
    const timer = window.setInterval(() => {
      setH((value) => {
        const next = Math.max(0.01, Math.abs(value) - 0.018 * speed);
        if (next <= 0.0101) setPlaying(false);
        return Math.sign(value || 1) * next;
      });
    }, 45);
    return () => window.clearInterval(timer);
  }, [playing, speed]);

  const applyExpression = () => {
    if (!compileExpression(draft, config).error) setExpression(draft);
  };
  const reset = () => {
    setExpression(config.expression);
    setDraft(config.expression);
    setA(activeMode === "implicit" ? 3 : 1);
    setH(0.5);
    setSamples(20);
    setOrder(2);
    setShowTangent(true);
    setShowSecant(true);
    setShowDerivative(true);
    setShowGrid(true);
    setPlaying(false);
    setSpeed(1);
    setViewport(config.range);
    setPanMode(false);
    setBottomView("graph");
  };
  const zoom = (factor: number) =>
    setViewport((view) => scaleViewport(view, factor));

  return (
    <section
      className="cds-studio"
      aria-label={`${config.title} derivative workspace`}
    >
      <div className="cds-workspace">
        <aside className="cds-panel cds-controls">
          <ControlSection title="Function">
            <div className="cds-expression">
              <span>f(x) =</span>
              <input
                aria-label="Function expression"
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                onKeyDown={(event) =>
                  event.key === "Enter" && applyExpression()
                }
              />
              <button
                type="button"
                onClick={applyExpression}
                disabled={Boolean(compileExpression(draft, config).error)}
                aria-label="Apply function"
              >
                f<sub>x</sub>
              </button>
            </div>
            {compiled.error && <p className="cds-error">{compiled.error}</p>}
          </ControlSection>

          <ControlSection title="Tangent point">
            <Stepper label="a" value={a} step={0.1} onChange={setA} />
          </ControlSection>
          <ControlSection
            title={
              activeMode === "linearization"
                ? "Approximation distance"
                : "Secant distance"
            }
          >
            <Stepper
              label="h"
              value={h}
              step={0.05}
              onChange={(value) => setH(nonZero(value))}
            />
          </ControlSection>
          {activeMode === "higher" && (
            <ControlSection title="Derivative order">
              <Stepper
                label="n"
                value={order}
                step={1}
                min={1}
                max={4}
                onChange={(value) => setOrder(clamp(Math.round(value), 1, 4))}
              />
            </ControlSection>
          )}
          <ControlSection title="Display">
            <Toggle
              label="Tangent line"
              color="orange"
              checked={showTangent}
              onChange={setShowTangent}
            />
            <Toggle
              label="Secant line"
              color="violet"
              checked={showSecant}
              onChange={setShowSecant}
            />
            <Toggle
              label={
                activeMode === "higher"
                  ? `Derivative f^(${order})(x)`
                  : "Derivative curve f'(x)"
              }
              color="cyan"
              checked={showDerivative}
              onChange={setShowDerivative}
            />
          </ControlSection>
          <ControlSection title="Animation">
            <Toggle
              label="Animate h → 0"
              color="cyan"
              checked={playing}
              onChange={setPlaying}
            />
            <div className="cds-animation">
              <button
                type="button"
                aria-label="Restart animation"
                onClick={() => {
                  setH(0.5);
                  setPlaying(false);
                }}
              >
                <RotateCcw />
              </button>
              <button
                type="button"
                aria-label={playing ? "Pause animation" : "Play animation"}
                onClick={() => setPlaying((value) => !value)}
              >
                {playing ? <Pause /> : <Play />}
              </button>
              <select
                aria-label="Animation speed"
                value={speed}
                onChange={(event) => setSpeed(Number(event.target.value))}
              >
                <option value="0.5">0.5x</option>
                <option value="1">1x</option>
                <option value="2">2x</option>
              </select>
            </div>
          </ControlSection>
          <div className="cds-tip">
            <Lightbulb />
            <p>
              Drag point a or adjust h. Watch the secant converge to the tangent
              as h approaches 0.
            </p>
          </div>
        </aside>

        <main className="cds-panel cds-visual">
          <DerivativeGraph
            fn={compiled.fn}
            derivativeFn={
              activeMode === "higher"
                ? (x) => nthDerivative(compiled.fn, x, order)
                : compiled.df
            }
            expression={expression}
            derivativeLabel={
              activeMode === "higher"
                ? derivativeCycleLabel(expression, order)
                : compiled.derivativeLabel
            }
            a={a}
            h={h}
            analysis={analysis}
            viewport={viewport}
            samples={samples}
            showGrid={showGrid}
            showTangent={showTangent}
            showSecant={showSecant}
            showDerivative={showDerivative}
            panMode={panMode}
            onA={setA}
            onH={(value) => setH(nonZero(value))}
            onPan={setViewport}
          />
          <div className="cds-graph-tools">
            <button
              type="button"
              className={panMode ? "active" : ""}
              onClick={() => setPanMode((value) => !value)}
            >
              <Move /> Pan
            </button>
            <button type="button" onClick={() => zoom(0.82)}>
              <ZoomIn /> Zoom In
            </button>
            <button type="button" onClick={() => zoom(1.22)}>
              <ZoomOut /> Zoom Out
            </button>
            <button
              type="button"
              className={showGrid ? "active" : ""}
              onClick={() => setShowGrid((value) => !value)}
            >
              <Grid3X3 /> Grid
            </button>
            <button type="button" onClick={() => setViewport(config.range)}>
              <RotateCcw /> Reset View
            </button>
          </div>
        </main>

        <aside className="cds-panel cds-analysis">
          <AnalysisSection title="Live derivative">
            <MathExpression value={config.formula} display />
            <div className="cds-live-value">
              <MathExpression
                value={activeMode === "higher" ? `f^{(${order})}(a)` : "f'(a)"}
              />
              <span>=</span>
              <strong>
                {format(
                  activeMode === "higher" ? higherValue : analysis.tangentSlope,
                  4,
                )}
              </strong>
            </div>
          </AnalysisSection>
          <AnalysisSection title="Slope comparison">
            <div className="cds-comparison">
              <span>
                Secant slope <MathExpression value="m_{sec}" />
              </span>
              <strong>{format(analysis.secantSlope, 4)}</strong>
              <span>
                Tangent slope <MathExpression value="m_{tan}" />
              </span>
              <strong className="orange">
                {format(analysis.tangentSlope, 4)}
              </strong>
              <span>Difference</span>
              <strong className="red">{format(analysis.difference, 4)}</strong>
            </div>
          </AnalysisSection>
          <AnalysisSection
            title={
              activeMode === "linearization"
                ? "Linear approximation"
                : "Difference quotient"
            }
          >
            <MathExpression
              value={`\\frac{f(a+h)-f(a)}{h}=\\frac{${format(analysis.fb, 3)}-${format(analysis.fa, 3)}}{${trim(h)}}`}
              display
            />
            <div className="cds-quotient">
              = {format(analysis.secantSlope, 4)}
            </div>
          </AnalysisSection>
          <AnalysisSection title="Convergence (h → 0)">
            <div className="cds-convergence">
              <span
                style={{ left: `${convergencePercent(analysis.difference)}%` }}
              />
            </div>
            <div className="cds-convergence-copy">
              <MathExpression value="|m_{sec}-m_{tan}|" />
              <b>= {format(analysis.difference, 4)}</b>
              <strong>
                {analysis.difference < 0.05 ? "Converged" : "Converging"}
              </strong>
            </div>
          </AnalysisSection>
          <AnalysisSection title="Explanation">
            <div className="cds-explanation">
              <CheckCircle2 />
              <p>{config.explanation}</p>
            </div>
          </AnalysisSection>
        </aside>
      </div>

      <section className="cds-bottom">
        <nav role="tablist" aria-label="Derivative exploration views">
          {bottomTabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={bottomView === id}
              className={bottomView === id ? "active" : ""}
              onClick={() => setBottomView(id)}
            >
              <Icon />
              {label}
            </button>
          ))}
        </nav>
        {bottomView !== "graph" && (
          <BottomPanel
            view={bottomView}
            config={config}
            analysis={analysis}
            fn={compiled.fn}
            a={a}
            h={h}
            order={order}
            samples={samples}
            onSamples={setSamples}
          />
        )}
      </section>
      <button className="cds-reset" type="button" onClick={reset}>
        <RotateCcw /> Reset studio
      </button>
    </section>
  );
}

function DerivativeGraph({
  fn,
  derivativeFn,
  expression,
  derivativeLabel,
  a,
  h,
  analysis,
  viewport,
  samples,
  showGrid,
  showTangent,
  showSecant,
  showDerivative,
  panMode,
  onA,
  onH,
  onPan,
}: {
  fn: (x: number) => number;
  derivativeFn: (x: number) => number;
  expression: string;
  derivativeLabel: string;
  a: number;
  h: number;
  analysis: DerivativeAnalysis;
  viewport: Viewport;
  samples: number;
  showGrid: boolean;
  showTangent: boolean;
  showSecant: boolean;
  showDerivative: boolean;
  panMode: boolean;
  onA: (value: number) => void;
  onH: (value: number) => void;
  onPan: (value: Viewport) => void;
}) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [dragging, setDragging] = useState<"a" | "b" | "pan" | null>(null);
  const panStart = useRef<{ x: number; y: number; view: Viewport } | null>(
    null,
  );
  const width = 850,
    height = 650,
    pad = 56;
  const sx = (x: number) =>
    pad +
    ((x - viewport.xMin) / (viewport.xMax - viewport.xMin)) * (width - pad * 2);
  const sy = (y: number) =>
    height -
    pad -
    ((y - viewport.yMin) / (viewport.yMax - viewport.yMin)) *
      (height - pad * 2);
  const pointFromEvent = (event: ReactPointerEvent<SVGSVGElement>) => {
    const box = svgRef.current?.getBoundingClientRect();
    if (!box) return { x: a, y: analysis.fa };
    return {
      x:
        viewport.xMin +
        ((event.clientX - box.left) / box.width) *
          (viewport.xMax - viewport.xMin),
      y:
        viewport.yMax -
        ((event.clientY - box.top) / box.height) *
          (viewport.yMax - viewport.yMin),
    };
  };
  const points = sampleFunction(
    fn,
    viewport.xMin,
    viewport.xMax,
    Math.max(160, samples * 18),
  );
  const derivativePoints = sampleFunction(
    derivativeFn,
    viewport.xMin,
    viewport.xMax,
    Math.max(160, samples * 14),
  );
  const tangent = (x: number) => analysis.fa + analysis.tangentSlope * (x - a);
  const secant = (x: number) => analysis.fa + analysis.secantSlope * (x - a);
  const move = (event: ReactPointerEvent<SVGSVGElement>) => {
    if (!dragging) return;
    const point = pointFromEvent(event);
    if (dragging === "a") onA(clamp(point.x, viewport.xMin, viewport.xMax));
    else if (dragging === "b") onH(clamp(point.x - a, -6, 6));
    else if (panStart.current) {
      const dx = point.x - panStart.current.x,
        dy = point.y - panStart.current.y,
        view = panStart.current.view;
      onPan({
        xMin: view.xMin - dx,
        xMax: view.xMax - dx,
        yMin: view.yMin - dy,
        yMax: view.yMax - dy,
      });
    }
  };
  return (
    <div className="cds-graph-wrap">
      <svg
        ref={svgRef}
        viewBox={`0 0 ${width} ${height}`}
        role="img"
        aria-label="Interactive derivative graph"
        onPointerMove={move}
        onPointerUp={() => setDragging(null)}
        onPointerLeave={() => setDragging(null)}
        onPointerDown={(event) => {
          if (!panMode) return;
          const point = pointFromEvent(event);
          panStart.current = { ...point, view: viewport };
          setDragging("pan");
        }}
      >
        <rect width={width} height={height} rx="12" fill="#071d35" />
        {showGrid && (
          <GraphGrid
            viewport={viewport}
            sx={sx}
            sy={sy}
            width={width}
            height={height}
            pad={pad}
          />
        )}
        <line
          x1={pad}
          x2={width - pad}
          y1={sy(0)}
          y2={sy(0)}
          className="axis"
        />
        <line
          x1={sx(0)}
          x2={sx(0)}
          y1={pad}
          y2={height - pad}
          className="axis"
        />
        <path d={graphPath(points, sx, sy, viewport)} className="function" />
        {showDerivative && (
          <path
            d={graphPath(derivativePoints, sx, sy, viewport)}
            className="derivative"
          />
        )}
        {showTangent && Number.isFinite(analysis.tangentSlope) && (
          <line
            x1={sx(viewport.xMin)}
            x2={sx(viewport.xMax)}
            y1={sy(tangent(viewport.xMin))}
            y2={sy(tangent(viewport.xMax))}
            className="tangent"
          />
        )}
        {showSecant && Number.isFinite(analysis.secantSlope) && (
          <line
            x1={sx(viewport.xMin)}
            x2={sx(viewport.xMax)}
            y1={sy(secant(viewport.xMin))}
            y2={sy(secant(viewport.xMax))}
            className="secant"
          />
        )}
        <line
          x1={sx(a)}
          x2={sx(a)}
          y1={sy(0)}
          y2={sy(analysis.fa)}
          className="guide"
        />
        <line
          x1={sx(a + h)}
          x2={sx(a + h)}
          y1={sy(0)}
          y2={sy(analysis.fb)}
          className="guide"
        />
        <g
          className="point-a"
          onPointerDown={(event) => {
            event.stopPropagation();
            setDragging("a");
          }}
        >
          <circle cx={sx(a)} cy={sy(analysis.fa)} r="9" />
          <text x={sx(a) + 14} y={sy(analysis.fa) + 24}>
            ({trim(a)}, {trim(analysis.fa)})
          </text>
        </g>
        <g
          className="point-b"
          onPointerDown={(event) => {
            event.stopPropagation();
            setDragging("b");
          }}
        >
          <circle cx={sx(a + h)} cy={sy(analysis.fb)} r="9" />
          <text x={sx(a + h) + 14} y={sy(analysis.fb) + 7}>
            ({trim(a + h)}, {trim(analysis.fb)})
          </text>
        </g>
        <text x={width - 38} y={sy(0) - 9} className="axis-label">
          x
        </text>
        <text x={sx(0) + 9} y={34} className="axis-label">
          y
        </text>
      </svg>
      <div className="cds-legend">
        <span>
          <i className="cyan" />
          f(x) = {expression}
        </span>
        {showTangent && (
          <span>
            <i className="orange" />
            Tangent at x = {trim(a)}
          </span>
        )}
        {showSecant && (
          <span>
            <i className="violet" />
            Secant (h = {trim(h)})
          </span>
        )}
        {showDerivative && (
          <span>
            <i className="dashed" />
            {derivativeLabel}
          </span>
        )}
        <hr />
        <b>
          m<sub>tan</sub> = {format(analysis.tangentSlope, 4)}
        </b>
        <b className="violet-text">
          m<sub>sec</sub> = {format(analysis.secantSlope, 4)}
        </b>
      </div>
      <div className="cds-h-badge">
        <MathExpression value={`h=${trim(h)}\\quad(b=a+h=${trim(a + h)})`} />
      </div>
    </div>
  );
}

function BottomPanel({
  view,
  config,
  analysis,
  fn,
  a,
  h,
  order,
  samples,
  onSamples,
}: {
  view: Exclude<BottomView, "graph">;
  config: ModeConfig;
  analysis: DerivativeAnalysis;
  fn: (x: number) => number;
  a: number;
  h: number;
  order: number;
  samples: number;
  onSamples: (value: number) => void;
}) {
  if (view === "table")
    return (
      <div className="cds-bottom-panel">
        <table>
          <thead>
            <tr>
              <th>x</th>
              <th>f(x)</th>
              <th>f'(x)</th>
              <th>Secant from a</th>
            </tr>
          </thead>
          <tbody>
            {[-2, -1, 0, 1, 2].map((offset) => {
              const x = a + offset * h;
              return (
                <tr key={offset}>
                  <td>{trim(x)}</td>
                  <td>{format(safe(fn, x), 5)}</td>
                  <td>{format(nthDerivative(fn, x, 1), 5)}</td>
                  <td>
                    {offset === 0
                      ? "—"
                      : format((safe(fn, x) - analysis.fa) / (x - a), 5)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  if (view === "numerical")
    return (
      <div className="cds-bottom-panel cds-numerical">
        <label>
          <span>Sample resolution</span>
          <b>{samples}</b>
          <input
            aria-label="Numerical sample resolution"
            type="range"
            min="12"
            max="120"
            value={samples}
            onChange={(event) => onSamples(Number(event.target.value))}
          />
        </label>
        <MathExpression
          value={`f'(a)\\approx\\frac{f(a+10^{-4})-f(a-10^{-4})}{2\\cdot10^{-4}}=${format(analysis.tangentSlope, 6)}`}
          display
        />
      </div>
    );
  if (view === "practice")
    return (
      <div className="cds-bottom-panel cds-practice">
        <Target />
        <div>
          <b>Predict before moving h</b>
          <p>
            Will the secant slope rise or fall as h approaches zero? Use the
            graph, then verify against the tangent slope.
          </p>
        </div>
      </div>
    );
  return (
    <div className="cds-bottom-panel cds-insights">
      <Lightbulb />
      <div>
        <MathExpression value={config.formula} display />
        <p>
          {config.explanation} Current derivative order: {order}.
        </p>
      </div>
    </div>
  );
}

function ControlSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="cds-control-section">
      <h2>{title}</h2>
      {children}
    </section>
  );
}
function AnalysisSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="cds-analysis-section">
      <h2>{title}</h2>
      {children}
    </section>
  );
}
function Stepper({
  label,
  value,
  step,
  min = -10,
  max = 10,
  onChange,
}: {
  label: string;
  value: number;
  step: number;
  min?: number;
  max?: number;
  onChange: (value: number) => void;
}) {
  return (
    <div className="cds-stepper">
      <MathExpression value={label} />
      <input
        aria-label={`${label} value`}
        type="number"
        value={trim(value)}
        min={min}
        max={max}
        step={step}
        onChange={(event) =>
          onChange(clamp(Number(event.target.value), min, max))
        }
      />
      <button
        type="button"
        aria-label={`Decrease ${label}`}
        onClick={() => onChange(clamp(value - step, min, max))}
      >
        <Minus />
      </button>
      <button
        type="button"
        aria-label={`Increase ${label}`}
        onClick={() => onChange(clamp(value + step, min, max))}
      >
        <Plus />
      </button>
    </div>
  );
}
function Toggle({
  label,
  color,
  checked,
  onChange,
}: {
  label: string;
  color: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <div className="cds-toggle-row">
      <span>
        <i className={color} />
        {label}
      </span>
      <button
        type="button"
        role="switch"
        aria-label={label}
        aria-checked={checked}
        className={checked ? "on" : ""}
        onClick={() => onChange(!checked)}
      >
        <i />
      </button>
    </div>
  );
}

function GraphGrid({
  viewport,
  sx,
  sy,
  width,
  height,
  pad,
}: {
  viewport: Viewport;
  sx: (x: number) => number;
  sy: (y: number) => number;
  width: number;
  height: number;
  pad: number;
}) {
  const xs = integerTicks(viewport.xMin, viewport.xMax),
    ys = integerTicks(viewport.yMin, viewport.yMax);
  return (
    <g>
      {xs.map((x) => (
        <g key={`x-${x}`}>
          <line
            x1={sx(x)}
            x2={sx(x)}
            y1={pad}
            y2={height - pad}
            className="grid"
          />
          <text x={sx(x)} y={sy(0) + 23} className="tick" textAnchor="middle">
            {x}
          </text>
        </g>
      ))}
      {ys.map((y) => (
        <g key={`y-${y}`}>
          <line
            x1={pad}
            x2={width - pad}
            y1={sy(y)}
            y2={sy(y)}
            className="grid"
          />
          <text x={sx(0) - 12} y={sy(y) + 4} className="tick" textAnchor="end">
            {y}
          </text>
        </g>
      ))}
    </g>
  );
}

export type DerivativeAnalysis = {
  fa: number;
  fb: number;
  tangentSlope: number;
  secantSlope: number;
  difference: number;
};
export function analyzeDerivative(
  fn: (x: number) => number,
  a: number,
  h: number,
): DerivativeAnalysis {
  const safeH = nonZero(h),
    fa = safe(fn, a),
    fb = safe(fn, a + safeH),
    tangentSlope = nthDerivative(fn, a, 1),
    secantSlope = (fb - fa) / safeH;
  return {
    fa,
    fb,
    tangentSlope,
    secantSlope,
    difference: Math.abs(secantSlope - tangentSlope),
  };
}
export function derivativeModeSnapshot(
  mode: DerivativeMode,
  a: number,
  h: number,
) {
  const config = modeConfigs[mode];
  return {
    ...analyzeDerivative(config.fn, a, h),
    expression: config.expression,
    derivative: config.derivative,
    secondDerivative: config.secondDerivative,
  };
}

function compileExpression(expression: string, config: ModeConfig) {
  try {
    const fn = compileFunctionExpression(expression);
    return {
      fn,
      df: (x: number) => nthDerivative(fn, x, 1),
      derivativeLabel:
        expression === config.expression
          ? `f'(x) = ${config.derivative}`
          : `f'(x) of ${expression}`,
      error: "",
    };
  } catch (error) {
    return {
      fn: config.fn,
      df: config.df,
      derivativeLabel: `f'(x) = ${config.derivative}`,
      error: error instanceof Error ? error.message : "Invalid function",
    };
  }
}
function nthDerivative(
  fn: (x: number) => number,
  x: number,
  order: number,
): number {
  if (order <= 0) return safe(fn, x);
  const h = order >= 3 ? 0.0025 : 0.0005;
  const lower = (value: number) =>
    order === 1 ? safe(fn, value) : nthDerivative(fn, value, order - 1);
  return (lower(x + h) - lower(x - h)) / (2 * h);
}
function derivativeCycleLabel(expression: string, order: number) {
  if (expression !== "sin(x)") return `f^(${order})(x)`;
  return ["sin x", "cos x", "-sin x", "-cos x", "sin x"][order];
}
function sampleFunction(
  fn: (x: number) => number,
  min: number,
  max: number,
  count: number,
) {
  return Array.from({ length: count }, (_, index) => {
    const x = min + (index / (count - 1)) * (max - min),
      y = safe(fn, x);
    return { x, y, ok: Number.isFinite(y) };
  });
}
function graphPath(
  points: Array<{ x: number; y: number; ok: boolean }>,
  sx: (x: number) => number,
  sy: (y: number) => number,
  view: Viewport,
) {
  let open = false;
  return points
    .map((point) => {
      if (!point.ok || point.y < view.yMin - 5 || point.y > view.yMax + 5) {
        open = false;
        return "";
      }
      const command = open ? "L" : "M";
      open = true;
      return `${command}${sx(point.x).toFixed(2)},${sy(point.y).toFixed(2)}`;
    })
    .join(" ");
}
function scaleViewport(view: Viewport, factor: number): Viewport {
  const x = (view.xMin + view.xMax) / 2,
    y = (view.yMin + view.yMax) / 2,
    width = (view.xMax - view.xMin) * factor,
    height = (view.yMax - view.yMin) * factor;
  return {
    xMin: x - width / 2,
    xMax: x + width / 2,
    yMin: y - height / 2,
    yMax: y + height / 2,
  };
}
function convergencePercent(difference: number) {
  return clamp(100 - Math.log10(1 + Math.max(0, difference) * 10) * 60, 4, 100);
}
function isDerivativeMode(value: string): value is DerivativeMode {
  return value in modeConfigs;
}
function safe(fn: (x: number) => number, x: number) {
  try {
    const value = fn(x);
    return Number.isFinite(value) ? value : NaN;
  } catch {
    return NaN;
  }
}
function numberParam(value: string | null, fallback: number) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}
function nonZero(value: number) {
  return Math.abs(value) < 0.0001 ? (value < 0 ? -0.01 : 0.01) : value;
}
function integerTicks(min: number, max: number) {
  const span = max - min,
    step = span > 14 ? 2 : span > 7 ? 1 : 0.5,
    values: number[] = [];
  for (let value = Math.ceil(min / step) * step; value <= max; value += step)
    values.push(Number(value.toFixed(4)));
  return values;
}
function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}
function trim(value: number) {
  return Number.isFinite(value) ? Number(value.toFixed(3)).toString() : "--";
}
function format(value: number, digits: number) {
  return Number.isFinite(value) ? value.toFixed(digits) : "--";
}
