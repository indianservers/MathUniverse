import { Check, Minus, Plus, RotateCcw } from "lucide-react";
import { useEffect, useState } from "react";
import type { LessonAdapterProps } from "../../types";
import "./AnnuitiesTargetLesson596.css";

const cash = (value: number) =>
  new Intl.NumberFormat("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
const annuity = (
  payment: number,
  rate: number,
  periods: number,
  due: boolean,
) => {
  const i = rate / 100;
  if (i === 0) return payment * periods;
  return ((payment * ((1 + i) ** periods - 1)) / i) * (due ? 1 + i : 1);
};
const presentAnnuity = (
  payment: number,
  rate: number,
  periods: number,
  due: boolean,
) => {
  const i = rate / 100;
  if (i === 0) return payment * periods;
  return ((payment * (1 - (1 + i) ** -periods)) / i) * (due ? 1 + i : 1);
};

export default function AnnuitiesTargetLesson596({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [payment, setPayment] = useState(5000),
    [rate, setRate] = useState(6),
    [periods, setPeriods] = useState(10),
    [due, setDue] = useState(false),
    [view, setView] = useState<"FV" | "PV">("FV"),
    [tab, setTab] = useState("Interact"),
    [choice, setChoice] = useState(""),
    [graded, setGraded] = useState<boolean | null>(null),
    [actions, setActions] = useState(0);
  const reset = () => {
    setPayment(5000);
    setRate(6);
    setPeriods(10);
    setDue(false);
    setView("FV");
    setTab("Interact");
    setChoice("");
    setGraded(null);
    setActions(0);
  };
  useEffect(reset, [resetToken]);
  const act = (fn: () => void) => {
      fn();
      setActions((v) => v + 1);
      onInteraction();
    },
    fv = annuity(payment, rate, periods, due),
    pv = presentAnnuity(payment, rate, periods, due),
    series = Array.from({ length: Math.floor(periods) + 1 }, (_, n) => ({
      n,
      value:
        view === "FV"
          ? annuity(payment, rate, n, due)
          : presentAnnuity(payment, rate, n, due),
    })),
    max = Math.ceil(Math.max(...series.map((v) => v.value), 1) / 20000) * 20000,
    x = (n: number) => 55 + (n / Math.max(1, periods)) * 420,
    y = (v: number) => 220 - (v / max) * 175,
    challenge = annuity(12000, 7, 8, false),
    options = [73627.32, challenge, 90214.42, 78123.5];
  return (
    <section
      className="an596-page"
      data-testid="finance-mockup-0653"
      data-object-model="dedicated-annuity-cash-flow-timeline-model"
      data-payment={payment}
      data-rate={rate}
      data-periods={periods}
      data-timing={due ? "due" : "ordinary"}
      data-fv={fv.toFixed(2)}
      data-pv={pv.toFixed(2)}
      data-view={view}
      data-graded={graded === null ? "" : graded}
      data-actions={actions}
    >
      <header className="an596-hero">
        <main>
          <span>
            <b>DISCRETE AND APPLIED MATHEMATICS</b>
            <b>FINANCIAL MATHEMATICS AND MODELLING</b>
          </span>
          <h1>Annuities: Cash-Flow Timeline</h1>
          <p>Equal payments at regular intervals build future value.</p>
        </main>
        <aside>
          <p>
            • Level <b>Intermediate-Advanced</b>
          </p>
          <p>
            • Topics <b>Annuities · Finance · Time value of money</b>
          </p>
          <p>
            • Duration <b>6-10 min</b>
          </p>
          <p>
            • Prerequisite <b>Percent, powers, geometric series</b>
          </p>
        </aside>
      </header>
      <nav className="an596-tabs">
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
        <p className="an596-note">
          <b>{tab}:</b> An annuity is a geometric series of equal payments
          shifted through time.
        </p>
      )}
      <section className="an596-observe">
        <header>
          <i>1</i>
          <b>OBSERVE</b>
          <span>Build and watch an annuity grow.</span>
        </header>
        <div className="an596-timeline">
          <div className="an596-payments">
            {Array.from({ length: periods + 1 }, (_, index) => {
              const show = due ? index < periods : index > 0;
              return (
                <span key={index} className={show ? "paid" : ""}>
                  <b>{show ? `₹${payment.toLocaleString("en-IN")}` : ""}</b>
                  <i>↑</i>
                  <small>{index}</small>
                </span>
              );
            })}
          </div>
          <p>
            <span>Time</span>
            <span>{due ? "Beginning" : "End"} of year</span>
          </p>
          <small>
            {periods} equal {due ? "beginning" : "end"}-of-year payments of ₹
            {payment.toLocaleString("en-IN")} at {rate}%
          </small>
        </div>
        <div className="an596-top-controls">
          <fieldset>
            <legend>Timing</legend>
            <button
              className={!due ? "active" : ""}
              onClick={() => act(() => setDue(false))}
            >
              Ordinary (end)
            </button>
            <button
              className={due ? "active" : ""}
              onClick={() => act(() => setDue(true))}
            >
              Due (beginning)
            </button>
          </fieldset>
          <Stepper
            label="Payment (PMT)"
            value={payment}
            step={500}
            min={500}
            max={50000}
            prefix="₹"
            onChange={(v) => act(() => setPayment(v))}
          />
          <Slider
            label="Rate per period (i)"
            value={rate}
            min={0}
            max={20}
            step={0.5}
            suffix="%"
            onChange={(v) => act(() => setRate(v))}
          />
          <Stepper
            label="Number of periods (n)"
            value={periods}
            step={1}
            min={1}
            max={20}
            onChange={(v) => act(() => setPeriods(v))}
          />
        </div>
        <dl className="an596-summary">
          <div>
            <dt>FUTURE VALUE (FV)</dt>
            <dd>₹{cash(fv)}</dd>
            <small>Accumulated at end of year {periods}</small>
          </div>
          <div>
            <dt>PRESENT VALUE (PV)</dt>
            <dd>₹{cash(pv)}</dd>
            <small>Equivalent amount today (t=0)</small>
          </div>
          <div>
            <dt>
              Running total at {due ? "beginning" : "end"} of year {periods}
            </dt>
            <dd>₹{cash(payment * periods)}</dd>
            <small>Sum of all payments</small>
          </div>
        </dl>
      </section>
      <section className="an596-middle">
        <article>
          <header>
            <i>2</i>
            <b>MANIPULATE</b>
            <span>Change a control and see the effect.</span>
          </header>
          <div className="an596-mini">
            <label>
              Payment (PMT)
              <input
                aria-label="Manipulate payment"
                type="range"
                min="500"
                max="50000"
                step="500"
                value={payment}
                onChange={(e) => act(() => setPayment(+e.target.value))}
              />
            </label>
            <label>
              Rate (i)
              <input
                aria-label="Manipulate rate"
                type="range"
                min="0"
                max="20"
                step=".5"
                value={rate}
                onChange={(e) => act(() => setRate(+e.target.value))}
              />
            </label>
            <label>
              Periods (n)
              <input
                aria-label="Manipulate periods"
                type="range"
                min="1"
                max="20"
                value={periods}
                onChange={(e) => act(() => setPeriods(+e.target.value))}
              />
            </label>
            <button onClick={() => act(() => setDue((v) => !v))}>
              {due ? "Due" : "Ordinary"}
            </button>
          </div>
          <nav>
            <button
              className={view === "FV" ? "active" : ""}
              onClick={() => act(() => setView("FV"))}
            >
              FV (Future Value)
            </button>
            <button
              className={view === "PV" ? "active" : ""}
              onClick={() => act(() => setView("PV"))}
            >
              PV (Present Value)
            </button>
            <button onClick={() => act(reset)}>
              <RotateCcw /> Reset
            </button>
          </nav>
          <svg
            viewBox="0 0 520 250"
            role="img"
            aria-label={`${view} versus periods`}
          >
            <line x1="50" x2="485" y1="220" y2="220" />
            <line x1="50" x2="50" y1="35" y2="220" />
            <polyline
              points={series.map((p) => `${x(p.n)},${y(p.value)}`).join(" ")}
            />
            {series
              .filter((_, i) => i % 2 === 0 || i === series.length - 1)
              .map((p) => (
                <g key={p.n}>
                  <circle cx={x(p.n)} cy={y(p.value)} r="5" />
                  <text x={x(p.n)} y={y(p.value) - 10}>
                    {Math.round(p.value).toLocaleString("en-IN")}
                  </text>
                  <text x={x(p.n)} y="239">
                    {p.n}
                  </text>
                </g>
              ))}
          </svg>
        </article>
        <article>
          <header>
            <i>3</i>
            <b>NOTICE THE PATTERN</b>
          </header>
          <p>What do you notice?</p>
          <section>
            <p>✓ Increasing payment increases both FV and PV.</p>
            <p>✓ Higher rate reduces PV but increases future growth.</p>
            <p>✓ More periods increase FV.</p>
            <p>✓ Annuities due are worth more than ordinary annuities.</p>
          </section>
          <aside>Pattern: FV grows with PMT and n; PV falls as i rises.</aside>
        </article>
      </section>
      <section className="an596-lower">
        <article>
          <header>
            <i>4</i>
            <b>UNDERSTAND THE RULE</b>
          </header>
          <p>
            The future value of an ordinary annuity with equal payment PMT is
          </p>
          <strong>
            FV = PMT ((1+i)<sup>n</sup>-1) / i
          </strong>
          <p>
            PMT = equal payment
            <br />i = periodic decimal rate
            <br />n = number of periods
            <br />
            FV = accumulated value
          </p>
          <aside>
            Common misconception: using n-1 periods or placing the first payment
            at t=0 for an ordinary annuity.
          </aside>
        </article>
        <article className="an596-challenge">
          <header>
            <i>5</i>
            <b>TRY INDEPENDENTLY</b>
            <span>Quick Challenge</span>
          </header>
          <p>
            A company invests ₹12,000 at the end of each year at 7% for 8 years.
            Find the future value.
          </p>
          {options.map((option, index) => (
            <label
              key={option}
              className={choice === String(option) ? "selected" : ""}
            >
              <input
                type="radio"
                name="annuity-answer"
                checked={choice === String(option)}
                onChange={() =>
                  act(() => {
                    setChoice(String(option));
                    setGraded(null);
                  })
                }
              />
              <span>{String.fromCharCode(65 + index)}</span>₹{cash(option)}
              {choice === String(option) && Number(choice) === challenge ? (
                <Check />
              ) : null}
            </label>
          ))}
          <button
            onClick={() =>
              act(() => setGraded(Math.abs(Number(choice) - challenge) < 0.02))
            }
          >
            Check Answer
          </button>
          <output
            className={graded === null ? "" : graded ? "correct" : "wrong"}
          >
            {graded === null
              ? ""
              : graded
                ? `Correct: FV = ₹${cash(challenge)}`
                : "Apply all eight end-of-year payments."}
          </output>
        </article>
      </section>
      <section className="an596-worked">
        <h3>WORKED EXAMPLE</h3>
        <p>
          Find the future value of an ordinary annuity of ₹4,000 at the end of
          each year for 7 years at 8% p.a.
        </p>
        <div>
          <ol>
            <li>Identify PMT=₹4,000, i=8%, n=7</li>
            <li>Apply formula FV=PMT((1+i)ⁿ-1)/i</li>
            <li>Substitute FV=4,000((1.08)⁷-1)/0.08</li>
            <li>Compute FV=₹35,690.76</li>
          </ol>
          <aside>
            <b>Timeline (Ordinary annuity)</b>
            <p>0 | ↑1 | ↑2 | ↑3 | ↑4 | ↑5 | ↑6 | ↑7</p>
            <strong>FV ₹35,690.76 | PV ₹24,744.63</strong>
          </aside>
        </div>
      </section>
      <nav className="an596-adjacent">
        <a href="/lessons/discrete-and-applied-mathematics/595-future-value">
          ←{" "}
          <span>
            PREVIOUS<b>Future Value</b>
          </span>
        </a>
        <a href="/lessons/discrete-and-applied-mathematics/597-loans-and-emis">
          <span>
            NEXT<b>Loans and EMIs</b>
          </span>{" "}
          →
        </a>
      </nav>
    </section>
  );
}
function Slider({
  label,
  value,
  min,
  max,
  step,
  suffix,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  suffix?: string;
  onChange: (v: number) => void;
}) {
  return (
    <label className="an596-slider">
      <b>{label}</b>
      <span>
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
    </label>
  );
}
function Stepper({
  label,
  value,
  step,
  min,
  max,
  prefix,
  onChange,
}: {
  label: string;
  value: number;
  step: number;
  min: number;
  max: number;
  prefix?: string;
  onChange: (v: number) => void;
}) {
  return (
    <div className="an596-stepper">
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
        <button onClick={() => onChange(Math.max(min, value - step))}>
          <Minus />
        </button>
        <button onClick={() => onChange(Math.min(max, value + step))}>
          <Plus />
        </button>
      </span>
    </div>
  );
}
