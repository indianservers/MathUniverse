import { CircleAlert, ExternalLink, RotateCcw, Share2 } from "lucide-react";
import { useEffect, useMemo, useState, type CSSProperties } from "react";
import type { LessonAdapterProps } from "../types";
import { LessonCartesianGraph } from "../graphs/LessonCartesianGraph";
import "./MatricesTargetLesson33.css";
type Matrix = number[][];
const determinant = (matrix: Matrix): number =>
  matrix.length === 1
    ? matrix[0][0]
    : matrix.length === 2
      ? matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0]
      : matrix[0].reduce(
          (sum, value, column) =>
            sum +
            (column % 2 ? -1 : 1) *
              value *
              determinant(
                matrix
                  .slice(1)
                  .map((row) => row.filter((_, index) => index !== column)),
              ),
          0,
        );
const resize = (matrix: Matrix, rows: number, columns: number) =>
  Array.from({ length: rows }, (_, r) =>
    Array.from(
      { length: columns },
      (_, c) => matrix[r]?.[c] ?? (r === c ? 1 : 0),
    ),
  );
const matrixText = (matrix: Matrix) =>
  `[[${matrix.map((row) => row.join(", ")).join("], [")}]]`;
export default function MatricesTargetLesson33({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [graphReset,setGraphReset]=useState(0);
  const [matrix, setMatrix] = useState<Matrix>([
      [1, 2],
      [3, 4],
    ]),
    [selected, setSelected] = useState<[number, number]>([1, 1]),
    [draft, setDraft] = useState(4),
    [shareState, setShareState] = useState("Share"),
    [workspace, setWorkspace] = useState(false),
    [activeTab, setActiveTab] = useState(0),
    [actions, setActions] = useState(0);
  const rows = matrix.length,
    columns = matrix[0]?.length ?? 0,
    [sr, sc] = selected,
    selectedValue = matrix[sr]?.[sc] ?? 0,
    trace = matrix.reduce((sum, row, index) => sum + (row[index] ?? 0), 0),
    det = rows === columns ? determinant(matrix) : null;
  const vector = useMemo(
      () =>
        [matrix[0]?.[0] ?? 0, matrix[1]?.[0] ?? 0].map(
          (value, index) => value + (matrix[index]?.[1] ?? 0),
        ),
      [matrix],
    ),
    row = matrix[sr] ?? [],
    column = matrix.map((values) => values[sc] ?? 0);
  const touch = () => {
      setActions((value) => value + 1);
      onInteraction();
    },
    reset = () => {
      setGraphReset(value=>value+1);
      setMatrix([
        [1, 2],
        [3, 4],
      ]);
      setSelected([1, 1]);
      setDraft(4);
      setShareState("Share");
      setWorkspace(false);
      setActiveTab(0);
      setActions(0);
      onInteraction();
    };
  useEffect(() => {
    setMatrix([
      [1, 2],
      [3, 4],
    ]);
    setSelected([1, 1]);
    setDraft(4);
    setShareState("Share");
    setWorkspace(false);
    setActiveTab(0);
    setActions(0);
  }, [resetToken]);
  const select = (r: number, c: number) => {
      setSelected([r, c]);
      setDraft(matrix[r]?.[c] ?? 0);
      touch();
    },
    changeSize = (nextRows: number, nextColumns: number) => {
      const safeRows = Math.max(1, Math.min(3, nextRows)),
        safeColumns = Math.max(1, Math.min(3, nextColumns)),
        next = resize(matrix, safeRows, safeColumns);
      setMatrix(next);
      const nextSelected: [number, number] = [
        Math.min(sr, safeRows - 1),
        Math.min(sc, safeColumns - 1),
      ];
      setSelected(nextSelected);
      setDraft(next[nextSelected[0]][nextSelected[1]]);
      touch();
    },
    apply = () => {
      setMatrix((current) =>
        current.map((values, r) =>
          values.map((value, c) => (r === sr && c === sc ? draft : value)),
        ),
      );
      touch();
    },
    share = async () => {
      try {
        await navigator.clipboard?.writeText(matrixText(matrix));
        setShareState("Copied");
      } catch {
        setShareState("Ready");
      }
      touch();
    };
  return (
    <div
      className="matrices-page"
      data-testid="algebra-mockup-0033"
      data-dedicated-lesson="33"
      data-object-model="editable-resizable-matrix-selected-cell-row-column-determinant-trace-vector-action-geometric-transform-model"
      data-matrix={matrix.flat().join(",")}
      data-rows={rows}
      data-columns={columns}
      data-selected-row={sr}
      data-selected-column={sc}
      data-selected-value={selectedValue}
      data-draft={draft}
      data-determinant={det ?? "undefined"}
      data-trace={trace}
      data-vector={vector.join(",")}
      data-workspace={workspace}
      data-tab={activeTab}
      data-actions={actions}
    >
      <nav className="matrices-breadcrumb">
        <a href="/">←</a>
        <a href="/">Home</a>
        <span>›</span>
        <a href="/lessons">Lessons</a>
        <span>›</span>
        <a href="/lessons/core-workspaces">Core Workspaces</a>
        <span>›</span>
        <b>33 Matrices</b>
      </nav>
      <section className="matrices-header">
        <div className="matrix-tags">
          <b>CORE WORKSPACES</b>
          <b>ALGEBRA AND DYNAMIC VARIABLES</b>
        </div>
        <h1>Matrices</h1>
        <p>Support linear algebra calculations.</p>
        <nav>
          <b>♙ Foundational-Advanced</b>
          <b>ϟ Exploration Lab</b>
          <b>▣ Algebra View / Input Bar</b>
          <b>◷ 6-10 min</b>
        </nav>
        <aside>
          <button onClick={touch}>⌁ English (English)⌄</button>
          <button onClick={reset}>
            <RotateCcw />
            Reset
          </button>
          <button onClick={() => void share()}>
            <Share2 />
            {shareState}
          </button>
          <button
            onClick={() => {
              setWorkspace((value) => !value);
              touch();
            }}
          >
            <ExternalLink />
            Workspace
          </button>
        </aside>
      </section>
      <section className="matrices-surface">
        <nav className="matrix-tabs">
          {[
            "Overview",
            "Matrix Editor",
            "Properties",
            "Actions",
            "Transformations",
            "Examples",
            "More",
          ].map((label, index) => (
            <button
              type="button"
              className={activeTab === index ? "active" : ""}
              onClick={() => {
                setActiveTab(index);
                touch();
              }}
              key={label}
            >
              {["⌘", "▦", "⚙", "♧", "∑", "▣", "☰"][index]} {label}
            </button>
          ))}
        </nav>
        <main className="matrix-main">
          <section className="matrix-left">
            <section className="matrix-editor">
              <h2>
                Matrix A (editable) <CircleAlert />
              </h2>
              <h3>A = {matrixText(matrix)}</h3>
              <div className="matrix-grid-wrap">
                <b className="matrix-symbol">A =</b>
                <div
                  className="matrix-grid"
                  style={{ '--matrix-columns':columns, gridTemplateColumns: `repeat(${columns}, 88px)` } as CSSProperties}
                >
                  {matrix.flatMap((values, r) =>
                    values.map((value, c) => (
                      <button
                        type="button"
                        className={`${r === c ? "diagonal" : ""} ${r === sr && c === sc ? "selected" : ""}`}
                        onClick={() => select(r, c)}
                        key={`${r}-${c}`}
                        aria-label={`Select cell row ${r + 1} column ${c + 1}`}
                      >
                        {value}
                      </button>
                    )),
                  )}
                </div>
                <aside>
                  <h3>Legend</h3>
                  <p>
                    <i></i>Main diagonal
                    <br />
                    <small>
                      (1,1) → ({Math.min(rows, columns)},
                      {Math.min(rows, columns)})
                    </small>
                  </p>
                  <p>
                    <i></i>Selected entry
                  </p>
                  <p>
                    <i></i>Other entries
                  </p>
                </aside>
              </div>
              <footer>♧ Rows first, then columns.</footer>
            </section>
            <section className="matrix-facts">
              <article>
                <h3>
                  <i></i>Selected entry
                </h3>
                <strong>
                  a
                  <sub>
                    {sr + 1}
                    {sc + 1}
                  </sub>{" "}
                  = {selectedValue}
                </strong>
                <p>
                  row {sr + 1}, column {sc + 1}
                </p>
              </article>
              <article>
                <h3>
                  <i></i>Trace (sum of main diagonal)
                </h3>
                <strong>
                  trace(A) ={" "}
                  {matrix
                    .map((values, index) => values[index])
                    .filter((value) => value !== undefined)
                    .join(" + ")}{" "}
                  = {trace}
                </strong>
                <p>Sum of diagonal entries.</p>
              </article>
            </section>
          </section>
          <section className="matrix-middle">
            <section className="matrix-action">
              <h2>
                Simple matrix action <CircleAlert />
              </h2>
              <div>
                <b>A</b>
                <Vector values={[1, 1]} />
                <span>=</span>
                <Vector values={vector} tone="purple" />
              </div>
              <p>
                A [1,1]<sup>T</sup> = [{vector.join(", ")}]<sup>T</sup>
              </p>
            </section>
            <section className="matrix-transform">
              <h2>
                Geometric transformation: Unit square → A(unit square){" "}
                <CircleAlert />
              </h2>
              <TransformGraph key={`${resetToken}-${graphReset}`} matrix={matrix} />
              <footer>
                <span>
                  Input vector <Vector values={[1, 1]} />
                </span>
                <b>A</b>
                <i>→</i>
                <span>
                  Output vector <Vector values={vector} tone="purple" />
                </span>
              </footer>
            </section>
          </section>
          <aside className="matrix-side">
            <section className="matrix-size">
              <h2>
                Matrix size <CircleAlert />
              </h2>
              <p>
                Rows{" "}
                <span>
                  <button onClick={() => changeSize(rows - 1, columns)}>
                    −
                  </button>
                  <b>{rows}</b>
                  <button onClick={() => changeSize(rows + 1, columns)}>
                    ＋
                  </button>
                </span>
              </p>
              <p>
                Columns{" "}
                <span>
                  <button onClick={() => changeSize(rows, columns - 1)}>
                    −
                  </button>
                  <b>{columns}</b>
                  <button onClick={() => changeSize(rows, columns + 1)}>
                    ＋
                  </button>
                </span>
              </p>
            </section>
            <section className="cell-editor">
              <h2>
                Selected cell editor <CircleAlert />
              </h2>
              <label>
                Cell
                <select
                  aria-label="Selected matrix cell"
                  value={`${sr},${sc}`}
                  onChange={(event) => {
                    const [r, c] = event.target.value.split(",").map(Number);
                    select(r, c);
                  }}
                >
                  {matrix.flatMap((values, r) =>
                    values.map((_, c) => (
                      <option value={`${r},${c}`} key={`${r}-${c}`}>
                        a{r + 1}
                        {c + 1} (row {r + 1}, column {c + 1})
                      </option>
                    )),
                  )}
                </select>
              </label>
              <label>
                Value
                <input
                  aria-label="Selected matrix cell value"
                  type="number"
                  value={draft}
                  onChange={(event) => {
                    setDraft(Number(event.target.value));
                    touch();
                  }}
                />
              </label>
              <button type="button" onClick={apply}>
                Apply
              </button>
            </section>
            <section className="row-column">
              <h2>
                Row and column view <CircleAlert />
              </h2>
              <p>
                Row {sr + 1}
                <Vector values={row} />
              </p>
              <p>
                Column {sc + 1}
                <Vector values={column} />
              </p>
            </section>
            <section className="matrix-summary">
              <h2>
                Matrix summary <CircleAlert />
              </h2>
              <p>
                <b>Determinant</b>
                {det === null
                  ? "Only defined here for square matrices."
                  : rows === 2
                    ? `det(A) = ${matrix[0][0]}·${matrix[1][1]} - ${matrix[0][1]}·${matrix[1][0]} = ${det}`
                    : `det(A) = ${det}`}
              </p>
              <p>
                <b>Trace</b>trace(A) = {trace}
              </p>
            </section>
            <footer>
              <CircleAlert />
              Edit entries or size to explore
              <br />
              properties and transformations.
            </footer>
          </aside>
        </main>
      </section>
    </div>
  );
}
function Vector({
  values,
  tone = "blue",
}: {
  values: number[];
  tone?: "blue" | "purple";
}) {
  return (
    <span className={`matrix-vector ${tone}`}>
      {values.map((value, index) => (
        <i key={index}>{value}</i>
      ))}
    </span>
  );
}

const INPUT_VIEW={xMin:-35/72,xMax:(150-35)/72,yMin:(184-250)/80,yMax:184/80};
const OUTPUT_VIEW={xMin:-270/48,xMax:(460-270)/48,yMin:(185-250)/18,yMax:185/18};
function TransformGraph({matrix}:{matrix:Matrix}) {
 const [inputView,setInputView]=useState(INPUT_VIEW),[outputView,setOutputView]=useState(OUTPUT_VIEW);
 const a=matrix[0]?.[0]??0,b=matrix[0]?.[1]??0,c=matrix[1]?.[0]??0,d=matrix[1]?.[1]??0;
 const input=[{x:0,y:0},{x:1,y:0},{x:1,y:1},{x:0,y:1}],output=[{x:0,y:0},{x:a,y:c},{x:a+b,y:c+d},{x:b,y:d}];
 return <div className="matrix-shared-plots">{[{id:'input',title:'Input: Unit square',points:input,color:'#0875ef',view:inputView,onViewChange:setInputView,reset:()=>setInputView(INPUT_VIEW)},{id:'output',title:'Output: A(unit square)',points:output,color:'#7c32c7',view:outputView,onViewChange:setOutputView,reset:()=>setOutputView(OUTPUT_VIEW)}].map(plot=><div key={plot.id} data-transform-stage={plot.id}><LessonCartesianGraph unitAspectRatio={plot.id==='input'?72/80:48/18} title={plot.title} description={plot.id==='output'&&(matrix.length!==2||matrix[0].length!==2)?'This 2D preview uses the first two rows and columns; missing entries are zero.':undefined} view={plot.view} onViewChange={plot.onViewChange} onResetView={plot.reset} legend={[{id:'shape',label:plot.title,color:plot.color}]} series={[{id:'shape-fill',label:plot.title,color:plot.color,kind:'region',points:plot.points},{id:'shape-outline',label:plot.title,color:plot.color,points:[...plot.points,plot.points[0]]}]} annotations={plot.points.map((p,index)=>({id:`vertex-${index}`,...p,label:`(${p.x}, ${p.y})`,color:plot.color}))}/></div>)}</div>;
}

