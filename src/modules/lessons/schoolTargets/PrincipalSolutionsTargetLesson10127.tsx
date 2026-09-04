import { EyeOff, Lightbulb, TriangleAlert } from "lucide-react";
import { useMemo, useState } from "react";
import type { SchoolSyllabusLesson } from "../syllabus/lessonSyllabusTypes";
import "./PrincipalSolutionsTargetLesson10127.css";

type EqKey = "cos-neg-root" | "sin-half" | "cos-zero" | "tan-one";
type IntervalKey = "zero-two" | "neg-pos" | "zero-pi";
const PI = Math.PI;
const equations = {
  "cos-neg-root": {
    label: "cos x = -√3/2",
    fn: "cos" as const,
    target: -Math.sqrt(3) / 2,
    roots: [(5 * PI) / 6, (7 * PI) / 6],
    period: 2 * PI,
    reference: "π/6 (30°)",
    logic: "cos x < 0 in Quadrants II and III.",
  },
  "sin-half": {
    label: "sin x = 1/2",
    fn: "sin" as const,
    target: 0.5,
    roots: [PI / 6, (5 * PI) / 6],
    period: 2 * PI,
    reference: "π/6 (30°)",
    logic: "sin x > 0 in Quadrants I and II.",
  },
  "cos-zero": {
    label: "cos x = 0",
    fn: "cos" as const,
    target: 0,
    roots: [PI / 2, (3 * PI) / 2],
    period: 2 * PI,
    reference: "π/2 (90°)",
    logic: "cos x = 0 on the vertical axis.",
  },
  "tan-one": {
    label: "tan x = 1",
    fn: "tan" as const,
    target: 1,
    roots: [PI / 4],
    period: PI,
    reference: "π/4 (45°)",
    logic: "tan x > 0 in Quadrants I and III.",
  },
};
const intervals = {
  "zero-two": { label: "[0, 2π)", min: 0, max: 2 * PI, includeMax: false },
  "neg-pos": { label: "[-π, π)", min: -PI, max: PI, includeMax: false },
  "zero-pi": { label: "[0, π]", min: 0, max: PI, includeMax: true },
};
const gcd = (a: number, b: number): number => (b ? gcd(b, a % b) : Math.abs(a));
const angleLabel = (angle: number) => {
  const numerator = Math.round((angle / PI) * 12);
  if (!numerator) return "0";
  const divisor = gcd(numerator, 12),
    top = numerator / divisor,
    bottom = 12 / divisor;
  if (bottom === 1) return `${top === 1 ? "" : top === -1 ? "-" : top}π`;
  return `${top === 1 ? "" : top === -1 ? "-" : top}π/${bottom}`;
};
const degrees = (angle: number) => Math.round((angle * 180) / PI);
const quadrant = (angle: number) => {
  const normalized = ((angle % (2 * PI)) + 2 * PI) % (2 * PI);
  if (normalized < PI / 2) return "QI";
  if (normalized < PI) return "QII";
  if (normalized < (3 * PI) / 2) return "QIII";
  return "QIV";
};

