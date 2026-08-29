import {
  AlertTriangle,
  Check,
  Eye,
  Lightbulb,
  MousePointer2,
  Plus,
  RotateCcw,
  Share2,
  Target,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { LessonAdapterProps } from "../../types";
import "./AssumptionsTargetLesson446.css";

type AssumptionKey =
  "real" | "notMinus2" | "notZero" | "positive" | "negative" | "integer";
const defaults: Record<AssumptionKey, boolean> = {
  real: true,
  notMinus2: true,
  notZero: true,
  positive: false,
  negative: false,
  integer: false,
};
const labels: Record<AssumptionKey, string> = {
  real: "x ∈ ℝ",
  notMinus2: "x ≠ −2",
  notZero: "x ≠ 0",
  positive: "x > 0",
  negative: "x < 0",
  integer: "x ∈ ℤ",
};

export default function AssumptionsTargetLesson446({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [expression, setExpression] = useState("2*x+3*x-x+4-2"),
    [assumptions, setAssumptions] = useState(defaults),
    [practiceAnswer, setPracticeAnswer] = useState(""),
    [conditionalAnswer, setConditionalAnswer] = useState(""),
    [feedback, setFeedback] = useState<"" | "correct" | "incorrect">(""),
    [expanded, setExpanded] = useState(true),
    [actions, setActions] = useState(0);
  const model = useMemo(() => simplifyLinear(expression), [expression]);
  const act = (run: () => void) => {
    run();
    setActions((value) => value + 1);
    onInteraction();
  };
  useEffect(() => {
    setExpression("2*x+3*x-x+4-2");
    setAssumptions(defaults);
    setPracticeAnswer("");
    setConditionalAnswer("");
    setFeedback("");
    setExpanded(true);
    setActions(0);
  }, [resetToken]);
  const toggle = (key: AssumptionKey) =>
    act(() =>
      setAssumptions((value) => ({
        ...value,
        [key]: !value[key],
        ...(key === "positive" && !value.positive ? { negative: false } : {}),
        ...(key === "negative" && !value.negative ? { positive: false } : {}),
      })),
    );
  const selected = (Object.keys(assumptions) as AssumptionKey[]).filter(
    (key) => assumptions[key],
  );
  return (
    <section
      className="as446-page"
      data-testid="symbolic-cas-mockup-0352"
      data-dedicated-lesson="446"
      data-object-model="linear-expression-assumption-domain-conditional-evaluation-cancellation-practice"
      data-expression={expression}
      data-coefficient={model.coefficient}
      data-constant={model.constant}
      data-result={model.valid ? model.display : "invalid"}
      data-assumptions={selected.join(",")}
      data-feedback={feedback}
      data-actions={actions}
    >
      <header className="as446-hero">
        <div>
          <span className="as446-pills">
            <b>Symbolic Mathematics</b>
            <b>CAS Workspace</b>
          </span>
          <h1>Assumptions</h1>
          <p>Control symbolic domains.</p>
          <div className="as446-meta">
            <span>♙ Intermediate–Advanced</span>
            <span>⚡ CAS Lab</span>
            <span>▣ CAS Calculator</span>
            <span>◷ 6–10 min</span>
          </div>
          <div className="as446-actions">
            <button>⚒ English (English)⌄</button>
            <button
              data-lesson-control="assumptions-reset"
              onClick={() =>
                act(() => {
                  setExpression("2*x+3*x-x+4-2");
                  setAssumptions(defaults);
                })
              }
            >
              <RotateCcw /> Reset
            </button>
            <button
              data-lesson-control="assumptions-share"
              onClick={() =>
                act(() =>
                  navigator.clipboard?.writeText(
                    `${expression} → ${model.display}`,
                  ),
                )
              }
            >
              <Share2 /> Share
            </button>
            <a href="/workspace/data/cas">↗ Workspace</a>
          </div>
        </div>
        <aside>
          <h3>How to learn in this lesson</h3>
          {[
            [Eye, "Observe", "See how assumptions change results."],
            [
              MousePointer2,
              "Manipulate",
              "Toggle assumptions on/off and add new ones.",
            ],
            [
              Lightbulb,
              "Notice",
              "Watch how each change affects simplification.",
            ],
            [
              Target,
              "Understand",
              "Build the rule and apply it with confidence.",
            ],
          ].map(([Icon, title, text]) => (
            <p key={String(title)}>
              <Icon />
              <b>{String(title)}</b>
              <span>{String(text)}</span>
            </p>
          ))}
        </aside>
      </header>
      <div className="as446-grid">
        <main className="as446-workspace">
          <header>
            <span>
              <h2>CAS Workspace</h2>
              <p>Assumptions drive simplification.</p>
            </span>
            <b>
              <Check />{" "}
              {model.valid
                ? "Result is valid under current assumptions"
                : "Enter a linear expression in x"}
            </b>
          </header>
          <label className="as446-expression">
            Expression
            <input
              aria-label="Assumptions expression"
              data-lesson-control="assumptions-expression"
              value={expression}
              onChange={(event) => act(() => setExpression(event.target.value))}
            />
          </label>
          <section className="as446-manager">
            <header>
              <h3>Assumptions</h3>
              <a href="#as446-reference">Learn more</a>
            </header>
            <div>
              {(
                [
                  "real",
                  "notMinus2",
                  "notZero",
                  "positive",
                  "negative",
                ] as AssumptionKey[]
              ).map((key) => (
                <button
                  key={key}
                  className={assumptions[key] ? "selected" : ""}
                  data-lesson-control={`assumption-${key}`}
                  aria-pressed={assumptions[key]}
                  onClick={() => toggle(key)}
                >
                  {labels[key]} {assumptions[key] && <Check />}
                </button>
              ))}
              <button
                data-lesson-control="assumption-add"
                onClick={() => toggle("integer")}
              >
                <Plus />{" "}
                {assumptions.integer ? labels.integer : "Add assumption"}
              </button>
            </div>
            <p>
              Tip: Assumptions restrict the domain and enable more
              simplifications.
            </p>
          </section>
          <div className="as446-down">↓</div>
          <section className="as446-result">
            <article>
              <h3>Simplified form</h3>
              <output>
                {model.valid ? model.display : "Unsupported expression"}
              </output>
              <b>{model.valid ? "Fully simplified" : "Check syntax"}</b>
            </article>
            <article>
              <h3>
                Conditional results <small>(selected assumptions)</small>
              </h3>
              <p>
                <Check /> x ≠ −2{" "}
                <strong>{model.valid ? model.display : "—"}</strong>
                <em>Always valid</em>
              </p>
              <p>
                <AlertTriangle /> x = −2{" "}
                <strong>
                  {model.valid
                    ? tidy(model.coefficient * -2 + model.constant)
                    : "—"}
                </strong>
                <em>Constant value</em>
              </p>
            </article>
          </section>
          <section className="as446-steps">
            <button
              data-lesson-control="assumptions-steps"
              onClick={() => act(() => setExpanded((value) => !value))}
            >
              Step-by-step simplification (under current assumptions){" "}
              <span>{expanded ? "⌃" : "⌄"}</span>
            </button>
            {expanded && model.valid && (
              <div>
                {model.steps.map((step, index) => (
                  <p key={step}>
                    <b>{index + 1}</b>
                    <span>{step}</span>
                  </p>
                ))}
              </div>
            )}
          </section>
          <p className="as446-info">
            ⓘ The result is valid for all real numbers. Additional assumptions
            can enable further simplifications for different expressions.
          </p>
        </main>
        <aside className="as446-side">
          <article id="as446-reference">
            <h2>♙ Rule / Reference</h2>
            <h3>Combine Like Terms</h3>
            <p>For any real numbers a, b and expression x:</p>
            <output>a*x + b*x = (a+b)*x</output>
            <p>
              Valid over ℝ. Assumptions can restrict the domain or unlock extra
              simplifications.
            </p>
          </article>
          <article>
            <h2>
              <Check /> Worked Example
            </h2>
            <p>Simplify 3*x²/x with x ≠ 0.</p>
            <h3>Steps</h3>
            <output>3*x²/x = 3*x &nbsp; (x ≠ 0)</output>
            <p>Why x ≠ 0? Division by zero is undefined.</p>
          </article>
          <article className="as446-warning">
            <h2>
              <AlertTriangle /> Common Misconception
            </h2>
            <h3>Do not assume without checking.</h3>
            <p>
              Dropping a necessary assumption can lead to wrong statements at
              excluded values.
            </p>
            <output>(x²−1)/(x−1) = x+1 is NOT always true.</output>
            <p>At x=1, LHS is undefined while RHS=2.</p>
          </article>
        </aside>
      </div>
      <section className="as446-practice">
        <header>
          <span>
            <h2>Quick Practice: Assumptions</h2>
            <p>
              Apply assumptions to simplify and identify conditional results.
            </p>
          </span>
          <b>1 try</b>
          <button
            data-lesson-control="assumptions-check"
            onClick={() =>
              act(() => {
                const conditional = normalize(conditionalAnswer);
                setFeedback(
                  normalize(practiceAnswer) === "x+2" &&
                    (!conditional ||
                      ["undefined", "dne", "notdefined"].includes(conditional))
                    ? "correct"
                    : "incorrect",
                );
              })
            }
          >
            Check Answer
          </button>
        </header>
        <div>
          <article>
            <b>Simplify</b>
            <output>(x²−4)/(x−2)</output>
          </article>
          <article>
            <b>Assumptions</b>
            <p>
              <span>x ∈ ℝ ✓</span>
              <span>x ≠ 2 ✓</span>
            </p>
          </article>
          <strong>→</strong>
          <label>
            Your answer
            <input
              aria-label="Practice simplified form"
              value={practiceAnswer}
              onChange={(event) => {
                setPracticeAnswer(event.target.value);
                setFeedback("");
              }}
              placeholder="Enter simplified form..."
            />
          </label>
          <strong>→</strong>
          <label>
            Conditional result at x = 2 (optional)
            <input
              aria-label="Practice conditional value"
              value={conditionalAnswer}
              onChange={(event) => {
                setConditionalAnswer(event.target.value);
                setFeedback("");
              }}
              placeholder="What is the value at x = 2?"
            />
          </label>
        </div>
        <footer className={feedback}>
          Hint: Factor x²−4, cancel only when x≠2, and preserve the excluded
          value.{" "}
          {feedback === "correct"
            ? "Correct: x+2 for x≠2; undefined at x=2."
            : feedback === "incorrect"
              ? "Check both the simplified form and excluded value."
              : ""}
        </footer>
      </section>
    </section>
  );
}

function simplifyLinear(source: string) {
  const compact = source.replace(/\s+/g, "").replace(/−/g, "-");
  if (!compact || /[^0-9x*+\-.]/.test(compact))
    return {
      valid: false,
      coefficient: 0,
      constant: 0,
      display: "",
      steps: [] as string[],
    };
  const terms = compact.replace(/-/g, "+-").split("+").filter(Boolean),
    xTerms: number[] = [],
    constants: number[] = [];
  let coefficient = 0,
    constant = 0;
  for (const term of terms) {
    if (term.includes("x")) {
      const raw = term.replace(/\*/g, "").replace("x", "");
      const value = raw === "" ? 1 : raw === "-" ? -1 : Number(raw);
      if (!Number.isFinite(value))
        return {
          valid: false,
          coefficient: 0,
          constant: 0,
          display: "",
          steps: [] as string[],
        };
      coefficient += value;
      xTerms.push(value);
    } else {
      const value = Number(term);
      if (!Number.isFinite(value))
        return {
          valid: false,
          coefficient: 0,
          constant: 0,
          display: "",
          steps: [] as string[],
        };
      constant += value;
      constants.push(value);
    }
  }
  const display = `${tidy(constant)}${coefficient < 0 ? "−" : "+"}${tidy(Math.abs(coefficient))}*x`;
  const signed = (values: number[], suffix = "") =>
    values
      .map(
        (value, index) =>
          `${index && value >= 0 ? "+ " : ""}${tidy(value)}${suffix}`,
      )
      .join(" ");
  return {
    valid: true,
    coefficient,
    constant,
    display,
    steps: [
      `${signed(xTerms, "*x")} → combine x terms → ${tidy(coefficient)}*x`,
      `${signed(constants)} → combine constants → ${tidy(constant)}`,
      `${tidy(coefficient)}*x ${constant >= 0 ? "+" : "−"} ${tidy(Math.abs(constant))} → canonical form → ${display}`,
    ],
  };
}
function tidy(value: number) {
  return Math.abs(value - Math.round(value)) < 1e-9
    ? String(Math.round(value))
    : value.toFixed(3).replace(/0+$/, "");
}
function normalize(value: string) {
  return value
    .toLowerCase()
    .replace(/\s+/g, "")
    .replace(/−/g, "-")
    .replace(/\*/g, "");
}
