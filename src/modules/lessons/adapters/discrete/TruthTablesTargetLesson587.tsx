import { AlertTriangle, Check, Info, Lightbulb, Target } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { LessonAdapterProps } from "../../types";
import "./TruthTablesTargetLesson587.css";

type Op = "implies" | "and" | "or" | "iff";
const rows = [
  [true, true],
  [true, false],
  [false, true],
  [false, false],
] as const;
const ops: Record<
  Op,
  {
    symbol: string;
    words: string;
    result: (p: boolean, q: boolean) => boolean;
    rule: string;
  }
> = {
  implies: {
    symbol: "p → q",
    words: "If p, then q",
    result: (p, q) => !p || q,
    rule: "false only when p is true and q is false",
  },
  and: {
    symbol: "p ∧ q",
    words: "p and q",
    result: (p, q) => p && q,
    rule: "true only when both p and q are true",
  },
  or: {
    symbol: "p ∨ q",
    words: "p or q (inclusive)",
    result: (p, q) => p || q,
    rule: "false only when both p and q are false",
  },
  iff: {
    symbol: "p ↔ q",
    words: "p if and only if q",
    result: (p, q) => p === q,
    rule: "true when p and q have the same truth value",
  },
};
const tf = (value: boolean) => (value ? "T" : "F");

