import {
  AlertTriangle,
  Check,
  Lightbulb,
  Play,
  RotateCcw,
  Shuffle,
} from "lucide-react";
import { useEffect, useState } from "react";
import type { LessonAdapterProps } from "../../types";
import "../geometry3d/CoordinateSystemTargetLesson378.css";
import "./SetBuilderTargetLesson582.css";

type Preset = "even" | "positive" | "nonpositive" | "odd" | "custom";
const range = (from: number, to: number) =>
  Array.from({ length: Math.max(0, to - from + 1) }, (_, i) => from + i);
const matches = (
  x: number,
  preset: Preset,
  operator: string,
  bound: number,
) => {
  if (preset === "even") return x % 2 === 0;
  if (preset === "positive") return x > 0;
  if (preset === "nonpositive") return x <= 0;
  if (preset === "odd") return Math.abs(x % 2) === 1;
  return operator === "="
    ? x === bound
    : operator === "!="
      ? x !== bound
      : operator === ">"
        ? x > bound
        : operator === ">="
          ? x >= bound
          : operator === "<"
            ? x < bound
            : x <= bound;
};
const roster = (values: number[]) => `{${values.join(", ")}}`;
const descriptions: Record<Preset, string> = {
  even: "x is even",
  positive: "x > 0",
  nonpositive: "x <= 0",
  odd: "x is odd",
  custom: "custom comparison",
};

