import nerdamer from "nerdamer";
import "nerdamer/Algebra";
import { Check, FlaskConical, Lightbulb, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { LessonAdapterProps } from "../types";
import { LessonCartesianGraph } from "../graphs/LessonCartesianGraph";
import { LessonBalanceGraph } from "../graphs/LessonBalanceGraph";
import "./EquationInputTargetLesson30.css";
import { LessonTopicStudyBoard } from "../components/LessonTopicStudyBoard";


type EquationModel = {
  left: string;
  right: string;
  valid: boolean;
  linear: boolean;
  solution: number;
  solvedY: number;
  leftCoefficient: number;
  leftConstant: number;
  rightCoefficient: number;
  rightConstant: number;
  error: string;
};

const engine = nerdamer as unknown as (
  expression: string,
  substitutions?: Record<string, string>,
) => { evaluate: () => { text: () => string; toString: () => string } };

function evaluate(expression: string, x: number) {
  try {
    const normalized = expression.replace(/(\d)\s*x/gi, "$1*x");
    const value = Number(
      engine(normalized, { x: String(x) })
        .evaluate()
        .text(),
    );
    return Number.isFinite(value) ? value : NaN;
  } catch {
    return NaN;
  }
}

function format(value: number) {
  if (!Number.isFinite(value)) return "?";
  const rounded = Math.round(value * 100) / 100;
  return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(2);
}

function parseEquation(input: string): EquationModel {
  const parts = input.split("=");
  const empty: EquationModel = {
    left: parts[0]?.trim() ?? "",
    right: parts[1]?.trim() ?? "",
    valid: false,
    linear: false,
    solution: NaN,
    solvedY: NaN,
    leftCoefficient: NaN,
    leftConstant: NaN,
    rightCoefficient: NaN,
    rightConstant: NaN,
    error: "Enter one equals sign with an expression on each side.",
  };
  if (parts.length !== 2 || !parts[0].trim() || !parts[1].trim()) return empty;
  if (!/^[A-Za-z0-9_()+\-*/^.\s]+$/.test(parts.join("")))
    return { ...empty, error: "Unsupported symbol detected." };
  const left = parts[0].trim(),
    right = parts[1].trim();
  const l0 = evaluate(left, 0),
    l1 = evaluate(left, 1),
    l2 = evaluate(left, 2);
  const r0 = evaluate(right, 0),
    r1 = evaluate(right, 1),
    r2 = evaluate(right, 2);
  if (![l0, l1, l2, r0, r1, r2].every(Number.isFinite))
    return {
      ...empty,
      left,
      right,
      error: "Both sides must be evaluable expressions in x.",
    };
  const la = l1 - l0,
    ra = r1 - r0;
  const linear =
    Math.abs(l2 - (l0 + 2 * la)) < 1e-7 && Math.abs(r2 - (r0 + 2 * ra)) < 1e-7;
  if (!linear || Math.abs(la - ra) < 1e-9)
    return {
      ...empty,
      left,
      right,
      linear,
      error: linear
        ? "The equation does not have one unique solution."
        : "This lab currently solves linear equations.",
    };
  const solution = (r0 - l0) / (la - ra);
  return {
    left,
    right,
    valid: true,
    linear: true,
    solution,
    solvedY: evaluate(left, solution),
    leftCoefficient: la,
    leftConstant: l0,
    rightCoefficient: ra,
    rightConstant: r0,
    error: "",
  };
}

export default function EquationInputTargetLesson30({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [input, setInput] = useState("2x + 3 = 11");
  const [checked, setChecked] = useState(true);
  const [checks, setChecks] = useState(1);
  const [actions, setActions] = useState(0);
  const model = useMemo(() => parseEquation(input), [input]);
  const touch = () => {
    setActions((value) => value + 1);
    onInteraction();
  };
  useEffect(() => {
    setInput("2x + 3 = 11");
    setChecked(true);
    setChecks(1);
    setActions(0);
  }, [resetToken]);
  const setEquation = (value: string) => {
    setInput(value);
    setChecked(false);
    touch();
  };
  const checkEquation = () => {
    setChecked(true);
    setChecks((value) => value + 1);
    touch();
  };
  const solved = checked && model.valid;

  return (
    <div
      className="equation-page"
      data-testid="algebra-mockup-0030"
      data-dedicated-lesson="30"
      data-object-model="parsed-two-sided-linear-equation-balance-generated-steps-dual-line-intersection-substitution-proof-model"
      data-valid={model.valid}
      data-checked={checked}
      data-left={model.left}
      data-right={model.right}
      data-solution={format(model.solution)}
      data-solved-y={format(model.solvedY)}
      data-checks={checks}
      data-actions={actions}
    >
      <nav className="equation-breadcrumb">
        <a href="/">←</a>
        <a href="/">Home</a>
        <span>›</span>
        <a href="/lessons">Lessons</a>
        <span>›</span>
        <a href="/lessons/core-workspaces">Core Workspaces</a>
        <span>›</span>
        <b>30 Equation Input</b>
      </nav>
      <section className="equation-surface">
        <header className="equation-header">
          <div>
            <h1>Equation Input</h1>
            <p>Create multiple equation types.</p>
          </div>
          <aside>
            <b>⌁ Foundation</b>
            <b>◷ 6-10 min</b>
            <b>
              <FlaskConical />
              Interactive Lab
            </b>
          </aside>
        </header>
        <section className="equation-entry">
          <h2>ENTER YOUR EQUATION</h2>
          <div>
            <input
              aria-label="Equation input"
              value={input}
              onChange={(event) => setEquation(event.target.value)}
            />
            <button
              type="button"
              onClick={() => {
                setInput("");
                setChecked(false);
                touch();
              }}
            >
              Clear
            </button>
            <button
              type="button"
              disabled={!model.valid}
              onClick={checkEquation}
            >
              <Check />
              Check Equation
            </button>
          </div>
          <p className={model.valid ? "valid" : "invalid"}>
            {model.valid ? (
              <>
                <Check />
                <span>
                  <b>{checked ? "Valid equation" : "Ready to check"}</b>
                  <small>Valid equation: two sides detected</small>
                </span>
              </>
            ) : (
              <>
                <X />
                <span>
                  <b>Invalid equation</b>
                  <small>{model.error}</small>
                </span>
              </>
            )}
          </p>
        </section>
        <main className="equation-main">
          <section className="equation-work">
            <div className="equation-columns">
              <section className="balance-card">
                <h2>BALANCE MODEL</h2>
                <p>Solve by keeping both sides balanced.</p>
                <BalanceModel model={model} />
              </section>
              <section className="steps-card">
                <h2>SOLVE STEP-BY-STEP</h2>
                <SolutionSteps model={model} solved={solved} />
              </section>
            </div>
            <section className="graph-card">
              <h2>GRAPH VIEW</h2>
              <p>The lines intersect at the solution.</p>
              <EquationGraph key={resetToken} model={model} />
<footer>
                Intersection: ({format(model.solution)}, {format(model.solvedY)}
                )
              </footer>
            </section>
          </section>
          <aside className="equation-side">
            <section className="syntax-panel">
              <h2>EQUATION SYNTAX</h2>
              <p>Enter equations with two sides.</p>
              <span>
                <Check />
                Use = to separate sides
              </span>
              <span>
                <Check />
                Include at least one term
                <br />
                on each side
              </span>
              <span>
                <Check />
                Examples:
              </span>
              {["3x - 2 = 7", "x + 5 = 2x - 1", "4y = y + 12"].map(
                (example) => (
                  <button
                    type="button"
                    key={example}
                    onClick={() => setEquation(example.replaceAll("y", "x"))}
                  >
                    {example}
                  </button>
                ),
              )}
            </section>
            <section className="summary-panel">
              <h2>SOLUTION SUMMARY</h2>
              <p>Solved value</p>
              <b>x = {solved ? format(model.solution) : "?"}</b>
            </section>
            <section className="checklist-panel">
              <h2>EQUATION CHECKLIST</h2>
              {[
                input.includes("="),
                !!model.left,
                !!model.right,
                model.valid,
              ].map((pass, index) => (
                <p className={pass ? "pass" : "fail"} key={index}>
                  <Check />
                  {
                    [
                      "Has equals sign",
                      "Left side detected",
                      "Right side detected",
                      "Solved value found",
                    ][index]
                  }
                </p>
              ))}
            </section>
            <section className="tips-panel">
              <h2>
                <Lightbulb />
                TIPS
              </h2>
              <p>
                Think of the equation as a balance. Do the same thing to both
                sides to keep it balanced.
              </p>
            </section>
          </aside>
        </main>
        <section className="solution-checker">
          <h2>SOLUTION CHECKER</h2>
          <p>Substitute the solution to verify.</p>
          <div>
            <Check />
            <span>
              <b>Substitute&nbsp; x = {format(model.solution)}:</b>
              <strong>
                {format(model.leftCoefficient)}({format(model.solution)}) +{" "}
                {format(model.leftConstant)} = {format(model.solvedY)}
              </strong>
              <small>Both sides are equal. The solution is correct.</small>
            </span>
            <em>{solved ? "TRUE" : "PENDING"}</em>
          </div>
        </section>
        <nav className="equation-neighbors">
          <a href="/lessons/core-workspaces/29-object-redefinition">
            ←
            <span>
              <small>Previous</small>
              <b>Object Redefinition</b>
            </span>
          </a>
          <a href="/lessons/core-workspaces/31-inequality-input">
            <span>
              <small>Next</small>
              <b>Inequality Input</b>
            </span>
            →
          </a>
        </nav>
      </section>
      <LessonTopicStudyBoard lessonId={30} alwaysVisible onInteraction={onInteraction} />
    </div>
  );
}

function SolutionSteps({
  model,
  solved,
}: {
  model: EquationModel;
  solved: boolean;
}) {
  if (!model.valid)
    return (
      <p className="steps-empty">
        Enter a solvable linear equation to generate equal-operation steps.
      </p>
    );
  const a = model.leftCoefficient - model.rightCoefficient,
    b = model.leftConstant,
    c = model.rightConstant;
  return (
    <ol>
      <li>
        <b>
          {model.left} = {model.right}
        </b>
      </li>
      <li>
        <b>
          {format(a)}x + {format(b)} - {format(b)} = {format(c)} - {format(b)}
        </b>
        <span>Subtract {format(b)} from both sides</span>
      </li>
      <li>
        <b>
          {format(a)}x = {format(c - b)}
        </b>
        <span>Simplify</span>
      </li>
      <li>
        <b>
          {format(a)}x / {format(a)} = {format(c - b)} / {format(a)}
        </b>
        <span>Divide both sides by {format(a)}</span>
      </li>
      <li className={solved ? "solution" : ""}>
        <b>x = {format(model.solution)}</b>
        <span>Solution</span>
      </li>
    </ol>
  );
}

function BalanceModel({ model }: { model: EquationModel }) {
  const left = [
    `${format(model.leftCoefficient)}x`,
    model.leftConstant >= 0
      ? `+ ${format(model.leftConstant)}`
      : format(model.leftConstant),
  ];
  const right = [
    model.rightCoefficient
      ? `${format(model.rightCoefficient)}x`
      : format(model.rightConstant),
  ];
  if (model.rightCoefficient && model.rightConstant)
    right.push(
      model.rightConstant >= 0
        ? `+ ${format(model.rightConstant)}`
        : format(model.rightConstant),
    );
  return <LessonBalanceGraph left={left} right={right} />;
}
const EQUATION_VIEW = {
  xMin: -115 / 28,
  xMax: (350 - 115) / 28,
  yMin: (235 - 365) / 14,
  yMax: 235 / 14,
};
function EquationGraph({ model }: { model: EquationModel }) {
  const [view, setView] = useState(EQUATION_VIEW);
  // Retain the original invalid-input reference plot and identify it explicitly.
  const m = model.valid
    ? model
    : {
        ...model,
        left: "2x + 3",
        right: "11",
        solution: 4,
        solvedY: 11,
        leftCoefficient: 2,
        leftConstant: 3,
        rightCoefficient: 0,
        rightConstant: 11,
      };
  return (
    <LessonCartesianGraph
      title="Equation lines and solution intersection"
      description={model.valid ? undefined : "Reference example: 2x + 3 = 11"}
      view={view}
      onViewChange={setView}
      onResetView={() => setView(EQUATION_VIEW)}
      series={[
        {
          id: "left",
          label: `y = ${m.left}`,
          color: "#7040e8",
          points: [
            { x: -4, y: -4 * m.leftCoefficient + m.leftConstant },
            { x: 7, y: 7 * m.leftCoefficient + m.leftConstant },
          ],
        },
        {
          id: "right",
          label: `y = ${m.right}`,
          color: "#168fe7",
          points: [
            { x: -4, y: -4 * m.rightCoefficient + m.rightConstant },
            { x: 7, y: 7 * m.rightCoefficient + m.rightConstant },
          ],
        },
        {
          id: "guide",
          label: "Solution projection",
          color: "#26344d",
          dashed: true,
          points: [
            { x: m.solution, y: m.solvedY },
            { x: m.solution, y: 0 },
          ],
        },
      ]}
      annotations={[
        {
          id: "intersection",
          x: m.solution,
          y: m.solvedY,
          label: `(${format(m.solution)}, ${format(m.solvedY)})`,
          color: "#7040e8",
        },
      ]}
    />
  );
}
