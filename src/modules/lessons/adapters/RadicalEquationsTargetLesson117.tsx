import {
  useEffect,
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
  Pencil,
  RefreshCw,
  RotateCcw,
  Sparkles,
  Trophy,
} from "lucide-react";
import type { LessonAdapterProps } from "../types";
import "./RadicalEquationsTargetLesson117.css";

type RadicalProblem = { offset: number; right: number; variable: string };
const problems: RadicalProblem[] = [
  { offset: 1, right: 4, variable: "x" },
  { offset: 4, right: 5, variable: "x" },
  { offset: -3, right: 6, variable: "x" },
  { offset: 2, right: 3, variable: "x" },
];
const practices: RadicalProblem[] = [
  { offset: -2, right: 5, variable: "y" },
  { offset: 3, right: 4, variable: "z" },
  { offset: -5, right: 6, variable: "t" },
];
const inside = ({ variable, offset }: RadicalProblem) =>
  `${variable} ${offset < 0 ? "−" : "+"} ${Math.abs(offset)}`;
const solution = ({ offset, right }: RadicalProblem) => right * right - offset;
const domain = ({ offset }: RadicalProblem) => -offset;

function Radical({ children }: { children: React.ReactNode }) {
  return (
    <span className="rad117-radical">
      <i>√</i>
      <span>{children}</span>
    </span>
  );
}

function DomainLine({
  boundary,
  onMove,
}: {
  boundary: number;
  onMove: (value: number) => void;
}) {
  const ref = useRef<SVGSVGElement>(null);
  const [dragging, setDragging] = useState(false);
  const min = -5;
  const max = 5;
  const px = (value: number) => 20 + ((value - min) / (max - min)) * 200;
  const move = (event: PointerEvent<SVGSVGElement>) => {
    if (!dragging || !ref.current) return;
    const box = ref.current.getBoundingClientRect();
    const local = ((event.clientX - box.left) / box.width) * 240;
    const value = min + ((local - 20) / 200) * (max - min);
    onMove(Math.round(Math.max(min, Math.min(max, value))));
  };
  return (
    <svg
      ref={ref}
      className="rad117-domain-line"
      viewBox="0 0 240 70"
      role="img"
      aria-label={`Domain begins at ${boundary}`}
      onPointerMove={move}
      onPointerUp={() => setDragging(false)}
      onPointerLeave={() => setDragging(false)}
    >
      <line className="axis" x1="10" x2="230" y1="34" y2="34" />
      <line className="allowed" x1={px(boundary)} x2="225" y1="34" y2="34" />
      {[-5, boundary, 0, 5]
        .filter((value, index, all) => all.indexOf(value) === index)
        .map((value) => (
          <g key={value}>
            <line x1={px(value)} x2={px(value)} y1="29" y2="39" />
            <text x={px(value)} y="54">
              {value}
            </text>
          </g>
        ))}
      <circle
        cx={px(boundary)}
        cy="34"
        r="6"
        role="slider"
        tabIndex={0}
        aria-label="Drag radical domain boundary"
        onPointerDown={(event) => {
          event.currentTarget.setPointerCapture(event.pointerId);
          setDragging(true);
        }}
        onKeyDown={(event) => {
          if (event.key === "ArrowLeft") onMove(boundary - 1);
          if (event.key === "ArrowRight") onMove(boundary + 1);
        }}
      />
    </svg>
  );
}

