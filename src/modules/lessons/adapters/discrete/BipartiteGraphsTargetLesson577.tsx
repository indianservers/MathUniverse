import { Check, Play, RotateCcw, Shuffle, TriangleAlert } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { PointerEvent } from "react";
import type { LessonAdapterProps } from "../../types";
import "../geometry3d/CoordinateSystemTargetLesson378.css";
import "./BipartiteGraphsTargetLesson577.css";

type Vertex = { id: string; x: number; y: number };
type Edge = { a: string; b: string; label: number };
type Assignment = Record<string, 0 | 1>;
const baseVertices: Vertex[] = [
  { id: "A", x: 175, y: 85 },
  { id: "B", x: 300, y: 45 },
  { id: "C", x: 445, y: 86 },
  { id: "D", x: 225, y: 245 },
  { id: "E", x: 390, y: 260 },
];
const baseEdges: Edge[] = [
  { a: "A", b: "B", label: 2 },
  { a: "A", b: "D", label: 1 },
  { a: "B", b: "C", label: 3 },
  { a: "D", b: "E", label: 5 },
];
const oddEdges: Edge[] = [
  { a: "A", b: "B", label: 1 },
  { a: "B", b: "C", label: 2 },
  { a: "C", b: "A", label: 3 },
  { a: "D", b: "E", label: 4 },
];
const initialAssignment: Assignment = { A: 1, B: 0, C: 1, D: 0, E: 1 };
const edgeKey = (edge: Edge) => [edge.a, edge.b].sort().join("");
function conflicts(edges: Edge[], assignment: Assignment) {
  return edges
    .filter(
      (e) =>
        assignment[e.a] !== undefined && assignment[e.a] === assignment[e.b],
    )
    .map(edgeKey);
}
function bfsColour(vertices: Vertex[], edges: Edge[]) {
  const colour: Assignment = {},
    order: string[] = [];
  let valid = true;
  for (const start of vertices.map((v) => v.id)) {
    if (colour[start] !== undefined) continue;
    colour[start] = 0;
    const queue = [start];
    while (queue.length) {
      const at = queue.shift()!;
      order.push(at);
      for (const edge of edges.filter((e) => e.a === at || e.b === at)) {
        const next = edge.a === at ? edge.b : edge.a;
        if (colour[next] === undefined) {
          colour[next] = colour[at] === 0 ? 1 : 0;
          queue.push(next);
        } else if (colour[next] === colour[at]) valid = false;
      }
    }
  }
  return { assignment: colour, order, valid };
}
const challengeVertices: Vertex[] = [
  { id: "P", x: 150, y: 22 },
  { id: "Q", x: 75, y: 90 },
  { id: "R", x: 225, y: 90 },
  { id: "S", x: 150, y: 155 },
];
const challengeEdges: Edge[] = [
  { a: "P", b: "Q", label: 1 },
  { a: "P", b: "R", label: 2 },
  { a: "Q", b: "S", label: 3 },
  { a: "R", b: "S", label: 4 },
];

function MiniGraph({ odd = false }: { odd?: boolean }) {
  const vs = odd
    ? [
        { id: "X", x: 105, y: 25 },
        { id: "Y", x: 55, y: 120 },
        { id: "Z", x: 155, y: 120 },
      ]
    : baseVertices.map((v) => ({
        ...v,
        x: v.x * 0.34 - 15,
        y: v.y * 0.43 + 5,
      }));
  const es: Edge[] = odd
    ? [
        { a: "X", b: "Y", label: 1 },
        { a: "X", b: "Z", label: 2 },
        { a: "Y", b: "Z", label: 3 },
      ]
    : baseEdges;
  return (
    <svg
      viewBox="0 0 210 155"
      role="img"
      aria-label={odd ? "Odd cycle triangle" : "Bipartite worked graph"}
    >
      {es.map((e) => {
        const a = vs.find((v) => v.id === e.a)!,
          b = vs.find((v) => v.id === e.b)!;
        return (
          <g key={edgeKey(e)}>
            <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} />
            <text x={(a.x + b.x) / 2} y={(a.y + b.y) / 2 - 5}>
              {e.label}
            </text>
          </g>
        );
      })}
      {vs.map((v, i) => (
        <g key={v.id}>
          <circle
            cx={v.x}
            cy={v.y}
            r="13"
            className={i % 2 ? "set-b" : "set-a"}
          />
          <text x={v.x} y={v.y + 4}>
            {v.id}
          </text>
        </g>
      ))}
    </svg>
  );
}

