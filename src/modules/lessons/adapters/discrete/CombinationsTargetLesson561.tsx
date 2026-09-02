import { CheckCircle2, Lightbulb, Trash2, XCircle } from "lucide-react";
import { useEffect, useState } from "react";
import type { LessonAdapterProps } from "../../types";
import "../geometry3d/CoordinateSystemTargetLesson378.css";
import "./CombinationsTargetLesson561.css";

const colors = [
  "#d9efff",
  "#dff4df",
  "#fff0cf",
  "#e7dcff",
  "#ffd9e8",
  "#d8f5f0",
  "#ffe3c4",
  "#e0e7ff",
];
const factorial = (n: number) =>
  Array.from({ length: n }, (_, i) => i + 1).reduce((a, b) => a * b, 1);
const nPr = (n: number, r: number) => factorial(n) / factorial(n - r);
const nCr = (n: number, r: number) => nPr(n, r) / factorial(r);
const objects = (n: number) =>
  Array.from({ length: n }, (_, i) => String.fromCharCode(65 + i));

export default function CombinationsTargetLesson561({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [n, setNState] = useState(5),
    [r, setRState] = useState(2),
    [selected, setSelected] = useState(["B", "D"]),
    [tab, setTab] = useState("Interact"),
    [challengeN, setChallengeN] = useState(7),
    [challengeR, setChallengeR] = useState(3),
    [answer, setAnswer] = useState("35"),
    [graded, setGraded] = useState(true),
    [hint, setHint] = useState(false),
    [actions, setActions] = useState(0);
  const permutations = nPr(n, r),
    combinations = nCr(n, r),
    challengeTotal = nCr(challengeN, challengeR),
    correct = graded && Number(answer) === challengeTotal;
  const act = (fn: () => void) => {
    fn();
    setActions((v) => v + 1);
    onInteraction();
  };
  const reset = () => {
    setNState(5);
    setRState(2);
    setSelected(["B", "D"]);
    setTab("Interact");
    setChallengeN(7);
    setChallengeR(3);
    setAnswer("35");
    setGraded(true);
    setHint(false);
    setActions(0);
  };
  useEffect(reset, [resetToken]);
  const setN = (value: number) =>
    act(() => {
      const next = Math.max(2, Math.min(8, value)),
        nextR = Math.min(r, next);
      setNState(next);
      setRState(nextR);
      setSelected([]);
    });
  const setR = (value: number) =>
    act(() => {
      const next = Math.max(1, Math.min(n, value));
      setRState(next);
      setSelected([]);
    });
  const toggle = (item: string) =>
    act(() =>
      setSelected((old) =>
        old.includes(item)
          ? old.filter((v) => v !== item)
          : old.length < r
            ? [...old, item]
            : old,
      ),
    );
  const updateChallenge = (nextN: number, nextR: number) => {
    const safeN = Math.max(1, Math.min(12, nextN)),
      safeR = Math.max(0, Math.min(safeN, nextR));
    setChallengeN(safeN);
    setChallengeR(safeR);
    setGraded(false);
  };
  return (
    <section
      className="cs378-page comb561-page"
      data-testid="discrete-mockup-0618"
      data-object-model="dedicated-unordered-selection-basket-combination-permutation-relation-graded-committee-challenge"
      data-direct-interaction="true"
      data-n={n}
      data-r={r}
      data-permutations={permutations}
      data-combinations={combinations}
      data-selected={[...selected].sort().join("")}
      data-full={selected.length === r}
      data-challenge-total={challengeTotal}
      data-graded={graded}
      data-correct={correct}
      data-actions={actions}
    >
      <header className="comb561-hero">
        <div>
          <small>DISCRETE AND APPLIED MATHEMATICS</small>
          <h1>Combinations (nCr)</h1>
          <p>
            <b>Objective:</b> Choose r objects from n objects without order and
            derive <sup>n</sup>Cr = <sup>n</sup>Pr / r!.
          </p>
        </div>
        <aside>
          <span>
            Level<b>Intermediate-Advanced</b>
          </span>
          <span>
            Topic<b>Counting Principle</b>
          </span>
          <span>
            Estimated time<b>6-10 min</b>
          </span>
          <span>
            Skills<b>Combinatorics, Factorials</b>
          </span>
        </aside>
      </header>
      <nav className="comb561-tabs">
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
      <div className="comb561-layout">
        <main>
          <section className="comb561-observe">
            <h2>1. Observe the selection basket</h2>
            <div className="comb561-workspace">
              <aside>
                <section>
                  <h3>
                    <i>1</i> Set the pool (n)
                  </h3>
                  <label>
                    <em>n</em>
                    <button
                      aria-label="Decrease pool"
                      onClick={() => setN(n - 1)}
                    >
                      -
                    </button>
                    <output>{n}</output>
                    <button
                      aria-label="Increase pool"
                      onClick={() => setN(n + 1)}
                    >
                      +
                    </button>
                  </label>
                  <small>Objects</small>
                  <div className="comb561-objects">
                    {objects(n).map((item, index) => (
                      <button
                        key={item}
                        className={selected.includes(item) ? "selected" : ""}
                        onClick={() => toggle(item)}
                        style={{ background: colors[index] }}
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </section>
                <section>
                  <h3>
                    <i>2</i> Choose how many (r)
                  </h3>
                  <label>
                    <em>r</em>
                    <button
                      aria-label="Decrease selection size"
                      onClick={() => setR(r - 1)}
                    >
                      -
                    </button>
                    <output>{r}</output>
                    <button
                      aria-label="Increase selection size"
                      onClick={() => setR(r + 1)}
                    >
                      +
                    </button>
                  </label>
                </section>
                <section>
                  <h3>
                    <i>3</i> Build a selection
                  </h3>
                  <p>Click any objects to add</p>
                  <div className="comb561-mini-basket">
                    {selected.length
                      ? selected.map((item) => (
                          <button key={item} onClick={() => toggle(item)}>
                            {item}
                          </button>
                        ))
                      : "Your basket is empty"}
                  </div>
                  <button onClick={() => act(() => setSelected([]))}>
                    <Trash2 /> Clear basket
                  </button>
                </section>
              </aside>
              <main>
                <h3>Select r objects from n objects (order does not matter)</h3>
                <p>
                  Click objects to add/remove. The basket shows one unordered
                  selection.
                </p>
                <div className="comb561-pool">
                  {objects(n).map((item, index) => (
                    <button
                      key={item}
                      onClick={() => toggle(item)}
                      style={{ background: colors[index] }}
                    >
                      {item}
                    </button>
                  ))}
                </div>
                <hr />
                <b>Your basket (r = {r})</b>
                <div className="comb561-basket">
                  {selected.map((item) => (
                    <button
                      key={item}
                      onClick={() => toggle(item)}
                      style={{ background: colors[objects(n).indexOf(item)] }}
                    >
                      {item}
                    </button>
                  ))}
                </div>
                <article>
                  <b>Compare reordered selections</b>
                  <p>All reorderings collapse into the same combination.</p>
                  <div>
                    <span>({selected.join(", ") || "—"})</span>
                    <span>({[...selected].reverse().join(", ") || "—"})</span>→
                    <strong>{`{${[...selected].sort().join(", ")}}`}</strong>
                    <em>Same combination</em>
                  </div>
                </article>
                <footer>
                  <span>
                    Total combinations<strong>{combinations}</strong>C({n},{r})
                  </span>
                  <span>
                    Total permutations<strong>{permutations}</strong>P({n},{r})
                  </span>
                  <span>
                    r! (orderings)<strong>{factorial(r)}</strong>
                    {r}!
                  </span>
                  <span>
                    Relation
                    <strong>
                      C({n},{r}) = P({n},{r})/{r}!
                    </strong>
                  </span>
                </footer>
              </main>
            </div>
          </section>
          <section className="comb561-challenge">
            <h2>5. Try independently</h2>
            <header>
              <b>Challenge:</b> If {challengeN} students are to be chosen for a
              committee of {challengeR}, how many different committees are
              possible?
              <button onClick={() => act(() => setHint((v) => !v))}>
                <Lightbulb /> Hint
              </button>
            </header>
            <div>
              <label>
                n =
                <input
                  aria-label="Challenge n"
                  type="number"
                  value={challengeN}
                  onChange={(e) =>
                    act(() =>
                      updateChallenge(Number(e.target.value), challengeR),
                    )
                  }
                />
              </label>
              <label>
                r =
                <input
                  aria-label="Challenge r"
                  type="number"
                  value={challengeR}
                  onChange={(e) =>
                    act(() =>
                      updateChallenge(challengeN, Number(e.target.value)),
                    )
                  }
                />
              </label>
              <button onClick={() => act(() => setGraded(true))}>
                Check Answer
              </button>
              <section>
                <label>
                  Your answer
                  <input
                    aria-label="Combination challenge answer"
                    type="number"
                    value={answer}
                    onChange={(e) =>
                      act(() => {
                        setAnswer(e.target.value);
                        setGraded(false);
                      })
                    }
                  />
                </label>
                {graded && (
                  <strong className={correct ? "correct" : "wrong"}>
                    {correct ? (
                      <>
                        <CheckCircle2 /> Correct!
                      </>
                    ) : (
                      <>
                        <XCircle /> Use n!/(r!(n-r)!).
                      </>
                    )}
                  </strong>
                )}
                <output>
                  C({challengeN},{challengeR}) = {challengeTotal}
                </output>
                {hint && (
                  <p>
                    Order does not matter, so divide permutations by{" "}
                    {challengeR}!.
                  </p>
                )}
              </section>
            </div>
          </section>
          <section className="comb561-example">
            <h2>Worked Example</h2>
            <p>How many 3-subject committees can be formed from 6 subjects?</p>
            <p>
              <b>Solution</b> (n = 6, r = 3):
            </p>
            <output>
              <sup>6</sup>C<sub>3</sub> = 6!/(3!3!) = 20
            </output>
            <strong>
              <CheckCircle2 /> There are 20 different committees.
            </strong>
          </section>
        </main>
        <aside className="comb561-side">
          <article>
            <h2>2. Notice the pattern</h2>
            <table>
              <tbody>
                <tr>
                  <th>n</th>
                  <th>r</th>
                  <th>nPr</th>
                  <th>r!</th>
                  <th>nCr</th>
                </tr>
                {[1, 2, 3, 4].map((value) => (
                  <tr key={value} className={value === r ? "active" : ""}>
                    <td>{n}</td>
                    <td>{value}</td>
                    <td>{nPr(n, value)}</td>
                    <td>{factorial(value)}</td>
                    <td>{nCr(n, value)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p>For fixed n, nCr = nC(n-r). Values are symmetric.</p>
          </article>
          <article>
            <h2>3. Understand the rule</h2>
            <aside>
              <b>Key idea</b>
              <p>
                Count ordered selections, then remove the effect of order by
                dividing by r!.
              </p>
            </aside>
            <div>
              <b>Watch out!</b>
              <p>Dividing by r only is incorrect.</p>
              <p>
                Correct: <sup>5</sup>P₂ / 2! = 10
              </p>
            </div>
          </article>
          <article>
            <h2>4. Key rule</h2>
            <aside>
              <b>Definition</b>
              <p>
                The number of combinations of n objects taken r at a time,
                without order, is
              </p>
              <output>
                <sup>n</sup>Cr = nPr/r! = n!/[r!(n-r)!]
              </output>
              <p>Valid for 0 ≤ r ≤ n.</p>
            </aside>
          </article>
        </aside>
      </div>
      <nav className="comb561-adjacent">
        <button>
          Previous
          <br />
          <b>Circular Permutations</b>
        </button>
        <button>
          Next
          <br />
          <b>Pascal's Triangle</b>
        </button>
      </nav>
    </section>
  );
}
