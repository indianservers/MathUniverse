import { RotateCcw } from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import type { SchoolSyllabusLesson } from "../syllabus/lessonSyllabusTypes";
import "./LinearFirstOrderTargetLesson10190.css";

const stages = [
  [
    "Identify P(x) and Q(x)",
    "P(x)=2, Q(x)=eˣ",
    "Original ODE direction field",
    "Pending",
  ],
  [
    "Compute integrating factor (IF)",
    "μ(x)=e^(∫2dx)=e²ˣ",
    "Integrating factor μ(x)=e²ˣ",
    "Pending",
  ],
  [
    "Multiply every term by μ(x)",
    "e²ˣy′+2e²ˣy=e³ˣ",
    "All terms multiplied",
    "Will be 0 for solution",
  ],
  [
    "Recognize exact derivative",
    "d/dx(ye²ˣ)=e³ˣ",
    "Derivative check",
    "Identically true",
  ],
  [
    "Integrate both sides",
    "ye²ˣ=e³ˣ/3+C",
    "Compare both sides",
    "Derivative residual 0",
  ],
  [
    "Solve for y(x)",
    "y=eˣ/3+Ce⁻²ˣ",
    "General solution family",
    "ODE residual 0",
  ],
  [
    "Apply initial condition y(0)=1",
    "C=2/3; y=eˣ/3+(2/3)e⁻²ˣ",
    "Particular solution (C=2/3)",
    "Verified",
  ],
] as const;
const colors = ["#2563eb", "#8b5cf6", "#16a34a", "#f97316", "#e11d48"];
export default function LinearFirstOrderTargetLesson10190({
  lesson: _lesson,
}: {
  lesson: SchoolSyllabusLesson;
}) {
  const [active, setActive] = useState(7),
    [answer, setAnswer] = useState(""),
    [feedback, setFeedback] = useState(""),
    [solutions, setSolutions] = useState(false);
  const curves = useMemo(
    () =>
      [-1, 0, 1, 2, 3].map((c, ci) => ({
        c,
        color: colors[ci],
        points: Array.from({ length: 121 }, (_, i) => {
          const x = -2 + i / 30,
            y = Math.exp(x) / 3 + c * Math.exp(-2 * x);
          return `${25 + (x + 2) * 54},${70 - Math.max(-3, Math.min(7, y)) * 9}`;
        }).join(" "),
      })),
    [],
  );
  const reset = () => {
    setActive(7);
    setAnswer("");
    setFeedback("");
    setSolutions(false);
  };
  return (
    <main
      className="lfo10190-page"
      data-testid="school-mockup-0864"
      data-object-model="dedicated-integrating-factor-pipeline-engine"
      data-active-stage={active}
      data-p="2"
      data-q="exp(x)"
      data-mu="exp(2x)"
      data-c="0.6667"
      data-residual="0"
    >
      <header className="lfo-hero">
        <small>CLASS 12 · DIFFERENTIAL EQUATIONS</small>
        <h1>Linear First-Order Equations: Integrating Factor Pipeline</h1>
        <p>
          Solve y′+2y=eˣ using an integrating factor. Connect each symbolic step
          to its graph and residual check.
        </p>
        <div>
          <span>18 min</span>
          <span>ADVANCED</span>
          <span>CONCEPT</span>
          <span>calculus</span>
          <span>integrating factor</span>
        </div>
      </header>
      <section className="lfo-pipeline">
        <div className="lfo-title">
          <div>
            <h3>▦ &nbsp; INTEGRATING-FACTOR PIPELINE</h3>
            <p>Solve y′+2y=eˣ with initial condition y(0)=1.</p>
          </div>
          <div className="lfo-summary">
            <span>
              Standard form
              <br />
              <b>y′+P(x)y=Q(x)</b>
            </span>
            <span>
              P(x)
              <br />
              <b>2</b>
            </span>
            <span>
              Q(x)
              <br />
              <b>eˣ</b>
            </span>
            <span>
              Method
              <br />
              <b>Integrating Factor</b>
            </span>
            <button onClick={reset}>
              <RotateCcw />
              Reset lab
            </button>
          </div>
        </div>
        <div className="lfo-stage-list">
          {stages.map((s, i) => (
            <article key={s[0]} className={active === i + 1 ? "active" : ""}>
              <button
                aria-label={`Stage ${i + 1}`}
                onClick={() => setActive(i + 1)}
              >
                {i + 1}
              </button>
              <div>
                <h3>{s[0]}</h3>
                <p className="formula">{s[1]}</p>
              </div>
              <div className="lfo-mini">
                <b>{s[2]}</b>
                {i === 0 && (
                  <svg viewBox="0 0 220 85">
                    {Array.from({ length: 11 * 5 }, (_, n) => {
                      const col = n % 11,
                        row = Math.floor(n / 11),
                        x = -2 + col * 0.4,
                        y = -1 + row * 0.5,
                        m = Math.exp(x) - 2 * y,
                        a = Math.atan(m),
                        cx = 10 + col * 20,
                        cy = 70 - row * 15,
                        dx = Math.cos(a) * 6,
                        dy = -Math.sin(a) * 6;
                      return (
                        <line
                          key={n}
                          x1={cx - dx}
                          y1={cy - dy}
                          x2={cx + dx}
                          y2={cy + dy}
                        />
                      );
                    })}
                  </svg>
                )}
                {i === 1 && (
                  <svg viewBox="0 0 220 85">
                    <polyline
                      points={Array.from({ length: 101 }, (_, n) => {
                        const x = -2 + n * 0.04;
                        return `${10 + n * 2},${78 - Math.min(8, Math.exp(2 * x)) * 9}`;
                      }).join(" ")}
                    />
                  </svg>
                )}
                {i >= 2 && i < 5 && (
                  <svg viewBox="0 0 220 85">
                    <polyline
                      points={Array.from({ length: 101 }, (_, n) => {
                        const x = -2 + n * 0.04;
                        return `${10 + n * 2},${72 - Math.min(7, Math.exp(3 * x)) * 8}`;
                      }).join(" ")}
                    />
                  </svg>
                )}
                {i === 5 && (
                  <svg viewBox="0 0 220 85">
                    {curves.map((f) => (
                      <polyline
                        key={f.c}
                        points={f.points}
                        style={{ stroke: f.color }}
                      />
                    ))}
                  </svg>
                )}
                {i === 6 && (
                  <svg viewBox="0 0 220 85">
                    <polyline points={curves[3].points} />
                    <circle cx="133" cy="61" r="3" />
                  </svg>
                )}
              </div>
              <aside>
                <b>Residual check</b>
                <p>R(x,y)=y′+2y−eˣ</p>
                <strong>{active >= i + 1 ? s[3] : "Not applicable yet"}</strong>
              </aside>
            </article>
          ))}
        </div>
      </section>
      <section className="lfo-info">
        <article>
          <h3>▧ &nbsp; Final Answers</h3>
          <p>
            General solution: <b>y=eˣ/3+Ce⁻²ˣ</b>
          </p>
          <p>
            With y(0)=1: <b>y=eˣ/3+(2/3)e⁻²ˣ</b>
          </p>
          <p>Check at x=0: 1/3+2/3=1 ✓</p>
          <p>ODE residual: y′+2y−eˣ=0 ✓</p>
        </article>
        <article>
          <h3>▦ &nbsp; Standard Form</h3>
          <p>A first-order linear ODE is y′+P(x)y=Q(x).</p>
          <p>Our equation: y′+2y=eˣ</p>
          <p>P(x)=2, Q(x)=eˣ</p>
        </article>
        <article className="lfo-errors">
          <h3>⌘ &nbsp; Common Mistakes</h3>
          <ol>
            <li>Wrong sign in P(x).</li>
            <li>Forgetting the constant.</li>
            <li>Not multiplying every term by μ(x).</li>
            <li>Incorrectly integrating e³ˣ.</li>
            <li>Applying the initial condition incorrectly.</li>
          </ol>
        </article>
      </section>
      <section className="lfo-lower">
        <article>
          <h3>◇ &nbsp; Key Takeaways</h3>
          <ul>
            <li>Identify P(x) and Q(x).</li>
            <li>Compute μ(x)=e^(∫Pdx).</li>
            <li>Multiply every term by μ(x).</li>
            <li>Recognize the exact derivative.</li>
            <li>Integrate, solve, and apply the initial condition.</li>
          </ul>
        </article>
        <article>
          <h3>▧ &nbsp; Explore &amp; Visualize</h3>
          <ul>
            <li>Direction field and solution curves</li>
            <li>Vary constant C</li>
            <li>Residual surface R(x,y)</li>
            <li>Compare with a numerical solution</li>
          </ul>
        </article>
        <article>
          <h3>⌁ &nbsp; Practice Check (Quick)</h3>
          <p>What is the integrating factor for y′−5y=sin x?</p>
          {["e⁵ˣ", "e⁻⁵ˣ", "e⁻⁵sin x", "eˣ"].map((v) => (
            <label key={v}>
              <input
                type="radio"
                name="if10190"
                checked={answer === v}
                onChange={() => setAnswer(v)}
              />{" "}
              {v}
            </label>
          ))}
          <button
            onClick={() =>
              setFeedback(
                answer === "e⁻⁵ˣ"
                  ? "Correct: μ=e^(∫−5dx)=e⁻⁵ˣ."
                  : "Integrate P(x)=−5 before exponentiating.",
              )
            }
          >
            Check
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
        </article>
      </section>
      <section className="lfo-footer-cards">
        <article>
          <h3>Practice Problems</h3>
          <ol>
            <li>Solve y′−y=cos x.</li>
            <li>Solve y′+3y=xe²ˣ, y(0)=2.</li>
            <li>Solve y′−y/x=x², x&gt;0.</li>
          </ol>
          <button onClick={() => setSolutions((x) => !x)}>
            {solutions ? "Hide solutions" : "Show solutions"}
          </button>
          {solutions && <p>Use μ=e⁻ˣ, μ=e³ˣ, and μ=1/x respectively.</p>}
        </article>
        <article>
          <h3>Reflect &amp; Apply</h3>
          <ol>
            <li>When is the integrating factor method best?</li>
            <li>How does C affect long-term behavior?</li>
            <li>Compare with the Bernoulli method.</li>
          </ol>
        </article>
        <article>
          <h3>Assessment Prompts</h3>
          <ol>
            <li>Derive the integrating factor formula.</li>
            <li>Solve and verify y′+y=e⁻ˣ.</li>
            <li>Model a real-life system with y′+ky=a.</li>
          </ol>
        </article>
      </section>
      <nav className="lfo-nav">
        <Link to="/lessons/school/class-12/class-12-differential-equations-homogeneous-first-order-equations">
          ← Homogeneous First-Order Equations
        </Link>
        <Link to="/lessons/school/class-12/class-12-differential-equations-general-and-particular-solutions">
          General and Particular Solutions →
        </Link>
      </nav>
      <div className="lfo-complete">
        Pipeline complete · integrating factor applied · residual verified
      </div>
    </main>
  );
}
