import nerdamer from "nerdamer";
import "nerdamer/Algebra";
import { Check, CircleAlert, RefreshCw, Sparkles, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { LessonAdapterProps } from "../types";
import "./ObjectRedefinitionTargetLesson29.css";

type Point = { x: number; y: number };
const engine = nerdamer as unknown as (
  expression: string,
  substitutions?: Record<string, string>,
) => { evaluate: () => { toString: () => string } };

function calculate(expression: string, x: number) {
  try {
    const result = Number(
      engine(expression, { x: String(x) })
        .evaluate()
        .toString(),
    );
    return Number.isFinite(result) ? result : NaN;
  } catch {
    return NaN;
  }
}

function isValidRule(expression: string) {
  if (!expression.trim() || !/^[A-Za-z0-9_()+\-*/^.\s]+$/.test(expression))
    return false;
  let depth = 0;
  if (
    ![...expression].every((character) => {
      if (character === "(") depth += 1;
      if (character === ")") depth -= 1;
      return depth >= 0;
    }) ||
    depth !== 0
  )
    return false;
  try {
    engine(expression, { x: "2" }).evaluate().toString();
    return true;
  } catch {
    return false;
  }
}

function format(value: number) {
  if (!Number.isFinite(value)) return "undefined";
  const rounded = Math.round(value * 100) / 100;
  return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(2);
}

function PrettyRule({ expression }: { expression: string }) {
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

export default function ObjectRedefinitionTargetLesson29({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [name, setName] = useState("f");
  const [oldRule, setOldRule] = useState("x + 1");
  const [rule, setRule] = useState("x^2 - 1");
  const [draft, setDraft] = useState("x^2 - 1");
  const [revision, setRevision] = useState(1);
  const [actions, setActions] = useState(0);
  const valid = isValidRule(draft);
  const oldA = calculate(oldRule, 2),
    oldB = calculate(oldRule, 0);
  const newA = calculate(rule, 2),
    newB = calculate(rule, 0);
  const oldSamples = useMemo(
    () =>
      Array.from({ length: 81 }, (_, index) => {
        const x = -4 + index * 0.1;
        return { x, y: calculate(oldRule, x) };
      }).filter((point) => Number.isFinite(point.y)),
    [oldRule],
  );
  const newSamples = useMemo(
    () =>
      Array.from({ length: 81 }, (_, index) => {
        const x = -4 + index * 0.1;
        return { x, y: calculate(rule, x) };
      }).filter((point) => Number.isFinite(point.y)),
    [rule],
  );
  const touch = () => {
    setActions((value) => value + 1);
    onInteraction();
  };
  useEffect(() => {
    setName("f");
    setOldRule("x + 1");
    setRule("x^2 - 1");
    setDraft("x^2 - 1");
    setRevision(1);
    setActions(0);
  }, [resetToken]);
  const redefine = () => {
    if (!valid) return;
    setOldRule(rule);
    setRule(draft);
    setRevision((value) => value + 1);
    touch();
  };

  return (
    <div
      className="redefinition-page"
      data-testid="algebra-mockup-0029"
      data-dedicated-lesson="29"
      data-object-model="preserved-object-identity-executable-old-new-rule-dependent-output-dual-graph-dependency-tree-model"
      data-name={name}
      data-old-rule={oldRule}
      data-rule={rule}
      data-draft={draft}
      data-valid={valid}
      data-a={format(newA)}
      data-b={format(newB)}
      data-revision={revision}
      data-actions={actions}
    >
      <nav className="redefinition-breadcrumb">
        <a href="/">←</a>
        <a href="/">Home</a>
        <span>›</span>
        <a href="/lessons">Lessons</a>
        <span>›</span>
        <a href="/lessons/core-workspaces">Core Workspaces</a>
        <span>›</span>
        <b>29 Object Redefinition</b>
      </nav>
      <section className="redefinition-surface">
        <header className="redefinition-header">
          <div className="redefinition-tags">
            <b>CORE WORKSPACES</b>
            <b>ALGEBRA AND DYNAMIC VARIABLES</b>
          </div>
          <h1>Object Redefinition</h1>
          <p>Modify constructions without rebuilding.</p>
          <aside>
            <b>♧ Interactive</b>
            <b>◷ 6-10 min</b>
          </aside>
        </header>
        <main className="redefinition-main">
          <section className="redefinition-left">
            <section className="definition-card">
              <h2>Define the primary object {name}</h2>
              <div>
                <label>
                  Object name
                  <input
                    aria-label="Object name"
                    value={name}
                    maxLength={8}
                    onChange={(event) => {
                      setName(event.target.value.replace(/[^A-Za-z0-9_]/g, ""));
                      touch();
                    }}
                  />
                </label>
                <label>
                  Definition (enter a rule for f(x))
                  <span className={valid ? "rule-field" : "rule-field invalid"}>
                    <input
                      aria-label="New object definition"
                      value={draft}
                      onChange={(event) => {
                        setDraft(event.target.value);
                        touch();
                      }}
                    />
                    <button
                      type="button"
                      aria-label="Clear object definition"
                      onClick={() => {
                        setDraft("");
                        touch();
                      }}
                    >
                      <X />
                    </button>
                  </span>
                </label>
              </div>
              <p
                className={
                  valid ? "definition-note" : "definition-note invalid"
                }
              >
                <CircleAlert />
                {valid ? (
                  <>
                    Name <b>{name || "f"}</b> preserved; definition changed.
                  </>
                ) : (
                  <>Enter a valid rule in x before redefining.</>
                )}
              </p>
            </section>
            <section className="graph-comparison">
              <RuleGraph
                kind="before"
                title="BEFORE (Original)"
                name={name || "f"}
                rule={oldRule}
                samples={oldSamples}
                pointA={oldA}
                pointB={oldB}
              />
              <div className="comparison-arrow">→</div>
              <RuleGraph
                kind="after"
                title="AFTER (Redefined)"
                name={name || "f"}
                rule={rule}
                samples={newSamples}
                pointA={newA}
                pointB={newB}
              />
            </section>
            <section className="dependent-table">
              <header>
                <h2>
                  Dependent outputs <span>(auto-updated)</span>
                </h2>
                <button type="button" onClick={touch}>
                  View as table
                </button>
              </header>
              <div className="dependent-head">
                <b></b>
                <b></b>
                <b>BEFORE (Old definition)</b>
                <b>AFTER (New definition)</b>
                <b></b>
              </div>
              {[
                [
                  "A",
                  "A = f(2)",
                  `A = f(2) = ${format(oldA)}`,
                  `A = f(2) = ${format(newA)}`,
                ],
                [
                  "B",
                  "B = f(0)",
                  `B = f(0) = ${format(oldB)}`,
                  `B = f(0) = ${format(newB)}`,
                ],
                [
                  "▦",
                  "Value table",
                  "Values recomputed for f(x)",
                  "Values recomputed for f(x)",
                ],
                [
                  "⌁",
                  "Graph of f",
                  `Line y = ${oldRule}`,
                  `Parabola y = ${rule}`,
                ],
              ].map((row) => (
                <div className="dependent-row" key={row[1]}>
                  <b>{row[0]}</b>
                  <span>{row[1]}</span>
                  <span>{row[2]}</span>
                  <span>{row[3]}</span>
                  <Check />
                </div>
              ))}
            </section>
            <section className="dependency-tree">
              <h2>Dependency tree</h2>
              <div>
                <Tree name={name || "f"} tone="old" />
                <b className="tree-arrow">Redefine f&nbsp;&nbsp; →</b>
                <Tree name={name || "f"} tone="new" />
              </div>
              <p>
                Redefining {name || "f"} refreshes all dependents automatically.
              </p>
            </section>
          </section>
          <aside className="redefinition-side">
            <section className="redefine-card">
              <h2>Redefine {name || "f"}</h2>
              <div className="rule-box old">
                <b>
                  Old: {name || "f"}(x) = <PrettyRule expression={oldRule} />
                </b>
                <p>
                  {name || "f"}(x) = <PrettyRule expression={oldRule} />
                </p>
              </div>
              <span className="down-arrow">↓</span>
              <div className="rule-box new">
                <b>
                  New: {name || "f"}(x) ={" "}
                  <PrettyRule expression={draft || "?"} />
                </b>
                <p>
                  {name || "f"}(x) = <PrettyRule expression={draft || "?"} />
                </p>
              </div>
              <button type="button" disabled={!valid} onClick={redefine}>
                <RefreshCw />
                Redefine {name || "f"}
              </button>
            </section>
            <section className="preserved-card">
              <CircleAlert />
              <p>
                <b>Name {name || "f"} preserved.</b>
                <span>Definition changed.</span>
              </p>
            </section>
            <section className="updated-card">
              <header>
                <h2>Updated dependents</h2>
                <b>4 updated</b>
              </header>
              {[
                `A = f(2) = ${format(newA)}`,
                `B = f(0) = ${format(newB)}`,
                "Value table",
                "Graph of f",
              ].map((label, index) => (
                <p key={label}>
                  <Check />
                  <span>
                    <b>{label}</b>
                    <small>
                      {index < 2
                        ? "Updated"
                        : index === 2
                          ? "Recomputed"
                          : "Redrawn"}
                    </small>
                  </span>
                </p>
              ))}
              <footer>
                All linked objects update
                <br />
                after redefining {name || "f"}.
              </footer>
            </section>
          </aside>
        </main>
        <nav className="redefinition-neighbors">
          <a href="/lessons/core-workspaces/28-algebraic-input">
            ←
            <span>
              <small>PREVIOUS</small>
              <b>Algebraic Input</b>
            </span>
          </a>
          <a href="/lessons/core-workspaces/30-equation-input">
            <span>
              <small>NEXT</small>
              <b>Equation Input</b>
            </span>
            →
          </a>
        </nav>
      </section>
      <footer className="redefinition-footer">
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
        <hr />
        <small>
          © 2026 INDIAN SERVERS PRIVATE LIMITED. NO RIGHT TO REPRODUCE IT.
          <br />
          <br />
          www.IndianServers.com&nbsp; info@IndianServers.com
        </small>
      </footer>
    </div>
  );
}

function RuleGraph({
  kind,
  title,
  name,
  rule,
  samples,
  pointA,
  pointB,
}: {
  kind: "before" | "after";
  title: string;
  name: string;
  rule: string;
  samples: Point[];
  pointA: number;
  pointB: number;
}) {
  const map = (point: Point) => ({
    x: 145 + point.x * 31,
    y: 132 - point.y * 27,
  });
  const path = samples
    .map((point, index) => {
      const mapped = map(point);
      return `${index ? "L" : "M"}${mapped.x.toFixed(1)},${mapped.y.toFixed(1)}`;
    })
    .join(" ");
  return (
    <section className={`rule-graph ${kind}`}>
      <header>
        <b>{title}</b>
        <span>
          {kind === "before" ? "Old" : "New"}: {name}(x) ={" "}
          <PrettyRule expression={rule} />
        </span>
      </header>
      <p>
        {name}(x) = <PrettyRule expression={rule} />
      </p>
      <svg
        viewBox="0 0 290 230"
        role="img"
        aria-label={`${title} graph of ${name}`}
      >
        <defs>
          <pattern
            id={`rule-grid-${kind}`}
            width="31"
            height="27"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M31 0H0V27"
              fill="none"
              stroke="#e1e7ed"
              strokeDasharray="4 3"
            />
          </pattern>
        </defs>
        <rect width="290" height="230" fill={`url(#rule-grid-${kind})`} />
        <line className="axis" x1="5" y1="132" x2="285" y2="132" />
        <line className="axis" x1="145" y1="4" x2="145" y2="226" />
        <path className="plot" d={path} />
        {[
          [2, pointA, "A"],
          [0, pointB, "B"],
        ].map(([x, y, label]) => {
          const point = map({ x: Number(x), y: Number(y) });
          return (
            <g key={label}>
              <line
                className="guide"
                x1={point.x}
                y1={point.y}
                x2={point.x}
                y2="132"
              />
              <circle cx={point.x} cy={point.y} r="4" />
              <text x={point.x + 9} y={point.y + 4}>
                {label}({x}, {format(Number(y))})
              </text>
            </g>
          );
        })}
      </svg>
    </section>
  );
}

function Tree({ name, tone }: { name: string; tone: "old" | "new" }) {
  return (
    <section className={`tree ${tone}`}>
      <b>{name}</b>
      <small>Primary object</small>
      <i></i>
      <div>
        {["A = f(2)", "B = f(0)", "Value table", "Graph of f"].map((label) => (
          <span key={label}>{label}</span>
        ))}
      </div>
    </section>
  );
}
