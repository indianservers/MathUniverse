import nerdamer from "nerdamer";
import "nerdamer/Algebra";
import { Check, CircleAlert, RotateCcw, Share2, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { LessonAdapterProps } from "../types";
import "./InequalityInputTargetLesson31.css";

type Operator = "<" | "<=" | ">" | ">=" | "=";
type Model = {
  left: string;
  right: string;
  inputOperator: Operator;
  solutionOperator: Operator;
  valid: boolean;
  boundary: number;
  inclusive: boolean;
  flipped: boolean;
  leftA: number;
  leftB: number;
  rightA: number;
  rightB: number;
  error: string;
};
const engine = nerdamer as unknown as (
  expression: string,
  substitutions?: Record<string, string>,
) => { evaluate: () => { toString: () => string } };
const displayOperator = (operator: Operator) =>
  operator === "<=" ? "≤" : operator === ">=" ? "≥" : operator;
const format = (value: number) =>
  Number.isFinite(value)
    ? Number.isInteger(Math.round(value * 100) / 100)
      ? String(Math.round(value * 100) / 100)
      : (Math.round(value * 100) / 100).toFixed(2)
    : "?";
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
function flip(operator: Operator): Operator {
  return (
    { "<": ">", "<=": ">=", ">": "<", ">=": "<=", "=": "=" } as Record<
      Operator,
      Operator
    >
  )[operator];
}
function compare(left: number, operator: Operator, right: number) {
  if (operator === "<") return left < right;
  if (operator === "<=") return left <= right;
  if (operator === ">") return left > right;
  if (operator === ">=") return left >= right;
  return Math.abs(left - right) < 1e-8;
}
function parse(input: string): Model {
  const match = input.match(/^\s*(.+?)\s*(<=|>=|<|>|=|≤|≥)\s*(.+?)\s*$/),
    empty: Model = {
      left: "",
      right: "",
      inputOperator: "<",
      solutionOperator: "<",
      valid: false,
      boundary: NaN,
      inclusive: false,
      flipped: false,
      leftA: NaN,
      leftB: NaN,
      rightA: NaN,
      rightB: NaN,
      error: "Enter two sides separated by an inequality operator.",
    };
  if (!match) return empty;
  const left = match[1],
    right = match[3],
    inputOperator = (
      match[2] === "≤" ? "<=" : match[2] === "≥" ? ">=" : match[2]
    ) as Operator;
  const l0 = evaluate(left, 0),
    l1 = evaluate(left, 1),
    l2 = evaluate(left, 2),
    r0 = evaluate(right, 0),
    r1 = evaluate(right, 1),
    r2 = evaluate(right, 2);
  if (![l0, l1, l2, r0, r1, r2].every(Number.isFinite))
    return {
      ...empty,
      left,
      right,
      inputOperator,
      error: "Both sides must be evaluable expressions in x.",
    };
  const leftA = l1 - l0,
    rightA = r1 - r0,
    a = leftA - rightA,
    b = l0 - r0,
    linear =
      Math.abs(l2 - (l0 + 2 * leftA)) < 1e-7 &&
      Math.abs(r2 - (r0 + 2 * rightA)) < 1e-7;
  if (!linear || Math.abs(a) < 1e-9)
    return {
      ...empty,
      left,
      right,
      inputOperator,
      leftA,
      leftB: l0,
      rightA,
      rightB: r0,
      error: linear
        ? "The comparison has no single boundary."
        : "This lab currently solves linear inequalities.",
    };
  const flipped = a < 0,
    solutionOperator = flipped ? flip(inputOperator) : inputOperator;
  return {
    left,
    right,
    inputOperator,
    solutionOperator,
    valid: true,
    boundary: -b / a,
    inclusive: ["<=", ">=", "="].includes(solutionOperator),
    flipped,
    leftA,
    leftB: l0,
    rightA,
    rightB: r0,
    error: "",
  };
}

export default function InequalityInputTargetLesson31({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [input, setInput] = useState("2x + 3 < 11"),
    [shareState, setShareState] = useState("Share"),
    [actions, setActions] = useState(0);
  const model = useMemo(() => parse(input), [input]);
  const touch = () => {
    setActions((value) => value + 1);
    onInteraction();
  };
  const reset = () => {
    setInput("2x + 3 < 11");
    setShareState("Share");
    setActions(0);
    onInteraction();
  };
  useEffect(() => {
    setInput("2x + 3 < 11");
    setShareState("Share");
    setActions(0);
  }, [resetToken]);
  const chooseOperator = (operator: Operator) => {
    const current = parse(input);
    setInput(
      `${current.left || "2x + 3"} ${operator} ${current.right || "11"}`,
    );
    touch();
  };
  const share = async () => {
    try {
      await navigator.clipboard?.writeText(input);
      setShareState("Copied");
    } catch {
      setShareState("Ready");
    }
    touch();
  };
  const solution = `x ${displayOperator(model.solutionOperator)} ${format(model.boundary)}`,
    points = [model.boundary - 1, model.boundary, model.boundary + 1];
  return (
    <div
      className="inequality-page"
      data-testid="algebra-mockup-0031"
      data-dedicated-lesson="31"
      data-object-model="parsed-affine-inequality-sign-reversal-open-closed-boundary-number-line-graph-region-test-point-model"
      data-valid={model.valid}
      data-input-operator={model.inputOperator}
      data-solution-operator={model.solutionOperator}
      data-boundary={format(model.boundary)}
      data-inclusive={model.inclusive}
      data-flipped={model.flipped}
      data-actions={actions}
    >
      <nav className="inequality-breadcrumb">
        <a href="/">←</a>
        <a href="/">Home</a>
        <span>›</span>
        <a href="/lessons">Lessons</a>
        <span>›</span>
        <a href="/lessons/core-workspaces">Core Workspaces</a>
        <span>›</span>
        <b>31 Inequality Input</b>
      </nav>
      <div className="inequality-layout">
        <section className="inequality-surface">
          <header className="inequality-header">
            <div className="inequality-tags">
              <b>CORE WORKSPACES</b>
              <b>ALGEBRA AND DYNAMIC VARIABLES</b>
            </div>
            <h1>Inequality Input</h1>
            <p>Explore solution regions.</p>
            <nav>
              <b>♙ Foundational-Advanced</b>
              <b>ϟ Exploration Lab</b>
              <b>▣ Algebra View / Input Bar</b>
              <b>◷ 6-10 min</b>
            </nav>
            <aside>
              <button type="button" onClick={reset}>
                <RotateCcw />
                Reset
              </button>
              <button type="button" onClick={() => void share()}>
                <Share2 />
                {shareState}
              </button>
            </aside>
          </header>
          <section className="inequality-entry">
            <h2>ENTER THE INEQUALITY</h2>
            <label className={model.valid ? "" : "invalid"}>
              <input
                aria-label="Inequality input"
                value={input}
                onChange={(event) => {
                  setInput(event.target.value);
                  touch();
                }}
              />
              <button
                type="button"
                aria-label="Clear inequality input"
                onClick={() => {
                  setInput("");
                  touch();
                }}
              >
                <X />
              </button>
            </label>
            {!model.valid ? <p>{model.error}</p> : null}
          </section>
          <main className="inequality-main">
            <section className="solve-panel">
              <h2>SOLVE THE INEQUALITY</h2>
              <div className="solve-step">
                <b>
                  {model.left} {displayOperator(model.inputOperator)}{" "}
                  {model.right}
                </b>
                <span>Given</span>
              </div>
              <i>↓</i>
              <div className="solve-step">
                <b>
                  {format(model.leftA - model.rightA)}x{" "}
                  {displayOperator(model.inputOperator)}{" "}
                  {format(model.rightB - model.leftB)}
                </b>
                <span>
                  Subtract {format(model.leftB)}
                  <br />
                  from both sides
                </span>
              </div>
              <i>↓</i>
              <div className="solve-step">
                <b>{solution}</b>
                <span>
                  Divide both sides
                  <br />
                  by {format(model.leftA - model.rightA)}
                </span>
              </div>
              <p>
                <CircleAlert />
                {model.flipped
                  ? "The sign reversed because the coefficient was negative."
                  : "Reverse the sign when dividing by a negative."}
              </p>
            </section>
            <section className="number-panel">
              <h2>SOLUTION ON NUMBER LINE</h2>
              <NumberLine model={model} />
              <p>
                {model.inclusive
                  ? "Closed circle means the boundary is included"
                  : `Open circle means ${format(model.boundary)} is not included`}
              </p>
              <footer>
                <small>SOLUTION</small>
                <b>{solution}</b>
              </footer>
            </section>
            <section className="comparison-panel">
              <h2>GRAPH COMPARISON</h2>
              <ComparisonGraph model={model} />
              <nav>
                <span>
                  <i></i>y = {model.left}
                </span>
                <span>
                  <i></i>y = {model.right}
                </span>
              </nav>
              <p>
                The line y = {model.left} is{" "}
                {model.solutionOperator.startsWith("<") ? "below" : "above"} y ={" "}
                {model.right} for {solution}.<br />
                At x = {format(model.boundary)}, they are equal, so{" "}
                {format(model.boundary)} is{" "}
                {model.inclusive ? "included" : "not included"}.
              </p>
            </section>
          </main>
          <section className="test-points">
            <header>
              <h2>TEST POINTS</h2>
              <span>Check points in the inequality.</span>
            </header>
            <div>
              {points.map((x, index) => {
                const left = evaluate(model.left, x),
                  right = evaluate(model.right, x),
                  pass =
                    model.valid && compare(left, model.inputOperator, right);
                return (
                  <article className={pass ? "pass" : "fail"} key={index}>
                    <b>x = {format(x)}</b>
                    <p>
                      {model.leftA
                        ? `${format(model.leftA)}(${format(x)}) ${model.leftB >= 0 ? "+" : "-"} ${format(Math.abs(model.leftB))}`
                        : model.left}{" "}
                      {displayOperator(model.inputOperator)} {model.right}
                    </p>
                    <p>
                      {format(left)} {displayOperator(model.inputOperator)}{" "}
                      {format(right)}
                    </p>
                    {pass ? <Check /> : <X />}
                    <strong>{pass ? "TRUE" : "FALSE"}</strong>
                  </article>
                );
              })}
            </div>
          </section>
        </section>
        <aside className="inequality-side">
          <section>
            <h2>SYNTAX HELP</h2>
            <p>Use &lt;, &gt;, ≤, ≥, = to compare two sides.</p>
            <p>Examples:</p>
            {["2x + 1 < 5", "x^2 - 4 >= 0", "3(x - 2) <= 9"].map((example) => (
              <button
                key={example}
                type="button"
                onClick={() => {
                  setInput(example);
                  touch();
                }}
              >
                •&nbsp; {example}
              </button>
            ))}
          </section>
          <section className="operators">
            <h2>OPERATORS</h2>
            <p>Strict vs. inclusive</p>
            <div>
              {(["<", "<=", ">", ">=", "="] as Operator[]).map((operator) => (
                <button
                  type="button"
                  className={model.inputOperator === operator ? "active" : ""}
                  key={operator}
                  onClick={() => chooseOperator(operator)}
                >
                  {displayOperator(operator)}
                </button>
              ))}
            </div>
          </section>
          <section>
            <h2>ABOUT THE SOLUTION</h2>
            <p>
              The solution includes all values of x that make the inequality
              true.
            </p>
          </section>
          <section className="inequality-summary">
            <h2>SOLUTION SUMMARY</h2>
            <p>
              The solution set is all real numbers{" "}
              {model.solutionOperator.startsWith("<")
                ? "less than"
                : "greater than"}{" "}
              {format(model.boundary)}.
            </p>
            <b>{solution}</b>
          </section>
        </aside>
      </div>
      <nav className="inequality-neighbors">
        <a href="/lessons/core-workspaces/30-equation-input">
          ←
          <span>
            <small>PREVIOUS</small>
            <b>Equation Input</b>
          </span>
        </a>
        <a href="/lessons/core-workspaces/32-lists">
          <span>
            <small>NEXT</small>
            <b>Lists</b>
          </span>
          →
        </a>
      </nav>
    </div>
  );
}

function NumberLine({ model }: { model: Model }) {
  const boundary = model.valid ? model.boundary : 4,
    operator = model.valid ? model.solutionOperator : "<",
    x = 150 + boundary * 17,
    left = operator.startsWith("<");
  return (
    <svg
      viewBox="0 0 350 120"
      role="img"
      aria-label="Inequality solution on number line"
    >
      <line className="base" x1="12" y1="55" x2="338" y2="55" />
      <line
        className="region"
        x1={left ? 12 : x}
        y1="55"
        x2={left ? x : 338}
        y2="55"
      />
      <path
        className="arrow"
        d={left ? "M12 55l10-7v14z" : "M338 55l-10-7v14z"}
      />
      <circle
        className={model.inclusive ? "closed" : "open"}
        cx={x}
        cy="55"
        r="9"
      />
      {[-6, -4, -2, 0, 2, 4, 6, 8, 10].map((value) => (
        <g key={value}>
          <line x1={150 + value * 17} y1="50" x2={150 + value * 17} y2="61" />
          <text x={145 + value * 17} y="86">
            {value}
          </text>
        </g>
      ))}
    </svg>
  );
}
function ComparisonGraph({ model }: { model: Model }) {
  const graphModel = model.valid
      ? model
      : {
          ...model,
          leftA: 2,
          leftB: 3,
          rightA: 0,
          rightB: 11,
          boundary: 4,
          left: "2x + 3",
          right: "11",
        },
    map = (x: number, y: number) => ({ x: 145 + x * 20, y: 185 - y * 8 }),
    path = (a: number, b: number) => {
      const p1 = map(-6, a * -6 + b),
        p2 = map(8, a * 8 + b);
      return `M${p1.x},${p1.y}L${p2.x},${p2.y}`;
    },
    point = map(
      graphModel.boundary,
      evaluate(graphModel.left, graphModel.boundary),
    );
  return (
    <svg
      viewBox="0 0 340 285"
      role="img"
      aria-label="Graph comparison and inequality region"
    >
      <defs>
        <pattern
          id="inequality-grid"
          width="40"
          height="32"
          patternUnits="userSpaceOnUse"
        >
          <path d="M40 0H0V32" fill="none" stroke="#dce4ea" />
        </pattern>
      </defs>
      <rect width="340" height="285" fill="url(#inequality-grid)" />
      <rect
        className="shade"
        x="25"
        y={point.y}
        width={Math.max(0, point.x - 25)}
        height={Math.max(0, 185 - point.y)}
      />
      <line className="axis" x1="15" y1="185" x2="330" y2="185" />
      <line className="axis" x1="145" y1="8" x2="145" y2="275" />
      <path
        className="left-line"
        d={path(graphModel.leftA, graphModel.leftB)}
      />
      <path
        className="right-line"
        d={path(graphModel.rightA, graphModel.rightB)}
      />
      <circle
        className={model.inclusive ? "closed" : "open"}
        cx={point.x}
        cy={point.y}
        r="7"
      />
      <text x={point.x + 8} y={point.y + 22}>
        ({format(graphModel.boundary)},{" "}
        {format(evaluate(graphModel.left, graphModel.boundary))})
      </text>
    </svg>
  );
}
