import {
  ArrowLeft,
  ArrowRight,
  Check,
  CircleHelp,
  Link as LinkIcon,
  RotateCcw,
  ShieldCheck,
  Star,
  TriangleAlert,
  X,
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import type { SchoolSyllabusLesson } from "../syllabus/lessonSyllabusTypes";
import "./AxiomTheoremTargetLesson10056.css";

type Lane = "assumed" | "proved";
type Statement = { id: string; text: string; type: string; lane: Lane };
const statements: Statement[] = [
  {
    id: "A1",
    text: "The whole is greater than the part.",
    type: "Axiom",
    lane: "assumed",
  },
  {
    id: "A2",
    text: "Through two points, there is exactly one line.",
    type: "Axiom",
    lane: "assumed",
  },
  {
    id: "D1",
    text: "Definition: Vertically opposite angles are a pair of non-adjacent angles formed by two intersecting lines.",
    type: "Definition",
    lane: "assumed",
  },
  {
    id: "T1",
    text: "If a ray stands on a line, then the sum of the adjacent angles is 180°.",
    type: "Theorem",
    lane: "proved",
  },
  {
    id: "T2",
    text: "Vertically opposite angles are equal.",
    type: "Theorem",
    lane: "proved",
  },
];
const initial: Record<string, Lane> = Object.fromEntries(
  statements.map((s) => [s.id, s.lane]),
);
export default function AxiomTheoremTargetLesson10056({
  lesson: _lesson,
}: {
  lesson: SchoolSyllabusLesson;
}) {
  const [placed, setPlaced] = useState<Record<string, Lane>>(initial),
    [tab, setTab] = useState("Interact"),
    [whole, setWhole] = useState(2),
    [part, setPart] = useState(5),
    [tested, setTested] = useState(true),
    [challenge, setChallenge] = useState(false),
    [challengeChain, setChallengeChain] = useState<string[]>([]),
    [actions, setActions] = useState(0);
  const act = (fn: () => void) => {
    fn();
    setActions((n) => n + 1);
  };
  const assumptions = statements.filter((s) => placed[s.id] === "assumed"),
    proved = statements.filter((s) => placed[s.id] === "proved");
  const valid =
    placed.D1 === "assumed" && placed.T1 === "proved" && placed.T2 === "proved";
  const counterexample = whole <= part;
  const place = (id: string, lane: Lane) =>
    act(() => setPlaced((current) => ({ ...current, [id]: lane })));
  const reset = () =>
    act(() => {
      setPlaced({});
      setChallengeChain([]);
      setChallenge(false);
    });
  const restore = () => act(() => setPlaced(initial));
  const addChallenge = (id: string) =>
    act(() =>
      setChallengeChain((current) =>
        current.includes(id) ? current : [...current, id],
      ),
    );
  const challengeValid = ["D1", "T1", "T2"].every(
    (id, index) => challengeChain[index] === id,
  );
  return (
    <section
      className="at10056-page"
      data-testid="school-mockup-0730"
      data-object-model="dedicated-proof-dependency-counterexample-and-minimal-chain-engine"
      data-assumed={assumptions.map((s) => s.id).join(",")}
      data-proved={proved.map((s) => s.id).join(",")}
      data-valid={String(valid)}
      data-counterexample={tested ? String(counterexample) : "idle"}
      data-challenge={challengeChain.join(",")}
      data-challenge-valid={String(challenge && challengeValid)}
      data-actions={actions}
    >
      <header className="at10056-hero">
        <small>CLASS 9 · EUCLIDEAN GEOMETRY</small>
        <h1>Axiom versus Theorem</h1>
        <p>Distinguish assumed statements from results established by proof.</p>
        <div>
          <span>◴ 30 min</span>
          <span>▥ Class 9</span>
          <span>♙ Euclidean Geometry</span>
          <span>✥ Concept: Logic &amp; Proof</span>
        </div>
        <Link to="/lessons/school">
          <ArrowLeft /> School lessons
        </Link>
      </header>
      <nav className="at10056-tabs">
        {["Interact", "Learn", "Example", "Formula", "Practice"].map((item) => (
          <button
            key={item}
            className={tab === item ? "active" : ""}
            aria-selected={tab === item}
            onClick={() => act(() => setTab(item))}
          >
            {item}
          </button>
        ))}
      </nav>
      <main>
        <section className="at10056-builder">
          <header>
            <h2>PROOF-FOUNDATION BUILDER</h2>
            <p>
              Drag each statement to place it as Assumed (axiom/definition) or
              Proved (theorem). Build the shortest valid dependency chain.
            </p>
          </header>
          <div className="at10056-board">
            <article className="at10056-cards">
              <h3>
                STATEMENT CARDS <CircleHelp /> <small>Drag to place</small>
              </h3>
              {statements.map((s) => (
                <button
                  key={s.id}
                  draggable
                  onDragStart={(e) => e.dataTransfer.setData("statement", s.id)}
                  onClick={() => place(s.id, s.lane)}
                  className={s.lane}
                >
                  <i>⠿</i>
                  <span>
                    <b>{s.id}</b> {s.text}
                    <small>{s.type}</small>
                  </span>
                </button>
              ))}
            </article>
            <Lane
              title="ASSUMED (Axioms / Definitions)"
              lane="assumed"
              statements={assumptions}
              place={place}
            />
            <Lane
              title="PROVED (Theorems)"
              lane="proved"
              statements={proved}
              place={place}
            />
          </div>
          <footer
            className={valid ? "valid" : "invalid"}
            onClick={valid ? undefined : restore}
          >
            {valid ? (
              <>
                <Check />
                <span>
                  <b>Great! Valid dependency chain.</b>Shortest chain length: 2
                  step(s).
                </span>
              </>
            ) : (
              "Chain incomplete. Click to restore the shortest valid model."
            )}
            <button
              onClick={(e) => {
                e.stopPropagation();
                reset();
              }}
            >
              <RotateCcw /> Reset builder
            </button>
          </footer>
        </section>
        <section className="at10056-middle">
          <article className="at10056-evidence">
            <h2>EVIDENCE VIEWER (for T2)</h2>
            <p>Let lines ℓ and m intersect at O.</p>
            <CrossingAngles />
            <p>
              ∠1 and ∠3 form a linear pair.
              <br />∴ ∠1 + ∠3 = 180° &nbsp; (by T1)
            </p>
            <p>
              ∠2 and ∠3 form a linear pair.
              <br />∴ ∠2 + ∠3 = 180° &nbsp; (by T1)
            </p>
            <p>∴ ∠1 = ∠2 &nbsp; (subtract ∠3 from both)</p>
            <strong>Hence, vertically opposite angles are equal.</strong>
          </article>
          <article className="at10056-counter">
            <h2>COUNTEREXAMPLE TESTER</h2>
            <label>
              Test statement
              <select>
                <option>The whole is greater than the part.</option>
              </select>
            </label>
            <p>Try a counterexample</p>
            <div>
              <label>
                Whole ={" "}
                <input
                  aria-label="Whole value"
                  type="number"
                  value={whole}
                  onChange={(e) =>
                    act(() => {
                      setTested(false);
                      setWhole(Number(e.target.value));
                    })
                  }
                />
              </label>
              <label>
                Part ={" "}
                <input
                  aria-label="Part value"
                  type="number"
                  value={part}
                  onChange={(e) =>
                    act(() => {
                      setTested(false);
                      setPart(Number(e.target.value));
                    })
                  }
                />
              </label>
              <button onClick={() => act(() => setTested(true))}>Check</button>
            </div>
            {tested && (
              <section className={counterexample ? "found" : "holds"}>
                {counterexample ? <X /> : <Check />}
                <b>
                  {counterexample
                    ? "Counterexample found."
                    : "No counterexample here."}
                </b>
                <p>
                  {whole} is{" "}
                  {whole > part ? "greater than" : "not greater than"} {part}.
                </p>
                <p>
                  {counterexample
                    ? "This statement cannot be a universal theorem for arbitrary numbers; its geometric meaning requires a proper part."
                    : "Try making the whole no larger than the part."}
                </p>
              </section>
            )}
          </article>
          <article className="at10056-chain">
            <h2>CHAIN OVERVIEW</h2>
            <p>Current dependency chain</p>
            {["D1", "T1", "T2"].map((id, index) => {
              const s = statements.find((item) => item.id === id)!;
              return (
                <div key={id}>
                  <b>{id}</b>
                  {s.text}
                  {index < 2 && <i>↓</i>}
                </div>
              );
            })}
            <strong>Length: 2 step(s) ✓ Minimal</strong>
          </article>
        </section>
        <section className="at10056-why">
          <article>
            <h2>WHY IT WORKS</h2>
            <p>
              Axioms and definitions provide the foundation—statements we accept
              without proof. Theorems are built only from these foundations
              using valid logical steps. Dependency chains make this structure
              visible and verifiable.
            </p>
            <div>
              <span>
                <ShieldCheck />
                <b>Clarity</b>Separates what we assume from what we prove.
              </span>
              <span>
                <LinkIcon />
                <b>Logic</b>Ensures every theorem rests on a solid foundation.
              </span>
              <span>
                <Check />
                <b>Trust</b>Proofs are reliable and reproducible.
              </span>
            </div>
          </article>
          <aside>
            <h2>
              <TriangleAlert /> MISCONCEPTION WARNING
            </h2>
            <b>A familiar true statement is not automatically an axiom.</b>
            <p>
              Example: “All triangles have three angles.” is true, but it is a
              theorem proved from definitions—not an axiom.
            </p>
          </aside>
        </section>
        <section className="at10056-lower">
          <article>
            <h2>WORKED EXAMPLE</h2>
            <p>
              The whole is greater than the part is an axiom; vertically
              opposite angles are equal is a theorem.
            </p>
            <div>
              <section>
                <b>Axiom (accepted without proof)</b>
                <strong>The whole is greater than the part.</strong>
                <p>
                  <b>Example:</b> If a line segment AB is divided at C, then AC
                  &lt; AB and BC &lt; AB.
                </p>
              </section>
              <section>
                <b>Theorem (proved)</b>
                <strong>Vertically opposite angles are equal.</strong>
                <p>
                  <b>Status:</b> Proved using definitions and Theorem T1.
                  <br />
                  <b>Chain length:</b> 2 steps.
                </p>
              </section>
            </div>
          </article>
          <article className="at10056-task">
            <h2>YOUR CHALLENGE</h2>
            <p>Build the shortest dependency chain to prove:</p>
            <strong>Vertically opposite angles are equal.</strong>
            <p>
              ✓ Use only the given statements.
              <br />✓ Build the shortest valid chain.
              <br />✓ Earn 1 ⭐ for the minimal chain.
            </p>
            <button
              onClick={() =>
                act(() => {
                  setChallenge(true);
                  setChallengeChain([]);
                })
              }
            >
              Start Challenge
            </button>
            {challenge && (
              <div>
                {["D1", "T1", "T2"].map((id) => (
                  <button
                    key={id}
                    onClick={() => addChallenge(id)}
                    disabled={challengeChain.includes(id)}
                  >
                    {id}
                  </button>
                ))}
                <span>
                  {challengeChain.join(" → ") || "Choose chain cards"}
                </span>
                <b>
                  {challengeValid
                    ? "Minimal chain complete!"
                    : "Build D1 → T1 → T2"}
                </b>
              </div>
            )}
            <Star />
          </article>
        </section>
      </main>
      <nav className="at10056-adjacent">
        <Link to="/lessons/school">
          <ArrowLeft />
          <span>
            Previous:<b>Points, Lines and Planes</b>
          </span>
        </Link>
        <span>● ● ● ● ○ &nbsp; 3 of 6</span>
        <Link to="/lessons/school">
          <span>
            Next:<b>Theorem and its Converse</b>
          </span>
          <ArrowRight />
        </Link>
      </nav>
    </section>
  );
}
function Lane({
  title,
  lane,
  statements: items,
  place,
}: {
  title: string;
  lane: Lane;
  statements: Statement[];
  place: (id: string, lane: Lane) => void;
}) {
  return (
    <article
      className={`at10056-lane ${lane}`}
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => place(e.dataTransfer.getData("statement"), lane)}
    >
      <h3>{title}</h3>
      {items.map((s, index) => (
        <button key={s.id} onClick={() => place(s.id, lane)}>
          <b>{s.id}</b>
          <span>
            {s.text}
            <small>{s.type}</small>
          </span>
          {lane === "proved" && index < items.length - 1 && <i>↓</i>}
        </button>
      ))}
    </article>
  );
}
function CrossingAngles() {
  return (
    <svg className="at10056-cross" viewBox="0 0 230 125">
      <line x1="15" y1="15" x2="215" y2="112" />
      <line x1="15" y1="112" x2="215" y2="15" />
      <path className="blue" d="M96 55Q115 35 134 55" />
      <path className="purple" d="M96 70Q115 90 134 70" />
      <path className="orange" d="M96 55Q78 63 96 70" />
      <text x="111" y="43">
        1
      </text>
      <text x="143" y="67">
        2
      </text>
      <text x="111" y="92">
        3
      </text>
      <text x="79" y="67">
        4
      </text>
      <text x="111" y="68">
        O
      </text>
    </svg>
  );
}
