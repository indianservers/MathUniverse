import { Check, RotateCcw, Target, Trophy } from "lucide-react";
import { useState } from "react";
import type { SchoolSyllabusLesson } from "../syllabus/lessonSyllabusTypes";
import "./BinomialIndependentTermTargetLesson10137.css";

const factorial = (value: number) =>
  Array.from({ length: value }, (_, i) => i + 1).reduce((p, v) => p * v, 1);
const choose = (n: number, r: number) =>
  Math.round(factorial(n) / (factorial(r) * factorial(n - r)));
const signed = (value: number) =>
  value < 0 ? `− ${Math.abs(value)}` : `+ ${value}`;

export default function BinomialIndependentTermTargetLesson10137({
  lesson: _lesson,
}: {
  lesson: SchoolSyllabusLesson;
}) {
  const [n, setN] = useState(6);
  const [a, setA] = useState(2);
  const [b, setB] = useState(-3);
  const [m, setM] = useState(2);
  const [checkerR, setCheckerR] = useState(2);
  const [actions, setActions] = useState(0);
  const rawR = n / (m + 1);
  const valid = Number.isInteger(rawR) && rawR >= 0 && rawR <= n;
  const r = valid ? rawR : null;
  const exponent = (candidate: number) => n - (m + 1) * candidate;
  const constant = r === null ? null : choose(n, r) * a ** (n - r) * b ** r;
  const checkerExponent = exponent(checkerR);
  const checkerValid = checkerExponent === 0;
  const act = () => setActions((value) => value + 1);
  const update = (setter: (value: number) => void, value: number) => {
    setter(value);
    act();
  };
  const reset = () => {
    setN(6);
    setA(2);
    setB(-3);
    setM(2);
    setCheckerR(2);
    act();
  };
  return (
    <section
      className="it10137-page"
      data-testid="school-mockup-0811"
      data-object-model="dedicated-binomial-exponent-zero-engine"
      data-n={n}
      data-a={a}
      data-b={b}
      data-m={m}
      data-r={r === null ? "none" : r}
      data-constant={constant === null ? "none" : constant}
      data-checker-r={checkerR}
      data-checker-exponent={checkerExponent}
      data-checker-valid={String(checkerValid)}
      data-configuration-valid={String(valid)}
      data-actions={actions}
    >
      <header>
        <small>CLASS 11 · BINOMIAL THEOREM</small>
        <h1>Independent Term</h1>
        <p>
          Find the term whose net power of x is zero, then compute its constant
          value from the binomial coefficient.
        </p>
        <div>
          <span>18 min</span>
          <span>ADVANCED</span>
          <span>CONCEPT</span>
          <span>learning</span>
        </div>
      </header>
      <main>
        <header>
          <div>
            <h2>INTERACTIVE LAB &nbsp;•&nbsp; EXPONENT-ZERO SOLVER</h2>
            <p>
              Find the independent term (constant term) in{" "}
              <strong>
                ({a}x {signed(b)}/x^{m})^{n}
              </strong>
            </p>
          </div>
          <button onClick={reset}>
            <RotateCcw /> Reset lab
          </button>
        </header>
        <section className="it10137-workspace">
          <aside className="it10137-inputs">
            <div>
              <label>
                n (power)
                <input
                  aria-label="Independent power n"
                  type="number"
                  min="1"
                  max="12"
                  value={n}
                  onChange={(e) =>
                    update(
                      setN,
                      Math.max(1, Math.min(12, Number(e.target.value))),
                    )
                  }
                />
              </label>
              <label>
                a (coefficient of x)
                <input
                  aria-label="First coefficient a"
                  type="number"
                  min="-9"
                  max="9"
                  value={a}
                  onChange={(e) => update(setA, Number(e.target.value))}
                />
              </label>
              <label>
                b (coefficient)
                <input
                  aria-label="Second coefficient b"
                  type="number"
                  min="-9"
                  max="9"
                  value={b}
                  onChange={(e) => update(setB, Number(e.target.value))}
                />
              </label>
              <label>
                m (power of x in 2nd term)
                <input
                  aria-label="Denominator power m"
                  type="number"
                  min="1"
                  max="6"
                  value={m}
                  onChange={(e) =>
                    update(
                      setM,
                      Math.max(1, Math.min(6, Number(e.target.value))),
                    )
                  }
                />
              </label>
            </div>
            <section>
              <h3>Summary</h3>
              <p>Expression</p>
              <strong>
                ({a}x {signed(b)}/x^{m})^{n}
              </strong>
              <p>General term</p>
              <strong>
                Tᵣ₊₁ = C({n},r)({a}x)^{n}⁻ʳ({b}x⁻{m})ʳ
              </strong>
              <footer className={valid ? "valid" : "invalid"}>
                <Check />
                <div>
                  <b>
                    Configuration {valid ? "valid" : "has no constant term"}
                  </b>
                  <span>
                    {valid
                      ? `r=${r} is an integer from 0 to n.`
                      : `r=${rawR.toFixed(3)} is not an integer.`}
                  </span>
                </div>
              </footer>
            </section>
          </aside>
          <article className="it10137-steps">
            <h2>Step-by-step solution</h2>
            <ol>
              <li>
                <b>1</b>
                <div>
                  <h3>Write the general term</h3>
                  <p>
                    Tᵣ₊₁ = C({n},r) ({a}x)ⁿ⁻ʳ ({b}x⁻ᵐ)ʳ
                  </p>
                </div>
              </li>
              <li>
                <b>2</b>
                <div>
                  <h3>Combine the powers of x</h3>
                  <p>
                    Exponent = (n−r)−mr = {n}−{m + 1}r
                  </p>
                </div>
              </li>
              <li>
                <b>3</b>
                <div>
                  <h3>For independent term, set exponent to zero</h3>
                  <p>
                    {n}−{m + 1}r=0 &nbsp;⇒&nbsp; r={rawR.toFixed(valid ? 0 : 3)}
                  </p>
                </div>
              </li>
              <li>
                <b>4</b>
                <div>
                  <h3>Check valid range</h3>
                  <p>
                    {valid
                      ? `0 ≤ ${r} ≤ ${n}, so ${r} is valid.`
                      : `${rawR.toFixed(3)} is not an integer index.`}
                  </p>
                </div>
              </li>
              <li>
                <b>5</b>
                <div>
                  <h3>Find the constant term</h3>
                  <p>
                    {constant === null
                      ? "No independent term occurs in this expansion."
                      : `C(${n},${r}) × ${a}^${n - (r ?? 0)} × (${b})^${r} = ${constant}`}
                  </p>
                </div>
              </li>
            </ol>
            <footer>
              Independent term (constant term) ={" "}
              <strong>{constant === null ? "none" : constant}</strong>
            </footer>
          </article>
          <aside className="it10137-check">
            <section>
              <h2>EXPONENT BALANCE BEAM</h2>
              <p>We need the net exponent of x to be zero.</p>
              <div>
                <span>
                  From (ax)ⁿ⁻ʳ<b>{n}−r</b>
                </span>
                <span>
                  From (bx⁻ᵐ)ʳ<b>−{m}r</b>
                </span>
              </div>
              <strong className={valid ? "valid" : "invalid"}>
                {valid ? "0" : "not 0"}
              </strong>
              <p>
                ({n}−r)+(−{m}r)=0
              </p>
            </section>
            <section>
              <h2>LIVE CHECKER</h2>
              <label>
                Enter r{" "}
                <button
                  onClick={() => update(setCheckerR, Math.max(0, checkerR - 1))}
                >
                  −
                </button>
                <input
                  aria-label="Live checker r"
                  type="number"
                  min="0"
                  max={n}
                  value={checkerR}
                  onChange={(e) =>
                    update(
                      setCheckerR,
                      Math.max(0, Math.min(n, Number(e.target.value))),
                    )
                  }
                />
                <button
                  onClick={() => update(setCheckerR, Math.min(n, checkerR + 1))}
                >
                  +
                </button>
              </label>
              <p>
                Exponent of x: {n}−{m + 1}r = {checkerExponent}
              </p>
              <strong className={checkerValid ? "valid" : "invalid"}>
                {checkerValid ? (
                  <>
                    <Check /> Independent term
                  </>
                ) : (
                  "Not independent"
                )}
              </strong>
            </section>
            <footer className={valid ? "valid" : "invalid"}>
              <Trophy />
              <div>
                <h2>Result</h2>
                <p>
                  {constant === null
                    ? "No integer r makes the exponent zero."
                    : `T${(r ?? 0) + 1} = ${constant} is the independent term.`}
                </p>
              </div>
            </footer>
          </aside>
        </section>
      </main>
      <section className="it10137-bottom">
        <article>
          <h2>LESSON ARC</h2>
          <div>
            <span>
              HOOK
              <br />
              <small>Predict the independent term.</small>
            </span>
            <span>
              WORKED CONNECTION
              <br />
              <small>Combine powers and set exponent to zero.</small>
            </span>
            <span>
              EXIT CHECK
              <br />
              <small>Confirm r and compute the term.</small>
            </span>
          </div>
        </article>
        <article>
          <h2>
            <Target /> OBJECTIVES
          </h2>
          <p>
            <Check /> Define an independent term.
          </p>
          <p>
            <Check /> Write the general term and combine powers.
          </p>
          <p>
            <Check /> Set exponent to zero and find r.
          </p>
          <p>
            <Check /> Validate r and compute the constant term.
          </p>
        </article>
      </section>
    </section>
  );
}
