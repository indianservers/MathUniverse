import {
  Check,
  CircleAlert,
  Info,
  Lightbulb,
  Play,
  RotateCcw,
  Star,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { LessonAdapterProps } from "../types";
import "./ExponentialCalculationsTargetLesson9.css";
const VIEWS = [
  "Interaction + visualization",
  "Explain",
  "Examples",
  "Formulas",
  "Know more",
];
const PRACTICE = [
  [3, 4],
  [5, 3],
  [2, 6],
] as const;
export default function ExponentialCalculationsTargetLesson9({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [base, setBase] = useState(2),
    [exponent, setExponent] = useState(8),
    [view, setView] = useState(0),
    [animationStep, setAnimationStep] = useState(8),
    [animating, setAnimating] = useState(false),
    [problem, setProblem] = useState(0),
    [answer, setAnswer] = useState("81"),
    [feedback, setFeedback] = useState<"idle" | "correct" | "incorrect">(
      "correct",
    );
  const output = useMemo(() => base ** exponent, [base, exponent]);
  const [practiceBase, practiceExponent] = PRACTICE[problem],
    practiceResult = practiceBase ** practiceExponent;
  useEffect(() => {
    setBase(2);
    setExponent(8);
    setView(0);
    setAnimationStep(8);
    setAnimating(false);
    setProblem(0);
    setAnswer("81");
    setFeedback("correct");
  }, [resetToken]);
  useEffect(() => {
    if (!animating) return;
    setAnimationStep(0);
    const timer = globalThis.setInterval(
      () =>
        setAnimationStep((value) => {
          if (value >= exponent) {
            globalThis.clearInterval(timer);
            setAnimating(false);
            return exponent;
          }
          return value + 1;
        }),
      260,
    );
    return () => globalThis.clearInterval(timer);
  }, [animating, exponent]);
  const changeBase = (next: number) => {
    setBase(Math.max(2, Math.min(9, Math.round(next))));
    setAnimationStep(exponent);
    onInteraction();
  };
  const changeExponent = (next: number) => {
    const safe = Math.max(0, Math.min(8, Math.round(next)));
    setExponent(safe);
    setAnimationStep(safe);
    onInteraction();
  };
  const grade = () => {
    setFeedback(Number(answer) === practiceResult ? "correct" : "incorrect");
    onInteraction();
  };
  const nextProblem = () => {
    const next = (problem + 1) % PRACTICE.length;
    setProblem(next);
    setAnswer("");
    setFeedback("idle");
    onInteraction();
  };
  return (
    <div
      className="target-exponential-page"
      data-testid="calculator-mockup-0009"
      data-dedicated-lesson="9"
      data-object-model="base-exponent-factor-chain-draggable-staircase-growth-chart-animation-practice-model"
      data-base={base}
      data-exponent={exponent}
      data-output={output}
      data-view={view}
      data-animation-step={animationStep}
      data-animating={animating}
      data-problem={problem}
      data-feedback={feedback}
    >
      <div className="target-exponential-columns">
        <main>
          <header className="target-exponential-header">
            <h1>Exponential Calculations</h1>
            <p>Explore exponential growth and repeated multiplication.</p>
            <div>
              <b>⚲ Foundational-Advanced</b>
              <b>⌁ Calculator Lab</b>
              <b>▤ Scientific Calculator</b>
              <b>◷ 6-10 min</b>
            </div>
            <nav>
              <button
                type="button"
                onClick={() => {
                  setBase(2);
                  setExponent(8);
                  setAnimationStep(8);
                  onInteraction();
                }}
              >
                <RotateCcw />
                Reset
              </button>
              <button
                type="button"
                onClick={() =>
                  navigator.clipboard?.writeText(
                    `${base}^${exponent} = ${output}`,
                  )
                }
              >
                ⌘ Share
              </button>
            </nav>
          </header>
          <nav className="target-exponential-tabs">
            {VIEWS.map((label, index) => (
              <button
                type="button"
                className={view === index ? "active" : ""}
                key={label}
                onClick={() => {
                  setView(index);
                  onInteraction();
                }}
              >
                {label}
              </button>
            ))}
          </nav>
          <section className="exponential-lab">
            <h2>
              Exponential Growth Lab: {base}
              <sup>{exponent}</sup>
            </h2>
            <div className="exponential-summary">
              <section>
                <h3>Repeated multiplication (factor chain)</h3>
                <div>
                  {Array.from({ length: exponent }, (_, i) => (
                    <span key={i}>
                      <b>{base}</b>
                      {i < exponent - 1 ? <i>×</i> : null}
                    </span>
                  ))}
                </div>
                <p>
                  {exponent} factors of {base}
                </p>
              </section>
              <aside>
                <b>
                  {base}
                  <sup>{exponent}</sup> = {output}
                </b>
                <strong>
                  not {base} × {exponent}
                </strong>
              </aside>
            </div>
            <div className="exponential-controls">
              <Control
                label="Base"
                value={base}
                onMinus={() => changeBase(base - 1)}
                onPlus={() => changeBase(base + 1)}
              />
              <Control
                label="Exponent"
                value={exponent}
                onMinus={() => changeExponent(exponent - 1)}
                onPlus={() => changeExponent(exponent + 1)}
              />
              <button
                type="button"
                onClick={() => {
                  setAnimating(true);
                  onInteraction();
                }}
              >
                <Play />
                {animating ? "Animating..." : "Animate growth"}
              </button>
            </div>
            <h3 className="stair-title">
              Doubling staircase (each step multiplies by {base})
            </h3>
            <div className="exponential-staircase">
              {Array.from({ length: exponent + 1 }, (_, i) => (
                <div
                  className={i <= animationStep ? "shown" : ""}
                  style={{ height: `${20 + i * 9}px` }}
                  key={i}
                >
                  <b>{base ** i}</b>
                  <span>
                    {base}
                    <sup>{i}</sup>
                  </span>
                  {i < exponent ? <i>×{base}</i> : null}
                  {i === exponent ? (
                    <strong>
                      <Star />
                      {output}
                    </strong>
                  ) : null}
                </div>
              ))}
            </div>
            <div className="exponential-drag">
              <b>Drag the exponent steps to explore (0 to 8)</b>
              <input
                aria-label="Exponent drag control"
                type="range"
                min="0"
                max="8"
                value={exponent}
                onChange={(event) => changeExponent(Number(event.target.value))}
              />
              <div>
                {Array.from({ length: 9 }, (_, i) => (
                  <button
                    type="button"
                    className={i === exponent ? "active" : ""}
                    onClick={() => changeExponent(i)}
                    key={i}
                  >
                    {base}
                    <sup>{i}</sup>
                  </button>
                ))}
              </div>
            </div>
            <h3 className="growth-title">
              Growth chart <small>(exponential growth)</small>
            </h3>
            <div className="exponential-chart">
              {Array.from({ length: exponent + 1 }, (_, i) => (
                <div className={i <= animationStep ? "shown" : ""} key={i}>
                  <b>{base ** i}</b>
                  <i
                    style={{
                      height: `${Math.max(8, (base ** i / output) * 100)}%`,
                    }}
                  />
                  <span>
                    {base}
                    <sup>{i}</sup>
                  </span>
                </div>
              ))}
            </div>
          </section>
          <section className="exponential-practice">
            <header>
              <h2>Try it yourself</h2>
              <p>Evaluate the expression below.</p>
              <button type="button" onClick={nextProblem}>
                <RotateCcw />
                New problem
              </button>
            </header>
            <div>
              <strong>
                {practiceBase}
                <sup>{practiceExponent}</sup>
              </strong>
              <span>
                <b>Factor chain</b>
                {Array.from({ length: practiceExponent }, (_, i) => (
                  <i key={i}>
                    {practiceBase}
                    {i < practiceExponent - 1 ? " × " : ""}
                  </i>
                ))}
                <small>
                  {practiceExponent} factors of {practiceBase}
                </small>
              </span>
              <label>
                Your answer
                <input
                  aria-label="Exponential practice answer"
                  value={answer}
                  onChange={(event) => {
                    setAnswer(event.target.value);
                    setFeedback("idle");
                  }}
                />
              </label>
              <label>
                Correct answer<output>{practiceResult}</output>
              </label>
              <aside className={feedback}>
                <button type="button" onClick={grade}>
                  <Check />
                  Check
                </button>
                <b>
                  {feedback === "correct"
                    ? "Great job!"
                    : feedback === "incorrect"
                      ? "Try again"
                      : "Check your answer"}
                </b>
                <p>
                  {practiceBase}
                  <sup>{practiceExponent}</sup> = {practiceResult}
                </p>
              </aside>
            </div>
          </section>
        </main>
        <aside className="exponential-trace">
          <h2>Concept trace</h2>
          <Trace
            title="Base"
            value={String(base)}
            note="The number being multiplied."
            tone="cyan"
          />
          <Trace
            title="Exponent"
            value={String(exponent)}
            note="The exponent counts how many times the base is used as a factor."
            tone="cyan"
          />
          <Trace
            title="Repeated factors"
            value={Array.from({ length: exponent }, () => base).join(" × ")}
            note={`${exponent} ${base}s (${exponent} factors).`}
            tone="violet"
          />
          <Trace
            title="Output"
            value={String(output)}
            note={`The result after multiplying ${exponent} ${base}s.`}
            tone="orange"
          />
          <section className="misconception">
            <CircleAlert />
            <h3>Misconception guard</h3>
            <b>exponent counts factors</b>
            <p>
              It is not {base} × {exponent}.<br />
              {base}
              <sup>{exponent}</sup> means {exponent} {base}s multiplied.
            </p>
          </section>
          <section className="think">
            <Lightbulb />
            <h3>Think bigger</h3>
            <p>
              Each time the exponent increases by 1, the value multiplies by{" "}
              {base}.
            </p>
            <b>
              {Array.from({ length: 5 }, (_, i) => base ** i).join(" → ")} → ...
            </b>
          </section>
        </aside>
      </div>
    </div>
  );
}
function Control({
  label,
  value,
  onMinus,
  onPlus,
}: {
  label: string;
  value: number;
  onMinus: () => void;
  onPlus: () => void;
}) {
  return (
    <section>
      <b>
        {label}
        <Info />
      </b>
      <div>
        <button
          type="button"
          aria-label={`Decrease ${label}`}
          onClick={onMinus}
        >
          −
        </button>
        <strong>{value}</strong>
        <button type="button" aria-label={`Increase ${label}`} onClick={onPlus}>
          +
        </button>
      </div>
    </section>
  );
}
function Trace({
  title,
  value,
  note,
  tone,
}: {
  title: string;
  value: string;
  note: string;
  tone: string;
}) {
  return (
    <section className={`trace-card ${tone}`}>
      <h3>
        {title}
        <Info />
      </h3>
      <b>{value}</b>
      <p>{note}</p>
    </section>
  );
}
