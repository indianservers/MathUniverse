import { ArrowLeft, CheckCircle2, Eye, RotateCw } from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import type { SchoolSyllabusLesson } from "../syllabus/lessonSyllabusTypes";
import "./AdjointMatrixTargetLesson10194.css";

type Matrix3 = [
  [number, number, number],
  [number, number, number],
  [number, number, number],
];
type Matrix2 = [[number, number], [number, number]];
const A: Matrix3 = [
  [1, 2, 3],
  [0, 4, 5],
  [1, 0, 6],
];
const B: Matrix2 = [
  [2, 3],
  [1, 4],
];
const D: Matrix2 = [
  [4, -1],
  [2, 3],
];
const det2 = (m: Matrix2) => m[0][0] * m[1][1] - m[0][1] * m[1][0];
const minor = (m: Matrix3, r: number, c: number) => {
  const v = m
    .filter((_, i) => i !== r)
    .map((row) => row.filter((_, j) => j !== c));
  return v[0][0] * v[1][1] - v[0][1] * v[1][0];
};
const cofactors = (m: Matrix3): Matrix3 =>
  m.map((row, r) =>
    row.map((_, c) => ((r + c) % 2 ? -1 : 1) * minor(m, r, c)),
  ) as Matrix3;
const transpose = (m: Matrix3): Matrix3 =>
  m.map((row, r) => row.map((_, c) => m[c][r])) as Matrix3;
const multiply = (a: Matrix3, b: Matrix3): Matrix3 =>
  a.map((row) =>
    b[0].map((_, c) => row.reduce((sum, value, k) => sum + value * b[k][c], 0)),
  ) as Matrix3;
const adjoint2 = (m: Matrix2): Matrix2 => [
  [m[1][1], -m[0][1]],
  [-m[1][0], m[0][0]],
];
const C = cofactors(A),
  ADJ = transpose(C),
  PRODUCT = multiply(A, ADJ);

function Matrix({
  values,
  selected,
  onSelect,
  label,
}: {
  values: number[][];
  selected?: [number, number];
  onSelect?: (r: number, c: number) => void;
  label: string;
}) {
  const size = values.length;
  return (
    <div className={`am-matrix size-${size}`} aria-label={label}>
      {values.flatMap((row, r) =>
        row.map((value, c) =>
          onSelect ? (
            <button
              type="button"
              key={`${r}-${c}`}
              className={
                selected?.[0] === r && selected[1] === c ? "selected" : ""
              }
              onClick={() => onSelect(r, c)}
              aria-label={`${label} row ${r + 1} column ${c + 1} value ${value}`}
            >
              {value}
            </button>
          ) : (
            <span key={`${r}-${c}`}>{value}</span>
          ),
        ),
      )}
    </div>
  );
}

