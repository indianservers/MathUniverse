import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Lightbulb,
  Maximize2,
  Play,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type PointerEvent,
  type RefObject,
} from "react";
import type { LessonAdapterProps } from "../../types";
import "./DifferentialEquationsTargetLesson443.css";
type Equation = "x-y" | "x+y" | "y";
type Point = { x: number; y: number };
export default function DifferentialEquationsTargetLesson443({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [equation, setEquation] = useState<Equation>("x-y"),
    [initial, setInitial] = useState<Point>({ x: 0, y: 1 }),
    [step, setStep] = useState(0.2),
    [visible, setVisible] = useState(16),
    [animating, setAnimating] = useState(false),
    [actions, setActions] = useState(0),
    graphRef = useRef<SVGSVGElement>(null);
  const euler = useMemo(
      () => eulerPoints(equation, initial, step, 16),
      [equation, initial, step],
    ),
    compare = euler[Math.min(9, euler.length - 1)],
    exactCompare = exactValue(equation, initial, compare.x),
    error = Math.abs(exactCompare - compare.y);
  const act = (run: () => void) => {
    run();
    setActions((v) => v + 1);
    onInteraction();
  };
  useEffect(() => {
    setEquation("x-y");
    setInitial({ x: 0, y: 1 });
    setStep(0.2);
    setVisible(16);
    setAnimating(false);
    setActions(0);
  }, [resetToken]);
  useEffect(() => {
    if (!animating) return;
    const id = window.setInterval(
      () =>
        setVisible((value) => {
          if (value >= euler.length) {
            setAnimating(false);
            return value;
          }
          return value + 1;
        }),
      180,
    );
    return () => window.clearInterval(id);
  }, [animating, euler.length]);
  const drag = (event: PointerEvent<SVGCircleElement>) =>
      event.currentTarget.setPointerCapture(event.pointerId),
    move = (event: PointerEvent<SVGCircleElement>) => {
      if (
        !event.currentTarget.hasPointerCapture(event.pointerId) ||
        !graphRef.current
      )
        return;
      const b = graphRef.current.getBoundingClientRect(),
        x = -3.2 + ((event.clientX - b.left) / b.width) * 7,
        y = 4 - ((event.clientY - b.top) / b.height) * 7;
      setInitial({ x: round(x, 0.1), y: round(y, 0.1) });
      setVisible(16);
    };
  return (
    <section
      className="de443-page"
      data-testid="symbolic-cas-mockup-0349"
      data-dedicated-lesson="443"
      data-object-model="ode-slope-field-exact-solution-euler-draggable-initial-condition-animation-error"
      data-equation={equation}
      data-x0={initial.x}
      data-y0={initial.y}
      data-step={step}
      data-visible={visible}
      data-error={error}
      data-actions={actions}
    >
      <h2 className="sr-only">Differential Equations</h2>
      <nav className="de443-tabs">
        <button className="active" data-lesson-control="ode-tab-interaction">
          <Sparkles /> Interaction + visualization
        </button>
        <button data-lesson-control="ode-tab-explain">
          <BookOpen /> Explain
        </button>
        <button data-lesson-control="ode-tab-examples">
          <Lightbulb /> Examples
        </button>
        <button data-lesson-control="ode-tab-formulas">Σ Formulas</button>
        <button data-lesson-control="ode-tab-more">Know more</button>
      </nav>
      <div className="de443-layout">
        <main>
          <header>
            <span>
              <h2>Follow a solution through a slope field</h2>
              <p>
                A differential equation gives a slope rule. An initial condition
                picks one solution curve.
              </p>
            </span>
            <button
              data-lesson-control="ode-reset-view"
              onClick={() =>
                act(() => {
                  setInitial({ x: 0, y: 1 });
                  setVisible(16);
                })
              }
            >
              <RotateCcw /> Reset view
            </button>
          </header>
          <section className="de443-graph">
            <button
              data-lesson-control="ode-fullscreen"
              onClick={() =>
                act(() => document.documentElement.requestFullscreen?.())
              }
            >
              <Maximize2 />
            </button>
            <OdeGraph
              graphRef={graphRef}
              equation={equation}
              initial={initial}
              euler={euler.slice(0, visible)}
              onPointerDown={drag}
              onPointerMove={move}
            />
            <div className="legend">
              <span>━ exact solution y(x)</span>
              <span>━ Euler approximation</span>
              <span>┅ other solutions</span>
            </div>
            <footer>
              <article>
                <b>Comparison at x = {compare.x.toFixed(2)}</b>
                <p>● Exact &nbsp; y(x) = {exactCompare.toFixed(4)}</p>
                <p>● Euler &nbsp; yE(x) = {compare.y.toFixed(4)}</p>
              </article>
              <article>
                <b>Absolute error</b>
                <strong>{error.toFixed(4)}</strong>
                <em>
                  {(
                    (error / Math.max(0.001, Math.abs(exactCompare))) *
                    100
                  ).toFixed(2)}
                  %
                </em>
              </article>
              <article>
                <InfoText />
              </article>
            </footer>
          </section>
        </main>
        <aside className="de443-controls">
          <label>
            Differential equation (slope rule)
            <select
              data-lesson-control="ode-equation"
              value={equation}
              onChange={(e) =>
                act(() => {
                  setEquation(e.target.value as Equation);
                  setVisible(16);
                })
              }
            >
              <option value="x-y">y' = x - y</option>
              <option value="x+y">y' = x + y</option>
              <option value="y">y' = y</option>
            </select>
          </label>
          <article>
            <b>Slope rule:</b> at any point (x,y), slope = {slopeText(equation)}
            .
          </article>
          <h3>Initial condition (x₀, y₀)</h3>
          <div>
            <label>
              x₀
              <input
                type="number"
                data-lesson-control="ode-x0"
                value={initial.x}
                onChange={(e) =>
                  act(() =>
                    setInitial({ ...initial, x: Number(e.target.value) }),
                  )
                }
              />
            </label>
            <label>
              y₀
              <input
                type="number"
                data-lesson-control="ode-y0"
                value={initial.y}
                onChange={(e) =>
                  act(() =>
                    setInitial({ ...initial, y: Number(e.target.value) }),
                  )
                }
              />
            </label>
          </div>
          <button className="drag-label">
            <Sparkles /> Drag initial point
          </button>
          <p>Drag the blue point on the graph</p>
          <label>
            Step size (Euler) h
            <input
              type="range"
              min=".05"
              max="1"
              step=".05"
              data-lesson-control="ode-step"
              value={step}
              onChange={(e) =>
                act(() => {
                  setStep(Number(e.target.value));
                  setVisible(16);
                })
              }
            />
            <output>h = {step.toFixed(2)}</output>
          </label>
          <h3>Next Euler point</h3>
          <div>
            <output>x₁ = {(initial.x + step).toFixed(2)}</output>
            <output>
              y₁ ={" "}
              {(
                initial.y +
                step * slope(equation, initial.x, initial.y)
              ).toFixed(4)}
            </output>
          </div>
          <h3>Local slope at (x₀,y₀)</h3>
          <strong>
            y' = {slopeText(equation)} ={" "}
            {slope(equation, initial.x, initial.y).toFixed(4)}
          </strong>
          <h3>Exact solution preview</h3>
          <output className="solution">
            {exactFormula(equation, initial)}
          </output>
          <button
            data-lesson-control="ode-animate"
            onClick={() =>
              act(() => {
                setVisible(1);
                setAnimating(true);
              })
            }
          >
            <Play /> Animate Euler steps
          </button>
          <button
            data-lesson-control="ode-clear"
            onClick={() =>
              act(() => {
                setVisible(0);
                setAnimating(false);
              })
            }
          >
            <RotateCcw /> Clear steps
          </button>
          <small>h = {step.toFixed(2)}</small>
        </aside>
      </div>
      <nav className="de443-nav">
        <a href="/lessons/symbolic-mathematics/442-series-expansions">
          <ArrowLeft />
          <span>
            <small>Previous</small>Series Expansions
          </span>
        </a>
        <button>Quick links⌄</button>
        <a href="/lessons/symbolic-mathematics/444-matrix-operations">
          <span>
            <small>Next</small>Matrix Operations
          </span>
          <ArrowRight />
        </a>
      </nav>
    </section>
  );
}
function OdeGraph({
  graphRef,
  equation,
  initial,
  euler,
  onPointerDown,
  onPointerMove,
}: {
  graphRef: RefObject<SVGSVGElement | null>;
  equation: Equation;
  initial: Point;
  euler: Point[];
  onPointerDown: (e: PointerEvent<SVGCircleElement>) => void;
  onPointerMove: (e: PointerEvent<SVGCircleElement>) => void;
}) {
  const sx = (x: number) => 350 + (x / 3.5) * 330,
    sy = (y: number) => 270 - (y / 0.01) * 0.01 * 62,
    path = (offset = 0) =>
      Array.from({ length: 121 }, (_, i) => {
        const x = -3.3 + (i * 6.9) / 120,
          y = exactValue(equation, { x: initial.x, y: initial.y + offset }, x);
        return `${i ? "L" : "M"}${sx(x)} ${sy(y)}`;
      }).join(" "),
    eulerPath = euler
      .map((p, i) => {
        if (!i) return `M${sx(p.x)} ${sy(p.y)}`;
        const previous = euler[i - 1];
        return `L${sx(p.x)} ${sy(previous.y)} L${sx(p.x)} ${sy(p.y)}`;
      })
      .join(" ");
  return (
    <svg
      ref={graphRef}
      viewBox="0 0 800 560"
      role="img"
      aria-label="Slope field with draggable initial condition and Euler approximation"
    >
      <rect width="800" height="560" fill="#06142b" />
      <defs>
        <marker
          id="de443-arrow-white"
          markerWidth="7"
          markerHeight="7"
          refX="4"
          refY="3.5"
          orient="auto"
        >
          <path d="M0 0L7 3.5L0 7Z" fill="#fff" />
        </marker>
        <marker
          id="de443-arrow-green"
          markerWidth="7"
          markerHeight="7"
          refX="4"
          refY="3.5"
          orient="auto"
        >
          <path d="M0 0L7 3.5L0 7Z" fill="#59df60" />
        </marker>
        <marker
          id="de443-arrow-orange"
          markerWidth="7"
          markerHeight="7"
          refX="4"
          refY="3.5"
          orient="auto"
        >
          <path d="M0 0L7 3.5L0 7Z" fill="#ffad19" />
        </marker>
      </defs>
      <g stroke="#e7edf7" strokeWidth="1.5" opacity=".8">
        {Array.from({ length: 17 }, (_, ix) =>
          Array.from({ length: 13 }, (_, iy) => {
            const x = -3.2 + ix * 0.4,
              y = -2.5 + iy * 0.5,
              m = slope(equation, x, y),
              angle = Math.atan(m),
              dx = Math.cos(angle) * 8,
              dy = Math.sin(angle) * 8;
            return (
              <line
                key={`${ix}-${iy}`}
                x1={sx(x) - dx}
                y1={sy(y) + dy}
                x2={sx(x) + dx}
                y2={sy(y) - dy}
                stroke="#63cdf3"
              />
            );
          }),
        )}
      </g>
      <line
        x1="20"
        y1={sy(0)}
        x2="786"
        y2={sy(0)}
        stroke="white"
        strokeWidth="2"
        markerEnd="url(#de443-arrow-white)"
      />
      <line
        x1={sx(0)}
        y1="15"
        x2={sx(0)}
        y2="535"
        stroke="white"
        strokeWidth="2"
      />
      <line
        x1={sx(0)}
        y1="535"
        x2={sx(0)}
        y2="10"
        stroke="white"
        strokeWidth="2"
        markerEnd="url(#de443-arrow-white)"
      />
      {[-3, -2, -1, 1, 2, 3].map((value) => (
        <g key={`x-${value}`} fill="white" fontSize="13" textAnchor="middle">
          <line
            x1={sx(value)}
            y1={sy(0) - 5}
            x2={sx(value)}
            y2={sy(0) + 5}
            stroke="white"
          />
          <text x={sx(value)} y={sy(0) + 22}>{value}</text>
        </g>
      ))}
      {[-3, -2, -1, 1, 2, 3].map((value) => (
        <g key={`y-${value}`} fill="white" fontSize="13" textAnchor="end">
          <line
            x1={sx(0) - 5}
            y1={sy(value)}
            x2={sx(0) + 5}
            y2={sy(value)}
            stroke="white"
          />
          <text x={sx(0) - 10} y={sy(value) + 4}>{value}</text>
        </g>
      ))}
      <text x="780" y={sy(0) - 11} fill="white" fontSize="15" fontWeight="700">x</text>
      <text x={sx(0) - 18} y="20" fill="white" fontSize="15" fontWeight="700">y</text>
      <text x={sx(0) + 9} y={sy(0) + 22} fill="white" fontSize="12">0</text>
      {[-0.7, 0.7].map((o) => (
        <path key={o} d={path(o)} fill="none" stroke="#69c8e9" opacity=".3" />
      ))}
      <path d={path()} fill="none" stroke="#59df60" strokeWidth="3" />
      <path d={eulerPath} fill="none" stroke="#ffad19" strokeWidth="3" />
      {euler.map((p, i) => (
        <circle key={i} cx={sx(p.x)} cy={sy(p.y)} r="4" fill="#ffad19" />
      ))}
      <g transform="translate(24 24)">
        <rect width="102" height="31" rx="8" fill="#12324e" stroke="#2c607c" />
        <line x1="12" y1="15" x2="31" y2="15" stroke="#63cdf3" strokeWidth="2" />
        <text x="38" y="20" fill="white" fontSize="13" fontWeight="700">slope field</text>
      </g>
      <g transform="translate(647 70)">
        <rect width="122" height="34" rx="9" fill="#214f2c" stroke="#59df60" />
        <text x="15" y="22" fill="white" fontSize="13" fontWeight="700">exact solution</text>
        <path d="M8 37L-36 75" stroke="#59df60" strokeWidth="2" markerEnd="url(#de443-arrow-green)" />
      </g>
      {euler.length > 2 && (
        <g transform="translate(529 409)">
          <rect width="103" height="34" rx="9" fill="#684711" stroke="#ffad19" />
          <text x="16" y="22" fill="white" fontSize="13" fontWeight="700">Euler step</text>
          <path d="M108 12L161 -15" stroke="#ffad19" strokeWidth="2" markerEnd="url(#de443-arrow-orange)" />
        </g>
      )}
      <circle
        cx={sx(initial.x)}
        cy={sy(initial.y)}
        r="10"
        fill="#31b9e8"
        stroke="white"
        strokeWidth="3"
        data-lesson-control="ode-initial-point"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        style={{ cursor: "move", touchAction: "none" }}
      />
      <g transform={`translate(${sx(initial.x) - 170} ${sy(initial.y) - 62})`}>
        <rect width="132" height="45" rx="9" fill="#123d59" stroke="#29b7e5" />
        <text x="12" y="19" fill="white" fontSize="12" fontWeight="700">initial condition</text>
        <text x="12" y="36" fill="#d9f7ff" fontSize="12">({initial.x}, {initial.y})</text>
        <path d="M132 31L165 52" stroke="#29b7e5" strokeWidth="2" />
      </g>
    </svg>
  );
}
function slope(eq: Equation, x: number, y: number) {
  return eq === "x-y" ? x - y : eq === "x+y" ? x + y : y;
}
function exactValue(eq: Equation, p: Point, x: number) {
  if (eq === "x-y") return x - 1 + (p.y - p.x + 1) * Math.exp(-(x - p.x));
  if (eq === "x+y") return (p.y + p.x + 1) * Math.exp(x - p.x) - x - 1;
  return p.y * Math.exp(x - p.x);
}
function eulerPoints(eq: Equation, p: Point, h: number, count: number) {
  const points = [p];
  for (let i = 0; i < count; i++) {
    const last = points.at(-1)!;
    points.push({ x: last.x + h, y: last.y + h * slope(eq, last.x, last.y) });
  }
  return points;
}
function exactFormula(eq: Equation, p: Point) {
  if (eq === "x-y")
    return `y(x) = x - 1 + ${round(p.y - p.x + 1, 0.001)}e^(-(x-${p.x}))`;
  if (eq === "x+y")
    return `y(x) = ${round(p.y + p.x + 1, 0.001)}e^(x-${p.x}) - x - 1`;
  return `y(x) = ${p.y}e^(x-${p.x})`;
}
function slopeText(eq: Equation) {
  return eq === "x-y" ? "x - y" : eq === "x+y" ? "x + y" : "y";
}
function round(v: number, step: number) {
  return Math.round(v / step) * step;
}
function InfoText() {
  return (
    <>
      <b>Euler uses local tangents to take steps.</b>
      <p>Smaller h gives a better match to the exact solution.</p>
    </>
  );
}
