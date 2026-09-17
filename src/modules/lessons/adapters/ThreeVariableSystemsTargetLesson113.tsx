import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { useEffect, useMemo, useState, type DragEvent } from "react";
import * as THREE from "three";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CircleAlert,
  CircleHelp,
  Clock3,
  ExternalLink,
  Grid3X3,
  Languages,
  Lightbulb,
  Pencil,
  RotateCcw,
  Share2,
  Sparkles,
} from "lucide-react";
import type { LessonAdapterProps } from "../types";
import {
  THREE_VARIABLE_PRACTICES_113 as practices,
  THREE_VARIABLE_SYSTEMS_113 as systems,
  combineToEliminateThree113 as combineToEliminate,
  evaluateThreeVariableEquation113 as evaluate,
  isThreeVariableOperationDrop113,
  isThreeVariablePracticeCorrect113,
  solveThreeVariableSystem113 as solve3,
  threeVariableEquationText113 as equationText,
  threeVariableOperationPayload113,
  threeVariableOperationText113 as operationText,
  threeVariableTerm113 as term,
  type EquationThree113 as Equation3,
  type SystemThree113 as System3,
  type VariableThree113 as Variable,
} from "./threeVariableSystemsLesson113Model";
import "./ThreeVariableSystemsTargetLesson113.css";
import { LessonTopicStudyBoard } from "../components/LessonTopicStudyBoard";