export default function BipartiteGraphsTargetLesson577({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [vertices, setVertices] = useState(baseVertices),
    [variant, setVariant] = useState<"base" | "odd">("base"),
    [assignment, setAssignment] = useState<Assignment>(initialAssignment),
    [step, setStep] = useState(5),
    [auto, setAuto] = useState(false),
    [labels, setLabels] = useState(true),
    [numbers, setNumbers] = useState(true),
    [tab, setTab] = useState("Interact"),
    [dragging, setDragging] = useState<string | null>(null),
    [answer, setAnswer] = useState(""),
    [graded, setGraded] = useState<boolean | null>(null),
    [actions, setActions] = useState(0);
  const edges = variant === "base" ? baseEdges : oddEdges,
    bfs = useMemo(() => bfsColour(vertices, edges), [vertices, edges]);
  const shownAssignment =
    step >= bfs.order.length
      ? assignment
      : (Object.fromEntries(
          bfs.order.slice(0, step).map((id) => [id, bfs.assignment[id]]),
        ) as Assignment);
  const bad = conflicts(edges, shownAssignment),
    isBipartite = bfs.valid && conflicts(edges, assignment).length === 0,
    setA = Object.values(assignment).filter((v) => v === 0).length,
    setB = Object.values(assignment).filter((v) => v === 1).length;
  const act = (fn: () => void) => {
    fn();
    setActions((n) => n + 1);
    onInteraction();
  };
  const reset = () => {
    setVertices(baseVertices);
    setVariant("base");
    setAssignment(initialAssignment);
    setStep(5);
    setAuto(false);
    setLabels(true);
    setNumbers(true);
    setTab("Interact");
    setDragging(null);
    setAnswer("");
    setGraded(null);
    setActions(0);
  };
  useEffect(reset, [resetToken]);
  useEffect(() => {
    if (!auto || step >= bfs.order.length) {
      if (auto) setAuto(false);
      return;
    }
    const timer = setTimeout(() => {
      setStep((n) => n + 1);
      onInteraction();
    }, 450);
    return () => clearTimeout(timer);
  }, [auto, step, bfs.order.length, onInteraction]);
  const load = (next: "base" | "odd") =>
    act(() => {
      const nextEdges = next === "base" ? baseEdges : oddEdges,
        nextBfs = bfsColour(baseVertices, nextEdges);
      setVariant(next);
      setVertices(baseVertices);
      setAssignment(nextBfs.assignment);
      setStep(baseVertices.length);
      setAuto(false);
    });
  const move = (e: PointerEvent<SVGSVGElement>) => {
    if (!dragging) return;
    const box = e.currentTarget.getBoundingClientRect(),
      x = Math.max(
        25,
        Math.min(595, ((e.clientX - box.left) / box.width) * 620),
      ),
      y = Math.max(
        25,
        Math.min(275, ((e.clientY - box.top) / box.height) * 300),
      );
    setVertices((vs) =>
      vs.map((v) => (v.id === dragging ? { ...v, x, y } : v)),
    );
    onInteraction();
  };
  const drop = () => {
    if (!dragging) return;
    const v = vertices.find((n) => n.id === dragging)!;
    if (v.x < 125) act(() => setAssignment((a) => ({ ...a, [dragging]: 0 })));
    else if (v.x > 495)
      act(() => setAssignment((a) => ({ ...a, [dragging]: 1 })));
    setDragging(null);
  };
  return (
    <section
      className="bp577-page cs378-page"
      data-testid="discrete-mockup-0634"
      data-object-model="dedicated-bfs-two-colour-drag-partition-odd-cycle-model"
      data-variant={variant}
      data-set-a={setA}
      data-set-b={setB}
      data-edge-count={edges.length}
      data-conflict-count={bad.length}
      data-bipartite={isBipartite}
      data-step={step}
      data-auto={auto}
      data-positions={vertices
        .map((v) => `${v.id}:${Math.round(v.x)},${Math.round(v.y)}`)
        .join(";")}
      data-answer={answer}
      data-graded={graded === null ? "" : graded}
      data-actions={actions}
    >
      <header className="bp577-hero">
        <div>
          <b>DISCRETE AND APPLIED MATHEMATICS</b>
          <h1>577. Bipartite Graphs</h1>
          <p>Split vertices into two sets. Edges only cross between sets.</p>
        </div>
        <dl>
          <span>
            ♧ <b>Level:</b> Intermediate–Advanced
          </span>
          <span>
            ◷ <b>Time:</b> 6–10 min
          </span>
          <span>
            ♧ <b>Skills:</b> Graph Theory, BFS, Two-Coloring
          </span>
        </dl>
      </header>
      <nav className="bp577-tabs">
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
        <p className="bp577-note">
          <b>{tab}:</b> A graph is bipartite exactly when it has no odd cycle.
        </p>
      )}
      <section className="bp577-lab">
        <main>
          <header>
            <h3>1. OBSERVE &amp; MANIPULATE</h3>
            <p>
              Drag vertices into Set A (left) or Set B (right).
              <br />
              Edges must go between sets.
            </p>
          </header>
          <div className="bp577-canvas">
            <svg
              viewBox="0 0 620 300"
              onPointerMove={move}
              onPointerUp={drop}
              onPointerLeave={drop}
              role="img"
              aria-label={`Bipartite partition graph with ${bad.length} same-side conflicts`}
            >
              <rect
                className="zone a"
                x="15"
                y="35"
                width="105"
                height="225"
                rx="9"
              />
              <rect
                className="zone b"
                x="500"
                y="35"
                width="105"
                height="225"
                rx="9"
              />
              <text className="zone-title" x="68" y="58">
                Set A
              </text>
              <text className="zone-title" x="552" y="58">
                Set B
              </text>
              <text className="drop" x="68" y="138">
                Drop vertices here
              </text>
              <text className="drop" x="552" y="138">
                Drop vertices here
              </text>
              {edges.map((edge) => {
                const a = vertices.find((v) => v.id === edge.a)!,
                  b = vertices.find((v) => v.id === edge.b)!,
                  conflict = bad.includes(edgeKey(edge));
                return (
                  <g key={edgeKey(edge)}>
                    <line
                      className={conflict ? "conflict" : ""}
                      x1={a.x}
                      y1={a.y}
                      x2={b.x}
                      y2={b.y}
                    />
                    {labels && (
                      <text
                        className="edge-label"
                        x={(a.x + b.x) / 2}
                        y={(a.y + b.y) / 2 - 7}
                      >
                        {edge.label}
                      </text>
                    )}
                  </g>
                );
              })}
              {vertices.map((v, i) => (
                <g
                  key={v.id}
                  data-testid={`bipartite-vertex-${v.id}`}
                  onPointerDown={(e) => {
                    setDragging(v.id);
                    e.currentTarget.setPointerCapture(e.pointerId);
                  }}
                >
                  <circle
                    cx={v.x}
                    cy={v.y}
                    r="20"
                    className={
                      shownAssignment[v.id] === 0
                        ? "set-a"
                        : shownAssignment[v.id] === 1
                          ? "set-b"
                          : "unset"
                    }
                  />
                  <text x={v.x} y={v.y + 5}>
                    {numbers ? v.id : i + 1}
                  </text>
                </g>
              ))}
            </svg>
          </div>
          <div className="bp577-buttons">
            <button
              onClick={() =>
                act(() => {
                  setAssignment({});
                  setStep(0);
                })
              }
            >
              <RotateCcw />
              Clear
            </button>
            <button onClick={() => load("base")}>☆ Example: Bipartite</button>
            <button onClick={() => load("odd")}>
              <TriangleAlert />
              Example: Odd Cycle
            </button>
            <button
              onClick={() =>
                act(() =>
                  setVertices((vs) =>
                    vs.map((v, i) => ({
                      ...v,
                      x: v.x + (i % 2 ? 18 : -14),
                      y: v.y + ((i % 3) - 1) * 12,
                    })),
                  ),
                )
              }
            >
              <Shuffle />
              Shuffle
            </button>
          </div>
        </main>
        <aside>
          <header>
            <b>STATUS</b>
            <strong className={isBipartite ? "good" : "bad"}>
              {isBipartite ? "Bipartite ✓" : "Not bipartite ✕"}
            </strong>
          </header>
          <h4>Two-coloring (BFS)</h4>
          <div className="bp577-run">
            <button
              onClick={() =>
                act(() => {
                  setStep((n) => Math.min(bfs.order.length, n + 1));
                  setAssignment(bfs.assignment);
                })
              }
            >
              ↻ Step
            </button>
            <button
              disabled={!bfs.valid}
              onClick={() =>
                act(() => {
                  setStep(0);
                  setAssignment(bfs.assignment);
                  setAuto(true);
                })
              }
            >
              ◉ Auto
            </button>
            <button
              aria-label="Run BFS colouring"
              onClick={() =>
                act(() => {
                  setAssignment(bfs.assignment);
                  setStep(bfs.order.length);
                })
              }
            >
              <Play />
            </button>
          </div>
          <h4>Readouts</h4>
          <dl>
            <span>
              Vertices in A<b>{setA}</b>
            </span>
            <span>
              Vertices in B<b>{setB}</b>
            </span>
            <span>
              Edges<b>{edges.length}</b>
            </span>
            <span>
              Same-side conflicts
              <b className={bad.length ? "red" : "green"}>{bad.length}</b>
            </span>
            <span>
              Is bipartite?<b>{isBipartite ? "Yes" : "No"}</b>
            </span>
          </dl>
          <label>
            Edge labels
            <input
              type="checkbox"
              checked={labels}
              onChange={() => act(() => setLabels((v) => !v))}
            />
          </label>
          <label>
            Show numbers
            <input
              type="checkbox"
              checked={numbers}
              onChange={() => act(() => setNumbers((v) => !v))}
            />
          </label>
        </aside>
      </section>
      <section className="bp577-theory">
        <article>
          <h3>2. NOTICE THE PATTERN</h3>
          <p>◉ All edges connect A to B.</p>
          <p>◉ Two-coloring succeeds.</p>
          <p>◉ No same-side conflicts.</p>
          <strong>
            <Check />
            This graph is bipartite.
          </strong>
        </article>
        <article>
          <h3>3. UNDERSTAND THE RULE</h3>
          <p>
            A graph is bipartite if and only if it has no odd cycle.
            Equivalently, the vertices can be colored with two colors so that
            every edge joins vertices of different colors.
          </p>
          <section>
            <b>Definition (Bipartite Graph)</b>
            <p>
              A graph G = (V,E) is bipartite if V can be partitioned into two
              disjoint sets (A,B) such that every edge has one endpoint in A and
              the other in B.
            </p>
          </section>
        </article>
        <article>
          <h3>4. COMMON MISCONCEPTION</h3>
          <p>Placing adjacent vertices in the same set creates a conflict.</p>
          <div>
            <span>
              <i>A</i>—<i>B</i>
              <b>Set A</b>
            </span>
            <span>
              <b>Set B</b>
            </span>
          </div>
          <strong>Result: Same-side conflict ✕</strong>
        </article>
      </section>
      <section className="bp577-examples">
        <article>
          <h3>5. WORKED EXAMPLE</h3>
          <div>
            <section>
              <b>Example 1: Bipartite graph</b>
              <p>Two-color the given graph using BFS starting at A.</p>
              <MiniGraph />
            </section>
            <section>
              <table>
                <thead>
                  <tr>
                    <th>Step</th>
                    <th>Action</th>
                    <th>Coloring (A / B)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>0</td>
                    <td>Start at A.</td>
                    <td>A</td>
                  </tr>
                  <tr>
                    <td>1</td>
                    <td>Visit B, D.</td>
                    <td>A | B</td>
                  </tr>
                  <tr>
                    <td>2</td>
                    <td>Visit C (from B).</td>
                    <td>A | B</td>
                  </tr>
                  <tr>
                    <td>3</td>
                    <td>Visit E (from D).</td>
                    <td>A | B</td>
                  </tr>
                </tbody>
              </table>
              <p>Result: Valid two-coloring.</p>
              <b>Set A = {`{A, C, E}`}</b>
              <b>Set B = {`{B, D}`}</b>
              <strong>
                ✓ All edges go between sets.
                <br />
                No same-side conflicts.
              </strong>
            </section>
          </div>
        </article>
        <article>
          <h3>EXAMPLE 2: NOT BIPARTITE (ODD CYCLE)</h3>
          <p>The triangle has an odd cycle, so two-coloring fails.</p>
          <div>
            <MiniGraph odd />
            <section>
              <table>
                <thead>
                  <tr>
                    <th>Step</th>
                    <th>Action</th>
                    <th>Coloring</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>0</td>
                    <td>Start at X.</td>
                    <td>A</td>
                  </tr>
                  <tr>
                    <td>1</td>
                    <td>Visit Y, Z.</td>
                    <td>A | B</td>
                  </tr>
                  <tr>
                    <td>2</td>
                    <td>Edge Z–Y found.</td>
                    <td className="red">Conflict!</td>
                  </tr>
                </tbody>
              </table>
              <strong>
                Odd cycle (length 3) →<br />
                Not bipartite. ✕
              </strong>
              <p>Same-side conflicts = 1</p>
            </section>
          </div>
        </article>
      </section>
      <section className="bp577-practice">
        <div>
          <h3>6. TRY INDEPENDENTLY (CHALLENGE)</h3>
          <p>Classify the graph.</p>
          <svg
            viewBox="0 0 300 180"
            role="img"
            aria-label="Four vertex bipartite challenge"
          >
            {challengeEdges.map((e) => {
              const a = challengeVertices.find((v) => v.id === e.a)!,
                b = challengeVertices.find((v) => v.id === e.b)!;
              return (
                <g key={edgeKey(e)}>
                  <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} />
                  <text x={(a.x + b.x) / 2} y={(a.y + b.y) / 2 - 5}>
                    {e.label}
                  </text>
                </g>
              );
            })}
            {challengeVertices.map((v, i) => (
              <g key={v.id}>
                <circle
                  cx={v.x}
                  cy={v.y}
                  r="13"
                  className={i % 3 === 0 ? "set-b" : "set-a"}
                />
                <text x={v.x} y={v.y + 4}>
                  {v.id}
                </text>
              </g>
            ))}
          </svg>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            act(() => setGraded(answer === "bipartite"));
          }}
        >
          {[
            ["bipartite", "A  Bipartite"],
            ["not", "B  Not bipartite"],
            ["unknown", "C  Need more information"],
          ].map(([value, label]) => (
            <label key={value}>
              <input
                type="radio"
                name="bipartite-answer"
                value={value}
                checked={answer === value}
                onChange={(e) => setAnswer(e.target.value)}
              />
              {label}
            </label>
          ))}
          <button type="submit">
            <Check />
            Check answer
          </button>
        </form>
        <aside>
          <h4>Hint</h4>
          <p>
            Can the vertices be split into two sets so that every edge crosses
            between sets?
          </p>
          <b>Your answer:</b>
          <output className={graded ? "good" : graded === false ? "bad" : ""}>
            {graded
              ? "Bipartite — correct."
              : graded === false
                ? "Try alternating colours around the cycle."
                : "—"}
          </output>
        </aside>
      </section>
      <nav className="bp577-adjacent">
        <a href="/lessons/discrete-and-applied-mathematics/576-graph-colouring">
          ←{" "}
          <span>
            Previous<b>Graph Colouring</b>
          </span>
        </a>
        <a href="/lessons/discrete-and-applied-mathematics/578-planar-graphs">
          <span>
            Next<b>Planar Graphs</b>
          </span>{" "}
          →
        </a>
      </nav>
    </section>
  );
}
