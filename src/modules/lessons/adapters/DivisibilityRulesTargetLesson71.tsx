import {
  ArrowLeft,
  ArrowRight,
  Check,
  CircleHelp,
  Lightbulb,
  ShieldCheck,
  TriangleAlert,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState, type DragEvent } from "react";
import type { LessonAdapterProps } from "../types";
import "./DivisibilityRulesTargetLesson71.css";

const RULES = [
  { divisor: 2, label: "Even" },
  { divisor: 3, label: "Digit sum" },
  { divisor: 5, label: "Ends in 0 or 5" },
  { divisor: 9, label: "Digit sum" },
  { divisor: 10, label: "Ends in 0" },
] as const;

function clampNumber(value: number) {
  if (!Number.isFinite(value)) return 100;
  return Math.max(100, Math.min(999, Math.round(value)));
}

function numberDigits(value: number) {
  return String(value).padStart(3, "0").slice(-3).split("").map(Number);
}

function testValue(value: number, divisor: number) {
  const digits = numberDigits(value);
  const sum = digits.reduce((total, digit) => total + digit, 0);
  const last = digits[digits.length - 1];
  const passes = value % divisor === 0;
  if (divisor === 2)
    return {
      passes,
      sum,
      evidence: `${last} is ${last % 2 === 0 ? "even" : "odd"}`,
      instruction: "For 2, the last digit must be even.",
    };
  if (divisor === 3 || divisor === 9)
    return {
      passes,
      sum,
      evidence: `${digits.join(" + ")} = ${sum}`,
      instruction: `For ${divisor}, the digit sum must be divisible by ${divisor}.`,
    };
  if (divisor === 5)
    return {
      passes,
      sum,
      evidence: `The last digit is ${last}`,
      instruction: "For 5, the number must end in 0 or 5.",
    };
  return {
    passes,
    sum,
    evidence: `The last digit is ${last}`,
    instruction: "For 10, the number must end in 0.",
  };
}

