import { Eye, RotateCcw, Share2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { DragEvent } from "react";
import type { LessonAdapterProps } from "../../types";
import "./RowOperationsTargetLesson355.css";
type Matrix = number[][];
type Operation = "swap" | "scale" | "replace";
const initial: Matrix = [
    [2, -1, 3, 4],
    [1, 2, -2, 0],
    [-1, 1, 1, 5],
  ],
  practiceStart: Matrix = [
    [2, -4, 1, 3],
    [1, 2, 0, -1],
    [3, 0, 2, 6],
  ],
  tabs = [
    "Explore",
    "Rules",
    "Worked Example",
    "Misconceptions",
    "Challenge",
    "Summary",
  ],
  clean = (n: number) => Number(n.toFixed(4));
const clone = (m: Matrix) => m.map((row) => [...row]),
  apply = (m: Matrix, op: Operation, i: number, j: number, k: number) => {
    const n = clone(m);
    if (op === "swap") {
      [n[i], n[j]] = [n[j], n[i]];
    } else if (op === "scale") n[i] = n[i].map((v) => clean(v * k));
    else n[i] = n[i].map((v, c) => clean(v + k * n[j][c]));
    return n;
  },
  opLabel = (op: Operation, i: number, j: number, k: number) =>
    op === "swap"
      ? `Swap R${i + 1} <-> R${j + 1}`
      : op === "scale"
        ? `R${i + 1} <- ${k}R${i + 1}`
        : `R${i + 1} <- R${i + 1} + ${k}R${j + 1}`;
export default function RowOperationsTargetLesson355({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [matrix, setMatrix] = useState(initial),
    [history, setHistory] = useState<{ label: string; matrix: Matrix }[]>([
      { label: "Initial", matrix: initial },
    ]),
    [op, setOp] = useState<Operation>("swap"),
    [i, setI] = useState(0),
    [j, setJ] = useState(1),
    [k, setK] = useState(2),
    [equations, setEquations] = useState(true),
    [tab, setTab] = useState(tabs[0]),
    [error, setError] = useState(""),
    [practice, setPractice] = useState(practiceStart),
    [practiceRow, setPracticeRow] = useState(0),
    [practiceFactor, setPracticeFactor] = useState(-0.25),
    [practiceCheck, setPracticeCheck] = useState<"" | "correct" | "incorrect">(
      "",
    ),
    [hint, setHint] = useState(false),
    [actions, setActions] = useState(0);
  const dragRow = useRef<number | null>(null),
    valid = op !== "scale" || k !== 0,
    preview = valid ? apply(matrix, op, i, j, k) : matrix,
    label = opLabel(op, i, j, k);
  const act = (fn: () => void) => {
      fn();
      setActions((v) => v + 1);
      onInteraction();
    },
    reset = () => {
      setMatrix(initial);
      setHistory([{ label: "Initial", matrix: initial }]);
      setOp("swap");
      setI(0);
      setJ(1);
      setK(2);
      setEquations(true);
      setTab(tabs[0]);
      setError("");
      setPractice(practiceStart);
      setPracticeRow(0);
      setPracticeFactor(-0.25);
      setPracticeCheck("");
      setHint(false);
      setActions(0);
    };
  useEffect(reset, [resetToken]);
  const commit = () => {
      if (!valid) {
        setError(
          "A row cannot be scaled by zero because the operation would not be reversible.",
        );
        return;
      }
      act(() => {
        setMatrix(preview);
        setHistory((h) => [...h, { label, matrix: preview }]);
        setError("");
      });
    },
    undo = () =>
      act(() =>
        setHistory((h) => {
          if (h.length === 1) return h;
          const next = h.slice(0, -1);
          setMatrix(next[next.length - 1].matrix);
          return next;
        }),
      ),
    drop = (target: number, e: DragEvent) => {
      e.preventDefault();
      if (dragRow.current === null || dragRow.current === target) return;
      const source = dragRow.current;
      act(() => {
        const next = apply(matrix, "swap", source, target, 1);
        setMatrix(next);
        setHistory((h) => [
          ...h,
          {
            label: `Drag swap R${source + 1} <-> R${target + 1}`,
            matrix: next,
          },
        ]);
      });
      dragRow.current = null;
    };
  const equation = (row: number[]) =>
    `${term(row[0], "x")} ${signed(row[1], "y")} ${signed(row[2], "z")} = ${row[3]}`;
  return (
    <section
      className="mat355-page"
      data-testid="matrix-mockup-0540"
      data-object-model="augmented-three-by-four-matrix-swap-nonzero-scale-row-replacement-preview-commit-draggable-row-reorder-equation-linkage-history-undo-independent-leading-one-practice"
      data-matrix={JSON.stringify(matrix)}
      data-preview={JSON.stringify(preview)}
      data-operation={op}
      data-i={i}
      data-j={j}
      data-k={k}
      data-valid={valid}
      data-history={history.length}
      data-equations={equations}
      data-error={error}
      data-practice={JSON.stringify(practice)}
      data-practice-check={practiceCheck}
      data-tab={tab}
      data-actions={actions}
    >
      <header className="mat355-hero">
        <div>
          <span>
            <b>ADVANCED MATHEMATICS</b>
            <b>MATRICES AND LINEAR ALGEBRA</b>
          </span>
          <h1>Row Operations</h1>
          <p>Change the form, preserve the solution</p>
          <section>
            <b>Advanced</b>
            <b>Linear Algebra Lab</b>
            <b>Matrix Commands / CAS</b>
            <b>15-20 min</b>
          </section>
          <nav>
            <select>
              <option>English (English)</option>
            </select>
            <button onClick={reset}>
              <RotateCcw />
              Reset
            </button>
            <button onClick={() => act(() => {})}>
              <Share2 />
              Share
            </button>
          </nav>
        </div>
        <button>Workspace</button>
      </header>
      <nav className="mat355-tabs">
        {tabs.map((name) => (
          <button
            className={tab === name ? "active" : ""}
            key={name}
            onClick={() => act(() => setTab(name))}
          >
            {name}
          </button>
        ))}
      </nav>
      <section className="mat355-workspace">
        <header>
          <b>BEFORE</b>
          <b>OPERATION</b>
          <b>RESULT</b>
          <button onClick={() => act(() => setEquations((v) => !v))}>
            {equations ? "Hide" : "Show"} equations
          </button>
        </header>
        <div className="mat355-flow">
          <MatrixView
            title="Augmented matrix [A | b]"
            matrix={matrix}
            draggable
            onDrag={(r) => (dragRow.current = r)}
            onDrop={drop}
          />
          <b>→</b>
          <article className="mat355-operator">
            <nav>
              {(["swap", "scale", "replace"] as Operation[]).map((name) => (
                <button
                  className={op === name ? "active" : ""}
                  key={name}
                  onClick={() =>
                    act(() => {
                      setOp(name);
                      setError("");
                    })
                  }
                >
                  {name[0].toUpperCase() + name.slice(1)}
                </button>
              ))}
            </nav>
            <p>Swap two rows i ↔ j</p>
            <label>
              i = <RowSelect value={i} onChange={setI} />
            </label>
            <label>
              j = <RowSelect value={j} onChange={setJ} />
            </label>
            <p>Scale row i by k (k != 0)</p>
            <label>
              i = <RowSelect value={i} onChange={setI} />
            </label>
            <label>
              k ={" "}
              <input
                aria-label="Row operation factor"
                type="number"
                value={k}
                onChange={(e) => act(() => setK(Number(e.target.value)))}
              />
            </label>
            <p>Replace row i: Ri {"<-"} Ri + kRj</p>
            <label>
              i = <RowSelect value={i} onChange={setI} />
            </label>
            <label>
              k ={" "}
              <input
                aria-label="Replacement factor"
                type="number"
                value={k}
                onChange={(e) => act(() => setK(Number(e.target.value)))}
              />
            </label>
            <label>
              j = <RowSelect value={j} onChange={setJ} />
            </label>
            <button disabled={!valid} onClick={commit}>
              Apply operation
            </button>
            {error && <output>{error}</output>}
          </article>
          <b>→</b>
          <MatrixView title="Resulting matrix" matrix={preview} />
        </div>
        {equations && (
          <section className="mat355-equations">
            <div>
              <h3>Equivalent system of equations (Updates live)</h3>
              {matrix.map((row, r) => (
                <p key={r}>
                  <b>R{r + 1}</b>
                  {equation(row)}
                </p>
              ))}
            </div>
            <b>→</b>
            <div>
              {preview.map((row, r) => (
                <p key={r}>
                  <b>R{r + 1}</b>
                  {equation(row)}
                </p>
              ))}
            </div>
            <aside>
              <header>
                <h3>History</h3>
                <b>{history.length} steps</b>
                <button
                  onClick={() =>
                    act(() => {
                      setMatrix(initial);
                      setHistory([{ label: "Initial", matrix: initial }]);
                    })
                  }
                >
                  Clear
                </button>
              </header>
              {[...history].reverse().map((item, index) => (
                <article key={`${item.label}-${index}`}>
                  <b>{history.length - index}</b>
                  <p>{item.label}</p>
                  <small>
                    {item.matrix.map((row) => row.join(" ")).join(" | ")}
                  </small>
                </article>
              ))}
              <button onClick={undo} disabled={history.length === 1}>
                Undo
              </button>
            </aside>
          </section>
        )}
      </section>
      <section className="mat355-notes">
        <article>
          <h3>Row Operation Rules</h3>
          <p>
            <b>Swap (Interchange)</b>
            <br />
            Swap two rows: Ri ↔ Rj
          </p>
          <p>
            <b>Scale (Multiply)</b>
            <br />
            Multiply a row by a nonzero scalar.
          </p>
          <p>
            <b>Replace (Add multiple)</b>
            <br />
            Ri {"<-"} Ri + kRj
          </p>
        </article>
        <article>
          <h3>Worked Example</h3>
          <p>Goal: Create a leading 1 in column 1.</p>
          <ol>
            <li>Swap R1 ↔ R2</li>
            <li>Scale R1 by 1</li>
            <li>Replace R3 {"<-"} R3 + R1</li>
          </ol>
          <strong>✓ Leading 1 created. Solutions preserved.</strong>
        </article>
        <article className="warning">
          <h3>Misconception Warning</h3>
          <h4>Never multiply a row by 0.</h4>
          <p>
            If you multiply any row by 0, you lose information. This changes the
            system and can create infinitely many solutions.
          </p>
          <code>Rule: k != 0 when scaling a row.</code>
        </article>
      </section>
      <section className="mat355-practice">
        <div>
          <h3>Practice Challenge</h3>
          <b>Create a leading 1 in column 2.</b>
          <p>
            Use row operations to make the entry in row 1, column 2 equal to 1.
          </p>
        </div>
        <MatrixView title="Start" matrix={practiceStart} />
        <MatrixView title="Your result" matrix={practice} />
        <aside>
          <label>
            Row <RowSelect value={practiceRow} onChange={setPracticeRow} />
          </label>
          <label>
            Scale by{" "}
            <input
              aria-label="Practice scale factor"
              type="number"
              value={practiceFactor}
              onChange={(e) =>
                act(() => setPracticeFactor(Number(e.target.value)))
              }
            />
          </label>
          <button
            disabled={!practiceFactor}
            onClick={() =>
              act(() => {
                setPractice((m) =>
                  apply(m, "scale", practiceRow, 0, practiceFactor),
                );
                setPracticeCheck("");
              })
            }
          >
            Apply scale
          </button>
          <button
            onClick={() =>
              act(() =>
                setPracticeCheck(
                  Math.abs(practice[0][1] - 1) < 1e-9 ? "correct" : "incorrect",
                ),
              )
            }
          >
            Check my work
          </button>
          <button onClick={() => act(() => setHint((v) => !v))}>
            <Eye />
            Show hint
          </button>
          <output>
            {practiceCheck === "correct"
              ? "Correct: row 1, column 2 is a leading 1."
              : practiceCheck === "incorrect"
                ? "Not yet: the target entry is not 1."
                : hint
                  ? "Scale row 1 by -1/4."
                  : ""}
          </output>
        </aside>
      </section>
    </section>
  );
}
function MatrixView({
  title,
  matrix,
  draggable = false,
  onDrag = () => {},
  onDrop = () => {},
}: {
  title: string;
  matrix: Matrix;
  draggable?: boolean;
  onDrag?: (r: number) => void;
  onDrop?: (r: number, e: DragEvent) => void;
}) {
  return (
    <article className="mat355-matrix">
      <h3>{title}</h3>
      <div>
        {matrix.map((row, r) => (
          <div
            key={r}
            draggable={draggable}
            onDragStart={() => onDrag(r)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => onDrop(r, e)}
          >
            <b>R{r + 1}</b>
            {row.map((v, c) => (
              <span className={c === 3 ? "aug" : ""} key={c}>
                {v}
              </span>
            ))}
          </div>
        ))}
      </div>
      {draggable && <p>Drag row chips to reorder.</p>}
    </article>
  );
}
function RowSelect({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <select
      aria-label="Row selector"
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
    >
      {[0, 1, 2].map((v) => (
        <option value={v} key={v}>
          R{v + 1}
        </option>
      ))}
    </select>
  );
}
const term = (n: number, v: string) =>
    n === 1 ? v : n === -1 ? `-${v}` : `${n}${v}`,
  signed = (n: number, v: string) =>
    `${n >= 0 ? "+" : "-"} ${term(Math.abs(n), v)}`;
