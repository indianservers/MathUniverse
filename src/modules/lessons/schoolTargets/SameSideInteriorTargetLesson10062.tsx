import { ArrowLeft, ArrowRight, Check, RotateCcw } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import type { SchoolSyllabusLesson } from "../syllabus/lessonSyllabusTypes";
import "./SameSideInteriorTargetLesson10062.css";

export default function SameSideInteriorTargetLesson10062({
  lesson: _lesson,
}: {
  lesson: SchoolSyllabusLesson;
}) {
  const [first, setFirst] = useState(62),
    [second, setSecond] = useState(118),
    [parallel, setParallel] = useState(true),
    [pair, setPair] = useState(0),
    [tab, setTab] = useState(0),
    [tilt, setTilt] = useState(14),
    [challengeChecked, setChallengeChecked] = useState(true),
    [actions, setActions] = useState(0);
  const sum = first + second,
    balanced = sum === 180,
    challengeValid = tilt === 14 && challengeChecked;
  const act = (fn: () => void) => {
    fn();
    setActions((n) => n + 1);
  };
  const updateFirst = (value: number) =>
    act(() => {
      const v = Math.max(5, Math.min(175, value));
      setFirst(v);
      if (parallel) setSecond(180 - v);
    });
  const updateSecond = (value: number) =>
    act(() => {
      const v = Math.max(5, Math.min(175, value));
      setSecond(v);
      if (parallel) setFirst(180 - v);
    });
  return (
    <section
      className="ss10062-page"
      data-testid="school-mockup-0736"
      data-object-model="dedicated-same-side-interior-supplement-converse-engine"
      data-angles={`${first},${second}`}
      data-sum={sum}
      data-parallel={String(parallel)}
      data-pair={pair}
      data-tilt={tilt}
      data-challenge-valid={String(challengeValid)}
      data-actions={actions}
    >
      <header className="ss10062-hero">
        <small>CLASS 9 · EUCLIDEAN GEOMETRY</small>
        <h1>Interior Angles on the Same Side</h1>
        <p>
          Explore co-interior (same-side interior) angles and their
          supplementary relationship.
        </p>
        <div>
          <span>◷ 30 min</span>
          <span>RIGOROUS</span>
          <span>geometry2d</span>
        </div>
      </header>
      <nav className="ss10062-tabs">
        {["⚗ Interact", "▣ Learn", "▱ Example", "◫ Formula", "⌘ Practice"].map(
          (x, i) => (
            <button
              key={x}
              className={tab === i ? "active" : ""}
              aria-selected={tab === i}
              onClick={() => act(() => setTab(i))}
            >
              {x}
            </button>
          ),
        )}
      </nav>
      <main>
        <section className="ss10062-lab">
          <header>
            <h2>TRANSVERSAL INTERACTIVE</h2>
            <p>Select the same-side interior angle pair and explore.</p>
            <div>
              <button
                className={parallel ? "active" : ""}
                onClick={() =>
                  act(() => {
                    setParallel(true);
                    setSecond(180 - first);
                  })
                }
              >
                Parallel Lines
              </button>
              <button
                className={!parallel ? "active" : ""}
                onClick={() => act(() => setParallel(false))}
              >
                Nonparallel Lines
              </button>
            </div>
          </header>
          <div className="ss10062-work">
            <article>
              <SameSideDiagram
                first={first}
                second={second}
                tilt={0}
                onAngle={updateFirst}
              />
              <aside>
                <b>⌁ C-pattern (Same-side interior)</b>
                <p>∠1 and ∠2 are co-interior angles.</p>
              </aside>
            </article>
            <aside>
              <h3>1. SELECT ANGLE PAIR</h3>
              {["∠1 & ∠2", "∠3 & ∠4"].map((x, i) => (
                <button
                  key={x}
                  className={pair === i ? "active" : ""}
                  onClick={() => act(() => setPair(i))}
                >
                  <b>{x}</b>
                  <span>same-side interior</span>
                  <i>{pair === i ? "✓" : ""}</i>
                </button>
              ))}
              <h3>2. MEASURE ANGLES</h3>
              <Stepper label="∠1" value={first} change={updateFirst} />
              <Stepper label="∠2" value={second} change={updateSecond} />
              <h3>3. SUM (SUPPLEMENTARY CHECK)</h3>
              <strong className={balanced ? "good" : "bad"}>
                {first}° + {second}° = {sum}° {balanced && <Check />}
              </strong>
              <input
                aria-label="Angle sum"
                type="range"
                min="0"
                max="180"
                value={Math.min(180, sum)}
                readOnly
              />
              <b className="balanced">
                {balanced
                  ? "Balanced! Sum is 180°."
                  : "Adjust the pair to 180°."}
              </b>
              <footer>
                ☝ Drag the purple transversal or use ± to change one angle. The
                other updates.
              </footer>
            </aside>
          </div>
          <footer className={balanced && parallel ? "success" : "pending"}>
            <Check />
            <span>
              <b>
                {balanced && parallel
                  ? "Great! For parallel lines, same-side interior angles are supplementary."
                  : "Keep exploring the relationship."}
              </b>
              Their sum is {sum}°.
            </span>
          </footer>
        </section>
        <section className="ss10062-theory">
          <article>
            <h2>💡 WHY IT WORKS</h2>
            <p>
              When two parallel lines are cut by a transversal, the interior
              angles on the same side lie on a straight line when one line is
              slid over the other without rotation.
            </p>
            <p>
              Hence, they are <b>supplementary.</b>
            </p>
            <strong>Straight line ⟶ 180°</strong>
            <footer>∠1 + ∠2 = 180°</footer>
          </article>
          <article>
            <h2>▣ WORKED EXAMPLE</h2>
            <p>If one same-side interior angle is 73°, what is the other?</p>
            <p>
              <b>Given</b> ∠1 = 73°
            </p>
            <p>
              <b>Since</b> ∠1 + ∠2 = 180°
            </p>
            <p>
              <b>So</b> ∠2 = 180° − 73° = 107°
            </p>
            <footer>Answer: ∠2 = 107°</footer>
          </article>
          <article>
            <h2>♙ KEY FACT (THEOREM)</h2>
            <p>
              For parallel lines cut by a transversal, same-side interior angles
              are supplementary.
            </p>
            <footer>∠1 + ∠2 = 180°</footer>
            <p>
              <b>Converse:</b> If a pair of same-side interior angles are
              supplementary, then the lines are parallel.
            </p>
          </article>
        </section>
        <section className="ss10062-lower">
          <article>
            <h2>△ COMMON MISCONCEPTION</h2>
            <p>
              Same-side interior angles are supplementary, not generally equal.
            </p>
            <div>
              <MiniSame wrong />
              <MiniSame />
            </div>
            <footer>They add to 180°, but are not usually equal.</footer>
          </article>
          <article>
            <h2>◎ CHALLENGE: MAKE THEM 180°</h2>
            <p>
              Rotate line m until the selected same-side interior angles add to
              180°. Then verify parallelism.
            </p>
            <SameSideDiagram
              first={62}
              second={118}
              tilt={tilt}
              onAngle={(value) =>
                act(() => {
                  setTilt(Math.max(0, Math.min(28, value - 48)));
                  setChallengeChecked(false);
                })
              }
              compact
            />
            <label>
              Rotate line m{" "}
              <input
                aria-label="Rotate line m"
                type="range"
                min="0"
                max="28"
                value={tilt}
                onChange={(e) =>
                  act(() => {
                    setTilt(+e.target.value);
                    setChallengeChecked(false);
                  })
                }
              />
              <b>{tilt}°</b>
            </label>
            <div>
              <button
                onClick={() =>
                  act(() => {
                    setTilt(14);
                    setChallengeChecked(false);
                  })
                }
              >
                <RotateCcw /> Reset
              </button>
              <button onClick={() => act(() => setChallengeChecked(true))}>
                Check Parallelism
              </button>
            </div>
            <footer className={challengeValid ? "success" : "pending"}>
              <Check />{" "}
              {challengeValid
                ? "Perfect! ∠1 + ∠2 = 180°. Lines l and m are parallel."
                : "Rotate line m to 14°, then check."}
            </footer>
          </article>
        </section>
      </main>
      <nav className="ss10062-adjacent">
        <Link to="/lessons/school/class-9/class-9-euclidean-geometry-alternate-interior-angles">
          <ArrowLeft />{" "}
          <span>
            Previous
            <br />
            <b>Alternate Interior Angles</b>
          </span>
        </Link>
        <Link to="/lessons/school">
          <span>
            Next
            <br />
            <b>Parallel Line Converse Theorems</b>
          </span>
          <ArrowRight />
        </Link>
      </nav>
    </section>
  );
}
function Stepper({
  label,
  value,
  change,
}: {
  label: string;
  value: number;
  change: (v: number) => void;
}) {
  return (
    <div className="ss10062-stepper">
      <b>{label}</b>
      <span>=</span>
      <strong>{value}°</strong>
      <button onClick={() => change(value - 1)}>−</button>
      <button onClick={() => change(value + 1)}>+</button>
    </div>
  );
}
function SameSideDiagram({
  first,
  second,
  tilt,
  onAngle,
  compact = false,
}: {
  first: number;
  second: number;
  tilt: number;
  onAngle: (v: number) => void;
  compact?: boolean;
}) {
  return (
    <svg
      className={`ss10062-diagram ${compact ? "compact" : ""}`}
      viewBox="0 0 520 430"
      aria-label="Interactive same-side interior diagram"
    >
      <line className="base" x1="35" y1="125" x2="480" y2="125" />
      <line
        className="base lower"
        x1="35"
        y1={330 + tilt / 2}
        x2="480"
        y2={330 - tilt / 2}
      />
      <line className="trans" x1="170" y1="25" x2="350" y2="405" />
      <circle
        className="handle"
        cx="260"
        cy="215"
        r="10"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") onAngle(first + 1);
          if (e.key === "ArrowLeft") onAngle(first - 1);
        }}
      />
      <path className="blue" d="M218 125H178A40 40 0 0 0 235 162Z" />
      <path className="purple" d={`M310 ${330} H270 A40 40 0 0 1 327 293Z`} />
      <path className="dash" d="M222 160Q285 160 285 292" />
      <text x="180" y="165">
        ∠1
      </text>
      <text x="274" y="302">
        ∠2
      </text>
      <text className="name" x="18" y="115">
        l
      </text>
      <text className="name" x="18" y="325">
        m
      </text>
      <text className="name" x="165" y="20">
        t
      </text>
      {compact && (
        <>
          <text x="190" y="104">
            {first}°
          </text>
          <text x="320" y="300">
            {second}°
          </text>
        </>
      )}
    </svg>
  );
}
function MiniSame({ wrong = false }: { wrong?: boolean }) {
  return (
    <figure>
      <b>{wrong ? "Not Equal (in general)" : "Supplementary (correct)"}</b>
      <svg viewBox="0 0 160 135">
        <line x1="15" y1="35" x2="145" y2="35" />
        <line x1="15" y1="105" x2="145" y2="105" />
        <line x1="70" y1="10" x2="105" y2="130" />
        <path d="M77 35H52A25 25 0 0 0 84 59Z" />
        <path className="purple" d="M96 105H71A25 25 0 0 1 89 82Z" />
        <text x="48" y="70">
          62°
        </text>
        <text x="95" y="90">
          118°
        </text>
      </svg>
      <i>{wrong ? "×" : "✓"}</i>
    </figure>
  );
}
