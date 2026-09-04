import {
  Check,
  Info,
  Lightbulb,
  RefreshCw,
  RotateCcw,
  ShieldCheck,
  TriangleAlert,
} from "lucide-react";
import { useState } from "react";
import type { SchoolSyllabusLesson } from "../syllabus/lessonSyllabusTypes";
import "./BinomialGeneralTermTargetLesson10135.css";

const factorial = (value: number) =>
  Array.from({ length: value }, (_, index) => index + 1).reduce(
    (product, item) => product * item,
    1,
  );
const choose = (n: number, r: number) =>
  Math.round(factorial(n) / (factorial(r) * factorial(n - r)));
const superNumber = (value: number) =>
  String(value)
    .replace(/0/g, "⁰")
    .replace(/1/g, "¹")
    .replace(/2/g, "²")
    .replace(/3/g, "³")
    .replace(/4/g, "⁴")
    .replace(/5/g, "⁵")
    .replace(/6/g, "⁶")
    .replace(/7/g, "⁷")
    .replace(/8/g, "⁸")
    .replace(/9/g, "⁹");
const compactTerm = (coefficient: number, aPower: number, bPower: number) =>
  `${coefficient === 1 ? "" : coefficient}${aPower ? `a${aPower === 1 ? "" : superNumber(aPower)}` : ""}${bPower ? `b${bPower === 1 ? "" : superNumber(bPower)}` : ""}` ||
  "1";

