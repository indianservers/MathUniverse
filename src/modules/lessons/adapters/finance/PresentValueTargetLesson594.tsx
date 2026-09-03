import { Check, RotateCcw } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { LessonAdapterProps } from "../../types";
import "./PresentValueTargetLesson594.css";

const cash = (value: number) =>
  new Intl.NumberFormat("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);

export default function PresentValueTargetLesson594({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [future, setFuture] = useState(25000);
  const [rate, setRate] = useState(7);
  const [years, setYears] = useState(5);
  const [tab, setTab] = useState("Interact");
  const [answer, setAnswer] = useState("");
  const [graded, setGraded] = useState<boolean | null>(null);
  const [actions, setActions] = useState(0);
  const reset = () => {
    setFuture(25000);
    setRate(7);
    setYears(5);
    setTab("Interact");
    setAnswer("");
    setGraded(null);
    setActions(0);
  };
  useEffect(reset, [resetToken]);
  const act = (fn: () => void) => {
    fn();
    setActions((value) => value + 1);
    onInteraction();
  };
  const present = future / (1 + rate / 100) ** years;
  const discount = future - present;
  const discountPercent = (discount / future) * 100;
  const steps = useMemo(
    () =>
      Array.from({ length: Math.floor(years) }, (_, index) => {
        const from = Math.floor(years) - index;
        const before = future / (1 + rate / 100) ** (years - from);
        const after = before / (1 + rate / 100);
        return { from, before, after };
      }),
    [future, rate, years],
  );
  const challenge = 10000 / 1.08 ** 3;
  const check = () =>
    act(() =>
      setGraded(
        Math.abs(Number(answer.replace(/[,₹\s]/g, "")) - challenge) < 0.02,
      ),
    );

  return (
    <section
      className="pv594-page"
      data-testid="finance-mockup-0651"
      data-object-model="dedicated-discounted-cash-flow-model"
      data-future={future}
      data-rate={rate}
      data-years={years}
      data-present={present.toFixed(2)}
      data-discount={discount.toFixed(2)}
      data-graded={graded === null ? "" : graded}
      data-actions={actions}
    >
      <header className="pv594-hero">
        <b>DISCRETE AND APPLIED MATHEMATICS</b>
        <h1>Present Value</h1>
        <p>Discount future cash flows.</p>
        <span>
          <b>Level: Intermediate-Advanced</b>
          <b>Lab: Applied Modelling Lab</b>
          <b>Duration: 6-10 min</b>
        </span>
        <p>
          <strong>Objective:</strong> Understand and compute the present value
          of a future cash flow using discounting.
        </p>
      </header>
      <nav className="pv594-tabs">
        {[
          ["Interact", "Manipulate & explore"],
          ["Learn", "Key ideas"],
          ["Worked Example", "See it solved"],
          ["Formula", "The rule"],
          ["Practice", "Try it yourself"],
        ].map(([name, sub]) => (
          <button
            key={name}
            className={tab === name ? "active" : ""}
            onClick={() => act(() => setTab(name))}
          >
            <b>{name}</b>
            <small>{sub}</small>
          </button>
        ))}
      </nav>
      {tab !== "Interact" && (
        <p className="pv594-note">
          <b>{tab}:</b> Discounting reverses compound growth to express a future
          amount in today’s money.
        </p>
      )}

      <section className="pv594-lab">
        <header>
          <div>
            <h2>1. OBSERVE &amp; MANIPULATE</h2>
            <p>
              Use the controls to move backward in time and find the present
              value.
            </p>
          </div>
          <button onClick={() => act(reset)}>
            <RotateCcw /> Reset
          </button>
        </header>
        <div className="pv594-lab-grid">
          <main>
            <div className="pv594-timeline">
              <b>Timeline (years)</b>
              <strong>Future cash flow (FV)</strong>
              <div className="pv594-axis">
                {Array.from({ length: Math.floor(years) + 1 }, (_, i) => (
                  <span
                    key={i}
                    style={{ left: `${5 + (i / Math.max(1, years)) * 90}%` }}
                  >
                    <i />
                    {i}
                  </span>
                ))}
              </div>
              <div className="pv594-arrows">
                {Array.from({ length: Math.floor(years) }, (_, i) => (
                  <i key={i}>←</i>
                ))}
              </div>
              <output className="present">
                Present Value (PV)<b>₹{cash(present)}</b>
              </output>
              <output className="future">₹{cash(future)}</output>
              <section>
                <h3>
                  Discounting step-by-step (at r = {rate}%, n = {years})
                </h3>
                {steps.map((step) => (
                  <p key={step.from}>
                    Year {step.from} → {step.from - 1}:{" "}
                    <span>
                      {cash(step.before)} ÷ {(1 + rate / 100).toFixed(2)}
                    </span>{" "}
                    = {cash(step.after)}
                  </p>
                ))}
              </section>
            </div>
            <dl className="pv594-summary">
              <div>
                <dt>PRESENT VALUE (PV)</dt>
                <dd>₹{cash(present)}</dd>
                <small>Today’s value</small>
              </div>
              <div>
                <dt>DISCOUNT</dt>
                <dd>₹{cash(discount)}</dd>
                <small>Amount of discount</small>
              </div>
              <div>
                <dt>% DISCOUNT</dt>
                <dd>{discountPercent.toFixed(2)}%</dd>
                <small>of future cash flow</small>
              </div>
            </dl>
          </main>
          <aside className="pv594-controls">
            <h2>Controls</h2>
            <Control
              label="Future cash flow (FV)"
              help="Amount received in the future."
              value={future}
              min={100}
              max={100000}
              step={100}
              prefix="₹"
              onChange={(v) => act(() => setFuture(v))}
            />
            <Control
              label="Interest rate (r)"
              help="Annual discount rate."
              value={rate}
              min={0}
              max={25}
              step={0.5}
              suffix="%"
              onChange={(v) => act(() => setRate(v))}
            />
            <Control
              label="Years (n)"
              help="Number of years to the future."
              value={years}
              min={1}
              max={20}
              step={1}
              suffix="years"
              onChange={(v) => act(() => setYears(v))}
            />
            <section>
              <h3>Formula in use</h3>
              <strong>
                PV = FV / (1+r)<sup>n</sup>
              </strong>
              <p>What present value is shown?</p>
              <b>₹{cash(present)}</b>
            </section>
          </aside>
        </div>
      </section>

      <section className="pv594-theory">
        <article>
          <h3>2. NOTICE THE PATTERN</h3>
          <p>Higher rate or more years reduces present value.</p>
          <p>➜ Increase r → PV decreases</p>
          <p>➜ Increase n → PV decreases</p>
          <p>➜ Increase FV → PV increases</p>
        </article>
        <article>
          <h3>3. UNDERSTAND THE RULE</h3>
          <p>We discount future money back to today’s value.</p>
          <strong>
            PV = FV / (1+r)<sup>n</sup>
          </strong>
          <p>PV = today, FV = future, r = rate per year, n = years.</p>
        </article>
        <article>
          <h3>4. WORKED EXAMPLE</h3>
          <p>Find the present value.</p>
          <b>FV = ₹25,000, r = 7%, n = 5</b>
          <p>
            PV = 25,000/(1.07)<sup>5</sup>
            <br />
            PV = ₹17,824.65
          </p>
          <small>Correct ✓</small>
        </article>
        <article className="warning">
          <h3>5. MISCONCEPTION CHECK</h3>
          <p>Don’t subtract or multiply the rate and years.</p>
          <p>
            <b>Incorrect:</b> 25,000 - (7% × 5)
          </p>
          <p>
            <b>Correct:</b> Use PV = FV/(1+r)<sup>n</sup>
          </p>
        </article>
      </section>

      <section className="pv594-practice">
        <header>
          <h3>6. TRY INDEPENDENTLY (QUICK CHALLENGE)</h3>
          <p>Find the present value.</p>
        </header>
        <div>
          <span>₹ 10,000</span>
          <span>8 %</span>
          <span>3 years</span>
          <label>
            Your answer
            <input
              aria-label="Present value challenge answer"
              value={answer}
              onChange={(e) =>
                act(() => {
                  setAnswer(e.target.value);
                  setGraded(null);
                })
              }
              placeholder="₹"
            />
          </label>
          <button onClick={check}>
            <Check /> Check Answer
          </button>
          <output
            className={graded === null ? "" : graded ? "correct" : "wrong"}
          >
            {graded === null
              ? ""
              : graded
                ? `Correct: ₹${cash(challenge)}`
                : "Use division by (1.08)³."}
          </output>
        </div>
        <aside>
          <b>Need a hint?</b>
          <p>
            Use PV = FV/(1+r)<sup>n</sup>
          </p>
          <p>
            (1.08)<sup>3</sup> = 1.259712
          </p>
        </aside>
      </section>
      <nav className="pv594-adjacent">
        <a href="/lessons/discrete-and-applied-mathematics/593-effective-interest-rate">
          ←{" "}
          <span>
            Previous Lesson<b>Effective Interest Rate</b>
          </span>
        </a>
        <a href="/lessons/discrete-and-applied-mathematics/595-future-value">
          <span>
            Next Lesson<b>Future Value</b>
          </span>{" "}
          →
        </a>
      </nav>
    </section>
  );
}

function Control({
  label,
  help,
  value,
  min,
  max,
  step,
  prefix,
  suffix,
  onChange,
}: {
  label: string;
  help: string;
  value: number;
  min: number;
  max: number;
  step: number;
  prefix?: string;
  suffix?: string;
  onChange: (value: number) => void;
}) {
  return (
    <label className="pv594-control">
      <b>{label}</b>
      <small>{help}</small>
      <input
        aria-label={`${label} slider`}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(+e.target.value)}
      />
      <em>
        {min}
        <i>{max}</i>
      </em>
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
    </label>
  );
}
