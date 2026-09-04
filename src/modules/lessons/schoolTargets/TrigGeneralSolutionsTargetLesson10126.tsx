import { Info, Minus, Plus, RotateCcw } from "lucide-react";
import { useMemo, useState } from "react";
import type { SchoolSyllabusLesson } from "../syllabus/lessonSyllabusTypes";
import "./TrigGeneralSolutionsTargetLesson10126.css";

type EquationKey =
  "sin-half" | "cos-half" | "sin-zero" | "cos-zero" | "tan-one";
type Equation = {
  label: string;
  fn: "sin" | "cos" | "tan";
  target: number;
  roots: number[];
  period: number;
  compact: string;
  reference: string;
};

const PI = Math.PI;
const equations: Record<EquationKey, Equation> = {
  "sin-half": {
    label: "sin x = 1/2",
    fn: "sin",
    target: 0.5,
    roots: [PI / 6, (5 * PI) / 6],
    period: 2 * PI,
    compact: "x = nπ + (-1)ⁿ π/6",
    reference: "π/6",
  },
  "cos-half": {
    label: "cos x = 1/2",
    fn: "cos",
    target: 0.5,
    roots: [PI / 3, (5 * PI) / 3],
    period: 2 * PI,
    compact: "x = 2nπ ± π/3",
    reference: "π/3",
  },
  "sin-zero": {
    label: "sin x = 0",
    fn: "sin",
    target: 0,
    roots: [0, PI],
    period: 2 * PI,
    compact: "x = nπ",
    reference: "0",
  },
  "cos-zero": {
    label: "cos x = 0",
    fn: "cos",
    target: 0,
    roots: [PI / 2, (3 * PI) / 2],
    period: 2 * PI,
    compact: "x = π/2 + nπ",
    reference: "π/2",
  },
  "tan-one": {
    label: "tan x = 1",
    fn: "tan",
    target: 1,
    roots: [PI / 4],
    period: PI,
    compact: "x = π/4 + nπ",
    reference: "π/4",
  },
};

const fraction = (angle: number) => {
  const numerator = Math.round((angle / PI) * 12);
  if (numerator === 0) return "0";
  const gcd = (a: number, b: number): number =>
    b ? gcd(b, a % b) : Math.abs(a);
  const divisor = gcd(numerator, 12);
  const top = numerator / divisor;
  const bottom = 12 / divisor;
  if (bottom === 1) return `${top === 1 ? "" : top === -1 ? "-" : top}π`;
  return `${top === 1 ? "" : top === -1 ? "-" : top}π/${bottom}`;
};

