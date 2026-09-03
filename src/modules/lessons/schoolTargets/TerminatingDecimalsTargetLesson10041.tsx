import { ArrowLeft, ArrowRight, Check, Info, RefreshCw, X } from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  analyzeDecimalExpansion,
  factorizationText,
  gcd,
} from "../decimalExpansion/decimalExpansionEngine";
import type { SchoolSyllabusLesson } from "../syllabus/lessonSyllabusTypes";
import "./TerminatingDecimalsTargetLesson10041.css";

const tabs = ["Interact", "Learn", "Example", "Formula", "Practice"];
const previous =
  "/lessons/school/class-9/class-9-real-numbers-decimal-expansion-of-rational-numbers";
const next =
  "/lessons/school/class-9/class-9-real-numbers-rational-and-irrational-classification";

export default function TerminatingDecimalsTargetLesson10041({
  lesson: _lesson,
}: {
  lesson: SchoolSyllabusLesson;
}) {
  const [numerator, setNumerator] = useState(7),
    [denominator, setDenominator] = useState(40);
  const [tab, setTab] = useState("Interact"),
    [actions, setActions] = useState(0);
  const validDenominator = denominator === 0 ? 1 : denominator;
  const analysis = useMemo(
    () => analyzeDecimalExpansion(numerator, validDenominator),
    [numerator, validDenominator],
  );
  const divisor = gcd(numerator, validDenominator);
  const factors = analysis.factorization;
  const otherFactors = factors.filter(
    ({ prime }) => prime !== 2 && prime !== 5,
  );
  const terminating = analysis.classification === "terminating";
  const act = (fn: () => void) => {
    fn();
    setActions((n) => n + 1);
  };
  const reset = () =>
    act(() => {
      setNumerator(7);
      setDenominator(40);
      setTab("Interact");
    });
  return (
    <section
      className="td10041-page"
      data-testid="school-mockup-0715"
      data-object-model="dedicated-simplify-factor-predict-verify-engine"
      data-reduced={`${analysis.reducedNumerator}/${analysis.reducedDenominator}`}
      data-classification={analysis.classification}
      data-decimal={analysis.decimalDisplay}
      data-actions={actions}
    >
      <header className="td10041-hero">
        <small>CLASS 9 · REAL NUMBERS</small>
        <h1>Terminating and Non-Terminating Decimals</h1>
        <p>
          <b>Objective:</b> Predict whether a rational number terminates from
          its simplified denominator.
        </p>
        <div>
          <span>18 min</span>
          <span>INTERMEDIATE</span>
          <span>CONCEPT</span>
          <span>number</span>
        </div>
        <Link to="/lessons/school">
          <ArrowLeft /> School lessons
        </Link>
      </header>
      <nav className="td10041-tabs">
        {tabs.map((t) => (
          <button
            key={t}
            className={tab === t ? "active" : ""}
            onClick={() => act(() => setTab(t))}
          >
            {t}
          </button>
        ))}
      </nav>
      <main className="td10041-main">
        <section className="td10041-machine">
          <h2>▣ FACTOR-DENOMINATOR MACHINE</h2>
          <p>Simplify → Factor denominator → Predict → Verify</p>
          <div className="td10041-topflow">
            <article className="td-enter">
              <h3>
                <b>1</b> Enter a fraction
              </h3>
              <label>
                <input
                  aria-label="Numerator"
                  type="number"
                  value={numerator}
                  onChange={(e) =>
                    act(() => setNumerator(Number(e.target.value)))
                  }
                />
                <i />
                <input
                  aria-label="Denominator"
                  type="number"
                  value={denominator}
                  onChange={(e) =>
                    act(() => setDenominator(Number(e.target.value)))
                  }
                />
              </label>
              <footer>
                <button
                  aria-label="Swap numerator and denominator"
                  onClick={() =>
                    act(() => {
                      setNumerator(validDenominator);
                      setDenominator(numerator || 1);
                    })
                  }
                >
                  <RefreshCw />
                </button>
                <button aria-label="Reset fraction" onClick={reset}>
                  <X />
                </button>
              </footer>
            </article>
            <i>→</i>
            <article className="td-cancel">
              <h3>
                <b>2</b> Cancel common factors
              </h3>
              <div>
                <Fraction n={numerator} d={validDenominator} />
                <span>=</span>
                <Fraction
                  n={`${numerator}÷${divisor}`}
                  d={`${validDenominator}÷${divisor}`}
                />
                <span>=</span>
                <Fraction
                  n={analysis.reducedNumerator}
                  d={analysis.reducedDenominator}
                />
              </div>
              <p>
                <Check />{" "}
                {divisor === 1
                  ? "Already in lowest terms."
                  : `Divide both by ${divisor}.`}
              </p>
            </article>
            <i>→</i>
            <article className="td-factor">
              <h3>
                <b>3</b> Factor the denominator
              </h3>
              <p>
                {analysis.reducedDenominator} ={" "}
                {factors.map((f, i) => (
                  <span key={f.prime}>
                    {i ? " × " : ""}
                    {Array(f.exponent).fill(f.prime).join(" × ")}
                  </span>
                ))}
              </p>
              <strong>= {factorizationText(factors)}</strong>
              <div className="td-factor-chips">
                {factors
                  .flatMap((f) => Array(f.exponent).fill(f.prime))
                  .map((f, i) => (
                    <b
                      key={`${f}-${i}`}
                      className={f === 5 ? "five" : f !== 2 ? "other" : ""}
                    >
                      {f}
                    </b>
                  ))}
                <aside>
                  Other prime factors <em>3</em>
                  <em>7</em>
                  <em>11</em>
                  <em>...</em>
                </aside>
              </div>
            </article>
          </div>
          <div className="td10041-bottomflow">
            <article className="td-predict">
              <h3>
                <b>4</b> Prediction
              </h3>
              <strong className={terminating ? "yes" : "no"}>
                {terminating ? "TERMINATES" : "RECURS"}
              </strong>
              <p>
                <Check />{" "}
                {terminating
                  ? "The denominator in lowest terms is 2ᵐ5ⁿ."
                  : `Contains ${otherFactors.map((f) => f.prime).join(", ")}.`}
              </p>
              <small>
                Rule: In lowest terms, p/q terminates iff q = 2ᵐ5ⁿ, otherwise it
                recurs.
              </small>
              <aside>
                ⚠ Testing the unsimplified denominator can give the wrong
                prediction.
              </aside>
            </article>
            <article className="td-verify">
              <h3>
                <b>5</b> Verify decimal
              </h3>
              <div className="td-verify-body">
                <strong>
                  <Fraction
                    n={analysis.reducedNumerator}
                    d={analysis.reducedDenominator}
                  />{" "}
                  = {analysis.decimalPlain}
                </strong>
                <span>{terminating ? "Terminating" : "Recurring"}</span>
                <DecimalPlaces digits={analysis.digits} />
              </div>
              <p>
                <Check />{" "}
                {terminating
                  ? `Terminates after ${analysis.digits.length} decimal places.`
                  : `Repeating block: ${analysis.repeatingDigits.join("")}`}
              </p>
            </article>
          </div>
          <footer className="td10041-rule">
            <Info />
            <b>Rule in words:</b> A rational number p/q (in lowest terms) has a
            terminating decimal expansion if and only if the denominator q has
            no prime factors other than 2 and 5.{" "}
            <span>Equivalently: q = 2ᵐ5ⁿ</span>
          </footer>
        </section>
        <section className="td10041-theory">
          <article>
            <h2>WHY IT WORKS</h2>
            <p>
              Powers of 2 give factors of 10 like 2 × 5; together 2ᵐ5ⁿ creates
              10ᵏ.
            </p>
            <p>
              So q = 2ᵐ5ⁿ ⇒ p/q can be written over an integer power of 10,
              which terminates.
            </p>
            <p>
              If q has any other prime factor, it cannot be absorbed into 10ᵏ,
              so the decimal repeats.
            </p>
          </article>
          <article>
            <h2>WORKED EXAMPLES</h2>
            <p>
              <b>Example 1:</b> 7/40 terminates
            </p>
            <p>40 = 2³ × 5¹ → only 2 and 5 → terminates.</p>
            <p>
              7/40 = 0.175 <em>Terminates</em>
            </p>
            <p>
              <b>Example 2:</b> 7/12 recurs
            </p>
            <p>12 = 2² × 3 → includes 3 → recurs.</p>
            <p>7/12 = 0.583333...</p>
          </article>
          <article>
            <h2>⚠ COMMON MISCONCEPTION</h2>
            <b>
              If you test the unsimplified denominator, you may get the wrong
              answer.
            </b>
            <p>Example: 18/75</p>
            <p>75 = 3 × 5² (has 3) → you may think it recurs.</p>
            <p>But 18/75 = 6/25, and 25 = 5² → it terminates.</p>
          </article>
        </section>
        <Challenge />
      </main>
      <nav className="td10041-adjacent">
        <Link to={previous}>
          <ArrowLeft />
          <span>
            <small>Previous</small>Decimal Expansion of Rational Numbers
          </span>
        </Link>
        <Link to={next}>
          <span>
            <small>Next</small>Rational and Irrational Classification
          </span>
          <ArrowRight />
        </Link>
      </nav>
    </section>
  );
}

