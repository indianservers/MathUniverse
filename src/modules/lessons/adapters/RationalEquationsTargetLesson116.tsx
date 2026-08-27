import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type DragEvent,
  type PointerEvent,
} from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CircleAlert,
  Lightbulb,
  Pencil,
  Plus,
  RotateCcw,
  Share2,
  Sparkles,
  Trophy,
} from "lucide-react";
import type { LessonAdapterProps } from "../types";
import "./RationalEquationsTargetLesson116.css";

type RationalProblem = {
  numerator: number;
  restriction: number;
  right: number;
  variable: string;
};
type Exact = { numerator: number; denominator: number; value: number };
const problems: RationalProblem[] = [
  { numerator: 1, restriction: 2, right: 3, variable: "x" },
  { numerator: 2, restriction: 1, right: 4, variable: "x" },
  { numerator: 3, restriction: -2, right: 2, variable: "x" },
  { numerator: 4, restriction: 3, right: 5, variable: "x" },
];
const practices: RationalProblem[] = [
  { numerator: 2, restriction: -1, right: 4, variable: "y" },
  { numerator: 3, restriction: 2, right: 2, variable: "z" },
  { numerator: 5, restriction: -2, right: 3, variable: "t" },
];
const gcd = (a: number, b: number): number =>
  b === 0 ? Math.abs(a) : gcd(b, a % b);
const solve = ({ numerator, restriction, right }: RationalProblem): Exact => {
  const rawNumerator = right * restriction + numerator;
  const divisor = gcd(rawNumerator, right) || 1;
  const denominator = right / divisor;
  const numeratorExact = rawNumerator / divisor;
  return {
    numerator: numeratorExact,
    denominator,
    value: numeratorExact / denominator,
  };
};
const denominatorText = ({ restriction, variable }: RationalProblem) =>
  `${variable} ${restriction < 0 ? "+" : "−"} ${Math.abs(restriction)}`;
const exactText = ({ numerator, denominator }: Exact) =>
  denominator === 1 ? `${numerator}` : `${numerator}/${denominator}`;

function Fraction({
  top,
  bottom,
}: {
  top: React.ReactNode;
  bottom: React.ReactNode;
}) {
  return (
    <span className="rat116-fraction">
      <span>{top}</span>
      <span>{bottom}</span>
    </span>
  );
}

function RestrictionLine({
  restriction,
  onMove,
}: {
  restriction: number;
  onMove: (value: number) => void;
}) {
  const ref = useRef<SVGSVGElement>(null);
  const [dragging, setDragging] = useState(false);
  const min = -4;
  const max = 5;
  const px = (value: number) => 30 + ((value - min) / (max - min)) * 430;
  const move = (event: PointerEvent<SVGSVGElement>) => {
    if (!dragging || !ref.current) return;
    const box = ref.current.getBoundingClientRect();
    const local = ((event.clientX - box.left) / box.width) * 490;
    const value = min + ((local - 30) / 430) * (max - min);
    onMove(Math.round(Math.max(min, Math.min(max, value))));
  };
  return (
    <svg
      ref={ref}
      className="rat116-line"
      viewBox="0 0 490 70"
      role="img"
      aria-label={`Number line with forbidden value ${restriction}`}
      onPointerMove={move}
      onPointerUp={() => setDragging(false)}
      onPointerLeave={() => setDragging(false)}
    >
      <defs>
        <linearGradient id="rat116-allowed" x1="0" x2="1">
          <stop stopColor="#38b978" />
          <stop offset="1" stopColor="#08a3bd" />
        </linearGradient>
      </defs>
      <line className="base" x1="20" x2="470" y1="30" y2="30" />
      {Array.from({ length: 10 }, (_, index) => index - 4).map((value) => (
        <g key={value}>
          <line x1={px(value)} x2={px(value)} y1="25" y2="35" />
          <text x={px(value)} y="50">
            {value}
          </text>
        </g>
      ))}
      <line
        className="forbidden-guide"
        x1={px(restriction)}
        x2={px(restriction)}
        y1="6"
        y2="30"
      />
      <circle
        cx={px(restriction)}
        cy="30"
        r="7"
        role="slider"
        tabIndex={0}
        aria-label="Drag forbidden denominator value"
        onPointerDown={(event) => {
          event.currentTarget.setPointerCapture(event.pointerId);
          setDragging(true);
        }}
        onKeyDown={(event) => {
          if (event.key === "ArrowLeft") onMove(restriction - 1);
          if (event.key === "ArrowRight") onMove(restriction + 1);
        }}
      />
    </svg>
  );
}

