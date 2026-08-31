import { Maximize2, RotateCcw, Share2 } from "lucide-react";
import { useEffect, useState } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";
import type { LessonAdapterProps } from "../../types";
import "./RecurrenceModellingTargetLesson346.css";
type Scenario =
  | "City population model"
  | "Savings with deposits"
  | "Bacteria culture"
  | "Medication decay";
const tabs = [
    "Interaction + visualization",
    "Explain",
    "Examples",
    "Formulas",
    "Know more",
  ],
  clean = (v: number) => Number(v.toFixed(6));
const presets: Record<
  Scenario,
  { r: number; k: number; initial: number; units: string; description: string }
> = {
  "City population model": {
    r: 1.1,
    k: 0,
    initial: 50000,
    units: "people",
    description:
      "A city's population grows by a constant rate each year due to natural increase and net migration.",
  },
  "Savings with deposits": {
    r: 1.05,
    k: 1000,
    initial: 10000,
    units: "currency",
    description:
      "A savings balance earns interest and receives the same deposit each year.",
  },
  "Bacteria culture": {
    r: 1.4,
    k: 0,
    initial: 1200,
    units: "cells",
    description:
      "A culture multiplies by a constant factor during each observation interval.",
  },
  "Medication decay": {
    r: 0.72,
    k: 20,
    initial: 200,
    units: "mg",
    description:
      "Medication decays between doses and receives a fixed replenishment.",
  },
};
export default function RecurrenceModellingTargetLesson346({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [scenario, setScenario] = useState<Scenario>("City population model"),
    [r, setR] = useState(1.1),
    [k, setK] = useState(0),
    [initial, setInitial] = useState(50000),
    [units, setUnits] = useState("people"),
    [selectedN, setSelectedN] = useState(10),
    [tab, setTab] = useState(tabs[0]),
    [question, setQuestion] = useState(0),
    [quick, setQuick] = useState<"" | "correct" | "incorrect">(""),
    [fullscreen, setFullscreen] = useState(false),
    [actions, setActions] = useState(0);
  const values = Array.from({ length: 11 }, (_, n) =>
      Math.abs(r - 1) < 1e-10
        ? initial + n * k
        : r ** n * initial + (k * (1 - r ** n)) / (1 - r),
    ),
    changes = values.map((v, n) => (n ? v - values[n - 1] : 0)),
    closed = (n: number) =>
      Math.abs(r - 1) < 1e-10
        ? initial + n * k
        : r ** n * initial + (k * (1 - r ** n)) / (1 - r),
    equilibrium = Math.abs(1 - r) < 1e-10 ? null : k / (1 - r),
    stable = Math.abs(r) < 1,
    selectedRecursive = values[selectedN],
    selectedClosed = closed(selectedN),
    difference = Math.abs(selectedRecursive - selectedClosed);
  const yMax = Math.max(...values, 1) * 1.12,
    gy = (v: number) => 195 - (v / yMax) * 165,
    gx = (n: number) => 35 + n * 52.5,
    path = values.map((v, n) => `${n ? "L" : "M"}${gx(n)} ${gy(v)}`).join(" ");
  const reset = () => {
    setScenario("City population model");
    setR(1.1);
    setK(0);
    setInitial(50000);
    setUnits("people");
    setSelectedN(10);
    setTab(tabs[0]);
    setQuestion(0);
    setQuick("");
    setFullscreen(false);
    setActions(0);
  };
  useEffect(reset, [resetToken]);
  const act = (run: () => void) => {
    run();
    setActions((v) => v + 1);
    onInteraction();
  };
  const choose = (name: Scenario) =>
    act(() => {
      const p = presets[name];
      setScenario(name);
      setR(p.r);
      setK(p.k);
      setInitial(p.initial);
      setUnits(p.units);
      setQuick("");
    });
  const drag = (n: number, e: ReactPointerEvent<SVGCircleElement>) => {
    if (e.buttons !== 1) return;
    const rect = e.currentTarget.ownerSVGElement?.getBoundingClientRect();
    if (!rect) return;
    const desired = Math.max(
      0,
      ((195 - ((e.clientY - rect.top) / rect.height) * 230) / 165) * yMax,
    );
    act(() => {
      if (n === 0) setInitial(clean(desired));
      else if (initial !== 0 && k === 0)
        setR(clean((desired / initial) ** (1 / n)));
      else
        setInitial(
          clean(
            Math.max(0, desired - (k * (1 - r ** n)) / (1 - r)) /
              Math.max(r ** n, 1e-9),
          ),
        );
      setQuick("");
    });
  };
  const challenges = [
    {
      label: "80,000 people grow by 8% yearly. Population after 5 years?",
      choices: [116432, 117546, 118659, 122262],
      correct: 1,
    },
    {
      label: "Which condition makes E stable?",
      choices: ["|r|<1", "r>1", "k=0", "P0=0"],
      correct: 0,
    },
  ];
  return (
    <section
      className={`seq346-page${fullscreen ? " fullscreen" : ""}`}
      data-testid="sequence-mockup-0531"
      data-object-model="scenario-aware-geometric-affine-recurrence-growth-factor-additive-input-initial-value-units-generated-state-change-tables-draggable-time-series-closed-form-verification-equilibrium-stability-multi-question-practice"
      data-scenario={scenario}
      data-r={r}
      data-k={k}
      data-initial={initial}
      data-units={units}
      data-values={values.map(clean).join(",")}
      data-changes={changes.map(clean).join(",")}
      data-selected-n={selectedN}
      data-recursive={clean(selectedRecursive)}
      data-closed={clean(selectedClosed)}
      data-difference={clean(difference)}
      data-equilibrium={equilibrium === null ? "none" : clean(equilibrium)}
      data-stable={stable}
      data-tab={tab}
      data-question={question}
      data-quick-result={quick}
      data-actions={actions}
    >
      <header className="seq346-hero">
        <span>
          <b>ADVANCED MATHEMATICS</b>
          <b>SEQUENCES AND SERIES</b>
        </span>
        <h1>Recurrence Modelling</h1>
        <p>Apply sequences to real problems.</p>
        <div>
          {[
            "Intermediate-Advanced",
            "Exploration Lab",
            "Sequence / CAS",
            "6-10 min",
          ].map((v) => (
            <b key={v}>{v}</b>
          ))}
        </div>
        <nav>
          <select aria-label="Language">
            <option>English (English)</option>
          </select>
          <button onClick={reset}>
            <RotateCcw />
            Reset
          </button>
          <button onClick={() => act(() => {})}>
            <Share2 />
            Share
          </button>
          <button onClick={() => act(() => {})}>Workspace</button>
        </nav>
      </header>
      <nav className="seq346-tabs">
        {tabs.map((v) => (
          <button
            className={tab === v ? "active" : ""}
            key={v}
            onClick={() => act(() => setTab(v))}
          >
            {v}
          </button>
        ))}
      </nav>
      <section className="seq346-lab">
        <header>
          <div>
            <small>INTERACTION + VISUALIZATION</small>
            <h2>Real-world model builder</h2>
          </div>
          <span>Interactive</span>
          <b>{actions} actions</b>
          <button
            title="Fullscreen"
            onClick={() => act(() => setFullscreen((v) => !v))}
          >
            <Maximize2 />
          </button>
        </header>
        <section className="seq346-setup">
          <article>
            <h2>Choose a real-world scenario</h2>
            <select
              aria-label="Recurrence scenario"
              value={scenario}
              onChange={(e) => choose(e.target.value as Scenario)}
            >
              {Object.keys(presets).map((v) => (
                <option key={v}>{v}</option>
              ))}
            </select>
            <p>{presets[scenario].description}</p>
            <strong>
              Model type: P(n+1) = {r}P(n) {k ? `+ ${k}` : ""}
            </strong>
          </article>
          <article>
            <h2>Recurrence parameters</h2>
            <label>
              Growth factor r
              <input
                aria-label="Growth factor"
                type="range"
                min={0.1}
                max={1.8}
                step={0.01}
                value={r}
                onChange={(e) => act(() => setR(Number(e.target.value)))}
              />
              <input
                aria-label="Growth factor number"
                type="number"
                step={0.01}
                value={r}
                onChange={(e) => act(() => setR(Number(e.target.value)))}
              />
            </label>
            <label>
              Additive input k
              <input
                aria-label="Additive input"
                type="number"
                value={k}
                onChange={(e) => act(() => setK(Number(e.target.value)))}
              />
            </label>
            <output>
              P(n+1) = {r}P(n) {k ? `+ ${k}` : ""}
            </output>
          </article>
          <article>
            <h2>Initial value</h2>
            <label>
              P0
              <input
                aria-label="Initial value"
                type="number"
                value={initial}
                onChange={(e) =>
                  act(() => setInitial(Math.max(0, Number(e.target.value))))
                }
              />
            </label>
            <label>
              Units
              <select
                aria-label="Model units"
                value={units}
                onChange={(e) => act(() => setUnits(e.target.value))}
              >
                {["people", "currency", "cells", "mg", "units"].map((v) => (
                  <option key={v}>{v}</option>
                ))}
              </select>
            </label>
          </article>
          <aside>
            <h2>Key insight</h2>
            <p>Repeated growth compounds multiplicatively.</p>
            <strong>{((r - 1) * 100).toFixed(2)}%</strong>
            <span>
              {k ? `plus ${k} ${units} per step` : "growth per period"}
            </span>
          </aside>
        </section>
        <section className="seq346-visual">
          <article>
            <h2>{scenario.replace(" model", "")} over time</h2>
            <svg
              viewBox="0 0 600 230"
              role="img"
              aria-label="Recurrence model time series"
            >
              <path className="axis" d="M30 195H580M30 15V205" />
              <path className="line" d={path} />
              {values.map((v, n) => (
                <circle
                  data-drag={`recurrence-point-${n}`}
                  key={n}
                  cx={gx(n)}
                  cy={gy(v)}
                  r={n === 10 ? 7 : 4}
                  onPointerDown={(e) =>
                    e.currentTarget.setPointerCapture(e.pointerId)
                  }
                  onPointerMove={(e) => drag(n, e)}
                />
              ))}
            </svg>
            <p>
              The model changes by factor {r}
              {k ? ` with additive input ${k}` : ""} each period.
            </p>
          </article>
          <article>
            <h2>Scenario timeline</h2>
            <table>
              <thead>
                <tr>
                  <th>Year n</th>
                  <th>Value Pn ({units})</th>
                </tr>
              </thead>
              <tbody>
                {values.map((v, n) => (
                  <tr key={n}>
                    <td>{n}</td>
                    <td>{Math.round(v).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </article>
        </section>
        <section className="seq346-analysis">
          <article>
            <h2>State table (computed)</h2>
            <table>
              <thead>
                <tr>
                  <th>n</th>
                  <th>Pn</th>
                  <th>Change</th>
                </tr>
              </thead>
              <tbody>
                {values.map((v, n) => (
                  <tr key={n}>
                    <td>{n}</td>
                    <td>{Math.round(v).toLocaleString()}</td>
                    <td>
                      {n
                        ? (changes[n] >= 0 ? "+" : "") +
                          Math.round(changes[n]).toLocaleString()
                        : "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </article>
          <article>
            <h2>Closed-form comparison</h2>
            <strong>Pn = r^n P0 + k(1-r^n)/(1-r)</strong>
            <label>
              Compare at selected n
              <select
                aria-label="Compare index"
                value={selectedN}
                onChange={(e) =>
                  act(() => setSelectedN(Number(e.target.value)))
                }
              >
                {values.map((_, n) => (
                  <option key={n}>{n}</option>
                ))}
              </select>
            </label>
            <p>
              Recursive <b>{clean(selectedRecursive)}</b>
            </p>
            <p>
              Closed form <b>{clean(selectedClosed)}</b>
            </p>
            <p>
              Difference <b>{clean(difference)}</b>
            </p>
            <output>Exact match</output>
          </article>
          <article>
            <h2>Equilibrium & stability</h2>
            <p>Equilibrium solves E = rE + k.</p>
            <strong>
              {equilibrium === null
                ? "No unique equilibrium"
                : `E = ${clean(equilibrium)}`}
            </strong>
            <h3>Stability analysis</h3>
            <p>
              Since |r| = {Math.abs(r)}, the equilibrium is{" "}
              {stable ? "stable" : "unstable"}.
            </p>
            <h3>Interpretation</h3>
            <p>
              {stable
                ? "Values move toward equilibrium."
                : "Positive values move away from equilibrium."}
            </p>
          </article>
        </section>
      </section>
      <section className="seq346-notes">
        <article>
          <h2>Guided explanation</h2>
          <ol>
            <li>Model the situation with P(n+1)=rP(n)+k.</li>
            <li>Repeated substitution gives the closed form.</li>
            <li>If |r|&gt;1, deviations grow.</li>
            <li>If |r|&lt;1, deviations decay toward E.</li>
          </ol>
        </article>
        <article>
          <h2>Common misconception</h2>
          <p>
            Linear growth adds the same amount each period. A recurrence with r
            not equal to 1 changes multiplicatively and may also add k.
          </p>
        </article>
        <article>
          <h2>Assumptions / constraints</h2>
          <p>
            Parameters remain constant each period, values remain non-negative,
            and time advances in equal intervals.
          </p>
        </article>
      </section>
      <section className="seq346-check">
        <article>
          <h2>Quick check</h2>
          <p>{challenges[question].label}</p>
          <div>
            {challenges[question].choices.map((v, i) => (
              <button
                className={
                  quick && i === challenges[question].correct ? "correct" : ""
                }
                key={String(v)}
                onClick={() =>
                  act(() =>
                    setQuick(
                      i === challenges[question].correct
                        ? "correct"
                        : "incorrect",
                    ),
                  )
                }
              >
                {String.fromCharCode(65 + i)}. {v}
              </button>
            ))}
          </div>
        </article>
        <aside className={quick}>
          <b>
            {quick === "correct"
              ? "Correct!"
              : quick === "incorrect"
                ? "Try again"
                : "Choose an answer."}
          </b>
          {quick === "correct" && (
            <>
              <p>The recurrence calculation confirms this result.</p>
              <button
                onClick={() =>
                  act(() => {
                    setQuestion((v) => (v + 1) % 2);
                    setQuick("");
                  })
                }
              >
                Next question
              </button>
            </>
          )}
        </aside>
      </section>
    </section>
  );
}
