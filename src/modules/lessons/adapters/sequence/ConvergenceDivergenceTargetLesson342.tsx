import { Maximize2, RotateCcw, Share2 } from "lucide-react";
import { useEffect, useState } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";
import type { LessonAdapterProps } from "../../types";
import {
  convergenceDivergenceAnalysis,
  geometricComparisonPartials,
} from "./convergenceDivergenceLessonModel";
import type { ConvergenceSeriesType } from "./convergenceDivergenceLessonModel";
import "./ConvergenceDivergenceTargetLesson342.css";
import { LessonTopicStudyBoard } from "../../components/LessonTopicStudyBoard";

const types: ConvergenceSeriesType[] = [
  "Geometric",
  "p-Series",
  "Alternating",
  "Factorial",
  "Custom",
];
const tabs = [
  "Interaction + Visualization",
  "Explain",
  "Examples",
  "Formulas",
  "Know more",
];
const clean = (value: number) => Number(value.toFixed(6));

export default function ConvergenceDivergenceTargetLesson342({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [type, setType] = useState<ConvergenceSeriesType>("Geometric");
  const [first, setFirst] = useState(4);
  const [ratio, setRatio] = useState(0.5);
  const [power, setPower] = useState(2);
  const [scale, setScale] = useState(1);
  const [shift, setShift] = useState(0);
  const [tolerance, setTolerance] = useState(0.05);
  const [comparison, setComparison] = useState("Divergent geometric, r = 1.5");
  const [tab, setTab] = useState(tabs[0]);
  const [language, setLanguage] = useState<"en" | "hi">("en");
  const [question, setQuestion] = useState(0);
  const [answer, setAnswer] = useState<"" | "correct" | "incorrect">("");
  const [fullscreen, setFullscreen] = useState(false);
  const [actions, setActions] = useState(0);

  const reset = () => {
    setType("Geometric");
    setFirst(4);
    setRatio(0.5);
    setPower(2);
    setScale(1);
    setShift(0);
    setTolerance(0.05);
    setComparison("Divergent geometric, r = 1.5");
    setTab(tabs[0]);
    setLanguage("en");
    setQuestion(0);
    setAnswer("");
    setFullscreen(false);
    setActions(0);
  };
  useEffect(reset, [resetToken]);
  const act = (run: () => void) => {
    run();
    setActions((value) => value + 1);
    onInteraction();
  };
  const analysis = convergenceDivergenceAnalysis({
    type,
    first,
    ratio,
    power,
    scale,
    shift,
  });
  const {
    terms,
    partials,
    convergent,
    absolute,
    nthLimit,
    ratioLimit,
    infiniteSum,
    plotMin,
    plotMax,
  } = analysis;
  const graphY = (value: number) =>
    178 - ((value - plotMin) / Math.max(plotMax - plotMin, 0.001)) * 132;
  const compareRatio = comparison.includes("1.2")
    ? 1.2
    : comparison.includes("-1")
      ? -1
      : 1.5;
  const compare = geometricComparisonPartials(compareRatio);
  const challenges = [
    {
      label: "Classify Σ 3^(n-1) / 5^n.",
      choices: [
        "Convergent",
        "Divergent",
        "Indeterminate",
        "Terms do not approach 0",
      ],
      correct: 0,
    },
    {
      label: "Classify Σ 1 / n^0.8.",
      choices: ["Convergent", "Divergent", "Alternating", "Finite"],
      correct: 1,
    },
  ];
  const dragPoint = (event: ReactPointerEvent<SVGCircleElement>) => {
    if (event.buttons !== 1) return;
    const rect = event.currentTarget.ownerSVGElement?.getBoundingClientRect();
    if (!rect) return;
    const normalized = Math.max(
      -1,
      Math.min(1, ((event.clientY - rect.top) / rect.height - 0.5) * 2),
    );
    act(() => {
      if (type === "Geometric") setRatio(clean(-normalized * 1.8));
      else if (type !== "Factorial")
        setPower(clean(Math.max(0.1, (1 - normalized) * 2)));
      setAnswer("");
    });
  };
  const setModel = (next: ConvergenceSeriesType) =>
    act(() => {
      setType(next);
      setAnswer("");
    });
  return (
    <section
      className={`seq342-page${fullscreen ? " fullscreen" : ""}`}
      data-testid="sequence-mockup-0527"
      data-object-model="five-series-models-generated-terms-partial-sums-draggable-analysis-point-tolerance-band-nth-term-test-ratio-test-classification-counterexample-comparison-worked-proof-multi-question-practice"
      data-series-type={type}
      data-terms={terms.map(clean).join(",")}
      data-partials={partials.map(clean).join(",")}
      data-converges={convergent}
      data-absolute={absolute}
      data-nth-limit={nthLimit}
      data-ratio-limit={ratioLimit}
      data-sum={infiniteSum === null ? "diverges" : clean(infiniteSum)}
      data-tolerance={tolerance}
      data-tab={tab}
      data-language={language}
      data-question={question}
      data-quick-result={answer}
      data-actions={actions}
    >
      <header className="seq342-hero">
        <span>
          <b>ADVANCED MATHEMATICS</b>
          <b>SEQUENCES AND SERIES</b>
        </span>
        <h1>
          {language === "en" ? "Convergence and Divergence" : "अभिसरण और अपसरण"}
        </h1>
        <p>
          {language === "en"
            ? "Classify sequence behaviour."
            : "अनुक्रम के व्यवहार का वर्गीकरण करें।"}
        </p>
        <div>
          {[
            "Intermediate-Advanced",
            "Exploration + Analysis",
            "Sequence / CAS",
            "6-10 min",
          ].map((item) => (
            <b key={item}>{item}</b>
          ))}
        </div>
        <nav>
          <select
            aria-label="Language"
            value={language}
            onChange={(event) =>
              act(() => setLanguage(event.target.value as "en" | "hi"))
            }
          >
            <option value="en">English (English)</option>
            <option value="hi">हिन्दी (Hindi)</option>
          </select>
          <button onClick={() => act(reset)}>
            <RotateCcw />
            Reset All
          </button>
          <button
            onClick={() =>
              act(() => navigator.clipboard?.writeText(location.href))
            }
          >
            <Share2 />
            Share
          </button>
          <button
            onClick={() => {
              act(() => setTab(tabs[0]));
              document
                .getElementById("seq342-define")
                ?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            Workspace
          </button>
        </nav>
      </header>
      <nav className="seq342-tabs">
        {tabs.map((item) => (
          <button
            className={tab === item ? "active" : ""}
            key={item}
            onClick={() => {
              act(() => setTab(item));
              document
                .getElementById(
                  item === tabs[0]
                    ? "seq342-define"
                    : item === "Examples"
                      ? "seq342-worked"
                      : item === "Formulas"
                        ? "seq342-tests"
                        : "seq342-objective",
                )
                ?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            {item}
          </button>
        ))}
      </nav>
      <section className="seq342-objective" id="seq342-objective">
        <article>
          <small>LEARNING OBJECTIVE</small>
          <p>
            Determine whether an infinite series converges or diverges using
            partial sums, nth-term test, and the ratio test.
          </p>
        </article>
        <article>
          <b>By the end, you will be able to:</b>
          <ul>
            <li>Compute partial sums and observe behaviour.</li>
            <li>Apply necessary tests for divergence.</li>
            <li>Use the ratio test for convergence.</li>
            <li>Interpret and classify series correctly.</li>
          </ul>
        </article>
        <div className="seq342-growth">▁▂▃▄▅▇</div>
      </section>
      <section className="seq342-define" id="seq342-define">
        <h2>
          <i>1</i> Define the series
        </h2>
        <div className="seq342-define-grid">
          <article>
            <label>Select series type</label>
            <div className="seq342-type">
              {types.map((item) => (
                <button
                  className={type === item ? "active" : ""}
                  onClick={() => setModel(item)}
                  key={item}
                >
                  {item}
                </button>
              ))}
            </div>
            <p>
              Define the nth term a<sub>n</sub>
            </p>
            <strong className="seq342-rule">
              {type === "Geometric"
                ? "aₙ = a₁ rⁿ⁻¹"
                : type === "p-Series"
                  ? "aₙ = 1 / nᵖ"
                  : type === "Alternating"
                    ? "aₙ = (-1)ⁿ⁻¹ / nᵖ"
                    : type === "Factorial"
                      ? "aₙ = 1 / n!"
                      : "aₙ = c / (n+s)ᵖ"}
            </strong>
            <div className="seq342-inputs">
              {type === "Geometric" && (
                <>
                  <label>
                    First term a₁
                    <input
                      aria-label="First term"
                      type="number"
                      value={first}
                      onChange={(e) =>
                        act(() => setFirst(clean(Number(e.target.value))))
                      }
                    />
                  </label>
                  <label>
                    Common ratio r
                    <input
                      aria-label="Common ratio"
                      type="number"
                      step="0.1"
                      value={ratio}
                      onChange={(e) =>
                        act(() => setRatio(clean(Number(e.target.value))))
                      }
                    />
                  </label>
                </>
              )}
              {(type === "p-Series" || type === "Alternating") && (
                <label>
                  Power p
                  <input
                    aria-label="Power"
                    type="number"
                    step="0.1"
                    value={power}
                    onChange={(e) =>
                      act(() => setPower(clean(Number(e.target.value))))
                    }
                  />
                </label>
              )}
              {type === "Custom" && (
                <>
                  <label>
                    Scale c
                    <input
                      aria-label="Scale"
                      type="number"
                      value={scale}
                      onChange={(e) =>
                        act(() => setScale(clean(Number(e.target.value))))
                      }
                    />
                  </label>
                  <label>
                    Shift s
                    <input
                      aria-label="Shift"
                      type="number"
                      step="0.1"
                      value={shift}
                      onChange={(e) =>
                        act(() =>
                          setShift(
                            Math.max(-0.9, clean(Number(e.target.value))),
                          ),
                        )
                      }
                    />
                  </label>
                  <label>
                    Power p
                    <input
                      aria-label="Power"
                      type="number"
                      step="0.1"
                      value={power}
                      onChange={(e) =>
                        act(() => setPower(clean(Number(e.target.value))))
                      }
                    />
                  </label>
                </>
              )}
            </div>
            <output
              className={type === "Geometric" && ratio === 1 ? "bad" : ""}
            >
              ✓ Active {type.toLowerCase()} model.
            </output>
          </article>
          <aside>
            <b>Current series</b>
            <strong>
              {type === "Geometric" ? `aₙ = ${first}(${ratio})ⁿ⁻¹` : type}
            </strong>
            <b>Series notation</b>
            <strong>Σ aₙ, n ≥ 1</strong>
            <b>Current sum</b>
            <strong>
              {infiniteSum === null
                ? "No finite sum"
                : `S ≈ ${clean(infiniteSum)}`}
            </strong>
          </aside>
        </div>
      </section>
      <section className="seq342-plot">
        <header>
          <h2>
            <i>2</i> Partial sums visualization
          </h2>
          <label>
            Drag tolerance band{" "}
            <input
              aria-label="Tolerance"
              type="range"
              min="0.01"
              max="0.5"
              step="0.01"
              value={tolerance}
              onChange={(e) => act(() => setTolerance(Number(e.target.value)))}
            />
            <b>± {tolerance}</b>
          </label>
          <button
            title="Fullscreen"
            onClick={() => act(() => setFullscreen((value) => !value))}
          >
            <Maximize2 />
          </button>
        </header>
        <div>
          <svg viewBox="0 0 600 220" role="img" aria-label="Partial sums plot">
            <path d="M36 18V190H584" />
            <text x="18" y="20">
              Sₙ
            </text>
            {infiniteSum !== null && (
              <>
                <rect
                  className="band"
                  x="36"
                  y={graphY(infiniteSum + tolerance)}
                  width="548"
                  height={Math.abs(
                    graphY(infiniteSum - tolerance) -
                      graphY(infiniteSum + tolerance),
                  )}
                />
                <line
                  className="limit"
                  x1="36"
                  x2="584"
                  y1={graphY(infiniteSum)}
                  y2={graphY(infiniteSum)}
                />
              </>
            )}
            {partials.map((value, index) => {
              const x = 50 + index * 27;
              return (
                <g key={index}>
                  <line
                    className="stem"
                    x1={x}
                    x2={x}
                    y1="190"
                    y2={graphY(value)}
                  />
                  <circle
                    className="point"
                    cx={x}
                    cy={graphY(value)}
                    r={index === partials.length - 1 ? 7 : 4}
                    onPointerDown={(e) =>
                      e.currentTarget.setPointerCapture(e.pointerId)
                    }
                    onPointerMove={
                      index === partials.length - 1 ? dragPoint : undefined
                    }
                  />
                </g>
              );
            })}
          </svg>
          <aside>
            <table>
              <caption>Latest values</caption>
              <thead>
                <tr>
                  <th>n</th>
                  <th>Sₙ</th>
                </tr>
              </thead>
              <tbody>
                {[0, 1, 2, 4, 9, 19].map((index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{clean(partials[index])}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </aside>
        </div>
        <output>
          The partial sums{" "}
          {convergent
            ? "settle toward a finite limit"
            : "do not settle to a finite limit"}{" "}
          as n increases.
        </output>
      </section>
      <section className="seq342-tests" id="seq342-tests">
        <article>
          <h2>
            <i>3</i> Nth-term test
          </h2>
          <strong>
            lim aₙ ={" "}
            {nthLimit !== null && Number.isFinite(nthLimit)
              ? nthLimit
              : "does not exist"}
          </strong>
          <p className={nthLimit === 0 ? "good" : "bad"}>
            {nthLimit === 0
              ? "Necessary condition satisfied; this test alone is inconclusive."
              : "Terms do not approach zero, so the series diverges."}
          </p>
        </article>
        <article>
          <h2>
            <i>4</i> Ratio test
          </h2>
          <strong>L = lim |aₙ₊₁/aₙ| = {clean(ratioLimit)}</strong>
          <p
            className={
              ratioLimit < 1 ? "good" : ratioLimit > 1 ? "bad" : "neutral"
            }
          >
            {ratioLimit < 1
              ? "L < 1, so the series converges absolutely."
              : ratioLimit > 1
                ? "L > 1, so the series diverges."
                : "L = 1, so the ratio test is inconclusive."}
          </p>
        </article>
      </section>
      <section className="seq342-classify">
        <article>
          <h2>
            <i>5</i> Classification
          </h2>
          <small>CONCLUSION</small>
          <strong className={convergent ? "convergent" : "divergent"}>
            {convergent ? "✓ Convergent" : "× Divergent"}
          </strong>
          <p>
            {convergent
              ? absolute
                ? "The series converges absolutely to a finite sum."
                : "The series converges conditionally."
              : "The partial sums have no finite limit."}
          </p>
          <output>
            {infiniteSum === null
              ? "No finite sum"
              : `S ≈ ${clean(infiniteSum)}`}
          </output>
        </article>
        <article>
          <h2>Counterexample comparison</h2>
          <select
            aria-label="Counterexample"
            value={comparison}
            onChange={(e) => act(() => setComparison(e.target.value))}
          >
            <option>Divergent geometric, r = 1.5</option>
            <option>Divergent geometric, r = 1.2</option>
            <option>Oscillating geometric, r = -1</option>
          </select>
          <div className="seq342-mini">
            <svg viewBox="0 0 300 125">
              <path d="M22 8V105H288" />
              {compare.map((value, index) => {
                const high = Math.max(...compare.map(Math.abs), 1);
                return (
                  <circle
                    key={index}
                    cx={32 + index * 16}
                    cy={100 - (Math.min(Math.abs(value), high) / high) * 82}
                    r="3"
                  />
                );
              })}
            </svg>
            <strong>Divergent</strong>
          </div>
        </article>
      </section>
      <section className="seq342-worked" id="seq342-worked">
        <article>
          <h2>
            <i>6</i> Worked solution (step-by-step)
          </h2>
          <p>We are given a geometric series with a₁ = 4 and r = 0.5.</p>
          <ol>
            <li>Write the term: aₙ = 4(0.5)ⁿ⁻¹.</li>
            <li>Nth-term test: lim aₙ = 0; the test is inconclusive.</li>
            <li>
              Ratio test: L = |0.5| = 0.5 &lt; 1, therefore the series
              converges.
            </li>
            <li>Sum: S = 4/(1-0.5) = 8.</li>
          </ol>
          <output>Hence, Σ 4(0.5)ⁿ⁻¹ converges and its sum is 8.</output>
        </article>
        <aside>
          <section>
            <b>Key insight</b>
            <p>
              The magnitude of the ratio determines geometric-series behaviour:
              |r| &lt; 1 converges; |r| ≥ 1 diverges.
            </p>
          </section>
          <section>
            <b>Common misconception</b>
            <p>
              Terms approaching zero is necessary, but it is not sufficient for
              convergence.
            </p>
          </section>
          <section>
            <b>Assumptions / Comparison</b>
            <p>
              These models use real numbers and infinite series indexed from n =
              1.
            </p>
          </section>
        </aside>
      </section>
      <section className="seq342-check">
        <article>
          <h2>
            <i>7</i> Quick check
          </h2>
          <b>{challenges[question].label}</b>
          <div>
            {challenges[question].choices.map((choice, index) => (
              <button
                className={
                  answer && index === challenges[question].correct
                    ? "correct"
                    : ""
                }
                key={choice}
                onClick={() =>
                  act(() =>
                    setAnswer(
                      index === challenges[question].correct
                        ? "correct"
                        : "incorrect",
                    ),
                  )
                }
              >
                {String.fromCharCode(65 + index)}. {choice}
              </button>
            ))}
          </div>
        </article>
        <aside className={answer}>
          <b>
            {answer === "correct"
              ? "Correct!"
              : answer === "incorrect"
                ? "Try again"
                : "Choose an answer."}
          </b>
          {answer === "correct" && (
            <>
              <p>
                The applicable convergence test confirms this classification.
              </p>
              <button
                onClick={() =>
                  act(() => {
                    setQuestion((value) => (value + 1) % challenges.length);
                    setAnswer("");
                  })
                }
              >
                Next Question →
              </button>
            </>
          )}
        </aside>
      </section>
      <LessonTopicStudyBoard lessonId={342} view={tab} onInteraction={onInteraction} />

    </section>
  );
}
