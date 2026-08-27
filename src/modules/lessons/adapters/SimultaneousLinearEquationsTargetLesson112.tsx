import { useEffect, useMemo, useState, type DragEvent } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CircleAlert,
  CircleHelp,
  Clock3,
  Grid3X3,
  Lightbulb,
  RotateCcw,
  Sparkles,
  Star,
} from "lucide-react";
import type { LessonAdapterProps } from "../types";
import "./SimultaneousLinearEquationsTargetLesson112.css";

type Equation = { a: number; b: number; c: number };
type SystemProblem = {
  id: string;
  first: Equation;
  second: Equation;
  multipliers: [number, number];
};

const systems: SystemProblem[] = [
  {
    id: "sum-difference-seven-one",
    first: { a: 1, b: 1, c: 7 },
    second: { a: 1, b: -1, c: 1 },
    multipliers: [1, 1],
  },
  {
    id: "two-x-plus-y",
    first: { a: 2, b: 1, c: 9 },
    second: { a: 1, b: -1, c: 3 },
    multipliers: [1, 1],
  },
  {
    id: "subtract-parallel-y",
    first: { a: 3, b: 1, c: 11 },
    second: { a: 1, b: 1, c: 7 },
    multipliers: [1, -1],
  },
  {
    id: "double-second",
    first: { a: 1, b: 2, c: 8 },
    second: { a: 1, b: -1, c: 2 },
    multipliers: [1, 2],
  },
];

const practiceSystems: SystemProblem[] = [
  {
    id: "practice-five-one",
    first: { a: 1, b: 1, c: 5 },
    second: { a: 1, b: -1, c: 1 },
    multipliers: [1, 1],
  },
  {
    id: "practice-eight-two",
    first: { a: 1, b: 1, c: 8 },
    second: { a: 1, b: -1, c: 2 },
    multipliers: [1, 1],
  },
];

const round = (value: number) => Math.round(value * 100) / 100;
const coefficient = (value: number, variable: string, first = false) => {
  if (value === 0) return "";
  const magnitude = Math.abs(value) === 1 ? "" : Math.abs(value);
  if (first) return `${value < 0 ? "−" : ""}${magnitude}${variable}`;
  return `${value < 0 ? " − " : " + "}${magnitude}${variable}`;
};
const equationText = (equation: Equation) =>
  `${coefficient(equation.a, "x", true)}${coefficient(equation.b, "y", equation.a === 0)} = ${equation.c}`;
const solve = (problem: SystemProblem) => {
  const determinant =
    problem.first.a * problem.second.b - problem.second.a * problem.first.b;
  return {
    determinant,
    x: round(
      (problem.first.c * problem.second.b -
        problem.second.c * problem.first.b) /
        determinant,
    ),
    y: round(
      (problem.first.a * problem.second.c -
        problem.second.a * problem.first.c) /
        determinant,
    ),
  };
};
const scaled = (equation: Equation, multiplier: number): Equation => ({
  a: equation.a * multiplier,
  b: equation.b * multiplier,
  c: equation.c * multiplier,
});
const operationLabel = (problem: SystemProblem) => {
  const [, second] = problem.multipliers;
  if (second === 1) return "Add equations";
  if (second === -1) return "Subtract equation 2";
  return `Add ${second} × equation 2`;
};

