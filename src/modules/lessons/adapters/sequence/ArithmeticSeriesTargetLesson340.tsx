import { Maximize2, RotateCcw, Share2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";
import type { LessonAdapterProps } from "../../types";
import "./ArithmeticSeriesTargetLesson340.css";
const clean = (v: number) => Number(v.toFixed(6)),
  tabs = [
    "Interaction + Visualisation",
    "Explain",
    "Examples",
    "Formulas",
    "Know more",
  ];
export default function ArithmeticSeriesTargetLesson340({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [first, setFirst] = useState(2),
    [difference, setDifference] = useState(3),
    [count, setCount] = useState(10),
    [tab, setTab] = useState(tabs[0]),
    [interactive, setInteractive] = useState(true),
    [quick, setQuick] = useState<"" | "correct" | "incorrect">(""),
    [actions, setActions] = useState(0);
  const terms = useMemo(
      () => Array.from({ length: count }, (_, i) => first + i * difference),
      [first, difference, count],
    ),
    partials = terms.reduce<number[]>(
      (a, v) => [...a, v + (a.at(-1) ?? 0)],
      [],
    ),
    last = terms.at(-1) ?? first,
    total = partials.at(-1) ?? 0,
    pairSum = first + last,
    pairs = Array.from({ length: Math.ceil(count / 2) }, (_, i) => [
      terms[i],
      terms[count - 1 - i],
    ]);
  const reset = () => {
    setFirst(2);
    setDifference(3);
    setCount(10);
    setTab(tabs[0]);
    setInteractive(true);
    setQuick("");
    setActions(0);
  };
  useEffect(reset, [resetToken]);
  const act = (run: () => void) => {
    run();
    setActions((v) => v + 1);
    onInteraction();
  };
  const change = (type: "first" | "difference" | "count", value: number) =>
    act(() => {
      if (type === "first") setFirst(clean(value));
      else if (type === "difference") setDifference(clean(value));
      else setCount(Math.max(2, Math.min(20, Math.round(value))));
      setQuick("");
    });
  const min = Math.min(...terms, 0) - 3,
    max = Math.max(...terms, 0) + 3,
    y = (v: number) => 175 - ((v - min) / (max - min)) * 130;
  const drag = (index: number, event: ReactPointerEvent<SVGCircleElement>) => {
    if (event.buttons !== 1) return;
    const rect = event.currentTarget.ownerSVGElement?.getBoundingClientRect();
    if (!rect) return;
    const desired =
      max -
      ((event.clientY - rect.top - 20) / (rect.height - 45)) * (max - min);
    if (index === 0) change("first", desired);
    else change("difference", (desired - first) / index);
  };
  return (
    <section
      className="seq340-page"
      data-testid="sequence-mockup-0525"
      data-object-model="arithmetic-progression-first-difference-count-generated-terms-partial-sums-paired-ends-draggable-line-endpoints-finite-sum-proof-trapezoid-area-practice"
      data-first={first}
      data-difference={difference}
      data-count={count}
      data-terms={terms.map(clean).join(",")}
      data-partials={partials.map(clean).join(",")}
      data-last={clean(last)}
      data-pair-sum={clean(pairSum)}
      data-total={clean(total)}
      data-tab={tab}
      data-interactive={interactive}
      data-quick-result={quick}
      data-actions={actions}
    >
      <header className="seq340-hero">
        <span>
          <b>ADVANCED MATHEMATICS</b>
          <b>SEQUENCES AND SERIES</b>
        </span>
        <h1>Arithmetic Series</h1>
        <p>Sum of an arithmetic progression (A.P.).</p>
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
      <nav className="seq340-tabs">
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
      <section className="seq340-objective">
        <b>LEARNING OBJECTIVE</b>
        <p>
          Understand the arithmetic series, derive the sum using pairwise and
          trapezoid ideas, and compute the nth partial sum Sₙ = n/2 [2a₁ +
          (n−1)d].
        </p>
      </section>
      <section className="seq340-lab">
        <header>
          <div>
            <h2>Arithmetic Series Lab</h2>
            <p>Explore terms, visualize linear growth, and discover the sum.</p>
          </div>
          <button onClick={() => act(() => setInteractive((v) => !v))}>
            {interactive ? "Interactive mode" : "View mode"}
          </button>
          <button
            title="Expand lab"
            onClick={() =>
              act(() =>
                document
                  .querySelector<HTMLElement>(".seq340-lab")
                  ?.requestFullscreen?.(),
              )
            }
          >
            <Maximize2 />
          </button>
        </header>
        <main>
          <aside>
            <h3>Controls</h3>
            <label>
              First term (a₁)
              <input
                aria-label="Arithmetic series first term"
                type="range"
                min="-10"
                max="20"
                step="1"
                value={first}
                disabled={!interactive}
                onChange={(e) => change("first", Number(e.target.value))}
              />
              <output>{first}</output>
            </label>
            <label>
              Common difference (d)
              <input
                aria-label="Arithmetic series difference"
                type="range"
                min="-10"
                max="10"
                step="1"
                value={difference}
                disabled={!interactive}
                onChange={(e) => change("difference", Number(e.target.value))}
              />
              <output>{difference}</output>
            </label>
            <label>
              Number of terms (n)
              <input
                aria-label="Arithmetic series count"
                type="range"
                min="2"
                max="20"
                step="1"
                value={count}
                disabled={!interactive}
                onChange={(e) => change("count", Number(e.target.value))}
              />
              <output>{count}</output>
            </label>
          </aside>
          <article className="seq340-graph">
            <h3>Terms and linear growth</h3>
            <svg viewBox="0 0 430 220">
              <g>
                {[0, 1, 2, 3, 4].map((i) => (
                  <line
                    key={i}
                    x1="35"
                    y1={35 + i * 34}
                    x2="415"
                    y2={35 + i * 34}
                  />
                ))}
              </g>
              <line x1="35" y1="175" x2="420" y2="175" className="axis" />
              <polyline
                points={terms
                  .map(
                    (v, i) =>
                      `${48 + i * (350 / Math.max(1, count - 1))},${y(v)}`,
                  )
                  .join(" ")}
              />
              {terms.map((v, i) => {
                const x = 48 + i * (350 / Math.max(1, count - 1)),
                  cy = y(v);
                return (
                  <g key={i}>
                    <line x1={x} y1="175" x2={x} y2={cy} />
                    <circle
                      data-drag={`arithmetic-series-point-${i + 1}`}
                      cx={x}
                      cy={cy}
                      r="6"
                      onPointerDown={(e) =>
                        e.currentTarget.setPointerCapture(e.pointerId)
                      }
                      onPointerMove={(e) => drag(i, e)}
                    />
                    <text x={x} y={cy - 10}>
                      {clean(v)}
                    </text>
                  </g>
                );
              })}
            </svg>
          </article>
        </main>
        <section className="seq340-pair">
          <article>
            <h3>Term strip (pair from ends)</h3>
            {pairs.map(([a, b], i) => (
              <div key={i}>
                <b>{clean(a)}</b>
                <span>+</span>
                <b>{clean(b)}</b>
                <span>=</span>
                <strong>{clean(a + b)}</strong>
              </div>
            ))}
            <output>Common pair sum = {clean(pairSum)}</output>
          </article>
          <article>
            <h3>Partial sums table</h3>
            <table>
              <thead>
                <tr>
                  <th>n</th>
                  <th>aₙ</th>
                  <th>Sₙ</th>
                  <th>Check formula</th>
                </tr>
              </thead>
              <tbody>
                {terms.map((v, i) => (
                  <tr key={i}>
                    <td>{i + 1}</td>
                    <td>{clean(v)}</td>
                    <td>{clean(partials[i])}</td>
                    <td>
                      {i + 1}/2 [2({first}) + {i}({difference})] ={" "}
                      {clean(partials[i])}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <footer>
              <b>aₙ=a₁+(n−1)d</b>
              <b>Sₙ=n/2[2a₁+(n−1)d]</b>
              <b>Formula proven</b>
            </footer>
          </article>
        </section>
      </section>
      <section className="seq340-derivation">
        <article>
          <h2>Derivation (pairing / trapezoid idea)</h2>
          <p>
            Pair the first and last terms, second and second-last, and so on.
          </p>
          <div>
            <p>Each pair sums to a₁+aₙ = 2a₁+(n−1)d</p>
            <p>Number of pairs = n/2</p>
            <strong>Sₙ = n/2 [2a₁+(n−1)d]</strong>
          </div>
          <svg viewBox="0 0 360 130">
            <polygon points="35,100 35,78 315,22 315,100" />
            <line x1="35" y1="100" x2="330" y2="100" />
            <text x="30" y="75">
              a₁
            </text>
            <text x="315" y="18">
              aₙ
            </text>
            <text x="170" y="122">
              Area = n(a₁+aₙ)/2
            </text>
          </svg>
        </article>
        <aside>
          <article>
            <h2>Key Insight</h2>
            <p>
              The terms grow linearly. The sum equals average of first and last
              term × number of terms.
            </p>
          </article>
          <article>
            <h2>Common Misconception</h2>
            <p>
              Do not confuse n, the number of terms, with aₙ, the last term.
            </p>
          </article>
          <article>
            <h2>Assumptions / Constraints</h2>
            <p>
              ✓ n is a positive integer.
              <br />✓ Common difference d is constant.
              <br />✓ Formula holds for real a₁ and d.
            </p>
          </article>
        </aside>
      </section>
      <section className="seq340-check">
        <div>
          <h2>Quick Check</h2>
          <p>Compute the first 12 terms sum when a₁=7 and d=4.</p>
          {[264, 270, 348, 288].map((v, i) => (
            <button
              key={v}
              className={quick && v === 348 ? "correct" : ""}
              onClick={() =>
                act(() => setQuick(v === 348 ? "correct" : "incorrect"))
              }
            >
              {String.fromCharCode(65 + i)} &nbsp; {v}
            </button>
          ))}
        </div>
        <output className={quick}>
          {quick === "correct" ? (
            <>
              <b>Correct!</b>
              <p>S₁₂ = 12/2 [2(7)+11(4)] = 6(58) = 348</p>
            </>
          ) : quick === "incorrect" ? (
            "Use n=12, not the last term."
          ) : (
            "Choose an answer."
          )}
        </output>
      </section>
    </section>
  );
}
