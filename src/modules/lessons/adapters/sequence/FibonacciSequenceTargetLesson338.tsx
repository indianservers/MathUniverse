import { Check, Pause, Play, RotateCcw, Share2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";
import type { LessonAdapterProps } from "../../types";
import {
  fibonacciSequenceAnalysis,
  fibonacciSpiralSquares,
  GOLDEN_RATIO as PHI,
  standardBinet,
} from "./fibonacciSequenceLessonModel";
import "./FibonacciSequenceTargetLesson338.css";
import { LessonTopicStudyBoard } from "../../components/LessonTopicStudyBoard";

const clean = (v: number, d = 6) => Number(v.toFixed(d));
const tabs = [
  "Interaction + visualisation",
  "Explain",
  "Examples",
  "Formulas",
  "Know more",
];
export default function FibonacciSequenceTargetLesson338({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [first, setFirst] = useState(1),
    [second, setSecond] = useState(1),
    [built, setBuilt] = useState(6),
    [auto, setAuto] = useState(true),
    [speed, setSpeed] = useState(5),
    [playing, setPlaying] = useState(false),
    [tab, setTab] = useState(tabs[0]),
    [saved, setSaved] = useState(true),
    [language, setLanguage] = useState<"en" | "hi">("en"),
    [quick, setQuick] = useState<"" | "correct" | "incorrect">(""),
    [actions, setActions] = useState(0);
  const analysis = useMemo(
      () => fibonacciSequenceAnalysis(first, second),
      [first, second],
    ),
    { terms, ratios, phiErrors } = analysis,
    squares = fibonacciSpiralSquares(terms);
  const reset = () => {
    setFirst(1);
    setSecond(1);
    setBuilt(6);
    setAuto(true);
    setSpeed(5);
    setPlaying(false);
    setTab(tabs[0]);
    setSaved(true);
    setLanguage("en");
    setQuick("");
    setActions(0);
  };
  useEffect(reset, [resetToken]);
  useEffect(() => {
    if (!playing || !auto) return;
    const timer = window.setInterval(
      () => setBuilt((v) => (v >= 12 ? 2 : v + 1)),
      Math.max(180, 1100 - speed * 130),
    );
    return () => window.clearInterval(timer);
  }, [playing, auto, speed]);
  const act = (run: () => void) => {
    run();
    setActions((v) => v + 1);
    onInteraction();
  };
  const seed = (which: "first" | "second", delta: number) =>
    act(() => {
      const setter = which === "first" ? setFirst : setSecond;
      setter((v) => Math.max(1, Math.min(20, Math.round(v + delta))));
      setBuilt(6);
      setQuick("");
    });
  const dragSeed = (event: ReactPointerEvent<SVGRectElement>) => {
    if (event.buttons !== 1) return;
    const rect = event.currentTarget.ownerSVGElement?.getBoundingClientRect();
    if (!rect) return;
    const value = Math.max(
      1,
      Math.min(
        20,
        Math.round(1 + ((event.clientX - rect.left) / rect.width) * 9),
      ),
    );
    act(() => {
      setSecond(value);
      setBuilt(12);
    });
  };
  const share = () =>
    act(() =>
      navigator.clipboard?.writeText(
        `${location.href}?f1=${first}&f2=${second}`,
      ),
    );
  const toggleSaved = () =>
    act(() => {
      const next = !saved;
      setSaved(next);
      if (next)
        localStorage.setItem(
          "math-universe-fibonacci-seeds",
          JSON.stringify({ first, second }),
        );
      else localStorage.removeItem("math-universe-fibonacci-seeds");
    });
  const colors = [
    "#d7b7fa",
    "#b9dbff",
    "#b9edcf",
    "#f7e7a7",
    "#f8b6a9",
    "#e9b7fa",
    "#a9e8e5",
  ];
  return (
    <section
      className="seq338-page"
      data-testid="sequence-mockup-0523"
      data-object-model="two-positive-integer-seeds-pairwise-recurrence-auto-build-speed-generated-term-list-fibonacci-square-spiral-draggable-seed-ratio-phi-convergence-binet-practice"
      data-first={first}
      data-second={second}
      data-built={built}
      data-auto={auto}
      data-playing={playing}
      data-speed={speed}
      data-terms={terms.join(",")}
      data-ratios={ratios
        .slice(1)
        .map((v) => clean(v))
        .join(",")}
      data-tab={tab}
      data-saved={saved}
      data-quick-result={quick}
      data-actions={actions}
      data-language={language}
    >
      <header className="seq338-hero">
        <span>
          <b>ADVANCED MATHEMATICS</b>
          <b>SEQUENCES AND SERIES</b>
        </span>
        <h1>{language === "en" ? "Fibonacci Sequence" : "फिबोनाची अनुक्रम"}</h1>
        <p>
          {language === "en"
            ? "Explore a famous recurrence."
            : "एक प्रसिद्ध पुनरावृत्ति का अन्वेषण करें।"}
        </p>
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
          <select
            aria-label="Lesson language"
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
            Reset
          </button>
          <button onClick={share}>
            <Share2 />
            Share
          </button>
          <button
            onClick={() => {
              act(() => setTab(tabs[0]));
              document
                .getElementById("seq338-build")
                ?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            Workspace
          </button>
        </nav>
      </header>
      <nav className="seq338-tabs">
        {tabs.map((name) => (
          <button
            key={name}
            className={tab === name ? "active" : ""}
            onClick={() => {
              act(() => setTab(name));
              const target =
                name === tabs[0]
                  ? "seq338-build"
                  : name === "Formulas"
                    ? "seq338-theory"
                    : name === "Examples"
                      ? "seq338-spiral"
                      : "seq338-bottom";
              document
                .getElementById(target)
                ?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            {name}
          </button>
        ))}
      </nav>
      <section className="seq338-build" id="seq338-build">
        <header>
          <div>
            <h2>Build, visualize, and discover the Fibonacci sequence</h2>
            <p>
              Change the seeds, watch the sequence grow, explore the spiral, and
              see ratios converge to φ.
            </p>
          </div>
          <button onClick={toggleSaved}>
            {saved ? (
              <>
                <Check />
                Saved
              </>
            ) : (
              "Save"
            )}
          </button>
        </header>
        <main>
          <article className="seeds">
            <h3>
              <i>1</i> Choose two seeds
            </h3>
            <p>Start the sequence with any two positive integers.</p>
            {[
              ["First seed (F₁)", first, "first"],
              ["Second seed (F₂)", second, "second"],
            ].map(([label, value, id]) => (
              <label key={String(id)}>
                {label}
                <span>
                  <button onClick={() => seed(id as "first" | "second", -1)}>
                    −
                  </button>
                  <output>{value}</output>
                  <button onClick={() => seed(id as "first" | "second", 1)}>
                    +
                  </button>
                </span>
              </label>
            ))}
            <button
              onClick={() =>
                act(() => {
                  setFirst(1);
                  setSecond(1);
                  setBuilt(6);
                })
              }
            >
              <RotateCcw />
              Reset seeds
            </button>
          </article>
          <article className="chain">
            <h3>
              <i>2</i> Build the sequence (pairwise addition)
            </h3>
            <p>Each new term is the sum of the previous two.</p>
            <div>
              {terms
                .slice(0, Math.min(built, 7))
                .slice(2)
                .map((v, i) => (
                  <span key={i}>
                    {terms[i]} + {terms[i + 1]} = <b>{v}</b>
                  </span>
                ))}
            </div>
            <ol>
              {terms.slice(0, built).map((_, i) => (
                <li key={i}>F{i + 1}</li>
              ))}
            </ol>
            <footer>
              <label>
                Auto build{" "}
                <input
                  aria-label="Fibonacci auto build"
                  type="checkbox"
                  checked={auto}
                  onChange={(e) => act(() => setAuto(e.target.checked))}
                />
              </label>
              <label>
                Speed{" "}
                <input
                  aria-label="Fibonacci build speed"
                  type="range"
                  min="1"
                  max="7"
                  value={speed}
                  onChange={(e) => act(() => setSpeed(Number(e.target.value)))}
                />
              </label>
              <button
                title={playing ? "Pause" : "Play"}
                onClick={() => act(() => setPlaying((v) => !v))}
              >
                {playing ? <Pause /> : <Play />}
              </button>
            </footer>
          </article>
          <article className="term-list">
            <h3>
              <i>3</i> Sequence terms
            </h3>
            <p>First 12 terms</p>
            <ol>
              {terms.map((v, i) => (
                <li key={i}>
                  F<sub>{i + 1}</sub> = <b>{v}</b>
                </li>
              ))}
            </ol>
          </article>
        </main>
      </section>
      <section className="seq338-pair">
        <article className="spiral" id="seq338-spiral">
          <h2>
            <i>4</i> Square spiral from Fibonacci rectangles
          </h2>
          <p>Squares with side lengths Fₙ form a logarithmic spiral.</p>
          <svg viewBox="0 0 430 330">
            {squares.map((square, index) => (
              <g key={square.index}>
                <rect
                  data-drag={
                    index === squares.length - 1
                      ? "fibonacci-seed-square"
                      : undefined
                  }
                  x={square.x}
                  y={square.y}
                  width={square.size}
                  height={square.size}
                  fill={colors[index]}
                  onPointerDown={
                    index === squares.length - 1
                      ? (event) =>
                          event.currentTarget.setPointerCapture(event.pointerId)
                      : undefined
                  }
                  onPointerMove={
                    index === squares.length - 1 ? dragSeed : undefined
                  }
                />
                <path d={square.arc} />
                {index < 2 && (
                  <text
                    x={square.x + square.size / 2}
                    y={square.y + square.size / 2}
                    textAnchor="middle"
                  >
                    {terms[square.index]} × {terms[square.index]}
                  </text>
                )}
              </g>
            ))}
          </svg>
          <p>
            Spiral approximates the golden spiral. Drag the smallest square to
            change F₂.
          </p>
        </article>
        <article className="ratios">
          <h2>
            <i>5</i> Ratios converge to φ (golden ratio)
          </h2>
          <p>Observe Fₙ/Fₙ₋₁ approach φ ≈ {PHI.toFixed(9)}.</p>
          <table>
            <thead>
              <tr>
                <th>n</th>
                <th>Fₙ</th>
                <th>Fₙ/Fₙ₋₁</th>
                <th>Difference from φ</th>
              </tr>
            </thead>
            <tbody>
              {terms.slice(1).map((v, i) => (
                <tr key={i}>
                  <td>{i + 2}</td>
                  <td>{v}</td>
                  <td>{ratios[i + 1].toFixed(6)}</td>
                  <td>{phiErrors[i + 1].toFixed(6)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <output>φ = (1 + √5) / 2 ≈ {PHI.toFixed(12)}</output>
        </article>
      </section>
      <section className="seq338-theory" id="seq338-theory">
        <article>
          <h2>
            <i>6</i> Nth-term (Binet's formula)
          </h2>
          <p>Closed form for the standard Fibonacci numbers.</p>
          <strong>Fₙ = (φⁿ − ψⁿ) / √5</strong>
          <p>
            φ = (1 + √5)/2 ≈ {PHI.toFixed(9)}
            <br />ψ = (1 − √5)/2 ≈ {(1 - PHI).toFixed(9)}
          </p>
          <output>For n=10, Binet gives {standardBinet(10)}.</output>
        </article>
        <article className="insight">
          <h2>Key insight</h2>
          <p>
            The Fibonacci sequence arises from a simple rule, yet appears in
            nature, art, architecture, and finance. Its ratios approach φ.
          </p>
          <svg viewBox="0 0 180 160">
            <path d="M145 135C70 155 20 105 43 52C64 3 137 21 138 75C139 118 87 132 66 101C47 73 78 45 105 59C129 71 116 99 96 98C80 97 77 79 88 73" />
          </svg>
        </article>
        <aside>
          <article>
            <h2>Common misconception</h2>
            <p>
              Fibonacci numbers are not always even or always odd. Their parity
              alternates even, odd, odd.
            </p>
          </article>
          <article>
            <h2>Assumptions & constraints</h2>
            <p>
              ✓ Seeds are positive integers.
              <br />✓ Fₙ = Fₙ₋₁ + Fₙ₋₂ for n ≥ 3.
              <br />✓ The recurrence extends to real seeds.
            </p>
          </article>
        </aside>
      </section>
      <section className="seq338-bottom" id="seq338-bottom">
        <article>
          <h2>Guided explanation</h2>
          {[
            "Start with any two positive integer seeds.",
            "Generate each term by adding the previous two.",
            "Plot the terms as square sizes to build a spiral.",
            "Compute ratios; they approach φ for positive seeds.",
            "Use Binet's formula for standard Fibonacci terms.",
          ].map((x, i) => (
            <p key={x}>
              <i>{i + 1}</i>
              {x}
            </p>
          ))}
        </article>
        <article className="quick">
          <h2>Quick check</h2>
          <p>What is the 10th term when F₁=1 and F₂=1?</p>
          {[34, 55, 89, 144].map((v, i) => (
            <button
              key={v}
              className={quick && v === 55 ? "correct" : ""}
              onClick={() =>
                act(() => setQuick(v === 55 ? "correct" : "incorrect"))
              }
            >
              {String.fromCharCode(65 + i)} &nbsp; {v}
            </button>
          ))}
          <output className={quick}>
            {quick === "correct"
              ? "Correct! F₁₀ = 55."
              : quick === "incorrect"
                ? "Add the two preceding terms each time."
                : "Choose an answer."}
          </output>
        </article>
      </section>
      <LessonTopicStudyBoard lessonId={338} view={tab} onInteraction={onInteraction} />

    </section>
  );
}
