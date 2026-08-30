import {
  AlertTriangle,
  ArrowRight,
  Check,
  Eye,
  Lightbulb,
  RotateCcw,
  Share2,
  SlidersHorizontal,
  Star,
  Target,
} from "lucide-react";
import {
  useEffect,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import type { LessonAdapterProps } from "../../types";
import "./NormalLineTargetLesson288.css";

const f = (x: number) => -2 * x * x + x,
  fp = (x: number) => -4 * x + 1,
  fmt = (n: number, p = 3) => Number(n.toFixed(p));
export default function NormalLineTargetLesson288({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [x, setX] = useState(0.25),
    [h, setH] = useState(0.05),
    [tab, setTab] = useState("Interaction + visualization"),
    [pm, setPm] = useState("1"),
    [pb, setPb] = useState("-0.5"),
    [result, setResult] = useState<"correct" | "incorrect" | "">(""),
    [actions, setActions] = useState(0);
  const y = f(x),
    tangent = fp(x),
    vertical = Math.abs(tangent) < 1e-9,
    normal = vertical ? -2500 : -1 / tangent,
    tb = y - tangent * x,
    nb = y - normal * x;
  const reset = () => {
    setX(0.25);
    setH(0.05);
    setTab("Interaction + visualization");
    setPm("1");
    setPb("-0.5");
    setResult("");
    setActions(0);
  };
  useEffect(reset, [resetToken]);
  const act = (run: () => void) => {
    run();
    setActions((v) => v + 1);
    onInteraction();
  };
  const changeX = (v: number) =>
    act(() => setX(Math.max(-2.4, Math.min(2.1, fmt(v, 2)))));
  const check = () =>
    act(() =>
      setResult(
        Number(pm) === 1 && Number(pb) === -0.5 ? "correct" : "incorrect",
      ),
    );
  return (
    <section
      className="nln288-page"
      data-testid="calculus-mockup-0367"
      data-dedicated-lesson="288"
      data-object-model="concave-quadratic-draggable-point-tangent-negative-reciprocal-normal-right-angle-step-practice"
      data-x={x}
      data-y={fmt(y)}
      data-h={h}
      data-tangent={fmt(tangent, 4)}
      data-normal={fmt(normal, 4)}
      data-vertical={vertical}
      data-result={result}
      data-actions={actions}
    >
      <header className="nln288-hero">
        <span>
          <b>CALCULUS</b>
          <b>LIMITS AND DIFFERENTIAL CALCULUS</b>
        </span>
        <h1>Normal Line</h1>
        <p>Construct perpendicular local direction.</p>
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
                  `P=(${x},${fmt(y)}), tangent=${fmt(tangent)}, normal=${vertical ? `x=${x}` : `y=${fmt(normal)}x+${fmt(nb)}`}`,
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
      <nav className="nln288-tabs">
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
      <section className="nln288-flow">
        {[
          [
            Eye,
            "Observe",
            "A tangent touches the curve at point P(x,y). The normal line is perpendicular to the tangent at P.",
          ],
          [
            SlidersHorizontal,
            "Manipulate",
            "Drag x or h to move P along the curve. Both lines and equations update instantly.",
          ],
          [
            Lightbulb,
            "Notice",
            "The slope of the normal line is always the negative reciprocal of the tangent slope.",
          ],
          [
            Target,
            "Understand",
            "This guarantees the normal line is perpendicular to the tangent at the same selected point.",
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
      <section className="nln288-lab">
        <header>
          <h3>Normal Line – graph + CAS</h3>
          <strong>f(x) = −2x² + x</strong>
          <b>Live⌁</b>
        </header>
        <div className="workspace">
          <main>
            <div className="graph">
              <NormalGraph
                x={x}
                h={h}
                tangent={tangent}
                normal={normal}
                vertical={vertical}
                onX={changeX}
              />
              <div className="legend">
                <p>
                  <i /> Curve &nbsp; f(x)=−2x²+x
                </p>
                <p>
                  <i /> Tangent line (slope m)
                </p>
                <p>
                  <i /> Normal line (slope mₙ)
                </p>
              </div>
            </div>
            <footer>
              ⓘ The normal line is perpendicular to the tangent at the same
              selected point.
            </footer>
          </main>
          <aside>
            <article>
              <h3>Move point P</h3>
              <label>
                x{" "}
                <input
                  aria-label="Point x"
                  type="range"
                  min="-2.4"
                  max="2.1"
                  step=".01"
                  value={x}
                  onChange={(e) => changeX(Number(e.target.value))}
                />
                <output>{x.toFixed(2)}</output>
              </label>
              <label>
                Step size (h){" "}
                <input
                  aria-label="Step size h"
                  type="range"
                  min=".01"
                  max=".2"
                  step=".01"
                  value={h}
                  onChange={(e) => act(() => setH(Number(e.target.value)))}
                />
                <output>{h.toFixed(2)}</output>
              </label>
            </article>
            <article className="equations">
              <h3>Equations at P</h3>
              <p>
                <i /> Point{" "}
                <b>
                  P({x.toFixed(2)}, {y.toFixed(3)})
                </b>
              </p>
              <p>
                <i /> Tangent line{" "}
                <b>
                  y = {tangent.toFixed(4)}x + {tb.toFixed(3)}
                  <small>m = {tangent.toFixed(4)}</small>
                </b>
              </p>
              <p>
                <i /> Normal line{" "}
                <b>
                  {vertical
                    ? `x ≈ ${x.toFixed(2)} (rendered y = ${normal.toFixed(1)}x + ${nb.toFixed(3)})`
                    : `y = ${normal.toFixed(4)}x + ${nb.toFixed(3)}`}
                  <small>
                    mₙ = {vertical ? "undefined (vertical)" : normal.toFixed(4)}
                  </small>
                </b>
              </p>
            </article>
            <article className="check">
              <h3>
                <Check /> Perpendicular check
              </h3>
              <p>
                {vertical
                  ? "Horizontal tangent ⟂ vertical normal"
                  : `m × mₙ = ${tangent.toFixed(3)} × ${normal.toFixed(3)} = ${(tangent * normal).toFixed(3)}`}
              </p>
              <b>
                Result: &nbsp;
                <Check /> Perpendicular
              </b>
            </article>
          </aside>
        </div>
      </section>
      <section className="nln288-rule">
        <article>
          <h3>
            <Star /> Key Rule
          </h3>
          <p>
            If the tangent slope at P is m (with m finite), then the normal
            slope mₙ is:
          </p>
          <output>mₙ = −1/m</output>
          <p>
            Valid for all points where m exists and m ≠ 0. For m=0, the normal
            is vertical.
          </p>
        </article>
        <article>
          <h3>Why it works</h3>
          <p>
            Perpendicular lines satisfy m₁ × m₂ = −1. So the normal slope is the
            negative reciprocal of the tangent slope.
          </p>
          <output>m × mₙ = −1 &nbsp; ⇒ &nbsp; mₙ = −1/m</output>
        </article>
        <article className="mistake">
          <h3>
            <AlertTriangle /> Common Mistake
          </h3>
          <p>
            Don’t use mₙ = −m. That only makes the lines parallel with opposite
            direction, not perpendicular.
          </p>
          <MiniRule />
        </article>
      </section>
      <section className="nln288-bottom">
        <article className="worked">
          <h3>⚙ Worked Example</h3>
          <p>Find the equation of the normal line to y=−2x²+x at x=1.</p>
          {[
            "f(x)=−2x²+x",
            "f′(x)=−4x+1 ⇒ m=f′(1)=−3",
            "mₙ=−1/m=1/3",
            "Point: P(1,f(1))=(1,−1)",
            "Equation: y−(−1)=⅓(x−1)",
            "y=⅓x−4/3",
          ].map((s, i) => (
            <p key={s}>
              <i>{i + 1}</i>
              {s}
            </p>
          ))}
          <WorkedGraph />
        </article>
        <article className="practice">
          <h3>
            ✎ Practice Challenge <b>Try it yourself!</b>
          </h3>
          <p>Find the equation of the normal line to y=−2x²+x at x=0.5.</p>
          <small>Your answer (in slope-intercept form y=mx+b)</small>
          <label>
            m ={" "}
            <input
              aria-label="Normal slope answer"
              value={pm}
              onChange={(e) => {
                setPm(e.target.value);
                setResult("");
              }}
            />{" "}
            b ={" "}
            <input
              aria-label="Normal intercept answer"
              value={pb}
              onChange={(e) => {
                setPb(e.target.value);
                setResult("");
              }}
            />
          </label>
          <button onClick={check}>◎ Check Answer</button>
          <footer className={result}>
            <b>
              {result === "correct"
                ? "Correct: y = x − 0.5"
                : result === "incorrect"
                  ? "Check the negative reciprocal and point substitution."
                  : "Hint: First find f′(x). Then compute mₙ=−1/m and use point (x,f(x))."}
            </b>
          </footer>
        </article>
      </section>
      <nav className="nln288-adjacent">
        <a href="/lessons/calculus/287-tangent-line">
          <ArrowRight />
          <span>
            <small>Previous</small>Tangent Line
          </span>
        </a>
        <a href="/lessons/calculus/289-derivative-graph">
          <span>
            <small>Next</small>Derivative Graph
          </span>
          <ArrowRight />
        </a>
      </nav>
      <footer className="nln288-footer">
        <b>⚒ Math Universe</b>
        <p>
          Interactive math labs, visual proofs, NCERT explorations, graphing,
          CAS-style tools, and classroom-ready activities.
        </p>
        <nav>▣ Sitemap &nbsp; ♧ Docs &nbsp; ✉ About</nav>
        <small>
          © 2026 INDIAN SERVERS PRIVATE LIMITED. NO RIGHT TO REPRODUCE IT.
        </small>
      </footer>
    </section>
  );
}

function NormalGraph({
  x,
  h,
  tangent,
  normal,
  vertical,
  onX,
}: {
  x: number;
  h: number;
  tangent: number;
  normal: number;
  vertical: boolean;
  onX: (n: number) => void;
}) {
  const w = 500,
    hg = 430,
    sx = (n: number) => 245 + n * 82,
    sy = (n: number) => 220 - n * 58,
    y = f(x),
    path = Array.from({ length: 161 }, (_, i) => {
      const n = -2.5 + i * 0.03125;
      return `${i ? "L" : "M"}${sx(n)} ${sy(f(n))}`;
    }).join(" "),
    drag = (e: ReactPointerEvent<SVGCircleElement>) => {
      if (e.buttons !== 1 && e.type === "pointermove") return;
      if (e.type === "pointerdown")
        e.currentTarget.setPointerCapture(e.pointerId);
      const r = e.currentTarget.ownerSVGElement?.getBoundingClientRect();
      if (r) onX((((e.clientX - r.left) / r.width) * w - 245) / 82);
    };
  return (
    <svg viewBox={`0 0 ${w} ${hg}`}>
      <defs>
        <pattern
          id="nln-grid"
          width="82"
          height="58"
          patternUnits="userSpaceOnUse"
        >
          <path d="M82 0H0V58" fill="none" stroke="#e7ebf0" />
        </pattern>
      </defs>
      <rect width={w} height={hg} fill="url(#nln-grid)" />
      <line className="axis" x1="0" y1={sy(0)} x2={w} y2={sy(0)} />
      <line className="axis" x1={sx(0)} y1="0" x2={sx(0)} y2={hg} />
      <path className="curve" d={path} />
      <line
        className="tangent"
        x1={sx(-0.7)}
        y1={sy(y + tangent * (-0.7 - x))}
        x2={sx(1.2)}
        y2={sy(y + tangent * (1.2 - x))}
      />
      {vertical ? (
        <line className="normal" x1={sx(x)} y1="20" x2={sx(x)} y2="410" />
      ) : (
        <line
          className="normal"
          x1={sx(-1.5)}
          y1={sy(y + normal * (-1.5 - x))}
          x2={sx(2)}
          y2={sy(y + normal * (2 - x))}
        />
      )}
      <path
        className="right"
        d={`M${sx(x + h)} ${sy(y + tangent * h)}l${-8 * Math.cos(Math.atan(normal))} ${8 * Math.sin(Math.atan(normal))}l${-8 * Math.cos(Math.atan(tangent))} ${8 * Math.sin(Math.atan(tangent))}`}
      />
      <circle
        data-drag="normal-point"
        cx={sx(x)}
        cy={sy(y)}
        r="7"
        onPointerDown={drag}
        onPointerMove={drag}
      />
      <text className="label" x={sx(x) + 12} y={sy(y) + 7}>
        P({fmt(x, 2)}, {fmt(y, 3)})
      </text>
    </svg>
  );
}
function MiniRule() {
  return (
    <svg viewBox="0 0 280 70">
      <g transform="translate(15 8)">
        <path d="M0 45L92 12M15 14L107 47" stroke="#7b35e6" strokeWidth="2" />
        <text x="0" y="65">
          ✕ mₙ=−m (not perpendicular)
        </text>
      </g>
      <g transform="translate(155 8)">
        <path d="M0 12L100 48" stroke="#7b35e6" strokeWidth="2" />
        <path d="M50 60V0" stroke="#08a9bd" strokeWidth="2" />
        <text x="2" y="65">
          ✓ mₙ=−1/m
        </text>
      </g>
    </svg>
  );
}
function WorkedGraph() {
  return (
    <svg viewBox="0 0 220 155">
      <path
        d="M0 100Q65 10 130 100"
        fill="none"
        stroke="#087df0"
        strokeWidth="2"
      />
      <path d="M55 145L205 43" stroke="#08a9bd" strokeWidth="2" />
      <path d="M115 15L157 145" stroke="#7b35e6" strokeWidth="2" />
      <circle cx="139" cy="88" r="4" fill="#101f42" />
      <text x="142" y="108">
        P(1,−1)
      </text>
    </svg>
  );
}
