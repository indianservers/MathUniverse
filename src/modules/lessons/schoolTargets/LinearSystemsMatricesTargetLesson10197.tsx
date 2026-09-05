import { CheckCircle2, Home, Maximize2, RotateCcw, ZoomIn } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import type { SchoolSyllabusLesson } from "../syllabus/lessonSyllabusTypes";
import "./LinearSystemsMatricesTargetLesson10197.css";

type System = [number, number, number, number, number, number];
const DEFAULT: System = [2, 1, 5, 1, -1, 1],
  PRESETS: Record<string, System> = {
    unique: DEFAULT,
    none: [2, 1, 5, 4, 2, 12],
    infinite: [2, 1, 5, 4, 2, 10],
    random: [3, -2, 7, 1, 4, 5],
  };
const solve = (s: System) => {
  const [a, b, c, d, e, f] = s,
    det = a * e - b * d,
    dx = c * e - b * f,
    dy = a * f - c * d,
    type = det !== 0 ? "unique" : dx === 0 && dy === 0 ? "infinite" : "none";
  return {
    det,
    dx,
    dy,
    type,
    x: det ? dx / det : null,
    y: det ? dy / det : null,
  };
};
const fmt = (n: number | null) =>
  n === null ? "—" : Number.isInteger(n) ? String(n) : n.toFixed(2);
const equation = (a: number, b: number, c: number) =>
  `${a}x ${b < 0 ? "−" : "+"} ${Math.abs(b)}y = ${c}`;
