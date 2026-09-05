import { CheckCircle2, RotateCcw, XCircle } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import type { SchoolSyllabusLesson } from "../syllabus/lessonSyllabusTypes";
import "./FormationDifferentialEquationsTargetLesson10186.css";

const fmt = (value: number) => Number(value.toFixed(2));
const clean = (value: string) =>
  value
    .toLowerCase()
    .replace(/[\s{}()]/g, "")
    .replaceAll("′", "'");

export default function FormationDifferentialEquationsTargetLesson10186({
  lesson: _lesson,
}: {
  lesson: SchoolSyllabusLesson;
}) {
  const [c1, setC1] = useState(1.25);
  const [c2, setC2] = useState(-0.75);
  const [range, setRange] = useState<"two" | "four">("two");
  const [samples, setSamples] = useState(800);
  const [grid, setGrid] = useState(true);
  const [first, setFirst] = useState("");
  const [second, setSecond] = useState("");
  const [equation, setEquation] = useState("");
  const [feedback, setFeedback] = useState("");
  const [solution, setSolution] = useState(false);

  const domain = range === "two" ? 2 * Math.PI : 4 * Math.PI;
  const points = useCallback(
    (a: number, b: number) =>
      Array.from({ length: Math.min(samples, 240) }, (_, index) => {
        const x = -domain + (index / (Math.min(samples, 240) - 1)) * domain * 2;
        const y = a * Math.cos(x) + b * Math.sin(x);
        return `${40 + (index / (Math.min(samples, 240) - 1)) * 310},${142 - y * 48}`;
      }).join(" "),
    [domain, samples],
  );
  const current = useMemo(() => points(c1, c2), [c1, c2, points]);
  const families = useMemo(
    () => [points(1.25, -0.75), points(1, 0), points(0, 1), points(-1, -1)],
    [points],
  );
  const reset = () => {
    setC1(1.25);
    setC2(-0.75);
    setRange("two");
    setSamples(800);
    setGrid(true);
  };
  const check = () => {
    const a = clean(first);
    const b = clean(second);
    const c = clean(equation);
    const firstOk =
      a.includes("c1") &&
      a.includes("sinx") &&
      a.includes("c2") &&
      a.includes("cosx");
    const secondOk =
      b.includes("c1") &&
      b.includes("cosx") &&
      b.includes("c2") &&
      b.includes("sinx");
    const equationOk = c === "y''-y=0";
    setFeedback(
      firstOk && secondOk && equationOk
        ? "Correct: differentiating twice gives y'' = y, so y'' - y = 0."
        : "Differentiate eˣ and e⁻ˣ carefully, then eliminate C1 and C2 using y'' = y.",
    );
  };

  return (
    <main
      className="fde10186-page"
      data-testid="school-mockup-0860"
      data-object-model="dedicated-family-to-differential-equation-engine"
      data-c1={fmt(c1)}
      data-c2={fmt(c2)}
      data-range={range}
      data-samples={samples}
      data-grid={grid}
    >
      <header className="fde-hero">
        <small>CLASS 12 · DIFFERENTIAL EQUATIONS</small>
        <h1>Formation of Differential Equations</h1>
        <p>
          Explore a family of solutions with two arbitrary constants y = C₁ cos
          x + C₂ sin x. Differentiate, eliminate the constants, and obtain the
          equation y″ + y = 0.
        </p>
        <div className="fde-tags">
          <span>18 min</span>
          <span>ADVANCED</span>
          <span>CONCEPT</span>
          <span>calculus</span>
        </div>
      </header>

      <section className="fde-lab">
        <div className="fde-title-row">
          <div>
            <small>▦ &nbsp; INTERACTIVE LAB</small>
            <h2>Family-to-equation explorer</h2>
          </div>
          <button type="button" onClick={reset}>
            <RotateCcw /> Reset lab
          </button>
        </div>
        <p>
          Adjust the arbitrary constants C₁ and C₂ to see different curves from
          the family.
        </p>
        <p className="fde-formula">
          y = C₁ cos x + C₂ sin x. The eliminated differential equation stays
          the same: y″ + y = 0.
        </p>

        <div className="fde-workspace">
          <aside className="fde-controls">
            <h3>ADJUST ARBITRARY CONSTANTS</h3>
            <label>
              C₁ <strong>{fmt(c1)}</strong>
              <input
                aria-label="C1"
                type="range"
                min="-2"
                max="2"
                step="0.05"
                value={c1}
                onChange={(e) => setC1(Number(e.target.value))}
              />
            </label>
            <label>
              C₂ <strong>{fmt(c2)}</strong>
              <input
                aria-label="C2"
                type="range"
                min="-2"
                max="2"
                step="0.05"
                value={c2}
                onChange={(e) => setC2(Number(e.target.value))}
              />
            </label>
            <article>
              <h3>CURRENT FUNCTION</h3>
              <div className="fde-current">
                y = {fmt(c1)} cos x {c2 < 0 ? "−" : "+"} {Math.abs(fmt(c2))} sin
                x
              </div>
            </article>
            <article className="fde-invariant">
              <h3>INVARIANT DIFFERENTIAL EQUATION</h3>
              <div>y″ + y = 0</div>
              <p>
                <CheckCircle2 /> All curves in this family satisfy this
                equation.
              </p>
            </article>
            <article>
              <h3>ABOUT THIS FAMILY</h3>
              <ul>
                <li>Contains two arbitrary constants (C₁, C₂).</li>
                <li>Generates every solution of y″ + y = 0.</li>
                <li>Two constants imply second order.</li>
              </ul>
            </article>
          </aside>

          <div className="fde-graph-panel">
            <div className="fde-legend">
              <strong>FAMILY CURVES</strong>
              <span className="violet">
                Current: C₁={fmt(c1)}, C₂={fmt(c2)}
              </span>
              <span className="blue">C₁=1, C₂=0</span>
              <span className="green">C₁=0, C₂=1</span>
              <span className="orange">C₁=−1, C₂=−1</span>
            </div>
            <svg
              viewBox="0 0 390 285"
              role="img"
              aria-label="Family of trigonometric solution curves"
            >
              {grid &&
                Array.from({ length: 11 }, (_, i) => (
                  <line
                    key={`v${i}`}
                    x1={40 + i * 31}
                    y1="16"
                    x2={40 + i * 31}
                    y2="264"
                    className="grid"
                  />
                ))}
              {grid &&
                Array.from({ length: 9 }, (_, i) => (
                  <line
                    key={`h${i}`}
                    x1="40"
                    y1={18 + i * 31}
                    x2="350"
                    y2={18 + i * 31}
                    className="grid"
                  />
                ))}
              <line x1="40" y1="142" x2="360" y2="142" className="axis" />
              <line x1="195" y1="15" x2="195" y2="266" className="axis" />
              <polyline points={families[1]} className="curve blue" />
              <polyline points={families[2]} className="curve green" />
              <polyline points={families[3]} className="curve orange" />
              <polyline points={current} className="curve current" />
              <text x="363" y="147">
                x
              </text>
              <text x="190" y="12">
                y
              </text>
              <text x="38" y="157">
                −{range === "two" ? "2π" : "4π"}
              </text>
              <text x="335" y="157">
                {range === "two" ? "2π" : "4π"}
              </text>
            </svg>
            <div className="fde-graph-options">
              <label>
                X-RANGE
                <select
                  aria-label="X range"
                  value={range}
                  onChange={(e) => setRange(e.target.value as "two" | "four")}
                >
                  <option value="two">[−2π, 2π]</option>
                  <option value="four">[−4π, 4π]</option>
                </select>
              </label>
              <label>
                SAMPLES
                <select
                  aria-label="Samples"
                  value={samples}
                  onChange={(e) => setSamples(Number(e.target.value))}
                >
                  <option>400</option>
                  <option>800</option>
                  <option>1200</option>
                </select>
              </label>
              <button
                type="button"
                aria-pressed={!grid}
                onClick={() => setGrid((value) => !value)}
              >
                {grid ? "Hide grid" : "Show grid"}
              </button>
            </div>
          </div>

          <aside className="fde-pathway">
            <h3>THREE-STEP SYMBOLIC PATHWAY</h3>
            <b>① Original family</b>
            <div>y = C₁ cos x + C₂ sin x</div>
            <i>↓</i>
            <b>② Differentiate once</b>
            <div>y′ = −C₁ sin x + C₂ cos x</div>
            <i>↓</i>
            <b>③ Differentiate again</b>
            <div>
              y″ = −C₁ cos x − C₂ sin x<br />= −y
            </div>
            <article>
              <strong>Eliminate constants</strong>
              <em>y″ = −y &nbsp; ⇒ &nbsp; y″ + y = 0</em>
              <p>
                Differential equation satisfied by every member of the family.
              </p>
            </article>
          </aside>
        </div>
      </section>

      <div className="fde-two-col">
        <article>
          <h3>WHY TWO CONSTANTS REQUIRE A SECOND-ORDER EQUATION</h3>
          <p>
            A general solution containing n arbitrary constants corresponds to
            an nth-order linear differential equation. Our family has two
            constants, so the resulting equation is second order.
          </p>
          <div className="fde-flow">
            <span>
              Number of constants <b>2</b>
            </span>
            →
            <span>
              Order of DE <b>2</b>
            </span>
            →
            <span>
              Equation <b>y″ + y = 0</b>
            </span>
          </div>
        </article>
        <article className="fde-warn">
          <h3>⚠ &nbsp; COMMON MISCONCEPTION</h3>
          <p>
            <b>Do not treat arbitrary constants as variables.</b> They are fixed
            numbers; differentiation acts on x, not on C₁ or C₂.
          </p>
          <div>
            <span>
              <XCircle /> (C₁)′ = 1
            </span>
            <span>
              <XCircle /> C₁C₂ varies with x
            </span>
          </div>
        </article>
      </div>

      <div className="fde-two-col fde-example">
        <article>
          <h3>ANOTHER QUICK EXAMPLE (SECOND-ORDER NOT NEEDED)</h3>
          <p>Family y = Ce²ˣ (one arbitrary constant).</p>
          <div className="fde-flow">
            <span>y = Ce²ˣ</span>→<span>y′ = 2Ce²ˣ = 2y</span>→
            <span className="good">y′ − 2y = 0</span>
          </div>
          <p>One constant ⇒ first-order differential equation.</p>
        </article>
        <article>
          <h3>♟ &nbsp; KEY TAKEAWAY</h3>
          <p>
            <b>
              Count the number of arbitrary constants in a general solution.
            </b>{" "}
            That count tells you the order of the equation you should obtain.
          </p>
          <p className="check">
            <CheckCircle2 /> Two constants ⇒ second order. &nbsp;{" "}
            <CheckCircle2 /> One constant ⇒ first order.
          </p>
        </article>
      </div>

      <section className="fde-practice">
        <div>
          <h3>ELIMINATION PRACTICE</h3>
          <p>
            <b>Task:</b> Given the family, find a differential equation
            satisfied by all members.
          </p>
          <div className="fde-family">Family: y = C₁eˣ + C₂e⁻ˣ</div>
          <div className="fde-fields">
            <label>
              ① Differentiate once
              <input
                aria-label="First derivative"
                value={first}
                onChange={(e) => setFirst(e.target.value)}
                placeholder="y′ ="
              />
            </label>
            <label>
              ② Differentiate again
              <input
                aria-label="Second derivative"
                value={second}
                onChange={(e) => setSecond(e.target.value)}
                placeholder="y″ ="
              />
            </label>
            <label>
              ③ Eliminate constants
              <input
                aria-label="Differential equation"
                value={equation}
                onChange={(e) => setEquation(e.target.value)}
                placeholder="Differential equation"
              />
            </label>
          </div>
          <div className="fde-answer-row">
            <button
              type="button"
              onClick={() => setSolution((value) => !value)}
            >
              Hint
            </button>
            <button type="button" onClick={check}>
              Check answer
            </button>
          </div>
          {feedback && (
            <p
              className={
                feedback.startsWith("Correct") ? "correct" : "incorrect"
              }
            >
              {feedback}
            </p>
          )}
        </div>
        <aside data-solution-visible={solution}>
          <h3>SOLUTION {solution ? "" : "(HIDDEN)"}</h3>
          {solution ? (
            <>
              <p>① y′ = C₁eˣ − C₂e⁻ˣ</p>
              <p>② y″ = C₁eˣ + C₂e⁻ˣ</p>
              <p>③ y″ − y = 0</p>
              <p>Hence, y″ − y = 0.</p>
            </>
          ) : (
            <p>
              Use that eˣ and e⁻ˣ are linearly independent, then reveal the
              worked elimination.
            </p>
          )}
        </aside>
      </section>

      <section className="fde-lower">
        <article>
          <h3>▣ &nbsp; LEARN</h3>
          <ol>
            <li>Start from a general solution with arbitrary constants.</li>
            <li>Differentiate enough times to create a system.</li>
            <li>Eliminate constants to obtain the equation.</li>
          </ol>
        </article>
        <article>
          <h3>⌘ &nbsp; EXPLORE FURTHER</h3>
          <ul>
            <li>Try different values of C₁ and C₂.</li>
            <li>Verify every curve satisfies y″ + y = 0.</li>
            <li>Experiment with other families.</li>
          </ul>
        </article>
        <article>
          <h3>▧ &nbsp; REAL-WORLD LINKS</h3>
          <ul>
            <li>Simple harmonic motion models undamped oscillations.</li>
            <li>Circuits, waves, and vibrations lead to the same equation.</li>
          </ul>
        </article>
      </section>
      <Link
        className="fde-next"
        to="/lessons/school/class-12/class-12-differential-equations-order-and-degree"
      >
        Order and Degree →
      </Link>
      <div className="fde-complete">
        Formation complete · two constants eliminated · second-order equation
        obtained
      </div>
    </main>
  );
}
