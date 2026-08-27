import {
  useEffect,
  useMemo,
  useState,
  type DragEvent,
  type PointerEvent,
} from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CircleAlert,
  CircleHelp,
  ExternalLink,
  Languages,
  Link2,
  RotateCcw,
  Scale,
  Share2,
  Sparkles,
} from "lucide-react";
import type { LessonAdapterProps } from "../types";
import "./LinearEquationsTargetLesson111.css";

type LinearProblem = {
  id: string;
  variable: string;
  a: number;
  b: number;
  c: number;
};

const problems: LinearProblem[] = [
  { id: "four-x-plus-one", variable: "x", a: 4, b: 1, c: 13 },
  { id: "three-x-minus-two", variable: "x", a: 3, b: -2, c: 10 },
  { id: "two-x-plus-five", variable: "x", a: 2, b: 5, c: 17 },
  { id: "negative-two-x-plus-seven", variable: "x", a: -2, b: 7, c: 1 },
];

const practiceProblems: LinearProblem[] = [
  { id: "two-y-minus-five", variable: "y", a: 2, b: -5, c: 9 },
  { id: "three-p-plus-four", variable: "p", a: 3, b: 4, c: 19 },
];

const signed = (value: number) =>
  value >= 0 ? `+ ${value}` : `− ${Math.abs(value)}`;
const expression = (problem: LinearProblem) =>
  `${problem.a}${problem.variable} ${signed(problem.b)} = ${problem.c}`;
const lineExpression = (problem: LinearProblem) =>
  `y = ${problem.a}${problem.variable} ${signed(problem.b)}`;
const solutionOf = (problem: LinearProblem) =>
  (problem.c - problem.b) / problem.a;
const inverse = (problem: LinearProblem) =>
  problem.b >= 0 ? `Subtract ${problem.b}` : `Add ${Math.abs(problem.b)}`;
const round = (value: number) => Math.round(value * 100) / 100;

