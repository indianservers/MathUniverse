import { Lightbulb, RotateCcw, Share2 } from "lucide-react";
import { useEffect, useState } from "react";
import type { LessonAdapterProps } from "../../types";
import "./RrefTargetLesson356.css";
type Matrix = number[][];
type Step = { label: string; matrix: Matrix };
const initial: Matrix = [
    [2, 1, -2, 3],
    [4, -1, 2, 6],
    [-2, 3, 0, 0],
  ],
  tabs = [
    "Learn & Explore",
    "Row Operations",
    "Examples",
    "Challenges",
    "Interpretation",
    "Know More",
  ],
  clean = (n: number) => (Math.abs(n) < 1e-10 ? 0 : Number(n.toFixed(4))),
  copy = (m: Matrix) => m.map((r) => [...r]);
function rrefSteps(source: Matrix) {
  const a = copy(source);
  let lead = 0;
  const steps: Step[] = [{ label: "Start: Original matrix", matrix: copy(a) }],
    pivots: number[] = [];
  for (let row = 0; row < a.length && lead < a[0].length - 1; row++) {
    let pivot = row;
    while (pivot < a.length && Math.abs(a[pivot][lead]) < 1e-10) pivot++;
    if (pivot === a.length) {
      lead++;
      row--;
      continue;
    }
    if (pivot !== row) {
      [a[pivot], a[row]] = [a[row], a[pivot]];
      steps.push({ label: `R${row + 1} <-> R${pivot + 1}`, matrix: copy(a) });
    }
    const divisor = a[row][lead];
    if (Math.abs(divisor - 1) > 1e-10) {
      a[row] = a[row].map((v) => clean(v / divisor));
      steps.push({
        label: `R${row + 1} <- R${row + 1} / ${clean(divisor)}`,
        matrix: copy(a),
      });
    }
    for (let r = 0; r < a.length; r++) {
      if (r === row) continue;
      const factor = a[r][lead];
      if (Math.abs(factor) < 1e-10) continue;
      a[r] = a[r].map((v, c) => clean(v - factor * a[row][c]));
      steps.push({
        label: `R${r + 1} <- R${r + 1} - ${clean(factor)}R${row + 1}`,
        matrix: copy(a),
      });
    }
    pivots.push(lead);
    lead++;
  }
  return { steps, pivots, rref: a };
}
const calculation = rrefSteps(initial);
const hasLeadingOnes = (m: Matrix, p: number[]) =>
    p.every((c, r) => m[r][c] === 1),
  zeros = (m: Matrix, p: number[]) =>
    p.every((c, r) => m.every((row, i) => i === r || row[c] === 0));