export default function SimultaneousLinearEquationsTargetLesson112({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [systemId, setSystemId] = useState(systems[0].id);
  const [method, setMethod] = useState<"Elimination" | "Substitution">(
    "Elimination",
  );
  const [combined, setCombined] = useState(true);
  const [dragging, setDragging] = useState(false);
  const [invalidDrop, setInvalidDrop] = useState(false);
  const [showIntersection, setShowIntersection] = useState(true);
  const [checkBoth, setCheckBoth] = useState(true);
  const [showGrid, setShowGrid] = useState(true);
  const [stepView, setStepView] = useState("All steps");
  const [theme, setTheme] = useState("violet");
  const [activeTab, setActiveTab] = useState("Interaction + visualization");
  const [favorite, setFavorite] = useState(false);
  const [practiceIndex, setPracticeIndex] = useState(0);
  const [practiceX, setPracticeX] = useState("3");
  const [practiceY, setPracticeY] = useState("2");
  const [practiceChecked, setPracticeChecked] = useState(true);
  const [showPracticeSolution, setShowPracticeSolution] = useState(false);
  const [actions, setActions] = useState(0);

  const problem = useMemo(
    () => systems.find((item) => item.id === systemId) ?? systems[0],
    [systemId],
  );
  const solution = solve(problem);
  const firstScaled = scaled(problem.first, problem.multipliers[0]);
  const secondScaled = scaled(problem.second, problem.multipliers[1]);
  const combinedEquation: Equation = {
    a: firstScaled.a + secondScaled.a,
    b: firstScaled.b + secondScaled.b,
    c: firstScaled.c + secondScaled.c,
  };
  const practice = practiceSystems[practiceIndex];
  const practiceSolution = solve(practice);
  const practiceCorrect =
    Number(practiceX) === practiceSolution.x &&
    Number(practiceY) === practiceSolution.y;
  const act = () => {
    setActions((value) => value + 1);
    onInteraction();
  };
  const reset = () => {
    setSystemId(systems[0].id);
    setMethod("Elimination");
    setCombined(true);
    setDragging(false);
    setInvalidDrop(false);
    setShowIntersection(true);
    setCheckBoth(true);
    setShowGrid(true);
    setStepView("All steps");
    setTheme("violet");
    setActiveTab("Interaction + visualization");
    setFavorite(false);
    setPracticeIndex(0);
    setPracticeX("3");
    setPracticeY("2");
    setPracticeChecked(true);
    setShowPracticeSolution(false);
    setActions(0);
    onInteraction();
  };
  useEffect(() => reset(), [resetToken]); // eslint-disable-line react-hooks/exhaustive-deps

  const chooseSystem = (id: string) => {
    setSystemId(id);
    setCombined(false);
    setInvalidDrop(false);
    setCheckBoth(false);
    act();
  };
  const startDrag = (event: DragEvent<HTMLButtonElement>) => {
    event.dataTransfer.setData("text/simultaneous-operation", problem.id);
    setDragging(true);
    setInvalidDrop(false);
    act();
  };
  const dropCombination = (event: DragEvent<HTMLElement>) => {
    event.preventDefault();
    const valid =
      event.dataTransfer.getData("text/simultaneous-operation") === problem.id;
    setCombined(valid);
    setInvalidDrop(!valid);
    setDragging(false);
    act();
  };
  const nextPractice = () => {
    const next = (practiceIndex + 1) % practiceSystems.length;
    setPracticeIndex(next);
    setPracticeX("");
    setPracticeY("");
    setPracticeChecked(false);
    setShowPracticeSolution(false);
    act();
  };
  const activeOperationLabel =
    method === "Elimination"
      ? operationLabel(problem)
      : "Substitute isolated y";

  return (
    <div
      className="sim112-page"
      data-testid="algebra-mockup-0169"
      data-dedicated-lesson="112"
      data-object-model="selectable-two-equation-coefficient-system-determinant-solver-native-elimination-drag-generated-symbolic-steps-dynamic-dual-line-intersection-both-equation-verification-ordered-pair-practice-model"
      data-system-id={problem.id}
      data-equation-one={equationText(problem.first)}
      data-equation-two={equationText(problem.second)}
      data-determinant={solution.determinant}
      data-solution-x={solution.x}
      data-solution-y={solution.y}
      data-combined-a={combinedEquation.a}
      data-combined-b={combinedEquation.b}
      data-combined-c={combinedEquation.c}
      data-method={method}
      data-combined={combined}
      data-dragging={dragging}
      data-invalid-drop={invalidDrop}
      data-show-intersection={showIntersection}
      data-check-both={checkBoth}
      data-grid={showGrid}
      data-step-view={stepView}
      data-theme={theme}
      data-active-tab={activeTab}
      data-favorite={favorite}
      data-practice-index={practiceIndex}
      data-practice-x={practiceX}
      data-practice-y={practiceY}
      data-practice-solution-x={practiceSolution.x}
      data-practice-solution-y={practiceSolution.y}
      data-practice-correct={practiceChecked && practiceCorrect}
      data-practice-solution-visible={showPracticeSolution}
      data-actions={actions}
    >
      <nav className="sim112-breadcrumb">
        <a href="/">Home</a>
        <span>&gt;</span>
        <a href="/lessons">Lessons</a>
        <span>&gt;</span>
        <a href="/lessons/algebra">Algebra</a>
        <span>&gt;</span>
        <b>112 Simultaneous Linear Equations</b>
      </nav>

      <header className="sim112-intro">
        <section>
          <small>
            <b>ALGEBRA</b>
            <b>EQUATIONS AND INEQUALITIES</b>
          </small>
          <h1>Simultaneous Linear Equations</h1>
          <p>
            Solve two linear equations together. The solution is the ordered
            pair that satisfies both equations.
          </p>
          <nav>
            <b>
              <CircleHelp />
              Intermediate-Advanced Algebra
            </b>
            <b>
              <Grid3X3 />
              Elimination + Graph
            </b>
            <b>
              <Clock3 />
              6-10 min
            </b>
            <button
              type="button"
              onClick={() => {
                setFavorite((value) => !value);
                act();
              }}
            >
              <Star fill={favorite ? "currentColor" : "none"} />
              {favorite ? "Added" : "Add to favorites"}
            </button>
          </nav>
          <div className="sim112-methods">
            <b>Method</b>
            {(["Elimination", "Substitution"] as const).map((item) => (
              <button
                type="button"
                className={method === item ? "active" : ""}
                key={item}
                onClick={() => {
                  setMethod(item);
                  act();
                }}
              >
                {item}
              </button>
            ))}
            <i />
            <b>Equations</b>
            <select
              aria-label="Simultaneous equation system"
              value={problem.id}
              onChange={(event) => chooseSystem(event.target.value)}
            >
              {systems.map((item) => (
                <option value={item.id} key={item.id}>
                  {equationText(item.first)}
                </option>
              ))}
            </select>
            <select
              aria-label="Companion equation system"
              value={problem.id}
              onChange={(event) => chooseSystem(event.target.value)}
            >
              {systems.map((item) => (
                <option value={item.id} key={item.id}>
                  {equationText(item.second)}
                </option>
              ))}
            </select>
            <button type="button" onClick={reset}>
              <RotateCcw />
              Reset
            </button>
          </div>
        </section>
        <aside>
          <b>Solution (ordered pair)</b>
          <strong>
            ({solution.x}, {solution.y})
          </strong>
          <p>
            x = {solution.x}, y = {solution.y}
          </p>
          <span>
            <Check />
            Satisfies both equations
          </span>
        </aside>
      </header>

      <nav className="sim112-tabs">
        {[
          "Interaction + visualization",
          "Explain",
          "Examples",
          "Formulas",
          "Know more",
        ].map((tab) => (
          <button
            type="button"
            className={activeTab === tab ? "active" : ""}
            key={tab}
            onClick={() => {
              setActiveTab(tab);
              if (tab === "Examples")
                chooseSystem(
                  systems[(systems.indexOf(problem) + 1) % systems.length].id,
                );
              if (tab === "Explain") setStepView("All steps");
              act();
            }}
          >
            {tab}
          </button>
        ))}
      </nav>

      <section className="sim112-callouts">
        <article>
          <Lightbulb />
          <b>Key idea:</b>
          <p>
            A solution is the point (x, y) that makes both equations true at the
            same time.
          </p>
        </article>
        <article>
          <CircleAlert />
          <span>
            <b>Important</b>
            <p>Checking only one equation is not enough.</p>
          </span>
        </article>
      </section>

      <main className="sim112-workspace">
        <section className="sim112-elimination">
          <header>
            <b>1</b>
            <h2>
              {method}{" "}
              {method === "Elimination"
                ? "(Add equations)"
                : "(Isolate and replace)"}
            </h2>
            <span>Active</span>
          </header>
          <p>
            {method === "Elimination"
              ? "Combine the equations to eliminate y."
              : "Isolate y in the first equation, then substitute."}
          </p>
          <div className="sim112-operation">
            <button
              type="button"
              draggable
              aria-label={`Drag elimination operation ${activeOperationLabel}`}
              onDragStart={startDrag}
              onDragEnd={() => setDragging(false)}
            >
              {activeOperationLabel}
            </button>
            <label>
              Add equations
              <input
                aria-label="Apply elimination"
                type="checkbox"
                checked={combined}
                onChange={(event) => {
                  setCombined(event.target.checked);
                  act();
                }}
              />
              <span />
            </label>
          </div>
          <section
            className={`sim112-steps ${combined ? "complete" : ""}`}
            aria-label="Elimination combination drop target"
            onDragOver={(event) => event.preventDefault()}
            onDrop={dropCombination}
          >
            {method === "Elimination" ? (
              <EliminationSteps
                problem={problem}
                firstScaled={firstScaled}
                secondScaled={secondScaled}
                combined={combined}
                solution={solution}
                stepView={stepView}
              />
            ) : (
              <SubstitutionSteps
                problem={problem}
                solution={solution}
                combined={combined}
                stepView={stepView}
              />
            )}
          </section>
          {invalidDrop && (
            <em>Drop the current system's operation into the derivation.</em>
          )}
          <section className="sim112-find-y">
            <b>Substitute to find y</b>
            <p>
              Substitute x = {solution.x} into {equationText(problem.first)}.
            </p>
            <strong>
              {problem.first.a * solution.x} {coefficient(problem.first.b, "y")}{" "}
              = {problem.first.c}
            </strong>
            <strong>
              {coefficient(problem.first.b, "y", true)} = {problem.first.c} −{" "}
              {problem.first.a * solution.x}
            </strong>
            <strong>
              y = <i>{solution.y}</i>
            </strong>
          </section>
          <section className="sim112-checks">
            <header>
              <b>Check both equations</b>
              <label>
                <input
                  aria-label="Check both equations"
                  type="checkbox"
                  checked={checkBoth}
                  onChange={(event) => {
                    setCheckBoth(event.target.checked);
                    act();
                  }}
                />
                <span />
              </label>
            </header>
            <p>
              {equationText(problem.first)}{" "}
              <b>
                {problem.first.a * solution.x}{" "}
                {coefficient(problem.first.b * solution.y, "", false)} ={" "}
                {problem.first.c}
              </b>
              {checkBoth && (
                <span>
                  <Check />
                  True
                </span>
              )}
            </p>
            <p>
              {equationText(problem.second)}{" "}
              <b>
                {problem.second.a * solution.x}{" "}
                {coefficient(problem.second.b * solution.y, "", false)} ={" "}
                {problem.second.c}
              </b>
              {checkBoth && (
                <span>
                  <Check />
                  True
                </span>
              )}
            </p>
          </section>
          <footer>
            Solution:{" "}
            <b>
              ({solution.x}, {solution.y})
            </b>
          </footer>
        </section>

        <section className="sim112-graph">
          <header>
            <b>2</b>
            <h2>Graph (Intersection of lines)</h2>
            <label>
              Show intersection
              <input
                aria-label="Show system intersection"
                type="checkbox"
                checked={showIntersection}
                onChange={(event) => {
                  setShowIntersection(event.target.checked);
                  act();
                }}
              />
              <span />
            </label>
          </header>
          <SystemGraph
            problem={problem}
            solution={solution}
            showIntersection={showIntersection}
            showGrid={showGrid}
            theme={theme}
          />
          <footer>
            <b>About the graph</b>
            <p>
              Each equation is a straight line. The solution is the intersection
              point satisfying both lines.
            </p>
          </footer>
        </section>
      </main>

      <section className="sim112-view-controls">
        <label>
          Show steps
          <select
            aria-label="Simultaneous equation steps"
            value={stepView}
            onChange={(event) => {
              setStepView(event.target.value);
              act();
            }}
          >
            <option>All steps</option>
            <option>Key steps</option>
            <option>Result only</option>
          </select>
        </label>
        <div>
          Theme
          {["blue", "purple", "violet", "green", "orange"].map((color) => (
            <button
              type="button"
              aria-label={`Use ${color} graph theme`}
              className={`${color} ${theme === color ? "active" : ""}`}
              key={color}
              onClick={() => {
                setTheme(color);
                act();
              }}
            />
          ))}
        </div>
        <label>
          Grid
          <input
            aria-label="Show simultaneous graph grid"
            type="checkbox"
            checked={showGrid}
            onChange={(event) => {
              setShowGrid(event.target.checked);
              act();
            }}
          />
          <span />
        </label>
        <button type="button" onClick={reset}>
          <RotateCcw />
          Reset all
        </button>
      </section>

      <section className="sim112-practice">
        <header>
          <h2>Practice</h2>
          <p>Solve the system of equations.</p>
        </header>
        <div>
          <article>
            <strong>{equationText(practice.first)}</strong>
            <strong>{equationText(practice.second)}</strong>
          </article>
          <article>
            <label>
              Your answer (ordered pair)
              <span>
                <input
                  aria-label="Practice x value"
                  type="number"
                  value={practiceX}
                  onChange={(event) => {
                    setPracticeX(event.target.value);
                    setPracticeChecked(false);
                    act();
                  }}
                />
                ,{" "}
                <input
                  aria-label="Practice y value"
                  type="number"
                  value={practiceY}
                  onChange={(event) => {
                    setPracticeY(event.target.value);
                    setPracticeChecked(false);
                    act();
                  }}
                />
              </span>
            </label>
            <button
              type="button"
              onClick={() => {
                setPracticeChecked(true);
                act();
              }}
            >
              Check answer
            </button>
            <button
              type="button"
              onClick={() => {
                setShowPracticeSolution(true);
                act();
              }}
            >
              Show solution
            </button>
          </article>
        </div>
        {(practiceChecked || showPracticeSolution) && (
          <footer
            className={
              practiceChecked && !practiceCorrect ? "wrong" : "correct"
            }
          >
            <Check />
            <p>
              <b>
                {practiceChecked && practiceCorrect
                  ? "Correct!"
                  : practiceChecked
                    ? "Not yet."
                    : "Solution shown."}
              </b>{" "}
              The solution is ({practiceSolution.x}, {practiceSolution.y}).
              <span>Check: both substitutions equal their right sides.</span>
            </p>
            <button type="button" onClick={nextPractice}>
              <RotateCcw />
              Try another
            </button>
          </footer>
        )}
      </section>

      <nav className="sim112-navigation">
        <a href="/lessons/algebra/111-linear-equations">
          <ArrowLeft />
          <span>
            PREVIOUS<b>Linear Equations</b>
          </span>
        </a>
        <a href="/lessons/algebra/113-three-variable-systems">
          <span>
            NEXT<b>Three-Variable Systems</b>
          </span>
          <ArrowRight />
        </a>
      </nav>
      <footer className="sim112-footer">
        <div>
          <Sparkles />
          <span>
            <b>Math Universe</b>
            <small>
              Interactive math labs, visual proofs, NCERT explorations,
              graphing, CAS-style tools, and classroom-ready activities.
            </small>
          </span>
        </div>
        <nav>
          <a href="/sitemap">Sitemap</a>
          <a href="/docs">Docs</a>
          <a href="/about">About</a>
        </nav>
        <p>© 2026 INDIAN SERVERS PRIVATE LIMITED. NO RIGHT TO REPRODUCE IT.</p>
        <small>www.IndianServers.com · info@IndianServers.com</small>
      </footer>
    </div>
  );
}

function EliminationSteps({
  problem,
  firstScaled,
  secondScaled,
  combined,
  solution,
  stepView,
}: {
  problem: SystemProblem;
  firstScaled: Equation;
  secondScaled: Equation;
  combined: boolean;
  solution: ReturnType<typeof solve>;
  stepView: string;
}) {
  const totalA = firstScaled.a + secondScaled.a;
  const totalC = firstScaled.c + secondScaled.c;
  if (combined && stepView === "Result only") {
    return (
      <strong>
        x = <i>{solution.x}</i>
      </strong>
    );
  }
  if (combined && stepView === "Key steps") {
    return (
      <>
        <strong>
          {totalA}x = {totalC}
        </strong>
        <strong>
          x = <i>{solution.x}</i>
        </strong>
      </>
    );
  }
  return (
    <>
      <p>
        <i>{problem.multipliers[0] < 0 ? "−" : "+"}</i>
        <span>{equationText(firstScaled)}</span>
      </p>
      <p>
        <i>{problem.multipliers[1] < 0 ? "−" : "+"}</i>
        <span>{equationText(secondScaled)}</span>
      </p>
      <hr />
      {combined ? (
        <>
          <strong>
            ({coefficient(firstScaled.a, "x", true)}{" "}
            {coefficient(firstScaled.b, "y")}) + (
            {coefficient(secondScaled.a, "x", true)}{" "}
            {coefficient(secondScaled.b, "y")}) = {firstScaled.c} +{" "}
            {secondScaled.c}
          </strong>
          <strong>
            {totalA}x + ({firstScaled.b} {secondScaled.b < 0 ? "−" : "+"}{" "}
            {Math.abs(secondScaled.b)})y = {totalC}
          </strong>
          <strong>
            {totalA}x + 0 = {totalC}
          </strong>
          <strong>
            {totalA}x = {totalC}
          </strong>
          <strong>
            x = <i>{solution.x}</i>
          </strong>
        </>
      ) : (
        <small>
          Drag {operationLabel(problem)} here to generate the combined equation.
        </small>
      )}
    </>
  );
}

function SubstitutionSteps({
  problem,
  solution,
  combined,
  stepView,
}: {
  problem: SystemProblem;
  solution: ReturnType<typeof solve>;
  combined: boolean;
  stepView: string;
}) {
  const first = problem.first;
  if (combined && stepView === "Result only") {
    return (
      <>
        <strong>
          x = <i>{solution.x}</i>
        </strong>
        <strong>
          y = <i>{solution.y}</i>
        </strong>
      </>
    );
  }
  if (combined && stepView === "Key steps") {
    return (
      <>
        <strong>Replace y in equation 2.</strong>
        <strong>
          x = <i>{solution.x}</i>, y = <i>{solution.y}</i>
        </strong>
      </>
    );
  }
  return (
    <>
      {combined ? (
        <>
          <strong>
            {coefficient(first.b, "y", true)} = {first.c}{" "}
            {first.a >= 0 ? "−" : "+"} {Math.abs(first.a)}x
          </strong>
          <strong>Replace y in equation 2.</strong>
          <strong>{equationText(problem.second)}</strong>
          <strong>
            x = <i>{solution.x}</i>
          </strong>
          <strong>
            y = <i>{solution.y}</i>
          </strong>
        </>
      ) : (
        <small>
          Drag the substitution operation here to generate the replacement
          steps.
        </small>
      )}
    </>
  );
}

function SystemGraph({
  problem,
  solution,
  showIntersection,
  showGrid,
  theme,
}: {
  problem: SystemProblem;
  solution: ReturnType<typeof solve>;
  showIntersection: boolean;
  showGrid: boolean;
  theme: string;
}) {
  const xp = (x: number) => 34 + ((x + 2) / 10) * 326;
  const yp = (y: number) => 370 - ((y + 2) / 10) * 340;
  const line = (equation: Equation) => ({
    y1: (-equation.a * -2 + equation.c) / equation.b,
    y2: (-equation.a * 8 + equation.c) / equation.b,
  });
  const first = line(problem.first);
  const second = line(problem.second);
  return (
    <svg
      className={`sim112-plot ${theme}`}
      viewBox="0 0 390 410"
      preserveAspectRatio="none"
      aria-label={`Graph of ${equationText(problem.first)} and ${equationText(problem.second)}`}
    >
      <defs>
        <clipPath id="sim112-clip">
          <rect x="34" y="10" width="326" height="360" />
        </clipPath>
      </defs>
      {showGrid &&
        Array.from({ length: 11 }, (_, index) => index - 2).map((value) => (
          <g className="grid" key={value}>
            <line x1={xp(value)} y1="10" x2={xp(value)} y2="370" />
            <line x1="34" y1={yp(value)} x2="360" y2={yp(value)} />
          </g>
        ))}
      <line className="axis" x1="34" y1={yp(0)} x2="370" y2={yp(0)} />
      <line className="axis" x1={xp(0)} y1="10" x2={xp(0)} y2="380" />
      {Array.from({ length: 11 }, (_, index) => index - 2).map((value) => (
        <g className="labels" key={`label-${value}`}>
          <text x={xp(value)} y={yp(0) + 18}>
            {value}
          </text>
          <text x={xp(0) - 15} y={yp(value) + 3}>
            {value}
          </text>
        </g>
      ))}
      <g clipPath="url(#sim112-clip)">
        <line
          className="line-one"
          x1={xp(-2)}
          y1={yp(first.y1)}
          x2={xp(8)}
          y2={yp(first.y2)}
        />
        <line
          className="line-two"
          x1={xp(-2)}
          y1={yp(second.y1)}
          x2={xp(8)}
          y2={yp(second.y2)}
        />
      </g>
      <g className="line-label one">
        <rect x="111" y="76" width="72" height="31" rx="6" />
        <text x="121" y="96">
          {equationText(problem.first)}
        </text>
      </g>
      <g className="line-label two">
        <rect x="270" y="270" width="72" height="31" rx="6" />
        <text x="280" y="290">
          {equationText(problem.second)}
        </text>
      </g>
      {showIntersection && (
        <g className="intersection">
          <circle cx={xp(solution.x)} cy={yp(solution.y)} r="7" />
          <path
            d={`M${xp(solution.x) - 18},${yp(solution.y) - 52} h46 v35 h-17 l-8,9 -8,-9 h-11 z`}
          />
          <text x={xp(solution.x) - 10} y={yp(solution.y) - 30}>
            ({solution.x}, {solution.y})
          </text>
        </g>
      )}
      <text className="axis-name" x="370" y={yp(0) - 7}>
        x
      </text>
      <text className="axis-name" x={xp(0) + 7} y="18">
        y
      </text>
    </svg>
  );
}
