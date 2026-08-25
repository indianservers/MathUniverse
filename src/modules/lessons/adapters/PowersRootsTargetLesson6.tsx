import { ArrowLeft, ArrowRight, Eye, RotateCcw } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { LessonAdapterProps } from "../types";
import "./PowersRootsTargetLesson6.css";
const VIEWS = [
  "Interaction + visualization",
  "Explain",
  "Examples",
  "Formulas",
  "Know more",
];
export default function PowersRootsTargetLesson6({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [radicand, setRadicand] = useState(144),
    [base, setBase] = useState(2),
    [exponent, setExponent] = useState(3),
    [view, setView] = useState(0),
    [actions, setActions] = useState(0),
    [revealed, setRevealed] = useState(true);
  const model = useMemo(() => {
    const root = Math.sqrt(radicand),
      power = Math.pow(base, exponent);
    return {
      root,
      power,
      total: root + power,
      side: Number.isInteger(root) ? root : Math.ceil(root),
    };
  }, [radicand, base, exponent]);
  useEffect(() => {
    setRadicand(144);
    setBase(2);
    setExponent(3);
    setView(0);
    setActions(0);
    setRevealed(true);
  }, [resetToken]);
  const change = (
    setter: (value: number) => void,
    value: number,
    min: number,
    max: number,
  ) => {
    setter(Math.max(min, Math.min(max, value)));
    setActions((v) => v + 1);
    onInteraction();
  };
  return (
    <div
      className="target-powers-page"
      data-testid="calculator-mockup-0006"
      data-dedicated-lesson="6"
      data-object-model="linked-square-root-area-grid-repeated-power-cube-combined-expression-practice-model"
      data-radicand={radicand}
      data-root={format(model.root)}
      data-base={base}
      data-exponent={exponent}
      data-power={format(model.power)}
      data-total={format(model.total)}
      data-view={view}
      data-actions={actions}
      data-revealed={revealed}
    >
      <nav className="target-powers-breadcrumb">
        <a href="/">←</a>
        <a href="/">Home</a>
        <span>›</span>
        <a href="/lessons">Lessons</a>
        <span>›</span>
        <a href="/lessons/core-workspaces">Core Workspaces</a>
        <span>›</span>
        <b>6 Powers And Roots</b>
      </nav>
      <header className="target-powers-header">
        <span>CORE WORKSPACES</span>
        <span>SCIENTIFIC CALCULATOR</span>
        <h1>Powers and Roots</h1>
        <p>Understand exponents and radicals through visual models.</p>
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
              setRadicand(144);
              setBase(2);
              setExponent(3);
              setActions((v) => v + 1);
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
                `sqrt(${radicand}) + ${base}^${exponent} = ${format(model.total)}`,
              )
            }
          >
            ⌘ Share
          </button>
          <a href="/math-workspace">↗ Workspace</a>
        </nav>
      </header>
      <nav className="target-powers-tabs">
        {VIEWS.map((label, index) => (
          <button
            type="button"
            className={view === index ? "active" : ""}
            key={label}
            onClick={() => {
              setView(index);
              setActions((v) => v + 1);
              onInteraction();
            }}
          >
            {label}
          </button>
        ))}
      </nav>
      <section className="target-powers-lab">
        <header>
          <small>INTERACTION + VISUALIZATION</small>
          <h2>
            Visual model for <span>√{radicand}</span> + {base}
            <sup>{exponent}</sup>
          </h2>
          <p>Explore how a root and a power combine.</p>
          <aside>
            <b>● All synced</b>
            <span>{actions} actions</span>
            <button
              type="button"
              onClick={() => {
                setActions((v) => v + 1);
                onInteraction();
              }}
            >
              ↗
            </button>
          </aside>
        </header>
        <div className="target-powers-grid">
          <main>
            <div className="powers-models">
              <section className="root-model">
                <h3>Root model: √{radicand}</h3>
                <p>A square with area {radicand}.</p>
                <p>
                  The side length is √{radicand} = {format(model.root)}.
                </p>
                <div
                  className="root-square"
                  style={{
                    gridTemplateColumns: `repeat(${Math.min(15, model.side)},1fr)`,
                  }}
                >
                  {Array.from(
                    { length: Math.min(225, model.side * model.side) },
                    (_, i) => (
                      <i key={i} />
                    ),
                  )}
                </div>
                <b className="root-side">{format(model.root)}</b>
                <strong>Area = {radicand}</strong>
                <Control
                  label="Radicand (area)"
                  note="Change the area inside the square."
                  value={radicand}
                  onMinus={() => change(setRadicand, radicand - 1, 1, 225)}
                  onPlus={() => change(setRadicand, radicand + 1, 1, 225)}
                />
              </section>
              <section className="power-model">
                <h3>
                  Power model: {base}
                  <sup>{exponent}</sup>
                </h3>
                <p>
                  {base} multiplied by itself {exponent} times.
                </p>
                <p>
                  This equals <b>{format(model.power)}</b>.
                </p>
                <h4>Repeated multiplication</h4>
                <div className="power-factors">
                  {Array.from({ length: exponent }, (_, i) => (
                    <span key={i}>
                      <b>{base}</b>
                      {i < exponent - 1 ? <i>×</i> : null}
                    </span>
                  ))}
                </div>
                <strong>{exponent} factors</strong>
                <h4>
                  Cube model (
                  {Array.from({ length: exponent }, () => base).join(" × ")})
                </h4>
                <div className="power-cube">
                  <div>
                    {Array.from(
                      {
                        length: Math.min(
                          9,
                          Math.max(1, Math.round(model.power)),
                        ),
                      },
                      (_, i) => (
                        <i key={i} />
                      ),
                    )}
                  </div>
                  <b>{base}</b>
                  <b>{base}</b>
                  <b>{base}</b>
                </div>
                <div className="power-controls">
                  <Control
                    label="Base"
                    note="Change the base value."
                    value={base}
                    onMinus={() => change(setBase, base - 1, 1, 8)}
                    onPlus={() => change(setBase, base + 1, 1, 8)}
                  />
                  <Control
                    label="Exponent"
                    note="Change the exponent."
                    value={exponent}
                    onMinus={() => change(setExponent, exponent - 1, 1, 5)}
                    onPlus={() => change(setExponent, exponent + 1, 1, 5)}
                  />
                </div>
              </section>
            </div>
            <div className="powers-equation">
              <span>√{radicand}</span> +{" "}
              <b>
                {base}
                <sup>{exponent}</sup>
              </b>{" "}
              = <span>{format(model.root)}</span> + <b>{format(model.power)}</b>{" "}
              = <strong>{format(model.total)}</strong>
            </div>
          </main>
          <aside className="powers-trace">
            <h3>CONCEPT TRACE</h3>
            <Trace
              title="Root"
              value={`√${radicand} = ${format(model.root)}`}
              note={`The number which squared gives ${radicand} is ${format(model.root)}.`}
            />
            <Trace
              title="Power"
              value={`${base}^${exponent} = ${format(model.power)}`}
              note={`Multiply ${base} by itself ${exponent} times to get ${format(model.power)}.`}
            />
            <Trace
              title="Combined result"
              value={`${format(model.root)} + ${format(model.power)} = ${format(model.total)}`}
              note="Add the root result and the power result."
            />
            <section>
              <p>Key rule</p>
              <b>Roots undo powers.</b>
              <strong>√a² = a</strong>
              <p>(for a ≥ 0)</p>
            </section>
          </aside>
        </div>
        <div className="powers-practice">
          <section>
            <h3>ϟ Try it yourself</h3>
            <b>What is √81 + 3² ?</b>
            <p>Change the values and solve.</p>
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
          </section>
          <section className={revealed ? "shown" : ""}>
            <h3>Answer</h3>
            {revealed ? (
              <>
                <b>√81 + 3² = 9 + 9 = 18</b>
                <p>So, the answer is 18.</p>
              </>
            ) : (
              <p>Reveal the answer when you are ready.</p>
            )}
          </section>
        </div>
      </section>
      <nav className="target-powers-nav">
        <a href="/lessons/core-workspaces/5-ratio-calculator">
          <ArrowLeft />
          <span>
            <b>Previous</b>Ratio Calculator
          </span>
        </a>
        <a href="/lessons/core-workspaces/7-scientific-notation">
          <span>
            <b>Next</b>Scientific Notation
          </span>
          <ArrowRight />
        </a>
      </nav>
    </div>
  );
}
function Control({
  label,
  note,
  value,
  onMinus,
  onPlus,
}: {
  label: string;
  note: string;
  value: number;
  onMinus: () => void;
  onPlus: () => void;
}) {
  return (
    <section className="powers-control">
      <div>
        <b>{label}</b>
        <p>{note}</p>
      </div>
      <button type="button" aria-label={`Decrease ${label}`} onClick={onMinus}>
        −
      </button>
      <strong>{value}</strong>
      <button type="button" aria-label={`Increase ${label}`} onClick={onPlus}>
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
      <h4>{title}</h4>
      <b>{value}</b>
      <p>{note}</p>
      {title === "Power" ? <small>2 × 2 × 2 = 8</small> : null}
    </section>
  );
}
function format(value: number) {
  return Number.isInteger(value)
    ? String(value)
    : value.toFixed(3).replace(/0+$/, "");
}
