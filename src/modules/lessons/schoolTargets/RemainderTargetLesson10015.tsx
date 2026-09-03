import { Lightbulb, RotateCcw, Shuffle } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { schoolLessonCatalog } from "../catalog/school/schoolSyllabusCatalog";
import type { SchoolSyllabusLesson } from "../syllabus/lessonSyllabusTypes";
import "./RemainderTargetLesson10015.css";

const examples = [
  [17, 4],
  [23, 6],
  [41, 7],
  [55, 9],
] as const;
const exercises = [
  [26, 5],
  [43, 6],
  [88, 9],
  [71, 8],
  [103, 10],
] as const;
const divide = (n: number, d: number) => ({
  q: Math.floor(n / Math.max(1, d)),
  r: n % Math.max(1, d),
});

export default function RemainderTargetLesson10015({
  lesson,
}: {
  lesson: SchoolSyllabusLesson;
}) {
  const [n, setN] = useState(29);
  const [d, setD] = useState(5);
  const [showJumps, setShowJumps] = useState(true);
  const [showGroups, setShowGroups] = useState(true);
  const [showRemainder, setShowRemainder] = useState(true);
  const [draftN, setDraftN] = useState("37");
  const [draftD, setDraftD] = useState("6");
  const [answers, setAnswers] = useState(exercises.map(() => ["", ""]));
  const [graded, setGraded] = useState<boolean[] | null>(null);
  const [hint, setHint] = useState(false);
  const [tab, setTab] = useState("Interact");
  const [actions, setActions] = useState(0);
  const { q, r } = divide(n, d);
  const max = Math.max(30, Math.ceil(n / 5) * 5);
  const idx = schoolLessonCatalog.findIndex((item) => item.id === lesson.id);
  const prev = schoolLessonCatalog[idx - 1];
  const next = schoolLessonCatalog[idx + 1];
  const act = (action: () => void) => {
    action();
    setActions((count) => count + 1);
  };
  const apply = (nextN: number, nextD: number) =>
    act(() => {
      setN(Math.max(0, Math.floor(nextN)));
      setD(Math.max(1, Math.floor(nextD)));
    });
  const reset = () =>
    act(() => {
      setN(29);
      setD(5);
      setShowJumps(true);
      setShowGroups(true);
      setShowRemainder(true);
      setHint(false);
    });
  const points = Array.from({ length: q + 1 }, (_, i) => i * d);
  const x = (value: number) => 35 + (value / max) * 480;
  const checkAnswers = () =>
    act(() =>
      setGraded(
        exercises.map(([a, b], i) => {
          const expected = divide(a, b);
          return (
            Number(answers[i][0]) === expected.q &&
            Number(answers[i][1]) === expected.r
          );
        }),
      ),
    );

  return (
    <section
      className="rr10015-page"
      data-testid="school-mockup-0689"
      data-object-model="dedicated-division-number-line-jumps-remainder-invariant-and-grading"
      data-division={`${n}/${d}`}
      data-quotient={q}
      data-remainder={r}
      data-visible={`${showJumps}|${showGroups}|${showRemainder}`}
      data-correct={graded?.filter(Boolean).length ?? ""}
      data-hint={hint}
      data-actions={actions}
    >
      <header className="rr10015-hero">
        <small>CLASS 7 · NUMBERS AND ARITHMETIC</small>
        <h1>Remainder Reasoning</h1>
        <p>
          <b>Objective:</b> Understand that when a number is divided by another,
          the remainder is always smaller than the divisor.
        </p>
        <dl>
          <span>18 min</span>
          <span>FOUNDATION</span>
          <span>CONCEPT</span>
          <span>number</span>
          <span>arithmetic</span>
        </dl>
        <aside>
          <Link to="/lessons/school">← School lessons</Link>
          <p>
            <b>Grade:</b> Class 7<br />
            <b>Topic:</b> Numbers & Arithmetic
            <br />
            <b>Concept:</b> Remainder Reasoning
          </p>
        </aside>
      </header>
      <nav className="rr10015-tabs">
        {["Interact", "Learn", "Worked Example", "Formula", "Practice"].map(
          (item) => (
            <button
              className={tab === item ? "active" : ""}
              onClick={() => act(() => setTab(item))}
              key={item}
            >
              {item}
            </button>
          ),
        )}
      </nav>
      <section className="rr10015-lab">
        <header>
          <h2>♧ INTERACT</h2>
          <p>Explore division using the number line model.</p>
          <div>
            <button onClick={reset}>
              <RotateCcw />
              Reset
            </button>
            <button
              onClick={() =>
                apply(
                  10 + Math.floor(Math.random() * 80),
                  2 + Math.floor(Math.random() * 9),
                )
              }
            >
              <Shuffle />
              Random
            </button>
            <button onClick={() => act(() => setHint((value) => !value))}>
              <Lightbulb />
              Hint
            </button>
          </div>
        </header>
        <div className="rr10015-workspace">
          <aside>
            <h3>Set the division</h3>
            <label>
              Dividend (n)
              <input
                aria-label="Dividend"
                type="number"
                value={n}
                onChange={(event) => apply(Number(event.target.value), d)}
              />
            </label>
            <label>
              Divisor (d)
              <input
                aria-label="Divisor"
                type="number"
                min="1"
                value={d}
                onChange={(event) => apply(n, Number(event.target.value))}
              />
            </label>
            <section>
              <h3>Division</h3>
              <strong>
                {n} ÷ {d}
              </strong>
            </section>
            <section>
              <h3>Readout</h3>
              <p>Quotient (q) = {q}</p>
              <p>Remainder (r) = {r}</p>
              <p>
                Congruence: {n} ≡ {r} (mod {d})
              </p>
            </section>
            <section>
              <h3>Remainder rule</h3>
              <p>For any integers n and d (d &gt; 0):</p>
              <strong>0 ≤ r &lt; d</strong>
            </section>
          </aside>
          <article>
            <nav>
              <label>
                <input
                  type="checkbox"
                  checked={showJumps}
                  onChange={() => act(() => setShowJumps(!showJumps))}
                />
                Show jumps
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={showGroups}
                  onChange={() => act(() => setShowGroups(!showGroups))}
                />
                Show groups
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={showRemainder}
                  onChange={() => act(() => setShowRemainder(!showRemainder))}
                />
                Show remainder
              </label>
            </nav>
            <svg
              viewBox="0 0 550 260"
              role="img"
              aria-label={`Number line showing ${n} divided by ${d}`}
            >
              <line x1="25" y1="145" x2="530" y2="145" className="axis" />
              {Array.from({ length: max / 5 + 1 }, (_, i) => i * 5).map(
                (tick) => (
                  <g key={tick}>
                    <line x1={x(tick)} y1="137" x2={x(tick)} y2="153" />
                    <text x={x(tick)} y="170">
                      {tick}
                    </text>
                  </g>
                ),
              )}
              {showJumps &&
                points
                  .slice(0, -1)
                  .map((point, i) => (
                    <path
                      d={`M ${x(point)} 125 Q ${(x(point) + x(point + d)) / 2} ${65 - (i % 2) * 4} ${x(point + d)} 125`}
                      key={point}
                    />
                  ))}
              <circle cx={x(n)} cy="145" r="6" className="end" />
              <text x="275" y="65" className="title">
                Jump by {d}s (divisor)
              </text>
              {showGroups && (
                <>
                  <line
                    x1={x(0)}
                    y1="205"
                    x2={x(q * d)}
                    y2="205"
                    className="groups"
                  />
                  <text
                    x={(x(0) + x(q * d)) / 2}
                    y="230"
                    className="groups-text"
                  >
                    {q} groups of {d} (quotient = {q})
                  </text>
                </>
              )}
              {showRemainder && r > 0 && (
                <>
                  <line
                    x1={x(q * d)}
                    y1="205"
                    x2={x(n)}
                    y2="205"
                    className="rem"
                  />
                  <text x={(x(q * d) + x(n)) / 2} y="230" className="rem-text">
                    Remainder {r}
                  </text>
                </>
              )}
            </svg>
          </article>
        </div>
        <footer>
          <strong>
            {n} ÷ {d} = <b>{q}</b> R <em>{r}</em>
          </strong>
          <p>
            <b>Check:</b>
            <br />
            {d} × {q} + {r} = {n}
          </p>
          <p>
            <b>Groups of {d}</b>
            <br />
            {showGroups ? "● ".repeat(q) : "hidden"}
          </p>
          <p>
            <b>Leftover</b>
            <br />
            {showRemainder ? "● ".repeat(r) : "hidden"}
          </p>
        </footer>
        {hint && (
          <output>
            Make complete jumps of {d}; the distance left from {q * d} to {n} is
            the remainder.
          </output>
        )}
      </section>
      <section className="rr10015-concepts">
        <article>
          <h2>
            ◉ 1. OBSERVE <small>(What's happening?)</small>
          </h2>
          <ul>
            <li>We keep jumping by the divisor ({d}) on the number line.</li>
            <li>
              We can make {q} full jumps to reach {q * d}.
            </li>
            <li>{r} units are left over. That is the remainder.</li>
            <li>The remainder is always less than the divisor.</li>
          </ul>
        </article>
        <article>
          <h2>
            ⌘ 2. MANIPULATE <small>(Try different numbers)</small>
          </h2>
          <p>Try these or enter your own values.</p>
          <div>
            {examples.map(([a, b]) => (
              <button onClick={() => apply(a, b)} key={a}>
                {a} ÷ {b}
              </button>
            ))}
          </div>
          <label>
            Your turn:
            <span>
              n ={" "}
              <input
                aria-label="Custom dividend"
                value={draftN}
                onChange={(event) => setDraftN(event.target.value)}
              />
            </span>
            <span>
              d ={" "}
              <input
                aria-label="Custom divisor"
                value={draftD}
                onChange={(event) => setDraftD(event.target.value)}
              />
            </span>
            <button onClick={() => apply(Number(draftN), Number(draftD))}>
              Apply
            </button>
          </label>
        </article>
        <article>
          <h2>💡 3. NOTICE THE PATTERN</h2>
          <p>What do you notice about the remainder (r)?</p>
          <aside>
            In every case, 0 ≤ r &lt; d.
            <br />
            <small>
              The remainder can never be equal to or greater than the divisor.
            </small>
          </aside>
        </article>
        <article>
          <h2>▣ 4. UNDERSTAND THE RULE</h2>
          <p>When a number n is divided by a positive integer d,</p>
          <strong>n = d q + r where 0 ≤ r &lt; d</strong>
          <p>Here, q is the quotient and r is the remainder.</p>
        </article>
      </section>
      <section className="rr10015-practice">
        <h2>✎ 5. TRY INDEPENDENTLY</h2>
        <p>Find quotient and remainder. (Check your answer using the rule.)</p>
        <div>
          {exercises.map(([a, b], i) => (
            <label key={a}>
              {a} ÷ {b}
              <input
                aria-label={`Quotient ${i + 1}`}
                placeholder="q"
                value={answers[i][0]}
                onChange={(event) =>
                  setAnswers((current) =>
                    current.map((pair, j) =>
                      j === i ? [event.target.value, pair[1]] : pair,
                    ),
                  )
                }
              />
              <input
                aria-label={`Remainder ${i + 1}`}
                placeholder="r"
                value={answers[i][1]}
                onChange={(event) =>
                  setAnswers((current) =>
                    current.map((pair, j) =>
                      j === i ? [pair[0], event.target.value] : pair,
                    ),
                  )
                }
              />
              {graded && <b>{graded[i] ? "✓" : "✕"}</b>}
            </label>
          ))}
        </div>
        <button onClick={checkAnswers}>Check answers</button>
      </section>
      <section className="rr10015-lower">
        <article>
          <h2>WORKED EXAMPLE</h2>
          <p>Find quotient and remainder: 29 ÷ 5</p>
          <b>Solution:</b>
          <ul>
            <li>5 fits into 29 five times. 5 × 5 = 25</li>
            <li>Remainder = 29 − 25 = 4</li>
            <li>So, 29 ÷ 5 = 5 R 4</li>
            <li>Check: 5 × 5 + 4 = 29 ✓</li>
          </ul>
        </article>
        <article>
          <h2>⚠ COMMON MISTAKE</h2>
          <p>
            <b>Mistake:</b> Thinking the remainder can be equal to or greater
            than the divisor.
          </p>
          <p>
            <b>Example:</b> 17 ÷ 5 = 3 R 5 ✕
          </p>
          <p>Correct: 17 ÷ 5 = 3 R 2</p>
          <strong>Always remember: 0 ≤ r &lt; d</strong>
        </article>
        <article>
          <h2>🏆 LESSON CHALLENGE</h2>
          <p>
            A number leaves remainder 2 when divided by 5, remainder 3 when
            divided by 6, and remainder 1 when divided by 7.
          </p>
          <p>Find the smallest such number.</p>
          <button onClick={() => act(() => setHint(true))}>Show hint</button>
          <output>{hint ? "Answer: 57" : ""}</output>
        </article>
      </section>
      <nav className="rr10015-adjacent">
        <Link to={prev.route}>
          ← Previous lesson<b>{prev.title}</b>
        </Link>
        <Link to={next.route}>
          Next lesson →<b>{next.title}</b>
        </Link>
      </nav>
    </section>
  );
}
