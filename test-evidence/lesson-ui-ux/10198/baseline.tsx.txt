import { CheckCircle2, Lightbulb } from "lucide-react";
import { Fragment, useState } from "react";
import type { SchoolSyllabusLesson } from "../syllabus/lessonSyllabusTypes";
import "./CramersRuleTargetLesson10198.css";

type Sys = [number, number, number, number, number, number];
const DEFAULT: Sys = [2, 1, 5, 1, -1, 1],
  tasks: Sys[] = [
    [3, 2, 11, 1, -1, 1],
    [1, 4, 13, 2, -1, 1],
    [4, -1, 7, 1, 1, 5],
    [2, 3, 12, 1, -2, 1],
  ];
const calc = (s: Sys) => {
  const [a, b, c, d, e, f] = s,
    D = a * e - b * d,
    Dx = c * e - b * f,
    Dy = a * f - c * d;
  return {
    D,
    Dx,
    Dy,
    x: D ? Dx / D : null,
    y: D ? Dy / D : null,
    type: D !== 0 ? "unique" : Dx === 0 && Dy === 0 ? "infinite" : "none",
  };
};
const fmt = (n: number | null) =>
  n === null ? "—" : Number.isInteger(n) ? String(n) : n.toFixed(2);
function Matrix({ m }: { m: number[][] }) {
  return (
    <div className="cr-matrix">
      {m.flat().map((v, i) => (
        <span key={i}>{v}</span>
      ))}
    </div>
  );
}
function MiniGraph({ s }: { s: Sys }) {
  const [a, b, c, d, e, f] = s,
    r = calc(s),
    o = { x: 150, y: 145 },
    sc = 28,
    line = (aa: number, bb: number, cc: number) =>
      bb
        ? [-5, (cc + 5 * aa) / bb, 5, (cc - 5 * aa) / bb]
        : [cc / aa, -5, cc / aa, 5],
    map = (x: number, y: number) => [o.x + x * sc, o.y - y * sc],
    l = line(a, b, c),
    q = line(d, e, f),
    p1 = map(l[0], l[1]),
    p2 = map(l[2], l[3]),
    q1 = map(q[0], q[1]),
    q2 = map(q[2], q[3]);
  return (
    <svg viewBox="0 0 300 290">
      {[-4, -3, -2, -1, 0, 1, 2, 3, 4].map((v) => (
        <g key={v}>
          <line x1={o.x + v * sc} y1="10" x2={o.x + v * sc} y2="280" />
          <line x1="10" y1={o.y - v * sc} x2="290" y2={o.y - v * sc} />
        </g>
      ))}
      <line className="axis" x1="10" y1={o.y} x2="290" y2={o.y} />
      <line className="axis" x1={o.x} y1="10" x2={o.x} y2="280" />
      <line className="l1" x1={p1[0]} y1={p1[1]} x2={p2[0]} y2={p2[1]} />
      <line className="l2" x1={q1[0]} y1={q1[1]} x2={q2[0]} y2={q2[1]} />
      {r.type === "unique" && (
        <>
          <circle cx={o.x + r.x! * sc} cy={o.y - r.y! * sc} r="5" />
          <text x={o.x + r.x! * sc + 8} y={o.y - r.y! * sc + 4}>
            ({fmt(r.x)}, {fmt(r.y)})
          </text>
        </>
      )}
    </svg>
  );
}
export default function CramersRuleTargetLesson10198({
  lesson: _lesson,
}: {
  lesson: SchoolSyllabusLesson;
}) {
  const [sys, setSys] = useState<Sys>(DEFAULT),
    [seed, setSeed] = useState(0),
    [hints, setHints] = useState(false),
    [answers, setAnswers] = useState(() => tasks.map(() => ["", ""])),
    [graded, setGraded] = useState<boolean[]>(tasks.map(() => false)),
    [learn, setLearn] = useState(false);
  const r = calc(sys),
    [a, b, c, d, e, f] = sys,
    set = (i: number, v: number) =>
      setSys((old) => old.map((x, j) => (j === i ? v : x)) as Sys),
    reset = () => {
      setSys(DEFAULT);
      setSeed(0);
    },
    random = () => {
      const n = seed + 1;
      setSeed(n);
      setSys([2 + (n % 3), 1, 4 + n, 1, -1 - (n % 2), 1 + (n % 2)]);
    },
    swap = () => setSys([d, e, f, a, b, c]),
    grade = (i: number) => {
      const q = calc(tasks[i]);
      setGraded((v) =>
        v.map((x, j) =>
          j === i
            ? Math.abs(Number(answers[i][0]) - (q.x ?? Infinity)) < 1e-6 &&
              Math.abs(Number(answers[i][1]) - (q.y ?? Infinity)) < 1e-6
            : x,
        ),
      );
    },
    gradeAll = () => tasks.forEach((_, i) => grade(i));
  return (
    <main
      className="cr10198-page"
      data-testid="school-mockup-0872"
      data-object-model="dedicated-cramer-column-replacement-engine"
      data-delta={r.D}
      data-delta-x={r.Dx}
      data-delta-y={r.Dy}
      data-case={r.type}
      data-x={r.x ?? "undefined"}
      data-y={r.y ?? "undefined"}
      data-hints={hints}
    >
      <header className="cr-hero">
        <div>
          <h1>
            Cramer&apos;s Rule <span>DETERMINANT COLUMN-REPLACEMENT LAB</span>
          </h1>
          <p>Solve a 2×2 linear system using determinants.</p>
        </div>
        <div className="cr-hero-summary">
          <b>
            ◷ System Size<strong>2 × 2</strong>
          </b>
          <b>
            ◇ Rule<strong>Cramer&apos;s Rule</strong>
          </b>
          <b className={r.type}>
            ◉{" "}
            {r.type === "unique"
              ? "Unique solution"
              : r.type === "none"
                ? "No solution"
                : "Infinite solutions"}
            <strong>Δ {r.D !== 0 ? "≠" : "="} 0</strong>
          </b>
        </div>
      </header>
      <section className="cr-system">
        <article>
          <h2>
            <i>1</i> Enter / Edit the System
          </h2>
          <div className="cr-equation-inputs">
            {[0, 3].map((start) => (
              <div className="cr-equation-row" key={start}>
                {[0, 1, 2].map((offset) => {
                  const i = start + offset;
                  return (
                    <Fragment key={i}>
                      <input
                        aria-label={`system value ${i + 1}`}
                        type="number"
                        value={sys[i]}
                        onChange={(event) => set(i, Number(event.target.value))}
                      />
                      {offset < 2 && (
                        <span>
                          {offset === 0 ? (sys[i + 1] < 0 ? "−" : "+") : "="}
                        </span>
                      )}
                    </Fragment>
                  );
                })}
              </div>
            ))}
          </div>
          <footer>
            <button onClick={random}>Random system</button>
            <button onClick={reset}>Reset</button>
            <button onClick={swap}>Swap equations</button>
          </footer>
        </article>
        <article>
          <p>System in Standard Form</p>
          <strong>
            {a}x {b < 0 ? "−" : "+"} {Math.abs(b)}y = {c}
          </strong>
          <strong>
            {d}x {e < 0 ? "−" : "+"} {Math.abs(e)}y = {f}
          </strong>
          <p>Matrix form: AX=b</p>
          <div className="cr-formula">
            A=[{a} {b}; {d} {e}], X=[x;y], b=[{c};{f}]
          </div>
        </article>
        <article>
          <h2>Determinant Area Insight</h2>
          <p>
            For a 2×2 matrix det=ad−bc. Geometric meaning: signed area of the
            parallelogram formed by column vectors.
          </p>
          <div className="cr-parallelogram">u ▱ v</div>
          <b>Area = |det(A)| = {Math.abs(r.D)}</b>
        </article>
      </section>
      <section className="cr-build">
        <h2>
          <i>2</i> Build Determinants by Column Replacement
        </h2>
        <p>Watch each determinant form step-by-step.</p>
        <div>
          {[
            {
              title: "Step 1: Coefficient Determinant Δ",
              m: [
                [a, b],
                [d, e],
              ],
              value: r.D,
              formula: `(${a})(${e}) − (${b})(${d})`,
            },
            {
              title: "Step 2: Replace x-column → Δx",
              m: [
                [c, b],
                [f, e],
              ],
              value: r.Dx,
              formula: `(${c})(${e}) − (${b})(${f})`,
            },
            {
              title: "Step 3: Replace y-column → Δy",
              m: [
                [a, c],
                [d, f],
              ],
              value: r.Dy,
              formula: `(${a})(${f}) − (${c})(${d})`,
            },
          ].map((x, i) => (
            <article key={x.title}>
              <h3>{x.title}</h3>
              <p>
                {i === 0
                  ? "Use columns of A."
                  : i === 1
                    ? "Replace first column with constants b."
                    : "Replace second column with constants b."}
              </p>
              <div className="cr-source-matrix">
                <Matrix m={x.m} />
              </div>
              <div className="cr-det">
                <span>{i === 0 ? "Δ" : i === 1 ? "Δx" : "Δy"} = det =</span>
                <div className="cr-cross-matrix">
                  <Matrix m={x.m} />
                </div>
              </div>
              <div className="cr-work">
                <p>= {x.formula}</p>
                <p>
                  = {x.m[0][0] * x.m[1][1]} − {x.m[0][1] * x.m[1][0]}
                </p>
                <p>= {x.value}</p>
              </div>
              <strong>
                {i === 0 ? "Δ" : i === 1 ? "Δx" : "Δy"} = {x.value}
              </strong>
              <footer>
                ▱ Area = {Math.abs(x.value)} square units
                <br />
                Orientation:{" "}
                {x.value < 0
                  ? "negative"
                  : x.value > 0
                    ? "positive"
                    : "collapsed"}
              </footer>
            </article>
          ))}
        </div>
      </section>
      <section className="cr-solve">
        <h2>
          <i>3</i> Solve Using Cramer&apos;s Rule
        </h2>
        {r.type === "unique" ? (
          <>
            <div>
              x = Δx/Δ = {r.Dx}/{r.D} = <b>{fmt(r.x)}</b> y = Δy/Δ = {r.Dy}/
              {r.D} = <b>{fmt(r.y)}</b>
            </div>
            <strong>
              Solution x={fmt(r.x)}
              <br />
              y={fmt(r.y)}
            </strong>
          </>
        ) : (
          <>
            <p>Δ=0, so Cramer&apos;s Rule cannot produce a unique solution.</p>
            <strong>
              {r.type === "none" ? "No solution" : "Infinitely many solutions"}
            </strong>
          </>
        )}
      </section>
      <section className="cr-verify">
        <article>
          <h2>
            <i>4</i> Verify Graphically
          </h2>
          <p>
            {r.type === "unique"
              ? `The two lines intersect at (${fmt(r.x)}, ${fmt(r.y)}).`
              : r.type === "none"
                ? "The two lines are parallel."
                : "The two equations draw the same line."}
          </p>
          <MiniGraph s={sys} />
          <footer>■ First equation ■ Second equation ● {r.type}</footer>
        </article>
        <div>
          <article>
            <h2>
              <i>5</i> Verify by Substitution
            </h2>
            {r.type === "unique" ? (
              <>
                <p>
                  {a}({fmt(r.x)}) + {b}({fmt(r.y)}) = {c} ✓
                </p>
                <p>
                  {d}({fmt(r.x)}) + {e}({fmt(r.y)}) = {f} ✓
                </p>
                <strong>
                  Both equations are satisfied. The solution is correct.
                </strong>
              </>
            ) : (
              <p>No single ordered pair can be verified for this case.</p>
            )}
          </article>
          <article className="cr-zero">
            <h2>
              <i>!</i> What if Δ = 0?
            </h2>
            <p>If Δ=0, the system does not have a unique solution.</p>
            <p>• Δx=Δy=0 → infinitely many solutions.</p>
            <p>• At least one nonzero → no solution.</p>
            <button onClick={() => setLearn((v) => !v)}>
              {learn ? "Hide" : "Learn more"}
            </button>
            {learn && (
              <p>
                Cramer&apos;s Rule applies uniquely only when the coefficient
                matrix is invertible.
              </p>
            )}
          </article>
        </div>
      </section>
      <section className="cr-practice">
        <header>
          <div>
            <h2>
              <i>6</i> Practice Problems
            </h2>
            <p>Solve each system using Cramer&apos;s Rule.</p>
          </div>
          <aside>
            <button onClick={() => setHints((v) => !v)}>
              <Lightbulb />
              {hints ? "Hide" : "Show"} hints
            </button>
            <button onClick={gradeAll}>Check all</button>
          </aside>
        </header>
        <div>
          {tasks.map((s, i) => {
            const q = calc(s);
            return (
              <article key={i}>
                <i>{i + 1}</i>
                <strong>
                  {s[0]}x {s[1] < 0 ? "−" : "+"} {Math.abs(s[1])}y = {s[2]}
                  <br />
                  {s[3]}x {s[4] < 0 ? "−" : "+"} {Math.abs(s[4])}y = {s[5]}
                </strong>
                {hints && <p>Hint: Δ={q.D}</p>}
                <label>
                  x=
                  <input
                    aria-label={`practice ${i + 1} x`}
                    value={answers[i][0]}
                    onChange={(e) => {
                      setAnswers((v) =>
                        v.map((x, j) => (j === i ? [e.target.value, x[1]] : x)),
                      );
                      setGraded((v) => v.map((x, j) => (j === i ? false : x)));
                    }}
                  />
                </label>
                <label>
                  y=
                  <input
                    aria-label={`practice ${i + 1} y`}
                    value={answers[i][1]}
                    onChange={(e) => {
                      setAnswers((v) =>
                        v.map((x, j) => (j === i ? [x[0], e.target.value] : x)),
                      );
                      setGraded((v) => v.map((x, j) => (j === i ? false : x)));
                    }}
                  />
                </label>
                <button onClick={() => grade(i)}>Check</button>
                {graded[i] && (
                  <span>
                    <CheckCircle2 />
                    Correct
                  </span>
                )}
              </article>
            );
          })}
        </div>
      </section>
      <nav className="cr-next">
        <a href="/lessons/school/class-12/class-12-matrices-and-determinants-determinant-properties">
          ← Previous: Determinants Basics
        </a>
        <a href="/lessons/school/class-12/class-12-matrices-and-determinants-cramers-rule-3x3">
          Next: 3×3 Systems with Cramer&apos;s Rule →
        </a>
      </nav>
    </main>
  );
}
