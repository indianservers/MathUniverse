import { useEffect, useState } from "react";
import type { LessonAdapterProps } from "../../types";
import "./FutureValueTargetLesson595.css";

const cash = (value: number) =>
  new Intl.NumberFormat("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
const compounding = { Annually: 1, Quarterly: 4, Monthly: 12 } as const;

export default function FutureValueTargetLesson595({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [principal, setPrincipal] = useState(15000),
    [rate, setRate] = useState(7),
    [periods, setPeriods] = useState(8),
    [frequency, setFrequency] = useState<keyof typeof compounding>("Annually"),
    [tab, setTab] = useState("Interact"),
    [actions, setActions] = useState(0);
  const reset = () => {
    setPrincipal(15000);
    setRate(7);
    setPeriods(8);
    setFrequency("Annually");
    setTab("Interact");
    setActions(0);
  };
  useEffect(reset, [resetToken]);
  const act = (fn: () => void) => {
    fn();
    setActions((v) => v + 1);
    onInteraction();
  };
  const m = compounding[frequency],
    amountAt = (year: number) => principal * (1 + rate / 100 / m) ** (m * year),
    future = amountAt(periods),
    interest = future - principal,
    target = 30000,
    gap = Math.max(0, target - future),
    reached = future >= target;
  const rows = Array.from({ length: Math.floor(periods) + 1 }, (_, period) => ({
    period,
    amount: amountAt(period),
  }));
  const max = Math.ceil((Math.max(target, future) * 1.12) / 10000) * 10000,
    x = (p: number) => 55 + (p / Math.max(1, periods)) * 500,
    y = (v: number) => 285 - (v / max) * 235;
  return (
    <section
      className="fv595-page"
      data-testid="finance-mockup-0652"
      data-object-model="dedicated-compounded-future-value-goal-model"
      data-principal={principal}
      data-rate={rate}
      data-periods={periods}
      data-frequency={frequency}
      data-future={future.toFixed(2)}
      data-interest={interest.toFixed(2)}
      data-reached={reached}
      data-actions={actions}
    >
      <header className="fv595-hero">
        <main>
          <span>
            <b>DISCRETE AND APPLIED MATHEMATICS</b>
            <b>FINANCIAL MATHEMATICS AND MODELLING</b>
          </span>
          <h1>595. Future Value</h1>
          <p>Accumulate current values.</p>
          <dl>
            <b>Level: Intermediate-Advanced</b>
            <b>Time: 6-10 min</b>
            <b>Lab Type: Applied Modelling</b>
          </dl>
          <p>
            <strong>Objective:</strong> Move today’s amount forward with a
            growth factor to find the future value.
          </p>
        </main>
        <aside>
          <b>Goal target</b>
          <small>Target FV</small>
          <strong>₹30,000</strong>
          <hr />
          <small>You are here</small>
          <b>₹{cash(future)}</b>
          <progress value={Math.min(future, target)} max={target} />
        </aside>
      </header>
      <nav className="fv595-tabs">
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
        <p className="fv595-note">
          <b>{tab}:</b> Future value repeatedly multiplies the current balance
          by the periodic growth factor.
        </p>
      )}
      <section className="fv595-lab">
        <header>
          <h2>1. OBSERVE &amp; MANIPULATE</h2>
          <p>
            Adjust the controls to see how money grows over time with compound
            interest.
          </p>
        </header>
        <div>
          <aside className="fv595-controls">
            <Control
              label="Present deposit (PV)"
              value={principal}
              min={100}
              max={1000000}
              step={100}
              prefix="₹"
              onChange={(v) => act(() => setPrincipal(v))}
            />
            <Control
              label="Annual rate (r)"
              value={rate}
              min={0}
              max={25}
              step={0.5}
              suffix="%"
              onChange={(v) => act(() => setRate(v))}
            />
            <label>
              <b>Compounding</b>
              <select
                aria-label="Compounding frequency"
                value={frequency}
                onChange={(e) =>
                  act(() =>
                    setFrequency(e.target.value as keyof typeof compounding),
                  )
                }
              >
                {Object.keys(compounding).map((name) => (
                  <option key={name}>{name}</option>
                ))}
              </select>
            </label>
            <Control
              label="Number of periods (n)"
              value={periods}
              min={1}
              max={20}
              step={1}
              onChange={(v) => act(() => setPeriods(v))}
            />
            <section>
              <h3>Live readout</h3>
              <p>
                Growth factor <b>{(1 + rate / 100 / m).toFixed(6)}</b>
              </p>
              <p>
                Interest earned <b>₹{cash(interest)}</b>
              </p>
              <p>
                Future value (FV) <b>₹{cash(future)}</b>
              </p>
            </section>
          </aside>
          <main className="fv595-chart">
            <h2>Future Value Growth Timeline</h2>
            <div className="fv595-legend">
              <span>━ Future Value (FV)</span>
              <span>● End of period</span>
              <span>- - Goal target</span>
            </div>
            <strong>FV = ₹{cash(future)}</strong>
            <small>at the end of year {periods}</small>
            <svg
              viewBox="0 0 610 330"
              role="img"
              aria-label="Future value growth timeline"
            >
              {[0, 0.25, 0.5, 0.75, 1].map((part) => (
                <g key={part}>
                  <line
                    x1="50"
                    x2="575"
                    y1={285 - part * 235}
                    y2={285 - part * 235}
                  />
                  <text x="40" y={289 - part * 235}>
                    {Math.round((max * part) / 1000)}K
                  </text>
                </g>
              ))}
              <line
                className="goal"
                x1="50"
                x2="575"
                y1={y(target)}
                y2={y(target)}
              />
              <text className="goal-label" x="570" y={y(target) - 8}>
                Goal: ₹30,000
              </text>
              <polyline
                points={rows
                  .map((r) => `${x(r.period)},${y(r.amount)}`)
                  .join(" ")}
              />
              {rows.map((r) => (
                <g key={r.period}>
                  <circle cx={x(r.period)} cy={y(r.amount)} r="5" />
                  <text className="amount" x={x(r.period)} y={y(r.amount) - 12}>
                    {Math.round(r.amount).toLocaleString("en-IN")}
                  </text>
                  <text x={x(r.period)} y="306">
                    {r.period}
                  </text>
                </g>
              ))}
            </svg>
            <div className="fv595-factors">
              {rows.slice(1).map((r) => (
                <b key={r.period}>× {(1 + rate / 100 / m).toFixed(3)}</b>
              ))}
            </div>
            <table>
              <tbody>
                <tr>
                  <th>End of period n</th>
                  {rows.map((r) => (
                    <td key={r.period}>{r.period}</td>
                  ))}
                </tr>
                <tr>
                  <th>Amount (₹)</th>
                  {rows.map((r) => (
                    <td key={r.period}>
                      {Math.round(r.amount).toLocaleString("en-IN")}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </main>
        </div>
      </section>
      <section className="fv595-theory">
        <article>
          <h3>2. NOTICE THE PATTERN</h3>
          <p>
            With a constant rate, each period multiplies by the same factor.
          </p>
          <strong>
            Common ratio (1+r)<b>{(1 + rate / 100).toFixed(2)}</b>
          </strong>
          <p>✓ Amounts grow by a fixed percentage.</p>
          <p>✓ The growth factor multiplies every period.</p>
          <p>✓ Compounding builds growth over time.</p>
        </article>
        <article>
          <h3>3. UNDERSTAND THE RULE</h3>
          <p>Compounded Future Value formula.</p>
          <strong>
            FV = PV(1+r)<sup>n</sup>
          </strong>
          <p>
            FV = Future Value
            <br />
            PV = Present Value
            <br />r = annual decimal rate
            <br />n = periods
          </p>
          <aside>Common misconception: do not use PV(1+r×n).</aside>
        </article>
        <article>
          <h3>4. WORKED EXAMPLE</h3>
          <p>PV=₹15,000, r=7% per year, n=8 years.</p>
          <strong>
            FV=15,000(1.07)<sup>8</sup>
          </strong>
          <b>= ₹25,772.79</b>
          <hr />
          <p>Interest earned = FV-PV = ₹10,772.79</p>
        </article>
      </section>
      <section className="fv595-practice">
        <header>
          <h3>5. TRY INDEPENDENTLY</h3>
          <p>Challenge: Can you reach the goal?</p>
        </header>
        <div>
          <article>
            <b>Your challenge</b>
            <p>Make the FV at least</p>
            <strong>₹30,000</strong>
            <small>Adjust the controls on the left.</small>
          </article>
          <article>
            <b>Your result</b>
            <p>Future Value</p>
            <strong>₹{cash(future)}</strong>
            <p>Gap to goal</p>
            <b>₹{cash(gap)}</b>
          </article>
          <article>
            <b>Quick check (try these)</b>
            <span>
              <button
                onClick={() => act(() => setPeriods(Math.min(20, periods + 1)))}
              >
                + Time
              </button>
              <button
                onClick={() => act(() => setRate(Math.min(25, rate + 1)))}
              >
                + Rate
              </button>
              <button onClick={() => act(() => setPrincipal(principal + 3000))}>
                + Deposit
              </button>
            </span>
          </article>
          <article className={reached ? "reached" : "waiting"}>
            <b>{reached ? "Goal reached" : "Not there yet"}</b>
            <p>
              {reached
                ? "Excellent. Your future value meets the target."
                : "Almost! Keep adjusting to hit the goal."}
            </p>
          </article>
        </div>
      </section>
      <nav className="fv595-adjacent">
        <a href="/lessons/discrete-and-applied-mathematics/594-present-value">
          ←{" "}
          <span>
            PREVIOUS<b>Present Value</b>
          </span>
        </a>
        <a href="/lessons/discrete-and-applied-mathematics/596-annuities">
          <span>
            NEXT<b>Annuities</b>
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
  onChange: (value: number) => void;
}) {
  return (
    <label className="fv595-control">
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
        {min.toLocaleString()}
        <i>{max.toLocaleString()}</i>
      </small>
    </label>
  );
}
