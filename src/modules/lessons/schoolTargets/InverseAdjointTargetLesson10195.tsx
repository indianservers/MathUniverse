import { CheckCircle2, Eye, RefreshCw, Sparkles } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import type { SchoolSyllabusLesson } from "../syllabus/lessonSyllabusTypes";
import "./InverseAdjointTargetLesson10195.css";

type M3 = number[][];
type M2 = [[number, number], [number, number]];
const EXAMPLES: M3[] = [
  [
    [1, 2, 3],
    [0, 4, 5],
    [1, 0, 6],
  ],
  [
    [2, 1, 0],
    [1, 2, 1],
    [0, 1, 2],
  ],
];
const B: M2 = [
    [4, 7],
    [2, 6],
  ],
  C2: M2 = [
    [2, -1],
    [5, 3],
  ],
  S: M3 = [
    [1, 2, 3],
    [2, 4, 6],
    [1, 2, 3],
  ];
const det2 = (m: number[][]) => m[0][0] * m[1][1] - m[0][1] * m[1][0];
const sub = (m: M3, r: number, c: number) =>
  m.filter((_, i) => i !== r).map((row) => row.filter((_, j) => j !== c));
const det3 = (m: M3) =>
  m[0].reduce(
    (sum, v, c) => sum + v * (c % 2 ? -1 : 1) * det2(sub(m, 0, c)),
    0,
  );
const cofactor = (m: M3) =>
  m.map((row, r) =>
    row.map((_, c) => ((r + c) % 2 ? -det2(sub(m, r, c)) : det2(sub(m, r, c)))),
  );
const transpose = (m: M3) => m.map((row, r) => row.map((_, c) => m[c][r]));
const multiply = (a: M3, b: M3) =>
  a.map((row) =>
    b[0].map((_, c) => row.reduce((sum, v, k) => sum + v * b[k][c], 0)),
  );
const gcd = (a: number, b: number): number => (b ? gcd(b, a % b) : Math.abs(a));
const frac = (n: number, d: number) => {
  if (Math.abs(n - Math.round(n)) < 1e-9) n = Math.round(n);
  if (n === 0) return "0";
  const g = gcd(n, d),
    nn = n / g,
    dd = d / g;
  return dd === 1 ? String(nn) : `${nn}/${dd}`;
};
const adj2 = (m: M2): M2 => [
  [m[1][1], -m[0][1]],
  [-m[1][0], m[0][0]],
];
function Matrix({
  m,
  den = 1,
  selected,
  label,
}: {
  m: M3;
  den?: number;
  selected?: [number, number];
  label: string;
}) {
  return (
    <div className={`ia-matrix n${m.length}`} aria-label={label}>
      {m.flatMap((row, r) =>
        row.map((v, c) => (
          <span
            key={`${r}-${c}`}
            className={
              selected?.[0] === r && selected[1] === c ? "selected" : ""
            }
          >
            {frac(v, den)}
          </span>
        )),
      )}
    </div>
  );
}

