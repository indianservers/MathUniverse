import {
  ArrowLeft,
  ArrowRight,
  CircleAlert,
  Info,
  Lightbulb,
  Pencil,
  Sigma,
  Sparkles,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { LessonAdapterProps } from "../types";
import "./WholeNumbersTargetLesson58.css";

const PRACTICE = [-1, 0, 1.5, 2, 3];
const isWhole = (value: number) => Number.isInteger(value) && value >= 0;

export default function WholeNumbersTargetLesson58({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [selected, setSelected] = useState(0);
  const [view, setView] = useState("Explain");
  const [answers, setAnswers] = useState<number[]>([]);
  const [practiceStatus, setPracticeStatus] = useState(
    "Pick every whole number.",
  );
  const [actions, setActions] = useState(0);
  const comparison = selected === 7 ? "=" : selected < 7 ? "<" : ">";
  const practiceCorrect = useMemo(
    () => PRACTICE.every((value) => answers.includes(value) === isWhole(value)),
    [answers],
  );
  const act = () => {
    setActions((value) => value + 1);
    onInteraction();
  };
  const choose = (value: number) => {
    setSelected(Math.max(0, Math.min(8, Math.round(value))));
    act();
  };
  const toggleAnswer = (value: number) => {
    setAnswers((current) =>
      current.includes(value)
        ? current.filter((item) => item !== value)
        : [...current, value],
    );
    setPracticeStatus("Selection changed. Check your answer.");
    act();
  };
  const reset = () => {
    setSelected(0);
    setView("Explain");
    setAnswers([]);
    setPracticeStatus("Pick every whole number.");
    setActions(0);
  };
  useEffect(reset, [resetToken]);
  return (
    <div
      className="whole-page"
      data-testid="number-mockup-0040"
      data-dedicated-lesson="58"
      data-object-model="zero-inclusive-whole-set-selector-number-line-exclusion-empty-count-staircase-comparison-practice-model"
      data-selected={selected}
      data-comparison={comparison}
      data-view={view}
      data-practice-selected={answers.join(",")}
      data-practice-correct={practiceCorrect}
      data-practice-status={practiceStatus}
      data-actions={actions}
    >
      <span className="sr-only">Concept trace: Whole-number membership</span>
      <nav className="whole-breadcrumb">
        <a href="/">
          <ArrowLeft />
        </a>
        <a href="/">Home</a>
        <span>›</span>
        <a href="/lessons">Lessons</a>
        <span>›</span>
        <a href="/lessons/numbers-and-arithmetic">Numbers And Arithmetic</a>
        <span>›</span>
        <b>58 Whole Numbers</b>
      </nav>
      <section className="whole-shell">
        <header className="whole-header">
          <div>
            <h1>Whole Numbers</h1>
            <p>Introduce zero and place it within the number system.</p>
          </div>
          <nav>
            {[
              ["Explain", Info],
              ["Examples", Lightbulb],
              ["Formulas", Sigma],
              ["Know more", Sparkles],
            ].map(([label, Icon]) => (
              <button
                className={view === label ? "active" : ""}
                type="button"
                onClick={() => {
                  setView(label as string);
                  act();
                }}
                key={label as string}
              >
                <Icon />
                {label as string}
              </button>
            ))}
          </nav>
        </header>
        <main className="whole-layout">
          <section className="whole-workspace">
            <section className="whole-set-section">
              <h2>1. The whole-number set</h2>
              <div className="whole-set-box">
                <header>
                  <b>Whole Numbers</b>
                  <span>W = {`{0, 1, 2, 3, ...}`}</span>
                </header>
                <nav>
                  {[0, 1, 2, 3, 4, 5].map((value) => (
                    <button
                      className={selected === value ? "active" : ""}
                      type="button"
                      onClick={() => choose(value)}
                      key={value}
                    >
                      {value}
                    </button>
                  ))}
                  <strong>...</strong>
                </nav>
              </div>
              <p className="zero-callout">Whole numbers include zero.</p>
            </section>
            <section className="whole-line-section">
              <h2>2. The number line</h2>
              <div className="whole-line">
                <div className="line-axis" />
                <nav>
                  {[
                    ["negative-3", "-3", -3],
                    ["negative-2", "-2", -2],
                    ["negative-1", "-1", -1],
                    ["zero", "0", 0],
                    ["one", "1", 1],
                    ["half", "1/2", 0.5],
                    ["two", "2", 2],
                    ["three-a", "3", 3],
                    ["three-b", "3", 3],
                    ["four", "4", 4],
                    ["five", "5", 5],
                    ["six", "6", 6],
                    ["seven", "7", 7],
                    ["eight", "8", 8],
                  ].map(([key, label, rawValue]) => {
                    const value = Number(rawValue);
                    return (
                      <button
                        className={`${value < 0 || !Number.isInteger(value) ? "excluded" : selected === value ? "selected" : "included"} ${value >= 6 ? "plain" : ""}`}
                        type="button"
                        aria-label={
                          key === "half"
                            ? "One half is not a whole number"
                            : undefined
                        }
                        onClick={() => isWhole(value) && choose(value)}
                        key={String(key)}
                      >
                        {label}
                      </button>
                    );
                  })}
                </nav>
              </div>
              <div className="line-key">
                <span>
                  <i />
                  Whole numbers (included)
                </span>
                <span>
                  <i />
                  Not included (negatives and fractions)
                </span>
              </div>
            </section>
            <section className="whole-examples">
              <article className="empty-count">
                <h2>3. Zero means ‘no objects’ — still a count</h2>
                <div>
                  <img
                    src="/assets/lesson-58/empty-wicker-basket.png"
                    alt="An empty wicker basket"
                  />
                  <p>
                    <strong>0</strong> objects
                    <span>
                      0 objects is
                      <br />
                      still a count
                    </span>
                  </p>
                </div>
              </article>
              <article className="count-stairs">
                <h2>4. Counting starts at zero</h2>
                <svg
                  viewBox="0 0 420 150"
                  role="img"
                  aria-label="Counting staircase from zero through five"
                >
                  <path d="M44 128H78V110H142V92H206V74H270V56H334V38H398" />
                  <g>
                    {[0, 1, 2, 3, 4, 5].map((value) => (
                      <text
                        key={value}
                        x={45 + value * 64}
                        y={value === 0 ? 123 : 112 - value * 18}
                      >
                        {value}
                      </text>
                    ))}
                  </g>
                  <g>
                    {[0, 1, 2, 3, 4].map((value) => (
                      <path
                        key={value}
                        d={`M${65 + value * 64} ${104 - value * 18} Q${93 + value * 64} ${69 - value * 18} ${125 + value * 64} ${86 - value * 18}`}
                      />
                    ))}
                  </g>
                </svg>
                <span>start</span>
              </article>
            </section>
            <footer className="whole-summary">
              <p>
                <Info />
                Whole numbers are the counting numbers starting from zero and
                going on forever.
              </p>
              <div>
                <b>Included:</b> 0, 1, 2, 3, ... <i />{" "}
                <strong>Not included:</strong> negatives and fractions
              </div>
            </footer>
          </section>
          <aside className="whole-side">
            <section className="selector-card">
              <h2>Number selector</h2>
              <div>
                <button
                  type="button"
                  aria-label="Decrease selected number"
                  onClick={() => choose(selected - 1)}
                >
                  −
                </button>
                <strong>{selected}</strong>
                <button
                  type="button"
                  aria-label="Increase selected number"
                  onClick={() => choose(selected + 1)}
                >
                  +
                </button>
              </div>
              <p>
                Selected number: <b>{selected}</b>
              </p>
            </section>
            <section className="compare-with">
              <h2>Compare with</h2>
              <strong>7</strong>
              <p>
                {selected} {comparison} 7
              </p>
            </section>
            <section className="whole-definition">
              <h2>
                <Lightbulb />
                Definition
              </h2>
              <p>
                Whole numbers are the set
                <br />
                <i>W</i> = {`{0, 1, 2, 3, ...}`}
                <br />
                They include <b>zero</b> and all
                <br />
                positive counting numbers.
              </p>
            </section>
            <section className="whole-misconception">
              <h2>
                <CircleAlert />
                Common misconception
              </h2>
              <p>
                Not included: negatives
                <br />
                and <b>fractions</b>
              </p>
              <p>
                <b>Try:</b> Is -1 a whole number? No.
              </p>
            </section>
            <section className="whole-practice">
              <h2>
                <Pencil />
                Quick practice
              </h2>
              <p>
                Pick all values that are
                <br />
                whole numbers.
              </p>
              <nav>
                {PRACTICE.map((value) => (
                  <button
                    className={`${isWhole(value) ? "whole" : "not-whole"} ${answers.includes(value) ? "chosen" : ""}`}
                    type="button"
                    aria-pressed={answers.includes(value)}
                    onClick={() => toggleAnswer(value)}
                    key={value}
                  >
                    {value}
                  </button>
                ))}
              </nav>
              <button
                type="button"
                onClick={() => {
                  setPracticeStatus(
                    practiceCorrect
                      ? "Correct: 0, 2, and 3 are whole numbers."
                      : "Try again: select 0, 2, and 3 only.",
                  );
                  act();
                }}
              >
                Check answer
              </button>
              <output>{practiceStatus}</output>
            </section>
          </aside>
        </main>
      </section>
      <nav className="whole-navigation">
        <a href="/lessons/numbers-and-arithmetic/57-natural-numbers">
          <ArrowLeft />
          <span>
            Previous<b>Natural Numbers</b>
          </span>
        </a>
        <a href="/lessons/numbers-and-arithmetic/59-integers">
          <span>
            Next<b>Integers</b>
          </span>
          <ArrowRight />
        </a>
      </nav>
    </div>
  );
}
