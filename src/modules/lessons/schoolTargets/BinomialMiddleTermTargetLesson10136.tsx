import { Check, RotateCcw, Star } from "lucide-react";
import { useState } from "react";
import type { SchoolSyllabusLesson } from "../syllabus/lessonSyllabusTypes";
import "./BinomialMiddleTermTargetLesson10136.css";

const factorial = (value: number) =>
  Array.from({ length: value }, (_, i) => i + 1).reduce((p, v) => p * v, 1);
const choose = (n: number, r: number) =>
  Math.round(factorial(n) / (factorial(r) * factorial(n - r)));
const sup = (value: number) =>
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
const term = (n: number, r: number) =>
  `${choose(n, r) === 1 ? "" : choose(n, r)}${n - r ? `x${n - r === 1 ? "" : sup(n - r)}` : ""}${r ? `y${r === 1 ? "" : sup(r)}` : ""}` ||
  "1";

function TermStrip({ n, compact = false }: { n: number; compact?: boolean }) {
  const middle = n % 2 === 0 ? [n / 2] : [(n - 1) / 2, (n + 1) / 2];
  return (
    <div className={compact ? "mt10136-strip compact" : "mt10136-strip"}>
      {Array.from({ length: n + 1 }, (_, r) => (
        <article className={middle.includes(r) ? "middle" : ""} key={r}>
          <b>T{r + 1}</b>
          <span>{choose(n, r)}</span>
          <strong>{term(n, r)}</strong>
          {!compact && middle.includes(r) && <small>Middle term</small>}
        </article>
      ))}
    </div>
  );
}

export default function BinomialMiddleTermTargetLesson10136({
  lesson: _lesson,
}: {
  lesson: SchoolSyllabusLesson;
}) {
  const [n, setN] = useState(6);
  const [board, setBoard] = useState(false);
  const [actions, setActions] = useState(0);
  const even = n % 2 === 0;
  const positions = even ? [n / 2 + 1] : [(n + 1) / 2, (n + 3) / 2];
  const indices = positions.map((value) => value - 1);
  const coefficients = Array.from({ length: n + 1 }, (_, r) => choose(n, r));
  const act = () => setActions((value) => value + 1);
  const reset = () => {
    setN(6);
    setBoard(false);
    act();
  };
  return (
    <section
      className="mt10136-page"
      data-testid="school-mockup-0810"
      data-object-model="dedicated-binomial-middle-parity-engine"
      data-n={n}
      data-term-count={n + 1}
      data-parity={even ? "even" : "odd"}
      data-middle-count={positions.length}
      data-middle-positions={positions.join(",")}
      data-middle-coefficients={indices.map((r) => choose(n, r)).join(",")}
      data-board={String(board)}
      data-actions={actions}
    >
      <header>
        <div>
          <small>CLASS 11 · BINOMIAL THEOREM</small>
          <h1>Middle Term</h1>
          <p>Find the middle term(s) in the expansion of (x+y)ⁿ.</p>
          <p>
            Use the center-finder to see the term strip, Pascal row, and exact
            counting.
          </p>
          <div>
            <span>18 min</span>
            <span>ADVANCED</span>
            <span>CONCEPT</span>
            <span>learning</span>
          </div>
        </div>
        <section>
          <h2>Center-finder</h2>
          <label>
            Choose n (number of terms = n+1){" "}
            <strong>
              n ={" "}
              <input
                aria-label="Center finder n number"
                type="number"
                min="1"
                max="10"
                value={n}
                onChange={(event) => {
                  setN(Math.max(1, Math.min(10, Number(event.target.value))));
                  act();
                }}
              />
            </strong>
            <input
              aria-label="Middle term exponent n"
              type="range"
              min="1"
              max="10"
              value={n}
              onChange={(event) => {
                setN(Number(event.target.value));
                act();
              }}
            />
          </label>
          <footer>
            Terms in expansion: <b>{n + 1}</b>
            <span>n is {even ? "even" : "odd"}</span>
          </footer>
        </section>
        <aside>
          <button onClick={reset}>
            <RotateCcw /> Reset
          </button>
          <h2>How it works</h2>
          <p>
            • Even n → one middle term T<sub>n/2+1</sub>
          </p>
          <p>• Odd n → two middle terms</p>
          <p>• Total terms = n + 1</p>
        </aside>
      </header>
      <main>
        <section className="mt10136-top">
          <article>
            <h2>n + 1 TERM STRIP</h2>
            <TermStrip n={n} />
            <p>
              Center position{positions.length > 1 ? "s" : ""}:{" "}
              <b>{positions.join(" and ")}</b>
            </p>
          </article>
          <aside>
            <h2>PASCAL ROW (n = {n})</h2>
            <div>
              {coefficients.map((value, r) => (
                <span className={indices.includes(r) ? "middle" : ""} key={r}>
                  {value}
                </span>
              ))}
            </div>
            <p>
              Row index {n} &nbsp;&nbsp; Coefficients from Pascal's triangle
            </p>
          </aside>
        </section>
        <section className="mt10136-lower">
          <div>
            <h2>EXAMPLES</h2>
            <section>
              <article>
                <h3>Even n (one middle term)</h3>
                <p>(x+y)⁶</p>
                <p>n=6 → one middle at position 4</p>
                <TermStrip n={6} compact />
                <strong>T4 = C(6,3)x³y³ = 20x³y³</strong>
              </article>
              <article>
                <h3>Odd n (two middle terms)</h3>
                <p>(x+y)⁵</p>
                <p>n=5 → middle terms at positions 3 and 4</p>
                <TermStrip n={5} compact />
                <strong>T3 = 10x³y² &nbsp;&nbsp; T4 = 10x²y³</strong>
              </article>
            </section>
          </div>
          <aside>
            <article>
              <h2>KEY FACTS</h2>
              <p>
                <Check /> Total terms in (x+y)ⁿ = n+1.
              </p>
              <p>
                <Check /> If n is even: one middle term.
              </p>
              <p>
                <Check /> If n is odd: two middle terms.
              </p>
              <p>
                <Check /> Coefficients come from Pascal's triangle.
              </p>
            </article>
            <article>
              <h2>SYMBOL GUIDE</h2>
              <p>Tᵣ &nbsp; r-th term</p>
              <p>n &nbsp; Power in (x+y)ⁿ</p>
              <p>C(n,r) &nbsp; Binomial coefficient</p>
            </article>
          </aside>
        </section>
        {board && (
          <section className="mt10136-board">
            <h2>Board-style steps</h2>
            <ol>
              <li>Count n+1 terms: {n + 1}.</li>
              <li>
                {even
                  ? `Because n is even, choose position n/2+1=${positions[0]}.`
                  : `Because n is odd, choose positions ${(n + 1) / 2} and ${(n + 3) / 2}.`}
              </li>
              <li>
                Read coefficient{indices.length > 1 ? "s" : ""}{" "}
                {indices.map((r) => choose(n, r)).join(" and ")} from Pascal row{" "}
                {n}.
              </li>
              <li>
                Middle term{indices.length > 1 ? "s are" : " is"}{" "}
                {indices.map((r) => term(n, r)).join(" and ")}.
              </li>
            </ol>
          </section>
        )}
        <footer>
          <Star />
          <div>
            <h2>Best classroom move</h2>
            <p>
              Change n, observe the strip, and predict the middle term(s) before
              checking the result.
            </p>
          </div>
          <button
            onClick={() => {
              setBoard((value) => !value);
              act();
            }}
          >
            {board ? "Hide" : "Show"} board-style steps
          </button>
        </footer>
      </main>
    </section>
  );
}
