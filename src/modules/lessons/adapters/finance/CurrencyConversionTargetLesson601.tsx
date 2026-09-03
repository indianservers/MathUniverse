import { ArrowLeftRight, Check, RotateCcw } from "lucide-react";
import { useEffect, useState } from "react";
import type { LessonAdapterProps } from "../../types";
import "./CurrencyConversionTargetLesson601.css";

type Code = "USD" | "INR" | "EUR" | "JPY" | "GBP";
const currencies: Record<Code, { name: string; flag: string; inr: number }> = {
  USD: { name: "US Dollar", flag: "🇺🇸", inr: 83.42 },
  INR: { name: "Indian Rupee", flag: "🇮🇳", inr: 1 },
  EUR: { name: "Euro", flag: "🇪🇺", inr: 92.68 },
  JPY: { name: "Japanese Yen", flag: "🇯🇵", inr: 92.68 / 164.7 },
  GBP: { name: "British Pound", flag: "🇬🇧", inr: 106.15 },
};
const cash = (value: number, decimals = 2) =>
  new Intl.NumberFormat("en-IN", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);

export default function CurrencyConversionTargetLesson601({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [source, setSource] = useState<Code>("USD");
  const [target, setTarget] = useState<Code>("INR");
  const [amount, setAmount] = useState(120);
  const [decimals, setDecimals] = useState(2);
  const [feeEnabled, setFeeEnabled] = useState(false);
  const [fee, setFee] = useState(1.8);
  const [tab, setTab] = useState("Interact");
  const [steps, setSteps] = useState(false);
  const [challengeAnswer, setChallengeAnswer] = useState("32438.00");
  const [graded, setGraded] = useState<boolean | null>(true);
  const [solution, setSolution] = useState(false);
  const [challengeIndex, setChallengeIndex] = useState(0);
  const [actions, setActions] = useState(0);
  const reset = () => {
    setSource("USD");
    setTarget("INR");
    setAmount(120);
    setDecimals(2);
    setFeeEnabled(false);
    setFee(1.8);
    setTab("Interact");
    setSteps(false);
    setChallengeAnswer("32438.00");
    setGraded(true);
    setSolution(false);
    setChallengeIndex(0);
    setActions(0);
  };
  useEffect(reset, [resetToken]);
  const act = (fn: () => void) => {
    fn();
    setActions((value) => value + 1);
    onInteraction();
  };
  const rate = currencies[source].inr / currencies[target].inr;
  const gross = amount * rate;
  const result = gross * (feeEnabled ? 1 - fee / 100 : 1);
  const challenge =
    challengeIndex === 0
      ? {
          source: "EUR",
          target: "INR",
          amount: 350,
          rate: 92.68,
          answer: 32438,
        }
      : {
          source: "USD",
          target: "INR",
          amount: 200,
          rate: 83.42,
          answer: 16684,
        };
  const swap = () =>
    act(() => {
      setSource(target);
      setTarget(source);
      setGraded(null);
    });
  const updateCurrency = (kind: "source" | "target", value: Code) =>
    act(() => {
      if (kind === "source") {
        setSource(value);
        if (value === target) setTarget(source);
      } else {
        setTarget(value);
        if (value === source) setSource(target);
      }
    });
  const newChallenge = () =>
    act(() => {
      const next = challengeIndex === 0 ? 1 : 0;
      setChallengeIndex(next);
      setChallengeAnswer("");
      setGraded(null);
      setSolution(false);
    });
  return (
    <section
      className="cur601-page"
      data-testid="finance-mockup-0658"
      data-object-model="dedicated-reciprocal-currency-rate-fee-model"
      data-source={source}
      data-target={target}
      data-rate={rate.toFixed(6)}
      data-amount={amount}
      data-result={result.toFixed(2)}
      data-fee={feeEnabled ? fee : 0}
      data-decimals={decimals}
      data-graded={graded === null ? "" : graded}
      data-challenge={challengeIndex}
      data-actions={actions}
    >
      <header className="cur601-hero">
        <h1>Currency Conversion</h1>
        <p>Apply exchange rates.</p>
        <dl>
          <b>Level: Intermediate-Advanced</b>
          <b>Lab: Applied Modelling Lab</b>
          <b>Time: 6-10 min</b>
          <b>Topic: Finance &amp; Modelling</b>
        </dl>
      </header>
      <nav className="cur601-tabs">
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
        <p className="cur601-note">
          <b>{tab}:</b> Always express the exchange rate as target currency per
          one unit of source currency.
        </p>
      )}
      <section className="cur601-lab">
        <header>
          <h2>1. OBSERVE &amp; MANIPULATE</h2>
          <p>Convert between currencies using exchange rates.</p>
          <div>
            <button onClick={() => act(reset)}>
              <RotateCcw /> Reset
            </button>
            <button onClick={swap}>
              <ArrowLeftRight /> Swap direction
            </button>
          </div>
        </header>
        <div className="cur601-converter">
          <CurrencyCard
            title="I HAVE (SOURCE)"
            code={source}
            amount={amount}
            onCode={(v) => updateCurrency("source", v)}
            onAmount={(v) => act(() => setAmount(v))}
          />
          <b className="cur601-arrow">→</b>
          <section className="cur601-rate">
            <h3>EXCHANGE RATE</h3>
            <p>1 {source} =</p>
            <strong>{cash(rate, rate < 1 ? 4 : 2)}</strong>
            <select
              aria-label="Rate target currency"
              value={target}
              onChange={(e) => updateCurrency("target", e.target.value as Code)}
            >
              {codes().map((code) => (
                <option key={code}>{code}</option>
              ))}
            </select>
            <small>as of 10 May 2025</small>
          </section>
          <b className="cur601-arrow">=</b>
          <section className="cur601-target">
            <h3>I WANT (TARGET)</h3>
            <CurrencySelect
              label="Target currency"
              value={target}
              onChange={(v) => updateCurrency("target", v)}
            />
            <p>
              <strong>{cash(result, decimals)}</strong> {target}
            </p>
            <label>
              Rounded
              <select
                aria-label="Decimal places"
                value={decimals}
                onChange={(e) => act(() => setDecimals(+e.target.value))}
              >
                <option value="0">0 decimals</option>
                <option value="2">2 decimals</option>
                <option value="4">4 decimals</option>
              </select>
            </label>
          </section>
        </div>
        <section className="cur601-fees">
          <label>
            <b>Fees / Spread</b>
            <input
              aria-label="Apply conversion fee"
              type="checkbox"
              checked={feeEnabled}
              onChange={(e) => act(() => setFeeEnabled(e.target.checked))}
            />
            <small>Include bank fee or spread in the conversion.</small>
          </label>
          <label>
            Fee (%)
            <input
              aria-label="Conversion fee percent"
              type="number"
              min="0"
              max="20"
              step=".1"
              value={fee}
              onChange={(e) => act(() => setFee(+e.target.value))}
            />
            %
          </label>
        </section>
      </section>
      <section className="cur601-units">
        <h2>2. NOTICE THE PATTERN — UNIT ANALYSIS</h2>
        <div>
          <strong>
            {cash(amount, 0)}
            <small>{source}</small>
          </strong>
          <b>×</b>
          <strong>
            {cash(rate, 2)}
            <small>
              {target} / 1 {source}
            </small>
          </strong>
          <b>=</b>
          <strong>
            {cash(result, decimals)}
            <small>{target}</small>
          </strong>
          <aside>
            Units cancel correctly.
            <br />
            {source} × ({target} / {source}) = {target} <Check />
          </aside>
        </div>
      </section>
      <section className="cur601-theory">
        <article>
          <h2>3. UNDERSTAND THE RULE</h2>
          <p>
            <b>Key Rule</b>
            <br />
            To convert an amount from source currency (S) to target currency
            (T):
          </p>
          <strong>
            Amount<sub>T</sub> = Amount<sub>S</sub> × Rate<sub>(T per 1 S)</sub>
          </strong>
          <p>If converting back, use the reciprocal rate:</p>
          <strong>
            Amount<sub>S</sub> = Amount<sub>T</sub> × 1 / Rate
            <sub>(T per 1 S)</sub>
          </strong>
        </article>
        <article>
          <h2>WORKED EXAMPLE</h2>
          <button onClick={() => act(() => setSteps((v) => !v))}>
            View steps »
          </button>
          <p>Convert 250 EUR to JPY when 1 EUR = 164.70 JPY.</p>
          <h3>Solution:</h3>
          <strong>
            Amount<sub>JPY</sub> = 250 × 164.70 = 41,175
          </strong>
          <aside>
            <b>Answer:</b> 41,175 JPY
          </aside>
          {steps && (
            <small>Rate units: JPY/EUR. EUR cancels, leaving JPY.</small>
          )}
        </article>
      </section>
      <section className="cur601-misconception">
        <div>
          <h3>⚠ Common misconception</h3>
          <p>
            Multiplying by the wrong rate.
            <br />
            Always ensure the rate is in target per 1 source.
          </p>
        </div>
        <aside>
          <b>Wrong</b>
          <br />
          250 × (1 / 164.70) = 1.517 (Incorrect) ✕
        </aside>
      </section>
      <section className="cur601-challenge">
        <h2>4. TRY INDEPENDENTLY</h2>
        <p>Complete the conversion. Check your answer.</p>
        <div>
          <section>
            <h3>I HAVE (SOURCE)</h3>
            <p>
              <span
                className={`cur601-flag flag-${challenge.source.toLowerCase()}`}
              />{" "}
              <b>{challenge.source}</b>{" "}
              {currencies[challenge.source as Code].name}
            </p>
            <strong>
              {challenge.amount} <small>{challenge.source}</small>
            </strong>
          </section>
          <section>
            <h3>EXCHANGE RATE</h3>
            <p>1 {challenge.source} =</p>
            <strong>{challenge.rate}</strong>
            <small>{challenge.target}</small>
          </section>
          <section>
            <h3>I WANT (TARGET)</h3>
            <p>
              <span
                className={`cur601-flag flag-${challenge.target.toLowerCase()}`}
              />{" "}
              <b>{challenge.target}</b>{" "}
              {currencies[challenge.target as Code].name}
            </p>
            <input
              aria-label="Challenge converted amount"
              value={challengeAnswer}
              onChange={(e) =>
                act(() => {
                  setChallengeAnswer(e.target.value);
                  setGraded(null);
                })
              }
            />
            <output
              className={graded === null ? "" : graded ? "correct" : "wrong"}
            >
              {graded === null
                ? ""
                : graded
                  ? "✓ Correct!"
                  : "Check rate direction."}
            </output>
          </section>
          <aside>
            <b>Need a hint?</b>
            <p>
              Use the rule: Amount<sub>T</sub> = Amount<sub>S</sub> × Rate
            </p>
            {solution && (
              <strong>
                {challenge.amount} × {challenge.rate} = {cash(challenge.answer)}
              </strong>
            )}
            <button onClick={() => act(() => setSolution((v) => !v))}>
              Show Solution
            </button>
          </aside>
        </div>
        <footer>
          <button
            onClick={() =>
              act(() =>
                setGraded(
                  Math.abs(
                    Number(challengeAnswer.replace(/,/g, "")) -
                      challenge.answer,
                  ) < 0.01,
                ),
              )
            }
          >
            ✓ Check Answer
          </button>
          <button onClick={newChallenge}>
            <RotateCcw /> New Challenge
          </button>
        </footer>
      </section>
      <nav className="cur601-adjacent">
        <a href="/lessons/discrete-and-applied-mathematics/600-inflation">
          ←{" "}
          <span>
            PREVIOUS LESSON<b>Inflation</b>
          </span>
        </a>
        <a href="/lessons/discrete-and-applied-mathematics/602-profit-loss-markup-and-margin">
          <span>
            NEXT LESSON<b>Profit, Loss, Markup and Margin</b>
          </span>{" "}
          →
        </a>
      </nav>
    </section>
  );
}
const codes = () => Object.keys(currencies) as Code[];
function CurrencySelect({
  label,
  value,
  onChange,
}: {
  label: string;
  value: Code;
  onChange: (v: Code) => void;
}) {
  return (
    <label className="cur601-select">
      <span className={`cur601-flag flag-${value.toLowerCase()}`}>
        {currencies[value].flag}
      </span>
      <b>{value}</b>
      <small>{currencies[value].name}</small>
      <select
        aria-label={label}
        value={value}
        onChange={(e) => onChange(e.target.value as Code)}
      >
        {codes().map((code) => (
          <option key={code}>{code}</option>
        ))}
      </select>
    </label>
  );
}
function CurrencyCard({
  title,
  code,
  amount,
  onCode,
  onAmount,
}: {
  title: string;
  code: Code;
  amount: number;
  onCode: (v: Code) => void;
  onAmount: (v: number) => void;
}) {
  return (
    <section className="cur601-source">
      <h3>{title}</h3>
      <CurrencySelect label="Source currency" value={code} onChange={onCode} />
      <p>
        <input
          aria-label="Source amount"
          type="number"
          min="0"
          max="100000"
          value={amount}
          onChange={(e) => onAmount(+e.target.value)}
        />{" "}
        {code}
      </p>
      <label>
        Amount
        <input
          aria-label="Source amount slider"
          type="range"
          min="0"
          max="100000"
          step="10"
          value={amount}
          onChange={(e) => onAmount(+e.target.value)}
        />
        <small>
          0 <i>100,000</i>
        </small>
      </label>
    </section>
  );
}
