import { Check, Lightbulb } from "lucide-react";
import { useEffect, useState } from "react";
import type { LessonAdapterProps } from "../../types";
import "../geometry3d/CoordinateSystemTargetLesson378.css";
import "./PascalTriangleTargetLesson562.css";

const factorial = (n: number) =>
  Array.from({ length: n }, (_, i) => i + 1).reduce((a, b) => a * b, 1);
const choose = (n: number, r: number) =>
  r < 0 || r > n ? 0 : factorial(n) / (factorial(r) * factorial(n - r));
const row = (n: number) =>
  Array.from({ length: n + 1 }, (_, r) => choose(n, r));

export default function PascalTriangleTargetLesson562({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [rows, setRows] = useState(7),
    [selected, setSelected] = useState<[number, number]>([4, 2]),
    [showParents, setShowParents] = useState(true),
    [showSums, setShowSums] = useState(true),
    [showLabels, setShowLabels] = useState(true),
    [jumpN, setJumpN] = useState(4),
    [jumpR, setJumpR] = useState(2),
    [tab, setTab] = useState("Interact"),
    [answers, setAnswers] = useState(["21", "15", "56"]),
    [hint, setHint] = useState(false),
    [actions, setActions] = useState(0);
  const [sn, sr] = selected,
    value = choose(sn, sr),
    parents = [choose(sn - 1, sr - 1), choose(sn - 1, sr)],
    questions: [[number, number], [number, number], [number, number]] = [
      [7, 2],
      [6, 4],
      [8, 3],
    ],
    correct = questions.map(([n, r], i) => Number(answers[i]) === choose(n, r));
  const act = (fn: () => void) => {
    fn();
    setActions((v) => v + 1);
    onInteraction();
  };
  const reset = () => {
    setRows(7);
    setSelected([4, 2]);
    setShowParents(true);
    setShowSums(true);
    setShowLabels(true);
    setJumpN(4);
    setJumpR(2);
    setTab("Interact");
    setAnswers(["21", "15", "56"]);
    setHint(false);
    setActions(0);
  };
  useEffect(reset, [resetToken]);
  const select = (n: number, r: number) =>
    act(() => {
      setSelected([n, r]);
      setJumpN(n);
      setJumpR(r);
    });
  const setRowCount = (next: number) =>
    act(() => {
      const safe = Math.max(3, Math.min(10, next));
      setRows(safe);
      if (sn > safe) setSelected([safe, Math.min(sr, safe)]);
    });
  return (
    <section
      className="cs378-page pas562-page"
      data-testid="discrete-mockup-0619"
      data-object-model="dedicated-binomial-coefficient-selectable-pascal-triangle-parent-sum-overlays-graded-practice"
      data-direct-interaction="true"
      data-rows={rows}
      data-selected={`${sn},${sr}`}
      data-value={value}
      data-parents={parents.join(",")}
      data-show-parents={showParents}
      data-show-sums={showSums}
      data-show-labels={showLabels}
      data-correct={correct.filter(Boolean).length}
      data-actions={actions}
    >
      <header className="pas562-hero">
        <div>
          <small>DISCRETE AND APPLIED MATHEMATICS</small>
          <small>COMBINATORICS, GRAPH THEORY AND LOGIC</small>
          <h1>Pascal's Triangle</h1>
          <p>
            Explore binomial coefficients in Pascal's Triangle and discover the
            pattern that powers the Binomial Theorem.
          </p>
        </div>
        <aside>
          <span>Level: Intermediate-Advanced</span>
          <span>Type: Discrete Math Lab</span>
          <span>Estimated time: 6-10 min</span>
          <span>Tags: Combinations, Binomial Coefficients</span>
        </aside>
      </header>
      <nav className="pas562-tabs">
        {["Interact", "Learn", "Worked Example", "Formula", "Practice"].map(
          (name) => (
            <button
              key={name}
              className={tab === name ? "active" : ""}
              onClick={() => act(() => setTab(name))}
            >
              {name}
            </button>
          ),
        )}
      </nav>
      <section className="pas562-observe">
        <h2>1. Observe &amp; Manipulate</h2>
        <p>Click a number to see its parents, row sum, and meaning.</p>
        <div className="pas562-main">
          <main>
            <header>
              <label>
                <b>Expand rows (n)</b>
                <input
                  aria-label="Rows shown"
                  type="range"
                  min="3"
                  max="10"
                  value={rows}
                  onChange={(e) => setRowCount(Number(e.target.value))}
                />
                <output>{rows}</output>
              </label>
            </header>
            <div className="pas562-triangle">
              {Array.from({ length: rows + 1 }, (_, n) => (
                <div key={n}>
                  {showLabels && <b>n = {n}</b>}
                  <section>
                    {row(n).map((entry, r) => (
                      <button
                        key={r}
                        className={
                          sn === n && sr === r
                            ? "selected"
                            : showParents &&
                                sn - 1 === n &&
                                (sr === r || sr - 1 === r)
                              ? "parent"
                              : ""
                        }
                        onClick={() => select(n, r)}
                      >
                        {entry}
                      </button>
                    ))}
                  </section>
                </div>
              ))}
            </div>
            {showSums && (
              <div className="pas562-sums">
                <b>Row sums</b>
                {Array.from({ length: rows + 1 }, (_, n) => (
                  <span key={n}>{2 ** n}</span>
                ))}
              </div>
            )}
          </main>
          <aside>
            <h3>Selected entry</h3>
            <div>
              <label>
                Row n:<output>{sn}</output>
              </label>
              <label>
                Index r:<output>{sr}</output>
              </label>
            </div>
            <hr />
            <b>Value</b>
            <strong>{value}</strong>
            <hr />
            <b>Parents</b>
            <output>
              {sn > 0
                ? `${parents[0]} + ${parents[1]} = ${value}`
                : "Edge value = 1"}
            </output>
            <hr />
            <b>Meaning</b>
            <p>
              C({sn}, {sr}) = {value}
            </p>
            <p>
              Number of ways to choose {sr} from {sn}.
            </p>
            <hr />
            <b>Row n sum</b>
            <p>
              {2 ** sn} = 2<sup>{sn}</sup>
            </p>
          </aside>
        </div>
        <footer>
          <section>
            <b>Jump to (n, r)</b>
            <select
              aria-label="Jump row"
              value={jumpN}
              onChange={(e) => setJumpN(Number(e.target.value))}
            >
              {Array.from({ length: rows + 1 }, (_, i) => (
                <option key={i}>{i}</option>
              ))}
            </select>
            <select
              aria-label="Jump index"
              value={jumpR}
              onChange={(e) => setJumpR(Number(e.target.value))}
            >
              {Array.from({ length: jumpN + 1 }, (_, i) => (
                <option key={i}>{i}</option>
              ))}
            </select>
            <button onClick={() => select(jumpN, Math.min(jumpR, jumpN))}>
              Go
            </button>
          </section>
          <section>
            <b>View options</b>
            <label>
              <input
                type="checkbox"
                checked={showParents}
                onChange={() => act(() => setShowParents((v) => !v))}
              />
              Show parents
            </label>
            <label>
              <input
                type="checkbox"
                checked={showSums}
                onChange={() => act(() => setShowSums((v) => !v))}
              />
              Show row sums
            </label>
            <label>
              <input
                type="checkbox"
                checked={showLabels}
                onChange={() => act(() => setShowLabels((v) => !v))}
              />
              Show n, r labels
            </label>
          </section>
          <section>
            <b>Expand row</b>
            <button onClick={() => setRowCount(rows - 1)}>-</button>
            <output>{rows}</output>
            <button onClick={() => setRowCount(rows + 1)}>+</button>
          </section>
        </footer>
      </section>
      <section className="pas562-pattern">
        <h2>2. Notice the Pattern</h2>
        <div>
          <article>
            <b>Edges are 1</b>
            <p>Every entry on the edges of Pascal's Triangle is 1.</p>
            <pre>
              {" "}
              1{`\n`} 1 1{`\n`} 1 1{`\n`} 1 1
            </pre>
          </article>
          <article>
            <b>Symmetry</b>
            <p>Entries are symmetric about the center of each row.</p>
            <div className="pas562-symmetry">
              ◻<br />◻ ◻<br />◻ ◻ ◻
            </div>
          </article>
          <article>
            <b>Row sums</b>
            <p>Sum of the entries in row n is 2ⁿ.</p>
            <p>Row 5: 1 + 5 + 10 + 10 + 5 + 1 = 32 = 2⁵</p>
          </article>
        </div>
      </section>
      <section className="pas562-rules">
        <article>
          <h2>3. Understand the Rule</h2>
          <aside>
            <b>Pascal's Rule</b>
            <p>For 0 &lt; r &lt; n,</p>
            <output>C(n,r) = C(n-1,r-1) + C(n-1,r)</output>
            <b>Definitions</b>
            <p>C(n,r) is the binomial coefficient “n choose r”.</p>
          </aside>
          <div>
            <b>Common Misconception</b>
            <p>
              Adding vertically is wrong. Each entry comes from the sum of the
              two numbers above it.
            </p>
          </div>
        </article>
        <article>
          <h2>4. Worked Example</h2>
          <p>Find C(6,3) using Pascal's Rule.</p>
          <output>
            C(6,3) = C(5,2) + C(5,3)
            <br />= 10 + 10
            <br />= 20
          </output>
          <strong>
            <Check /> Matches Pascal's Triangle: Row 6, index 3 = 20.
          </strong>
        </article>
      </section>
      <section className="pas562-practice">
        <header>
          <div>
            <h2>5. Try Independently</h2>
            <p>
              <b>Challenge:</b> Click the triangle or use the controls to find
              each value.
            </p>
          </div>
          <button onClick={() => act(() => setHint((v) => !v))}>
            <Lightbulb /> Hint
          </button>
        </header>
        <div>
          {questions.map(([n, r], index) => (
            <article key={n}>
              <b>
                {index + 1}. What is C({n},{r})?
              </b>
              <label>
                Your answer
                <input
                  aria-label={`Pascal answer ${index + 1}`}
                  value={answers[index]}
                  onChange={(e) =>
                    act(() =>
                      setAnswers((old) =>
                        old.map((v, i) => (i === index ? e.target.value : v)),
                      ),
                    )
                  }
                />
                {correct[index] && <Check />}
              </label>
              <button onClick={() => select(n, r)}>Show on Triangle</button>
            </article>
          ))}
        </div>
        {hint && (
          <p>Use the sum of the two parents, or C(n,r)=n!/[r!(n-r)!].</p>
        )}
        <footer>
          <span>Great! Keep exploring more patterns in Pascal's Triangle.</span>
          <b>{correct.filter(Boolean).length} / 3 correct</b>
          <progress value={correct.filter(Boolean).length} max="3" />
        </footer>
      </section>
      <nav className="pas562-adjacent">
        <button>
          Previous
          <br />
          <b>Combinations</b>
        </button>
        <button>
          Next
          <br />
          <b>Inclusion-Exclusion</b>
        </button>
      </nav>
    </section>
  );
}
