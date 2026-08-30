import {
  CheckCircle2,
  Eye,
  Hand,
  Lightbulb,
  Maximize2,
  RotateCcw,
  Share2,
} from "lucide-react";
import {
  useEffect,
  useMemo,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import type { LessonAdapterProps } from "../../types";
import "./NewtonMethodTargetLesson304.css";

const fn = (x: number) => x ** 3 - x - 2,
  df = (x: number) => 3 * x * x - 1,
  root = 1.5213797068;
const clean = (n: number, p = 6) =>
  Math.abs(n) < 1e-10 ? 0 : Number(n.toFixed(p));
const iterate = (start: number, count: number, func = fn, derivative = df) => {
  const values = [start];
  for (let i = 0; i < count; i++) {
    const x = values.at(-1) ?? start,
      d = derivative(x);
    if (Math.abs(d) < 1e-8) break;
    values.push(x - func(x) / d);
  }
  return values;
};

export default function NewtonMethodTargetLesson304({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [x0, setX0] = useState(-0.7),
    [count, setCount] = useState(6),
    [showTangent, setShowTangent] = useState(true),
    [showIterates, setShowIterates] = useState(true),
    [tab, setTab] = useState("Interaction + visualization"),
    [answers, setAnswers] = useState(["1.347826", "1.324718", "1.324718"]),
    [result, setResult] = useState<"" | "correct" | "incorrect">(""),
    [solution, setSolution] = useState(false),
    [actions, setActions] = useState(0);
  const values = useMemo(() => iterate(x0, count), [x0, count]),
    last = values.at(-1) ?? x0,
    error = Math.abs(last - root),
    converged = Math.abs(fn(last)) < 1e-5;
  const reset = () => {
    setX0(-0.7);
    setCount(6);
    setShowTangent(true);
    setShowIterates(true);
    setTab("Interaction + visualization");
    setAnswers(["1.347826", "1.324718", "1.324718"]);
    setResult("");
    setSolution(false);
    setActions(0);
  };
  const act = (run: () => void) => {
    run();
    setActions((n) => n + 1);
    onInteraction();
  };
  useEffect(reset, [resetToken]);
  const check = () =>
    act(() =>
      setResult(
        answers.every(
          (value, i) =>
            Math.abs(Number(value) - [1.347826, 1.3252, 1.324718][i]) < 0.001,
        )
          ? "correct"
          : "incorrect",
      ),
    );
  return (
    <section
      className="new304-page"
      data-testid="calculus-mockup-0383"
      data-dedicated-lesson="304"
      data-object-model="cubic-newton-iteration-direct-initial-guess-drag-tangent-iterate-table-convergence-residual-three-step-practice"
      data-x0={x0}
      data-count={count}
      data-last={clean(last)}
      data-residual={clean(fn(last))}
      data-error={clean(error)}
      data-converged={converged}
      data-tangent={showTangent}
      data-iterates={showIterates}
      data-result={result}
      data-solution={solution}
      data-actions={actions}
    >
      <header className="new304-hero">
        <section>
          <span>
            <b>CALCULUS</b>
            <b>LIMITS AND DIFFERENTIAL CALCULUS</b>
          </span>
          <h1>Newton's Method</h1>
          <p>Approximate roots iteratively.</p>
          <div className="meta">
            <i>♙ Advanced</i>
            <i>ϟ Calculus Lab</i>
            <i>▣ Derivative / Limit / CAS</i>
            <i>◴ 6-10 min</i>
          </div>
          <div className="actions">
            <button>English (English)⌄</button>
            <button onClick={() => act(reset)}>
              <RotateCcw />
              Reset
            </button>
            <button
              onClick={() =>
                act(() =>
                  navigator.clipboard?.writeText(`root ≈ ${clean(last)}`),
                )
              }
            >
              <Share2 />
              Share
            </button>
            <a href="/workspace/calculus">↗ Workspace</a>
          </div>
        </section>
        <aside>
          <h3>The Newton update (tangent method)</h3>
          <strong>xₙ₊₁ = xₙ - f(xₙ)/f'(xₙ)</strong>
          <p>
            From the tangent at (xₙ,f(xₙ)), find where it meets the x-axis. That
            x-intercept is the next iterate xₙ₊₁.
          </p>
        </aside>
      </header>
      <nav className="new304-tabs">
        {[
          "Interaction + visualization",
          "Learn",
          "Examples",
          "Formula",
          "Misconceptions",
          "Practice",
        ].map((name) => (
          <button
            key={name}
            className={tab === name ? "active" : ""}
            onClick={() => act(() => setTab(name))}
          >
            {name}
          </button>
        ))}
      </nav>
      <section className="new304-lab">
        <header>
          <small>OBSERVE → MANIPULATE → NOTICE → UNDERSTAND</small>
          <h2>Work directly on the model</h2>
          <b className={actions ? "active" : ""}>
            {actions ? "Model updated" : "Awaiting interaction"}
          </b>
          <output>{actions} actions</output>
          <button>
            <Maximize2 />
          </button>
        </header>
        <h3>Function f(x)=x³-x-2</h3>
        <main>
          <section className="graph-panel">
            <NewtonGraph
              x0={x0}
              values={values}
              showTangent={showTangent}
              showIterates={showIterates}
              onX0={(value) => act(() => setX0(value))}
            />
            <div className="legend">
              <span>━ f(x)</span>
              <span>━ Tangent at (x₀,f(x₀))</span>
              <span>○ Root (r)</span>
              <span>○ Iterates (xₙ)</span>
            </div>
            <div className="feedback">
              <b>
                <CheckCircle2 />{" "}
                {converged
                  ? "Good! You are converging to the root."
                  : "Continue iterating."}
              </b>
              <p>Current error |xₙ-r| = {error.toExponential(2)}</p>
            </div>
            <div className="meter">
              <b>Convergence</b>
              <span>▰▰▰▰▰▰</span> Quadratic (fast)
            </div>
          </section>
          <aside className="controls">
            <label>
              Initial guess x₀
              <input
                aria-label="Newton initial guess"
                type="range"
                min="-3"
                max="3"
                step=".05"
                value={x0}
                onChange={(e) => act(() => setX0(Number(e.target.value)))}
              />
              <small>-3 to 3</small>
              <output>{x0.toFixed(2)}</output>
            </label>
            <label>
              Iterations to show
              <input
                aria-label="Newton iterations"
                type="range"
                min="1"
                max="10"
                step="1"
                value={count}
                onChange={(e) => act(() => setCount(Number(e.target.value)))}
              />
              <small>1 to 10</small>
              <output>{count}</output>
            </label>
            <label className="toggle">
              Show tangent line
              <input
                type="checkbox"
                checked={showTangent}
                onChange={() => act(() => setShowTangent((v) => !v))}
              />
            </label>
            <label className="toggle">
              Show iterates
              <input
                type="checkbox"
                checked={showIterates}
                onChange={() => act(() => setShowIterates((v) => !v))}
              />
            </label>
            <h3>Iterates table</h3>
            <table>
              <thead>
                <tr>
                  <th>n</th>
                  <th>xₙ</th>
                  <th>f(xₙ)</th>
                </tr>
              </thead>
              <tbody>
                {values.map((x, i) => (
                  <tr key={i}>
                    <td>{i}</td>
                    <td>{x.toFixed(6)}</td>
                    <td>{fn(x).toFixed(6)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <output className="root">
              Root (approx.) r ≈ {last.toFixed(6)}
            </output>
          </aside>
        </main>
        <section className="facts">
          <span>
            Domain<b>R</b>
          </span>
          <span>
            Sign
            <b>
              (-∞,{root.toFixed(3)}): -<br />({root.toFixed(3)},∞): +
            </b>
          </span>
          <span>
            Derivative<b>f'(x)=3x²-1</b>
          </span>
          <span>
            Local behavior<b>Decreases → root → increases</b>
          </span>
          <span>
            Rule used<b>xₙ₊₁=xₙ-f(xₙ)/f'(xₙ)</b>
          </span>
        </section>
      </section>
      <section className="new304-flow">
        {[
          {
            Icon: Eye,
            title: "1 Observe",
            text: "We start with a guess x₀. Draw the tangent and note where it crosses the x-axis.",
          },
          {
            Icon: Hand,
            title: "2 Manipulate",
            text: "Drag x₀ and vary iterations. Watch the sequence move toward the root.",
          },
          {
            Icon: Lightbulb,
            title: "3 Notice",
            text: "Close to the root, convergence is very fast. Far guesses may take longer.",
          },
          {
            Icon: CheckCircle2,
            title: "4 Understand",
            text: "Newton's Method uses the derivative to jump to better approximations.",
          },
        ].map(({ Icon, title, text }) => (
          <article key={title}>
            <Icon />
            <h3>{title}</h3>
            <p>{text}</p>
          </article>
        ))}
      </section>
      <section className="new304-info">
        <article>
          <h3>Worked example</h3>
          <p>Find a root of f(x)=x³-x-2 with x₀=-0.70.</p>
          <table>
            <tbody>
              {iterate(-0.7, 3).map((x, i) => (
                <tr key={i}>
                  <td>{i}</td>
                  <td>{x.toFixed(6)}</td>
                  <td>{fn(x).toFixed(6)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p>
            Root approximation after 3 iterations: x₃=
            {iterate(-0.7, 3).at(-1)?.toFixed(6)}
          </p>
        </article>
        <article>
          <h3>⚠ Misconception warning</h3>
          <b>Newton's Method can fail!</b>
          <p>
            If f'(xₙ)=0 (or very close), the update formula breaks down or
            produces huge jumps.
          </p>
          <MiniFailure />
          <output>
            Tip: Avoid points where the tangent is nearly horizontal.
          </output>
        </article>
        <article>
          <h3>
            Practice challenge <small>Quick check</small>
          </h3>
          <p>
            Use Newton's Method on f(x)=x³-x-1 with x₀=1.5. Perform 3
            iterations.
          </p>
          {answers.map((value, i) => (
            <label key={i}>
              x{i + 1}=
              <input
                aria-label={`Newton practice x${i + 1}`}
                value={value}
                onChange={(e) => {
                  setAnswers((v) =>
                    v.map((x, j) => (j === i ? e.target.value : x)),
                  );
                  setResult("");
                }}
              />
            </label>
          ))}
          <button onClick={check}>Check answers</button>
          <button onClick={() => act(() => setSolution((v) => !v))}>
            Show solution
          </button>
          <output className={result}>
            {result === "correct"
              ? "Correct: converges to 1.324718."
              : result === "incorrect"
                ? "Reapply x-f(x)/f'(x)."
                : solution
                  ? "x₁=1.347826, x₂=1.325200, x₃=1.324718"
                  : ""}
          </output>
        </article>
      </section>
      <nav className="new304-adjacent">
        <a href="/lessons/calculus/303-motion-analysis">
          ←{" "}
          <span>
            <small>Previous</small>Motion Analysis
          </span>
        </a>
        <a href="/lessons/calculus/305-taylor-polynomial">
          <span>
            <small>Next</small>Taylor Polynomial
          </span>{" "}
          →
        </a>
      </nav>
    </section>
  );
}

function NewtonGraph({
  x0,
  values,
  showTangent,
  showIterates,
  onX0,
}: {
  x0: number;
  values: number[];
  showTangent: boolean;
  showIterates: boolean;
  onX0: (x: number) => void;
}) {
  const w = 530,
    h = 400,
    sx = (x: number) => 270 + x * 58,
    sy = (y: number) => 205 - y * 18,
    path = Array.from({ length: 241 }, (_, i) => {
      const x = -3 + i * 0.025;
      return `${i ? "L" : "M"}${sx(x)} ${sy(fn(x))}`;
    }).join(" "),
    m = df(x0),
    b = fn(x0),
    next = x0 - b / m,
    drag = (e: ReactPointerEvent<SVGCircleElement>) => {
      if (e.buttons !== 1 && e.type === "pointermove") return;
      if (e.type === "pointerdown")
        e.currentTarget.setPointerCapture(e.pointerId);
      const r = e.currentTarget.ownerSVGElement?.getBoundingClientRect();
      if (r)
        onX0(
          Math.max(
            -3,
            Math.min(3, (((e.clientX - r.left) / r.width) * w - 270) / 58),
          ),
        );
    };
  return (
    <svg className="new304-graph" viewBox={`0 0 ${w} ${h}`}>
      <defs>
        <pattern
          id="new-grid"
          width="58"
          height="36"
          patternUnits="userSpaceOnUse"
        >
          <path d="M58 0H0V36" fill="none" stroke="#e7ecf2" />
        </pattern>
      </defs>
      <rect width={w} height={h} fill="url(#new-grid)" />
      <line className="axis" x1="0" x2={w} y1={sy(0)} y2={sy(0)} />
      <line className="axis" x1={sx(0)} x2={sx(0)} y1="0" y2={h} />
      <path className="curve" d={path} />
      {showTangent && (
        <>
          <line
            className="tangent"
            x1={sx(x0 - 2)}
            y1={sy(b - 2 * m)}
            x2={sx(x0 + 2)}
            y2={sy(b + 2 * m)}
          />
          <line
            className="guide"
            x1={sx(next)}
            x2={sx(next)}
            y1={sy(0)}
            y2={sy(fn(next))}
          />
        </>
      )}
      <circle className="root-point" cx={sx(root)} cy={sy(0)} r="5" />
      <text x={sx(root) - 10} y={sy(0) + 20}>
        r ≈ {root.toFixed(5)}
      </text>
      {showIterates &&
        values.map((x, i) => (
          <circle
            className="iterate"
            key={i}
            cx={sx(x)}
            cy={sy(0)}
            r={i ? 4 : 7}
          />
        ))}
      <circle
        data-drag="newton-initial"
        className="initial"
        cx={sx(x0)}
        cy={sy(fn(x0))}
        r="8"
        onPointerDown={drag}
        onPointerMove={drag}
      />
      <text x={sx(x0) - 95} y={sy(fn(x0)) + 38}>
        Drag x₀ (initial guess)
      </text>
    </svg>
  );
}
function MiniFailure() {
  return (
    <svg viewBox="0 0 180 60">
      <path d="M5 48Q50-20 95 43T175 8" fill="none" stroke="#176ee3" />
      <line x1="93" x2="160" y1="39" y2="10" stroke="#e45b5b" />
      <line
        x1="160"
        x2="160"
        y1="10"
        y2="52"
        stroke="#7b45df"
        strokeDasharray="3 3"
      />
    </svg>
  );
}
