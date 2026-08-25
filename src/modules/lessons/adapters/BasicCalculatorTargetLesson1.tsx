import {
  Check,
  ChevronDown,
  ChevronRight,
  History,
  Lightbulb,
  RotateCcw,
  Share2,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { evaluateExpressionDetailed } from "../../../utils/calculator";
import type { LessonAdapterProps } from "../types";
import "./BasicCalculatorTargetLesson1.css";

type Grade = "idle" | "correct" | "incorrect";
const INITIAL = "(12+8)/4";
const VIEWS = [
  ["interaction", "◉", "Interaction + visualization"],
  ["explain", "▤", "Explain"],
  ["examples", "♙", "Examples"],
  ["formulas", "∑", "Formulas"],
  ["know", "⌘", "Know more"],
] as const;
const PRACTICE = [
  { expression: "(18-6)*2+4", display: "(18 − 6) × 2 + 4", answer: 28 },
  { expression: "36/(3+3)+5", display: "36 ÷ (3 + 3) + 5", answer: 11 },
  { expression: "7+4*6-3", display: "7 + 4 × 6 − 3", answer: 28 },
];

export default function BasicCalculatorTargetLesson1({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [expression, setExpression] = useState(INITIAL);
  const [result, setResult] = useState("5");
  const [activeView, setActiveView] = useState("interaction");
  const [autoStep, setAutoStep] = useState(true);
  const [history, setHistory] = useState<
    Array<{ expression: string; result: string }>
  >([]);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [practiceIndex, setPracticeIndex] = useState(0);
  const [practiceAnswer, setPracticeAnswer] = useState("");
  const [grade, setGrade] = useState<Grade>("idle");
  const [solutionOpen, setSolutionOpen] = useState(false);
  const practice = PRACTICE[practiceIndex];
  const trace = useMemo(
    () => buildTrace(expression, result),
    [expression, result],
  );

  const restore = () => {
    setExpression(INITIAL);
    setResult("5");
    setActiveView("interaction");
    setAutoStep(true);
    setHistory([]);
    setHistoryOpen(false);
    setPracticeIndex(0);
    setPracticeAnswer("");
    setGrade("idle");
    setSolutionOpen(false);
  };
  useEffect(restore, [resetToken]);

  const evaluate = (raw = expression) => {
    try {
      const value = evaluateExpressionDetailed(raw || "0", "DEG").value;
      setResult(value);
      setHistory((rows) =>
        [{ expression: raw || "0", result: value }, ...rows].slice(0, 6),
      );
      onInteraction();
      return value;
    } catch {
      setResult("Error");
      onInteraction();
      return "Error";
    }
  };
  const update = (next: string) => {
    setExpression(next);
    setGrade("idle");
    if (autoStep && next) {
      try {
        setResult(evaluateExpressionDetailed(next, "DEG").value);
      } catch {
        setResult("…");
      }
    }
    onInteraction();
  };
  const key = (token: string) => {
    if (token === "AC") return update("");
    if (token === "⌫") return update(expression.slice(0, -1));
    if (token === "+/−")
      return update(
        expression.startsWith("-") ? expression.slice(1) : `-${expression}`,
      );
    update(`${expression}${token}`);
  };
  const checkPractice = () => {
    const correct = Math.abs(Number(practiceAnswer) - practice.answer) < 1e-9;
    setGrade(correct ? "correct" : "incorrect");
    setSolutionOpen(correct);
    onInteraction();
  };

  return (
    <div
      className="target-basic-page"
      data-testid="calculator-mockup-0001"
      data-dedicated-lesson="1"
      data-object-model="editable-arithmetic-expression-bodmas-parse-trace-history-practice-model"
      data-expression={expression}
      data-result={result}
      data-auto-step={autoStep}
      data-active-view={activeView}
      data-practice-state={grade}
    >
      <header className="target-basic-header">
        <div className="target-basic-icon">
          <img
            src="/assets/math-icons/08-scientific-calculator.png"
            alt="Scientific calculator"
          />
        </div>
        <div className="target-basic-title">
          <span>CORE WORKSPACES</span>
          <h1>Basic Calculator</h1>
          <p>Build fluency with foundational arithmetic.</p>
          <div>
            <b>♙ Foundational–Advanced</b>
            <b>⏱ Ages 10+</b>
            <b>⌘ Calculator Lab</b>
            <b>◷ 6–10 min</b>
          </div>
        </div>
        <div className="target-basic-unlocked">
          <Check />
          <div>
            <b>Concept unlocked</b>
            <strong>Operation order</strong>
            <p>Evaluate expressions step by step.</p>
          </div>
        </div>
        <div className="target-basic-actions">
          <button type="button" onClick={restore}>
            <RotateCcw />
            Reset
          </button>
          <button
            type="button"
            onClick={() => navigator.clipboard?.writeText(window.location.href)}
          >
            <Share2 />
            Share
          </button>
          <a href="/workspace">↗ Workspace</a>
        </div>
      </header>
      <div className="target-basic-body">
        <main>
          <nav
            className="target-basic-tabs"
            aria-label="Basic calculator lesson views"
          >
            {VIEWS.map(([id, icon, label]) => (
              <button
                type="button"
                key={id}
                className={activeView === id ? "active" : ""}
                onClick={() => {
                  setActiveView(id);
                  onInteraction();
                }}
              >
                {icon} {label}
              </button>
            ))}
          </nav>
          <section className="target-basic-workspace">
            <h2>Evaluate using order of operations</h2>
            <span className="sr-only">
              Concept trace Operation order stack Order rule
            </span>
            <div className="target-basic-columns">
              <div className="target-basic-calculator">
                <div className="target-basic-display">
                  <button
                    type="button"
                    onClick={() => setHistoryOpen((v) => !v)}
                  >
                    <History />
                    History
                  </button>
                  <input
                    aria-label="Calculator expression"
                    value={pretty(expression)}
                    onChange={(e) => update(normalize(e.target.value))}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") evaluate();
                    }}
                  />
                  <div className="target-basic-strip">
                    <b>1</b>
                    <span>{pretty(expression || "0")}</span>
                    <ChevronRight />
                    <b>2</b>
                    <span>{trace.middle}</span>
                    <ChevronRight />
                    <b>3</b>
                    <span>{result}</span>
                  </div>
                  {historyOpen && (
                    <div
                      className="target-basic-history"
                      aria-label="Calculation history"
                    >
                      {history.length ? (
                        history.map((row, i) => (
                          <button
                            type="button"
                            key={i}
                            onClick={() => update(row.expression)}
                          >
                            {pretty(row.expression)} = {row.result}
                          </button>
                        ))
                      ) : (
                        <p>No history yet.</p>
                      )}
                    </div>
                  )}
                </div>
                <div className="target-basic-modes">
                  <button className="active">▣ 123</button>
                  <button>▧ Functions</button>
                  <button>xʸ Algebra</button>
                  <button>x² Algebra</button>
                  <button>∑ Calculus</button>
                  <button>π Symbols</button>
                </div>
                <div className="target-basic-keys">
                  {[
                    "7",
                    "8",
                    "9",
                    "/",
                    "(",
                    ")",
                    "4",
                    "5",
                    "6",
                    "*",
                    "⌫",
                    "AC",
                    "1",
                    "2",
                    "3",
                    "-",
                    "%",
                    "+/−",
                    "0",
                    ".",
                    "=",
                    "+",
                    "Evaluate",
                  ].map((label) => (
                    <button
                      type="button"
                      key={label}
                      className={
                        /[/*+-]/.test(label) && label.length === 1
                          ? "operator"
                          : label === "="
                            ? "equals"
                            : label === "Evaluate"
                              ? "evaluate"
                              : ""
                      }
                      aria-label={`Calculator key ${label}`}
                      onClick={() =>
                        label === "=" || label === "Evaluate"
                          ? evaluate()
                          : key(label)
                      }
                    >
                      {label === "/" ? "÷" : label === "*" ? "×" : label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="target-basic-trace">
                <header>
                  <h3>Expression trace</h3>
                  <label>
                    Auto-step{" "}
                    <input
                      aria-label="Automatic expression trace"
                      type="checkbox"
                      checked={autoStep}
                      onChange={(e) => {
                        setAutoStep(e.target.checked);
                        onInteraction();
                      }}
                    />
                  </label>
                </header>
                {trace.steps.map((step, index) => (
                  <article key={`${step.title}-${index}`}>
                    <b>{index + 1}</b>
                    <div>
                      <strong>{step.title}</strong>
                      <h4>{step.expression}</h4>
                      <p>{step.note}</p>
                    </div>
                  </article>
                ))}
                <article className="final">
                  <b>{trace.steps.length + 1}</b>
                  <div>
                    <strong>Final result</strong>
                    <h4>{result}</h4>
                    <span>Correct ✓</span>
                  </div>
                </article>
              </div>
            </div>
          </section>
          <section className="target-basic-success">
            <Check />
            <div>
              <h3>
                {result === "5"
                  ? "Great job! You evaluated the expression correctly."
                  : "Expression evaluated."}
              </h3>
              <p>
                The trace follows the order of operations and explains the
                result.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                const next = (practiceIndex + 1) % PRACTICE.length;
                setPracticeIndex(next);
                setPracticeAnswer("");
                setGrade("idle");
              }}
            >
              Try another
            </button>
            <button
              type="button"
              onClick={() => {
                update(practice.expression);
                evaluate(practice.expression);
              }}
            >
              Next example <ChevronRight />
            </button>
          </section>
        </main>
        <aside className="target-basic-aside">
          <section className="target-basic-rule">
            <div className="rule-icon">⚖</div>
            <h2>Key rule</h2>
            <h3>Order of operations (BODMAS)</h3>
            <p>Follow this order to evaluate any expression.</p>
            {[
              ["B", "Brackets", "( )　[ ]　{ }"],
              ["O", "Orders", "√x　x²　x³"],
              ["D", "Division", "÷"],
              ["M", "Multiplication", "×"],
              ["A", "Addition", "+"],
              ["S", "Subtraction", "−"],
            ].map(([l, n, s]) => (
              <div key={l}>
                <b>{l}</b>
                <strong>{n}</strong>
                <span>{s}</span>
              </div>
            ))}
          </section>
          <section className="target-basic-practice">
            <header>
              <h2>Try it yourself</h2>
              <span>New</span>
            </header>
            <p>Evaluate using order of operations.</p>
            <div className="practice-expression">{practice.display}</div>
            <input
              aria-label="Basic calculator practice answer"
              value={practiceAnswer}
              onChange={(e) => {
                setPracticeAnswer(e.target.value);
                setGrade("idle");
              }}
              placeholder="Enter your answer..."
            />
            <button type="button" onClick={checkPractice}>
              Check answer
            </button>
            <p className="tip">
              <Lightbulb /> Tip: Do parentheses first, then × or ÷, then + or −.
            </p>
            {grade !== "idle" && (
              <strong className={grade}>
                {grade === "correct"
                  ? "Correct. Well done."
                  : "Not yet. Follow BODMAS and try again."}
              </strong>
            )}
            <button
              type="button"
              className="solution-toggle"
              aria-expanded={solutionOpen}
              onClick={() => setSolutionOpen((v) => !v)}
            >
              Show step-by-step solution <ChevronDown />
            </button>
            {solutionOpen && (
              <div className="practice-solution">
                {practice.display} = {practice.answer}
              </div>
            )}
          </section>
        </aside>
      </div>
    </div>
  );
}

function buildTrace(expression: string, result: string) {
  if (normalize(expression) === INITIAL)
    return {
      middle: "20 / 4",
      steps: [
        {
          title: "Resolve parentheses first",
          expression: "(12 + 8) / 4",
          note: "12 + 8 = 20",
        },
        { title: "Then do division", expression: "20 / 4", note: "20 ÷ 4 = 5" },
      ],
    };
  return {
    middle: result,
    steps: [
      {
        title: "Read the expression",
        expression: pretty(expression || "0"),
        note: "Identify brackets and operations.",
      },
      {
        title: "Apply operation order",
        expression: pretty(expression || "0"),
        note: `The evaluated value is ${result}.`,
      },
    ],
  };
}
function normalize(value: string) {
  return value
    .replace(/[×x]/g, "*")
    .replace(/÷/g, "/")
    .replace(/−/g, "-")
    .replace(/\s/g, "");
}
function pretty(value: string) {
  return value
    .replace(/\*/g, " × ")
    .replace(/\//g, " / ")
    .replace(/-/g, " − ")
    .replace(/\+/g, " + ")
    .replace(/\s+/g, " ")
    .trim();
}
