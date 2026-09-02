import { AlertTriangle, Check, Eye, Lightbulb } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { LessonAdapterProps } from "../../types";
import "./PowerSetsTargetLesson586.css";

const allValues = [1, 2, 3, 4];
const subsetsOf = (values: number[]) =>
  Array.from({ length: 2 ** values.length }, (_, mask) =>
    values.filter((_, index) => mask & (1 << index)),
  ).sort((a, b) => a.length - b.length || a.join("").localeCompare(b.join("")));
const roster = (values: (number | string)[]) =>
  values.length ? `{${values.join(", ")}}` : "∅";
export default function PowerSetsTargetLesson586({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [source, setSource] = useState(allValues),
    [tab, setTab] = useState("Interact"),
    [countAnswer, setCountAnswer] = useState(""),
    [pairsAnswer, setPairsAnswer] = useState(""),
    [boundaryAnswer, setBoundaryAnswer] = useState<"yes" | "no" | "">(""),
    [graded, setGraded] = useState<[boolean, boolean, boolean] | null>(null),
    [showAnswer, setShowAnswer] = useState(false),
    [actions, setActions] = useState(0);
  const subsets = useMemo(() => subsetsOf(source), [source]),
    pairExpected = ["pq", "pr", "ps", "qr", "qs", "rs"].sort().join("");
  const reset = () => {
    setSource(allValues);
    setTab("Interact");
    setCountAnswer("");
    setPairsAnswer("");
    setBoundaryAnswer("");
    setGraded(null);
    setShowAnswer(false);
    setActions(0);
  };
  useEffect(reset, [resetToken]);
  const act = (fn: () => void) => {
      fn();
      setActions((value) => value + 1);
      onInteraction();
    },
    toggle = (value: number) =>
      act(() => {
        setSource((current) =>
          current.includes(value)
            ? current.filter((item) => item !== value)
            : [...current, value].sort(),
        );
      }),
    check = () =>
      act(() => {
        const parsedPairs = [
          ...pairsAnswer.matchAll(/([pqrs])\s*,?\s*([pqrs])/gi),
        ]
          .map((match) => [match[1], match[2]].sort().join(""))
          .sort()
          .join("");
        setGraded([
          Number(countAnswer) === 16,
          parsedPairs === pairExpected,
          boundaryAnswer === "yes",
        ]);
      });
  const treeNodes = useMemo(() => {
    const nodes = [{ depth: 0, index: 0, subset: [] as number[] }];
    for (let depth = 0; depth < source.length; depth += 1) {
      nodes
        .filter((node) => node.depth === depth)
        .forEach((node) => {
          nodes.push({
            depth: depth + 1,
            index: node.index * 2,
            subset: [...node.subset, source[depth]],
          });
          nodes.push({
            depth: depth + 1,
            index: node.index * 2 + 1,
            subset: node.subset,
          });
        });
    }
    return nodes;
  }, [source]);
  const treePoint = (depth: number, index: number) => ({
    x: ((index + 0.5) * 580) / 2 ** depth + 10,
    y: 25 + depth * 104,
  });
  return (
    <section
      className="ps586-page"
      data-testid="discrete-mockup-0643"
      data-object-model="dedicated-binary-power-set-model"
      data-source={source.join(",")}
      data-power-count={subsets.length}
      data-subsets={subsets.map((set) => set.join("")).join("|")}
      data-graded={graded?.join(",") ?? ""}
      data-actions={actions}
    >
      <header className="ps586-hero">
        <div>
          <h1>586. Subsets and Power Sets</h1>
          <p>
            <b>Objective:</b> Explore subsets and build the power set of a
            finite set.
          </p>
        </div>
        <dl>
          <span>
            <b>Topic</b>Discrete Mathematics
          </span>
          <span>
            <b>Level</b>Intermediate-Advanced
          </span>
          <span>
            <b>Est. time</b>6-10 min
          </span>
        </dl>
      </header>
      <nav className="ps586-tabs">
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
      {tab !== "Interact" && (
        <p className="ps586-note">
          <b>{tab}:</b> A power set contains every possible subset, including ∅
          and the full set.
        </p>
      )}
      <section className="ps586-builder">
        <article>
          <h2>Build your set</h2>
          <p>Toggle elements to include or exclude them from the base set.</p>
          <div>
            {allValues.map((value) => (
              <button
                key={value}
                className={source.includes(value) ? "active" : ""}
                aria-pressed={source.includes(value)}
                onClick={() => toggle(value)}
              >
                <Check />
                {value}
              </button>
            ))}
          </div>
        </article>
        <article>
          <h2>
            Your set <small>(n = {source.length})</small>
          </h2>
          <strong>S = {roster(source)}</strong>
          <footer>
            <b>n = {source.length}</b>
            <b>|S| = {source.length}</b>
          </footer>
        </article>
        <article>
          <h2>Power set size</h2>
          <strong>
            2<sup>n</sup> = {subsets.length}
          </strong>
          <p>
            2<sup>{source.length}</sup> = {subsets.length} subsets
          </p>
        </article>
      </section>
      <section className="ps586-workspace">
        <article className="ps586-tree">
          <h2>
            Subset builder <small>(choose a path)</small>
          </h2>
          <div className="legend">
            <i /> Include <i /> Exclude
          </div>
          <svg
            viewBox="0 0 600 510"
            role="img"
            aria-label={`Binary decision tree with ${subsets.length} leaves`}
          >
            <rect x="245" y="8" width="110" height="48" rx="8" />
            <text x="300" y="27">
              Start
            </text>
            <text x="300" y="44">
              S = {roster(source)}
            </text>
            {treeNodes
              .filter((node) => node.depth < source.length)
              .flatMap((node) => {
                const from = treePoint(node.depth, node.index),
                  nextDepth = node.depth + 1;
                return [0, 1].map((branch) => {
                  const to = treePoint(nextDepth, node.index * 2 + branch);
                  return (
                    <g key={`${node.depth}-${node.index}-${branch}`}>
                      <line
                        className={branch ? "exclude" : "include"}
                        x1={from.x}
                        y1={from.y + 17}
                        x2={to.x}
                        y2={to.y - 17}
                      />
                      <text
                        className={branch ? "exclude-label" : "include-label"}
                        x={(from.x + to.x) / 2}
                        y={(from.y + to.y) / 2 - 3}
                      >
                        {branch ? "Exclude" : "Include"} {source[node.depth]}
                      </text>
                    </g>
                  );
                });
              })}
            {treeNodes.slice(1).map((node) => {
              const point = treePoint(node.depth, node.index);
              return (
                <g key={`${node.depth}-${node.index}`}>
                  <rect
                    x={point.x - 23}
                    y={point.y - 17}
                    width="46"
                    height="34"
                    rx="6"
                  />
                  <text x={point.x} y={point.y + 3}>
                    {roster(node.subset)}
                  </text>
                </g>
              );
            })}
          </svg>
          <p>
            <Lightbulb /> Each path decides to include or exclude each element.
          </p>
        </article>
        <article className="ps586-list">
          <h2>
            Power set <small>(live collection)</small>
          </h2>
          <ol>
            {subsets.map((subset, index) => (
              <li key={`${index}-${subset.join("-")}`}>
                <b>{index + 1}</b>
                <span>{roster(subset)}</span>
              </li>
            ))}
          </ol>
          <footer>
            Total subsets: <b>{subsets.length}</b>
            <Check />
          </footer>
        </article>
        <aside className="ps586-facts">
          <article>
            <h2>About this list</h2>
            <p>Includes ∅ and the full set S.</p>
            <p>All subsets are distinct.</p>
            <p>
              Count matches 2<sup>n</sup>.
            </p>
          </article>
          <article>
            <h2>Quick facts</h2>
            <p>n = |S| = {source.length}</p>
            <p>
              2<sup>n</sup> = 2<sup>{source.length}</sup> = {subsets.length}
            </p>
            <p>
              <b>Min size</b> = 0
            </p>
            <p>
              <b>Max size</b> = {source.length}
            </p>
            <p>
              <b>Avg size</b> = n/2 = {source.length / 2}
            </p>
          </article>
        </aside>
      </section>
      <section className="ps586-theory">
        <article>
          <h2>Notice the pattern</h2>
          <table>
            <thead>
              <tr>
                <th>n = |S|</th>
                <th>
                  2<sup>n</sup>
                </th>
              </tr>
            </thead>
            <tbody>
              {[0, 1, 2, 3, 4, 5].map((n) => (
                <tr key={n}>
                  <td>{n}</td>
                  <td>{2 ** n}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p>Each time n increases by 1, the number of subsets doubles.</p>
        </article>
        <article>
          <h2>Key rule</h2>
          <p>For any finite set S with n elements,</p>
          <strong>
            |P(S)| = 2<sup>n</sup>
          </strong>
          <p>The power set contains every possible subset of S.</p>
        </article>
        <article>
          <h2>Worked example</h2>
          <p>Let T = {`{a, b, c}`} (n = 3)</p>
          <strong>
            2<sup>3</sup> = 8 subsets
          </strong>
          <output>
            P(T) = {`{∅, {a}, {b}, {c}, {a,b}, {a,c}, {b,c}, {a,b,c}}`}
          </output>
        </article>
        <article className="warning">
          <h2>
            <AlertTriangle /> Common misconception
          </h2>
          <p>Forgetting ∅ or the full set.</p>
          <p>The power set always includes ∅ and the set itself.</p>
          <p>For n=3, missing either gives only 6 subsets, not 8.</p>
        </article>
      </section>
      <section className="ps586-practice">
        <header>
          <h2>Try it yourself (challenge)</h2>
          <button onClick={() => act(() => setShowAnswer((value) => !value))}>
            <Eye /> Show answer
          </button>
          <p>Construct the power set of U = {`{p, q, r, s}`}.</p>
        </header>
        <label>
          How many subsets are there?
          <span>
            <input
              aria-label="Power set challenge count"
              value={countAnswer}
              onChange={(e) => setCountAnswer(e.target.value)}
              placeholder="Enter a number"
            />
            <i>{graded?.[0] === undefined ? "" : graded[0] ? "✓" : "×"}</i>
          </span>
        </label>
        <label>
          List the subsets of size 2.
          <span>
            <input
              aria-label="Power set size-two subsets"
              value={pairsAnswer}
              onChange={(e) => setPairsAnswer(e.target.value)}
              placeholder="e.g., {p,q}, {p,r}, ..."
            />
            <i>{graded?.[1] === undefined ? "" : graded[1] ? "✓" : "×"}</i>
          </span>
        </label>
        <fieldset>
          <legend>Does your list include ∅ and the full set?</legend>
          <label>
            <input
              type="radio"
              name="boundary"
              checked={boundaryAnswer === "yes"}
              onChange={() => setBoundaryAnswer("yes")}
            />{" "}
            Yes
          </label>
          <label>
            <input
              type="radio"
              name="boundary"
              checked={boundaryAnswer === "no"}
              onChange={() => setBoundaryAnswer("no")}
            />{" "}
            No
          </label>
        </fieldset>
        <button className="check" onClick={check}>
          Check
        </button>
        {showAnswer && (
          <output>
            16; {`{p,q}, {p,r}, {p,s}, {q,r}, {q,s}, {r,s}`}; Yes.
          </output>
        )}
      </section>
      <nav className="ps586-adjacent">
        <a href="/lessons/discrete-and-applied-mathematics/585-cartesian-product">
          ←{" "}
          <span>
            Previous<b>Cartesian Product</b>
          </span>
        </a>
        <a href="/lessons/discrete-and-applied-mathematics/587-truth-tables">
          <span>
            Next<b>Truth Tables</b>
          </span>{" "}
          →
        </a>
      </nav>
    </section>
  );
}