export default function DivisibilityRulesTargetLesson71({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [number, setNumber] = useState(234);
  const [divisor, setDivisor] = useState(9);
  const [dragDigit, setDragDigit] = useState<number | null>(null);
  const [machineRuns, setMachineRuns] = useState(0);
  const [practiceChecked, setPracticeChecked] = useState(false);
  const [actions, setActions] = useState(0);
  const digits = useMemo(() => numberDigits(number), [number]);
  const result = useMemo(() => testValue(number, divisor), [number, divisor]);
  const misconceptionNumber =
    number === 234 && divisor === 9 ? 235 : Math.min(999, number + 1);
  const misconception = testValue(misconceptionNumber, divisor);
  const practiceNumber = 342;
  const practice = testValue(practiceNumber, divisor);
  const quotient = Math.floor(number / divisor);
  const remainder = number % divisor;

  const act = () => {
    setActions((value) => value + 1);
    onInteraction();
  };
  const changeNumber = (value: number) => {
    setNumber(clampNumber(value));
    setPracticeChecked(false);
    act();
  };
  const chooseRule = (nextDivisor: number) => {
    setDivisor(nextDivisor);
    setPracticeChecked(false);
    act();
  };
  const dropDigit = (
    event: DragEvent<HTMLButtonElement>,
    targetIndex: number,
  ) => {
    event.preventDefault();
    const raw = event.dataTransfer.getData("text/digit-index");
    const sourceIndex = raw ? Number(raw) : dragDigit;
    if (sourceIndex === null || !Number.isInteger(sourceIndex)) return;
    const nextDigits = [...digits];
    [nextDigits[sourceIndex], nextDigits[targetIndex]] = [
      nextDigits[targetIndex],
      nextDigits[sourceIndex],
    ];
    setNumber(Number(nextDigits.join("")));
    setDragDigit(null);
    setPracticeChecked(false);
    act();
  };
  const runMachine = () => {
    setMachineRuns((value) => value + 1);
    act();
  };
  useEffect(() => {
    setNumber(234);
    setDivisor(9);
    setDragDigit(null);
    setMachineRuns(0);
    setPracticeChecked(false);
    setActions(0);
  }, [resetToken]);

  return (
    <div
      className="divisibility71-page"
      data-testid="number-mockup-0053"
      data-dedicated-lesson="71"
      data-object-model="editable-three-digit-number-rule-selector-draggable-digit-reorder-rule-specific-evidence-machine-exact-division-misconception-practice-model"
      data-number={number}
      data-digits={digits.join(",")}
      data-divisor={divisor}
      data-digit-sum={result.sum}
      data-divisible={result.passes}
      data-quotient={quotient}
      data-remainder={remainder}
      data-drag-digit={dragDigit ?? ""}
      data-machine-runs={machineRuns}
      data-practice-checked={practiceChecked}
      data-practice-result={practice.passes}
      data-actions={actions}
    >
      <span className="sr-only">
        Concept trace: Divisibility rule audit. Use the rule for the chosen
        divisor only. Every decision is verified by exact division and
        remainder.
      </span>
      <nav className="divisibility71-breadcrumb">
        <a href="/" aria-label="Back">
          <ArrowLeft />
        </a>
        <a href="/">Home</a>
        <span>›</span>
        <a href="/lessons">Lessons</a>
        <span>›</span>
        <a href="/lessons/numbers-and-arithmetic">Numbers And Arithmetic</a>
        <span>›</span>
        <b>71 Divisibility Rules</b>
      </nav>
      <main className="divisibility71-surface">
        <header className="divisibility71-title">
          <div>
            <h1>Divisibility Rules</h1>
            <p>Detect divisibility efficiently.</p>
          </div>
          <aside>
            <Lightbulb />
            <b>Use the rule for the chosen divisor only.</b>
          </aside>
        </header>

        <section className="divisibility71-left">
          <section className="divisibility71-rules">
            <h2>Choose a rule to test</h2>
            <nav aria-label="Divisibility rule selector">
              {RULES.map((rule) => (
                <button
                  type="button"
                  className={divisor === rule.divisor ? "active" : ""}
                  onClick={() => chooseRule(rule.divisor)}
                  key={rule.divisor}
                >
                  <strong>{rule.divisor}</strong>
                  <span>{rule.label}</span>
                  {divisor === rule.divisor ? <Check /> : null}
                </button>
              ))}
            </nav>
          </section>
          <section className="divisibility71-lab">
            <section className="divisibility71-step-one">
              <header>
                <b>1</b>
                <h2>
                  {divisor === 3 || divisor === 9
                    ? "Add the digits of the number."
                    : "Inspect the final digit."}
                </h2>
              </header>
              <div className="divisibility71-digit-tray">
                {digits.map((digit, index) => (
                  <button
                    type="button"
                    draggable
                    aria-label={`Digit ${index + 1}: ${digit}`}
                    onDragStart={(event) => {
                      event.dataTransfer.setData(
                        "text/digit-index",
                        String(index),
                      );
                      setDragDigit(index);
                    }}
                    onDragEnd={() => setDragDigit(null)}
                    onDragOver={(event) => event.preventDefault()}
                    onDrop={(event) => dropDigit(event, index)}
                    key={`${digit}-${index}`}
                  >
                    {digit}
                    <i />
                  </button>
                ))}
              </div>
              <section
                className={`divisibility71-machine ${result.passes ? "pass" : "fail"}`}
              >
                <h3>
                  {divisor === 3 || divisor === 9
                    ? "DIGIT SUM MACHINE"
                    : "LAST DIGIT MACHINE"}
                </h3>
                <div>
                  <span>{result.evidence}</span>
                  {result.passes ? <Check /> : <X />}
                </div>
                <button
                  type="button"
                  aria-label="Run divisibility machine"
                  onClick={runMachine}
                >
                  <i />
                  <b />
                </button>
                <nav>
                  <i />
                  <i />
                  <i />
                </nav>
              </section>
            </section>
            <section className="divisibility71-step-two">
              <header>
                <b>2</b>
                <h2>Apply the rule for {divisor}.</h2>
              </header>
              <p>
                <ShieldCheck /> <b>{result.instruction}</b>
              </p>
            </section>
            <section className="divisibility71-step-three">
              <header>
                <b>3</b>
                <h2>Verify with exact division.</h2>
              </header>
              <div className={result.passes ? "pass" : "fail"}>
                <strong>
                  {number} ÷ {divisor} = {quotient} <small>remainder</small>{" "}
                  {remainder}
                </strong>
                <p>
                  {result.passes ? <Check /> : <X />}
                  <b>
                    {number} is {result.passes ? "" : "not "}divisible by{" "}
                    {divisor}
                  </b>
                </p>
              </div>
            </section>
          </section>
        </section>

        <aside className="divisibility71-side">
          <section className="divisibility71-summary">
            <label htmlFor="divisibility71-number">Number:</label>
            <input
              id="divisibility71-number"
              aria-label="Number to test"
              type="number"
              min="100"
              max="999"
              value={number}
              onChange={(event) => changeNumber(Number(event.target.value))}
            />
            <div>
              <span>Digits</span>
              <p>
                {digits.map((digit, index) => (
                  <b key={`${digit}-${index}`}>{digit}</b>
                ))}
              </p>
            </div>
            <div>
              <span>Chosen divisor</span>
              <p>
                <b>{divisor}</b>
              </p>
            </div>
            <div>
              <span>
                {divisor === 3 || divisor === 9 ? "Digit sum" : "Rule evidence"}
              </span>
              <p>
                <em>{result.evidence}</em>
                <b>{divisor === 3 || divisor === 9 ? result.sum : digits[2]}</b>
              </p>
            </div>
            <div>
              <span>Decision</span>
              <p className={result.passes ? "pass" : "fail"}>
                {result.passes ? <Check /> : <X />}
                <b>
                  {number} is {result.passes ? "" : "not "}divisible by{" "}
                  {divisor}
                </b>
              </p>
            </div>
          </section>
          <section className="divisibility71-misconception">
            <header>
              <TriangleAlert />
              <h2>Common misconception</h2>
            </header>
            <p>
              <b>Check:</b> {misconceptionNumber} has{" "}
              {divisor === 3 || divisor === 9
                ? `digit sum ${misconception.sum}`
                : misconception.evidence.toLowerCase()}
              , so it is {misconception.passes ? "" : "not "}divisible by{" "}
              {divisor}.
            </p>
            <strong>{misconception.evidence}</strong>
            <span>
              {misconceptionNumber} ÷ {divisor} ={" "}
              {Math.floor(misconceptionNumber / divisor)}{" "}
              <small>remainder</small> {misconceptionNumber % divisor}
            </span>
            <em>
              {misconception.passes ? <Check /> : <X />}
              {misconception.passes ? "Divisible" : "Not divisible"} by{" "}
              {divisor}
            </em>
          </section>
          <section className="divisibility71-practice">
            <header>
              <CircleHelp />
              <h2>Try it yourself</h2>
            </header>
            <div>
              <b>
                Try: Is {practiceNumber} divisible by {divisor}?
              </b>
              <button
                type="button"
                onClick={() => {
                  setPracticeChecked(true);
                  act();
                }}
              >
                {practiceChecked
                  ? practice.passes
                    ? "Yes, divisible"
                    : "No, not divisible"
                  : "Check your answer"}
                <ArrowRight />
              </button>
            </div>
          </section>
        </aside>
      </main>
      <nav className="divisibility71-navigation">
        <a href="/lessons/numbers-and-arithmetic/70-lcm">
          <ArrowLeft />
          <span>
            Previous<b>LCM</b>
          </span>
        </a>
        <a href="/lessons/numbers-and-arithmetic/72-modular-arithmetic">
          <span>
            Next<b>Modular Arithmetic</b>
          </span>
          <ArrowRight />
        </a>
      </nav>
    </div>
  );
}
