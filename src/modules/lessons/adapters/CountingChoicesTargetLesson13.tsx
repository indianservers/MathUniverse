import { Maximize2, RotateCcw } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { DragEvent } from "react";
import type { LessonAdapterProps } from "../types";
import "./CountingChoicesTargetLesson13.css";

type Mode = "factorial" | "permutation" | "combination";
const TABS = [
  "Interaction + visualization",
  "Explain",
  "Examples",
  "Formulas",
  "Know more",
];
const factorial = (n: number) =>
  Array.from({ length: n }, (_, i) => i + 1).reduce((a, b) => a * b, 1);
const calculate = (mode: Mode, n: number, r: number) =>
  mode === "factorial"
    ? factorial(n)
    : mode === "permutation"
      ? factorial(n) / factorial(n - r)
      : factorial(n) / (factorial(r) * factorial(n - r));

export default function CountingChoicesTargetLesson13({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [mode, setMode] = useState<Mode>("factorial"),
    [n, setN] = useState(6),
    [r, setR] = useState(3),
    [slots, setSlots] = useState<(number | null)[]>(Array(6).fill(null)),
    [view, setView] = useState(0),
    [actions, setActions] = useState(0),
    [revealed, setRevealed] = useState(true);
  const count = mode === "factorial" ? n : r,
    result = calculate(mode, n, r),
    choices = useMemo(
      () =>
        Array.from({ length: count }, (_, i) =>
          mode === "combination" ? n - i : n - i,
        ),
      [count, mode, n],
    );
  const reset = () => {
    setMode("factorial");
    setN(6);
    setR(3);
    setSlots(Array(6).fill(null));
    setView(0);
    setActions(0);
    setRevealed(true);
    onInteraction();
  };
  useEffect(() => {
    setMode("factorial");
    setN(6);
    setR(3);
    setSlots(Array(6).fill(null));
    setView(0);
    setActions(0);
    setRevealed(true);
  }, [resetToken]);
  const selectMode = (next: Mode) => {
    setMode(next);
    setSlots(Array(next === "factorial" ? n : r).fill(null));
    setActions((v) => v + 1);
    onInteraction();
  };
  const drop = (index: number, item: number) => {
    setSlots((current) => {
      const next = [...current];
      const previous = next.indexOf(item);
      if (previous >= 0) next[previous] = null;
      next[index] = item;
      return next;
    });
    setActions((v) => v + 1);
    onInteraction();
  };
  const changeN = (value: number) => {
    const safe = Math.max(2, Math.min(8, Math.round(value)));
    setN(safe);
    setR((current) => Math.min(current, safe));
    setSlots(Array(mode === "factorial" ? safe : Math.min(r, safe)).fill(null));
    setActions((v) => v + 1);
    onInteraction();
  };
  const changeR = (value: number) => {
    const safe = Math.max(1, Math.min(n, Math.round(value)));
    setR(safe);
    if (mode !== "factorial") setSlots(Array(safe).fill(null));
    setActions((v) => v + 1);
    onInteraction();
  };
  return (
    <div
      className="target-counting-page"
      data-testid="calculator-mockup-0013"
      data-dedicated-lesson="13"
      data-object-model="draggable-distinct-items-factorial-permutation-combination-counting-trace-practice-model"
      data-mode={mode}
      data-n={n}
      data-r={r}
      data-result={result}
      data-filled={slots.filter(Boolean).length}
      data-actions={actions}
      data-view={view}
      data-revealed={revealed}
    >
      <nav className="counting-breadcrumb">
        <a href="/">←</a>
        <a href="/">Home</a>
        <span>›</span>
        <a href="/lessons">Lessons</a>
        <span>›</span>
        <a href="/lessons/core-workspaces">Core Workspaces</a>
        <span>›</span>
        <b>13 Factorial Permutation And Combination</b>
      </nav>
      <header className="counting-header">
        <span>CORE WORKSPACES</span>
        <span>SCIENTIFIC CALCULATOR</span>
        <h1>Factorial, Permutation and Combination</h1>
        <p>Support counting and probability calculations.</p>
        <section>
          <b>⚲ Foundational-Advanced</b>
          <b>⌁ Calculator Lab</b>
          <b>▤ Scientific Calculator</b>
          <b>◷ 6-10 min</b>
        </section>
        <nav>
          <button type="button">⚒ English (English)⌄</button>
          <button type="button" onClick={reset}>
            <RotateCcw />
            Reset
          </button>
          <button
            type="button"
            onClick={() =>
              navigator.clipboard?.writeText(`${mode}(${n},${r}) = ${result}`)
            }
          >
            ⌘ Share
          </button>
        </nav>
        <button type="button" onClick={onInteraction}>
          ↗ Workspace
        </button>
      </header>
      <nav className="counting-tabs">
        {TABS.map((tab, index) => (
          <button
            type="button"
            className={view === index ? "active" : ""}
            onClick={() => {
              setView(index);
              setActions((v) => v + 1);
              onInteraction();
            }}
            key={tab}
          >
            {tab}
          </button>
        ))}
      </nav>
      <section className="counting-lab">
        <header>
          <small>INTERACTION · VISUALIZATION</small>
          <h2>Counting choices visually</h2>
          <p>
            {mode === "factorial"
              ? `Build factorial(${n}) by making choices one at a time. Order matters.`
              : mode === "permutation"
                ? `Arrange ${r} selections from ${n} distinct items. Order matters.`
                : `Choose ${r} items from ${n}; order duplicates are removed.`}
          </p>
          <div>
            <b>
              <i />
              Interactive
            </b>
            <span>{actions} actions</span>
            <button type="button">
              <Maximize2 />
            </button>
          </div>
        </header>
        <div className="counting-work">
          <main>
            <nav className="counting-modes">
              <button
                type="button"
                className={mode === "factorial" ? "active" : ""}
                onClick={() => selectMode("factorial")}
              >
                Factorial
              </button>
              <button
                type="button"
                className={mode === "permutation" ? "active" : ""}
                onClick={() => selectMode("permutation")}
              >
                Permutation
              </button>
              <button
                type="button"
                className={mode === "combination" ? "active" : ""}
                onClick={() => selectMode("combination")}
              >
                Combination
              </button>
            </nav>
            <div className="counting-parameters">
              <label>
                Items n
                <input
                  aria-label="Counting items n"
                  type="number"
                  min="2"
                  max="8"
                  value={n}
                  onChange={(e) => changeN(Number(e.target.value))}
                />
              </label>
              <label className={mode === "factorial" ? "disabled" : ""}>
                Choose r
                <input
                  aria-label="Counting selections r"
                  type="number"
                  min="1"
                  max={n}
                  disabled={mode === "factorial"}
                  value={mode === "factorial" ? n : r}
                  onChange={(e) => changeR(Number(e.target.value))}
                />
              </label>
            </div>
            <h3>
              {mode === "factorial"
                ? `Build ${n}! step by step`
                : mode === "permutation"
                  ? `Build ${n}P${r} as ordered slots`
                  : `Build ${n}C${r} without order duplicates`}
            </h3>
            <p>At each step, pick an item that hasn't been used yet.</p>
            <section className="choice-steps">
              {Array.from({ length: count }, (_, index) => (
                <article key={index}>
                  <small>Step {index + 1}</small>
                  <b>{choices[index]}</b>
                  <span>{choices[index] === 1 ? "choice" : "choices"}</span>
                  <div
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) =>
                      drop(index, Number(e.dataTransfer.getData("text/plain")))
                    }
                  >
                    {slots[index] ? (
                      <strong>{slots[index]}</strong>
                    ) : (
                      <>
                        Drag here
                        <br />↓
                      </>
                    )}
                  </div>
                  <p>
                    Pick{" "}
                    {index + 1 === 1
                      ? "1st"
                      : index + 1 === 2
                        ? "2nd"
                        : index + 1 === 3
                          ? "3rd"
                          : `${index + 1}th`}{" "}
                    item
                    <br />({choices[index]} remaining)
                  </p>
                </article>
              ))}
            </section>
            <section className="available-items">
              <p>Available items to choose from (drag to slots above)</p>
              <div>
                {Array.from({ length: n }, (_, i) => i + 1).map((item) => (
                  <button
                    type="button"
                    draggable
                    onDragStart={(e: DragEvent<HTMLButtonElement>) =>
                      e.dataTransfer.setData("text/plain", String(item))
                    }
                    onClick={() => {
                      const empty = slots.indexOf(null);
                      if (empty >= 0) drop(empty, item);
                    }}
                    disabled={slots.includes(item)}
                    key={item}
                  >
                    <b>{item}</b>
                    <span>Item {item}</span>
                  </button>
                ))}
              </div>
            </section>
            <section className="counting-equation">
              <b>
                {mode === "factorial"
                  ? `${n}!`
                  : `${n}${mode === "permutation" ? "P" : "C"}${r}`}
              </b>{" "}
              ={" "}
              <span>
                {mode === "factorial"
                  ? choices.join(" × ")
                  : mode === "permutation"
                    ? `${n}! / (${n - r})!`
                    : `${n}! / (${r}! × ${n - r}!)`}
              </span>{" "}
              = <output>{result}</output>
              <small>
                {mode === "combination"
                  ? "Unordered selections"
                  : "Number of ordered arrangements"}
              </small>
            </section>
          </main>
          <aside className="counting-trace">
            <p>
              ⓘ order matters for factorial/permutation; combinations remove
              order duplicates.
            </p>
            <section>
              <small>Concept trace</small>
              <h3>Counting choices trace</h3>
              <b>n = {n}</b>
              <Trace
                title={mode.toUpperCase()}
                value={
                  mode === "factorial"
                    ? `${n}!`
                    : `${n}${mode === "permutation" ? "P" : "C"}${r}`
                }
                note={
                  mode === "combination"
                    ? "Order duplicates are removed."
                    : "Multiply choices as they decrease."
                }
              />
              <Trace
                title="EXPANSION"
                value={
                  mode === "factorial"
                    ? choices.join("×")
                    : `formula with n=${n}, r=${r}`
                }
                note="Each factor represents available choices."
              />
              <Trace
                title="OUTPUT"
                value={String(result)}
                note="Total number of valid outcomes."
              />
              <Trace
                title="ORDER MATTERS"
                value={mode === "combination" ? "no" : "yes"}
                note={
                  mode === "combination"
                    ? "Selections are unordered."
                    : "Arrangements are ordered."
                }
              />
            </section>
          </aside>
        </div>
        <section className="counting-compare">
          <h3>Compare counting methods</h3>
          <div>
            <Method
              title="n!"
              subtitle="Arrangements (order matters)"
              formula="n × (n−1) × ... × 1"
              example="5! = 120"
            />
            <Method
              title="nPr"
              subtitle="Ordered selections (partial)"
              formula="n! / (n−r)!"
              example="6P3 = 120"
            />
            <Method
              title="nCr"
              subtitle="Unordered selections"
              formula="n! / r!(n−r)!"
              example="6C3 = 20"
            />
          </div>
        </section>
        <section className="counting-practice">
          <h3>Try it yourself</h3>
          <p>Practice with a quick question.</p>
          <div>
            <article>
              <b>Q</b>
              <span>
                <strong>How many ways can 4 distinct books be arranged?</strong>
                <small>Arrange all 4 books in a row.</small>
                <button
                  type="button"
                  onClick={() => {
                    setRevealed((v) => !v);
                    onInteraction();
                  }}
                >
                  {revealed ? "Hide answer" : "Show answer"}
                </button>
              </span>
            </article>
            <article>
              <b>A</b>
              {revealed ? (
                <span>
                  <strong>4! = 24</strong>
                  <small>There are 24 ways.</small>
                </span>
              ) : (
                <span>
                  <strong>Answer hidden</strong>
                </span>
              )}
            </article>
          </div>
        </section>
      </section>
      <nav className="counting-neighbors">
        <a href="/lessons/core-workspaces/12-hyperbolic-functions">
          ←{" "}
          <span>
            <small>PREVIOUS</small>Hyperbolic Functions
          </span>
        </a>
        <a href="/lessons/core-workspaces/14-absolute-value">
          <span>
            <small>NEXT</small>Absolute Value
          </span>{" "}
          →
        </a>
      </nav>
      <footer className="counting-footer">
        <b>⚒ Math Universe</b>
        <p>
          Interactive math labs, visual proofs, NCERT explorations, graphing,
          CAS-style tools, and classroom-ready activities.
        </p>
      </footer>
    </div>
  );
}
function Trace({
  title,
  value,
  note,
}: {
  title: string;
  value: string;
  note: string;
}) {
  return (
    <article>
      <small>{title}</small>
      <b>{value}</b>
      <p>{note}</p>
    </article>
  );
}
function Method({
  title,
  subtitle,
  formula,
  example,
}: {
  title: string;
  subtitle: string;
  formula: string;
  example: string;
}) {
  return (
    <article>
      <h4>{title}</h4>
      <b>{subtitle}</b>
      <p>
        {title === "nCr"
          ? "Choose r items without order."
          : "Choose and arrange distinct items."}
      </p>
      <strong>{formula}</strong>
      <small>Example: {example}</small>
    </article>
  );
}
