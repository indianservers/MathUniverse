import { Lightbulb, Plus, RotateCcw, Shuffle, Trophy } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import type { PointerEvent } from "react";
import type { LessonAdapterProps } from "../../types";
import "../geometry3d/CoordinateSystemTargetLesson378.css";
import "./MinimumSpanningTreeTargetLesson574.css";

type Vertex = { id: string; x: number; y: number };
type Edge = { a: string; b: string; weight: number };
type Graph = { vertices: Vertex[]; edges: Edge[] };
const vertices: Vertex[] = [
  { id: "A", x: 80, y: 95 },
  { id: "B", x: 285, y: 40 },
  { id: "C", x: 500, y: 95 },
  { id: "D", x: 145, y: 310 },
  { id: "E", x: 430, y: 310 },
];
const baseEdges: Edge[] = [
  { a: "A", b: "D", weight: 1 },
  { a: "C", b: "E", weight: 1 },
  { a: "A", b: "B", weight: 2 },
  { a: "B", b: "E", weight: 2 },
  { a: "B", b: "C", weight: 3 },
  { a: "B", b: "D", weight: 4 },
  { a: "D", b: "E", weight: 5 },
];
const alternateEdges: Edge[] = [
  { a: "A", b: "B", weight: 1 },
  { a: "D", b: "E", weight: 1 },
  { a: "B", b: "C", weight: 2 },
  { a: "C", b: "E", weight: 2 },
  { a: "A", b: "D", weight: 3 },
  { a: "B", b: "E", weight: 4 },
  { a: "B", b: "D", weight: 5 },
];
const challengeEdges: Edge[] = [
  { a: "B", b: "C", weight: 1 },
  { a: "A", b: "D", weight: 2 },
  { a: "C", b: "E", weight: 2 },
  { a: "B", b: "E", weight: 3 },
  { a: "A", b: "B", weight: 4 },
  { a: "D", b: "E", weight: 4 },
  { a: "B", b: "D", weight: 5 },
];
const key = (a: string, b: string) => [a, b].sort().join("");
function forest(vertexIds: string[], edges: Edge[]) {
  const parent = Object.fromEntries(vertexIds.map((id) => [id, id]));
  const find = (id: string): string =>
    parent[id] === id ? id : (parent[id] = find(parent[id]));
  for (const edge of edges) {
    const a = find(edge.a),
      b = find(edge.b);
    if (a === b) return false;
    parent[a] = b;
  }
  return true;
}
function mst(graph: Graph) {
  const chosen: Edge[] = [];
  for (const edge of [...graph.edges].sort(
    (a, b) => a.weight - b.weight || key(a.a, a.b).localeCompare(key(b.a, b.b)),
  ))
    if (
      forest(
        graph.vertices.map((v) => v.id),
        [...chosen, edge],
      )
    ) {
      chosen.push(edge);
      if (chosen.length === graph.vertices.length - 1) break;
    }
  return {
    edges: chosen,
    weight: chosen.reduce((sum, e) => sum + e.weight, 0),
  };
}
function connected(ids: string[], edges: Edge[]) {
  if (!ids.length) return true;
  const seen = new Set([ids[0]]),
    queue = [ids[0]];
  while (queue.length) {
    const at = queue.shift()!;
    for (const e of edges.filter((edge) => edge.a === at || edge.b === at)) {
      const next = e.a === at ? e.b : e.a;
      if (!seen.has(next)) {
        seen.add(next);
        queue.push(next);
      }
    }
  }
  return seen.size === ids.length;
}
const tabCopy: Record<string, string> = {
  Learn: "A spanning tree connects every vertex without cycles.",
  "Worked Example":
    "Kruskal repeatedly accepts the lightest edge that does not create a cycle.",
  Formula: "An MST has |V|-1 edges and minimum possible total weight.",
  Practice:
    "Build a spanning tree and compare its cost with the computed optimum.",
};

