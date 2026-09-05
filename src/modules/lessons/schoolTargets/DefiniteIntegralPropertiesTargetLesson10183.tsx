import { CheckCircle2, RotateCcw } from "lucide-react";
import { useState } from "react";
import type { KeyboardEvent, PointerEvent as ReactPointerEvent } from "react";
import { Link } from "react-router-dom";
import type { SchoolSyllabusLesson } from "../syllabus/lessonSyllabusTypes";
import "./DefiniteIntegralPropertiesTargetLesson10183.css";

const names = [
  "Zero-width interval",
  "Additivity",
  "Reversal of limits",
  "Constant multiple",
  "Even function symmetry",
  "Odd function symmetry",
];
const correct = [2, 0, 1, 3, 4, 5];
const fmt = (n: number) => n.toFixed(2);
export default function DefiniteIntegralPropertiesTargetLesson10183({
  lesson: _lesson,
}: {
  lesson: SchoolSyllabusLesson;
}) {
  const [c, setC] = useState(2),
    [answers, setAnswers] = useState(Array(6).fill("")),
    [feedback, setFeedback] = useState("");
  const left = (c * c) / 2,
    right = 8 - left,
    total = left + right;
  const change = (v: number) =>
    setC(Math.max(0, Math.min(4, Math.round(v * 20) / 20)));
  const key = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowLeft" || e.key === "ArrowDown") change(c - 0.05);
    if (e.key === "ArrowRight" || e.key === "ArrowUp") change(c + 0.05);
  };
  const drag = (e: ReactPointerEvent<SVGCircleElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    const svg = e.currentTarget.ownerSVGElement!;
    const move = (p: PointerEvent) => {
      const r = svg.getBoundingClientRect();
      change(((p.clientX - r.left) / r.width) * 4);
    };
    const stop = () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", stop);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", stop);
  };
  const reset = () => {
    setC(2);
    setAnswers(Array(6).fill(""));
    setFeedback("");
  };
  const check = () =>
    setFeedback(
      answers.every((v, i) => Number(v) === correct[i])
        ? "All six properties matched correctly."
        : `${answers.filter((v, i) => Number(v) === correct[i]).length} of 6 correct. Recheck the property statements.`,
    );
  const cx = 80 + c * 140;
  return (
    <main
      className="di10183-page"
      data-testid="school-mockup-0857"
      data-object-model="dedicated-signed-area-additivity-engine"
      data-c={c}
      data-left={fmt(left)}
      data-right={fmt(right)}
      data-total={fmt(total)}
    >
      <header>
        <small>CLASS 12 · FORMAL CALCULUS</small>
        <h1>Definite Integral Properties</h1>
        <p>
          Definite integrals represent signed area. Explore interval changes,
          reversal, and symmetry.
        </p>
        <nav>
          {["Composer", "Properties", "Worked Example", "Practice"].map(
            (x, i) => (
              <label key={x}>
                <input type="radio" name="di-tab" defaultChecked={!i} />
                {x}
              </label>
            ),
          )}
        </nav>
      </header>
      <section className="di-composer">
        <h3>SIGNED-AREA INTERVAL COMPOSER</h3>
        <div className="di-controls">
          <span>
            <b>Function</b>
            <i>f(x)=x</i>
          </span>
          <span>
            <b>Interval</b>
            <i>[0,4]</i>
          </span>
          <label>
            <b>Split point c</b>
            <output>{c.toFixed(2)}</output>
            <input
              aria-label="Split point c"
              type="range"
              min="0"
              max="4"
              step=".05"
              value={c}
              onChange={(e) => change(Number(e.target.value))}
              onKeyDown={key}
            />
          </label>
        </div>
        <svg viewBox="0 0 640 300" aria-label="Signed area interval graph">
          <path d="M50 250H620M80 20V270" stroke="#556579" />
          <polygon
            points={`80,250 ${cx},${250 - c * 48} ${cx},250`}
            fill="#8eb6ef"
          />
          <polygon
            points={`${cx},250 ${cx},${250 - c * 48} 640,58 640,250`}
            fill="#9bd49c"
          />
          <path d="M80 250L640 58" stroke="#1968d8" strokeWidth="2" />
          <path d={`M${cx} 35V250`} stroke="#65758a" strokeDasharray="5 4" />
          <circle
            tabIndex={0}
            aria-label="Draggable split point"
            cx={cx}
            cy={250 - c * 48}
            r="7"
            fill="#175eb9"
            onPointerDown={drag}
          />
          <text x={cx + 8} y="55">
            c={c}
          </text>
          <text x="585" y="76">
            y=x
          </text>
        </svg>
        <div className="di-values">
          <article>
            <b>Left interval [0,c]</b>
            <h2>∫₀ᶜ x dx = {fmt(left)}</h2>
          </article>
          <article>
            <b>Right interval [c,4]</b>
            <h2>∫ᶜ⁴ x dx = {fmt(right)}</h2>
          </article>
          <article>
            <b>Total interval [0,4]</b>
            <h2>∫₀⁴ x dx = {fmt(total)}</h2>
          </article>
        </div>
        <h2 className="di-equation">
          ∫₀⁴x dx = ∫₀ᶜx dx + ∫ᶜ⁴x dx = {fmt(left)} + {fmt(right)} ={" "}
          {fmt(total)}
        </h2>
      </section>
      <aside className="di-warning">
        <b>Definite integrals measure signed area, not total geometric area.</b>
        <p>
          Areas below the x-axis count as negative. For total area, use
          ∫|f(x)|dx.
        </p>
      </aside>
      <section className="di-properties">
        <h3>DEFINITE INTEGRAL PROPERTIES</h3>
        <div>
          {names.map((n, i) => (
            <article key={n}>
              <b>
                {i + 1} {n}
              </b>
              <h2>
                {
                  [
                    "∫ₐᵃf(x)dx=0",
                    "∫ₐᵇf=∫ₐᶜf+∫ᶜᵇf",
                    "∫ₐᵇf=−∫ᵦᵃf",
                    "∫ₐᵇkf=k∫ₐᵇf",
                    "∫₋ₐᵃf=2∫₀ᵃf",
                    "∫₋ₐᵃf=0",
                  ][i]
                }
              </h2>
              <p>
                {
                  [
                    "An interval with no width has no area.",
                    "Split an interval without changing the total.",
                    "Reverse bounds and reverse the sign.",
                    "Constants factor outside an integral.",
                    "Even functions mirror equal areas.",
                    "Odd functions cancel symmetric signed areas.",
                  ][i]
                }
              </p>
            </article>
          ))}
        </div>
        <article className="di-worked">
          <h3>
            <CheckCircle2 /> WORKED EXAMPLE
          </h3>
          <p>Using additivity with c=2:</p>
          <h2>∫₁⁴x dx = ∫₁²x dx + ∫₂⁴x dx = 3/2 + 6 = 15/2 = 7.5</h2>
        </article>
      </section>
      <section className="di-practice">
        <h3>PRACTICE: MATCH THE PROPERTY</h3>
        {[
          "∫ᵦᵃf=−∫ₐᵦf",
          "∫ₐᵃf=0",
          "∫ₐᵇf=∫ₐᶜf+∫ᶜᵇf",
          "∫ₐᵇkf=k∫ₐᵇf",
          "f even: ∫₋ₐᵃf=2∫₀ᵃf",
          "f odd: ∫₋ₐᵃf=0",
        ].map((q, i) => (
          <label key={q}>
            <span>
              {i + 1}. {q}
            </span>
            <select
              aria-label={`Property match ${i + 1}`}
              value={answers[i]}
              onChange={(e) =>
                setAnswers((v) =>
                  v.map((x, j) => (j === i ? e.target.value : x)),
                )
              }
            >
              <option value="">Choose</option>
              {names.map((n, j) => (
                <option value={j} key={n}>
                  {n}
                </option>
              ))}
            </select>
          </label>
        ))}
        <div>
          <button onClick={check}>Check answers</button>
          <button onClick={reset}>
            <RotateCcw /> Reset
          </button>
        </div>
        {feedback && <output>{feedback}</output>}
      </section>
      <nav className="di-adjacent">
        <Link to="/lessons/school/class-12/class-12-formal-calculus-integration-by-partial-fractions">
          ← Previous lesson
        </Link>
        <Link to="/lessons/school/class-12/class-12-formal-calculus-area-under-curves">
          Next lesson →
        </Link>
      </nav>
      <footer>
        <b>⌁ Math Universe</b>
        <p>
          Interactive math labs, visual proofs, NCERT explorations, graphing,
          CAS-style tools, and classroom-ready activities.
        </p>
        <div>
          <Link to="/sitemap">Sitemap</Link>
          <Link to="/documentation">Docs</Link>
          <Link to="/about">About</Link>
        </div>
      </footer>
    </main>
  );
}
