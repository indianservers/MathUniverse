import { Maximize2, RotateCcw, Share2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";
import type { LessonAdapterProps } from "../../types";
import "./GeometricSeriesTargetLesson341.css";
const clean = (v: number) => Number(v.toFixed(6)),
  tabs = [
    "Interaction + visualisation",
    "Explain",
    "Examples",
    "Formulas",
    "Know more",
  ],
  challenges = [
    { a: 2, r: -0.4, choices: [2.5, -2.5, 10 / 7, NaN], correct: 2 },
    { a: 5, r: 0.2, choices: [5, 6.25, 4, 25], correct: 1 },
  ];
export default function GeometricSeriesTargetLesson341({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [first, setFirst] = useState(3),
    [ratio, setRatio] = useState(0.5),
    [count, setCount] = useState(10),
    [tab, setTab] = useState(tabs[0]),
    [challenge, setChallenge] = useState(0),
    [quick, setQuick] = useState<"" | "correct" | "incorrect">(""),
    [actions, setActions] = useState(0);
  const terms = useMemo(
      () => Array.from({ length: count }, (_, i) => first * ratio ** i),
      [first, ratio, count],
    ),
    partials = terms.reduce<number[]>(
      (a, v) => [...a, v + (a.at(-1) ?? 0)],
      [],
    ),
    finite = partials.at(-1) ?? 0,
    converges = Math.abs(ratio) < 1,
    infinite = converges ? first / (1 - ratio) : null;
  const reset = () => {
    setFirst(3);
    setRatio(0.5);
    setCount(10);
    setTab(tabs[0]);
    setChallenge(0);
    setQuick("");
    setActions(0);
  };
  useEffect(reset, [resetToken]);
  const act = (run: () => void) => {
    run();
    setActions((v) => v + 1);
    onInteraction();
  };
  const change = (type: "first" | "ratio" | "count", value: number) =>
    act(() => {
      if (type === "first") setFirst(clean(value));
      else if (type === "ratio") setRatio(clean(value));
      else setCount(Math.max(1, Math.min(20, Math.round(value))));
      setQuick("");
    });
  const maxAbs = Math.max(...terms.map(Math.abs), 1),
    barY = (v: number) => 90 - (v / maxAbs) * 70,
    partialMin = Math.min(...partials, 0, infinite ?? 0) - 1,
    partialMax = Math.max(...partials, 0, infinite ?? 0) + 1,
    partialY = (v: number) =>
      190 - ((v - partialMin) / (partialMax - partialMin)) * 135;
  const drag = (i: number, event: ReactPointerEvent<SVGCircleElement>) => {
    if (event.buttons !== 1) return;
    const rect = event.currentTarget.ownerSVGElement?.getBoundingClientRect();
    if (!rect) return;
    const desired =
      ((90 - ((event.clientY - rect.top) / rect.height) * 120) / 70) * maxAbs;
    if (i === 0) change("first", desired);
    else if (first !== 0) {
      const base = desired / first;
      if (base < 0 && i % 2 === 0) return;
      change(
        "ratio",
        Math.max(-2, Math.min(2, Math.sign(base) * Math.abs(base) ** (1 / i))),
      );
    }
  };
  const currentChallenge = challenges[challenge];
  return (
    <section
      className="seq341-page"
      data-testid="sequence-mockup-0526"
      data-object-model="geometric-first-ratio-count-finite-terms-partial-sums-infinite-convergence-draggable-term-bars-limit-line-formula-verification-multi-challenge-practice"
      data-first={first}
      data-ratio={ratio}
      data-count={count}
      data-terms={terms.map(clean).join(",")}
      data-partials={partials.map(clean).join(",")}
      data-finite={clean(finite)}
      data-converges={converges}
      data-infinite={infinite === null ? "diverges" : clean(infinite)}
      data-tab={tab}
      data-challenge={challenge}
      data-quick-result={quick}
      data-actions={actions}
    >
      <header className="seq341-hero">
        <span>
          <b>ADVANCED MATHEMATICS</b>
          <b>SEQUENCES AND SERIES</b>
        </span>
        <h1>Geometric Series</h1>
        <p>Explore finite and infinite geometric series.</p>
        <div>
          {[
            "Intermediate-Advanced",
            "Exploration Lab",
            "Sequence / CAS",
            "6-10 min",
          ].map((x) => (
            <b key={x}>{x}</b>
          ))}
        </div>
        <nav>
          <button>English (English)</button>
          <button onClick={() => act(reset)}>
            <RotateCcw />
            Reset
          </button>
          <button
            onClick={() =>
              act(() => navigator.clipboard?.writeText(location.href))
            }
          >
            <Share2 />
            Share
          </button>
          <button onClick={() => act(() => setTab(tabs[0]))}>Workspace</button>
        </nav>
      </header>
      <nav className="seq341-tabs">
        {tabs.map((name) => (
          <button
            key={name}
            className={tab === name ? "active" : ""}
            onClick={() => act(() => setTab(name))}
          >
            {name}
          </button>
        ))}
      </nav>
      <section className="seq341-explorer">
        <header>
          <div>
            <b>INTERACTION · VISUALIZATION</b>
            <h2>Explore the geometric series</h2>
            <p>
              Adjust a and r to see terms, partial sums, and graphical behavior.
            </p>
          </div>
          <span>{converges ? "All systems normal" : "Divergent ratio"}</span>
          <b>{actions} actions</b>
          <button
            title="Expand explorer"
            onClick={() =>
              act(() =>
                document
                  .querySelector<HTMLElement>(".seq341-explorer")
                  ?.requestFullscreen?.(),
              )
            }
          >
            <Maximize2 />
          </button>
        </header>
        <main>
          <aside>
            <label>
              First term, a
              <input
                aria-label="Geometric series first term"
                type="range"
                min="-10"
                max="10"
                step=".5"
                value={first}
                onChange={(e) => change("first", Number(e.target.value))}
              />
              <input
                aria-label="Geometric series first number"
                type="number"
                value={first}
                step=".5"
                onChange={(e) => change("first", Number(e.target.value))}
              />
            </label>
            <label>
              Common ratio, r
              <input
                aria-label="Geometric series ratio"
                type="range"
                min="-2"
                max="2"
                step=".1"
                value={ratio}
                onChange={(e) => change("ratio", Number(e.target.value))}
              />
              <input
                aria-label="Geometric series ratio number"
                type="number"
                value={ratio}
                step=".1"
                onChange={(e) => change("ratio", Number(e.target.value))}
              />
            </label>
            <label>
              Number of terms (n)
              <input
                aria-label="Geometric series count"
                type="range"
                min="1"
                max="20"
                value={count}
                onChange={(e) => change("count", Number(e.target.value))}
              />
              <input
                aria-label="Geometric series count number"
                type="number"
                value={count}
                onChange={(e) => change("count", Number(e.target.value))}
              />
            </label>
            <output>
              Current parameters
              <br />
              <b>
                a = {first}
                <br />r = {ratio}
                <br />n = {count}
              </b>
            </output>
          </aside>
          <section className="seq341-plots">
            <article>
              <h3>Terms visualization</h3>
              <svg viewBox="0 0 520 150">
                <line x1="30" y1="90" x2="505" y2="90" className="axis" />
                {terms.map((v, i) => {
                  const x = 45 + i * (440 / Math.max(1, count - 1)),
                    cy = barY(v);
                  return (
                    <g key={i}>
                      <rect
                        x={x - 10}
                        y={Math.min(90, cy)}
                        width="20"
                        height={Math.abs(90 - cy)}
                      />
                      <circle
                        data-drag={`geometric-series-point-${i + 1}`}
                        cx={x}
                        cy={cy}
                        r="6"
                        onPointerDown={(e) =>
                          e.currentTarget.setPointerCapture(e.pointerId)
                        }
                        onPointerMove={(e) => drag(i, e)}
                      />
                      <text x={x} y={cy - 8}>
                        {clean(v)}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </article>
            <article>
              <h3>Partial sums plot</h3>
              <svg viewBox="0 0 520 210">
                <g>
                  {[0, 1, 2, 3, 4].map((i) => (
                    <line
                      key={i}
                      x1="30"
                      y1={35 + i * 35}
                      x2="505"
                      y2={35 + i * 35}
                    />
                  ))}
                </g>
                {infinite !== null && (
                  <line
                    x1="30"
                    y1={partialY(infinite)}
                    x2="505"
                    y2={partialY(infinite)}
                    className="limit"
                  />
                )}
                <polyline
                  points={partials
                    .map(
                      (v, i) =>
                        `${45 + i * (440 / Math.max(1, count - 1))},${partialY(v)}`,
                    )
                    .join(" ")}
                />
                {partials.map((v, i) => (
                  <circle
                    key={i}
                    cx={45 + i * (440 / Math.max(1, count - 1))}
                    cy={partialY(v)}
                    r="4"
                  />
                ))}
              </svg>
            </article>
            <table>
              <tbody>
                <tr>
                  <th>n</th>
                  {terms.map((_, i) => (
                    <td key={i}>{i + 1}</td>
                  ))}
                </tr>
                <tr>
                  <th>aₙ</th>
                  {terms.map((v, i) => (
                    <td key={i}>{clean(v)}</td>
                  ))}
                </tr>
                <tr>
                  <th>Sₙ</th>
                  {partials.map((v, i) => (
                    <td key={i}>{clean(v)}</td>
                  ))}
                </tr>
              </tbody>
            </table>
          </section>
        </main>
      </section>
      <section className="seq341-guide">
        <article>
          <h2>What is a geometric series?</h2>
          <p>
            A geometric series is the sum of the terms of a geometric sequence.
          </p>
          <strong>a + ar + ar² + ar³ + ··· + arⁿ⁻¹ + ···</strong>
          <div>
            <h3>Common misconception</h3>
            <p>
              Decreasing terms do not guarantee convergence. Convergence happens
              only when |r|&lt;1.
            </p>
          </div>
        </article>
        <aside>
          <article>
            <h2>Key insight</h2>
            <p>
              Each term is obtained by multiplying the previous term by r. When
              |r|&lt;1, terms shrink toward zero.
            </p>
          </article>
          <article>
            <h2>Assumptions & constraints</h2>
            <p>
              a,r are real. The infinite series converges only for |r|&lt;1;
              otherwise it diverges.
            </p>
          </article>
        </aside>
      </section>
      <section className="seq341-formulas">
        <article>
          <h2>Finite geometric series</h2>
          <strong>Sₙ = a(1−rⁿ)/(1−r), r≠1</strong>
        </article>
        <article>
          <h2>Infinite geometric series</h2>
          <strong>S∞ = a/(1−r), |r|&lt;1</strong>
        </article>
        <article>
          <h2>Convergence criterion</h2>
          <strong>|r| &lt; 1</strong>
          <p>
            {converges
              ? "Current series converges."
              : "Current series diverges."}
          </p>
        </article>
      </section>
      <section className="seq341-worked">
        <div>
          <h2>Example: Sum the infinite geometric series</h2>
          <p>For a=3 and r=0.5:</p>
          <strong>S∞ = 3/(1−0.5) = 6</strong>
          <p>Therefore, the sum is 6.</p>
        </div>
        <table>
          <tbody>
            <tr>
              <th>n</th>
              {[1, 2, 3, 4, 5, 10].map((n) => (
                <td key={n}>{n}</td>
              ))}
            </tr>
            <tr>
              <th>Sₙ</th>
              {[1, 2, 3, 4, 5, 10].map((n) => (
                <td key={n}>{clean((3 * (1 - 0.5 ** n)) / (1 - 0.5))}</td>
              ))}
            </tr>
          </tbody>
        </table>
      </section>
      <section className="seq341-check">
        <div>
          <h2>Quick Check</h2>
          <p>
            For a={currentChallenge.a} and r={currentChallenge.r}, find S∞.
          </p>
          {currentChallenge.choices.map((v, i) => (
            <button
              key={i}
              className={
                quick && i === currentChallenge.correct ? "correct" : ""
              }
              onClick={() =>
                act(() =>
                  setQuick(
                    i === currentChallenge.correct ? "correct" : "incorrect",
                  ),
                )
              }
            >
              {String.fromCharCode(65 + i)} &nbsp;{" "}
              {Number.isNaN(v) ? "Does not converge" : clean(v)}
            </button>
          ))}
        </div>
        <output className={quick}>
          {quick === "correct" ? (
            <>
              <b>Correct!</b>
              <p>
                S∞ = {currentChallenge.a}/(1−({currentChallenge.r})) ={" "}
                {clean(currentChallenge.a / (1 - currentChallenge.r))}
              </p>
              <button
                onClick={() =>
                  act(() => {
                    setChallenge((v) => (v + 1) % challenges.length);
                    setQuick("");
                  })
                }
              >
                Try another
              </button>
            </>
          ) : quick === "incorrect" ? (
            "Check |r| and use a/(1−r)."
          ) : (
            "Choose an answer."
          )}
        </output>
      </section>
    </section>
  );
}
