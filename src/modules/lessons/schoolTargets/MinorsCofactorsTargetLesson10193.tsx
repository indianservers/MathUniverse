import { AlertTriangle, ArrowLeft } from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import type { SchoolSyllabusLesson } from "../syllabus/lessonSyllabusTypes";
import "./MinorsCofactorsTargetLesson10193.css";

type Matrix = [
  [number, number, number],
  [number, number, number],
  [number, number, number],
];
const A: Matrix = [
    [1, 2, 3],
    [0, 4, 5],
    [1, 0, 6],
  ],
  B: Matrix = [
    [2, -1, 3],
    [4, 0, 5],
    [1, 2, -2],
  ];
const sub = (m: Matrix, row: number, col: number) =>
  m.filter((_, r) => r !== row).map((r) => r.filter((_, c) => c !== col)) as [
    [number, number],
    [number, number],
  ];
const det2 = (m: [[number, number], [number, number]]) =>
  m[0][0] * m[1][1] - m[0][1] * m[1][0];
const minor = (m: Matrix, r: number, c: number) => det2(sub(m, r, c));
const sign = (r: number, c: number) => ((r + c) % 2 === 0 ? 1 : -1);
const cofactor = (m: Matrix, r: number, c: number) =>
  sign(r, c) * minor(m, r, c);
const det3 = (m: Matrix) =>
  m[0].reduce((sum, value, c) => sum + value * cofactor(m, 0, c), 0);