export default function RrefTargetLesson356({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [activeStep, setActiveStep] = useState(calculation.steps.length - 1),
    [pivotChoice, setPivotChoice] = useState<[number, number] | null>(null),
    [challenge, setChallenge] = useState<"" | "correct" | "incorrect">(""),
    [hint, setHint] = useState(false),
    [tab, setTab] = useState(tabs[0]),
    [actions, setActions] = useState(0),
    final = calculation.rref,
    pivots = calculation.pivots,
    rank = pivots.length,
    nullity = 3 - rank,
    leading = hasLeadingOnes(final, pivots),
    clearColumns = zeros(final, pivots),
    ordered = pivots.every((v, i) => !i || pivots[i - 1] < v),
    free = [0, 1, 2].filter((c) => !pivots.includes(c)),
    all = leading && clearColumns && ordered,
    current = calculation.steps[activeStep].matrix,
    firstPivot =
      calculation.steps[Math.min(3, calculation.steps.length - 1)].matrix;
  const act = (fn: () => void) => {
      fn();
      setActions((v) => v + 1);
      onInteraction();
    },
    reset = () => {
      setActiveStep(calculation.steps.length - 1);
      setPivotChoice(null);
      setChallenge("");
      setHint(false);
      setTab(tabs[0]);
      setActions(0);
    };
  useEffect(reset, [resetToken]);
  const solution = rank === 3 ? final.map((row) => row[3]) : [];
  return (
    <section
      className="mat356-page"
      data-testid="matrix-mockup-0541"
      data-object-model="real-gauss-jordan-rref-operation-state-sequence-clickable-steps-pivot-detection-rank-nullity-condition-check-unique-or-parametric-solution-next-pivot-challenge"
      data-rref={JSON.stringify(final)}
      data-step={activeStep}
      data-steps={calculation.steps.length}
      data-current={JSON.stringify(current)}
      data-pivots={pivots.join(",")}
      data-rank={rank}
      data-nullity={nullity}
      data-leading={leading}
      data-clear-columns={clearColumns}
      data-ordered={ordered}
      data-all={all}
      data-pivot-choice={pivotChoice?.join(",") ?? "none"}
      data-challenge={challenge}
      data-tab={tab}
      data-actions={actions}
    >
      <header className="mat356-hero">
        <div>
          <span>
            <b>ADVANCED MATHEMATICS</b>
            <b>MATRICES AND LINEAR ALGEBRA</b>
          </span>
          <h1>Reduced Row Echelon Form (RREF)</h1>
          <p>Every pivot stands alone</p>
          <section>
            <b>Advanced</b>
            <b>Linear Algebra Lab</b>
            <b>Matrix Commands / CAS</b>
            <b>12-18 min</b>
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
            <button>Workspace</button>
          </nav>
        </div>
        <aside>
          {[
            "Leading 1s",
            "Zeros above pivots",
            "Zeros below pivots",
            "Pivot columns in order",
            free.length ? "All non-pivot columns free" : "No free columns",
          ].map((v) => (
            <p key={v}>✓ {v}</p>
          ))}
          <strong>RREF check: All conditions met ✓</strong>
        </aside>
      </header>
      <nav className="mat356-tabs">
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
      <section className="mat356-setup">
        <header>
          <b>PROBLEM SETUP</b>
          <h2>Augmented matrix (3 x 4)</h2>
        </header>
        <div>
          <MatrixBox title="Initial matrix" matrix={initial} />
          <b>→</b>
          <MatrixBox title="Current step" matrix={current} />
          <b>→</b>
          <MatrixBox title="RREF (GOAL)" matrix={final} goal />
        </div>
        <footer>
          <i />
          Pivot candidates <i />
          Staircase pattern <i />
          Pivot columns <i />
          Free variables
        </footer>
      </section>
      <section className="mat356-body">
        <article className="mat356-steps">
          <h3>STEP-BY-STEP SOLUTION</h3>
          {calculation.steps.map((item, index) => (
            <button
              className={activeStep === index ? "active" : ""}
              key={`${item.label}-${index}`}
              onClick={() => act(() => setActiveStep(index))}
            >
              <b>{index}</b>
              <span>{item.label}</span>
              <MatrixInline matrix={item.matrix} />
            </button>
          ))}
          <footer>
            ✓ RREF achieved! <MatrixInline matrix={final} />
          </footer>
        </article>
        <aside>
          <article>
            <h3>LIVE RREF CHECK</h3>
            <dl>
              <dt>Leading 1s</dt>
              <dd>{leading ? "✓ Yes" : "No"}</dd>
              <dt>Zeros above pivots</dt>
              <dd>{clearColumns ? "✓ Yes" : "No"}</dd>
              <dt>Zeros below pivots</dt>
              <dd>{clearColumns ? "✓ Yes" : "No"}</dd>
              <dt>Pivot columns in order</dt>
              <dd>
                {ordered
                  ? `✓ Yes (${pivots.map((v) => v + 1).join(", ")})`
                  : "No"}
              </dd>
              <dt>All non-pivot columns free</dt>
              <dd>
                {free.length
                  ? `✓ Yes (${free.map((v) => v + 1).join(", ")})`
                  : "None"}
              </dd>
            </dl>
            <strong>RREF check: All conditions met ✓</strong>
          </article>
          <article>
            <h3>PIVOT & FREE VARIABLE INFO</h3>
            <p>Pivot columns</p>
            <div>
              {pivots.map((v) => (
                <b key={v}>{v + 1}</b>
              ))}
            </div>
            <p>
              Free variables:{" "}
              {free.length ? free.map((v) => `x${v + 1}`).join(", ") : "none"}
            </p>
            <code>
              Rank = {rank} &nbsp; Nullity = {nullity}
            </code>
          </article>
          <article className="mat356-interpret">
            <h3>SOLUTION INTERPRETATION</h3>
            {rank === 3 ? (
              <>
                <p>
                  The coefficient matrix has a pivot in every variable column.
                </p>
                <code>
                  x1 = {solution[0]}
                  <br />
                  x2 = {solution[1]}
                  <br />
                  x3 = {solution[2]}
                </code>
                <strong>Unique solution</strong>
              </>
            ) : (
              <p>Free variables generate a parametric solution family.</p>
            )}
          </article>
        </aside>
      </section>
      <section className="mat356-challenge">
        <div>
          <h3>CHALLENGE</h3>
          <h2>Complete the next pivot</h2>
          <p>
            Choose the next pivot from the current matrix and continue the pivot
            process.
          </p>
        </div>
        <MatrixBox title="Current matrix" matrix={firstPivot} />
        <article>
          <h3>Choose the next pivot</h3>
          <p>Click a pivot candidate cell.</p>
          <div>
            {firstPivot.map((row, r) =>
              row.slice(0, 3).map((v, c) => (
                <button
                  className={
                    pivotChoice?.[0] === r && pivotChoice[1] === c
                      ? "active"
                      : c === 1 && r > 0
                        ? "candidate"
                        : ""
                  }
                  key={`${r}-${c}`}
                  onClick={() =>
                    act(() => {
                      setPivotChoice([r, c]);
                      setChallenge("");
                    })
                  }
                >
                  {v}
                </button>
              )),
            )}
          </div>
        </article>
        <aside>
          <button
            onClick={() =>
              act(() =>
                setChallenge(
                  pivotChoice?.[0] === 1 && pivotChoice[1] === 1
                    ? "correct"
                    : "incorrect",
                ),
              )
            }
          >
            Check RREF
          </button>
          <button onClick={() => act(() => setHint((v) => !v))}>
            <Lightbulb />
            Hint
          </button>
          <output>
            {challenge === "correct"
              ? "Correct: row 2, column 2 is the next pivot position."
              : challenge === "incorrect"
                ? "Choose the first available nonzero entry in column 2."
                : hint
                  ? "After clearing column 1, move to row 2 and column 2."
                  : ""}
          </output>
        </aside>
      </section>
    </section>
  );
}
function MatrixBox({
  title,
  matrix,
  goal = false,
}: {
  title: string;
  matrix: Matrix;
  goal?: boolean;
}) {
  return (
    <article className={goal ? "goal" : ""}>
      <h3>{title}</h3>
      <MatrixInline matrix={matrix} />
    </article>
  );
}
function MatrixInline({ matrix }: { matrix: Matrix }) {
  return (
    <code className="mat356-matrix">
      [
      {matrix
        .map((row) => row.map((v, c) => (c === 3 ? `| ${v}` : v)).join(" "))
        .join(" ; ")}
      ]
    </code>
  );
}
