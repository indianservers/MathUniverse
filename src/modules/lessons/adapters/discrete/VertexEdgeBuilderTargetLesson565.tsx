import {
  CheckCircle2,
  Hand,
  Lightbulb,
  MousePointer2,
  Plus,
  RotateCcw,
  Trash2,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import type { MouseEvent, PointerEvent } from "react";
import type { LessonAdapterProps } from "../../types";
import "../geometry3d/CoordinateSystemTargetLesson378.css";
import "./VertexEdgeBuilderTargetLesson565.css";

type Vertex = { id: string; x: number; y: number };
type Edge = { a: string; b: string; weight: number };
type Mode = "vertex" | "edge" | "move" | "delete";
const tabDetails: Record<string, string> = {
  Learn:
    "Vertices represent objects; edges represent pairwise connections between them.",
  "Worked Example":
    "The displayed graph has five vertices, seven edges, and total degree fourteen.",
  Formula:
    "Handshake Lemma: the sum of all vertex degrees equals twice the number of edges.",
  Practice:
    "Create a six-vertex, eight-edge graph and verify that its degree sum is sixteen.",
};
const initialVertices: Vertex[] = [
  { id: "A", x: 105, y: 150 },
  { id: "B", x: 275, y: 50 },
  { id: "C", x: 485, y: 150 },
  { id: "D", x: 225, y: 365 },
  { id: "E", x: 440, y: 365 },
];
const initialEdges: Edge[] = [
  { a: "A", b: "B", weight: 2 },
  { a: "B", b: "C", weight: 3 },
  { a: "C", b: "E", weight: 1 },
  { a: "E", b: "D", weight: 5 },
  { a: "D", b: "A", weight: 1 },
  { a: "B", b: "D", weight: 4 },
  { a: "B", b: "E", weight: 2 },
];
const edgeKey = (a: string, b: string) => [a, b].sort().join("");

export default function VertexEdgeBuilderTargetLesson565({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [vertices, setVertices] = useState(initialVertices),
    [edges, setEdges] = useState(initialEdges),
    [mode, setMode] = useState<Mode>("edge"),
    [directed, setDirected] = useState(false),
    [selected, setSelected] = useState<string | null>(null),
    [zoom, setZoom] = useState(100),
    [tab, setTab] = useState("Interact"),
    [challenge, setChallenge] = useState(false),
    [hint, setHint] = useState(false),
    [actions, setActions] = useState(0),
    [dragging, setDragging] = useState<string | null>(null);
  const moved = useRef(false);
  const degrees = useMemo(
      () =>
        Object.fromEntries(
          vertices.map((v) => [
            v.id,
            edges.reduce(
              (sum, e) => sum + (e.a === v.id || e.b === v.id ? 1 : 0),
              0,
            ),
          ]),
        ),
      [vertices, edges],
    ),
    degreeSum = Object.values(degrees).reduce((a, b) => a + b, 0),
    adjacency = useMemo(
      () =>
        Object.fromEntries(
          vertices.map((v) => [
            v.id,
            edges
              .filter((e) => e.a === v.id || e.b === v.id)
              .map((e) => (e.a === v.id ? e.b : e.a))
              .sort(),
          ]),
        ),
      [vertices, edges],
    ),
    handshake = degreeSum === 2 * edges.length;
  const act = (fn: () => void) => {
    fn();
    setActions((v) => v + 1);
    onInteraction();
  };
  const reset = () => {
    setVertices(initialVertices);
    setEdges(initialEdges);
    setMode("edge");
    setDirected(false);
    setSelected(null);
    setZoom(100);
    setTab("Interact");
    setChallenge(false);
    setHint(false);
    setActions(0);
    setDragging(null);
  };
  useEffect(reset, [resetToken]);
  const vertexClick = (id: string) => {
    if (moved.current) {
      moved.current = false;
      return;
    }
    act(() => {
      if (mode === "delete") {
        setVertices((old) => old.filter((v) => v.id !== id));
        setEdges((old) => old.filter((e) => e.a !== id && e.b !== id));
        setSelected(null);
        return;
      }
      if (mode !== "edge") return;
      if (!selected) {
        setSelected(id);
        return;
      }
      if (selected === id) {
        setSelected(null);
        return;
      }
      const key = edgeKey(selected, id);
      setEdges((old) =>
        old.some((e) => edgeKey(e.a, e.b) === key)
          ? old
          : [...old, { a: selected, b: id, weight: 1 }],
      );
      setSelected(null);
    });
  };
  const canvasClick = (event: MouseEvent<SVGSVGElement>) => {
    if (mode !== "vertex" || event.target !== event.currentTarget) return;
    const rect = event.currentTarget.getBoundingClientRect(),
      x = ((event.clientX - rect.left) / rect.width) * 600,
      y = ((event.clientY - rect.top) / rect.height) * 440;
    act(() => {
      const id = String.fromCharCode(65 + vertices.length);
      setVertices((old) => [...old, { id, x, y }]);
    });
  };
  const moveVertex = (event: PointerEvent<SVGSVGElement>) => {
    if (!dragging) return;
    const rect = event.currentTarget.getBoundingClientRect(),
      x = Math.max(
        25,
        Math.min(575, ((event.clientX - rect.left) / rect.width) * 600),
      ),
      y = Math.max(
        25,
        Math.min(415, ((event.clientY - rect.top) / rect.height) * 440),
      );
    moved.current = true;
    setVertices((old) =>
      old.map((v) => (v.id === dragging ? { ...v, x, y } : v)),
    );
    onInteraction();
  };
  const removeEdge = (a: string, b: string) =>
    act(() =>
      setEdges((old) => old.filter((e) => edgeKey(e.a, e.b) !== edgeKey(a, b))),
    );
  const newChallenge = () =>
    act(() => {
      const next = [...initialVertices, { id: "F", x: 540, y: 290 }];
      setVertices(next);
      setEdges([...initialEdges, { a: "C", b: "F", weight: 1 }]);
      setChallenge(true);
      setSelected(null);
    });
  return (
    <section
      className="cs378-page graph565-page"
      data-testid="discrete-mockup-0622"
      data-object-model="dedicated-editable-vertex-edge-svg-graph-drag-degree-adjacency-handshake-challenge"
      data-direct-interaction="true"
      data-vertices={vertices.length}
      data-edges={edges.length}
      data-degree-sum={degreeSum}
      data-handshake={handshake}
      data-mode={mode}
      data-directed={directed}
      data-selected={selected ?? ""}
      data-positions={vertices
        .map((v) => `${v.id}:${Math.round(v.x)},${Math.round(v.y)}`)
        .join(";")}
      data-challenge={challenge}
      data-actions={actions}
    >
      <header className="graph565-hero">
        <div>
          <small>DISCRETE AND APPLIED MATHEMATICS</small>
          <small>COMBINATORICS, GRAPH THEORY AND LOGIC</small>
          <h1>Vertex and Edge Builder</h1>
          <p>
            <b>Objective:</b> Build a simple undirected graph, add edges, and
            observe how vertices (V), edges (E), degrees, and adjacency list
            change.
          </p>
        </div>
        <aside>
          <span>
            Level<b>Intermediate</b>
          </span>
          <span>
            Time<b>6-10 min</b>
          </span>
        </aside>
      </header>
      <nav className="graph565-tabs">
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
        <div className="graph565-tab-panel" role="status">
          <b>{tab}</b>
          <span>{tabDetails[tab]}</span>
        </div>
      )}
      <section className="graph565-workspace">
        <main>
          <h2>Build your graph</h2>
          <p>
            Add vertices, connect them with edges, and watch the counts and
            degrees update live.
          </p>
          <div className="graph565-canvas">
            <aside>
              <button
                className={mode === "edge" ? "active" : ""}
                onClick={() => act(() => setMode("edge"))}
              >
                <MousePointer2 />
              </button>
              <button
                className={mode === "move" ? "active" : ""}
                onClick={() => act(() => setMode("move"))}
              >
                <Hand />
              </button>
              <button
                className={mode === "delete" ? "active" : ""}
                onClick={() => act(() => setMode("delete"))}
              >
                <Trash2 />
              </button>
            </aside>
            <svg
              viewBox="0 0 600 440"
              onClick={canvasClick}
              onPointerMove={moveVertex}
              onPointerUp={() => setDragging(null)}
              onPointerLeave={() => setDragging(null)}
            >
              {directed && (
                <defs>
                  <marker
                    id="arrow565"
                    viewBox="0 0 10 10"
                    refX="9"
                    refY="5"
                    markerWidth="7"
                    markerHeight="7"
                    orient="auto-start-reverse"
                  >
                    <path d="M0 0L10 5L0 10z" fill="#d7e3f0" />
                  </marker>
                </defs>
              )}
              <g
                data-testid="graph-zoom-layer"
                transform={`translate(300 220) scale(${zoom / 100}) translate(-300 -220)`}
              >
                {edges.map((edge) => {
                  const a = vertices.find((v) => v.id === edge.a)!,
                    b = vertices.find((v) => v.id === edge.b)!;
                  if (!a || !b) return null;
                  return (
                    <g
                      key={edgeKey(edge.a, edge.b)}
                      onClick={(event) => {
                        event.stopPropagation();
                        removeEdge(edge.a, edge.b);
                      }}
                      className="graph565-edge"
                    >
                      <line
                        x1={a.x}
                        y1={a.y}
                        x2={b.x}
                        y2={b.y}
                        markerEnd={directed ? "url(#arrow565)" : undefined}
                      />
                      <text x={(a.x + b.x) / 2} y={(a.y + b.y) / 2 - 7}>
                        {edge.weight}
                      </text>
                    </g>
                  );
                })}
                {vertices.map((vertex) => (
                  <g
                    key={vertex.id}
                    data-testid={`graph-vertex-${vertex.id}`}
                    className={selected === vertex.id ? "selected" : ""}
                    transform={`translate(${vertex.x} ${vertex.y})`}
                    onPointerDown={(event) => {
                      if (mode === "move") {
                        moved.current = false;
                        setDragging(vertex.id);
                        event.currentTarget.setPointerCapture(event.pointerId);
                      }
                    }}
                    onClick={(event) => {
                      event.stopPropagation();
                      vertexClick(vertex.id);
                    }}
                  >
                    <circle r="22" />
                    <text textAnchor="middle" dy="5">
                      {vertex.id}
                    </text>
                  </g>
                ))}
              </g>
            </svg>
            <div className="graph565-zoom">
              <button
                onClick={() => act(() => setZoom((v) => Math.max(60, v - 10)))}
              >
                <ZoomOut />
              </button>
              <output>{zoom}%</output>
              <button
                onClick={() => act(() => setZoom((v) => Math.min(160, v + 10)))}
              >
                <ZoomIn />
              </button>
            </div>
          </div>
          <section className="graph565-controls">
            <div>
              <b>Mode</b>
              <button
                className={mode === "vertex" ? "active" : ""}
                onClick={() => act(() => setMode("vertex"))}
              >
                <Plus />
                Add Vertex
              </button>
              <button
                className={mode === "edge" ? "active" : ""}
                onClick={() => act(() => setMode("edge"))}
              >
                Add Edge
              </button>
            </div>
            <div>
              <b>Edge style</b>
              <button
                className={!directed ? "active" : ""}
                onClick={() => act(() => setDirected(false))}
              >
                Undirected
              </button>
              <button
                className={directed ? "active" : ""}
                onClick={() => act(() => setDirected(true))}
              >
                Directed
              </button>
            </div>
          </section>
          <footer>
            <Lightbulb /> Tip: Click a vertex, then another vertex to create an
            edge. Click an edge to remove it.
          </footer>
        </main>
        <aside>
          <h2>Live readouts</h2>
          <article>
            Vertices (V)<strong>{vertices.length}</strong>
          </article>
          <article>
            Edges (E)<strong>{edges.length}</strong>
          </article>
          <article>
            Sum of degrees<strong>{degreeSum}</strong>
          </article>
          <article>
            Check: ∑deg(v)=2E
            <strong>
              {degreeSum} = 2 × {edges.length} {handshake ? "✓" : "✕"}
            </strong>
          </article>
          <section>
            <h3>Degrees</h3>
            {vertices.map((v) => (
              <p key={v.id}>
                deg({v.id}) = {degrees[v.id]}
              </p>
            ))}
          </section>
          <section>
            <h3>Adjacency list</h3>
            {vertices.map((v) => (
              <p key={v.id}>
                {v.id}: {adjacency[v.id].join(", ") || "—"}
              </p>
            ))}
          </section>
        </aside>
      </section>
      <section className="graph565-bottom">
        <article>
          <h3>Worked example (correct)</h3>
          <MiniGraph />
          <p>
            <CheckCircle2 /> V = 5<br />
            <CheckCircle2 /> E = 7<br />
            <CheckCircle2 /> ∑deg(v) = 14
            <br />
            <CheckCircle2 /> 14 = 2 × 7 ✓
          </p>
        </article>
        <article>
          <h3>Key rule / definition</h3>
          <b>Handshake Lemma</b>
          <p>In any undirected graph,</p>
          <output>∑ deg(v) = 2E</output>
          <p>Each edge contributes 2 to the total degree count.</p>
          <aside>
            <b>Common misconception</b>
            <p>Forgetting to count both endpoints leads to an incorrect sum.</p>
          </aside>
        </article>
        <article>
          <h3>Your challenge</h3>
          <p>Build a different simple graph with V=6 and E=8.</p>
          <p>Then check: Sum of degrees=16 and ∑deg(v)=2E=16</p>
          <button onClick={newChallenge}>
            <RotateCcw />
            New challenge
          </button>
          <button onClick={() => act(() => setHint((v) => !v))}>
            Need a hint?
          </button>
          {hint && <p>Add one vertex and connect it to an existing vertex.</p>}
        </article>
      </section>
      <nav className="graph565-adjacent">
        <button>
          Previous Lesson
          <br />
          <b>Pigeonhole Principle</b>
        </button>
        <span>● ● ● ● ● ○ ○ ○ ○ ○</span>
        <button>
          Next Lesson
          <br />
          <b>Directed Graphs</b>
        </button>
      </nav>
    </section>
  );
}
function MiniGraph() {
  return (
    <svg className="graph565-mini" viewBox="0 0 180 120">
      <path d="M20 60L90 15L160 60L140 108H55Z M90 15L55 108M90 15L140 108" />
      <g>
        <circle cx="20" cy="60" r="9" />
        <circle cx="90" cy="15" r="9" />
        <circle cx="160" cy="60" r="9" />
        <circle cx="55" cy="108" r="9" />
        <circle cx="140" cy="108" r="9" />
      </g>
    </svg>
  );
}