export default function BinomialGeneralTermTargetLesson10135({
  lesson: _lesson,
}: {
  lesson: SchoolSyllabusLesson;
}) {
  const [n, setN] = useState(7);
  const [k, setK] = useState(4);
  const [exampleIndex, setExampleIndex] = useState(0);
  const [actions, setActions] = useState(0);
  const r = k - 1;
  const coefficient = choose(n, r);
  const aPower = n - r;
  const bPower = r;
  const term = compactTerm(coefficient, aPower, bPower);
  const balanced = aPower + bPower === n;
  const terms = Array.from({ length: n + 1 }, (_, index) => ({
    r: index,
    k: index + 1,
    coefficient: choose(n, index),
    aPower: n - index,
    bPower: index,
  }));
  const act = () => setActions((value) => value + 1);
  const updateN = (value: number) => {
    const next = Math.max(1, Math.min(10, value));
    setN(next);
    setK((current) => Math.min(current, next + 1));
    act();
  };
  const updateK = (value: number) => {
    setK(Math.max(1, Math.min(n + 1, value)));
    act();
  };
  const reset = () => {
    setN(7);
    setK(4);
    setExampleIndex(0);
    act();
  };
  const newExample = () => {
    const examples = [
      [5, 3],
      [8, 6],
      [6, 2],
    ];
    const next = exampleIndex % examples.length;
    setExampleIndex((exampleIndex + 1) % examples.length);
    setN(examples[next][0]);
    setK(examples[next][1]);
    act();
  };

  return (
    <section
      className="gt10135-page"
      data-testid="school-mockup-0809"
      data-object-model="dedicated-binomial-general-term-locator-engine"
      data-n={n}
      data-k={k}
      data-r={r}
      data-coefficient={coefficient}
      data-power-a={aPower}
      data-power-b={bPower}
      data-term={term}
      data-balanced={String(balanced)}
      data-actions={actions}
    >
      <header>
        <div>
          <small>◉ CLASS 11 · BINOMIAL THEOREM</small>
          <h1>General Term</h1>
          <p>
            Locate any term of (a+b)ⁿ without expanding blindly. The requested
            term number k maps to the formula index r=k−1.
          </p>
          <div>
            <span>18 min</span>
            <span>ADVANCED</span>
            <span>CONCEPT</span>
            <span>learning</span>
          </div>
        </div>
        <button onClick={reset}>
          <RotateCcw /> Reset lab
        </button>
      </header>
      <main>
        <h2>≠ &nbsp; TERM LOCATOR FOR &nbsp; (a+b)ⁿ</h2>
        <section className="gt10135-controls">
          <label>
            Power n{" "}
            <span>
              <button
                aria-label="Decrease power"
                onClick={() => updateN(n - 1)}
              >
                −
              </button>
              <input
                aria-label="Binomial power n"
                type="number"
                min="1"
                max="10"
                value={n}
                onChange={(event) => updateN(Number(event.target.value))}
              />
              <button
                aria-label="Increase power"
                onClick={() => updateN(n + 1)}
              >
                +
              </button>
            </span>
          </label>
          <label>
            Requested term (k) <Info />
            <span>
              <button
                aria-label="Previous requested term"
                onClick={() => updateK(k - 1)}
              >
                −
              </button>
              <input
                aria-label="Requested term k"
                type="number"
                min="1"
                max={n + 1}
                value={k}
                onChange={(event) => updateK(Number(event.target.value))}
              />
              <button
                aria-label="Next requested term"
                onClick={() => updateK(k + 1)}
              >
                +
              </button>
            </span>
          </label>
          <p>
            We will highlight <b>r = k − 1 = {r}</b> in the expansion.
          </p>
          <button onClick={newExample}>
            <RefreshCw /> New example
          </button>
        </section>
        <section className="gt10135-expansion">
          <h3>Full expansion of (a+b){superNumber(n)}</h3>
          <div>
            {terms.map((item) => (
              <button
                key={item.r}
                className={item.r === r ? "active" : ""}
                onClick={() => updateK(item.k)}
              >
                <small>r = {item.r}</small>
                <b>T{item.k}</b>
                <span>
                  C({n},{item.r}) a{superNumber(item.aPower)}b
                  {superNumber(item.bPower)}
                </span>
                <strong>
                  {compactTerm(item.coefficient, item.aPower, item.bPower)}
                </strong>
              </button>
            ))}
          </div>
        </section>
        <section className="gt10135-analysis">
          <article>
            <h3>General Term Formula</h3>
            <strong>Tᵣ₊₁ = C(n,r) aⁿ⁻ʳ bʳ</strong>
            <p>n = {n}</p>
            <p>
              k = {k} &nbsp; → &nbsp; r = k − 1 = {r}
            </p>
            <p>
              aⁿ⁻ʳ = a{superNumber(n)}⁻{superNumber(r)} = a{superNumber(aPower)}
            </p>
            <p>bʳ = b{superNumber(bPower)}</p>
          </article>
          <article>
            <h3>
              Coefficient C({n},{r})
            </h3>
            <strong>
              C({n},{r}) = {n}! / {r}!({n}−{r})!
            </strong>
            <p>
              = {factorial(n)} / ({factorial(r)} × {factorial(n - r)})
            </p>
            <b>= {coefficient}</b>
          </article>
          <article>
            <h3>Selected Term (k = {k})</h3>
            <strong>
              T{k} = C({n},{r}) a{superNumber(aPower)}b{superNumber(bPower)}
            </strong>
            <p>
              = <b>{term}</b>
            </p>
            <span>
              Term number k = {k} &nbsp; (index r = {r})
            </span>
          </article>
          <aside>
            <h3>
              <TriangleAlert /> Off-by-one Warning
            </h3>
            <p>
              Term number is <b>k</b>.<br />
              Index in the formula is <b>r</b>.
            </p>
            <strong>r = k − 1</strong>
            <p>
              Here: k = {k} but r = {r}.<br />
              Do not use r = k.
            </p>
          </aside>
        </section>
        <section className="gt10135-bottom">
          <article>
            <ShieldCheck />
            <div>
              <h3>Balance Check</h3>
              <p>Exponent of a + exponent of b = n:</p>
            </div>
            <strong>
              {aPower} + {bPower} = {n} = n
            </strong>
            <b>
              <Check /> {balanced ? "Balanced" : "Not balanced"}
            </b>
          </article>
          <article>
            <Lightbulb />
            <div>
              <h3>Quick Tip</h3>
              <p>
                The (k)th term from the start is always T{k}, while its
                coefficient index is {r}.
              </p>
            </div>
          </article>
        </section>
      </main>
      <footer>
        <span>← Binomial Expansion</span>
        <span>Middle Term →</span>
      </footer>
    </section>
  );
}
