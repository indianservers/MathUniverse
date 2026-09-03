import { RotateCcw, ShoppingCart } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { LessonAdapterProps } from "../../types";
import "./InflationTargetLesson600.css";
const cash = (v: number) =>
  new Intl.NumberFormat("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(v);
export default function InflationTargetLesson600({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [price, setPrice] = useState(2000),
    [rate, setRate] = useState(6),
    [years, setYears] = useState(8),
    [tab, setTab] = useState("Interact"),
    [graded, setGraded] = useState<boolean | null>(null),
    [solution, setSolution] = useState(false),
    [actions, setActions] = useState(0);
  const reset = () => {
    setPrice(2000);
    setRate(6);
    setYears(8);
    setTab("Interact");
    setGraded(null);
    setSolution(false);
    setActions(0);
  };
  useEffect(reset, [resetToken]);
  const act = (fn: () => void) => {
    fn();
    setActions((v) => v + 1);
    onInteraction();
  };
  const rows = useMemo(
      () =>
        Array.from({ length: years + 1 }, (_, year) => ({
          year,
          value: price * (1 + rate / 100) ** year,
        })),
      [price, rate, years],
    ),
    future = rows.at(-1)!.value,
    increase = future - price,
    challenge = 1500 * 1.07 ** 10,
    challengeReady = price === 1500 && rate === 7 && years === 10,
    x = (n: number) => 45 + (n / years) * 565,
    y = (v: number) => 235 - ((v - price) / Math.max(future - price, 1)) * 160;
  return (
    <section
      className="inf600-page"
      data-testid="finance-mockup-0657"
      data-object-model="dedicated-compound-inflation-purchasing-power-model"
      data-price={price}
      data-rate={rate}
      data-years={years}
      data-future={future.toFixed(2)}
      data-graded={graded === null ? "" : graded}
      data-solution={solution}
      data-actions={actions}
    >
      <header className="inf600-hero">
        <div className="inf600-icon">
          <ShoppingCart />
        </div>
        <main>
          <span>
            <b>DISCRETE AND APPLIED MATHEMATICS</b>
            <b>FINANCIAL MATHEMATICS AND MODELLING</b>
          </span>
          <h1>Inflation</h1>
          <p>Understand purchasing-power change.</p>
          <dl>
            <b>Level: Intermediate-Advanced</b>
            <b>Lab: Applied Modelling</b>
            <b>Time: 6-10 min</b>
            <b>Tags: Finance, Modelling</b>
          </dl>
          <aside>
            <b>Objective:</b> Model price rise over time using inflation and
            compare real vs nominal value.
          </aside>
        </main>
      </header>
      <nav className="inf600-tabs">
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
        <p className="inf600-note">
          <b>{tab}:</b> Inflation compounds because every new percentage rise
          applies to the latest price.
        </p>
      )}
      <section className="inf600-lab">
        <header>
          <div>
            <h2>1. Observe &amp; Manipulate</h2>
            <p>
              Adjust the controls to see how inflation changes the future basket
              price.
            </p>
          </div>
          <button onClick={() => act(reset)}>
            <RotateCcw /> Reset
          </button>
        </header>
        <div className="inf600-work">
          <aside>
            <Control
              label="Today's basket price (P₀)"
              value={price}
              min={500}
              max={10000}
              step={100}
              prefix="₹"
              onChange={(v) =>
                act(() => {
                  setPrice(v);
                  setGraded(null);
                })
              }
            />
            <Control
              label="Inflation rate (r)"
              value={rate}
              min={0}
              max={25}
              step={0.5}
              suffix="%"
              onChange={(v) =>
                act(() => {
                  setRate(v);
                  setGraded(null);
                })
              }
            />
            <Control
              label="Years (n)"
              value={years}
              min={1}
              max={20}
              step={1}
              suffix="years"
              onChange={(v) =>
                act(() => {
                  setYears(v);
                  setGraded(null);
                })
              }
            />
            <section>
              <h3>Live readout</h3>
              <p>
                Nominal future price (Pₙ)<b>₹{cash(future)}</b>
              </p>
              <p>
                Real value in today's ₹<b>₹{cash(price)}</b>
              </p>
              <p>
                Total increase<b>₹{cash(increase)}</b>
              </p>
              <p>
                Increase (%)<b>{((future / price - 1) * 100).toFixed(2)}%</b>
              </p>
            </section>
          </aside>
          <main>
            <div className="inf600-chart">
              <header>
                <h3>Future basket price over time</h3>
                <b>—● Nominal price (₹)</b>
              </header>
              <svg
                viewBox="0 0 650 270"
                role="img"
                aria-label="Inflation price growth graph"
              >
                <line x1="45" x2="620" y1="235" y2="235" />
                <line x1="45" x2="45" y1="40" y2="235" />
                <polyline
                  points={rows
                    .map((row) => `${x(row.year)},${y(row.value)}`)
                    .join(" ")}
                />
                {rows.map((row, index) => (
                  <g key={row.year}>
                    <circle
                      className={index === rows.length - 1 ? "last" : ""}
                      cx={x(row.year)}
                      cy={y(row.value)}
                      r="5"
                    />
                    <text x={x(row.year)} y={y(row.value) - 12}>
                      {cash(row.value)}
                    </text>
                    <text x={x(row.year)} y="255">
                      {row.year}
                    </text>
                  </g>
                ))}
              </svg>
              <h4>Nominal price each year</h4>
              <table>
                <tbody>
                  <tr>
                    {rows.map((row) => (
                      <th key={row.year}>{row.year}</th>
                    ))}
                  </tr>
                  <tr>
                    {rows.map((row) => (
                      <td key={row.year}>₹{cash(row.value)}</td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
            <section className="inf600-real">
              <h3>Real value comparison (in today's ₹)</h3>
              <p>What the future price is worth in today's rupees.</p>
              <b>₹{cash(price)}</b>
              <small>Constant over all years</small>
            </section>
          </main>
        </div>
      </section>
      <section className="inf600-theory">
        <article>
          <h3>2. Notice the pattern</h3>
          <p>✓ The price increases by the same percentage each year.</p>
          <p>✓ The amount added gets larger every year.</p>
          <p>✓ The real value stays constant.</p>
          <aside>Think: Is this a linear or exponential pattern?</aside>
        </article>
        <article>
          <h3>3. Understand the rule</h3>
          <p>
            <b>Compound growth rule for inflation</b>
          </p>
          <strong>Pₙ = P₀(1+r)ⁿ</strong>
          <p>
            Where,
            <br />
            P₀ = current price
            <br />r = inflation rate (decimal)
            <br />n = number of years
            <br />
            Pₙ = price after n years
          </p>
          <aside>
            <b>Common misconception</b>
            <br />
            Adding r × P₀ every year is incorrect. Inflation compounds on the
            new price.
          </aside>
        </article>
        <article>
          <h3>4. Worked Example</h3>
          <p>
            A basket costs <b>₹2,000</b> today. Inflation is 6% p.a. What will
            it cost after 8 years?
          </p>
          <strong>
            Pₙ = 2,000(1.06)⁸
            <br />= 2,000(1.593848)
            <br />= ₹3,187.70
          </strong>
          <p>
            <b>Real value in today's ₹ = ₹2,000.00</b>
          </p>
        </article>
      </section>
      <section className="inf600-challenge">
        <div>
          <h3>5. Try independently</h3>
          <p>
            <b>Challenge:</b> A basket costs ₹1,500 today. Inflation is 7% p.a.
            What will it cost after 10 years?
          </p>
          <small>
            Set the simulator to ₹1,500, 7%, and 10 years, then check.
          </small>
        </div>
        <div>
          <button
            onClick={() =>
              act(() =>
                setGraded(
                  challengeReady && Math.abs(future - challenge) < 0.02,
                ),
              )
            }
          >
            Check my answer
          </button>
          <button onClick={() => act(() => setSolution((v) => !v))}>
            Show solution
          </button>
        </div>
        <aside>
          Expected answer<b>₹{cash(challenge)}</b>
          {graded !== null && (
            <em className={graded ? "correct" : "wrong"}>
              {graded ? " Correct" : " Match the three challenge inputs."}
            </em>
          )}
          {solution && <small>1500(1.07)¹⁰</small>}
        </aside>
      </section>
      <nav className="inf600-adjacent">
        <a href="/lessons/discrete-and-applied-mathematics/599-depreciation">
          ←{" "}
          <span>
            Previous<b>Depreciation</b>
          </span>
        </a>
        <a href="/lessons/discrete-and-applied-mathematics/601-currency-conversion">
          <span>
            Next<b>Currency Conversion</b>
          </span>{" "}
          →
        </a>
      </nav>
    </section>
  );
}
function Control({
  label,
  value,
  min,
  max,
  step,
  prefix,
  suffix,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  prefix?: string;
  suffix?: string;
  onChange: (v: number) => void;
}) {
  return (
    <label className="inf600-control">
      <b>{label}</b>
      <span>
        {prefix}
        <input
          aria-label={label}
          type="number"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(+e.target.value)}
        />
        {suffix}
      </span>
      <input
        aria-label={`${label} slider`}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(+e.target.value)}
      />
      <small>
        {min}
        <i>{max.toLocaleString()}</i>
      </small>
    </label>
  );
}
