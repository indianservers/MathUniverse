import { Check, RotateCcw } from "lucide-react";
import { useEffect, useState } from "react";
import type { LessonAdapterProps } from "../../types";
import "./AmortisationTableTargetLesson598.css";

const cash = (value: number) =>
  new Intl.NumberFormat("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
type Row = {
  month: number;
  opening: number;
  payment: number;
  interest: number;
  principal: number;
  closing: number;
};
function schedule(
  principal: number,
  annual: number,
  years: number,
  extra = 0,
  periodsPerYear = 12,
) {
  const r = annual / 100 / periodsPerYear,
    n = Math.max(1, Math.round(years * periodsPerYear)),
    emi =
      r === 0
        ? principal / n
        : (principal * r * (1 + r) ** n) / ((1 + r) ** n - 1),
    rows: Row[] = [];
  let balance = principal,
    month = 1;
  while (balance > 0.005 && month <= n * 3) {
    const interest = balance * r,
      payment = Math.min(balance + interest, emi + extra),
      principalPaid = payment - interest,
      closing = Math.max(0, balance - principalPaid);
    rows.push({
      month,
      opening: balance,
      payment,
      interest,
      principal: principalPaid,
      closing,
    });
    balance = closing;
    month++;
  }
  return {
    emi,
    rows,
    totalPaid: rows.reduce((s, row) => s + row.payment, 0),
    totalInterest: rows.reduce((s, row) => s + row.interest, 0),
  };
}
export default function AmortisationTableTargetLesson598({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [principal, setPrincipal] = useState(500000),
    [rate, setRate] = useState(9),
    [years, setYears] = useState(5),
    [frequency, setFrequency] = useState("Monthly"),
    [extraEnabled, setExtraEnabled] = useState(true),
    [extra, setExtra] = useState(0),
    [month, setMonth] = useState(12),
    [chartRange, setChartRange] = useState("Entire term"),
    [tab, setTab] = useState("Interact"),
    [answers, setAnswers] = useState(["", ""]),
    [graded, setGraded] = useState<boolean | null>(null),
    [actions, setActions] = useState(0);
  const reset = () => {
    setPrincipal(500000);
    setRate(9);
    setYears(5);
    setFrequency("Monthly");
    setExtraEnabled(true);
    setExtra(0);
    setMonth(12);
    setChartRange("Entire term");
    setTab("Interact");
    setAnswers(["", ""]);
    setGraded(null);
    setActions(0);
  };
  useEffect(reset, [resetToken]);
  const act = (fn: () => void) => {
    fn();
    setActions((v) => v + 1);
    onInteraction();
  };
  const periodsPerYear =
      frequency === "Weekly" ? 52 : frequency === "Fortnightly" ? 26 : 12,
    base = schedule(principal, rate, years, 0, periodsPerYear),
    accelerated = schedule(
      principal,
      rate,
      years,
      extraEnabled ? extra : 0,
      periodsPerYear,
    ),
    selected =
      accelerated.rows[Math.min(month, accelerated.rows.length) - 1] ??
      accelerated.rows.at(-1)!,
    interestToDate = accelerated.rows
      .slice(0, selected.month)
      .reduce((s, r) => s + r.interest, 0),
    principalToDate = principal - selected.closing,
    monthsSaved = base.rows.length - accelerated.rows.length,
    interestSaved = base.totalInterest - accelerated.totalInterest,
    windowRows = accelerated.rows.slice(
      Math.max(0, selected.month - 3),
      Math.min(accelerated.rows.length, selected.month + 2),
    );
  const challengeBase = schedule(500000, 9, 5),
    challengeExtra = schedule(500000, 9, 5, 1000),
    challenge = [
      challengeBase.rows.length - challengeExtra.rows.length,
      challengeBase.totalInterest - challengeExtra.totalInterest,
    ],
    setAnswer = (i: number, value: string) =>
      act(() => {
        const next = [...answers];
        next[i] = value;
        setAnswers(next);
        setGraded(null);
      }),
    check = () =>
      act(() =>
        setGraded(
          Math.abs(Number(answers[0]) - challenge[0]) < 0.01 &&
            Math.abs(Number(answers[1].replace(/[,₹\s]/g, "")) - challenge[1]) <
              0.02,
        ),
      );
  const chartRows =
      chartRange === "First year"
        ? accelerated.rows.slice(0, periodsPerYear)
        : accelerated.rows,
    samples = chartRows.filter(
      (_, i) =>
        i % Math.max(1, Math.ceil(chartRows.length / 10)) === 0 ||
        i === chartRows.length - 1,
    ),
    x = (m: number) =>
      55 + ((m - 1) / Math.max(1, chartRows.at(-1)!.month - 1)) * 560,
    y = (v: number) => 230 - (v / principal) * 175;
  return (
    <section
      className="am598-page"
      data-testid="finance-mockup-0655"
      data-object-model="dedicated-extra-payment-amortisation-schedule-model"
      data-principal={principal}
      data-rate={rate}
      data-years={years}
      data-frequency={frequency}
      data-chart-range={chartRange}
      data-emi={base.emi.toFixed(2)}
      data-extra={extraEnabled ? extra : 0}
      data-payoff={accelerated.rows.length}
      data-interest={accelerated.totalInterest.toFixed(2)}
      data-month={selected.month}
      data-closing={selected.closing.toFixed(2)}
      data-graded={graded === null ? "" : graded}
      data-actions={actions}
    >
      <aside className="am598-side-panel">
        <b>₹ {cash(base.emi)}</b>
        <small>Calculated (EMI)</small>
        <label>
          Extra payment
          <input
            aria-label="Extra payment enabled"
            type="checkbox"
            checked={extraEnabled}
            onChange={(e) => act(() => setExtraEnabled(e.target.checked))}
          />
        </label>
        <label>
          Extra amount (₹)
          <input
            aria-label="Extra payment amount"
            type="number"
            min="0"
            max="500000"
            step="500"
            value={extra}
            onChange={(e) => act(() => setExtra(+e.target.value))}
          />
          <input
            aria-label="Extra payment slider"
            type="range"
            min="0"
            max="50000"
            step="500"
            value={extra}
            onChange={(e) => act(() => setExtra(+e.target.value))}
          />
        </label>
        <h3>Loan summary</h3>
        <p>
          Monthly payment <b>₹{cash(base.emi)}</b>
        </p>
        <p>
          Total payments <b>₹{cash(accelerated.totalPaid)}</b>
        </p>
        <p>
          Total interest <b>₹{cash(accelerated.totalInterest)}</b>
        </p>
        <p>
          Payoff in <b>{accelerated.rows.length} months</b>
        </p>
        <p>
          Months saved <b>{monthsSaved}</b>
        </p>
        <p>
          Interest saved <b>₹{cash(interestSaved)}</b>
        </p>
        <footer>
          Try adding an extra payment of ₹1,000/month and see what happens.
        </footer>
      </aside>
      <header className="am598-hero">
        <main>
          <span>
            <b>DISCRETE AND APPLIED MATHEMATICS</b>
            <b>FINANCIAL MATHEMATICS AND MODELLING</b>
          </span>
          <h1>598 Amortisation Table</h1>
          <p>
            <b>Objective:</b> Build and explore an amortisation table linked to
            a stacked balance chart. See how each payment is split into interest
            and principal and how extra payments reduce the loan term.
          </p>
          <dl>
            <b>
              Level
              <br />
              Intermediate-Advanced
            </b>
            <b>
              Lab
              <br />
              Finance &amp; Modelling
            </b>
            <b>
              Time
              <br />
              6-10 min
            </b>
            <b>
              Tags
              <br />
              Loans, Amortisation, Interest
            </b>
          </dl>
          <aside>
            You will explore how a fixed payment reduces outstanding balance
            over time. Interact, observe patterns, learn the rule, and try
            independently.
          </aside>
        </main>
        <figure>
          <b>Balance over time</b>
          <svg viewBox="0 0 240 135">
            <polygon points="25,115 25,38 205,115" />
            <polygon className="interest" points="25,90 25,38 205,115" />
            <polyline points="25,38 70,55 115,75 160,95 205,115" />
          </svg>
        </figure>
      </header>
      <nav className="am598-tabs">
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
        <p className="am598-note">
          <b>{tab}:</b> Every payment first covers interest; the remainder
          reduces principal.
        </p>
      )}
      <section className="am598-lab">
        <header>
          <h2>
            1. Observe &amp; Manipulate{" "}
            <small>— Explore the amortisation model</small>
          </h2>
          <button onClick={() => act(reset)}>
            <RotateCcw /> Reset all
          </button>
        </header>
        <div className="am598-work">
          <aside>
            <h3>Loan inputs</h3>
            <Control
              label="Loan principal (₹)"
              value={principal}
              min={100}
              max={2000000}
              step={100}
              onChange={(v) => act(() => setPrincipal(v))}
            />
            <Control
              label="Annual interest rate (%)"
              value={rate}
              min={0}
              max={25}
              step={0.25}
              onChange={(v) => act(() => setRate(v))}
            />
            <Control
              label="Loan term (years)"
              value={years}
              min={1}
              max={20}
              step={1}
              onChange={(v) => act(() => setYears(v))}
            />
            <label>
              <b>Payment frequency</b>
              <select
                aria-label="Payment frequency"
                value={frequency}
                onChange={(e) =>
                  act(() => {
                    setFrequency(e.target.value);
                    setMonth(1);
                  })
                }
              >
                <option>Monthly</option>
                <option>Fortnightly</option>
                <option>Weekly</option>
              </select>
            </label>
            <label>
              <b>Monthly payment (₹)</b>
              <input
                aria-label="Calculated monthly payment"
                readOnly
                value={base.emi.toFixed(2)}
              />
              <small>Calculated (EMI)</small>
            </label>
            <section>
              <h3>Loan summary</h3>
              <p>
                Monthly payment <b>₹{cash(base.emi)}</b>
              </p>
              <p>
                Total interest <b>₹{cash(accelerated.totalInterest)}</b>
              </p>
              <p>
                Payoff in <b>{accelerated.rows.length} months</b>
              </p>
              <p>
                Interest saved <b>₹{cash(interestSaved)}</b>
              </p>
            </section>
          </aside>
          <main>
            <dl className="am598-readouts">
              <div>
                <dt>Remaining balance</dt>
                <dd>₹{cash(selected.closing)}</dd>
              </div>
              <div>
                <dt>Total interest paid</dt>
                <dd>₹{cash(interestToDate)}</dd>
              </div>
              <div>
                <dt>Principal paid</dt>
                <dd>₹{cash(principalToDate)}</dd>
              </div>
              <div>
                <dt>Next payment due</dt>
                <dd>May 01, 2026</dd>
              </div>
            </dl>
            <div className="am598-chart">
              <header>
                <h3>Balance breakdown over time (stacked)</h3>
                <select
                  aria-label="Chart range"
                  value={chartRange}
                  onChange={(e) => act(() => setChartRange(e.target.value))}
                >
                  <option>Entire term</option>
                  <option>First year</option>
                </select>
              </header>
              <svg
                viewBox="0 0 650 265"
                role="img"
                aria-label="Amortisation balance breakdown"
              >
                <line x1="50" x2="625" y1="230" y2="230" />
                <polygon
                  className="principal"
                  points={`50,230 ${samples.map((r) => `${x(r.month)},${y(r.closing * 0.54)}`).join(" ")} 625,230`}
                />
                <polygon
                  className="interest"
                  points={`${samples.map((r) => `${x(r.month)},${y(r.closing)}`).join(" ")} ${samples
                    .slice()
                    .reverse()
                    .map((r) => `${x(r.month)},${y(r.closing * 0.54)}`)
                    .join(" ")}`}
                />
                <polyline
                  points={samples
                    .map((r) => `${x(r.month)},${y(r.closing)}`)
                    .join(" ")}
                />
                {samples.map((r) => (
                  <g key={r.month}>
                    <circle cx={x(r.month)} cy={y(r.closing)} r="3" />
                    <text x={x(r.month)} y="250">
                      {r.month}
                    </text>
                  </g>
                ))}
              </svg>
            </div>
            <label className="am598-scrub">
              Month <b>{selected.month}</b>
              <input
                aria-label="Selected amortisation month"
                type="range"
                min="1"
                max={accelerated.rows.length}
                value={selected.month}
                onChange={(e) => act(() => setMonth(+e.target.value))}
              />
            </label>
            <section className="am598-table">
              <h3>
                Amortisation table{" "}
                <small>Drag the month slider to explore any payment.</small>
              </h3>
              <table>
                <thead>
                  <tr>
                    <th>Month</th>
                    <th>Payment (₹)</th>
                    <th>Interest (₹)</th>
                    <th>Principal (₹)</th>
                    <th>Closing Balance (₹)</th>
                  </tr>
                </thead>
                <tbody>
                  {windowRows.map((r) => (
                    <tr
                      key={r.month}
                      className={r.month === selected.month ? "active" : ""}
                      onClick={() => act(() => setMonth(r.month))}
                    >
                      <td>{r.month}</td>
                      <td>{cash(r.payment)}</td>
                      <td>{cash(r.interest)}</td>
                      <td>{cash(r.principal)}</td>
                      <td>{cash(r.closing)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <footer>
                <b>Details for Month {selected.month}</b>
                <p>Payment is split into Interest and Principal.</p>
                <div>
                  <span>
                    Payment (₹)<b>{cash(selected.payment)}</b>
                  </span>
                  <i>=</i>
                  <span>
                    Interest (₹)<b>{cash(selected.interest)}</b>
                  </span>
                  <i>+</i>
                  <span>
                    Principal (₹)<b>{cash(selected.principal)}</b>
                  </span>
                  <i>→</i>
                  <span>
                    Closing Balance (₹)<b>{cash(selected.closing)}</b>
                  </span>
                </div>
              </footer>
            </section>
          </main>
        </div>
      </section>
      <section className="am598-theory">
        <article>
          <h3>2. Notice the pattern</h3>
          <p>✓ Interest portion is highest in early months and decreases.</p>
          <p>✓ Principal portion is lowest early and increases.</p>
          <p>✓ Closing balance decreases until zero.</p>
          <p>✓ Extra payments reduce months and interest.</p>
          <aside>
            Common misconception: each payment does not reduce the balance by
            the same amount.
          </aside>
        </article>
        <article>
          <h3>3. Understand the rule</h3>
          <p>Monthly interest: Iₙ=Bₙ₋₁×r/12</p>
          <p>Principal: Pₙ=M-Iₙ</p>
          <p>Closing balance: Bₙ=Bₙ₋₁-Pₙ</p>
        </article>
        <article>
          <h3>4. Worked example</h3>
          <p>Loan ₹5,00,000 at 9% p.a., term 5 years.</p>
          <p>
            Opening balance ₹5,00,000
            <br />
            Interest 5,00,000×0.09/12 = ₹3,750
            <br />
            Principal ₹10,379.18-₹3,750 = ₹6,629.18
            <br />
            Closing ₹4,93,370.82
          </p>
        </article>
      </section>
      <section className="am598-challenge">
        <h3>5. Try independently — Challenge</h3>
        <p>
          <b>Challenge: Extra payment impact.</b> Add an extra payment of ₹1,000
          each month to the loan above. By how many months is it paid off
          earlier? How much interest is saved?
        </p>
        <div>
          <label>
            Months earlier
            <input
              aria-label="Challenge months earlier"
              value={answers[0]}
              onChange={(e) => setAnswer(0, e.target.value)}
            />
          </label>
          <label>
            Interest saved
            <input
              aria-label="Challenge interest saved"
              value={answers[1]}
              onChange={(e) => setAnswer(1, e.target.value)}
            />
          </label>
          <button onClick={check}>
            <Check /> Check
          </button>
          <output
            className={graded === null ? "" : graded ? "correct" : "wrong"}
          >
            {graded === null
              ? ""
              : graded
                ? `Correct: ${challenge[0]} months and ₹${cash(challenge[1])}.`
                : "Run the schedule with ₹1,000 extra."}
          </output>
        </div>
      </section>
      <nav className="am598-adjacent">
        <a href="/lessons/discrete-and-applied-mathematics/597-loans-and-emis">
          ←{" "}
          <span>
            PREVIOUS<b>Loans and EMIs</b>
          </span>
        </a>
        <a href="/lessons/discrete-and-applied-mathematics/599-depreciation">
          <span>
            NEXT<b>Depreciation</b>
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
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
}) {
  return (
    <label className="am598-control">
      <b>{label}</b>
      <input
        aria-label={label}
        type="number"
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={(e) => onChange(+e.target.value)}
      />
      <input
        aria-label={`${label} slider`}
        type="range"
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={(e) => onChange(+e.target.value)}
      />
      <small>
        {min.toLocaleString()}
        <i>{max.toLocaleString()}</i>
      </small>
    </label>
  );
}
