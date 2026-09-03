import { RotateCcw } from "lucide-react";
import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { adjacentSchoolLessons } from "../catalog/school/schoolSyllabusCatalog";
import type { SchoolSyllabusLesson } from "../syllabus/lessonSyllabusTypes";
import "./ErrorBoundsTargetLesson10004.css";

const decimals = (step: number) => Math.max(0, Math.round(-Math.log10(step))),
  show = (n: number, d = 4) =>
    n.toFixed(d).replace(/0+$/, "").replace(/\.$/, ""),
  round = (n: number, step: number) =>
    Math.round((n + Number.EPSILON) / step) * step;
export default function ErrorBoundsTargetLesson10004({
  lesson,
}: {
  lesson: SchoolSyllabusLesson;
}) {
  const [exact, setExact] = useState(4.3268),
    [step, setStep] = useState(0.1),
    [tab, setTab] = useState("Interact"),
    [showBounds, setShowBounds] = useState(true),
    [showRounded, setShowRounded] = useState(true),
    [showExact, setShowExact] = useState(true),
    [answer, setAnswer] = useState("12.9"),
    [graded, setGraded] = useState<boolean | null>(true),
    [actions, setActions] = useState(0);
  const lineRef = useRef<SVGSVGElement>(null),
    adjacent = adjacentSchoolLessons(lesson),
    d = decimals(step),
    rounded = round(exact, step),
    lower = rounded - step / 2,
    upper = rounded + step / 2,
    absolute = Math.abs(exact - rounded),
    relative = exact === 0 ? 0 : (absolute / Math.abs(exact)) * 100;
  const act = (fn: () => void) => {
      fn();
      setActions((v) => v + 1);
    },
    reset = () =>
      act(() => {
        setExact(4.3268);
        setStep(0.1);
        setTab("Interact");
        setShowBounds(true);
        setShowRounded(true);
        setShowExact(true);
        setAnswer("12.9");
        setGraded(true);
      }),
    drag = (e: React.PointerEvent<SVGCircleElement>) => {
      e.currentTarget.setPointerCapture(e.pointerId);
      const move = (p: PointerEvent) => {
          const r = lineRef.current?.getBoundingClientRect();
          if (!r) return;
          const min = lower - step * 1.5,
            max = upper + step * 1.5,
            value =
              min +
              Math.max(0, Math.min(1, (p.clientX - r.left) / r.width)) *
                (max - min);
          act(() => setExact(Number(value.toFixed(d + 3))));
        },
        up = () => {
          window.removeEventListener("pointermove", move);
          window.removeEventListener("pointerup", up);
        };
      window.addEventListener("pointermove", move);
      window.addEventListener("pointerup", up);
    };
  const x = (n: number) => 45 + ((n - (lower - step * 1.5)) / (step * 4)) * 510,
    check = () => act(() => setGraded(Math.abs(Number(answer) - 12.9) < 1e-8));
  return (
    <section
      className="eb10004-page"
      data-testid="school-mockup-0678"
      data-object-model="dedicated-draggable-half-open-rounding-error-bound-model"
      data-exact={show(exact)}
      data-step={step}
      data-rounded={rounded.toFixed(d)}
      data-lower={lower.toFixed(d + 1)}
      data-upper={upper.toFixed(d + 1)}
      data-absolute={absolute.toFixed(4)}
      data-relative={relative.toFixed(3)}
      data-graded={graded === null ? "" : graded}
      data-actions={actions}
    >
      <header className="eb10004-hero">
        <small>CLASS 6 · NUMBERS AND ARITHMETIC</small>
        <h1>
          Approximation and Error Bounds <b>16 min</b>
        </h1>
        <p>
          Learn to approximate numbers and determine the possible error using
          bounds and the number line.
        </p>
        <dl>
          <span>FOUNDATION</span>
          <span>CONCEPT</span>
          <span>INTERACTIVE LAB</span>
          <span>NUMBER</span>
        </dl>
      </header>
      <nav className="eb10004-tabs">
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
        <p className="eb10004-tabnote">
          <b>{tab}:</b> An approximation represents every exact value inside its
          error-bound interval.
        </p>
      )}
      <section className="eb10004-lab">
        <header>
          <div>
            <h2>OBSERVE → MANIPULATE</h2>
            <p>
              Change the rounded value or the place to see how the bounds,
              errors, and interval change.
            </p>
          </div>
          <button onClick={reset}>
            <RotateCcw />
            Reset
          </button>
        </header>
        <main>
          <aside>
            <label>
              <b>1 EXACT VALUE</b>
              <span>
                a ={" "}
                <input
                  aria-label="Exact value"
                  type="number"
                  step="0.0001"
                  value={exact}
                  onChange={(e) => act(() => setExact(Number(e.target.value)))}
                />
              </span>
            </label>
            <label>
              <b>2 ROUND TO PLACE</b>
              <select
                aria-label="Round to place"
                value={step}
                onChange={(e) => act(() => setStep(Number(e.target.value)))}
              >
                <option value="1">Nearest whole number</option>
                <option value="0.1">Nearest tenth (one decimal place)</option>
                <option value="0.01">Nearest hundredth</option>
                <option value="0.001">Nearest thousandth</option>
              </select>
            </label>
            <section>
              <b>3 ROUNDED VALUE</b>
              <strong>ā = {rounded.toFixed(d)}</strong>
            </section>
            <section>
              <b>4 BOUNDS (INTERVAL)</b>
              <label>
                Lower bound (L)<output>{lower.toFixed(d + 1)}</output>
              </label>
              <label>
                Upper bound (U)<output>{upper.toFixed(d + 1)}</output>
              </label>
              <strong>
                Interval: [ {lower.toFixed(d + 1)}, {upper.toFixed(d + 1)} )
              </strong>
            </section>
          </aside>
          <article>
            <h2>5 INTERVAL ON NUMBER LINE</h2>
            <div className="toggles">
              <label>
                <input
                  type="checkbox"
                  aria-label="Show bounds"
                  checked={showBounds}
                  onChange={(e) => act(() => setShowBounds(e.target.checked))}
                />
                Show bounds
              </label>
              <label>
                <input
                  type="checkbox"
                  aria-label="Show rounded value"
                  checked={showRounded}
                  onChange={(e) => act(() => setShowRounded(e.target.checked))}
                />
                Show rounded value
              </label>
              <label>
                <input
                  type="checkbox"
                  aria-label="Show exact value"
                  checked={showExact}
                  onChange={(e) => act(() => setShowExact(e.target.checked))}
                />
                Show exact value
              </label>
            </div>
            <svg
              ref={lineRef}
              viewBox="0 0 600 190"
              aria-label="Interactive error bounds number line"
            >
              <line className="axis" x1="35" y1="100" x2="565" y2="100" />
              {Array.from({ length: 17 }, (_, i) => (
                <line
                  className="tick"
                  x1={45 + i * 31.9}
                  y1="94"
                  x2={45 + i * 31.9}
                  y2="106"
                  key={i}
                />
              ))}
              {showBounds && (
                <>
                  <line
                    className="interval"
                    x1={x(lower)}
                    y1="72"
                    x2={x(upper)}
                    y2="72"
                  />
                  <circle className="bound" cx={x(lower)} cy="72" r="6" />
                  <circle className="bound" cx={x(upper)} cy="72" r="6" />
                  <text x={x(lower)} y="48" textAnchor="middle">
                    {lower.toFixed(d + 1)}
                  </text>
                  <text x={x(upper)} y="48" textAnchor="middle">
                    {upper.toFixed(d + 1)}
                  </text>
                </>
              )}
              {showRounded && (
                <>
                  <circle className="rounded" cx={x(rounded)} cy="100" r="6" />
                  <text x={x(rounded)} y="130" textAnchor="middle">
                    {rounded.toFixed(d)}
                  </text>
                </>
              )}
              {showExact && (
                <>
                  <circle
                    className="exact"
                    cx={x(exact)}
                    cy="72"
                    r="6"
                    onPointerDown={drag}
                  />
                  <text x={x(exact)} y="48" textAnchor="middle">
                    {show(exact)}
                  </text>
                </>
              )}
            </svg>
            <div className="legend">
              <span>Lower bound (L)</span>
              <span>Upper bound (U)</span>
              <span>Rounded value (ā)</span>
              <span>Exact value (a)</span>
            </div>
            <section className="errors">
              <h2>6 ERROR MEASURES</h2>
              <div>
                <span>
                  Absolute Error
                  <strong>
                    |a − ā|<output>{absolute.toFixed(4)}</output>
                  </strong>
                </span>
                <span>
                  Relative Error
                  <strong>
                    |a − ā| / |a| × 100%<output>{relative.toFixed(3)}%</output>
                  </strong>
                </span>
                <span>
                  Maximum Possible Error
                  <strong>
                    (U − L) / 2<output>{(step / 2).toFixed(d + 1)}</output>
                  </strong>
                </span>
              </div>
              <p>
                The exact value is always within the interval:{" "}
                <b>L ≤ a &lt; U</b>
              </p>
            </section>
          </article>
        </main>
      </section>
      <section className="eb10004-pattern">
        <article>
          <h2>NOTICE THE PATTERN</h2>
          <p>
            When we round to the nearest{" "}
            {step === 0.1 ? "tenth" : "selected place"}:
          </p>
          <ul>
            <li>The interval width is (U − L) = {step}.</li>
            <li>The maximum possible error is half the width: {step / 2}.</li>
            <li>The exact value always lies in [L, U).</li>
          </ul>
        </article>
        <article>
          <h2>UNDERSTAND THE RULE</h2>
          <p>If we round a number to the nearest place value d, then:</p>
          <ul>
            <li>Bounds: [ā − d/2, ā + d/2)</li>
            <li>Maximum error: d/2</li>
            <li>Inclusion test: L ≤ a &lt; U.</li>
          </ul>
        </article>
      </section>
      <section className="eb10004-lower">
        <article>
          <h2>WORKED EXAMPLE</h2>
          <p>Round 47.628 to the nearest hundredth.</p>
          <ol>
            <li>Exact value: a = 47.628</li>
            <li>Rounded value: ā = 47.63</li>
            <li>Place value: d = 0.01</li>
            <li>Bounds: [47.625, 47.635)</li>
            <li>Check: 47.625 ≤ 47.628 &lt; 47.635</li>
            <li>Absolute error = 0.002; maximum possible error = 0.005</li>
          </ol>
          <strong>
            Result: The exact value is within the interval. The approximation
            47.63 is valid.
          </strong>
        </article>
        <aside>
          <section>
            <h2>KEY RULE / DEFINITION</h2>
            <p>Error Bound Interval</p>
            <strong>[ā − d/2, ā + d/2)</strong>
            <p>The upper bound is not included.</p>
          </section>
          <section className="misconception">
            <h2>COMMON MISCONCEPTION</h2>
            <p>Thinking the interval is [L, U] with both ends included.</p>
            <b>Correct: the upper bound U is not included.</b>
          </section>
          <section className="mini">
            <h2>TRY A MINI CHALLENGE</h2>
            <p>Round 12.875 to the nearest tenth.</p>
            <input
              aria-label="Mini challenge rounded value"
              value={answer}
              onChange={(e) => {
                setAnswer(e.target.value);
                setGraded(null);
              }}
            />
            <button onClick={check}>Check</button>
            <p>Bounds: [12.85, 12.95)</p>
            <p>Absolute error: 0.025</p>
            {graded !== null && (
              <output>
                {graded
                  ? "Great! All values are correct."
                  : "Round 12.875 to one decimal place."}
              </output>
            )}
          </section>
        </aside>
      </section>
      <nav className="eb10004-adjacent">
        {adjacent.previous ? (
          <Link to={adjacent.previous.route}>
            ← Previous: {adjacent.previous.title}
          </Link>
        ) : (
          <span />
        )}
        {adjacent.next ? (
          <Link to={adjacent.next.route}>Next: {adjacent.next.title} →</Link>
        ) : (
          <span />
        )}
      </nav>
    </section>
  );
}
