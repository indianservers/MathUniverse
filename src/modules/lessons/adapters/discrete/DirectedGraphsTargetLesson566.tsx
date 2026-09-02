import { CheckCircle2, PlusCircle, RotateCcw, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { LessonAdapterProps } from "../../types";
import "../geometry3d/CoordinateSystemTargetLesson378.css";
import "./DirectedGraphsTargetLesson566.css";

type Vertex = { id: string; x: number; y: number; color: string };
type Edge = { from: string; to: string; weight: number };
type Snapshot = { vertices: Vertex[]; edges: Edge[] };
const initialVertices: Vertex[] = [
  { id: "A", x: 90, y: 175, color: "#78bf35" },
  { id: "B", x: 285, y: 70, color: "#1497b7" },
  { id: "C", x: 490, y: 150, color: "#1497b7" },
  { id: "D", x: 150, y: 345, color: "#1497b7" },
  { id: "E", x: 405, y: 350, color: "#a642c8" },
];
const initialEdges: Edge[] = [
  { from: "A", to: "B", weight: 1 },
  { from: "A", to: "D", weight: 2 },
  { from: "B", to: "C", weight: 3 },
  { from: "B", to: "E", weight: 4 },
  { from: "B", to: "D", weight: 5 },
  { from: "D", to: "E", weight: 6 },
  { from: "C", to: "E", weight: 7 },
];

export default function DirectedGraphsTargetLesson566({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [vertices, setVertices] = useState(initialVertices);
  const [edges, setEdges] = useState(initialEdges);
  const [selected, setSelected] = useState<string | null>(null);
  const [edgeStart, setEdgeStart] = useState<string | null>(null);
  const [mode, setMode] = useState<"select" | "vertex" | "edge" | "delete">(
    "select",
  );
  const [from, setFrom] = useState("A"),
    [to, setTo] = useState("E");
  const [path, setPath] = useState<string[]>(["A", "B", "E"]);
  const [history, setHistory] = useState<Snapshot[]>([]),
    [future, setFuture] = useState<Snapshot[]>([]);
  const [tab, setTab] = useState("Interact"),
    [checked, setChecked] = useState(false);
  const [actions, setActions] = useState(0);
  const degree = useMemo(
    () =>
      Object.fromEntries(
        vertices.map((v) => [
          v.id,
          {
            in: edges.filter((e) => e.to === v.id).length,
            out: edges.filter((e) => e.from === v.id).length,
          },
        ]),
      ),
    [vertices, edges],
  );
  const source = vertices.find((v) => degree[v.id].in === 0)?.id ?? "";
  const sink = vertices.find((v) => degree[v.id].out === 0)?.id ?? "";
  const commit = (change: () => void) => {
    setHistory((h) => [...h, { vertices, edges }]);
    setFuture([]);
    change();
    setActions((n) => n + 1);
    onInteraction();
  };
  const reset = () => {
    setVertices(initialVertices);
    setEdges(initialEdges);
    setSelected(null);
    setEdgeStart(null);
    setMode("select");
    setFrom("A");
    setTo("E");
    setPath(["A", "B", "E"]);
    setHistory([]);
    setFuture([]);
    setTab("Interact");
    setChecked(false);
    setActions(0);
  };
  useEffect(reset, [resetToken]);
  const findPath = () => {
    const queue: string[][] = [[from]],
      seen = new Set([from]);
    let found: string[] = [];
    while (queue.length) {
      const current = queue.shift()!;
      const last = current.at(-1)!;
      if (last === to) {
        found = current;
        break;
      }
      for (const edge of edges.filter((e) => e.from === last))
        if (!seen.has(edge.to)) {
          seen.add(edge.to);
          queue.push([...current, edge.to]);
        }
    }
    setPath(found);
    setActions((n) => n + 1);
    onInteraction();
  };
  const vertexClick = (id: string) => {
    if (mode === "delete")
      return commit(() => {
        setVertices((v) => v.filter((x) => x.id !== id));
        setEdges((es) => es.filter((e) => e.from !== id && e.to !== id));
      });
    if (mode === "edge") {
      if (!edgeStart) return setEdgeStart(id);
      if (
        edgeStart !== id &&
        !edges.some((e) => e.from === edgeStart && e.to === id)
      )
        commit(() =>
          setEdges((es) => [
            ...es,
            { from: edgeStart, to: id, weight: es.length + 1 },
          ]),
        );
      setEdgeStart(null);
      return;
    }
    setSelected(id);
    setActions((n) => n + 1);
    onInteraction();
  };
  const undo = () => {
    const previous = history.at(-1);
    if (!previous) return;
    setFuture((f) => [{ vertices, edges }, ...f]);
    setVertices(previous.vertices);
    setEdges(previous.edges);
    setHistory((h) => h.slice(0, -1));
    onInteraction();
  };
  const redo = () => {
    const next = future[0];
    if (!next) return;
    setHistory((h) => [...h, { vertices, edges }]);
    setVertices(next.vertices);
    setEdges(next.edges);
    setFuture((f) => f.slice(1));
    onInteraction();
  };
  return (
    <section
      className="dg566-page cs378-page"
      data-testid="discrete-mockup-0623"
      data-object-model="dedicated-directed-graph-degree-reachability-path-model"
      data-source={source}
      data-sink={sink}
      data-edge-count={edges.length}
      data-selected={selected ?? ""}
      data-mode={mode}
      data-path={path.join(",")}
      data-history={history.length}
      data-actions={actions}
    >
      <header className="dg566-hero">
        <button>Lesson info</button>
        <h1>566 Directed Graphs</h1>
        <h2>Directed Graphs — One-Way Relationships</h2>
        <p>
          <b>Objective:</b> Build and analyze directed graphs. Identify sources,
          sinks, in-degree and out-degree, and reachability.
        </p>
        <dl>
          <div>
            <dt>Subject</dt>
            <dd>Discrete Mathematics</dd>
          </div>
          <div>
            <dt>Difficulty</dt>
            <dd>Intermediate</dd>
          </div>
          <div>
            <dt>Duration</dt>
            <dd>6–10 min</dd>
          </div>
          <div>
            <dt>Tools</dt>
            <dd>Graph Builder</dd>
          </div>
          <div>
            <dt>Topics</dt>
            <dd>Directed edges, degree, path</dd>
          </div>
        </dl>
      </header>
      <nav className="dg566-tabs">
        {["Interact", "Learn", "Worked Example", "Formula", "Practice"].map(
          (name) => (
            <button
              key={name}
              className={tab === name ? "active" : ""}
              onClick={() => {
                setTab(name);
                onInteraction();
              }}
            >
              {name}
            </button>
          ),
        )}
      </nav>
      <section className="dg566-lab">
        <aside>
          <h3>
            <i>1</i> Observe
          </h3>
          <p>A directed graph models one-way connections between objects.</p>
          <b>Example</b>
          <p>A, B, C, D, E are places. Arrows show one-way roads.</p>
          <ul>
            <li>
              <span className="source">A</span> Source (out-degree &gt; 0,
              in-degree = 0)
            </li>
            <li>
              <span className="sink">E</span> Sink (in-degree &gt; 0, out-degree
              = 0)
            </li>
          </ul>
        </aside>
        <main>
          <header>
            <h3>
              <i>2</i> Manipulate <small>Build, explore, and measure.</small>
            </h3>
            <button onClick={reset}>
              <RotateCcw /> Reset graph
            </button>
          </header>
          <Graph
            vertices={vertices}
            edges={edges}
            degree={degree}
            selected={selected}
            edgeStart={edgeStart}
            onVertex={vertexClick}
          />
          <section className="dg566-tools">
            <div>
              <button
                onClick={() =>
                  commit(() => {
                    const id = String.fromCharCode(65 + vertices.length);
                    setVertices((current) => [
                      ...current,
                      { id, x: 535, y: 260, color: "#e4932d" },
                    ]);
                    setMode("select");
                  })
                }
              >
                <PlusCircle />
                Add vertex
              </button>
              <button onClick={() => setMode("edge")}>→ Add edge</button>
              <button onClick={() => setMode("delete")}>
                <Trash2 />
                Delete
              </button>
            </div>
            <div>
              <button disabled={!history.length} onClick={undo}>
                ↶ Undo
              </button>
              <button disabled={!future.length} onClick={redo}>
                ↷ Redo
              </button>
            </div>
            <div>
              <b>Select a vertex</b>
              {vertices.map((v) => (
                <button
                  key={v.id}
                  className={selected === v.id ? "active" : ""}
                  style={{ background: v.color }}
                  onClick={() => {
                    setMode("select");
                    setSelected(v.id);
                    setActions((count) => count + 1);
                    onInteraction();
                  }}
                >
                  {v.id}
                </button>
              ))}
            </div>
            <div>
              <b>Find path</b>
              <label>
                From
                <select value={from} onChange={(e) => setFrom(e.target.value)}>
                  {vertices.map((v) => (
                    <option key={v.id}>{v.id}</option>
                  ))}
                </select>
              </label>
              <label>
                To
                <select value={to} onChange={(e) => setTo(e.target.value)}>
                  {vertices.map((v) => (
                    <option key={v.id}>{v.id}</option>
                  ))}
                </select>
              </label>
              <button onClick={findPath}>Go</button>
            </div>
          </section>
        </main>
      </section>
      <section className="dg566-analysis">
        <article>
          <h3>Vertex summary</h3>
          <table>
            <thead>
              <tr>
                <th>Vertex</th>
                <th>In-degree</th>
                <th>Out-degree</th>
                <th>Type</th>
              </tr>
            </thead>
            <tbody>
              {vertices.map((v) => (
                <tr key={v.id}>
                  <td>{v.id}</td>
                  <td>{degree[v.id].in}</td>
                  <td>{degree[v.id].out}</td>
                  <td>
                    {degree[v.id].in === 0
                      ? "Source"
                      : degree[v.id].out === 0
                        ? "Sink"
                        : "Internal"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </article>
        <article>
          <h3>Edge list ({edges.length} directed edges)</h3>
          <ol>
            {edges.map((e) => (
              <li key={`${e.from}${e.to}`}>
                {e.from} → {e.to}
              </li>
            ))}
          </ol>
        </article>
        <article>
          <h3>Reachability</h3>
          <em>
            Path from {from} to {to}
          </em>
          <div className="dg566-path">
            {path.length
              ? path.map((v, i) => (
                  <span key={v}>
                    {i > 0 && "→ "}
                    <b>{v}</b>{" "}
                  </span>
                ))
              : "No directed path"}
          </div>
          <strong>Length: {Math.max(0, path.length - 1)} edges</strong>
          <hr />
          <em>Alternative paths</em>
          <p>A → D → E (length 2)</p>
        </article>
      </section>
      <section className="dg566-theory">
        <article>
          <h3>
            <i>3</i> Notice the pattern
          </h3>
          <p>✓ A has no incoming edges — source.</p>
          <p>✓ E has no outgoing edges — sink.</p>
          <p>✓ A can reach every other vertex.</p>
          <p>✓ Not every pair is connected.</p>
        </article>
        <article>
          <h3>
            <i>4</i> Understand the rule
          </h3>
          <p>In a directed graph G = (V,E):</p>
          <ul>
            <li>
              <b>In-degree:</b> edges entering v.
            </li>
            <li>
              <b>Out-degree:</b> edges leaving v.
            </li>
            <li>
              <b>Source:</b> in-degree = 0.
            </li>
            <li>
              <b>Sink:</b> out-degree = 0.
            </li>
          </ul>
        </article>
        <article>
          <h3>⚠ Common misconception</h3>
          <p>Ignoring direction changes the answer.</p>
          <p>
            <b>Can we go from E to A?</b>
          </p>
          <p className="no">No. Edges only go one way.</p>
        </article>
      </section>
      <section className="dg566-worked">
        <h3>Worked Example</h3>
        <div>
          <p>Given the graph above, answer:</p>
          <ol>
            <li>Which vertices are sources?</li>
            <li>Which vertices are sinks?</li>
            <li>What are the degrees of B?</li>
            <li>Give one path from A to E.</li>
          </ol>
        </div>
        <div>
          <b>Solution</b>
          <ol>
            <li>A is the only source.</li>
            <li>E is the only sink.</li>
            <li>For B: in-degree=2, out-degree=2.</li>
            <li>One path is A → B → E.</li>
          </ol>
        </div>
        <strong>
          <CheckCircle2 /> Verified
        </strong>
      </section>
      <section className="dg566-challenge">
        <h3>
          <i>5</i> Try independently
        </h3>
        <p>Build the graph shown and answer the questions.</p>
        <ChallengeGraph />
        <ol>
          <li>List all sources and sinks.</li>
          <li>Find in-degree and out-degree of each vertex.</li>
          <li>Is there a path from Q to T?</li>
          <li>Is there a path from T to P?</li>
        </ol>
        <button
          onClick={() => {
            setChecked(true);
            onInteraction();
          }}
        >
          Check my answers
        </button>
        {checked && (
          <strong>
            <CheckCircle2 /> P is the source; S and T are sinks.
          </strong>
        )}
      </section>
      <nav className="dg566-adjacent">
        <button>
          Previous
          <br />
          <b>Vertex and Edge Builder</b>
        </button>
        <button>
          Next
          <br />
          <b>Weighted Graphs</b>
        </button>
      </nav>
    </section>
  );
}

function Graph({
  vertices,
  edges,
  degree,
  selected,
  edgeStart,
  onVertex,
}: {
  vertices: Vertex[];
  edges: Edge[];
  degree: Record<string, { in: number; out: number }>;
  selected: string | null;
  edgeStart: string | null;
  onVertex: (id: string) => void;
}) {
  return (
    <svg className="dg566-graph" viewBox="0 0 580 410">
      <defs>
        <marker
          id="dg566-arrow"
          viewBox="0 0 10 10"
          refX="9"
          refY="5"
          markerWidth="7"
          markerHeight="7"
          orient="auto"
        >
          <path d="M0 0L10 5L0 10z" fill="white" />
        </marker>
      </defs>
      {edges.map((e) => {
        const a = vertices.find((v) => v.id === e.from)!,
          b = vertices.find((v) => v.id === e.to)!;
        return (
          <g key={`${e.from}${e.to}`}>
            <line
              x1={a.x}
              y1={a.y}
              x2={b.x}
              y2={b.y}
              markerEnd="url(#dg566-arrow)"
            />
            <text x={(a.x + b.x) / 2} y={(a.y + b.y) / 2 - 7}>
              {e.weight}
            </text>
          </g>
        );
      })}
      {vertices.map((v) => (
        <g
          key={v.id}
          data-testid={`directed-vertex-${v.id}`}
          className={selected === v.id || edgeStart === v.id ? "selected" : ""}
          onClick={() => onVertex(v.id)}
        >
          <circle cx={v.x} cy={v.y} r="22" fill={v.color} />
          <text x={v.x} y={v.y + 5} textAnchor="middle">
            {v.id}
          </text>
          <text
            className="degree"
            x={v.x}
            y={v.y + (v.y < 100 ? -35 : 42)}
            textAnchor="middle"
          >
            in: {degree[v.id].in} | out: {degree[v.id].out}
          </text>
        </g>
      ))}
    </svg>
  );
}
function ChallengeGraph() {
  return (
    <svg className="dg566-challenge-graph" viewBox="0 0 250 150">
      <defs>
        <marker
          id="dg566-small-arrow"
          viewBox="0 0 10 10"
          refX="9"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto"
        >
          <path d="M0 0L10 5L0 10z" />
        </marker>
      </defs>
      <g>
        {[
          [125, 20, 45, 65],
          [125, 20, 205, 65],
          [45, 65, 55, 130],
          [125, 20, 55, 130],
          [125, 20, 195, 130],
          [205, 65, 195, 130],
          [55, 130, 195, 130],
        ].map((p, i) => (
          <line
            key={i}
            x1={p[0]}
            y1={p[1]}
            x2={p[2]}
            y2={p[3]}
            markerEnd="url(#dg566-small-arrow)"
          />
        ))}
      </g>
      {[
        [125, 20, "P"],
        [45, 65, "Q"],
        [205, 65, "R"],
        [55, 130, "S"],
        [195, 130, "T"],
      ].map(([x, y, t], i) => (
        <g key={String(t)}>
          <circle
            cx={Number(x)}
            cy={Number(y)}
            r="15"
            className={i === 0 ? "p" : ""}
          />
          <text x={Number(x)} y={Number(y) + 4} textAnchor="middle">
            {t}
          </text>
        </g>
      ))}
    </svg>
  );
}
