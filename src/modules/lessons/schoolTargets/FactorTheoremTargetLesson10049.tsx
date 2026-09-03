import {
  ArrowLeft,
  ArrowRight,
  Check,
  RotateCcw,
  TriangleAlert,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import type { SchoolSyllabusLesson } from "../syllabus/lessonSyllabusTypes";
import "./FactorTheoremTargetLesson10049.css";

const tabs = ["Interact", "Learn", "Example", "Formula", "Practice"],
  candidates = [-3, -2, -1, 0, 1, 2, 3];
const evaluate = (cs: number[], x: number) =>
  cs.reduce((sum, c) => sum * x + c, 0);
const synthetic = (cs: number[], a: number) => {
  const q = [cs[0]];
  for (let i = 1; i < cs.length - 1; i++) q.push(cs[i] + q[i - 1] * a);
  return { quotient: q, remainder: cs.at(-1)! + q.at(-1)! * a };
};
const sup = (d: number) => (d === 3 ? "³" : d === 2 ? "²" : d === 1 ? "" : "");
const poly = (cs: number[]) =>
  cs
    .map((v, i) => {
      const d = cs.length - i - 1;
      if (!v) return `${i ? "+ " : ""}0${d ? `x${sup(d)}` : ""}`;
      const sign = v < 0 ? "−" : i ? "+" : "",
        amount = Math.abs(v) === 1 && d ? "" : Math.abs(v),
        variable = d ? `x${sup(d)}` : "";
      return `${sign} ${amount}${variable}`.trim();
    })
    .join(" ");
const factor = (a: number) => `x ${a < 0 ? "+" : "−"} ${Math.abs(a)}`;
const substitution = (cs: number[], x: number) =>
  cs
    .map((coefficient, i) => {
      const degree = cs.length - i - 1,
        sign = coefficient < 0 ? "−" : i ? "+" : "",
        amount =
          Math.abs(coefficient) === 1 && degree ? "" : Math.abs(coefficient),
        power = degree ? `(${x})${sup(degree)}` : "";
      return `${sign} ${amount}${power}`.trim();
    })
    .join(" ");

export default function FactorTheoremTargetLesson10049({
  lesson: _lesson,
}: {
  lesson: SchoolSyllabusLesson;
}) {
  const [coefficients, setCoefficients] = useState([1, -5, 6]),
    [candidate, setCandidate] = useState(2),
    [tab, setTab] = useState("Interact"),
    [tested, setTested] = useState<number[]>([]),
    [actions, setActions] = useState(0);
  const value = evaluate(coefficients, candidate),
    division = useMemo(
      () => synthetic(coefficients, candidate),
      [coefficients, candidate],
    ),
    roots = candidates.filter((x) => evaluate(coefficients, x) === 0),
    challengeCoefficients = [1, -6, 11, -6],
    challengeFactors = tested.filter(
      (x) => evaluate(challengeCoefficients, x) === 0,
    ),
    challengeComplete = tested.includes(2) && tested.includes(3),
    act = (fn: () => void) => {
      fn();
      setActions((n) => n + 1);
    };
  const changeCoefficient = (i: number, value: number) =>
    act(() =>
      setCoefficients((old) => old.map((v, j) => (i === j ? value : v))),
    );
  return (
    <section
      className="factor10049-page"
      data-testid="school-mockup-0723"
      data-object-model="dedicated-factor-theorem-substitution-synthetic-division-engine"
      data-polynomial={poly(coefficients)}
      data-candidate={candidate}
      data-value={value}
      data-factor={String(value === 0)}
      data-quotient={poly(division.quotient)}
      data-remainder={division.remainder}
      data-challenge-factors={
        challengeComplete ? "1,2,3" : challengeFactors.join(",")
      }
      data-actions={actions}
    >
      <header className="factor10049-hero">
        <small>CLASS 9 · POLYNOMIALS</small>
        <h1>Factor Theorem</h1>
        <p>
          <b>Objective:</b> Test and identify linear factors by linking roots,
          substitution and division.
        </p>
        <div>
          <span>Class 9</span>
          <span>Polynomials</span>
          <span>30 min</span>
          <span>NCERT</span>
          <span>Rigor: Medium</span>
        </div>
        <Link to="/lessons/school">
          <ArrowLeft /> School lessons
        </Link>
      </header>
      <nav className="factor10049-tabs">
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
      <main className="factor10049-main">
        <section className="factor-workbench">
          <header>
            <h2>FACTOR-TESTING WORKBENCH</h2>
            <p>
              Test candidates, see p(a), find x-intercepts, and divide to reveal
              factors.
            </p>
          </header>
          <div className="factor-top">
            <aside>
              <label>
                Polynomial
                <div>
                  {coefficients.map((coefficient, i) => (
                    <input
                      key={i}
                      aria-label={`Coefficient ${i + 1}`}
                      type="number"
                      value={coefficient}
                      onChange={(e) =>
                        changeCoefficient(i, Number(e.target.value))
                      }
                    />
                  ))}
                </div>
                <Formula>p(x) = {poly(coefficients)}</Formula>
              </label>
              <h3>Test candidate (a)</h3>
              <div className="factor-candidates">
                {candidates.map((item) => (
                  <button
                    key={item}
                    className={candidate === item ? "active" : ""}
                    onClick={() => act(() => setCandidate(item))}
                  >
                    {item}
                  </button>
                ))}
              </div>
              <section className="factor-substitution">
                <h2>Substitution: p(a)</h2>
                <Formula>
                  p({candidate}) = {substitution(coefficients, candidate)}
                </Formula>
                <Formula>= {value}</Formula>
                <strong className={value === 0 ? "yes" : "no"}>
                  {value === 0 ? (
                    <>
                      <Check /> Since p({candidate})=0, {factor(candidate)} is a
                      factor and x={candidate} is an x-intercept.
                    </>
                  ) : (
                    <>
                      Since p({candidate})={value}, {factor(candidate)} is not a
                      factor.
                    </>
                  )}
                </strong>
              </section>
              <h3>Factor badge</h3>
              <div className={value === 0 ? "factor-badge" : "factor-badge no"}>
                {factor(candidate)} {value === 0 ? <Check /> : "✕"}
              </div>
            </aside>
            <section className="factor-graph">
              <h3>Graph of y = p(x)</h3>
              <PolynomialGraph coefficients={coefficients} roots={roots} />
              <footer>
                <b>x-intercepts:</b>{" "}
                {roots.length
                  ? roots.map((r) => `(${r}, 0)`).join(", ")
                  : "none"}
              </footer>
            </section>
          </div>
          <section className="factor-synthetic">
            <h2>SYNTHETIC DIVISION BY ({factor(candidate)})</h2>
            <div>
              <b>{candidate}</b>
              <span>{coefficients.join("   ")}</span>
              <span>
                {division.quotient.join("   ")} &nbsp; | &nbsp;{" "}
                {division.remainder}
              </span>
            </div>
            <aside className={division.remainder === 0 ? "verified" : "failed"}>
              <b>
                Remainder = {division.remainder}{" "}
                {division.remainder === 0 && <Check />}
              </b>
              <b>Quotient: {poly(division.quotient)}</b>
              <p>
                So, p(x){" "}
                {division.remainder === 0
                  ? `= (${factor(candidate)})(${poly(division.quotient)})`
                  : "does not divide exactly."}
              </p>
            </aside>
          </section>
        </section>
        <section className="factor-theory">
          <article>
            <h2>THE FACTOR THEOREM</h2>
            <p>For a polynomial p(x) and a number a,</p>
            <Formula>x−a is a factor of p(x) ⇔ p(a)=0</Formula>
            <h3>Why it works</h3>
            <p>
              Dividing p(x) by x−a leaves remainder p(a). If it is zero, the
              division is exact.
            </p>
          </article>
          <article>
            <h2>WORKED EXAMPLE</h2>
            <p>Factor p(x)=x²−5x+6.</p>
            <p>
              <b>1.</b> Test a=2: p(2)=0, so x−2 is a factor.
            </p>
            <p>
              <b>2.</b> Divide by x−2: quotient x−3, remainder 0.
            </p>
            <p>
              <b>3.</b> Factorisation:
            </p>
            <Formula>p(x)=(x−2)(x−3)</Formula>
            <p>Roots: 2, 3</p>
          </article>
          <article className="factor-warning">
            <h2>
              <TriangleAlert /> MISCONCEPTION WARNING
            </h2>
            <p>If p(a) is not zero but very small, x−a is not a factor.</p>
            <p>A nonzero remainder means division is not exact.</p>
            <p>p(2.1)=−0.19 (not zero), so x−2.1 is not a factor.</p>
          </article>
        </section>
        <section className="factor-challenge">
          <header>
            <h2>CHALLENGE: TEST AND FACTORISE</h2>
            <button onClick={() => act(() => setTested([]))}>
              <RotateCcw /> Reset workspace
            </button>
          </header>
          <div>
            <article>
              <p>Given p(x)=x³−6x²+11x−6.</p>
              <p>
                <b>1.</b> Test each candidate using substitution p(a).
              </p>
              <p>
                <b>2.</b> Divide successively to factorise completely.
              </p>
              <p>
                <b>3.</b> List all real roots.
              </p>
            </article>
            <section>
              <h3>Test candidates</h3>
              {[-1, 2, 3].map((a) => (
                <button
                  key={a}
                  className={
                    tested.includes(a)
                      ? evaluate(challengeCoefficients, a) === 0
                        ? "pass"
                        : "fail"
                      : ""
                  }
                  onClick={() =>
                    act(() =>
                      setTested((old) => (old.includes(a) ? old : [...old, a])),
                    )
                  }
                >
                  {factor(a)}
                  <small>(a = {a})</small>
                </button>
              ))}
            </section>
            <aside>
              <h3>Your findings</h3>
              <p>
                Factors found:{" "}
                {challengeFactors.length
                  ? challengeComplete
                    ? [1, 2, 3].map(factor).join(", ")
                    : challengeFactors.map(factor).join(", ")
                  : "–"}
              </p>
              <p>
                Factorisation: {challengeComplete ? "(x−1)(x−2)(x−3)" : "–"}
              </p>
              <p>
                Roots:{" "}
                {challengeComplete
                  ? "1, 2, 3"
                  : challengeFactors.length
                    ? challengeFactors.join(", ")
                    : "–"}
              </p>
              <footer>
                Status: {challengeComplete ? "Complete" : "Not started"}
              </footer>
            </aside>
          </div>
        </section>
      </main>
      <nav className="factor10049-adjacent">
        <Link to="/lessons/school/class-9/class-9-polynomials-remainder-theorem">
          <ArrowLeft />
          <span>
            <small>Previous</small>Remainder Theorem
          </span>
        </Link>
        <Link to="/lessons/school">
          <span>
            <small>Next</small>Relationship Between Zeros and Coefficients
          </span>
          <ArrowRight />
        </Link>
      </nav>
    </section>
  );
}
function Formula({ children }: { children: React.ReactNode }) {
  return <div className="factor-formula">{children}</div>;
}
function PolynomialGraph({
  coefficients,
  roots,
}: {
  coefficients: number[];
  roots: number[];
}) {
  const sx = (x: number) => 30 + (x + 5) * 35,
    sy = (y: number) => 180 - y * 13,
    path = Array.from({ length: 121 }, (_, i) => {
      const x = -5 + i / 10;
      return `${i ? "L" : "M"}${sx(x)},${sy(evaluate(coefficients, x))}`;
    }).join(" ");
  return (
    <svg
      className="factor-svg"
      viewBox="0 0 390 250"
      aria-label="Polynomial graph"
    >
      <g>
        {Array.from({ length: 12 }, (_, i) => (
          <line key={i} x1={30 + i * 35} x2={30 + i * 35} y1="10" y2="230" />
        ))}
      </g>
      <line className="axis" x1="10" x2="385" y1={sy(0)} y2={sy(0)} />
      <line className="axis" x1={sx(0)} x2={sx(0)} y1="10" y2="230" />
      <path d={path} />
      {roots.map((root) => (
        <circle key={root} cx={sx(root)} cy={sy(0)} r="6" />
      ))}
    </svg>
  );
}
