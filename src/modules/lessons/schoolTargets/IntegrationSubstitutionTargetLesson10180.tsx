import { CheckCircle2, Lightbulb, RotateCcw } from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import type { SchoolSyllabusLesson } from "../syllabus/lessonSyllabusTypes";
import "./IntegrationSubstitutionTargetLesson10180.css";
const norm = (value: string) =>
  value
    .toLowerCase()
    .replace(/\s|\*|\^/g, "")
    .replace(/²/g, "2")
    .replace(/⁴/g, "4")
    .replace(/⁵/g, "5");
const accepted = [
  ["-2cos(x2)+c", "c-2cos(x2)"],
  ["3/10(x2+5)5+c", "0.3(x2+5)5+c"],
  ["1/10sin(5x2+1)+c", "0.1sin(5x2+1)+c"],
];
export default function IntegrationSubstitutionTargetLesson10180({
  lesson: _lesson,
}: {
  lesson: SchoolSyllabusLesson;
}) {
  const [choice, setChoice] = useState("x²"),
    [answers, setAnswers] = useState(["", "", ""]),
    [feedback, setFeedback] = useState(["", "", ""]),
    [hints, setHints] = useState(false);
  const correct = choice === "x²";
  const integrand = useMemo(
    () =>
      Array.from({ length: 121 }, (_, i) => {
        const x = -1.5 + i * 0.025,
          y = 2 * x * Math.cos(x * x);
        return `${20 + i * 2.5},${105 - y * 34}`;
      }).join(" "),
    [],
  );
  const anti = useMemo(
    () =>
      Array.from({ length: 121 }, (_, i) => {
        const x = -1.5 + i * 0.025,
          y = Math.sin(x * x);
        return `${20 + i * 2.5},${105 - y * 34}`;
      }).join(" "),
    [],
  );
  const reset = () => {
    setChoice("x²");
    setAnswers(["", "", ""]);
    setFeedback(["", "", ""]);
    setHints(false);
  };
  const check = (index: number) =>
    setFeedback((v) =>
      v.map((text, i) =>
        i === index
          ? accepted[index].includes(norm(answers[index]))
            ? "Correct substitution and antiderivative."
            : "Differentiate your answer and recheck u and du."
          : text,
      ),
    );
  return (
    <main
      className="is10180-page"
      data-testid="school-mockup-0854"
      data-object-model="dedicated-u-substitution-transformation-engine"
      data-choice={choice}
      data-match={String(correct)}
      data-transformed={correct ? "integral-cos-u-du" : "unmatched"}
    >
      <header>
        <small>CLASS 12 · FORMAL CALCULUS</small>
        <h1>Integration by Substitution</h1>
        <h4>Substitution Transformation Lab</h4>
        <p>Transform ∫2x cos(x²) dx step-by-step using u=x².</p>
        <div>
          <span>16 min</span>
          <span>ADVANCED</span>
          <span>CONCEPT</span>
          <span>graph</span>
          <span>substitution</span>
        </div>
      </header>
      <section className="is-lab">
        <div className="is-lab-title">
          <div>
            <h3>SUBSTITUTION TRANSFORMATION LAB</h3>
            <p>Watch how the integral transforms from x-space to u-space.</p>
          </div>
          <button onClick={reset}>
            <RotateCcw /> Reset lab
          </button>
        </div>
        <h2>Target Integral: ∫ 2x cos(x²) dx</h2>
        <div className="is-map">
          <article>
            <h3>x-SPACE (original variable)</h3>
            <h4>Integrand</h4>
            <p>
              <b>2x</b>
              <strong>cos(x²)</strong>
              <i>dx</i>
            </p>
            <h4>Identify parts</h4>
            <ul>
              <li>Outer function: cos( )</li>
              <li>Inner expression: x²</li>
              <li>Derivative of inner: 2x</li>
              <li>dx</li>
            </ul>
          </article>
          <div>
            <h3>MAPPING: x→u</h3>
            <b>x² → u</b>
            <b>2x dx → du</b>
          </div>
          <article>
            <h3>u-SPACE (new variable)</h3>
            <h4>Transformed Integrand</h4>
            <p>
              <strong>cos(u)</strong>
              <b>du</b>
            </p>
            <h4>After substitution</h4>
            <p>u=x²</p>
            <p>du=2x dx</p>
          </article>
        </div>
        <div className="is-choose">
          <article>
            <h3>STEP 1: CHOOSE THE INNER EXPRESSION u</h3>
            <p>Pick the expression that simplifies the integrand.</p>
            <div>
              {["x", "x²", "sin x", "2x", "x²+1"].map((v) => (
                <button
                  className={choice === v ? "active" : ""}
                  onClick={() => setChoice(v)}
                  key={v}
                >
                  {v}
                  {choice === v && " ✓"}
                </button>
              ))}
            </div>
          </article>
          <article className={correct ? "matched" : "unmatched"}>
            <h3>du MATCH CHECK</h3>
            <p>Differentiate your chosen u and match a factor.</p>
            {correct ? (
              <>
                <h2>u=x²</h2>
                <p>du/dx=2x ⇒ du=2x dx</p>
                <b>
                  <CheckCircle2 /> Match found! 2x dx is present.
                </b>
              </>
            ) : (
              <>
                <h2>u={choice}</h2>
                <p>
                  Its differential does not replace the visible 2x dx factor
                  cleanly.
                </p>
                <b>Choose the inner expression inside cos( ).</b>
              </>
            )}
          </article>
        </div>
        <div className="is-steps">
          <article>
            <h3>STEP 2</h3>
            <b>Transform</b>
            <p>Replace x² with u and 2x dx with du.</p>
            <h2>∫cos(u)du</h2>
          </article>
          <article>
            <h3>STEP 3</h3>
            <b>Integrate in u</b>
            <h2>
              ∫cos(u)du
              <br />
              =sin(u)+C
            </h2>
          </article>
          <article>
            <h3>STEP 4</h3>
            <b>Back-substitute</b>
            <p>Replace u with x².</p>
            <h2>sin(x²)+C</h2>
          </article>
          <article>
            <h3>FINAL ANSWER</h3>
            <h2>
              ∫2x cos(x²)dx
              <br />
              =sin(x²)+C
            </h2>
          </article>
        </div>
        <section className="is-verify">
          <h3>VERIFY: EQUIVALENT ACCUMULATION OF AREA</h3>
          <p>The antiderivative sin(x²)+C must have derivative 2x cos(x²).</p>
          <div>
            <article>
              <b>Integrand: y=2x cos(x²)</b>
              <svg viewBox="0 0 340 210">
                <path d="M15 105H325M170 10V200" stroke="#34445a" />
                <polyline
                  points={integrand}
                  fill="none"
                  stroke="#ef3c62"
                  strokeWidth="2.5"
                />
              </svg>
              <p>Interval: [−1.5,1.5] · Net area=0</p>
            </article>
            <strong>=</strong>
            <article>
              <b>Antiderivative F(x)=sin(x²)+C</b>
              <svg viewBox="0 0 340 210">
                <path d="M15 105H325M170 10V200" stroke="#34445a" />
                <polyline
                  points={anti}
                  fill="none"
                  stroke="#159953"
                  strokeWidth="2.5"
                />
              </svg>
              <p>Net change F(b)−F(a)=0</p>
            </article>
            <article>
              <b>Fundamental Theorem of Calculus</b>
              <p>∫[-1.5,1.5] 2x cos(x²)dx=F(1.5)−F(−1.5)=0</p>
              <strong>
                <CheckCircle2 /> Signed area and net change agree.
              </strong>
            </article>
          </div>
        </section>
      </section>
      <section className="is-rules">
        <article>
          <h3>SUBSTITUTION RULE</h3>
          <p>If u=g(x) and du=g'(x)dx, then</p>
          <h2>∫f(g(x))g'(x)dx = ∫f(u)du</h2>
        </article>
        <article>
          <h3>COMMON MISTAKES</h3>
          <p>1. Forgetting du: writing ∫cos(u) instead of ∫cos(u)du.</p>
          <p>2. Forgetting to back-substitute.</p>
        </article>
      </section>
      <section className="is-bottom">
        <article>
          <h3>MORE EXAMPLES (WORKED)</h3>
          <p>Example: ∫ x/(x²+1) dx</p>
          <ol>
            <li>Let u=x²+1, so du=2x dx.</li>
            <li>x dx=du/2.</li>
            <li>1/2 ∫du/u = 1/2 ln|u|+C.</li>
            <li>Answer: 1/2 ln(x²+1)+C.</li>
          </ol>
        </article>
        <article>
          <h3>PRACTICE THIS LESSON</h3>
          {["∫4x sin(x²) dx", "∫3x(x²+5)⁴ dx", "∫x cos(5x²+1) dx"].map(
            (q, i) => (
              <section key={q}>
                <b>
                  {i + 1}. {q}
                </b>
                <input
                  aria-label={`Substitution answer ${i + 1}`}
                  value={answers[i]}
                  onChange={(e) =>
                    setAnswers((v) =>
                      v.map((x, j) => (j === i ? e.target.value : x)),
                    )
                  }
                />
                <button onClick={() => check(i)}>Check</button>
                {feedback[i] && <output>{feedback[i]}</output>}
              </section>
            ),
          )}
          <button onClick={() => setHints((v) => !v)}>Show hints</button>
        </article>
        <article>
          <h3>HINTS</h3>
          {hints ? (
            <ol>
              <li>For 4x sin(x²), use u=x².</li>
              <li>For 3x(x²+5)⁴, use u=x²+5.</li>
              <li>For x cos(5x²+1), use u=5x²+1.</li>
            </ol>
          ) : (
            <p>
              <Lightbulb /> Reveal hints after attempting the integrals.
            </p>
          )}
        </article>
      </section>
      <nav className="is-adjacent">
        <Link to="/lessons/school/class-12/class-12-formal-calculus-approximation-using-differentials">
          ← Approximation Using Differentials
        </Link>
        <Link to="/lessons/school/class-12/class-12-formal-calculus-integration-by-parts">
          Integration by Parts →
        </Link>
      </nav>
      <footer>
        <b>⌁ Math Universe</b>
        <p>
          Interactive math labs, visual proofs, NCERT explorations, graphing,
          CAS-style tools, and classroom-ready activities.
        </p>
        <small>
          © 2026 INDIAN SERVERS PRIVATE LIMITED. NO RIGHT TO REPRODUCE IT.
        </small>
      </footer>
    </main>
  );
}
