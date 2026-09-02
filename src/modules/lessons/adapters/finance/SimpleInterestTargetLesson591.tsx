import { Check, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { LessonAdapterProps } from "../../types";
import "./SimpleInterestTargetLesson591.css";
const money = (value: number) =>
  new Intl.NumberFormat("en-IN", { maximumFractionDigits: 2 }).format(value);
export default function SimpleInterestTargetLesson591({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [p, setP] = useState(10000),
    [rate, setRate] = useState(6),
    [time, setTime] = useState(5),
    [tab, setTab] = useState("Interact"),
    [interestAnswer, setInterestAnswer] = useState(""),
    [amountAnswer, setAmountAnswer] = useState(""),
    [graded, setGraded] = useState<boolean | null>(null),
    [actions, setActions] = useState(0);
  const reset = () => {
    setP(10000);
    setRate(6);
    setTime(5);
    setTab("Interact");
    setInterestAnswer("");
    setAmountAnswer("");
    setGraded(null);
    setActions(0);
  };
  useEffect(reset, [resetToken]);
  const annual = (p * rate) / 100,
    interest = annual * time,
    amount = p + interest,
    years = useMemo(
      () =>
        Array.from({ length: Math.floor(time) + 1 }, (_, year) => ({
          year,
          interest: annual * year,
          amount: p + annual * year,
        })),
      [p, annual, time],
    ),
    max = Math.ceil(Math.max(amount, p) / 2000) * 2000,
    px = (year: number) => 70 + (year / Math.max(1, time)) * 430,
    py = (value: number) => 300 - (value / max) * 240,
    act = (fn: () => void) => {
      fn();
      setActions((n) => n + 1);
      onInteraction();
    },
    change = (setter: (n: number) => void, value: number) =>
      act(() => setter(Number.isFinite(value) ? value : 0)),
    check = () =>
      act(() =>
        setGraded(
          Number(interestAnswer.replace(/,/g, "")) === 9000 &&
            Number(amountAnswer.replace(/,/g, "")) === 34000,
        ),
      );
  return (
    <section
      className="si591-page"
      data-testid="finance-mockup-0648"
      data-object-model="dedicated-linear-simple-interest-model"
      data-principal={p}
      data-rate={rate}
      data-time={time}
      data-interest={interest}
      data-amount={amount}
      data-annual={annual}
      data-graded={graded === null ? "" : graded}
      data-actions={actions}
    >
      <header className="si591-hero">
        <span>
          <b>DISCRETE AND APPLIED MATHEMATICS</b>
          <b>FINANCIAL MATHEMATICS AND MODELLING</b>
        </span>
        <h1>591 Simple Interest</h1>
        <p>Model linear accumulation.</p>
        <dl>
          <strong>Level: Intermediate-Advanced</strong>
          <strong>Topic: Simple Interest</strong>
          <strong>Model: Linear (no compounding)</strong>
          <strong>Time: 6-10 min</strong>
        </dl>
        <p>
          <b>Objective:</b> Model simple interest using I=Prt and A=P(1+rt),
          observe linear growth, and solve real-world problems.
        </p>
      </header>
      <nav className="si591-tabs">
        {["Interact", "Learn", "Worked Example", "Formula", "Practice"].map(
          (name) => (
            <button
              key={name}
              className={tab === name ? "active" : ""}
              onClick={() => act(() => setTab(name))}
            >
              {name}
            </button>
          ),
        )}
      </nav>
      {tab !== "Interact" && (
        <p className="si591-note">
          <b>{tab}:</b> Simple interest grows by the constant amount Pr each
          year.
        </p>
      )}
      <section className="si591-lab">
        <header>
          <h2>1. Observe &amp; Manipulate</h2>
          <p>
            Adjust the controls to see how simple interest grows linearly with
            time.
          </p>
        </header>
        <div>
          <main>
            <h2>Simple Interest Timeline</h2>
            <p>Interest grows by equal amounts each year.</p>
            <div className="legend">
              <span>Amount A</span>
              <span>Principal P</span>
              <span>Interest I</span>
            </div>
            <svg
              viewBox="0 0 540 340"
              role="img"
              aria-label={`Simple interest timeline ending at amount ${amount}`}
            >
              <g className="grid">
                {[0, 4000, 8000, 12000]
                  .filter((value) => value <= max)
                  .map((value) => (
                    <g key={value}>
                      <line x1="60" y1={py(value)} x2="510" y2={py(value)} />
                      <text x="42" y={py(value) + 3}>
                        {money(value)}
                      </text>
                    </g>
                  ))}
              </g>
              <line className="axis" x1="60" y1="300" x2="510" y2="300" />
              <line className="axis" x1="60" y1="300" x2="60" y2="45" />
              <line
                className="principal"
                x1="70"
                y1={py(p)}
                x2="500"
                y2={py(p)}
              />
              <polyline
                className="amount"
                points={years
                  .map((row) => `${px(row.year)},${py(row.amount)}`)
                  .join(" ")}
              />
              <polyline
                className="interest"
                points={years
                  .map((row) => `${px(row.year)},${py(row.interest)}`)
                  .join(" ")}
              />
              {years.map((row) => (
                <g key={row.year}>
                  <circle
                    className="amount-dot"
                    cx={px(row.year)}
                    cy={py(row.amount)}
                    r="4"
                  />
                  <circle
                    className="interest-dot"
                    cx={px(row.year)}
                    cy={py(row.interest)}
                    r="4"
                  />
                  <text x={px(row.year)} y="320">
                    {row.year}
                  </text>
                  <text
                    className="amount-label"
                    x={px(row.year)}
                    y={py(row.amount) - 10}
                  >
                    {money(row.amount)}
                  </text>
                  <text
                    className="interest-label"
                    x={px(row.year)}
                    y={py(row.interest) - 9}
                  >
                    {money(row.interest)}
                  </text>
                </g>
              ))}
              <text className="axis-title" x="285" y="338">
                Time (years)
              </text>
              <text className="axis-title" x="37" y="34">
                Amount (₹)
              </text>
            </svg>
            <h3>Values at each year</h3>
            <table>
              <thead>
                <tr>
                  <th>Year (t)</th>
                  <th>Interest I=Prt (₹)</th>
                  <th>Amount A=P(1+rt) (₹)</th>
                </tr>
              </thead>
              <tbody>
                {years.map((row) => (
                  <tr key={row.year}>
                    <td>{row.year}</td>
                    <td>{money(row.interest)}</td>
                    <td>
                      <b>{money(row.amount)}</b>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <footer>
              <Check /> Interest increases by a constant ₹{money(annual)} each
              year (linear growth).
            </footer>
          </main>
          <aside>
            <h2>Controls</h2>
            <p>Adjust and observe changes instantly.</p>
            <label>
              Principal (P)
              <span>
                ₹
                <input
                  aria-label="Simple interest principal"
                  type="number"
                  min="1000"
                  max="100000"
                  value={p}
                  onChange={(e) => change(setP, Number(e.target.value))}
                />
              </span>
              <input
                aria-label="Principal slider"
                type="range"
                min="1000"
                max="100000"
                step="1000"
                value={p}
                onChange={(e) => change(setP, Number(e.target.value))}
              />
              <small>
                1,000 <i /> 1,00,000
              </small>
            </label>
            <label>
              Annual Rate (r)
              <span>
                %
                <input
                  aria-label="Simple interest annual rate"
                  type="number"
                  min="0"
                  max="20"
                  step=".5"
                  value={rate}
                  onChange={(e) => change(setRate, Number(e.target.value))}
                />
              </span>
              <input
                aria-label="Rate slider"
                type="range"
                min="0"
                max="20"
                step=".5"
                value={rate}
                onChange={(e) => change(setRate, Number(e.target.value))}
              />
              <small>
                0% <i /> 20%
              </small>
            </label>
            <label>
              Time (t)
              <span>
                years
                <input
                  aria-label="Simple interest time"
                  type="number"
                  min="0"
                  max="20"
                  value={time}
                  onChange={(e) => change(setTime, Number(e.target.value))}
                />
              </span>
              <input
                aria-label="Time slider"
                type="range"
                min="0"
                max="20"
                step="1"
                value={time}
                onChange={(e) => change(setTime, Number(e.target.value))}
              />
              <small>
                0 <i /> 20
              </small>
            </label>
            <h3>Live Readouts</h3>
            <output>
              <small>
                Interest
                <br />
                I=Prt
              </small>
              <b>₹ {money(interest)}</b>
            </output>
            <output>
              <small>
                Amount
                <br />
                A=P(1+rt)
              </small>
              <b>₹ {money(amount)}</b>
            </output>
            <output>
              <small>
                Interest per year
                <br />
                Pr
              </small>
              <b>₹ {money(annual)}</b>
            </output>
            <article>
              <b>Definition</b>
              <p>
                Simple interest is calculated only on the principal amount, not
                on previous interest.
              </p>
            </article>
          </aside>
        </div>
      </section>
      <section className="si591-theory">
        <article>
          <h2>
            2. Worked Example <span>Correct Solution</span>
          </h2>
          <p>
            Riya invests ₹15,000 at 8% p.a. simple interest for 3 years. Find
            the total interest and amount.
          </p>
          <p>
            <b>Interest:</b> 15,000 × 0.08 × 3 = ₹3,600
          </p>
          <p>
            <b>Amount:</b> 15,000 + 3,600 = ₹18,600
          </p>
          <strong>Total interest = ₹3,600, Amount = ₹18,600</strong>
        </article>
        <article>
          <h2>3. The Key Rule</h2>
          <b>Simple Interest Formula</b>
          <strong>I=Prt &nbsp; and &nbsp; A=P(1+rt)</strong>
          <p>
            P=principal, r=annual decimal rate, t=years, I=interest, A=amount
          </p>
        </article>
        <article className="mistake">
          <h2>Common Mistake</h2>
          <p>
            <b>Mistake:</b> Using the rate as a percent instead of a decimal.
          </p>
          <p>
            I=10,000×6×3=180,000 <X />
          </p>
          <p>
            I=10,000×0.06×3=1,800 <Check />
          </p>
        </article>
      </section>
      <section className="si591-practice">
        <div>
          <h2>5. Try It (Challenge)</h2>
          <p>Solve independently. Check your answer to verify.</p>
          <article>
            Neha deposits ₹25,000 at 9% p.a. simple interest for 4 years. Find
            the total interest and the amount at the end.
          </article>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            check();
          }}
        >
          <label>
            Interest (₹)
            <input
              aria-label="Simple interest challenge interest"
              value={interestAnswer}
              onChange={(e) => setInterestAnswer(e.target.value)}
              placeholder="Type your answer"
            />
          </label>
          <label>
            Amount (₹)
            <input
              aria-label="Simple interest challenge amount"
              value={amountAnswer}
              onChange={(e) => setAmountAnswer(e.target.value)}
              placeholder="Type your answer"
            />
          </label>
          <button>
            <Check /> Check Answer
          </button>
          <output
            className={graded ? "correct" : graded === false ? "wrong" : ""}
          >
            {graded === null
              ? ""
              : graded
                ? "Correct: ₹9,000 interest and ₹34,000 amount."
                : "Recalculate I=Prt, then add P."}
          </output>
        </form>
      </section>
      <nav className="si591-adjacent">
        <a href="/lessons/discrete-and-applied-mathematics/590-proof-methods">
          ←{" "}
          <span>
            Previous<b>590 Proof Methods</b>
          </span>
        </a>
        <a href="/lessons/discrete-and-applied-mathematics/592-compound-interest">
          <span>
            Next<b>592 Compound Interest</b>
          </span>{" "}
          →
        </a>
      </nav>
    </section>
  );
}
