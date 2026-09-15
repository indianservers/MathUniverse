import nerdamer from "nerdamer";
import "nerdamer/Algebra";
import "nerdamer/Solve";
import {
  Check,
  Code2,
  Pencil,
  RotateCcw,
  Share2,
  Sparkles,
  X,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import type { LessonAdapterProps } from "../types";
import { LessonCartesianGraph } from "../graphs/LessonCartesianGraph";
import { lessonGraphZeroCrossingConverges } from "../graphs/lessonGraphGeometry";
import "./AlgebraicInputTargetLesson28.css";
import { LessonTopicStudyBoard } from "../components/LessonTopicStudyBoard";


type Parsed = {
  name: string;
  variable: string;
  expression: string;
  valid: boolean;
  checks: boolean[];
  error: string;
};
const GRAPH_VIEW = {
  xMin: -233 / 34,
  xMax: (500 - 233) / 34,
  yMin: (143 - 280) / 19,
  yMax: 143 / 19,
};
const engine = nerdamer as unknown as (
  expression: string,
  substitutions?: Record<string, string>,
) => { evaluate: () => { text?: () => string; toString: () => string } };
function parseInput(input: string): Parsed {
  let parenthesisDepth = 0;
  const balanced =
      [...input].every((char) => {
        if (char === "(") parenthesisDepth += 1;
        if (char === ")") parenthesisDepth -= 1;
        return parenthesisDepth >= 0;
      }) && parenthesisDepth === 0,
    match = input.match(
      /^\s*([A-Za-z]\w*)\s*\(\s*([A-Za-z])\s*\)\s*=\s*(.+)\s*$/,
    ),
    syntax = /^[A-Za-z0-9_()+\-*/^=.\s]+$/.test(input),
    name = match?.[1] ?? "",
    variable = match?.[2] ?? "",
    expression = match?.[3] ?? "";
  const symbols = expression.match(/[A-Za-z]+/g) ?? [],
    single =
      !!variable &&
      symbols.every(
        (symbol) =>
          symbol === variable ||
          ["sin", "cos", "tan", "sqrt", "abs", "log", "exp"].includes(symbol),
      );
  let valid = !!match && balanced && syntax && single,
    error = "";
  if (valid) {
    try {
      engine(expression, { [variable]: "1" })
        .evaluate()
        .toString();
    } catch {
      valid = false;
      error = "Expression could not be evaluated.";
    }
  } else
    error = !match
      ? "Use function notation such as f(x) = x^2 - 4."
      : !balanced
        ? "Parentheses are not balanced."
        : !syntax
          ? "Unsupported symbol detected."
          : "Use one variable consistently.";
  return {
    name,
    variable,
    expression,
    valid,
    checks: [
      syntax && !!match,
      !!name,
      /^[A-Za-z0-9_()+\-*/^.\s]+$/.test(expression),
      balanced,
      single,
    ],
    error,
  };
}
function evaluate(parsed: Parsed, x: number) {
  if (!parsed.valid) return NaN;
  try {
    const result = engine(parsed.expression, {
      [parsed.variable]: String(x),
    }).evaluate();
    // Nerdamer's toString() may be a fraction, e.g. -399/100; text() is decimal.
    const value = Number(result.text ? result.text() : result.toString());
    return Number.isFinite(value) ? value : NaN;
  } catch {
    return NaN;
  }
}
function format(value: number) {
  if (!Number.isFinite(value)) return "undefined";
  const rounded = Math.round(value * 100) / 100;
  return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(2);
}

function PrettyExpression({ expression }: { expression: string }) {
  return (
    <>
      {expression
        .split(/(\^[0-9]+)/)
        .map((part, index) =>
          part.startsWith("^") ? (
            <sup key={`${part}-${index}`}>{part.slice(1)}</sup>
          ) : (
            part
          ),
        )}
    </>
  );
}

export default function AlgebraicInputTargetLesson28({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [input, setInput] = useState("f(x) = x^2 - 4"),
    [graphCount, setGraphCount] = useState(0),
    [editing, setEditing] = useState(false),
    [shareState, setShareState] = useState("Share"),
    [actions, setActions] = useState(0);
  const [graphView, setGraphView] = useState(GRAPH_VIEW);
  const inputRef = useRef<HTMLInputElement>(null),
    parsed = useMemo(() => parseInput(input), [input]);
  const samples = useMemo(
    () =>
      Array.from({ length: 121 }, (_, index) => {
        const x = -6 + index * 0.1;
        return { x, y: evaluate(parsed, x) };
      }).filter((point) => Number.isFinite(point.y)),
    [parsed],
  );
  const breakBefore = useMemo(
    () =>
      samples.map((point, index) => {
        if (index === 0) return false;
        const previous = samples[index - 1];
        return (
          point.x - previous.x > 0.100001 ||
          (previous.y * point.y < 0 &&
            !lessonGraphZeroCrossingConverges(
              (x) => evaluate(parsed, x),
              previous,
              point,
            ))
        );
      }),
    [samples, parsed],
  );
  const roots = useMemo(() => {
    const found: number[] = [];
    for (let index = 1; index < samples.length; index++) {
      const a = samples[index - 1],
        b = samples[index];
      if (Math.abs(a.y) < 0.02) found.push(a.x);
      else if (!breakBefore[index] && a.y * b.y < 0)
        found.push(a.x + ((0 - a.y) * (b.x - a.x)) / (b.y - a.y));
    }
    return found
      .filter(
        (value, index, array) =>
          index === 0 || Math.abs(value - array[index - 1]) > 0.15,
      )
      .slice(0, 3);
  }, [samples, breakBefore]);
  const vertex = useMemo(
      () =>
        samples.reduce(
          (best, current) => (current.y < best.y ? current : best),
          samples[0] ?? { x: 0, y: 0 },
        ),
      [samples],
    ),
    yIntercept = evaluate(parsed, 0);
  const touch = () => {
    setActions((value) => value + 1);
    onInteraction();
  };
  const reset = () => {
    setGraphView(GRAPH_VIEW);
    setInput("f(x) = x^2 - 4");
    setGraphCount(0);
    setEditing(false);
    setShareState("Share");
    setActions(0);
    onInteraction();
  };
  useEffect(() => {
    setGraphView(GRAPH_VIEW);
    setInput("f(x) = x^2 - 4");
    setGraphCount(0);
    setEditing(false);
    setShareState("Share");
    setActions(0);
  }, [resetToken]);
  const share = async () => {
    try {
      await navigator.clipboard?.writeText(input);
      setShareState("Copied");
    } catch {
      setShareState("Ready");
    }
    touch();
  };
  const edit = () => {
    setEditing(true);
    inputRef.current?.focus();
    touch();
  };
  return (
    <div
      className="algebraic-input-page"
      data-testid="algebra-mockup-0028"
      data-dedicated-lesson="28"
      data-object-model="parsed-function-syntax-validation-sampled-graph-root-vertex-key-point-model"
      data-valid={parsed.valid}
      data-name={parsed.name}
      data-variable={parsed.variable}
      data-expression={parsed.expression}
      data-graph-count={graphCount}
      data-editing={editing}
      data-actions={actions}
    >
      <nav className="input-breadcrumb">
        <a href="/">←</a>
        <a href="/">Home</a>
        <span>›</span>
        <a href="/lessons">Lessons</a>
        <span>›</span>
        <a href="/lessons/core-workspaces">Core Workspaces</a>
        <span>›</span>
        <b>28 Algebraic Input</b>
      </nav>
      <section className="input-surface">
        <header className="input-header">
          <div>
            <h1>Algebraic Input</h1>
            <p>Construct objects from notation.</p>
            <nav>
              <b>♙ Foundational-Advanced</b>
              <b>ϟ Exploration Lab</b>
              <b>▣ Algebra View / Input Bar</b>
              <b>◴ 6-10 min</b>
            </nav>
          </div>
          <aside>
            <button type="button" onClick={touch}>
              ⌁ English (English)⌄
            </button>
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
        <section className="input-entry">
          <h2>Algebra input</h2>
          <label
            className={`${parsed.valid ? "valid" : "invalid"} ${!editing && parsed.valid ? "previewing" : ""}`}
          >
            <input
              ref={inputRef}
              aria-label="Algebra function input"
              value={input}
              onFocus={() => setEditing(true)}
              onChange={(event) => {
                setInput(event.target.value);
                setEditing(true);
                touch();
              }}
            />
            {!editing && parsed.valid ? (
              <span className="input-math-preview" aria-hidden="true">
                <PrettyExpression expression={input} />
              </span>
            ) : null}
            <button
              type="button"
              aria-label="Clear algebra input"
              onClick={() => {
                setInput("");
                setEditing(true);
                touch();
              }}
            >
              <X />
            </button>
          </label>
          <p className={parsed.valid ? "valid" : "invalid"}>
            {parsed.valid ? (
              <>
                <Check />
                Valid expression
              </>
            ) : (
              parsed.error
            )}
          </p>
        </section>
        <main className="input-main">
          <section className="input-left">
            <section className="parsed-graph">
              <h2>Parsed structure</h2>
              <dl>
                <dt>Name</dt>
                <dd>{parsed.name || "?"}</dd>
                <dt>Variable</dt>
                <dd>{parsed.variable || "?"}</dd>
                <dt>Operation</dt>
                <dd>
                  <PrettyExpression expression={parsed.expression || "?"} />
                </dd>
              </dl>
              <hr />
              <h2>Graph preview</h2>
              <LessonCartesianGraph
                title="Graph preview"
                xLabel={parsed.variable || "x"}
                view={graphView}
                onViewChange={setGraphView}
                onResetView={() => setGraphView(GRAPH_VIEW)}
                legend={
                  parsed.valid
                    ? [
                        {
                          id: "function",
                          label: `${parsed.name}(${parsed.variable}) = ${parsed.expression}`,
                          color: "#0875ef",
                        },
                      ]
                    : []
                }
                series={
                  parsed.valid
                    ? [
                        {
                          id: "function",
                          label: parsed.expression,
                          color: "#0875ef",
                          points: samples.flatMap((point, index) =>
                            breakBefore[index] ? [null, point] : [point],
                          ),
                        },
                      ]
                    : []
                }
                annotations={
                  parsed.valid && samples.length
                    ? [
                        ...roots.map((x, index) => ({
                          id: `root-${index}`,
                          x,
                          y: 0,
                          label: `(${format(x)}, 0)`,
                          color: "#0875ef",
                        })),
                        {
                          id: "vertex",
                          ...vertex,
                          label: `(${format(vertex.x)}, ${format(vertex.y)})`,
                          color: "#0875ef",
                        },
                      ]
                    : []
                }
              />
<footer>
                <span>
                  Roots:&nbsp;{" "}
                  {roots.length ? roots.map(format).join(" and ") : "none"}
                </span>
                <span>
                  Vertex:&nbsp; ({format(vertex.x)}, {format(vertex.y)})
                </span>
                <span>y-intercept:&nbsp; {format(yIntercept)}</span>
              </footer>
            </section>
            <section className="key-points">
              <h2>Evaluate at key points</h2>
              <div>
                {[-2, 0, 2].map((value) => (
                  <b key={value}>
                    {parsed.name || "f"}({value}) ={" "}
                    <span>{format(evaluate(parsed, value))}</span>
                  </b>
                ))}
              </div>
            </section>
          </section>
          <aside className="input-side">
            <section className="syntax-card">
              <h2>
                Syntax hints <Code2 />
              </h2>
              <ul>
                <li>
                  <b>*</b>
                  <span>Use&nbsp; * &nbsp;for multiplication.</span>
                </li>
                <li>
                  <b>^</b>
                  <span>Use&nbsp; ^ &nbsp;for powers.</span>
                </li>
                <li>
                  <b>()</b>
                  <span>Use parentheses ( ) for grouping.</span>
                </li>
              </ul>
              <p>
                Example:&nbsp; <b>3*x^2 + 2*x - 5</b>
              </p>
            </section>
            <section className="validation-card">
              <h2>Validation checklist</h2>
              {[
                "Expression is syntactically valid",
                "Includes a function name",
                "Uses supported operators",
                "Balanced parentheses",
                "Single variable detected",
              ].map((label, index) => (
                <p
                  className={parsed.checks[index] ? "valid" : "invalid"}
                  key={label}
                >
                  <Check />
                  {label}
                </p>
              ))}
            </section>
            <section className="input-actions">
              <button
                type="button"
                disabled={!parsed.valid}
                onClick={() => {
                  setGraphCount((value) => value + 1);
                  setEditing(false);
                  touch();
                }}
              >
                ⌁ Create graph
              </button>
              <button type="button" onClick={edit}>
                <Pencil />
                Edit input
              </button>
            </section>
          </aside>
        </main>
        <nav className="input-neighbors">
          <a href="/lessons/core-workspaces/27-dynamic-labels">
            ←
            <span>
              <small>Previous</small>
              <b>Dynamic Labels</b>
            </span>
          </a>
          <a href="/lessons/core-workspaces/29-object-redefinition">
            <span>
              <small>Next</small>
              <b>Object Redefinition</b>
            </span>
            →
          </a>
        </nav>
      </section>
      <footer className="input-footer">
        <b>
          <Sparkles />
          Math Universe
        </b>
        <p>
          Interactive math labs, visual proofs, NCERT explorations, graphing,
          CAS-style tools, and classroom-ready activities.
        </p>
        <nav>
          <button type="button" onClick={touch}>
            Sitemap
          </button>
          <button type="button" onClick={touch}>
            Docs
          </button>
          <button type="button" onClick={touch}>
            About
          </button>
        </nav>
      </footer>
      <LessonTopicStudyBoard lessonId={28} alwaysVisible onInteraction={onInteraction} />
    </div>
  );
}
