import nerdamer from "nerdamer";
import "nerdamer/Algebra";
import { Check, FlaskConical, Lightbulb, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { LessonAdapterProps } from "../types";
import "./EquationInputTargetLesson30.css";

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
) => { evaluate: () => { toString: () => string } };

function evaluate(expression: string, x: number) {
  try {
    const normalized = expression.replace(/(\d)\s*x/gi, "$1*x");
    const value = Number(
      engine(normalized, { x: String(x) })
        .evaluate()
        .toString(),
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
              <EquationGraph model={model} />
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
    </div>
  );
}

function BalanceModel({ model }: { model: EquationModel }) {
  return (
    <div className="balance-model">
      <div className="beam">
        <i></i>
        <b>=</b>
      </div>
      <div className="pan left">
        <span>{format(model.leftCoefficient)}x</span>
        <span>
          {model.leftConstant >= 0
            ? `+ ${format(model.leftConstant)}`
            : format(model.leftConstant)}
        </span>
      </div>
      <div className="pan right">
        <span>
          {model.rightCoefficient
            ? `${format(model.rightCoefficient)}x`
            : format(model.rightConstant)}
        </span>
        {model.rightCoefficient && model.rightConstant ? (
          <span>
            {model.rightConstant >= 0
              ? `+ ${format(model.rightConstant)}`
              : format(model.rightConstant)}
          </span>
        ) : null}
      </div>
      <div className="stand"></div>
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

function EquationGraph({ model }: { model: EquationModel }) {
  const safeModel = model.valid
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
  const map = (point: { x: number; y: number }) => ({
    x: 115 + point.x * 28,
    y: 235 - point.y * 14,
  });
  const linePath = (a: number, b: number) => {
    const start = map({ x: -4, y: a * -4 + b }),
      end = map({ x: 7, y: a * 7 + b });
    return `M${start.x},${start.y}L${end.x},${end.y}`;
  };
  const intersection = map({ x: safeModel.solution, y: safeModel.solvedY });
  return (
    <svg
      viewBox="0 0 350 365"
      role="img"
      aria-label="Equation lines and solution intersection"
    >
      <defs>
        <pattern
          id="equation-grid"
          width="28"
          height="56"
          patternUnits="userSpaceOnUse"
        >
          <path d="M28 0H0V56" fill="none" stroke="#dce3ea" />
        </pattern>
      </defs>
      <rect width="350" height="365" fill="url(#equation-grid)" />
      <line className="axis" x1="4" y1="235" x2="345" y2="235" />
      <line className="axis" x1="115" y1="4" x2="115" y2="360" />
      <path
        className="left-line"
        d={linePath(safeModel.leftCoefficient, safeModel.leftConstant)}
      />
      <path
        className="right-line"
        d={linePath(safeModel.rightCoefficient, safeModel.rightConstant)}
      />
      <line
        className="guide"
        x1={intersection.x}
        y1={intersection.y}
        x2={intersection.x}
        y2="235"
      />
      <circle cx={intersection.x} cy={intersection.y} r="6" />
      <text x={intersection.x + 8} y={intersection.y + 25}>
        ({format(safeModel.solution)}, {format(safeModel.solvedY)})
      </text>
      <g className="line-label left">
        <rect x="270" y="8" width="75" height="37" rx="5" />
        <text x="278" y="31">
          y = {safeModel.left}
        </text>
      </g>
      <g className="line-label right">
        <rect x="288" y="95" width="57" height="36" rx="5" />
        <text x="296" y="118">
          y = {safeModel.right}
        </text>
      </g>
    </svg>
  );
}
