import {
  AlertTriangle,
  ArrowRight,
  Check,
  Eye,
  Hand,
  Lightbulb,
  RotateCcw,
  Share2,
  Target,
} from "lucide-react";
import {
  useEffect,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import type { LessonAdapterProps } from "../../types";
import "./ImplicitDifferentiationTargetLesson294.css";
const radius = 3,
  fmt = (n: number, p = 3) => (Math.abs(n) < 1e-10 ? 0 : Number(n.toFixed(p))),
  circleY = (x: number) => Math.sqrt(Math.max(0, radius * radius - x * x));
export default function ImplicitDifferentiationTargetLesson294({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [x, setX] = useState(0),
    [tab, setTab] = useState("Interaction + visualization"),
    [answer, setAnswer] = useState("-1/2"),
    [result, setResult] = useState<"correct" | "incorrect" | "">(""),
    [actions, setActions] = useState(0);
  const y = circleY(x),
    vertical = y < 0.02,
    slope = vertical ? (x < 0 ? Infinity : -Infinity) : -x / y,
    classification = vertical
      ? "Vertical"
      : Math.abs(slope) < 0.01
        ? "Horizontal"
        : slope > 0
          ? "Rising"
          : "Falling";
  const reset = () => {
    setX(0);
    setTab("Interaction + visualization");
    setAnswer("-1/2");
    setResult("");
    setActions(0);
  };
  useEffect(reset, [resetToken]);
  const act = (run: () => void) => {
    run();
    setActions((a) => a + 1);
    onInteraction();
  };
  const changeX = (n: number) =>
    act(() => setX(Math.max(-2.999, Math.min(2.999, Number(n.toFixed(3))))));
  const changeY = (n: number) => {
    const next = Math.sqrt(Math.max(0, 9 - n * n)),
      sign = x < 0 ? -1 : 1;
    changeX(sign * next);
  };
  const check = () => {
    const n = answer.toLowerCase().replace(/\s/g, "");
    act(() =>
      setResult(["-1/2", "-.5", "-0.5"].includes(n) ? "correct" : "incorrect"),
    );
  };
  return (
    <section
      className="imp294-page"
      data-testid="calculus-mockup-0373"
      data-dedicated-lesson="294"
      data-object-model="upper-semicircle-constrained-linked-x-y-direct-drag-implicit-slope-tangent-classification-practice"
      data-x={fmt(x)}
      data-y={fmt(y)}
      data-slope={Number.isFinite(slope) ? fmt(slope) : String(slope)}
      data-classification={classification}
      data-constraint={fmt(x * x + y * y)}
      data-result={result}
      data-actions={actions}
    >
      <header className="imp294-hero">
        <span>
          <b>CALCULUS</b>
          <b>LIMITS AND DIFFERENTIAL CALCULUS</b>
        </span>
        <h1>Implicit Differentiation</h1>
        <p>Differentiate implicit curves.</p>
        <div className="meta">
          <i>Advanced</i>
          <i>Calculus Lab</i>
          <i>Derivative / Limit / CAS</i>
          <i>6–10 min</i>
          <button>English (English)⌄</button>
          <button onClick={() => act(reset)}>
            <RotateCcw />
            Reset
          </button>
          <button
            onClick={() =>
              act(() =>
                navigator.clipboard?.writeText(
                  `P=(${fmt(x)},${fmt(y)}), dy/dx=${vertical ? "vertical" : fmt(slope)}`,
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
      <nav className="imp294-tabs">
        {[
          "Interaction + visualization",
          "Explain",
          "Examples",
          "Formulas",
          "Know more",
        ].map((n) => (
          <button
            key={n}
            className={tab === n ? "active" : ""}
            onClick={() => act(() => setTab(n))}
          >
            {n}
          </button>
        ))}
      </nav>
      <section className="imp294-flow">
        {[
          [
            Eye,
            "1. Observe",
            "A point moves on the curve. The tangent line updates. Watch the slope change.",
          ],
          [
            Hand,
            "2. Manipulate",
            "Drag the orange point or use the sliders to explore how the slope varies.",
          ],
          [
            Lightbulb,
            "3. Notice",
            "The slope dy/dx depends on (x,y). Horizontal and vertical tangents appear naturally.",
          ],
          [
            Target,
            "4. Understand",
            "Implicit differentiation gives dy/dx without solving y explicitly.",
          ],
        ].map(([Icon, t, p], i) => (
          <article key={String(t)}>
            <Icon />
            <div>
              <h3>{t}</h3>
              <p>{p}</p>
            </div>
            {i < 3 && <ArrowRight />}
          </article>
        ))}
      </section>
      <section className="imp294-lab">
        <main>
          <header>
            <h3>Explore the implicit curve</h3>
            <b>● Interactive</b>
            <button>↗</button>
          </header>
          <div className="graph">
            <ImplicitGraph
              x={x}
              y={y}
              slope={slope}
              vertical={vertical}
              onX={changeX}
            />
            <div className="legend">
              <h4>Implicit curve</h4>
              <strong>x²+y²=9</strong>
              <p>━ Curve</p>
              <p>--- Tangent</p>
            </div>
            <div className="point-label">
              Point P ({x.toFixed(3)}, {y.toFixed(3)})
              <output>
                dy/dx = {vertical ? "undefined" : slope.toFixed(3)}
              </output>
            </div>
          </div>
          <footer>
            ⓘ Tip: Drag the orange point along the curve. Watch the tangent and
            slope.
          </footer>
        </main>
        <aside>
          <article>
            <h3>Drag point on curve</h3>
            <p>
              {actions
                ? "Point updated from the curve constraint."
                : "Awaiting interaction"}
            </p>
          </article>
          <article className="controls">
            <h3>Linked controls</h3>
            <label>
              x
              <input
                aria-label="Implicit x"
                type="range"
                min="-2.999"
                max="2.999"
                step=".001"
                value={x}
                onChange={(e) => changeX(Number(e.target.value))}
              />
              <output>{x.toFixed(3)}</output>
            </label>
            <label>
              y
              <input
                aria-label="Implicit y"
                type="range"
                min="0"
                max="3"
                step=".001"
                value={y}
                onChange={(e) => changeY(Number(e.target.value))}
              />
              <output>{y.toFixed(3)}</output>
            </label>
            <section>
              <b>Slope (dy/dx)</b>
              <strong>{vertical ? "undefined" : slope.toFixed(3)}</strong>
              <i>{classification}</i>
            </section>
          </article>
          <article>
            <h3>Slope sign</h3>
            <p>
              {vertical
                ? "undefined"
                : slope > 0
                  ? "> 0"
                  : slope < 0
                    ? "< 0"
                    : "≈ 0"}
            </p>
          </article>
          <article>
            <h3>Point coordinates</h3>
            <output>
              x={x.toFixed(3)}
              <br />
              y={y.toFixed(3)}
            </output>
          </article>
          <article>
            <h3>Domain of x</h3>
            <output>−3≤x≤3</output>
          </article>
        </aside>
      </section>
      <section className="imp294-feedback">
        <article>
          <h3>
            <Check /> Immediate feedback
          </h3>
          <p>
            Great! The point satisfies the equation:
            <br />
            {x.toFixed(3)}²+{y.toFixed(3)}²={fmt(x * x + y * y)} <Check />
          </p>
          <b>Curve equation is satisfied.</b>
        </article>
        <article>
          <h3>What’s happening?</h3>
          <p>
            Moving the point changes (x,y). The tangent line touches the curve
            at P and has slope dy/dx computed using implicit differentiation.
          </p>
        </article>
        <article>
          <h3>
            <AlertTriangle /> Misconception alert
          </h3>
          <p>
            Do not differentiate y² as 2y. You must use the chain rule:
            d/dx(y²)=2y(dy/dx).
          </p>
          <p>Ignoring dy/dx is a common mistake.</p>
        </article>
      </section>
      <section className="imp294-info">
        <article>
          <h3>Why implicit?</h3>
          <p>
            Sometimes solving for y is messy or impossible. Implicit
            differentiation finds dy/dx directly from F(x,y)=0.
          </p>
          <MiniImplicit />
        </article>
        <article>
          <h3>The rule (from Chain Rule)</h3>
          <p>If F(x,y)=0, then</p>
          <output>dy/dx = −Fₓ/Fᵧ</output>
          <p>where Fₓ=∂F/∂x, Fᵧ=∂F/∂y and Fᵧ≠0 at the point.</p>
        </article>
        <article>
          <h3>Key takeaways</h3>
          {[
            "Differentiate both sides w.r.t. x.",
            "Use chain rule for any y terms.",
            "Group terms in dy/dx on one side.",
            "Solve for dy/dx.",
            "Check Fᵧ≠0 (else vertical tangent).",
          ].map((t) => (
            <p key={t}>✓ {t}</p>
          ))}
        </article>
      </section>
      <section className="imp294-worked">
        <h3>
          Worked example{" "}
          <span>Find dy/dx for x²+y²=9 at any point (x,y) on the curve.</span>
        </h3>
        <div>
          <article>
            <b>1. Differentiate both sides</b>
            <output>
              d/dx(x²)+d/dx(y²)=d/dx(9)
              <br />
              2x+2y dy/dx=0
            </output>
          </article>
          <article>
            <b>2. Solve for dy/dx</b>
            <output>
              2y dy/dx=−2x
              <br />
              dy/dx=−x/y
            </output>
          </article>
          <article>
            <b>3. At P (0,3)</b>
            <output>
              dy/dx=−0/3=0
              <br />
              (Horizontal tangent)
            </output>
          </article>
          <article>
            <b>General result</b>
            <output>dy/dx=−x/y</output>
            <p>(for x²+y²=9, y≠0)</p>
          </article>
        </div>
      </section>
      <section className="imp294-practice">
        <main>
          <h3>Try it yourself</h3>
          <p>Find dy/dx for 2xy+y²=5 at the point (1,1).</p>
          <small>Hint: Differentiate both sides. Use chain rule for y².</small>
        </main>
        <label>
          Enter dy/dx at (1,1)
          <input
            aria-label="Implicit practice answer"
            value={answer}
            onChange={(e) => {
              setAnswer(e.target.value);
              setResult("");
            }}
          />
          <button onClick={check}>Check answer</button>
        </label>
        <aside>
          <h3>♜ Quick result</h3>
          <p>
            {result === "correct"
              ? "Correct: dy/dx = -1/2"
              : result === "incorrect"
                ? "Differentiate both xy and y² carefully."
                : "Your answer will appear here."}
          </p>
        </aside>
      </section>
      <nav className="imp294-adjacent">
        <a href="/lessons/calculus/293-chain-rule">
          <ArrowRight />
          <span>
            <small>Previous</small>Chain Rule
          </span>
        </a>
        <a href="/lessons/calculus/295-parametric-differentiation">
          <span>
            <small>Next</small>Parametric Differentiation
          </span>
          <ArrowRight />
        </a>
      </nav>
    </section>
  );
}
function ImplicitGraph({
  x,
  y,
  slope,
  vertical,
  onX,
}: {
  x: number;
  y: number;
  slope: number;
  vertical: boolean;
  onX: (n: number) => void;
}) {
  const w = 570,
    h = 430,
    sx = (n: number) => 270 + n * 41,
    sy = (n: number) => 260 - n * 39,
    path = Array.from({ length: 181 }, (_, i) => {
      const n = -3 + i / 30;
      return `${i ? "L" : "M"}${sx(n)} ${sy(circleY(n))}`;
    }).join(" "),
    drag = (e: ReactPointerEvent<SVGCircleElement>) => {
      if (e.buttons !== 1 && e.type === "pointermove") return;
      if (e.type === "pointerdown")
        e.currentTarget.setPointerCapture(e.pointerId);
      const r = e.currentTarget.ownerSVGElement?.getBoundingClientRect();
      if (r) onX((((e.clientX - r.left) / r.width) * w - 270) / 41);
    };
  return (
    <svg viewBox={`0 0 ${w} ${h}`}>
      <defs>
        <pattern
          id="imp-grid"
          width="52"
          height="53"
          patternUnits="userSpaceOnUse"
        >
          <path d="M52 0H0V53" fill="none" stroke="#e8edf3" />
        </pattern>
      </defs>
      <rect width={w} height={h} fill="url(#imp-grid)" />
      <line className="axis" x1="0" y1={sy(0)} x2={w} y2={sy(0)} />
      <line className="axis" x1={sx(0)} y1="0" x2={sx(0)} y2={h} />
      <path className="curve" d={path} />
      {vertical ? (
        <line className="tangent" x1={sx(x)} y1="20" x2={sx(x)} y2="410" />
      ) : (
        <line
          className="tangent"
          x1={sx(x - 2.2)}
          y1={sy(y - 2.2 * slope)}
          x2={sx(x + 2.2)}
          y2={sy(y + 2.2 * slope)}
        />
      )}
      <circle
        data-drag="implicit-point"
        cx={sx(x)}
        cy={sy(y)}
        r="8"
        onPointerDown={drag}
        onPointerMove={drag}
      />
    </svg>
  );
}
function MiniImplicit() {
  return (
    <svg viewBox="0 0 260 80">
      <path
        d="M15 50q20-35 40 0t40 0"
        fill="none"
        stroke="#aebdca"
        strokeWidth="3"
      />
      <text x="43" y="78" fill="#ef2538" fontSize="22">
        ×
      </text>
      <path d="M115 58h42" stroke="#102047" />
      <path d="M150 52l8 6-8 6" fill="none" stroke="#102047" />
      <path
        d="M190 70q30 0 28-27t14-28"
        fill="none"
        stroke="#08a6d1"
        strokeWidth="3"
      />
      <circle cx="235" cy="70" r="9" fill="#18b462" />
      <text x="231" y="74" fill="#fff">
        ✓
      </text>
    </svg>
  );
}
