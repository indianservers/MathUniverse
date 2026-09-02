import {
  AlertTriangle,
  Check,
  Lightbulb,
  RotateCcw,
  Shuffle,
} from "lucide-react";
import { useEffect, useState } from "react";
import type { DragEvent } from "react";
import type { LessonAdapterProps } from "../../types";
import "../geometry3d/CoordinateSystemTargetLesson378.css";
import "./SetOperationsTargetLesson583.css";

const universe = Array.from({ length: 12 }, (_, index) => index + 1);
const normalize = (values: number[]) =>
  [...new Set(values.filter((value) => universe.includes(value)))].sort(
    (a, b) => a - b,
  );
const parse = (value: string) =>
  normalize(
    value
      .split(/[^0-9-]+/)
      .filter(Boolean)
      .map(Number),
  );
const format = (values: number[]) => `{${values.join(", ")}}`;
const union = (a: number[], b: number[]) => normalize([...a, ...b]);
const intersection = (a: number[], b: number[]) =>
  a.filter((value) => b.includes(value));
const difference = (a: number[], b: number[]) =>
  a.filter((value) => !b.includes(value));
type Operation = "union" | "intersection" | "difference";

function Venn({
  title,
  symbol,
  operation,
  a,
  b,
  onDrop,
}: {
  title: string;
  symbol: string;
  operation: Operation;
  a: number[];
  b: number[];
  onDrop?: (set: "A" | "B", value: number) => void;
}) {
  const left = difference(a, b),
    middle = intersection(a, b),
    right = difference(b, a),
    result =
      operation === "union"
        ? union(a, b)
        : operation === "intersection"
          ? middle
          : left;
  const positions = (values: number[], x: number) =>
    values.map((value, index) => ({
      value,
      x: x + (index % 2) * 18,
      y: 105 + Math.floor(index / 2) * 26,
    }));
  return (
    <article className={`so583-venn ${operation}`}>
      <h3>
        {title} <i>{symbol}</i>
      </h3>
      <svg
        viewBox="0 0 240 220"
        role="img"
        aria-label={`${title} result ${format(result)}`}
      >
        <text x="43" y="34">
          A
        </text>
        <text x="196" y="34">
          B
        </text>
        <circle
          className="left"
          cx="88"
          cy="110"
          r="62"
          onDragOver={(event) => event.preventDefault()}
          onDrop={(event) =>
            onDrop?.("A", Number(event.dataTransfer.getData("text/plain")))
          }
        />
        <circle
          className="right"
          cx="152"
          cy="110"
          r="62"
          onDragOver={(event) => event.preventDefault()}
          onDrop={(event) =>
            onDrop?.("B", Number(event.dataTransfer.getData("text/plain")))
          }
        />
        {[
          ...positions(left, 55),
          ...positions(middle, 106),
          ...positions(right, 166),
        ].map((item) => (
          <text key={item.value} x={item.x} y={item.y}>
            {item.value}
          </text>
        ))}
      </svg>
      <strong>{symbol}</strong>
      <output>{format(result)}</output>
      <p>
        Cardinality{" "}
        <b>
          |{symbol}| = {result.length}
        </b>
      </p>
    </article>
  );
}

