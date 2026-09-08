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
import "./AlgebraicInputTargetLesson28.css";

type Parsed = {
  name: string;
  variable: string;
  expression: string;
  valid: boolean;
  checks: boolean[];
  error: string;
};
type Sample = { x: number; y: number };
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
    const value = Number(
      engine(parsed.expression, { [parsed.variable]: String(x) })
        .evaluate()
        .toString(),
    );
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
  const roots = useMemo(() => {
    const found: number[] = [];
    for (let index = 1; index < samples.length; index++) {
      const a = samples[index - 1],
        b = samples[index];
      if (Math.abs(a.y) < 0.02) found.push(a.x);
      else if (a.y * b.y < 0)
        found.push(a.x + ((0 - a.y) * (b.x - a.x)) / (b.y - a.y));
    }
    return found
      .filter(
        (value, index, array) =>
          index === 0 || Math.abs(value - array[index - 1]) > 0.15,
      )
      .slice(0, 3);
  }, [samples]);
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
    setInput("f(x) = x^2 - 4");
    setGraphCount(0);
    setEditing(false);
    setShareState("Share");
    setActions(0);
    onInteraction();
  };
  useEffect(() => {
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
              <FunctionPlot samples={samples} roots={roots} vertex={vertex} />
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
    </div>
  );
}

function FunctionPlot({
  samples,
  roots,
  vertex,
}: {
  samples: Sample[];
  roots: number[];
  vertex: Sample;
}) {
  const map = (point: Sample) => ({
      x: 233 + point.x * 34,
      y: 143 - point.y * 19,
    }),
    path = samples
      .map((point, index) => {
        const p = map(point);
        return `${index ? "L" : "M"}${p.x.toFixed(1)},${p.y.toFixed(1)}`;
      })
      .join(" ");
  return (
    <svg
      className="function-preview"
      viewBox="0 0 500 280"
      role="img"
      aria-label="Parsed function graph preview"
    >
      <defs>
        <pattern
          id="input-grid"
          width="34"
          height="38"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M34 0H0V38"
            fill="none"
            stroke="#dce3ea"
            strokeDasharray="4 3"
          />
        </pattern>
      </defs>
      <rect width="500" height="280" fill="url(#input-grid)" />
      <line className="axis" x1="5" y1="143" x2="495" y2="143" />
      <line className="axis" x1="233" y1="4" x2="233" y2="276" />
      <path className="curve" d={path} />
      {roots.map((root) => {
        const p = map({ x: root, y: 0 });
        return (
          <g key={root}>
            <circle cx={p.x} cy={p.y} r="4" />
            <rect
              className="label-box"
              x={p.x - 29}
              y={p.y - 35}
              width="58"
              height="29"
              rx="6"
            />
            <text x={p.x - 21} y={p.y - 16}>
              ({format(root)}, 0)
            </text>
          </g>
        );
      })}
      <circle cx={map(vertex).x} cy={map(vertex).y} r="5" />
      <rect
        className="label-box"
        x={map(vertex).x + 8}
        y={map(vertex).y + 9}
        width="60"
        height="30"
        rx="6"
      />
      <text x={map(vertex).x + 16} y={map(vertex).y + 29}>
        ({format(vertex.x)}, {format(vertex.y)})
      </text>
      {[-6, -4, -2, 0, 2, 4, 6].map((value) => (
        <text className="tick" key={value} x={229 + value * 34} y="160">
          {value}
        </text>
      ))}
    </svg>
  );
}
