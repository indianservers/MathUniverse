import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronRight,
  Lightbulb,
  RotateCcw,
  Share2,
  Undo2,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { LessonAdapterProps } from "../../types";
import "./StepByStepAlgebraTargetLesson448.css";
import "./StepByStepAlgebraTargetLesson448Footer.css";

type Move = "distribute" | "combine" | "constants";

const lessonSteps = [
  {
    expression: "2(x + 3) + x - x + 4 - 2",
    rule: "Distributive Property",
    instruction: "Distribute 2 across (x + 3).",
    next: "(2x + 6) + x - x + 4 - 2",
    changed: ["2(x + 3)", "2x + 6"],
  },
  {
    expression: "(2x + 6) + x - x + 4 - 2",
    rule: "Combine Like Terms",
    instruction: "Combine the x-terms: 2x + x - x.",
    next: "2x + 6 + 4 - 2",
    changed: ["2x + x - x", "2x"],
  },
  {
    expression: "2x + 6 + 4 - 2",
    rule: "Combine Like Terms",
    instruction: "Simplify the constants: 6 + 4 - 2.",
    next: "2x + 8",
    changed: ["6 + 4 - 2", "8"],
  },
] as const;

const moveLabels: Record<Move, [string, string]> = {
  distribute: ["Distribute 2 across (x + 3)", "Distributive Property"],
  combine: ["Combine like terms (2x + x - x)", "Combine Like Terms"],
  constants: ["Simplify constants (6 + 4 - 2)", "Combine Like Terms"],
};

