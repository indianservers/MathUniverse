import {
  CheckCircle2,
  Eye,
  LockKeyhole,
  Redo2,
  RotateCcw,
  Undo2,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { LessonAdapterProps } from "../../types";
import "../geometry3d/CoordinateSystemTargetLesson378.css";
import "./CircularPermutationsTargetLesson560.css";

const names = ["Ava", "Ben", "Cara", "Dev", "Eli", "Finn", "Gia", "Hari"];
const colors = [
  "#ef4779",
  "#f18825",
  "#15b899",
  "#147de1",
  "#8249dc",
  "#ecb72d",
  "#38a5cc",
  "#d05b9f",
];
const factorial = (n: number) =>
  Array.from({ length: n }, (_, i) => i + 1).reduce((a, b) => a * b, 1);
const letters = (n: number) =>
  Array.from({ length: n }, (_, i) => String.fromCharCode(65 + i));
const rotate = (values: string[], amount: number) =>
  values.map((_, i) => values[(i + amount) % values.length]);

export default function CircularPermutationsTargetLesson560({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [n, setNState] = useState(5),
    [arrangement, setArrangement] = useState(letters(5)),
    [anchor, setAnchor] = useState(true),
    [showRotations, setShowRotations] = useState(true),
    [rotation, setRotation] = useState(0),
    [past, setPast] = useState<string[][]>([]),
    [future, setFuture] = useState<string[][]>([]),
    [tab, setTab] = useState("Interact"),
    [answer, setAnswer] = useState(""),
    [graded, setGraded] = useState(false),
    [solution, setSolution] = useState(false),
    [actions, setActions] = useState(0);
  const total = factorial(n - 1),
    challengeTotal = factorial(6),
    visible = useMemo(
      () => rotate(arrangement, rotation),
      [arrangement, rotation],
    ),
    correct = graded && Number(answer) === challengeTotal;
  const act = (fn: () => void) => {
    fn();
    setActions((v) => v + 1);
    onInteraction();
  };
  const reset = () => {
    setNState(5);
    setArrangement(letters(5));
    setAnchor(true);
    setShowRotations(true);
    setRotation(0);
    setPast([]);
    setFuture([]);
    setTab("Interact");
    setAnswer("");
    setGraded(false);
    setSolution(false);
    setActions(0);
  };
  useEffect(reset, [resetToken]);
  const commit = (next: string[]) => {
    setPast((old) => [...old, arrangement]);
    setFuture([]);
    setArrangement(next);
    setRotation(0);
  };
  const setN = (value: number) =>
    act(() => {
      const next = Math.max(3, Math.min(8, value));
      setNState(next);
      setArrangement(letters(next));
      setPast([]);
      setFuture([]);
      setRotation(0);
    });
  const swap = (source: string, targetIndex: number) =>
    act(() => {
      const sourceIndex = arrangement.indexOf(source),
        next = [...arrangement];
      if (sourceIndex < 0) return;
      [next[sourceIndex], next[targetIndex]] = [
        next[targetIndex],
        next[sourceIndex],
      ];
      commit(next);
    });
  const undo = () =>
    act(() => {
      const previous = past.at(-1);
      if (!previous) return;
      setFuture((old) => [arrangement, ...old]);
      setArrangement(previous);
      setPast((old) => old.slice(0, -1));
      setRotation(0);
    });
  const redo = () =>
    act(() => {
      const next = future[0];
      if (!next) return;
      setPast((old) => [...old, arrangement]);
      setArrangement(next);
      setFuture((old) => old.slice(1));
      setRotation(0);
    });
  return (
    <section
      className="cs378-page circ560-page"
      data-testid="discrete-mockup-0617"
      data-object-model="dedicated-circular-seat-drag-swap-rotation-equivalence-undo-redo-factorial-graded-challenge"
      data-direct-interaction="true"
      data-n={n}
      data-total={total}
      data-arrangement={arrangement.join("")}
      data-visible={visible.join("")}
      data-anchor={anchor}
      data-show-rotations={showRotations}
      data-rotation={rotation}
      data-can-undo={past.length > 0}
      data-can-redo={future.length > 0}
      data-challenge-total={challengeTotal}
      data-graded={graded}
      data-correct={correct}
      data-actions={actions}
    >
      <header className="circ560-hero">
        <div>
          <h1>560 Circular Permutations</h1>
          <p>
            <b>Objective:</b> Count distinct circular arrangements of n
            different objects.
          </p>
          <aside>
            <span>Intermediate-Advanced</span>
            <span>Discrete Math Lab</span>
            <span>Geometry + Spreadsheet + Scripting</span>
            <span>~ 6-10 min</span>
          </aside>
        </div>
        <section>
          <b>Topic</b>
          <span>Discrete Mathematics</span>
          <b>Lab</b>
          <span>Circular Permutations</span>
          <b>Prerequisite</b>
          <span>Factorials</span>
          <b>Difficulty</b>
          <span>Intermediate-Advanced</span>
        </section>
      </header>
      <nav className="circ560-tabs">
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
      <section className="circ560-lab">
        <main>
          <header>
            <div>
              <small>MANIPULATE</small>
              <h2>Seat n people around a round table</h2>
              <p>
                Drag people to arrange them. Rotations are considered the same.
              </p>
            </div>
            <button onClick={() => act(reset)}>
              <RotateCcw />
              <b>Reset</b>
            </button>
            <button disabled={!past.length} onClick={undo}>
              <Undo2 />
              <b>Undo</b>
            </button>
            <button disabled={!future.length} onClick={redo}>
              <Redo2 />
              <b>Redo</b>
            </button>
          </header>
          <div className="circ560-controls">
            <label>
              People (n)
              <span>
                {[4, 5, 6, 7, 8].map((value) => (
                  <button
                    key={value}
                    className={n === value ? "active" : ""}
                    onClick={() => setN(value)}
                  >
                    {value}
                  </button>
                ))}
              </span>
            </label>
            <label>
              Anchor one person
              <button
                role="switch"
                aria-checked={anchor}
                onClick={() => act(() => setAnchor((v) => !v))}
              >
                {anchor ? "ON" : "OFF"}
              </button>
            </label>
            <label>
              Show rotations
              <button
                role="switch"
                aria-checked={showRotations}
                onClick={() => act(() => setShowRotations((v) => !v))}
              >
                {showRotations ? "ON" : "OFF"}
              </button>
            </label>
          </div>
          <div className="circ560-stage">
            <aside>
              <b>People</b>
              {arrangement.map((item, index) => (
                <button
                  key={item}
                  draggable
                  onDragStart={(event) =>
                    event.dataTransfer.setData("text/plain", item)
                  }
                  onClick={() =>
                    swap(item, (arrangement.indexOf(item) + 1) % n)
                  }
                >
                  <i style={{ background: colors[index] }}>{names[index][0]}</i>
                  {names[index]}
                </button>
              ))}
              <small>
                Drag to
                <br />
                place or swap
              </small>
            </aside>
            <div className="circ560-table">
              {visible.map((item, index) => {
                const angle = -90 + (index * 360) / n;
                return (
                  <span
                    key={item}
                    data-testid={`circular-seat-${index + 1}`}
                    style={{
                      transform: `translate(-50%,-50%) rotate(${angle}deg) translateY(-154px) rotate(${-angle}deg)`,
                    }}
                    onDragOver={(event) => event.preventDefault()}
                    onDrop={(event) =>
                      swap(
                        event.dataTransfer.getData("text/plain"),
                        (index + rotation) % n,
                      )
                    }
                  >
                    <i
                      style={{ background: colors[arrangement.indexOf(item)] }}
                    >
                      {names[arrangement.indexOf(item)][0]}
                    </i>
                    <b>{names[arrangement.indexOf(item)]}</b>
                    {anchor && item === "A" && <LockKeyhole />}
                  </span>
                );
              })}
              <strong>
                ROUND
                <br />
                TABLE
              </strong>
            </div>
          </div>
          <button
            className="circ560-check"
            onClick={() => act(() => setRotation((value) => (value + 1) % n))}
          >
            <RotateCcw /> Check another rotation
          </button>
          <output>
            <CheckCircle2 /> All rotations of this arrangement are considered
            the same.
          </output>
        </main>
        <aside>
          <article>
            <small>LIVE COUNT</small>
            <p>Distinct circular arrangements</p>
            <output>{total}</output>
            <p>
              = ({n} - 1)! = {n - 1}! = {total}
            </p>
          </article>
          <article>
            <small>CURRENT ARRANGEMENT</small>
            <div>
              {visible.map((item) => (
                <span key={item}>{names[arrangement.indexOf(item)]}</span>
              ))}
            </div>
            <b>Canonical form (smallest lexicographic):</b>
            <p>
              {arrangement
                .map((item) => names[arrangement.indexOf(item)])
                .join(" → ")}
            </p>
          </article>
          <article>
            <small>ROTATION EQUIVALENCE</small>
            <p>All rotations are the same arrangement.</p>
            {showRotations && (
              <>
                <div className="circ560-dots">
                  {arrangement.map((_, i) => (
                    <button
                      key={i}
                      className={rotation === i ? "active" : ""}
                      onClick={() => act(() => setRotation(i))}
                    />
                  ))}
                </div>
                <b>
                  {rotation + 1} / {n}
                </b>
              </>
            )}
          </article>
          <article>
            <small>MODEL SUMMARY</small>
            <p>
              People (n) <b>{n}</b>
            </p>
            <p>
              Fixed (anchored) <b>{anchor ? 1 : 0}</b>
            </p>
            <p>
              Degrees of freedom <b>{anchor ? n - 1 : n}</b>
            </p>
            <p>
              Distinct arrangements <b>{total}</b>
            </p>
          </article>
        </aside>
      </section>
      <section className="circ560-theory">
        <article>
          <small>NOTICE THE PATTERN</small>
          <table>
            <tbody>
              <tr>
                <th>n (people)</th>
                <th>Distinct arrangements</th>
                <th>Computation</th>
              </tr>
              {[3, 4, 5, 6].map((value) => (
                <tr key={value}>
                  <td>{value}</td>
                  <td>{factorial(value - 1)}</td>
                  <td>
                    ({value}-1)! = {value - 1}!
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p>Increasing n by 1 multiplies the count by n - 1.</p>
        </article>
        <article>
          <small>KEY RULE (DEFINITION)</small>
          <p>
            For n distinct people seated around a round table, the number of
            distinct circular arrangements is
          </p>
          <output>(n - 1)!</output>
          <p>Fix any one person to break rotational symmetry.</p>
        </article>
        <article>
          <small>COMMON MISCONCEPTION</small>
          <p>
            Using n! counts rotations as different. Rotating a table does not
            change the arrangement.
          </p>
          <b>
            Incorrect: n!
            <br />
            Correct: (n - 1)!
          </b>
        </article>
      </section>
      <section className="circ560-bottom">
        <article>
          <small>WORKED EXAMPLE</small>
          <p>
            <b>Example:</b> How many ways can 6 friends sit around a round
            table?
          </p>
          <p>n = 6 ⇒ Distinct arrangements = (6 - 1)! = 5! = 120.</p>
          <b>Answer: 120 ways.</b>
        </article>
        <article>
          <small>TRY INDEPENDENTLY</small>
          <p>
            <b>Challenge:</b> In how many ways can 7 people sit around a round
            table?
          </p>
          <label>
            Your answer:
            <input
              aria-label="Circular challenge answer"
              type="number"
              value={answer}
              onChange={(event) =>
                act(() => {
                  setAnswer(event.target.value);
                  setGraded(false);
                })
              }
            />
            <button onClick={() => act(() => setGraded(true))}>
              Check Answer
            </button>
            <button onClick={() => act(() => setSolution((v) => !v))}>
              <Eye /> Show Solution
            </button>
          </label>
          {graded && (
            <strong className={correct ? "correct" : "wrong"}>
              {correct ? "Correct: 720" : "Use (7 - 1)!, not 7!."}
            </strong>
          )}
          {solution && <output>6! = 720</output>}
        </article>
      </section>
      <nav className="circ560-adjacent">
        <button>
          Previous lesson
          <br />
          <b>Permutations with Repetition</b>
        </button>
        <button>
          Next lesson
          <br />
          <b>Combinations</b>
        </button>
      </nav>
    </section>
  );
}
