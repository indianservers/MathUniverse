import { RotateCcw, Trash2, X } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { adjacentSchoolLessons } from "../catalog/school/schoolSyllabusCatalog";
import type { SchoolSyllabusLesson } from "../syllabus/lessonSyllabusTypes";
import "./EstimationRoundingTargetLesson10003.css";

const roundTo = (n: number, step: number) => Math.round(n / step) * step;
const palette = ["purple", "blue", "green", "orange", "pink"];
export default function EstimationRoundingTargetLesson10003({
  lesson,
}: {
  lesson: SchoolSyllabusLesson;
}) {
  const [number, setNumber] = useState(53),
    [step, setStep] = useState(10),
    [items, setItems] = useState([53, 27, 48]),
    [tab, setTab] = useState("Interact"),
    [estimateAnswer, setEstimateAnswer] = useState(""),
    [errorAnswer, setErrorAnswer] = useState(""),
    [graded, setGraded] = useState<boolean | null>(null),
    [actions, setActions] = useState(0);
  const lineRef = useRef<SVGSVGElement>(null),
    adjacent = adjacentSchoolLessons(lesson),
    rounded = roundTo(number, step),
    error = Math.abs(number - rounded),
    lower = Math.floor(number / step) * step,
    upper = lower + step,
    mid = lower + step / 2,
    rows = useMemo(
      () =>
        items.map((value, i) => ({
          value,
          rounded: roundTo(value, step),
          error: Math.abs(value - roundTo(value, step)),
          color: palette[i % palette.length],
        })),
      [items, step],
    ),
    actualTotal = items.reduce((a, b) => a + b, 0),
    estimateTotal = rows.reduce((a, b) => a + b.rounded, 0),
    totalError = Math.abs(actualTotal - estimateTotal);
  const act = (fn: () => void) => {
      fn();
      setActions((v) => v + 1);
    },
    reset = () =>
      act(() => {
        setNumber(53);
        setStep(10);
        setItems([53, 27, 48]);
        setTab("Interact");
        setEstimateAnswer("");
        setErrorAnswer("");
        setGraded(null);
      }),
    setFromPointer = (clientX: number) => {
      const r = lineRef.current?.getBoundingClientRect();
      if (!r) return;
      const ratio = Math.max(0, Math.min(1, (clientX - r.left) / r.width)),
        span = step * 4;
      act(() => setNumber(Math.round(lower - step * 2 + ratio * span)));
    },
    drag = (e: React.PointerEvent<SVGCircleElement>) => {
      e.currentTarget.setPointerCapture(e.pointerId);
      const move = (x: PointerEvent) => setFromPointer(x.clientX),
        up = () => {
          window.removeEventListener("pointermove", move);
          window.removeEventListener("pointerup", up);
        };
      window.addEventListener("pointermove", move);
      window.addEventListener("pointerup", up);
    };
  const add = () => act(() => setItems((v) => [...v, Math.max(0, number)])),
    check = () =>
      act(() =>
        setGraded(Number(estimateAnswer) === 80 && Number(errorAnswer) === 2),
      );
  return (
    <section
      className="er10003-page"
      data-testid="school-mockup-0677"
      data-object-model="dedicated-draggable-number-line-rounding-and-live-error-model"
      data-number={number}
      data-step={step}
      data-rounded={rounded}
      data-error={error}
      data-items={items.join(",")}
      data-estimate-total={estimateTotal}
      data-actual-total={actualTotal}
      data-total-error={totalError}
      data-graded={graded === null ? "" : graded}
      data-actions={actions}
    >
      <header className="er10003-hero">
        <div>
          <h1>Estimation and Rounding Lab</h1>
          <dl>
            <span>Class 6</span>
            <span>Numbers and Arithmetic</span>
            <span>18 min</span>
            <span>Foundation</span>
            <span>Concept</span>
            <span>Number</span>
          </dl>
          <p>
            <b>Objective:</b> Estimate and round numbers to a chosen place value
            using a number line.
          </p>
        </div>
        <aside>
          <strong>Mission: Estimate Smart</strong>
          <p>
            Place the number, round it, and estimate totals with the least
            error!
          </p>
        </aside>
      </header>
      <nav className="er10003-tabs">
        {["Interact", "Learn", "Worked Example", "Formula", "Practice"].map(
          (n) => (
            <button
              className={tab === n ? "active" : ""}
              onClick={() => act(() => setTab(n))}
              key={n}
            >
              {n}
            </button>
          ),
        )}
      </nav>
      {tab !== "Interact" && (
        <p className="er10003-tabnote">
          <b>{tab}:</b> Compare the number with the midpoint between two
          landmarks.
        </p>
      )}
      <section className="er10003-lab">
        <ol>
          {[
            ["Observe", "See the number line and the landmarks."],
            ["Manipulate", "Drag the number to any position."],
            ["Notice the pattern", "Watch the midpoint decision change."],
            ["Understand the rule", "Round to the nearer landmark."],
            ["Try independently", "Challenge yourself and check error."],
          ].map(([a, b], i) => (
            <li key={a}>
              <i>{i + 1}</i>
              <b>{a}</b>
              <small>{b}</small>
            </li>
          ))}
        </ol>
        <main>
          <aside>
            <section>
              <h2>1 Choose place value</h2>
              <label>
                Round to the nearest
                <select
                  aria-label="Rounding place"
                  value={step}
                  onChange={(e) => act(() => setStep(Number(e.target.value)))}
                >
                  <option value="10">Tens (10)</option>
                  <option value="100">Hundreds (100)</option>
                  <option value="1000">Thousands (1,000)</option>
                </select>
              </label>
              <p>Step size: {step}</p>
            </section>
            <section>
              <h2>Quick numbers</h2>
              <div>
                {[13, 27, 48, 53, 67, 89].map((n) => (
                  <button onClick={() => act(() => setNumber(n))} key={n}>
                    {n}
                  </button>
                ))}
              </div>
            </section>
          </aside>
          <article>
            <header>
              <div>
                <h2>2 Drag the number</h2>
                <p>Drag the purple point to place the number.</p>
              </div>
              <button onClick={reset}>
                <RotateCcw />
                Reset
              </button>
            </header>
            <svg
              ref={lineRef}
              viewBox="0 0 600 225"
              aria-label="Draggable rounding number line"
              onPointerDown={(e) => {
                if (e.target === e.currentTarget) setFromPointer(e.clientX);
              }}
            >
              <text x="300" y="25" textAnchor="middle">
                Number line (step = {step})
              </text>
              <line className="axis" x1="45" y1="105" x2="555" y2="105" />
              {Array.from({ length: 21 }, (_, i) => (
                <line
                  className="tick"
                  key={i}
                  x1={45 + i * 25.5}
                  y1={i % 5 === 0 ? 94 : 99}
                  x2={45 + i * 25.5}
                  y2={i % 5 === 0 ? 116 : 111}
                />
              ))}
              {[lower - step, lower, upper, upper + step].map((n, i) => (
                <g key={n}>
                  <circle
                    className="landmark"
                    cx={45 + i * 170}
                    cy="105"
                    r="6"
                  />
                  <text x={45 + i * 170} y="140" textAnchor="middle">
                    {n}
                  </text>
                </g>
              ))}
              <line className="mid" x1="300" y1="90" x2="300" y2="160" />
              <circle
                className="number"
                cx={215 + ((number - lower) / step) * 170}
                cy="62"
                r="9"
                onPointerDown={drag}
              />
              <line
                className="guide"
                x1={215 + ((number - lower) / step) * 170}
                y1="72"
                x2={215 + ((number - lower) / step) * 170}
                y2="105"
              />
              <text
                className="bubble"
                x={215 + ((number - lower) / step) * 170}
                y="48"
                textAnchor="middle"
              >
                {number}
              </text>
              <text x="300" y="188" textAnchor="middle">
                Midpoint: {mid} | {number} is {number < mid ? "left" : "right"}{" "}
                of {mid} → round {number < mid ? "down" : "up"}
              </text>
            </svg>
          </article>
        </main>
        <footer>
          {[
            ["Placed number", number, "purple"],
            [
              `Rounded to ${step === 10 ? "tens" : step === 100 ? "hundreds" : "thousands"}`,
              rounded,
              "purple",
            ],
            ["Estimate", rounded, "blue"],
            ["Error", `|${number} − ${rounded}| = ${error}`, "red"],
          ].map(([a, b, c]) => (
            <span className={String(c)} key={String(a)}>
              <small>{a}</small>
              <strong>{b}</strong>
            </span>
          ))}
        </footer>
      </section>
      <section className="er10003-totals">
        <header>
          <div>
            <h2>
              3 Estimate totals <small>(live error)</small>
            </h2>
            <p>Add more numbers and estimate the total.</p>
          </div>
          <button onClick={() => act(() => setItems([]))}>
            <Trash2 />
            Clear all
          </button>
        </header>
        <div className="chips">
          {items.map((n, i) => (
            <button
              className={palette[i % palette.length]}
              onClick={() =>
                act(() => setItems((v) => v.filter((_, j) => j !== i)))
              }
              key={`${n}-${i}`}
            >
              {n}
              <X />
            </button>
          ))}
          <button onClick={add}>+ Add number</button>
        </div>
        <table>
          <thead>
            <tr>
              <th>Number</th>
              <th>Rounded</th>
              <th>Estimate</th>
              <th>Actual</th>
              <th>Error</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={`${r.value}-${i}`}>
                <td>
                  <i className={r.color} />
                  {r.value}
                </td>
                <td>{r.rounded}</td>
                <td>{r.rounded}</td>
                <td>{r.value}</td>
                <td>
                  |{r.value} − {r.rounded}| = <b>{r.error}</b>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <th>Total</th>
              <td>–</td>
              <td>{estimateTotal}</td>
              <td>{actualTotal}</td>
              <td>
                |{actualTotal} − {estimateTotal}| = <b>{totalError}</b>
              </td>
            </tr>
          </tfoot>
        </table>
      </section>
      <section className="er10003-theory">
        <article>
          <h2>Worked Example</h2>
          <p>Round 67 to the nearest tens.</p>
          <div className="mini-line">
            60 ───── <b>67</b> ── 70 ───── 80
          </div>
          <p>67 is left of midpoint 70 → round down.</p>
          <strong>67 ≈ 70</strong>
        </article>
        <article>
          <h2>Key Rule</h2>
          <h3>Rounding Rule (Nearest Tens)</h3>
          <p>Compare the number with the midpoint.</p>
          <ul>
            <li>If it is left of the midpoint → round down.</li>
            <li>If it is right of the midpoint → round up.</li>
            <li>If it is exactly at the midpoint → round up.</li>
          </ul>
          <output>|n − landmark| helps decide closeness.</output>
        </article>
        <article>
          <h2>Common Mistake</h2>
          <h3>Mistake: Rounding digit by digit.</h3>
          <p>Don't round each digit separately.</p>
          <p>Rounding is based on distance on the number line, not digits.</p>
          <p>Example: 53 → 50 (not 60)</p>
        </article>
      </section>
      <section className="er10003-challenge">
        <article>
          <h2>Quick Challenge</h2>
          <p>Round the number and find the error.</p>
          <b>Round to the nearest tens: 82</b>
          <div>
            <label>
              Your estimate
              <input
                aria-label="Challenge estimate"
                value={estimateAnswer}
                onChange={(e) => setEstimateAnswer(e.target.value)}
              />
            </label>
            <label>
              Your error
              <input
                aria-label="Challenge error"
                value={errorAnswer}
                onChange={(e) => setErrorAnswer(e.target.value)}
              />
            </label>
            <button onClick={check}>Check Answer</button>
          </div>
          {graded !== null && (
            <output>
              {graded
                ? "Correct: 82 rounds to 80 with error 2."
                : "Use the nearest multiple of ten and absolute error."}
            </output>
          )}
        </article>
        <aside>
          <h2>Hint</h2>
          <p>Is 82 left or right of the midpoint 80?</p>
          <p>How close is it to 80 and 90?</p>
          <div>80 ───────────── 90</div>
        </aside>
      </section>
      <nav className="er10003-adjacent">
        {adjacent.previous ? (
          <Link to={adjacent.previous.route}>
            ← Previous Lesson<b>{adjacent.previous.title}</b>
          </Link>
        ) : (
          <span />
        )}
        <label>
          Lesson Progress
          <progress value="4" max="18" />4 of 18
        </label>
        {adjacent.next ? (
          <Link to={adjacent.next.route}>
            Next Lesson →<b>{adjacent.next.title}</b>
          </Link>
        ) : (
          <span />
        )}
      </nav>
    </section>
  );
}
