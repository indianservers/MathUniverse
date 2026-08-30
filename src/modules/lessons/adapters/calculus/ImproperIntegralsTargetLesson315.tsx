import {
  CheckCircle2,
  Eye,
  Hand,
  Lightbulb,
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
import "./ImproperIntegralsTargetLesson315.css";

type ModelName = "cauchy" | "laplace" | "gaussian";
const MODELS = {
  cauchy: {
    label: "f(x) = 1 / (1 + x²)",
    short: "1/(1+x²)",
    value: (x: number) => 1 / (1 + x * x),
    truncated: (c: number) => 2 * Math.atan(c),
    limit: Math.PI,
    exact: "π",
  },
  laplace: {
    label: "f(x) = e⁻|x|",
    short: "e⁻|x|",
    value: (x: number) => Math.exp(-Math.abs(x)),
    truncated: (c: number) => 2 * (1 - Math.exp(-c)),
    limit: 2,
    exact: "2",
  },
  gaussian: {
    label: "f(x) = e⁻ˣ²",
    short: "e⁻ˣ²",
    value: (x: number) => Math.exp(-(x * x)),
    truncated: (c: number) => simpson((x) => Math.exp(-(x * x)), -c, c),
    limit: Math.sqrt(Math.PI),
    exact: "√π",
  },
} satisfies Record<ModelName, object>;

const simpson = (fn: (x: number) => number, a: number, b: number) => {
  const n = 400;
  let sum = fn(a) + fn(b);
  for (let i = 1; i < n; i += 1)
    sum += (i % 2 ? 4 : 2) * fn(a + ((b - a) * i) / n);
  return (sum * (b - a)) / (3 * n);
};
const clean = (n: number, p = 8) => Number(n.toFixed(p));

export default function ImproperIntegralsTargetLesson315({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [c, setC] = useState(2);
  const [range, setRange] = useState(8);
  const [modelName, setModelName] = useState<ModelName>("cauchy");
  const [tab, setTab] = useState("Explore");
  const [answer, setAnswer] = useState("1");
  const [result, setResult] = useState<"" | "correct" | "incorrect">("correct");
  const [hint, setHint] = useState(false);
  const [actions, setActions] = useState(0);
  const model = MODELS[modelName];
  const accumulated = model.truncated(c);
  const remainder = Math.max(0, model.limit - accumulated);
  const converges = Number.isFinite(model.limit);
  const reset = () => {
    setC(2);
    setRange(8);
    setModelName("cauchy");
    setTab("Explore");
    setAnswer("1");
    setResult("correct");
    setHint(false);
    setActions(0);
  };
  useEffect(reset, [resetToken]);
  const act = (run: () => void) => {
    run();
    setActions((value) => value + 1);
    onInteraction();
  };
  const chooseAnswer = (value: string) => {
    setAnswer(value);
    setResult("");
  };
  return (
    <section
      className="ii315-page"
      data-testid="calculus-mockup-0394"
      data-dedicated-lesson="315"
      data-object-model="symmetric-improper-integral-truncation-tail-error-draggable-bounds-convergence-practice"
      data-c={clean(c)}
      data-range={range}
      data-model={modelName}
      data-accumulated={clean(accumulated)}
      data-limit={clean(model.limit)}
      data-remainder={clean(remainder)}
      data-converges={converges}
      data-tab={tab}
      data-answer={answer}
      data-result={result}
      data-hint={hint}
      data-actions={actions}
    >
      <header className="ii315-hero">
        <span>
          <b>CALCULUS</b>
          <b>INTEGRAL CALCULUS AND DIFFERENTIAL EQUATIONS</b>
        </span>
        <h1>Improper Integrals</h1>
        <p>Explore unbounded regions.</p>
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
          <button
            type="button"
            onClick={() => {
              reset();
              onInteraction();
            }}
          >
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
          <button
            type="button"
            onClick={() =>
              act(() => document.documentElement.requestFullscreen?.())
            }
          >
            ↗ Workspace
          </button>
        </div>
      </header>
      <nav className="ii315-tabs">
        {["Explore", "Explain", "Examples", "Practice", "Know more"].map(
          (name) => (
            <button
              type="button"
              key={name}
              className={tab === name ? "active" : ""}
              onClick={() => act(() => setTab(name))}
            >
              {name}
            </button>
          ),
        )}
      </nav>
      <section className="ii315-lab">
        <aside className="ii315-flow">
          <h3>HOW THIS WORKS</h3>
          {[
            [
              Eye,
              "Observe",
              "The curve extends indefinitely in both directions.",
            ],
            [Hand, "Manipulate", "Drag c to truncate the tails at ±c."],
            [
              Lightbulb,
              "Notice",
              "The area beyond the truncation shrinks as c increases.",
            ],
            [
              Target,
              "Understand",
              "A finite limiting total means the integral converges.",
            ],
          ].map(([Icon, title, body], index) => (
            <div className="flow-wrap" key={String(title)}>
              <article>
                <Icon />
                <b>{String(title)}</b>
                <p>{String(body)}</p>
              </article>
              {index < 3 && <span>↓</span>}
            </div>
          ))}
        </aside>
        <main className="ii315-model">
          <header>
            <div>
              <h2>Work directly on the model</h2>
              <p>
                Truncate the infinite region and observe the accumulated area.
              </p>
            </div>
            <span>Live feedback</span>
            <strong>
              <CheckCircle2 /> Converges
            </strong>
          </header>
          <p className="ii315-function">
            <b>Model:</b> f(x)={model.short} <small>(even function)</small>
          </p>
          <ImproperGraph
            c={c}
            range={range}
            model={model}
            onC={(value) => act(() => setC(value))}
          />
          <div className="ii315-bound">
            <span>−∞</span>
            <input
              aria-label="Graph truncation bound"
              type="range"
              min=".5"
              max="12"
              step=".1"
              value={c}
              onChange={(e) => act(() => setC(Number(e.target.value)))}
            />
            <span>∞</span>
          </div>
          <p className="ii315-expression">
            Truncated integral&nbsp; I(c)= ∫<sub>−c</sub>
            <sup>c</sup> {model.short} dx = <b>{accumulated.toFixed(4)}</b>
          </p>
          <section className="ii315-metrics">
            <article>
              <b>Accumulated area</b>
              <strong>{accumulated.toFixed(4)}</strong>
              <small>square units</small>
            </article>
            <article>
              <b>Total limit</b>
              <strong>{model.limit.toFixed(4)}</strong>
              <small>≈ {model.exact}</small>
            </article>
            <article>
              <b>Remainder outside ±c</b>
              <strong>{remainder.toFixed(4)}</strong>
              <small>{model.limit.toFixed(4)} − I(c)</small>
            </article>
          </section>
        </main>
        <aside className="ii315-controls">
          <article className="formula">
            I = ∫<sub>−∞</sub>
            <sup>∞</sup> {model.short} dx = {model.exact}
          </article>
          <article>
            <h3>Linked controls</h3>
            <label>
              Truncation <small>x = ±c</small>
              <input
                aria-label="Improper integral truncation"
                type="range"
                min=".5"
                max="12"
                step=".1"
                value={c}
                onChange={(e) => act(() => setC(Number(e.target.value)))}
              />
              <output>{c.toFixed(2)}</output>
            </label>
            <label>
              Tail view range <small>x</small>
              <input
                aria-label="Improper integral tail range"
                type="range"
                min="2"
                max="20"
                step="1"
                value={range}
                onChange={(e) => act(() => setRange(Number(e.target.value)))}
              />
              <output>{range}</output>
            </label>
            <label>
              Function
              <select
                aria-label="Improper integral function"
                value={modelName}
                onChange={(e) =>
                  act(() => setModelName(e.target.value as ModelName))
                }
              >
                <option value="cauchy">f(x) = 1/(1+x²)</option>
                <option value="laplace">f(x) = e⁻|x|</option>
                <option value="gaussian">f(x) = e⁻ˣ²</option>
              </select>
            </label>
          </article>
          <article>
            <h3>Interpretation</h3>
            <p>
              We approximate the improper integral by I(c)=∫<sub>−c</sub>
              <sup>c</sup>f(x)dx.
            </p>
            <p>
              As c→∞, if I(c) approaches a finite number, then the integral
              converges.
            </p>
          </article>
        </aside>
      </section>
      <section className="ii315-rule">
        <article>
          <h3>The rule</h3>
          <p>
            An improper integral converges when the limit of its truncated
            integral is finite.
          </p>
          <div>
            <strong>
              ∞ Infinite limit of integration
              <br />
              <em>
                ∫<sub>a</sub>
                <sup>∞</sup>f(x)dx = lim<sub>c→∞</sub> ∫<sub>a</sub>
                <sup>c</sup>f(x)dx
              </em>
            </strong>
            <strong>
              Finite discontinuity at x=a
              <br />
              <em>
                ∫<sub>a</sub>
                <sup>b</sup>f(x)dx = lim<sub>c→a+</sub> ∫<sub>c</sub>
                <sup>b</sup>f(x)dx
              </em>
            </strong>
          </div>
          <small>
            The same limit definition applies for an infinite lower bound, or on
            both sides of an interior discontinuity.
          </small>
        </article>
        <article className="watch">
          <h3>⚠ Watch out!</h3>
          <b>A common mistake is to plug ∞ into the integral.</b>
          <p>
            <b>Why it's wrong</b>
            Antiderivatives may diverge at infinity. Always define an improper
            integral using a limit of truncated integrals.
          </p>
        </article>
      </section>
      <section className="ii315-bottom">
        <article>
          <h3>● Worked example</h3>
          <p>
            Evaluate ∫<sub>−∞</sub>
            <sup>∞</sup> 1/(1+x²) dx.
          </p>
          <p>By the rule for infinite limits on both sides,</p>
          <p>
            I = lim<sub>c→∞</sub> ∫<sub>−c</sub>
            <sup>c</sup> 1/(1+x²) dx
          </p>
          <p>
            An antiderivative is arctan x, so I = lim<sub>c→∞</sub>2 arctan(c) =
            π.
          </p>
          <strong>Answer: ∫ 1/(1+x²) dx over ℝ = π</strong>
        </article>
        <article className="practice">
          <h3>✣ Quick practice</h3>
          <p>
            Determine whether ∫<sub>1</sub>
            <sup>∞</sup>1/x² dx converges or diverges.
          </p>
          {[
            ["1", "Converges to 1"],
            ["0", "Converges to 0"],
            ["d", "Diverges"],
          ].map(([value, label]) => (
            <label key={value}>
              <input
                type="radio"
                name="ii315-answer"
                checked={answer === value}
                onChange={() => chooseAnswer(value)}
              />
              {label}
            </label>
          ))}
          <button
            type="button"
            onClick={() =>
              act(() => setResult(answer === "1" ? "correct" : "incorrect"))
            }
          >
            Check answer
          </button>
          <button
            type="button"
            className="hint"
            onClick={() => act(() => setHint((value) => !value))}
          >
            Hint
          </button>
          <output className={result}>
            {result === "correct"
              ? "Correct! ∫₁ᶜ x⁻² dx = [−1/x]₁ᶜ = 1 − 1/c, and its limit is 1."
              : result === "incorrect"
                ? "Try evaluating the truncated antiderivative."
                : hint
                  ? "Use [−1/x] from 1 to c, then let c→∞."
                  : ""}
          </output>
        </article>
      </section>
      <nav className="ii315-adjacent">
        <a href="/lessons/calculus/314-partial-fractions">
          ←{" "}
          <span>
            <small>Previous</small>Partial Fractions
          </span>
        </a>
        <a href="/lessons/calculus/316-numerical-integration">
          <span>
            <small>Next</small>Numerical Integration
          </span>{" "}
          →
        </a>
      </nav>
      <footer className="ii315-footer">
        <div>
          <b>Math Universe</b>
          <p>
            Interactive math labs, visual proofs, NCERT explorations, graphing,
            CAS-style tools, and classroom-ready activities.
          </p>
        </div>
        <nav>
          <a href="/sitemap">Sitemap</a>
          <a href="/docs">Docs</a>
          <a href="/about">About</a>
        </nav>
        <small>
          © 2026 INDIAN SERVERS PRIVATE LIMITED. NO RIGHT TO REPRODUCE IT.
        </small>
        <span>www.IndianServers.com &nbsp;&nbsp; info@IndianServers.com</span>
      </footer>
    </section>
  );
}

function ImproperGraph({
  c,
  range,
  model,
  onC,
}: {
  c: number;
  range: number;
  model: (typeof MODELS)[ModelName];
  onC: (value: number) => void;
}) {
  const points = useMemo(
    () =>
      Array.from({ length: 241 }, (_, i) => {
        const x = -range + (2 * range * i) / 240;
        return [x, model.value(x)] as const;
      }),
    [model, range],
  );
  const w = 440,
    h = 270,
    pad = 30;
  const sx = (x: number) => pad + ((x + range) / (2 * range)) * (w - 2 * pad);
  const sy = (y: number) => h - pad - (y / 1.25) * (h - 2 * pad);
  const curve = points
    .map(([x, y], i) => `${i ? "L" : "M"}${sx(x)},${sy(y)}`)
    .join(" ");
  const inside = points.filter(([x]) => x >= -c && x <= c);
  const area = inside.length
    ? `M${sx(inside[0][0])},${sy(0)} ${inside.map(([x, y]) => `L${sx(x)},${sy(y)}`).join(" ")} L${sx(inside.at(-1)![0])},${sy(0)}Z`
    : "";
  const drag = (e: ReactPointerEvent<SVGCircleElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    const box = e.currentTarget.ownerSVGElement?.getBoundingClientRect();
    if (!box) return;
    const move = (event: PointerEvent) =>
      onC(
        Math.max(
          0.5,
          Math.min(
            12,
            Math.abs(
              -range + ((event.clientX - box.left) / box.width) * 2 * range,
            ),
          ),
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
    <svg
      className="ii315-graph"
      viewBox={`0 0 ${w} ${h}`}
      aria-label="Improper integral graph"
    >
      {Array.from({ length: 9 }, (_, i) => (
        <line
          key={i}
          x1={pad + (i * (w - 2 * pad)) / 8}
          y1={pad}
          x2={pad + (i * (w - 2 * pad)) / 8}
          y2={h - pad}
          className="grid"
        />
      ))}
      <line x1={pad} y1={sy(0)} x2={w - pad} y2={sy(0)} className="axis" />
      <line x1={sx(0)} y1={pad} x2={sx(0)} y2={h - pad} className="axis" />
      <path d={area} className="area" />
      <path d={curve} className="curve" />
      {[-c, c].map((value) => (
        <g key={value}>
          <line
            x1={sx(value)}
            y1={sy(0)}
            x2={sx(value)}
            y2={sy(model.value(value))}
            className="bound-line"
          />
          <text
            x={sx(value)}
            y={sy(model.value(value)) - 8}
            textAnchor="middle"
          >
            x={value < 0 ? "−c" : "c"}
          </text>
        </g>
      ))}
      <circle
        data-drag="improper-bound"
        cx={sx(c)}
        cy={sy(model.value(c))}
        r="7"
        onPointerDown={drag}
      />
      <text x={w / 2} y={h - 7} textAnchor="middle">
        c = {c.toFixed(2)}
      </text>
    </svg>
  );
}
