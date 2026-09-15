import {
  useEffect,
  useMemo,
  useState,
  type DragEvent,
  type ReactNode,
} from "react";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Check,
  ChevronDown,
  CircleAlert,
  Equal,
  NotebookPen,
  PartyPopper,
  Scale,
  Sparkles,
} from "lucide-react";
import type { LessonAdapterProps } from "../types";
import {
  ONE_STEP_EQUATIONS_107 as equations,
  ONE_STEP_PRACTICES_107 as practiceEquations,
  evaluateOneStepEquation107,
  evaluateOneStepPractice107,
  isOneStepAnswerCorrect107,
  isOneStepOperationDrop107,
  shouldResolveBalance107,
  solveOneStepEquation107,
  solveOneStepPractice107,
  type OneStepEquation107 as Equation,
} from "./oneStepEquationsLesson107Model";
import "./OneStepEquationsTargetLesson107.css";
import { LessonTopicStudyBoard } from "../components/LessonTopicStudyBoard";

type OneStepTab107 =
  "Interact" | "Explain" | "Examples" | "Formulas" | "Practice" | "Know more";

export default function OneStepEquationsTargetLesson107({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [equationId, setEquationId] = useState(equations[0].id);
  const [showBalance, setShowBalance] = useState(true);
  const [applyBoth, setApplyBoth] = useState(true);
  const [checkValue, setCheckValue] = useState("7");
  const [checkAttempted, setCheckAttempted] = useState(true);
  const [tab, setTab] = useState<OneStepTab107>("Interact");
  const [dragging, setDragging] = useState("");
  const [operationDrops, setOperationDrops] = useState<string[]>([]);
  const [invalidDrop, setInvalidDrop] = useState("");
  const [guidedOpen, setGuidedOpen] = useState(false);
  const [notesOpen, setNotesOpen] = useState(false);
  const [practiceIndex, setPracticeIndex] = useState(0);
  const [practiceAnswer, setPracticeAnswer] = useState("13");
  const [practiceChecked, setPracticeChecked] = useState(true);
  const [actions, setActions] = useState(0);

  const equation = useMemo(
    () => equations.find((item) => item.id === equationId) ?? equations[0],
    [equationId],
  );
  const practice = practiceEquations[practiceIndex];
  const solution = solveOneStepEquation107(equation);
  const practiceSolution = solveOneStepPractice107(practice);
  const numericCheck = Number(checkValue);
  const checkLeft = Number.isFinite(numericCheck)
    ? evaluateOneStepEquation107(equation, numericCheck)
    : Number.NaN;
  const checkRight = equation.right;
  const checkCorrect = isOneStepAnswerCorrect107(equation, numericCheck);
  const numericPractice = Number(practiceAnswer);
  const practiceEvaluation = Number.isFinite(numericPractice)
    ? evaluateOneStepPractice107(practice, numericPractice)
    : Number.NaN;
  const practiceCorrect =
    Number.isFinite(numericPractice) &&
    Math.abs(practiceEvaluation - practice.right) < 1e-9;
  const bothDropped =
    operationDrops.includes("left") && operationDrops.includes("right");
  const act = () => {
    setActions((count) => count + 1);
    onInteraction();
  };

  const chooseEquation = (id: string) => {
    const next = equations.find((item) => item.id === id) ?? equations[0];
    setEquationId(next.id);
    setCheckValue(String(solveOneStepEquation107(next)));
    setCheckAttempted(true);
    setOperationDrops([]);
    setInvalidDrop("");
    act();
  };
  const choosePractice = (index: number) => {
    setPracticeIndex(index);
    setPracticeAnswer("");
    setPracticeChecked(false);
    act();
  };
  const reset = (notify = true) => {
    setEquationId(equations[0].id);
    setShowBalance(true);
    setApplyBoth(true);
    setCheckValue("7");
    setCheckAttempted(true);
    setTab("Interact");
    setDragging("");
    setOperationDrops([]);
    setInvalidDrop("");
    setGuidedOpen(false);
    setNotesOpen(false);
    setPracticeIndex(0);
    setPracticeAnswer("13");
    setPracticeChecked(true);
    setActions(0);
    if (notify) onInteraction();
  };
  useEffect(() => reset(false), [resetToken]); // eslint-disable-line react-hooks/exhaustive-deps

  const startDrag = (event: DragEvent<HTMLButtonElement>) => {
    event.dataTransfer.setData("text/one-step-operation", equation.id);
    setDragging(equation.id);
    setInvalidDrop("");
    act();
  };
  const dropOperation = (
    event: DragEvent<HTMLElement>,
    side: "left" | "right",
  ) => {
    event.preventDefault();
    const id = event.dataTransfer.getData("text/one-step-operation");
    if (isOneStepOperationDrop107(id, equation.id)) {
      setOperationDrops((current) =>
        current.includes(side) ? current : [...current, side],
      );
      setInvalidDrop("");
    } else {
      setInvalidDrop(id || "unknown");
    }
    setDragging("");
    act();
  };

  return (
    <div
      className="oneStep107-page"
      data-testid="algebra-mockup-0164"
      data-dedicated-lesson="107"
      data-object-model="dedicated-tested-selectable-calculated-one-step-equation-dynamic-balance-validated-draggable-inverse-operation-both-sides-substitution-check-graded-practice-and-functional-tabs-model"
      data-equation={equation.label}
      data-equation-id={equation.id}
      data-inverse={equation.inverse}
      data-solution={solution}
      data-check-value={checkValue}
      data-check-left={Number.isFinite(checkLeft) ? checkLeft : "invalid"}
      data-check-right={checkRight}
      data-check-correct={checkAttempted && checkCorrect}
      data-show-balance={showBalance}
      data-apply-both={applyBoth}
      data-tab={tab}
      data-dragging={dragging}
      data-operation-drops={operationDrops.join(",")}
      data-both-dropped={bothDropped}
      data-invalid-drop={invalidDrop}
      data-guided-open={guidedOpen}
      data-notes-open={notesOpen}
      data-practice-index={practiceIndex}
      data-practice-equation={practice.label}
      data-practice-answer={practiceAnswer}
      data-practice-correct={practiceChecked && practiceCorrect}
      data-actions={actions}
    >
      <nav className="oneStep107-breadcrumb">
        <a href="/">Home</a>
        <span>&gt;</span>
        <a href="/lessons">Lessons</a>
        <span>&gt;</span>
        <a href="/lessons/algebra">Algebra</a>
        <span>&gt;</span>
        <a href="/lessons/algebra">Equations and Inequalities</a>
        <span>&gt;</span>
        <b>One-Step Equations</b>
      </nav>

      <header className="oneStep107-intro">
        <small>
          <b>ALGEBRA</b>
          <b>EQUATIONS AND INEQUALITIES</b>
        </small>
        <h1>One-Step Equations</h1>
        <p>Solve by applying one inverse operation to both sides.</p>
        <nav>
          <b>Intermediate-Advanced Algebra</b>
          <b>Balance model</b>
          <b>6-10 min</b>
          <button
            type="button"
            onClick={() => {
              setGuidedOpen((value) => !value);
              act();
            }}
          >
            <NotebookPen />
            Guided Practice
          </button>
          <button
            type="button"
            onClick={() => {
              setNotesOpen((value) => !value);
              act();
            }}
          >
            <BookOpen />
            Notes
          </button>
        </nav>
        {guidedOpen && (
          <aside className="guided">
            Apply the inverse operation to the left and right pans, then check
            the solution.
          </aside>
        )}
        {notesOpen && (
          <aside className="notes">
            The same operation on both sides preserves equality.
          </aside>
        )}
      </header>

      <nav className="oneStep107-tabs">
        {(
          [
            "Interact",
            "Explain",
            "Examples",
            "Formulas",
            "Practice",
            "Know more",
          ] as OneStepTab107[]
        ).map((name) => (
          <button
            type="button"
            className={tab === name ? "active" : ""}
            key={name}
            onClick={() => {
              setTab(name);
              act();
            }}
          >
            {name}
          </button>
        ))}
      </nav>

      {tab !== "Interact" && <OneStepTabPanel107 tab={tab} />}
      <main
        className={`oneStep107-workspace ${tab !== "Interact" ? "hidden" : ""}`}
      >
        <header>
          <small>BALANCE MODEL</small>
          <h2>Solve using the balance model</h2>
          <p>
            Keep both sides balanced by applying the same inverse operation.
          </p>
          <div>
            <Switch
              label="Show balance"
              icon={<Scale />}
              value={showBalance}
              onToggle={() => {
                setShowBalance((value) => !value);
                act();
              }}
            />
            <Switch
              label="Apply to both sides"
              icon={<Equal />}
              value={applyBoth}
              onToggle={() => {
                setApplyBoth((value) => !value);
                act();
              }}
            />
          </div>
        </header>
        <section className="oneStep107-workspace-body">
          <article className="oneStep107-balance-card">
            <label>
              Initial equation:
              <select
                aria-label="Initial one-step equation"
                value={equation.id}
                onChange={(event) => chooseEquation(event.target.value)}
              >
                {equations.map((item) => (
                  <option value={item.id} key={item.id}>
                    {item.label}
                  </option>
                ))}
              </select>
              <ChevronDown />
            </label>
            {showBalance ? (
              <BalanceModel
                equation={equation}
                applyBoth={applyBoth}
                operationDrops={operationDrops}
                onDrop={dropOperation}
              />
            ) : (
              <div className="oneStep107-balance-hidden">
                Balance model hidden
              </div>
            )}
            <button
              className="oneStep107-operation-token"
              type="button"
              draggable
              aria-label={`Drag inverse operation ${equation.inverse}`}
              onDragStart={startDrag}
              onDragEnd={() => setDragging("")}
            >
              <ArrowRight />
              {equation.inverse} from both sides
            </button>
            <p>Remove the same amount from each side.</p>
            <strong>
              Solution: <i>x = {solution}</i>
              <Check />
            </strong>
            {invalidDrop && (
              <em>Use the inverse operation for the selected equation.</em>
            )}
          </article>

          <article className="oneStep107-steps">
            <small>EQUATION STEPS</small>
            <section>
              <b>Step 1</b>
              <p>Start with the equation.</p>
              <strong>{equation.label}</strong>
            </section>
            <section>
              <b>Step 2</b>
              <p>{equation.inverse} from both sides.</p>
              <strong>
                {applyBoth
                  ? `${equation.label.split("=")[0].trim()} ${equation.inverseSymbol} = ${equation.label.split("=")[1].trim()} ${equation.inverseSymbol}`
                  : "Apply mode paused"}
              </strong>
            </section>
            <section>
              <b>Step 3</b>
              <p>Simplify both sides.</p>
              <strong>x = {solution}</strong>
            </section>
            <aside>
              <Check />
              <h3>Check the solution</h3>
              <p>Substitute x = {solution} into the original equation.</p>
              <strong>
                {evaluateOneStepEquation107(equation, solution)} = {checkRight}
              </strong>
              <b>
                <Check />
                True
              </b>
            </aside>
          </article>
        </section>
      </main>

      <section className="oneStep107-controls">
        <label>
          Choose equation
          <select
            aria-label="Choose equation"
            value={equation.id}
            onChange={(event) => chooseEquation(event.target.value)}
          >
            {equations.map((item) => (
              <option value={item.id} key={item.id}>
                {item.label}
              </option>
            ))}
          </select>
        </label>
        <label>
          Inverse operation
          <select
            aria-label="Inverse operation"
            value={equation.inverse}
            onChange={(event) => {
              const next = equations.find(
                (item) => item.inverse === event.target.value,
              );
              if (next) chooseEquation(next.id);
            }}
          >
            {equations.map((item) => (
              <option value={item.inverse} key={item.id}>
                {item.inverse}
              </option>
            ))}
          </select>
        </label>
        <label>
          Check value for x
          <input
            aria-label="Check value for x"
            type="number"
            value={checkValue}
            onChange={(event) => {
              setCheckValue(event.target.value);
              setCheckAttempted(false);
              act();
            }}
          />
        </label>
        <button
          type="button"
          onClick={() => {
            setCheckAttempted(true);
            act();
          }}
        >
          <Check />
          Check solution
          <ChevronDown />
        </button>
      </section>

      <section className="oneStep107-info">
        <article>
          <small>THE RULE</small>
          <h2>One-Step Equation Rule</h2>
          <strong>x + a = b&nbsp;&nbsp;⇒&nbsp;&nbsp;x = b − a</strong>
          <p>To isolate x, subtract a from both sides.</p>
          <footer>
            <b>Example</b>
            <p>x + 5 = 12&nbsp;&nbsp;⇒&nbsp;&nbsp;x = 12 − 5 = 7</p>
          </footer>
        </article>
        <article>
          <small>WHY IT WORKS</small>
          <h2>Balance Principle</h2>
          <p>
            Whatever you do to one side of an equation, do to the other side to
            keep the balance.
          </p>
          <Scale />
          <footer>Equality stays true.</footer>
        </article>
        <article>
          <small>WARNING</small>
          <h2>Don’t break the balance!</h2>
          <p>Changing only one side changes the value.</p>
          <footer>
            <b>Wrong:</b>
            <p>
              x + 5 = 12
              <br />x = 12 − 5<br />x = 7 <strong>(not equal!)</strong>
            </p>
            <CircleAlert />
          </footer>
        </article>
      </section>

      <section className="oneStep107-practice">
        <small>PRACTICE</small>
        <h2>Try one on your own</h2>
        <p>Solve the equation. Use the balance model if needed.</p>
        <div>
          <label>
            Equation
            <select
              aria-label="Practice equation"
              value={practiceIndex}
              onChange={(event) => choosePractice(Number(event.target.value))}
            >
              {practiceEquations.map((item, index) => (
                <option value={index} key={item.id}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>
          <label>
            Your answer<span>{practice.variable} =</span>
            <input
              aria-label="Practice one-step answer"
              type="number"
              value={practiceAnswer}
              onChange={(event) => {
                setPracticeAnswer(event.target.value);
                setPracticeChecked(false);
                act();
              }}
              onBlur={() => setPracticeChecked(true)}
            />
          </label>
          <article>
            <h3>Check your answer</h3>
            <p>
              Substitute {practice.variable} = {practiceAnswer || "?"}.
            </p>
            <strong>
              {Number.isFinite(practiceEvaluation) ? practiceEvaluation : "?"} ={" "}
              {practice.right}
            </strong>
            {practiceChecked && (
              <b className={practiceCorrect ? "correct" : "wrong"}>
                {practiceCorrect ? (
                  <>
                    <Check />
                    True
                  </>
                ) : (
                  "Try again"
                )}
              </b>
            )}
          </article>
        </div>
        {practiceChecked && (
          <footer className={practiceCorrect ? "correct" : "wrong"}>
            {practiceCorrect ? (
              <>
                <PartyPopper />
                Great job! {practice.variable} = {practiceSolution} is correct.
              </>
            ) : (
              "Apply the inverse operation to both sides."
            )}
          </footer>
        )}
      </section>

      <nav className="oneStep107-navigation">
        <a href="/lessons/algebra/106-identities">
          <ArrowLeft />
          <span>
            Previous<b>Identities</b>
          </span>
        </a>
        <a href="/lessons/algebra/108-multi-step-equations">
          <span>
            Next<b>Multi-Step Equations</b>
          </span>
          <ArrowRight />
        </a>
      </nav>
      <footer className="oneStep107-footer">
        <h3>
          <Sparkles />
          Math Universe
        </h3>
        <p>
          Interactive math labs, visual proofs, NCERT explorations, graphing,
          CAS-style tools, and classroom-ready activities.
        </p>
        <nav>
          <a href="/sitemap">Sitemap</a>
          <a href="/docs">Docs</a>
          <a href="/about">About</a>
        </nav>
        <hr />
        <small>
          © 2026 INDIAN SERVERS PRIVATE LIMITED. NO RIGHT TO REPRODUCE IT.
        </small>
        <p>www.IndianServers.com&nbsp;&nbsp; info@IndianServers.com</p>
      </footer>
      <LessonTopicStudyBoard lessonId={107} view={tab} onInteraction={onInteraction} />

    </div>
  );
}

function OneStepTabPanel107({
  tab,
}: {
  tab: Exclude<OneStepTab107, "Interact">;
}) {
  const content = {
    Explain: {
      title: "Undo the operation on both sides",
      body: "An equation stays balanced when the same operation is applied to each side. Choose the inverse operation that isolates the variable.",
    },
    Examples: {
      title: "Addition, subtraction, multiplication, and division",
      body: "Solve x + 5 = 12 by subtracting 5, 3x = 18 by dividing by 3, and x ÷ 4 = 5 by multiplying by 4.",
    },
    Formulas: {
      title: "Inverse-operation rules",
      body: "x + a = b gives x = b − a; x − a = b gives x = b + a; ax = b gives x = b ÷ a.",
    },
    Practice: {
      title: "Solve, then substitute",
      body: "Use the practice selector below, enter the isolated value, and verify it by substitution in the original equation.",
    },
    "Know more": {
      title: "Equality is the invariant",
      body: "Every valid transformation preserves the set of solutions because both sides receive exactly the same operation.",
    },
  }[tab];
  return (
    <section className="oneStep107-tab-panel" aria-live="polite">
      <small>{tab}</small>
      <h2>{content.title}</h2>
      <p>{content.body}</p>
    </section>
  );
}

function BalanceModel({
  equation,
  applyBoth,
  operationDrops,
  onDrop,
}: {
  equation: Equation;
  applyBoth: boolean;
  operationDrops: string[];
  onDrop: (event: DragEvent<HTMLElement>, side: "left" | "right") => void;
}) {
  return (
    <div
      className="oneStep107-scales"
      aria-label={`Balance model for ${equation.label}`}
    >
      <ScaleRow
        equation={equation}
        resolved={false}
        operationDrops={operationDrops}
        onDrop={onDrop}
      />
      <ArrowRight />
      <ScaleRow
        equation={equation}
        resolved
        applyBoth={applyBoth}
        operationDrops={operationDrops}
        onDrop={onDrop}
      />
    </div>
  );
}

function ScaleRow({
  equation,
  resolved,
  applyBoth = true,
  operationDrops,
  onDrop,
}: {
  equation: Equation;
  resolved: boolean;
  applyBoth?: boolean;
  operationDrops: string[];
  onDrop: (event: DragEvent<HTMLElement>, side: "left" | "right") => void;
}) {
  const effectiveResolved =
    resolved && shouldResolveBalance107(applyBoth, operationDrops);
  const leftVariables = effectiveResolved ? 1 : equation.leftVariables;
  const leftUnits = effectiveResolved ? 0 : equation.leftUnits;
  const rightUnits = effectiveResolved
    ? solveOneStepEquation107(equation)
    : equation.right;
  return (
    <div
      className={`oneStep107-scale ${resolved && !effectiveResolved ? "paused" : ""}`}
    >
      <div className="beam" />
      <div className="stand" />
      <div className="base" />
      <section
        className={`pan left ${operationDrops.includes("left") ? "dropped" : ""}`}
        aria-label="Apply inverse operation to left side"
        onDragOver={(event) => event.preventDefault()}
        onDrop={(event) => onDrop(event, "left")}
      >
        <div>
          {Array.from({ length: leftVariables }, (_, index) => (
            <b className="variable" key={`x-${index}`}>
              {effectiveResolved ? "x" : (equation.variableLabel ?? "x")}
            </b>
          ))}
          {Array.from({ length: Math.min(leftUnits, 12) }, (_, index) => (
            <i className={equation.unitTone ?? ""} key={`l-${index}`} />
          ))}
        </div>
      </section>
      <section
        className={`pan right ${operationDrops.includes("right") ? "dropped" : ""}`}
        aria-label="Apply inverse operation to right side"
        onDragOver={(event) => event.preventDefault()}
        onDrop={(event) => onDrop(event, "right")}
      >
        <div>
          {Array.from({ length: Math.min(rightUnits, 20) }, (_, index) => (
            <i key={`r-${index}`} />
          ))}
        </div>
      </section>
    </div>
  );
}

function Switch({
  label,
  icon,
  value,
  onToggle,
}: {
  label: string;
  icon: ReactNode;
  value: boolean;
  onToggle: () => void;
}) {
  return (
    <button type="button" role="switch" aria-checked={value} onClick={onToggle}>
      {icon}
      <span>{label}</span>
      <i className={value ? "on" : ""}>
        <b />
      </i>
    </button>
  );
}
