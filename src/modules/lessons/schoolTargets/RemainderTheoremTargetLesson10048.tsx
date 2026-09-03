import {
  ArrowLeft,
  ArrowRight,
  Check,
  RotateCcw,
  Shuffle,
  TriangleAlert,
} from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import type { SchoolSyllabusLesson } from "../syllabus/lessonSyllabusTypes";
import "./RemainderTheoremTargetLesson10048.css";

const presets = [
  { label: "x² + 3x + 2", coefficients: [1, 3, 2] },
  { label: "x³ − 4x + 1", coefficients: [1, 0, -4, 1] },
  { label: "2x³ − x + 4", coefficients: [2, 0, -1, 4] },
];
const tabs = ["Interact", "Learn", "Example", "Formula", "Practice"];
const superDigit = (degree: number) =>
  degree === 2 ? "²" : degree === 3 ? "³" : degree > 1 ? `^${degree}` : "";
const poly = (cs: number[]) =>
  cs
    .map((v, i) => {
      const d = cs.length - i - 1,
        variable = d ? `x${superDigit(d)}` : "";
      if (!v) return i ? `+ 0${variable}` : `0${variable}`;
      const sign = v < 0 ? "−" : i ? "+" : "",
        amount = Math.abs(v) === 1 && d ? "" : Math.abs(v);
      return `${sign} ${amount}${variable}`.trim();
    })
    .join(" ");
const synthetic = (cs: number[], a: number) => {
  const q = [cs[0]],
    work = [...cs],
    rows: { product: number[]; after: number[] }[] = [];
  for (let i = 0; i < cs.length - 1; i++) {
    if (i) q.push(work[i]);
    const product = Array(cs.length).fill(0);
    product[i] = q[i];
    product[i + 1] = -a * q[i];
    work[i] -= product[i];
    work[i + 1] -= product[i + 1];
    rows.push({ product, after: [...work] });
  }
  return { quotient: q, remainder: work.at(-1)!, rows };
};
function parsePolynomial(source: string) {
  const terms = source
    .replaceAll("−", "-")
    .replaceAll(" ", "")
    .replace(/-/g, "+-")
    .split("+")
    .filter(Boolean);
  if (!terms.length) return null;
  const parsed = terms.map((item) => {
    const match = item.match(/^([+-]?\d*\.?\d*)?(x(?:\^(\d+))?)?$/i);
    if (!match || (!match[1] && !match[2])) return null;
    const degree = match[2] ? Number(match[3] ?? 1) : 0,
      raw = match[1],
      coefficient = match[2]
        ? raw === "" || raw === "+" || raw === undefined
          ? 1
          : raw === "-"
            ? -1
            : Number(raw)
        : Number(raw);
    return Number.isFinite(coefficient) ? { degree, coefficient } : null;
  });
  if (parsed.some((item) => !item)) return null;
  const maxDegree = Math.max(...parsed.map((item) => item!.degree)),
    coefficients = Array(maxDegree + 1).fill(0);
  parsed.forEach((item) => {
    coefficients[maxDegree - item!.degree] += item!.coefficient;
  });
  return coefficients[0] ? coefficients : null;
}

