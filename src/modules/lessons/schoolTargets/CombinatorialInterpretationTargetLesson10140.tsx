import { CheckCircle2, RotateCcw, Shuffle } from "lucide-react";
import { useMemo, useState } from "react";
import type { SchoolSyllabusLesson } from "../syllabus/lessonSyllabusTypes";
import "./CombinatorialInterpretationTargetLesson10140.css";

const combinations = (n: number, r: number) => {
  const result: number[][] = [];
  const visit = (start: number, picked: number[]) => {
    if (picked.length === r) return void result.push(picked);
    for (let value = start; value <= n - (r - picked.length) + 1; value += 1)
      visit(value + 1, [...picked, value]);
  };
  visit(1, []);
  return result;
};

export default function CombinatorialInterpretationTargetLesson10140({
  lesson: _lesson,
}: {
  lesson: SchoolSyllabusLesson;
}) {
  const [n, setN] = useState(5),
    [r, setR] = useState(3),
    [selected, setSelected] = useState(8);
  const [showAll, setShowAll] = useState(true),
    [view, setView] = useState<"list" | "grid">("list");
  const [sort, setSort] = useState("lexicographic"),
    [reversed, setReversed] = useState(false),
    [actions, setActions] = useState(0);
  const subsets = useMemo(() => {
    const values = combinations(n, r);
    if (sort === "sum")
      values.sort(
        (a, b) => a.reduce((x, y) => x + y, 0) - b.reduce((x, y) => x + y, 0),
      );
    return reversed ? [...values].reverse() : values;
  }, [n, r, sort, reversed]);
  const active = subsets[Math.min(selected, subsets.length - 1)] ?? [];
  const count = subsets.length;
  const change = (nextN: number, nextR: number) => {
    const safeN = Math.max(2, Math.min(8, nextN)),
      safeR = Math.max(1, Math.min(safeN - 1, nextR));
    setN(safeN);
    setR(safeR);
    setSelected(0);
    setActions((x) => x + 1);
  };
  const reset = () => {
    setN(5);
    setR(3);
    setSelected(8);
    setShowAll(true);
    setView("list");
    setSort("lexicographic");
    setReversed(false);
    setActions((x) => x + 1);
  };
  return (
    <section
      className="ci10140-page"
      data-testid="school-mockup-0814"
      data-object-model="dedicated-subset-enumeration-binomial-engine"
      data-n={n}
      data-r={r}
      data-count={count}
      data-selected={active.join(",")}
      data-view={view}
      data-sort={sort}
      data-show-all={String(showAll)}
      data-actions={actions}
    >
      <header>
        <div>
          <small>CLASS 11 &bull; BINOMIAL THEOREM</small>
          <h1>Combinatorial Interpretation</h1>
          <b>Choose and Expand lab</b>
          <p>
            Choose r objects from n. See all combinations (order doesn&apos;t
            matter) and connect the count to (a + b)<sup>n</sup>.
          </p>
        </div>
        <div className="header-tools">
          <button>&larr; School lessons</button>
          <p>
            <span>18 min</span>
            <span>ADVANCED</span>
            <span>CONCEPT</span>
            <span>learning</span>
          </p>
        </div>
      </header>
      <main>
        <aside>
          <section>
            <h2>Choose n and r</h2>
            {[
              ["n (total objects)", n, -1, 1],
              ["r (choose)", r, -1, 1],
            ].map(([label, value]) => (
              <div className="stepper" key={String(label)}>
                <label>{label}</label>
                <button
                  aria-label={`Decrease ${String(label)[0]}`}
                  onClick={() =>
                    change(
                      label.toString()[0] === "n" ? n - 1 : n,
                      label.toString()[0] === "r" ? r - 1 : r,
                    )
                  }
                >
                  -
                </button>
                <b>{value}</b>
                <button
                  aria-label={`Increase ${String(label)[0]}`}
                  onClick={() =>
                    change(
                      label.toString()[0] === "n" ? n + 1 : n,
                      label.toString()[0] === "r" ? r + 1 : r,
                    )
                  }
                >
                  +
                </button>
              </div>
            ))}
            <p>
              <b>Universe U</b> = &#123;
              {Array.from({ length: n }, (_, i) => i + 1).join(", ")}&#125;
            </p>
            <div className="universe">
              {Array.from({ length: n }, (_, i) => (
                <i className={active.includes(i + 1) ? "on" : ""} key={i}>
                  {i + 1}
                </i>
              ))}
            </div>
          </section>
          <section>
            <h2>Filters</h2>
            <label>
              Show all subsets{" "}
              <input
                type="checkbox"
                checked={showAll}
                onChange={() => {
                  setShowAll((x) => !x);
                  setActions((x) => x + 1);
                }}
              />
            </label>
            <label>
              Sort{" "}
              <select
                aria-label="Subset sort"
                value={sort}
                onChange={(e) => {
                  setSort(e.target.value);
                  setSelected(0);
                  setActions((x) => x + 1);
                }}
              >
                <option value="lexicographic">Lexicographic</option>
                <option value="sum">By sum</option>
              </select>
            </label>
            <div className="segments">
              <span>Show as</span>
              <button
                className={view === "list" ? "active" : ""}
                onClick={() => setView("list")}
              >
                List
              </button>
              <button
                className={view === "grid" ? "active" : ""}
                onClick={() => setView("grid")}
              >
                Grid
              </button>
            </div>
          </section>
        </aside>
        <section className="subset-panel">
          <div className="panel-head">
            <div>
              <h2>
                All subsets of size r = {r} from n = {n}
              </h2>
              <p>Drag to explore &bull; Order doesn&apos;t matter</p>
            </div>
            <button
              onClick={() => {
                setReversed((x) => !x);
                setSelected(0);
                setActions((x) => x + 1);
              }}
            >
              <Shuffle /> Shuffle
            </button>
          </div>
          <div className={`subsets ${view}`}>
            {(showAll ? subsets : [active]).map((subset, index) => (
              <button
                className={subset === active ? "chosen" : ""}
                key={subset.join("-")}
                onClick={() => {
                  setSelected(
                    subsets.findIndex((x) => x.join() === subset.join()),
                  );
                  setActions((x) => x + 1);
                }}
              >
                <small>{index + 1}</small>
                <b>{subset.join("  ")}</b>
              </button>
            ))}
          </div>
          <div className="drop">
            Drag numbers above to pick any {r}
            <span>Your choice will appear here</span>
          </div>
        </section>
        <section className="count-panel">
          <h2>Count of subsets</h2>
          <div className="formula">
            C({n},{r}) = {count}
            <CheckCircle2 />
          </div>
          <p>
            This matches the number of ways to choose which {r} factors
            contribute b in (a + b)<sup>{n}</sup>.
          </p>
          <hr />
          <b>Link to Binomial Theorem</b>
          <p className="expansion">
            (a + b)<sup>{n}</sup> &rarr; coefficient of a<sup>{n - r}</sup>b
            <sup>{r}</sup> is <mark>{count}</mark>
          </p>
          <aside>
            Coefficient of a<sup>{n - r}</sup>b<sup>{r}</sup> is <b>{count}</b>.
            <br />
            Choose the {r} positions (out of {n}) for b.
          </aside>
        </section>
      </main>
      <section className="why">
        <article>
          <h2>Why {count} subsets?</h2>
          <p>
            A subset picks which positions (out of {n}) will contribute b. The
            remaining positions contribute a.
          </p>
          <p>Example: choose &#123;{active.join(", ")}&#125;</p>
          <div>
            {Array.from({ length: n }, (_, i) => (
              <i className={active.includes(i + 1) ? "on" : ""} key={i}>
                {i + 1}
              </i>
            ))}
          </div>
          <p>
            Term obtained: a<sup>{n - r}</sup>b<sup>{r}</sup>
          </p>
        </article>
        <article>
          <h2>Order does not matter</h2>
          <p>
            &#123;{active.join(", ")}&#125; and &#123;
            {[...active].reverse().join(", ")}&#125; select the same positions,
            so they are the same subset.
          </p>
          <strong>
            {active.join("  ")} &harr; {[...active].reverse().join("  ")}
          </strong>
          <p>Hence counted once.</p>
        </article>
        <article>
          <h2>General rule</h2>
          <p>Number of ways to choose r out of n:</p>
          <div className="formula">C(n,r) = n! / r!(n-r)!</div>
          <p>
            In (a+b)<sup>n</sup>, coefficient of a<sup>n-r</sup>b<sup>r</sup> is
            C(n,r).
          </p>
        </article>
      </section>
      <section className="flow">
        <b>How to think</b>
        <span>1 Pick n and r.</span>
        <span>&rarr;</span>
        <span>2 Explore all r-element subsets.</span>
        <span>&rarr;</span>
        <span>3 Count them = C(n,r).</span>
        <span>&rarr;</span>
        <span>
          4 Map to (a+b)<sup>n</sup>.
        </span>
      </section>
      <footer>
        <button onClick={reset}>
          <RotateCcw /> Reset lab
        </button>
        <span>
          Status: Verified &check; &nbsp; C({n},{r}) = {count}
        </span>
        <button onClick={() => change(n === 8 ? 4 : n + 1, Math.min(r, n))}>
          Try another (n, r)
        </button>
      </footer>
    </section>
  );
}