function GraphView({
  graph,
  positions,
  selected = [],
  rejected = [],
  onEdge,
  onVertexDown,
  onVertexClick,
}: {
  graph: Graph;
  positions: Vertex[];
  selected?: string[];
  rejected?: string[];
  onEdge?: (edge: Edge) => void;
  onVertexDown?: (event: PointerEvent<SVGGElement>, id: string) => void;
  onVertexClick?: (id: string) => void;
}) {
  return (
    <svg
      className="mst574-graph"
      viewBox="0 0 580 370"
      role="img"
      aria-label="Weighted graph for minimum spanning tree"
    >
      {graph.edges.map((edge) => {
        const a = positions.find((v) => v.id === edge.a)!,
          b = positions.find((v) => v.id === edge.b)!,
          k = key(edge.a, edge.b);
        return (
          <g
            key={k}
            data-testid={`mst-edge-${k}`}
            className={
              selected.includes(k)
                ? "chosen"
                : rejected.includes(k)
                  ? "rejected"
                  : ""
            }
            onClick={() => onEdge?.(edge)}
          >
            <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} />
            <circle cx={(a.x + b.x) / 2} cy={(a.y + b.y) / 2} r="13" />
            <text x={(a.x + b.x) / 2} y={(a.y + b.y) / 2 + 4}>
              {edge.weight}
            </text>
          </g>
        );
      })}
      {positions.map((v) => (
        <g
          key={v.id}
          data-testid={`mst-vertex-${v.id}`}
          className="vertex"
          onPointerDown={(e) => onVertexDown?.(e, v.id)}
          onClick={() => onVertexClick?.(v.id)}
        >
          <circle cx={v.x} cy={v.y} r="22" />
          <text x={v.x} y={v.y + 5}>
            {v.id}
          </text>
        </g>
      ))}
    </svg>
  );
}

