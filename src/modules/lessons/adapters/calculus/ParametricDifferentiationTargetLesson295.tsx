import { Eye, Hand, Lightbulb, RotateCcw, Share2, Target } from "lucide-react";
import {
  useEffect,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import type { LessonAdapterProps } from "../../types";
import "./ParametricDifferentiationTargetLesson295.css";

const px = (t: number) => 0.25 + Math.cos(t);
const py = (t: number) => 0.125 * t * t - Math.cos(t) + 1;
const dx = (t: number) => -Math.sin(t);
const dy = (t: number) => 0.25 * t + Math.sin(t);
const clean = (n: number, p = 4) =>
  Math.abs(n) < 1e-10 ? 0 : Number(n.toFixed(p));

export default function ParametricDifferentiationTargetLesson295({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [t, setT] = useState(1.25);
  const [tab, setTab] = useState("Interaction + visualization");
  const [choice, setChoice] = useState("B");
  const [result, setResult] = useState<"correct" | "incorrect" | "">("");
  const [solution, setSolution] = useState(false);
  const [actions, setActions] = useState(0);
  const x = px(t),
    y = py(t),
    vx = dx(t),
    vy = dy(t);
  const vertical = Math.abs(vx) < 0.001;
  const slope = vertical ? (vy >= 0 ? Infinity : -Infinity) : vy / vx;
  const act = (run: () => void) => {
    run();
    setActions((n) => n + 1);
    onInteraction();
  };
  const reset = () => {
    setT(1.25);
    setTab("Interaction + visualization");
    setChoice("B");
    setResult("");
    setSolution(false);
    setActions(0);
  };
  useEffect(reset, [resetToken]);
  const moveT = (n: number) =>
    act(() => setT(Math.max(-6, Math.min(6, Number(n.toFixed(3))))));
  const check = () =>
    act(() => setResult(choice === "B" ? "correct" : "incorrect"));

  return (
    <section
      className="par295-page"
      data-testid="calculus-mockup-0374"
      data-dedicated-lesson="295"
      data-object-model="parameter-driven-coordinate-curve-direct-drag-component-rates-quotient-tangent-vector-meters-choice-practice"
      data-t={clean(t)}
      data-x={clean(x)}
      data-y={clean(y)}
      data-dx={clean(vx)}
      data-dy={clean(vy)}
      data-slope={Number.isFinite(slope) ? clean(slope) : String(slope)}
      data-result={result}
      data-solution={solution}
      data-actions={actions}
    >
      <header className="par295-hero">
        <span>
          <b>CALCULUS</b>
          <b>LIMITS AND DIFFERENTIAL CALCULUS</b>
        </span>
        <h1>Parametric Differentiation</h1>
        <p>Analyse parametric curves.</p>
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
                  `t=${t}, P=(${x},${y}), dy/dx=${slope}`,
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
      <nav className="par295-tabs">
        {[
          "Interaction + visualization",
          "Explain",
          "Examples",
          "Formulas",
          "Know more",
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
      <section className="par295-main">
        <h2>Parametric Differentiation – graph + CAS</h2>
        <section className="par295-flow">
          {[
            [Eye, "1 Observe", "Watch the point move on the curve."],
            [Hand, "2 Manipulate", "Drag t or sliders to change position."],
            [Lightbulb, "3 Notice", "See how x,y and rates change together."],
            [
              Target,
              "4 Understand",
              "Use the rule to find dy/dx at any t where dx/dt ≠ 0.",
            ],
          ].map(([Icon, title, text]) => (
            <article key={String(title)}>
              <Icon />
              <div>
                <h3>{title}</h3>
                <p>{text}</p>
              </div>
            </article>
          ))}
        </section>
        <section className="par295-lab">
          <main>
            <div className="t-control">
              <b>t = {t.toFixed(3)}</b>
              <input
                aria-label="Parametric t"
                type="range"
                min="-6"
                max="6"
                step=".001"
                value={t}
                onChange={(e) => moveT(Number(e.target.value))}
              />
            </div>
            <ParametricGraph
              t={t}
              slope={slope}
              vertical={vertical}
              onT={moveT}
            />
            <div className="graph-legend">
              <p>━ Curve: (x(t), y(t))</p>
              <p>● Point P(t)</p>
              <p>--- Tangent</p>
            </div>
            <footer>
              <p>
                <i>t</i> domain: ℝ (all real numbers)
              </p>
              <p>Visible window: x ∈ [−2,2], y ∈ [−1,7]</p>
            </footer>
          </main>
          <aside>
            <article className="equations">
              <h3>Parameter equations</h3>
              <div>
                <output>x(t) = 1/4 + cos(t)</output>
                <output>y(t) = 1/8 t² − cos(t) + 1</output>
              </div>
            </article>
            <article className="rates">
              <h3>Instantaneous rates (at t = {t.toFixed(3)})</h3>
              <div>
                <output>
                  <span>dx/dt = −sin(t)</span>
                  <b>{vx.toFixed(4)}</b>
                </output>
                <output>
                  <span>dy/dt = 1/4 t + sin(t)</span>
                  <b>{vy.toFixed(4)}</b>
                </output>
              </div>
            </article>
            <article className="slope">
              <h3>Slope of tangent (dy/dx)</h3>
              <div>
                <output>dy/dx = (dy/dt)/(dx/dt)</output>
                <strong>{vertical ? "undefined" : slope.toFixed(4)}</strong>
              </div>
            </article>
            <article className="coordinate">
              <h3>Coordinate of P(t)</h3>
              <div>
                <output>x = {x.toFixed(4)}</output>
                <output>y = {y.toFixed(4)}</output>
              </div>
            </article>
            <article className="vectors">
              <h3>Component rates (vector form)</h3>
              <label>
                <span>dx/dt = −sin(t)</span>
                <meter min="-2" max="2" value={vx} />
                <output>{vx.toFixed(4)}</output>
              </label>
              <label>
                <span>dy/dt = 1/4t + sin(t)</span>
                <meter min="-2" max="2" value={vy} />
                <output>{vy.toFixed(4)}</output>
              </label>
              <p>ⓘ Values update as t changes.</p>
            </article>
          </aside>
        </section>
        <section className="par295-learning">
          <article>
            <h3>Rule (Parametric Differentiation)</h3>
            <p>
              If x=x(t), y=y(t) are differentiable functions of t and dx/dt ≠ 0,
              then the slope is
            </p>
            <output>dy/dx = (dy/dt)/(dx/dt)</output>
            <p>Note: Slope is undefined where dx/dt=0.</p>
          </article>
          <article>
            <h3>Worked Example (Correct)</h3>
            <p>Given x=1/4+cos t, y=1/8t²−cos t+1.</p>
            <b>Find dy/dx at t=1.</b>
            <p>Step 1: dx/dt=−sin t, dy/dt=1/4t+sin t</p>
            <p>Step 2: Apply the rule</p>
            <output>{(dy(1) / dx(1)).toFixed(4)}</output>
          </article>
          <article>
            <h3>Common Misconception</h3>
            <p>Do not differentiate y with respect to x directly.</p>
            <div>
              <section>
                <b>✕ Incorrect</b>
                <p>Treating t as x is not valid.</p>
              </section>
              <section>
                <b>✓ Correct</b>
                <p>Use dy/dx=(dy/dt)/(dx/dt).</p>
              </section>
            </div>
            <p>Both x and y depend on t.</p>
          </article>
        </section>
        <section className="par295-practice">
          <main>
            <h3>Practice Challenge (Try it!)</h3>
            <p>Given x(t)=sin t, y(t)=1−cos t.</p>
            <p>Find dy/dx at t=π/4.</p>
          </main>
          <fieldset>
            {[
              ["A", "−1"],
              ["B", "1"],
              ["C", "√2"],
              ["D", "0"],
            ].map(([key, value]) => (
              <label key={key} className={choice === key ? "selected" : ""}>
                <input
                  type="radio"
                  name="par-choice"
                  value={key}
                  checked={choice === key}
                  onChange={() => {
                    setChoice(key);
                    setResult("");
                  }}
                />
                <b>{key}</b>
                <span>{value}</span>
              </label>
            ))}
          </fieldset>
          <section>
            <h3>Check your answer</h3>
            <button onClick={() => act(() => setSolution((v) => !v))}>
              {solution ? "Hide solution" : "Show solution"}
            </button>
            <button onClick={check}>Check answer</button>
            <p>
              {result === "correct"
                ? "Correct: Answer B"
                : result === "incorrect"
                  ? "Try dividing dy/dt by dx/dt."
                  : ""}
            </p>
          </section>
          <aside>
            <h3>Solution</h3>
            {solution ? (
              <>
                <p>dy/dt=sin t, dx/dt=cos t</p>
                <p>dy/dx=tan t</p>
                <p>At t=π/4, tan(π/4)=1</p>
                <b>Answer: B</b>
              </>
            ) : (
              <p>Reveal the derivation when needed.</p>
            )}
          </aside>
        </section>
      </section>
      <nav className="par295-adjacent">
        <a href="/lessons/calculus/294-implicit-differentiation">
          ←{" "}
          <span>
            <small>Previous</small>Implicit Differentiation
          </span>
        </a>
        <a href="/lessons/calculus/296-critical-points">
          <span>
            <small>Next</small>Critical Points
          </span>{" "}
          →
        </a>
      </nav>
    </section>
  );
}

function ParametricGraph({
  t,
  slope,
  vertical,
  onT,
}: {
  t: number;
  slope: number;
  vertical: boolean;
  onT: (n: number) => void;
}) {
  const w = 410,
    h = 430,
    sx = (n: number) => 195 + n * 88,
    sy = (n: number) => 360 - n * 50;
  const path = Array.from({ length: 481 }, (_, i) => {
    const q = -6 + i / 40;
    return `${i ? "L" : "M"}${sx(px(q))} ${sy(py(q))}`;
  }).join(" ");
  const x = px(t),
    y = py(t),
    drag = (e: ReactPointerEvent<SVGCircleElement>) => {
      if (e.buttons !== 1 && e.type === "pointermove") return;
      if (e.type === "pointerdown")
        e.currentTarget.setPointerCapture(e.pointerId);
      const r = e.currentTarget.ownerSVGElement?.getBoundingClientRect();
      if (!r) return;
      const targetY = (360 - ((e.clientY - r.top) / r.height) * h) / 50;
      let best = t,
        error = Infinity;
      for (let q = -6; q <= 6; q += 0.01) {
        const d = Math.abs(py(q) - targetY) + Math.abs(px(q) - x) * 0.15;
        if (d < error) {
          error = d;
          best = q;
        }
      }
      onT(best);
    };
  return (
    <svg viewBox={`0 0 ${w} ${h}`}>
      <defs>
        <pattern
          id="par-grid"
          width="44"
          height="50"
          patternUnits="userSpaceOnUse"
        >
          <path d="M44 0H0V50" fill="none" stroke="#e7edf4" />
        </pattern>
      </defs>
      <rect width={w} height={h} fill="url(#par-grid)" />
      <line className="axis" x1="0" x2={w} y1={sy(0)} y2={sy(0)} />
      <line className="axis" x1={sx(0)} x2={sx(0)} y1="0" y2={h} />
      <path className="curve" d={path} />
      {vertical ? (
        <line className="tangent" x1={sx(x)} x2={sx(x)} y1="20" y2="410" />
      ) : (
        <line
          className="tangent"
          x1={sx(x - 1.3)}
          x2={sx(x + 1.3)}
          y1={sy(y - 1.3 * slope)}
          y2={sy(y + 1.3 * slope)}
        />
      )}
      <line className="radius" x1={sx(0)} y1={sy(0)} x2={sx(x)} y2={sy(y)} />
      <circle
        data-drag="parametric-point"
        cx={sx(x)}
        cy={sy(y)}
        r="7"
        onPointerDown={drag}
        onPointerMove={drag}
      />
      <text x={sx(x) + 12} y={sy(y) - 10}>
        P(t)
      </text>
      <text x={sx(x) + 12} y={sy(y) + 9}>
        ({x.toFixed(3)}, {y.toFixed(3)})
      </text>
    </svg>
  );
}
