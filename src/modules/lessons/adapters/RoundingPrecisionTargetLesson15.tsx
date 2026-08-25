import { Check, Eye, Lightbulb, RotateCcw } from "lucide-react";
import { useEffect, useState } from "react";
import type { LessonAdapterProps } from "../types";
import "./RoundingPrecisionTargetLesson15.css";

const TABS = [
  "Interaction + visualization",
  "Explain",
  "Examples",
  "Formulas",
  "Know more",
];
const PRACTICE = [
  [22, 7, 3],
  [17, 6, 2],
  [19, 8, 2],
] as const;
const safeDenominator = (value: number) =>
  value === 0 ? 1 : Math.max(-99, Math.min(99, Math.round(value)));

export default function RoundingPrecisionTargetLesson15({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [numerator, setNumerator] = useState(10),
    [denominator, setDenominator] = useState(3),
    [precision, setPrecision] = useState(2),
    [view, setView] = useState(0),
    [actions, setActions] = useState(0),
    [problem, setProblem] = useState(0),
    [revealed, setRevealed] = useState(true);
  const exact = numerator / denominator,
    reported = Number(exact.toFixed(precision)),
    fixed = reported.toFixed(precision),
    exactLabel = Number.isInteger(exact)
      ? String(exact)
      : `${exact.toFixed(5)}…`,
    scaled = Math.abs(exact) * 10 ** precision,
    nextDigit = Math.floor(scaled * 10) % 10,
    error = Math.abs(exact - reported);
  const [practiceN, practiceD, practicePrecision] = PRACTICE[problem],
    practiceExact = practiceN / practiceD,
    practiceReported = practiceExact.toFixed(practicePrecision);
  const touch = () => {
    setActions((v) => v + 1);
    onInteraction();
  };
  const reset = () => {
    setNumerator(10);
    setDenominator(3);
    setPrecision(2);
    setView(0);
    setActions(0);
    setProblem(0);
    setRevealed(true);
    onInteraction();
  };
  useEffect(() => {
    setNumerator(10);
    setDenominator(3);
    setPrecision(2);
    setView(0);
    setActions(0);
    setProblem(0);
    setRevealed(true);
  }, [resetToken]);
  const marker = (value: number) =>
    Math.max(0, Math.min(100, ((value - (reported - 0.03)) / 0.06) * 100));
  return (
    <div
      className="target-rounding-page"
      data-testid="calculator-mockup-0015"
      data-dedicated-lesson="15"
      data-object-model="editable-fraction-exact-decimal-precision-slider-next-digit-reported-error-practice-model"
      data-numerator={numerator}
      data-denominator={denominator}
      data-precision={precision}
      data-exact={exactLabel}
      data-reported={fixed}
      data-next-digit={nextDigit}
      data-error={error.toFixed(6)}
      data-view={view}
      data-actions={actions}
      data-problem={problem}
      data-revealed={revealed}
    >
      <nav className="rounding-breadcrumb">
        <a href="/">←</a>
        <a href="/">Home</a>
        <span>›</span>
        <a href="/lessons">Lessons</a>
        <span>›</span>
        <a href="/lessons/core-workspaces">Core Workspaces</a>
        <span>›</span>
        <b>15 Rounding And Precision</b>
      </nav>
      <header className="rounding-header">
        <span>CORE WORKSPACES</span>
        <span>SCIENTIFIC CALCULATOR</span>
        <h1>Rounding and Precision</h1>
        <p>Understand exact values, displayed precision, and rounding rules.</p>
        <section>
          <b>⚲ Foundational-Advanced</b>
          <b>⌁ Calculator Lab</b>
          <b>▤ Scientific Calculator</b>
          <b>◷ 6-10 min</b>
        </section>
        <nav>
          <button type="button">⚒ English (English)⌄</button>
          <button type="button" onClick={reset}>
            <RotateCcw />
            Reset
          </button>
          <button
            type="button"
            onClick={() =>
              navigator.clipboard?.writeText(
                `${numerator}/${denominator} ≈ ${fixed}`,
              )
            }
          >
            ⌘ Share
          </button>
        </nav>
        <button type="button" onClick={touch}>
          ↗ Workspace
        </button>
      </header>
      <nav className="rounding-tabs">
        {TABS.map((tab, index) => (
          <button
            type="button"
            className={view === index ? "active" : ""}
            onClick={() => {
              setView(index);
              touch();
            }}
            key={tab}
          >
            {tab}
          </button>
        ))}
      </nav>
      <section className="rounding-lab">
        <div className="rounding-columns">
          <main>
            <header>
              <small>PRECISION LAB</small>
              <h2>Exact value vs displayed precision</h2>
              <p>
                See how rounding changes what we report — not the exact value.
              </p>
            </header>
            <section className="exact-card">
              <h3>
                Exact value <small>(never rounded)</small>
              </h3>
              <div>
                <label>
                  <input
                    aria-label="Rounding numerator"
                    type="number"
                    value={numerator}
                    onChange={(e) => {
                      setNumerator(Math.round(Number(e.target.value)));
                      touch();
                    }}
                  />
                  <span>{numerator}</span>
                  <hr />
                  <input
                    aria-label="Rounding denominator"
                    type="number"
                    value={denominator}
                    onChange={(e) => {
                      setDenominator(safeDenominator(Number(e.target.value)));
                      touch();
                    }}
                  />
                  <span>{denominator}</span>
                </label>
                <b>=</b>
                <output>{exactLabel}</output>
                <aside>
                  <strong>Repeating digit</strong>
                  <p>The decimal continues according to the exact fraction.</p>
                </aside>
              </div>
              <p>The decimal representation is calculated from the fraction.</p>
            </section>
            <section className="precision-card">
              <h3>Set displayed precision</h3>
              <p>Drag the handle to choose how many decimal places to show.</p>
              <div>
                <input
                  aria-label="Displayed precision drag control"
                  type="range"
                  min="1"
                  max="4"
                  value={precision}
                  onChange={(e) => {
                    setPrecision(Number(e.target.value));
                    touch();
                  }}
                />
                <span>
                  <b>1</b>
                  <b>2</b>
                  <b>3</b>
                  <b>4</b>
                </span>
                <output style={{ left: `${((precision - 1) / 3) * 100}%` }}>
                  {precision}
                </output>
              </div>
              <strong>
                Currently: {precision} decimal{" "}
                {precision === 1 ? "place" : "places"}
              </strong>
              <article>
                <div>
                  <b>
                    Report <small>(rounded output)</small>
                  </b>
                  <p>to {precision} decimal places</p>
                </div>
                <output>{fixed}</output>
                <div>
                  <b>Equation view</b>
                  <p>
                    {numerator}/{denominator} &nbsp; ≈ &nbsp; {fixed} &nbsp; (to{" "}
                    {precision} d.p.)
                  </p>
                </div>
              </article>
            </section>
            <section className="rounding-rule">
              <div>
                <h3>Rounding rule (next digit rule)</h3>
                <p>
                  Look at the next digit after the last place you keep.
                  <br />
                  If it is 5 or more, round up. If it is less than 5, keep the
                  digit the same.
                </p>
              </div>
              <p>
                For {fixed}, next digit is <b>{nextDigit}</b> (
                {nextDigit >= 5 ? "≥ 5" : "< 5"})<br />
                <strong>
                  So we {nextDigit >= 5 ? "round up" : "keep"} {fixed}
                </strong>
              </p>
            </section>
            <section className="rounding-line">
              <h3>Where does the exact value lie?</h3>
              <div>
                <i />
                <span
                  className="reported"
                  style={{ left: `${marker(reported)}%` }}
                >
                  <b>{fixed}</b>
                </span>
                <span className="exact" style={{ left: `${marker(exact)}%` }}>
                  <b>{exactLabel} (exact)</b>
                </span>
                {Array.from({ length: 7 }, (_, i) =>
                  (reported - 0.03 + i * 0.01).toFixed(2),
                ).map((label, i) => (
                  <label style={{ left: `${(i / 6) * 100}%` }} key={label}>
                    {label}
                  </label>
                ))}
              </div>
              <p>
                The exact value is{" "}
                {exact > reported
                  ? "slightly greater than"
                  : exact < reported
                    ? "slightly less than"
                    : "equal to"}{" "}
                {fixed}.
              </p>
              <aside>
                ⚠ <b>Rounding introduces a small difference.</b>
                <span>
                  Error = |{exactLabel} − {fixed}| = {error.toFixed(6)}…
                </span>
              </aside>
            </section>
          </main>
          <aside className="rounding-trace">
            <h3>Concept trace</h3>
            <b>Exact → Displayed → Reported</b>
            <p>Follow the steps.</p>
            <Trace
              title="Exact division"
              value={`${numerator}/${denominator}`}
              note="This is the exact value."
            />
            <Trace
              title="Decimal form"
              value={exactLabel}
              note="The decimal comes from division."
            />
            <Trace
              title="Displayed precision"
              value={`${precision} decimal places`}
              note="We choose how many decimal places to show."
            />
            <Trace
              title="Rounded output"
              value={fixed}
              note="This is what we report."
            />
            <Trace
              title="Rounding rule"
              value="Round only at the reporting step."
              note="Never round during intermediate steps."
            />
            <section className="rounding-key">
              <Lightbulb />
              <b>Key idea</b>
              <p>Exact value is infinite; precision is a choice.</p>
            </section>
          </aside>
        </div>
        <section className="rounding-practice">
          <header>
            <h3>Practice</h3>
            <p>Try another example.</p>
          </header>
          <div>
            <article>
              <b>Round to {practicePrecision} decimal places</b>
              <p>
                {practiceN}/{practiceD} &nbsp; to {practicePrecision} decimal
                places
              </p>
              <button
                type="button"
                onClick={() => {
                  setRevealed((v) => !v);
                  onInteraction();
                }}
              >
                <Eye />
                {revealed ? "Hide answer" : "Show answer"}
              </button>
            </article>
            <article>
              <b>Answer</b>
              {revealed ? (
                <>
                  <output>{practiceReported}</output>
                  <p>
                    {practiceN}/{practiceD} = {practiceExact.toFixed(9)}… &nbsp;
                    (rounded to {practicePrecision} d.p.)
                  </p>
                  <Check />
                </>
              ) : (
                <p>Use the next-digit rule.</p>
              )}
            </article>
          </div>
          <button
            type="button"
            onClick={() => {
              setProblem((problem + 1) % PRACTICE.length);
              setRevealed(false);
              touch();
            }}
          >
            <RotateCcw />
            New problem
          </button>
        </section>
      </section>
      <nav className="rounding-neighbors">
        <a href="/lessons/core-workspaces/14-absolute-value">
          ←{" "}
          <span>
            <small>PREVIOUS</small>Absolute Value
          </span>
        </a>
        <a href="/lessons/core-workspaces/16-constants-library">
          <span>
            <small>NEXT</small>Constants Library
          </span>{" "}
          →
        </a>
      </nav>
    </div>
  );
}
function Trace({
  title,
  value,
  note,
}: {
  title: string;
  value: string;
  note: string;
}) {
  return (
    <section>
      <h4>◉ &nbsp; {title}</h4>
      <b>{value}</b>
      <p>{note}</p>
      <Check />
    </section>
  );
}
