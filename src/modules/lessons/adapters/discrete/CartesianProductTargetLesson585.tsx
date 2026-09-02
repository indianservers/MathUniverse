import {
  AlertTriangle,
  ChevronDown,
  Lightbulb,
  Play,
  RotateCcw,
} from "lucide-react";
import { useEffect, useState } from "react";
import type { LessonAdapterProps } from "../../types";
import "../geometry3d/CoordinateSystemTargetLesson378.css";
import "./CartesianProductTargetLesson585.css";

type Pair = [number, number];
const product = (a: number[], b: number[]): Pair[] =>
  b.flatMap((y) => a.map((x) => [x, y] as Pair));
const canonical = (pairs: Pair[]) =>
  pairs
    .map(([a, b]) => `${a}:${b}`)
    .sort()
    .join("|");
const parseChallenge = (value: string) =>
  [...value.matchAll(/\(?\s*([145])\s*,\s*([xy])\s*\)?/gi)]
    .map((match) => `${match[1]}:${match[2].toLowerCase()}`)
    .sort()
    .join("|");

export default function CartesianProductTargetLesson585({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [a, setA] = useState([1, 2, 3]),
    [b, setB] = useState([1, 2]),
    [reverse, setReverse] = useState(false),
    [visible, setVisible] = useState(6),
    [speed, setSpeed] = useState(300),
    [tab, setTab] = useState("Interact"),
    [answer, setAnswer] = useState(""),
    [count, setCount] = useState(""),
    [graded, setGraded] = useState<boolean | null>(null),
    [actions, setActions] = useState(0),
    [openSet, setOpenSet] = useState<"A" | "B" | null>(null);
  const pairs = product(a, b),
    reversePairs = product(b, a),
    xMax = Math.max(1, ...a),
    yMax = Math.max(1, ...b),
    xStep = 395 / (xMax + 0.4),
    yStep = 295 / (yMax + 0.2),
    act = (fn: () => void) => {
      fn();
      setActions((n) => n + 1);
      onInteraction();
    },
    reset = () => {
      setA([1, 2, 3]);
      setB([1, 2]);
      setReverse(false);
      setVisible(6);
      setSpeed(300);
      setTab("Interact");
      setAnswer("");
      setCount("");
      setGraded(null);
      setActions(0);
      setOpenSet(null);
    };
  useEffect(reset, [resetToken]);
  const toggle = (set: "A" | "B", value: number) =>
      act(() => {
        const setter = set === "A" ? setA : setB;
        setter((current) =>
          current.includes(value)
            ? current.filter((x) => x !== value)
            : [...current, value].sort((x, y) => x - y),
        );
        setOpenSet(null);
        setVisible(99);
      }),
    animate = () =>
      act(() => {
        setVisible(0);
        let n = 0;
        const timer = window.setInterval(() => {
          n += 1;
          setVisible(n);
          if (n >= pairs.length) window.clearInterval(timer);
        }, speed);
      }),
    challengeA = [1, 4, 5],
    challengeExpected = [1, 4, 5]
      .flatMap((x) => ["x", "y"].map((y) => `${x}:${y}`))
      .sort()
      .join("|"),
    challengeText = "{(1, x), (1, y), (4, x), (4, y), (5, x), (5, y)}";
  const setSelector = (name: "A" | "B", values: number[]) => (
    <label className="cp585-set-picker">
      Set {name} <small>({name === "A" ? "x" : "y"}-values)</small>
      <span>
        {values.map((value) => (
          <button
            type="button"
            key={value}
            className="active"
            aria-label={`Remove ${value} from set ${name}`}
            onClick={() => toggle(name, value)}
          >
            {value}
          </button>
        ))}
        <button
          type="button"
          className="cp585-expand"
          aria-label={`Choose values for set ${name}`}
          aria-expanded={openSet === name}
          onClick={() => setOpenSet(openSet === name ? null : name)}
        >
          <ChevronDown />
        </button>
        {openSet === name && (
          <em className="cp585-options">
            {[1, 2, 3, 4, 5].map((value) => (
              <button
                type="button"
                key={value}
                className={values.includes(value) ? "active" : ""}
                aria-label={`${values.includes(value) ? "Remove" : "Add"} ${value} ${values.includes(value) ? "from" : "to"} set ${name}`}
                onClick={() => toggle(name, value)}
              >
                {value}
              </button>
            ))}
          </em>
        )}
      </span>
    </label>
  );
  return (
    <section
      className="cp585-page cs378-page"
      data-testid="discrete-mockup-0642"
      data-object-model="dedicated-ordered-pair-cartesian-product-model"
      data-a={a.join(",")}
      data-b={b.join(",")}
      data-pairs={canonical(pairs)}
      data-pair-count={pairs.length}
      data-reverse={reverse}
      data-reverse-pairs={canonical(reversePairs)}
      data-visible={visible}
      data-speed={speed}
      data-graded={graded === null ? "" : graded}
      data-actions={actions}
    >
      <header className="cp585-hero">
        <div>
          <span>DISCRETE AND APPLIED MATHEMATICS</span>
          <h1>Cartesian Product</h1>
          <p>Generate ordered pairs and discover the rule.</p>
          <dl>
            <b>Level: Intermediate-Advanced</b>
            <b>Topic: Discrete Math</b>
            <b>Time: 6-10 min</b>
            <b>Prerequisite: Sets</b>
          </dl>
        </div>
        <aside>
          <b>Objective</b>
          <p>
            Generate all ordered pairs (a,b) for sets A and B, distinguish (a,b)
            from (b,a), and discover that |A x B|=|A||B|.
          </p>
        </aside>
      </header>
      <nav className="cp585-tabs">
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
        <p className="cp585-note">
          <b>{tab}:</b> Every element of A pairs with every element of B in
          order.
        </p>
      )}
      <section className="cp585-lab">
        <header>
          <h3>
            <i>1</i> Observe &amp; Manipulate
          </h3>
          <p>
            Select elements of A and B to generate every ordered pair (a,b) in A
            x B.
          </p>
        </header>
        <div>
          <aside>
            {setSelector("A", a)}
            {setSelector("B", b)}
            <button onClick={animate}>
              <Play />
              Animate pairs
            </button>
            <input
              aria-label="Pair animation speed"
              type="range"
              min="80"
              max="600"
              step="20"
              value={speed}
              onChange={(event) => setSpeed(Number(event.target.value))}
            />
            <p>
              Slow <span /> Fast
            </p>
            <label className="check">
              <input
                aria-label="Show reverse pairs"
                type="checkbox"
                checked={reverse}
                onChange={() => act(() => setReverse((value) => !value))}
              />
              Show reverse pairs (b,a)
            </label>
            <button onClick={() => act(reset)}>
              <RotateCcw />
              Reset
            </button>
          </aside>
          <main>
            <p>
              Points represent (a,b) where a is in A (x-axis) and b is in B
              (y-axis)
            </p>
            <svg
              viewBox="0 0 500 390"
              role="img"
              aria-label={`${pairs.length} Cartesian product points`}
            >
              <line x1="60" y1="340" x2="470" y2="340" />
              <line x1="60" y1="340" x2="60" y2="35" />
              <text className="axis-label" x="483" y="346">
                x
              </text>
              <text className="axis-label" x="48" y="28">
                y
              </text>
              {Array.from({ length: xMax }, (_, index) => index + 1).map(
                (value) => (
                  <g key={`x-grid-${value}`}>
                    <line
                      className="grid"
                      x1={60 + value * xStep}
                      y1="40"
                      x2={60 + value * xStep}
                      y2="340"
                    />
                    <text x={60 + value * xStep} y="365">
                      {value}
                    </text>
                  </g>
                ),
              )}
              {Array.from({ length: yMax }, (_, index) => index + 1).map(
                (value) => (
                  <g key={`y-grid-${value}`}>
                    <line
                      className="grid"
                      x1="60"
                      y1={340 - value * yStep}
                      x2="470"
                      y2={340 - value * yStep}
                    />
                    <text x="40" y={344 - value * yStep}>
                      {value}
                    </text>
                  </g>
                ),
              )}
              {pairs.slice(0, visible).map(([x, y]) => (
                <g key={`${x}-${y}`} className={`pair y${y}`}>
                  <circle cx={60 + x * xStep} cy={340 - y * yStep} r="8" />
                  <text
                    x={60 + x * xStep}
                    y={340 - y * yStep + (y === 1 ? 27 : -15)}
                  >
                    ({x}, {y})
                  </text>
                </g>
              ))}
              {reverse &&
                reversePairs.map(([x, y]) => (
                  <circle
                    key={`r-${x}-${y}`}
                    className="reverse"
                    cx={60 + x * xStep}
                    cy={340 - y * yStep}
                    r="12"
                  />
                ))}
            </svg>
          </main>
          <aside className="cp585-roster">
            <h3>Ordered pairs A x B</h3>
            <p>
              <i /> b=1
            </p>
            <p>
              <i /> b=2
            </p>
            <div>
              {pairs.map((pair) => (
                <span key={pair.join("-")}>
                  ({pair[0]}, {pair[1]})
                </span>
              ))}
            </div>
            <footer>
              Total pairs: <b>{pairs.length}</b>
              <strong>|A x B| = {pairs.length}</strong>
            </footer>
          </aside>
        </div>
      </section>
      <section className="cp585-theory">
        <article>
          <h3>
            <i>2</i> Notice the Pattern
          </h3>
          <p>|A| = {a.length}</p>
          <p>|B| = {b.length}</p>
          <strong>
            |A x B| = {pairs.length} = {a.length} x {b.length}
          </strong>
          <p>Every element of A pairs with every element of B.</p>
          <aside>
            <Lightbulb />
            <b>Pattern:</b>
            <p>
              Rows correspond to B, columns to A. Total points = rows x columns.
            </p>
          </aside>
        </article>
        <article>
          <h3>
            <i>3</i> Understand the Rule
          </h3>
          <strong>Key Rule: |A x B| = |A| x |B|</strong>
          <p>
            <b>Definition</b>
            <br />
            The Cartesian product is the set of all ordered pairs (a,b) where a
            is in A and b is in B.
          </p>
          <aside>
            <AlertTriangle />
            <b>Common Misconception</b>
            <p>(a,b) is not the same as (b,a) unless a=b. Order matters.</p>
          </aside>
        </article>
        <article>
          <h3>Worked Example</h3>
          <p>
            Let A={`{a,b}`} and B={`{1,2,3}`}.
          </p>
          <p>A x B = {`{(a,1),(a,2),(a,3),(b,1),(b,2),(b,3)}`}</p>
          <table>
            <tbody>
              <tr>
                <th />
                <th>1</th>
                <th>2</th>
                <th>3</th>
              </tr>
              <tr>
                <th>a</th>
                <td>(a,1)</td>
                <td>(a,2)</td>
                <td>(a,3)</td>
              </tr>
              <tr>
                <th>b</th>
                <td>(b,1)</td>
                <td>(b,2)</td>
                <td>(b,3)</td>
              </tr>
            </tbody>
          </table>
          <p>|A x B|=2 x 3=6</p>
        </article>
      </section>
      <section className="cp585-practice">
        <div>
          <h3>
            <i>5</i> Try It Yourself
          </h3>
          <p>
            Let A={`{${challengeA.join(",")}`} and B={`{x,y}`}.
          </p>
          <p>List A x B and find |A x B|.</p>
        </div>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            act(() =>
              setGraded(
                parseChallenge(answer) === challengeExpected &&
                  Number(count) === 6,
              ),
            );
          }}
        >
          <label>
            Your Answer
            <textarea
              aria-label="Cartesian product answer"
              value={answer}
              onChange={(event) => setAnswer(event.target.value)}
              placeholder="(1,x), (1,y), ..."
            />
          </label>
          <label>
            |A x B| ={" "}
            <input
              aria-label="Cartesian product cardinality"
              type="number"
              value={count}
              onChange={(event) => setCount(event.target.value)}
            />
          </label>
          <button>Check Answer</button>
        </form>
        <aside>
          <h3>Quick Check</h3>
          <p>Pairs</p>
          <output
            className={graded ? "correct" : graded === false ? "wrong" : ""}
          >
            {graded === true
              ? challengeText
              : graded === false
                ? "Check order, coverage, and count."
                : "Enter all six pairs."}
          </output>
          <p>|A x B|</p>
          <output>{graded === true ? "6" : "-"}</output>
        </aside>
      </section>
      <nav className="cp585-adjacent">
        <a href="/lessons/discrete-and-applied-mathematics/584-complement">
          &lt;-{" "}
          <span>
            Previous<b>Complement</b>
          </span>
        </a>
        <a href="/lessons/discrete-and-applied-mathematics/586-subsets-power-sets">
          <span>
            Next<b>Subsets and Power Sets</b>
          </span>{" "}
          -&gt;
        </a>
      </nav>
    </section>
  );
}
