import { AlertTriangle, ArrowLeft } from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import type { SchoolSyllabusLesson } from "../syllabus/lessonSyllabusTypes";
import "./MinorsCofactorsTargetLesson10193.css";
import MathExpression from "../../../components/ui/MathExpression";
import {minorDet as det2,determinant3 as det3} from "./inverseAdjointModel";
import "../components/LessonMockupReference.css";

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
const minor = (m: Matrix, r: number, c: number) => det2(sub(m, r, c));
const sign = (r: number, c: number) => ((r + c) % 2 === 0 ? 1 : -1);
const cofactor = (m: Matrix, r: number, c: number) =>
  sign(r, c) * minor(m, r, c);
function MatrixGrid({
  matrix,
  row,
  col,
  onSelect,
  cross = false,
  label="Matrix entries",
}: {
  matrix: Matrix;
  row: number;
  col: number;
  onSelect?: (r: number, c: number) => void;
  cross?: boolean;
  label?:string;
}) {
  return (
    <div className={`mc-matrix ${cross ? "cross" : ""}`} aria-label={label}>
      {matrix.map((values, r) =>
        values.map((value, c) => {
          const className = `cell ${r === row && c === col ? "selected" : ""} ${cross && (r === row || c === col) ? "removed" : ""}`;
          return onSelect ? (
            <button
              type="button"
              key={`${r}-${c}`}
              className={className}
              onClickCapture={event=>{event.stopPropagation();onSelect(r,c);}}
              aria-pressed={r===row&&c===col}
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
  lesson,
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
      className="mc10193-page lesson-reference"
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
        <h1>{lesson.title}</h1>
        <p>
          Explore minors and cofactors with an interactive 3×3 matrix. Click any
          entry to see the row and column removed, the minor, the sign (−1)ⁱ⁺ʲ,
          and the cofactor.
        </p>
        <Link to="/lessons/school/class-12">
          <ArrowLeft />
          School lessons
        </Link>
        {source==="B"&&<button className="mc-return" onClick={()=>choose("A",1,2)}>Return to matrix A</button>}
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
              label="Active matrix selector" onSelect={(r, c) => choose(source, r, c)}
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
            <MatrixGrid matrix={matrix} row={row} col={col} cross label="Crossed-out matrix"/>
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
          <div className="mc-calc"><MathExpression value={String.raw`M_{${row+1}${col+1}}=\begin{vmatrix}${sm[0][0]}&${sm[0][1]}\\${sm[1][0]}&${sm[1][1]}\end{vmatrix}=(${sm[0][0]}\cdot${sm[1][1]})-(${sm[0][1]}\cdot${sm[1][0]})=${m}`}/></div>
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
            <div className="mc-sign-work"><p>
              For (i,j)=({row + 1},{col + 1}):
              <br />
              (−1)
              <sup>
                {row + 1}+{col + 1}
              </sup>{" "}
              = {sgn}
            </p><strong className="sign-answer">Sign = {sgn}</strong></div>
          </div>
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
          <div className="mc-calc"><MathExpression value={String.raw`C_{${row+1}${col+1}}=(-1)^{${row+1}+${col+1}}M_{${row+1}${col+1}}=(${sgn})\cdot(${m})=${cf}`}/></div>
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
        <div className="mc-expand-row"><article className="mc-expansion">
          <h3>
            <i>7</i> Determinant expansion preview (along row {row + 1})
          </h3>
          <p>
            Using cofactors from row {row + 1}: det({source}) = ∑ {source.toLowerCase()}
            <sub>{row + 1}j</sub>C<sub>{row + 1}j</sub>
          </p>
          <table><thead><tr><th></th>{[1,2,3].map(j=><th key={j}>j = {j}</th>)}</tr></thead>
            <tbody>
              <tr>
                <th>
                  Entry {source.toLowerCase()}<sub>{row + 1}j</sub>
                </th>
                {rowTerms.map((t, i) => (
                  <td className={i === col ? "active" : ""} key={i}>
                    {source.toLowerCase()}
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
                    {t.value<0?`(${t.value})`:t.value}·{t.cofactor<0?`(${t.cofactor})`:t.cofactor}={t.product}
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
              Minor matrix: <MathExpression value={String.raw`\begin{pmatrix}${sm[0][0]}&${sm[0][1]}\\${sm[1][0]}&${sm[1][1]}\end{pmatrix}`}/>
            </li>
            <li>Minor: M={m}</li>
            <li>Sign: {sgn}</li>
            <li>Cofactor: C={cf}</li>
          </ul>
        </article></div>
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
                label="Practice matrix B" row={source === "B" ? row : -1}
                col={source === "B" ? col : -1}
                onSelect={(r, c) => choose("B", r, c)}
              />
            </div>
            <aside>
              <b>Try these entries</b>
              <p>Click each entry to verify your understanding.</p>
              <div>
                {practicePrompts.map(({ value, r, c }) => (
                  <button key={`${r}-${c}`} aria-label={`Try B row ${r+1} column ${c+1}`} onClickCapture={event=>{event.stopPropagation();choose("B",r,c);}}>
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
