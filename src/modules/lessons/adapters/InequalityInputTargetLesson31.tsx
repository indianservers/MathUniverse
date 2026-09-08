import nerdamer from "nerdamer";
import "nerdamer/Algebra";
import { Check, CircleAlert, RotateCcw, Share2, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { LessonAdapterProps } from "../types";
import { LessonCartesianGraph, type LessonGraphSeries } from "../graphs/LessonCartesianGraph";
import { LessonNumberLineGraph } from "../graphs/LessonNumberLineGraph";
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
) => { evaluate: () => { text: () => string; toString: () => string } };
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
        .text(),
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
  const [graphReset,setGraphReset]=useState(0);
  const [input, setInput] = useState("2x + 3 < 11"),
    [shareState, setShareState] = useState("Share"),
    [actions, setActions] = useState(0);
  const model = useMemo(() => parse(input), [input]);
  const touch = () => {
    setActions((value) => value + 1);
    onInteraction();
  };
  const reset = () => {
    setGraphReset(value=>value+1);
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
              <ComparisonGraph key={`${resetToken}-${graphReset}`} model={model} />
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


const COMPARISON_VIEW={xMin:-145/20,xMax:(340-145)/20,yMin:(185-285)/8,yMax:185/8};
function graphModel(model:Model):Model {
 return model.valid?model:{...model,leftA:2,leftB:3,rightA:0,rightB:11,boundary:4,left:'2x + 3',right:'11',solutionOperator:'<',inclusive:false};
}
function NumberLine({model}:{model:Model}) {
 const m=graphModel(model),min=(12-150)/17,max=(338-150)/17;
 const regions=m.solutionOperator==='='?[]:[{id:'solution',start:m.solutionOperator.startsWith('<')?min:m.boundary,end:m.solutionOperator.startsWith('<')?m.boundary:max,color:'#0875ef',label:`x ${displayOperator(m.solutionOperator)} ${format(m.boundary)}`}];
 return <LessonNumberLineGraph title={model.valid?'Inequality solution on number line':'Reference example: x < 4'} min={min} max={max} regions={regions} boundary={{value:m.boundary,included:m.inclusive,color:m.inclusive?'#0875ef':'#e38300'}}/>;
}
function ComparisonGraph({model}:{model:Model}) {
 const [view,setView]=useState(COMPARISON_VIEW),m=graphModel(model),y=m.leftA*m.boundary+m.leftB;
 const start=m.solutionOperator.startsWith('<')?view.xMin:Math.max(view.xMin,m.boundary),end=m.solutionOperator.startsWith('<')?Math.min(view.xMax,m.boundary):view.xMax;
 const series:LessonGraphSeries[]=[];
 if(m.solutionOperator!=='='&&end>start)series.push({id:'solution-region',label:`x ${displayOperator(m.solutionOperator)} ${format(m.boundary)}`,color:'#48bdd7',kind:'region',points:[{x:start,y:view.yMin},{x:end,y:view.yMin},{x:end,y:view.yMax},{x:start,y:view.yMax}]});
 series.push({id:'left',label:`y = ${m.left}`,color:'#0875ef',points:[{x:-6,y:-6*m.leftA+m.leftB},{x:8,y:8*m.leftA+m.leftB}]},{id:'right',label:`y = ${m.right}`,color:'#e28a00',points:[{x:-6,y:-6*m.rightA+m.rightB},{x:8,y:8*m.rightA+m.rightB}]});
 return <LessonCartesianGraph title="Graph comparison and inequality region" description={model.valid?`Highlighted x-values satisfy x ${displayOperator(m.solutionOperator)} ${format(m.boundary)}`:'Reference example: 2x + 3 < 11'} view={view} onViewChange={setView} onResetView={()=>setView(COMPARISON_VIEW)} series={series} annotations={[{id:'boundary',x:m.boundary,y,label:`(${format(m.boundary)}, ${format(y)})`,color:m.inclusive?'#0875ef':'#e28a00',included:m.inclusive}]}/>;
}
