import {
  ArrowLeft,
  ArrowRight,
  Check,
  CircleCheck,
  Expand,
  RotateCcw,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { LessonAdapterProps } from "../types";
import "./RatioCalculatorTargetLesson5.css";

const VIEWS = [
  "Interaction + visualization",
  "Explain",
  "Examples",
  "Formulas",
  "Know more",
];
const EXAMPLES = [
  [24, 36],
  [18, 30],
  [28, 42],
] as const;
export default function RatioCalculatorTargetLesson5({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [a, setA] = useState(24),
    [b, setB] = useState(36),
    [view, setView] = useState(0),
    [actions, setActions] = useState(0),
    [example, setExample] = useState(0);
  const [answers, setAnswers] = useState(["18", "30", "3", "5"]),
    [feedback, setFeedback] = useState<"idle" | "correct" | "incorrect">(
      "correct",
    );
  const model = useMemo(() => ratioModel(a, b), [a, b]);
  useEffect(() => {
    setA(24);
    setB(36);
    setView(0);
    setActions(0);
    setExample(0);
    setAnswers(["18", "30", "3", "5"]);
    setFeedback("correct");
  }, [resetToken]);
  const update = (side: "a" | "b", value: number) => {
    const safe = Math.max(1, Math.min(60, Math.round(value)));
    if (side === "a") setA(safe);
    else setB(safe);
    setActions((v) => v + 1);
    onInteraction();
  };
  const load = (index: number) => {
    const [nextA, nextB] = EXAMPLES[index];
    setA(nextA);
    setB(nextB);
    setExample(index);
    setActions((v) => v + 1);
    onInteraction();
  };
  const grade = () => {
    const expected = ratioModel(Number(answers[0]), Number(answers[1]));
    setFeedback(
      Number(answers[2]) === expected.simpleA &&
        Number(answers[3]) === expected.simpleB
        ? "correct"
        : "incorrect",
    );
    setActions((v) => v + 1);
    onInteraction();
  };
  return (
    <div
      className="target-ratio-page"
      data-testid="calculator-mockup-0005"
      data-dedicated-lesson="5"
      data-object-model="dual-draggable-ratio-gcf-equal-groups-tiles-double-number-line-practice-model"
      data-a={a}
      data-b={b}
      data-gcf={model.factor}
      data-simple={`${model.simpleA}:${model.simpleB}`}
      data-view={view}
      data-actions={actions}
      data-example={example}
      data-feedback={feedback}
    >
      <nav className="target-ratio-breadcrumb">
        <a href="/">←</a>
        <a href="/">Home</a>
        <span>›</span>
        <a href="/lessons">Lessons</a>
        <span>›</span>
        <a href="/lessons/core-workspaces">Core Workspaces</a>
        <span>›</span>
        <b>5 Ratio Calculator</b>
      </nav>
      <header className="target-ratio-header">
        <div>
          <span>CORE WORKSPACES</span>
          <span>SCIENTIFIC CALCULATOR</span>
          <h1>Ratio Calculator</h1>
          <p>Develop proportional reasoning.</p>
          <div>
            <b>⚲ Foundational-Advanced</b>
            <b>⌘ Calculator Lab</b>
            <b>▤ Scientific Calculator</b>
            <b>◷ 6-10 min</b>
          </div>
          <nav>
            <button type="button" onClick={() => setView(0)}>
              ⚑ English (English)⌄
            </button>
            <button type="button" onClick={() => load(0)}>
              <RotateCcw />
              Reset
            </button>
            <button
              type="button"
              onClick={() =>
                navigator.clipboard?.writeText(
                  `${a}:${b} = ${model.simpleA}:${model.simpleB}`,
                )
              }
            >
              ⌘ Share
            </button>
            <a href="/math-workspace">↗ Workspace</a>
          </nav>
        </div>
      </header>
      <nav className="target-ratio-tabs">
        {VIEWS.map((label, index) => (
          <button
            type="button"
            key={label}
            className={view === index ? "active" : ""}
            onClick={() => {
              setView(index);
              setActions((v) => v + 1);
              onInteraction();
            }}
          >
            {label}
          </button>
        ))}
      </nav>
      <section className="target-ratio-lab">
        <header>
          <h2>
            Ratio Lab: Simplify and compare {a}:{b}
          </h2>
          <div>
            <b>● Live mode</b>
            <span>{actions} actions</span>
            <button
              aria-label="Expand ratio workspace"
              type="button"
              onClick={() => {
                setActions((v) => v + 1);
                onInteraction();
              }}
            >
              <Expand />
            </button>
          </div>
        </header>
        <div className="target-ratio-main">
          <main>
            <RatioRow
              label="Part A"
              value={a}
              factor={model.factor}
              groups={model.simpleA}
              color="cyan"
              onChange={(value) => update("a", value)}
            />
            <RatioRow
              label="Part B"
              value={b}
              factor={model.factor}
              groups={model.simpleB}
              color="violet"
              onChange={(value) => update("b", value)}
            />
            <div className="ratio-equation">
              <span>
                {a} : {b} =
              </span>
              <strong>
                {a}/{model.factor} : {b}/{model.factor}
              </strong>
              <span>=</span>
              <b>
                {model.simpleA} : {model.simpleB}
              </b>
              <aside>
                <p>
                  <CircleCheck /> same factor
                </p>
                <p>
                  <CircleCheck /> comparison preserved
                </p>
              </aside>
            </div>
            <div className="ratio-visuals">
              <section>
                <h3>Tile model ?</h3>
                <TileLine
                  label={`A = ${a}`}
                  value={a}
                  factor={model.factor}
                  color="cyan"
                />
                <TileLine
                  label={`B = ${b}`}
                  value={b}
                  factor={model.factor}
                  color="violet"
                />
              </section>
              <section>
                <h3>Double number line ?</h3>
                <NumberLine
                  label={`A (${a})`}
                  groups={model.simpleA}
                  factor={model.factor}
                  color="cyan"
                />
                <NumberLine
                  label={`B (${b})`}
                  groups={model.simpleB}
                  factor={model.factor}
                  color="violet"
                />
              </section>
            </div>
          </main>
          <aside>
            <h3>CONCEPT TRACE</h3>
            <Trace title="RATIO" value={`${a} : ${b}`} note="Part A : Part B" />
            <Trace
              title="COMMON FACTOR"
              value={String(model.factor)}
              note={`Divide both terms by ${model.factor}.`}
            />
            <Trace
              title="SIMPLEST FORM"
              value={`${model.simpleA} : ${model.simpleB}`}
              note="No common factor other than 1."
            />
            <Trace
              title="MEANING"
              value=""
              note={`For every ${model.simpleA} of A, there are ${model.simpleB} of B.`}
            />
          </aside>
        </div>
      </section>
      <section className="target-ratio-practice">
        <div>
          <h3>⌕ Try it yourself</h3>
          <p>Simplify 18:30 and describe the comparison.</p>
          <div>
            {answers.map((value, index) => (
              <span className="ratio-practice-field" key={index}>
                <input
                  aria-label={`Ratio practice value ${index + 1}`}
                  value={value}
                  onChange={(event) => {
                    setAnswers((current) =>
                      current.map((item, i) =>
                        i === index ? event.target.value : item,
                      ),
                    );
                    setFeedback("idle");
                  }}
                />
                {index < 3 ? <b>{index === 1 ? "=" : ":"}</b> : null}
              </span>
            ))}
            <button type="button" onClick={grade}>
              Check
            </button>
          </div>
          <p>Hint: Use the greatest common factor to simplify both terms.</p>
        </div>
        <aside>
          <h3>◉ Feedback</h3>
          <div className={feedback}>
            <b>
              {feedback === "correct"
                ? "18:30 simplifies to 3:5."
                : feedback === "incorrect"
                  ? "Check both simplified terms."
                  : "Enter your simplified ratio."}
            </b>
            <p>For every 3 of A, there are 5 of B.</p>
            <Check />
          </div>
          <button
            type="button"
            onClick={() => load((example + 1) % EXAMPLES.length)}
          >
            <RotateCcw />
            New example
          </button>
        </aside>
      </section>
      <nav className="target-ratio-nav">
        <a href="/lessons/core-workspaces/4-percentage-calculator">
          <ArrowLeft />
          <span>
            <b>Previous</b>Percentage Calculator
          </span>
        </a>
        <a href="/lessons/core-workspaces/6-powers-and-roots">
          <span>
            <b>Next</b>Powers and Roots
          </span>
          <ArrowRight />
        </a>
      </nav>
    </div>
  );
}
function RatioRow({
  label,
  value,
  factor,
  groups,
  color,
  onChange,
}: {
  label: string;
  value: number;
  factor: number;
  groups: number;
  color: "cyan" | "violet";
  onChange: (value: number) => void;
}) {
  return (
    <section className={`ratio-row ${color}`}>
      <h3>
        {label}
        <small>({value})</small>
      </h3>
      <div className="ratio-stepper">
        <button type="button" onClick={() => onChange(value - 1)}>
          ‹
        </button>
        <input
          aria-label={`${label} ratio value`}
          value={value}
          onChange={(event) => onChange(Number(event.target.value))}
        />
        <button type="button" onClick={() => onChange(value + 1)}>
          ›
        </button>
      </div>
      <input
        aria-label={`${label} drag control`}
        type="range"
        min="1"
        max="60"
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
      />
      <div className="ratio-groups">
        {Array.from({ length: groups }, (_, i) => (
          <i key={i}>{factor}</i>
        ))}
      </div>
      <b>{groups} groups</b>
    </section>
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
    <section>
      <h4>
        {title}
        <b>{value}</b>
      </h4>
      <p>{note}</p>
    </section>
  );
}
function TileLine({
  label,
  value,
  factor,
  color,
}: {
  label: string;
  value: number;
  factor: number;
  color: string;
}) {
  return (
    <div className={`ratio-tiles ${color}`}>
      <b>{label}</b>
      <div>
        {Array.from({ length: Math.min(42, value) }, (_, i) => (
          <i className={(i + 1) % factor === 0 ? "end" : ""} key={i} />
        ))}
      </div>
      <strong>
        {value / factor} groups of {factor}
      </strong>
    </div>
  );
}
function NumberLine({
  label,
  groups,
  factor,
  color,
}: {
  label: string;
  groups: number;
  factor: number;
  color: string;
}) {
  return (
    <div className={`ratio-line ${color}`}>
      <b>{label}</b>
      <div>
        {Array.from({ length: groups + 1 }, (_, i) => (
          <i key={i}>
            <span>{i * factor}</span>
          </i>
        ))}
      </div>
    </div>
  );
}
function gcd(a: number, b: number): number {
  return b ? gcd(b, a % b) : Math.abs(a);
}
function ratioModel(a: number, b: number) {
  const factor = gcd(a, b) || 1;
  return { factor, simpleA: a / factor, simpleB: b / factor };
}
