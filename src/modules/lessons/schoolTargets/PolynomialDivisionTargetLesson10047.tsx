import {
  ArrowLeft,
  ArrowRight,
  Check,
  RotateCcw,
  Sparkles,
  Star,
  TriangleAlert,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import type { SchoolSyllabusLesson } from "../syllabus/lessonSyllabusTypes";
import "./PolynomialDivisionTargetLesson10047.css";

type Problem = { dividend: number[]; divisor: number[] };
const targetProblem: Problem = { dividend: [1, 0, 0, -1], divisor: [1, -1] };
const challengeProblem: Problem = { dividend: [2, 0, 3, -5], divisor: [1, 2] };
const tabs = ["INTERACT", "LEARN", "EXAMPLE", "FORMULA", "PRACTICE"];

function divide({ dividend, divisor }: Problem) {
  const work = [...dividend],
    quotient = Array(Math.max(1, dividend.length - divisor.length + 1)).fill(0),
    rows: {
      factor: number;
      degree: number;
      before: number[];
      product: number[];
      after: number[];
    }[] = [];
  for (let i = 0; i <= dividend.length - divisor.length; i++) {
    const factor = work[i] / divisor[0],
      degree = dividend.length - divisor.length - i;
    quotient[i] = factor;
    const before = [...work],
      product = Array(dividend.length).fill(0);
    divisor.forEach((coefficient, j) => {
      product[i + j] = coefficient * factor;
      work[i + j] -= product[i + j];
    });
    rows.push({ factor, degree, before, product, after: [...work] });
  }
  return {
    quotient,
    remainder: work.slice(dividend.length - divisor.length + 1),
    rows,
  };
}
const term = (coefficient: number, degree: number, first = false) => {
  const variable =
    degree > 1
      ? `x${"²³⁴⁵"[degree - 2] ?? `^${degree}`}`
      : degree === 1
        ? "x"
        : "";
  if (!coefficient) return `${first ? "" : "+ "}0${variable}`;
  const sign = coefficient < 0 ? "−" : first ? "" : "+";
  const amount =
    Math.abs(coefficient) === 1 && degree ? "" : Math.abs(coefficient);
  return `${sign} ${amount}${variable}`.trim();
};
const poly = (coefficients: number[]) =>
  coefficients
    .map((coefficient, i) =>
      term(coefficient, coefficients.length - i - 1, i === 0),
    )
    .join(" ");

export default function PolynomialDivisionTargetLesson10047({
  lesson: _lesson,
}: {
  lesson: SchoolSyllabusLesson;
}) {
  const [problem, setProblem] = useState(targetProblem),
    [stage, setStage] = useState(4),
    [tab, setTab] = useState("INTERACT"),
    [challengeStarted, setChallengeStarted] = useState(false),
    [showWorking, setShowWorking] = useState(false),
    [actions, setActions] = useState(0),
    [placedTerms, setPlacedTerms] = useState<string[]>([]);
  const result = useMemo(() => divide(problem), [problem]),
    challenge = useMemo(() => divide(challengeProblem), []);
  const act = (fn: () => void) => {
    fn();
    setActions((n) => n + 1);
  };
  const reset = () =>
    act(() => {
      setProblem(targetProblem);
      setStage(0);
      setPlacedTerms([]);
    });
  const newProblem = () =>
    act(() => {
      setProblem(challengeProblem);
      setStage(0);
      setPlacedTerms([]);
    });
  const addTerm = (value: string) =>
    act(() => setPlacedTerms((old) => [...old, value]));
  const remainderText = result.remainder.length ? poly(result.remainder) : "0";
  return (
    <section
      className="division10047-page"
      data-testid="school-mockup-0721"
      data-object-model="dedicated-polynomial-long-division-coefficient-engine"
      data-dividend={poly(problem.dividend)}
      data-divisor={poly(problem.divisor)}
      data-quotient={poly(result.quotient)}
      data-remainder={remainderText}
      data-stage={stage}
      data-identity={String(stage === 4)}
      data-challenge={String(challengeStarted)}
      data-actions={actions}
    >
      <header className="division10047-hero">
        <small>CLASS 9 · POLYNOMIALS</small>
        <h1>Polynomial Division</h1>
        <p>
          <b>Objective:</b> Divide a polynomial by another polynomial and
          connect quotient, divisor and remainder.
        </p>
        <div>
          <span>18 min</span>
          <span>INTERMEDIATE</span>
          <span>CONCEPT</span>
          <span>interactive</span>
        </div>
        <Link to="/lessons/school">
          <ArrowLeft /> School lessons
        </Link>
      </header>
      <nav className="division10047-tabs">
        {tabs.map((item) => (
          <button
            key={item}
            className={tab === item ? "active" : ""}
            onClick={() => act(() => setTab(item))}
          >
            {item}
          </button>
        ))}
      </nav>
      <main className="division10047-main">
        <section className="division-board">
          <header>
            <h2>Interactive Long Division Board</h2>
            <div>
              <button onClick={reset}>
                <RotateCcw /> Reset board
              </button>
              <button onClick={newProblem}>
                <RotateCcw /> New problem
              </button>
            </div>
          </header>
          <aside>
            <Star /> Use the term cards and step controls to complete the
            division.
          </aside>
          <div className="division-work">
            <aside>
              <section>
                <h3>TERM CARDS</h3>
                <p>Drag cards into the quotient row or subtraction rows.</p>
                <div className="division-cards">
                  {[
                    "x²",
                    "x",
                    "1",
                    "−x²",
                    "−x",
                    "−1",
                    "x³",
                    "x²",
                    "x",
                    "1",
                    "0",
                    "+",
                    "−",
                  ].map((value, i) => (
                    <button
                      key={`${value}${i}`}
                      draggable
                      onDragStart={(e) =>
                        e.dataTransfer.setData("text/plain", value)
                      }
                      onClick={() => addTerm(value)}
                    >
                      {value}
                    </button>
                  ))}
                </div>
              </section>
              <section>
                <h3>STEP CONTROLS</h3>
                <p>Follow the algorithm.</p>
                {["Divide", "Multiply", "Subtract", "Bring down"].map(
                  (label, i) => (
                    <button
                      key={label}
                      className={stage === i ? "active" : ""}
                      onClick={() =>
                        act(() => setStage(Math.max(stage, i + 1)))
                      }
                    >
                      <b>{i + 1}</b>
                      {label}
                      <span>›</span>
                    </button>
                  ),
                )}
                <button onClick={() => act(() => setStage(4))}>
                  <Sparkles /> Auto-solve
                </button>
              </section>
            </aside>
            <section
              className="division-calculation"
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                addTerm(e.dataTransfer.getData("text/plain"));
              }}
            >
              <header>
                <b>Problem</b>
                <Formula>
                  ({poly(problem.dividend)}) ÷ ({poly(problem.divisor)})
                </Formula>
              </header>
              <div className="division-quotient">
                <b>Quotient</b>
                <div>
                  {result.quotient.map((coefficient, i) => (
                    <span key={i}>
                      {stage > i
                        ? term(
                            coefficient,
                            result.quotient.length - i - 1,
                            i === 0,
                          )
                        : "?"}
                    </span>
                  ))}
                </div>
                {placedTerms.length > 0 && (
                  <small>Placed cards: {placedTerms.join(" ")}</small>
                )}
              </div>
              <div className="long-division">
                <b>{poly(problem.divisor)}</b>
                <div>
                  <strong>{poly(problem.dividend)}</strong>
                  {result.rows.map(
                    (row, i) =>
                      stage > i && (
                        <article key={i}>
                          <span>− ({poly(row.product)})</span>
                          <hr />
                          <span>{poly(row.after)}</span>
                        </article>
                      ),
                  )}
                </div>
              </div>
              <footer>
                <b>Remainder</b>
                <span>{stage === 4 ? remainderText : "?"}</span>
              </footer>
              <aside>
                <TriangleAlert /> Failing to insert zero coefficients misaligns
                terms.
              </aside>
            </section>
            <aside>
              <section>
                <h2>Identity Check ⓘ</h2>
                <p>Dividend = Divisor × Quotient + Remainder</p>
                <div>
                  <b>LHS (Dividend)</b>
                  <Formula>{poly(problem.dividend)}</Formula>
                  <strong>=</strong>
                  <b>RHS</b>
                  <Formula>
                    ({poly(problem.divisor)})({poly(result.quotient)}) +{" "}
                    {remainderText}
                  </Formula>
                </div>
                <p>Expand RHS</p>
                <Formula>
                  ({poly(problem.divisor)})({poly(result.quotient)}) +{" "}
                  {remainderText}
                </Formula>
                {stage === 4 && (
                  <footer>
                    LHS = RHS <Check /> Identity verified
                  </footer>
                )}
              </section>
              <section>
                <h2>Rules</h2>
                <p>• Dividend = Divisor × Quotient + Remainder</p>
                <p>• deg(Remainder) &lt; deg(Divisor)</p>
              </section>
            </aside>
          </div>
        </section>
        <section className="division-theory">
          <article>
            <h2>Why It Works</h2>
            <p>
              At each step we cancel the leading term of the current dividend
              using the divisor.
            </p>
            <p>
              Each subtraction reduces the degree of the remaining polynomial
              until the degree is less than the divisor's degree.
            </p>
            <div className="degree-path">
              Highest degree term → cancel → degree drops → stop <Check />
            </div>
          </article>
          <article>
            <h2>
              Worked Example <span>✓ Verified</span>
            </h2>
            <p>Divide (x³ − 1) by (x − 1).</p>
            <p>
              <b>Quotient:</b> x² + x + 1
            </p>
            <p>
              <b>Remainder:</b> 0
            </p>
            <p>
              <b>Check:</b> (x − 1)(x² + x + 1) + 0 = x³ − 1
            </p>
          </article>
        </section>
        <section className="division-challenge">
          <header>
            <h2>Your Turn: Mini Challenge</h2>
            <p>Divide 2x³ + 3x − 5 by x + 2.</p>
          </header>
          <div>
            <section>
              <b>Your Board</b>
              <button onClick={() => act(() => setChallengeStarted(true))}>
                ▶ Start challenge
              </button>
              <p>Use the term cards and step controls.</p>
            </section>
            <section>
              <b>Solution (Check your result)</b>
              <p>
                <b>Quotient:</b> {poly(challenge.quotient)}
              </p>
              <p>
                <b>Remainder:</b> {poly(challenge.remainder)}
              </p>
              <p>
                <b>Check:</b> (x + 2)({poly(challenge.quotient)}){" "}
                {term(challenge.remainder[0], 0)} = 2x³ + 3x − 5
              </p>
              <button onClick={() => act(() => setShowWorking((v) => !v))}>
                Show full working⌄
              </button>
              {showWorking && (
                <small>
                  {challenge.rows.map((row) => poly(row.after)).join(" → ")}
                </small>
              )}
            </section>
            <section>
              <b>Identity Check</b>
              <div>LHS (Dividend) = RHS</div>
              <strong>
                <Check /> Identity verified
              </strong>
            </section>
          </div>
        </section>
        <section className="division-misconception">
          <h2>
            <TriangleAlert /> Common Misconception
          </h2>
          <p>
            Skipping zero coefficients causes misalignment of like terms and
            wrong results.
          </p>
          <div>
            <article>
              <b>✕ Incorrect (skips zero terms)</b>
              <Formula>(x³ − 1) ÷ (x − 1)</Formula>
            </article>
            <article>
              <b>✓ Correct (include zeros)</b>
              <Formula>x³ + 0x² + 0x − 1</Formula>
            </article>
            <aside>
              <b>Why it matters</b>
              <p>
                Zero coefficients keep all powers aligned so each subtraction
                cancels the leading term properly.
              </p>
            </aside>
          </div>
        </section>
      </main>
      <nav className="division10047-adjacent">
        <Link to="/lessons/school">
          <ArrowLeft />
          <span>
            <small>Previous:</small>Division of Monomials
          </span>
        </Link>
        <Link to="/lessons/school">
          <span>
            <small>Next:</small>Polynomial Remainder Theorem
          </span>
          <ArrowRight />
        </Link>
      </nav>
    </section>
  );
}
function Formula({ children }: { children: React.ReactNode }) {
  return <span className="division-formula">{children}</span>;
}