export default function StepByStepAlgebraTargetLesson448({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [step, setStep] = useState(0);
  const [feedback, setFeedback] = useState<"" | "correct" | "incorrect">("");
  const [practiceChoice, setPracticeChoice] = useState<Move | "">("");
  const [practiceFeedback, setPracticeFeedback] = useState<
    "" | "correct" | "incorrect"
  >("");
  const [tab, setTab] = useState("Interaction + visualization");
  const [actions, setActions] = useState(0);
  const model = useMemo(() => lessonSteps[Math.min(step, 2)], [step]);
  const current = step === 3 ? "2x + 8" : model.expression;
  const expected: Move | null =
    step === 0
      ? "distribute"
      : step === 1
        ? "combine"
        : step === 2
          ? "constants"
          : null;
  const act = (run: () => void) => {
    run();
    setActions((value) => value + 1);
    onInteraction();
  };
  const reset = () => {
    setStep(0);
    setFeedback("");
    setPracticeChoice("");
    setPracticeFeedback("");
    setTab("Interaction + visualization");
    setActions(0);
  };
  useEffect(reset, [resetToken]);

  const chooseMove = (move: Move) =>
    act(() => {
      if (move === expected) {
        setStep((value) => Math.min(3, value + 1));
        setFeedback("correct");
      } else {
        setFeedback("incorrect");
      }
    });

  return (
    <section
      className="sa448-page"
      data-testid="symbolic-cas-mockup-0354"
      data-dedicated-lesson="448"
      data-object-model="ordered-algebra-transformations-rule-validation-change-tracking-practice"
      data-step={step}
      data-expression={current}
      data-expected-move={expected ?? "complete"}
      data-feedback={feedback}
      data-practice-feedback={practiceFeedback}
      data-actions={actions}
    >
      <header className="sa448-hero">
        <div>
          <span className="sa448-pills">
            <b>Symbolic Mathematics</b>
            <b>CAS Workspace</b>
          </span>
          <h1>Step-by-Step Algebra</h1>
          <p>Teach procedures.</p>
          <div className="sa448-meta">
            <span>♙ Intermediate–Advanced</span>
            <span>⚡ CAS Lab</span>
            <span>▣ CAS Calculator</span>
            <span>◷ 6–10 min</span>
          </div>
          <div className="sa448-actions">
            <button data-lesson-control="language">⚒ English (English)⌄</button>
            <button data-lesson-control="reset" onClick={() => act(reset)}>
              <RotateCcw /> Reset
            </button>
            <button
              data-lesson-control="share"
              onClick={() =>
                act(() =>
                  navigator.clipboard?.writeText(
                    `${current} — ${step}/3 steps`,
                  ),
                )
              }
            >
              <Share2 /> Share
            </button>
            <a data-lesson-control="workspace" href="/workspace/data/cas">
              ↗ Workspace
            </a>
          </div>
        </div>
        <aside>
          <h3>How this works (CAS Workspace)</h3>
          {[
            ["1", "Observe", "Read the expression and the goal."],
            ["2", "Manipulate", "Choose a valid next move."],
            ["3", "Notice", "See what changed and why."],
            ["4", "Understand", "Connect the rule to the pattern."],
          ].map(([n, t, p]) => (
            <div key={n}>
              <b>{n}</b>
              <span>
                <strong>{t}</strong>
                <small>{p}</small>
              </span>
            </div>
          ))}
        </aside>
      </header>

      <nav className="sa448-tabs">
        {[
          "Interaction + visualization",
          "Explain",
          "Examples",
          "Formulas",
          "Common mistakes",
          "Practice",
        ].map((name) => (
          <button
            key={name}
            className={tab === name ? "active" : ""}
            data-lesson-control={`tab-${name}`}
            onClick={() => act(() => setTab(name))}
          >
            {name}
          </button>
        ))}
      </nav>

      <section className="sa448-workspace">
        <header>
          <div>
            <b>CAS WORKSPACE</b>
            <h2>Work directly on the model</h2>
          </div>
          <span className="done">✓ {step} steps completed</span>
          <span>{actions} actions</span>
        </header>
        <h3>Step-by-Step Algebra – reusable CAS engine</h3>
        <div className="sa448-grid">
          <div className="sa448-left">
            <article className="goal">
              <b>GOAL</b>
              <p>Simplify completely.</p>
              <output>
                Final simplified form: <strong>2x + 8</strong>
              </output>
            </article>
            <article className="current">
              <b>CURRENT EXPRESSION</b>
              <output>{current}</output>
            </article>
            <article className="step-card">
              <b>STEP {Math.min(step + 1, 3)} OF 3</b>
              {step < 3 ? (
                <>
                  <h4>
                    Apply the {model.rule}: <span>{model.instruction}</span>
                  </h4>
                  <p>{model.instruction}</p>
                  <b>NEXT EXPRESSION</b>
                  <output>{model.next}</output>
                </>
              ) : (
                <>
                  <h4>Expression simplified completely.</h4>
                  <p>No further valid simplification is required.</p>
                  <b>FINAL EXPRESSION</b>
                  <output>2x + 8</output>
                </>
              )}
              <div className={feedback || "ready"}>
                {feedback === "incorrect"
                  ? "✕ That move is not valid yet."
                  : feedback === "correct"
                    ? "✓ Correct! The rule was applied."
                    : "Choose the next valid move."}
                <button
                  data-lesson-control="undo"
                  disabled={step === 0}
                  onClick={() =>
                    act(() => {
                      setStep((value) => Math.max(0, value - 1));
                      setFeedback("");
                    })
                  }
                >
                  <Undo2 /> Undo step
                </button>
              </div>
            </article>
            <article className="moves">
              <b>AVAILABLE NEXT MOVES</b>
              <small>Choose a valid next move to continue.</small>
              {(Object.keys(moveLabels) as Move[]).map((move) => (
                <button
                  key={move}
                  className={expected === move ? "valid" : ""}
                  disabled={step === 3}
                  data-lesson-control={`move-${move}`}
                  onClick={() => chooseMove(move)}
                >
                  <ChevronRight />
                  <span>{moveLabels[move][0]}</span>
                  <small>{moveLabels[move][1]}</small>
                  {expected === move && <Check />}
                </button>
              ))}
              <button
                data-lesson-control="move-reorder"
                disabled={step === 3}
                onClick={() => chooseMove("constants")}
              >
                <ChevronRight />
                <span>Reorder terms</span>
                <small>Commutative Property</small>
              </button>
              <p>
                ⓘ Tip: Choose the move that removes parentheses or combines
                matching terms.
              </p>
            </article>
          </div>
          <aside className="sa448-right">
            <article className="rule">
              <b>APPLIED RULE</b>
              <h3>♧ {step === 0 ? "Distributive Property" : model.rule}</h3>
              <output>a(b + c) = ab + ac</output>
              <p>
                Multiply the outside factor by each term inside the parentheses.
              </p>
              <p>Here: 2(x + 3) = 2x + 6</p>
            </article>
            <article className="changed">
              <b>WHAT CHANGED?</b>
              <p>
                {step === 0 ? "Nothing yet. Choose a move." : model.instruction}
              </p>
              <div>
                <span>
                  Before
                  <strong>
                    {step === 0 ? "2(x + 3)" : lessonSteps[step - 1].changed[0]}
                  </strong>
                </span>
                →
                <span>
                  After
                  <strong>
                    {step === 0 ? "2x + 6" : lessonSteps[step - 1].changed[1]}
                  </strong>
                </span>
              </div>
              <footer>
                <i /> Unchanged <i /> Changed <i /> New
              </footer>
            </article>
            <article className="mistake">
              <AlertTriangle />
              <div>
                <b>COMMON MISTAKE</b>
                <h4>Multiplying everything by the first term only.</h4>
                <p>Incorrect: 2(x + 3) = 2x + 3 ✕</p>
                <p>
                  <strong>Why it’s wrong:</strong> The 2 must multiply both x
                  and 3.
                </p>
                <p>
                  <strong>Fix:</strong> Use the Distributive Property.
                </p>
              </div>
            </article>
            <article className="insight">
              <Lightbulb />
              <div>
                <b>ONE KEY INSIGHT</b>
                <h4>Distribute first, then simplify.</h4>
                <p>
                  Expanding parentheses early exposes like terms and helps avoid
                  mistakes.
                </p>
              </div>
            </article>
          </aside>
        </div>
        <div className="sa448-bottom">
          <article>
            <b>ONE WORKED EXAMPLE</b>
            <p>
              <strong>Example:</strong> Simplify completely.
            </p>
            <h4>3(x − 2) + 4x − 5</h4>
            <ol>
              <li>
                Distribute 3 across (x − 2)<span>3x − 6 + 4x − 5 ✓</span>
              </li>
              <li>
                Combine like terms (3x + 4x)<span>7x − 6 − 5 ✓</span>
              </li>
              <li>
                Combine constants (−6 − 5)<output>7x − 11</output>
              </li>
            </ol>
          </article>
          <article className="practice">
            <b>YOUR TURN: QUICK PRACTICE</b>
            <p>Simplify completely.</p>
            <h4>4(x + 1) − 3x + 2</h4>
            <small>Your next move?</small>
            {(["distribute", "combine", "constants"] as Move[]).map(
              (move, index) => (
                <button
                  key={move}
                  className={practiceChoice === move ? "selected" : ""}
                  data-lesson-control={`practice-${move}`}
                  onClick={() => {
                    setPracticeChoice(move);
                    setPracticeFeedback("");
                  }}
                >
                  <b>{String.fromCharCode(65 + index)}</b>
                  {index === 0
                    ? "Distribute 4 across (x + 1)"
                    : index === 1
                      ? "Combine like terms (4x − 3x)"
                      : "Simplify constants (1 + 2)"}
                  <small>{moveLabels[move][1]}</small>
                </button>
              ),
            )}
            <button
              className="check"
              data-lesson-control="practice-check"
              disabled={!practiceChoice}
              onClick={() =>
                act(() =>
                  setPracticeFeedback(
                    practiceChoice === "distribute" ? "correct" : "incorrect",
                  ),
                )
              }
            >
              Check my move
            </button>
            <output className={practiceFeedback}>
              {practiceFeedback === "correct"
                ? "Correct: 4x + 4 − 3x + 2"
                : practiceFeedback === "incorrect"
                  ? "Start by removing the parentheses."
                  : ""}
            </output>
          </article>
        </div>
      </section>
      <nav className="sa448-nav">
        <a href="/lessons/symbolic-mathematics/447-exact-numeric-toggle">
          <ArrowLeft />
          <span>
            <small>Previous</small>Exact / Numeric Toggle
          </span>
        </a>
        <a href="/lessons/symbolic-mathematics/449-cas-to-graph-link">
          <span>
            <small>Next</small>CAS-to-Graph Link
          </span>
          <ArrowRight />
        </a>
      </nav>
    </section>
  );
}
