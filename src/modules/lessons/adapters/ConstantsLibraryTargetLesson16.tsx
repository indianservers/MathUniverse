import { CheckCircle2, Eye, RotateCcw, Star } from "lucide-react";
import { useEffect, useState } from "react";
import type { LessonAdapterProps } from "../types";
import "./ConstantsLibraryTargetLesson16.css";

type ConstantId = "pi" | "e" | "tau" | "phi";
const TABS = [
  "Interaction + visualization",
  "Explain",
  "Examples",
  "Formulas",
  "Know more",
];
const CONSTANTS: Record<
  ConstantId,
  {
    symbol: string;
    name: string;
    stored: string;
    formula: string;
    formulaShort: string;
    output: (value: number) => number;
    early: number;
    context: string;
  }
> = {
  pi: {
    symbol: "π",
    name: "pi",
    stored: "3.14159265358979323846264338327950288419716939937510",
    formula: "C = 2πr",
    formulaShort: "2π",
    output: (value) => 2 * value,
    early: 3.14,
    context: "Circumference formula",
  },
  e: {
    symbol: "e",
    name: "e",
    stored: "2.71828182845904523536028747135266249775724709369995",
    formula: "A = eˣ",
    formulaShort: "e¹",
    output: (value) => value,
    early: 2.72,
    context: "Continuous growth",
  },
  tau: {
    symbol: "τ",
    name: "tau",
    stored: "6.28318530717958647692528676655900576839433879875021",
    formula: "C = τr",
    formulaShort: "τ",
    output: (value) => value,
    early: 6.28,
    context: "Full-turn constant",
  },
  phi: {
    symbol: "φ",
    name: "phi",
    stored: "1.61803398874989484820458683436563811772030917980576",
    formula: "a/b = φ",
    formulaShort: "φ",
    output: (value) => value,
    early: 1.62,
    context: "Golden ratio",
  },
};
const displayDigits = (stored: string, precision: number) =>
  stored.slice(0, precision + 1);

