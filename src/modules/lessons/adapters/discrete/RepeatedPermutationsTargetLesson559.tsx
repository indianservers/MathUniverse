import { Grid3X3, List, RotateCcw, Shuffle } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { LessonAdapterProps } from "../../types";
import "./PermutationsTargetLesson558.css";
import "./RepeatedPermutationsTargetLesson559.css";

const palette: Record<string, string> = {
  A: "#f59a9d",
  B: "#8db9ee",
  C: "#8fd5b2",
  R: "#ef9aa9",
  E: "#9fd7b5",
  D: "#8fd4df",
};
const factorial = (n: number) =>
  Array.from({ length: n }, (_, i) => i + 1).reduce((a, b) => a * b, 1);
const totalFor = (values: number[]) =>
  factorial(values.reduce((a, b) => a + b, 0)) /
  values.reduce((a, b) => a * factorial(b), 1);
function enumerate(counts: Record<string, number>) {
  const result: string[] = [],
    length = Object.values(counts).reduce((a, b) => a + b, 0);
  const walk = (value: string) => {
    if (value.length === length) {
      result.push(value);
      return;
    }
    Object.keys(counts).forEach((key) => {
      if (counts[key]) {
        counts[key]--;
        walk(value + key);
        counts[key]++;
      }
    });
  };
  walk("");
  return result;
}

