import { CheckCircle2, Eye, RotateCcw } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { LessonAdapterProps } from "../../types";
import "../geometry3d/CoordinateSystemTargetLesson378.css";
import "./PigeonholeTargetLesson564.css";

const pigeonAsset = "/assets/lessons/564-pigeonhole-principle/pigeon.png",
  holeAsset = "/assets/lessons/564-pigeonhole-principle/hole.png";
const defaultDistribution = [0, 1, 2, 3, 4, 0, 3];
const distribute = (n: number, k: number) =>
  Array.from({ length: n }, (_, i) => i % k);

export default function PigeonholeTargetLesson564({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [n, setNState] = useState(7),
    [k, setKState] = useState(5),
    [distribution, setDistribution] = useState(defaultDistribution),
    [tab, setTab] = useState("Interact"),
    [challengeN, setChallengeN] = useState(13),
    [challengeK, setChallengeK] = useState(6),
    [answer, setAnswer] = useState(""),
    [graded, setGraded] = useState(false),
    [shown, setShown] = useState(false),
    [actions, setActions] = useState(0);
  const counts = useMemo(
      () =>
        Array.from(
          { length: k },
          (_, hole) => distribution.filter((value) => value === hole).length,
        ),
      [distribution, k],
    ),
    least = Math.min(...counts),
    most = Math.max(...counts),
    guarantee = Math.ceil(n / k),
    holds = most >= guarantee,
    challengeTotal = Math.ceil(challengeN / challengeK),
    correct = graded && Number(answer) === challengeTotal;
  const act = (fn: () => void) => {
    fn();
    setActions((v) => v + 1);
    onInteraction();
  };
  const reset = () => {
    setNState(7);
    setKState(5);
    setDistribution(defaultDistribution);
    setTab("Interact");
    setChallengeN(13);
    setChallengeK(6);
    setAnswer("");
    setGraded(false);
    setShown(false);
    setActions(0);
  };
  useEffect(reset, [resetToken]);
  const setModel = (nextN: number, nextK: number) =>
    act(() => {
      const safeN = Math.max(1, Math.min(20, nextN)),
        safeK = Math.max(1, Math.min(10, nextK));
      setNState(safeN);
      setKState(safeK);
      setDistribution(distribute(safeN, safeK));
    });
  const move = (pigeon: number, hole: number) =>
    act(() =>
      setDistribution((old) =>
        old.map((value, index) => (index === pigeon ? hole : value)),
      ),
    );
  const randomize = () =>
    act(() =>
      setDistribution(
        Array.from({ length: n }, () => Math.floor(Math.random() * k)),
      ),
    );
  const updateChallenge = (nextN: number, nextK: number) =>
    act(() => {
      setChallengeN(Math.max(1, Math.min(20, nextN)));
      setChallengeK(Math.max(1, Math.min(10, nextK)));
      setGraded(false);
      setShown(false);
    });
  return (
    <section
      className="cs378-page pig564-page"
      data-testid="discrete-mockup-0621"
      data-object-model="dedicated-pigeon-to-hole-drag-distribution-ceiling-guarantee-independent-challenge"
      data-direct-interaction="true"
      data-n={n}
      data-k={k}
      data-distribution={distribution.join(",")}
      data-counts={counts.join(",")}
      data-least={least}
      data-most={most}
      data-guarantee={guarantee}
      data-holds={holds}
      data-challenge-total={challengeTotal}
      data-graded={graded}
      data-correct={correct}
      data-actions={actions}
    >
      <header className="pig564-hero">
        <div>
          <small>DISCRETE AND APPLIED MATHEMATICS</small>
          <small>DISCRETE MATH LAB</small>
          <small>INTERMEDIATE-ADVANCED</small>
          <h1>Pigeonhole Principle</h1>
          <p>Understand guaranteed repetition.</p>
        </div>
        <aside>
          <span>6-10 min</span>
          <span>English (English)</span>
          <button>Share</button>
          <section>
            <b>OBJECTIVE</b>
            <p>
              Explore how distributing n objects into k boxes guarantees at
              least one box has ⌈n/k⌉ or more objects.
            </p>
          </section>
        </aside>
      </header>
      <nav className="pig564-tabs">
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
      <section className="pig564-lab">
        <h2>1. OBSERVE &amp; MANIPULATE</h2>
        <p>Drag pigeons into holes. Adjust n and k and see what changes.</p>
        <div>
          <main>
            <header>
              <p>Drag each pigeon into a hole.</p>
              <button onClick={randomize}>Try it!</button>
            </header>
            <div className="pig564-pigeons">
              {Array.from({ length: n }, (_, index) => (
                <button
                  key={index}
                  draggable
                  onDragStart={(e) =>
                    e.dataTransfer.setData("text/plain", String(index))
                  }
                  aria-label={`Pigeon ${index + 1}`}
                >
                  <img src={pigeonAsset} alt="" />
                </button>
              ))}
            </div>
            <b>n = {n} pigeons</b>
            <div className="pig564-holes">
              {counts.map((count, hole) => (
                <div
                  key={hole}
                  data-testid={`pigeon-hole-${hole + 1}`}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) =>
                    move(Number(e.dataTransfer.getData("text/plain")), hole)
                  }
                  className={count === most ? "busy" : ""}
                >
                  <img src={holeAsset} alt="" />
                  <span>
                    {distribution
                      .map((assigned, pigeon) =>
                        assigned === hole ? pigeon : null,
                      )
                      .filter((v) => v !== null)
                      .map((pigeon) => (
                        <img key={pigeon} src={pigeonAsset} alt="" />
                      ))}
                  </span>
                </div>
              ))}
            </div>
            <b>k = {k} holes</b>
            <section className="pig564-distribution">
              <b>Current distribution</b>
              <div>
                {counts.map((count, index) => (
                  <span key={index}>
                    <img src={pigeonAsset} alt="" />
                    {count}
                  </span>
                ))}
              </div>
            </section>
          </main>
          <aside>
            <h3>Instant readout</h3>
            <p>
              Least filled hole<strong>{least}</strong>object
            </p>
            <p>
              Guaranteed minimum
              <strong>
                ⌈{n}/{k}⌉ = {guarantee}
              </strong>
              objects
            </p>
            <section>
              <CheckCircle2 />
              <b>Principle holds!</b>
              <p>
                {most} ≥ ceil({n}/{k}) = {guarantee}? {holds ? "Yes" : "No"}
              </p>
            </section>
            <label>
              n (pigeons)
              <input
                aria-label="Pigeon count"
                type="range"
                min="1"
                max="20"
                value={n}
                onChange={(e) => setModel(Number(e.target.value), k)}
              />
              <output>{n}</output>
            </label>
            <label>
              k (holes)
              <input
                aria-label="Hole count"
                type="range"
                min="1"
                max="10"
                value={k}
                onChange={(e) => setModel(n, Number(e.target.value))}
              />
              <output>{k}</output>
            </label>
            <button onClick={() => act(reset)}>
              <RotateCcw />
              Reset
            </button>
          </aside>
        </div>
        <footer>
          Try different values of n and k. The fullest hole is always ≥
          ceil(n/k).
        </footer>
      </section>
      <section className="pig564-theory">
        <article>
          <h3>2. NOTICE THE PATTERN</h3>
          <table>
            <tbody>
              <tr>
                <th>n</th>
                <th>k</th>
                <th>Distribute</th>
                <th>Least full hole</th>
                <th>ceil(n/k)</th>
              </tr>
              {[
                [5, 3],
                [7, 5],
                [10, 3],
                [9, 4],
              ].map(([pn, pk]) => (
                <tr key={pn}>
                  <td>{pn}</td>
                  <td>{pk}</td>
                  <td>{"♟".repeat(pn)}</td>
                  <td>{Math.floor(pn / pk)}</td>
                  <td>{Math.ceil(pn / pk)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p>In every case: fullest hole ≥ ceil(n/k).</p>
        </article>
        <article>
          <h3>3. UNDERSTAND THE RULE</h3>
          <b>Pigeonhole Principle (General Form)</b>
          <p>
            If n objects are placed into k boxes, then some box contains at
            least ⌈n/k⌉ objects.
          </p>
          <b>Why?</b>
          <p>
            If every box had at most ⌈n/k⌉ - 1 objects, the total would be too
            small, a contradiction.
          </p>
        </article>
        <article>
          <h3>MISCONCEPTION ALERT</h3>
          <p>It's not about the average.</p>
          <p>
            Even if the average is n/k, one box must have at least ceil(n/k).
          </p>
          <p>Example: n=7, k=5. Average=1.4, but a box must have at least 2.</p>
          <div>
            {defaultDistribution.slice(0, 5).map((_, i) => (
              <span key={i}>
                <img src={holeAsset} alt="" />
                {[2, 1, 1, 2, 1][i]}
              </span>
            ))}
          </div>
        </article>
      </section>
      <section className="pig564-bottom">
        <article>
          <h3>4. WORKED EXAMPLE</h3>
          <p>
            <b>Example: n = 11 pigeons, k = 4 holes</b>
          </p>
          <p>ceil(11/4) = ceil(2.75) = 3</p>
          <div>
            {[3, 2, 3, 3].map((count, i) => (
              <span key={i}>
                <img src={holeAsset} alt="" />
                <b>{count}</b>
              </span>
            ))}
          </div>
          <strong>Guaranteed minimum = 3 pigeons in some hole.</strong>
        </article>
        <article>
          <h3>5. TRY INDEPENDENTLY</h3>
          <p>
            <b>Challenge</b>
            <br />
            Set n = {challengeN} and k = {challengeK}. What is the guaranteed
            minimum?
          </p>
          <label>
            n (pigeons)
            <input
              aria-label="Challenge pigeons"
              type="range"
              min="1"
              max="20"
              value={challengeN}
              onChange={(e) =>
                updateChallenge(Number(e.target.value), challengeK)
              }
            />
            <output>{challengeN}</output>
          </label>
          <label>
            k (holes)
            <input
              aria-label="Challenge holes"
              type="range"
              min="1"
              max="10"
              value={challengeK}
              onChange={(e) =>
                updateChallenge(challengeN, Number(e.target.value))
              }
            />
            <output>{challengeK}</output>
          </label>
          <div>
            <label>
              Your answer
              <input
                aria-label="Pigeonhole challenge answer"
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
            <button onClick={() => act(() => setGraded(true))}>Check</button>
            <button onClick={() => act(() => setShown((v) => !v))}>
              <Eye />
              Show me
            </button>
          </div>
          {graded && (
            <strong className={correct ? "correct" : "wrong"}>
              {correct
                ? `Correct: ${challengeTotal}`
                : "Take the ceiling of n/k."}
            </strong>
          )}
          {shown && (
            <output>
              ceil({challengeN}/{challengeK}) = {challengeTotal}
            </output>
          )}
        </article>
      </section>
      <nav className="pig564-adjacent">
        <button>
          Previous Lesson
          <br />
          <b>Inclusion-Exclusion Principle</b>
        </button>
        <button>
          Next Lesson
          <br />
          <b>Vertex and Edge Builder</b>
        </button>
      </nav>
    </section>
  );
}