export default function RadicalEquationsTargetLesson117({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [problemIndex, setProblemIndex] = useState(0);
  const [problem, setProblem] = useState<RadicalProblem>(problems[0]);
  const [editing, setEditing] = useState(false);
  const [squared, setSquared] = useState(true);
  const [candidateChecked, setCandidateChecked] = useState(true);
  const [activeTab, setActiveTab] = useState("Interactive Lab");
  const [practiceIndex, setPracticeIndex] = useState(0);
  const [practiceAnswer, setPracticeAnswer] = useState("27");
  const [practiceChecked, setPracticeChecked] = useState(true);
  const [dragging, setDragging] = useState(false);
  const [invalidDrop, setInvalidDrop] = useState(false);
  const [actions, setActions] = useState(0);
  const answer = solution(problem);
  const boundary = domain(problem);
  const practice = practices[practiceIndex];
  const practiceSolution = solution(practice);
  const practiceCorrect =
    practiceChecked && Number(practiceAnswer) === practiceSolution;
  const act = () => {
    setActions((value) => value + 1);
    onInteraction();
  };
  const reset = () => {
    setProblemIndex(0);
    setProblem(problems[0]);
    setEditing(false);
    setSquared(true);
    setCandidateChecked(true);
    setActiveTab("Interactive Lab");
    setPracticeIndex(0);
    setPracticeAnswer("27");
    setPracticeChecked(true);
    setDragging(false);
    setInvalidDrop(false);
    setActions(0);
    onInteraction();
  };
  useEffect(() => reset(), [resetToken]); // eslint-disable-line react-hooks/exhaustive-deps
  const changeProblem = (next: RadicalProblem) => {
    setProblem(next);
    setSquared(false);
    setCandidateChecked(false);
    setInvalidDrop(false);
    act();
  };
  const nextProblem = () => {
    const next = (problemIndex + 1) % problems.length;
    setProblemIndex(next);
    changeProblem(problems[next]);
  };
  const startSquare = (event: DragEvent<HTMLButtonElement>) => {
    event.dataTransfer.setData("text/radical-square", inside(problem));
    setDragging(true);
    setInvalidDrop(false);
    act();
  };
  const dropSquare = (event: DragEvent<HTMLElement>) => {
    event.preventDefault();
    const valid =
      event.dataTransfer.getData("text/radical-square") === inside(problem);
    setSquared(valid);
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
      className="rad117-page"
      data-testid="algebra-mockup-0174"
      data-dedicated-lesson="117"
      data-object-model="editable-radical-equation-domain-boundary-pointer-drag-native-square-both-sides-drag-balance-isolation-generated-linear-solve-original-equation-check-extraneous-rejection-graded-practice-model"
      data-problem={`${problem.offset},${problem.right}`}
      data-domain={boundary}
      data-solution={answer}
      data-squared={squared}
      data-candidate-checked={candidateChecked}
      data-dragging={dragging}
      data-invalid-drop={invalidDrop}
      data-practice-index={practiceIndex}
      data-practice-answer={practiceAnswer}
      data-practice-correct={practiceCorrect}
      data-actions={actions}
    >
      <nav className="rad117-breadcrumb">
        <a href="/">Home</a>
        <span>&gt;</span>
        <a href="/lessons">Lessons</a>
        <span>&gt;</span>
        <a href="/lessons/algebra">Algebra</a>
        <span>&gt;</span>
        <b>Radical Equations</b>
      </nav>
      <header className="rad117-intro">
        <small>
          <b>INTERMEDIATE-ADVANCED ALGEBRA</b>
          <b>RADICAL EQUATIONS</b>
          <b>◷ 6-10 MIN</b>
        </small>
        <h1>Radical Equations</h1>
        <p>
          Isolate the radical, square both sides, solve, then check every
          candidate.
        </p>
        <nav>
          {["Interactive Lab", "Examples", "Key Ideas", "Formula Sheet"].map(
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
      </header>
      <main className="rad117-main">
        <section className="rad117-lab">
          <header>
            <span>
              <h2>Radical Unwrapper Lab</h2>
              <p>
                Use the steps to solve the equation and check the candidate.
              </p>
            </span>
            <nav>
              <button onClick={nextProblem}>▣ New Example</button>
              <button onClick={reset}>
                <RotateCcw />
                Reset
              </button>
            </nav>
          </header>
          <section className="rad117-equation">
            <small>EQUATION</small>
            {editing ? (
              <span>
                <input
                  aria-label="Radical offset"
                  type="number"
                  value={problem.offset}
                  onChange={(event) =>
                    changeProblem({
                      ...problem,
                      offset: Number(event.target.value),
                    })
                  }
                />
                <input
                  aria-label="Radical right side"
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
                <Radical>{inside(problem)}</Radical> = {problem.right}
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
          </section>
          <section className="rad117-step isolate">
            <header>
              <i>1</i>
              <span>
                <h3>Isolate the radical</h3>
                <p>Make sure the radical is by itself on one side.</p>
              </span>
            </header>
            <div>
              <strong>
                <Radical>{inside(problem)}</Radical>
              </strong>
              <b>=</b>
              <strong>{problem.right}</strong>
              <i />
            </div>
            <footer>
              <Check />
              Already isolated.
            </footer>
          </section>
          <section className="rad117-step square">
            <header>
              <i>2</i>
              <span>
                <h3>Square both sides</h3>
                <p>Square each side to remove the radical.</p>
              </span>
            </header>
            <button
              draggable
              aria-label={`Drag square both sides for ${inside(problem)}`}
              onDragStart={startSquare}
              onDragEnd={() => setDragging(false)}
            >
              ( )²
            </button>
            <div
              className={squared ? "square-drop complete" : "square-drop"}
              aria-label="Square both sides drop target"
              onDragOver={(event) => event.preventDefault()}
              onDrop={dropSquare}
            >
              <p>
                <span>
                  (<Radical>{inside(problem)}</Radical>)²
                </span>
                <b>=</b>
                <span>{problem.right}²</span>
              </p>
              <p>
                <strong>
                  {squared ? inside(problem) : "Drop square operation"}
                </strong>
                <b>=</b>
                <strong>{squared ? problem.right * problem.right : "?"}</strong>
              </p>
            </div>
            <footer>
              ◉ Squaring both sides preserves solutions and may add extraneous
              ones.
            </footer>
            {invalidDrop && (
              <em>Use the square operation for the current radical.</em>
            )}
          </section>
          <section className="rad117-step solve">
            <header>
              <i>3</i>
              <span>
                <h3>Solve for {problem.variable}</h3>
                <p>Isolate {problem.variable} to get the candidate.</p>
              </span>
            </header>
            <div>
              <p>
                {inside(problem)} = {problem.right * problem.right}
              </p>
              <p>
                {problem.variable} = {problem.right * problem.right}{" "}
                {problem.offset < 0 ? "+" : "−"} {Math.abs(problem.offset)}
              </p>
              <strong>
                {problem.variable} = {answer}
              </strong>
            </div>
          </section>
          <section className="rad117-step check">
            <header>
              <i>4</i>
              <span>
                <h3>Check the candidate in the original equation</h3>
                <p>
                  Substitute back to verify. Accept only if both sides are
                  equal.
                </p>
              </span>
            </header>
            <article>
              <b>
                Substitute {problem.variable} = {answer}
              </b>
              <p>
                <Radical>
                  {answer} {problem.offset < 0 ? "−" : "+"}{" "}
                  {Math.abs(problem.offset)}
                </Radical>
                <span>=</span>
                {problem.right}
              </p>
              <p>
                <Radical>{problem.right * problem.right}</Radical>
                <span>=</span>
                {problem.right}
              </p>
              <p>
                {problem.right}
                <span>=</span>
                {problem.right}
              </p>
              <strong>
                <Check />
                True
              </strong>
            </article>
            <button
              onClick={() => {
                setCandidateChecked(true);
                act();
              }}
            >
              {candidateChecked
                ? `${problem.variable} = ${answer} is a valid solution.`
                : "Check candidate"}
            </button>
          </section>
        </section>
        <aside className="rad117-rail">
          <article className="ideas">
            <h3>⌘ Key Ideas</h3>
            {[
              "Isolate the radical on one side.",
              "Square both sides to remove the radical.",
              "Solve the resulting equation.",
              "Check every candidate in the original equation.",
              "Remember the domain of the original equation.",
            ].map((idea, index) => (
              <p key={idea}>
                <i>{index + 1}</i>
                {idea}
              </p>
            ))}
          </article>
          <article className="domain">
            <h3>Domain from the original equation</h3>
            <p>
              For <Radical>{inside(problem)}</Radical>, the radicand must be ≥
              0.
            </p>
            <strong>
              {inside(problem)} ≥ 0 ⇒ {problem.variable} ≥ {boundary}
            </strong>
            <DomainLine
              boundary={boundary}
              onMove={(value) => changeProblem({ ...problem, offset: -value })}
            />
            <b>
              Domain: {problem.variable} ≥ {boundary}
            </b>
          </article>
          <article className="warning">
            <h3>
              <CircleAlert />
              Why checking is essential
            </h3>
            <p>
              Squaring can introduce extraneous solutions. Always substitute
              each candidate into the original equation.
            </p>
            <b>Example of an extraneous solution:</b>
            <strong>
              <Radical>x + 1</Radical> = −4 has no solution, but squaring gives
              x = 15.
            </strong>
            <small>Checking prevents false answers.</small>
          </article>
          <article className="result">
            <h3>
              <Trophy />
              Result
            </h3>
            <p>Solution set</p>
            <strong>{`{ ${candidateChecked ? answer : "?"} }`}</strong>
            <span>
              (within domain {problem.variable} ≥ {boundary})
            </span>
          </article>
        </aside>
      </main>
      <section className="rad117-practice">
        <header>
          <Trophy />
          <span>
            <h2>Try It Yourself</h2>
            <p>Solve and check your answer.</p>
          </span>
        </header>
        <div>
          <article>
            <small>PRACTICE</small>
            <strong>
              <Radical>{inside(practice)}</Radical> = {practice.right}
            </strong>
          </article>
          <article>
            <b>Your steps</b>
            <p>
              <Check />
              Isolate radical{" "}
              <span>
                <Radical>{inside(practice)}</Radical> = {practice.right}
              </span>
            </p>
            <p>
              <Check />
              Square both sides{" "}
              <span>
                {inside(practice)} = {practice.right * practice.right}
              </span>
            </p>
            <p>
              <Check />
              Solve{" "}
              <span>
                {practice.variable} = {practiceSolution}
              </span>
            </p>
            <p>
              <Check />
              Check{" "}
              <span>
                <Radical>
                  {practiceSolution} {practice.offset < 0 ? "−" : "+"}{" "}
                  {Math.abs(practice.offset)}
                </Radical>{" "}
                = {practice.right}
              </span>
            </p>
          </article>
          <article>
            <b>Your answer</b>
            <label>
              {practice.variable} ={" "}
              <input
                aria-label="Radical practice answer"
                value={practiceAnswer}
                onChange={(event) => {
                  setPracticeAnswer(event.target.value);
                  setPracticeChecked(false);
                  act();
                }}
              />
            </label>
            <button
              onClick={() => {
                setPracticeChecked(true);
                act();
              }}
            >
              <Check />
              {practiceCorrect
                ? "Correct!"
                : practiceChecked
                  ? "Try again"
                  : "Check answer"}
            </button>
          </article>
        </div>
        <footer>
          <span>
            ★ Tip: After squaring, always check your candidate(s) in the
            original equation.
          </span>
          <button onClick={nextPractice}>
            <RefreshCw />
            New Practice
          </button>
        </footer>
      </section>
      <nav className="rad117-adjacent">
        <a href="/lessons/algebra/116-rational-equations">
          <ArrowLeft />
          <span>
            <small>PREVIOUS</small>Rational Equations
          </span>
        </a>
        <a href="/lessons/algebra/118-exponential-equations">
          <span>
            <small>NEXT</small>Exponential Equations
          </span>
          <ArrowRight />
        </a>
      </nav>
      <footer className="rad117-footer">
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