function Graph({ system, zoom }: { system: System; zoom: number }) {
  const [a, b, c, d, e, f] = system,
    res = solve(system),
    w = 390,
    h = 430,
    o = { x: 195, y: 215 },
    scale = 28 * zoom,
    line = (aa: number, bb: number, cc: number) => {
      if (bb !== 0)
        return {
          x1: -7,
          y1: (cc - aa * -7) / bb,
          x2: 7,
          y2: (cc - aa * 7) / bb,
        };
      const x = cc / aa;
      return { x1: x, y1: -7, x2: x, y2: 7 };
    },
    map = (x: number, y: number) => ({
      x: o.x + x * scale,
      y: o.y - y * scale,
    }),
    l1 = line(a, b, c),
    l2 = line(d, e, f),
    p1 = map(l1.x1, l1.y1),
    p2 = map(l1.x2, l1.y2),
    q1 = map(l2.x1, l2.y1),
    q2 = map(l2.x2, l2.y2);
  return (
    <svg className="ls-graph" viewBox={`0 0 ${w} ${h}`}>
      {[-6, -5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6].map((v) => (
        <g key={v}>
          <line x1={o.x + v * scale} y1="10" x2={o.x + v * scale} y2="420" />
          <line x1="10" y1={o.y - v * scale} x2="380" y2={o.y - v * scale} />
          <text x={o.x + v * scale + 2} y={o.y + 10}>
            {v}
          </text>
        </g>
      ))}
      <line className="axis" x1="10" y1={o.y} x2="380" y2={o.y} />
      <line className="axis" x1={o.x} y1="10" x2={o.x} y2="420" />
      <line className="line1" x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} />
      <line className="line2" x1={q1.x} y1={q1.y} x2={q2.x} y2={q2.y} />
      {res.type === "unique" && (
        <>
          <line
            className="guide"
            x1={o.x}
            y1={map(res.x!, res.y!).y}
            x2={map(res.x!, res.y!).x}
            y2={map(res.x!, res.y!).y}
          />
          <line
            className="guide"
            x1={map(res.x!, res.y!).x}
            y1={o.y}
            x2={map(res.x!, res.y!).x}
            y2={map(res.x!, res.y!).y}
          />
          <circle cx={map(res.x!, res.y!).x} cy={map(res.x!, res.y!).y} r="5" />
          <text
            className="solution"
            x={map(res.x!, res.y!).x + 8}
            y={map(res.x!, res.y!).y + 4}
          >
            ({fmt(res.x)}, {fmt(res.y)})
          </text>
        </>
      )}
    </svg>
  );
}
export default function LinearSystemsMatricesTargetLesson10197({
  lesson: _lesson,
}: {
  lesson: SchoolSyllabusLesson;
}) {
  const [system, setSystem] = useState<System>(DEFAULT),
    [caseName, setCaseName] = useState("unique"),
    [zoom, setZoom] = useState(1),
    [hints, setHints] = useState<boolean[]>([false, false, false]),
    [solutions, setSolutions] = useState<boolean[]>([false, false, false]),
    [checked, setChecked] = useState(false);
  const r = solve(system),
    [a, b, c, d, e, f] = system,
    adj: [[number, number], [number, number]] = [
      [e, -b],
      [-d, a],
    ],
    set = (i: number, v: number) =>
      setSystem((old) => old.map((x, j) => (j === i ? v : x)) as System),
    choose = (name: string) => {
      setCaseName(name);
      setSystem(PRESETS[name]);
      setChecked(false);
    };
  const practices: System[] = [
    [3, 1, 9, 1, -2, -1],
    [2, -1, 4, 4, -2, 8],
    [1, 1, 3, 2, 2, 6],
  ];
  return (
    <main
      className="ls10197-page"
      data-testid="school-mockup-0871"
      data-object-model="dedicated-linear-system-matrix-and-graph-engine"
      data-determinant={r.det}
      data-case={r.type}
      data-x={r.x ?? "undefined"}
      data-y={r.y ?? "undefined"}
      data-zoom={zoom}
    >
      <header className="ls-hero">
        <small>CLASS 12 · MATRICES AND DETERMINANTS</small>
        <h1>Solving Linear Equations by Matrices</h1>
        <div className="ls-copy">
          Solve the system using matrices. Change constants to see unique, no,
          or infinite solution cases. Algebra steps and graph stay in sync.
        </div>
        <span>16 min ADVANCED CONCEPT matrix systems</span>
        <Link to="/lessons/school">← School lessons</Link>
      </header>
      <section className="ls-controls">
        <article>
          <b>System (edit constants)</b>
          <label>
            <i className="blue" /> {a}x {b < 0 ? "−" : "+"} {Math.abs(b)}y ={" "}
            <input
              aria-label="first equation constant"
              type="number"
              value={c}
              onChange={(e) => set(2, Number(e.target.value))}
            />
          </label>
          <label>
            <i className="red" /> {d}x {e < 0 ? "−" : "+"} {Math.abs(e)}y ={" "}
            <input
              aria-label="second equation constant"
              type="number"
              value={f}
              onChange={(e) => set(5, Number(e.target.value))}
            />
          </label>
        </article>
        <article>
          <b>Solution status</b>
          <strong className={r.type}>
            ✓{" "}
            {r.type === "unique"
              ? "Unique solution"
              : r.type === "none"
                ? "No solution"
                : "Infinite solutions"}
          </strong>
          <p>
            det(A) = {r.det} {r.det !== 0 ? "≠ 0" : "= 0"}
          </p>
        </article>
        <article>
          <b>Case explorer</b>
          <p>Try other cases</p>
          <select
            aria-label="Case explorer"
            value={caseName}
            onChange={(e) => choose(e.target.value)}
          >
            <option value="unique">Unique solution (det(A) ≠ 0)</option>
            <option value="none">No solution (parallel)</option>
            <option value="infinite">Infinite solutions (same line)</option>
            <option value="random">Random values</option>
          </select>
        </article>
      </section>
      <div className="ls-main">
        <section className="ls-solver">
          <h2>Algebra Solver</h2>
          <p>Synchronized matrix solution</p>
          <Step n={1} title="Matrix form AX = B">
            <div className="ls-formula">
              A = [{a} {b}; {d} {e}] X=[x;y] B=[{c};{f}]
            </div>
            <aside>
              <span>🔵 Row 1 → {equation(a, b, c)}</span>
              <span>🔴 Row 2 → {equation(d, e, f)}</span>
            </aside>
          </Step>
          <Step n={2} title="Determinant of A">
            <div className="ls-formula">
              det(A) = ({a})({e}) − ({b})({d}) = {r.det}
            </div>
            <footer>
              det(A){" "}
              {r.det !== 0
                ? "≠ 0 → A is invertible. Unique solution exists."
                : "= 0 → classify using consistency."}
            </footer>
          </Step>
          <Step n={3} title="Inverse of A">
            <div className="ls-formula">
              A⁻¹ = 1/{r.det} [{adj[0].join(" ")}; {adj[1].join(" ")}]
            </div>
          </Step>
          <Step n={4} title="Solve X = A⁻¹B">
            <div className="ls-formula">
              X = [{fmt(r.x)}; {fmt(r.y)}]
            </div>
            {r.type === "unique" ? (
              <strong className="ls-answer">
                Solution x={fmt(r.x)}, y={fmt(r.y)}
              </strong>
            ) : (
              <strong className="ls-answer">
                {r.type === "none"
                  ? "No common solution"
                  : "Infinitely many solutions"}
              </strong>
            )}
          </Step>
          <Step n={5} title="Verification (substitution)">
            {r.type === "unique" ? (
              <aside>
                <span>
                  🔵 {a}({fmt(r.x)}) + {b}({fmt(r.y)}) = {c} ✓
                </span>
                <span>
                  🔴 {d}({fmt(r.x)}) + {e}({fmt(r.y)}) = {f} ✓
                </span>
              </aside>
            ) : (
              <p>
                Determinant zero case confirmed by proportional coefficients.
              </p>
            )}
            <footer>
              Both equations are{" "}
              {r.type === "unique" ? "satisfied" : "classified consistently"}.
            </footer>
          </Step>
          <article className="ls-order">
            <b>⚠ Important: order of multiplication</b>
            <p>
              Matrix multiplication is not commutative. A⁻¹B is correct. Always
              multiply in the order X=A⁻¹B.
            </p>
          </article>
        </section>
        <div className="ls-right">
          <section className="ls-graph-card">
            <header>
              <div>
                <h2>Graph (linked to algebra)</h2>
                <p>The lines correspond to matrix rows.</p>
              </div>
              <aside>
                <button aria-label="Fit graph" onClick={() => setZoom(1)}>
                  <Maximize2 />
                </button>
                <button aria-label="Reset graph" onClick={() => setZoom(1)}>
                  <Home />
                </button>
                <button
                  aria-label="Zoom graph"
                  onClick={() => setZoom((v) => (v === 1 ? 1.2 : 1))}
                >
                  <ZoomIn />
                </button>
              </aside>
            </header>
            <Graph system={system} zoom={zoom} />
            <div className="ls-legend">
              <p>━ Row 1 → {equation(a, b, c)}</p>
              <p>━ Row 2 → {equation(d, e, f)}</p>
              <p>
                ●{" "}
                {r.type === "unique"
                  ? `Intersection = (${fmt(r.x)}, ${fmt(r.y)})`
                  : r.type === "none"
                    ? "Parallel lines do not intersect"
                    : "The lines coincide"}
              </p>
            </div>
            <footer>
              <b>Graph checks</b>
              <p>
                {r.type === "unique"
                  ? `At (${fmt(r.x)},${fmt(r.y)}), both equations are true ✓`
                  : r.type === "none"
                    ? "Equal slopes, different intercepts → no solution."
                    : "Same line → infinitely many solutions."}
              </p>
            </footer>
          </section>
          <section className="ls-builder">
            <article>
              <h2>Dynamic system builder</h2>
              <p>Adjust coefficients to explore all cases.</p>
              {[
                [0, "first x coefficient"],
                [1, "first y coefficient"],
                [2, "first constant"],
                [3, "second x coefficient"],
                [4, "second y coefficient"],
                [5, "second constant"],
              ].map(([i, label]) => (
                <input
                  key={String(label)}
                  aria-label={String(label)}
                  type="number"
                  value={system[Number(i)]}
                  onChange={(e) => set(Number(i), Number(e.target.value))}
                />
              ))}
            </article>
            <aside>
              <b>Quick presets</b>
              {[
                ["unique", "Unique solution"],
                ["none", "No solution (parallel)"],
                ["infinite", "Infinite solutions (same line)"],
                ["random", "Random values"],
              ].map(([key, label]) => (
                <button
                  key={key}
                  className={caseName === key ? "active" : ""}
                  onClick={() => choose(key)}
                >
                  ◉ {label}
                </button>
              ))}
            </aside>
          </section>
        </div>
      </div>
      <section className="ls-practice">
        <header>
          <div>
            <h2>Practice</h2>
            <p>
              Solve using matrices. Show A, det(A), A⁻¹, X=A⁻¹B, and verify.
            </p>
          </div>
          <aside>
            <button onClick={() => setChecked(true)}>☑ Check my work</button>
            <button
              aria-label="Reset practice"
              onClick={() => {
                setHints([false, false, false]);
                setSolutions([false, false, false]);
                setChecked(false);
              }}
            >
              <RotateCcw />
            </button>
          </aside>
        </header>
        <div>
          {practices.map((p, i) => {
            const q = solve(p);
            return (
              <article key={i}>
                <i>{i + 1}</i>
                <div>
                  {equation(p[0], p[1], p[2])}
                  <br />
                  {equation(p[3], p[4], p[5])}
                </div>
                <button
                  onClick={() =>
                    setHints((v) => v.map((x, j) => (j === i ? !x : x)))
                  }
                >
                  {hints[i] ? "Hide hint" : "◉ Show hint"}
                </button>
                {hints[i] && <p>Compute det(A)={q.det} first.</p>}
                <button
                  onClick={() =>
                    setSolutions((v) => v.map((x, j) => (j === i ? !x : x)))
                  }
                >
                  {solutions[i] ? "Hide solution" : "Show solution"}
                </button>
                {solutions[i] && (
                  <strong>
                    {q.type === "unique"
                      ? `x=${fmt(q.x)}, y=${fmt(q.y)}`
                      : q.type}
                  </strong>
                )}
              </article>
            );
          })}
        </div>
        {checked && (
          <footer>
            <CheckCircle2 /> Work check active: compare each result with its
            independently generated solution.
          </footer>
        )}
      </section>
      <nav className="ls-next">
        <Link to="/lessons/school/class-12/class-12-matrices-and-determinants-cramers-rule">
          ← Cramer’s Rule
        </Link>
        <Link to="/lessons/school/class-12/class-12-matrices-and-determinants-inverses-and-rank">
          Inverses and Rank →
        </Link>
      </nav>
    </main>
  );
}
function Step({
  n,
  title,
  children,
}: {
  n: number;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <article className="ls-step">
      <h3>
        <i>{n}</i>
        {title}
      </h3>
      {children}
    </article>
  );
}
