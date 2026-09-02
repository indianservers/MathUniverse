import { GripVertical, List, RotateCcw } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { LessonAdapterProps } from "../../types";
import "../geometry3d/CoordinateSystemTargetLesson378.css";
import "./FactorialsTargetLesson557.css";

const palette = [
  "#3284eb",
  "#56ae45",
  "#fa980d",
  "#8e50e8",
  "#ed4f70",
  "#12a2a5",
  "#e8a42c",
];
const factorial = (n: number) => {
  let value = 1;
  for (let i = 2; i <= n; i++) value *= i;
  return value;
};
const letters = (n: number) =>
  Array.from({ length: n }, (_, i) => String.fromCharCode(65 + i));
function permutations(items: string[]): string[] {
  if (items.length < 2) return [items.join("")];
  return items.flatMap((item, index) =>
    permutations(items.filter((_, i) => i !== index)).map(
      (rest) => item + rest,
    ),
  );
}

export default function FactorialsTargetLesson557({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [n, setNState] = useState(5),
    [slots, setSlots] = useState<(string | null)[]>(Array(5).fill(null)),
    [completed, setCompleted] = useState<string[]>([]),
    [enumerated, setEnumerated] = useState(false),
    [tab, setTab] = useState("Interact"),
    [challengeN, setChallengeN] = useState(7),
    [answer, setAnswer] = useState(""),
    [graded, setGraded] = useState(false),
    [actions, setActions] = useState(0),
    objects = letters(n),
    total = factorial(n),
    challengeTotal = factorial(challengeN),
    correct = graded && Number(answer) === challengeTotal,
    remaining = objects.filter((item) => !slots.includes(item));
  const act = (f: () => void) => {
      f();
      setActions((v) => v + 1);
      onInteraction();
    },
    resetTray = () =>
      act(() => {
        setSlots(Array(n).fill(null));
        setEnumerated(false);
      }),
    reset = () => {
      setNState(5);
      setSlots(Array(5).fill(null));
      setCompleted([]);
      setEnumerated(false);
      setTab("Interact");
      setChallengeN(7);
      setAnswer("");
      setGraded(false);
      setActions(0);
    };
  useEffect(reset, [resetToken]);
  const place = (
      item: string,
      index = slots.findIndex((value) => value === null),
    ) =>
      act(() => {
        if (index < 0 || slots.includes(item)) return;
        const next = [...slots];
        next[index] = item;
        setSlots(next);
        if (next.every(Boolean)) {
          const key = next.join("");
          setCompleted((old) => (old.includes(key) ? old : [...old, key]));
        }
      }),
    setN = (value: number) =>
      act(() => {
        const next = Math.max(1, Math.min(7, value));
        setNState(next);
        setSlots(Array(next).fill(null));
        setCompleted([]);
        setEnumerated(false);
      }),
    all = useMemo(
      () => (enumerated ? permutations(objects) : []),
      [enumerated, objects],
    );
  return (
    <section
      className="cs378-page fac557-page"
      data-testid="discrete-mockup-0614"
      data-object-model="dedicated-distinct-object-drag-drop-arrangement-tray-shrinking-choice-product-factorial-enumerator-growth-graded-challenge"
      data-direct-interaction="true"
      data-n={n}
      data-total={total}
      data-slots={slots.map((v) => v ?? "_").join("")}
      data-remaining={remaining.join("")}
      data-completed={completed.length}
      data-enumerated={enumerated}
      data-challenge-n={challengeN}
      data-challenge-total={challengeTotal}
      data-graded={graded}
      data-correct={correct}
      data-actions={actions}
    >
      <header className="fac557-hero">
        <section>
          <small>DISCRETE AND APPLIED MATHEMATICS</small>
          <h1>Factorials - Distinct Arrangements</h1>
          <p>
            <b>Objective:</b> Understand and compute n!=n×(n-1)×...×2×1, the
            number of arrangements of n distinct objects.
          </p>
        </section>
        <aside>
          <span>
            <b>Level</b>Intermediate-Advanced
          </span>
          <span>
            <b>Topic</b>Discrete Math
          </span>
          <span>
            <b>Time</b>6-10 min
          </span>
        </aside>
      </header>
      <nav className="fac557-tabs">
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
      <section className="fac557-observe">
        <article>
          <h2>
            <i>1</i> Observe
          </h2>
          <p>We have n distinct objects to arrange.</p>
          <div className="fac557-objects">
            {objects.map((item, i) => (
              <button
                key={item}
                draggable
                onDragStart={(e) => e.dataTransfer.setData("text/plain", item)}
                onClick={() => place(item)}
                style={{ background: palette[i] }}
                aria-label={`Object ${item}`}
              >
                {item}
                <GripVertical />
              </button>
            ))}
          </div>
        </article>
        <label>
          <b>n (objects)</b>
          <input
            aria-label="Object count"
            type="range"
            min="1"
            max="7"
            value={n}
            onChange={(e) => setN(Number(e.target.value))}
          />
          <input
            aria-label="Object count number"
            type="number"
            min="1"
            max="7"
            value={n}
            onChange={(e) => setN(Number(e.target.value))}
          />
          <span>Objects: {n}</span>
        </label>
        <aside>
          <h3>What we're counting</h3>
          <p>All possible linear arrangements of the {n} objects.</p>
          <p>
            <b>Order matters.</b> No object repeats.
          </p>
        </aside>
      </section>
      <section className="fac557-build">
        <div>
          <h2>
            <i>2</i> Manipulate - Build arrangements
          </h2>
          <p>
            Choose or drag an object for each position. Choices shrink each
            step.
          </p>
          <div className="fac557-slots">
            <b>Position:</b>
            {slots.map((item, index) => (
              <span
                key={index}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) =>
                  place(e.dataTransfer.getData("text/plain"), index)
                }
                data-testid={`factorial-slot-${index + 1}`}
                className={item ? "filled" : ""}
              >
                {item ?? "?"}
              </span>
            ))}
          </div>
          <div className="fac557-choices">
            <b>Choices left:</b>
            {objects.map((_, index) => (
              <span key={index}>{Math.max(1, n - index)}</span>
            ))}
          </div>
          <div className="fac557-remaining">
            <b>Remaining objects</b>
            {remaining.map((item) => (
              <button
                key={item}
                draggable
                onDragStart={(e) => e.dataTransfer.setData("text/plain", item)}
                onClick={() => place(item)}
                style={{ background: palette[objects.indexOf(item)] }}
              >
                {item}
              </button>
            ))}
          </div>
          <button onClick={resetTray}>
            <RotateCcw />
            Reset tray
          </button>
        </div>
        <aside>
          <h3>Arrangements completed</h3>
          <output>{completed.length}</output>
          <h3>Total arrangements</h3>
          <strong>{total}</strong>
          <p>
            {n}! = {objects.map((_, i) => n - i).join(" × ")} = {total}
          </p>
          <button onClick={() => act(() => setEnumerated((v) => !v))}>
            <List />
            {enumerated ? "Hide enumeration" : `Enumerate all (${total})`}
          </button>
          {enumerated && (
            <div className="fac557-enumeration">
              {all.slice(0, 30).map((value) => (
                <span key={value}>{value}</span>
              ))}
              {all.length > 30 && <b>+{all.length - 30} more</b>}
            </div>
          )}
        </aside>
      </section>
      <section className="fac557-pattern">
        <div>
          <h2>
            <i>3</i> Notice the pattern - Factorial growth
          </h2>
          <p>Total arrangements n! as n increases.</p>
          <table>
            <tbody>
              <tr>
                <th>n</th>
                <th>n!</th>
                <th>n! in product form</th>
              </tr>
              {[1, 2, 3, 4, 5, 6].map((value) => (
                <tr key={value}>
                  <td>{value}</td>
                  <td>{factorial(value)}</td>
                  <td>
                    {letters(value)
                      .map((_, i) => value - i)
                      .join(" × ")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <GrowthGraph />
      </section>
      <section className="fac557-bottom">
        <article>
          <h2>
            <i>4</i> Understand the rule
          </h2>
          <b>Definition (Factorial)</b>
          <p>For any positive integer n,</p>
          <output>n! = n × (n-1) × (n-2) × ... × 2 × 1</output>
          <p>and 0! = 1.</p>
          <aside>
            <b>Common misconception</b>
            <p>
              Do not confuse n! with n² or n×2. Factorial multiplies all
              positive integers down to 1.
            </p>
          </aside>
        </article>
        <article>
          <h2>
            <i>5</i> Try independently
          </h2>
          <b>Challenge</b>
          <p>How many arrangements are possible for n={challengeN} objects?</p>
          <label>
            n (objects)
            <input
              aria-label="Challenge object count"
              type="range"
              min="2"
              max="8"
              value={challengeN}
              onChange={(e) =>
                act(() => {
                  setChallengeN(Number(e.target.value));
                  setGraded(false);
                })
              }
            />
            <output>{challengeN}</output>
          </label>
          <label>
            Your answer ({challengeN}!)
            <input
              aria-label="Factorial challenge answer"
              type="number"
              value={answer}
              onChange={(e) =>
                act(() => {
                  setAnswer(e.target.value);
                  setGraded(false);
                })
              }
            />
            <button onClick={() => act(() => setGraded(true))}>Check</button>
          </label>
          {graded && (
            <strong className={correct ? "correct" : "wrong"}>
              {correct
                ? `Correct: ${challengeTotal}`
                : "Multiply every integer down to 1."}
            </strong>
          )}
          <p>
            <b>Hint:</b> {challengeN}! ={" "}
            {letters(challengeN)
              .map((_, i) => challengeN - i)
              .join(" × ")}
          </p>
        </article>
      </section>
      <nav className="fac557-adjacent">
        <button>
          Previous
          <br />
          <b>Fundamental Counting Principle</b>
        </button>
        <button>
          Next
          <br />
          <b>Permutations</b>
        </button>
      </nav>
    </section>
  );
}
function GrowthGraph() {
  const values = [1, 2, 6, 24, 120, 720],
    x = (i: number) => 55 + i * 62,
    y = (v: number) => 190 - Math.log10(v) * 55;
  return (
    <article className="fac557-growth">
      <h3>n! grows very fast!</h3>
      <svg viewBox="0 0 400 220">
        <path d="M42 15V195H380" className="axis" />
        <polyline
          points={values.map((v, i) => `${x(i)},${y(v)}`).join(" ")}
          className="line"
        />
        {values.map((v, i) => (
          <g key={v}>
            <circle cx={x(i)} cy={y(v)} r="4" />
            <text x={x(i)} y={y(v) - 9}>
              {v}
            </text>
            <text x={x(i)} y="210">
              {i + 1}
            </text>
          </g>
        ))}
      </svg>
    </article>
  );
}
