import { useEffect, useMemo, useState } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";
import type { LessonAdapterProps } from "../../types";
import "./GeometricSequencesTargetLesson336.css";

const clean = (value: number) => Number(value.toFixed(6));
const nav = [
  "Explore & Simulate",
  "Guided Calculation",
  "Key Insight",
  "Practice & Check",
  "Summary",
];
export default function GeometricSequencesTargetLesson336({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [first, setFirst] = useState(3),
    [ratio, setRatio] = useState(2),
    [plot, setPlot] = useState<"linear" | "log">("linear"),
    [tab, setTab] = useState(nav[0]),
    [solver, setSolver] = useState<"n" | "first" | "ratio">("n"),
    [given, setGiven] = useState("192"),
    [index, setIndex] = useState("7"),
    [answer, setAnswer] = useState(""),
    [quick, setQuick] = useState<"" | "correct" | "incorrect">(""),
    [actions, setActions] = useState(0);
  const terms = useMemo(
    () => Array.from({ length: 10 }, (_, i) => first * ratio ** i),
    [first, ratio],
  );
  const behavior =
    Math.abs(ratio) > 1
      ? "Growth"
      : Math.abs(ratio) === 1
        ? "Constant"
        : "Decay";
  const reset = () => {
    setFirst(3);
    setRatio(2);
    setPlot("linear");
    setTab(nav[0]);
    setSolver("n");
    setGiven("192");
    setIndex("7");
    setAnswer("");
    setQuick("");
    setActions(0);
  };
  useEffect(reset, [resetToken]);
  const act = (run: () => void) => {
    run();
    setActions((v) => v + 1);
    onInteraction();
  };
  const solve = () =>
    act(() => {
      const value = Number(given),
        n = Number(index);
      if (![value, n].every(Number.isFinite) || n < 1)
        return setAnswer("Enter valid values.");
      if (solver === "n") {
        if (first === 0 || ratio <= 0 || value / first <= 0 || ratio === 1)
          return setAnswer(
            value === first ? "Any positive n" : "No real index",
          );
        const result = 1 + Math.log(value / first) / Math.log(ratio);
        return setAnswer(
          Number.isInteger(clean(result))
            ? `n = ${clean(result)}`
            : `n ≈ ${clean(result)}`,
        );
      }
      if (solver === "first")
        return setAnswer(`a₁ = ${clean(value / ratio ** (n - 1))}`);
      if (n === 1) return setAnswer("r is not determined by a₁ alone");
      const base = value / first;
      if (base < 0 && (n - 1) % 2 === 0) return setAnswer("No real ratio");
      setAnswer(
        `r = ${clean(Math.sign(base) * Math.abs(base) ** (1 / (n - 1)))}`,
      );
    });
  const changeFirst = (v: number) =>
    act(() => {
      setFirst(clean(v));
      setAnswer("");
    });
  const changeRatio = (v: number) =>
    act(() => {
      setRatio(clean(v));
      setAnswer("");
    });
  const maxAbs = Math.max(...terms.map(Math.abs), 1),
    graphY = (v: number) =>
      plot === "log"
        ? 168 - (Math.log10(Math.abs(v) + 1) / Math.log10(maxAbs + 1)) * 140
        : 168 - ((v + maxAbs) / (2 * maxAbs)) * 140;
  const drag = (i: number, event: ReactPointerEvent<SVGCircleElement>) => {
    if (event.buttons !== 1 || i === 0 || first === 0) return;
    const rect = event.currentTarget.ownerSVGElement?.getBoundingClientRect();
    if (!rect) return;
    const normalized = 1 - (event.clientY - rect.top - 20) / (rect.height - 48),
      desired = (normalized * 2 - 1) * maxAbs;
    const base = desired / first;
    if (base < 0 && i % 2 === 0) return;
    changeRatio(
      Math.max(-3, Math.min(3, Math.sign(base) * Math.abs(base) ** (1 / i))),
    );
  };
  return (
    <section
      className="seq336-page"
      data-testid="sequence-mockup-0521"
      data-object-model="constant-ratio-multiplicative-step-chain-term-table-linear-log-plot-draggable-ratio-explicit-recursive-growth-classifier-three-mode-inverse-solver-practice"
      data-first={first}
      data-ratio={ratio}
      data-terms={terms.map(clean).join(",")}
      data-behavior={behavior}
      data-plot={plot}
      data-tab={tab}
      data-solver={solver}
      data-answer={answer}
      data-quick-result={quick}
      data-actions={actions}
    >
      <header className="seq336-hero">
        <span>
          <b>ADVANCED MATHEMATICS</b>
          <b>SEQUENCES AND SERIES</b>
          <b>336 GEOMETRIC SEQUENCES</b>
        </span>
        <h1>Geometric Sequences</h1>
        <p>
          Constant ratio. Multiplicative patterns. Powerful growth and decay.
        </p>
        <div>
          {[
            ["Level", "Intermediate-Advanced"],
            ["Topic", "Sequences and Series"],
            ["Duration", "6-10 min"],
            ["Skills", "Algebra · Functions · Modeling"],
          ].map(([a, b]) => (
            <article key={a}>
              <small>{a}</small>
              <b>{b}</b>
            </article>
          ))}
        </div>
      </header>
      <nav className="seq336-tabs">
        {nav.map((name) => (
          <button
            key={name}
            className={tab === name ? "active" : ""}
            onClick={() => act(() => setTab(name))}
          >
            {name}
          </button>
        ))}
      </nav>
      <section className="seq336-intro">
        <article>
          <h3>LEARNING OBJECTIVE</h3>
          <p>
            Understand geometric sequences as sequences with a constant ratio,
            explore their behavior, representations, and formulas, and solve for
            unknowns.
          </p>
        </article>
        <main>
          <h3>ACTIVE PARAMETERS</h3>
          <div>
            <label>
              First term a₁ <output>{first}</output>
              <input
                aria-label="Geometric first term"
                type="range"
                min="-10"
                max="10"
                step="1"
                value={first}
                onChange={(e) => changeFirst(Number(e.target.value))}
              />
            </label>
            <label>
              Common ratio r <output>{ratio}</output>
              <input
                aria-label="Geometric common ratio"
                type="range"
                min="-3"
                max="3"
                step="0.1"
                value={ratio}
                onChange={(e) => changeRatio(Number(e.target.value))}
              />
            </label>
          </div>
          <aside>
            <b>
              Sequence type
              <br />
              <strong>
                {behavior} (|r|{" "}
                {Math.abs(ratio) > 1 ? ">" : Math.abs(ratio) === 1 ? "=" : "<"}{" "}
                1)
              </strong>
            </b>
            <b>
              Sign of terms
              <br />
              <strong>
                {ratio < 0
                  ? "Alternating"
                  : terms.every((v) => v >= 0)
                    ? "All positive"
                    : "All negative"}
              </strong>
            </b>
            <b>
              Behavior
              <br />
              <strong>
                {behavior === "Growth"
                  ? "Exponential growth"
                  : behavior === "Decay"
                    ? "Approaches zero"
                    : "Same magnitude"}
              </strong>
            </b>
          </aside>
        </main>
      </section>
      <section className="seq336-steps">
        <h2>1. Multiplicative step animation</h2>
        <p>
          <i /> Multiply by r each step
        </p>
        <div>
          {terms.slice(0, 8).map((v, i) => (
            <span key={i}>
              <small>a{i + 1}</small>
              <b>{clean(v)}</b>
              {i < 7 && <em>× r →</em>}
            </span>
          ))}
        </div>
        <p>Rule: Multiply the previous term by r = {ratio}.</p>
      </section>
      <section className="seq336-pair tall">
        <article>
          <h2>2. Term table</h2>
          <table>
            <thead>
              <tr>
                <th>n</th>
                <th>aₙ</th>
                <th>Calculation</th>
              </tr>
            </thead>
            <tbody>
              {terms.map((v, i) => (
                <tr key={i}>
                  <td>{i + 1}</td>
                  <td>{clean(v)}</td>
                  <td>
                    {i ? `${clean(terms[i - 1])} × ${ratio}` : `a₁ = ${first}`}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p>
            <b>General term:</b> aₙ = {first} · {ratio}
            <sup>n−1</sup>
          </p>
        </article>
        <article className="seq336-graph">
          <h2>3. Graphical view</h2>
          <nav>
            <button
              className={plot === "linear" ? "active" : ""}
              onClick={() => act(() => setPlot("linear"))}
            >
              Linear plot
            </button>
            <button
              className={plot === "log" ? "active" : ""}
              onClick={() => act(() => setPlot("log"))}
            >
              Log plot (semi-log)
            </button>
          </nav>
          <svg viewBox="0 0 390 205">
            <g>
              {[0, 1, 2, 3, 4].map((i) => (
                <line
                  key={i}
                  x1="35"
                  y1={28 + i * 35}
                  x2="375"
                  y2={28 + i * 35}
                />
              ))}
            </g>
            <line x1="35" y1="168" x2="380" y2="168" className="axis" />
            <polyline
              points={terms
                .map((v, i) => `${46 + i * 35},${graphY(v)}`)
                .join(" ")}
            />
            {terms.map((v, i) => (
              <circle
                key={i}
                data-drag={`geometric-point-${i + 1}`}
                cx={46 + i * 35}
                cy={graphY(v)}
                r="6"
                onPointerDown={(e) =>
                  e.currentTarget.setPointerCapture(e.pointerId)
                }
                onPointerMove={(e) => drag(i, e)}
              />
            ))}
          </svg>
          <p>
            The terms{" "}
            {behavior === "Growth"
              ? "grow rapidly"
              : behavior === "Decay"
                ? "shrink toward zero"
                : "keep the same magnitude"}
            . Each step multiplies by r = {ratio}.
          </p>
        </article>
      </section>
      <section className="seq336-pair forms">
        <article>
          <h2>4. Explicit and recursive forms</h2>
          <div>
            <span>
              <h3>Explicit (nth-term) formula</h3>
              <strong>aₙ = a₁rⁿ⁻¹</strong>
              <p>
                Here: aₙ = {first} · {ratio}ⁿ⁻¹
              </p>
            </span>
            <span>
              <h3>Recursive definition</h3>
              <strong>
                a₁ = {first}
                <br />
                aₙ = {ratio}aₙ₋₁ for n ≥ 2
              </strong>
            </span>
          </div>
        </article>
        <article>
          <h2>5. Growth / decay classifier</h2>
          <p>What does |r| tell us?</p>
          <div className="classify">
            {[
              ["Growth", "|r| > 1"],
              ["Constant", "|r| = 1"],
              ["Decay", "|r| < 1"],
            ].map(([a, b]) => (
              <span key={a} className={behavior === a ? "active" : ""}>
                <b>{b}</b>
                <strong>{a}</strong>
              </span>
            ))}
          </div>
          <p className="notice">
            Since |r| = {Math.abs(ratio)}, this is a {behavior.toLowerCase()}{" "}
            sequence.
          </p>
        </article>
      </section>
      <section className="seq336-pair solve-row">
        <article>
          <h2>6. Worked example</h2>
          <p>Find the 7th term and the first term after 100.</p>
          <p>• 7th term:</p>
          <strong>
            a₇ = {first} · {ratio}⁶ = {clean(first * ratio ** 6)}
          </strong>
          <p>• First term after 100:</p>
          <strong>
            {terms.findIndex((v) => Math.abs(v) > 100) >= 0
              ? `a${terms.findIndex((v) => Math.abs(v) > 100) + 1} = ${clean(terms.find((v) => Math.abs(v) > 100)!)}`
              : "No first-ten term exceeds 100"}
          </strong>
          <div className="tip">
            Tip: Use logs to solve exponential inequalities efficiently.
          </div>
        </article>
        <article className="seq336-solver">
          <h2>7. Solve for unknowns</h2>
          <nav>
            {[
              ["n", "Find n"],
              ["first", "Find a₁"],
              ["ratio", "Find r"],
            ].map(([id, label]) => (
              <button
                key={id}
                className={solver === id ? "active" : ""}
                onClick={() =>
                  act(() => {
                    setSolver(id as typeof solver);
                    setAnswer("");
                  })
                }
              >
                {label}
              </button>
            ))}
          </nav>
          <div>
            <label>
              Given aₙ
              <input
                aria-label="Geometric solver given"
                value={given}
                onChange={(e) => setGiven(e.target.value)}
              />
            </label>
            <label>
              n =
              <input
                aria-label="Geometric solver index"
                value={index}
                onChange={(e) => setIndex(e.target.value)}
              />
            </label>
            <button onClick={solve}>Solve</button>
          </div>
          <output>
            {answer || "Use the nth-term formula to find unknown values."}
          </output>
        </article>
      </section>
      <section className="seq336-notes">
        {[
          [
            "8. Key insight",
            "Geometric sequences model multiplicative change. The constant ratio controls how fast values grow or decay.",
          ],
          [
            "9. Common misconception",
            "Each term is multiplied by r, not added. Additive patterns are arithmetic sequences.",
          ],
          [
            "10. Assumptions & cautions",
            "r can be any real number except undefined. If r < 0, the signs alternate. Check units and context.",
          ],
        ].map(([a, b]) => (
          <article key={a}>
            <h2>{a}</h2>
            <p>{b}</p>
          </article>
        ))}
      </section>
      <section className="seq336-quick">
        <div>
          <h2>11. Quick check (with answer)</h2>
          <p>Given a₁ = 3 and r = 2. What is a₁₀?</p>
          {[384, 768, 1536, 3072].map((v, i) => (
            <button
              key={v}
              className={quick && v === 1536 ? "correct" : ""}
              onClick={() =>
                act(() => setQuick(v === 1536 ? "correct" : "incorrect"))
              }
            >
              {String.fromCharCode(65 + i)}. {v}
            </button>
          ))}
        </div>
        <output className={quick}>
          <b>
            {quick === "correct"
              ? "Correct answer: C."
              : quick === "incorrect"
                ? "Try multiplying by 2 nine times."
                : "Show solution"}
          </b>
          <p>a₁₀ = 3 · 2⁹ = 1536</p>
        </output>
      </section>
    </section>
  );
}
