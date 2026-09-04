import { Check, Info, Pencil, Play, Plus, X } from "lucide-react";
import { useState } from "react";
import type { SchoolSyllabusLesson } from "../syllabus/lessonSyllabusTypes";
import "./ReflexiveRelationsTargetLesson10113.css";

type N = 1 | 2 | 3 | 4;
type Pair = `${N},${N}`;
const A: N[] = [1, 2, 3, 4];
const pair = (a: N, b: N): Pair => `${a},${b}`;
const initial: Pair[] = [
  "1,2",
  "1,4",
  "2,2",
  "2,3",
  "3,1",
  "3,3",
  "4,2",
  "4,4",
];
const pos: Record<N, [number, number]> = {
  1: [85, 70],
  2: [315, 70],
  3: [85, 235],
  4: [315, 235],
};

export default function ReflexiveRelationsTargetLesson10113({
  lesson: _lesson,
}: {
  lesson: SchoolSyllabusLesson;
}) {
  const [relation, setRelation] = useState(() => new Set<Pair>(initial));
  const [view, setView] = useState<"graph" | "matrix">("graph");
  const [tested, setTested] = useState(false);
  const [setSize, setSetSize] = useState<2 | 3 | 4>(4);
  const [actions, setActions] = useState(0);
  const active = A.slice(0, setSize);
  const missing = active.filter((a) => !relation.has(pair(a, a)));
  const reflexive = missing.length === 0;
  const update = (next: Set<Pair>) => {
    setRelation(next);
    setTested(false);
    setActions((n) => n + 1);
  };
  const toggle = (a: N, b: N) => {
    const next = new Set(relation),
      p = pair(a, b);
    if (next.has(p)) next.delete(p);
    else next.add(p);
    update(next);
  };
  const addAll = () => {
    const next = new Set(relation);
    active.forEach((a) => next.add(pair(a, a)));
    update(next);
  };
  const editSet = () => {
    const size = (setSize === 4 ? 2 : setSize + 1) as 2 | 3 | 4;
    const next = new Set(
      Array.from(relation).filter((p) =>
        p.split(",").every((value) => Number(value) <= size),
      ),
    );
    setSetSize(size);
    setRelation(next);
    setTested(false);
    setActions((n) => n + 1);
  };
  return (
    <section
      className="rfx10113-page"
      data-testid="school-mockup-0787"
      data-object-model="dedicated-reflexive-directed-graph-matrix-witness-engine"
      data-set-size={setSize}
      data-pair-count={relation.size}
      data-missing={missing.join(",")}
      data-reflexive={String(reflexive)}
      data-view={view}
      data-tested={String(tested)}
      data-actions={actions}
    >
      <header>
        <section>
          <small>CLASS 11 · RELATIONS AND FUNCTIONS</small>
          <h1>Reflexive Relations</h1>
          <p>
            A relation R on a set A is reflexive if every element is related to
            itself.
          </p>
          <nav>
            <span>18 min</span>
            <span>ADVANCED</span>
            <span>CONCEPT</span>
            <span>graph</span>
            <span>matrix</span>
          </nav>
        </section>
        <aside>
          <b>Definition</b>
          <p>R is reflexive on A if and only if</p>
          <strong>∀ a ∈ A, &nbsp; (a,a) ∈ R</strong>
        </aside>
      </header>
      <main>
        <section className="rfx10113-editor">
          <h2>RELATION EDITOR</h2>
          <div className="setline">
            <span>Set A = {`{${active.join(", ")}}`}</span>
            <button onClick={editSet}>
              <Pencil /> Edit set
            </button>
          </div>
          <p>Toggle an ordered pair (a,b) to include or remove it from R.</p>
          <nav>
            <button
              className={view === "graph" ? "active" : ""}
              onClick={() => setView("graph")}
            >
              Graph
            </button>
            <button
              className={view === "matrix" ? "active" : ""}
              onClick={() => setView("matrix")}
            >
              Matrix
            </button>
          </nav>
          <div className="rfx10113-work">
            <article className={view === "graph" ? "shown" : ""}>
              <h2>DIRECTED GRAPH OF R</h2>
              <svg viewBox="0 0 400 300" aria-label="Reflexive relation graph">
                <defs>
                  <marker
                    id="rfx-arrow"
                    markerWidth="8"
                    markerHeight="8"
                    refX="7"
                    refY="4"
                    orient="auto"
                  >
                    <path d="M0 0L8 4L0 8Z" />
                  </marker>
                </defs>
                {active
                  .flatMap((a) => active.map((b) => [a, b] as const))
                  .filter(([a, b]) => a !== b)
                  .map(([a, b]) => {
                    const [x1, y1] = pos[a],
                      [x2, y2] = pos[b],
                      dx = x2 - x1,
                      dy = y2 - y1,
                      l = Math.hypot(dx, dy),
                      on = relation.has(pair(a, b));
                    return (
                      <line
                        key={pair(a, b)}
                        x1={x1 + (dx / l) * 25}
                        y1={y1 + (dy / l) * 25}
                        x2={x2 - (dx / l) * 25}
                        y2={y2 - (dy / l) * 25}
                        className={on ? "on" : "off"}
                        markerEnd={on ? "url(#rfx-arrow)" : undefined}
                      />
                    );
                  })}
                {active
                  .filter((a) => relation.has(pair(a, a)))
                  .map((a) => {
                    const [x, y] = pos[a];
                    return (
                      <path
                        key={`l${a}`}
                        className="on"
                        d={`M${x - 12} ${y - 20}C${x - 46} ${y - 55},${x + 46} ${y - 55},${x + 12} ${y - 20}`}
                        markerEnd="url(#rfx-arrow)"
                      />
                    );
                  })}
                {active.map((a) => (
                  <g
                    key={a}
                    role="button"
                    tabIndex={0}
                    aria-label={`Toggle self-pair ${a}`}
                    onClick={() => toggle(a, a)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") toggle(a, a);
                    }}
                  >
                    <circle cx={pos[a][0]} cy={pos[a][1]} r="24" />
                    <text x={pos[a][0]} y={pos[a][1] + 6}>
                      {a}
                    </text>
                  </g>
                ))}
              </svg>
              <footer>
                <span>→ &nbsp; In R (included)</span>
                <span>--- &nbsp; Not in R (excluded)</span>
              </footer>
            </article>
            <article className={view === "matrix" ? "shown" : ""}>
              <h2>ADJACENCY MATRIX &nbsp; Mᵣ</h2>
              <p>Mᵣ[i,j] = 1 if (i,j) ∈ R, else 0.</p>
              <div className="rfx10113-matrix">
                <b>−</b>
                {active.map((a) => (
                  <b key={`c${a}`}>{a}</b>
                ))}
                {active.flatMap((a) => [
                  <b key={`r${a}`}>{a}</b>,
                  ...active.map((b) => (
                    <button
                      key={pair(a, b)}
                      aria-label={`Toggle relation ${a}, ${b}`}
                      className={relation.has(pair(a, b)) ? "one" : ""}
                      onClick={() => toggle(a, b)}
                    >
                      {relation.has(pair(a, b)) ? 1 : 0}
                    </button>
                  )),
                ])}
              </div>
              <p>Click a cell to toggle (i,j).</p>
              <small>
                <Info /> Diagonal cells (i,i) represent self-pairs.
              </small>
            </article>
          </div>
          <footer>
            <button onClick={addAll}>
              <Plus />{" "}
              <span>
                <b>Add all self-pairs</b>
                <small>Add (a,a) for all a ∈ A</small>
              </span>
            </button>
            <button
              onClick={() => {
                setTested(true);
                setActions((n) => n + 1);
              }}
            >
              <Play />
              <span>
                <b>Test Reflexive</b>
                <small>Check if R is reflexive on A</small>
              </span>
            </button>
          </footer>
        </section>
        <aside className="rfx10113-checker">
          <h2>REFLEXIVE CHECKER</h2>
          <header className={reflexive ? "yes" : "no"}>
            {reflexive ? <Check /> : <X />}
            <div>
              <strong>{reflexive ? "Reflexive" : "Not Reflexive"}</strong>
              <p>
                {reflexive
                  ? "Every required self-pair is present."
                  : `Missing self-pair: (${missing[0]}, ${missing[0]})`}
              </p>
            </div>
          </header>
          <p>The following self-pairs must be in R.</p>
          <table>
            <thead>
              <tr>
                <th>a</th>
                <th>Self-pair (a,a)</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {active.map((a) => {
                const ok = relation.has(pair(a, a));
                return (
                  <tr key={a}>
                    <td>{a}</td>
                    <td>
                      ({a}, {a})
                    </td>
                    <td>
                      <span className={ok ? "present" : "missing"}>
                        {ok ? "✓ Present" : "× Missing"}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <article>
            <b>How it works</b>
            <p>
              R is reflexive on A if every a ∈ A has a self-loop in the graph
              (diagonal cell = 1 in the matrix). The checker highlights the
              first missing witness.
            </p>
            {tested && (
              <strong className="tested">
                Test complete:{" "}
                {reflexive
                  ? "R is reflexive."
                  : `${missing.length} self-pair${missing.length === 1 ? "" : "s"} missing.`}
              </strong>
            )}
          </article>
        </aside>
      </main>
      <footer className="rfx10113-notes">
        <section>
          <b>Best classroom move</b>
          <p>
            Predict the result before changing the model. Try removing a
            diagonal entry and see which witness fails first.
          </p>
        </section>
        <section>
          <b>Related concept</b>
          <p>Non-reflexive relation: at least one self-pair is missing.</p>
        </section>
      </footer>
    </section>
  );
}
