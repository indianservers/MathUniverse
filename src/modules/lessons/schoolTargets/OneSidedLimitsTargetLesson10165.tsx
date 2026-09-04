import { Check, Maximize2, RotateCcw, ZoomIn, ZoomOut } from "lucide-react";
import { useMemo, useState } from "react";
import type { KeyboardEvent, PointerEvent as ReactPointerEvent } from "react";
import type { SchoolSyllabusLesson } from "../syllabus/lessonSyllabusTypes";
import "./OneSidedLimitsTargetLesson10165.css";

type Scenario = "continuous" | "jump";
const f = (x: number) => x + 1;
const g = (x: number, scenario: Scenario) =>
  scenario === "continuous" ? 3 - x : 4 - x;
const fmt = (x: number) => x.toFixed(3);

export default function OneSidedLimitsTargetLesson10165({
  lesson: _lesson,
}: {
  lesson: SchoolSyllabusLesson;
}) {
  const [scenario, setScenario] = useState<Scenario>("continuous");
  const [epsilon, setEpsilon] = useState(0.1);
  const [locked, setLocked] = useState(true);
  const [left, setLeft] = useState(0.9);
  const [right, setRight] = useState(1.1);
  const [zoom, setZoom] = useState(1);
  const [answers, setAnswers] = useState(["", "", ""]);
  const [checked, setChecked] = useState(false);
  const rightLimit = g(1, scenario),
    exists = rightLimit === 2;
  const rows = useMemo(() => [0.9, 0.99, 0.999, 1, 1.001, 1.01, 1.1], []);
  const setProbe = (side: "left" | "right", value: number) => {
    const v =
      side === "left"
        ? Math.min(0.999, Math.max(-1, value))
        : Math.max(1.001, Math.min(3, value));
    if (side === "left") {
      setLeft(v);
      if (locked) setRight(2 - v);
    } else {
      setRight(v);
      if (locked) setLeft(2 - v);
    }
  };
  const keyProbe =
    (side: "left" | "right") => (e: KeyboardEvent<SVGCircleElement>) => {
      if (e.key === "ArrowLeft" || e.key === "ArrowDown")
        setProbe(side, (side === "left" ? left : right) - 0.02);
      if (e.key === "ArrowRight" || e.key === "ArrowUp")
        setProbe(side, (side === "left" ? left : right) + 0.02);
    };
  const dragProbe =
    (side: "left" | "right") => (e: ReactPointerEvent<SVGCircleElement>) => {
      e.currentTarget.setPointerCapture(e.pointerId);
      const svg = e.currentTarget.ownerSVGElement!;
      const move = (event: PointerEvent) =>
        setProbe(
          side,
          ((event.clientX - svg.getBoundingClientRect().left) /
            svg.getBoundingClientRect().width) *
            6 -
            2,
        );
      const stop = () => {
        window.removeEventListener("pointermove", move);
        window.removeEventListener("pointerup", stop);
      };
      window.addEventListener("pointermove", move);
      window.addEventListener("pointerup", stop);
    };
  const reset = () => {
    setScenario("continuous");
    setEpsilon(0.1);
    setLocked(true);
    setLeft(0.9);
    setRight(1.1);
    setZoom(1);
    setAnswers(["", "", ""]);
    setChecked(false);
  };
  const correct = answers.map((a, i) =>
    i === 2 && !exists
      ? a.trim().toUpperCase() === "DNE"
      : Number(a) === (i === 1 ? rightLimit : 2),
  );
  return (
    <main
      className="os10165-page"
      data-testid="school-mockup-0839"
      data-object-model="dedicated-one-sided-limit-microscope"
      data-left-limit="2.000"
      data-right-limit={fmt(rightLimit)}
      data-two-sided={exists ? "2.000" : "DNE"}
    >
      <header>
        <small>CLASS 12 · FORMAL CALCULUS</small>
        <h1>Left-Hand and Right-Hand Limits</h1>
        <p>
          Investigate one-sided limits with a two-sided microscope. Drag the
          probes, shrink ε, and see how the function behaves from the left and
          right of a point.
        </p>
        <div>
          <span>16 min</span>
          <span>ADVANCED</span>
          <span>CONCEPT</span>
          <span>graph</span>
          <span>limits</span>
        </div>
      </header>
      <section className="os-lab">
        <div className="os-scenario">
          <strong>SCENARIO</strong>
          <button
            className={scenario === "continuous" ? "active" : ""}
            onClick={() => setScenario("continuous")}
          >
            <i />
            Continuous at x = 1 <small>Left and right limits are equal.</small>
          </button>
          <button
            className={scenario === "jump" ? "active" : ""}
            onClick={() => setScenario("jump")}
          >
            <i />
            Jump at x = 1 <small>Left and right limits are different.</small>
          </button>
          <button onClick={reset}>
            <RotateCcw /> Reset all
          </button>
        </div>
        <div className="os-grid">
          <article className="os-micro">
            <h2>
              Two-Sided Microscope at <b>x = 1</b>
            </h2>
            <h3>Function (piecewise)</h3>
            <div className="os-pieces">
              <span>
                <b>f(x) = x + 1</b> for x &lt; 1<small>Open at x = 1 ○</small>
              </span>
              <span>
                <b>f(x) = {scenario === "continuous" ? "3 − x" : "4 − x"}</b>{" "}
                for x ≥ 1<small>Closed at x = 1 ●</small>
              </span>
            </div>
            <div className="os-tools">
              <button onClick={() => setZoom((z) => Math.min(1.4, z + 0.1))}>
                <ZoomIn />
              </button>
              <button onClick={() => setZoom((z) => Math.max(0.8, z - 0.1))}>
                <ZoomOut />
              </button>
              <button onClick={() => setZoom(1)}>
                <Maximize2 />
              </button>
            </div>
            <svg
              className="os-graph"
              viewBox="0 0 540 330"
              aria-label="One-sided limit graph"
              style={{ transform: `scale(${zoom})` }}
            >
              <defs>
                <pattern
                  id="osgrid"
                  width="38"
                  height="38"
                  patternUnits="userSpaceOnUse"
                >
                  <path d="M38 0H0V38" fill="none" stroke="#dfe9ef" />
                </pattern>
              </defs>
              <rect width="540" height="330" fill="url(#osgrid)" />
              <path d="M190 8V320M5 250H535" stroke="#526479" />
              <path d="M0 252 L355 110" stroke="#09aadb" strokeWidth="3" />
              <path
                d={
                  scenario === "continuous"
                    ? "M355 110 L535 182"
                    : "M355 55 L535 127"
                }
                stroke="#7644ed"
                strokeWidth="3"
              />
              <path d="M355 20V305" stroke="#8399b6" strokeDasharray="7" />
              <path
                d={`M${190 + (left + 2) * 59} 40V290`}
                stroke="#09aadb"
                strokeDasharray="5"
              />
              <path
                d={`M${190 + (right - 1) * 59 + 165} 40V290`}
                stroke="#8247f1"
                strokeDasharray="5"
              />
              <circle
                cx="355"
                cy="110"
                r="7"
                fill="white"
                stroke="#09aadb"
                strokeWidth="3"
              />
              <circle
                cx="355"
                cy={scenario === "continuous" ? 110 : 55}
                r="6"
                fill="#7644ed"
              />
              <circle
                tabIndex={0}
                role="slider"
                aria-label="Left probe"
                onPointerDown={dragProbe("left")}
                onKeyDown={keyProbe("left")}
                cx={190 + (left + 2) * 59}
                cy={250 - f(left) * 47}
                r="9"
                fill="#09aadb"
              />
              <circle
                tabIndex={0}
                role="slider"
                aria-label="Right probe"
                onPointerDown={dragProbe("right")}
                onKeyDown={keyProbe("right")}
                cx={355 + (right - 1) * 59}
                cy={250 - g(right, scenario) * 47}
                r="9"
                fill="#8247f1"
              />
              <text x="282" y="94" fill="#09aadb">
                y = x + 1
              </text>
              <text x="420" y="100" fill="#7644ed">
                y = {scenario === "continuous" ? "3 − x" : "4 − x"}
              </text>
              <text x="365" y="132">
                (1, {rightLimit})
              </text>
            </svg>
            <div className="os-probes">
              <label>
                Left probe <small>approach from left</small>
                <b>xₗ = {fmt(left)}</b>
                <output>f(xₗ) = {fmt(f(left))}</output>
              </label>
              <label>
                ε-window around x = 1
                <input
                  aria-label="Epsilon window"
                  type="range"
                  min="0.001"
                  max="0.5"
                  step="0.001"
                  value={epsilon}
                  onInput={(e) => {
                    const v = Number(e.currentTarget.value);
                    setEpsilon(v);
                    setLeft(1 - v);
                    setRight(1 + v);
                  }}
                />
                <b>ε = {epsilon.toFixed(3)}</b>
                <small>
                  Window: ({fmt(1 - epsilon)}, {fmt(1 + epsilon)})
                </small>
              </label>
              <label>
                Right probe <small>approach from right</small>
                <b>xᵣ = {fmt(right)}</b>
                <output>f(xᵣ) = {fmt(g(right, scenario))}</output>
              </label>
            </div>
            <div className="os-lock">
              <p>
                Drag the probes or the ε slider.
                <br />
                As ε → 0, both probes approach x = 1.
              </p>
              <label>
                <input
                  type="checkbox"
                  checked={locked}
                  onChange={(e) => setLocked(e.target.checked)}
                />{" "}
                Lock probes symmetrically
              </label>
            </div>
          </article>
          <aside>
            <section>
              <h2>Limit Summary at x = 1</h2>
              <dl>
                <dt>Left-hand limit</dt>
                <dd>2.000</dd>
                <dt>Right-hand limit</dt>
                <dd>{fmt(rightLimit)}</dd>
                <dt>Two-sided limit</dt>
                <dd>{exists ? "2.000" : "Does not exist"}</dd>
                <dt>Function value f(1)</dt>
                <dd>{fmt(rightLimit)}</dd>
                <dt>Continuity at x = 1</dt>
                <dd className={exists ? "good" : "bad"}>
                  {exists ? "✓ Continuous" : "✕ Discontinuous"}
                </dd>
              </dl>
            </section>
            <section>
              <h2>Value Table (synchronized)</h2>
              <table>
                <thead>
                  <tr>
                    <th>x</th>
                    <th>f(x)=x+1</th>
                    <th>right piece</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((x) => (
                    <tr key={x}>
                      <th>{x}</th>
                      <td>{x < 1 ? fmt(f(x)) : "—"}</td>
                      <td>{x >= 1 ? fmt(g(x, scenario)) : "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          </aside>
        </div>
      </section>
      <section className="os-notes">
        <article>
          <h3>Precise Definitions</h3>
          <b>Left-Hand Limit:</b>
          <p>lim x→1⁻ f(x) = L means values approach L from x &lt; 1.</p>
          <b>Right-Hand Limit:</b>
          <p>lim x→1⁺ f(x) = L means values approach L from x &gt; 1.</p>
          <b>Two-Sided Limit Exists:</b>
          <p>Only when both one-sided limits exist and are equal.</p>
        </article>
        <article className="warn">
          <h3>⚠ Common Misconception</h3>
          <b>f(a) need not control the limit.</b>
          <p>
            The value at a point does not affect the limit. Limits depend on
            nearby values.
          </p>
        </article>
        <article className="worked">
          <h3>Worked Example</h3>
          <p>lim x→1⁻ (x+1) = 2</p>
          <p>
            lim x→1⁺ ({scenario === "continuous" ? "3−x" : "4−x"}) ={" "}
            {rightLimit}
          </p>
          <b>
            {exists
              ? "Both sides are equal, so the limit is 2."
              : "The sides differ, so the two-sided limit does not exist."}
          </b>
        </article>
      </section>
      <section className="os-try">
        <h2>Try It Yourself</h2>
        <p>Use the microscope to investigate and classify the limit.</p>
        <div>
          {[
            "Left-hand limit",
            "Right-hand limit",
            "Two-sided limit (enter 2 or DNE)",
          ].map((q, i) => (
            <label key={q}>
              <b>{q}</b>
              <input
                aria-label={q}
                value={answers[i]}
                onChange={(e) => {
                  const a = [...answers];
                  a[i] = e.target.value;
                  setAnswers(a);
                  setChecked(false);
                }}
              />
              {checked && (
                <span className={correct[i] ? "good" : "bad"}>
                  {correct[i] ? "✓" : "✕"}
                </span>
              )}
            </label>
          ))}
        </div>
        <button onClick={() => setChecked(true)}>
          <Check /> Check my answers
        </button>
      </section>
      <section className="os-guide">
        <h3>Quick Classification Guide</h3>
        <div>
          <span>
            Left = Right = L<br />
            <b>Two-sided limit exists</b>
          </span>
          <span>
            Left ≠ Right
            <br />
            <b>Two-sided limit does not exist</b>
          </span>
          <span>
            One side does not exist
            <br />
            <b>Jump / broken behavior</b>
          </span>
        </div>
      </section>
      <nav className="os-adjacent" aria-label="Adjacent lessons">
        <button>← Previous: Continuity at a Point</button>
        <button>Next: Infinite Limits →</button>
      </nav>
      <footer>
        <b>⌁ Math Universe</b>
        <p>
          Interactive math labs, visual proofs, NCERT explorations, graphing,
          CAS-style tools, and classroom-ready activities.
        </p>
        <div>
          © 2026 INDIAN SERVERS PRIVATE LIMITED. NO RIGHT TO REPRODUCE IT.
        </div>
      </footer>
    </main>
  );
}
