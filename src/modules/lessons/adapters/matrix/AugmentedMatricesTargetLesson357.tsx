import {
  ArrowRight,
  CheckCircle2,
  CirclePlus,
  Grid2X2,
  Info,
  Lightbulb,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { LessonAdapterProps } from "../../types";
import "./AugmentedMatricesTargetLesson357.css";

type Row = [number, number, number];
type Status = "one" | "none" | "infinite";

const defaults: Row[] = [
    [2, 1, 5],
    [1, -1, 1],
  ],
  tabs = ["Explore", "Examples", "Practice", "Challenge", "Notes"],
  fmt = (value: number) => Number(value.toFixed(4)),
  equation = ([a, b, c]: Row) =>
    `${a}x ${b < 0 ? "-" : "+"} ${Math.abs(b)}y = ${c}`;

function analyse(rows: Row[]) {
  const [[a, b, e], [c, d, f]] = rows;
  const determinant = a * d - b * c;
  if (determinant !== 0) {
    return {
      determinant,
      status: "one" as Status,
      solution: [
        fmt((e * d - b * f) / determinant),
        fmt((a * f - e * c) / determinant),
      ] as [number, number],
    };
  }
  const consistent = a * f === e * c && b * f === e * d;
  return {
    determinant,
    status: (consistent ? "infinite" : "none") as Status,
    solution: null,
  };
}

const point = (x: number, y: number) => `${44 + x * 26},${99 - y * 19}`;
function linePoints([a, b, c]: Row) {
  if (b !== 0) {
    const y1 = (c - a * -4) / b;
    const y2 = (c - a * 4) / b;
    return `${point(-4, y1)} ${point(4, y2)}`;
  }
  const x = c / a;
  return `${point(x, -4)} ${point(x, 4)}`;
}

export default function AugmentedMatricesTargetLesson357({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [rows, setRows] = useState<Row[]>(defaults),
    [selected, setSelected] = useState(0),
    [activeTab, setActiveTab] = useState(tabs[0]),
    [details, setDetails] = useState(false),
    [hint, setHint] = useState(false),
    [extraVariable, setExtraVariable] = useState(false),
    [challenge, setChallenge] = useState(Array(6).fill("")),
    [result, setResult] = useState<"" | "correct" | "incorrect">(""),
    [actions, setActions] = useState(0),
    analysis = useMemo(() => analyse(rows), [rows]),
    modelAnalysis = extraVariable
      ? {
          determinant: analysis.determinant,
          status: "infinite" as Status,
          solution: null,
        }
      : analysis,
    augmented = rows.flatMap(([a, b, constant]) =>
      extraVariable ? [a, b, 0, constant] : [a, b, constant],
    ),
    expected = defaults.flatMap((row) => row).map(String);

  const act = (fn: () => void) => {
      fn();
      setActions((value) => value + 1);
      onInteraction();
    },
    reset = () => {
      setRows(defaults);
      setSelected(0);
      setActiveTab(tabs[0]);
      setDetails(false);
      setHint(false);
      setExtraVariable(false);
      setChallenge(Array(6).fill(""));
      setResult("");
      setActions(0);
    },
    update = (row: number, column: number, value: string) =>
      act(() =>
        setRows((current) =>
          current.map((item, index) =>
            index === row
              ? (item.map((entry, i) =>
                  i === column ? Number(value) : entry,
                ) as Row)
              : item,
          ),
        ),
      ),
    addEquation = () =>
      act(() => {
        if (rows.length === 2) setRows((current) => [...current, [1, 1, 3]]);
        else setRows(defaults);
      }),
    check = () =>
      act(() =>
        setResult(
          challenge.every((value, index) => value === expected[index])
            ? "correct"
            : "incorrect",
        ),
      );

  useEffect(reset, [resetToken]);

  const statusCopy = {
    one: ["One solution", "The lines intersect at a single point."],
    none: ["No solution", "The equations represent parallel distinct lines."],
    infinite: [
      "Infinitely many",
      extraVariable
        ? "Two pivots leave z as a free variable."
        : "Both equations represent the same line.",
    ],
  }[modelAnalysis.status];

  return (
    <section
      className="mat357-page"
      data-testid="matrix-mockup-0542"
      data-object-model="editable-linear-system-derived-coefficient-variable-constant-augmented-matrices-determinant-classification-computed-line-intersection-six-entry-challenge"
      data-rows={JSON.stringify(rows)}
      data-augmented={JSON.stringify(augmented)}
      data-determinant={modelAnalysis.determinant}
      data-status={modelAnalysis.status}
      data-solution={JSON.stringify(modelAnalysis.solution)}
      data-variable-count={extraVariable ? 3 : 2}
      data-selected={selected}
      data-tab={activeTab}
      data-details={details}
      data-challenge={result}
      data-actions={actions}
    >
      <header className="mat357-hero">
        <div>
          <b>MATRICES AND LINEAR ALGEBRA</b>
          <h1>Augmented Matrices</h1>
          <p>Turn equations into rows</p>
          <nav>
            <span>Level: Advanced</span>
            <span>
              {extraVariable ? "3 variables (n = 3)" : "2 variables (n = 2)"}
            </span>
            <span>~10 min</span>
          </nav>
        </div>
        <aside>
          <strong>
            <Grid2X2 /> Key rule
          </strong>
          <p>
            For a system <i>Ax = b</i>, the augmented matrix is <b>[ A | b ]</b>{" "}
            - the coefficient matrix <i>A</i> with constants <i>b</i> as the
            last column.
          </p>
        </aside>
      </header>

      <nav className="mat357-tabs" aria-label="Lesson views">
        {tabs.map((tab) => (
          <button
            className={activeTab === tab ? "active" : ""}
            key={tab}
            onClick={() => act(() => setActiveTab(tab))}
          >
            {tab}
          </button>
        ))}
      </nav>

      <section className="mat357-workspace">
        <div className="mat357-left">
          <header>
            <b>1</b>
            <strong>Linear equations (editable)</strong>
            <p>Select an equation to highlight its row.</p>
          </header>
          <div className="mat357-equations">
            {rows.map((row, rowIndex) => (
              <button
                className={selected === rowIndex ? "selected" : ""}
                key={rowIndex}
                onClick={() => act(() => setSelected(rowIndex))}
              >
                <b>{rowIndex + 1}</b>
                {row.map((value, column) => (
                  <span key={column}>
                    <input
                      aria-label={`Equation ${rowIndex + 1} value ${column + 1}`}
                      type="number"
                      value={value}
                      onChange={(event) =>
                        update(rowIndex, column, event.target.value)
                      }
                    />
                    {column === 0 ? "x" : column === 1 ? "y" : ""}
                  </span>
                ))}
              </button>
            ))}
          </div>
          <button className="mat357-add" onClick={addEquation}>
            <CirclePlus />
            {rows.length === 2 ? "Add equation" : "Return to 2 equations"}
          </button>
          <article className="mat357-graph">
            <header>
              <b>2</b>
              <strong>2D view (line intersection)</strong>
              <p>
                Each equation is a line. Their intersection is the solution.
              </p>
            </header>
            <svg
              viewBox="0 0 250 205"
              role="img"
              aria-label="Computed graph of the two equations"
            >
              <defs>
                <pattern
                  id="grid357"
                  width="26"
                  height="19"
                  patternUnits="userSpaceOnUse"
                >
                  <path
                    d="M 26 0 L 0 0 0 19"
                    fill="none"
                    stroke="#e8edf5"
                    strokeWidth="1"
                  />
                </pattern>
              </defs>
              <rect
                x="18"
                y="4"
                width="220"
                height="185"
                fill="url(#grid357)"
              />
              <path d="M18 99H238M44 4V189" stroke="#8290a4" />
              <polyline
                points={linePoints(rows[0])}
                fill="none"
                stroke="#2e62f2"
                strokeWidth="2"
              />
              <polyline
                points={linePoints(rows[1])}
                fill="none"
                stroke="#7635e9"
                strokeWidth="2"
              />
              {analysis.solution && (
                <>
                  <circle
                    cx={44 + analysis.solution[0] * 26}
                    cy={99 - analysis.solution[1] * 19}
                    r="4"
                    fill="#0c1939"
                  />
                  <text
                    x={52 + analysis.solution[0] * 26}
                    y={91 - analysis.solution[1] * 19}
                  >
                    ({analysis.solution.join(", ")})
                  </text>
                </>
              )}
              <text x="231" y="94">
                x
              </text>
              <text x="48" y="12">
                y
              </text>
            </svg>
            <footer>
              <span>{equation(rows[0])}</span>
              <span>{equation(rows[1])}</span>
            </footer>
          </article>
        </div>

        <div className="mat357-model">
          <header>
            <span>
              Coefficients
              <br />
              <b>A</b>
            </span>
            <span>
              Variable vector
              <br />
              <b>x</b>
            </span>
            <span>
              Constants
              <br />
              <b>b</b>
            </span>
            <span>
              Augmented matrix
              <br />
              <b>[A | b]</b>
            </span>
          </header>
          <div className="mat357-flow">
            <Matrix
              values={rows.map(([a, b]) =>
                extraVariable ? [a, b, 0] : [a, b],
              )}
              selected={selected}
            />
            <i>·</i>
            <Matrix
              values={extraVariable ? [["x"], ["y"], ["z"]] : [["x"], ["y"]]}
            />
            <i>=</i>
            <Matrix values={rows.map((row) => [row[2]])} selected={selected} />
            <ArrowRight />
            <Matrix
              values={rows.map(([a, b, constant]) =>
                extraVariable ? [a, b, 0, constant] : [a, b, constant],
              )}
              selected={selected}
              augmented
            />
          </div>
          <div className="mat357-sizes">
            <span>
              {rows.length} × {extraVariable ? 3 : 2}
            </span>
            <span>{extraVariable ? 3 : 2} × 1</span>
            <span>{rows.length} × 1</span>
            <span>
              {rows.length} × {extraVariable ? 4 : 3}
            </span>
          </div>
          <p className="mat357-sync">
            <Info /> Edit any value on the left to see it update everywhere.
          </p>
          <aside className={`mat357-status ${modelAnalysis.status}`}>
            <h3>System status</h3>
            <div>
              <CheckCircle2 />
              <strong>{statusCopy[0]}</strong>
              <p>{statusCopy[1]}</p>
              {modelAnalysis.solution && (
                <b>
                  x = {modelAnalysis.solution[0]}, y ={" "}
                  {modelAnalysis.solution[1]}
                </b>
              )}
            </div>
            <button onClick={() => act(() => setDetails((value) => !value))}>
              {details ? "Hide details" : "Show details"}
            </button>
            {details && (
              <output>
                {extraVariable
                  ? "rank(A) = 2 < 3 variables; z is free."
                  : `det(A) = ${analysis.determinant}. ${analysis.determinant !== 0 ? "A is invertible." : "A is singular."}`}
              </output>
            )}
          </aside>
        </div>
      </section>

      <section className="mat357-lower">
        <article className="mat357-example">
          <h2>Worked example</h2>
          <p>Build the augmented matrix for the system.</p>
          <div>
            <strong>
              2x + y = 5<br />x - y = 1
            </strong>
            <ArrowRight />
            <Matrix values={defaults} augmented />
          </div>
          <ol>
            <li>
              Coefficient matrix <i>A</i> from x and y coefficients.
            </li>
            <li>
              Constants column <i>b</i> from the right-hand side.
            </li>
            <li>
              Augment <i>A</i> with <i>b</i> to get [A | b].
            </li>
          </ol>
        </article>
        <article className="mat357-challenge">
          <h2>Challenge: Build the augmented matrix</h2>
          <p>Fill in the missing entries.</p>
          <div>
            <strong>
              2x + y = 5<br />x - y = 1
            </strong>
            <ArrowRight />
            <span className="mat357-answer">
              {challenge.map((value, index) => (
                <input
                  key={index}
                  aria-label={`Challenge entry ${index + 1}`}
                  type="number"
                  value={value}
                  onChange={(event) =>
                    act(() => {
                      setChallenge((current) =>
                        current.map((item, i) =>
                          i === index ? event.target.value : item,
                        ),
                      );
                      setResult("");
                    })
                  }
                />
              ))}
            </span>
          </div>
          <button
            className="mat357-hint"
            onClick={() => act(() => setHint((value) => !value))}
          >
            <Lightbulb /> Hint
          </button>
          {hint && (
            <small>
              First two columns are coefficients of x and y. The last column is
              constants.
            </small>
          )}
          <button className="mat357-check" onClick={check}>
            Check matrix
          </button>
          {result && (
            <output className={result}>
              {result === "correct"
                ? "Correct - [A | b] is complete."
                : "Check each row against its equation."}
            </output>
          )}
        </article>
      </section>

      <section className="mat357-tools">
        <h2>More tools</h2>
        {[
          [
            "+",
            "Add variable",
            "Increase n and explore larger systems",
            () => setExtraVariable((value) => !value),
          ],
          [
            "↔",
            "Row operations",
            "Apply elementary row operations",
            () => setActiveTab("Practice"),
          ],
          [
            "x*",
            "RREF solver",
            "Solve with Gauss-Jordan elimination",
            () => setDetails(true),
          ],
          [
            "|A|",
            "Determinant",
            "Compute det(A) to check invertibility",
            () => setDetails(true),
          ],
        ].map(([icon, title, copy, fn]) => (
          <button key={String(title)} onClick={() => act(fn as () => void)}>
            <b>{String(icon)}</b>
            <span>
              <strong>{String(title)}</strong>
              <small>{String(copy)}</small>
            </span>
          </button>
        ))}
      </section>
    </section>
  );
}

function Matrix({
  values,
  selected = -1,
  augmented = false,
}: {
  values: (number | string)[][];
  selected?: number;
  augmented?: boolean;
}) {
  return (
    <span className={`mat357-matrix ${augmented ? "augmented" : ""}`}>
      {values.map((row, rowIndex) => (
        <span
          className={selected === rowIndex ? "selected" : ""}
          key={rowIndex}
        >
          {row.map((value, column) => (
            <b key={column}>{value}</b>
          ))}
        </span>
      ))}
    </span>
  );
}