export default function RemainderTheoremTargetLesson10048({
  lesson: _lesson,
}: {
  lesson: SchoolSyllabusLesson;
}) {
  const [preset, setPreset] = useState(0),
    [custom, setCustom] = useState(""),
    [a, setA] = useState(2),
    [tab, setTab] = useState("Interact"),
    [quick, setQuick] = useState<number | null>(null),
    [quickChecked, setQuickChecked] = useState(false),
    [actions, setActions] = useState(0);
  const parsedCustom = useMemo(() => parsePolynomial(custom), [custom]),
    coefficients = parsedCustom ?? presets[preset].coefficients,
    result = useMemo(() => synthetic(coefficients, a), [coefficients, a]),
    act = (fn: () => void) => {
      fn();
      setActions((n) => n + 1);
    };
  const reset = () =>
      act(() => {
        setPreset(0);
        setCustom("");
        setA(2);
        setQuick(null);
        setQuickChecked(false);
      }),
    randomize = () =>
      act(() => {
        setPreset((p) => (p + 1) % presets.length);
        setCustom("");
        setA((v) => (v === 2 ? -1 : v === -1 ? 3 : 2));
      });
  return (
    <section
      className="rem10048-page"
      data-testid="school-mockup-0722"
      data-object-model="dedicated-remainder-theorem-synthetic-substitution-engine"
      data-polynomial={poly(coefficients)}
      data-a={a}
      data-quotient={poly(result.quotient)}
      data-remainder={result.remainder}
      data-identity="true"
      data-quick={quickChecked ? String(quick === 16) : "idle"}
      data-actions={actions}
    >
      <header className="rem10048-hero">
        <small>CLASS 9 · POLYNOMIALS</small>
        <h1>Remainder Theorem</h1>
        <p>Discover that the remainder on division by x−a equals p(a).</p>
        <aside>
          <b>◉ THEOREM</b>
          <span>When p(x) is divided by x−a, the remainder is p(a).</span>
        </aside>
        <dl>
          <dt>Level:</dt>
          <dd>Class 9</dd>
          <dt>Topic:</dt>
          <dd>Polynomials</dd>
          <dt>Duration:</dt>
          <dd>30 min</dd>
          <dt>Part of:</dt>
          <dd>Polynomials</dd>
        </dl>
        <nav>
          {tabs.map((item) => (
            <button
              key={item}
              className={tab === item ? "active" : ""}
              onClick={() => act(() => setTab(item))}
            >
              {item}
            </button>
          ))}
        </nav>
      </header>
      <main className="rem10048-main">
        <section className="rem-lab">
          <header>
            <div>
              <h2>INTERACTIVE LAB: Division &amp; Substitution</h2>
              <p>
                Change p(x) or the value of a. See the remainder, identity, and
                graph update instantly.
              </p>
            </div>
            <button onClick={reset}>
              <RotateCcw /> Reset
            </button>
            <button onClick={randomize}>
              <Shuffle /> Randomize
            </button>
          </header>
          <div className="rem-lab-grid">
            <aside>
              <section>
                <h3>1. Choose polynomial p(x)</h3>
                <select
                  value={preset}
                  onChange={(e) =>
                    act(() => {
                      setPreset(Number(e.target.value));
                      setCustom("");
                    })
                  }
                >
                  {presets.map((item, i) => (
                    <option key={item.label} value={i}>
                      {item.label}
                    </option>
                  ))}
                </select>
                <p>or enter your own</p>
                <input
                  aria-label="Custom polynomial"
                  placeholder="e.g. x^3 - 2x + 1"
                  value={custom}
                  onChange={(e) => act(() => setCustom(e.target.value))}
                />
                {custom && !parsedCustom && (
                  <small>Use terms such as 2x^3 - x + 4.</small>
                )}
              </section>
              <section>
                <h3>2. Choose divisor x − a</h3>
                <p>Move the slider to set a.</p>
                <label>
                  a = {a}
                  <input
                    type="number"
                    value={a}
                    onChange={(e) => act(() => setA(Number(e.target.value)))}
                  />
                </label>
                <input
                  type="range"
                  min="-10"
                  max="10"
                  value={a}
                  onChange={(e) => act(() => setA(Number(e.target.value)))}
                />
              </section>
            </aside>
            <section className="rem-division">
              <h3>3. Polynomial Division by x − a</h3>
              <LongDivision
                coefficients={coefficients}
                a={a}
                quotient={result.quotient}
                remainder={result.remainder}
                rows={result.rows}
              />
            </section>
            <section className="rem-substitution">
              <h3>4. Substitution Check</h3>
              <Formula>p(a) = p({a})</Formula>
              <Formula>
                ={" "}
                {coefficients
                  .map(
                    (v, i) =>
                      `${v}(${a})${superDigit(coefficients.length - i - 1)}`,
                  )
                  .join(" + ")}
              </Formula>
              <Formula>= {result.remainder}</Formula>
              <strong>p(a) = {result.remainder}</strong>
            </section>
            <section className="rem-identity">
              <h3>5. Quotient–Remainder Identity</h3>
              <Formula>p(x) = (x − a)q(x) + R</Formula>
              <Formula>
                {poly(coefficients)} = (x {a < 0 ? "+" : "−"} {Math.abs(a)})(
                {poly(result.quotient)}) {result.remainder < 0 ? "−" : "+"}{" "}
                {Math.abs(result.remainder)}
              </Formula>
              <strong>
                Identity Verified <Check />
              </strong>
            </section>
            <section className="rem-graph">
              <h3>6. Graph &amp; Remainder</h3>
              <p>The remainder is the y-value of p(x) at x = a.</p>
              <PolynomialGraph
                coefficients={coefficients}
                a={a}
                value={result.remainder}
              />
            </section>
          </div>
        </section>
        <section className="rem-theory">
          <article>
            <h2>WHY IT WORKS</h2>
            <p>
              By the Division Algorithm, for any polynomial p(x) and number a,
            </p>
            <Formula>p(x) = (x−a)q(x) + R</Formula>
            <p>Substitute x=a on both sides:</p>
            <Formula>p(a) = 0·q(a)+R = R</Formula>
            <strong>Therefore, the remainder R = p(a).</strong>
          </article>
          <article>
            <h2>WORKED EXAMPLE</h2>
            <p>Find the remainder when p(x)=x²+3x+2 is divided by x−2.</p>
            <p>
              <b>Method 1: Division</b> gives remainder 12.
            </p>
            <p>
              <b>Method 2: Substitution</b>
            </p>
            <Formula>p(2)=2²+3(2)+2=12</Formula>
            <strong>Remainder = p(2) = 12</strong>
          </article>
          <article className="rem-warning">
            <h2>
              <TriangleAlert /> IMPORTANT WARNING
            </h2>
            <p>
              The Remainder Theorem gives the remainder, not necessarily a
              factor.
            </p>
            <p>
              If p(a)=0, then x−a is a factor. If p(a)≠0, it is not a factor.
            </p>
            <p>Here p(2)=12≠0, so x−2 is not a factor.</p>
          </article>
        </section>
        <section className="rem-challenges">
          <article>
            <h2>CHALLENGE: Try It</h2>
            <p>Find the remainder when p(x)=2x³−x+4 is divided by x+1.</p>
            <p>
              <b>Step 1:</b> x+1=x−(−1), so a=−1.
            </p>
            <p>
              <b>Step 2:</b> p(−1)=2(−1)³−(−1)+4=3
            </p>
            <strong>
              Remainder = 3 <span>Great! That's correct.</span>
              <Check />
            </strong>
          </article>
          <article>
            <h2>QUICK CHECK</h2>
            <p>What is the remainder when p(x)=x³−4x+1 is divided by x−3?</p>
            {[-26, -17, 16, 26].map((value, i) => (
              <label key={value}>
                <input
                  type="radio"
                  name="quick-rem"
                  checked={quick === value}
                  onChange={() =>
                    act(() => {
                      setQuick(value);
                      setQuickChecked(false);
                    })
                  }
                />
                {String.fromCharCode(65 + i)}. {value}
              </label>
            ))}
            <button onClick={() => act(() => setQuickChecked(true))}>
              Check Answer
            </button>
            {quickChecked && (
              <b className={quick === 16 ? "correct" : "retry"}>
                {quick === 16
                  ? "Correct: p(3)=27−12+1=16."
                  : "Substitute x=3 directly."}
              </b>
            )}
          </article>
        </section>
      </main>
      <nav className="rem10048-adjacent">
        <Link to="/lessons/school/class-9/class-9-polynomials-polynomial-division">
          <ArrowLeft />
          <span>
            <small>Previous Lesson</small>Polynomial Division
          </span>
        </Link>
        <Link to="/lessons/school/class-9/class-9-polynomials-factor-theorem">
          <span>
            <small>Next Lesson</small>Factor Theorem
          </span>
          <ArrowRight />
        </Link>
      </nav>
    </section>
  );
}
function Formula({ children }: { children: React.ReactNode }) {
  return <div className="rem-formula">{children}</div>;
}
function LongDivision({
  coefficients,
  a,
  quotient,
  remainder,
  rows,
}: {
  coefficients: number[];
  a: number;
  quotient: number[];
  remainder: number;
  rows: { product: number[]; after: number[] }[];
}) {
  return (
    <div className="rem-long">
      <Formula>{poly(quotient)}</Formula>
      <div>
        <b>
          x {a < 0 ? "+" : "−"} {Math.abs(a)}
        </b>
        <section>
          <span>{poly(coefficients)}</span>
          {rows.map((row, i) => (
            <article key={i}>
              <span>− ({poly(row.product.slice(i, i + 2))})</span>
              <hr />
              <span>{poly(row.after.slice(i + 1))}</span>
            </article>
          ))}
        </section>
      </div>
      <footer>
        <span>Quotient q(x) = {poly(quotient)}</span>
        <span>Remainder R = {remainder}</span>
      </footer>
    </div>
  );
}
function PolynomialGraph({
  coefficients,
  a,
  value,
}: {
  coefficients: number[];
  a: number;
  value: number;
}) {
  const ref = useRef<SVGSVGElement>(null),
    sx = (x: number) => 30 + (x + 8) * 20,
    sy = (y: number) => 170 - y * 5,
    evalP = (x: number) => coefficients.reduce((sum, c) => sum * x + c, 0),
    path = Array.from({ length: 161 }, (_, i) => {
      const x = -8 + i / 10;
      return `${i ? "L" : "M"}${sx(x)},${sy(evalP(x))}`;
    }).join(" ");
  return (
    <svg ref={ref} className="rem-svg" viewBox="0 0 360 220">
      <g>
        {Array.from({ length: 17 }, (_, i) => (
          <line key={i} x1={30 + i * 20} x2={30 + i * 20} y1="10" y2="200" />
        ))}
      </g>
      <line className="axis" x1="10" x2="350" y1={sy(0)} y2={sy(0)} />
      <line className="axis" x1={sx(0)} x2={sx(0)} y1="10" y2="200" />
      <path d={path} />
      <line className="marker" x1={sx(a)} x2={sx(a)} y1="10" y2="200" />
      <circle cx={sx(a)} cy={sy(value)} r="6" />
      <text x={sx(a) + 10} y={sy(value) - 8}>
        ({a}, {value}) = (a, p(a))
      </text>
    </svg>
  );
}
