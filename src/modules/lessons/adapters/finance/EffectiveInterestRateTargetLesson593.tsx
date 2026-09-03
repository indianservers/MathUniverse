import { Check, RotateCcw } from "lucide-react";
import { useEffect, useState } from "react";
import type { LessonAdapterProps } from "../../types";
import "./EffectiveInterestRateTargetLesson593.css";

const frequencies = [1, 2, 4, 12, 52, 365] as const;
const frequencyNames: Record<number, string> = {
  1: "Yearly",
  2: "Semiannually",
  4: "Quarterly",
  12: "Monthly",
  52: "Weekly",
  365: "Daily",
};
const cash = (value: number) =>
  new Intl.NumberFormat("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
const accumulated = (p: number, rate: number, n: number, time: number) =>
  p * (1 + rate / 100 / n) ** (n * time);
const ear = (rate: number, n: number) => ((1 + rate / 100 / n) ** n - 1) * 100;

export default function EffectiveInterestRateTargetLesson593({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [rate, setRate] = useState(12);
  const [frequency, setFrequency] = useState(12);
  const [principal, setPrincipal] = useState(10000);
  const [time, setTime] = useState(1);
  const [tab, setTab] = useState("Interact");
  const [matches, setMatches] = useState(["", "", ""]);
  const [graded, setGraded] = useState<boolean | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [actions, setActions] = useState(0);

  const reset = () => {
    setRate(12);
    setFrequency(12);
    setPrincipal(10000);
    setTime(1);
    setTab("Interact");
    setMatches(["", "", ""]);
    setGraded(null);
    setShowExplanation(false);
    setActions(0);
  };
  useEffect(reset, [resetToken]);
  const act = (fn: () => void) => {
    fn();
    setActions((value) => value + 1);
    onInteraction();
  };
  const selectedAmount = accumulated(principal, rate, frequency, time);
  const yearlyAmount = accumulated(principal, rate, 1, time);
  const selectedEar = ear(rate, frequency);
  const extra = selectedAmount - yearlyAmount;
  const bars = frequencies.map((n) => ({
    n,
    value: accumulated(principal, rate, n, time),
  }));
  const floor = principal * 0.995;
  const ceiling = Math.max(...bars.map((bar) => bar.value)) * 1.015;
  const barHeight = (value: number) =>
    45 + ((value - floor) / Math.max(1, ceiling - floor)) * 210;
  const correct = ["12", "4", "12"];

  return (
    <section
      className="eir593-page"
      data-testid="finance-mockup-0650"
      data-object-model="dedicated-effective-annual-rate-comparator"
      data-rate={rate}
      data-frequency={frequency}
      data-principal={principal}
      data-time={time}
      data-amount={selectedAmount.toFixed(2)}
      data-ear={selectedEar.toFixed(4)}
      data-extra={extra.toFixed(2)}
      data-graded={graded === null ? "" : graded}
      data-actions={actions}
    >
      <header className="eir593-hero">
        <main>
          <b>FINANCIAL MATHEMATICS &amp; MODELLING</b>
          <h1>Effective Interest Rate</h1>
          <p>
            Convert nominal APR to true annual growth (EAR) and compare
            compounding frequencies.
          </p>
          <span>
            <b>Level: Intermediate-Advanced</b>
            <b>Applied Modelling Lab</b>
            <b>6-10 min</b>
            <b>Workspace</b>
          </span>
        </main>
        <aside>
          <b>OBJECTIVE</b>
          <p>
            Understand how compounding frequency increases the effective annual
            rate (EAR), learn the rule, and apply it confidently.
          </p>
        </aside>
      </header>
      <nav className="eir593-tabs">
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
        <button onClick={() => act(reset)}>
          <RotateCcw /> Reset all
        </button>
      </nav>
      {tab !== "Interact" && (
        <p className="eir593-note">
          <b>{tab}:</b> EAR includes the interest-on-interest created by each
          compounding period.
        </p>
      )}

      <section className="eir593-lab">
        <header>
          <b>OBSERVE &amp; MANIPULATE</b>
          <p>
            Change the nominal rate and compounding to see the effect on the
            future value.
          </p>
        </header>
        <div className="eir593-lab-grid">
          <aside className="eir593-controls">
            <Control
              label="Nominal APR (r)"
              value={rate}
              min={0}
              max={30}
              step={0.25}
              suffix="%"
              onChange={(v) => act(() => setRate(v))}
            />
            <fieldset>
              <legend>Compounding per year (n)</legend>
              {frequencies.map((n) => (
                <button
                  key={n}
                  className={frequency === n ? "active" : ""}
                  onClick={() => act(() => setFrequency(n))}
                >
                  {n}
                </button>
              ))}
            </fieldset>
            <Control
              label="Principal (P)"
              value={principal}
              min={100}
              max={100000}
              step={100}
              prefix="₹"
              onChange={(v) => act(() => setPrincipal(v))}
            />
            <Control
              label="Time (t)"
              value={time}
              min={0.25}
              max={10}
              step={0.25}
              suffix="years"
              onChange={(v) => act(() => setTime(v))}
            />
          </aside>
          <main className="eir593-chart">
            <h2>
              Accumulation over time (t = {time} year{time === 1 ? "" : "s"})
            </h2>
            <b>EAR (effective annual rate)</b>
            <div className="eir593-bars">
              {bars.map((bar) => (
                <button
                  key={bar.n}
                  className={frequency === bar.n ? "active" : ""}
                  onClick={() => act(() => setFrequency(bar.n))}
                  title={`Select ${frequencyNames[bar.n]}`}
                >
                  <strong>₹{cash(bar.value)}</strong>
                  <i style={{ height: `${barHeight(bar.value)}px` }} />
                  <span>
                    n = {bar.n}
                    <small>({frequencyNames[bar.n]})</small>
                  </span>
                </button>
              ))}
            </div>
          </main>
        </div>
        <dl className="eir593-readouts">
          <div>
            <dt>Future Value A</dt>
            <dd>₹{cash(selectedAmount)}</dd>
            <small>with n = {frequency}</small>
          </div>
          <div>
            <dt>Effective Annual Rate (EAR)</dt>
            <dd>{selectedEar.toFixed(4)}%</dd>
            <small>= (A/P) - 1</small>
          </div>
          <div>
            <dt>Extra vs yearly</dt>
            <dd>₹{cash(extra)}</dd>
            <small>({(selectedEar - rate).toFixed(4)}%)</small>
          </div>
          <div>
            <dt>Formula</dt>
            <dd>
              EAR = (1 + r/n)<sup>n</sup> - 1
            </dd>
          </div>
        </dl>
        <p className="eir593-insight">
          ⓘ As compounding frequency increases, the effective annual rate
          increases.
        </p>
      </section>

      <section className="eir593-theory">
        <article>
          <h3>NOTICE THE PATTERN</h3>
          <p>
            ✓ More frequent compounding compounds interest on interest more
            often.
          </p>
          <p>✓ Future value increases and approaches a limit.</p>
          <p>
            ✓ Extra gain over yearly compounding keeps growing but gets smaller.
          </p>
        </article>
        <article>
          <h3>UNDERSTAND THE RULE</h3>
          <p>
            The effective annual rate for nominal annual rate r, compounded n
            times per year is given by
          </p>
          <strong>
            EAR = (1 + r/n)<sup>n</sup> - 1
          </strong>
          <p>where r is in decimal and n is a positive integer.</p>
        </article>
        <article className="warning">
          <h3>COMMON MISCONCEPTION</h3>
          <p>
            <b>Incorrect:</b> EAR = r (or EAR = n × r)
          </p>
          <p>
            This ignores compounding on interest and significantly
            underestimates the true growth.
          </p>
          <p>Example: r = 12%, n = 12 → EAR is 12.6825%.</p>
        </article>
      </section>

      <section className="eir593-worked">
        <h3>WORKED EXAMPLE</h3>
        <p>
          Find the effective annual rate (EAR) if the nominal APR is 10%
          compounded monthly.
        </p>
        <div>
          <p>
            <b>Given</b>
            <br />r = 10% = 0.10
            <br />n = 12
            <br />t = 1 year
          </p>
          <p>
            <b>Solution</b>
            <br />
            EAR = (1 + 0.10/12)<sup>12</sup> - 1<br />= 0.1047135745...
            <br />
            <strong>= 10.4714% (approx.)</strong>
          </p>
          <p className="check">
            <b>Check</b>
            <br />
            Future value on ₹10,000 in 1 year
            <br />A = ₹11,047.14
            <br />
            EAR = (A/P) - 1 = 10.4714% ✓
          </p>
        </div>
      </section>

      <section className="eir593-practice">
        <header>
          <h3>TRY INDEPENDENTLY</h3>
          <p>
            <b>Challenge:</b> Equivalent-rate matcher. Match each nominal rate
            with its compounding frequency that gives the EAR shown.
          </p>
        </header>
        <div className="eir593-match">
          {["10% APR → 10.4713%", "8% APR → 8.2432%", "12% APR → 12.6825%"].map(
            (label, index) => (
              <label key={label}>
                <b>{index + 1}</b>
                <span>{label}</span>
                <select
                  aria-label={`Match ${index + 1}`}
                  value={matches[index]}
                  onChange={(event) =>
                    act(() => {
                      const next = [...matches];
                      next[index] = event.target.value;
                      setMatches(next);
                      setGraded(null);
                    })
                  }
                >
                  <option value="">Drop or select →</option>
                  {frequencies.map((n) => (
                    <option key={n} value={n}>
                      {frequencyNames[n]} (n={n})
                    </option>
                  ))}
                </select>
              </label>
            ),
          )}
        </div>
        <aside>
          <button
            onClick={() =>
              act(() =>
                setGraded(
                  matches.every((value, index) => value === correct[index]),
                ),
              )
            }
          >
            <Check /> Check Answers
          </button>
          <button onClick={() => act(() => setShowExplanation((v) => !v))}>
            ◉ Show explanation
          </button>
          <output
            className={graded === null ? "" : graded ? "correct" : "wrong"}
          >
            {graded === null
              ? ""
              : graded
                ? "All effective-rate matches are correct."
                : "Recalculate each EAR before matching."}
          </output>
        </aside>
        {showExplanation && (
          <p className="eir593-explanation">
            Use EAR=(1+r/n)<sup>n</sup>-1 independently for each row; the first
            and third are monthly, while the second is quarterly.
          </p>
        )}
      </section>
      <nav className="eir593-adjacent">
        <a href="/lessons/discrete-and-applied-mathematics/592-compound-interest">
          ←{" "}
          <span>
            Previous<b>Compound Interest</b>
          </span>
        </a>
        <a href="/lessons/discrete-and-applied-mathematics/594-present-value">
          <span>
            Next<b>Present Value</b>
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
  suffix,
  prefix,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  suffix?: string;
  prefix?: string;
  onChange: (value: number) => void;
}) {
  return (
    <label className="eir593-control">
      <b>{label}</b>
      <input
        aria-label={`${label} slider`}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(+e.target.value)}
      />
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
      <small>
        {min}
        <i>{max}</i>
      </small>
    </label>
  );
}
