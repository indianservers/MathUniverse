import {
  ArrowLeft,
  ArrowRight,
  Check,
  CircleAlert,
  RotateCcw,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import type { SchoolSyllabusLesson } from "../syllabus/lessonSyllabusTypes";
import "./NthRootsTargetLesson10045.css";

const tabs = ["Interact", "Learn", "Example", "Formula", "Practice"];
const matchRows = [
  { power: "(−27)³", root: "∛(−27)³ = −27" },
  { power: "5⁴", root: "⁴√5⁴ = 5" },
  { power: "81²", root: "√81² = 81" },
  { power: "(−16)³", root: "∛(−16)³ = −16" },
];

export default function NthRootsTargetLesson10045({
  lesson: _lesson,
}: {
  lesson: SchoolSyllabusLesson;
}) {
  const [base, setBase] = useState(-8),
    [index, setIndex] = useState(3),
    [tab, setTab] = useState("Interact"),
    [matches, setMatches] = useState(matchRows.map((row) => row.root)),
    [explanation, setExplanation] = useState(""),
    [checked, setChecked] = useState(false),
    [actions, setActions] = useState(0);
  const odd = index % 2 === 1;
  const power = base ** index;
  const root =
    base < 0 && !odd ? null : Math.sign(base) * Math.abs(base) ** (1 / index);
  const exactRoot =
    root === null
      ? "no real root"
      : Number.isInteger(root)
        ? String(root)
        : root.toFixed(4);
  const factors = useMemo(
    () => Array.from({ length: Math.min(index, 8) }, () => base),
    [base, index],
  );
  const matchesCorrect = matches.every(
    (value, i) => value === matchRows[i].root,
  );
  const explanationCorrect =
    /even/i.test(explanation) &&
    /(negative|less than zero|non.?negative)/i.test(explanation);
  const act = (fn: () => void) => {
    fn();
    setActions((n) => n + 1);
  };
  const setKind = (kind: "odd" | "even") =>
    act(() => setIndex(kind === "odd" ? 3 : 4));
  const reset = () =>
    act(() => {
      setBase(-8);
      setIndex(3);
    });
  return (
    <section
      className="roots10045-page"
      data-testid="school-mockup-0719"
      data-object-model="dedicated-power-root-domain-and-matching-engine"
      data-base={base}
      data-index={index}
      data-power={power}
      data-root={exactRoot}
      data-challenge={
        checked ? String(matchesCorrect && explanationCorrect) : "idle"
      }
      data-actions={actions}
    >
      <header className="roots10045-hero">
        <small>CLASS 9 · REAL NUMBERS</small>
        <h1>Nth Roots and Radical Meaning</h1>
        <p>
          Interpret nth roots as inverse powers and explore real-root behaviour.
        </p>
        <div>
          <span>18 min</span>
          <span>INTERMEDIATE</span>
          <span>CONCEPT</span>
          <span>KEY IDEA</span>
        </div>
        <Link to="/lessons/school">
          <ArrowLeft /> School lessons
        </Link>
      </header>
      <nav className="roots10045-tabs">
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
      <main className="roots10045-main">
        <section className="roots-machine">
          <header>
            <h2>
              POWER–ROOT MACHINE <small>ⓘ</small>
            </h2>
            <p>
              Choose a base (a) and an index (n). See repeated factors, the
              power aⁿ, and the real root (principal value).
            </p>
          </header>
          <div className="roots-controls">
            <Stepper
              label="BASE (a)"
              value={base}
              onDown={() => act(() => setBase((v) => Math.max(-16, v - 1)))}
              onUp={() => act(() => setBase((v) => Math.min(16, v + 1)))}
            />
            <Stepper
              label="INDEX (n)"
              value={index}
              onDown={() => act(() => setIndex((v) => Math.max(2, v - 1)))}
              onUp={() => act(() => setIndex((v) => Math.min(6, v + 1)))}
            />
            <div>
              <b>INDEX TYPE</b>
              <div className="roots-segment">
                <button
                  className={odd ? "active" : ""}
                  onClick={() => setKind("odd")}
                >
                  Odd (allows all real a)
                </button>
                <button
                  className={!odd ? "active" : ""}
                  onClick={() => setKind("even")}
                >
                  Even (needs a ≥ 0)
                </button>
              </div>
            </div>
            <div>
              <b>RESET</b>
              <button className="roots-reset" onClick={reset}>
                <RotateCcw />
              </button>
            </div>
          </div>
          <section className="roots-flow">
            <article>
              <h3>1. REPEATED FACTORS</h3>
              <p>Multiply a by itself n times.</p>
              <div className="factor-row">
                {factors.map((factor, i) => (
                  <span key={i}>
                    {factor}
                    {i < factors.length - 1 && <i>×</i>}
                  </span>
                ))}
              </div>
              <b>{factors.join(" × ")}</b>
            </article>
            <i>→</i>
            <article>
              <h3>2. POWER (aⁿ)</h3>
              <p>The result of the multiplication.</p>
              <Formula>
                ({base})<sup>{index}</sup> = {power}
              </Formula>
            </article>
            <i>→</i>
            <article>
              <h3>3. REAL ROOT (ⁿ√a)</h3>
              <p>The principal real root b such that bⁿ = a.</p>
              <Formula>
                <sup>{index}</sup>√{base} = {exactRoot}
              </Formula>
              <b>
                {root === null
                  ? "Even roots of negative numbers are not real."
                  : `Check: (${exactRoot})${index} = ${base} ✓`}
              </b>
            </article>
          </section>
          <section className="roots-lines">
            <NumberLine
              title="ODD INDEX (n = 3)"
              subtitle="All real numbers are allowed."
              value={-2}
              min={-16}
              max={16}
              formula="∛(−8) = −2"
            />
            <NumberLine
              title="EVEN INDEX (n = 4)"
              subtitle="Only a ≥ 0 has real roots."
              value={2}
              min={-16}
              max={16}
              formula="⁴√16 = 2"
            />
          </section>
          <section className="roots-rule">
            <article>
              <h3>THE RULE</h3>
              <Formula>ⁿ√a = b means bⁿ = a.</Formula>
              <p>• If n is odd, a can be any real number.</p>
              <p>• If n is even, a must be ≥ 0 in the real numbers.</p>
            </article>
            <article>
              <h3>EXAMPLES</h3>
              <p>
                <Check /> ∛(−8) = −2 because (−2)³ = −8.
              </p>
              <p>
                <Check /> ⁴√16 = 2 because 2⁴ = 16 (principal real root).
              </p>
            </article>
            <article className="roots-mistake">
              <h3>
                <CircleAlert /> COMMON MISCONCEPTION
              </h3>
              <p>
                Writing ± for the radical symbol confuses a principal root with
                solutions of x² = a.
              </p>
              <p>We use the principal real root.</p>
            </article>
          </section>
        </section>
        <section className="roots-lower">
          <article>
            <h2>ⓘ WHY IT WORKS</h2>
            <p>An nth root undoes a power.</p>
            <Formula>a → aⁿ → ⁿ√a = b</Formula>
            <Formula>bⁿ = a</Formula>
            <p>
              For even n, negative numbers have no real root because no real
              number, when raised to an even power, becomes negative.
            </p>
          </article>
          <article>
            <h2>WORKED EXAMPLE</h2>
            <div>
              <span>
                <b>1</b>
                <p>Find ∛(−8). We need b³ = −8.</p>
                <Formula>∛(−8) = −2</Formula>
              </span>
              <span>
                <b>2</b>
                <p>Find ⁴√16. We need b ≥ 0 with b⁴ = 16.</p>
                <Formula>⁴√16 = 2</Formula>
              </span>
            </div>
          </article>
        </section>
        <section className="roots-challenge">
          <header>
            <h2>MINI CHALLENGE</h2>
            <p>Match each power with its correct root (principal real root).</p>
          </header>
          <div className="roots-matches">
            {matchRows.map((row, i) => (
              <label key={row.power}>
                <b>{i + 1}</b>
                <span>{row.power}</span>
                <select
                  value={matches[i]}
                  onChange={(e) =>
                    act(() => {
                      setMatches((old) =>
                        old.map((v, j) => (j === i ? e.target.value : v)),
                      );
                      setChecked(false);
                    })
                  }
                >
                  {matchRows.map((choice) => (
                    <option key={choice.root}>{choice.root}</option>
                  ))}
                </select>
              </label>
            ))}
          </div>
          <aside>
            <h3>EXPLAIN</h3>
            <p>Why does ⁴√(−16) have no real value?</p>
            <textarea
              aria-label="Root explanation"
              placeholder="Type your explanation here..."
              value={explanation}
              onChange={(e) =>
                act(() => {
                  setExplanation(e.target.value);
                  setChecked(false);
                })
              }
            />
            <button onClick={() => act(() => setChecked(true))}>
              Check answer
            </button>
            {checked && (
              <b
                className={
                  matchesCorrect && explanationCorrect ? "correct" : "retry"
                }
              >
                {matchesCorrect && explanationCorrect
                  ? "All matches and explanation are correct."
                  : "Mention that an even power cannot produce a negative real number."}
              </b>
            )}
          </aside>
        </section>
      </main>
      <nav className="roots10045-adjacent">
        <Link to="/lessons/school/class-9/class-9-real-numbers-successive-magnification-on-the-number-line">
          <ArrowLeft />
          <span>
            <small>Previous</small>Real Numbers on the Number Line
          </span>
        </Link>
        <Link to="/lessons/school/class-9/class-9-real-numbers-rationalisation-of-denominators">
          <span>
            <small>Next</small>Rationalisation of Denominators
          </span>
          <ArrowRight />
        </Link>
      </nav>
    </section>
  );
}

function Stepper({
  label,
  value,
  onDown,
  onUp,
}: {
  label: string;
  value: number;
  onDown: () => void;
  onUp: () => void;
}) {
  return (
    <div>
      <b>{label}</b>
      <div className="roots-stepper">
        <button onClick={onDown}>−</button>
        <strong>{value}</strong>
        <button onClick={onUp}>+</button>
      </div>
    </div>
  );
}
function Formula({ children }: { children: React.ReactNode }) {
  return <div className="roots-formula">{children}</div>;
}
function NumberLine({
  title,
  subtitle,
  value,
  min,
  max,
  formula,
}: {
  title: string;
  subtitle: string;
  value: number;
  min: number;
  max: number;
  formula: string;
}) {
  const left = ((value - min) / (max - min)) * 100;
  return (
    <article>
      <h3>{title}</h3>
      <p>{subtitle}</p>
      <div className="roots-axis">
        <b style={{ left: `${left}%` }}>{value}</b>
        {[-16, -8, 0, 8, 16].map((tick) => (
          <span
            key={tick}
            style={{ left: `${((tick - min) / (max - min)) * 100}%` }}
          >
            {tick}
          </span>
        ))}
      </div>
      <Formula>{formula}</Formula>
    </article>
  );
}
