import { Eye, Shuffle } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import type { PointerEvent as ReactPointerEvent, KeyboardEvent } from "react";
import type { SchoolSyllabusLesson } from "../syllabus/lessonSyllabusTypes";
import "./DeterminantAreaTargetLesson10196.css";

type Matrix2 = [[number, number], [number, number]];
const DEFAULT: Matrix2 = [
    [3, 1],
    [1, 2],
  ],
  practices: Matrix2[] = [
    [
      [1, 2],
      [3, 4],
    ],
    [
      [0, -1],
      [1, 0],
    ],
    [
      [2, 5],
      [-1, 3],
    ],
    [
      [2, 4],
      [1, 2],
    ],
  ];
const det = (m: Matrix2) =>
  Math.round((m[0][0] * m[1][1] - m[0][1] * m[1][0]) * 100) / 100;
const orientation = (d: number) =>
  d > 0
    ? "Positive (Counterclockwise)"
    : d < 0
      ? "Negative (Clockwise)"
      : "Collapsed";
const clean = (n: number) => (Math.abs(n) < 0.05 ? 0 : Math.round(n * 10) / 10);
function MatrixInputs({
  matrix,
  onChange,
}: {
  matrix: Matrix2;
  onChange: (m: Matrix2) => void;
}) {
  return (
    <div className="da-input-matrix">
      {matrix.flatMap((row, r) =>
        row.map((v, c) => (
          <input
            key={`${r}-${c}`}
            aria-label={`matrix entry row ${r + 1} column ${c + 1}`}
            type="number"
            step="0.1"
            value={v}
            onChange={(e) => {
              const next = matrix.map((x) => [...x]) as Matrix2;
              next[r][c] = Number(e.target.value);
              onChange(next);
            }}
          />
        )),
      )}
    </div>
  );
}
function Plane({
  matrix,
  onChange,
  interactive,
}: {
  matrix: Matrix2;
  onChange?: (m: Matrix2) => void;
  interactive?: boolean;
}) {
  const [drag, setDrag] = useState<number | null>(null),
    o = { x: 105, y: 190 },
    s = 38,
    point = (x: number, y: number) => `${o.x + x * s},${o.y - y * s}`,
    cols: [[number, number], [number, number]] = [
      [matrix[0][0], matrix[1][0]],
      [matrix[0][1], matrix[1][1]],
    ],
    update = (i: number, x: number, y: number) => {
      if (!onChange) return;
      const n = matrix.map((r) => [...r]) as Matrix2;
      n[0][i] = clean(x);
      n[1][i] = clean(y);
      onChange(n);
    },
    move = (e: ReactPointerEvent<SVGSVGElement>) => {
      if (drag === null) return;
      const rect = e.currentTarget.getBoundingClientRect();
      update(
        drag,
        (((e.clientX - rect.left) / rect.width) * 300) / s - o.x / s,
        (o.y - ((e.clientY - rect.top) / rect.height) * 260) / s,
      );
    },
    key = (e: KeyboardEvent<SVGCircleElement>, i: number) => {
      const k = e.shiftKey ? 0.5 : 0.1,
        x =
          cols[i][0] +
          (e.key === "ArrowRight" ? k : e.key === "ArrowLeft" ? -k : 0),
        y =
          cols[i][1] +
          (e.key === "ArrowUp" ? k : e.key === "ArrowDown" ? -k : 0);
      if (x !== cols[i][0] || y !== cols[i][1]) {
        e.preventDefault();
        update(i, x, y);
      }
    };
  return (
    <svg
      className="da-plane"
      viewBox="0 0 300 260"
      onPointerMove={move}
      onPointerUp={() => setDrag(null)}
      onPointerCancel={() => setDrag(null)}
    >
      {[-2, -1, 0, 1, 2, 3, 4].map((v) => (
        <g key={v}>
          <line x1={o.x + v * s} y1="15" x2={o.x + v * s} y2="235" />
          <line x1="20" y1={o.y - v * s} x2="285" y2={o.y - v * s} />
          <text x={o.x + v * s + 2} y={o.y + 12}>
            {v}
          </text>
        </g>
      ))}
      <line className="axis" x1="20" y1={o.y} x2="285" y2={o.y} />
      <line className="axis" x1={o.x} y1="15" x2={o.x} y2="235" />
      {interactive && (
        <polygon
          className="area"
          points={`${point(0, 0)} ${point(...cols[0])} ${point(cols[0][0] + cols[1][0], cols[0][1] + cols[1][1])} ${point(...cols[1])}`}
        />
      )}{" "}
      {!interactive && (
        <polygon
          className="unit"
          points={`${point(0, 0)} ${point(1, 0)} ${point(1, 1)} ${point(0, 1)}`}
        />
      )}{" "}
      {cols.map((p, i) => (
        <g key={i}>
          <line
            className={`vector v${i}`}
            x1={o.x}
            y1={o.y}
            x2={o.x + p[0] * s}
            y2={o.y - p[1] * s}
          />
          <circle
            tabIndex={interactive ? 0 : -1}
            aria-label={interactive ? `drag column ${i + 1} vector` : undefined}
            cx={o.x + p[0] * s}
            cy={o.y - p[1] * s}
            r={interactive ? 7 : 4}
            onPointerDown={(e) => {
              if (interactive) {
                setDrag(i);
                e.currentTarget.setPointerCapture(e.pointerId);
              }
            }}
            onKeyDown={(e) => key(e, i)}
          />
          <text x={o.x + p[0] * s + 6} y={o.y - p[1] * s - 5}>
            {interactive
              ? `u${i + 1}=(${p[0]}, ${p[1]})`
              : i === 0
                ? "e₁=(1,0)"
                : "e₂=(0,1)"}
          </text>
        </g>
      ))}
    </svg>
  );
}
export default function DeterminantAreaTargetLesson10196({
  lesson: _lesson,
}: {
  lesson: SchoolSyllabusLesson;
}) {
  const [matrix, setMatrix] = useState<Matrix2>(DEFAULT),
    [checks, setChecks] = useState<boolean[]>([false, false, false, false]),
    [solutions, setSolutions] = useState(false),
    [round, setRound] = useState(0);
  const d = det(matrix),
    area = Math.abs(d),
    orient = orientation(d),
    setPreset = (m: Matrix2) => setMatrix(m.map((r) => [...r]) as Matrix2),
    random = () => {
      const n = round + 1;
      setRound(n);
      setMatrix([
        [2 + (n % 3), -1 + (n % 2)],
        [1, (n % 4) + 1],
      ]);
    },
    randomPractice = () => {
      setRound((v) => v + 1);
      setChecks([false, false, false, false]);
    };
  return (
    <main
      className="da10196-page"
      data-testid="school-mockup-0870"
      data-object-model="dedicated-determinant-area-linear-transformation-engine"
      data-a={matrix[0][0]}
      data-b={matrix[0][1]}
      data-c={matrix[1][0]}
      data-d={matrix[1][1]}
      data-determinant={d}
      data-area={area}
      data-orientation={orient}
      data-solutions={solutions}
    >
      <header className="da-hero">
        <small>CLASS 12 · MATRICES AND DETERMINANTS</small>
        <h1>Determinants and Geometric Area</h1>
        <div className="da-hero-copy">
          See how a 2×2 matrix transforms the unit square into a parallelogram.
          The determinant gives the signed area (orientation + size).
        </div>
        <span>Interactive Lab</span>
        <Link to="/lessons/school">← School lessons</Link>
      </header>
      <section className="da-controls">
        <article>
          <b>MATRIX A (ADJUSTABLE)</b>
          <div>
            <i>A =</i>
            <MatrixInputs matrix={matrix} onChange={setMatrix} />
            <aside>
              <button onClick={random}>⚄ Random</button>
              <button
                onClick={() =>
                  setPreset([
                    [1, 0],
                    [0, 1],
                  ])
                }
              >
                ↳ Identity I
              </button>
              <button
                onClick={() =>
                  setPreset([
                    [matrix[0][1], matrix[0][0]],
                    [matrix[1][1], matrix[1][0]],
                  ])
                }
              >
                Swap columns
              </button>
              <button
                onClick={() =>
                  setPreset([
                    [matrix[0][0], matrix[1][0]],
                    [matrix[0][1], matrix[1][1]],
                  ])
                }
              >
                Transpose Aᵀ
              </button>
            </aside>
          </div>
        </article>
        <article>
          <b>◇ det(A)</b>
          <strong>
            {matrix[0][0]} · {matrix[1][1]} − {matrix[0][1]} · {matrix[1][0]} ={" "}
            {d}
          </strong>
          <em>= {d}</em>
        </article>
        <article>
          <b>◇ Orientation</b>
          <strong className={d < 0 ? "negative" : ""}>⟳ {orient}</strong>
        </article>
        <article>
          <b>◇ Area</b>
          <strong>|det(A)| · 1 = {area}</strong>
          <em>square units</em>
        </article>
      </section>
      <section className="da-graphs">
        <article>
          <h2>BEFORE TRANSFORMATION (UNIT SQUARE)</h2>
          <Plane
            matrix={[
              [1, 0],
              [0, 1],
            ]}
          />
          <footer>→ e₁=(1,0) → e₂=(0,1) Unit square area = 1</footer>
        </article>
        <i>A →</i>
        <article>
          <h2>AFTER TRANSFORMATION BY A</h2>
          <Plane matrix={matrix} onChange={setMatrix} interactive />
          <footer>
            → u₁=({matrix[0][0]},{matrix[1][0]}) → u₂=({matrix[0][1]},
            {matrix[1][1]}) Parallelogram area = {area}
          </footer>
        </article>
      </section>
      <section className="da-theory">
        <article>
          <h2>DETERMINANT (SIGNED AREA)</h2>
          <p>det(A)=ad−bc</p>
          <p>
            = {matrix[0][0]}·{matrix[1][1]} − {matrix[0][1]}·{matrix[1][0]}
          </p>
          <p>= {d}</p>
          <strong>
            {d > 0
              ? "Positive ⇒ Counterclockwise orientation"
              : d < 0
                ? "Negative ⇒ Clockwise orientation"
                : "Zero ⇒ Collapsed area"}
          </strong>
        </article>
        <article>
          <h2>AREA CONNECTIONS</h2>
          <p>• Parallelogram area = |det(A)| = {area}</p>
          <p>• Triangle area = ½|det(A)| = {area / 2}</p>
        </article>
        <article>
          <h2>WHAT IF det(A) CHANGES SIGN?</h2>
          <p>
            Negative determinant is clockwise orientation. Area magnitude stays
            the same.
          </p>
          <strong>⟳ Positive (Counterclockwise)</strong>
          <strong className="red">⟳ Negative (Clockwise)</strong>
        </article>
      </section>
      <section className="da-collapse">
        <article>
          <h2>WHEN det(A) = 0 (COLLAPSE)</h2>
          <p>
            The vectors become linearly dependent. The parallelogram collapses
            into a line segment. Area = 0.
          </p>
        </article>
        <div>
          ●────────●
          <br />
          (0,0) (2,0)
        </div>
        <article>
          Example A = [[2,4],[1,2]]<strong>det(A)=2·2−4·1=0</strong>
        </article>
      </section>
      <aside className="da-warning">
        ▲ <b>IMPORTANT: AREA USES ABSOLUTE DETERMINANT</b> Geometric area is
        always non-negative. Use |det(A)|, not det(A), to compute area.
      </aside>
      <section className="da-worked">
        <article>
          <h2>WORKED EXAMPLE (CORRECT)</h2>
          <p>
            1) det(A) = {matrix[0][0]}·{matrix[1][1]} − {matrix[0][1]}·
            {matrix[1][0]} = {d}
          </p>
          <p>
            2) Orientation: det(A) {d >= 0 ? ">" : "<"} 0 ⇒ {orient}
          </p>
          <p>3) Parallelogram area = |det(A)| = {area}</p>
          <p>4) Triangle area = {area / 2}</p>
          <p>5) Transformed vectors are the columns of A.</p>
        </article>
        <article>
          <h2>CHECK (OPTIONAL)</h2>
          <p>
            A = [{matrix[0].join(" ")}; {matrix[1].join(" ")}]
          </p>
          <p>
            Aᵀ = [{matrix[0][0]} {matrix[1][0]}; {matrix[0][1]} {matrix[1][1]}]
          </p>
          <b>
            det(A)={d}, |det(A)|={area}
          </b>
        </article>
        <article>
          <h2>VERIFICATION</h2>
          <p>Column product check:</p>
          <p>
            Ae₁ = ({matrix[0][0]},{matrix[1][0]})
          </p>
          <p>
            Ae₂ = ({matrix[0][1]},{matrix[1][1]})
          </p>
          <b>Determinant cross-check: {d} ✓</b>
        </article>
      </section>
      <section className="da-practice">
        <h2>TARGETED PRACTICE</h2>
        <div>
          {practices.map((m, i) => {
            const pd = det(m);
            return (
              <article key={i}>
                <i>{i + 1}</i>
                <b>
                  A = [{m[0].join(" ")}; {m[1].join(" ")}]
                </b>
                <p>(a) det(A) = ?</p>
                <p>(b) Orientation?</p>
                <p>(c) Area?</p>
                <button
                  onClick={() =>
                    setChecks((v) => v.map((x, j) => (j === i ? !x : x)))
                  }
                >
                  {checks[i] ? "Hide" : "Check"}
                </button>
                {checks[i] && (
                  <strong>
                    det={pd}; {orientation(pd)}; area={Math.abs(pd)}
                  </strong>
                )}
              </article>
            );
          })}
        </div>
        <footer>
          <button onClick={randomPractice}>
            <Shuffle />
            New random problems
          </button>
          <button onClick={() => setSolutions((v) => !v)}>
            <Eye />
            {solutions ? "Hide" : "Show"} solutions
          </button>
        </footer>
        {solutions && (
          <p className="da-solutions">
            Solutions:{" "}
            {practices
              .map(
                (m) => `${det(m)}, ${orientation(det(m))}, ${Math.abs(det(m))}`,
              )
              .join(" | ")}
          </p>
        )}
      </section>
      <nav className="da-next">
        <Link to="/lessons/school/class-12/class-12-matrices-and-determinants-inverse-by-adjoint">
          ← Inverse by Adjoint
        </Link>
        <Link to="/lessons/school/class-12/class-12-matrices-and-determinants-solving-linear-equations-by-matrices">
          Solving Linear Equations by Matrices →
        </Link>
      </nav>
      <footer className="da-footer">
        <b>Math Universe</b>
        <p>
          Interactive math labs, visual proofs, NCERT explorations, graphing,
          CAS-style tools, and classroom-ready activities.
        </p>
      </footer>
    </main>
  );
}
