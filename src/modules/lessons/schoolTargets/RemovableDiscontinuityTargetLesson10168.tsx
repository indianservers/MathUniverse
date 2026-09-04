import { Check, Eye, EyeOff, Maximize2, RotateCcw } from "lucide-react";
import { useMemo, useState } from "react";
import type { KeyboardEvent, PointerEvent as ReactPointerEvent } from "react";
import type { SchoolSyllabusLesson } from "../syllabus/lessonSyllabusTypes";
import "./RemovableDiscontinuityTargetLesson10168.css";

const LIMIT = 4,
  f = (x: number) => x + 2,
  fmt = (n: number) => n.toFixed(2).replace(/\.00$/, "");
export default function RemovableDiscontinuityTargetLesson10168({
  lesson: _lesson,
}: {
  lesson: SchoolSyllabusLesson;
}) {
  const [defined, setDefined] = useState<number | null>(4),
    [left, setLeft] = useState(1.99),
    [right, setRight] = useState(2.01);
  const [view, setView] = useState<"graph" | "table">("graph"),
    [line, setLine] = useState(true),
    [hole, setHole] = useState(true),
    [point, setPoint] = useState(true);
  const [practice, setPractice] = useState([false, false]),
    [answer, setAnswer] = useState(""),
    [checked, setChecked] = useState(false);
  const repaired = defined === LIMIT,
    exists = defined !== null;
  const rows = useMemo(() => [1.8, 1.9, 1.99, 2, 2.01, 2.1, 2.2], []);
  const setValue = (n: number) =>
    setDefined(Math.max(-2, Math.min(8, Number(n.toFixed(1)))));
  const keyPoint = (e: KeyboardEvent<SVGCircleElement>) => {
    if (e.key === "ArrowUp" || e.key === "ArrowRight")
      setValue((defined ?? 4) + 0.5);
    if (e.key === "ArrowDown" || e.key === "ArrowLeft")
      setValue((defined ?? 4) - 0.5);
  };
  const dragPoint = (e: ReactPointerEvent<SVGCircleElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    const svg = e.currentTarget.ownerSVGElement!;
    const move = (ev: PointerEvent) =>
      setValue(
        8 -
          ((ev.clientY - svg.getBoundingClientRect().top) /
            svg.getBoundingClientRect().height) *
            10,
      );
    const stop = () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", stop);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", stop);
  };
  const reset = () => {
    setDefined(4);
    setLeft(1.99);
    setRight(2.01);
    setView("graph");
    setLine(true);
    setHole(true);
    setPoint(true);
    setPractice([false, false]);
    setAnswer("");
    setChecked(false);
  };
  return (
    <main
      className="rd10168-page"
      data-testid="school-mockup-0842"
      data-object-model="dedicated-removable-discontinuity-repair-engine"
      data-defined={defined === null ? "undefined" : fmt(defined)}
      data-limit="4"
      data-repaired={String(repaired)}
    >
      <header>
        <small>CLASS 12 · FORMAL CALCULUS</small>
        <h1>Removable Discontinuity</h1>
        <p>
          Learn why <b>f(x) = (x²−4)/(x−2)</b> has a hole at x=2, and how
          defining f(2)=4 removes the discontinuity and makes the function
          continuous.
        </p>
        <div>
          <span>18 min</span>
          <span>ADVANCED</span>
          <span>CONCEPT</span>
          <span>graph</span>
        </div>
      </header>
      <section className="rd-top">
        <article className="rd-visual">
          <div className="rd-vtitle">
            <h3>⟳ &nbsp; INTERACTIVE GRAPH</h3>
            <div>
              <button
                className={view === "graph" ? "active" : ""}
                onClick={() => setView("graph")}
              >
                Cartesian
              </button>
              <button
                className={view === "table" ? "active" : ""}
                onClick={() => setView("table")}
              >
                Table
              </button>
              <button aria-label="Reset repair" onClick={reset}>
                <RotateCcw />
              </button>
              <button aria-label="Fit graph" onClick={() => setView("graph")}>
                <Maximize2 />
              </button>
            </div>
          </div>
          {view === "graph" ? (
            <>
              <svg
                viewBox="0 0 500 390"
                aria-label="Removable discontinuity graph"
              >
                <defs>
                  <pattern
                    id="rdgrid"
                    width="32"
                    height="32"
                    patternUnits="userSpaceOnUse"
                  >
                    <path d="M32 0H0V32" fill="none" stroke="#dfe8ed" />
                  </pattern>
                </defs>
                <rect width="500" height="390" fill="url(#rdgrid)" />
                <path d="M10 255H490M230 10V380" stroke="#263548" />
                {line && (
                  <path d="M15 288L475 127" stroke="#06a2d0" strokeWidth="3" />
                )}
                {hole && (
                  <circle
                    cx="350"
                    cy="171"
                    r="7"
                    fill="white"
                    stroke="#079ecb"
                    strokeWidth="3"
                  />
                )}
                {point && exists && (
                  <circle
                    role="slider"
                    aria-label="Defined value point"
                    tabIndex={0}
                    onPointerDown={dragPoint}
                    onKeyDown={keyPoint}
                    cx="350"
                    cy={255 - defined * 21}
                    r="7"
                    fill={repaired ? "#0784c2" : "#e33d46"}
                  />
                )}
                <text x="420" y="68" fill="#0498c6">
                  y = x + 2
                </text>
                <text x="370" y="187">
                  (2, {defined === null ? "?" : fmt(defined)})
                </text>
              </svg>
              <div className="rd-legend">
                <b>━ y=x+2 (repaired function)</b>
                <b>○ Hole at (2,4)</b>
              </div>
              <div className="rd-layer-tools">
                <button
                  aria-label="Toggle line"
                  onClick={() => setLine((v) => !v)}
                >
                  {line ? <Eye /> : <EyeOff />}
                </button>
                <button
                  aria-label="Toggle hole"
                  onClick={() => setHole((v) => !v)}
                >
                  {hole ? <Eye /> : <EyeOff />}
                </button>
                <button
                  aria-label="Toggle point"
                  onClick={() => setPoint((v) => !v)}
                >
                  {point ? <Eye /> : <EyeOff />}
                </button>
              </div>
            </>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>x</th>
                  <th>original</th>
                  <th>x+2</th>
                  <th>repaired</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((x) => (
                  <tr key={x}>
                    <td>{x}</td>
                    <td>{x === 2 ? "undefined" : fmt(f(x))}</td>
                    <td>{fmt(f(x))}</td>
                    <td>
                      {x === 2
                        ? defined === null
                          ? "undefined"
                          : fmt(defined)
                        : fmt(f(x))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </article>
        <aside>
          <section>
            <h3>DEFINE THE VALUE AT x = 2</h3>
            <label>
              Set f(2) ={" "}
              <button onClick={() => setValue((defined ?? 0) - 1)}>−</button>
              <input
                aria-label="Defined value f(2)"
                type="number"
                value={defined ?? ""}
                onInput={(e) =>
                  e.currentTarget.value === ""
                    ? setDefined(null)
                    : setValue(Number(e.currentTarget.value))
                }
              />
              <button onClick={() => setValue((defined ?? 0) + 1)}>+</button>
            </label>
            <p>This defines the function at the hole.</p>
            <div className={repaired ? "ok" : "no"}>
              <strong>
                {repaired
                  ? "✓ Continuity restored!"
                  : exists
                    ? "✕ Value does not match the limit"
                    : "✕ Point is undefined"}
              </strong>
              <p>
                {repaired
                  ? "All three conditions are satisfied at x=2."
                  : "Choose f(2)=4 to repair the discontinuity."}
              </p>
            </div>
          </section>
          <section>
            <h3>APPROACH x = 2</h3>
            <div className="rd-approach">
              <label>
                From the left (x→2⁻)
                <input
                  aria-label="Left approach"
                  type="range"
                  min="1.5"
                  max="1.999"
                  step=".001"
                  value={left}
                  onInput={(e) => setLeft(Number(e.currentTarget.value))}
                />
                <output>{left.toFixed(3)}</output>
                <b>f(x) ≈ {f(left).toFixed(3)}</b>
              </label>
              <label>
                From the right (x→2⁺)
                <input
                  aria-label="Right approach"
                  type="range"
                  min="2.001"
                  max="2.5"
                  step=".001"
                  value={right}
                  onInput={(e) => setRight(Number(e.currentTarget.value))}
                />
                <output>{right.toFixed(3)}</output>
                <b>f(x) ≈ {f(right).toFixed(3)}</b>
              </label>
            </div>
            <div className="rd-limit">
              Limit as x→2: <b>4</b>
              <br />
              Defined value:{" "}
              <b>{defined === null ? "undefined" : `f(2)=${fmt(defined)}`}</b>
            </div>
          </section>
        </aside>
      </section>
      <section className="rd-middle">
        <article>
          <h3>VALUE TABLE (Near x=2)</h3>
          <table>
            <thead>
              <tr>
                <th>x</th>
                <th>original quotient</th>
                <th>y=x+2</th>
                <th>f(x) repaired</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((x) => (
                <tr className={x === 2 ? "focus" : ""} key={x}>
                  <td>{x}</td>
                  <td>{x === 2 ? "undefined" : fmt(f(x))}</td>
                  <td>{fmt(f(x))}</td>
                  <td>
                    {x === 2
                      ? defined === null
                        ? "undefined"
                        : fmt(defined)
                      : fmt(f(x))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </article>
        <article>
          <h3>ALGEBRA: FACTOR &amp; CANCEL</h3>
          <p>f(x) = (x²−4)/(x−2)</p>
          <p>= ((x−2)(x+2))/(x−2)</p>
          <p>= x+2 &nbsp; (x≠2)</p>
          <div>So, lim x→2 f(x) = 2+2 = 4</div>
          <strong>Define f(2)=4 to make the function continuous.</strong>
        </article>
      </section>
      <section className="rd-conditions">
        <article>
          <h3>THE THREE CONDITIONS FOR CONTINUITY AT x=2</h3>
          <p>A function is continuous at a if:</p>
          {[
            [true, "lim f(x) exists.", "lim = 4"],
            [
              exists,
              "f(a) is defined.",
              defined === null ? "undefined" : `f(2)=${fmt(defined)}`,
            ],
            [
              repaired,
              "lim f(x)=f(a).",
              defined === null
                ? "4 ≠ undefined"
                : `4 ${repaired ? "=" : "≠"} ${fmt(defined)}`,
            ],
          ].map((r, i) => (
            <div className={r[0] ? "ok" : "no"} key={i}>
              <strong>{r[0] ? "✓" : "✕"}</strong>
              <span>{r[1]}</span>
              <b>{r[2]}</b>
            </div>
          ))}
          <b>
            {repaired
              ? "All three conditions are satisfied. The function is continuous at x=2."
              : "The function is not continuous at x=2."}
          </b>
        </article>
        <article>
          <h3>BEFORE VS AFTER</h3>
          <div>
            <section>
              <b>Before (original function)</b>
              <svg viewBox="0 0 210 120">
                <path d="M10 100H200M50 10V112" stroke="#334155" />
                <path d="M15 94L185 40" stroke="#087fd1" strokeWidth="2" />
                <circle cx="105" cy="65" r="5" fill="white" stroke="#087fd1" />
              </svg>
              <p className="no">Not continuous at x=2</p>
            </section>
            <b>→</b>
            <section>
              <b>After (f(2)={defined === null ? "?" : fmt(defined)})</b>
              <svg viewBox="0 0 210 120">
                <path d="M10 100H200M50 10V112" stroke="#334155" />
                <path d="M15 94L185 40" stroke="#087fd1" strokeWidth="2" />
                {exists && (
                  <circle
                    cx="105"
                    cy={100 - defined * 9}
                    r="5"
                    fill={repaired ? "#087fd1" : "#e33d46"}
                  />
                )}
              </svg>
              <p className={repaired ? "ok" : "no"}>
                {repaired ? "Continuous" : "Not continuous"} at x=2
              </p>
            </section>
          </div>
        </article>
      </section>
      <section className="rd-explain">
        <article>
          <h3>COMMON MISCONCEPTION</h3>
          <b>“Since the limit exists, the function is already continuous.”</b>
          <p>
            Not always. The function must also be defined at that point and the
            limit must equal the function value.
          </p>
        </article>
        <article>
          <h3>WORKED EXAMPLE</h3>
          <p>1. lim x→2 f(x)=lim(x+2)=4.</p>
          <p>2. f(2)={defined === null ? "undefined" : fmt(defined)}.</p>
          <p>3. lim f(x) {repaired ? "=" : "≠"} f(2).</p>
          <b>
            {repaired
              ? "Therefore f is continuous at x=2."
              : "Repair by defining f(2)=4."}
          </b>
        </article>
      </section>
      <section className="rd-practice">
        <article>
          <h3>PRACTICE</h3>
          {["(x²−1)/(x−1) at x=1", "(x²+2x−3)/(x+3) at x=−3"].map((q, i) => (
            <div key={q}>
              <b>
                {i + 1} &nbsp; {q}
              </b>
              <button
                onClick={() => {
                  const p = [...practice];
                  p[i] = !p[i];
                  setPractice(p);
                }}
              >
                {practice[i] ? "Hide answer" : "Show answer"}
              </button>
              {practice[i] && <p>k = {i === 0 ? 2 : -4}</p>}
            </div>
          ))}
        </article>
        <article>
          <h3>TRY IT YOURSELF</h3>
          <p>
            Fill in the value that makes g(x)=(x²−9)/(x−3) continuous at x=3.
          </p>
          <label>
            g(3) ={" "}
            <input
              aria-label="Repair challenge answer"
              value={answer}
              onChange={(e) => {
                setAnswer(e.target.value);
                setChecked(false);
              }}
            />
          </label>
          <button onClick={() => setChecked(true)}>
            <Check /> Check
          </button>
          <button
            onClick={() => {
              setAnswer("");
              setChecked(false);
            }}
          >
            Reset
          </button>
          {checked && (
            <strong className={Number(answer) === 6 ? "ok" : "no"}>
              {Number(answer) === 6
                ? "✓ Correct: g(3)=6"
                : "✕ Factor first; the limit is 6."}
            </strong>
          )}
        </article>
      </section>
      <nav className="rd-adjacent">
        <button>← Continuity on an Interval</button>
        <button>Jump Discontinuity →</button>
      </nav>
      <footer>
        <b>⌁ Math Universe</b>
        <p>
          Interactive math labs, visual proofs, NCERT explorations, graphing,
          CAS-style tools, and classroom-ready activities.
        </p>
        <small>
          © 2026 INDIAN SERVERS PRIVATE LIMITED. NO RIGHT TO REPRODUCE IT.
        </small>
      </footer>
    </main>
  );
}
