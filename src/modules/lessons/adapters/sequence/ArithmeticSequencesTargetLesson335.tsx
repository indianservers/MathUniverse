import {
  Check,
  ChevronFirst,
  ChevronLast,
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
  RotateCcw,
  Share2,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";
import type { LessonAdapterProps } from "../../types";
import "./ArithmeticSequencesTargetLesson335.css";

const clean = (value: number) => Number(value.toFixed(6));
const tabs = [
  "Interaction + Visualisation",
  "Explain",
  "Examples",
  "Formulas",
  "Guided Practice",
  "Quick Check",
  "Know More",
];

export default function ArithmeticSequencesTargetLesson335({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [first, setFirst] = useState(5),
    [difference, setDifference] = useState(3),
    [step, setStep] = useState(6),
    [playing, setPlaying] = useState(false),
    [tab, setTab] = useState(tabs[0]),
    [solverMode, setSolverMode] = useState<"term" | "index">("term"),
    [solverInput, setSolverInput] = useState("25"),
    [solverResult, setSolverResult] = useState(""),
    [quickResult, setQuickResult] = useState<"" | "correct" | "incorrect">(""),
    [actions, setActions] = useState(0);
  const terms = useMemo(
      () =>
        Array.from({ length: 10 }, (_, index) => first + index * difference),
      [first, difference],
    ),
    differences = terms.slice(1).map((value, index) => value - terms[index]),
    nth40 = first + 39 * difference,
    intercept = first - difference;

  const reset = () => {
    setFirst(5);
    setDifference(3);
    setStep(6);
    setPlaying(false);
    setTab(tabs[0]);
    setSolverMode("term");
    setSolverInput("25");
    setSolverResult("");
    setQuickResult("");
    setActions(0);
  };
  useEffect(reset, [resetToken]);
  useEffect(() => {
    if (!playing) return;
    const timer = window.setInterval(
      () => setStep((value) => (value >= 10 ? 1 : value + 1)),
      650,
    );
    return () => window.clearInterval(timer);
  }, [playing]);
  const act = (run: () => void) => {
    run();
    setActions((value) => value + 1);
    onInteraction();
  };
  const changeFirst = (value: number) =>
    act(() => {
      setFirst(clean(value));
      setSolverResult("");
    });
  const changeDifference = (value: number) =>
    act(() => {
      setDifference(clean(value));
      setSolverResult("");
    });
  const solve = () =>
    act(() => {
      const value = Number(solverInput);
      if (!Number.isFinite(value)) return setSolverResult("Enter a number.");
      if (solverMode === "term") {
        const n = Math.max(1, Math.round(value));
        setSolverResult(`a${n} = ${clean(first + (n - 1) * difference)}`);
        return;
      }
      if (difference === 0) {
        setSolverResult(value === first ? "Every positive index" : "No index");
        return;
      }
      const n = 1 + (value - first) / difference;
      setSolverResult(
        Number.isInteger(n) && n >= 1
          ? `n = ${n}`
          : "Not a term in this sequence",
      );
    });
  const dragGraph = (
    index: number,
    event: ReactPointerEvent<SVGCircleElement>,
  ) => {
    if (event.buttons !== 1 || index === 0) return;
    const rect = event.currentTarget.ownerSVGElement?.getBoundingClientRect();
    if (!rect) return;
    const desired =
      40 - ((event.clientY - rect.top - 22) / (rect.height - 54)) * 40;
    changeDifference((desired - first) / index);
  };
  const graphY = (value: number) => 28 + ((40 - value) / 40) * 132;
  const graphPoints = terms
    .map((value, index) => `${43 + index * 37},${graphY(value)}`)
    .join(" ");
  const lineMin = Math.min(...terms, -20) - 3,
    lineMax = Math.max(...terms, 30) + 3,
    lineX = (value: number) =>
      25 + ((value - lineMin) / (lineMax - lineMin)) * 405;

  return (
    <section
      className="seq335-page"
      data-testid="sequence-mockup-0520"
      data-object-model="constant-difference-number-line-stepper-autoplay-term-table-draggable-index-graph-explicit-recursive-bidirectional-nth-term-solver-guided-practice"
      data-first={first}
      data-difference={difference}
      data-step={step}
      data-playing={playing}
      data-terms={terms.map(clean).join(",")}
      data-differences={differences.map(clean).join(",")}
      data-tab={tab}
      data-solver-mode={solverMode}
      data-solver-result={solverResult}
      data-quick-result={quickResult}
      data-actions={actions}
    >
      <header className="seq335-hero">
        <div>
          <span>
            <b>ADVANCED MATHEMATICS</b>
            <b>SEQUENCES AND SERIES</b>
          </span>
          <h1>Arithmetic Sequences</h1>
          <p>Linear growth by a constant difference.</p>
          <div className="seq335-meta">
            <b>Intermediate-Advanced</b>
            <b>Exploration Lab</b>
            <b>Sequence / CAS</b>
            <b>6-10 min</b>
          </div>
        </div>
        <article>
          <h3>LEARNING OBJECTIVE</h3>
          <p>
            Understand, model, and solve arithmetic sequences using tables,
            graphs, explicit and recursive formulas, and problem solving.
          </p>
        </article>
        <div className="seq335-actions">
          <button>English (English)</button>
          <button onClick={() => act(reset)}>
            <RotateCcw /> Reset
          </button>
          <button
            onClick={() =>
              act(() => navigator.clipboard?.writeText(location.href))
            }
          >
            <Share2 /> Share
          </button>
          <button onClick={() => act(() => setTab(tabs[0]))}>Workspace</button>
        </div>
      </header>
      <nav className="seq335-tabs">
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

      <section className="seq335-explorer">
        <main>
          <header>
            <h2>1. Explore an Arithmetic Sequence</h2>
            <p>
              Adjust the first term and common difference. All views update
              together.
            </p>
          </header>
          <div className="seq335-control">
            <h3>ACTIVE CONTROLS</h3>
            <label>
              First term, a₁{" "}
              <input
                aria-label="Arithmetic first term"
                type="range"
                min="-20"
                max="20"
                step="1"
                value={first}
                onChange={(event) => changeFirst(Number(event.target.value))}
              />
            </label>
            <output>{first}</output>
            <label>
              Common difference, d{" "}
              <input
                aria-label="Arithmetic common difference"
                type="range"
                min="-10"
                max="10"
                step="1"
                value={difference}
                onChange={(event) =>
                  changeDifference(Number(event.target.value))
                }
              />
            </label>
            <output>{difference}</output>
            <div className="seq335-current">
              <small>Current sequence</small>
              <b>
                a₁ = {first}, d = {difference}
              </b>
            </div>
          </div>
          <div className="seq335-numberline">
            <h3>STEP ALONG THE NUMBER LINE</h3>
            <strong>n = {step}</strong>
            <div className="seq335-player">
              <button title="First term" onClick={() => act(() => setStep(1))}>
                <ChevronFirst />
              </button>
              <button
                title="Previous term"
                onClick={() =>
                  act(() => setStep((value) => Math.max(1, value - 1)))
                }
              >
                <ChevronLeft />
              </button>
              <button
                title={playing ? "Pause" : "Play"}
                onClick={() => act(() => setPlaying((value) => !value))}
              >
                {playing ? <Pause /> : <Play />}
              </button>
              <button
                title="Next term"
                onClick={() =>
                  act(() => setStep((value) => Math.min(10, value + 1)))
                }
              >
                <ChevronRight />
              </button>
              <button title="Last term" onClick={() => act(() => setStep(10))}>
                <ChevronLast />
              </button>
              <button onClick={() => act(() => setPlaying((value) => !value))}>
                {playing ? "Pause" : "Auto"}
              </button>
            </div>
            <svg
              viewBox="0 0 460 145"
              aria-label="Arithmetic sequence number line"
            >
              <line x1="20" y1="95" x2="440" y2="95" className="axis" />
              {terms.slice(0, step).map((value, index) => {
                const x = lineX(value),
                  nextX = index ? lineX(terms[index - 1]) : x;
                return (
                  <g key={index}>
                    <path
                      d={`M${nextX} 89 Q${(nextX + x) / 2} ${50 - index * 2} ${x} 89`}
                    />
                    <circle
                      cx={x}
                      cy="95"
                      r="5"
                      className={index + 1 === step ? "current" : ""}
                    />
                    <text x={x} y="124">
                      a{index + 1}
                    </text>
                    <text x={(nextX + x) / 2} y="48">
                      {index
                        ? `${difference >= 0 ? "+" : ""}${difference}`
                        : ""}
                    </text>
                  </g>
                );
              })}
            </svg>
            <p>
              <b>Sequence terms:</b> {terms.slice(0, step).join(", ")}
              {step < 10 ? ", ..." : ""}
            </p>
          </div>
        </main>
        <aside>
          <article>
            <h3>KEY INSIGHT</h3>
            <p>
              An arithmetic sequence <b>adds the same number d each time.</b>
            </p>
            <p>Here: d = {difference}</p>
          </article>
          <article>
            <h3>COMMON MISCONCEPTION</h3>
            <p>
              Assuming the ratio between terms is constant. That's{" "}
              <b>geometric</b>, not arithmetic.
            </p>
          </article>
          <article>
            <h3>ASSUMPTIONS &amp; CAUTIONS</h3>
            <p>
              • d can be positive, negative, or zero.
              <br />• n is a positive integer.
              <br />• Formulas work for all n in the domain.
            </p>
          </article>
        </aside>
      </section>

      <section className="seq335-pair">
        <article className="seq335-table">
          <h2>2. Terms Table</h2>
          <p>First 10 terms of the sequence</p>
          <table>
            <tbody>
              <tr>
                <th>n</th>
                {terms.map((_, index) => (
                  <th key={index}>{index + 1}</th>
                ))}
              </tr>
              <tr>
                <th>aₙ</th>
                {terms.map((value, index) => (
                  <td key={index}>{clean(value)}</td>
                ))}
              </tr>
              <tr>
                <th>aₙ − a₁</th>
                {terms.map((value, index) => (
                  <td key={index}>{clean(value - first)}</td>
                ))}
              </tr>
            </tbody>
          </table>
          <div className="success">
            <Check /> Each term increases by d = {difference}.
          </div>
        </article>
        <article className="seq335-graph">
          <h2>3. Term vs. Index Graph</h2>
          <p>Linear relationship between n and aₙ</p>
          <svg viewBox="0 0 410 190">
            <g className="grid">
              {[0, 1, 2, 3, 4].map((i) => (
                <line
                  key={`h${i}`}
                  x1="42"
                  y1={28 + i * 33}
                  x2="385"
                  y2={28 + i * 33}
                />
              ))}
              {terms.map((_, i) => (
                <line
                  key={`v${i}`}
                  x1={43 + i * 37}
                  y1="22"
                  x2={43 + i * 37}
                  y2="160"
                />
              ))}
            </g>
            <line x1="42" y1="160" x2="390" y2="160" className="axis" />
            <line x1="42" y1="160" x2="42" y2="18" className="axis" />
            <polyline points={graphPoints} />
            {terms.map((value, index) => (
              <circle
                key={index}
                data-index={index}
                data-drag={`arithmetic-point-${index + 1}`}
                cx={43 + index * 37}
                cy={graphY(value)}
                r="6"
                onPointerDown={(event) =>
                  event.currentTarget.setPointerCapture(event.pointerId)
                }
                onPointerMove={(event) => dragGraph(index, event)}
              />
            ))}
            <text x="58" y="43" className="formula">
              aₙ = {clean(difference)}n {intercept >= 0 ? "+" : "−"}{" "}
              {Math.abs(clean(intercept))}
            </text>
          </svg>
          <div className="success">
            <Check /> Straight line with slope d = {difference} and y-intercept
            a₁ − d = {clean(intercept)}.
          </div>
        </article>
      </section>

      <section className="seq335-pair formulas-row">
        <article>
          <h2>4. Formulas</h2>
          <div className="seq335-formulas">
            <div>
              <h3>Explicit (nth-Term) Formula</h3>
              <p>Directly gives the nth term.</p>
              <strong>aₙ = a₁ + (n − 1)d</strong>
              <p>For our sequence:</p>
              <output>
                aₙ = {first} + (n − 1) · {difference}
              </output>
              <output>
                aₙ = {clean(difference)}n {intercept >= 0 ? "+" : "−"}{" "}
                {Math.abs(clean(intercept))}
              </output>
            </div>
            <div>
              <h3>Recursive Formula</h3>
              <p>Build each term from the previous one.</p>
              <strong>
                a₁ = {first}
                <br />
                aₙ = aₙ₋₁ {difference >= 0 ? "+" : "−"} {Math.abs(difference)},
                n ≥ 2
              </strong>
              <div className="chips">
                {terms.slice(0, 5).map((value, index) => (
                  <b key={index}>
                    a{index + 1}={clean(value)}
                  </b>
                ))}
              </div>
            </div>
          </div>
        </article>
        <article className="seq335-solver">
          <h2>5. Nth-Term Solver</h2>
          <p>Find the nth term or the term at a specific index.</p>
          <nav>
            <button
              className={solverMode === "term" ? "active" : ""}
              onClick={() =>
                act(() => {
                  setSolverMode("term");
                  setSolverResult("");
                })
              }
            >
              Find aₙ
            </button>
            <button
              className={solverMode === "index" ? "active" : ""}
              onClick={() =>
                act(() => {
                  setSolverMode("index");
                  setSolverResult("");
                })
              }
            >
              Find n
            </button>
          </nav>
          <label>
            {solverMode === "term" ? "Enter n" : "Enter term"}
            <input
              aria-label="Arithmetic solver input"
              value={solverInput}
              onChange={(event) => setSolverInput(event.target.value)}
            />
          </label>
          <button onClick={solve}>Calculate</button>
          <output>
            {solverResult ||
              (solverMode === "term"
                ? `a₂₅ = ${clean(first + 24 * difference)}`
                : "Enter a sequence term")}
          </output>
        </article>
      </section>

      <section className="seq335-bottom">
        <article>
          <h2>6. Guided Calculation</h2>
          <p>Find the 40th term of the sequence.</p>
          <p>Use aₙ = a₁ + (n − 1)d.</p>
          <ol>
            <li>
              a₄₀ = {first} + (40 − 1) · {difference}
            </li>
            <li>
              = {first} + 39 · {difference}
            </li>
            <li>
              = {first} + {clean(39 * difference)}
            </li>
            <li>= {clean(nth40)}</li>
          </ol>
          <div className="success">
            <Check /> Answer: a₄₀ = {clean(nth40)}
          </div>
        </article>
        <article className="seq335-quick">
          <h2>7. Quick Check</h2>
          <p>What is the 12th term?</p>
          {[34, 35, 38, 37].map((value, index) => (
            <button
              key={value}
              className={
                quickResult && value === first + 11 * difference
                  ? "correct"
                  : ""
              }
              onClick={() =>
                act(() =>
                  setQuickResult(
                    value === first + 11 * difference ? "correct" : "incorrect",
                  ),
                )
              }
            >
              {String.fromCharCode(65 + index)} &nbsp; {value}
            </button>
          ))}
          <output className={quickResult}>
            {quickResult === "correct"
              ? `Correct! a₁₂ = ${clean(first + 11 * difference)}`
              : quickResult === "incorrect"
                ? "Try the explicit formula again."
                : ""}
          </output>
        </article>
        <article>
          <h2>8. Practice More</h2>
          <div className="practice-card">
            <b>Generate terms up to any n</b>
            <p>Try different values of a₁ and d.</p>
          </div>
          <div className="practice-card">
            <b>Real-world modeling</b>
            <p>Model linear growth with constant change.</p>
          </div>
          <div className="practice-card">
            <b>Challenge yourself</b>
            <p>Solve inverse problems and mixed questions.</p>
          </div>
          <button
            className="practice-button"
            onClick={() => act(() => setTab("Guided Practice"))}
          >
            Go to Practice Set →
          </button>
        </article>
      </section>
    </section>
  );
}
