import { RotateCcw, Shuffle, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { LessonAdapterProps } from "../../types";
import "../geometry3d/CoordinateSystemTargetLesson378.css";
import "./PermutationsTargetLesson558.css";

const colors = [
  "#337be0",
  "#0d9ca6",
  "#53af45",
  "#f39412",
  "#8452db",
  "#e55872",
];
const letters = (n: number) =>
  Array.from({ length: n }, (_, i) => String.fromCharCode(65 + i));
const factorial = (n: number) =>
  Array.from({ length: n }, (_, i) => i + 1).reduce((a, b) => a * b, 1);
const nPr = (n: number, r: number) => factorial(n) / factorial(n - r);

export default function PermutationsTargetLesson558({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [n, setNState] = useState(5);
  const [r, setRState] = useState(2);
  const [slots, setSlots] = useState<(string | null)[]>([null, null]);
  const [history, setHistory] = useState<string[]>(["AB", "BA", "AC"]);
  const [tab, setTab] = useState("Interact");
  const [practice, setPractice] = useState<(string | null)[]>([null, null]);
  const [checked, setChecked] = useState(false);
  const [shuffles, setShuffles] = useState(0);
  const [actions, setActions] = useState(0);
  const objects = useMemo(() => letters(n), [n]);
  const total = nPr(n, r);
  const practiceTotal = nPr(4, 2);
  const act = (fn: () => void) => {
    fn();
    setActions((v) => v + 1);
    onInteraction();
  };
  const reset = () => {
    setNState(5);
    setRState(2);
    setSlots([null, null]);
    setHistory(["AB", "BA", "AC"]);
    setTab("Interact");
    setPractice([null, null]);
    setChecked(false);
    setShuffles(0);
    setActions(0);
  };
  useEffect(reset, [resetToken]);
  const clearBoard = () => act(() => setSlots(Array(r).fill(null)));
  const setN = (value: number) =>
    act(() => {
      const next = Math.max(2, Math.min(6, value));
      const nextR = Math.min(r, next);
      setNState(next);
      setRState(nextR);
      setSlots(Array(nextR).fill(null));
      setHistory([]);
    });
  const setR = (value: number) =>
    act(() => {
      const next = Math.max(1, Math.min(n, value));
      setRState(next);
      setSlots(Array(next).fill(null));
      setHistory([]);
    });
  const place = (item: string, index = slots.findIndex((v) => v === null)) =>
    act(() => {
      if (index < 0 || slots.includes(item)) return;
      const next = [...slots];
      next[index] = item;
      setSlots(next);
      if (next.every(Boolean)) {
        const value = next.join("");
        setHistory((old) => (old.includes(value) ? old : [...old, value]));
      }
    });
  const placePractice = (
    item: string,
    index = practice.findIndex((v) => v === null),
  ) =>
    act(() => {
      if (index < 0 || practice.includes(item)) return;
      const next = [...practice];
      next[index] = item;
      setPractice(next);
      setChecked(false);
    });
  const practiceCorrect =
    checked && practice.every(Boolean) && practice[0] !== practice[1];
  return (
    <section
      className="cs378-page perm558-page"
      data-testid="discrete-mockup-0615"
      data-object-model="dedicated-ordered-selection-drag-drop-permutation-history-choice-tree-practice"
      data-direct-interaction="true"
      data-n={n}
      data-r={r}
      data-total={total}
      data-slots={slots.map((v) => v ?? "_").join("")}
      data-unique={history.length}
      data-practice={practice.map((v) => v ?? "_").join("")}
      data-practice-total={practiceTotal}
      data-checked={checked}
      data-correct={practiceCorrect}
      data-shuffles={shuffles}
      data-actions={actions}
    >
      <header className="perm558-hero">
        <div>
          <small>DISCRETE AND APPLIED MATHEMATICS</small>
          <h1>Permutations</h1>
          <p>
            <b>Objective:</b> Count ordered selections.
          </p>
          <strong>
            Use permutations when order matters. AB and BA are different.
          </strong>
        </div>
        <figure aria-label="Ordered selection diagram">
          {["A", "B", "C", "D"].map((item, index) => (
            <span key={item} style={{ background: colors[index] }}>
              {item}
            </span>
          ))}
          <b>ABC</b>
        </figure>
        <aside>
          <span>Level: Intermediate-Advanced</span>
          <span>Subject: Discrete Math</span>
          <span>Topic: Combinatorics</span>
          <span>Est. time: 6-10 min</span>
        </aside>
      </header>
      <nav className="perm558-tabs">
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
      <section className="perm558-observe">
        <h2>
          <i>1</i> Observe &amp; Manipulate
        </h2>
        <p>
          Arrange <b>r = {r}</b> of the <b>n = {n}</b> objects. Drag items to
          the slots to form permutations.
        </p>
        <div className="perm558-board">
          <aside>
            <label>
              Objects (n)
              <input
                aria-label="Object count"
                type="number"
                min="2"
                max="6"
                value={n}
                onChange={(e) => setN(Number(e.target.value))}
              />
            </label>
            <div className="perm558-objects">
              {objects.map((item, i) => (
                <button
                  key={item}
                  draggable
                  onDragStart={(e) =>
                    e.dataTransfer.setData("text/plain", item)
                  }
                  onClick={() => place(item)}
                  style={{ background: colors[i] }}
                >
                  {item}
                </button>
              ))}
            </div>
            <label>
              Order (r)
              <select
                aria-label="Selection order"
                value={r}
                onChange={(e) => setR(Number(e.target.value))}
              >
                {objects.map((_, i) => (
                  <option key={i + 1}>{i + 1}</option>
                ))}
              </select>
            </label>
            <div className="perm558-actions">
              <button onClick={clearBoard}>
                <RotateCcw /> Reset board
              </button>
              <button
                onClick={() =>
                  act(() => {
                    setShuffles((v) => v + 1);
                    setSlots(Array(r).fill(null));
                  })
                }
              >
                <Shuffle /> Shuffle objects
              </button>
            </div>
          </aside>
          <main>
            <b>Arrange r = {r} (ordered slots)</b>
            <div className="perm558-slots">
              {slots.map((item, i) => (
                <span
                  key={i}
                  className={item ? "filled" : ""}
                  data-testid={`permutation-slot-${i + 1}`}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => place(e.dataTransfer.getData("text/plain"), i)}
                >
                  <small>
                    {i + 1}
                    {i === 0 ? "st" : i === 1 ? "nd" : "th"}
                  </small>
                  {item ?? "?"}
                </span>
              ))}
            </div>
            <p>Drag objects above into the slots.</p>
          </main>
          <section>
            <article>
              <b>Live Calculation</b>
              <output>
                <sup>{n}</sup>P<sub>{r}</sub>
                <br />= {Array.from({ length: r }, (_, i) => n - i).join(" × ")}
                <br />= {total}
              </output>
            </article>
            <article>
              <b>Unique permutations found</b>
              <output>
                {history.length} / {total}
              </output>
              <progress value={history.length} max={total} />
            </article>
          </section>
        </div>
        <div className="perm558-history">
          <b>Recent permutations</b>
          <div>
            {history.slice(-5).map((value) => (
              <span key={value}>{value}</span>
            ))}
          </div>
          <button onClick={() => act(() => setHistory([]))}>
            <Trash2 /> Clear history
          </button>
        </div>
      </section>
      <section className="perm558-middle">
        <article>
          <h2>
            <i>2</i> Notice the Pattern (Choice Tree)
          </h2>
          <p>Build permutations step by step.</p>
          <ChoiceTree objects={objects} />
          <output>
            Total = {n} × {n - 1} = {n * (n - 1)} permutations
          </output>
        </article>
        <article>
          <h2>
            <i>3</i> Understand the Rule
          </h2>
          <aside>
            <b>Key Rule</b>
            <p>The number of permutations of n objects taken r at a time is</p>
            <output>
              <sup>n</sup>P<sub>r</sub> = n! / (n-r)!
            </output>
            <b>Definition</b>
            <p>
              A permutation is an ordered arrangement of r distinct objects
              chosen from n distinct objects.
            </p>
          </aside>
          <div className="perm558-warning">
            <b>Common Misconception</b>
            <p>
              Treating permutations like combinations. Order matters: AB ≠ BA.
            </p>
          </div>
        </article>
      </section>
      <section className="perm558-bottom">
        <article>
          <h2>
            <i>4</i> Worked Example
          </h2>
          <p>
            How many 3-letter codes can be made using distinct letters from the
            set {`{A, B, C, D}`}?
          </p>
          <p>Here, n = 4, r = 3</p>
          <output>
            <sup>4</sup>P<sub>3</sub> = 4! / (4-3)! = 4 × 3 × 2 = 24
          </output>
          <p>So, there are 24 possible 3-letter codes.</p>
        </article>
        <article>
          <h2>
            <i>5</i> Try Independently
          </h2>
          <p>
            <b>Challenge:</b> Fill the slots to form every permutation.
          </p>
          <p>Given n = 4 (A, B, C, D) and r = 2</p>
          <div className="perm558-practice">
            <div>
              <div className="perm558-slots">
                {practice.map((item, i) => (
                  <span
                    key={i}
                    className={item ? "filled" : ""}
                    data-testid={`permutation-practice-slot-${i + 1}`}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) =>
                      placePractice(e.dataTransfer.getData("text/plain"), i)
                    }
                  >
                    {item ?? "?"}
                  </span>
                ))}
              </div>
              <div className="perm558-objects">
                {letters(4).map((item, i) => (
                  <button
                    key={item}
                    draggable
                    onDragStart={(e) =>
                      e.dataTransfer.setData("text/plain", item)
                    }
                    onClick={() => placePractice(item)}
                    style={{ background: colors[i] }}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
            <aside>
              <b>Found</b>
              <output>{practice.every(Boolean) ? 1 : 0} / 12</output>
              <progress value={practice.every(Boolean) ? 1 : 0} max="12" />
              <p>
                <sup>4</sup>P<sub>2</sub> = 12
              </p>
              <button onClick={() => act(() => setChecked(true))}>
                Check Answer
              </button>
              <button
                onClick={() =>
                  act(() => {
                    setPractice([null, null]);
                    setChecked(false);
                  })
                }
              >
                <RotateCcw /> Reset
              </button>
              {checked && (
                <strong className={practiceCorrect ? "correct" : "wrong"}>
                  {practiceCorrect
                    ? "Valid ordered selection"
                    : "Use two different objects"}
                </strong>
              )}
            </aside>
          </div>
        </article>
      </section>
      <section className="perm558-glance">
        <b>At-a-Glance</b>
        <div>
          <span>
            Objects (n)<strong>{n}</strong>
          </span>
          <span>
            Order (r)<strong>{r}</strong>
          </span>
          <span>
            Total permutations
            <strong>
              <sup>{n}</sup>P<sub>{r}</sub> = {total}
            </strong>
          </span>
          <span>
            Tree total
            <strong>
              {n} × {n - 1} = {n * (n - 1)}
            </strong>
          </span>
          <span>
            Unique found
            <strong>
              {history.length} / {total}
            </strong>
          </span>
        </div>
      </section>
      <nav className="perm558-adjacent">
        <button>
          Previous
          <br />
          <b>Factorials</b>
        </button>
        <button>
          Next
          <br />
          <b>Permutations with Repetition</b>
        </button>
      </nav>
    </section>
  );
}

function ChoiceTree({ objects }: { objects: string[] }) {
  const first = objects.slice(0, 5);
  return (
    <div className="perm558-tree">
      <b>Start</b>
      <div>
        {first.map((a, i) => (
          <section key={a}>
            <span style={{ background: colors[i] }}>{a}</span>
            <div>
              {first
                .filter((b) => b !== a)
                .map((b) => (
                  <small key={b}>{b}</small>
                ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
