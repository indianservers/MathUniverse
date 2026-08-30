import {
  CheckCircle2,
  Eye,
  Hand,
  Lightbulb,
  RotateCcw,
  Share2,
  Target,
} from "lucide-react";
import {
  useEffect,
  useMemo,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import type { LessonAdapterProps } from "../../types";
import "./NumericalIntegrationTargetLesson316.css";

type FunctionName = "wave" | "quadratic" | "decay";
type IntervalName = "zero-pi" | "zero-one" | "minus-one-one";
type Visibility = { midpoint: boolean; trapezoid: boolean; simpson: boolean };
const FUNCTIONS = {
  wave: {
    label: "f(x) = sin(x) + 0.3 cos(2x)",
    short: "sin(x)+0.3cos(2x)",
    fn: (x: number) => Math.sin(x) + 0.3 * Math.cos(2 * x),
    anti: (x: number) => -Math.cos(x) + 0.15 * Math.sin(2 * x),
  },
  quadratic: {
    label: "f(x) = x²",
    short: "x²",
    fn: (x: number) => x * x,
    anti: (x: number) => (x * x * x) / 3,
  },
  decay: {
    label: "f(x) = e⁻ˣ",
    short: "e⁻ˣ",
    fn: (x: number) => Math.exp(-x),
    anti: (x: number) => -Math.exp(-x),
  },
} satisfies Record<FunctionName, object>;
const INTERVALS = {
  "zero-pi": { label: "a = 0     b = π", a: 0, b: Math.PI },
  "zero-one": { label: "a = 0     b = 1", a: 0, b: 1 },
  "minus-one-one": { label: "a = −1     b = 1", a: -1, b: 1 },
} satisfies Record<IntervalName, object>;
const clampEven = (value: number) =>
  Math.max(2, Math.min(64, Math.round(value / 2) * 2));
const clean = (value: number, precision = 10) =>
  Number(value.toFixed(precision));

function quadrature(
  fn: (x: number) => number,
  a: number,
  b: number,
  n: number,
) {
  const dx = (b - a) / n;
  const rows = Array.from({ length: n }, (_, index) => {
    const x0 = a + index * dx,
      x1 = x0 + dx,
      mid = (x0 + x1) / 2;
    return { x0, x1, mid, y0: fn(x0), y1: fn(x1), ym: fn(mid) };
  });
  const midpoint = rows.reduce((sum, row) => sum + row.ym * dx, 0);
  const trapezoid = rows.reduce(
    (sum, row) => sum + ((row.y0 + row.y1) * dx) / 2,
    0,
  );
  let weighted = fn(a) + fn(b);
  for (let index = 1; index < n; index += 1)
    weighted += (index % 2 ? 4 : 2) * fn(a + index * dx);
  return { dx, rows, midpoint, trapezoid, simpson: (weighted * dx) / 3 };
}

export default function NumericalIntegrationTargetLesson316({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [functionName, setFunctionName] = useState<FunctionName>("wave");
  const [intervalName, setIntervalName] = useState<IntervalName>("zero-pi");
  const [n, setN] = useState(8);
  const [visible, setVisible] = useState<Visibility>({
    midpoint: true,
    trapezoid: true,
    simpson: true,
  });
  const [tab, setTab] = useState("Interactive");
  const [answers, setAnswers] = useState(["", "", ""]);
  const [checked, setChecked] = useState(false);
  const [actions, setActions] = useState(0);
  const selectedFunction = FUNCTIONS[functionName];
  const interval = INTERVALS[intervalName];
  const model = useMemo(
    () => quadrature(selectedFunction.fn, interval.a, interval.b, n),
    [selectedFunction, interval, n],
  );
  const exact =
    selectedFunction.anti(interval.b) - selectedFunction.anti(interval.a);
  const errors = [model.midpoint, model.trapezoid, model.simpson].map((value) =>
    Math.abs(value - exact),
  );
  const practice = useMemo(() => quadrature(Math.sin, 0, Math.PI / 2, 6), []);
  const practiceExpected = [
    practice.midpoint,
    practice.trapezoid,
    practice.simpson,
  ];
  const correct = answers.map(
    (answer, index) =>
      Number.isFinite(Number(answer)) &&
      Math.abs(Number(answer) - practiceExpected[index]) < 0.0005,
  );
  const score = checked ? correct.filter(Boolean).length : 0;
  const reset = () => {
    setFunctionName("wave");
    setIntervalName("zero-pi");
    setN(8);
    setVisible({ midpoint: true, trapezoid: true, simpson: true });
    setTab("Interactive");
    setAnswers(["", "", ""]);
    setChecked(false);
    setActions(0);
  };
  useEffect(reset, [resetToken]);
  const act = (run: () => void) => {
    run();
    setActions((value) => value + 1);
    onInteraction();
  };
  const updateAnswer = (index: number, value: string) => {
    setAnswers((current) =>
      current.map((item, itemIndex) => (itemIndex === index ? value : item)),
    );
    setChecked(false);
  };
  return (
    <section
      className="ni316-page"
      data-testid="calculus-mockup-0395"
      data-dedicated-lesson="316"
      data-object-model="three-method-quadrature-generated-midpoint-trapezoid-simpson-overlays-exact-errors-draggable-partition-practice"
      data-function={functionName}
      data-interval={intervalName}
      data-n={n}
      data-dx={clean(model.dx)}
      data-midpoint={clean(model.midpoint)}
      data-trapezoid={clean(model.trapezoid)}
      data-simpson={clean(model.simpson)}
      data-exact={clean(exact)}
      data-midpoint-visible={visible.midpoint}
      data-trapezoid-visible={visible.trapezoid}
      data-simpson-visible={visible.simpson}
      data-tab={tab}
      data-checked={checked}
      data-score={score}
      data-actions={actions}
    >
      <header className="ni316-hero">
        <span>
          <b>CALCULUS</b>
          <b>INTEGRAL CALCULUS AND DIFFERENTIAL EQUATIONS</b>
        </span>
        <h1>Numerical Integration</h1>
        <p>Approximate integrals.</p>
        <div className="meta">
          <i>♙ Advanced</i>
          <i>ϟ Advanced Lab</i>
          <i>▣ Integral / ODE / CAS</i>
          <i>◷ 6-10 min</i>
        </div>
        <div className="actions">
          <select aria-label="Lesson language">
            <option>English (English)</option>
          </select>
          <button
            type="button"
            onClick={() => {
              reset();
              onInteraction();
            }}
          >
            <RotateCcw />
            Reset
          </button>
          <button
            type="button"
            onClick={() =>
              act(() => void navigator.clipboard?.writeText(location.href))
            }
          >
            <Share2 />
            Share
          </button>
          <button
            type="button"
            onClick={() =>
              act(() => document.documentElement.requestFullscreen?.())
            }
          >
            ↗ Workspace
          </button>
        </div>
      </header>
      <nav className="ni316-tabs">
        {["Interactive", "Explain", "Examples", "Formulas", "Know more"].map(
          (name) => (
            <button
              type="button"
              key={name}
              className={tab === name ? "active" : ""}
              onClick={() => act(() => setTab(name))}
            >
              {name}
            </button>
          ),
        )}
      </nav>
      <section className="ni316-idea">
        <h2>The idea in one view</h2>
        <div className="intro">
          <p>We want the area under a curve f(x) on [a,b].</p>
          <p>Split the interval into n equal parts:</p>
          <strong>Δx = (b − a)/n</strong>
          <p>and approximate the area using simple geometric shapes.</p>
        </div>
        <b className="arrow">→</b>
        <div className="method-row">
          <MiniMethod
            kind="midpoint"
            title="Midpoint Rule"
            text="Use the midpoint height of each subinterval."
          />
          <MiniMethod
            kind="trapezoid"
            title="Trapezoidal Rule"
            text="Connect endpoints to form trapezoids."
          />
          <MiniMethod
            kind="simpson"
            title="Simpson's Rule"
            text="Use parabolic arcs (quadratics) in pairs."
          />
        </div>
        <b className="arrow">→</b>
        <article className="goal">
          <h3>Goal</h3>
          <p>As n increases, all methods approach the exact integral.</p>
          <strong>∫ₐᵇ f(x) dx</strong>
        </article>
      </section>
      <section className="ni316-lab">
        <header>
          <div>
            <h2>Explore by comparing methods</h2>
            <p>Adjust n to see how each method approximates the integral.</p>
          </div>
          <span>
            <CheckCircle2 /> Immediate feedback
          </span>
        </header>
        <div className="ni316-controls">
          <label>
            Function f(x)
            <select
              aria-label="Numerical integration function"
              value={functionName}
              onChange={(event) =>
                act(() => setFunctionName(event.target.value as FunctionName))
              }
            >
              {Object.entries(FUNCTIONS).map(([value, item]) => (
                <option key={value} value={value}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>
          <label>
            Interval [a,b]
            <select
              aria-label="Numerical integration interval"
              value={intervalName}
              onChange={(event) =>
                act(() => setIntervalName(event.target.value as IntervalName))
              }
            >
              {Object.entries(INTERVALS).map(([value, item]) => (
                <option key={value} value={value}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>
          <label>
            Subintervals n
            <input
              aria-label="Numerical integration subintervals"
              type="range"
              min="2"
              max="64"
              step="2"
              value={n}
              onChange={(event) =>
                act(() => setN(clampEven(Number(event.target.value))))
              }
            />
            <output>{n}</output>
          </label>
          <div>
            <strong>
              Δx = {(model.dx / Math.PI).toFixed(3)}π ≈ {model.dx.toFixed(4)}
            </strong>
            <small>Units: area (square units)</small>
          </div>
        </div>
        <main>
          <NumericalGraph
            model={model}
            fn={selectedFunction.fn}
            a={interval.a}
            b={interval.b}
            visible={visible}
            onN={(value) => act(() => setN(value))}
          />
          <aside>
            <h3>Approximations and error</h3>
            <table>
              <thead>
                <tr>
                  <th>Method</th>
                  <th>Estimate</th>
                  <th>Absolute Error</th>
                  <th>Order</th>
                </tr>
              </thead>
              <tbody>
                <MethodRow
                  color="#16b3b3"
                  label="Midpoint Rule"
                  value={model.midpoint}
                  error={errors[0]}
                  order="O(Δx²)"
                />
                <MethodRow
                  color="#398be5"
                  label="Trapezoidal Rule"
                  value={model.trapezoid}
                  error={errors[1]}
                  order="O(Δx²)"
                />
                <MethodRow
                  color="#8950da"
                  label="Simpson's Rule"
                  value={model.simpson}
                  error={errors[2]}
                  order="O(Δx⁴)"
                />
                <tr>
                  <th>Exact (reference)</th>
                  <td>{exact.toFixed(9)}</td>
                  <td>—</td>
                  <td>—</td>
                </tr>
              </tbody>
            </table>
            <p className="converge">
              <CheckCircle2 /> All methods converge as n increases.
              <br />
              <b>Simpson's Rule is most accurate for smooth functions.</b>
            </p>
          </aside>
        </main>
        <footer>
          {(["midpoint", "trapezoid", "simpson"] as const).map((kind) => (
            <button
              type="button"
              key={kind}
              className={visible[kind] ? "shown" : ""}
              onClick={() =>
                act(() =>
                  setVisible((current) => ({
                    ...current,
                    [kind]: !current[kind],
                  })),
                )
              }
            >
              <i className={kind} />
              {kind === "simpson"
                ? "Simpson's"
                : kind[0].toUpperCase() + kind.slice(1)}
            </button>
          ))}
          <span>f(x)</span>
        </footer>
      </section>
      <section className="ni316-flow">
        {[
          [
            Eye,
            "OBSERVE",
            "Watch how the shapes approximate the area. What do you see?",
          ],
          [
            Hand,
            "MANIPULATE",
            "Change n and compare the estimates and errors.",
          ],
          [
            Lightbulb,
            "NOTICE",
            "As n increases, errors shrink. Simpson's Rule converges fastest.",
          ],
          [
            Target,
            "UNDERSTAND",
            "Numerical integration replaces curves by shapes; more subintervals means better accuracy.",
          ],
        ].map(([Icon, title, text], index) => (
          <article key={String(title)}>
            <Icon />
            <div>
              <h3>{String(title)}</h3>
              <p>{String(text)}</p>
            </div>
            {index < 3 && <b>→</b>}
          </article>
        ))}
      </section>
      <section className="ni316-formulas">
        <h3>Formulas / Rules</h3>
        <div>
          <article>
            <b>Midpoint Rule</b>
            <strong>Mₙ = Σ f(mᵢ) Δx</strong>
            <small>mᵢ=(xᵢ₋₁+xᵢ)/2</small>
          </article>
          <article>
            <b>Trapezoidal Rule</b>
            <strong>Tₙ = Δx/2 [f(x₀)+2Σf(xᵢ)+f(xₙ)]</strong>
            <small>xᵢ=a+iΔx</small>
          </article>
          <article>
            <b>
              Simpson's Rule <i>(n even)</i>
            </b>
            <strong>Sₙ = Δx/3 [f(x₀)+4Σf(x odd)+2Σf(x even)+f(xₙ)]</strong>
            <small>Δx=(b−a)/n</small>
          </article>
        </div>
      </section>
      <section className="ni316-worked">
        <article>
          <h3>Worked Example</h3>
          <p>
            Take f(x)=x² on [0,1] with n=4. Exact integral = 1/3 ≈ 0.333333.
          </p>
          <table>
            <tbody>
              <tr>
                <th>Method</th>
                <th>Estimate</th>
              </tr>
              <tr>
                <td>Midpoint Rule</td>
                <td>5/16 = 0.3125</td>
              </tr>
              <tr>
                <td>Trapezoidal Rule</td>
                <td>11/32 = 0.34375</td>
              </tr>
              <tr>
                <td>Simpson's Rule</td>
                <td>1/3 = 0.333333 (exact)</td>
              </tr>
            </tbody>
          </table>
        </article>
        <WorkedGraph />
        <article className="misconception">
          <h3>⚠ Common Misconception</h3>
          <b>“More subintervals always guarantee perfect accuracy.”</b>
          <p>
            Not true: rounding and finite precision cause limits, while
            non-smooth functions can converge slowly.
          </p>
          <strong>
            ♧ Tip: Double n and compare. If the change is small, your result is
            likely reliable.
          </strong>
        </article>
      </section>
      <section className="ni316-practice">
        <div>
          <h3>Practice Challenge</h3>
          <p>
            Estimate ∫₀<sup>π/2</sup> sin(x) dx using all three methods with
            n=6.
          </p>
        </div>
        {["Midpoint", "Trapezoidal", "Simpson's"].map((label, index) => (
          <label
            key={label}
            className={
              checked ? (correct[index] ? "correct" : "incorrect") : ""
            }
          >
            {label}
            <input
              aria-label={`Numerical practice ${label}`}
              value={answers[index]}
              placeholder="Enter value"
              onChange={(event) => updateAnswer(index, event.target.value)}
            />
          </label>
        ))}
        <button type="button" onClick={() => act(() => setChecked(true))}>
          Check Answer
        </button>
        <article>
          <b>Exact value</b>
          <strong>
            ∫₀<sup>π/2</sup> sin(x) dx = 1
          </strong>
        </article>
        <article className="progress">
          <b>Your progress</b>
          <strong>{score}/3</strong>
          <small>correct</small>
        </article>
      </section>
      <nav className="ni316-adjacent">
        <a href="/lessons/calculus/315-improper-integrals">
          ←{" "}
          <span>
            <small>Previous</small>Improper Integrals
          </span>
        </a>
        <a href="/lessons/calculus/317-volume-by-slicing">
          <span>
            <small>Next</small>Volume by Slicing
          </span>{" "}
          →
        </a>
      </nav>
    </section>
  );
}

function MiniMethod({
  kind,
  title,
  text,
}: {
  kind: string;
  title: string;
  text: string;
}) {
  return (
    <article>
      <h3>{title}</h3>
      <p>{text}</p>
      <svg viewBox="0 0 100 55">
        <path d="M5 48 Q25 8 50 18 T95 48" className="curve" />
        <path
          d={
            kind === "midpoint"
              ? "M10 48V30H28V48M32 48V18H50V48M54 48V23H72V48M76 48V36H94V48"
              : kind === "trapezoid"
                ? "M10 48L10 32L30 18L30 48M34 48L34 18L54 22L54 48M58 48L58 22L78 38L78 48"
                : "M8 48Q28 10 48 20T92 48"
          }
          className={kind}
        />
      </svg>
    </article>
  );
}
function MethodRow({
  color,
  label,
  value,
  error,
  order,
}: {
  color: string;
  label: string;
  value: number;
  error: number;
  order: string;
}) {
  return (
    <tr>
      <th>
        <i style={{ background: color }} />
        {label}
      </th>
      <td>{value.toFixed(6)}</td>
      <td>{error.toExponential(2)}</td>
      <td>{order}</td>
    </tr>
  );
}

function NumericalGraph({
  model,
  fn,
  a,
  b,
  visible,
  onN,
}: {
  model: ReturnType<typeof quadrature>;
  fn: (x: number) => number;
  a: number;
  b: number;
  visible: Visibility;
  onN: (n: number) => void;
}) {
  const w = 480,
    h = 255,
    pad = 34,
    samples = Array.from({ length: 241 }, (_, i) => {
      const x = a + ((b - a) * i) / 240;
      return [x, fn(x)] as const;
    }),
    ys = samples.map(([, y]) => y),
    yMin = Math.min(0, ...ys),
    yMax = Math.max(...ys),
    span = yMax - yMin || 1;
  const sx = (x: number) => pad + ((x - a) / (b - a)) * (w - 2 * pad),
    sy = (y: number) => h - pad - ((y - yMin) / span) * (h - 2 * pad),
    curve = samples
      .map(([x, y], i) => `${i ? "L" : "M"}${sx(x)},${sy(y)}`)
      .join(" ");
  const drag = (event: ReactPointerEvent<SVGCircleElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    const box = event.currentTarget.ownerSVGElement?.getBoundingClientRect();
    if (!box) return;
    const move = (pointer: PointerEvent) => {
      const x =
        a +
        Math.max(
          0.02,
          Math.min(0.49, (pointer.clientX - box.left) / box.width),
        ) *
          (b - a);
      onN(clampEven((b - a) / (x - a)));
    };
    const up = () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  };
  return (
    <svg
      className="ni316-graph"
      viewBox={`0 0 ${w} ${h}`}
      aria-label="Numerical integration comparison graph"
    >
      <defs>
        <pattern
          id="ni316-grid"
          width="52"
          height="38"
          patternUnits="userSpaceOnUse"
        >
          <path d="M52 0H0V38" fill="none" stroke="#e7edf3" />
        </pattern>
      </defs>
      <rect width={w} height={h} fill="url(#ni316-grid)" />
      {visible.midpoint &&
        model.rows.map((row, index) => (
          <rect
            key={`m${index}`}
            x={sx(row.x0)}
            y={sy(Math.max(0, row.ym))}
            width={sx(row.x1) - sx(row.x0)}
            height={Math.abs(sy(row.ym) - sy(0))}
            className="midpoint-shape"
          />
        ))}
      {visible.trapezoid &&
        model.rows.map((row, index) => (
          <path
            key={`t${index}`}
            d={`M${sx(row.x0)},${sy(0)}L${sx(row.x0)},${sy(row.y0)}L${sx(row.x1)},${sy(row.y1)}L${sx(row.x1)},${sy(0)}Z`}
            className="trapezoid-shape"
          />
        ))}
      {visible.simpson &&
        Array.from({ length: model.rows.length / 2 }, (_, index) => {
          const left = model.rows[index * 2],
            right = model.rows[index * 2 + 1];
          return (
            <path
              key={`s${index}`}
              d={`M${sx(left.x0)},${sy(left.y0)}Q${sx(left.mid)},${sy(left.ym)} ${sx(left.x1)},${sy(left.y1)}Q${sx(right.mid)},${sy(right.ym)} ${sx(right.x1)},${sy(right.y1)}`}
              className="simpson-shape"
            />
          );
        })}
      <line x1={pad} x2={w - pad} y1={sy(0)} y2={sy(0)} className="axis" />
      <line x1={sx(a)} x2={sx(a)} y1={10} y2={h - pad} className="axis" />
      <path d={curve} className="curve" />
      {model.rows.map((row, index) => (
        <circle
          key={index}
          cx={sx(row.mid)}
          cy={sy(row.ym)}
          r="3.5"
          className="sample"
        />
      ))}
      <circle
        data-drag="numerical-partition"
        cx={sx(model.rows[0].x1)}
        cy={sy(model.rows[0].y1)}
        r="7"
        onPointerDown={drag}
        className="drag"
      />
      <text x={sx(a) + 8} y={h - 8}>
        a
      </text>
      <text x={sx(b) - 8} y={h - 8}>
        b
      </text>
    </svg>
  );
}
function WorkedGraph() {
  return (
    <svg className="ni316-worked-graph" viewBox="0 0 180 125">
      <line x1="20" y1="108" x2="170" y2="108" />
      <line x1="20" y1="108" x2="20" y2="10" />
      <path d="M20 108Q100 108 165 15" />
      <path d="M20 108L55 100L90 82L127 54L165 15" className="trap" />
      {[55, 90, 127].map((x, index) => (
        <circle key={x} cx={x} cy={[100, 82, 54][index]} r="4" />
      ))}
    </svg>
  );
}
