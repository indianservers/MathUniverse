import { Check, Maximize2, Play, RotateCcw } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { LessonAdapterProps } from "../../types";
import "./CompoundInterestTargetLesson592.css";

const cash = (value: number) =>
  new Intl.NumberFormat("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);

export default function CompoundInterestTargetLesson592({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [principal, setPrincipal] = useState(10000);
  const [rate, setRate] = useState(8);
  const [frequency, setFrequency] = useState(1);
  const [time, setTime] = useState(5);
  const [displayYear, setDisplayYear] = useState(5);
  const [playing, setPlaying] = useState(false);
  const [tab, setTab] = useState("Interact");
  const [choice, setChoice] = useState("");
  const [graded, setGraded] = useState<boolean | null>(null);
  const [actions, setActions] = useState(0);
  const timer = useRef<number | null>(null);

  const reset = () => {
    setPrincipal(10000);
    setRate(8);
    setFrequency(1);
    setTime(5);
    setDisplayYear(5);
    setPlaying(false);
    setTab("Interact");
    setChoice("");
    setGraded(null);
    setActions(0);
  };
  useEffect(reset, [resetToken]);
  useEffect(
    () => () => {
      if (timer.current !== null) window.clearInterval(timer.current);
    },
    [],
  );

  const amountAt = (year: number) =>
    principal * (1 + rate / 100 / frequency) ** (frequency * year);
  const rows = (() => {
    let opening = principal;
    return Array.from({ length: Math.floor(time) + 1 }, (_, year) => {
      const amount = amountAt(year);
      const earned = year === 0 ? 0 : amount - opening;
      const row = {
        year,
        opening,
        earned,
        amount,
        simple: principal * (1 + (rate / 100) * year),
      };
      opening = amount;
      return row;
    });
  })();
  const shownYear = Math.min(displayYear, time);
  const amount = amountAt(shownYear);
  const simple = principal * (1 + (rate / 100) * shownYear);
  const interest = amount - principal;
  const extra = amount - simple;
  const maxValue =
    Math.ceil(Math.max(...rows.map((row) => row.amount)) / 4000) * 4000;
  const x = (year: number) => 62 + (year / Math.max(1, time)) * 510;
  const y = (value: number) => 292 - (value / maxValue) * 244;

  const act = (fn: () => void) => {
    fn();
    setActions((value) => value + 1);
    onInteraction();
  };
  const update = (setter: (value: number) => void, value: number) =>
    act(() => {
      setter(value);
      setDisplayYear((year) =>
        Math.min(year, setter === setTime ? value : time),
      );
      setPlaying(false);
    });
  const togglePlay = () => {
    if (timer.current !== null) window.clearInterval(timer.current);
    if (playing) {
      timer.current = null;
      act(() => setPlaying(false));
      return;
    }
    act(() => {
      setDisplayYear(0);
      setPlaying(true);
    });
    let year = 0;
    timer.current = window.setInterval(() => {
      year += 1;
      setDisplayYear(Math.min(year, time));
      onInteraction();
      if (year >= time) {
        if (timer.current !== null) window.clearInterval(timer.current);
        timer.current = null;
        setPlaying(false);
      }
    }, 450);
  };

  const challengeAmount = 15000 * (1 + 0.07 / 2) ** 4;
  const options = [16078.66, challengeAmount, 16250, 15980];

  return (
    <section
      className="ci592-page"
      data-testid="finance-mockup-0649"
      data-object-model="dedicated-periodic-compound-growth-model"
      data-principal={principal}
      data-rate={rate}
      data-frequency={frequency}
      data-time={time}
      data-year={shownYear}
      data-amount={amount.toFixed(2)}
      data-simple={simple.toFixed(2)}
      data-interest={interest.toFixed(2)}
      data-graded={graded === null ? "" : graded}
      data-actions={actions}
    >
      <header className="ci592-hero">
        <div>
          <h1>592. Compound Interest</h1>
          <p>Model repeated growth.</p>
          <p className="ci592-objective">
            <b>Objective</b> Model and compare compound interest using A = P(1 +
            r/n)<sup>nt</sup>.
          </p>
          <span className="ci592-meta">
            <b>Subject: Discrete &amp; Applied Math</b>
            <b>Level: Intermediate-Advanced</b>
            <b>Time: 6-10 min</b>
            <b>Tool: Interactive Model</b>
            <b>Language: English</b>
          </span>
        </div>
        <aside>
          <b>Key formula</b>
          <strong>
            A = P(1 + r/n)<sup>nt</sup>
          </strong>
          <small>
            P = principal (initial amount)
            <br />r = annual rate (decimal)
            <br />n = compounding times per year
            <br />t = time in years
          </small>
        </aside>
      </header>

      <nav className="ci592-tabs">
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
        <p className="ci592-tab-note">
          <b>{tab}:</b> Each compounding period adds interest to the balance
          used by the next period.
        </p>
      )}

      <section className="ci592-lab">
        <main>
          <header>
            <span>INTERACTIVE MODEL</span>
            <h2>Compound growth timeline</h2>
          </header>
          <div className="ci592-chart">
            <button title="Expand chart">
              <Maximize2 />
            </button>
            <svg
              viewBox="0 0 620 330"
              role="img"
              aria-label="Compound and simple interest balance chart"
            >
              {[0, 0.25, 0.5, 0.75, 1].map((part) => (
                <g key={part}>
                  <line
                    x1="60"
                    x2="585"
                    y1={292 - part * 244}
                    y2={292 - part * 244}
                  />
                  <text x="49" y={296 - part * 244}>
                    {Math.round((maxValue * part) / 1000)}k
                  </text>
                </g>
              ))}
              <text
                className="axis-title"
                x="15"
                y="175"
                transform="rotate(-90 15 175)"
              >
                Balance (₹)
              </text>
              {rows.map((row) => {
                const barTop = y(row.amount),
                  base = y(principal);
                return (
                  <g key={row.year} opacity={row.year <= shownYear ? 1 : 0.28}>
                    <rect
                      className="principal"
                      x={x(row.year) - 14}
                      y={base}
                      width="28"
                      height={292 - base}
                    />
                    <rect
                      className="earned"
                      x={x(row.year) - 14}
                      y={barTop}
                      width="28"
                      height={base - barTop}
                    />
                    <circle cx={x(row.year)} cy={barTop} r="5" />
                    <text
                      className="amount-label"
                      x={x(row.year)}
                      y={barTop - 11}
                    >
                      {cash(row.amount)}
                    </text>
                    <text x={x(row.year)} y="312">
                      {row.year}
                    </text>
                  </g>
                );
              })}
              <polyline
                className="compound"
                points={rows
                  .filter((r) => r.year <= shownYear)
                  .map((r) => `${x(r.year)},${y(r.amount)}`)
                  .join(" ")}
              />
              <polyline
                className="simple"
                points={rows
                  .map((r) => `${x(r.year)},${y(r.simple)}`)
                  .join(" ")}
              />
              <text className="axis-title" x="322" y="327">
                Time (years)
              </text>
            </svg>
            <div className="ci592-legend">
              <span>● Total balance A</span>
              <span>– – Simple interest (comparison)</span>
              <span>■ Principal</span>
              <span>■ Interest earned</span>
            </div>
          </div>
          <div className="ci592-playback">
            <p>Drag the time slider or play to see growth.</p>
            <input
              aria-label="Displayed year"
              type="range"
              min="0"
              max={time}
              step="1"
              value={shownYear}
              onChange={(event) => update(setDisplayYear, +event.target.value)}
            />
            <output>{shownYear}</output>
            <button
              title={playing ? "Pause animation" : "Play animation"}
              onClick={togglePlay}
            >
              {playing ? "Ⅱ" : <Play />}
            </button>
            <button
              title="Reset animation"
              onClick={() =>
                act(() => {
                  setDisplayYear(time);
                  setPlaying(false);
                })
              }
            >
              <RotateCcw />
            </button>
          </div>
          <div className="ci592-table-wrap">
            <h3>
              BALANCE BUILD-UP (COMPOUNDED{" "}
              {frequency === 1 ? "ANNUALLY" : `${frequency} TIMES PER YEAR`})
            </h3>
            <table>
              <thead>
                <tr>
                  <th>Year (t)</th>
                  <th>Start Balance (₹)</th>
                  <th>Interest Earned (₹)</th>
                  <th>End Balance (₹)</th>
                  <th>Simple Interest (₹)</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.year}>
                    <td>{row.year}</td>
                    <td>{cash(row.opening)}</td>
                    <td>{row.year ? cash(row.earned) : "—"}</td>
                    <td>
                      <b>{cash(row.amount)}</b>
                    </td>
                    <td>{cash(row.simple)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <small>All values rounded to 2 decimal places.</small>
          </div>
        </main>

        <aside className="ci592-controls">
          <h3>MANIPULATE</h3>
          <Control
            label="Principal (P)"
            min={100}
            max={100000}
            step={100}
            value={principal}
            suffix="₹"
            onChange={(v) => update(setPrincipal, v)}
          />
          <Control
            label="Annual rate (r)"
            min={0}
            max={25}
            step={0.5}
            value={rate}
            suffix="%"
            onChange={(v) => update(setRate, v)}
          />
          <Control
            label="Compounding per year (n)"
            min={1}
            max={12}
            step={1}
            value={frequency}
            onChange={(v) => update(setFrequency, v)}
          />
          <Control
            label="Time (t)"
            min={0}
            max={30}
            step={1}
            value={time}
            suffix="years"
            onChange={(v) => update(setTime, v)}
          />
          <section className="ci592-readouts">
            <h3>READOUTS AT t = {shownYear} YEARS</h3>
            <p>
              Compound balance (A)<strong>₹ {cash(amount)}</strong>
            </p>
            <p>
              Simple interest balance<strong>₹ {cash(simple)}</strong>
            </p>
            <p>
              Interest earned (compound)<strong>₹ {cash(interest)}</strong>
            </p>
            <p>
              Extra earned vs. simple<strong>₹ {cash(extra)}</strong>
            </p>
          </section>
          <section className="ci592-pattern">
            <h3>NOTICE THE PATTERN</h3>
            <p>
              Interest each year is calculated on a larger base, so interest
              earned each period increases.
            </p>
            <p>The gap between compound and simple interest keeps widening.</p>
          </section>
          <section className="ci592-warning">
            <h3>COMMON MISCONCEPTION</h3>
            <p>
              Adding r% of the principal each year is simple interest, not
              compound interest.
            </p>
            <p>Compound interest earns on previous interest too.</p>
          </section>
        </aside>
      </section>

      <section className="ci592-theory">
        <article>
          <h3>UNDERSTAND THE RULE</h3>
          <p>
            Compound interest after t years with n compounding periods per year:
          </p>
          <strong>
            A = P(1 + r/n)<sup>nt</sup>
          </strong>
          <p>
            Where P = principal, r = annual decimal rate, n = periods per year,
            and t = years.
          </p>
        </article>
        <article>
          <h3>WORKED EXAMPLE</h3>
          <p>
            A sum of ₹20,000 is invested at 9% p.a., compounded quarterly, for 3
            years.
          </p>
          <p>
            A = 20000(1 + 0.09/4)<sup>12</sup>
          </p>
          <b>Amount after 3 years = ₹26,096.10</b>
        </article>
        <article className="ci592-challenge">
          <h3>QUICK CHALLENGE</h3>
          <p>
            A principal of ₹15,000 is invested at 7% p.a., compounded
            semiannually, for 2 years. What is the amount?
          </p>
          {options.map((option, index) => (
            <label
              key={option}
              className={choice === String(option) ? "selected" : ""}
            >
              <input
                type="radio"
                name="compound-answer"
                value={option}
                checked={choice === String(option)}
                onChange={() =>
                  act(() => {
                    setChoice(String(option));
                    setGraded(null);
                  })
                }
              />
              <span>{String.fromCharCode(65 + index)}</span>₹{cash(option)}
            </label>
          ))}
          <button
            onClick={() =>
              act(() => setGraded(Number(choice) === challengeAmount))
            }
          >
            <Check /> Check Answer
          </button>
          <output
            className={graded === null ? "" : graded ? "correct" : "wrong"}
          >
            {graded === null
              ? ""
              : graded
                ? "Correct: periodic compounding applied."
                : "Try using n=2 and nt=4."}
          </output>
        </article>
      </section>

      <nav className="ci592-adjacent">
        <a href="/lessons/discrete-and-applied-mathematics/591-simple-interest">
          ←{" "}
          <span>
            Previous Lesson<b>Simple Interest</b>
          </span>
        </a>
        <a href="/lessons">▦ Back to Lessons</a>
        <a href="/lessons/discrete-and-applied-mathematics/593-effective-interest-rate">
          <span>
            Next Lesson<b>Effective Interest Rate</b>
          </span>{" "}
          →
        </a>
      </nav>
    </section>
  );
}

function Control({
  label,
  min,
  max,
  step,
  value,
  suffix,
  onChange,
}: {
  label: string;
  min: number;
  max: number;
  step: number;
  value: number;
  suffix?: string;
  onChange: (value: number) => void;
}) {
  return (
    <label className="ci592-control">
      <b>{label}</b>
      <span>
        <input
          type="range"
          aria-label={`${label} slider`}
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(event) => onChange(+event.target.value)}
        />
        <input
          aria-label={label}
          type="number"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(event) => onChange(+event.target.value)}
        />
        {suffix && <em>{suffix}</em>}
      </span>
      <small>
        {cash(min)} <i>{cash(max)}</i>
      </small>
    </label>
  );
}
