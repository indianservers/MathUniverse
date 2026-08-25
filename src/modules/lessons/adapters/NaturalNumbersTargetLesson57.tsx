import {
  BookOpen,
  CheckCircle2,
  RotateCcw,
  Share2,
  TriangleAlert,
} from "lucide-react";
import { useEffect, useMemo, useState, type DragEvent } from "react";
import type { LessonAdapterProps } from "../types";
import "./NaturalNumbersTargetLesson57.css";

type Candidate = { id: string; label: string; natural: boolean };
const CANDIDATES: Candidate[] = [
  { id: "zero", label: "0", natural: false },
  { id: "one", label: "1", natural: true },
  { id: "five", label: "5", natural: true },
  { id: "six", label: "6", natural: true },
  { id: "half", label: "1/2", natural: false },
  { id: "negative", label: "-3", natural: false },
];
const INITIAL_ASSIGNMENTS = Object.fromEntries(
  CANDIDATES.map((item) => [item.id, item.natural ? "natural" : "excluded"]),
) as Record<string, "natural" | "excluded">;

export default function NaturalNumbersTargetLesson57({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [selected, setSelected] = useState(5);
  const [assignments, setAssignments] = useState(INITIAL_ASSIGNMENTS);
  const [dragging, setDragging] = useState("");
  const [status, setStatus] = useState("All numbers are classified correctly.");
  const [shareState, setShareState] = useState("Share");
  const [actions, setActions] = useState(0);
  const naturalMembers = useMemo(
    () => CANDIDATES.filter((item) => assignments[item.id] === "natural"),
    [assignments],
  );
  const excludedMembers = useMemo(
    () => CANDIDATES.filter((item) => assignments[item.id] === "excluded"),
    [assignments],
  );
  const classificationCorrect = CANDIDATES.every(
    (item) => assignments[item.id] === (item.natural ? "natural" : "excluded"),
  );
  const act = () => {
    setActions((value) => value + 1);
    onInteraction();
  };
  const changeSelected = (value: number) => {
    setSelected(Math.max(1, Math.min(10, Math.round(value))));
    act();
  };
  const reset = () => {
    setSelected(5);
    setAssignments(INITIAL_ASSIGNMENTS);
    setDragging("");
    setStatus("All numbers are classified correctly.");
    setShareState("Share");
    setActions(0);
    onInteraction();
  };
  useEffect(() => {
    setSelected(5);
    setAssignments(INITIAL_ASSIGNMENTS);
    setDragging("");
    setStatus("All numbers are classified correctly.");
    setShareState("Share");
    setActions(0);
  }, [resetToken]);
  const drop = (zone: "natural" | "excluded", draggedId = dragging) => {
    const item = CANDIDATES.find((candidate) => candidate.id === draggedId);
    if (!item) return;
    setAssignments((current) => ({ ...current, [item.id]: zone }));
    const correct = zone === (item.natural ? "natural" : "excluded");
    setStatus(
      correct
        ? `${item.label} is classified correctly.`
        : `Try again: ${item.label} does not belong in ${zone === "natural" ? "Natural Numbers" : "Not Included"}.`,
    );
    setDragging("");
    act();
  };
  const share = async () => {
    try {
      await navigator.clipboard?.writeText(
        `${selected} is a natural number; one more is ${selected + 1}.`,
      );
      setShareState("Copied");
    } catch {
      setShareState("Ready");
    }
    act();
  };
  return (
    <div
      className="natural-page"
      data-testid="number-mockup-0039"
      data-dedicated-lesson="57"
      data-object-model="selected-natural-counting-tray-number-line-one-more-membership-drag-classification-comparison-model"
      data-selected={selected}
      data-next={selected + 1}
      data-natural={naturalMembers.map((item) => item.label).join(",")}
      data-excluded={excludedMembers.map((item) => item.label).join(",")}
      data-classification-correct={classificationCorrect}
      data-status={status}
      data-actions={actions}
    >
      <span className="sr-only">Concept trace: Counting-number membership</span>
      <nav className="natural-breadcrumb">
        <a href="/">&larr;</a>
        <a href="/">Home</a>
        <span>&rsaquo;</span>
        <a href="/lessons">Lessons</a>
        <span>&rsaquo;</span>
        <a href="/lessons/numbers-and-arithmetic">Numbers And Arithmetic</a>
        <span>&rsaquo;</span>
        <b>57 Natural Numbers</b>
      </nav>
      <section className="natural-shell">
        <header className="natural-header">
          <div>
            <h1>Natural Numbers</h1>
            <p>Model counting and ordering.</p>
            <nav>
              <b>♙ Foundational-Intermediate</b>
              <b>ϟ Concept + Manipulative</b>
              <b>▣ Numbers and Number Theory</b>
              <b>◷ 6-10 min</b>
            </nav>
          </div>
          <aside>
            <button type="button" onClick={reset}>
              <RotateCcw />
              Reset
            </button>
            <button type="button" onClick={() => void share()}>
              <Share2 />
              {shareState}
            </button>
          </aside>
        </header>
        <main className="natural-layout">
          <section className="natural-work">
            <section className="count-card">
              <header>
                <i>1</i>
                <h2>Count and order</h2>
              </header>
              <div className="count-content">
                <div>
                  <h3>Counting tray</h3>
                  <nav>
                    {Array.from({ length: selected }, (_, index) => (
                      <button
                        type="button"
                        onClick={() => changeSelected(index + 1)}
                        key={index}
                      >
                        {index + 1}
                      </button>
                    ))}
                  </nav>
                  <hr />
                  <h3>Number line (Natural numbers start at 1)</h3>
                  <div className="natural-range">
                    <input
                      aria-label="Selected natural number drag control"
                      type="range"
                      min="1"
                      max="10"
                      step="1"
                      value={selected}
                      onChange={(event) =>
                        changeSelected(Number(event.target.value))
                      }
                    />
                    <div>
                      {Array.from({ length: 10 }, (_, index) => (
                        <button
                          type="button"
                          className={selected === index + 1 ? "active" : ""}
                          onClick={() => changeSelected(index + 1)}
                          key={index}
                        >
                          {index + 1}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                <aside>
                  <h3>One-more order</h3>
                  <p>
                    <b>{selected}</b>
                    <span>→</span>
                    <strong>{selected + 1}</strong>
                  </p>
                  <footer>
                    {selected + 1} is one more than {selected}
                  </footer>
                </aside>
              </div>
            </section>
            <section className="membership-card">
              <header>
                <i>2</i>
                <div>
                  <h2>Membership: Natural numbers vs. not included</h2>
                  <p>Drag each number to the correct group.</p>
                </div>
              </header>
              <nav>
                {CANDIDATES.map((item) => (
                  <button
                    type="button"
                    draggable
                    onDragStart={(event) =>
                      startDrag(event, item.id, setDragging)
                    }
                    key={item.id}
                  >
                    {item.label}
                  </button>
                ))}
              </nav>
              <div className="membership-zones">
                <MembershipZone
                  kind="natural"
                  items={naturalMembers}
                  dragging={dragging}
                  setDragging={setDragging}
                  onDrop={(id) => drop("natural", id)}
                />
                <MembershipZone
                  kind="excluded"
                  items={excludedMembers}
                  dragging={dragging}
                  setDragging={setDragging}
                  onDrop={(id) => drop("excluded", id)}
                />
              </div>
              <output
                className={classificationCorrect ? "correct" : "incorrect"}
              >
                {status}
              </output>
            </section>
            <section className="compare-card">
              <header>
                <i>3</i>
                <h2>Compare</h2>
              </header>
              <div>
                <b>{selected}</b>
                <span>&lt;</span>
                <strong>{selected + 1}</strong>
                <output>
                  {selected} &lt; {selected + 1}
                </output>
              </div>
            </section>
          </section>
          <aside className="natural-side">
            <section className="selected-card">
              <h2>Selected number: {selected}</h2>
              <strong>{selected}</strong>
              <p>
                Natural numbers start at 1<br />
                in this lesson.
              </p>
            </section>
            <section className="definition-card">
              <h2>
                <BookOpen />
                Definition
              </h2>
              <p>
                Natural numbers are the counting numbers that start at 1 and go
                on without end.
              </p>
              <footer>
                Counting whole objects
                <br />
                starts at 1.
              </footer>
            </section>
            <section className="misconception">
              <h2>
                <TriangleAlert />
                Common misconception
              </h2>
              <p>Thinking that 0 is a natural number.</p>
              <footer>
                0 is used in other topics,
                <br />
                but not in this lesson.
              </footer>
            </section>
            <section className="natural-summary">
              <h2>Quick summary</h2>
              <p>
                <i />
                Included:{" "}
                {CANDIDATES.filter((item) => item.natural)
                  .map((item) => item.label)
                  .join(", ")}
              </p>
              <p>
                <i />
                Not included: 0, fractions,
                <br />
                negatives
              </p>
              <p>
                <CheckCircle2 />
                Counting whole objects
                <br />
                starts at 1.
              </p>
            </section>
          </aside>
        </main>
      </section>
    </div>
  );
}

function startDrag(
  event: DragEvent<HTMLButtonElement>,
  id: string,
  setDragging: (id: string) => void,
) {
  event.dataTransfer.setData("text/plain", id);
  event.dataTransfer.effectAllowed = "move";
  setDragging(id);
}
function MembershipZone({
  kind,
  items,
  dragging,
  setDragging,
  onDrop,
}: {
  kind: "natural" | "excluded";
  items: Candidate[];
  dragging: string;
  setDragging: (id: string) => void;
  onDrop: (id: string) => void;
}) {
  const natural = kind === "natural";
  return (
    <section
      className={natural ? "natural-zone" : "excluded-zone"}
      onDragOver={(event) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = "move";
      }}
      onDrop={(event) => {
        event.preventDefault();
        onDrop(event.dataTransfer.getData("text/plain"));
      }}
      data-drop-active={Boolean(dragging)}
    >
      <header>
        {natural ? <CheckCircle2 /> : <TriangleAlert />}
        <div>
          <h3>{natural ? "Natural Numbers" : "Not Included"}</h3>
          <p>
            {natural
              ? "Included: 1, 5, 6"
              : "Not included: 0, fractions, negatives"}
          </p>
        </div>
      </header>
      <div>
        {items.map((item) => (
          <button
            type="button"
            draggable
            onDragStart={(event) => startDrag(event, item.id, setDragging)}
            key={item.id}
          >
            {item.label}
          </button>
        ))}
      </div>
      <footer>
        {natural ? (
          <>
            Counting whole objects starts at 1.
            <br />
            These numbers belong to Natural Numbers.
          </>
        ) : (
          <>
            0 is not counted in this lesson.
            <br />
            Fractions and negatives are not Natural Numbers.
          </>
        )}
      </footer>
    </section>
  );
}