export default function PrincipalSolutionsTargetLesson10127({
  lesson: _lesson,
}: {
  lesson: SchoolSyllabusLesson;
}) {
  const [equationKey, setEquationKey] = useState<EqKey>("cos-neg-root");
  const [intervalKey, setIntervalKey] = useState<IntervalKey>("zero-two");
  const [contrast, setContrast] = useState(true);
  const [selectedOnly, setSelectedOnly] = useState(true);
  const [actions, setActions] = useState(0);
  const equation = equations[equationKey],
    interval = intervals[intervalKey];
  const allSolutions = useMemo(() => {
    const values: number[] = [];
    equation.roots.forEach((root) => {
      for (let n = -3; n <= 3; n += 1) values.push(root + n * equation.period);
    });
    return [...new Set(values.map((value) => value.toFixed(8)))]
      .map(Number)
      .sort((a, b) => a - b);
  }, [equation]);
  const principal = allSolutions.filter(
    (value) =>
      value >= interval.min - 1e-8 &&
      (interval.includeMax
        ? value <= interval.max + 1e-8
        : value < interval.max - 1e-8),
  );
  const hidden = allSolutions
    .filter((value) => !principal.includes(value))
    .filter((value) => Math.abs(value) <= 4 * PI)
    .slice(0, 4);
  const verified = principal.every(
    (value) => Math.abs(Math[equation.fn](value) - equation.target) < 1e-8,
  );
  const updateEquation = (key: EqKey) => {
    setEquationKey(key);
    setActions((count) => count + 1);
  };
  const updateInterval = (key: IntervalKey) => {
    setIntervalKey(key);
    setActions((count) => count + 1);
  };

  return (
    <section
      className="ps10127-page"
      data-testid="school-mockup-0801"
      data-object-model="dedicated-principal-interval-filter-engine"
      data-equation={equationKey}
      data-interval={intervalKey}
      data-principal={principal.map(angleLabel).join(";")}
      data-count={principal.length}
      data-verified={String(verified)}
      data-contrast={String(contrast)}
      data-selected-only={String(selectedOnly)}
      data-actions={actions}
    >
      <header>
        <small>CLASS 11 · TRIGONOMETRY</small>
        <h1>Principal Solutions</h1>
        <h2>
          Interval-filtered solver for <em>{equation.label}</em>
        </h2>
        <p>
          Principal Solutions are all solutions in the selected principal
          interval.
        </p>
        <aside>
          <TriangleAlert />
          <div>
            <strong>Always state the interval.</strong>
            <p>Different intervals give different principal solutions.</p>
          </div>
        </aside>
        <label>
          Contrast with
          <br />
          General Solutions{" "}
          <button
            role="switch"
            aria-label="Contrast with General Solutions"
            aria-checked={contrast}
            onClick={() => setContrast((value) => !value)}
          >
            <i />
          </button>
        </label>
      </header>
      <main>
        <section className="ps10127-setup">
          <label>
            EQUATION
            <select
              aria-label="Principal equation"
              value={equationKey}
              onChange={(event) => updateEquation(event.target.value as EqKey)}
            >
              {Object.entries(equations).map(([key, value]) => (
                <option key={key} value={key}>
                  {value.label}
                </option>
              ))}
            </select>
          </label>
          <label>
            PRINCIPAL INTERVAL
            <select
              aria-label="Principal interval"
              value={intervalKey}
              onChange={(event) =>
                updateInterval(event.target.value as IntervalKey)
              }
            >
              {Object.entries(intervals).map(([key, value]) => (
                <option key={key} value={key}>
                  {value.label}
                </option>
              ))}
            </select>
            <small>
              Solutions are shown only within the selected interval.
            </small>
          </label>
          <h2>PRINCIPAL SOLUTIONS IN {interval.label}</h2>
          <div className="ps10127-solutions">
            {principal.length ? (
              principal.map((value) => (
                <article key={value}>
                  <strong>x = {angleLabel(value)}</strong>
                  <span>({degrees(value)}°)</span>
                  <b>{quadrant(value)}</b>
                </article>
              ))
            ) : (
              <article>
                <strong>No solutions</strong>
                <span>in this interval</span>
              </article>
            )}
          </div>
          <h2>REFERENCE ANGLE</h2>
          <p className="math">α = {equation.reference}</p>
          <h2>QUADRANT LOGIC</h2>
          <p>{equation.logic}</p>
          <p>
            Filter the periodic roots to retain only values in {interval.label}.
          </p>
        </section>
        <section className="ps10127-circle">
          <h2>UNIT CIRCLE</h2>
          <svg
            viewBox="0 0 430 390"
            aria-label="Principal solutions unit circle"
          >
            <line className="axis" x1="45" y1="190" x2="390" y2="190" />
            <line className="axis" x1="215" y1="25" x2="215" y2="355" />
            <circle className="unit" cx="215" cy="190" r="145" />
            {principal.map((value) => {
              const x = 215 + 145 * Math.cos(value),
                y = 190 - 145 * Math.sin(value);
              return (
                <g key={value}>
                  <line className="ray" x1="215" y1="190" x2={x} y2={y} />
                  <line className="projection" x1={x} y1={y} x2={x} y2="190" />
                  <circle cx={x} cy={y} r="6" />
                  <text x={x + (x > 215 ? 8 : -42)} y={y - 9}>
                    {angleLabel(value)}
                  </text>
                  <text x={x + (x > 215 ? 8 : -42)} y={y + 17}>
                    {quadrant(value)}
                  </text>
                </g>
              );
            })}
            <text x="365" y="182">
              0, 2π
            </text>
            <text x="220" y="41">
              π/2
            </text>
            <text x="28" y="182">
              π
            </text>
            <text x="220" y="350">
              3π/2
            </text>
          </svg>
          <label>
            <input
              aria-label="Show selected solutions only"
              type="checkbox"
              checked={selectedOnly}
              onChange={(event) => setSelectedOnly(event.target.checked)}
            />{" "}
            Show selected solutions only
          </label>
          <p>
            Coterminal solutions outside {interval.label} are{" "}
            {selectedOnly ? "hidden" : "shown in the comparison panel"}.
          </p>
        </section>
        <aside className="ps10127-results">
          <h2>EXACT COORDINATES</h2>
          <table>
            <thead>
              <tr>
                <th>x</th>
                <th>(cos x, sin x)</th>
                <th>cos x</th>
                <th>sin x</th>
              </tr>
            </thead>
            <tbody>
              {principal.map((value) => (
                <tr key={value}>
                  <td>
                    {angleLabel(value)} ({degrees(value)}°)
                  </td>
                  <td>
                    ({Math.cos(value).toFixed(3)}, {Math.sin(value).toFixed(3)})
                  </td>
                  <td>{Math.cos(value).toFixed(3)}</td>
                  <td>{Math.sin(value).toFixed(3)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <h2>CHECK</h2>
          <p className="check">✓ Every solution gives {equation.label}.</p>
          <p className="check">✓ All lie in the interval {interval.label}.</p>
          {contrast && (
            <article className="ps10127-hidden">
              <header>
                OTHER COTERMINAL SOLUTIONS <EyeOff />
              </header>
              <p>{hidden.map(angleLabel).join(", ")}, …</p>
              <span>Outside {interval.label}, so they are masked.</span>
            </article>
          )}
        </aside>
      </main>
      <aside className="ps10127-tip">
        <Lightbulb />
        <p>
          <strong>Best classroom move:</strong> Ask learners to predict the
          quadrant(s), find the reference angle, then apply interval filtering
          to report only principal solutions.
        </p>
      </aside>
    </section>
  );
}
