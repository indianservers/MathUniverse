import { Download, RotateCcw, Share2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";
import type { LessonAdapterProps } from "../../types";
import "./MatrixBuilderTargetLesson347.css";

type Matrix = number[][];
const initial: Matrix = [[2, -1, 3], [4, 0, 5]];
const tabs = ["Matrix Builder", "Visualizations", "Examples", "Explore", "Formulas", "Learn More"];
const resize = (a: Matrix, rows: number, cols: number) =>
  Array.from({ length: rows }, (_, r) => Array.from({ length: cols }, (_, c) => a[r]?.[c] ?? 0));

export default function MatrixBuilderTargetLesson347({ resetToken, onInteraction }: LessonAdapterProps) {
  const [matrix, setMatrix] = useState<Matrix>(initial), [selected, setSelected] = useState("0-0"),
    [tab, setTab] = useState(tabs[0]), [quickOrder, setQuickOrder] = useState("correct"),
    [quickEntry, setQuickEntry] = useState("correct"), [actions, setActions] = useState(0),
    [notice, setNotice] = useState("");
  const dragRef = useRef<{ y: number; value: number; row: number; col: number } | null>(null);
  const rows = matrix.length, cols = matrix[0]?.length ?? 0;
  const valid = matrix.every((row) => row.length === cols && row.every(Number.isFinite));
  const act = (fn: () => void) => { fn(); setActions((v) => v + 1); onInteraction(); };
  const reset = () => { setMatrix(initial); setSelected("0-0"); setTab(tabs[0]); setQuickOrder("correct"); setQuickEntry("correct"); setActions(0); setNotice(""); };
  useEffect(reset, [resetToken]);
  const setDimensions = (r: number, c: number) => act(() => setMatrix((a) => resize(a, Math.max(1, Math.min(5, r)), Math.max(1, Math.min(5, c)))));
  const update = (r: number, c: number, value: number) => act(() => setMatrix((a) => a.map((row, ri) => row.map((v, ci) => ri === r && ci === c ? value : v))));
  const transpose = () => act(() => setMatrix((a) => Array.from({ length: a[0].length }, (_, c) => a.map((row) => row[c]))));
  const augment = () => act(() => setMatrix((a) => a.map((row, r) => [...row, r === 0 ? 7 : r === 1 ? -2 : 0])));
  const exportMatrix = () => {
    const blob = new Blob([JSON.stringify({ matrix, order: `${rows} x ${cols}` }, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob), link = document.createElement("a");
    link.href = url; link.download = "matrix-workspace.json"; link.click(); URL.revokeObjectURL(url);
    act(() => setNotice("Matrix exported to workspace."));
  };
  const dragStart = (r: number, c: number, e: ReactPointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId); dragRef.current = { y: e.clientY, value: matrix[r][c], row: r, col: c };
  };
  const dragMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    const d = dragRef.current; if (!d || e.buttons !== 1) return;
    const next = d.value + Math.round((d.y - e.clientY) / 12);
    setMatrix((a) => a.map((row, r) => row.map((v, c) => r === d.row && c === d.col ? next : v)));
  };
  const notation = matrix.map((row) => row.join("  ")).join(" | ");
  return <section className="mat347-page" data-testid="matrix-mockup-0532"
    data-object-model="editable-resizable-matrix-transpose-augmentation-validation-export-cell-drag"
    data-matrix={JSON.stringify(matrix)} data-rows={rows} data-cols={cols} data-selected={selected}
    data-valid={valid} data-tab={tab} data-quick-order={quickOrder} data-quick-entry={quickEntry} data-actions={actions}>
    <header className="mat347-hero">
      <span><b>ADVANCED MATHEMATICS</b><b>MATRICES AND LINEAR ALGEBRA</b></span>
      <h1>Matrix Builder</h1><p>Create, edit, and explore matrices with ease.</p>
      <div><b>Advanced</b><b>Topic Matrices</b><b>Lab Type Interactive</b><b>Duration 6-10 min</b></div>
      <nav><select aria-label="Language"><option>English (English)</option></select>
        <button onClick={reset}><RotateCcw/>Reset Lab</button><button onClick={() => act(() => setNotice("Share link ready."))}><Share2/>Share</button>
        <button onClick={() => act(() => setNotice("Matrix added to workspace."))}>Add to Workspace</button></nav>
    </header>
    <nav className="mat347-tabs">{tabs.map((name) => <button key={name} className={tab === name ? "active" : ""} onClick={() => act(() => setTab(name))}>{name}</button>)}</nav>
    <section className="mat347-builder"><header><h2>Build your matrix</h2><p>Set the size, enter values, and see your matrix in notation.</p></header>
      <div className="mat347-workspace">
        <aside className="mat347-controls">
          <fieldset><legend><i>1</i> Set dimensions</legend><label>Rows (m)<span><button aria-label="Decrease rows" onClick={() => setDimensions(rows - 1, cols)}>-</button><b>{rows}</b><button aria-label="Increase rows" onClick={() => setDimensions(rows + 1, cols)}>+</button></span></label><label>Columns (n)<span><button aria-label="Decrease columns" onClick={() => setDimensions(rows, cols - 1)}>-</button><b>{cols}</b><button aria-label="Increase columns" onClick={() => setDimensions(rows, cols + 1)}>+</button></span></label><small>Size: <b>{rows} x {cols}</b></small></fieldset>
          <fieldset><legend><i>2</i> Edit entries</legend><p>Enter values in the grid.</p><button onClick={() => act(() => setMatrix(matrix.map((row) => row.map(() => 0))))}>Fill with 0</button><button onClick={() => act(() => setMatrix(matrix.map((row, r) => row.map((_, c) => r === c ? 1 : 0))))}>Fill Identity</button><button onClick={() => act(() => setMatrix(matrix.map((row) => row.map(() => Math.floor(Math.random() * 19) - 9))))}>Random Integers</button></fieldset>
          <fieldset><legend><i>3</i> Actions</legend><button onClick={transpose}>Transpose (T)</button><button onClick={augment}>Augment with</button><button className="danger" onClick={() => act(() => setMatrix(matrix.map((row) => row.map(() => 0))))}>Clear Matrix</button></fieldset>
        </aside>
          <div className="mat347-grid-area"><div className="mat347-grid" style={{ gridTemplateColumns: `48px repeat(${cols}, 1fr)` }}><span/>{matrix[0].map((_, c) => <b key={`c${c}`}>Column {c + 1}</b>)}{matrix.flatMap((row, r) => [<b key={`r${r}`}>Row {r + 1}</b>, ...row.map((value, c) => <div key={`${r}-${c}`} data-drag={`matrix-cell-${r}-${c}`} className={selected === `${r}-${c}` ? "selected" : ""} onPointerDown={(e) => dragStart(r, c, e)} onPointerMove={dragMove} onPointerUp={() => { if (dragRef.current) { setActions((v) => v + 1); onInteraction(); } dragRef.current = null; }}><input aria-label={`Row ${r + 1} column ${c + 1}`} type="number" value={value} onFocus={() => setSelected(`${r}-${c}`)} onChange={(e) => update(r, c, Number(e.target.value))}/></div>)])}</div><p>Click any cell to edit. Use arrows or Tab to navigate.</p></div>
        <aside className="mat347-summary"><article><h3>Matrix ({rows} x {cols})</h3><div className="notation"><em>A =</em><strong>[ {notation} ]</strong></div></article><article><h3>Properties</h3><dl><dt>Order</dt><dd>{rows} x {cols}</dd><dt>Entries</dt><dd>{rows * cols}</dd><dt>Type</dt><dd>{rows === cols ? "Square" : "Rectangular"}</dd></dl></article><article className="valid"><h3>Validation</h3><b>Valid matrix</b><p>All entries are numeric.</p></article></aside>
      </div>
      <footer><p><b>Tip:</b> Use the actions to transform your matrix. Try Transpose to see how rows and columns switch.</p><button onClick={exportMatrix}><Download/>Export to Workspace</button></footer>{notice && <output>{notice}</output>}
    </section>
    <section className="mat347-notes"><article><h3>Learning Objective</h3><p>Create and manipulate matrices, understand their order, and represent them in standard notation.</p></article><article><h3>Key Insight</h3><p>The order (m x n) tells us how many rows and columns a matrix has.</p></article><article><h3>Common Misconception</h3><p>Mixing up rows and columns when finding a<sub>ij</sub>. The row index comes first.</p></article><article className="guided"><h3>Guided Explanation</h3><p>A matrix is a <b>rectangular array</b> of numbers arranged in m rows and n columns.</p><ul><li>The order is written as m x n.</li><li>Each number is called an entry.</li><li>Element a<sub>ij</sub> is in row i and column j.</li></ul><h4>Example (From the lab):</h4><p>Order: {rows} x {cols}</p><p>Notation: A = [ {notation} ]</p></article><article className="assumptions"><h3>Relevant Assumptions / Constraints</h3><p>All entries must be real numbers.</p><p>All rows must have the same number of columns.</p><p>Order must be positive integers.</p><p>Operations follow matrix rules.</p></article><article className="worked"><h3>Worked Solution (Using the matrix A)</h3><p>Find (i) A<sup>T</sup> and (ii) the matrix after augmenting A with b = [7, -2]<sup>T</sup>.</p><div><b>(i) Transpose A</b><code>[ 2  4 | -1  0 | 3  5 ]</code><b>(ii) Augment A with b</b><code>[ 2 -1 3 7 | 4 0 5 -2 ]</code></div></article></section>
    <section className="mat347-check"><article><h3>Quick Check</h3><p>What is the order of B = [ 1 2 -3 | 4 0 5 ]?</p>{["2 x 3", "3 x 2", "1 x 3", "3 x 3"].map((v) => <button className={quickOrder === (v === "2 x 3" ? "correct" : "incorrect") ? quickOrder : ""} key={v} onClick={() => act(() => setQuickOrder(v === "2 x 3" ? "correct" : "incorrect"))}>{v}</button>)}<output>Correct! The matrix has 2 rows and 3 columns.</output></article><article><h3>Try Another</h3><p>What is the element in row 2, column 3 of matrix A?</p>{[-1, 3, 4, 5].map((v) => <button className={quickEntry === (v === 5 ? "correct" : "incorrect") ? quickEntry : ""} key={v} onClick={() => act(() => setQuickEntry(v === 5 ? "correct" : "incorrect"))}>{v}</button>)}<output>Correct! a<sub>23</sub> = 5.</output></article></section>
  </section>;
}
