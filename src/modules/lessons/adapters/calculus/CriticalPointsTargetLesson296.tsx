import {
  ArrowRight,
  Eye,
  Lightbulb,
  Maximize2,
  RotateCcw,
  Share2,
  SlidersHorizontal,
  Target,
} from "lucide-react";
import {
  useEffect,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import type { LessonAdapterProps } from "../../types";
import "./CriticalPointsTargetLesson296.css";

const f = (x: number) => (x < 0 ? 2 - 2 * (x + 1) ** 2 : (x - 1) ** 2 - 1);
const fp = (x: number) =>
  Math.abs(x) < 1e-7 ? Number.NaN : x < 0 ? -4 * (x + 1) : 2 * (x - 1);
const fpp = (x: number) => (x < 0 ? -4 : 2);
const fmt = (n: number, p = 3) =>
  Number.isFinite(n) ? (Math.abs(n) < 1e-9 ? "0.000" : n.toFixed(p)) : "DNE";

export default function CriticalPointsTargetLesson296({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [x, setX] = useState(0),
    [h, setH] = useState(0.05),
    [tab, setTab] = useState("Interaction + visualization"),
    [showF, setShowF] = useState(true),
    [showGrid, setShowGrid] = useState(true),
    [showSign, setShowSign] = useState(true),
    [choice, setChoice] = useState("A"),
    [result, setResult] = useState<"correct" | "incorrect" | "">("");
  const [actions, setActions] = useState(0),
    slope = fp(x),
    left = (f(x) - f(x - h)) / h,
    right = (f(x + h) - f(x)) / h,
    concavity = fpp(x) < 0 ? "Concave down" : "Concave up";
  const act = (run: () => void) => {
      run();
      setActions((n) => n + 1);
      onInteraction();
    },
    move = (n: number) =>
      act(() => setX(Math.max(-4, Math.min(4, Number(n.toFixed(3))))));
  const reset = () => {
    setX(0);
    setH(0.05);
    setTab("Interaction + visualization");
    setShowF(true);
    setShowGrid(true);
    setShowSign(true);
    setChoice("A");
    setResult("");
    setActions(0);
  };
  useEffect(reset, [resetToken]);
  return (
    <section
      className="crit296-page"
      data-testid="calculus-mockup-0375"
      data-dedicated-lesson="296"
      data-object-model="piecewise-corner-stationary-max-min-direct-drag-sign-chart-finite-step-layer-toggles-classification-challenge"
      data-x={x}
      data-h={h}
      data-f={Number(f(x).toFixed(3))}
      data-fp={Number.isFinite(slope) ? Number(slope.toFixed(3)) : "DNE"}
      data-left={Number(left.toFixed(3))}
      data-right={Number(right.toFixed(3))}
      data-concavity={concavity}
      data-result={result}
      data-actions={actions}
    >
      <header className="crit296-hero">
        <span>
          <b>CALCULUS</b>
          <b>LIMITS AND DIFFERENTIAL CALCULUS</b>
        </span>
        <h1>Critical Points</h1>
        <p>Identify candidate extrema.</p>
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
                  `x=${x}, f=${f(x)}, f'=${fmt(slope)}`,
                ),
              )
            }
          >
            <Share2 />
            Share
          </button>
          <a href="/workspace/calculus">▣ Workspace</a>
        </div>
      </header>
      <nav className="crit296-tabs">
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
      <section className="crit296-flow">
        {[
          [
            Eye,
            "1. Observe",
            "The graph of f(x) and its derivative sign chart are shown. Points where f'(x)=0 or f' is undefined are candidates.",
          ],
          [
            SlidersHorizontal,
            "2. Manipulate",
            "Drag the controls for x and h to see how f'(x) changes sign and how slope and concavity vary.",
          ],
          [
            Lightbulb,
            "3. Notice",
            "Critical points occur at stationary points or where the derivative is undefined.",
          ],
          [
            Target,
            "4. Understand",
            "Use f'(x)=0 or f'(x) DNE as candidates for local maxima, minima, or saddle points—then test.",
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
      <section className="crit296-model">
        <header>
          <h2>Work directly on the model</h2>
          <b>● Immediate feedback</b>
          <output>{actions} actions</output>
          <button>
            <Maximize2 />
          </button>
        </header>
        <div className="body">
          <main>
            <h3>Critical Points — graph + f′ sign chart</h3>
            <output className="formula">
              f(x) = {"{"} 2−2(x+1)², x&lt;0; (x−1)²−1, x≥0 {"}"}
            </output>
            <CriticalGraph
              x={x}
              h={h}
              showF={showF}
              showGrid={showGrid}
              showSign={showSign}
              onX={move}
            />
            <section className="candidates">
              {[
                [
                  "purple",
                  "Stationary (local max)",
                  "f′(−1) = 0",
                  "Slope changes + → −",
                  "Point: (−1, 2)",
                ],
                [
                  "orange",
                  "Nondifferentiable",
                  "f′(0) DNE",
                  "Corner; left/right slopes differ",
                  "Point: (0, 0)",
                ],
                [
                  "purple",
                  "Stationary (local min)",
                  "f′(1) = 0",
                  "Slope changes − → +",
                  "Point: (1, −1)",
                ],
              ].map(([c, a, b, d, e]) => (
                <article key={a}>
                  <h4>
                    <i className={c} /> {a}
                  </h4>
                  <p>{b}</p>
                  <p>{d}</p>
                  <p>{e}</p>
                </article>
              ))}
            </section>
            <footer>
              ✓ Correct! All three critical points are correctly identified.
            </footer>
          </main>
          <aside>
            <article className="controls">
              <h3>Linked controls</h3>
              <label>
                x <small>(view position)</small>
                <input
                  aria-label="Critical x"
                  type="range"
                  min="-4"
                  max="4"
                  step=".001"
                  value={x}
                  onChange={(e) => move(Number(e.target.value))}
                />
                <output>{x.toFixed(2)}</output>
              </label>
              <label>
                h <small>(step size)</small>
                <input
                  aria-label="Critical h"
                  type="range"
                  min=".001"
                  max="1"
                  step=".001"
                  value={h}
                  onChange={(e) => act(() => setH(Number(e.target.value)))}
                />
                <output>{h.toFixed(3)}</output>
              </label>
              <h4>Show</h4>
              {[
                ["f(x) graph", showF, setShowF],
                ["Axes & grid", showGrid, setShowGrid],
                ["f′(x) sign chart", showSign, setShowSign],
              ].map(([name, val, setter]) => (
                <label className="check" key={String(name)}>
                  <input
                    type="checkbox"
                    checked={Boolean(val)}
                    onChange={() =>
                      act(() => {
                        (
                          setter as React.Dispatch<
                            React.SetStateAction<boolean>
                          >
                        )((v) => !v);
                      })
                    }
                  />
                  {name}
                </label>
              ))}
            </article>
            <article className="values">
              <h3>Live values at x = {x.toFixed(2)}</h3>
              <p>
                <span>f(x)</span>
                <b>{fmt(f(x))}</b>
              </p>
              <p>
                <span>f′(x)</span>
                <b>{fmt(slope)}</b>
              </p>
              <p>
                <span>Left / right</span>
                <b>
                  {left.toFixed(2)} / {right.toFixed(2)}
                </b>
              </p>
              <p>
                <span>Concavity</span>
                <b>{concavity}</b>
              </p>
            </article>
            <article className="rule">
              <h3>Critical rule (calculus)</h3>
              <p>
                A point x=c is a critical point if f′(c)=0 or f′(c) does not
                exist.
              </p>
              <output>f′(c)=0 or DNE</output>
            </article>
          </aside>
        </div>
      </section>
      <section className="crit296-bottom">
        <article>
          <h3>◉ Worked example</h3>
          <p>Find all critical points of f(x)=x⁴−2x³.</p>
          <b>Solution:</b>
          <p>f′(x)=4x³−6x²=2x²(2x−3)</p>
          <p>f′(x)=0 ⇒ x=0 or x=3/2</p>
          <table>
            <tbody>
              <tr>
                <th>c</th>
                <th>Type</th>
                <th>f(c)</th>
              </tr>
              <tr>
                <td>0</td>
                <td>Stationary</td>
                <td>0</td>
              </tr>
              <tr>
                <td>3/2</td>
                <td>Stationary</td>
                <td>−27/16</td>
              </tr>
            </tbody>
          </table>
          <p>
            <b>Answer:</b> x=0 and x=3/2.
          </p>
        </article>
        <article>
          <h3>⚠ Common misconception</h3>
          <p>Not all critical points are local extrema.</p>
          <p>Example: f(x)=x³ has f′(x)=3x².</p>
          <ul>
            <li>f′(0)=0, so x=0 is critical.</li>
            <li>f is increasing on both sides.</li>
            <li>Therefore x=0 is a saddle point.</li>
          </ul>
          <MiniSaddle />
        </article>
        <article className="challenge">
          <h3>☆ Quick challenge</h3>
          <p>Find the critical points of f(x)=x³−3x.</p>
          {[
            ["A", "x = −1, 1"],
            ["B", "x = −√3, √3"],
            ["C", "x = 0, ±√3"],
            ["D", "x = 0"],
            ["E", "x = −1, 0, 1"],
          ].map(([k, v]) => (
            <label key={k} className={choice === k ? "selected" : ""}>
              <input
                type="radio"
                name="critical-choice"
                checked={choice === k}
                onChange={() => {
                  setChoice(k);
                  setResult("");
                }}
              />
              <b>{k}</b>
              {v}
            </label>
          ))}
          <button
            onClick={() =>
              act(() => setResult(choice === "A" ? "correct" : "incorrect"))
            }
          >
            Check answer
          </button>
          <output>
            {result === "correct"
              ? "Correct: x = −1, 1"
              : result === "incorrect"
                ? "Differentiate first."
                : ""}
          </output>
        </article>
      </section>
      <nav className="crit296-adjacent">
        <a href="/lessons/calculus/295-parametric-differentiation">
          ←{" "}
          <span>
            <small>Previous</small>Parametric Differentiation
          </span>
        </a>
        <a href="/lessons/calculus/297-increasing-and-decreasing">
          <span>
            <small>Next</small>Increasing / Decreasing
          </span>{" "}
          →
        </a>
      </nav>
    </section>
  );
}

function CriticalGraph({
  x,
  h,
  showF,
  showGrid,
  showSign,
  onX,
}: {
  x: number;
  h: number;
  showF: boolean;
  showGrid: boolean;
  showSign: boolean;
  onX: (n: number) => void;
}) {
  const w = 540,
    H = 430,
    sx = (n: number) => 270 + n * 58,
    sy = (n: number) => 175 - n * 40,
    path = Array.from({ length: 401 }, (_, i) => {
      const q = -3.4 + i * 0.017;
      return `${i ? "L" : "M"}${sx(q)} ${sy(f(q))}`;
    }).join(" "),
    drag = (e: ReactPointerEvent<SVGCircleElement>) => {
      if (e.buttons !== 1 && e.type === "pointermove") return;
      if (e.type === "pointerdown")
        e.currentTarget.setPointerCapture(e.pointerId);
      const r = e.currentTarget.ownerSVGElement?.getBoundingClientRect();
      if (r) onX((((e.clientX - r.left) / r.width) * w - 270) / 58);
    };
  return (
    <svg viewBox={`0 0 ${w} ${H}`}>
      {showGrid && (
        <>
          <defs>
            <pattern
              id="critical-grid"
              width="58"
              height="40"
              patternUnits="userSpaceOnUse"
            >
              <path d="M58 0H0V40" fill="none" stroke="#e5ebf2" />
            </pattern>
          </defs>
          <rect width={w} height="300" fill="url(#critical-grid)" />
        </>
      )}
      <line className="axis" x1="20" x2="520" y1={sy(0)} y2={sy(0)} />
      <line className="axis" x1={sx(0)} x2={sx(0)} y1="10" y2="300" />
      {showF && <path className="curve" d={path} />}
      <g className="guides">
        {[-1, 0, 1].map((q) => (
          <line key={q} x1={sx(q)} x2={sx(q)} y1={sy(f(q))} y2="390" />
        ))}
      </g>
      <circle className="max" cx={sx(-1)} cy={sy(2)} r="8" />
      <circle className="corner" cx={sx(0)} cy={sy(0)} r="10" />
      <circle className="min" cx={sx(1)} cy={sy(-1)} r="8" />
      <circle
        data-drag="critical-probe"
        className="probe"
        cx={sx(x)}
        cy={sy(f(x))}
        r="6"
        onPointerDown={drag}
        onPointerMove={drag}
      />
      <text x={sx(-1) - 40} y={sy(2) - 20}>
        (−1, 2)
      </text>
      <text x={sx(0) + 12} y={sy(0) - 20}>
        (0, 0)
      </text>
      <text x={sx(1) + 10} y={sy(-1) + 28}>
        (1, −1)
      </text>
      {showSign && (
        <g className="sign">
          <text x="25" y="327">
            f′(x) sign chart
          </text>
          <line x1="20" x2="520" y1="370" y2="370" />
          <rect x={sx(-1)} y="340" width={sx(1) - sx(-1)} height="30" />
          <text x="100" y="358">
            +
          </text>
          <text x="220" y="358">
            −
          </text>
          <text x="330" y="358">
            −
          </text>
          <text x="445" y="358">
            +
          </text>
          <text x={sx(x) + 5} y="410">
            h={h.toFixed(3)}
          </text>
        </g>
      )}
    </svg>
  );
}
function MiniSaddle() {
  return (
    <svg viewBox="0 0 170 70">
      <path
        d="M10 60C55 60 60 35 85 35s30-25 75-25"
        fill="none"
        stroke="#7038e8"
        strokeWidth="2"
      />
      <line x1="85" x2="85" y1="10" y2="65" stroke="#aab6c5" />
      <circle cx="85" cy="35" r="5" fill="#7135df" />
      <text x="105" y="45" fontSize="8">
        Saddle point
      </text>
    </svg>
  );
}
