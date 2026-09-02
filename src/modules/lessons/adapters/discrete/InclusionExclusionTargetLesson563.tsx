import { CheckCircle2, Lightbulb, RotateCcw, Shuffle } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import type { LessonAdapterProps } from "../../types";
import "../geometry3d/CoordinateSystemTargetLesson378.css";
import "./InclusionExclusionTargetLesson563.css";

type Zone = "a" | "i" | "b" | "c" | "pool";
const initial: Record<number, Zone> = {
  1: "a",
  2: "a",
  3: "b",
  4: "i",
  5: "i",
  6: "b",
  7: "pool",
  8: "pool",
  9: "pool",
  10: "pool",
};
const color = (zone: Zone) =>
  zone === "a"
    ? "#2489dd"
    : zone === "b"
      ? "#8753dc"
      : zone === "i"
        ? "#16a58e"
        : zone === "c"
          ? "#e25776"
          : "#efa82f";

export default function InclusionExclusionTargetLesson563({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [zones, setZones] = useState(initial),
    [third, setThird] = useState(false),
    [tab, setTab] = useState("Interact"),
    [sequence, setSequence] = useState(1),
    [practice, setPractice] = useState({ a: 3, i: 2, b: 2 }),
    [graded, setGraded] = useState(false),
    [solution, setSolution] = useState(false),
    [actions, setActions] = useState(0);
  const grouped = useMemo(
    () =>
      Object.entries(zones).reduce<Record<Zone, number[]>>(
        (all, [key, zone]) => ({ ...all, [zone]: [...all[zone], Number(key)] }),
        { a: [], i: [], b: [], c: [], pool: [] },
      ),
    [zones],
  );
  const a = grouped.a.length + grouped.i.length,
    b = grouped.b.length + grouped.i.length,
    overlap = grouped.i.length,
    union = grouped.a.length + grouped.i.length + grouped.b.length,
    formula = a + b - overlap,
    practiceA = practice.a + practice.i,
    practiceB = practice.b + practice.i,
    practiceUnion = practice.a + practice.i + practice.b,
    practiceCorrect =
      graded && practiceA === 5 && practiceB === 4 && practice.i === 2;
  const act = (fn: () => void) => {
    fn();
    setActions((v) => v + 1);
    onInteraction();
  };
  const reset = () => {
    setZones(initial);
    setThird(false);
    setTab("Interact");
    setSequence(1);
    setPractice({ a: 3, i: 2, b: 2 });
    setGraded(false);
    setSolution(false);
    setActions(0);
  };
  useEffect(reset, [resetToken]);
  const move = (counter: number, zone: Zone) =>
    act(() => setZones((old) => ({ ...old, [counter]: zone })));
  const randomize = () =>
    act(() => {
      const values = Object.keys(initial)
        .map(Number)
        .sort(() => Math.random() - 0.5);
      const next: Record<number, Zone> = {};
      values.forEach(
        (counter, index) =>
          (next[counter] =
            index < 2 ? "a" : index < 4 ? "i" : index < 6 ? "b" : "pool"),
      );
      setZones(next);
    });
  return (
    <section
      className="cs378-page ie563-page"
      aria-label="Inclusion-Exclusion lesson"
      data-testid="discrete-mockup-0620"
      data-object-model="dedicated-draggable-counter-venn-region-assignment-live-inclusion-exclusion-independent-target-model"
      data-direct-interaction="true"
      data-a={a}
      data-b={b}
      data-overlap={overlap}
      data-union={union}
      data-formula={formula}
      data-third={third}
      data-sequence={sequence}
      data-practice-a={practiceA}
      data-practice-b={practiceB}
      data-practice-overlap={practice.i}
      data-practice-union={practiceUnion}
      data-graded={graded}
      data-correct={practiceCorrect}
      data-actions={actions}
    >
      <header className="ie563-hero">
        <div>
          <small>DISCRETE AND APPLIED MATHEMATICS</small>
          <small>COMBINATORICS, GRAPH THEORY AND LOGIC</small>
          <h1>Inclusion–Exclusion: Two Sets</h1>
          <p>Correct overlapping counts.</p>
          <aside>
            <span>Level: Intermediate-Advanced</span>
            <span>Topic: Discrete Math Lab</span>
            <span>Tools: Counters · Venn Sets</span>
            <span>Time: 6-10 min</span>
          </aside>
        </div>
        <section>
          <p>
            <b>Objective:</b> Use counters in two overlapping sets and verify
          </p>
          <output>|A ∪ B| = |A| + |B| - |A ∩ B|</output>
          <div>
            <b>Learning Sequence</b>
            {["Observe", "Manipulate", "Notice", "Understand", "Try"].map(
              (name, index) => (
                <button
                  key={name}
                  className={sequence === index + 1 ? "active" : ""}
                  onClick={() => act(() => setSequence(index + 1))}
                >
                  <i>{index + 1}</i>
                  {name}
                </button>
              ),
            )}
          </div>
        </section>
      </header>
      <nav className="ie563-tabs">
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
      <section className="ie563-lab">
        <header>
          <div>
            <small>DRAG, DROP, AND EXPLORE</small>
            <p>Drag counters into sets A or B. Overlaps count in both.</p>
          </div>
          <button onClick={() => act(reset)}>
            <RotateCcw />
            Reset
          </button>
          <button onClick={randomize}>
            <Shuffle />
            New Numbers
          </button>
          <label>
            <input
              type="checkbox"
              checked={third}
              onChange={() => act(() => setThird((v) => !v))}
            />
            Show 3rd set (C)
          </label>
        </header>
        <div className="ie563-board">
          <aside>
            <h3>Counters</h3>
            <p>Drag to place</p>
            <div>
              {grouped.pool.map((counter) => (
                <Counter
                  key={counter}
                  counter={counter}
                  zone="pool"
                  move={move}
                />
              ))}
            </div>
            <small>
              <b>Tip</b>
              <br />
              Place counters in the overlap to see them counted in both sets.
            </small>
          </aside>
          <main>
            <div className="ie563-venn">
              <DropZone zone="a" move={move}>
                <em>A</em>
                {grouped.a.map((counter) => (
                  <Counter
                    key={counter}
                    counter={counter}
                    zone="a"
                    move={move}
                  />
                ))}
              </DropZone>
              <DropZone zone="b" move={move}>
                <em>B</em>
                {grouped.b.map((counter) => (
                  <Counter
                    key={counter}
                    counter={counter}
                    zone="b"
                    move={move}
                  />
                ))}
              </DropZone>
              <DropZone zone="i" move={move}>
                {grouped.i.map((counter) => (
                  <Counter
                    key={counter}
                    counter={counter}
                    zone="i"
                    move={move}
                  />
                ))}
              </DropZone>
              {third && (
                <DropZone zone="c" move={move}>
                  <em>C</em>
                  {grouped.c.map((counter) => (
                    <Counter
                      key={counter}
                      counter={counter}
                      zone="c"
                      move={move}
                    />
                  ))}
                </DropZone>
              )}
            </div>
          </main>
          <section>
            <article>
              <h3>Live Counts</h3>
              <p>
                |A| = {a}
                <b>{a}</b>
              </p>
              <p>
                |B| = {b}
                <b>{b}</b>
              </p>
              <p>
                |A ∩ B| = {overlap}
                <b>{overlap}</b>
              </p>
              <hr />
              <p>
                |A ∪ B| (actual) = <strong>{union}</strong>
              </p>
            </article>
            <article>
              <CheckCircle2 />
              <b>Formula Check</b>
              <output>
                {a} + {b} - {overlap} = {formula} ✓
              </output>
            </article>
          </section>
        </div>
        <footer>
          <b>BREAKDOWN</b>
          <div>
            <span>
              A only<output>{grouped.a.length}</output>
            </span>
            +
            <span>
              B only<output>{grouped.b.length}</output>
            </span>
            +
            <span>
              Overlap<output>{overlap}</output>
            </span>
            =
            <span>
              Union (actual)<output>{union}</output>
            </span>
          </div>
        </footer>
      </section>
      <section className="ie563-rule">
        <article>
          <Lightbulb />
          <b>Notice the pattern</b>
          <p>
            You added the overlap twice when computing |A| + |B|. Subtract it
            once.
          </p>
        </article>
        <article>
          <b>Key rule (Two sets)</b>
          <p>To correct double counting of the overlap:</p>
          <output>|A ∪ B| = |A| + |B| - |A ∩ B|</output>
        </article>
        <article>
          <b>Common misconception</b>
          <p>
            Adding |A| and |B| counts the overlap twice. Subtract |A ∩ B| once
            to fix it.
          </p>
        </article>
      </section>
      <section className="ie563-example">
        <h3>WORKED EXAMPLE</h3>
        <p>
          <b>Example:</b> In a class, 28 students play cricket (A), 32 play
          football (B), and 16 play both.
        </p>
        <p>How many students play at least one of the two sports?</p>
        <div>
          <span>
            <b>Step 1 · List the counts</b>|A|=28
            <br />
            |B|=32
            <br />
            |A∩B|=16
          </span>
          <span>
            <b>Step 2 · Apply the rule</b>|A∪B|=28+32-16
            <br />
            =44
          </span>
          <strong>
            Step 3 · Answer
            <br />
            44 students play at least one sport.
          </strong>
        </div>
      </section>
      <section className="ie563-practice">
        <header>
          <h2>Try it: Your turn</h2>
          <p>Place counters to match the target counts below.</p>
        </header>
        <div>
          <article>
            <b>Target counts</b>
            <p>
              |A| = 5<br />
              |B| = 4<br />
              |A∩B| = 2
            </p>
            <strong>Find |A∪B| = ?</strong>
          </article>
          <section>
            <div className="ie563-mini">
              <i>A</i>
              <i>B</i>
            </div>
            <label>
              A only
              <input
                aria-label="Practice A only"
                type="number"
                min="0"
                value={practice.a}
                onChange={(e) =>
                  act(() => {
                    setPractice({ ...practice, a: Number(e.target.value) });
                    setGraded(false);
                  })
                }
              />
            </label>
            <label>
              Overlap
              <input
                aria-label="Practice overlap"
                type="number"
                min="0"
                value={practice.i}
                onChange={(e) =>
                  act(() => {
                    setPractice({ ...practice, i: Number(e.target.value) });
                    setGraded(false);
                  })
                }
              />
            </label>
            <label>
              B only
              <input
                aria-label="Practice B only"
                type="number"
                min="0"
                value={practice.b}
                onChange={(e) =>
                  act(() => {
                    setPractice({ ...practice, b: Number(e.target.value) });
                    setGraded(false);
                  })
                }
              />
            </label>
          </section>
          <aside>
            <Lightbulb />
            <b>Hint</b>
            <p>
              You need |A∩B|=2. Then place remaining counters in A only and B
              only.
            </p>
            <button onClick={() => act(() => setSolution((v) => !v))}>
              Solution (click to reveal)
            </button>
            {solution && <output>5 + 4 - 2 = 7</output>}
          </aside>
        </div>
        <footer>
          <button onClick={() => act(() => setGraded(true))}>
            Check Answer
          </button>
          <button
            onClick={() =>
              act(() => {
                setPractice({ a: 0, i: 0, b: 0 });
                setGraded(false);
              })
            }
          >
            <RotateCcw />
            Reset
          </button>
          {graded && (
            <strong className={practiceCorrect ? "correct" : "wrong"}>
              {practiceCorrect
                ? `Correct: |A∪B| = ${practiceUnion}`
                : "Match all three target counts."}
            </strong>
          )}
        </footer>
      </section>
      <nav className="ie563-adjacent">
        <button>
          Previous Lesson
          <br />
          <b>Pascal's Triangle</b>
        </button>
        <button>
          Next Lesson
          <br />
          <b>Pigeonhole Principle</b>
        </button>
      </nav>
    </section>
  );
}
function Counter({
  counter,
  zone,
  move,
}: {
  counter: number;
  zone: Zone;
  move: (counter: number, zone: Zone) => void;
}) {
  return (
    <button
      className="ie563-counter"
      draggable
      onDragStart={(e) => e.dataTransfer.setData("text/plain", String(counter))}
      onClick={() => move(counter, zone === "pool" ? "a" : "pool")}
      style={{ background: color(zone) }}
      aria-label={`Counter ${counter}`}
    >
      {counter}
    </button>
  );
}
function DropZone({
  zone,
  move,
  children,
}: {
  zone: Zone;
  move: (counter: number, zone: Zone) => void;
  children: ReactNode;
}) {
  return (
    <div
      className={`ie563-zone ${zone}`}
      data-testid={`venn-zone-${zone}`}
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => move(Number(e.dataTransfer.getData("text/plain")), zone)}
    >
      {children}
    </div>
  );
}