function Fraction({ n, d }: { n: string | number; d: string | number }) {
  return (
    <span className="td-frac">
      <b>{n}</b>
      <b>{d}</b>
    </span>
  );
}
function DecimalPlaces({ digits }: { digits: number[] }) {
  return (
    <div className="td-places">
      {digits.slice(0, 3).map((d, i) => (
        <span key={i}>
          <small>{["Tenths", "Hundredths", "Thousandths"][i]}</small>
          <b>{d}</b>
        </span>
      ))}
      <em>0 0 ...</em>
    </div>
  );
}
function Challenge() {
  const a = analyzeDecimalExpansion(18, 75);
  return (
    <section className="td10041-challenge">
      <h2>⚑ MINI CHALLENGE</h2>
      <p>
        <b>Challenge:</b> Simplify 18/75, factor the denominator and predict its
        decimal type.
      </p>
      <div>
        <article>
          <h3>
            <b>1</b> Simplify
          </h3>
          <p>
            <Fraction n={18} d={75} /> = <Fraction n="18÷3" d="75÷3" /> ={" "}
            <Fraction n={6} d={25} />
          </p>
          <span>
            Lowest terms: 6/25 <Check />
          </span>
        </article>
        <i>→</i>
        <article>
          <h3>
            <b>2</b> Factor denominator
          </h3>
          <p>25 = 5 × 5 = 5²</p>
          <b className="chip">5</b>
          <b className="chip">5</b>
          <span>Only prime factor: 5</span>
        </article>
        <i>→</i>
        <article>
          <h3>
            <b>3</b> Predict
          </h3>
          <strong>TERMINATES</strong>
          <p>25 = 5² = 2⁰5²</p>
          <Check />
        </article>
        <i>→</i>
        <article>
          <h3>
            <b>4</b> Verify
          </h3>
          <p>
            <Fraction n={18} d={75} /> = <Fraction n={6} d={25} /> ={" "}
            {a.decimalPlain}
          </p>
          <span>
            Terminates after 2 decimal places. <Check />
          </span>
        </article>
      </div>
      <footer>
        Answer: 18/75 = 0.24 (terminating) <Check />
      </footer>
    </section>
  );
}
