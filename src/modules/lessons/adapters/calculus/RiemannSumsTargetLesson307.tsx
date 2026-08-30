import {
  BookOpen,
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
import "./RiemannSumsTargetLesson307.css";

type SampleMode = "left" | "midpoint" | "right" | "custom";
const a = -Math.PI,
  b = Math.PI,
  fn = (x: number) => Math.cos(x) + 2,
  exact = 4 * Math.PI,
  clean = (n: number, p = 6) =>
    Math.abs(n) < 1e-10 ? 0 : Number(n.toFixed(p));
const alphaFor = (mode: SampleMode, custom: number) =>
  mode === "left"
    ? 0
    : mode === "midpoint"
      ? 0.5
      : mode === "right"
        ? 1
        : custom;
function riemann(n: number, mode: SampleMode, custom: number) {
  const dx = (b - a) / n,
    alpha = alphaFor(mode, custom);
  let sum = 0;
  const rows = Array.from({ length: n }, (_, i) => {
    const x0 = a + i * dx,
      x1 = x0 + dx,
      sample = x0 + alpha * dx,
      height = fn(sample);
    sum += height * dx;
    return { x0, x1, sample, height };
  });
  return { dx, alpha, sum, rows, error: Math.abs(sum - exact) };
}

export default function RiemannSumsTargetLesson307({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [n, setN] = useState(8),
    [mode, setMode] = useState<SampleMode>("left"),
    [custom, setCustom] = useState(0),
    [showRectangles, setShowRectangles] = useState(true),
    [tab, setTab] = useState("Interact"),
    [sumAnswer, setSumAnswer] = useState(""),
    [exactAnswer, setExactAnswer] = useState(""),
    [result, setResult] = useState<"" | "correct" | "incorrect">(""),
    [steps, setSteps] = useState(false),
    [actions, setActions] = useState(0);
  const model = useMemo(() => riemann(n, mode, custom), [n, mode, custom]);
  const reset = () => {
    setN(8);
    setMode("left");
    setCustom(0);
    setShowRectangles(true);
    setTab("Interact");
    setSumAnswer("");
    setExactAnswer("");
    setResult("");
    setSteps(false);
    setActions(0);
  };
  const act = (run: () => void) => {
    run();
    setActions((v) => v + 1);
    onInteraction();
  };
  useEffect(reset, [resetToken]);
  const setNamedMode = (value: SampleMode) =>
      act(() => {
        setMode(value);
        if (value !== "custom") setCustom(alphaFor(value, custom));
      }),
    setSampleAlpha = (value: number) =>
      act(() => {
        const alpha = Math.max(0, Math.min(1, value));
        setCustom(alpha);
        setMode(
          alpha < 0.17
            ? "left"
            : alpha > 0.83
              ? "right"
              : Math.abs(alpha - 0.5) < 0.17
                ? "midpoint"
                : "custom",
        );
      }),
    setBoundary = (x: number) =>
      act(() =>
        setN(
          Math.max(
            2,
            Math.min(24, Math.round((b - a) / Math.max(0.05, x - a))),
          ),
        ),
      ),
    check = () =>
      act(() =>
        setResult(
          Math.abs(Number(sumAnswer) - 0.328125) < 1e-6 &&
            Math.abs(Number(exactAnswer) - 1 / 3) < 1e-5
            ? "correct"
            : "incorrect",
        ),
      );
  return (
    <section
      className="rie307-page"
      data-testid="calculus-mockup-0386"
      data-dedicated-lesson="307"
      data-object-model="cosine-plus-two-uniform-partition-draggable-boundary-and-sample-left-midpoint-right-sum-exact-error-convergence-practice"
      data-n={n}
      data-mode={mode}
      data-alpha={clean(model.alpha)}
      data-sum={clean(model.sum)}
      data-exact={clean(exact)}
      data-error={clean(model.error)}
      data-percent={clean((model.error / exact) * 100)}
      data-rectangles={showRectangles}
      data-result={result}
      data-steps={steps}
      data-actions={actions}
    >
      <header className="rie307-hero">
        <span>
          <b>CALCULUS</b>
          <b>INTEGRAL CALCULUS AND DIFFERENTIAL EQUATIONS</b>
        </span>
        <h1>Riemann Sums</h1>
        <p>Understand convergence of area estimates.</p>
        <div className="meta">
          <i>♙ Advanced</i>
          <i>ϟ Advanced Lab</i>
          <i>▣ Integral / ODE / CAS</i>
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
                navigator.clipboard?.writeText(
                  `${mode} sum=${clean(model.sum)}`,
                ),
              )
            }
          >
            <Share2 />
            Share
          </button>
          <a href="/workspace/calculus">↗ Workspace</a>
        </div>
      </header>
      <nav className="rie307-tabs">
        {[
          ["Interact", "Build & explore"],
          ["Explain", "Rules & theory"],
          ["Examples", "Worked example"],
          ["Practice", "Your turn"],
          ["Know more", "Deepen learning"],
        ].map(([name, sub]) => (
          <button
            key={name}
            className={tab === name ? "active" : ""}
            onClick={() => act(() => setTab(name))}
          >
            <b>{name}</b>
            <small>{sub}</small>
          </button>
        ))}
      </nav>
      <section className="rie307-flow">
        {[
          {
            Icon: Eye,
            title: "1 OBSERVE",
            text: "See how rectangles estimate area.",
          },
          {
            Icon: Hand,
            title: "2 MANIPULATE",
            text: "Drag boundaries and samples to change the sum.",
          },
          {
            Icon: Lightbulb,
            title: "3 NOTICE",
            text: "Watch the sum approach the exact area.",
          },
          {
            Icon: BookOpen,
            title: "4 UNDERSTAND",
            text: "Connect actions to the integral rule.",
          },
        ].map(({ Icon, title, text }) => (
          <article key={title}>
            <Icon />
            <div>
              <h3>{title}</h3>
              <p>{text}</p>
            </div>
          </article>
        ))}
      </section>
      <section className="rie307-lab">
        <header>
          <h2>Work directly on the model</h2>
          <b>Interactive mode</b>
          <button>Tutorial</button>
          <button>
            <Maximize2 />
          </button>
        </header>
        <main>
          <section className="graph-panel">
            <header>
              <span>
                Function<b>f(x)=cos(x)+2</b>
              </span>
              <span>
                Interval<b>[a,b]=[-π,π]</b>
              </span>
              <span>n={n}</span>
              <span>{mode} sum</span>
            </header>
            <RiemannGraph
              rows={model.rows}
              showRectangles={showRectangles}
              onBoundary={setBoundary}
              onAlpha={setSampleAlpha}
            />
            <p>
              Drag partition boundary (dashed line) to change n. Drag blue dots
              within each subinterval.
            </p>
            <footer>
              <label>
                Partitions (n)
                <input
                  aria-label="Riemann partition count"
                  type="range"
                  min="2"
                  max="24"
                  step="1"
                  value={n}
                  onChange={(e) => act(() => setN(Number(e.target.value)))}
                />
              </label>
              <label>
                Sample point
                <select
                  aria-label="Riemann sample point"
                  value={mode}
                  onChange={(e) => setNamedMode(e.target.value as SampleMode)}
                >
                  <option value="left">Left</option>
                  <option value="midpoint">Midpoint</option>
                  <option value="right">Right</option>
                  {mode === "custom" && <option value="custom">Custom</option>}
                </select>
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={showRectangles}
                  onChange={() => act(() => setShowRectangles((v) => !v))}
                />{" "}
                Show rectangles
              </label>
            </footer>
          </section>
          <aside>
            <h3>Riemann Sum ({mode})</h3>
            <strong>Sₙ=Σf(xᵢ*)Δx</strong>
            <h3>Numerical value</h3>
            <output>
              S{n}={model.sum.toFixed(5)}
            </output>
            <h3>Exact integral</h3>
            <strong>
              I=∫₋π^π(cos x+2)dx=4π
              <br />≈{exact.toFixed(5)}
            </strong>
            <h3>Error</h3>
            <output>
              |Sₙ-I|={model.error.toFixed(5)}
              <small>({((model.error / exact) * 100).toFixed(2)}%)</small>
            </output>
          </aside>
        </main>
        <section className="convergence">
          <b>Convergence insight</b>
          <p>
            As n increases, the Riemann sum converges to the exact integral.
          </p>
          <span>Try increasing n to see the error decrease.</span>
        </section>
      </section>
      <section className="rie307-rule">
        <article>
          <h3>Rule (What's happening?)</h3>
          <p>If f is integrable on [a,b], then as the partition gets finer:</p>
          <strong>lim Σf(xᵢ*)Δx = ∫ₐᵇ f(x)dx</strong>
          <p>where xᵢ*∈[xᵢ₋₁,xᵢ] and Δx=(b-a)/n.</p>
        </article>
        <article>
          <h3>⚠ Common misconception</h3>
          <p>
            Using only one rectangle per subinterval does not give the exact
            area unless f is constant on each subinterval.
          </p>
          <p>The estimate improves as n increases.</p>
        </article>
      </section>
      <section className="rie307-worked">
        <h3>Example (Worked)</h3>
        <p>Evaluate ∫₀^π(1+sin x)dx using a left Riemann sum with n=4.</p>
        <div>
          <span>
            Δx=π/4
            <br />
            Left endpoints: 0,π/4,π/2,3π/4
          </span>
          <strong>L₄=π/4[1+(1+√2/2)+2+(1+√2/2)]</strong>
          <span>Exact: ∫₀^π(1+sin x)dx=π+2</span>
        </div>
      </section>
      <section className="rie307-practice">
        <header>
          <h3>Quick Practice</h3>
          <p>Check your understanding.</p>
        </header>
        <main>
          <p>
            Let f(x)=x² on [0,1]. Use a midpoint Riemann sum with n=4. Compute
            M₄ and compare with the exact integral.
          </p>
          <label>
            Your answer for M₄
            <input
              aria-label="Riemann practice sum"
              value={sumAnswer}
              onChange={(e) => {
                setSumAnswer(e.target.value);
                setResult("");
              }}
            />
          </label>
          <label>
            Exact integral
            <input
              aria-label="Riemann practice exact"
              value={exactAnswer}
              onChange={(e) => {
                setExactAnswer(e.target.value);
                setResult("");
              }}
            />
          </label>
          <button onClick={check}>Check answer</button>
          <button onClick={() => act(() => setSteps((v) => !v))}>
            {steps ? "Hide" : "Show"} steps
          </button>
          <output className={result}>
            {result === "correct"
              ? "Correct: M₄=0.328125 and exact=1/3."
              : result === "incorrect"
                ? "Use midpoints 1/8,3/8,5/8,7/8."
                : steps
                  ? "M₄=(1/4)Σ(midpoint)²."
                  : ""}
          </output>
        </main>
        <footer>Hint: Midpoints are 1/8, 3/8, 5/8, 7/8.</footer>
      </section>
      <nav className="rie307-adjacent">
        <a href="/lessons/calculus/306-area-by-rectangles">
          ←{" "}
          <span>
            <small>Previous</small>Area by Rectangles
          </span>
        </a>
        <a href="/lessons/calculus/308-definite-integral">
          <span>
            <small>Next</small>Definite Integral
          </span>{" "}
          →
        </a>
      </nav>
    </section>
  );
}

function RiemannGraph({
  rows,
  showRectangles,
  onBoundary,
  onAlpha,
}: {
  rows: ReturnType<typeof riemann>["rows"];
  showRectangles: boolean;
  onBoundary: (x: number) => void;
  onAlpha: (alpha: number) => void;
}) {
  const w = 520,
    h = 275,
    sx = (x: number) => 260 + (x / Math.PI) * 205,
    sy = (y: number) => 235 - y * 65,
    path = Array.from({ length: 201 }, (_, i) => {
      const x = a + (i * (b - a)) / 200;
      return `${i ? "L" : "M"}${sx(x)} ${sy(fn(x))}`;
    }).join(" "),
    dragBoundary = (e: ReactPointerEvent<SVGCircleElement>) => {
      if (e.buttons !== 1 && e.type === "pointermove") return;
      if (e.type === "pointerdown")
        e.currentTarget.setPointerCapture(e.pointerId);
      const r = e.currentTarget.ownerSVGElement?.getBoundingClientRect();
      if (r)
        onBoundary(
          ((((e.clientX - r.left) / r.width) * w - 260) / 205) * Math.PI,
        );
    },
    first = rows[0],
    dragSample = (e: ReactPointerEvent<SVGCircleElement>) => {
      if (e.buttons !== 1 && e.type === "pointermove") return;
      if (e.type === "pointerdown")
        e.currentTarget.setPointerCapture(e.pointerId);
      const r = e.currentTarget.ownerSVGElement?.getBoundingClientRect();
      if (r) {
        const x =
          ((((e.clientX - r.left) / r.width) * w - 260) / 205) * Math.PI;
        onAlpha((x - first.x0) / (first.x1 - first.x0));
      }
    };
  return (
    <svg className="rie307-graph" viewBox={`0 0 ${w} ${h}`}>
      <defs>
        <pattern
          id="rie-grid"
          width="51.25"
          height="32.5"
          patternUnits="userSpaceOnUse"
        >
          <path d="M51.25 0H0V32.5" fill="none" stroke="#e6ebf2" />
        </pattern>
      </defs>
      <rect width={w} height={h} fill="url(#rie-grid)" />
      {showRectangles &&
        rows.map((r, i) => (
          <rect
            key={i}
            x={sx(r.x0)}
            y={sy(r.height)}
            width={sx(r.x1) - sx(r.x0)}
            height={sy(0) - sy(r.height)}
            className="rectangle"
          />
        ))}
      <line className="axis" x1="0" x2={w} y1={sy(0)} y2={sy(0)} />
      <line className="axis" x1={sx(0)} x2={sx(0)} y1="0" y2={h} />
      <path className="curve" d={path} />
      {rows.map((r, i) => (
        <circle
          key={i}
          className="sample"
          cx={sx(r.sample)}
          cy={sy(r.height)}
          r="4"
          {...(i === 0
            ? {
                "data-drag": "riemann-sample",
                onPointerDown: dragSample,
                onPointerMove: dragSample,
              }
            : {})}
        />
      ))}
      <line
        className="partition"
        x1={sx(first.x1)}
        x2={sx(first.x1)}
        y1="15"
        y2={sy(0)}
      />
      <circle
        data-drag="riemann-partition"
        className="boundary"
        cx={sx(first.x1)}
        cy="20"
        r="6"
        onPointerDown={dragBoundary}
        onPointerMove={dragBoundary}
      />
    </svg>
  );
}
