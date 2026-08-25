import { ArrowRight, Eye, Info, RotateCcw } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { LessonAdapterProps } from "../types";
import "./LogarithmsTargetLesson8.css";
const VIEWS = [
  "Interaction + visualization",
  "Explain",
  "Examples",
  "Formulas",
  "Know more",
];
export default function LogarithmsTargetLesson8({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [base, setBase] = useState(10),
    [exponent, setExponent] = useState(3),
    [view, setView] = useState(0),
    [help, setHelp] = useState(false),
    [revealed, setRevealed] = useState(true);
  const target = useMemo(() => base ** exponent, [base, exponent]);
  useEffect(() => {
    setBase(10);
    setExponent(3);
    setView(0);
    setHelp(false);
    setRevealed(true);
  }, [resetToken]);
  const changeBase = (next: number) => {
    setBase(Math.max(2, Math.min(12, Math.round(next))));
    onInteraction();
  };
  const changeExponent = (next: number) => {
    setExponent(Math.max(0, Math.min(6, Math.round(next))));
    onInteraction();
  };
  return (
    <div
      className="target-log-page"
      data-testid="calculator-mockup-0008"
      data-dedicated-lesson="8"
      data-object-model="bidirectional-base-exponent-power-logarithm-ladder-drag-practice-model"
      data-base={base}
      data-exponent={exponent}
      data-target={target}
      data-view={view}
      data-help={help}
      data-revealed={revealed}
    >
      <nav className="target-log-breadcrumb">
        <a href="/">←</a>
        <a href="/">Home</a>
        <span>›</span>
        <a href="/lessons">Lessons</a>
        <span>›</span>
        <a href="/lessons/core-workspaces">Core Workspaces</a>
        <span>›</span>
        <b>Logarithms</b>
      </nav>
      <header className="target-log-header">
        <h1>Logarithms</h1>
        <p>Understand inverse exponential operations.</p>
        <div>
          <b>⚲ Foundational-Advanced</b>
          <b>⌁ Calculator Lab</b>
          <b>▤ Scientific Calculator</b>
          <b>◷ 6-10 min</b>
        </div>
        <nav>
          <button type="button" onClick={() => setView(0)}>
            ⚑ English (English)⌄
          </button>
          <button
            type="button"
            onClick={() => {
              setBase(10);
              setExponent(3);
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
                `log_${base}(${target}) = ${exponent}`,
              )
            }
          >
            ⌘ Share
          </button>
        </nav>
      </header>
      <nav className="target-log-tabs">
        {VIEWS.map((label, index) => (
          <button
            type="button"
            className={view === index ? "active" : ""}
            key={label}
            onClick={() => {
              setView(index);
              onInteraction();
            }}
          >
            {label}
          </button>
        ))}
      </nav>
      <section className="target-log-lab">
        <div className="target-log-main">
          <header>
            <small>INVERSE POWER LAB</small>
            <h2>A logarithm asks for an exponent.</h2>
            <p>
              We're solving:{" "}
              <strong>
                log<sub>{base}</sub>({target})
              </strong>{" "}
              ?
            </p>
            <button
              type="button"
              onClick={() => {
                setHelp((value) => !value);
                onInteraction();
              }}
            >
              ☼ How to interact⌄
            </button>
            {help ? (
              <aside>
                Change base or exponent. The target stays a valid power so the
                logarithm remains exact.
              </aside>
            ) : null}
          </header>
          <div className="log-visual">
            <section className="log-ladder">
              <h3>Build powers of {base}</h3>
              {Array.from({ length: exponent + 1 }, (_, i) => (
                <div className={i === exponent ? "active" : ""} key={i}>
                  <i>{i === exponent ? i : ""}</i>
                  <b>
                    {base}
                    <sup>{i}</sup>
                  </b>
                  <span>=</span>
                  <strong>{base ** i}</strong>
                </div>
              ))}
              <p>
                Find the <b>exponent</b> that produces the{" "}
                <strong>target.</strong>
              </p>
            </section>
            <section className="log-answer">
              <h3>
                log<sub>{base}</sub>({target}) = <b>{exponent}</b>
              </h3>
              <p>
                because{" "}
                <strong>
                  {base}
                  <sup>{exponent}</sup> = {target}
                </strong>
              </p>
              <div>
                <span>
                  <b>Exponentiation</b>
                  <small>
                    raise base to
                    <br />
                    get a power
                  </small>
                </span>
                <ArrowRight />
                <span>
                  <b>Logarithm</b>
                  <small>
                    find the exponent
                    <br />
                    (given base and power)
                  </small>
                </span>
              </div>
            </section>
          </div>
          <div className="log-controls">
            <p>Drag to adjust values</p>
            <LogControl
              label="Base"
              value={base}
              min={2}
              max={12}
              onChange={changeBase}
            />
            <LogControl
              label="Target (power)"
              value={target}
              min={0}
              max={6}
              rangeValue={exponent}
              onChange={changeExponent}
            />
            <LogControl
              label="Exponent (result)"
              value={exponent}
              min={0}
              max={6}
              onChange={changeExponent}
            />
            <aside>
              ☝ Drag any value above
              <br />
              to explore the inverse
              <br />
              relationship.
            </aside>
          </div>
        </div>
        <aside className="target-log-trace">
          <h3>CONCEPT TRACE</h3>
          <Trace
            title="QUESTION"
            value={`log_${base}(${target})`}
            note={`What exponent gives ${target}?`}
          />
          <Trace
            title="BASE"
            value={String(base)}
            note={`We're using base ${base} (common log).`}
          />
          <Trace
            title="POWER CHECK"
            value={`${base}^${exponent} = ${target}`}
            note={`${base} raised to ${exponent} equals ${target}.`}
          />
          <Trace
            title="OUTPUT"
            value={String(exponent)}
            note="The exponent is the answer."
          />
          <section className="log-key">
            <Info />
            <small>KEY IDEA</small>
            <b>
              Log is the
              <br />
              exponent answer.
            </b>
            <p>log reverses exponentiation.</p>
          </section>
        </aside>
      </section>
      <section className="target-log-practice">
        <div>
          <small>TRY IT</small>
          <h3>
            What is{" "}
            <span>
              log<sub>10</sub>(10,000)
            </span>{" "}
            ?
          </h3>
          <button
            type="button"
            onClick={() => {
              setRevealed((v) => !v);
              onInteraction();
            }}
          >
            <Eye />
            {revealed ? "Hide answer" : "Reveal answer"}
          </button>
        </div>
        <aside className={revealed ? "shown" : ""}>
          {revealed ? (
            <>
              <b>4</b>
              <span>
                because 10<sup>4</sup> = 10,000
              </span>
            </>
          ) : (
            "Reveal the answer when ready."
          )}
        </aside>
      </section>
    </div>
  );
}
function LogControl({
  label,
  value,
  min,
  max,
  rangeValue,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  rangeValue?: number;
  onChange: (value: number) => void;
}) {
  const current = rangeValue ?? value;
  return (
    <section>
      <label>
        {label}
        <b>{value}</b>
        <input
          aria-label={`${label} drag control`}
          type="range"
          min={min}
          max={max}
          value={current}
          onChange={(event) => onChange(Number(event.target.value))}
        />
      </label>
      <button
        type="button"
        aria-label={`Decrease ${label}`}
        onClick={() => onChange(current - 1)}
      >
        −
      </button>
      <button
        type="button"
        aria-label={`Increase ${label}`}
        onClick={() => onChange(current + 1)}
      >
        +
      </button>
    </section>
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
      <small>{title}</small>
      <b>{value}</b>
      <p>{note}</p>
    </section>
  );
}
