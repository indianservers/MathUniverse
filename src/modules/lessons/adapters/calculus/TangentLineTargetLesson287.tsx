import {
  AlertTriangle,
  ArrowRight,
  Check,
  Expand,
  RotateCcw,
  Share2,
} from "lucide-react";
import {
  useEffect,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import type { LessonAdapterProps } from "../../types";
import "./TangentLineTargetLesson287.css";

const fmt = (n: number) => Number(n.toFixed(2));
const signed = (n: number) => `${n < 0 ? "−" : "+"} ${Math.abs(fmt(n))}`;
export default function TangentLineTargetLesson287({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [x, setX] = useState(-1),
    [tab, setTab] = useState("Interact"),
    [actions, setActions] = useState(0);
  const [mAnswer, setMAnswer] = useState("9"),
    [bAnswer, setBAnswer] = useState("-15"),
    [result, setResult] = useState<"correct" | "incorrect" | "">("correct");
  const y = x * x - 2,
    slope = 2 * x,
    intercept = y - slope * x;
  const reset = () => {
    setX(-1);
    setTab("Interact");
    setActions(0);
    setMAnswer("9");
    setBAnswer("-15");
    setResult("correct");
  };
  useEffect(reset, [resetToken]);
  const act = (run: () => void) => {
    run();
    setActions((v) => v + 1);
    onInteraction();
  };
  const changeX = (value: number) =>
    act(() => setX(Math.max(-5, Math.min(5, fmt(value)))));
  const check = () =>
    act(() =>
      setResult(
        Number(mAnswer) === 9 && Number(bAnswer) === -15
          ? "correct"
          : "incorrect",
      ),
    );
  return (
    <section
      className="tln287-page"
      data-testid="calculus-mockup-0366"
      data-dedicated-lesson="287"
      data-object-model="quadratic-draggable-point-derivative-tangent-slope-triangle-point-slope-practice"
      data-x={x}
      data-y={fmt(y)}
      data-slope={fmt(slope)}
      data-intercept={fmt(intercept)}
      data-result={result}
      data-actions={actions}
    >
      <header className="tln287-hero">
        <span>
          <b>CALCULUS</b>
          <b>LIMITS AND DIFFERENTIAL CALCULUS</b>
        </span>
        <h1>Tangent Line</h1>
        <p>Construct local linear behaviour.</p>
        <div className="meta">
          <i>Advanced</i>
          <i>Calculus Lab</i>
          <i>Derivative / Limit / CAS</i>
          <i>6–10 min</i>
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
                  `P=(${x},${fmt(y)}), y=${fmt(slope)}x ${signed(intercept)}`,
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
      <nav className="tln287-tabs">
        {[
          "Interact",
          "Explain",
          "Examples",
          "Formulas",
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
      <section className="tln287-work">
        <header>
          <div>
            <small>INTERACTION · VISUALIZATION</small>
            <h2>Work directly on the model</h2>
          </div>
          <b>Drag the point on the curve</b>
          <output>{actions} actions</output>
          <button aria-label="Expand">
            <Expand />
          </button>
        </header>
        <div className="model">
          <main>
            <h3>Tangent Line — graph + local analysis</h3>
            <div className="graph">
              <TangentGraph x={x} onX={changeX} />
              <b>f(x) = x² − 2</b>
              <div className="legend">
                ● Domain: ℝ &nbsp; <i>●</i> Range: [−2,∞) &nbsp; <em>●</em> x ∈
                [−5,5] &nbsp; <strong>●</strong> y ∈ [−3,5]
              </div>
            </div>
          </main>
          <aside>
            <article>
              <h3>Point on curve</h3>
              <p>Drag or use slider</p>
              <label>
                <span>−5</span>
                <input
                  aria-label="Point x"
                  type="range"
                  min="-5"
                  max="5"
                  step=".01"
                  value={x}
                  onChange={(e) => changeX(Number(e.target.value))}
                />
                <span>5</span>
                <output>{x.toFixed(2)}</output>
              </label>
              <p>
                y = f(x) <output>{y.toFixed(2)}</output>
              </p>
            </article>
            <article>
              <h3>Tangent (at P)</h3>
              <p>
                Slope m = f′(x) <output>{slope.toFixed(2)}</output>
              </p>
              <p>
                Tangent line{" "}
                <output>
                  y = {slope.toFixed(2)}x {signed(intercept)}
                </output>
              </p>
            </article>
            <article>
              <h3>Slope triangle</h3>
              <p>
                Rise Δy <output>{slope.toFixed(2)}</output>
              </p>
              <p>
                Run Δx <output>1.00</output>
              </p>
              <p>
                Slope m = Δy/Δx <output>{slope.toFixed(2)}</output>
              </p>
            </article>
            <article>
              <h3>Point–Slope Equation</h3>
              <strong>
                y − ({y.toFixed(2)}) = {slope.toFixed(2)} (x − ({x.toFixed(2)}))
              </strong>
              <strong>
                y {signed(-y)} = {slope.toFixed(2)} (x {signed(-x)})
              </strong>
              <output>
                y = {slope.toFixed(2)}x {signed(intercept)}
              </output>
            </article>
          </aside>
        </div>
        <section className="flow">
          {[
            [
              "1",
              "Observe",
              "The curve is f(x)=x²−2. The tangent line touches the curve at exactly one point P.",
            ],
            [
              "2",
              "Manipulate",
              "Drag P or change x. Watch the tangent line, slope, and equation update instantly.",
            ],
            [
              "3",
              "Notice",
              "The slope equals f′(x)=2x. The tangent line is the best linear approximation near P.",
            ],
            [
              "4",
              "Understand",
              "Tangent line models local behaviour: it matches the function’s value and slope at P.",
            ],
          ].map(([n, t, p], i) => (
            <article key={n}>
              <b>{n}</b>
              <h3>{t}</h3>
              <p>{p}</p>
              {i < 3 && <ArrowRight />}
            </article>
          ))}
        </section>
      </section>
      <section className="tln287-learn">
        <article>
          <h3>Key Rule</h3>
          <p>For a differentiable function f at x = a:</p>
          <output>y − f(a) = f′(a) (x − a)</output>
          <p>
            This is the equation of the <b>tangent line</b> to y=f(x) at
            (a,f(a)).
          </p>
          <footer>
            ♙ The tangent line is the limit of secant lines as two points on the
            curve come infinitely close.
          </footer>
        </article>
        <article>
          <h3>Worked Example</h3>
          <p>Find the tangent line to f(x)=x²−2 at x=−1.</p>
          {[
            "f(−1)=(−1)²−2=−1",
            "f′(x)=2x ⇒ f′(−1)=−2",
            "Use y−f(a)=f′(a)(x−a)",
            "y−(−1)=(−2)(x−(−1))",
            "y+1=−2(x+1)",
            "y=−2x−3",
          ].map((s, i) => (
            <p key={s}>
              <i>{i + 1}</i>
              {s}
            </p>
          ))}
          <footer>
            <Check /> Tangent line: y = −2x − 3
          </footer>
        </article>
        <article className="mistake">
          <h3>
            <AlertTriangle /> Common Misconception
          </h3>
          <p>
            Not every line through P is a tangent. Only one line has slope
            f′(a).
          </p>
          <MiniLines />
          <p>
            Many lines pass through P, but only one matches the curve’s
            instantaneous slope.
          </p>
        </article>
      </section>
      <section className="tln287-practice">
        <header>◎ &nbsp; Quick Practice</header>
        <main>
          <p>For f(x)=x³−3x+1, find the tangent line at x=2.</p>
          <small>(Round to 2 decimal places)</small>
        </main>
        <label>
          Your answer <span>y =</span>
          <input
            aria-label="Practice slope"
            value={mAnswer}
            onChange={(e) => {
              setMAnswer(e.target.value);
              setResult("");
            }}
          />
          <i>x +</i>
          <input
            aria-label="Practice intercept"
            value={bAnswer}
            onChange={(e) => {
              setBAnswer(e.target.value);
              setResult("");
            }}
          />
          <button onClick={check}>Check</button>
        </label>
        <aside className={result}>
          <b>
            {result === "incorrect" ? "Check both coefficients" : "Solution"}
          </b>
          <p>
            {result === "incorrect"
              ? "Use m=f′(2), then b=f(2)−2m."
              : "m=f′(x)=3x²−3 ⇒ m(2)=9\nf(2)=8−6+1=3\ny−3=9(x−2) ⇒ y=9x−15"}
          </p>
        </aside>
      </section>
      <nav className="tln287-adjacent">
        <a href="/lessons/calculus/286-derivative-from-first-principles">
          <ArrowRight />
          <span>
            <small>Previous</small>Derivative from First Principles
          </span>
        </a>
        <a href="/lessons/calculus/288-normal-line">
          <span>
            <small>Next</small>Normal Line
          </span>
          <ArrowRight />
        </a>
      </nav>
    </section>
  );
}

function TangentGraph({ x, onX }: { x: number; onX: (n: number) => void }) {
  const w = 520,
    h = 460,
    sx = (n: number) => 260 + n * 47,
    sy = (n: number) => 270 - n * 43,
    f = (n: number) => n * n - 2,
    m = 2 * x,
    b = f(x) - m * x;
  const curve = Array.from({ length: 201 }, (_, i) => {
    const n = -4.3 + i * 0.043;
    return `${i ? "L" : "M"}${sx(n)} ${sy(f(n))}`;
  }).join(" ");
  const drag = (e: ReactPointerEvent<SVGCircleElement>) => {
    if (e.buttons !== 1 && e.type === "pointermove") return;
    if (e.type === "pointerdown")
      e.currentTarget.setPointerCapture(e.pointerId);
    const r = e.currentTarget.ownerSVGElement?.getBoundingClientRect();
    if (r) onX((((e.clientX - r.left) / r.width) * w - 260) / 47);
  };
  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      aria-label="Quadratic and draggable tangent point"
    >
      <defs>
        <pattern
          id="tln-grid"
          width="47"
          height="43"
          patternUnits="userSpaceOnUse"
        >
          <path d="M47 0H0V43" fill="none" stroke="#e9edf3" />
        </pattern>
      </defs>
      <rect width={w} height={h} fill="url(#tln-grid)" />
      <line className="axis" x1="0" y1={sy(0)} x2={w} y2={sy(0)} />
      <line className="axis" x1={sx(0)} y1="0" x2={sx(0)} y2={h} />
      <path className="curve" d={curve} />
      <line
        className="tangent"
        x1={sx(-5)}
        y1={sy(m * -5 + b)}
        x2={sx(5)}
        y2={sy(m * 5 + b)}
      />
      <path
        className="triangle"
        d={`M${sx(x)} ${sy(f(x))}V${sy(f(x) + m)}H${sx(x + 1)}`}
      />
      <circle
        data-drag="tangent-point"
        cx={sx(x)}
        cy={sy(f(x))}
        r="9"
        onPointerDown={drag}
        onPointerMove={drag}
      />
      <text className="plabel" x={sx(x) - 92} y={sy(f(x)) - 12}>
        P({fmt(x)}, {fmt(f(x))})
      </text>
      <text className="tlabel" x={sx(1)} y={sy(m + b) + 58}>
        Tangent line &nbsp; y={fmt(m)}x {signed(b)}
      </text>
    </svg>
  );
}
function MiniLines() {
  return (
    <svg viewBox="0 0 240 115">
      <path
        d="M35 74 Q88 5 123 74 Q162 114 205 24"
        fill="none"
        stroke="#28a9eb"
        strokeWidth="2"
      />
      <g stroke="#a56df3" strokeDasharray="4 3">
        <path d="M34 74H213" />
        <path d="M70 105L177 13" />
        <path d="M87 13L151 108" />
      </g>
      <path d="M50 28L198 106" stroke="#09a7bd" strokeWidth="2" />
      <circle cx="123" cy="74" r="4" fill="#d20f4c" />
    </svg>
  );
}
