import {
  AlertTriangle,
  Check,
  Lightbulb,
  RotateCcw,
  Shuffle,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { LessonAdapterProps } from "../../types";
import "../geometry3d/CoordinateSystemTargetLesson378.css";
import "./ComplementTargetLesson584.css";

const complement = (u: number[], a: number[]) =>
  u.filter((value) => !a.includes(value));
const format = (values: number[]) => `{${values.join(", ")}}`;
const baseU = [1, 2, 3, 4, 5, 6],
  baseA = [2, 4, 6];
const positions: Record<number, { x: number; y: number }> = {
  1: { x: 55, y: 90 },
  2: { x: 195, y: 110 },
  3: { x: 45, y: 180 },
  4: { x: 255, y: 175 },
  5: { x: 470, y: 165 },
  6: { x: 335, y: 175 },
  7: { x: 485, y: 80 },
  8: { x: 85, y: 260 },
};

export default function ComplementTargetLesson584({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [u, setU] = useState(baseU),
    [a, setA] = useState(baseA),
    [tab, setTab] = useState("Interact"),
    [seed, setSeed] = useState(0),
    [choice, setChoice] = useState("B"),
    [graded, setGraded] = useState<boolean | null>(true),
    [actions, setActions] = useState(0);
  const drag = useRef<{
      value: number;
      x: number;
      y: number;
      moved: boolean;
    } | null>(null),
    suppressClick = useRef<number | null>(null);
  const ac = complement(u, a),
    act = (fn: () => void) => {
      fn();
      setActions((n) => n + 1);
      onInteraction();
    },
    reset = () => {
      setU(baseU);
      setA(baseA);
      setTab("Interact");
      setSeed(0);
      setChoice("B");
      setGraded(true);
      setActions(0);
    };
  useEffect(reset, [resetToken]);
  const toggle = (value: number) =>
      act(() =>
        setA((current) =>
          current.includes(value)
            ? current.filter((x) => x !== value)
            : [...current, value].sort((x, y) => x - y),
        ),
      ),
    drop = (inside: boolean, value: number) =>
      act(() =>
        setA((current) =>
          inside
            ? [...new Set([...current, value])].sort((x, y) => x - y)
            : current.filter((x) => x !== value),
        ),
      ),
    randomize = () =>
      act(() => {
        const next = seed + 1,
          nextU = next % 2 ? [1, 2, 3, 4, 5, 6, 7, 8] : baseU,
          nextA = nextU.filter((value) => (value + next) % 3 === 0);
        setSeed(next);
        setU(nextU);
        setA(nextA);
      });
  const options = {
    A: [1, 3, 5, 7],
    B: [1, 3, 5, 7, 9],
    C: [2, 4, 6, 8],
    D: [1, 2, 3, 4, 5, 6],
  };
  return (
    <section
      className="co584-page cs378-page"
      data-testid="discrete-mockup-0641"
      data-object-model="dedicated-relative-universal-set-complement-model"
      data-universe={u.join(",")}
      data-a={a.join(",")}
      data-complement={ac.join(",")}
      data-cardinality={`${u.length},${a.length},${ac.length}`}
      data-seed={seed}
      data-choice={choice}
      data-graded={graded === null ? "" : graded}
      data-actions={actions}
    >
      <header className="co584-hero">
        <div>
          <span>DISCRETE AND APPLIED MATHEMATICS</span>
          <span>COMBINATORICS, GRAPH THEORY AND LOGIC</span>
          <h1>Complement</h1>
          <p>Understand universal-set exclusion.</p>
          <strong>
            Objective:{" "}
            <i>
              Explore the complement Aᶜ of a set A relative to a universal set
              U.
            </i>
          </strong>
        </div>
        <dl>
          <span>
            Level<b>Intermediate-Advanced</b>
          </span>
          <span>
            Topic<b>Set Theory</b>
          </span>
          <span>
            Duration<b>6-10 min</b>
          </span>
        </dl>
      </header>
      <nav className="co584-tabs">
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
        <p className="co584-note">
          <b>{tab}:</b> A complement contains the elements in U that are not in
          A.
        </p>
      )}
      <section className="co584-lab">
        <header>
          <div>
            <h3>1. Observe &amp; Manipulate</h3>
            <p>
              Build a set A inside the universal set U. See Aᶜ update in real
              time.
            </p>
          </div>
          <button onClick={() => act(reset)}>
            <RotateCcw />
            Reset
          </button>
          <button onClick={randomize}>
            <Shuffle />
            Randomize
          </button>
        </header>
        <div>
          <main>
            <svg
              viewBox="0 0 540 315"
              role="img"
              aria-label={`Universe ${format(u)}, set A ${format(a)}`}
              onPointerMove={(event) => {
                if (
                  drag.current &&
                  Math.hypot(
                    event.clientX - drag.current.x,
                    event.clientY - drag.current.y,
                  ) > 5
                )
                  drag.current.moved = true;
              }}
              onPointerUp={(event) => {
                if (!drag.current?.moved) return;
                const box = event.currentTarget.getBoundingClientRect(),
                  x = ((event.clientX - box.left) / box.width) * 540,
                  y = ((event.clientY - box.top) / box.height) * 315,
                  inside = ((x - 285) / 150) ** 2 + ((y - 157) / 108) ** 2 <= 1,
                  value = drag.current.value;
                suppressClick.current = value;
                drag.current = null;
                drop(inside, value);
              }}
            >
              <rect width="540" height="315" rx="16" />
              <ellipse cx="285" cy="157" rx="150" ry="108" />
              <text className="u" x="18" y="28">
                U
              </text>
              <text className="set-label" x="160" y="70">
                A
              </text>
              {u.map((value) => {
                const p = positions[value] ?? { x: 470, y: 250 };
                return (
                  <g
                    key={value}
                    onPointerDown={(event) => {
                      drag.current = {
                        value,
                        x: event.clientX,
                        y: event.clientY,
                        moved: false,
                      };
                      event.currentTarget.setPointerCapture(event.pointerId);
                    }}
                    onClick={() => {
                      if (suppressClick.current === value)
                        suppressClick.current = null;
                      else toggle(value);
                    }}
                    className={a.includes(value) ? "inside" : "outside"}
                  >
                    <circle cx={p.x} cy={p.y} r="22" />
                    <text x={p.x} y={p.y + 5}>
                      {value}
                    </text>
                  </g>
                );
              })}
            </svg>
            <p>
              <i /> Inside A <i /> In Aᶜ (outside A)
            </p>
            <footer>
              <Lightbulb /> Click a number or drag it across the boundary to
              toggle membership in A.
            </footer>
          </main>
          <aside>
            <h3>Live Roster</h3>
            <p>U = {format(u)}</p>
            <p>
              A = <b>{format(a)}</b>
            </p>
            <p>
              Aᶜ = <strong>{format(ac)}</strong>
            </p>
            <hr />
            <h3>Cardinality</h3>
            <div>
              <span>
                |U|<b>{u.length}</b>
              </span>
              <span>
                |A|<b>{a.length}</b>
              </span>
              <span>
                |Aᶜ|<b>{ac.length}</b>
              </span>
            </div>
            <hr />
            <h3>Check</h3>
            <output>
              |A| + |Aᶜ| = |U|
              <br />
              <b>
                {a.length} + {ac.length} = {u.length}
              </b>{" "}
              <Check />
            </output>
          </aside>
        </div>
      </section>
      <section className="co584-theory">
        <article>
          <h3>2. Notice the Pattern</h3>
          <p>
            <Check /> Elements inside A are excluded from Aᶜ.
          </p>
          <p>
            <Check /> Elements outside A are included in Aᶜ.
          </p>
          <p>
            <Check /> |A| + |Aᶜ| = |U| always holds.
          </p>
          <p>
            <Check /> The complement depends on U.
          </p>
        </article>
        <article>
          <h3>3. Understand the Rule</h3>
          <p>The complement of A is all elements in U that are not in A.</p>
          <strong>Aᶜ = {`{x in U | x not in A}`}</strong>
          <aside>
            <Lightbulb />
            <b>Key Idea</b>
            <p>Always state the universal set.</p>
          </aside>
        </article>
        <article className="warning">
          <h3>
            <AlertTriangle /> Common Misconception
          </h3>
          <p>
            Thinking Aᶜ means everything. It means everything in U that is not
            in A.
          </p>
          <hr />
          <b>Example</b>
          <p>
            If U={format([1, 2, 3, 4, 5, 6, 7])} and A={format([2, 4, 6])}, then
            Aᶜ={format([1, 3, 5, 7])}.
          </p>
        </article>
      </section>
      <section className="co584-worked">
        <article>
          <h3>4. Worked Example</h3>
          <p>
            Given U={format([1, 2, 3, 4, 5, 6, 7, 8])} and A=
            {format([1, 3, 5, 7])}, find Aᶜ.
          </p>
          <table>
            <tbody>
              <tr>
                <th>1</th>
                <td>Identify U</td>
                <td>{format([1, 2, 3, 4, 5, 6, 7, 8])}</td>
              </tr>
              <tr>
                <th>2</th>
                <td>Identify A</td>
                <td>{format([1, 3, 5, 7])}</td>
              </tr>
              <tr>
                <th>3</th>
                <td>Pick elements in U not in A</td>
                <td>2, 4, 6, 8</td>
              </tr>
              <tr>
                <th>4</th>
                <td>Write the complement</td>
                <td>Aᶜ={format([2, 4, 6, 8])}</td>
              </tr>
            </tbody>
          </table>
          <footer>
            <Check /> Check: 4 + 4 = 8 = |U|
          </footer>
        </article>
        <article>
          <h3>De Morgan's Comparison</h3>
          <p>The complement connects with unions and intersections.</p>
          <section>
            <b>Complement of a union</b>
            <span>(A U B)ᶜ = Aᶜ n Bᶜ</span>
            <i>
              <em />
              <em />
            </i>
          </section>
          <section>
            <b>Complement of an intersection</b>
            <span>(A n B)ᶜ = Aᶜ U Bᶜ</span>
            <i>
              <em />
              <em />
            </i>
          </section>
          <p>These are called De Morgan's Laws.</p>
        </article>
      </section>
      <section className="co584-practice">
        <div>
          <h3>5. Try Independently (Challenge)</h3>
          <p>
            Let U={format([1, 2, 3, 4, 5, 6, 7, 8, 9])} and A=
            {format([2, 4, 6, 8])}. Find Aᶜ.
          </p>
          <nav>
            {Object.entries(options).map(([name, values]) => (
              <button
                key={name}
                className={choice === name ? "active" : ""}
                onClick={() =>
                  act(() => {
                    setChoice(name);
                    setGraded(null);
                  })
                }
              >
                <b>{name}</b>
                {format(values)}
              </button>
            ))}
          </nav>
        </div>
        <aside>
          <button onClick={() => act(() => setGraded(choice === "B"))}>
            Check Answer
          </button>
          <output
            className={graded ? "correct" : graded === false ? "wrong" : ""}
          >
            {graded === true
              ? "Correct: Aᶜ = {1, 3, 5, 7, 9}"
              : graded === false
                ? "Not yet. Keep only elements in U outside A."
                : ""}
          </output>
        </aside>
      </section>
      <nav className="co584-adjacent">
        <a href="/lessons/discrete-and-applied-mathematics/583-union-intersection-and-difference">
          &lt;-{" "}
          <span>
            Previous Lesson<b>Union, Intersection and Difference</b>
          </span>
        </a>
        <a href="/lessons/discrete-and-applied-mathematics/585-cartesian-product">
          <span>
            Next Lesson<b>Cartesian Product</b>
          </span>{" "}
          -&gt;
        </a>
      </nav>
    </section>
  );
}