export default function TrigGeneralSolutionsTargetLesson10126({
  lesson: _lesson,
}: {
  lesson: SchoolSyllabusLesson;
}) {
  const [equationKey, setEquationKey] = useState<EquationKey>("sin-half");
  const [n, setN] = useState(0);
  const [actions, setActions] = useState(0);
  const equation = equations[equationKey];
  const solutions = equation.roots.map((root) => root + n * equation.period);
  const timeline = useMemo(() => {
    const points: { angle: number; family: number }[] = [];
    equation.roots.forEach((root, family) => {
      for (let k = -4; k <= 4; k += 1) {
        const angle = root + k * equation.period;
        if (angle >= -3 * PI - 0.001 && angle <= 3 * PI + 0.001)
          points.push({ angle, family });
      }
    });
    return points.sort((a, b) => a.angle - b.angle);
  }, [equation]);
  const evaluate = (x: number) => Math[equation.fn](x);
  const selectEquation = (next: EquationKey) => {
    setEquationKey(next);
    setN(0);
    setActions((count) => count + 1);
  };
  const changeN = (next: number) => {
    setN(Math.max(-3, Math.min(3, next)));
    setActions((count) => count + 1);
  };
  const reset = () => {
    setEquationKey("sin-half");
    setN(0);
    setActions((count) => count + 1);
  };
  const rootPoints = equation.roots.map((root) => ({
    x: 170 + 112 * Math.cos(root),
    y: 150 - 112 * Math.sin(root),
  }));

  return (
    <section
      className="gs10126-page"
      data-testid="school-mockup-0800"
      data-object-model="dedicated-periodic-trig-solution-family-engine"
      data-equation={equationKey}
      data-n={n}
      data-family-count={equation.roots.length}
      data-solutions={solutions.map(fraction).join(";")}
      data-timeline-count={timeline.length}
      data-verified={String(
        solutions.every(
          (value) => Math.abs(evaluate(value) - equation.target) < 1e-8,
        ),
      )}
      data-actions={actions}
    >
      <header>
        <small>CLASS 11 · TRIGONOMETRY</small>
        <h1>General Solutions of Trigonometric Equations</h1>
        <p>
          A general solution lists every angle produced by the repeating period,
          not only the principal answers.
        </p>
        <nav>
          <span>18 min</span>
          <span>ADVANCED</span>
          <span>CONCEPT</span>
          <span>graph</span>
        </nav>
      </header>
      <section className="gs10126-toolbar">
        <div>
          <strong>INTERACTIVE LAB · SOLUTION EXPLORER</strong>
          <p>
            Explore general solutions on the unit circle and the infinite
            solution timeline.
          </p>
        </div>
        <label>
          Select equation
          <select
            aria-label="Select equation"
            value={equationKey}
            onChange={(event) =>
              selectEquation(event.target.value as EquationKey)
            }
          >
            {Object.entries(equations).map(([key, item]) => (
              <option value={key} key={key}>
                {item.label}
              </option>
            ))}
          </select>
        </label>
        <button onClick={reset}>
          <RotateCcw /> Reset lab
        </button>
      </section>
      <main>
        <section className="gs10126-circle">
          <h2>UNIT CIRCLE</h2>
          <p>
            Show <em>{equation.label}</em> on the unit circle.
          </p>
          <svg
            viewBox="0 0 340 310"
            aria-label="Trigonometric solution unit circle"
          >
            <line className="axis" x1="28" y1="150" x2="316" y2="150" />
            <line className="axis" x1="170" y1="15" x2="170" y2="290" />
            <circle className="unit" cx="170" cy="150" r="112" />
            {equation.fn === "sin" && (
              <line
                className="level"
                x1="58"
                y1={150 - equation.target * 112}
                x2="282"
                y2={150 - equation.target * 112}
              />
            )}{" "}
            {equation.fn === "cos" && (
              <line
                className="level"
                x1={170 + equation.target * 112}
                y1="38"
                x2={170 + equation.target * 112}
                y2="262"
              />
            )}
            {rootPoints.map((point, index) => (
              <g key={index}>
                <line
                  className={`ray family${index}`}
                  x1="170"
                  y1="150"
                  x2={point.x}
                  y2={point.y}
                />
                <circle
                  className={`family${index}`}
                  cx={point.x}
                  cy={point.y}
                  r="6"
                />
                <text x={point.x + (point.x > 170 ? 8 : -36)} y={point.y - 8}>
                  {fraction(equation.roots[index])}
                </text>
              </g>
            ))}
          </svg>
          <footer>
            <label>
              n (integer)
              <div>
                <button aria-label="Decrease n" onClick={() => changeN(n - 1)}>
                  <Minus />
                </button>
                <strong>{n}</strong>
                <button aria-label="Increase n" onClick={() => changeN(n + 1)}>
                  <Plus />
                </button>
              </div>
              <input
                aria-label="Solution family integer"
                type="range"
                min="-3"
                max="3"
                step="1"
                value={n}
                onChange={(event) => changeN(Number(event.target.value))}
              />
            </label>
            <span>Highlighted points correspond to n = {n}.</span>
          </footer>
        </section>
        <aside className="gs10126-families">
          <article>
            <h2>
              SOLUTION FAMILIES <small>(radians)</small>
            </h2>
            {equation.roots.map((root, index) => (
              <div key={root}>
                <i className={`family${index}`} />
                <strong>Family {index + 1}</strong>
                <p>
                  x = {fraction(root)} + {fraction(equation.period)}n, &nbsp; n
                  ∈ Z
                </p>
              </div>
            ))}
          </article>
          <article>
            <h2>REFERENCE ANGLE</h2>
            <p>α = {equation.reference}</p>
          </article>
          <article>
            <h2>EQUIVALENT COMPACT FORM</h2>
            <p>{equation.compact}, &nbsp; n ∈ Z</p>
          </article>
          <footer>
            <Info />
            <p>
              All displayed families generate every solution. Periodic copies
              are coterminal on the unit circle.
            </p>
          </footer>
        </aside>
        <section className="gs10126-timeline">
          <h2>
            INFINITE SOLUTION TIMELINE <small>(3π span)</small>
          </h2>
          <p>All solutions repeat by the equation's period.</p>
          <div className="timeline">
            <hr />
            {[-3, -2, -1, 0, 1, 2, 3].map((value) => (
              <span
                className="tick"
                style={{ left: `${((value + 3) / 6) * 100}%` }}
                key={value}
              >
                {value === 0 ? "0" : `${value}π`}
              </span>
            ))}
            {timeline.map((point, index) => (
              <button
                aria-label={`Solution ${fraction(point.angle)}`}
                className={`point family${point.family} ${solutions.some((value) => Math.abs(value - point.angle) < 0.001) ? "current" : ""}`}
                style={{
                  left: `${((point.angle + 3 * PI) / (6 * PI)) * 100}%`,
                }}
                key={`${point.angle}-${index}`}
                onClick={() =>
                  changeN(
                    Math.round(
                      (point.angle - equation.roots[point.family]) /
                        equation.period,
                    ),
                  )
                }
              >
                <i />
                <b>{fraction(point.angle)}</b>
              </button>
            ))}
          </div>
          <div className="orbit-row">
            {timeline.slice(0, 7).map((point, index) => (
              <svg key={index} viewBox="0 0 70 70">
                <circle cx="35" cy="35" r="25" />
                <line
                  x1="35"
                  y1="35"
                  x2={35 + 25 * Math.cos(point.angle)}
                  y2={35 - 25 * Math.sin(point.angle)}
                />
                <circle
                  className={`family${point.family}`}
                  cx={35 + 25 * Math.cos(point.angle)}
                  cy={35 - 25 * Math.sin(point.angle)}
                  r="4"
                />
              </svg>
            ))}
          </div>
          <footer>
            <span>For n = {n}:</span>
            {solutions.map((value, index) => (
              <strong className={`family${index}`} key={value}>
                x = {fraction(value)}
              </strong>
            ))}
            <p>These are the principal families shifted by n periods.</p>
          </footer>
        </section>
      </main>
      <section className="gs10126-bottom">
        <article>
          <h2>VERIFY ({equation.fn} x)</h2>
          {solutions.map((value) => (
            <p key={value}>
              {equation.fn}({fraction(value)}) ={" "}
              {Math[equation.fn](value).toFixed(3)} = {equation.target}
            </p>
          ))}
        </article>
        <article>
          <h2>GENERAL SOLUTION</h2>
          <p>
            {equation.label} ⇒{" "}
            {equation.roots
              .map(
                (root, index) =>
                  `x = ${fraction(root)} + ${fraction(equation.period)}n${index < equation.roots.length - 1 ? " or " : ""}`,
              )
              .join("")}
            , n ∈ Z
          </p>
          <p>equivalently, {equation.compact}</p>
        </article>
      </section>
    </section>
  );
}
