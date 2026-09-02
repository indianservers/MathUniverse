import { AlertTriangle, Check } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { LessonAdapterProps } from "../../types";
import "./LogicalConnectivesTargetLesson588.css";
type Op = "not" | "and" | "or" | "xor" | "implies" | "iff";
const rows = [
  [true, true],
  [true, false],
  [false, true],
  [false, false],
] as const;
const ops: Record<
  Op,
  {
    name: string;
    symbol: string;
    read: string;
    rule: string;
    fn: (p: boolean, q: boolean) => boolean;
  }
> = {
  not: {
    name: "NOT",
    symbol: "¬p",
    read: "not p",
    rule: "reverses the truth value of p",
    fn: (p) => !p,
  },
  and: {
    name: "AND",
    symbol: "p ∧ q",
    read: "p and q",
    rule: "is true only when both parts are true",
    fn: (p, q) => p && q,
  },
  or: {
    name: "OR",
    symbol: "p ∨ q",
    read: "p or q",
    rule: "is true when at least one part is true",
    fn: (p, q) => p || q,
  },
  xor: {
    name: "XOR",
    symbol: "p ⊕ q",
    read: "p exclusive-or q",
    rule: "is true when exactly one part is true",
    fn: (p, q) => p !== q,
  },
  implies: {
    name: "→",
    symbol: "p → q",
    read: "if p, then q",
    rule: "is false only when p is true and q is false",
    fn: (p, q) => !p || q,
  },
  iff: {
    name: "↔",
    symbol: "p ↔ q",
    read: "p if and only if q",
    rule: "is true when p and q agree",
    fn: (p, q) => p === q,
  },
};
const tf = (v: boolean) => (v ? "T" : "F");
function Gate({ op }: { op: Op }) {
  return (
    <svg viewBox="0 0 100 55" aria-hidden="true">
      {op === "not" ? (
        <>
          <path d="M22 8 L72 28 L22 48 Z" />
          <circle cx="78" cy="28" r="5" />
        </>
      ) : op === "implies" ? (
        <path d="M12 28 H78 M61 11 L79 28 L61 45" />
      ) : op === "iff" ? (
        <path d="M12 20 H82 M12 20 L28 7 M12 20 L28 33 M82 36 H12 M82 36 L66 23 M82 36 L66 49" />
      ) : (
        <>
          <path
            d={
              op === "and"
                ? "M22 8 H50 A25 20 0 0 1 50 48 H22 Z"
                : "M18 8 Q43 28 18 48 Q65 48 82 28 Q65 8 18 8"
            }
          />
          {op === "xor" && <path d="M11 8 Q35 28 11 48" />}
        </>
      )}
      <line x1="7" y1="28" x2="22" y2="28" />
      <line x1="78" y1="28" x2="94" y2="28" />
    </svg>
  );
}
export default function LogicalConnectivesTargetLesson588({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [p, setP] = useState(true),
    [q, setQ] = useState(true),
    [op, setOp] = useState<Op>("and"),
    [tab, setTab] = useState("Interact"),
    [answers, setAnswers] = useState<string[]>(Array(4).fill("")),
    [graded, setGraded] = useState<boolean | null>(null),
    [actions, setActions] = useState(0);
  const reset = () => {
    setP(true);
    setQ(true);
    setOp("and");
    setTab("Interact");
    setAnswers(Array(4).fill(""));
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
    result = model.fn(p, q),
    truth = useMemo(() => rows.map(([a, b]) => model.fn(a, b)), [model]),
    check = () => act(() => setGraded(answers.join("") === "TFFT"));
  return (
    <section
      className="lc588-page"
      data-testid="discrete-mockup-0645"
      data-object-model="dedicated-logic-gate-connective-model"
      data-op={op}
      data-p={p}
      data-q={q}
      data-result={result}
      data-truth={truth.map(tf).join("")}
      data-graded={graded === null ? "" : graded}
      data-actions={actions}
    >
      <header className="lc588-hero">
        <b>DISCRETE AND APPLIED MATHEMATICS</b>
        <h1>Logical Connectives</h1>
        <p>
          <b>Objective:</b> Understand AND, OR, NOT and implication using truth
          tables and circuit models.
        </p>
        <dl>
          <strong>Level: Intermediate-Advanced</strong>
          <strong>Module: Discrete Math Lab</strong>
          <strong>Topic: Logical Connectives</strong>
          <strong>Time: 6-10 min</strong>
        </dl>
      </header>
      <nav className="lc588-tabs">
        {[
          ["Interact", "Build & explore"],
          ["Learn", "Key ideas"],
          ["Worked Example", "See it in action"],
          ["Formula", "Rules & definitions"],
          ["Practice", "Try on your own"],
        ].map(([name, sub]) => (
          <button
            key={name}
            className={tab === name ? "active" : ""}
            onClick={() => act(() => setTab(name))}
          >
            <b>{name}</b>
            <small>{sub}</small>
          </button>
        ))}
      </nav>
      {tab !== "Interact" && (
        <p className="lc588-note">
          <b>{tab}:</b> {model.symbol} {model.rule}.
        </p>
      )}
      <section className="lc588-lab">
        <aside>
          <h2>1. Observe &amp; Manipulate</h2>
          <p>Set inputs and build a statement.</p>
          <article>
            <h3>Inputs</h3>
            {[
              ["p", p, setP],
              ["q", q, setQ],
            ].map(([name, value, setter]) => (
              <label key={String(name)}>
                <b>{String(name)}</b>
                <button
                  className={value ? "on" : ""}
                  aria-label={`Toggle ${name} input`}
                  onClick={() =>
                    act(() => {
                      (setter as React.Dispatch<React.SetStateAction<boolean>>)(
                        (v) => !v,
                      );
                    })
                  }
                >
                  <span>T</span>
                  <span>F</span>
                </button>
              </label>
            ))}
          </article>
          <h3>Build your statement</h3>
          <div className="circuit">
            <b>p</b>
            <i />
            <strong>{model.name}</strong>
            <i />
            <b>{op === "not" ? "" : "q"}</b>
            <output>
              Output <em>{tf(result)}</em>
            </output>
          </div>
          <footer>
            Selected statement<strong>{model.symbol}</strong>
            <small>({model.read})</small>
          </footer>
        </aside>
        <main>
          <h2>
            Choose a connective <small>(change the gate)</small>
          </h2>
          <div className="gates">
            {(Object.keys(ops) as Op[]).map((id) => (
              <button
                key={id}
                className={op === id ? "active" : ""}
                onClick={() => act(() => setOp(id))}
              >
                <b>{ops[id].name}</b>
                <Gate op={id} />
                <strong>{ops[id].symbol}</strong>
              </button>
            ))}
          </div>
          <div className="lc588-table">
            <article>
              <h2>
                Truth table <small>(updates instantly)</small>
              </h2>
              <table>
                <thead>
                  <tr>
                    <th>p</th>
                    <th>q</th>
                    <th>{model.symbol}</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map(([a, b], i) => (
                    <tr key={i}>
                      <td>{tf(a)}</td>
                      <td>{tf(b)}</td>
                      <td className={truth[i] ? "yes" : "no"}>
                        {tf(truth[i])}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </article>
            <aside>
              <h2>Live evaluation</h2>
              <p>
                For p={tf(p)} and q={tf(q)}
              </p>
              <strong>{model.symbol}</strong>
              <p>
                = {tf(p)} {model.symbol.replace(/[pq]/g, "")} {tf(q)}
              </p>
              <output>
                = {tf(result)} ({result ? "True" : "False"})
              </output>
            </aside>
          </div>
        </main>
      </section>
      <section className="lc588-theory">
        <article>
          <h2>2. Notice the pattern</h2>
          <p>How does the output behave?</p>
          <strong>
            <Check /> Output {model.rule}.
          </strong>
          <aside>
            <AlertTriangle />
            <b>Common misconception</b>
            <p>
              {op === "and"
                ? "p∧q is not true when only one input is true."
                : `Apply the exact rule for ${model.symbol}.`}
            </p>
          </aside>
        </article>
        <article>
          <h2>3. Understand the rule</h2>
          <p>{model.name} rule</p>
          <h3>Definition</h3>
          <p>
            The statement {model.symbol} {model.rule}.
          </p>
          <hr />
          <b>Symbol &nbsp; {model.symbol}</b>
          <p>Read as “{model.read}”</p>
        </article>
        <article>
          <h2>4. Worked Example</h2>
          <p>Evaluate (p→q) ∧ (q→p) when p=T, q=F.</p>
          <p>p→q = F; q→p = T</p>
          <strong>F ∧ T = F</strong>
          <b>Answer: F (False)</b>
        </article>
        <article>
          <h2>5. Try independently</h2>
          <p>
            <b>Challenge:</b> Evaluate p↔q for each row.
          </p>
          <table>
            <thead>
              <tr>
                <th>p</th>
                <th>q</th>
                <th>p↔q</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(([a, b], i) => (
                <tr key={i}>
                  <td>{tf(a)}</td>
                  <td>{tf(b)}</td>
                  <td>
                    <select
                      aria-label={`Biconditional row ${i + 1}`}
                      value={answers[i]}
                      onChange={(e) =>
                        setAnswers((v) =>
                          v.map((x, j) => (j === i ? e.target.value : x)),
                        )
                      }
                    >
                      <option value=""></option>
                      <option>T</option>
                      <option>F</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button onClick={check}>
            <Check /> Check my answers
          </button>
          <output>
            {graded === null
              ? ""
              : graded
                ? "All rows correct"
                : "Review when p and q agree"}
          </output>
        </article>
      </section>
      <nav className="lc588-adjacent">
        <a href="/lessons/discrete-and-applied-mathematics/587-truth-tables">
          ←{" "}
          <span>
            PREVIOUS<b>Truth Tables</b>
          </span>
        </a>
        <button>View all examples</button>
        <a href="/lessons/discrete-and-applied-mathematics/589-quantifiers">
          <span>
            NEXT<b>Quantifiers</b>
          </span>{" "}
          →
        </a>
      </nav>
    </section>
  );
}
