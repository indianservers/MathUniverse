import { Maximize2, RotateCcw, Share2 } from "lucide-react";
import { useEffect, useState } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";
import type { LessonAdapterProps } from "../../types";
import "./BinomialSeriesTargetLesson345.css";
const tabs = [
    "Interaction + visualization",
    "Explain",
    "Examples",
    "Formulas",
    "Know more",
  ],
  clean = (v: number) => Number(v.toFixed(9));
const coefficients = (alpha: number, count: number) => {
  const values = [1];
  for (let k = 1; k < count; k += 1)
    values.push((values[k - 1] * (alpha - k + 1)) / k);
  return values;
};
export default function BinomialSeriesTargetLesson345({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [alpha, setAlpha] = useState(0.75),
    [x, setX] = useState(0.4),
    [count, setCount] = useState(6),
    [selectedK, setSelectedK] = useState(3),
    [tab, setTab] = useState(tabs[0]),
    [question, setQuestion] = useState(0),
    [quick, setQuick] = useState<"" | "correct" | "incorrect">(""),
    [fullscreen, setFullscreen] = useState(false),
    [actions, setActions] = useState(0);
  const coeffs = coefficients(alpha, 21),
    terms = coeffs.slice(0, count).map((c, k) => c * x ** k),
    partials = terms.reduce<number[]>(
      (a, v) => [...a, v + (a.at(-1) ?? 0)],
      [],
    ),
    partial = partials.at(-1) ?? 0,
    target = (1 + x) ** alpha,
    error = Math.abs(partial - target),
    errors = Array.from({ length: 21 }, (_, n) =>
      Math.abs(
        coeffs.slice(0, n + 1).reduce((s, c, k) => s + c * x ** k, 0) - target,
      ),
    );
  const samples = Array.from(
      { length: 81 },
      (_, i) => -0.9 + (1.8 * i) / 80,
    ).map((v) => ({
      x: v,
      target: (1 + v) ** alpha,
      partial: coeffs.slice(0, count).reduce((s, c, k) => s + c * v ** k, 0),
    })),
    yMax = Math.max(2.5, ...samples.flatMap((p) => [p.target, p.partial])),
    gx = (v: number) => 35 + ((v + 0.9) / 1.8) * 530,
    gy = (v: number) => 195 - (v / yMax) * 165,
    path = (key: "target" | "partial") =>
      samples
        .map(
          (p, i) =>
            `${i ? "L" : "M"}${gx(p.x).toFixed(2)} ${gy(p[key]).toFixed(2)}`,
        )
        .join(" ");
  const reset = () => {
    setAlpha(0.75);
    setX(0.4);
    setCount(6);
    setSelectedK(3);
    setTab(tabs[0]);
    setQuestion(0);
    setQuick("");
    setFullscreen(false);
    setActions(0);
  };
  useEffect(reset, [resetToken]);
  const act = (run: () => void) => {
    run();
    setActions((v) => v + 1);
    onInteraction();
  };
  const drag = (e: ReactPointerEvent<SVGCircleElement>) => {
    if (e.buttons !== 1) return;
    const r = e.currentTarget.ownerSVGElement?.getBoundingClientRect();
    if (!r) return;
    const value =
      -0.9 + Math.max(0, Math.min(1, (e.clientX - r.left) / r.width)) * 1.8;
    act(() => {
      setX(clean(value));
      setQuick("");
    });
  };
  const expansion = coeffs
      .slice(0, count)
      .map(
        (c, k) =>
          `${k && c >= 0 ? "+" : ""}${clean(c)}${k ? `x${k > 1 ? `^${k}` : ""}` : ""}`,
      )
      .join(" "),
    challenges = [
      {
        label: "First three non-constant terms of (1+x)^0.5",
        choices: [
          "0.5x + 0.125x^2 + 0.0625x^3",
          "0.5x - 0.125x^2 + 0.0625x^3",
          "-0.5x + 0.125x^2 - 0.0625x^3",
          "0.5x - 0.0625x^2 + 0.03125x^3",
        ],
        correct: 1,
      },
      {
        label: "The basic real convergence domain is:",
        choices: ["|x|<1", "|x|>1", "all x", "x=0 only"],
        correct: 0,
      },
    ];
  return (
    <section
      className={`seq345-page${fullscreen ? " fullscreen" : ""}`}
      data-testid="sequence-mockup-0530"
      data-object-model="generalized-binomial-exponent-evaluation-point-truncation-recursive-coefficients-target-partial-graph-draggable-evaluation-point-expansion-partial-table-error-by-order-endpoint-rules-multi-question-practice"
      data-alpha={alpha}
      data-x={x}
      data-count={count}
      data-selected-k={selectedK}
      data-coefficients={coeffs.slice(0, count).map(clean).join(",")}
      data-partials={partials.map(clean).join(",")}
      data-target={clean(target)}
      data-partial={clean(partial)}
      data-error={clean(error)}
      data-tab={tab}
      data-question={question}
      data-quick-result={quick}
      data-actions={actions}
    >
      <header className="seq345-hero">
        <span>
          <b>ADVANCED MATHEMATICS</b>
          <b>SEQUENCES AND SERIES</b>
        </span>
        <h1>Binomial Series</h1>
        <p>Extend binomial expansion and explore convergence.</p>
        <div>
          {[
            "Intermediate-Advanced",
            "Exploration Lab",
            "Sequence / CAS",
            "6-10 min",
          ].map((v) => (
            <b key={v}>{v}</b>
          ))}
        </div>
        <nav>
          <select aria-label="Language">
            <option>English (English)</option>
          </select>
          <button onClick={reset}>
            <RotateCcw />
            Reset
          </button>
          <button onClick={() => act(() => {})}>
            <Share2 />
            Share
          </button>
          <button onClick={() => act(() => {})}>Workspace</button>
        </nav>
      </header>
      <nav className="seq345-tabs">
        {tabs.map((v) => (
          <button
            className={tab === v ? "active" : ""}
            key={v}
            onClick={() => act(() => setTab(v))}
          >
            {v}
          </button>
        ))}
      </nav>
      <section className="seq345-lab">
        <header>
          <div>
            <small>INTERACTION + VISUALIZATION</small>
            <h2>Binomial Series Lab</h2>
          </div>
          <span>All systems ready</span>
          <b>{actions} actions</b>
          <button
            title="Fullscreen"
            onClick={() => act(() => setFullscreen((v) => !v))}
          >
            <Maximize2 />
          </button>
        </header>
        <div className="seq345-main">
          <aside className="seq345-controls">
            <section>
              <h2>Choose parameters</h2>
              <label>
                Exponent alpha
                <input
                  aria-label="Binomial exponent"
                  type="range"
                  min={-2}
                  max={2}
                  step={0.05}
                  value={alpha}
                  onChange={(e) => act(() => setAlpha(Number(e.target.value)))}
                />
                <input
                  aria-label="Binomial exponent number"
                  type="number"
                  step={0.05}
                  value={alpha}
                  onChange={(e) => act(() => setAlpha(Number(e.target.value)))}
                />
              </label>
              <label>
                Input x
                <input
                  aria-label="Binomial input"
                  type="range"
                  min={-0.9}
                  max={0.9}
                  step={0.01}
                  value={x}
                  onChange={(e) => act(() => setX(Number(e.target.value)))}
                />
                <input
                  aria-label="Binomial input number"
                  type="number"
                  step={0.01}
                  value={x}
                  onChange={(e) =>
                    act(() =>
                      setX(
                        Math.max(-0.99, Math.min(0.99, Number(e.target.value))),
                      ),
                    )
                  }
                />
              </label>
              <output>
                Domain: |x| &lt; 1<br />
                Here, |{x}| &lt; 1
              </output>
              <label>
                Truncation (n terms)
                <input
                  aria-label="Binomial terms"
                  type="range"
                  min={1}
                  max={15}
                  value={count}
                  onChange={(e) => act(() => setCount(Number(e.target.value)))}
                />
                <input
                  aria-label="Binomial terms number"
                  type="number"
                  min={1}
                  max={15}
                  value={count}
                  onChange={(e) =>
                    act(() =>
                      setCount(
                        Math.max(1, Math.min(15, Number(e.target.value))),
                      ),
                    )
                  }
                />
              </label>
            </section>
            <section>
              <h2>Series preview</h2>
              <strong>(1+x)^alpha = sum C(alpha,k)x^k</strong>
              <p>Using the first {count} terms.</p>
            </section>
            <section>
              <h2>Coefficient builder</h2>
              <label>
                Select k
                <select
                  aria-label="Coefficient index"
                  value={selectedK}
                  onChange={(e) =>
                    act(() => setSelectedK(Number(e.target.value)))
                  }
                >
                  {Array.from({ length: 10 }, (_, k) => (
                    <option key={k}>{k}</option>
                  ))}
                </select>
              </label>
              <strong>
                C(alpha,{selectedK}) = alpha(alpha-1).../{selectedK}!
              </strong>
              <output>Value: {clean(coeffs[selectedK])}</output>
            </section>
          </aside>
          <main>
            <section className="seq345-graph">
              <header>
                <b>Target (1+x)^alpha</b>
                <b>Partial sum (n={count})</b>
                <span>
                  alpha={alpha}, x={x}
                </span>
              </header>
              <svg
                viewBox="0 0 600 225"
                role="img"
                aria-label="Binomial series graph"
              >
                <path className="axis" d="M30 195H580M300 15V210" />
                <path className="target" d={path("target")} />
                <path className="partial" d={path("partial")} />
                <circle
                  data-drag="binomial-input"
                  cx={gx(x)}
                  cy={gy(partial)}
                  r="7"
                  onPointerDown={(e) =>
                    e.currentTarget.setPointerCapture(e.pointerId)
                  }
                  onPointerMove={drag}
                />
              </svg>
              <footer>
                <article>
                  <b>Target value</b>
                  <strong>{clean(target)}</strong>
                </article>
                <article>
                  <b>Partial sum</b>
                  <strong>{clean(partial)}</strong>
                </article>
                <article>
                  <b>Absolute error</b>
                  <strong>{clean(error)}</strong>
                </article>
              </footer>
            </section>
            <section className="seq345-expansion">
              <h2>Current expansion (first {count} terms)</h2>
              <p>
                (1+x)^{alpha} ≈ {expansion}
              </p>
            </section>
          </main>
        </div>
        <div className="seq345-results">
          <article>
            <h2>Partial sums at x = {x}</h2>
            <table>
              <thead>
                <tr>
                  <th>n</th>
                  <th>Sn(x)</th>
                  <th>Absolute error</th>
                </tr>
              </thead>
              <tbody>
                {partials.map((v, n) => (
                  <tr className={n === count - 1 ? "active" : ""} key={n}>
                    <td>{n}</td>
                    <td>{clean(v)}</td>
                    <td>{errors[n].toExponential(3)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <b>
              Target (1+{x})^{alpha} = {clean(target)}
            </b>
          </article>
          <article>
            <h2>Truncation error vs. n</h2>
            <svg viewBox="0 0 450 190">
              <path d="M25 160H430M25 15V160" />
              <polyline
                points={errors
                  .map(
                    (v, n) =>
                      `${35 + n * 19},${20 + Math.max(0, Math.min(130, -Math.log10(Math.max(v, 1e-12)) * 10))}`,
                  )
                  .join(" ")}
              />
              {errors.map((v, n) => (
                <circle
                  key={n}
                  cx={35 + n * 19}
                  cy={
                    20 +
                    Math.max(
                      0,
                      Math.min(130, -Math.log10(Math.max(v, 1e-12)) * 10),
                    )
                  }
                  r="3"
                />
              ))}
            </svg>
            <p>Error decreases as more terms are added.</p>
          </article>
        </div>
      </section>
      <section className="seq345-learn">
        <article>
          <h2>Learning objective</h2>
          <p>
            Understand and use the generalized binomial series to approximate
            (1+x)^alpha for real alpha and |x|&lt;1.
          </p>
          <h3>Guided explanation</h3>
          <p>
            (1+x)^alpha = sum C(alpha,k)x^k. Truncating after n terms gives the
            partial sum.
          </p>
          <h3>Common misconception</h3>
          <p>
            The series works for real alpha, not just integers, but its basic
            convergence domain is |x|&lt;1.
          </p>
          <h3>Worked example</h3>
          <p>
            For alpha={alpha}, x={x}, the current approximation is{" "}
            {clean(partial)} with error {clean(error)}.
          </p>
        </article>
        <article>
          <h2>Key insight</h2>
          <p>
            Generalized coefficients may alternate while the series still
            converges. Error improves as |x| becomes smaller.
          </p>
          <h3>Assumptions / constraints</h3>
          <p>
            alpha is real. At x=-1 convergence requires alpha&gt;-1; at x=1 it
            requires alpha&gt;-1 for absolute or -1&lt;alpha&lt;0 for
            conditional boundary behavior.
          </p>
          <h2>Quick check</h2>
          <p>{challenges[question].label}</p>
          {challenges[question].choices.map((v, i) => (
            <button
              className={
                quick && i === challenges[question].correct ? "correct" : ""
              }
              key={v}
              onClick={() =>
                act(() =>
                  setQuick(
                    i === challenges[question].correct
                      ? "correct"
                      : "incorrect",
                  ),
                )
              }
            >
              {String.fromCharCode(65 + i)}. {v}
            </button>
          ))}
          <output className={quick}>
            {quick === "correct"
              ? "Correct"
              : quick === "incorrect"
                ? "Try again"
                : "Choose an answer"}
            {quick === "correct" && (
              <button
                onClick={() =>
                  act(() => {
                    setQuestion((v) => (v + 1) % 2);
                    setQuick("");
                  })
                }
              >
                Next question
              </button>
            )}
          </output>
        </article>
      </section>
    </section>
  );
}