export default function MinimumSpanningTreeTargetLesson574({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [graphMode, setGraphMode] = useState<
      "base" | "alternate" | "challenge"
    >("base"),
    [positions, setPositions] = useState(vertices),
    [algorithm, setAlgorithm] = useState<"kruskal" | "prim">("kruskal"),
    [selected, setSelected] = useState<Edge[]>([]),
    [rejected, setRejected] = useState<string[]>([]),
    [showOrder, setShowOrder] = useState(true),
    [tab, setTab] = useState("Interact"),
    [message, setMessage] = useState(
      "Add low-weight edges while avoiding cycles.",
    ),
    [dragging, setDragging] = useState<string | null>(null),
    [actions, setActions] = useState(0);
  const moved = useRef(false),
    edges =
      graphMode === "base"
        ? baseEdges
        : graphMode === "alternate"
          ? alternateEdges
          : challengeEdges,
    graph = useMemo(() => ({ vertices: positions, edges }), [positions, edges]),
    optimal = useMemo(() => mst(graph), [graph]),
    selectedKeys = selected.map((e) => key(e.a, e.b)),
    weight = selected.reduce((sum, e) => sum + e.weight, 0),
    complete =
      selected.length === positions.length - 1 &&
      connected(
        positions.map((v) => v.id),
        selected,
      ),
    difference = complete ? weight - optimal.weight : 0;
  const act = (fn: () => void) => {
    fn();
    setActions((n) => n + 1);
    onInteraction();
  };
  const resetSelection = () => {
    setSelected([]);
    setRejected([]);
    setMessage("Add low-weight edges while avoiding cycles.");
  };
  const reset = () => {
    setGraphMode("base");
    setPositions(vertices);
    setAlgorithm("kruskal");
    setSelected([]);
    setRejected([]);
    setShowOrder(true);
    setTab("Interact");
    setMessage("Add low-weight edges while avoiding cycles.");
    setDragging(null);
    setActions(0);
  };
  useEffect(reset, [resetToken]);
  const add = (edge: Edge) => {
    const k = key(edge.a, edge.b);
    if (selectedKeys.includes(k)) return;
    act(() => {
      if (algorithm === "prim" && selected.length) {
        const reached = new Set(selected.flatMap((e) => [e.a, e.b]));
        if (reached.has(edge.a) === reached.has(edge.b)) {
          setRejected((r) => [...new Set([...r, k])]);
          setMessage(
            `Prim rejected ${edge.a}-${edge.b}: choose a frontier edge.`,
          );
          return;
        }
      } else if (
        algorithm === "prim" &&
        !selected.length &&
        !edge.a.includes("A") &&
        !edge.b.includes("A")
      ) {
        setRejected((r) => [...new Set([...r, k])]);
        setMessage("Prim starts at A; choose an edge incident to A.");
        return;
      }
      if (
        !forest(
          positions.map((v) => v.id),
          [...selected, edge],
        )
      ) {
        setRejected((r) => [...new Set([...r, k])]);
        setMessage(`Rejected ${edge.a}-${edge.b}: it creates a cycle.`);
        return;
      }
      setSelected((current) => [...current, edge]);
      setRejected((r) => r.filter((id) => id !== k));
      setMessage(
        selected.length + 1 === positions.length - 1
          ? "Spanning tree complete."
          : `Added ${edge.a}-${edge.b} with weight ${edge.weight}.`,
      );
    });
  };
  const move = (event: PointerEvent<SVGSVGElement>) => {
    if (!dragging) return;
    const box = event.currentTarget.getBoundingClientRect(),
      x = Math.max(
        22,
        Math.min(558, ((event.clientX - box.left) / box.width) * 580),
      ),
      y = Math.max(
        22,
        Math.min(348, ((event.clientY - box.top) / box.height) * 370),
      );
    moved.current = true;
    setPositions((vs) =>
      vs.map((v) => (v.id === dragging ? { ...v, x, y } : v)),
    );
    onInteraction();
  };
  const changeGraph = (mode: "base" | "alternate" | "challenge") =>
    act(() => {
      setGraphMode(mode);
      setPositions(vertices);
      resetSelection();
      setMessage(
        mode === "challenge"
          ? "Challenge started: find the MST."
          : "New graph loaded with recalculated edge order.",
      );
    });
  const ordered = [...edges].sort(
    (a, b) => a.weight - b.weight || key(a.a, a.b).localeCompare(key(b.a, b.b)),
  );
  return (
    <section
      className="mst574-page cs378-page"
      data-testid="discrete-mockup-0631"
      data-object-model="dedicated-union-find-mst-selection-model"
      data-algorithm={algorithm}
      data-graph={graphMode}
      data-selected-count={selected.length}
      data-selected-edges={selectedKeys.join(",")}
      data-total-weight={weight}
      data-optimal-weight={optimal.weight}
      data-complete={complete}
      data-difference={difference}
      data-rejected={rejected.join(",")}
      data-positions={positions
        .map((v) => `${v.id}:${Math.round(v.x)},${Math.round(v.y)}`)
        .join(";")}
      data-actions={actions}
    >
      <header className="mst574-hero">
        <small>DISCRETE AND APPLIED MATHEMATICS</small>
        <h1>Minimum Spanning Tree</h1>
        <p>Connect all vertices at minimum total weight; avoid cycles.</p>
        <dl>
          <span>
            ♙ <b>Level:</b> Intermediate–Advanced
          </span>
          <span>
            ▣ <b>Lab:</b> Discrete Math
          </span>
          <span>
            ◉ <b>Topics:</b> Graph Theory, Greedy Algorithms
          </span>
          <span>
            ◷ <b>Time:</b> 6–10 min
          </span>
        </dl>
      </header>
      <nav className="mst574-tabs">
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
        <p className="mst574-tab-note">
          <b>{tab}</b> {tabCopy[tab]}
        </p>
      )}
      <section className="mst574-sequence">
        {[
          ["1", "Observe", "Explore the graph and edge weights."],
          ["2", "Manipulate", "Add edges in increasing weight; avoid cycles."],
          ["3", "Notice the pattern", "See how a tree forms with least cost."],
          [
            "4",
            "Understand the rule",
            "Learn the definition and key property.",
          ],
          ["5", "Try independently", "Solve a challenge on your own."],
        ].map((item) => (
          <article key={item[0]}>
            <b>{item[0]}</b>
            <span>
              <strong>{item[1]}</strong>
              <small>{item[2]}</small>
            </span>
          </article>
        ))}
      </section>
      <section className="mst574-builder">
        <header>
          <h2>Build the Minimum Spanning Tree</h2>
          <button onClick={() => act(resetSelection)}>
            <RotateCcw />
            Reset
          </button>
          <button
            onClick={() =>
              changeGraph(graphMode === "base" ? "alternate" : "base")
            }
          >
            <Shuffle />
            New graph
          </button>
        </header>
        <div className="mst574-builder-grid">
          <main>
            <div className="mst574-algorithm">
              <span>Algorithm</span>
              <button
                className={algorithm === "kruskal" ? "active" : ""}
                onClick={() =>
                  act(() => {
                    setAlgorithm("kruskal");
                    resetSelection();
                  })
                }
              >
                Kruskal
              </button>
              <button
                className={algorithm === "prim" ? "active" : ""}
                onClick={() =>
                  act(() => {
                    setAlgorithm("prim");
                    resetSelection();
                  })
                }
              >
                Prim
              </button>
              <label>
                <input
                  aria-label="Show edge order"
                  type="checkbox"
                  checked={showOrder}
                  onChange={() => act(() => setShowOrder((v) => !v))}
                />
                Show edge order
              </label>
            </div>
            <div
              onPointerMove={move}
              onPointerUp={() => setDragging(null)}
              onPointerLeave={() => setDragging(null)}
            >
              <GraphView
                graph={graph}
                positions={positions}
                selected={selectedKeys}
                rejected={rejected}
                onEdge={add}
                onVertexDown={(event, id) => {
                  setDragging(id);
                  event.currentTarget.setPointerCapture(event.pointerId);
                }}
                onVertexClick={() => {
                  if (moved.current) moved.current = false;
                }}
              />
            </div>
            <p>
              <Lightbulb />
              Tip: For{" "}
              {algorithm === "kruskal"
                ? "Kruskal, add edges from smallest to largest weight, avoiding cycles."
                : "Prim, grow one connected tree from A using the lightest frontier edge."}
            </p>
          </main>
          <aside>
            <section>
              <h3>Edge order (smallest → largest)</h3>
              {showOrder && (
                <table>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Edge</th>
                      <th>Weight</th>
                      <th>Add</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ordered.map((edge, i) => (
                      <tr key={key(edge.a, edge.b)}>
                        <td>{i + 1}</td>
                        <td>
                          {edge.a}–{edge.b}
                        </td>
                        <td>{edge.weight}</td>
                        <td>
                          <button
                            aria-label={`Add edge ${edge.a}-${edge.b}`}
                            onClick={() => add(edge)}
                          >
                            <Plus />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </section>
            <section>
              <h3>Current selection</h3>
              <p>
                Edges chosen: <b>{selected.length}</b>
              </p>
              <p>
                Total weight: <b>{weight}</b>
              </p>
              <p>
                Edges needed:{" "}
                <b>{Math.max(0, positions.length - 1 - selected.length)}</b>
              </p>
              <p>
                Status:{" "}
                <b>
                  {complete
                    ? difference === 0
                      ? "Optimal MST"
                      : "Spanning tree"
                    : "–"}
                </b>
              </p>
              <progress value={selected.length} max={positions.length - 1} />
              <small>
                {selected.length} / {positions.length - 1} edges
              </small>
              <output>{message}</output>
            </section>
          </aside>
        </div>
        <footer>
          <b>Edge states</b>
          <span>
            <i />
            Chosen (part of tree)
          </span>
          <span>
            <i />
            Considered (creates cycle)
          </span>
          <span>
            <i />
            Not chosen yet
          </span>
          <span>
            <i />
            Not selected
          </span>
        </footer>
      </section>
      <section className="mst574-theory">
        <article>
          <h3>
            Worked Example <b>Correct MST</b>
          </h3>
          <GraphView
            graph={{ vertices, edges: baseEdges }}
            positions={vertices}
            selected={["AD", "CE", "AB", "BE"]}
          />
          <p>
            <b>Chosen edges:</b> A–D(1), C–E(1), A–B(2), B–E(2)
          </p>
          <p>
            <b>Total weight = 1 + 1 + 2 + 2 = 6</b>
          </p>
        </article>
        <article>
          <h3>Key Rule</h3>
          <p>
            A Minimum Spanning Tree (MST) is a set of |V| − 1 edges that
            connects all vertices with minimum possible total weight and
            contains no cycles.
          </p>
          <h4>Properties</h4>
          <ul>
            <li>✓ An MST always has |V| − 1 edges.</li>
            <li>✓ Adding any other edge creates a cycle.</li>
            <li>✓ An MST may not be unique.</li>
          </ul>
          <aside>
            <b>⚠ Common Misconception</b>
            <p>
              Choosing a low-weight edge can create a cycle. Always skip edges
              that connect vertices already connected in your growing tree.
            </p>
          </aside>
        </article>
        <article>
          <h3>Your Challenge</h3>
          <p>Find the MST for this graph.</p>
          <GraphView
            graph={{ vertices, edges: challengeEdges }}
            positions={vertices}
          />
          <p>Goal: Connect all vertices with minimum total weight.</p>
          <button onClick={() => changeGraph("challenge")}>
            Start Challenge
          </button>
        </article>
      </section>
      <section className="mst574-summary">
        <h3>
          MST Summary <small>(when complete)</small>
        </h3>
        <dl>
          <span>
            Chosen edges<b>{complete ? selected.length : "–"}</b>
          </span>
          <span>
            Total weight<b>{complete ? weight : "–"}</b>
          </span>
          <span>
            Optimal weight<b>{optimal.weight}</b>
          </span>
          <span>
            Difference<b>{complete ? difference : 0}</b>
          </span>
        </dl>
        <output
          className={
            complete && difference === 0 ? "good" : complete ? "bad" : ""
          }
        >
          <Trophy />
          <b>
            {complete && difference === 0
              ? "Great! You matched the optimal MST weight."
              : complete
                ? `Valid tree, but ${difference} above optimum.`
                : "Complete a spanning tree to compare."}
          </b>
        </output>
      </section>
      <nav className="mst574-adjacent">
        <a href="/lessons/discrete-and-applied-mathematics/573-trees">
          ←{" "}
          <span>
            Previous<b>Trees</b>
          </span>
        </a>
        <a href="/lessons/discrete-and-applied-mathematics/575-shortest-path">
          <span>
            Next<b>Shortest Path</b>
          </span>{" "}
          →
        </a>
      </nav>
    </section>
  );
}