export default function ConstantsLibraryTargetLesson16({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [selected, setSelected] = useState<ConstantId>("pi"),
    [precision, setPrecision] = useState(40),
    [view, setView] = useState(0),
    [actions, setActions] = useState(0),
    [revealed, setRevealed] = useState(true);
  const constant = CONSTANTS[selected],
    numeric = Number(constant.stored),
    output = constant.output(numeric),
    earlyOutput = constant.output(constant.early),
    difference = Math.abs(output - earlyOutput),
    storedDisplay = displayDigits(constant.stored, precision);
  const touch = () => {
    setActions((v) => v + 1);
    onInteraction();
  };
  const reset = () => {
    setSelected("pi");
    setPrecision(40);
    setView(0);
    setActions(0);
    setRevealed(true);
    onInteraction();
  };
  useEffect(() => {
    setSelected("pi");
    setPrecision(40);
    setView(0);
    setActions(0);
    setRevealed(true);
  }, [resetToken]);
  const choose = (id: ConstantId) => {
    setSelected(id);
    setActions((v) => v + 1);
    onInteraction();
  };
  return (
    <div
      className="target-constants-page"
      data-testid="calculator-mockup-0016"
      data-dedicated-lesson="16"
      data-object-model="selectable-high-precision-constant-formula-visual-output-early-rounding-practice-model"
      data-constant={selected}
      data-precision={precision}
      data-stored={storedDisplay}
      data-output={output.toFixed(5)}
      data-early-output={earlyOutput.toFixed(2)}
      data-difference={difference.toFixed(5)}
      data-view={view}
      data-actions={actions}
      data-revealed={revealed}
    >
      <nav className="constants-breadcrumb">
        <a href="/">←</a>
        <a href="/">Home</a>
        <span>›</span>
        <a href="/lessons">Lessons</a>
        <span>›</span>
        <a href="/lessons/core-workspaces">Core Workspaces</a>
        <span>›</span>
        <b>16 Constants Library</b>
      </nav>
      <header className="constants-header">
        <span>CORE WORKSPACES</span>
        <span>SCIENTIFIC CALCULATOR</span>
        <h1>Constants Library</h1>
        <p>Provide reliable mathematical constants.</p>
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
                `${constant.symbol} = ${constant.stored}`,
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
      <nav className="constants-tabs">
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
      <section className="constants-lab">
        <div className="constants-columns">
          <main>
            <header>
              <small>INTERACTION · VISUALIZATION</small>
              <h2>Reliable constant insertion in action</h2>
              <p>Choose constant</p>
            </header>
            <nav className="constant-picker">
              {(Object.keys(CONSTANTS) as ConstantId[]).map((id) => (
                <button
                  type="button"
                  className={selected === id ? "active" : ""}
                  onClick={() => choose(id)}
                  key={id}
                >
                  <b>{CONSTANTS[id].symbol}</b>
                  {CONSTANTS[id].name}
                </button>
              ))}
            </nav>
            <ConstantVisual
              id={selected}
          formula={constant.formula}
              output={output}
            />
            <section className="constant-output">
              {selected === "pi" ? "2 × pi" : constant.formulaShort} ={" "}
              <span>{constant.formulaShort}</span> ≈ <b>{output.toFixed(5)}</b>
            </section>
            <section className="precision-matters">
              <h3>Precision matters</h3>
              <p>
                Use full precision for all calculations. Round only at the end.
              </p>
              <div>
                <label>
                  Stored value of {constant.name} (used internally)
                  <output>
                    {constant.symbol} = {storedDisplay}…
                  </output>
                </label>
                <label>
                  Rounded approximation (not recommended early)
                  <output>
                    {constant.symbol} ≈ {constant.early}
                  </output>
                </label>
              </div>
              <label className="precision-slider">
                Stored precision (digits used in calculations)
                <input
                  aria-label="Stored constant precision drag control"
                  type="range"
                  min="10"
                  max="50"
                  step="10"
                  value={precision}
                  onChange={(e) => {
                    setPrecision(Number(e.target.value));
                    touch();
                  }}
                />
                <span>
                  <b>10</b>
                  <b>20</b>
                  <b>30</b>
                  <b>40</b>
                  <b>50</b>
                </span>
                <output>{precision} digits</output>
              </label>
              <footer>
                ⓘ Calculations use the full stored value above. Rounding is
                applied only when you choose to display the result.
              </footer>
            </section>
          </main>
          <aside className="constants-trace">
            <h3>Concept trace</h3>
            <Trace
              title="Constant"
              value={`${constant.symbol} (${constant.name})`}
            />
            <Trace title="Stored value" value={`${storedDisplay}…`} />
            <Trace title="Formula" value={constant.formula} />
            <Trace
              title="Output"
              value={`${constant.context.includes("Circumference") ? "C" : "Result"} ≈ ${output.toFixed(5)}`}
              orange
            />
            <Trace
              title="Rule"
              value="Round only after using the stored constant."
            />
            <section className="precision-why">
              <h3>Why stored precision matters</h3>
              <p>Compare the results</p>
              <article>
                Using {constant.symbol} ≈ {constant.early} early{" "}
                <b>= {earlyOutput.toFixed(2)}</b>
              </article>
              <article>
                <Star />
                Using stored full precision <b>= {output.toFixed(5)}</b>
              </article>
              <footer>
                <b>Difference = {difference.toFixed(5)}</b>
                <p>Small now, but grows in longer calculations!</p>
              </footer>
            </section>
          </aside>
        </div>
        <section className="constants-practice">
          <header>
            <b>✎ &nbsp; Practice with constants</b>
            <button
              type="button"
              onClick={() => {
                setRevealed((v) => !v);
                onInteraction();
              }}
            >
              <Eye />
              {revealed ? "Hide answer" : "Show answer"}⌃
            </button>
          </header>
          <div>
            <p>Use π to estimate circumference when r = 2.</p>
            <b>Use C = 2πr.</b>
            {revealed ? (
              <aside>
                <CheckCircle2 />
                <span>
                  <b>C = 2π(2) = 4π</b>
                  <strong>4π ≈ 12.566</strong>
                </span>
              </aside>
            ) : null}
          </div>
        </section>
      </section>
      <nav className="constants-neighbors">
        <a href="/lessons/core-workspaces/15-rounding-and-precision">
          ←{" "}
          <span>
            <small>PREVIOUS</small>Rounding and Precision
          </span>
        </a>
        <a href="/lessons/core-workspaces/17-calculation-history">
          <span>
            <small>NEXT</small>Calculation History
          </span>{" "}
          →
        </a>
      </nav>
      <footer className="constants-footer">
        <b>⚒ Math Universe</b>
        <p>
          Interactive math labs, visual proofs, NCERT explorations, graphing,
          CAS-style tools, and classroom-ready activities.
        </p>
      </footer>
    </div>
  );
}
function Trace({
  title,
  value,
  orange,
}: {
  title: string;
  value: string;
  orange?: boolean;
}) {
  return (
    <section className={orange ? "orange" : ""}>
      <h4>{title}</h4>
      <b>{value}</b>
    </section>
  );
}
function ConstantVisual({
  id,
  formula,
  output,
}: {
  id: ConstantId;
  formula: string;
  output: number;
}) {
  if (id === "e")
    return (
      <section className="constant-visual exponential">
        <svg viewBox="0 0 520 330">
          <line x1="20" y1="290" x2="500" y2="290" />
          <line x1="120" y1="20" x2="120" y2="310" />
          <path d="M25 278 C170 270 250 235 315 170 S420 40 495 25" />
          <circle cx="315" cy="170" r="7" />
          <text x="330" y="160">
            e¹ = 2.718…
          </text>
        </svg>
        <aside>
          <b>{formula}</b>
          <p>At x = 1</p>
          <strong>A = {output.toFixed(5)}</strong>
        </aside>
      </section>
    );
  if (id === "phi")
    return (
      <section className="constant-visual golden">
        <svg viewBox="0 0 520 330">
          <rect x="55" y="45" width="390" height="241" />
          <line x1="296" y1="45" x2="296" y2="286" />
          <path d="M296 286 A241 241 0 0 0 55 45 M296 45 A149 149 0 0 1 445 194" />
          <text x="170" y="175">
            a / b = φ
          </text>
        </svg>
        <aside>
          <b>{formula}</b>
          <p>Golden rectangle</p>
          <strong>φ ≈ {output.toFixed(5)}</strong>
        </aside>
      </section>
    );
  return (
    <section className="constant-visual circle">
      <svg viewBox="0 0 520 380">
        <circle cx="205" cy="193" r="160" />
        <line x1="45" y1="193" x2="365" y2="193" />
        <line x1="205" y1="193" x2="330" y2="83" />
        <circle cx="205" cy="193" r="5" />
        <path d="M35 190 A170 170 0 1 1 375 190" />
        <text x="142" y="20">
          Circumference C
        </text>
        <text x="170" y="220">
          Diameter = 2r
        </text>
        <text x="275" y="155">
          r = 1
        </text>
      </svg>
      <aside>
        <b>{formula}</b>
        <p>With r = 1</p>
        <strong>{id === "pi" ? "C = 2π" : "C = τ"}</strong>
      </aside>
    </section>
  );
}