export default function LinearEquationsTargetLesson111({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [problemId, setProblemId] = useState(problems[0].id);
  const [showAlgebra, setShowAlgebra] = useState(true);
  const [showGraph, setShowGraph] = useState(true);
  const [checked, setChecked] = useState(true);
  const [operationDrops, setOperationDrops] = useState<string[]>([]);
  const [draggingOperation, setDraggingOperation] = useState("");
  const [invalidDrop, setInvalidDrop] = useState("");
  const [probeX, setProbeX] = useState(3);
  const [probeDragging, setProbeDragging] = useState(false);
  const [activeTab, setActiveTab] = useState("Interact");
  const [language, setLanguage] = useState("English (English)");
  const [shared, setShared] = useState(false);
  const [workspaceOpen, setWorkspaceOpen] = useState(false);
  const [practiceIndex, setPracticeIndex] = useState(0);
  const [practiceAnswer, setPracticeAnswer] = useState("7");
  const [practiceChecked, setPracticeChecked] = useState(true);
  const [actions, setActions] = useState(0);

  const problem = useMemo(
    () => problems.find((item) => item.id === problemId) ?? problems[0],
    [problemId],
  );
  const solution = solutionOf(problem);
  const intermediate = problem.c - problem.b;
  const checkValue = problem.a * solution + problem.b;
  const probeY = problem.a * probeX + problem.b;
  const probeOnTarget = Math.abs(probeX - solution) < 0.11;
  const practice = practiceProblems[practiceIndex];
  const practiceSolution = solutionOf(practice);
  const practiceCorrect = Number(practiceAnswer) === practiceSolution;
  const act = () => {
    setActions((value) => value + 1);
    onInteraction();
  };

  const reset = () => {
    setProblemId(problems[0].id);
    setShowAlgebra(true);
    setShowGraph(true);
    setChecked(true);
    setOperationDrops([]);
    setDraggingOperation("");
    setInvalidDrop("");
    setProbeX(3);
    setProbeDragging(false);
    setActiveTab("Interact");
    setLanguage("English (English)");
    setShared(false);
    setWorkspaceOpen(false);
    setPracticeIndex(0);
    setPracticeAnswer("7");
    setPracticeChecked(true);
    setActions(0);
    onInteraction();
  };
  useEffect(() => reset(), [resetToken]); // eslint-disable-line react-hooks/exhaustive-deps

  const chooseProblem = (id: string) => {
    const next = problems.find((item) => item.id === id) ?? problems[0];
    setProblemId(next.id);
    setProbeX(solutionOf(next));
    setOperationDrops([]);
    setInvalidDrop("");
    setChecked(false);
    act();
  };
  const startOperationDrag = (
    event: DragEvent<HTMLButtonElement>,
    operation: "constant" | "coefficient",
  ) => {
    event.dataTransfer.setData(
      "text/linear-operation",
      `${problem.id}:${operation}`,
    );
    setDraggingOperation(operation);
    setInvalidDrop("");
    act();
  };
  const dropOperation = (
    event: DragEvent<HTMLElement>,
    expected: "constant" | "coefficient",
  ) => {
    event.preventDefault();
    const payload = event.dataTransfer.getData("text/linear-operation");
    if (payload === `${problem.id}:${expected}`) {
      setOperationDrops((current) =>
        current.includes(expected) ? current : [...current, expected],
      );
      setInvalidDrop("");
    } else setInvalidDrop(payload || "missing operation");
    setDraggingOperation("");
    act();
  };
  const moveProbe = (event: PointerEvent<SVGSVGElement>) => {
    if (!probeDragging) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = -4 + ((event.clientX - rect.left - 24) / (rect.width - 34)) * 10;
    setProbeX(Math.max(-4, Math.min(6, Math.round(x * 10) / 10)));
    act();
  };
  const changePractice = (index: number) => {
    setPracticeIndex(index);
    setPracticeAnswer("");
    setPracticeChecked(false);
    act();
  };

  return (
    <div
      className="linear111-page"
      data-testid="algebra-mockup-0168"
      data-dedicated-lesson="111"
      data-object-model="selectable-first-degree-equation-inverse-operation-native-drag-balance-table-dynamic-line-target-intersection-pointer-probe-substitution-check-graded-practice-model"
      data-problem={expression(problem)}
      data-problem-id={problem.id}
      data-a={problem.a}
      data-b={problem.b}
      data-c={problem.c}
      data-intermediate={intermediate}
      data-solution={solution}
      data-check-value={checkValue}
      data-show-algebra={showAlgebra}
      data-show-graph={showGraph}
      data-checked={checked}
      data-operation-drops={operationDrops.join(",")}
      data-all-operations-dropped={
        operationDrops.includes("constant") &&
        operationDrops.includes("coefficient")
      }
      data-dragging-operation={draggingOperation}
      data-invalid-drop={invalidDrop}
      data-probe-x={probeX}
      data-probe-y={round(probeY)}
      data-probe-dragging={probeDragging}
      data-probe-on-target={probeOnTarget}
      data-active-tab={activeTab}
      data-language={language}
      data-shared={shared}
      data-workspace-open={workspaceOpen}
      data-practice-index={practiceIndex}
      data-practice-equation={expression(practice)}
      data-practice-answer={practiceAnswer}
      data-practice-solution={practiceSolution}
      data-practice-correct={practiceChecked && practiceCorrect}
      data-actions={actions}
    >
      <nav className="linear111-breadcrumb">
        <a href="/">Home</a>
        <span>&gt;</span>
        <a href="/lessons">Lessons</a>
        <span>&gt;</span>
        <a href="/lessons/algebra">Algebra</a>
        <span>&gt;</span>
        <b>Linear Equations</b>
      </nav>

      <header className="linear111-intro">
        <section>
          <small>
            <b>ALGEBRA</b>
            <b>EQUATIONS &amp; INEQUALITIES</b>
          </small>
          <h1>Linear Equations</h1>
          <p>
            Solve first-degree equations and connect algebraic steps to a line
            crossing a target value.
          </p>
          <nav>
            <b>
              <CircleHelp />
              Intermediate-Advanced Algebra
            </b>
            <b>
              <Link2 />
              Algebra + Graph
            </b>
            <b>
              <RotateCcw />
              6-10 min
            </b>
          </nav>
          <div>
            <label>
              <Languages />
              <select
                aria-label="Linear equations language"
                value={language}
                onChange={(event) => {
                  setLanguage(event.target.value);
                  act();
                }}
              >
                <option>English (English)</option>
                <option>Hindi (हिन्दी)</option>
              </select>
            </label>
            <button type="button" onClick={reset}>
              <RotateCcw />
              Reset
            </button>
            <button
              type="button"
              onClick={() => {
                setShared(true);
                act();
              }}
            >
              <Share2 />
              {shared ? "Link ready" : "Share"}
            </button>
          </div>
          <button
            type="button"
            onClick={() => {
              setWorkspaceOpen((value) => !value);
              act();
            }}
          >
            <ExternalLink />
            {workspaceOpen ? "Close workspace" : "Workspace"}
          </button>
        </section>
        <aside>
          <small>LINEAR EQUATION RULE</small>
          <b>General form</b>
          <strong>ax + b = c</strong>
          <b>Solution (a ≠ 0)</b>
          <FormulaFraction />
        </aside>
      </header>

      <nav className="linear111-tabs">
        {[
          "Interact",
          "Explain",
          "Examples",
          "Practice",
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
                chooseProblem(
                  problems[(problems.indexOf(problem) + 1) % problems.length]
                    .id,
                );
              if (tab === "Practice")
                changePractice((practiceIndex + 1) % practiceProblems.length);
              if (tab === "Explain") setChecked(true);
              act();
            }}
          >
            {tab}
          </button>
        ))}
      </nav>

      <main className="linear111-workspace">
        <section className="linear111-algebra">
          <h2>Algebra: Solve the equation</h2>
          <label>
            Equation:
            <select
              aria-label="Linear equation"
              value={problem.id}
              onChange={(event) => chooseProblem(event.target.value)}
            >
              {problems.map((item) => (
                <option value={item.id} key={item.id}>
                  {expression(item)}
                </option>
              ))}
            </select>
          </label>
          {showAlgebra ? (
            <>
              <table>
                <thead>
                  <tr>
                    <th>Step</th>
                    <th>Operation</th>
                    <th>Equation</th>
                    <th>Balance</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>1</td>
                    <td>Start</td>
                    <td>{expression(problem)}</td>
                    <td>
                      <Scale /> = <Scale />
                    </td>
                  </tr>
                  <tr>
                    <td>2</td>
                    <td>
                      <button
                        type="button"
                        draggable
                        aria-label={`Drag constant operation ${inverse(problem)}`}
                        onDragStart={(event) =>
                          startOperationDrag(event, "constant")
                        }
                        onDragEnd={() => setDraggingOperation("")}
                      >
                        {inverse(problem)}
                        <small>
                          Inverse:{" "}
                          {problem.b >= 0
                            ? `−${problem.b}`
                            : `+${Math.abs(problem.b)}`}
                        </small>
                      </button>
                    </td>
                    <td>
                      {problem.a}
                      {problem.variable} {signed(problem.b)}{" "}
                      {problem.b >= 0
                        ? `− ${problem.b}`
                        : `+ ${Math.abs(problem.b)}`}{" "}
                      = {problem.c}{" "}
                      {problem.b >= 0
                        ? `− ${problem.b}`
                        : `+ ${Math.abs(problem.b)}`}
                      <strong>
                        {problem.a}
                        {problem.variable} = {intermediate}
                      </strong>
                    </td>
                    <td
                      aria-label="Constant operation drop target"
                      onDragOver={(event) => event.preventDefault()}
                      onDrop={(event) => dropOperation(event, "constant")}
                    >
                      <Scale /> = <Scale />
                    </td>
                  </tr>
                  <tr>
                    <td>3</td>
                    <td>
                      <button
                        type="button"
                        draggable
                        aria-label={`Drag coefficient operation Divide by ${problem.a}`}
                        onDragStart={(event) =>
                          startOperationDrag(event, "coefficient")
                        }
                        onDragEnd={() => setDraggingOperation("")}
                      >
                        Divide by {problem.a}
                        <small>Inverse: ÷{problem.a}</small>
                      </button>
                    </td>
                    <td>
                      <span>
                        {problem.a}
                        {problem.variable}
                        <i>{problem.a}</i>
                      </span>{" "}
                      ={" "}
                      <span>
                        {intermediate}
                        <i>{problem.a}</i>
                      </span>
                      <strong>
                        {problem.variable} = {solution}
                      </strong>
                    </td>
                    <td
                      aria-label="Coefficient operation drop target"
                      onDragOver={(event) => event.preventDefault()}
                      onDrop={(event) => dropOperation(event, "coefficient")}
                    >
                      <Scale /> = <Scale />
                    </td>
                  </tr>
                </tbody>
              </table>
              {invalidDrop && (
                <em>Use each inverse operation on its matching balance row.</em>
              )}
              <section className="solution">
                <Check />
                <b>Solution</b>
                <strong>
                  {problem.variable} = {solution}
                </strong>
              </section>
              <section className="check">
                <h3>Check the solution</h3>
                <p>
                  Substitute {problem.variable} = {solution} into the original
                  equation.
                </p>
                <strong>
                  {problem.a}({solution}) {signed(problem.b)} = {problem.c}
                </strong>
                <b>
                  {problem.a * solution} {signed(problem.b)} = {checkValue}{" "}
                  {checked && <Check />}
                </b>
              </section>
            </>
          ) : (
            <div className="linear111-hidden">Algebra steps hidden</div>
          )}
        </section>

        <section className="linear111-graph">
          <header>
            <h2>Graph: {lineExpression(problem)}</h2>
            <div>
              <label>
                Show algebra
                <input
                  aria-label="Show linear algebra"
                  type="checkbox"
                  checked={showAlgebra}
                  onChange={(event) => {
                    setShowAlgebra(event.target.checked);
                    act();
                  }}
                />
                <span />
              </label>
              <label>
                Show graph
                <input
                  aria-label="Show linear graph"
                  type="checkbox"
                  checked={showGraph}
                  onChange={(event) => {
                    setShowGraph(event.target.checked);
                    act();
                  }}
                />
                <span />
              </label>
              <button
                type="button"
                onClick={() => {
                  setChecked(true);
                  setProbeX(solution);
                  act();
                }}
              >
                Check solution
              </button>
            </div>
          </header>
          <div className="linear111-coefficients">
            <b>a = {problem.a}</b>
            <b>b = {problem.b}</b>
            <b>c = {problem.c}</b>
          </div>
          {showGraph ? (
            <LinearGraph
              problem={problem}
              probeX={probeX}
              probeY={probeY}
              probeDragging={probeDragging}
              onPointerDown={(event) => {
                event.currentTarget.setPointerCapture(event.pointerId);
                setProbeDragging(true);
                act();
              }}
              onPointerMove={moveProbe}
              onPointerUp={() => {
                setProbeDragging(false);
                act();
              }}
              onKeyDown={(direction) => {
                setProbeX((value) =>
                  Math.max(-4, Math.min(6, round(value + direction * 0.1))),
                );
                act();
              }}
            />
          ) : (
            <div className="linear111-graph-hidden">Graph hidden</div>
          )}
          <footer>
            <CircleHelp />
            <b>Graph connection</b>
            <p>
              The line <strong>{lineExpression(problem)}</strong> intersects the
              target line <strong>y = {problem.c}</strong> at ({solution},{" "}
              {problem.c}).
              <br />
              The x-coordinate of this point is the solution:{" "}
              <strong>
                {problem.variable} = {solution}
              </strong>
              .
            </p>
            <span>
              Probe: ({probeX.toFixed(1)}, {round(probeY)}){" "}
              {probeOnTarget && "· target found"}
            </span>
          </footer>
        </section>
      </main>

      <section className="linear111-insights">
        <article>
          <Check />
          <h3>Key insights</h3>
          <p>
            ✓ Isolate the term with {problem.variable} using inverse operations.
          </p>
          <p>
            ✓ Perform the same operation on both sides to keep the equation
            balanced.
          </p>
          <p>
            ✓ The solution is where the line y = a{problem.variable} + b crosses
            the target y = c.
          </p>
        </article>
        <article>
          <CircleAlert />
          <h3>Important warning</h3>
          <p>
            <b>This is a linear equation (first-degree).</b>
            <br />
            Equations with x², x³, √x, or |x| are not linear.
            <br />
            They do not represent a straight line.
          </p>
          <p>
            Example (not linear): <b>x² + 1 = 5</b>
          </p>
        </article>
      </section>

      <section className="linear111-practice">
        <header>
          <h2>Practice</h2>
          <p>Solve the equation.</p>
        </header>
        <div>
          <article>
            <b>{practiceIndex + 1}</b>
            <h3>{expression(practice)}</h3>
            <p>Solve for {practice.variable}.</p>
          </article>
          <article>
            <label>
              Your answer
              <span>
                {practice.variable} ={" "}
                <input
                  aria-label="Linear practice answer"
                  type="number"
                  value={practiceAnswer}
                  onChange={(event) => {
                    setPracticeAnswer(event.target.value);
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
              Check
            </button>
            {practiceChecked && (
              <p className={practiceCorrect ? "correct" : "wrong"}>
                {practiceCorrect
                  ? "Great! Correct answer."
                  : "Use inverse operations in order."}
              </p>
            )}
          </article>
          <article>
            <h3>Solution steps</h3>
            <p>
              <b>{expression(practice)}</b>
              <span>Given</span>
            </p>
            <p>
              <b>
                {practice.a}
                {practice.variable} = {practice.c - practice.b}
              </b>
              <span>{inverse(practice)}</span>
            </p>
            <p>
              <b>
                {practice.variable} = {practiceSolution}
              </b>
              <span>Divide by {practice.a}</span>
            </p>
            <p>
              <b>
                {practice.variable} = {practiceSolution}
              </b>
              <span>Answer</span>
            </p>
          </article>
        </div>
      </section>

      <nav className="linear111-navigation">
        <a href="/lessons/algebra/110-literal-equations">
          <ArrowLeft />
          <span>
            PREVIOUS<b>Properties of Equality</b>
          </span>
        </a>
        <a href="/lessons/algebra/112-simultaneous-linear-equations">
          <span>
            NEXT<b>Simultaneous Linear Equations</b>
          </span>
          <ArrowRight />
        </a>
      </nav>
      <footer className="linear111-footer">
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

function FormulaFraction() {
  return (
    <div className="linear111-formula">
      <i>x =</i>
      <span>
        <b>c − b</b>
        <em>a</em>
      </span>
    </div>
  );
}

function LinearGraph({
  problem,
  probeX,
  probeY,
  probeDragging,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  onKeyDown,
}: {
  problem: LinearProblem;
  probeX: number;
  probeY: number;
  probeDragging: boolean;
  onPointerDown: (event: PointerEvent<SVGCircleElement>) => void;
  onPointerMove: (event: PointerEvent<SVGSVGElement>) => void;
  onPointerUp: () => void;
  onKeyDown: (direction: number) => void;
}) {
  const xp = (x: number) => 24 + ((x + 4) / 10) * 406;
  const yp = (y: number) => 400 - ((y + 4) / 20) * 390;
  const solution = solutionOf(problem);
  const xAtMin = (-4 - problem.b) / problem.a;
  const xAtMax = (16 - problem.b) / problem.a;
  const lineX1 = Math.max(-4, Math.min(6, xAtMin));
  const lineX2 = Math.max(-4, Math.min(6, xAtMax));
  return (
    <svg
      className="linear111-plot"
      aria-label={`Interactive graph of ${lineExpression(problem)} and y = ${problem.c}`}
      viewBox="0 0 440 430"
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerLeave={onPointerUp}
    >
      {Array.from({ length: 11 }, (_, index) => index - 4).map((x) => (
        <g key={`x-${x}`}>
          <line x1={xp(x)} y1="10" x2={xp(x)} y2="400" className="grid" />
          <text x={xp(x)} y="416">
            {x}
          </text>
        </g>
      ))}
      {Array.from({ length: 11 }, (_, index) => index * 2 - 4).map((y) => (
        <g key={`y-${y}`}>
          <line x1="24" y1={yp(y)} x2="430" y2={yp(y)} className="grid" />
          <text x="10" y={yp(y) + 3}>
            {y}
          </text>
        </g>
      ))}
      <line x1="24" y1={yp(0)} x2="430" y2={yp(0)} className="axis" />
      <line x1={xp(0)} y1="10" x2={xp(0)} y2="400" className="axis" />
      <line
        x1={xp(lineX1)}
        y1={yp(problem.a * lineX1 + problem.b)}
        x2={xp(lineX2)}
        y2={yp(problem.a * lineX2 + problem.b)}
        className="equation-line"
      />
      <line
        x1="24"
        y1={yp(problem.c)}
        x2="430"
        y2={yp(problem.c)}
        className="target-line"
      />
      <line
        x1={xp(solution)}
        y1={yp(problem.c)}
        x2={xp(solution)}
        y2="400"
        className="target-line"
      />
      <circle
        cx={xp(solution)}
        cy={yp(problem.c)}
        r="5"
        className="intersection"
      />
      <text
        x={xp(solution) + 8}
        y={yp(problem.c) - 8}
        className="intersection-label"
      >
        ({solution}, {problem.c})
      </text>
      <circle
        cx={xp(probeX)}
        cy={yp(Math.max(-4, Math.min(16, probeY)))}
        r={probeDragging ? 8 : 6}
        className={`probe ${Math.abs(probeX - solution) < 0.11 ? "on-target" : ""}`}
        tabIndex={0}
        aria-label="Drag x-value probe"
        onPointerDown={onPointerDown}
        onKeyDown={(event) => {
          if (event.key === "ArrowLeft") onKeyDown(-1);
          if (event.key === "ArrowRight") onKeyDown(1);
        }}
      />
      <g className="legend">
        <rect x="295" y="330" width="130" height="62" rx="7" />
        <line x1="306" y1="347" x2="326" y2="347" className="equation-line" />
        <text x="333" y="350">
          {lineExpression(problem)}
        </text>
        <line x1="306" y1="365" x2="326" y2="365" className="target-line" />
        <text x="333" y="368">
          y = {problem.c}
        </text>
        <circle cx="316" cy="382" r="4" className="intersection" />
        <text x="333" y="385">
          Intersection
        </text>
      </g>
    </svg>
  );
}