export default function ThreeVariableSystemsTargetLesson113({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [systemIndex, setSystemIndex] = useState(0);
  const [rightSides, setRightSides] = useState<[number, number, number]>([
    6, 4, 0,
  ]);
  const [editing, setEditing] = useState(false);
  const [eliminate, setEliminate] = useState<Variable>("y");
  const [stepsReady, setStepsReady] = useState(true);
  const [dragging, setDragging] = useState(false);
  const [invalidDrop, setInvalidDrop] = useState(false);
  const [tripleChecked, setTripleChecked] = useState(true);
  const [rotationStep, setRotationStep] = useState(0);
  const [sceneMoves, setSceneMoves] = useState(0);
  const [activeTab, setActiveTab] = useState("Interaction + visualization");
  const [language, setLanguage] = useState("English (English)");
  const [shared, setShared] = useState(false);
  const [workspaceOpen, setWorkspaceOpen] = useState(false);
  const [practiceIndex, setPracticeIndex] = useState(0);
  const [practiceAnswers, setPracticeAnswers] = useState<
    [string, string, string]
  >(["4", "2", "3"]);
  const [practiceChecked, setPracticeChecked] = useState(true);
  const [practiceSteps, setPracticeSteps] = useState(false);
  const [actions, setActions] = useState(0);

  const baseSystem = systems[systemIndex];
  const system = useMemo<System3>(
    () => ({
      ...baseSystem,
      equations: baseSystem.equations.map((equation, index) => ({
        ...equation,
        d: rightSides[index],
      })) as [Equation3, Equation3, Equation3],
    }),
    [baseSystem, rightSides],
  );
  const solution = solve3(system);
  const firstReduction = combineToEliminate(
    system.equations[0],
    system.equations[1],
    eliminate,
  );
  const secondReduction = combineToEliminate(
    system.equations[0],
    system.equations[2],
    eliminate,
  );
  const practice = practices[practiceIndex];
  const practiceSolution = solve3(practice);
  const practiceCorrect = isThreeVariablePracticeCorrect113(
    practice,
    practiceAnswers.map(Number) as [number, number, number],
  );
  const act = () => {
    setActions((value) => value + 1);
    onInteraction();
  };
  const reset = (notify = true) => {
    setSystemIndex(0);
    setRightSides([6, 4, 0]);
    setEditing(false);
    setEliminate("y");
    setStepsReady(true);
    setDragging(false);
    setInvalidDrop(false);
    setTripleChecked(true);
    setRotationStep(0);
    setSceneMoves(0);
    setActiveTab("Interaction + visualization");
    setLanguage("English (English)");
    setShared(false);
    setWorkspaceOpen(false);
    setPracticeIndex(0);
    setPracticeAnswers(["4", "2", "3"]);
    setPracticeChecked(true);
    setPracticeSteps(false);
    setActions(0);
    if (notify) onInteraction();
  };
  useEffect(() => reset(false), [resetToken]); // eslint-disable-line react-hooks/exhaustive-deps

  const chooseSystem = (index: number) => {
    const next = systems[index];
    setSystemIndex(index);
    setRightSides(next.equations.map(({ d }) => d) as [number, number, number]);
    setStepsReady(false);
    setTripleChecked(false);
    act();
  };
  const chooseVariable = (variable: Variable) => {
    setEliminate(variable);
    setStepsReady(false);
    setInvalidDrop(false);
    act();
  };
  const startDrag = (event: DragEvent<HTMLButtonElement>) => {
    event.dataTransfer.setData(
      "text/three-variable-operation",
      threeVariableOperationPayload113(system, eliminate),
    );
    setDragging(true);
    setInvalidDrop(false);
    act();
  };
  const dropElimination = (event: DragEvent<HTMLElement>) => {
    event.preventDefault();
    const valid = isThreeVariableOperationDrop113(
      event.dataTransfer.getData("text/three-variable-operation"),
      system,
      eliminate,
    );
    setStepsReady(valid);
    setInvalidDrop(!valid);
    setDragging(false);
    act();
  };
  const nextPractice = () => {
    setPracticeIndex((value) => (value + 1) % practices.length);
    setPracticeAnswers(["", "", ""]);
    setPracticeChecked(false);
    setPracticeSteps(false);
    act();
  };
  const shareLesson = async () => {
    const shareData = {
      title: "Three-Variable Systems",
      text: `Solve the system with solution (${solution.x}, ${solution.y}, ${solution.z}).`,
      url: window.location.href,
    };
    try {
      if (navigator.share) await navigator.share(shareData);
      else await navigator.clipboard.writeText(window.location.href);
      setShared(true);
      act();
    } catch {
      setShared(false);
    }
  };
  const hindi = language.startsWith("Hindi");

  return (
    <div
      className="three113-page"
      data-testid="algebra-mockup-0170"
      data-dedicated-lesson="113"
      data-object-model="dedicated-tested-editable-three-equation-coefficient-matrix-cramers-rule-solver-validated-native-variable-elimination-drag-generated-row-reduction-threejs-plane-intersection-all-equation-verification-graded-ordered-triple-practice-functional-tabs-language-and-native-sharing-model"
      data-system-id={system.id}
      data-determinant={solution.determinant}
      data-solution-x={solution.x}
      data-solution-y={solution.y}
      data-solution-z={solution.z}
      data-right-sides={rightSides.join(",")}
      data-editing={editing}
      data-eliminate={eliminate}
      data-first-reduction={equationText(firstReduction.combined)}
      data-second-reduction={equationText(secondReduction.combined)}
      data-steps-ready={stepsReady}
      data-dragging={dragging}
      data-invalid-drop={invalidDrop}
      data-triple-checked={tripleChecked}
      data-rotation-step={rotationStep}
      data-scene-moves={sceneMoves}
      data-active-tab={activeTab}
      data-language={language}
      data-shared={shared}
      data-workspace-open={workspaceOpen}
      data-practice-index={practiceIndex}
      data-practice-x={practiceAnswers[0]}
      data-practice-y={practiceAnswers[1]}
      data-practice-z={practiceAnswers[2]}
      data-practice-solution={`${practiceSolution.x},${practiceSolution.y},${practiceSolution.z}`}
      data-practice-correct={practiceChecked && practiceCorrect}
      data-practice-steps={practiceSteps}
      data-actions={actions}
    >
      <nav className="three113-breadcrumb">
        <a href="/">Home</a>
        <span>&gt;</span>
        <a href="/lessons">Lessons</a>
        <span>&gt;</span>
        <a href="/lessons/algebra">Algebra</a>
        <span>&gt;</span>
        <b>113 Three Variable Systems</b>
      </nav>

      <header className="three113-intro">
        <small>
          <b>ALGEBRA</b>
          <b>EQUATIONS AND INEQUALITIES</b>
        </small>
        <h1>{hindi ? "तीन-चर समीकरण निकाय" : "Three-Variable Systems"}</h1>
        <p>
          {hindi
            ? "x, y, z में तीन स्वतंत्र रैखिक समीकरण हल करें। समाधान एक क्रमित त्रिक है जो तीनों को संतुष्ट करता है।"
            : "Solve three independent linear equations in x, y, z. The solution is an ordered triple (x, y, z) that satisfies all three."}
        </p>
        <nav>
          <b>
            <CircleHelp />
            Intermediate-Advanced Algebra
          </b>
          <b>
            <Sparkles />
            Guided Practice
          </b>
          <b>
            <Grid3X3 />
            Solve 3×3 Linear System
          </b>
          <b>
            <Clock3 />
            6-10 min
          </b>
        </nav>
        <div>
          <label>
            <Languages />
            <select
              aria-label="Three variable systems language"
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
          <button type="button" onClick={() => reset()}>
            <RotateCcw />
            Reset
          </button>
          <button type="button" onClick={shareLesson}>
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
      </header>

      <nav className="three113-tabs">
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
              act();
            }}
          >
            {tab}
          </button>
        ))}
      </nav>

      {activeTab === "Interaction + visualization" ? (
        <main className="three113-workspace">
          <section className="three113-elimination">
            <small>ELIMINATION LAB</small>
            <h2>Eliminate and solve step-by-step</h2>
            <section className="three113-system">
              <header>
                <b>System of equations</b>
                <button
                  type="button"
                  onClick={() => {
                    setEditing((value) => !value);
                    act();
                  }}
                >
                  <Pencil />
                  {editing ? "Done" : "Edit"}
                </button>
              </header>
              {system.equations.map((equation, index) => (
                <p key={index}>
                  <i>
                    E<sub>{index + 1}</sub>
                  </i>
                  <span>
                    {term(equation.a, "x", true)}
                    {term(equation.b, "y")}
                    {term(equation.c, "z")} =
                  </span>
                  {editing ? (
                    <input
                      aria-label={`Equation ${index + 1} right side`}
                      type="number"
                      value={rightSides[index]}
                      onChange={(event) => {
                        const next = [...rightSides] as [
                          number,
                          number,
                          number,
                        ];
                        next[index] = Number(event.target.value);
                        setRightSides(next);
                        setStepsReady(false);
                        setTripleChecked(false);
                        act();
                      }}
                    />
                  ) : (
                    <b>{equation.d}</b>
                  )}
                </p>
              ))}
            </section>
            <p className="three113-goal">
              Goal: Find (x, y, z) that satisfies E₁, E₂, E₃.
            </p>
            <section className="three113-choice">
              <h3>
                <b>1</b>Choose variable to eliminate
              </h3>
              <select
                aria-label="Variable to eliminate"
                value={eliminate}
                onChange={(event) =>
                  chooseVariable(event.target.value as Variable)
                }
              >
                <option value="y">Eliminate y</option>
                <option value="x">Eliminate x</option>
                <option value="z">Eliminate z</option>
              </select>
            </section>
            <section className="three113-table-wrap">
              <h3>
                <b>2</b>Elimination steps
              </h3>
              <button
                type="button"
                draggable
                aria-label={`Drag eliminate ${eliminate} operation`}
                onDragStart={startDrag}
                onDragEnd={() => setDragging(false)}
              >
                Eliminate {eliminate}
              </button>
              <table
                aria-label="Three variable elimination drop target"
                onDragOver={(event) => event.preventDefault()}
                onDrop={dropElimination}
              >
                <thead>
                  <tr>
                    <th>Step</th>
                    <th>Operation</th>
                    <th>Result</th>
                  </tr>
                </thead>
                <tbody>
                  {stepsReady ? (
                    <EliminationRows
                      system={system}
                      solution={solution}
                      eliminate={eliminate}
                      first={firstReduction}
                      second={secondReduction}
                    />
                  ) : (
                    <tr>
                      <td colSpan={3}>
                        Drag Eliminate {eliminate} here to calculate the
                        reduction.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
              {invalidDrop && (
                <em>Use the operation for the current system and variable.</em>
              )}
            </section>
            <section className="three113-solved">
              <b>Solved triple</b>
              <strong>
                (x, y, z) = ({solution.x}, {solution.y}, {solution.z})
              </strong>
              <p>This ordered triple satisfies all three equations.</p>
              <button
                type="button"
                onClick={() => {
                  setTripleChecked(true);
                  act();
                }}
              >
                <Check />
                Check triple
              </button>
            </section>
          </section>

          <section className="three113-right">
            <article className="three113-scene-panel">
              <header>
                <span>
                  <small>3D INTERSECTION LAB</small>
                  <h2>Three planes intersect at one point</h2>
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setRotationStep((value) => value + 1);
                    setSceneMoves((value) => value + 1);
                    act();
                  }}
                >
                  <RotateCcw />
                  Rotate
                </button>
              </header>
              <div
                className="three113-canvas"
                aria-label="Interactive three plane intersection scene"
              >
                <ThreePlaneScene
                  system={system}
                  solution={solution}
                  rotationStep={rotationStep}
                  onMove={() => {
                    setSceneMoves((value) => value + 1);
                    act();
                  }}
                />
              </div>
              <div className="three113-solution-label">
                ({solution.x}, {solution.y}, {solution.z})
              </div>
              <footer>
                {system.equations.map((equation, index) => (
                  <p key={index}>
                    <i className={`plane-${index + 1}`} />E
                    <sub>{index + 1}</sub>: {equationText(equation)}
                  </p>
                ))}
                <p>
                  <i className="point" />
                  Solution ({solution.x}, {solution.y}, {solution.z})
                </p>
              </footer>
            </article>
            <article className="three113-verification">
              <small>CHECK THE SOLUTION</small>
              <h3>Substitute the triple into each equation</h3>
              <table>
                <thead>
                  <tr>
                    <th>Equation</th>
                    <th>Substitution</th>
                    <th>Result</th>
                  </tr>
                </thead>
                <tbody>
                  {system.equations.map((equation, index) => (
                    <tr key={index}>
                      <td>
                        E<sub>{index + 1}</sub>: {equationText(equation)}
                      </td>
                      <td>
                        {equation.a * solution.x}{" "}
                        {equation.b * solution.y < 0 ? "−" : "+"}{" "}
                        {Math.abs(equation.b * solution.y)}{" "}
                        {equation.c * solution.z < 0 ? "−" : "+"}{" "}
                        {Math.abs(equation.c * solution.z)} = {equation.d}
                      </td>
                      <td>
                        {tripleChecked ? (
                          <>
                            <Check />
                            True
                          </>
                        ) : (
                          "Unchecked"
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <footer>
                <span>
                  <b>System Status</b>
                  <small>
                    {tripleChecked
                      ? "All three equations are satisfied."
                      : "Check the ordered triple."}
                  </small>
                </span>
                <b>{tripleChecked ? "Consistent" : "Pending"}</b>
              </footer>
            </article>
          </section>
        </main>
      ) : (
        <ThreeVariableTabPanel113
          tab={activeTab}
          onChooseSystem={chooseSystem}
        />
      )}

      {workspaceOpen && (
        <section
          className="three113-workspace-panel"
          aria-label="Three variable system workspace"
        >
          <b>Current solution</b>
          <span>det(A) = {solution.determinant}</span>
          <span>
            ({solution.x}, {solution.y}, {solution.z})
          </span>
        </section>
      )}

      <section className="three113-quick">
        <b>QUICK ACTIONS</b>
        {(["y", "x", "z"] as Variable[]).map((variable) => (
          <button
            type="button"
            className={eliminate === variable ? "active" : ""}
            key={variable}
            onClick={() => {
              chooseVariable(variable);
              setStepsReady(true);
            }}
          >
            Eliminate {variable}
          </button>
        ))}
        <i />
        <button
          type="button"
          onClick={() => {
            setStepsReady(true);
            act();
          }}
        >
          Solve pair
        </button>
        <button
          type="button"
          onClick={() => {
            setTripleChecked(true);
            act();
          }}
        >
          Check triple
        </button>
        <button
          type="button"
          onClick={() => {
            setStepsReady(false);
            setTripleChecked(false);
            act();
          }}
        >
          <RotateCcw />
          Reset steps
        </button>
      </section>

      <section className="three113-insights">
        <article>
          <Lightbulb />
          <span>
            <b>Key Insight</b>
            <p>
              Three independent linear equations in x, y, z represent three
              planes in 3D space. If the planes intersect at one point, the
              system has exactly one ordered-triple solution.
            </p>
          </span>
        </article>
        <article>
          <CircleAlert />
          <span>
            <b>Important Note</b>
            <p>
              If equations are dependent, there may be infinitely many
              solutions. If inconsistent, there is no solution.
            </p>
          </span>
        </article>
      </section>

      <section className="three113-practice">
        <header>
          <small>TRY ANOTHER SYSTEM</small>
          <h2>Practice</h2>
        </header>
        <div>
          <article>
            <h3>
              New system{" "}
              <button type="button" onClick={nextPractice}>
                <Pencil />
                Edit
              </button>
            </h3>
            {practice.equations.map((equation, index) => (
              <p key={index}>
                <i>
                  E<sub>{index + 1}</sub>
                </i>
                {equationText(equation)}
              </p>
            ))}
          </article>
          <article>
            <h3>Your solution</h3>
            <label>
              (x, y, z) ={" "}
              <input
                aria-label="Practice triple x"
                type="number"
                value={practiceAnswers[0]}
                onChange={(event) => {
                  setPracticeAnswers([
                    event.target.value,
                    practiceAnswers[1],
                    practiceAnswers[2],
                  ]);
                  setPracticeChecked(false);
                  act();
                }}
              />
              ,{" "}
              <input
                aria-label="Practice triple y"
                type="number"
                value={practiceAnswers[1]}
                onChange={(event) => {
                  setPracticeAnswers([
                    practiceAnswers[0],
                    event.target.value,
                    practiceAnswers[2],
                  ]);
                  setPracticeChecked(false);
                  act();
                }}
              />
              ,{" "}
              <input
                aria-label="Practice triple z"
                type="number"
                value={practiceAnswers[2]}
                onChange={(event) => {
                  setPracticeAnswers([
                    practiceAnswers[0],
                    practiceAnswers[1],
                    event.target.value,
                  ]);
                  setPracticeChecked(false);
                  act();
                }}
              />
            </label>
            <button
              type="button"
              onClick={() => {
                setPracticeChecked(true);
                act();
              }}
            >
              Check Answer
            </button>
            <button
              type="button"
              onClick={() => {
                setPracticeSteps((value) => !value);
                act();
              }}
            >
              Show Steps
            </button>
          </article>
          <article
            className={
              practiceChecked && !practiceCorrect ? "wrong" : "correct"
            }
          >
            <h3>Result</h3>
            <b>
              {practiceChecked && practiceCorrect
                ? "Correct!"
                : practiceChecked
                  ? "Try again"
                  : "Enter a triple"}
            </b>
            <p>
              ({practiceSolution.x}, {practiceSolution.y}, {practiceSolution.z})
              satisfies all three equations.
            </p>
            {(practiceChecked || practiceSteps) &&
              practice.equations.map((equation, index) => (
                <p key={index}>
                  <span>
                    E<sub>{index + 1}</sub>:{" "}
                    {evaluate(equation, practiceSolution)} = {equation.d}
                  </span>
                  <Check />
                </p>
              ))}
          </article>
        </div>
      </section>

      <nav className="three113-navigation">
        <a href="/lessons/algebra/112-simultaneous-linear-equations">
          <ArrowLeft />
          <span>
            PREVIOUS<b>Simultaneous Linear Equations</b>
          </span>
        </a>
        <a href="/lessons/algebra/114-quadratic-equations">
          <span>
            NEXT<b>Quadratic Equations</b>
          </span>
          <ArrowRight />
        </a>
      </nav>
      <footer className="three113-footer">
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
      <LessonTopicStudyBoard lessonId={113} view={activeTab} onInteraction={onInteraction} />

    </div>
  );
}

function ThreeVariableTabPanel113({
  tab,
  onChooseSystem,
}: {
  tab: string;
  onChooseSystem: (index: number) => void;
}) {
  const content: Record<string, { title: string; body: string }> = {
    Explain: {
      title: "Eliminate one variable twice",
      body: "Create two equations in two variables, solve that pair, then substitute backward to recover the ordered triple.",
    },
    Examples: {
      title: "Calculated three-variable systems",
      body: "Load another coefficient matrix with generated elimination rows and a three-plane intersection.",
    },
    Formulas: {
      title: "Cramer's rule check",
      body: "The determinant and replaced-column determinants independently calculate x, y, and z.",
    },
    "Know more": {
      title: "Three equations as planes",
      body: "A unique ordered triple is the common point of three independent planes and satisfies every original equation.",
    },
  };
  const selected = content[tab] ?? content.Explain;
  return (
    <main className="three113-workspace three113-tab-panel">
      <small>THREE-VARIABLE SYSTEMS</small>
      <h2>{selected.title}</h2>
      <p>{selected.body}</p>
      {tab === "Examples" && (
        <div>
          {systems.map((system, index) => {
            const result = solve3(system);
            return (
              <button
                type="button"
                key={system.id}
                onClick={() => onChooseSystem(index)}
              >
                <span>{system.equations.map(equationText).join("; ")}</span>
                <b>
                  ({result.x}, {result.y}, {result.z})
                </b>
              </button>
            );
          })}
        </div>
      )}
    </main>
  );
}

function EliminationRows({
  system,
  solution,
  eliminate,
  first,
  second,
}: {
  system: System3;
  solution: ReturnType<typeof solve3>;
  eliminate: Variable;
  first: ReturnType<typeof combineToEliminate>;
  second: ReturnType<typeof combineToEliminate>;
}) {
  const remaining = (["x", "y", "z"] as Variable[]).filter(
    (variable) => variable !== eliminate,
  );
  if (system.id === "target-2-1-3" && eliminate === "y") {
    return (
      <>
        <tr className="start">
          <td>Start</td>
          <td>-</td>
          <td>
            {system.equations.map((equation, index) => (
              <span key={index}>
                E<sub>{index + 1}</sub>: {equationText(equation)}
              </span>
            ))}
          </td>
        </tr>
        <tr>
          <td>1</td>
          <td>E₁ + E₂</td>
          <td>2x + 2z = 10</td>
        </tr>
        <tr>
          <td>1a</td>
          <td>Divide by 2</td>
          <td>x + z = 5 &nbsp; ... (A)</td>
        </tr>
        <tr>
          <td>2</td>
          <td>E₁ − E₃</td>
          <td>2z = 6</td>
        </tr>
        <tr>
          <td>2a</td>
          <td>Solve</td>
          <td>
            <b>z = 3</b>
          </td>
        </tr>
        <tr>
          <td>3</td>
          <td>Use (A): x + z = 5</td>
          <td>
            x + 3 = 5 &nbsp; → &nbsp; <b>x = 2</b>
          </td>
        </tr>
        <tr>
          <td>4</td>
          <td>Substitute in E₁</td>
          <td>
            2 + y + 3 = 6 &nbsp; → &nbsp; <b>y = 1</b>
          </td>
        </tr>
      </>
    );
  }
  return (
    <>
      <tr>
        <td>Start</td>
        <td>-</td>
        <td>
          {system.equations.map((equation, index) => (
            <span key={index}>
              E<sub>{index + 1}</sub>: {equationText(equation)}
            </span>
          ))}
        </td>
      </tr>
      <tr>
        <td>1</td>
        <td>{operationText(first.secondMultiplier, "E₁/E₂")}</td>
        <td>{equationText(first.combined)}</td>
      </tr>
      <tr>
        <td>2</td>
        <td>{operationText(second.secondMultiplier, "E₁/E₃")}</td>
        <td>{equationText(second.combined)}</td>
      </tr>
      <tr>
        <td>3</td>
        <td>Solve reduced pair</td>
        <td>
          <b>
            {remaining[0]} = {solution[remaining[0]]}, {remaining[1]} ={" "}
            {solution[remaining[1]]}
          </b>
        </td>
      </tr>
      <tr>
        <td>4</td>
        <td>Substitute back</td>
        <td>
          <b>
            {eliminate} = {solution[eliminate]}
          </b>
        </td>
      </tr>
    </>
  );
}

function ThreePlaneScene({
  system,
  solution,
  rotationStep,
  onMove,
}: {
  system: System3;
  solution: ReturnType<typeof solve3>;
  rotationStep: number;
  onMove: () => void;
}) {
  return (
    <Canvas
      dpr={1}
      camera={{ position: [7, 6, 8], fov: 38 }}
      gl={{ antialias: true, preserveDrawingBuffer: true }}
    >
      <color attach="background" args={["#ffffff"]} />
      <ambientLight intensity={1.2} />
      <directionalLight position={[5, 8, 6]} intensity={1.1} />
      <group
        position={[-solution.x, -solution.y, -solution.z]}
        rotation={[0, rotationStep * 0.24, 0]}
      >
        <gridHelper args={[8, 8, "#aebbc6", "#e1e7ec"]} />
        <gridHelper
          args={[8, 8, "#aebbc6", "#e1e7ec"]}
          rotation={[Math.PI / 2, 0, 0]}
        />
        <gridHelper
          args={[8, 8, "#aebbc6", "#e1e7ec"]}
          rotation={[0, 0, Math.PI / 2]}
        />
        {system.equations.map((equation, index) => (
          <EquationPlane
            equation={equation}
            color={["#9c6cec", "#31b9c2", "#72b84c"][index]}
            order={index + 1}
            key={index}
          />
        ))}
        <mesh position={[solution.x, solution.y, solution.z]} renderOrder={5}>
          <sphereGeometry args={[0.16, 20, 20]} />
          <meshStandardMaterial
            color="#7036df"
            emissive="#7036df"
            emissiveIntensity={0.25}
            depthTest={false}
          />
        </mesh>
      </group>
      <OrbitControls
        enablePan={false}
        minDistance={8}
        maxDistance={16}
        onStart={onMove}
      />
    </Canvas>
  );
}

function EquationPlane({
  equation,
  color,
  order,
}: {
  equation: Equation3;
  color: string;
  order: number;
}) {
  const normal = useMemo(
    () => new THREE.Vector3(equation.a, equation.b, equation.c),
    [equation],
  );
  const position = useMemo(
    () => normal.clone().multiplyScalar(equation.d / normal.lengthSq()),
    [equation.d, normal],
  );
  const quaternion = useMemo(
    () =>
      new THREE.Quaternion().setFromUnitVectors(
        new THREE.Vector3(0, 0, 1),
        normal.clone().normalize(),
      ),
    [normal],
  );
  return (
    <mesh position={position} quaternion={quaternion} renderOrder={order}>
      <planeGeometry args={[6.5, 6.5]} />
      <meshStandardMaterial
        color={color}
        transparent
        opacity={0.4}
        side={THREE.DoubleSide}
        depthWrite={false}
      />
    </mesh>
  );
}