export default function AdjointMatrixTargetLesson10194({
  lesson: _lesson,
}: {
  lesson: SchoolSyllabusLesson;
}) {
  const [row, setRow] = useState(0),
    [col, setCol] = useState(1),
    [flipped, setFlipped] = useState(false),
    [answer, setAnswer] = useState(false);
  const m = minor(A, row, col),
    sign = (row + col) % 2 ? -1 : 1,
    cofactor = C[row][col];
  const remaining = useMemo(
    () =>
      A.filter((_, r) => r !== row).map((values) =>
        values.filter((_, c) => c !== col),
      ) as Matrix2,
    [row, col],
  );
  const bAdj = adjoint2(B),
    dAdj = adjoint2(D),
    verified = PRODUCT.every((values, r) =>
      values.every((v, c) => v === (r === c ? 22 : 0)),
    );
  return (
    <main
      className="am10194-page"
      data-testid="school-mockup-0868"
      data-object-model="dedicated-adjoint-transpose-verification-engine"
      data-row={row + 1}
      data-column={col + 1}
      data-minor={m}
      data-sign={sign}
      data-cofactor={cofactor}
      data-destination={`${col + 1},${row + 1}`}
      data-determinant="22"
      data-flipped={flipped}
      data-answer-visible={answer}
    >
      <header className="am-hero">
        <small>CLASS 12 · MATRICES AND DETERMINANTS</small>
        <h1>Adjoint of a Matrix</h1>
        <div className="am-hero-copy">
          The adjoint of A, written <b>adj(A)</b>, is the transpose of its
          cofactor matrix C.
        </div>
        <div className="am-chips">
          <span>A (3×3)</span>
          <span>det(A) = 22</span>
          <span>
            adj(A) = C<sup>T</sup>
          </span>
        </div>
        <div className="am-meta">
          ◷ 18 min <b>ADVANCED</b> <b>CONCEPT</b> matrix
        </div>
        <Link to="/lessons/school">
          <ArrowLeft />
          School lessons
        </Link>
      </header>
      <section className="am-intro">
        <div>
          <b>MATRIX A</b>
          <div className="am-matrix-line">
            <i>A =</i>
            <Matrix values={A} label="matrix A" />
          </div>
        </div>
        <article>
          <b>◇ DEFINITION</b>
          <p>The adjoint of a square matrix A is defined as</p>
          <strong>
            adj(A) = C<sup>T</sup>
          </strong>
          <p>where C is the cofactor matrix of A.</p>
        </article>
        <article className="important">
          <b>△ IMPORTANT</b>
          <p>
            In this lesson, adjoint means the{" "}
            <strong>transpose of the cofactor matrix</strong>, not the conjugate
            transpose.
          </p>
        </article>
      </section>
      <section className="am-work">
        <h2>
          COFACTOR MATRIX → ADJOINT (C<sup>T</sup>)
        </h2>
        <p>
          Click any entry in C to see its destination in adj(A) and the
          minor/sign computation.
        </p>
        <div className="am-transpose">
          <div>
            <b>COFACTOR MATRIX C</b>
            <div className="am-matrix-line">
              <i>C =</i>
              <Matrix
                values={C}
                selected={[row, col]}
                onSelect={(r, c) => {
                  setRow(r);
                  setCol(c);
                }}
                label="cofactor matrix"
              />
            </div>
            <small>(i,j) Value Cᵢⱼ</small>
          </div>
          <div className={`am-flip ${flipped ? "flipped" : ""}`}>
            <span>Reflect across main diagonal</span>
            <button type="button" onClick={() => setFlipped((v) => !v)}>
              <RotateCw /> FLIP
            </button>
            <div className="am-mirror">
              ↘<br />
              • •
              <br />
              • •
              <br />• •
            </div>
            <small>Main diagonal mirror</small>
          </div>
          <div>
            <b>
              ADJOINT adj(A) = C<sup>T</sup>
            </b>
            <div className="am-matrix-line">
              <i>adj(A) =</i>
              <Matrix
                values={ADJ}
                selected={[col, row]}
                label="adjoint matrix"
              />
            </div>
            <small>(j,i) Value Cᵢⱼ</small>
          </div>
        </div>
        <article className="am-details">
          <h3>SELECTED ENTRY DETAILS</h3>
          <div>
            <section>
              <b>Selected in C</b>
              <strong>
                C
                <sub>
                  {row + 1}
                  {col + 1}
                </sub>{" "}
                = {cofactor}
              </strong>
            </section>
            <section>
              <b>
                Minor M
                <sub>
                  {row + 1}
                  {col + 1}
                </sub>
              </b>
              <p>
                Delete row {row + 1} and column {col + 1} from A
              </p>
              <Matrix values={remaining} label="minor matrix" />
              <p>
                det = {remaining[0][0]}×{remaining[1][1]} − {remaining[0][1]}×
                {remaining[1][0]} = {m}
              </p>
            </section>
            <section>
              <b>
                Sign factor (−1)
                <sup>
                  {row + 1}+{col + 1}
                </sup>
              </b>
              <strong>
                (−1)<sup>{row + col + 2}</sup> = {sign}
              </strong>
              <div className="am-signs">
                + −
                <br />− +
              </div>
            </section>
            <section>
              <b>Cofactor</b>
              <p>
                C
                <sub>
                  {row + 1}
                  {col + 1}
                </sub>{" "}
                = ({sign}) · ({m}) = <strong>{cofactor}</strong>
              </p>
            </section>
            <section className="destination">
              <b>Destination in adj(A)</b>
              <p>
                Placed at ({col + 1}, {row + 1})
              </p>
              <strong>
                adj(A)
                <sub>
                  {col + 1},{row + 1}
                </sub>{" "}
                = C
                <sub>
                  {row + 1}
                  {col + 1}
                </sub>{" "}
                = {cofactor}
              </strong>
            </section>
          </div>
          <footer>
            Rule: adj(A)<sub>j,i</sub> = C<sub>i,j</sub> <CheckCircle2 />{" "}
            Verified: C
            <sub>
              {row + 1}
              {col + 1}
            </sub>{" "}
            = {cofactor} → adj(A)
            <sub>
              {col + 1},{row + 1}
            </sub>{" "}
            = {cofactor}
          </footer>
        </article>
      </section>
      <section className="am-verify">
        <h2>VERIFICATION: A · adj(A) = det(A) I</h2>
        <div>
          <article>
            <p>det(A) = 22</p>
            <div className="am-matrix-line">
              <span>det(A) I = 22 I =</span>
              <Matrix
                values={[
                  [22, 0, 0],
                  [0, 22, 0],
                  [0, 0, 22],
                ]}
                label="determinant identity"
              />
            </div>
          </article>
          <article>
            <div className="am-matrix-line">
              <span>A · adj(A) =</span>
              <Matrix values={PRODUCT} label="matrix product" />
            </div>
          </article>
          <ul>
            {PRODUCT.flatMap((values, r) =>
              values.map((v, c) => (
                <li key={`${r}-${c}`}>
                  <CheckCircle2 /> Row {r + 1} · Col {c + 1} = {v}
                </li>
              )),
            )}
          </ul>
        </div>
        <footer>
          {verified ? "Verified:" : "Check:"} A · adj(A) = det(A) I = 22 I
        </footer>
      </section>
      <section className="am-practice">
        <h2>PRACTICE: 2 × 2 MATRIX</h2>
        <div>
          <article>
            <b>Try this</b>
            <div className="am-matrix-line">
              <i>B =</i>
              <Matrix values={B} label="practice matrix B" />
            </div>
          </article>
          <article className="solution">
            <b>Solution</b>
            <div>
              <section>
                <b>
                  Cofactor matrix C<sub>B</sub>
                </b>
                <Matrix
                  values={[
                    [4, -1],
                    [-3, 2],
                  ]}
                  label="B cofactor matrix"
                />
              </section>
              <b>→</b>
              <section>
                <b>
                  Adjoint adj(B) = C<sub>B</sub>
                  <sup>T</sup>
                </b>
                <Matrix values={bAdj} label="B adjoint" />
              </section>
              <b>→</b>
              <section>
                <b>Check</b>
                <p>det(B) = {det2(B)}</p>
                <p>B · adj(B) = 5 I</p>
                <span>
                  <CheckCircle2 /> Verified
                </span>
              </section>
            </div>
          </article>
          <article className="your-turn">
            <b>Your turn</b>
            <div className="am-matrix-line">
              <i>D =</i>
              <Matrix values={D} label="matrix D" />
            </div>
            <p>Compute adj(D).</p>
            <button type="button" onClick={() => setAnswer((v) => !v)}>
              <Eye />
              {answer ? "Hide answer" : "Show answer"}
            </button>
            {answer && (
              <div className="am-answer">
                <span>adj(D) =</span>
                <Matrix values={dAdj} label="D adjoint answer" />
              </div>
            )}
          </article>
        </div>
        <footer>
          ● Remember: Adjoint here means transpose of cofactor matrix (not
          conjugate transpose).
        </footer>
      </section>
      <nav className="am-next">
        <Link to="/lessons/school/class-12/class-12-matrices-and-determinants-minors-and-cofactors">
          <ArrowLeft />
          Minors and Cofactors
        </Link>
        <Link to="/lessons/school/class-12/class-12-matrices-and-determinants-inverse-of-a-matrix">
          Inverse by Adjoint →
        </Link>
      </nav>
    </main>
  );
}
