import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Lightbulb,
  RotateCcw,
  XCircle,
} from "lucide-react";
import { type DragEvent, useState } from "react";
import { Link } from "react-router-dom";
import type { SchoolSyllabusLesson } from "../syllabus/lessonSyllabusTypes";
import "./MagicSquaresTargetLesson10037.css";

const solved = [8, 1, 6, 3, 5, 7, 4, 9, 2];
const tabs = ["Interact", "Learn", "Example", "Formula", "Practice"];
const lines = (grid: Array<number | null>) =>
  [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ].map((ids) => ids.reduce((sum, id) => sum + (grid[id] ?? 0), 0));

export default function MagicSquaresTargetLesson10037({
  lesson: _lesson,
}: {
  lesson: SchoolSyllabusLesson;
}) {
  const [grid, setGrid] = useState<Array<number | null>>(solved);
  const [selected, setSelected] = useState<number | null>(null);
  const [tab, setTab] = useState("Interact");
  const [hint, setHint] = useState(1);
  const [result, setResult] = useState<"idle" | "correct" | "retry">("idle");
  const [challenge, setChallenge] = useState<Array<number | null>>([
    2,
    7,
    6,
    null,
    5,
    1,
    4,
    null,
    null,
  ]);
  const [challengeSelected, setChallengeSelected] = useState<number | null>(
    null,
  );
  const [actions, setActions] = useState(0);
  const sums = lines(grid),
    complete = grid.every((n) => n !== null),
    valid = complete && sums.every((n) => n === 15);
  const challengeSums = lines(challenge),
    challengeValid =
      challenge.every((n) => n !== null) &&
      challengeSums.every((n) => n === 15);
  const act = (fn: () => void) => {
    fn();
    setActions((n) => n + 1);
  };
  const place = (index: number, value: number, target: "main" | "challenge") =>
    act(() => {
      if (index === 4) return;
      const setter = target === "main" ? setGrid : setChallenge;
      setter((current) => {
        const next = [...current];
        const old = next[index];
        const other = next.indexOf(value);
        if (other >= 0 && other !== 4) next[other] = old;
        next[index] = value;
        return next;
      });
      if (target === "main") {
        setSelected(null);
        setResult("idle");
      } else setChallengeSelected(null);
    });
  const drop = (
    event: DragEvent<HTMLButtonElement>,
    index: number,
    target: "main" | "challenge",
  ) => {
    event.preventDefault();
    const value = Number(event.dataTransfer.getData("text/plain"));
    if (value) place(index, value, target);
  };
  const reset = () =>
    act(() => {
      setGrid(solved);
      setSelected(null);
      setTab("Interact");
      setHint(1);
      setResult("idle");
      setChallenge([2, 7, 6, null, 5, 1, 4, null, null]);
      setChallengeSelected(null);
    });
  return (
    <section
      className="magic10037-page"
      data-testid="school-mockup-0711"
      data-object-model="dedicated-drag-drop-eight-line-magic-square-solver"
      data-grid={grid.map((n) => n ?? 0).join(",")}
      data-valid={valid}
      data-sums={sums.join(",")}
      data-challenge-grid={challenge.map((n) => n ?? 0).join(",")}
      data-challenge-valid={challengeValid}
      data-actions={actions}
    >
      <header className="magic10037-hero">
        <small>CLASS 8 - INFORMATION PROCESSING</small>
        <h1>Magic Squares</h1>
        <p>
          Complete a magic square so every row, column, and diagonal has the
          same sum.
        </p>
        <div>
          <span>Class 8</span>
          <span>Information Processing</span>
          <span>Magic Squares</span>
          <span>~18 min</span>
        </div>
      </header>
      <nav className="magic10037-tabs">
        {tabs.map((item) => (
          <button
            key={item}
            className={tab === item ? "active" : ""}
            onClick={() => act(() => setTab(item))}
          >
            {item}
          </button>
        ))}
      </nav>
      <section className="magic10037-lab">
        <header>
          <h2>Complete the Magic Square</h2>
          <p>Drag numbers to fill the grid. Every line must sum to 15.</p>
          <strong className={valid ? "good" : "bad"}>
            {valid ? "All sums correct!" : "Keep checking the sums"}
          </strong>
        </header>
        <aside className="magic-info">
          <article>
            <small>Magic sum</small>
            <b>15</b>
          </article>
          <article>
            <h3>Rule</h3>
            <p>
              For a normal 3x3 magic square using 1-9, the centre must be{" "}
              <b>5</b>.
            </p>
          </article>
          <article>
            <h3>Hint</h3>
            {[1, 2, 3].map((n) => (
              <button
                key={n}
                disabled={n > hint}
                onClick={() => act(() => setHint(Math.min(3, n + 1)))}
              >
                <Lightbulb size={12} /> Show hint {n}
              </button>
            ))}
          </article>
        </aside>
        <main>
          <MagicGrid
            grid={grid}
            sums={sums}
            selected={selected}
            onCell={(i) => selected && place(i, selected, "main")}
            onDrop={(e, i) => drop(e, i, "main")}
          />
          <div className="sum-key">
            <span>
              <CheckCircle2 /> Correct (sum = 15)
            </span>
            <span>
              <XCircle /> Incorrect (sum not 15)
            </span>
            <span>Fixed (centre must be 5)</span>
          </div>
        </main>
        <aside className="magic-tools">
          <article>
            <h3>Candidates</h3>
            <NumberTray
              values={[1, 2, 3, 4, 5, 6, 7, 8, 9]}
              selected={selected}
              onSelect={setSelected}
            />
            <p>Drag a number onto the grid or swap with an existing cell.</p>
          </article>
          <article>
            <h3>Controls</h3>
            <button onClick={reset}>
              <RotateCcw size={13} /> Reset board
            </button>
            <button
              onClick={() => act(() => setResult(valid ? "correct" : "retry"))}
            >
              <CheckCircle2 size={13} /> Check sums
            </button>
            <button
              onClick={() =>
                act(() => {
                  setGrid([null, null, null, null, 5, null, null, null, null]);
                  setResult("idle");
                })
              }
            >
              <XCircle size={13} /> Clear grid
            </button>
            {result !== "idle" && (
              <p className={result}>
                {result === "correct"
                  ? "Every line equals 15."
                  : "Some lines do not equal 15 yet."}
              </p>
            )}
          </article>
        </aside>
      </section>
      <section className="magic10037-theory">
        <article>
          <h2>Why it works</h2>
          <p>All rows, columns, and diagonals total the same sum.</p>
          <p>Opposite cells across the centre add to the magic sum (15).</p>
          <p>
            For 1-9, the unique centre value is always <b>5</b>.
          </p>
        </article>
        <article>
          <h2>Worked Example (Lo Shu)</h2>
          <MiniGrid />
          <strong>Magic sum = 15</strong>
        </article>
        <article className="warning">
          <h2>Common Misconception</h2>
          <p>Checking only rows ignores columns and diagonals.</p>
          <p>
            A square can have all rows adding to 15 but still break a column or
            diagonal.
          </p>
        </article>
      </section>
      <section className="magic10037-challenge">
        <header>
          <h2>Your Turn: Keep the Magic Sum</h2>
          <p>
            Fill the empty cells. Every row, column, and diagonal must equal 15.
          </p>
          <b>{challenge.filter((n) => n === null).length} cells to fill</b>
        </header>
        <aside>
          <article>
            <small>Magic sum</small>
            <b>15</b>
          </article>
          <article>
            <small>Progress</small>
            <b>{challenge.filter((n) => n !== null).length} / 9 filled</b>
          </article>
          <article>
            <small>Hint</small>
            <p>Opposite cells across the centre add to 10.</p>
          </article>
        </aside>
        <MagicGrid
          grid={challenge}
          sums={challengeSums}
          selected={challengeSelected}
          onCell={(i) =>
            challengeSelected && place(i, challengeSelected, "challenge")
          }
          onDrop={(e, i) => drop(e, i, "challenge")}
        />
        <aside className="tray">
          <h3>Number tray</h3>
          <NumberTray
            values={[3, 8, 9]}
            selected={challengeSelected}
            onSelect={setChallengeSelected}
          />
          <p>Drag numbers to empty cells.</p>
          <strong>
            {challengeValid
              ? "Solved: every line is 15."
              : "Tip: Opposite cells across the centre add to 10."}
          </strong>
        </aside>
      </section>
      <nav className="magic10037-adjacent">
        <Link to="/lessons/school/class-8/class-8-information-processing-pattern-encoding">
          <ArrowLeft /> Previous: Pattern Encoding
        </Link>
        <Link
          className="next"
          to="/lessons/school/class-8/class-8-information-processing-route-map-reasoning"
        >
          Next: Route Map Reasoning <ArrowRight />
        </Link>
      </nav>
    </section>
  );
}
function NumberTray({
  values,
  selected,
  onSelect,
}: {
  values: number[];
  selected: number | null;
  onSelect: (n: number) => void;
}) {
  return (
    <div className="number-tray">
      {values.map((n) => (
        <button
          draggable
          onDragStart={(e) => e.dataTransfer.setData("text/plain", String(n))}
          className={selected === n ? "selected" : ""}
          onClick={() => onSelect(n)}
          key={n}
        >
          {n}
        </button>
      ))}
    </div>
  );
}
function MagicGrid({
  grid,
  sums,
  selected,
  onCell,
  onDrop,
}: {
  grid: Array<number | null>;
  sums: number[];
  selected: number | null;
  onCell: (i: number) => void;
  onDrop: (e: DragEvent<HTMLButtonElement>, i: number) => void;
}) {
  return (
    <div className="magic-grid-wrap">
      <div className="magic-grid">
        {grid.map((n, i) => (
          <button
            className={`${i === 4 ? "magic-centre" : ""} ${n ? "filled" : ""}`}
            aria-label={`Magic square cell ${i + 1}`}
            onClick={() => onCell(i)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => onDrop(e, i)}
            key={i}
          >
            {n ?? (selected ? "+" : "")}
          </button>
        ))}
      </div>
      <div className="row-sums">
        {sums.slice(0, 3).map((n, i) => (
          <span className={n === 15 ? "ok" : ""} key={i}>
            {n}
          </span>
        ))}
      </div>
      <div className="col-sums">
        {sums.slice(3, 6).map((n, i) => (
          <span className={n === 15 ? "ok" : ""} key={i}>
            {n}
          </span>
        ))}
      </div>
      <div className="diag-sums">
        <span>{sums[6]}</span>
        <span>{sums[7]}</span>
      </div>
    </div>
  );
}
function MiniGrid() {
  return (
    <div className="mini-magic">
      {solved.map((n, i) => (
        <span className={i === 4 ? "magic-centre" : ""} key={i}>
          {n}
        </span>
      ))}
    </div>
  );
}
