import { ArrowLeft, ArrowRight, Check, RotateCcw } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import type { SchoolSyllabusLesson } from "../syllabus/lessonSyllabusTypes";
import "./AlternateInteriorTargetLesson10061.css";

const tabs = ["◉ Interact", "▣ Learn", "▱ Example", "∑ Formula", "⌁ Practice"];

export default function AlternateInteriorTargetLesson10061({
  lesson: _lesson,
}: {
  lesson: SchoolSyllabusLesson;
}) {
  const [angle, setAngle] = useState(117);
  const [offset, setOffset] = useState(0);
  const [parallel, setParallel] = useState(true);
  const [labels, setLabels] = useState(true);
  const [checked, setChecked] = useState(true);
  const [tab, setTab] = useState(0);
  const [pairs, setPairs] = useState([true, true, false, false]);
  const [challengeMoved, setChallengeMoved] = useState(false);
  const [actions, setActions] = useState(0);
  const acute = 180 - angle;
  const valid = parallel && checked;
  const solved =
    challengeMoved && pairs[0] && pairs[1] && !pairs[2] && !pairs[3];
  const act = (fn: () => void) => {
    fn();
    setActions((n) => n + 1);
  };
  const reset = () =>
    act(() => {
      setAngle(117);
      setOffset(0);
      setParallel(true);
      setLabels(true);
      setChecked(true);
    });
  return (
    <section
      className="ai10061-page"
      data-testid="school-mockup-0735"
      data-object-model="dedicated-alternate-interior-position-equality-converse-engine"
      data-angle={angle}
      data-supplement={acute}
      data-offset={offset}
      data-parallel={String(parallel)}
      data-labels={String(labels)}
      data-selected={pairs
        .map((v, i) => (v ? i : -1))
        .filter((i) => i >= 0)
        .join(",")}
      data-solved={String(solved)}
      data-actions={actions}
    >
      <header className="ai10061-hero">
        <small>CLASS 9 · EUCLIDEAN GEOMETRY</small>
        <h1>Alternate Interior Angles</h1>
        <p>
          Recognize alternate interior angle pairs and use their equality when
          two lines are parallel.
        </p>
        <div>
          <span>◷ 30 min</span>
          <span>RIGOROUS</span>
          <span>PROOF</span>
          <span>geometry2d</span>
          <span>Lesson 9.9</span>
        </div>
        <Link to="/lessons/school">
          <ArrowLeft /> School lessons
        </Link>
      </header>
      <nav className="ai10061-tabs">
        {tabs.map((item, i) => (
          <button
            key={item}
            className={tab === i ? "active" : ""}
            aria-selected={tab === i}
            onClick={() => act(() => setTab(i))}
          >
            {item}
          </button>
        ))}
      </nav>
      <main>
        <section className="ai10061-explorer">
          <header>
            <h2>Explore Alternate Interior Angles</h2>
            <p>
              Drag the purple transversal to see how alternate interior angles
              stay equal.
            </p>
            <div>
              <button onClick={reset}>
                <RotateCcw /> Reset
              </button>
              <button onClick={() => act(() => setChecked(true))}>
                ☑ Check
              </button>
              <Toggle
                label="Show angle labels"
                value={labels}
                change={setLabels}
              />
            </div>
          </header>
          <div className="ai10061-work">
            <aside>
              <section>
                <h3>Relationship</h3>
                <p>Parallel lines ⇄ Alternate interior angles</p>
                <div>
                  <button
                    className={parallel ? "active" : ""}
                    onClick={() => act(() => setParallel(true))}
                  >
                    Lines are parallel
                  </button>
                  <button
                    className={!parallel ? "active" : ""}
                    onClick={() => act(() => setParallel(false))}
                  >
                    Converse ⓘ
                  </button>
                </div>
              </section>
              <section>
                <h3>Angle Readouts</h3>
                <div className="ai10061-readouts">
                  <span>
                    ∠3<b>{angle}°</b>
                  </span>
                  <span>
                    ∠5<b>{parallel ? angle : angle - 9}°</b>
                  </span>
                  <span>
                    ∠4<b>{acute}°</b>
                  </span>
                  <span>
                    ∠6<b>{parallel ? acute : acute + 9}°</b>
                  </span>
                </div>
              </section>
              <section>
                <h3>Selected Pair</h3>
                <p className={valid ? "equal" : "unequal"}>
                  ∠3 and ∠5 <b>{valid ? "Equal ✓" : "Unequal"}</b>
                </p>
              </section>
              <p className="purple">● ∠3 and ∠5 (alternate interior)</p>
              <p className="orange">● ∠4 and ∠6 (alternate interior)</p>
            </aside>
            <article>
              <AlternateDiagram
                angle={angle}
                offset={offset}
                labels={labels}
                parallel={parallel}
                onMove={(nextOffset, nextAngle) =>
                  act(() => {
                    setOffset(nextOffset);
                    setAngle(nextAngle);
                    setChecked(false);
                  })
                }
              />
            </article>
          </div>
          <footer>
            💡 <b>Observation:</b> When lines ℓ and m are parallel, ∠3 = ∠5 and
            ∠4 = ∠6.
          </footer>
        </section>
        <section className="ai10061-theory">
          <article>
            <h2>▱ Why it works</h2>
            <h3>When two parallel lines are cut by a transversal:</h3>
            <p>
              <Check /> Alternate interior angles are between the lines and on
              opposite sides of the transversal.
            </p>
            <p>
              <Check /> They have the same measure.
            </p>
            <p>
              <Check /> If a pair of alternate interior angles are equal, the
              lines must be parallel (converse).
            </p>
            <aside>
              <b>Rule:</b> Parallel lines cut by a transversal have equal
              alternate interior angles.
              <br />
              <br />
              <b>Converse:</b> If alternate interior angles are equal, the lines
              are parallel.
            </aside>
          </article>
          <article>
            <h2>▣ Worked Example</h2>
            <p>If ∠3 = 117°, find ∠5.</p>
            <MiniAlternate />
            <ol>
              <li>∠3 and ∠5 are alternate interior angles.</li>
              <li>Lines ℓ and m are parallel.</li>
            </ol>
            <footer>
              Therefore,<strong>∠5 = ∠3 = 117°</strong>
            </footer>
          </article>
          <article className="warning">
            <h2>⊗ Common Misconception</h2>
            <h3>Alternate angles must be between the lines</h3>
            <p>
              <b>Incorrect:</b> ∠1 and ∠5 are not alternate interior (∠1 is
              exterior).
            </p>
            <MiniAlternate wrong />
            <p>
              <b>Correct:</b> ∠3 and ∠5 are between the lines and on opposite
              sides of the transversal.
            </p>
            <MiniAlternate />
          </article>
        </section>
        <section className="ai10061-challenge">
          <header>
            <h2>Challenge: Find the Alternate Interior Pairs</h2>
            <p>
              Drag the purple transversal anywhere on the parallel lines, then
              select the two pairs of alternate interior angles.
            </p>
          </header>
          <div>
            <AlternateDiagram
              angle={117}
              offset={challengeMoved ? 25 : -20}
              labels
              parallel
              onMove={() => act(() => setChallengeMoved(true))}
              compact
            />
            <section>
              <h3>Step 1: Drag the transversal</h3>
              <p>Move t to any position.</p>
              <button
                className={challengeMoved ? "done" : ""}
                onClick={() => act(() => setChallengeMoved(true))}
              >
                <Check />{" "}
                {challengeMoved
                  ? "Great! Transversal moved."
                  : "Move transversal"}
              </button>
              <h3>Step 2: Select the alternate interior pairs</h3>
              <p>Choose the two correct pairs.</p>
              {["∠3 and ∠5", "∠4 and ∠6", "∠1 and ∠7", "∠2 and ∠8"].map(
                (label, i) => (
                  <label
                    key={label}
                    className={pairs[i] ? (i < 2 ? "right" : "wrong") : ""}
                  >
                    <input
                      type="checkbox"
                      checked={pairs[i]}
                      onChange={() =>
                        act(() =>
                          setPairs((current) =>
                            current.map((v, n) => (n === i ? !v : v)),
                          ),
                        )
                      }
                    />
                    {label}
                  </label>
                ),
              )}
            </section>
            <aside className={solved ? "solved" : ""}>
              <b>🏆</b>
              <h2>{solved ? "Well done!" : "Keep exploring"}</h2>
              <p>
                {solved
                  ? "You found both pairs correctly."
                  : "Move the transversal and select two pairs."}
              </p>
              <span>⌁⌁⌁</span>
            </aside>
          </div>
        </section>
        <section className="ai10061-takeaway">
          <h2>▱ Key Takeaways</h2>
          <div>
            {[
              [
                "↗↙",
                "Location matters",
                "Alternate interior angles are between the lines and on opposite sides of the transversal.",
              ],
              [
                "=",
                "Equality",
                "If lines are parallel, alternate interior angles are equal.",
              ],
              [
                "↔",
                "Converse",
                "If a pair of alternate interior angles are equal, the lines are parallel.",
              ],
              [
                "◉",
                "Look and label",
                "Use labels to spot alternate interior pairs quickly.",
              ],
            ].map(([icon, title, text]) => (
              <article key={title}>
                <i>{icon}</i>
                <b>{title}</b>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </section>
      </main>
      <nav className="ai10061-adjacent">
        <Link to="/lessons/school/class-9/class-9-euclidean-geometry-corresponding-angles">
          <ArrowLeft /> Previous: Corresponding Angles
        </Link>
        <Link to="/lessons/school">
          Next: Interior Angles on the Same Side <ArrowRight />
        </Link>
      </nav>
    </section>
  );
}

function Toggle({
  label,
  value,
  change,
}: {
  label: string;
  value: boolean;
  change: (v: boolean) => void;
}) {
  return (
    <label className="ai10061-toggle">
      {label}
      <input
        type="checkbox"
        checked={value}
        onChange={(e) => change(e.target.checked)}
      />
      <i />
    </label>
  );
}
function AlternateDiagram({
  angle,
  offset,
  labels,
  parallel,
  onMove,
  compact = false,
}: {
  angle: number;
  offset: number;
  labels: boolean;
  parallel: boolean;
  onMove: (offset: number, angle: number) => void;
  compact?: boolean;
}) {
  const move = (e: React.PointerEvent<SVGCircleElement>) => {
    if (e.buttons !== 1) return;
    const svg = e.currentTarget.ownerSVGElement!,
      box = svg.getBoundingClientRect(),
      x = ((e.clientX - box.left) / box.width) * 560;
    onMove(Math.round(x - 280), angle);
  };
  return (
    <svg
      className={`ai10061-diagram ${compact ? "compact" : ""}`}
      viewBox="0 0 560 500"
      aria-label="Interactive alternate interior angle diagram"
    >
      <rect className="interior" x="120" y="165" width="330" height="220" />
      <line className="base" x1="50" y1="165" x2="510" y2="165" />
      <line
        className="base"
        x1="50"
        y1="385"
        x2="510"
        y2={parallel ? 385 : 370}
      />
      <line
        className="transversal"
        x1={200 + offset}
        y1="30"
        x2={390 + offset}
        y2="470"
      />
      <circle
        className="handle"
        cx={295 + offset}
        cy="250"
        r="13"
        tabIndex={0}
        onPointerMove={move}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") onMove(offset + 8, angle);
          if (e.key === "ArrowLeft") onMove(offset - 8, angle);
          if (e.key === "ArrowUp") onMove(offset, Math.min(175, angle + 1));
        }}
      />
      {labels && (
        <>
          {[
            [1, 230, 145],
            [2, 273, 145],
            [3, 247, 195],
            [4, 295, 195],
            [5, 330, 365],
            [6, 377, 365],
            [7, 350, 415],
            [8, 398, 415],
          ].map(([n, x, y]) => (
            <text key={n} x={x + offset} y={y}>
              {n}
            </text>
          ))}
        </>
      )}
      <text className="name" x="32" y="155">
        ℓ
      </text>
      <text className="name" x="32" y="376">
        m
      </text>
      <text className="name" x={205 + offset} y="25">
        t
      </text>
    </svg>
  );
}
function MiniAlternate({ wrong = false }: { wrong?: boolean }) {
  return (
    <svg className="ai10061-mini" viewBox="0 0 220 150">
      <rect x="20" y="45" width="180" height="70" />
      <line x1="10" y1="45" x2="210" y2="45" />
      <line x1="10" y1="115" x2="210" y2="115" />
      <line x1="100" y1="145" x2="135" y2="5" />
      <path
        className="purple"
        d={
          wrong
            ? "M125 45H103A23 23 0 0 1 130 22Z"
            : "M117 45L96 45A23 23 0 0 0 112 68Z"
        }
      />
      <path className="green" d="M100 115H78A23 23 0 0 1 105 92Z" />
      {wrong && <path className="dash" d="M135 30Q190 60 110 108" />}
    </svg>
  );
}
