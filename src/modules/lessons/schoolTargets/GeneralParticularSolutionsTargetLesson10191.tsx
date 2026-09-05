import { Maximize2, Minus, Plus, RotateCcw } from "lucide-react";
import { useMemo, useState } from "react";
import type { KeyboardEvent, PointerEvent as ReactPointerEvent } from "react";
import { Link } from "react-router-dom";
import type { SchoolSyllabusLesson } from "../syllabus/lessonSyllabusTypes";
import "./GeneralParticularSolutionsTargetLesson10191.css";

const constants = [-2, -1, 0, 1, 2];
const colors = ["#c4a7ff", "#8f66df", "#7b8088", "#72d3bd", "#14942a"];
const fmt = (n: number, d = 2) => Number(n.toFixed(d));
export default function GeneralParticularSolutionsTargetLesson10191({
  lesson: _lesson,
}: {
  lesson: SchoolSyllabusLesson;
}) {
  const [c, setC] = useState(2),
    [visible, setVisible] = useState(constants),
    [zoom, setZoom] = useState(1),
    [answer, setAnswer] = useState("e^x"),
    [feedback, setFeedback] = useState("");
  const change = (n: number) =>
    setC(Math.max(-2, Math.min(2, Math.round(n * 4) / 4)));
  const curves = useMemo(
    () =>
      constants.map((k, ci) => ({
        k,
        color: colors[ci],
        points: Array.from({ length: 141 }, (_, i) => {
          const x = -3.5 + i * 0.05,
            y = k * Math.exp(x);
          return `${52 + (x + 3.5) * 72 * zoom},${245 - y * 38 * zoom}`;
        }).join(" "),
      })),
    [zoom],
  );
  const drag = (e: ReactPointerEvent<SVGCircleElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    const svg = e.currentTarget.ownerSVGElement!;
    const move = (p: PointerEvent) => {
      const r = svg.getBoundingClientRect();
      change((245 - ((p.clientY - r.top) / r.height) * 340) / (38 * zoom));
    };
    const stop = () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", stop);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", stop);
  };
  const key = (e: KeyboardEvent<SVGCircleElement>) => {
    if (e.key === "ArrowUp") change(c + 0.25);
    if (e.key === "ArrowDown") change(c - 0.25);
  };
  const reset = () => {
    setC(2);
    setVisible(constants);
    setZoom(1);
    setAnswer("e^x");
    setFeedback("");
  };
  return (
    <main
      className="gps10191-page"
      data-testid="school-mockup-0865"
      data-object-model="dedicated-general-particular-solution-family-engine"
      data-c={fmt(c)}
      data-y0={fmt(c)}
      data-residual="0"
      data-zoom={fmt(zoom)}
      data-visible-count={visible.length}
    >
      <header className="gps-hero">
        <small>CLASS 12 · DIFFERENTIAL EQUATIONS</small>
        <h1>General and Particular Solutions</h1>
        <p>
          Compare the general solution (family) of y′=y with particular
          solutions determined by initial conditions. Move, explore, and verify
          in real time.
        </p>
        <div>
          <span>18 min</span>
          <span>ADVANCED</span>
          <span>CONCEPT</span>
          <span>calculus</span>
        </div>
      </header>
      <section className="gps-explorer">
        <h3>SOLUTION FAMILY EXPLORER: &nbsp; y′ = y</h3>
        <div className="gps-workspace">
          <aside>
            <h3>General solution (family)</h3>
            <p className="formula">y=Ceˣ, C∈ℝ</p>
            <p>
              Move the C slider or drag the point on the y-axis (x=0) to choose
              a particular solution.
            </p>
            <label>
              <b>C (arbitrary constant)</b>
              <input
                aria-label="C constant"
                type="range"
                min="-2"
                max="2"
                step=".25"
                value={c}
                onChange={(e) => change(Number(e.target.value))}
              />
            </label>
            <p className="selected">Selected C = {fmt(c)}</p>
            <hr />
            <h3>Initial condition at x=0</h3>
            <p>Drag the point on the y-axis.</p>
            <div className="formula initial">y(0) = {fmt(c)}</div>
            <h3>Family members (y=Ceˣ)</h3>
            {constants.map((k, i) => (
              <label className="member" key={k}>
                <input
                  type="checkbox"
                  checked={visible.includes(k)}
                  onChange={(e) =>
                    setVisible((old) =>
                      e.target.checked
                        ? [...old, k].sort()
                        : old.filter((n) => n !== k),
                    )
                  }
                />
                <span style={{ color: colors[i] }}>C={k}</span>
                <b>y={k === 0 ? "0" : `${k}eˣ`}</b>
              </label>
            ))}
            <button onClick={reset}>
              <RotateCcw />
              Reset view
            </button>
          </aside>
          <div className="gps-graph">
            <div className="gps-legend">
              {constants.map((k, i) => (
                <span key={k} style={{ color: colors[i] }}>
                  y={k === 0 ? "0" : `${k}eˣ`}
                  {k === c ? " (selected)" : ""}
                </span>
              ))}
            </div>
            <svg viewBox="0 0 560 470" aria-label="Exponential solution family">
              {Array.from({ length: 12 }, (_, i) => (
                <g key={i}>
                  <line
                    x1={45 + i * 43}
                    y1="40"
                    x2={45 + i * 43}
                    y2="430"
                    className="grid"
                  />
                  <line
                    x1="45"
                    y1={40 + i * 35}
                    x2="530"
                    y2={40 + i * 35}
                    className="grid"
                  />
                </g>
              ))}
              <line x1="45" y1="245" x2="535" y2="245" className="axis" />
              <line x1="304" y1="25" x2="304" y2="440" className="axis" />
              {curves
                .filter((f) => visible.includes(f.k) && f.k !== c)
                .map((f) => (
                  <polyline
                    key={f.k}
                    points={f.points}
                    style={{ stroke: f.color }}
                    className="curve"
                  />
                ))}
              <polyline
                points={Array.from({ length: 141 }, (_, i) => {
                  const x = -3.5 + i * 0.05,
                    y = c * Math.exp(x);
                  return `${52 + (x + 3.5) * 72 * zoom},${245 - y * 38 * zoom}`;
                }).join(" ")}
                className="curve selected-curve"
              />
              <circle
                cx="304"
                cy={245 - c * 38 * zoom}
                r="7"
                tabIndex={0}
                onPointerDown={drag}
                onKeyDown={key}
              />
              <text x="316" y={238 - c * 38 * zoom}>
                (0, {fmt(c)})
              </text>
            </svg>
            <div className="zoom">
              <button
                aria-label="Zoom out"
                onClick={() => setZoom((z) => Math.max(0.7, fmt(z - 0.1, 1)))}
              >
                <Minus />
              </button>
              <button
                aria-label="Zoom in"
                onClick={() => setZoom((z) => Math.min(1.3, fmt(z + 0.1, 1)))}
              >
                <Plus />
              </button>
              <button aria-label="Fit graph" onClick={() => setZoom(1)}>
                <Maximize2 />
              </button>
            </div>
          </div>
        </div>
        <div className="gps-verify">
          <div>
            <h3>
              LIVE VERIFICATION{" "}
              <small>(for the selected solution y={fmt(c)}eˣ)</small>
            </h3>
            <p className="formula">
              y={fmt(c)}eˣ ⇒ y′={fmt(c)}eˣ ⇒ y′−y=0
            </p>
          </div>
          <strong>✓ Verified: y′−y=0 identically for all x.</strong>
        </div>
      </section>
      <section className="gps-compare">
        <h3>GENERAL SOLUTION vs PARTICULAR SOLUTION</h3>
        <div>
          <article>
            <h3>GENERAL SOLUTION (family)</h3>
            <p className="formula">
              y=Ceˣ
              <br />
              C∈ℝ (arbitrary constant)
            </p>
            <ul>
              <li>Contains an arbitrary constant C.</li>
              <li>Represents infinitely many solutions.</li>
              <li>Satisfies y′−y=0 for every C.</li>
              <li>No specific initial data used.</li>
            </ul>
            <strong>Infinite possibilities</strong>
          </article>
          <article>
            <h3>PARTICULAR SOLUTION (determined)</h3>
            <p className="formula">
              y={fmt(c)}eˣ
              <br />
              (from y(0)={fmt(c)})
            </p>
            <ul>
              <li>Constant fixed by an initial condition.</li>
              <li>Single, unique solution within the family.</li>
              <li>Satisfies y′−y=0.</li>
              <li>Matches y(0)={fmt(c)}.</li>
            </ul>
            <strong>Unique solution</strong>
          </article>
        </div>
        <aside>
          <h3>SINGULAR / EQUILIBRIUM SOLUTION</h3>
          <p>
            y=0 is an equilibrium solution since y′=0 when y=0. It belongs to
            the family with C=0.
          </p>
          <b>Trajectories do not cross the equilibrium solution.</b>
        </aside>
      </section>
      <section className="gps-example">
        <div>
          <h3>WORKED EXAMPLE</h3>
          <p>Solve y′=2x with y(1)=3.</p>
          <ol>
            <li>Integrate: y=∫2x dx=x²+C.</li>
            <li>Apply y(1)=3: 3=1²+C ⇒ C=2.</li>
            <li>Particular solution: y=x²+2.</li>
          </ol>
        </div>
        <aside>
          <h3>CHECK (verify)</h3>
          <p>y′=2x.</p>
          <p>At x=1: y(1)=1²+2=3 ✓</p>
          <p>Equation satisfied: y′=2x ✓</p>
        </aside>
      </section>
      <section className="gps-practice">
        <div>
          <h3>PRACTICE: INITIAL-CONDITION TASK</h3>
          <p>Solve y′=y with the given initial condition.</p>
          <p>Set y(0)=1.</p>
          <b>What is the particular solution?</b>
        </div>
        <div>
          <h3>Select your answer</h3>
          {[
            ["e^x", "y=eˣ"],
            ["2e^x", "y=2eˣ"],
            ["e^x+1", "y=eˣ+1"],
            ["xe^x", "y=xeˣ"],
          ].map(([v, label]) => (
            <label key={v}>
              <input
                type="radio"
                name="gps10191"
                checked={answer === v}
                onChange={() => setAnswer(v)}
              />
              {label}
            </label>
          ))}
        </div>
        <aside>
          <h3>Check your work</h3>
          <p>General solution: y=Ceˣ.</p>
          <p>Apply y(0)=1: 1=Ce⁰ ⇒ C=1.</p>
          <p>Therefore, y=eˣ.</p>
          <button
            onClick={() =>
              setFeedback(
                answer === "e^x"
                  ? "Correct: y=eˣ is the unique solution."
                  : "Use y(0)=C to determine the constant.",
              )
            }
          >
            Check answer
          </button>
          {feedback && (
            <p
              className={
                feedback.startsWith("Correct") ? "correct" : "incorrect"
              }
            >
              {feedback}
            </p>
          )}
        </aside>
      </section>
      <nav className="gps-nav">
        <Link to="/lessons/school/class-12/class-12-differential-equations-linear-first-order-equations">
          ← Previous: Linear First-Order Equations
        </Link>
        <Link to="/lessons/school/class-12/class-12-differential-equations-direction-fields">
          Next: Direction Fields →
        </Link>
      </nav>
      <div className="gps-complete">
        Family explored · initial value applied · residual verified
      </div>
    </main>
  );
}