export default function RationalEquationsTargetLesson116({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [problemIndex, setProblemIndex] = useState(0);
  const [problem, setProblem] = useState<RationalProblem>(problems[0]);
  const [editing, setEditing] = useState(false);
  const [cleared, setCleared] = useState(true);
  const [candidateChecked, setCandidateChecked] = useState(true);
  const [activeTab, setActiveTab] = useState("Interaction");
  const [autoCheck, setAutoCheck] = useState(true);
  const [showSteps, setShowSteps] = useState(true);
  const [hint, setHint] = useState(false);
  const [shared, setShared] = useState(false);
  const [practiceIndex, setPracticeIndex] = useState(0);
  const [practiceAnswer, setPracticeAnswer] = useState("-1/2");
  const [practiceChecked, setPracticeChecked] = useState(true);
  const [dragging, setDragging] = useState(false);
  const [invalidDrop, setInvalidDrop] = useState(false);
  const [actions, setActions] = useState(0);
  const answer = useMemo(() => solve(problem), [problem]);
  const practice = practices[practiceIndex];
  const practiceSolution = solve(practice);
  const parseAnswer = (value: string) => {
    const [a, b] = value.split("/").map(Number);
    return value.includes("/") ? a / b : Number(value);
  };
  const practiceCorrect =
    practiceChecked &&
    Math.abs(parseAnswer(practiceAnswer) - practiceSolution.value) < 0.00001;
  const act = () => {
    setActions((value) => value + 1);
    onInteraction();
  };
  const reset = () => {
    setProblemIndex(0);
    setProblem(problems[0]);
    setEditing(false);
    setCleared(true);
    setCandidateChecked(true);
    setActiveTab("Interaction");
    setAutoCheck(true);
    setShowSteps(true);
    setHint(false);
    setShared(false);
    setPracticeIndex(0);
    setPracticeAnswer("-1/2");
    setPracticeChecked(true);
    setDragging(false);
    setInvalidDrop(false);
    setActions(0);
    onInteraction();
  };
  useEffect(() => reset(), [resetToken]); // eslint-disable-line react-hooks/exhaustive-deps
  const changeProblem = (next: RationalProblem) => {
    setProblem(next);
    setCleared(false);
    setCandidateChecked(false);
    setInvalidDrop(false);
    act();
  };
  const nextProblem = () => {
    const next = (problemIndex + 1) % problems.length;
    setProblemIndex(next);
    changeProblem(problems[next]);
  };
  const startMultiplier = (event: DragEvent<HTMLButtonElement>) => {
    event.dataTransfer.setData(
      "text/rational-multiplier",
      denominatorText(problem),
    );
    setDragging(true);
    setInvalidDrop(false);
    act();
  };
  const dropMultiplier = (event: DragEvent<HTMLElement>) => {
    event.preventDefault();
    const valid =
      event.dataTransfer.getData("text/rational-multiplier") ===
      denominatorText(problem);
    setCleared(valid);
    setCandidateChecked(false);
    setDragging(false);
    setInvalidDrop(!valid);
    act();
  };
  const nextPractice = () => {
    const next = (practiceIndex + 1) % practices.length;
    setPracticeIndex(next);
    setPracticeAnswer("");
    setPracticeChecked(false);
    act();
  };

  return (
    <div
      className="rat116-page"
      data-testid="algebra-mockup-0173"
      data-dedicated-lesson="116"
      data-object-model="editable-rational-equation-denominator-restriction-pointer-draggable-forbidden-value-native-lcd-drag-clearing-exact-fraction-linear-solve-original-substitution-extraneous-rejection-graded-practice-model"
      data-problem={`${problem.numerator},${problem.restriction},${problem.right}`}
      data-answer={exactText(answer)}
      data-cleared={cleared}
      data-candidate-checked={candidateChecked}
      data-dragging={dragging}
      data-invalid-drop={invalidDrop}
      data-practice-index={practiceIndex}
      data-practice-answer={practiceAnswer}
      data-practice-correct={practiceCorrect}
      data-actions={actions}
    >
      <nav className="rat116-breadcrumb">
        <a href="/">Home</a>
        <span>&gt;</span>
        <a href="/lessons">Lessons</a>
        <span>&gt;</span>
        <a href="/lessons/algebra">Algebra</a>
        <span>&gt;</span>
        <b>116 Rational Equations</b>
      </nav>
      <header className="rat116-intro">
        <small>
          <b>ALGEBRA</b>
          <b>EQUATIONS AND INEQUALITIES</b>
        </small>
        <h1>Rational Equations</h1>
        <p>Restriction-first solver: clear denominators, solve, then check.</p>
        <nav>
          <b>◉ Intermediate-Advanced Algebra</b>
          <b>◷ 6-10 min</b>
          <b>⌘ Restriction Solver</b>
          <b>ϟ Guided Practice</b>
        </nav>
      </header>
      <section className="rat116-toolbar">
        <nav>
          {["Interaction", "Explain", "Examples", "Formulas", "Know more"].map(
            (tab) => (
              <button
                key={tab}
                className={activeTab === tab ? "active" : ""}
                onClick={() => {
                  setActiveTab(tab);
                  if (tab === "Examples") nextProblem();
                  else act();
                }}
              >
                {tab}
              </button>
            ),
          )}
        </nav>
        <footer>
          <button onClick={nextProblem}>▣ New Problem</button>
          <button
            onClick={() => {
              setHint((value) => !value);
              act();
            }}
          >
            <Lightbulb />
            Hint
          </button>
          <button onClick={reset}>
            <RotateCcw />
            Reset
          </button>
          <button
            onClick={() => {
              setShared(true);
              act();
            }}
          >
            <Share2 />
            {shared ? "Link ready" : "Share"}
          </button>
          <span />
          <Toggle
            label="Auto-check"
            checked={autoCheck}
            onChange={() => {
              setAutoCheck((value) => !value);
              act();
            }}
          />
          <Toggle
            label="Show steps"
            checked={showSteps}
            onChange={() => {
              setShowSteps((value) => !value);
              act();
            }}
          />
        </footer>
      </section>
      <main className="rat116-workspace">
        <section className="rat116-step restriction">
          <header>
            <i>1</i>
            <span>
              <h2>State denominator restrictions</h2>
              <p>Find values that make any denominator zero.</p>
            </span>
          </header>
          <div className="restriction-top">
            <article>
              <b>Equation</b>
              {editing ? (
                <span className="edit-fields">
                  <input
                    aria-label="Rational numerator"
                    type="number"
                    value={problem.numerator}
                    onChange={(event) =>
                      changeProblem({
                        ...problem,
                        numerator: Number(event.target.value),
                      })
                    }
                  />
                  <input
                    aria-label="Rational restriction"
                    type="number"
                    value={problem.restriction}
                    onChange={(event) =>
                      changeProblem({
                        ...problem,
                        restriction: Number(event.target.value),
                      })
                    }
                  />
                  <input
                    aria-label="Rational right side"
                    type="number"
                    value={problem.right}
                    onChange={(event) =>
                      changeProblem({
                        ...problem,
                        right: Number(event.target.value),
                      })
                    }
                  />
                </span>
              ) : (
                <strong>
                  <Fraction
                    top={problem.numerator}
                    bottom={denominatorText(problem)}
                  />{" "}
                  = {problem.right}
                </strong>
              )}
              <button
                onClick={() => {
                  setEditing((value) => !value);
                  act();
                }}
              >
                <Pencil />
              </button>
            </article>
            <article>
              <b>Restriction</b>
              <strong>{denominatorText(problem)} ≠ 0</strong>
              <span>
                {problem.variable} ≠ {problem.restriction}
              </span>
              <Check />
            </article>
          </div>
          <article className="danger-line">
            <b>Danger zone on number line</b>
            <p>
              {problem.variable} = {problem.restriction} is forbidden.
            </p>
            <RestrictionLine
              restriction={problem.restriction}
              onMove={(value) =>
                changeProblem({ ...problem, restriction: value })
              }
            />
            <footer>
              <span>
                <i />
                Allowed values
              </span>
              <span>
                <i />
                Forbidden value
              </span>
            </footer>
          </article>
        </section>
        <aside className="rat116-note restriction-note">
          <h3>Restriction tip</h3>
          <p>Any value that makes a denominator zero is not allowed.</p>
          <strong>
            <CircleAlert />
            Do not accept forbidden values.
          </strong>
          {hint && <small>Set {denominatorText(problem)} = 0 first.</small>}
        </aside>
        <section className="rat116-step clearing">
          <header>
            <i>2</i>
            <span>
              <h2>Clear denominators</h2>
              <p>Multiply both sides by the least common denominator.</p>
            </span>
          </header>
          <div>
            <article>
              <b>Multiplier</b>
              <button
                draggable
                aria-label={`Drag multiplier ${denominatorText(problem)}`}
                onDragStart={startMultiplier}
                onDragEnd={() => setDragging(false)}
              >
                {denominatorText(problem)}
              </button>
            </article>
            <article
              className={cleared ? "drop complete" : "drop"}
              aria-label="Apply rational multiplier to both sides"
              onDragOver={(event) => event.preventDefault()}
              onDrop={dropMultiplier}
            >
              <b>Apply to both sides</b>
              <strong>
                ({denominatorText(problem)}) ·{" "}
                <Fraction
                  top={problem.numerator}
                  bottom={denominatorText(problem)}
                />{" "}
                = {problem.right}({denominatorText(problem)})
              </strong>
              {!cleared && <span>Drop multiplier here</span>}
            </article>
            <article>
              <b>Cancel denominator</b>
              <strong>
                {cleared
                  ? `${problem.numerator} = ${problem.right}(${denominatorText(problem)})`
                  : "Pending"}
              </strong>
            </article>
          </div>
          {invalidDrop && <em>Use the current least common denominator.</em>}
        </section>
        <aside className="rat116-note">
          <h3>Why this works</h3>
          <p>
            Multiplying by ({denominatorText(problem)}) removes the denominator
            on the left. Since {problem.variable} ≠ {problem.restriction}, we
            are not multiplying by zero.
          </p>
        </aside>
        <section className="rat116-step solving">
          <header>
            <i>3</i>
            <span>
              <h2>Solve the linear equation</h2>
              <p>Expand and solve for {problem.variable}.</p>
            </span>
          </header>
          <div>
            {showSteps ? (
              <>
                <article>
                  <b>Expand</b>
                  <strong>
                    {problem.numerator} = {problem.right}(
                    {denominatorText(problem)})
                  </strong>
                  <strong>
                    {problem.numerator} = {problem.right}
                    {problem.variable}{" "}
                    {problem.right * -problem.restriction < 0 ? "−" : "+"}{" "}
                    {Math.abs(problem.right * problem.restriction)}
                  </strong>
                </article>
                <article>
                  <b>Isolate {problem.variable}</b>
                  <strong>
                    {problem.right}
                    {problem.variable} ={" "}
                    {problem.right * problem.restriction + problem.numerator}
                  </strong>
                  <strong>
                    {problem.variable} ={" "}
                    <Fraction
                      top={answer.numerator}
                      bottom={answer.denominator}
                    />
                  </strong>
                </article>
              </>
            ) : (
              <article className="steps-hidden">
                <b>Steps hidden</b>
                <button
                  onClick={() => {
                    setShowSteps(true);
                    act();
                  }}
                >
                  Show derivation
                </button>
              </article>
            )}
            <article>
              <b>Candidate</b>
              <strong>
                {problem.variable} ={" "}
                <Fraction top={answer.numerator} bottom={answer.denominator} />
              </strong>
            </article>
          </div>
        </section>
        <aside className="rat116-note">
          <h3>Remember</h3>
          <p>
            Solve the resulting linear equation carefully. Keep the candidate to
            check against the restriction.
          </p>
        </aside>
        <section className="rat116-step checking">
          <header>
            <i>4</i>
            <span>
              <h2>Check the candidate</h2>
              <p>
                Substitute back into the original equation and verify
                restriction.
              </p>
            </span>
          </header>
          <div>
            <article>
              <b>Restriction check</b>
              <strong>
                {problem.variable} = {exactText(answer)} ≠ {problem.restriction}
              </strong>
              <span>● Restriction satisfied</span>
            </article>
            <article>
              <b>Substitution check</b>
              <strong>
                <Fraction
                  top={problem.numerator}
                  bottom={`${exactText(answer)} − ${problem.restriction}`}
                />{" "}
                = {problem.right}
              </strong>
              <p>
                <Fraction
                  top={problem.numerator}
                  bottom={
                    <Fraction top={problem.numerator} bottom={problem.right} />
                  }
                />{" "}
                = {problem.right}
              </p>
              <p>
                {problem.right} = {problem.right} <Check />
              </p>
            </article>
            <article className="accepted">
              <b>Result</b>
              <p>Solution</p>
              <strong>
                {problem.variable} ={" "}
                <Fraction top={answer.numerator} bottom={answer.denominator} />
              </strong>
              <button
                onClick={() => {
                  setCandidateChecked(true);
                  act();
                }}
              >
                <Check />
                {candidateChecked ? "Accepted" : "Check candidate"}
              </button>
            </article>
          </div>
        </section>
        <aside className="rat116-note">
          <h3>Final check</h3>
          <p>A solution must satisfy both:</p>
          <ul>
            <li>The original equation</li>
            <li>The restriction</li>
          </ul>
          <p>
            {problem.variable} = {problem.restriction} is forbidden and cannot
            be accepted.
          </p>
        </aside>
        <footer className="rat116-answer">
          <Trophy />
          <span>
            <b>
              Final Answer: {problem.variable} ={" "}
              <Fraction top={answer.numerator} bottom={answer.denominator} />
            </b>
            <p>
              This value satisfies the equation and does not violate the
              restriction {problem.variable} ≠ {problem.restriction}.
            </p>
          </span>
        </footer>
      </main>
      <section className="rat116-practice">
        <header>
          <span>
            <i>★</i>
            <h2>Practice</h2>
            <p>Solve and check. Show your steps.</p>
          </span>
          <nav>
            <button onClick={nextPractice}>
              <Plus />
              New Practice
            </button>
            <button
              onClick={() => {
                setPracticeChecked(true);
                act();
              }}
            >
              <Check />
              Check All
            </button>
          </nav>
        </header>
        <div>
          <article>
            <i>1</i>
            <strong>
              <Fraction
                top={practice.numerator}
                bottom={denominatorText(practice)}
              />{" "}
              = {practice.right}
            </strong>
          </article>
          <article>
            <b>Restriction</b>
            <strong>{denominatorText(practice)} ≠ 0</strong>
            <span>
              {practice.variable} ≠ {practice.restriction}
            </span>
            <Check />
          </article>
          <article>
            <b>Your answer</b>
            <label>
              {practice.variable} ={" "}
              <input
                aria-label="Rational practice answer"
                value={practiceAnswer}
                onChange={(event) => {
                  setPracticeAnswer(event.target.value);
                  setPracticeChecked(false);
                  act();
                }}
              />
            </label>
            {practiceCorrect && <Check />}
          </article>
          <article>
            <b>Check</b>
            <strong>
              <Fraction
                top={practice.numerator}
                bottom={`${exactText(practiceSolution)} ${practice.restriction < 0 ? "+" : "−"} ${Math.abs(practice.restriction)}`}
              />{" "}
              = {practice.right}
            </strong>
            <p>
              {practice.right} = {practice.right} <Check />
            </p>
          </article>
          <article className={practiceCorrect ? "correct" : "pending"}>
            <h3>
              {practiceCorrect
                ? "Correct!"
                : practiceChecked
                  ? "Try again"
                  : "Ready"}
            </h3>
            <p>
              <Check />
              {practiceCorrect
                ? "Restriction satisfied"
                : "Check the exact fraction"}
            </p>
          </article>
        </div>
      </section>
      <nav className="rat116-adjacent">
        <a href="/lessons/algebra/115-polynomial-equations">
          <ArrowLeft />
          <span>
            <small>PREVIOUS</small>Polynomial Equations
          </span>
        </a>
        <a href="/lessons/algebra/117-radical-equations">
          <span>
            <small>NEXT</small>Systems of Rational Equations
          </span>
          <ArrowRight />
        </a>
      </nav>
      <footer className="rat116-footer">
        <b>
          <Sparkles />
          Math Universe
        </b>
        <span>
          Interactive math labs, visual proofs, NCERT explorations, graphing,
          CAS-style tools, and classroom-ready activities.
        </span>
        <nav>
          <button>Sitemap</button>
          <button>Docs</button>
          <button>About</button>
        </nav>
        <hr />
        <small>
          © 2026 INDIAN SERVERS PRIVATE LIMITED. NO RIGHT TO REPRODUCE IT.
        </small>
        <small>www.IndianServers.com info@IndianServers.com</small>
      </footer>
    </div>
  );
}

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label className="rat116-toggle">
      <span>{label}</span>
      <input type="checkbox" checked={checked} onChange={onChange} />
      <i />
    </label>
  );
}