export default function TruthTablesTargetLesson587({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [p, setP] = useState(true),
    [q, setQ] = useState(false),
    [op, setOp] = useState<Op>("implies"),
    [tab, setTab] = useState("Interact"),
    [answers, setAnswers] = useState<string[]>(Array(12).fill("")),
    [graded, setGraded] = useState<boolean | null>(null),
    [actions, setActions] = useState(0);
  const reset = () => {
    setP(true);
    setQ(false);
    setOp("implies");
    setTab("Interact");
    setAnswers(Array(12).fill(""));
    setGraded(null);
    setActions(0);
  };
  useEffect(reset, [resetToken]);
  const act = (fn: () => void) => {
      fn();
      setActions((n) => n + 1);
      onInteraction();
    },
    model = ops[op],
    results = useMemo(() => rows.map(([a, b]) => model.result(a, b)), [model]),
    classification = results.every(Boolean)
      ? "Tautology"
      : results.every((v) => !v)
        ? "Contradiction"
        : "Contingent",
    activeRow = rows.findIndex(([a, b]) => a === p && b === q);
  const expected = rows.flatMap(([a, b]) => [tf(a), tf(b), tf(a || b)]),
    check = () =>
      act(() =>
        setGraded(answers.every((value, index) => value === expected[index])),
      );
  return (
    <section
      className="tt587-page"
      data-testid="discrete-mockup-0644"
      data-object-model="dedicated-propositional-truth-table-model"
      data-op={op}
      data-results={results.map(tf).join("")}
      data-classification={classification}
      data-active-row={activeRow}
      data-graded={graded === null ? "" : graded}
      data-actions={actions}
    >
      <header className="tt587-hero">
        <span>
          <b>DISCRETE AND APPLIED MATHEMATICS</b>
          <b>COMBINATORICS, GRAPH THEORY AND LOGIC</b>
        </span>
        <h1>587 Truth Tables</h1>
        <p>Evaluate logical expressions using truth tables.</p>
        <dl>
          <b>Level: Intermediate-Advanced</b>
          <b>Topic: Discrete Math Lab</b>
          <b>Tools: Spreadsheet + Scripting</b>
          <b>Time: 6-10 min</b>
        </dl>
      </header>
      <nav className="tt587-tabs">
        {["Interact", "Learn", "Worked Example", "Formula", "Practice"].map(
          (name) => (
            <button
              key={name}
              className={tab === name ? "active" : ""}
              onClick={() => act(() => setTab(name))}
            >
              {name}
            </button>
          ),
        )}
      </nav>
      {tab !== "Interact" && (
        <p className="tt587-note">
          <b>{tab}:</b> Each row assigns truth values, then evaluates the
          connective exactly.
        </p>
      )}
      <section className="tt587-lab">
        <aside>
          <h2>
            <i>1</i> Observe
          </h2>
          <p>Truth values for the basic statements.</p>
          <label>
            <span>
              <b>p</b>A statement
            </span>
            <button
              aria-label="Toggle p truth value"
              className={p ? "on" : ""}
              onClick={() => act(() => setP((v) => !v))}
            >
              {tf(p)}
            </button>
          </label>
          <label>
            <span>
              <b>q</b>Another statement
            </span>
            <button
              aria-label="Toggle q truth value"
              className={q ? "on" : ""}
              onClick={() => act(() => setQ((v) => !v))}
            >
              {tf(q)}
            </button>
          </label>
          <article>
            <Lightbulb />
            <b>Tip</b>
            <p>Toggle p and q to highlight their matching row instantly.</p>
          </article>
        </aside>
        <main>
          <h2>
            <i>2</i> Manipulate
          </h2>
          <p>Choose a compound statement and watch the truth table fill.</p>
          <div className="tt587-controls">
            <label>
              Choose a statement
              <select
                aria-label="Truth table statement"
                value={op}
                onChange={(e) => act(() => setOp(e.target.value as Op))}
              >
                {Object.entries(ops).map(([id, item]) => (
                  <option key={id} value={id}>
                    {item.symbol}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Proposition <small>(read in words)</small>
              <output>{model.words}</output>
            </label>
          </div>
          <div className="tt587-table-row">
            <table>
              <thead>
                <tr>
                  <th>p</th>
                  <th>q</th>
                  <th>{model.symbol}</th>
                </tr>
              </thead>
              <tbody>
                {rows.map(([a, b], index) => (
                  <tr
                    key={index}
                    className={index === activeRow ? "active" : ""}
                  >
                    <td>
                      <b className={a ? "true" : "false"}>{tf(a)}</b>
                    </td>
                    <td>
                      <b className={b ? "true" : "false"}>{tf(b)}</b>
                    </td>
                    <td>
                      <b className={results[index] ? "true" : "false"}>
                        {tf(results[index])}
                      </b>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <aside>
              <h2>Result</h2>
              <strong
                className={classification === "Tautology" ? "good" : "bad"}
              >
                {classification === "Tautology" ? <Check /> : <AlertTriangle />}
                {classification}
              </strong>
              <p>It is a {classification.toLowerCase()} statement.</p>
              <hr />
              <p>
                <b className="true">T</b> True
              </p>
              <p>
                <b className="false">F</b> False
              </p>
            </aside>
          </div>
          <footer>
            <Info /> {model.symbol} is {model.rule}.
          </footer>
        </main>
      </section>
      <section className="tt587-theory">
        <article>
          <h2>
            <i>3</i> Notice the pattern
          </h2>
          <p>Key observation from the table.</p>
          <aside>
            <Target />
            <b>Observation</b>
            <p>
              The statement is false in the rows determined by its connective.
            </p>
            <p>
              So, {model.symbol} is <b>{classification.toLowerCase()}</b>.
            </p>
          </aside>
        </article>
        <article>
          <h2>
            <i>4</i> Understand the rule
          </h2>
          <p>Key rule / definition.</p>
          <aside>
            <b>Key Rule ({model.symbol})</b>
            <strong>{model.rule}.</strong>
            <p>Classification</p>
            <ul>
              <li>Always True → Tautology</li>
              <li>Always False → Contradiction</li>
              <li>Otherwise → Contingent</li>
            </ul>
          </aside>
        </article>
        <article>
          <h2>
            <i>5</i> Watch out!
          </h2>
          <p>Common misconception.</p>
          <aside>
            <AlertTriangle />
            <b>Common Mistake</b>
            <p>Thinking p → q is the same as q → p.</p>
            <p>Let p=T, q=F: p→q is F, but q→p is T.</p>
          </aside>
        </article>
      </section>
      <section className="tt587-example">
        <h2>Worked Example</h2>
        <p>Evaluate the statement p ∧ q using a truth table and classify it.</p>
        <div>
          <table>
            <thead>
              <tr>
                <th>p</th>
                <th>q</th>
                <th>p ∧ q</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(([a, b], i) => (
                <tr key={i}>
                  <td>{tf(a)}</td>
                  <td>{tf(b)}</td>
                  <td>
                    <b className={a && b ? "true" : "false"}>{tf(a && b)}</b>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <aside>
            <h2>Conclusion</h2>
            <p>p ∧ q is True only when both p and q are True.</p>
            <p>
              Therefore, p ∧ q is <b>contingent</b>.
            </p>
          </aside>
        </div>
      </section>
      <section className="tt587-practice">
        <header>
          <h2>Try Independently</h2>
          <p>Your turn! Build the table and classify the statement.</p>
        </header>
        <article>
          <h3>
            Challenge <button onClick={check}>Check My Answer</button>
          </h3>
          <p>Construct the truth table for p ∨ q and classify it.</p>
          <table>
            <thead>
              <tr>
                <th>p</th>
                <th>q</th>
                <th>p ∨ q</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((_, row) => (
                <tr key={row}>
                  {[0, 1, 2].map((col) => {
                    const index = row * 3 + col;
                    return (
                      <td key={col}>
                        <select
                          aria-label={`Challenge row ${row + 1} column ${col + 1}`}
                          value={answers[index]}
                          onChange={(e) =>
                            setAnswers((current) =>
                              current.map((v, i) =>
                                i === index ? e.target.value : v,
                              ),
                            )
                          }
                        >
                          <option value="">Choose...</option>
                          <option>T</option>
                          <option>F</option>
                        </select>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </article>
        <aside>
          <h3>After you check</h3>
          <p>
            ✓ All rows correct → <b>Great!</b>
          </p>
          <p>✓ One or more rows incorrect → Review the rule</p>
          <p>
            ✓ Classification:{" "}
            {graded === null ? "waiting" : graded ? "Contingent" : "Try again"}
          </p>
        </aside>
      </section>
      <nav className="tt587-adjacent">
        <a href="/lessons/discrete-and-applied-mathematics/586-subsets-and-power-sets">
          ←{" "}
          <span>
            Previous Lesson<b>Subsets and Power Sets</b>
          </span>
        </a>
        <a href="/lessons/discrete-and-applied-mathematics/588-logical-connectives">
          <span>
            Next Lesson<b>Logical Connectives</b>
          </span>{" "}
          →
        </a>
      </nav>
    </section>
  );
}