function MatrixGrid({
  matrix,
  row,
  col,
  onSelect,
  cross = false,
}: {
  matrix: Matrix;
  row: number;
  col: number;
  onSelect?: (r: number, c: number) => void;
  cross?: boolean;
}) {
  return (
    <div className={`mc-matrix ${cross ? "cross" : ""}`}>
      {matrix.map((values, r) =>
        values.map((value, c) => {
          const className = `cell ${r === row && c === col ? "selected" : ""} ${cross && (r === row || c === col) ? "removed" : ""}`;
          return onSelect ? (
            <button
              type="button"
              key={`${r}-${c}`}
              className={className}
              onClick={() => onSelect(r, c)}
              aria-label={`entry row ${r + 1} column ${c + 1} value ${value}`}
            >
              {value}
            </button>
          ) : (
            <span key={`${r}-${c}`} className={className}>
              {value}
            </span>
          );
        }),
      )}
      {cross && (
        <>
          <i className="row-line" style={{ top: `${(row + 0.5) * 33.333}%` }} />
          <i
            className="col-line"
            style={{ left: `${(col + 0.5) * 33.333}%` }}
          />
        </>
      )}
    </div>
  );
}
export default function MinorsCofactorsTargetLesson10193({
  lesson: _lesson,
}: {
  lesson: SchoolSyllabusLesson;
}) {
  const [source, setSource] = useState<"A" | "B">("A"),
    [row, setRow] = useState(1),
    [col, setCol] = useState(2);
  const matrix = source === "A" ? A : B,
    entry = matrix[row][col],
    sm = sub(matrix, row, col),
    m = minor(matrix, row, col),
    sgn = sign(row, col),
    cf = cofactor(matrix, row, col),
    det = det3(matrix);
  const rowTerms = useMemo(
    () =>
      matrix[row].map((value, c) => ({
        value,
        cofactor: cofactor(matrix, row, c),
        product: value * cofactor(matrix, row, c),
      })),
    [matrix, row],
  );
  const choose = (nextSource: "A" | "B", r: number, c: number) => {
    setSource(nextSource);
    setRow(r);
    setCol(c);
  };
  const practicePrompts = B.flatMap((values, r) =>
    values.map((value, c) => ({ value, r, c })),
  ).filter(({ r, c }) => !(r === 2 && c === 1));
  return (
    <main
      className="mc10193-page"
      data-testid="school-mockup-0867"
      data-object-model="dedicated-minor-cofactor-matrix-engine"
      data-source={source}
      data-row={row + 1}
      data-column={col + 1}
      data-entry={entry}
      data-minor={m}
      data-sign={sgn}
      data-cofactor={cf}
      data-determinant={det}
    >
      <header className="mc-hero">
        <small>CLASS 12 · MATRICES AND DETERMINANTS</small>
        <h1>Minors and Cofactors</h1>
        <p>
          Explore minors and cofactors with an interactive 3×3 matrix. Click any
          entry to see the row and column removed, the minor, the sign (−1)ⁱ⁺ʲ,
          and the cofactor.
        </p>
        <Link to="/lessons/school">
          <ArrowLeft />
          School lessons
        </Link>
      </header>
      <section className="mc-board">
        <article>
          <h3>
            <i>1</i> Select an entry
          </h3>
          <p>Click any entry (aᵢⱼ) in matrix {source}.</p>
          <div className="mc-labelled">
            <span>j=1</span>
            <span>j=2</span>
            <span>j=3</span>
            <b>i=1</b>
            <b>i=2</b>
            <b>i=3</b>
            <MatrixGrid
              matrix={matrix}
              row={row}
              col={col}
              onSelect={(r, c) => choose(source, r, c)}
            />
          </div>
          <strong>
            Selected entry: {source.toLowerCase()}
            <sub>
              {row + 1}
              {col + 1}
            </sub>{" "}
            = {entry} &nbsp; (i={row + 1}, j={col + 1})
          </strong>
        </article>
        <article>
          <h3>
            <i>2</i> Row {row + 1} and Column {col + 1} are crossed out
          </h3>
          <p>
            Remove row i={row + 1} and column j={col + 1}.
          </p>
          <div className="mc-labelled">
            <span>j=1</span>
            <span>j=2</span>
            <span>j=3</span>
            <b>i=1</b>
            <b>i=2</b>
            <b>i=3</b>
            <MatrixGrid matrix={matrix} row={row} col={col} cross />
          </div>
        </article>
        <article>
          <h3>
            <i>3</i> Minor (delete row {row + 1} and column {col + 1})
          </h3>
          <p>The remaining submatrix is the minor matrix.</p>
          <div className="mc-sub">
            <b>
              M
              <sub>
                {row + 1}
                {col + 1}
              </sub>{" "}
              =
            </b>
            <div>
              <span>{sm[0][0]}</span>
              <span>{sm[0][1]}</span>
              <span>{sm[1][0]}</span>
              <span>{sm[1][1]}</span>
            </div>
            <em>(2×2)</em>
          </div>
        </article>
        <article>
          <h3>
            <i>4</i> Compute the minor M
            <sub>
              {row + 1}
              {col + 1}
            </sub>
          </h3>
          <p>Determinant of the 2×2 submatrix.</p>
          <div className="mc-calc">
            M
            <sub>
              {row + 1}
              {col + 1}
            </sub>{" "}
            = ({sm[0][0]}·{sm[1][1]}) − ({sm[0][1]}·{sm[1][0]}) = {m}
          </div>
          <strong className="answer">
            M
            <sub>
              {row + 1}
              {col + 1}
            </sub>{" "}
            = {m}
          </strong>
        </article>
        <article>
          <h3>
            <i>5</i> Sign from checkerboard
          </h3>
          <p>Sign = (−1)ⁱ⁺ʲ</p>
          <div className="mc-sign">
            <div>
              {[1, -1, 1, -1, 1, -1, 1, -1, 1].map((v, i) => (
                <span
                  className={
                    Math.floor(i / 3) === row && i % 3 === col ? "active" : ""
                  }
                  key={i}
                >
                  {v === 1 ? "+" : "−"}
                </span>
              ))}
            </div>
            <p>
              For (i,j)=({row + 1},{col + 1}):
              <br />
              (−1)
              <sup>
                {row + 1}+{col + 1}
              </sup>{" "}
              = {sgn}
            </p>
          </div>
          <strong className="sign-answer">Sign = {sgn}</strong>
        </article>
        <article>
          <h3>
            <i>6</i> Cofactor C
            <sub>
              {row + 1}
              {col + 1}
            </sub>
          </h3>
          <p>Multiply the minor by the sign.</p>
          <div className="mc-calc">
            C
            <sub>
              {row + 1}
              {col + 1}
            </sub>{" "}
            = ({sgn}) · ({m}) = {cf}
          </div>
          <strong className="answer">
            C
            <sub>
              {row + 1}
              {col + 1}
            </sub>{" "}
            = {cf}
          </strong>
        </article>
        <aside className="mc-warning">
          <AlertTriangle />
          <div>
            <b>Minor and cofactor differ by sign only:</b>
            <p>
              Cᵢⱼ=(−1)ⁱ⁺ʲMᵢⱼ. Here, M={m} and C={cf}.
            </p>
          </div>
        </aside>
        <article className="mc-expansion">
          <h3>
            <i>7</i> Determinant expansion preview (along row {row + 1})
          </h3>
          <p>
            Using cofactors from row {row + 1}: det({source}) = Σ a
            <sub>{row + 1}j</sub>C<sub>{row + 1}j</sub>
          </p>
          <table>
            <tbody>
              <tr>
                <th>
                  Entry a<sub>{row + 1}j</sub>
                </th>
                {rowTerms.map((t, i) => (
                  <td className={i === col ? "active" : ""} key={i}>
                    a
                    <sub>
                      {row + 1}
                      {i + 1}
                    </sub>
                    ={t.value}
                  </td>
                ))}
              </tr>
              <tr>
                <th>
                  Cofactor C<sub>{row + 1}j</sub>
                </th>
                {rowTerms.map((t, i) => (
                  <td className={i === col ? "active" : ""} key={i}>
                    C
                    <sub>
                      {row + 1}
                      {i + 1}
                    </sub>
                    ={t.cofactor}
                  </td>
                ))}
              </tr>
              <tr>
                <th>Product</th>
                {rowTerms.map((t, i) => (
                  <td className={i === col ? "active" : ""} key={i}>
                    {t.value}·{t.cofactor}={t.product}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
          <strong>
            det({source}) = {rowTerms.map((t) => t.product).join(" + ")} = {det}
          </strong>
        </article>
        <article className="mc-summary">
          <h3>
            <i>8</i> Summary for {source.toLowerCase()}
            <sub>
              {row + 1}
              {col + 1}
            </sub>{" "}
            = {entry}
          </h3>
          <ul>
            <li>
              Selected position: ({row + 1},{col + 1})
            </li>
            <li>Matrix entry: {entry}</li>
            <li>
              Minor matrix: [{sm[0].join(", ")}; {sm[1].join(", ")}]
            </li>
            <li>Minor: M={m}</li>
            <li>Sign: {sgn}</li>
            <li>Cofactor: C={cf}</li>
          </ul>
        </article>
        <article className="mc-practice">
          <h3>
            <i>9</i> Your turn – Practice
          </h3>
          <p>Click any entry to see its minor and cofactor.</p>
          <div>
            <div>
              <b>Matrix B =</b>
              <MatrixGrid
                matrix={B}
                row={source === "B" ? row : -1}
                col={source === "B" ? col : -1}
                onSelect={(r, c) => choose("B", r, c)}
              />
            </div>
            <aside>
              <b>Try these entries</b>
              <p>Click each entry to verify your understanding.</p>
              <div>
                {practicePrompts.map(({ value, r, c }) => (
                  <button key={`${r}-${c}`} onClick={() => choose("B", r, c)}>
                    b
                    <sub>
                      {r + 1}
                      {c + 1}
                    </sub>{" "}
                    = {value}
                  </button>
                ))}
              </div>
            </aside>
          </div>
        </article>
        <footer>
          Tip: Click any cell in the matrices above to recompute minors and
          cofactors instantly.
        </footer>
      </section>
    </main>
  );
}
