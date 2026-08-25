import { ArrowRight, Check, Info, RotateCcw } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { LessonAdapterProps } from "../types";
import "./ScientificNotationTargetLesson7.css";

const VIEWS = [
  "Interaction + visualization",
  "Explain",
  "Examples",
  "Formulas",
  "Know more",
];
export default function ScientificNotationTargetLesson7({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [coefficient, setCoefficient] = useState(6.02),
    [exponent, setExponent] = useState(5),
    [view, setView] = useState(0),
    [instructions, setInstructions] = useState(false),
    [feedback, setFeedback] = useState<"idle" | "correct">("correct");
  const model = useMemo(
    () => notationModel(coefficient, exponent),
    [coefficient, exponent],
  );
  useEffect(() => {
    setCoefficient(6.02);
    setExponent(5);
    setView(0);
    setInstructions(false);
    setFeedback("correct");
  }, [resetToken]);
  const updateCoefficient = (delta: number) => {
    setCoefficient((value) =>
      Number(Math.max(1, Math.min(9.99, value + delta)).toFixed(2)),
    );
    setFeedback("idle");
    onInteraction();
  };
  const updateExponent = (delta: number) => {
    setExponent((value) => Math.max(-5, Math.min(6, value + delta)));
    setFeedback("idle");
    onInteraction();
  };
  return (
    <div
      className="target-notation-page"
      data-testid="calculator-mockup-0007"
      data-dedicated-lesson="7"
      data-object-model="coefficient-power-ten-number-line-decimal-shift-standard-form-ladder-practice-model"
      data-coefficient={coefficient}
      data-exponent={exponent}
      data-standard={model.standard}
      data-direction={model.direction}
      data-view={view}
      data-instructions={instructions}
      data-feedback={feedback}
    >
      <nav className="target-notation-breadcrumb">
        <a href="/">←</a>
        <a href="/">Home</a>
        <span>›</span>
        <a href="/lessons">Lessons</a>
        <span>›</span>
        <a href="/lessons/core-workspaces">Core Workspaces</a>
        <span>›</span>
        <b>7 Scientific Notation</b>
      </nav>
      <header className="target-notation-header">
        <h1>Scientific Notation</h1>
        <p>Understanding large numbers using coefficient × power of ten.</p>
        <div>
          <b>⚲ Foundational-Advanced</b>
          <b>ϟ Calculator Lab</b>
          <b>▤ Scientific Calculator</b>
          <b>◷ 6-10 min</b>
        </div>
        <nav>
          <button type="button" onClick={() => setView(0)}>
            ◉ English (English)⌄
          </button>
          <button
            type="button"
            onClick={() => {
              setCoefficient(6.02);
              setExponent(5);
              setFeedback("idle");
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
                `${coefficient} x 10^${exponent} = ${model.standard}`,
              )
            }
          >
            ⌘ Share
          </button>
        </nav>
      </header>
      <nav className="target-notation-tabs">
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
      <div className="target-notation-columns">
        <main>
          <section className="notation-lab">
            <header>
              <h2>Scientific Notation Scale Lab</h2>
              <p>
                Explore how coefficient × power of ten builds large numbers.
              </p>
              <button
                type="button"
                onClick={() => {
                  setInstructions((v) => !v);
                  onInteraction();
                }}
              >
                <Info />
                Instructions
              </button>
              {instructions ? (
                <aside>
                  Use the arrows to change either part. Each exponent step moves
                  the decimal one place.
                </aside>
              ) : null}
            </header>
            <div className="notation-controls">
              <Stepper
                label="Coefficient"
                note="(between 1 and 10)"
                value={format(coefficient)}
                onMinus={() => updateCoefficient(-0.01)}
                onPlus={() => updateCoefficient(0.01)}
                tone="cyan"
              />
              <ArrowRight />
              <Stepper
                label="Exponent"
                note="(power of ten)"
                value={String(exponent)}
                onMinus={() => updateExponent(-1)}
                onPlus={() => updateExponent(1)}
                tone="violet"
              />
            </div>
            <section className="notation-number-line">
              <h3>
                1. Coefficient on the number line{" "}
                <small>(between 1 and 10)</small>
              </h3>
              <div>
                {Array.from({ length: 14 }, (_, i) => (
                  <i key={i} />
                ))}
                <b style={{ left: `${((coefficient - 1) / 9) * 100}%` }}>
                  {format(coefficient)}
                </b>
              </div>
              <span>1</span>
              <span>10</span>
            </section>
            <section className="notation-movement">
              <h3>
                2. Move the decimal {Math.abs(exponent)} places to the{" "}
                {model.direction}
              </h3>
              <div>
                {model.steps.map((value, index) => (
                  <span
                    key={`${value}-${index}`}
                    className={index === model.steps.length - 1 ? "final" : ""}
                  >
                    <b>{index ? index : ""}</b>
                    <strong>{value}</strong>
                    {index < model.steps.length - 1 ? <ArrowRight /> : null}
                  </span>
                ))}
              </div>
            </section>
            <div className="notation-equation">
              {format(coefficient)} × 10<sup>{exponent}</sup> ={" "}
              <strong>{model.standard}</strong>
            </div>
            <section className="notation-practice">
              <h3>⌕ Practice</h3>
              <p>Write 4.7 × 10³ in standard form.</p>
              <button
                type="button"
                onClick={() => {
                  setFeedback("correct");
                  onInteraction();
                }}
              >
                <Check />
                Check Answer
              </button>
              <div className={feedback === "correct" ? "shown" : ""}>
                {feedback === "correct" ? (
                  <>
                    <Check />
                    <b>Answer: 4,700</b>
                  </>
                ) : (
                  "Click Check Answer when ready."
                )}
              </div>
            </section>
          </section>
        </main>
        <aside className="notation-side">
          <section>
            <h2>Concept Trace</h2>
            <Trace
              title="Coefficient"
              value={format(coefficient)}
              tone="blue"
            />
            <Trace title="Power" value={`10^${exponent}`} tone="violet" />
            <Trace
              title="Decimal moves"
              value={`${Math.abs(exponent)} places ${model.direction}`}
              tone="cyan"
            />
            <Trace title="Standard form" value={model.standard} tone="cyan" />
          </section>
          <section className="notation-ladder">
            <h2>Powers of Ten Ladder</h2>
            {Array.from({ length: 6 }, (_, i) => (
              <div className={i === exponent ? "active" : ""} key={i}>
                <i />
                <b>
                  10<sup>{i}</sup> = {formatNumber(10 ** i)}
                </b>
              </div>
            ))}
          </section>
        </aside>
      </div>
    </div>
  );
}
function Stepper({
  label,
  note,
  value,
  onMinus,
  onPlus,
  tone,
}: {
  label: string;
  note: string;
  value: string;
  onMinus: () => void;
  onPlus: () => void;
  tone: string;
}) {
  return (
    <section className={`notation-stepper ${tone}`}>
      <h3>
        {label} <small>{note}</small>
      </h3>
      <div>
        <button
          type="button"
          aria-label={`Decrease ${label}`}
          onClick={onMinus}
        >
          ‹
        </button>
        <b>{value}</b>
        <button type="button" aria-label={`Increase ${label}`} onClick={onPlus}>
          ›
        </button>
      </div>
    </section>
  );
}
function Trace({
  title,
  value,
  tone,
}: {
  title: string;
  value: string;
  tone: string;
}) {
  return (
    <div className={`notation-trace ${tone}`}>
      <i />
      <span>
        <b>{title}</b>
        <strong>{value}</strong>
      </span>
    </div>
  );
}
function notationModel(coefficient: number, exponent: number) {
  const standardNumber = coefficient * 10 ** exponent,
    direction = exponent >= 0 ? "right" : "left",
    steps = Array.from({ length: Math.abs(exponent) + 1 }, (_, i) =>
      formatNumber(coefficient * 10 ** (exponent >= 0 ? i : -i)),
    );
  return { standard: formatNumber(standardNumber), direction, steps };
}
function format(value: number) {
  return value.toFixed(2).replace(/0+$/, "").replace(/\.$/, "");
}
function formatNumber(value: number) {
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: 8 }).format(
    Number(value.toFixed(8)),
  );
}