export default function SetOperationsTargetLesson583({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [a, setA] = useState([1, 2, 5, 6]),
    [b, setB] = useState([3, 4, 5, 6]),
    [aText, setAText] = useState("1,2,5,6"),
    [bText, setBText] = useState("3,4,5,6"),
    [expression, setExpression] = useState<Operation>("union"),
    [tab, setTab] = useState("Interact"),
    [challengeA, setChallengeA] = useState([2, 4, 6, 8]),
    [challengeB, setChallengeB] = useState([1, 3, 5, 6, 7]),
    [answers, setAnswers] = useState({
      union: "",
      intersection: "",
      difference: "",
    }),
    [graded, setGraded] = useState<boolean | null>(null),
    [seed, setSeed] = useState(0),
    [actions, setActions] = useState(0);
  const act = (fn: () => void) => {
      fn();
      setActions((n) => n + 1);
      onInteraction();
    },
    reset = () => {
      setA([1, 2, 5, 6]);
      setB([3, 4, 5, 6]);
      setAText("1,2,5,6");
      setBText("3,4,5,6");
      setExpression("union");
      setTab("Interact");
      setChallengeA([2, 4, 6, 8]);
      setChallengeB([1, 3, 5, 6, 7]);
      setAnswers({ union: "", intersection: "", difference: "" });
      setGraded(null);
      setSeed(0);
      setActions(0);
    };
  useEffect(reset, [resetToken]);
  const applyText = (target: "A" | "B", value: string) => {
      const parsed = parse(value);
      if (target === "A") {
        setAText(value);
        setA(parsed);
      } else {
        setBText(value);
        setB(parsed);
      }
      onInteraction();
    },
    drop = (target: "A" | "B", value: number) =>
      act(() => {
        if (target === "A") {
          const next = normalize([...a, value]);
          setA(next);
          setAText(next.join(","));
        } else {
          const next = normalize([...b, value]);
          setB(next);
          setBText(next.join(","));
        }
      }),
    shuffle = () =>
      act(() => {
        const next = seed + 1,
          left = universe.filter((value) => (value + next) % 3 !== 0),
          right = universe.filter((value) => (value * 2 + next) % 4 < 2);
        setSeed(next);
        setA(left);
        setB(right);
        setAText(left.join(","));
        setBText(right.join(","));
      }),
    newChallenge = () =>
      act(() => {
        setChallengeA([1, 3, 5, 7]);
        setChallengeB([2, 3, 6, 7]);
        setAnswers({ union: "", intersection: "", difference: "" });
        setGraded(null);
      });
  const u = union(a, b),
    i = intersection(a, b),
    d = difference(a, b);
  return (
    <section
      className="so583-page cs378-page"
      data-testid="discrete-mockup-0640"
      data-object-model="dedicated-two-set-venn-operation-model"
      data-a={a.join(",")}
      data-b={b.join(",")}
      data-union={u.join(",")}
      data-intersection={i.join(",")}
      data-difference={d.join(",")}
      data-expression={expression}
      data-seed={seed}
      data-challenge-a={challengeA.join(",")}
      data-challenge-b={challengeB.join(",")}
      data-graded={graded === null ? "" : graded}
      data-actions={actions}
    >
      <header className="so583-hero">
        <span>DISCRETE AND APPLIED MATHEMATICS</span>
        <h1>Union, Intersection and Difference</h1>
        <p>
          <b>Objective:</b> Understand set operations using Venn diagrams and
          set notation.
        </p>
        <dl>
          <b>6-10 min</b>
          <b>Intermediate-Advanced</b>
          <b>Discrete Math Lab</b>
        </dl>
      </header>
      <nav className="so583-tabs">
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
        <p className="so583-note">
          <b>{tab}:</b> Union means either set, intersection means both, and
          difference removes B from A.
        </p>
      )}
      <section className="so583-lab">
        <header>
          <b>THREE-PANEL VENN LAB</b>
          <p>
            Drag elements into sets A or B. Use the controls to explore set
            operations.
          </p>
        </header>
        <div className="so583-panels">
          <aside>
            <h3>Universe (U)</h3>
            <div>
              {universe.map((value) => (
                <button
                  key={value}
                  draggable
                  onDragStart={(event: DragEvent<HTMLButtonElement>) =>
                    event.dataTransfer.setData("text/plain", String(value))
                  }
                >
                  {value}
                </button>
              ))}
            </div>
            <button onClick={shuffle}>
              <Shuffle /> Shuffle U
            </button>
          </aside>
          <Venn
            title="Union"
            symbol="A U B"
            operation="union"
            a={a}
            b={b}
            onDrop={drop}
          />
          <Venn
            title="Intersection"
            symbol="A n B"
            operation="intersection"
            a={a}
            b={b}
            onDrop={drop}
          />
          <Venn
            title="Difference"
            symbol="A - B"
            operation="difference"
            a={a}
            b={b}
            onDrop={drop}
          />
        </div>
        <footer>
          <label>
            Set A{" "}
            <input
              aria-label="Set A values"
              value={aText}
              onChange={(event) => applyText("A", event.target.value)}
            />
          </label>
          <label>
            Set B{" "}
            <input
              aria-label="Set B values"
              value={bText}
              onChange={(event) => applyText("B", event.target.value)}
            />
          </label>
          <label>
            Expression
            <select
              aria-label="Set expression"
              value={expression}
              onChange={(event) =>
                act(() => setExpression(event.target.value as Operation))
              }
            >
              <option value="union">A U B</option>
              <option value="intersection">A n B</option>
              <option value="difference">A - B</option>
            </select>
          </label>
          <button onClick={() => act(reset)}>
            <RotateCcw /> Reset
          </button>
          <p>
            <Check /> All values are up to date
          </p>
        </footer>
      </section>
      <section className="so583-theory">
        <article>
          <h3>Manipulate</h3>
          <p>
            <Check /> Drag numbers from U into sets A or B.
          </p>
          <p>
            <Check /> Use Shuffle to create new layouts.
          </p>
          <p>
            <Check /> Choose an expression to highlight.
          </p>
          <p>
            <Check /> See live results and cardinality.
          </p>
        </article>
        <article>
          <h3>Notice the pattern</h3>
          <p>How do the highlighted regions change?</p>
          <p>
            <b>A U B:</b> everything in A or B.
          </p>
          <p>
            <b>A n B:</b> only what is in both.
          </p>
          <p>
            <b>A - B:</b> what is in A but not B.
          </p>
        </article>
        <article className="warning">
          <h3>
            <AlertTriangle /> Common misconception
          </h3>
          <p>
            Difference means remove, not subtract numbers. A-B removes elements
            of B from A.
          </p>
          <p>
            <b>Example:</b> A-B = {format(d)}
          </p>
        </article>
      </section>
      <section className="so583-rules">
        <article>
          <h3>Understand the rule</h3>
          <p>Let U be the universal set and A,B be subsets of U.</p>
          <dl>
            <span>
              <b>Union</b>A U B = {format(u)}
            </span>
            <span>
              <b>Intersection</b>A n B = {format(i)}
            </span>
            <span>
              <b>Difference</b>A - B = {format(d)}
            </span>
          </dl>
        </article>
        <article>
          <h3>Worked Example</h3>
          <p>
            Given A={format(a)} and B={format(b)}.
          </p>
          <p>
            A U B = {format(u)} &nbsp; |A U B|={u.length}
          </p>
          <p>
            A n B = {format(i)} &nbsp; |A n B|={i.length}
          </p>
          <p>
            A-B = {format(d)} &nbsp; |A-B|={d.length}
          </p>
          <p>B-A = {format(difference(b, a))}</p>
        </article>
      </section>
      <section className="so583-practice">
        <header>
          <h3>Try independently</h3>
          <button onClick={newChallenge}>
            New Challenge <Shuffle />
          </button>
          <p>
            <b>Challenge:</b> Let A={format(challengeA)} and B=
            {format(challengeB)}.
          </p>
          <p>Find A U B, A n B, and A-B. Enter answers and check.</p>
        </header>
        <main>
          {(["union", "intersection", "difference"] as const).map((name) => (
            <label key={name}>
              {name === "union"
                ? "A U B"
                : name === "intersection"
                  ? "A n B"
                  : "A - B"}
              <input
                aria-label={`Challenge ${name}`}
                value={answers[name]}
                onChange={(event) =>
                  setAnswers((current) => ({
                    ...current,
                    [name]: event.target.value,
                  }))
                }
              />
            </label>
          ))}
          <button
            onClick={() =>
              act(() =>
                setGraded(
                  parse(answers.union).join(",") ===
                    union(challengeA, challengeB).join(",") &&
                    parse(answers.intersection).join(",") ===
                      intersection(challengeA, challengeB).join(",") &&
                    parse(answers.difference).join(",") ===
                      difference(challengeA, challengeB).join(","),
                ),
              )
            }
          >
            Check Answer
          </button>
        </main>
        <footer>
          <Lightbulb /> Hint: List elements that satisfy each operation
          definition.
          <output>
            {graded === true
              ? "Correct."
              : graded === false
                ? "Check each operation again."
                : ""}
          </output>
        </footer>
      </section>
      <nav className="so583-adjacent">
        <a href="/lessons/discrete-and-applied-mathematics/582-set-builder">
          &lt;-{" "}
          <span>
            Previous<b>Set Builder</b>
          </span>
        </a>
        <a href="/lessons/discrete-and-applied-mathematics/584-complement">
          <span>
            Next<b>Complement</b>
          </span>{" "}
          -&gt;
        </a>
      </nav>
    </section>
  );
}
