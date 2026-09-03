import { ArrowLeft, ArrowRight, Check, RotateCcw, X } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import type { SchoolSyllabusLesson } from "../syllabus/lessonSyllabusTypes";
import "./ParallelConverseTargetLesson10063.css";

const tests = [
  {
    title: "Corresponding Angles",
    detail: "If corresponding angles are equal, then lines are parallel.",
    color: "blue",
  },
  {
    title: "Alternate Interior Angles",
    detail: "If alternate interior angles are equal, then lines are parallel.",
    color: "purple",
  },
  {
    title: "Same-Side Interior Angles",
    detail:
      "If same-side interior angles are supplementary, then lines are parallel.",
    color: "teal",
  },
];
const answers = ["alternate", "same-side", "insufficient"];

export default function ParallelConverseTargetLesson10063({
  lesson: _lesson,
}: {
  lesson: SchoolSyllabusLesson;
}) {
  const [test, setTest] = useState(0),
    [angle, setAngle] = useState(58),
    [offset, setOffset] = useState(0),
    [lineSkew, setLineSkew] = useState(0),
    [tab, setTab] = useState(0),
    [challenge, setChallenge] = useState([...answers]),
    [graded, setGraded] = useState(true),
    [actions, setActions] = useState(0);
  const paired = test === 2 ? 180 - angle : angle,
    condition = lineSkew === 0;
  const act = (fn: () => void) => {
    fn();
    setActions((n) => n + 1);
  };
  const reset = () =>
    act(() => {
      setTest(0);
      setAngle(58);
      setOffset(0);
      setLineSkew(0);
    });
  const score = challenge.filter((value, i) => value === answers[i]).length;
  return (
    <section
      className="pc10063-page"
      data-testid="school-mockup-0737"
      data-object-model="dedicated-parallel-converse-evidence-inference-engine"
      data-test={test}
      data-angle={angle}
      data-paired={paired}
      data-offset={offset}
      data-line-skew={lineSkew}
      data-condition={String(condition)}
      data-challenge-score={graded ? score : "idle"}
      data-actions={actions}
    >
      <header className="pc10063-hero">
        <small>CLASS 9 · EUCLIDEAN GEOMETRY</small>
        <h1>Parallel Line Converse Theorems</h1>
        <p>Use angle conditions to prove two lines are parallel.</p>
        <div>
          <span>◷ 30 min</span>
          <span>RIGOROUS</span>
          <span>PROOF</span>
          <span>geometry2d</span>
        </div>
        <Link to="/lessons/school">
          <ArrowLeft /> School Lessons
        </Link>
      </header>
      <nav className="pc10063-tabs">
        {["☼ Interact", "▣ Learn", "◇ Example", "⌁ Formula", "⌕ Practice"].map(
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
        <section className="pc10063-lab">
          <header>
            <h2>PROOF-TESTING LAB</h2>
            <p>
              Drag the transversal, adjust angles, and test converse conditions.
            </p>
            <button onClick={reset}>
              <RotateCcw /> Reset Lab
            </button>
          </header>
          <div className="pc10063-work">
            <aside>
              <section>
                <h3>1. CHOOSE A CONVERSE TEST</h3>
                <p>Select the angle condition to test.</p>
                {tests.map((item, i) => (
                  <button
                    key={item.title}
                    className={`${item.color} ${test === i ? "active" : ""}`}
                    onClick={() => act(() => setTest(i))}
                  >
                    <i>⌁</i>
                    <span>
                      <b>{item.title}</b>
                      <small>{item.detail}</small>
                    </span>
                    <em>{test === i ? "✓" : ""}</em>
                  </button>
                ))}
              </section>
              <section>
                <h3>2. GIVEN ANGLE</h3>
                <p>Adjust the highlighted angle.</p>
                <label>
                  <input
                    aria-label="Given angle"
                    type="range"
                    min="10"
                    max="170"
                    value={angle}
                    onChange={(e) => act(() => setAngle(+e.target.value))}
                  />
                  <b>{angle}°</b>
                </label>
              </section>
              <section>
                <h3>3. EVIDENCE CHECKLIST</h3>
                <p>Does the diagram satisfy the chosen condition?</p>
                {tests.map((item, i) => (
                  <div key={item.title}>
                    <span>
                      {item.title.toLowerCase()} are{" "}
                      {i === 2 ? "supplementary" : "equal"}
                    </span>
                    <b>
                      {test === i
                        ? `${angle}° ${i === 2 ? "+" : "="} ${paired}°`
                        : "—"}
                    </b>
                    <i>{test === i && condition ? "✓" : ""}</i>
                  </div>
                ))}
              </section>
              <footer className={condition ? "success" : "pending"}>
                <Check />
                <span>
                  <b>
                    RESULT:{" "}
                    {condition
                      ? "Condition satisfied."
                      : "Condition not satisfied."}
                  </b>
                  Therefore, ℓ {condition ? "∥" : "∦"} m
                </span>
              </footer>
            </aside>
            <article>
              <ConverseDiagram
                angle={angle}
                paired={paired}
                offset={offset}
                skew={lineSkew}
                test={test}
              />
              <nav>
                <button onClick={() => act(() => setOffset(offset + 8))}>
                  ☝ Move t
                </button>
                <button
                  onClick={() => act(() => setAngle(Math.min(170, angle + 1)))}
                >
                  ⟳ Rotate t
                </button>
                <button
                  onClick={() =>
                    act(() => setLineSkew(lineSkew === 0 ? 12 : 0))
                  }
                >
                  ↔ Drag ℓ
                </button>
                <button
                  onClick={() =>
                    act(() => setLineSkew(lineSkew === 0 ? -12 : 0))
                  }
                >
                  ↕ Drag m
                </button>
                <button onClick={() => act(() => setOffset(0))}>⌕ Zoom</button>
              </nav>
            </article>
          </div>
        </section>
        <section className="pc10063-rule">
          <i>☼</i>
          <div>
            <h2>THE RULE (THEOREM)</h2>
            <p>
              If any one of the following conditions holds for a transversal
              cutting two lines, then the lines are parallel.
            </p>
            <ol>
              <li>Corresponding angles are equal.</li>
              <li>Alternate interior angles are equal.</li>
              <li>Same-side interior angles are supplementary.</li>
            </ol>
          </div>
          <strong>
            Any one valid condition is sufficient
            <br />
            to prove parallelism.
          </strong>
        </section>
        <section className="pc10063-theory">
          <article>
            <h2>WHY IT WORKS</h2>
            <p>
              These converses come from the original parallel line angle
              relationships. If the resulting angles match the parallel
              relationships, the only way this can happen is when the lines are
              parallel.
            </p>
            <MiniConverse mode={0} />
            <MiniConverse mode={1} />
            <MiniConverse mode={2} />
          </article>
          <article>
            <h2>WORKED EXAMPLE</h2>
            <p>Given: ∠1 and ∠5 are corresponding angles with m∠1 = 58°.</p>
            <MiniConverse mode={0} large />
            <b>Solution:</b>
            <ol>
              <li>∠1 and ∠5 are corresponding angles.</li>
              <li>m∠1 = m∠5 = 58°.</li>
              <li>Corresponding angles are equal.</li>
              <li>By the Converse of Corresponding Angles Theorem,</li>
            </ol>
            <footer>ℓ ∥ m</footer>
          </article>
          <article className="warning">
            <h2>COMMON MISCONCEPTION</h2>
            <p>
              Measuring an unrelated pair of equal angles does not prove the
              lines are parallel.
            </p>
            <b>Not a valid converse condition.</b>
            <MiniConverse mode={3} large />
            <footer>
              <X /> These angles are not corresponding, alternate interior, or
              same-side interior. Equal measure here does not guarantee ℓ ∥ m.
            </footer>
          </article>
        </section>
        <section className="pc10063-challenge">
          <header>
            <h2>CHALLENGE: Choose the correct converse theorem</h2>
            <p>
              For each diagram below, select which converse theorem proves ℓ ∥
              m. One claim is NOT sufficient.
            </p>
            <button onClick={() => act(() => setGraded(true))}>
              Check Answers
            </button>
          </header>
          <div>
            {[
              ["72°", "72°"],
              ["110°", "70°"],
              ["45°", "45°"],
            ].map((values, i) => (
              <article key={i}>
                <i>{i + 1}</i>
                <MiniConverse mode={i} large />
                <select
                  aria-label={`Challenge theorem ${i + 1}`}
                  value={challenge[i]}
                  onChange={(e) =>
                    act(() => {
                      setGraded(false);
                      setChallenge((current) =>
                        current.map((v, n) => (n === i ? e.target.value : v)),
                      );
                    })
                  }
                >
                  <option value="alternate">Alternate Interior Angles</option>
                  <option value="same-side">Same-Side Interior Angles</option>
                  <option value="corresponding">Corresponding Angles</option>
                  <option value="insufficient">
                    Not Sufficient (Incorrect Claim)
                  </option>
                </select>
                <footer
                  className={
                    graded && challenge[i] === answers[i]
                      ? "correct"
                      : "incorrect"
                  }
                >
                  {graded && challenge[i] === answers[i] ? <Check /> : <X />}
                  <span>
                    <b>
                      {graded && challenge[i] === answers[i]
                        ? "Correct!"
                        : "Check this claim."}
                    </b>
                    {values[0]} and {values[1]}{" "}
                    {i === 1
                      ? "sum to 180°."
                      : i === 0
                        ? "are equal alternate angles."
                        : "do not form a valid pair."}
                  </span>
                </footer>
              </article>
            ))}
          </div>
        </section>
      </main>
      <nav className="pc10063-adjacent">
        <Link to="/lessons/school/class-9/class-9-euclidean-geometry-interior-angles-on-the-same-side">
          <ArrowLeft /> Previous: Interior Angles on the Same Side
        </Link>
        <Link to="/lessons/school">
          Next: Triangle Angle Sum Theorem <ArrowRight />
        </Link>
      </nav>
    </section>
  );
}
function ConverseDiagram({
  angle,
  paired,
  offset,
  skew,
  test,
}: {
  angle: number;
  paired: number;
  offset: number;
  skew: number;
  test: number;
}) {
  return (
    <svg
      className="pc10063-diagram"
      viewBox="0 0 600 570"
      aria-label="Interactive parallel converse diagram"
    >
      <defs>
        <pattern
          id="pc-grid"
          width="25"
          height="25"
          patternUnits="userSpaceOnUse"
        >
          <path d="M25 0H0V25" />
        </pattern>
      </defs>
      <rect width="600" height="570" fill="url(#pc-grid)" />
      <line className="base" x1="35" y1="165" x2="560" y2={165 + skew} />
      <line className="base" x1="35" y1="420" x2="560" y2="420" />
      <line
        className="trans"
        x1={190 + offset}
        y1="45"
        x2={400 + offset}
        y2="530"
      />
      <path
        className={`mark m${test}`}
        d={`M${260 + offset} 165 h42 a42 42 0 0 1 -25 38Z`}
      />
      <path
        className={`mark m${test}`}
        d={`M${370 + offset} 420 h42 a42 42 0 0 0 -24 -38Z`}
      />
      <text x={305 + offset} y="210">
        {angle}°
      </text>
      <text x={405 + offset} y="395">
        {paired}°
      </text>
      <text className="name" x="565" y="152">
        ℓ
      </text>
      <text className="name" x="565" y="407">
        m
      </text>
      <text className="name" x={190 + offset} y="35">
        t
      </text>
    </svg>
  );
}
function MiniConverse({
  mode,
  large = false,
}: {
  mode: number;
  large?: boolean;
}) {
  return (
    <svg
      className={`pc10063-mini ${large ? "large" : ""}`}
      viewBox="0 0 210 115"
    >
      <line x1="15" y1="32" x2="195" y2="32" />
      <line x1="15" y1="88" x2="195" y2="88" />
      <line x1="82" y1="5" x2="125" y2="110" />
      <path className={`c${mode}`} d="M93 32H72A22 22 0 0 1 99 12Z" />
      <path
        className={`c${mode}`}
        d={
          mode === 3
            ? "M115 88H95A22 22 0 0 0 121 107Z"
            : "M115 88H95A22 22 0 0 1 109 67Z"
        }
      />
      {large && (
        <>
          <text x="67" y="25">
            1
          </text>
          <text x="92" y="82">
            5
          </text>
        </>
      )}
    </svg>
  );
}
