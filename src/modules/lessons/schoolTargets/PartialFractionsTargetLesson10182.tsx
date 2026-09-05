import { CheckCircle2, Copy, Lightbulb, RotateCcw } from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import type { SchoolSyllabusLesson } from "../syllabus/lessonSyllabusTypes";
import "./PartialFractionsTargetLesson10182.css";

const fmt = (value: number) => Number(value.toFixed(2));

export default function PartialFractionsTargetLesson10182({
  lesson: _lesson,
}: {
  lesson: SchoolSyllabusLesson;
}) {
  const [a, setA] = useState(2);
  const [b, setB] = useState(1);
  const [practiceA, setPracticeA] = useState(0);
  const [practiceB, setPracticeB] = useState(0);
  const [practiceFeedback, setPracticeFeedback] = useState("");
  const [showAnswer, setShowAnswer] = useState(false);
  const [showProper, setShowProper] = useState(false);
  const coefficientX = a + b;
  const constant = 2 * a + b;
  const solved =
    Math.abs(coefficientX - 3) < 0.001 && Math.abs(constant - 5) < 0.001;
  const graphPaths = useMemo(() => {
    const segments: string[][] = [[], [], []];
    for (let i = 0; i <= 480; i += 1) {
      const x = -7 + (14 * i) / 480;
      if (Math.abs(x + 2) < 0.03 || Math.abs(x + 1) < 0.03) continue;
      const y = (3 * x + 5) / (x * x + 3 * x + 2);
      if (Math.abs(y) > 8) continue;
      const segment = x < -2 ? 0 : x < -1 ? 1 : 2;
      segments[segment].push(`${170 + x * 21},${118 - y * 13}`);
    }
    return segments.map((points) => points.join(" "));
  }, []);
  const reset = () => {
    setA(2);
    setB(1);
    setPracticeA(0);
    setPracticeB(0);
    setPracticeFeedback("");
    setShowAnswer(false);
    setShowProper(false);
  };
  const solve = () => {
    setA(2);
    setB(1);
  };
  const checkPractice = () => {
    const correct =
      Math.abs(practiceA - 13 / 5) < 0.01 && Math.abs(practiceB + 3 / 5) < 0.01;
    setPracticeFeedback(
      correct
        ? "Correct: recombination gives 2x+7."
        : "Recheck A+B=2 and −2A−3B=7.",
    );
  };

  return (
    <main
      className="pf10182-page"
      data-testid="school-mockup-0856"
      data-object-model="dedicated-partial-fraction-coefficient-engine"
      data-a={fmt(a)}
      data-b={fmt(b)}
      data-x-coefficient={fmt(coefficientX)}
      data-constant={fmt(constant)}
      data-solved={String(solved)}
    >
      <header>
        <small>CLASS 12 · FORMAL CALCULUS</small>
        <h1>Integration by Partial Fractions</h1>
        <p>
          Decompose and integrate the rational expression{" "}
          <b>(3x+5)/(x²+3x+2)</b>.
        </p>
        <div>
          <span>18 min</span>
          <span>ADVANCED</span>
          <span>CONCEPT</span>
          <span>lab</span>
        </div>
      </header>

      <section className="pf-prereq">
        <article>
          <h3>Prerequisite: Proper Fraction</h3>
          <p>
            For partial fractions, the numerator degree must be strictly less
            than the denominator degree.
          </p>
          <b>
            Here: deg(3x+5)=1 &lt; deg(x²+3x+2)=2 <CheckCircle2 />
          </b>
        </article>
        <article>
          <h3>Warning: Not a Proper Fraction?</h3>
          <p>
            If the numerator degree is greater than or equal to the
            denominator's, divide first.
          </p>
          <button onClick={() => setShowProper((value) => !value)}>
            {showProper ? "Hide explanation" : "Learn more"}
          </button>
          {showProper && (
            <p>
              Polynomial division writes it as Polynomial + Proper Fraction.
            </p>
          )}
        </article>
      </section>

      <section className="pf-body">
        <section className="pf-lab">
          <div className="pf-title">
            <h3>RATIONAL-EXPRESSION DECOMPOSITION LAB</h3>
            <button onClick={reset}>
              <RotateCcw /> Reset lab
            </button>
          </div>
          <article>
            <h4>
              <i>1</i> Factor the denominator
            </h4>
            <p>x²+3x+2=(x+1)(x+2)</p>
            <b className="ok">Correct ✓</b>
          </article>
          <article>
            <h4>
              <i>2</i> Set up the partial fraction form
            </h4>
            <p>(3x+5)/((x+1)(x+2)) = A/(x+1) + B/(x+2)</p>
            <div className="pf-steppers">
              <label>
                A (coefficient)
                <span>
                  <button onClick={() => setA((v) => fmt(v - 1))}>−</button>
                  <input
                    aria-label="Coefficient A"
                    type="number"
                    value={a}
                    onChange={(e) => setA(Number(e.target.value))}
                  />
                  <button onClick={() => setA((v) => fmt(v + 1))}>+</button>
                </span>
              </label>
              <label>
                B (coefficient)
                <span>
                  <button onClick={() => setB((v) => fmt(v - 1))}>−</button>
                  <input
                    aria-label="Coefficient B"
                    type="number"
                    value={b}
                    onChange={(e) => setB(Number(e.target.value))}
                  />
                  <button onClick={() => setB((v) => fmt(v + 1))}>+</button>
                </span>
              </label>
            </div>
            <button onClick={solve}>Solve automatically</button>
          </article>
          <article>
            <h4>
              <i>3</i> Clear denominators and expand
            </h4>
            <p>3x+5=A(x+2)+B(x+1)</p>
            <p>3x+5=(A+B)x+(2A+B)</p>
          </article>
          <article>
            <h4>
              <i>4</i> Match coefficients
            </h4>
            <div className="pf-match">
              <span>
                A+B={fmt(coefficientX)}
                <b>
                  {Math.abs(coefficientX - 3) < 0.001
                    ? "✓ Satisfied"
                    : "Needs 3"}
                </b>
              </span>
              <span>
                2A+B={fmt(constant)}
                <b>
                  {Math.abs(constant - 5) < 0.001 ? "✓ Satisfied" : "Needs 5"}
                </b>
              </span>
            </div>
            <div className={solved ? "pf-solved on" : "pf-solved"}>
              <Lightbulb />{" "}
              {solved
                ? `Solved coefficients: A=${a}, B=${b}`
                : "Adjust A and B until both equations are satisfied."}
            </div>
          </article>
          <article>
            <h4>
              <i>5</i> Write the decomposition
            </h4>
            <h2>
              (3x+5)/(x²+3x+2) = {a}/(x+1) + {b}/(x+2)
            </h2>
          </article>
          <article>
            <h4>
              <i>6</i> Integrate both sides
            </h4>
            <h2>
              ∫(3x+5)/(x²+3x+2)dx = {a}ln|x+1| + {b}ln|x+2| + C
            </h2>
            <div className={solved ? "pf-final on" : "pf-final"}>
              Final answer:{" "}
              {solved
                ? "2ln|x+1| + ln|x+2| + C"
                : "Solve the coefficient equations first."}
              <button
                aria-label="Copy final answer"
                onClick={() =>
                  navigator.clipboard?.writeText("2ln|x+1| + ln|x+2| + C")
                }
              >
                <Copy />
              </button>
            </div>
          </article>
        </section>

        <aside className="pf-side">
          <section>
            <h3>GRAPH OF THE FUNCTION</h3>
            <p>f(x)=(3x+5)/(x²+3x+2)</p>
            <svg viewBox="0 0 340 236" aria-label="Rational function graph">
              <path d="M15 118H325M170 10V225" stroke="#65758a" />
              <path
                d="M128 12V225M149 12V225"
                stroke="#ff4b64"
                strokeDasharray="5 4"
              />
              {graphPaths.map((points, index) => (
                <polyline
                  key={index}
                  points={points}
                  fill="none"
                  stroke="#1475ef"
                  strokeWidth="2.2"
                />
              ))}
            </svg>
            <p>
              <b>Vertical asymptotes:</b> x=−2, x=−1
            </p>
            <p>
              <b>Horizontal asymptote:</b> y=0
            </p>
            <div>Domain: ℝ \ {"{−2, −1}"}</div>
          </section>
          <section>
            <h3>METHODS TO FIND COEFFICIENTS</h3>
            <div className="pf-methods">
              <article>
                <b>1 Cover-Up Method</b>
                <p>A=lim(x→−1)(x+1)f(x)=2</p>
                <p>B=lim(x→−2)(x+2)f(x)=1</p>
              </article>
              <article>
                <b>2 Coefficient Comparison</b>
                <p>A+B=3</p>
                <p>2A+B=5</p>
                <p>A=2, B=1</p>
              </article>
            </div>
          </section>
          <div className="pf-checks">
            <article>
              <h3>VERIFY BY RECOMBINING</h3>
              <p>
                {a}/(x+1)+{b}/(x+2)
              </p>
              <p>
                =[{fmt(coefficientX)}x+{fmt(constant)}]/[(x+1)(x+2)]
              </p>
              <b>
                {solved
                  ? "Verification: matches the original expression."
                  : "Coefficients do not yet recombine correctly."}
              </b>
            </article>
            <article>
              <h3>KEY TAKEAWAYS</h3>
              <p>✓ Factor the denominator.</p>
              <p>✓ Set up the partial fraction form.</p>
              <p>✓ Find coefficients and recombine.</p>
            </article>
          </div>
        </aside>
      </section>

      <section className="pf-practice">
        <div>
          <h3>TRY ANOTHER (PRACTICE)</h3>
          <p>Decompose and integrate (2x+7)/(x²−x−6).</p>
          <small>Hint: x²−x−6=(x−3)(x+2)</small>
        </div>
        <label>
          A
          <input
            aria-label="Practice coefficient A"
            type="number"
            step="0.2"
            value={practiceA}
            onChange={(e) => setPracticeA(Number(e.target.value))}
          />
        </label>
        <label>
          B
          <input
            aria-label="Practice coefficient B"
            type="number"
            step="0.2"
            value={practiceB}
            onChange={(e) => setPracticeB(Number(e.target.value))}
          />
        </label>
        <button onClick={checkPractice}>Check</button>
        <aside>
          <button onClick={() => setShowAnswer((value) => !value)}>
            {showAnswer ? "Hide answer" : "Show answer"}
          </button>
          {showAnswer && (
            <p>
              13/[5(x−3)] − 3/[5(x+2)]
              <br />
              Integral = 13/5 ln|x−3| − 3/5 ln|x+2| + C
            </p>
          )}
        </aside>
        {practiceFeedback && <output>{practiceFeedback}</output>}
      </section>
      <nav className="pf-adjacent">
        <Link to="/lessons/school/class-12/class-12-formal-calculus-integration-by-parts">
          ← Integration by Parts
        </Link>
        <Link to="/lessons/school/class-12/class-12-formal-calculus-definite-integral-properties">
          Definite Integral Properties →
        </Link>
      </nav>
      <footer>
        <b>⌁ Math Universe</b>
        <p>
          Interactive math labs, visual proofs, NCERT explorations, graphing,
          CAS-style tools, and classroom-ready activities.
        </p>
        <div>
          <Link to="/sitemap">Sitemap</Link>
          <Link to="/documentation">Docs</Link>
          <Link to="/about">About</Link>
        </div>
      </footer>
    </main>
  );
}
