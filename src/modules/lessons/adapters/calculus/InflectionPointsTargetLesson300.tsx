import {
  Eye,
  GraduationCap,
  Hand,
  Lightbulb,
  Maximize2,
  RotateCcw,
  Share2,
} from "lucide-react";
import {
  useEffect,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import type { LessonAdapterProps } from "../../types";
import "./InflectionPointsTargetLesson300.css";

const poly = (x: number, c: number, k: number, m: number, d: number) =>
  c * x ** 3 + k * x * x + m * x + d;
const clean = (n: number, p = 3) =>
  Math.abs(n) < 1e-9 ? 0 : Number(n.toFixed(p));
export default function InflectionPointsTargetLesson300({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [c, setC] = useState(1),
    [k, setK] = useState(-3),
    [m, setM] = useState(1),
    [d, setD] = useState(2),
    [tab, setTab] = useState("Interaction + Visualization"),
    [steps, setSteps] = useState([false, false, false, false]),
    [result, setResult] = useState<"correct" | "incorrect" | "">(""),
    [actions, setActions] = useState(0);
  const hasInflection = Math.abs(c) > 1e-8,
    xInflect = hasInflection ? -k / (3 * c) : Number.NaN,
    yInflect = hasInflection ? poly(xInflect, c, k, m, d) : Number.NaN,
    leftSign = hasInflection
      ? Math.sign(6 * c * (xInflect - 1) + 2 * k)
      : Math.sign(2 * k),
    rightSign = hasInflection
      ? Math.sign(6 * c * (xInflect + 1) + 2 * k)
      : Math.sign(2 * k),
    changes = hasInflection && leftSign * rightSign < 0;
  const act = (run: () => void) => {
      run();
      setActions((n) => n + 1);
      onInteraction();
    },
    reset = () => {
      setC(1);
      setK(-3);
      setM(1);
      setD(2);
      setTab("Interaction + Visualization");
      setSteps([false, false, false, false]);
      setResult("");
      setActions(0);
    };
  useEffect(reset, [resetToken]);
  const moveInflection = (x: number) =>
      act(() => setK(Number((-3 * c * x).toFixed(3)))),
    check = () =>
      act(() => setResult(steps.every(Boolean) ? "correct" : "incorrect"));
  return (
    <section
      className="inf300-page"
      data-testid="calculus-mockup-0379"
      data-dedicated-lesson="300"
      data-object-model="four-coefficient-cubic-analytic-second-derivative-direct-inflection-drag-concavity-sign-map-step-practice"
      data-c={c}
      data-k={k}
      data-m={m}
      data-d={d}
      data-x={hasInflection ? clean(xInflect) : "none"}
      data-y={hasInflection ? clean(yInflect) : "none"}
      data-left-sign={leftSign}
      data-right-sign={rightSign}
      data-changes={changes}
      data-steps={steps.filter(Boolean).length}
      data-result={result}
      data-actions={actions}
    >
      <header className="inf300-hero">
        <span>
          <b>CALCULUS</b>
          <b>LIMITS AND DIFFERENTIAL CALCULUS</b>
        </span>
        <h1>Inflection Points</h1>
        <p>Detect concavity changes.</p>
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
                  `x=${clean(xInflect)}, y=${clean(yInflect)}`,
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
      <nav className="inf300-tabs">
        {[
          "Interaction + Visualization",
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
      <section className="inf300-work">
        <aside>
          <h2>How to use</h2>
          {(
            [
              [
                Eye,
                "1 Observe",
                "See where the curve is concave up or concave down.",
              ],
              [
                Hand,
                "2 Manipulate",
                "Move the sliders to change the function and watch f″ and concavity.",
              ],
              [
                Lightbulb,
                "Notice",
                "Inflection points occur where f″ changes sign and the curve switches concavity.",
              ],
              [
                GraduationCap,
                "Understand",
                "Use the rule and example below. Then try the practice challenge.",
              ],
            ] as const
          ).map(([Icon, t, p]) => (
            <article key={String(t)}>
              <Icon />
              <div>
                <h3>{t}</h3>
                <p>{p}</p>
              </div>
            </article>
          ))}
        </aside>
        <main>
          <header>
            <h2>Work directly on the model</h2>
            <b>{changes ? "✓ Concavity change detected" : "No sign change"}</b>
            <output>{actions} actions</output>
            <button>
              <Maximize2 />
            </button>
          </header>
          <section className="graph-row">
            <div>
              <output>
                f(x) = {c}x³ {k < 0 ? "−" : "+"} {Math.abs(k)}x²{" "}
                {m < 0 ? "−" : "+"} {Math.abs(m)}x {d < 0 ? "−" : "+"}{" "}
                {Math.abs(d)}
              </output>
              <InflectionGraph
                c={c}
                k={k}
                m={m}
                d={d}
                xInflect={xInflect}
                onX={moveInflection}
              />
            </div>
            <aside>
              <h3>Concavity map via f″(x)</h3>
              <div className="sign-map">
                <b>{leftSign > 0 ? "+" : "−"}</b>
                <i />
                <b>0</b>
                <i />
                <b>{rightSign > 0 ? "+" : "−"}</b>
              </div>
              <output>
                f″(x) = {6 * c}x {2 * k < 0 ? "−" : "+"} {Math.abs(2 * k)}
              </output>
              <p>
                <b>f″(x)&gt;0</b> Concave up (U)
              </p>
              <p>
                <b>f″(x)&lt;0</b> Concave down (∩)
              </p>
              <p>
                <b>f″(x)=0</b> Candidate IP
              </p>
            </aside>
          </section>
          <section className="controls">
            {(
              [
                ["c (x³ coefficient)", c, setC, -3, 3],
                ["k (x² coefficient)", k, setK, -6, 6],
                ["m (x coefficient)", m, setM, -6, 6],
                ["d (constant)", d, setD, -6, 6],
              ] as const
            ).map(([label, value, setter, min, max]) => (
              <label key={String(label)}>
                {label}
                <input
                  aria-label={String(label)}
                  type="range"
                  min={Number(min)}
                  max={Number(max)}
                  step=".25"
                  value={Number(value)}
                  onChange={(e) =>
                    act(() => {
                      (setter as React.Dispatch<React.SetStateAction<number>>)(
                        Number(e.target.value),
                      );
                    })
                  }
                />
                <output>{Number(value).toFixed(2)}</output>
                <small>
                  {min} to {max}
                </small>
              </label>
            ))}
          </section>
          <section className="summary">
            <span>
              Inflection points
              <br />
              <b>
                {hasInflection
                  ? `(${clean(xInflect)}, ${clean(yInflect)})`
                  : "None"}
              </b>
            </span>
            <span>
              Domain
              <br />
              <b>(−∞,∞)</b>
            </span>
            <span>
              f″(x)=0 at
              <br />
              <b>{hasInflection ? `x=${clean(xInflect)}` : "none"}</b>
            </span>
          </section>
          <div className="model-feedback">
            The cubic {changes ? "changes" : "does not change"} concavity{" "}
            {hasInflection
              ? `at x=${clean(xInflect)}, point (${clean(xInflect)}, ${clean(yInflect)}).`
              : "because f″ is constant."}
          </div>
        </main>
      </section>
      <section className="inf300-info">
        <article>
          <h3>Rule (Inflection Point Test)</h3>
          <p>Let f be twice differentiable near x=a.</p>
          <p>1. If f″(a)=0 or undefined, and</p>
          <p>2. f″ changes sign at x=a,</p>
          <p>then f has an inflection point at x=a.</p>
          <aside>
            <b>Equivalent:</b>
            <p>Concavity changes at a.</p>
          </aside>
        </article>
        <article>
          <h3>Worked Example</h3>
          <p>Find inflection point(s) of f(x)=x³−3x²+x+2.</p>
          <p>f′(x)=3x²−6x+1</p>
          <p>f″(x)=6x−6</p>
          <p>Set f″=0 ⇒ x=1</p>
          <p>Test signs: f″(0)&lt;0, f″(2)&gt;0</p>
          <output>Sign changes ⇒ Inflection at x=1.</output>
          <p>f(1)=1 ⇒ IP (1,1).</p>
        </article>
        <article>
          <h3>Common Misconception</h3>
          <p>Don't confuse stationary points with inflection points.</p>
          <p>A point where f′(x)=0 does not have to be an inflection point.</p>
          <MiniStationary />
          <b>Not an inflection if concavity does not change.</b>
        </article>
      </section>
      <section className="inf300-practice">
        <main>
          <h3>Your turn: Practice challenge</h3>
          <p>Find the inflection point(s) of g(x)=x³+x²−4x.</p>
          <small>Hint: Use g″(x) and test sign around the candidate.</small>
        </main>
        <section>
          <h3>Your steps</h3>
          {[
            "Compute g″(x)",
            "Solve g″(x)=0",
            "Test sign of g″ around each candidate",
            "State inflection point(s)",
          ].map((s, i) => (
            <label key={s}>
              <input
                type="checkbox"
                checked={steps[i]}
                onChange={() => {
                  setSteps((v) => v.map((x, j) => (j === i ? !x : x)));
                  setResult("");
                }}
              />
              {i + 1}. {s}
            </label>
          ))}
          <button onClick={check}>Check my answer</button>
        </section>
        <aside>
          <h3>▣ Solution {result ? "" : "(hidden)"}</h3>
          {result === "correct" ? (
            <>
              <p>g″(x)=6x+2</p>
              <p>x=−1/3 and sign changes.</p>
              <b>IP (−1/3, 38/27)</b>
            </>
          ) : result === "incorrect" ? (
            <p>Complete each step and solve 6x+2=0.</p>
          ) : (
            <p>Reveal after your attempt.</p>
          )}
        </aside>
      </section>
      <nav className="inf300-adjacent">
        <a href="/lessons/calculus/299-concavity">
          ←{" "}
          <span>
            <small>Previous</small>Concavity
          </span>
        </a>
        <a href="/lessons/calculus/301-optimisation">
          <span>
            <small>Next</small>Optimisation
          </span>{" "}
          →
        </a>
      </nav>
    </section>
  );
}

function InflectionGraph({
  c,
  k,
  m,
  d,
  xInflect,
  onX,
}: {
  c: number;
  k: number;
  m: number;
  d: number;
  xInflect: number;
  onX: (n: number) => void;
}) {
  const w = 380,
    h = 360,
    sx = (x: number) => 190 + x * 43,
    sy = (y: number) => 185 - Math.tanh(y / 8) * 145,
    path = Array.from({ length: 321 }, (_, i) => {
      const x = -4 + i * 0.025;
      return `${i ? "L" : "M"}${sx(x)} ${sy(poly(x, c, k, m, d))}`;
    }).join(" "),
    drag = (e: ReactPointerEvent<SVGCircleElement>) => {
      if (e.buttons !== 1 && e.type === "pointermove") return;
      if (e.type === "pointerdown")
        e.currentTarget.setPointerCapture(e.pointerId);
      const r = e.currentTarget.ownerSVGElement?.getBoundingClientRect();
      if (r) onX((((e.clientX - r.left) / r.width) * w - 190) / 43);
    };
  const y = Number.isFinite(xInflect) ? poly(xInflect, c, k, m, d) : 0;
  return (
    <svg viewBox={`0 0 ${w} ${h}`}>
      <defs>
        <pattern
          id="inf-grid"
          width="43"
          height="36"
          patternUnits="userSpaceOnUse"
        >
          <path d="M43 0H0V36" fill="none" stroke="#e7edf3" />
        </pattern>
      </defs>
      <rect width={w} height={h} fill="url(#inf-grid)" />
      <line className="axis" x1="0" x2={w} y1="185" y2="185" />
      <line className="axis" x1="190" x2="190" y1="0" y2={h} />
      <path className="curve" d={path} />
      {Number.isFinite(xInflect) && (
        <>
          <circle
            data-drag="inflection-point"
            cx={sx(xInflect)}
            cy={sy(y)}
            r="8"
            onPointerDown={drag}
            onPointerMove={drag}
          />
          <text x={sx(xInflect) + 10} y={sy(y) - 12}>
            IP ({clean(xInflect)}, {clean(y)})
          </text>
        </>
      )}
    </svg>
  );
}
function MiniStationary() {
  return (
    <svg viewBox="0 0 180 70">
      <path
        d="M5 60Q90-15 175 60"
        fill="none"
        stroke="#173a76"
        strokeWidth="2"
      />
      <circle cx="90" cy="22" r="5" fill="#102047" />
      <text x="80" y="14">
        f′(x)=0
      </text>
    </svg>
  );
}
