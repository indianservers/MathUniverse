import {
  CheckCircle2,
  Eye,
  Hand,
  Lightbulb,
  RotateCcw,
  Share2,
  Target,
  Trash2,
} from "lucide-react";
import {
  useEffect,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import type { LessonAdapterProps } from "../../types";
import "./SubstitutionTargetLesson312.css";

type UKey = "square" | "linear" | "sine";
type ScaleKey = "exact" | "half" | "double";
const substitutions: Record<
  UKey,
  { label: string; u: (x: number) => number; du: (x: number) => number }
> = {
  square: { label: "x²", u: (x) => x * x, du: (x) => 2 * x },
  linear: { label: "3x + 1", u: (x) => 3 * x + 1, du: () => 3 },
  sine: { label: "sin(x)", u: (x) => Math.sin(x), du: (x) => Math.cos(x) },
};
const clean = (n: number, p = 6) =>
  Math.abs(n) < 1e-10 ? 0 : Number(n.toFixed(p));
const midpointIntegral = (
  f: (x: number) => number,
  a: number,
  b: number,
  n = 1000,
) => {
  const dx = (b - a) / n;
  let sum = 0;
  for (let i = 0; i < n; i++) sum += f(a + (i + 0.5) * dx) * dx;
  return sum;
};
export default function SubstitutionTargetLesson312({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [uKey, setUKey] = useState<UKey>("square"),
    [scale, setScale] = useState<ScaleKey>("exact"),
    [a, setA] = useState(-1),
    [b, setB] = useState(1),
    [tab, setTab] = useState("Interaction + visualization"),
    [answer, setAnswer] = useState(""),
    [showSolution, setShowSolution] = useState(false),
    [actions, setActions] = useState(0);
  const sub = substitutions[uKey],
    factor = scale === "exact" ? 1 : scale === "half" ? 0.5 : 2,
    integrand = (x: number) => factor * sub.du(x) * Math.cos(sub.u(x)),
    integral = midpointIntegral(integrand, a, b),
    ua = sub.u(a),
    ub = sub.u(b),
    crossesTurning = uKey === "square" && a < 0 && b > 0,
    orientation =
      ub > ua
        ? "preserved"
        : ub < ua
          ? "reversed"
          : crossesTurning
            ? "split at x=0"
            : "degenerate";
  const reset = () => {
    setUKey("square");
    setScale("exact");
    setA(-1);
    setB(1);
    setTab("Interaction + visualization");
    setAnswer("");
    setShowSolution(false);
    setActions(0);
  };
  useEffect(reset, [resetToken]);
  const act = (run: () => void) => {
    run();
    setActions((v) => v + 1);
    onInteraction();
  };
  const bound = (which: "a" | "b", value: number) =>
    act(() =>
      which === "a"
        ? setA(Math.min(value, b - 0.1))
        : setB(Math.max(value, a + 0.1)),
    );
  const correct = answer === "A";
  return (
    <section
      className="sub312-page"
      data-testid="calculus-mockup-0391"
      data-dedicated-lesson="312"
      data-object-model="branch-aware-x-to-u-substitution-du-scaling-dual-bound-drag-linked-graphs-transformed-integral-practice"
      data-u={uKey}
      data-scale={scale}
      data-a={clean(a)}
      data-b={clean(b)}
      data-ua={clean(ua)}
      data-ub={clean(ub)}
      data-orientation={orientation}
      data-integral={clean(integral)}
      data-tab={tab}
      data-answer={answer}
      data-solution={showSolution}
      data-actions={actions}
    >
      <header className="sub312-hero">
        <span>
          <b>CALCULUS</b>
          <b>INTEGRAL CALCULUS AND DIFFERENTIAL EQUATIONS</b>
        </span>
        <h1>Substitution</h1>
        <p>Reverse the chain rule.</p>
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
          <button type="button" onClick={() => act(reset)}>
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
          <a href="/graphing-calculator">▣ Workspace</a>
        </div>
        <aside>
          <b>Core rule</b>
          <strong>∫f(g(x))g′(x)dx = ∫f(u)du</strong>
          <p>Let u=g(x) ⇒ du=g′(x)dx</p>
        </aside>
      </header>
      <nav className="sub312-tabs">
        {[
          "Interaction + visualization",
          "Explain",
          "Examples",
          "Formulas",
          "Know more",
        ].map((name) => (
          <button
            type="button"
            key={name}
            className={tab === name ? "active" : ""}
            onClick={() => act(() => setTab(name))}
          >
            {name}
          </button>
        ))}
      </nav>
      <section className="sub312-flow">
        {[
          [
            Eye,
            "OBSERVE",
            "See the original integrand in x-space and its mapped region.",
          ],
          [
            Hand,
            "MANIPULATE",
            "Change u, scale du, and adjust the bounds. See the mapped u-interval.",
          ],
          [
            Lightbulb,
            "NOTICE",
            "The area under y=f(x) maps to the area under the transformed integrand.",
          ],
          [
            Target,
            "UNDERSTAND",
            "Substitution converts the integral into a simpler form in u, with correct bounds.",
          ],
        ].map(([Icon, title, text]) => (
          <article key={String(title)}>
            <Icon />
            <b>{String(title)}</b>
            <p>{String(text)}</p>
          </article>
        ))}
      </section>
      <section className="sub312-mapper">
        <header>
          <h2>SUBSTITUTION MAPPER: x-SPACE → u-SPACE</h2>
          <span>
            <CheckCircle2 /> All consistent
          </span>
          <button type="button" onClick={() => act(reset)}>
            <Trash2 /> Clear all
          </button>
        </header>
        <main>
          <section>
            <h3>
              x-SPACE <small>(original)</small>
            </h3>
            <p>
              y = {factor}g′(x) cos(g(x)), where g(x)={sub.label}
            </p>
            <XGraph a={a} b={b} fn={integrand} onBound={bound} />
            <b>━ x-integration bounds</b>
            <strong>
              a={a.toFixed(2)}, b={b.toFixed(2)}
            </strong>
          </section>
          <article>
            <h3>u=g(x)={sub.label}</h3>
            <strong>
              du=
              {scale === "exact"
                ? "g′(x) dx"
                : scale === "half"
                  ? "½g′(x) dx"
                  : "2g′(x) dx"}
            </strong>
            <div>
              <b>Map bounds</b>
              <p>
                u(a)=g(a)={clean(ua, 4)}
                <br />
                u(b)=g(b)={clean(ub, 4)}
              </p>
              <em>
                {crossesTurning
                  ? "Interval crosses a turning point; split into two monotone branches."
                  : `Order is ${orientation}.`}
              </em>
            </div>
            <i>↓</i>
            <aside>
              <b>u-interval</b>
              <p>
                {crossesTurning ? `[${ua},0] and [0,${ub}]` : `[${ua},${ub}]`}
              </p>
            </aside>
          </article>
          <section>
            <h3>
              u-SPACE <small>(transformed)</small>
            </h3>
            <p>Y = {factor} cos(u)</p>
            <UGraph ua={ua} ub={ub} split={crossesTurning} />
            <b>━ u-integration bounds</b>
            <strong>
              {crossesTurning
                ? "two oriented branches"
                : `u∈[${clean(ua, 3)},${clean(ub, 3)}]`}
            </strong>
          </section>
        </main>
        <footer>
          <section>
            <h3>Controls</h3>
            <label>
              Choose u=g(x)
              <select
                aria-label="Substitution u function"
                value={uKey}
                onChange={(e) => act(() => setUKey(e.target.value as UKey))}
              >
                {Object.entries(substitutions).map(([key, value]) => (
                  <option key={key} value={key}>
                    {value.label}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Scale du=k dx
              <select
                aria-label="Substitution differential scale"
                value={scale}
                onChange={(e) =>
                  act(() => setScale(e.target.value as ScaleKey))
                }
              >
                <option value="exact">exact g′(x)</option>
                <option value="half">half derivative</option>
                <option value="double">double derivative</option>
              </select>
            </label>
            <label>
              x-bounds [a,b]
              <input
                aria-label="Substitution lower bound"
                type="number"
                min="-2"
                max="1.9"
                step=".1"
                value={a}
                onChange={(e) => bound("a", Number(e.target.value))}
              />
              <input
                aria-label="Substitution upper bound"
                type="number"
                min="-1.9"
                max="2"
                step=".1"
                value={b}
                onChange={(e) => bound("b", Number(e.target.value))}
              />
            </label>
          </section>
          <section>
            <h3>Results</h3>
            <p>
              u(a)={clean(ua, 4)}
              <br />
              u(b)={clean(ub, 4)}
            </p>
            <b>Order: {orientation}</b>
            <p>Differential: {scale}</p>
            <strong>Numerical integral: {clean(integral, 6)}</strong>
          </section>
          <section>
            <h3>Integral transformation</h3>
            <p>
              ∫<sub>{a}</sub>
              <sup>{b}</sup>
              {factor}g′(x)cos(g(x))dx
            </p>
            <strong>
              = {crossesTurning ? "split branches → " : ""}
              {factor}∫cos(u)du
              <br />= {clean(integral, 6)}
            </strong>
            <CheckCircle2 />
          </section>
        </footer>
      </section>
      <section className="sub312-cards">
        <article>
          <h3>Worked example (exact)</h3>
          <p>Compute I=∫x cos(x²)dx.</p>
          <strong>
            Let u=x² ⇒ du=2x dx ⇒ x dx=½du
            <br />
            I=½∫cos(u)du=½sin(u)+C
            <br />
            =½sin(x²)+C
          </strong>
          <b>I=½sin(x²)+C ✓</b>
        </article>
        <article className="misconception">
          <h3>⚠ Common misconception</h3>
          <b>Forgetting to change the bounds or their order.</b>
          <p>
            If a map decreases on [a,b], reverse the transformed bounds. If it
            turns, split the interval into monotone branches.
          </p>
          <strong>Correct: preserve orientation on every branch.</strong>
        </article>
        <article className="practice">
          <h3>Practice challenge</h3>
          <p>Use substitution to evaluate ∫2x sin(x²)dx.</p>
          {[
            ["A", "-cos(x²)+C"],
            ["B", "cos(x²)+C"],
            ["C", "½sin(x²)+C"],
            ["D", "2cos(x²)+C"],
          ].map(([key, text]) => (
            <label key={key}>
              <input
                type="radio"
                name="sub312-answer"
                value={key}
                checked={answer === key}
                onChange={(e) =>
                  act(() => {
                    setAnswer(e.target.value);
                    setShowSolution(false);
                  })
                }
              />
              <b>{key}</b>
              {text}
            </label>
          ))}
          <button
            type="button"
            onClick={() => act(() => setShowSolution(true))}
          >
            Try it
          </button>
          {showSolution && (
            <output className={correct ? "correct" : "incorrect"}>
              {correct
                ? "Correct. Let u=x², du=2x dx."
                : "Try matching the derivative 2x dx."}
            </output>
          )}
        </article>
      </section>
      <nav className="sub312-adjacent">
        <a href="/lessons/calculus/311-area-between-curves">
          ←{" "}
          <span>
            <small>PREVIOUS</small>Area Between Curves
          </span>
        </a>
        <a href="/lessons/calculus/313-integration-by-parts">
          <span>
            <small>NEXT</small>Integration by Parts
          </span>{" "}
          →
        </a>
      </nav>
      <footer className="sub312-footer">
        <b>⌁ Math Universe</b>
        <p>
          Interactive math labs, visual proofs, NCERT explorations, graphing,
          CAS-style tools, and classroom-ready activities.
        </p>
        <nav>▥ Sitemap | ⚑ Docs | ✉ About</nav>
        <small>© 2026 INDIAN SERVERS PRIVATE LIMITED.</small>
      </footer>
    </section>
  );
}

function XGraph({
  a,
  b,
  fn,
  onBound,
}: {
  a: number;
  b: number;
  fn: (x: number) => number;
  onBound: (which: "a" | "b", value: number) => void;
}) {
  const w = 290,
    h = 265,
    sx = (x: number) => ((x + 2.2) / 4.4) * w,
    sy = (y: number) => h - ((y + 2.5) / 5) * h,
    path = Array.from({ length: 151 }, (_, i) => {
      const x = -2.1 + (i * 4.2) / 150;
      return `${i ? "L" : "M"}${sx(x)},${sy(fn(x))}`;
    }).join(" ");
  const region = Array.from({ length: 80 }, (_, i) => {
    const x = a + ((b - a) * i) / 79;
    return `${sx(x)},${sy(fn(x))}`;
  });
  const drag = (which: "a" | "b") => (e: ReactPointerEvent<SVGLineElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    const box = e.currentTarget.ownerSVGElement?.getBoundingClientRect();
    if (!box) return;
    const move = (p: PointerEvent) =>
      onBound(
        which,
        Math.max(
          -2,
          Math.min(2, -2.2 + ((p.clientX - box.left) / box.width) * 4.4),
        ),
      );
    const up = () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  };
  return (
    <svg className="sub312-xgraph" viewBox={`0 0 ${w} ${h}`}>
      <path
        d={`M${sx(a)},${sy(0)} L${region.join(" L")} L${sx(b)},${sy(0)}Z`}
        className="area"
      />
      <line x1="0" y1={sy(0)} x2={w} y2={sy(0)} className="axis" />
      <line x1={sx(0)} y1="0" x2={sx(0)} y2={h} className="axis" />
      <path d={path} className="curve" />
      {[
        ["a", a],
        ["b", b],
      ].map(([which, value]) => (
        <line
          key={String(which)}
          data-drag={`substitution-${which}`}
          x1={sx(Number(value))}
          y1="20"
          x2={sx(Number(value))}
          y2={h - 20}
          className="bound"
          onPointerDown={drag(which as "a" | "b")}
        />
      ))}
    </svg>
  );
}
function UGraph({ ua, ub, split }: { ua: number; ub: number; split: boolean }) {
  const w = 290,
    h = 265,
    sx = (u: number) => ((u + 2) / 4) * w,
    sy = (y: number) => h - ((y + 1.5) / 3) * h,
    path = Array.from({ length: 120 }, (_, i) => {
      const u = -2 + (i * 4) / 119;
      return `${i ? "L" : "M"}${sx(u)},${sy(Math.cos(u))}`;
    }).join(" ");
  return (
    <svg className="sub312-ugraph" viewBox={`0 0 ${w} ${h}`}>
      <line x1="0" y1={sy(0)} x2={w} y2={sy(0)} className="axis" />
      <line x1={sx(0)} y1="0" x2={sx(0)} y2={h} className="axis" />
      <path d={path} className="curve" />
      <line x1={sx(ua)} y1="25" x2={sx(ua)} y2={h - 20} className="bound" />
      <line x1={sx(ub)} y1="25" x2={sx(ub)} y2={h - 20} className="bound" />
      {split && <circle cx={sx(0)} cy={sy(1)} r="6" />}
    </svg>
  );
}
