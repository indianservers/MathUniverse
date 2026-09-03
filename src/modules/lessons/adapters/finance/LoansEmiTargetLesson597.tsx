import { Check } from "lucide-react";
import { useEffect, useState } from "react";
import type { LessonAdapterProps } from "../../types";
import "./LoansEmiTargetLesson597.css";

const cash = (value: number) =>
  new Intl.NumberFormat("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
function loanModel(principal: number, annualRate: number, years: number) {
  const rate = annualRate / 1200,
    months = Math.max(1, Math.round(years * 12)),
    emi =
      rate === 0
        ? principal / months
        : (principal * rate * (1 + rate) ** months) /
          ((1 + rate) ** months - 1);
  let balance = principal;
  const rows = Array.from({ length: months }, (_, index) => {
    const interest = balance * rate,
      principalPaid = Math.min(balance, emi - interest),
      closing = Math.max(0, balance - principalPaid),
      row = {
        month: index + 1,
        opening: balance,
        interest,
        principal: principalPaid,
        emi,
        closing,
      };
    balance = closing;
    return row;
  });
  return {
    emi,
    months,
    rows,
    totalPaid: emi * months,
    totalInterest: emi * months - principal,
  };
}
export default function LoansEmiTargetLesson597({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [principal, setPrincipal] = useState(500000),
    [rate, setRate] = useState(9),
    [years, setYears] = useState(5),
    [currency, setCurrency] = useState("Indian Rupee (INR)"),
    [tab, setTab] = useState("Interact"),
    [answers, setAnswers] = useState(["", "", ""]),
    [graded, setGraded] = useState<boolean | null>(null),
    [actions, setActions] = useState(0);
  const reset = () => {
    setPrincipal(500000);
    setRate(9);
    setYears(5);
    setCurrency("Indian Rupee (INR)");
    setTab("Interact");
    setAnswers(["", "", ""]);
    setGraded(null);
    setActions(0);
  };
  useEffect(reset, [resetToken]);
  const act = (fn: () => void) => {
    fn();
    setActions((v) => v + 1);
    onInteraction();
  };
  const model = loanModel(principal, rate, years),
    first = model.rows[0],
    last = model.rows.at(-1)!;
  const challenge = loanModel(750000, 8.5, 6),
    challengeExpected = [
      challenge.emi,
      challenge.totalInterest,
      challenge.rows[0].principal,
    ],
    setAnswer = (index: number, value: string) =>
      act(() => {
        const next = [...answers];
        next[index] = value;
        setAnswers(next);
        setGraded(null);
      }),
    check = () =>
      act(() =>
        setGraded(
          answers.every(
            (value, index) =>
              Math.abs(
                Number(value.replace(/[,₹\s]/g, "")) - challengeExpected[index],
              ) < 0.02,
          ),
        ),
      );
  const chartRows = model.rows.filter(
      (_, index) =>
        index % Math.max(1, Math.ceil(model.months / 24)) === 0 ||
        index === model.months - 1,
    ),
    cx = (month: number) =>
      55 + ((month - 1) / Math.max(1, model.months - 1)) * 600,
    cy = (value: number) => 205 - (value / model.emi) * 145;
  return (
    <section
      className="loan597-page"
      data-testid="finance-mockup-0654"
      data-object-model="dedicated-monthly-amortizing-loan-model"
      data-principal={principal}
      data-rate={rate}
      data-years={years}
      data-months={model.months}
      data-emi={model.emi.toFixed(2)}
      data-interest={model.totalInterest.toFixed(2)}
      data-first-principal={first.principal.toFixed(2)}
      data-graded={graded === null ? "" : graded}
      data-actions={actions}
    >
      <header className="loan597-hero">
        <span>
          <b>DISCRETE AND APPLIED MATHEMATICS</b>
          <b>FINANCIAL MATHEMATICS AND MODELLING</b>
        </span>
        <h1>Loans and EMIs</h1>
        <p>
          <b>Objective:</b> Model a loan as equal monthly payments (EMIs) and
          explore how principal, rate and term affect the payment and the split
          between interest and principal.
        </p>
        <aside>
          <b>
            Level
            <br />
            <strong>Intermediate-Advanced</strong>
          </b>
          <b>
            Time
            <br />
            <strong>6-10 min</strong>
          </b>
          <b>
            Focus
            <br />
            <strong>Financial Modelling</strong>
          </b>
        </aside>
      </header>
      <nav className="loan597-tabs">
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
        <p className="loan597-note">
          <b>{tab}:</b> Each fixed EMI contains changing interest and principal
          portions.
        </p>
      )}
      <section className="loan597-top">
        <aside>
          <h2>1. MANIPULATE THE LOAN</h2>
          <Control
            label="Loan principal (P)"
            value={principal}
            min={1000}
            max={2000000}
            step={1000}
            prefix="₹"
            onChange={(v) => act(() => setPrincipal(v))}
          />
          <Control
            label="Annual interest rate (r)"
            value={rate}
            min={0}
            max={25}
            step={0.25}
            suffix="%"
            onChange={(v) => act(() => setRate(v))}
          />
          <Control
            label="Loan term (tenure)"
            value={years}
            min={1}
            max={20}
            step={1}
            suffix="years"
            onChange={(v) => act(() => setYears(v))}
          />
          <label>
            <b>Currency</b>
            <select
              aria-label="Loan currency"
              value={currency}
              onChange={(e) => act(() => setCurrency(e.target.value))}
            >
              <option>Indian Rupee (INR)</option>
              <option>US Dollar (USD)</option>
              <option>Euro (EUR)</option>
            </select>
          </label>
          <p>
            <b>Tip:</b> Adjust any control and watch the monthly EMI and payment
            breakdown update instantly.
          </p>
        </aside>
        <main>
          <h2>2. OBSERVE THE MODEL</h2>
          <div className="loan597-gauge">
            <section>
              <h3>Monthly EMI</h3>
              <strong>₹{cash(model.emi)}</strong>
              <p>Total of {model.months} payments</p>
              <h3>Total paid</h3>
              <b>₹{cash(model.totalPaid)}</b>
              <h3>Total interest</h3>
              <b>₹{cash(model.totalInterest)}</b>
            </section>
            <svg viewBox="0 0 280 190" role="img" aria-label="EMI gauge">
              <path d="M35 155 A105 105 0 0 1 245 155" />
              <path
                className="used"
                d="M35 155 A105 105 0 0 1 245 155"
                pathLength="100"
                strokeDasharray={`${Math.min(100, model.emi / 250)} 100`}
              />
              <line
                x1="140"
                y1="155"
                x2={140 + 80 * Math.cos(Math.PI * (1 - model.emi / 25000))}
                y2={155 - 80 * Math.sin(Math.PI * (1 - model.emi / 25000))}
              />
              <circle cx="140" cy="155" r="9" />
              <text x="25" y="180">
                0
              </text>
              <text x="140" y="180">
                ₹{Math.round(model.emi).toLocaleString("en-IN")}
              </text>
              <text x="250" y="180">
                ₹25,000
              </text>
            </svg>
            <aside>
              <h3>Payment breakdown</h3>
              <p>
                ● Principal{" "}
                <b>
                  ₹{cash(principal)} (
                  {((principal / model.totalPaid) * 100).toFixed(1)}%)
                </b>
              </p>
              <p>
                ● Interest{" "}
                <b>
                  ₹{cash(model.totalInterest)} (
                  {((model.totalInterest / model.totalPaid) * 100).toFixed(1)}%)
                </b>
              </p>
              <p>
                Interest-to-Principal Ratio{" "}
                <b>{(model.totalInterest / principal).toFixed(3)}</b>
              </p>
              <p>
                Principal repaid so far (Month 1){" "}
                <b>₹{cash(first.principal)}</b>
              </p>
              <p>
                Outstanding after Month 1 <b>₹{cash(first.closing)}</b>
              </p>
            </aside>
          </div>
        </main>
      </section>
      <section className="loan597-pattern">
        <header>
          <h2>3. NOTICE THE PATTERN</h2>
          <span>■ Interest | ■ Principal</span>
        </header>
        <svg
          viewBox="0 0 720 235"
          role="img"
          aria-label="Monthly principal and interest composition"
        >
          <line x1="50" x2="675" y1="205" y2="205" />
          <line x1="50" x2="50" y1="35" y2="205" />
          <polygon
            className="principal"
            points={`50,205 ${chartRows.map((r) => `${cx(r.month)},${cy(r.principal)}`).join(" ")} 675,205`}
          />
          <polygon
            className="interest"
            points={`${chartRows.map((r) => `${cx(r.month)},${cy(model.emi)}`).join(" ")} ${chartRows
              .slice()
              .reverse()
              .map((r) => `${cx(r.month)},${cy(r.principal)}`)
              .join(" ")}`}
          />
          {chartRows.map((r) => (
            <text key={r.month} x={cx(r.month)} y="222">
              {r.month}
            </text>
          ))}
        </svg>
        <div>
          <p>
            <b>Month 1</b>
            <br />
            Interest ₹{cash(first.interest)}
            <br />
            Principal ₹{cash(first.principal)}
          </p>
          <p>
            <b>Month {model.months}</b>
            <br />
            Interest ₹{cash(last.interest)}
            <br />
            Principal ₹{cash(last.principal)}
          </p>
        </div>
        <dl>
          <span>
            Highest interest<b>₹{cash(first.interest)} (Month 1)</b>
          </span>
          <span>
            Lowest interest
            <b>
              ₹{cash(last.interest)} (Month {model.months})
            </b>
          </span>
          <span>
            Principal each month<b>Increases steadily</b>
          </span>
          <span>
            End of loan<b>Outstanding ₹{cash(last.closing)}</b>
          </span>
        </dl>
      </section>
      <section className="loan597-lower">
        <article>
          <h3>4. UNDERSTAND THE RULE</h3>
          <p>EMI for a loan is given by the annuity formula:</p>
          <strong>
            EMI = P × r(1+r)<sup>n</sup> / ((1+r)<sup>n</sup>-1)
          </strong>
          <p>
            P = loan principal
            <br />r = monthly rate = annual rate/(12×100)
            <br />n = total payments = years×12
          </p>
          <aside>
            <b>Key idea</b>
            <p>
              Each EMI is constant, but the interest part decreases and the
              principal part increases over time.
            </p>
          </aside>
        </article>
        <article>
          <h3>5. WORKED EXAMPLE</h3>
          <p>
            <b>Given:</b> P=₹5,00,000, annual rate=9%, tenure=5 years
          </p>
          <p>r=0.09/12=0.0075, n=5×12=60</p>
          <strong>= ₹10,379.18</strong>
          <table>
            <thead>
              <tr>
                <th>Month</th>
                <th>Interest</th>
                <th>Principal</th>
                <th>EMI</th>
                <th>Outstanding</th>
              </tr>
            </thead>
            <tbody>
              {[
                model.rows[0],
                model.rows[1],
                model.rows[2],
                model.rows.at(-1)!,
              ].map((r) => (
                <tr key={r.month}>
                  <td>{r.month}</td>
                  <td>{cash(r.interest)}</td>
                  <td>{cash(r.principal)}</td>
                  <td>{cash(r.emi)}</td>
                  <td>{cash(r.closing)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <footer>
            Total interest = ₹{cash(model.totalInterest)} | Total paid = ₹
            {cash(model.totalPaid)}
          </footer>
        </article>
        <article className="loan597-challenge">
          <h3>6. TRY INDEPENDENTLY</h3>
          <p>
            <b>Challenge:</b> A student takes a loan of ₹7,50,000 at 8.5% per
            annum for 6 years.
          </p>
          {[
            "Your EMI (₹)",
            "Total interest (₹)",
            "Principal repaid in Month 1 (₹)",
          ].map((label, index) => (
            <label key={label}>
              {label}
              <input
                aria-label={label}
                value={answers[index]}
                onChange={(e) => setAnswer(index, e.target.value)}
                placeholder="Enter your answer"
              />
            </label>
          ))}
          <button onClick={check}>
            <Check /> Check My Answers
          </button>
          <output
            className={graded === null ? "" : graded ? "correct" : "wrong"}
          >
            {graded === null
              ? ""
              : graded
                ? "All three loan values are correct."
                : "Recalculate the EMI and first schedule row."}
          </output>
        </article>
      </section>
      <p className="loan597-explore">
        ⓘ <b>Explore more:</b> Try different rate and tenure combinations.
        Observe how EMI and total interest change.
      </p>
      <nav className="loan597-adjacent">
        <a href="/lessons/discrete-and-applied-mathematics/596-annuities">
          ←{" "}
          <span>
            PREVIOUS<b>Annuities</b>
          </span>
        </a>
        <a href="/lessons/discrete-and-applied-mathematics/598-amortisation-table">
          <span>
            NEXT<b>Amortisation Table</b>
          </span>{" "}
          →
        </a>
      </nav>
      <p className="loan597-tags">
        Tags: Loans | EMI | Annuity | Finance | Applications
      </p>
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
    <label className="loan597-control">
      <b>{label}</b>
      <span>
        {prefix}
        <input
          aria-label={label}
          type="number"
          value={value}
          min={min}
          max={max}
          step={step}
          onChange={(e) => onChange(+e.target.value)}
        />
        {suffix}
      </span>
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
