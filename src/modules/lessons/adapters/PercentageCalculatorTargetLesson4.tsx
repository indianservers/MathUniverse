import {
  ArrowLeft,
  ArrowRight,
  HelpCircle,
  MousePointer2,
  RotateCcw,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { LessonAdapterProps } from "../types";
import "./PercentageCalculatorTargetLesson4.css";

const VIEWS = [
  "Interaction + visualization",
  "Explain",
  "Examples",
  "Formulas",
  "Know more",
];

export default function PercentageCalculatorTargetLesson4({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [percent, setPercent] = useState(15);
  const [base, setBase] = useState(240);
  const [view, setView] = useState(0);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState<"idle" | "correct" | "incorrect">(
    "idle",
  );
  const part = useMemo(() => (percent * base) / 100, [percent, base]);
  useEffect(() => {
    setPercent(15);
    setBase(240);
    setView(0);
    setAnswer("");
    setFeedback("idle");
  }, [resetToken]);
  const updatePercent = (value: number) => {
    setPercent(Math.max(0, Math.min(100, value)));
    setFeedback("idle");
    onInteraction();
  };
  const updateBase = (value: number) => {
    setBase(Math.max(0, Math.min(500, value)));
    setFeedback("idle");
    onInteraction();
  };
  const check = () => {
    setFeedback(
      Math.abs(Number(answer) - 240) < 0.001 ? "correct" : "incorrect",
    );
    onInteraction();
  };
  return (
    <div
      className="target-percent-page"
      data-testid="calculator-mockup-0004"
      data-dedicated-lesson="4"
      data-object-model="draggable-percent-base-hundred-grid-part-equation-practice-model"
      data-percent={percent}
      data-base={base}
      data-part={format(part)}
      data-view={view}
      data-answer={answer}
      data-feedback={feedback}
    >
      <nav className="target-percent-breadcrumb">
        <a href="/">←</a>
        <a href="/">Home</a>
        <span>›</span>
        <a href="/lessons">Lessons</a>
        <span>›</span>
        <a href="/lessons/core-workspaces">Core Workspaces</a>
        <span>›</span>
        <b>Percentage Calculator</b>
      </nav>
      <header className="target-percent-header">
        <div>
          <span>CORE WORKSPACES</span>
          <h1>Percentage Calculator</h1>
          <p>Apply percentages to practical problems.</p>
          <div>
            <b>◉ Foundation</b>
            <b>⌘ Middle school +</b>
            <button
              type="button"
              onClick={() => {
                setView(0);
                onInteraction();
              }}
            >
              ⚑ English (English)⌄
            </button>
            <button
              type="button"
              onClick={() => {
                setPercent(15);
                setBase(240);
                setAnswer("");
                setFeedback("idle");
                onInteraction();
              }}
            >
              <RotateCcw />
              Reset
            </button>
            <button
              type="button"
              onClick={() =>
                navigator.clipboard?.writeText(
                  `${percent}% of ${base} = ${format(part)}`,
                )
              }
            >
              Share
            </button>
          </div>
        </div>
        <aside>
          <Summary label="Topic" value="Percentages" />
          <Summary label="Estimated time" value="6-10 min" />
          <Summary label="Mode" value="Learn & Explore" />
        </aside>
      </header>
      <nav className="target-percent-tabs">
        {VIEWS.map((label, index) => (
          <button
            type="button"
            key={label}
            className={view === index ? "active" : ""}
            onClick={() => {
              setView(index);
              onInteraction();
            }}
          >
            {label}
          </button>
        ))}
      </nav>
      <div className="target-percent-columns">
        <main>
          <section className="target-percent-visual">
            <header>
              <h2>
                Visual model: {percent}% of {base}
              </h2>
              <span>
                <MousePointer2 /> Drag the handles to explore
              </span>
              <HelpCircle />
            </header>
            <div className="target-percent-model">
              <div className="percent-hundred">
                <div className="percent-column-labels">
                  {Array.from({ length: 10 }, (_, i) => (
                    <b key={i}>{i + 1}</b>
                  ))}
                </div>
                <div className="percent-row-labels">
                  {Array.from({ length: 10 }, (_, i) => (
                    <b key={i}>{(i + 1) * 10}</b>
                  ))}
                </div>
                <div className="percent-grid">
                  {Array.from({ length: 100 }, (_, i) => (
                    <i
                      key={i}
                      className={i < Math.round(percent) ? "fill" : ""}
                    />
                  ))}
                </div>
                <p>
                  <i /> {Math.round(percent)} shaded squares ={" "}
                  {Math.round(percent)} hundredths
                </p>
                <QuickTable base={base} percent={percent} />
              </div>
              <div className="percent-bars">
                <RangeModel
                  label="Percent (per 100)"
                  value={percent}
                  max={100}
                  color="blue"
                  onChange={updatePercent}
                />
                <RangeModel
                  label="Base (the whole)"
                  value={base}
                  max={500}
                  color="violet"
                  onChange={updateBase}
                />
                <div className="percent-part">
                  <h3>Part (the result)</h3>
                  <div>
                    <i
                      style={{
                        width: `${base ? Math.min(100, (part / base) * 100) : 0}%`,
                      }}
                    />
                  </div>
                  <span>0</span>
                  <span>{format(base)}</span>
                  <b>Part = {format(part)}</b>
                </div>
                <div className="percent-equation">
                  <span>{percent}%</span>
                  <span>of</span>
                  <span>{format(base)}</span>
                  <span>=</span>
                  <strong>{percent}/100</strong>
                  <span>×</span>
                  <span>{format(base)}</span>
                  <span>=</span>
                  <b>{format(part)}</b>
                </div>
                <p>
                  <MousePointer2 /> Click and drag the percent slider or the
                  base handle to see how the part changes.
                </p>
              </div>
            </div>
          </section>
          <section className="target-percent-practice">
            <div>
              <h3>Practice question</h3>
              <p>If 15% of a quantity is 36, what is the whole?</p>
            </div>
            <div>
              <h3>Your feedback</h3>
              <p>
                {feedback === "idle"
                  ? "Enter an answer and click Check to see feedback."
                  : feedback === "correct"
                    ? "Correct. 36 ÷ 0.15 = 240."
                    : "Try again. Divide 36 by 0.15."}
              </p>
            </div>
          </section>
        </main>
        <aside className="target-percent-side">
          <h2>
            Concept trace <HelpCircle />
          </h2>
          <Trace
            label="Percent"
            note="Per 100 parts."
            value={`${percent} per 100`}
            tone="blue"
          />
          <Trace
            label="Base"
            note="The whole amount."
            value={format(base)}
            tone="cyan"
          />
          <Trace
            label="Part"
            note="The portion you're finding."
            value={format(part)}
            tone="green"
          />
          <Trace
            label="Rule"
            note="Part = Percent × Base / 100"
            value=""
            tone="amber"
          />
          <section className="percent-adjust">
            <h3>Adjust values</h3>
            <label>
              Percent (per 100)
              <span>
                <input
                  aria-label="Percent numeric value"
                  value={percent}
                  onChange={(event) =>
                    updatePercent(Number(event.target.value))
                  }
                />
                %
              </span>
              <input
                aria-label="Percent drag control"
                type="range"
                min="0"
                max="100"
                value={percent}
                onChange={(event) => updatePercent(Number(event.target.value))}
              />
            </label>
            <label>
              Base (whole)
              <span>
                <input
                  aria-label="Base numeric value"
                  value={base}
                  onChange={(event) => updateBase(Number(event.target.value))}
                />
              </span>
              <input
                aria-label="Base drag control"
                type="range"
                min="0"
                max="500"
                value={base}
                onChange={(event) => updateBase(Number(event.target.value))}
              />
            </label>
          </section>
          <section className="percent-result">
            <small>Result</small>
            <b>Part = {format(part)}</b>
          </section>
          <section className="percent-yourself">
            <h3>Try it yourself</h3>
            <p>If 15% of a quantity is 36, what is the whole?</p>
            <div>
              <input
                aria-label="Percentage practice answer"
                placeholder="Enter your answer"
                value={answer}
                onChange={(event) => {
                  setAnswer(event.target.value);
                  setFeedback("idle");
                }}
              />
              <button type="button" onClick={check}>
                Check
              </button>
            </div>
          </section>
        </aside>
      </div>
      <nav className="target-percent-nav">
        <a href="/lessons/core-workspaces/3-mixed-numbers">
          <ArrowLeft />
          <span>
            <b>Previous</b>Mixed Numbers
          </span>
        </a>
        <a href="/lessons/core-workspaces/5-ratio-calculator">
          <span>
            <b>Next</b>Ratio Calculator
          </span>
          <ArrowRight />
        </a>
      </nav>
    </div>
  );
}

function Summary({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span>{label}</span>
      <b>{value}</b>
    </div>
  );
}
function Trace({
  label,
  note,
  value,
  tone,
}: {
  label: string;
  note: string;
  value: string;
  tone: string;
}) {
  return (
    <section className={`percent-trace ${tone}`}>
      <i />
      <div>
        <b>{label}</b>
        <p>{note}</p>
      </div>
      <strong>{value}</strong>
    </section>
  );
}
function RangeModel({
  label,
  value,
  max,
  color,
  onChange,
}: {
  label: string;
  value: number;
  max: number;
  color: "blue" | "violet";
  onChange: (value: number) => void;
}) {
  return (
    <section className={`percent-range-model ${color}`}>
      <h3>{label}</h3>
      {color === "blue" ? (
        <div className="percent-ticks">
          {[0, 25, 50, 75, 100].map((v) => (
            <span key={v}>{v}%</span>
          ))}
        </div>
      ) : null}
      <div>
        <i style={{ width: `${(value / max) * 100}%` }} />
      </div>
      <input
        aria-label={`${label} visual drag handle`}
        type="range"
        min="0"
        max={max}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
      />
      <span>0</span>
      <span>{format(value)}</span>
      <b>
        {color === "blue"
          ? `${format(value)} per 100`
          : `Whole = ${format(value)}`}
      </b>
    </section>
  );
}
function QuickTable({ base, percent }: { base: number; percent: number }) {
  const values = [5, 10, 15, 20];
  return (
    <div className="percent-quick">
      <h3>Percent quick look (of {format(base)})</h3>
      <table>
        <tbody>
          <tr>
            <th>Percent</th>
            {values.map((v) => (
              <td className={Math.round(percent) === v ? "active" : ""} key={v}>
                {v}%
              </td>
            ))}
          </tr>
          <tr>
            <th>Part</th>
            {values.map((v) => (
              <td className={Math.round(percent) === v ? "active" : ""} key={v}>
                {format((base * v) / 100)}
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}
function format(value: number) {
  return Number.isInteger(value)
    ? String(value)
    : value.toFixed(2).replace(/0+$/, "").replace(/\.$/, "");
}
