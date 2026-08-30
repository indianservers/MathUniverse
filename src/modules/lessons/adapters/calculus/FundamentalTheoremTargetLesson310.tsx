import {
  Eye,
  Hand,
  Lightbulb,
  Maximize2,
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
import "./FundamentalTheoremTargetLesson310.css";

type FnKey = "cubic" | "quadratic" | "sine";
const defs = {
  cubic: {
    label: "f(t) = (1/3)t³ - t",
    f: (t: number) => t ** 3 / 3 - t,
    F: (t: number) => t ** 4 / 12 - t ** 2 / 2,
  },
  quadratic: {
    label: "f(t) = t² - 2",
    f: (t: number) => t * t - 2,
    F: (t: number) => t ** 3 / 3 - 2 * t,
  },
  sine: {
    label: "f(t) = sin(t) + 1",
    f: (t: number) => Math.sin(t) + 1,
    F: (t: number) => -Math.cos(t) + t,
  },
};
const clean = (n: number, p = 6) =>
  Math.abs(n) < 1e-10 ? 0 : Number(n.toFixed(p));
const norm = (s: string) =>
  s
    .toLowerCase()
    .replace(/\s+/g, "")
    .replace(/\^/g, "")
    .replace(/²/g, "2")
    .replace(/³/g, "3")
    .replace(/\*/g, "");
export default function FundamentalTheoremTargetLesson310({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [x, setX] = useState(2.5),
    [a, setA] = useState(-1),
    [fnKey, setFnKey] = useState<FnKey>("cubic"),
    [tab, setTab] = useState("Interaction + visualization"),
    [areaAnswer, setAreaAnswer] = useState(""),
    [derivativeAnswer, setDerivativeAnswer] = useState(""),
    [hint, setHint] = useState(false),
    [result, setResult] = useState<"" | "correct" | "incorrect">(""),
    [actions, setActions] = useState(0);
  const def = defs[fnKey],
    area = useMemo(() => def.F(x) - def.F(a), [a, x, def]),
    instant = def.f(x);
  const reset = () => {
    setX(2.5);
    setA(-1);
    setFnKey("cubic");
    setTab("Interaction + visualization");
    setAreaAnswer("");
    setDerivativeAnswer("");
    setHint(false);
    setResult("");
    setActions(0);
  };
  useEffect(reset, [resetToken]);
  const act = (run: () => void) => {
    run();
    setActions((v) => v + 1);
    onInteraction();
  };
  const setBound = (which: "x" | "a", value: number) =>
    act(() => (which === "x" ? setX(value) : setA(value)));
  const check = () =>
    act(() => {
      const A = norm(areaAnswer),
        D = norm(derivativeAnswer);
      setResult(
        ["2/3x3-3/2x2+x", "(2/3)x3-(3/2)x2+x"].includes(A) &&
          ["2x2-3x+1", "2x²-3x+1"].includes(D)
          ? "correct"
          : "incorrect",
      );
    });
  return (
    <section
      className="ftc310-page"
      data-testid="calculus-mockup-0389"
      data-dedicated-lesson="310"
      data-object-model="accumulation-function-dual-bound-drag-selectable-integrand-area-instant-rate-ftc-symbolic-practice"
      data-x={x}
      data-a={a}
      data-function={fnKey}
      data-area={clean(area)}
      data-instant={clean(instant)}
      data-tab={tab}
      data-result={result}
      data-hint={hint}
      data-actions={actions}
    >
      <header className="ftc310-hero">
        <span>
          <b>CALCULUS</b>
          <b>INTEGRAL CALCULUS AND DIFFERENTIAL EQUATIONS</b>
        </span>
        <h1>Fundamental Theorem</h1>
        <p>Connect differentiation and accumulation.</p>
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
          <a href="/graphing-calculator">↗ Workspace</a>
        </div>
      </header>
      <nav className="ftc310-tabs">
        {[
          "Interaction + visualization",
          "Explain",
          "Examples",
          "Formulas",
          "Key ideas",
          "Checkpoints",
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
      <section className="ftc310-lab">
        <header>
          <b>MOVING UPPER BOUND:</b>
          <strong>
            A(x)=∫<sub>a</sub>
            <sup>x</sup>f(t)dt and A′(x)=f(x)
          </strong>
          <span>Model is valid</span>
          <em>{actions} actions</em>
          <button
            type="button"
            aria-label="Full screen model"
            onClick={() =>
              act(() => void document.documentElement.requestFullscreen?.())
            }
          >
            <Maximize2 />
          </button>
        </header>
        <main>
          <aside>
            {[
              [
                Eye,
                "Observe",
                "The shaded area A(x) is the accumulation of f(t) from a to x.",
              ],
              [
                Hand,
                "Manipulate",
                "Drag the upper bound x or change a and f(t) using the controls.",
              ],
              [
                Lightbulb,
                "Notice",
                "As x moves, A(x) grows or shrinks. Its rate of change equals f(x).",
              ],
              [
                Target,
                "Understand",
                "This is the Fundamental Theorem of Calculus.",
              ],
            ].map(([Icon, title, text]) => (
              <article key={String(title)}>
                <Icon />
                <h3>{String(title)}</h3>
                <p>{String(text)}</p>
              </article>
            ))}
          </aside>
          <AccumulationGraph
            a={a}
            x={x}
            fnKey={fnKey}
            onX={(value) => setBound("x", value)}
          />
          <aside className="controls">
            <h3>CONTROLS</h3>
            <label>
              Upper bound x
              <input
                aria-label="FTC upper bound"
                type="range"
                min="-1"
                max="5"
                step=".25"
                value={x}
                onChange={(e) => setBound("x", Number(e.target.value))}
              />
              <output>{x.toFixed(2)}</output>
            </label>
            <label>
              Lower bound a
              <input
                aria-label="FTC lower bound"
                type="range"
                min="-2"
                max="2"
                step=".25"
                value={a}
                onChange={(e) => setBound("a", Number(e.target.value))}
              />
              <output>{a.toFixed(2)}</output>
            </label>
            <label>
              Function f(t)
              <select
                aria-label="FTC integrand"
                value={fnKey}
                onChange={(e) => act(() => setFnKey(e.target.value as FnKey))}
              >
                {Object.entries(defs).map(([key, value]) => (
                  <option key={key} value={key}>
                    {value.label}
                  </option>
                ))}
              </select>
            </label>
            <p>
              Domain
              <br />
              <b>[-2,5]</b>
            </p>
            <p>
              Instant values
              <br />
              <b>A(x) = {clean(area, 4)}</b>
              <br />
              <b>f(x) = {clean(instant, 4)}</b>
            </p>
          </aside>
        </main>
        <footer>
          <article>
            <b>
              INPUT <small>(Choose x)</small>
            </b>
            <strong>x = {x.toFixed(2)}</strong>
            <p>a = {a}</p>
          </article>
          <i>→</i>
          <article>
            <b>
              TRANSFORMATION <small>(Accumulate)</small>
            </b>
            <strong>
              A(x)=∫<sub>a</sub>
              <sup>x</sup>f(t)dt
            </strong>
            <p>Accumulated signed area from a to x.</p>
          </article>
          <i>→</i>
          <article>
            <b>
              OUTPUT <small>(Result)</small>
            </b>
            <strong>
              A(x)={clean(area, 4)}
              <br />
              A′(x)=f(x)={clean(instant, 4)}
            </strong>
          </article>
        </footer>
      </section>
      <section className="ftc310-theorem">
        <article>
          <h3>
            THE FUNDAMENTAL THEOREM <small>(First Part)</small>
          </h3>
          <p>
            If f is continuous on [a,b] and F(x)=∫<sub>a</sub>
            <sup>x</sup>f(t)dt, then
          </p>
          <strong>F′(x)=f(x) for all x∈(a,b).</strong>
        </article>
        <article>
          <h3>Why it’s true (intuition)</h3>
          <p>
            When x increases by a tiny amount h, the new area added is
            approximately f(x)h, the area of a thin rectangle.
          </p>
          <p>Divide by h and take h→0 to get F′(x)=f(x).</p>
          <b>▱</b>
        </article>
      </section>
      <section className="ftc310-worked">
        <article>
          <h3>
            WORKED EXAMPLE <small>(Correct and complete)</small>
          </h3>
          <p>Let f(t)=(1/3)t³-t and a=-1. Find A(x) and A′(x).</p>
          <b>Solution</b>
          <strong>
            A(x)=[t⁴/12-t²/2]<sub>-1</sub>
            <sup>x</sup>
            <br />
            =x⁴/12-x²/2+5/12
            <br />
            A′(x)=x³/3-x=f(x)
          </strong>
          <aside>
            Verify with the model
            <br />
            Model A(x)={clean(area, 4)} ✓<br />
            Model A′(x)={clean(instant, 4)} ✓
          </aside>
        </article>
        <article>
          <h3>⚠ MISCONCEPTION WARNING</h3>
          <p>
            Common error: differentiating the integrand instead of the
            accumulation.
          </p>
          <strong>
            d/dx ∫<sub>a</sub>
            <sup>x</sup>f(t)dt = f(x)
          </strong>
          <p>
            The integrand uses t as a dummy variable; only the upper limit
            changes with x.
          </p>
        </article>
      </section>
      <section className="ftc310-practice">
        <h3>
          QUICK CHECK <small>(Practice)</small>
        </h3>
        <p>Find A(x) and A′(x). Let f(t)=2t²-3t+1 and a=0.</p>
        <label>
          A(x)=∫<sub>0</sub>
          <sup>x</sup>(2t²-3t+1)dt ={" "}
          <input
            aria-label="FTC practice accumulation"
            value={areaAnswer}
            onChange={(e) => {
              setAreaAnswer(e.target.value);
              setResult("");
            }}
          />
        </label>
        <label>
          A′(x)={" "}
          <input
            aria-label="FTC practice derivative"
            value={derivativeAnswer}
            onChange={(e) => {
              setDerivativeAnswer(e.target.value);
              setResult("");
            }}
          />
        </label>
        <button type="button" onClick={check}>
          Check answer
        </button>
        <output className={result}>
          {result === "correct"
            ? "Correct: accumulation and derivative agree."
            : result === "incorrect"
              ? "Integrate term-by-term, then differentiate."
              : ""}
        </output>
        <aside>
          <button type="button" onClick={() => act(() => setHint((v) => !v))}>
            ☼ Need a hint?
          </button>
          {hint && (
            <p>1) Integrate each power. 2) Differentiate your result.</p>
          )}
        </aside>
      </section>
      <nav className="ftc310-adjacent">
        <a href="/lessons/calculus/309-indefinite-integral">
          ←{" "}
          <span>
            <small>Previous</small>Indefinite Integral
          </span>
        </a>
        <a href="/lessons/calculus/311-area-between-curves">
          <span>
            <small>Next</small>Area Between Curves
          </span>{" "}
          →
        </a>
      </nav>
    </section>
  );
}

function AccumulationGraph({
  a,
  x,
  fnKey,
  onX,
}: {
  a: number;
  x: number;
  fnKey: FnKey;
  onX: (value: number) => void;
}) {
  const w = 430,
    h = 420,
    def = defs[fnKey],
    sx = (v: number) => ((v + 2) / 7) * w,
    sy = (v: number) => h - ((v + 3) / 8) * h;
  const curve = Array.from({ length: 141 }, (_, i) => {
    const t = -2 + (i * 7) / 140;
    return `${i ? "L" : "M"}${sx(t)},${sy(def.f(t))}`;
  }).join(" ");
  const lo = Math.min(a, x),
    hi = Math.max(a, x),
    area = Array.from({ length: 80 }, (_, i) => {
      const t = lo + ((hi - lo) * i) / 79;
      return `${sx(t)},${sy(def.f(t))}`;
    });
  const drag = (e: ReactPointerEvent<SVGCircleElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    const box = e.currentTarget.ownerSVGElement?.getBoundingClientRect();
    if (!box) return;
    const move = (p: PointerEvent) =>
      onX(
        Math.round(
          Math.max(
            -1,
            Math.min(5, -2 + ((p.clientX - box.left) / box.width) * 7),
          ) * 4,
        ) / 4,
      );
    const up = () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  };
  return (
    <svg className="ftc310-graph" viewBox={`0 0 ${w} ${h}`}>
      {Array.from({ length: 15 }, (_, i) => i).map((i) => (
        <line
          key={i}
          x1={(i * w) / 14}
          y1="0"
          x2={(i * w) / 14}
          y2={h}
          className="grid"
        />
      ))}
      <path
        d={`M${sx(lo)},${sy(0)} L${area.join(" L")} L${sx(hi)},${sy(0)} Z`}
        className={x >= a ? "area" : "area reverse"}
      />
      <line x1="0" y1={sy(0)} x2={w} y2={sy(0)} className="axis" />
      <line x1={sx(0)} y1="0" x2={sx(0)} y2={h} className="axis" />
      <path d={curve} className="curve" />
      <circle cx={sx(a)} cy={sy(def.f(a))} r="5" />
      <circle
        data-drag="ftc-x"
        cx={sx(x)}
        cy={sy(def.f(x))}
        r="7"
        onPointerDown={drag}
      />
      <line
        x1={sx(x)}
        y1={sy(0)}
        x2={sx(x)}
        y2={sy(def.f(x))}
        className="bound"
      />
      <text x={sx(a) - 18} y={sy(0) + 28}>
        a={a}
      </text>
      <text x={sx(x) - 18} y={sy(0) + 28}>
        x={x}
      </text>
      <text x="255" y="70">
        {def.label}
      </text>
    </svg>
  );
}