export default function SetBuilderTargetLesson582({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [from, setFrom] = useState(-5),
    [to, setTo] = useState(5),
    [universe, setUniverse] = useState(range(-5, 5)),
    [preset, setPreset] = useState<Preset>("even"),
    [operator, setOperator] = useState("="),
    [bound, setBound] = useState(0),
    [tab, setTab] = useState("Interact"),
    [visible, setVisible] = useState(11),
    [challenge, setChallenge] = useState([-1, 1, 3]),
    [graded, setGraded] = useState<boolean | null>(null),
    [seed, setSeed] = useState(0),
    [actions, setActions] = useState(0);
  const result = universe.filter((x) => matches(x, preset, operator, bound)),
    shown = universe.slice(0, visible),
    predicate =
      preset === "custom" ? `x ${operator} ${bound}` : descriptions[preset];
  const act = (fn: () => void) => {
      fn();
      setActions((n) => n + 1);
      onInteraction();
    },
    reset = () => {
      setFrom(-5);
      setTo(5);
      setUniverse(range(-5, 5));
      setPreset("even");
      setOperator("=");
      setBound(0);
      setTab("Interact");
      setVisible(11);
      setChallenge([-1, 1, 3]);
      setGraded(null);
      setSeed(0);
      setActions(0);
    };
  useEffect(reset, [resetToken]);
  useEffect(() => {
    setUniverse(range(from, to));
    setVisible(Math.max(0, to - from + 1));
  }, [from, to]);
  const randomize = () =>
      act(() => {
        const next = seed + 1,
          values = Array.from(
            { length: 11 },
            (_, i) => ((i * 7 + next * 3) % 17) - 8,
          ).sort((a, b) => a - b);
        setSeed(next);
        setUniverse([...new Set(values)]);
        setVisible(11);
      }),
    animate = () =>
      act(() => {
        setVisible(0);
        let n = 0;
        const timer = window.setInterval(() => {
          n += 1;
          setVisible(n);
          if (n >= universe.length) window.clearInterval(timer);
        }, 90);
      });
  return (
    <section
      className="sb582-page cs378-page"
      data-testid="discrete-mockup-0639"
      data-object-model="dedicated-integer-domain-predicate-filter-model"
      data-universe={universe.join(",")}
      data-preset={preset}
      data-predicate={predicate}
      data-result={result.join(",")}
      data-result-count={result.length}
      data-domain={`${from},${to}`}
      data-visible={visible}
      data-seed={seed}
      data-challenge={challenge.join(",")}
      data-graded={graded === null ? "" : graded}
      data-actions={actions}
    >
      <header className="sb582-hero">
        <span>DISCRETE AND APPLIED MATHEMATICS</span>
        <span>COMBINATORICS, GRAPH THEORY AND LOGIC</span>
        <h1>582: Set Builder (Discrete Mathematics)</h1>
        <p>
          <b>Objective:</b> Create and manipulate sets using set-builder
          notation by filtering a universal set with a predicate.
        </p>
        <dl>
          <b>Level: Intermediate-Advanced</b>
          <b>Lab: Discrete Math</b>
          <b>Duration: 6-10 min</b>
          <b>Topics: Sets - Predicates - Set-builder</b>
        </dl>
      </header>
      <nav className="sb582-tabs">
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
        <p className="sb582-note">
          <b>{tab}:</b> Set-builder notation keeps exactly the domain elements
          satisfying P(x).
        </p>
      )}
      <section className="sb582-builder">
        <header>
          <b>1. OBSERVE &amp; MANIPULATE</b>
          <h2>Build the set using set-builder notation</h2>
          <p>
            <b>Universal set (U):</b> integers from {from} to {to}
          </p>
        </header>
        <div className="sb582-universe">
          {universe.map((x) => (
            <span
              key={x}
              className={shown.includes(x) && result.includes(x) ? "match" : ""}
            >
              {x}
            </span>
          ))}
          <footer>U</footer>
        </div>
        <aside>
          <b>Legend</b>
          <p>
            <i className="match" /> Matches predicate
          </p>
          <p>
            <i /> Does not match
          </p>
        </aside>
        <main>
          <section>
            <label>
              Predicate (editable)
              <select
                aria-label="Predicate"
                value={preset}
                onChange={(e) => act(() => setPreset(e.target.value as Preset))}
              >
                <option value="even">x is even</option>
                <option value="positive">x &gt; 0</option>
                <option value="nonpositive">x &lt;= 0</option>
                <option value="odd">x is odd</option>
                <option value="custom">custom</option>
              </select>
            </label>
            <div className="sb582-operators">
              {["=", "!=", ">", ">=", "<", "<="].map((op) => (
                <button
                  key={op}
                  className={operator === op ? "active" : ""}
                  onClick={() =>
                    act(() => {
                      setOperator(op);
                      setPreset("custom");
                    })
                  }
                >
                  {op}
                </button>
              ))}
              <input
                aria-label="Predicate bound"
                type="number"
                value={bound}
                onChange={(e) =>
                  act(() => {
                    setBound(Number(e.target.value));
                    setPreset("custom");
                  })
                }
              />
            </div>
            <label>
              Domain restriction
              <span>
                <select aria-label="Domain type">
                  <option>Integers</option>
                </select>{" "}
                from{" "}
                <input
                  aria-label="Domain minimum"
                  type="number"
                  value={from}
                  onChange={(e) =>
                    setFrom(Math.min(Number(e.target.value), to))
                  }
                />{" "}
                to{" "}
                <input
                  aria-label="Domain maximum"
                  type="number"
                  value={to}
                  onChange={(e) =>
                    setTo(Math.max(Number(e.target.value), from))
                  }
                />
              </span>
            </label>
          </section>
          <section>
            <h3>Resulting set A</h3>
            <div className="sb582-result">
              {result.map((x) => (
                <span key={x}>{x}</span>
              ))}
            </div>
            <footer>
              <b>Roster notation</b>
              <p>A = {roster(result)}</p>
            </footer>
          </section>
        </main>
        <nav>
          <button onClick={() => act(reset)}>
            <RotateCcw /> Reset
          </button>
          <span />
          <button onClick={randomize}>
            <Shuffle /> Randomize U
          </button>
          <button onClick={animate}>
            <Play /> Animate
          </button>
        </nav>
      </section>
      <section className="sb582-pattern">
        <main>
          <b>2. NOTICE THE PATTERN</b>
          <p>Vary the predicate to see how the set changes.</p>
          <table>
            <thead>
              <tr>
                <th>Predicate</th>
                <th>Resulting set A</th>
                <th>Roster notation</th>
              </tr>
            </thead>
            <tbody>
              {(
                [
                  ["x is even", [-4, -2, 0, 2, 4]],
                  ["x > 0", [1, 2, 3, 4, 5]],
                  ["x <= 0", [-5, -4, -3, -2, -1, 0]],
                  ["x is odd", [-5, -3, -1, 1, 3, 5]],
                ] as [string, number[]][]
              ).map(([name, values]) => (
                <tr key={name}>
                  <td>{name}</td>
                  <td>
                    {values.map((x) => (
                      <i key={x}>{x}</i>
                    ))}
                  </td>
                  <td>{roster(values)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </main>
        <aside>
          <h3>What's happening?</h3>
          <p>
            The predicate filters elements from the universal set. Only those
            that satisfy it are included in A.
          </p>
          <h4>
            <Lightbulb /> Tips
          </h4>
          <p>Try combining conditions like x &gt;= -2 and x &lt;= 2.</p>
        </aside>
      </section>
      <section className="sb582-theory">
        <article>
          <b>3. UNDERSTAND THE RULE</b>
          <h3>Key Rule</h3>
          <p>Set-builder notation describes a set by a property.</p>
          <strong>A = {`{x in U | P(x)}`}</strong>
          <ul>
            <li>U is the universal set.</li>
            <li>P(x) is a predicate.</li>
            <li>Elements making P(x) true are included.</li>
          </ul>
          <aside>
            <AlertTriangle />
            <b>Common misconception</b>
            <p>Forgetting the domain may include values you did not intend.</p>
          </aside>
        </article>
        <article>
          <b>4. WORKED EXAMPLE</b>
          <h3>Example</h3>
          <p>
            Let U be integers from -5 to 5. Find A ={" "}
            {`{x in U | -2 <= x <= 2 and x is even}`}.
          </p>
          <h4>Step 1: List U</h4>
          <p>-5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5</p>
          <h4>Step 2: Check each element</h4>
          <div className="sb582-work">
            {range(-5, 5).map((x) => (
              <i key={x} className={[-2, 0, 2].includes(x) ? "match" : ""}>
                {x}
              </i>
            ))}
          </div>
          <h4>Step 3: Write the set</h4>
          <strong>A = {`{-2, 0, 2}`}</strong>
          <footer>
            <Check /> Correct: -2, 0 and 2 are even and lie between -2 and 2.
          </footer>
        </article>
      </section>
      <section className="sb582-practice">
        <div>
          <b>5. TRY IT INDEPENDENTLY</b>
          <h3>Challenge</h3>
          <p>Let U be integers from -5 to 5.</p>
          <p>Find B = {`{x in U | x >= -1 and x <= 3 and x is odd}`}.</p>
        </div>
        <main>
          <b>Your answer</b>
          <div>
            {range(-5, 5).map((x) => (
              <button
                key={x}
                aria-label={`Challenge integer ${x}`}
                className={challenge.includes(x) ? "active" : ""}
                onClick={() =>
                  act(() => {
                    setChallenge((values) =>
                      values.includes(x)
                        ? values.filter((v) => v !== x)
                        : [...values, x].sort((a, b) => a - b),
                    );
                    setGraded(null);
                  })
                }
              >
                {x}
              </button>
            ))}
          </div>
          <p>Roster notation: B = {roster(challenge)}</p>
        </main>
        <aside className={graded ? "correct" : graded === false ? "wrong" : ""}>
          <Check />
          <b>
            {graded === true
              ? "Correct!"
              : graded === false
                ? "Check the range and oddness."
                : "Ready to check"}
          </b>
          <button
            onClick={() =>
              act(() => setGraded(challenge.join(",") === "-1,1,3"))
            }
          >
            Check answer
          </button>
        </aside>
      </section>
      <nav className="sb582-adjacent">
        <a href="/lessons/discrete-and-applied-mathematics/581-adjacency-matrix">
          &lt;-{" "}
          <span>
            Previous Lesson<b>Adjacency Matrix</b>
          </span>
        </a>
        <a href="/lessons/discrete-and-applied-mathematics/583-union-intersection-difference">
          <span>
            Next Lesson<b>Union, Intersection and Difference</b>
          </span>{" "}
          -&gt;
        </a>
      </nav>
    </section>
  );
}