export default function InverseAdjointTargetLesson10195({
  lesson: _lesson,
}: {
  lesson: SchoolSyllabusLesson;
}) {
  const [example, setExample] = useState(0),
    [stage, setStage] = useState(1),
    [showCofactors, setShowCofactors] = useState(false),
    [order, setOrder] = useState<"left" | "right">("left"),
    [cell, setCell] = useState<[number, number]>([0, 1]),
    [answer, setAnswer] = useState(false);
  const A = EXAMPLES[example],
    det = det3(A),
    cof = cofactor(A),
    adj = transpose(cof),
    inverse = adj.map((row) => row.map((v) => v / det)),
    left = multiply(A, inverse),
    right = multiply(inverse, A),
    product = order === "left" ? left : right,
    rowVector = order === "left" ? A[cell[0]] : inverse[cell[0]],
    columnVector = (order === "left" ? inverse : A).map((row) => row[cell[1]]),
    terms = rowVector.map((v, i) => v * columnVector[i]),
    sum = terms.reduce((a, b) => a + b, 0);
  const reset = () => {
    setExample(0);
    setStage(1);
    setShowCofactors(false);
    setOrder("left");
    setCell([0, 1]);
    setAnswer(false);
  };
  const bDet = det2(B),
    bAdj = adj2(B),
    cDet = det2(C2),
    cAdj = adj2(C2);
  return (
    <main
      className="ia10195-page"
      data-testid="school-mockup-0869"
      data-object-model="dedicated-inverse-adjoint-exact-matrix-engine"
      data-example={example + 1}
      data-stage={stage}
      data-determinant={det}
      data-order={order}
      data-row={cell[0] + 1}
      data-column={cell[1] + 1}
      data-cell-value={Math.round(sum)}
      data-cofactors-visible={showCofactors}
      data-answer-visible={answer}
    >
      <header className="ia-hero">
        <small>CLASS 12 · MATRICES AND DETERMINANTS</small>
        <h1>Inverse by Adjoint</h1>
        <div className="ia-hero-copy">
          Compute the inverse of a matrix using the adjoint method and verify
          the result.
        </div>
        <div>
          22 min <b>ADVANCED</b> <b>CONCEPT</b> matrix inverse
        </div>
        <Link to="/lessons/school">← School lessons</Link>
        <div className="ia-hero-actions">
          <button onClick={reset}>
            <RefreshCw />
            Reset lab
          </button>
          <button
            onClick={() => {
              setExample((v) => (v + 1) % EXAMPLES.length);
              setStage(1);
              setCell([0, 1]);
            }}
          >
            <Sparkles />
            New example
          </button>
        </div>
      </header>
      <section className="ia-machine">
        <h2>THE FOUR-STAGE INVERSE MACHINE</h2>
        <div>
          {[
            ["Input & Determinant", "Enter matrix and compute det(A)"],
            ["Adjoint", "Compute adj(A)"],
            ["Inverse", "A⁻¹ = adj(A) / det(A)"],
            ["Verify", "Check A·A⁻¹ and A⁻¹·A"],
          ].map((s, i) => (
            <button
              key={s[0]}
              className={stage === i + 1 ? "active" : ""}
              onClick={() => setStage(i + 1)}
            >
              <i>Stage {i + 1}</i>
              <b>{s[0]}</b>
              <span>{s[1]}</span>
            </button>
          ))}
        </div>
      </section>
      <div className="ia-layout">
        <div className="ia-main">
          <div className="ia-top-grid">
            <section className={stage === 1 ? "focus" : ""}>
              <h2>
                <i>1</i> INPUT & DETERMINANT
              </h2>
              <article>
                <b>Matrix A</b>
                <div className="ia-equation">
                  <em>A =</em>
                  <Matrix m={A} label="matrix A" />
                </div>
              </article>
              <article className="ia-det">
                <span>det(A)</span>
                <strong>{det}</strong>
              </article>
              <footer className={det !== 0 ? "good" : "bad"}>
                det(A){" "}
                {det !== 0
                  ? "≠ 0 — Inverse exists."
                  : "= 0 — Matrix is singular."}
              </footer>
              <aside>
                <b>DETERMINANT GATE</b>
                <p>If det(A)=0, the inverse does not exist.</p>
                <button disabled>Inverse disabled when det(A)=0</button>
              </aside>
            </section>
            <section className={stage === 2 ? "focus" : ""}>
              <h2>
                <i>2</i> ADJOINT OF A
              </h2>
              <p>Adjoint is the transpose of the cofactor matrix.</p>
              <div className="ia-equation">
                <em>adj(A)</em>
                <Matrix m={adj} label="adjoint of A" />
              </div>
              <button
                className="ia-outline"
                onClick={() => setShowCofactors((v) => !v)}
              >
                <Eye />
                {showCofactors ? "Hide" : "Show"} cofactor matrix
              </button>
              {showCofactors && (
                <div className="ia-pop">
                  <b>Cofactor matrix</b>
                  <Matrix m={cof} label="cofactor matrix" />
                </div>
              )}
            </section>
            <section className={stage === 3 ? "focus" : ""}>
              <h2>
                <i>3</i> INVERSE OF A
              </h2>
              <div className="ia-formula">
                A⁻¹ = <u>1</u> / det(A) · adj(A) = 1/{det} · adj(A)
              </div>
              <div className="ia-equation">
                <em>A⁻¹ = 1/{det}</em>
                <Matrix m={adj} label="scaled adjoint" />
              </div>
              <div className="ia-equation">
                <em>=</em>
                <Matrix m={adj} den={det} label="inverse of A" />
              </div>
            </section>
            <section className={stage === 4 ? "focus" : ""}>
              <h2>
                <i>4</i> VERIFY
              </h2>
              {[
                ["Check 1: A · A⁻¹ = I₃", left],
                ["Check 2: A⁻¹ · A = I₃", right],
              ].map(([name, m]) => (
                <article key={String(name)}>
                  <b>{String(name)}</b>
                  <span>
                    <CheckCircle2 />
                    Verified
                  </span>
                  <div className="ia-equation">
                    <Matrix m={m as M3} label={String(name)} />
                    <em>= I₃</em>
                  </div>
                </article>
              ))}
            </section>
          </div>
          <section className="ia-inspect">
            <h2>INSPECT A MULTIPLICATION CELL (Row · Column)</h2>
            <p>Explore how entries of the product are computed.</p>
            <div className="ia-selects">
              <label>
                Inspect{" "}
                <select
                  value={order}
                  onChange={(e) => setOrder(e.target.value as "left" | "right")}
                >
                  <option value="left">A · A⁻¹</option>
                  <option value="right">A⁻¹ · A</option>
                </select>
              </label>
              <label>
                Cell (i,j){" "}
                <select
                  value={`${cell[0]},${cell[1]}`}
                  onChange={(e) =>
                    setCell(
                      e.target.value.split(",").map(Number) as [number, number],
                    )
                  }
                >
                  {[0, 1, 2].flatMap((r) =>
                    [0, 1, 2].map((c) => (
                      <option key={`${r},${c}`} value={`${r},${c}`}>
                        ({r + 1}, {c + 1})
                      </option>
                    )),
                  )}
                </select>
              </label>
            </div>
            <div className="ia-inspect-grid">
              <article>
                <b>Row {cell[0] + 1}</b>
                <div className="ia-vector">
                  [
                  {rowVector.map((v, i) => (
                    <span key={i}>{frac(Math.round(v * det), det)}</span>
                  ))}
                  ]
                </div>
                <b>Column {cell[1] + 1}</b>
                <div className="ia-col">
                  {columnVector.map((v, i) => (
                    <span key={i}>{frac(Math.round(v * det), det)}</span>
                  ))}
                </div>
              </article>
              <article>
                <b>Dot product</b>
                {terms.map((v, i) => (
                  <p key={i}>
                    {frac(Math.round(rowVector[i] * det), det)} ·{" "}
                    {frac(Math.round(columnVector[i] * det), det)}
                  </p>
                ))}
                <strong>= {Math.round(sum)}</strong>
              </article>
              <article>
                <p>
                  So, ({order === "left" ? "A·A⁻¹" : "A⁻¹·A"})
                  <sub>
                    {cell[0] + 1},{cell[1] + 1}
                  </sub>{" "}
                  = {Math.round(sum)}
                </p>
                <Matrix
                  m={product}
                  selected={cell}
                  label="selected identity product"
                />
                <small>This cell equals {Math.round(sum)}.</small>
              </article>
            </div>
          </section>
        </div>
        <aside className="ia-side">
          <section>
            <h2>DO NOT USE ELEMENTWISE RECIPROCALS</h2>
            <b>ELEMENTWISE RECIPROCALS</b>
            <p>Taking reciprocals of entries is NOT the inverse.</p>
            <Matrix m={A} label="wrong reciprocal example" />
            <p>This is not the inverse. Always use the adjoint method.</p>
          </section>
          <section>
            <h2>SINGULAR-MATRIX COMPARISON</h2>
            <p>Example: S =</p>
            <Matrix m={S} label="singular matrix S" />
            <strong>det(S) = {det3(S)}</strong>
            <p>S is singular. Inverse does not exist.</p>
            <Matrix m={cofactor(S)} label="singular adjoint" />
          </section>
          <section className="memory">
            <h2>QUICK MEMORY</h2>
            <p>① If det(A) ≠ 0, A⁻¹ exists.</p>
            <p>② A⁻¹ = adj(A)/det(A).</p>
            <p>③ Verify with both products.</p>
          </section>
        </aside>
      </div>
      <section className="ia-practice">
        <h2>PRACTICE: 2 × 2 INVERSE (BY ADJOINT)</h2>
        <div>
          <article>
            <b>Matrix B</b>
            <div className="ia-equation">
              <em>B =</em>
              <Matrix m={B} label="practice matrix B" />
            </div>
          </article>
          <article>
            <b>Solution</b>
            <p>det(B) = {bDet}</p>
            <p>adj(B) =</p>
            <Matrix m={bAdj} label="adjoint B" />
            <p>B⁻¹ = 1/{bDet} adj(B)</p>
            <Matrix m={bAdj} den={bDet} label="inverse B" />
          </article>
          <article>
            <b>Verify</b>
            <Matrix
              m={[
                [1, 0],
                [0, 1],
              ]}
              label="B identity"
            />
            <span>
              <CheckCircle2 />
              Verified
            </span>
          </article>
          <article>
            <b>Try one</b>
            <div className="ia-equation">
              <em>C =</em>
              <Matrix m={C2} label="challenge matrix C" />
            </div>
            <p>Compute C⁻¹.</p>
            <button onClick={() => setAnswer((v) => !v)}>
              {answer ? "Hide" : "Show"} answer
            </button>
            {answer && (
              <div>
                <b>det(C)={cDet}</b>
                <Matrix m={cAdj} den={cDet} label="inverse C answer" />
              </div>
            )}
          </article>
        </div>
      </section>
      <footer className="ia-takeaway">
        <b>Key takeaway:</b> For any non-singular matrix A, the inverse is A⁻¹ =
        adj(A)/det(A).
      </footer>
    </main>
  );
}