export default function RepeatedPermutationsTargetLesson559({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [counts, setCounts] = useState({ A: 2, B: 2, C: 1 }),
    [slots, setSlots] = useState<(string | null)[]>(["A", "B", "A", "B", "C"]),
    [generated, setGenerated] = useState(true),
    [view, setView] = useState<"grid" | "list">("grid"),
    [tab, setTab] = useState("Interact"),
    [challenge, setChallenge] = useState({ R: 2, E: 2, D: 1, A: 1 }),
    [challengeGenerated, setChallengeGenerated] = useState(false),
    [actions, setActions] = useState(0);
  const items = Object.entries(counts).flatMap(
      ([key, value]) => Array(value).fill(key) as string[],
    ),
    total = totalFor(Object.values(counts)),
    arrangements = useMemo(
      () => (generated ? enumerate({ ...counts }) : []),
      [counts, generated],
    ),
    challengeTotal = totalFor(Object.values(challenge));
  const act = (fn: () => void) => {
    fn();
    setActions((v) => v + 1);
    onInteraction();
  };
  const reset = () => {
    setCounts({ A: 2, B: 2, C: 1 });
    setSlots(["A", "B", "A", "B", "C"]);
    setGenerated(true);
    setView("grid");
    setTab("Interact");
    setChallenge({ R: 2, E: 2, D: 1, A: 1 });
    setChallengeGenerated(false);
    setActions(0);
  };
  useEffect(reset, [resetToken]);
  const setCount = (key: keyof typeof counts, value: number) =>
    act(() => {
      const next = {
        ...counts,
        [key]: Math.max(key === "C" ? 0 : 1, Math.min(3, value)),
      };
      setCounts(next);
      setSlots(
        Array(Object.values(next).reduce((a, b) => a + b, 0)).fill(null),
      );
      setGenerated(false);
    });
  const place = (item: string, index = slots.findIndex((v) => v === null)) =>
    act(() => {
      if (
        index < 0 ||
        slots.filter((v) => v === item).length >=
          counts[item as keyof typeof counts]
      )
        return;
      const next = [...slots];
      next[index] = item;
      setSlots(next);
    });
  return (
    <section
      className="cs378-page perm558-page rep559-page"
      data-testid="discrete-mockup-0616"
      data-object-model="dedicated-multiset-repeated-item-drag-drop-unique-arrangement-generator-grid-list-graded-challenge"
      data-direct-interaction="true"
      data-counts={`${counts.A},${counts.B},${counts.C}`}
      data-total={total}
      data-slots={slots.map((v) => v ?? "_").join("")}
      data-generated={generated}
      data-generated-count={arrangements.length}
      data-view={view}
      data-challenge-total={challengeTotal}
      data-challenge-generated={challengeGenerated}
      data-actions={actions}
    >
      <header className="perm558-hero rep559-hero">
        <div>
          <small>DISCRETE AND APPLIED MATHEMATICS</small>
          <h1>Permutations with Repetition</h1>
          <p>
            <b>Objective:</b> Understand and apply the permutation formula for
            multiset arrangements.
          </p>
        </div>
        <aside>
          <span>Intermediate-Advanced</span>
          <span>Discrete Math Lab</span>
          <span>Multiset Counting</span>
          <span>6-10 min</span>
        </aside>
        <section>
          <b>Formula</b>
          <output>n! / (n₁! n₂! ··· nₖ!)</output>
          <b>Topics</b>
          <span>Permutations, Factorials</span>
        </section>
      </header>
      <nav className="perm558-tabs">
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
      <section className="rep559-observe">
        <header>
          <div>
            <h2>
              <i>1</i> Observe &amp; Manipulate
            </h2>
            <p>Build arrangements of a multiset and see how many are unique.</p>
          </div>
          <button onClick={() => act(reset)}>
            <RotateCcw /> Reset
          </button>
          <button
            onClick={() =>
              act(() => {
                setSlots([...items].sort(() => Math.random() - 0.5));
                setGenerated(true);
              })
            }
          >
            <Shuffle /> Random arrangement
          </button>
        </header>
        <div className="rep559-builder">
          <aside>
            <b>Multiset (tiles)</b>
            {(["A", "B", "C"] as const).map((key) => (
              <label key={key}>
                <button
                  className="rep559-source"
                  draggable
                  onDragStart={(event) =>
                    event.dataTransfer.setData("text/plain", key)
                  }
                  onClick={() => place(key)}
                  style={{ background: palette[key] }}
                >
                  {key}
                </button>{" "}
                n<sub>{key}</sub> ={" "}
                <button onClick={() => setCount(key, counts[key] - 1)}>
                  -
                </button>
                <output>{counts[key]}</output>
                <button onClick={() => setCount(key, counts[key] + 1)}>
                  +
                </button>
              </label>
            ))}
            <hr />
            <b>Total items (n)</b>
            <output>{items.length}</output>
          </aside>
          <main>
            <b>Arrangement builder (length = {items.length})</b>
            <div>
              {slots.map((item, index) => (
                <span
                  key={index}
                  data-testid={`repeated-slot-${index + 1}`}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) =>
                    place(e.dataTransfer.getData("text/plain"), index)
                  }
                >
                  {item && (
                    <button
                      draggable
                      onDragStart={(e) =>
                        e.dataTransfer.setData("text/plain", item)
                      }
                      style={{ background: palette[item] }}
                    >
                      {item}
                    </button>
                  )}
                </span>
              ))}
            </div>
            <button onClick={() => act(() => setGenerated(true))}>
              Generate unique arrangements
            </button>
            <output>{generated ? arrangements.length : "—"}</output>
            <p>out of {factorial(items.length)} total permutations</p>
          </main>
          <section>
            <b>Live count (unique)</b>
            <output>
              {items.length}! /{" "}
              {Object.values(counts)
                .map((v) => `${v}!`)
                .join(" ")}
              <br />= <strong>{total}</strong>
            </output>
            <div>
              <span>
                Total permutations
                <br />
                <b>
                  {items.length}! = {factorial(items.length)}
                </b>
              </span>
              <span>
                Overcount factor
                <br />
                <b>
                  {Object.values(counts)
                    .map((v) => `${v}!`)
                    .join(" × ")}
                </b>
              </span>
            </div>
          </section>
        </div>
      </section>
      <section className="rep559-middle">
        <article>
          <header>
            <div>
              <h2>
                <i>2</i> Notice the Pattern
              </h2>
              <p>All unique arrangements for this multiset.</p>
            </div>
            <button
              className={view === "grid" ? "active" : ""}
              onClick={() => act(() => setView("grid"))}
            >
              <Grid3X3 /> Grid
            </button>
            <button
              className={view === "list" ? "active" : ""}
              onClick={() => act(() => setView("list"))}
            >
              <List /> List
            </button>
          </header>
          <div className={`rep559-arrangements ${view}`}>
            {arrangements.map((value, index) => (
              <span key={value}>
                <b>{index + 1}</b>
                {[...value].map((item, i) => (
                  <i key={i} style={{ background: palette[item] }}>
                    {item}
                  </i>
                ))}
              </span>
            ))}
          </div>
        </article>
        <article>
          <h2>
            <i>3</i> Understand the Rule
          </h2>
          <aside>
            <b>Overcounting insight</b>
            <p>
              Identical copies are temporarily treated as different, counting
              the same arrangement multiple times. Divide by each repeated
              factorial.
            </p>
          </aside>
          <aside>
            <b>Key rule (Multiset Permutation)</b>
            <output>P(n; n₁,n₂,…,nₖ) = n! / (n₁!n₂!···nₖ!)</output>
          </aside>
          <div className="perm558-warning">
            <b>Common misconception</b>
            <p>“Just use n!” overcounts repeated items.</p>
          </div>
        </article>
      </section>
      <section className="rep559-worked">
        <h2>
          <i>4</i> Worked Example
        </h2>
        <div>
          <article>
            <b>How many distinct arrangements of M, A, T, H, M, A?</b>
            <p>M and A occur twice; T and H once.</p>
            <output>6! / (2! 2! 1! 1!) = 720 / 4 = 180</output>
          </article>
          <article>
            <b>Some valid arrangements</b>
            <div>
              {["MATHMA", "MATMHA", "MHATMA", "AMTHMA"].map((v, i) => (
                <span key={v}>
                  {i + 1} {v}
                </span>
              ))}
            </div>
            <strong>Answer: 180 distinct arrangements.</strong>
          </article>
        </div>
      </section>
      <section className="rep559-practice">
        <h2>
          <i>5</i> Try Independently
        </h2>
        <div>
          <article>
            <b>Challenge</b>
            <p>
              How many distinct arrangements can be formed from R, R, E, D, E,
              A?
            </p>
          </article>
          <article>
            <b>Set the counts</b>
            {(Object.keys(challenge) as (keyof typeof challenge)[]).map(
              (key) => (
                <label key={key}>
                  <span style={{ background: palette[key] }}>{key}</span>
                  <input
                    aria-label={`Challenge ${key} count`}
                    type="number"
                    min="0"
                    max="3"
                    value={challenge[key]}
                    onChange={(e) =>
                      act(() => {
                        setChallenge({
                          ...challenge,
                          [key]: Number(e.target.value),
                        });
                        setChallengeGenerated(false);
                      })
                    }
                  />
                </label>
              ),
            )}
          </article>
          <article>
            <b>Your result</b>
            <output>{challengeGenerated ? challengeTotal : "—"}</output>
            <button onClick={() => act(() => setChallengeGenerated(true))}>
              Generate &amp; Count
            </button>
          </article>
          <article>
            <b>Check with formula</b>
            <output>{challengeTotal}</output>
            <strong>
              Correct count
              <br />
              {challengeTotal}
            </strong>
          </article>
        </div>
      </section>
      <nav className="perm558-adjacent">
        <button>
          Previous
          <br />
          <b>Permutations</b>
        </button>
        <button>
          Next
          <br />
          <b>Circular Permutations</b>
        </button>
      </nav>
    </section>
  );
}
