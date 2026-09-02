import {
  Lightbulb,
  Maximize2,
  Save,
  Share2,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import type { PointerEvent } from "react";
import type { LessonAdapterProps } from "../../types";
import "../geometry3d/CoordinateSystemTargetLesson378.css";
import "./WeightedGraphsTargetLesson567.css";

type Vertex = { id: string; x: number; y: number; color: string };
type Edge = { a: string; b: string; weight: number };
const initialVertices: Vertex[] = [
  { id: "A", x: 70, y: 100, color: "#ef9415" },
  { id: "B", x: 270, y: 55, color: "#1599b2" },
  { id: "C", x: 470, y: 105, color: "#1599b2" },
  { id: "D", x: 95, y: 340, color: "#1599b2" },
  { id: "E", x: 405, y: 340, color: "#1599b2" },
];
const initialEdges: Edge[] = [
  { a: "A", b: "B", weight: 2 },
  { a: "A", b: "D", weight: 1 },
  { a: "B", b: "C", weight: 3 },
  { a: "B", b: "D", weight: 4 },
  { a: "B", b: "E", weight: 2 },
  { a: "C", b: "E", weight: 1 },
  { a: "D", b: "E", weight: 5 },
];
const edgeKey = (a: string, b: string) => [a, b].sort().join("");
const tabText: Record<string, string> = {
  Learn: "Weights represent measurable costs such as distance, time, or price.",
  "Worked Example":
    "Compare complete path totals, not only the number of edges.",
  Formula: "For a path P, add every edge weight: cost(P) = Σw(vᵢ,vᵢ₊₁).",
  Practice:
    "Build a valid A-to-E route and verify it against the computed minimum.",
};
function allPaths(
  start: string,
  end: string,
  vertices: Vertex[],
  edges: Edge[],
) {
  const found: { nodes: string[]; cost: number }[] = [];
  const walk = (at: string, seen: string[], cost: number) => {
    if (at === end) {
      found.push({ nodes: seen, cost });
      return;
    }
    for (const edge of edges.filter((e) => e.a === at || e.b === at)) {
      const next = edge.a === at ? edge.b : edge.a;
      if (!seen.includes(next)) walk(next, [...seen, next], cost + edge.weight);
    }
  };
  if (
    vertices.some((v) => v.id === start) &&
    vertices.some((v) => v.id === end)
  )
    walk(start, [start], 0);
  return found.sort(
    (a, b) => a.cost - b.cost || a.nodes.length - b.nodes.length,
  );
}
export default function WeightedGraphsTargetLesson567({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [vertices, setVertices] = useState(initialVertices),
    [edges, setEdges] = useState(initialEdges),
    [start, setStart] = useState("A"),
    [end, setEnd] = useState("E"),
    [selectedPath, setSelectedPath] = useState<string[]>(["A", "B", "E"]),
    [selectedEdge, setSelectedEdge] = useState("AB"),
    [dragging, setDragging] = useState<string | null>(null),
    [zoom, setZoom] = useState(100),
    [tab, setTab] = useState("Interact"),
    [panel, setPanel] = useState("Select"),
    [practice, setPractice] = useState(["A", "B", "E"]),
    [graded, setGraded] = useState<boolean | null>(null),
    [solution, setSolution] = useState(false),
    [saved, setSaved] = useState(false),
    [shared, setShared] = useState(false),
    [fullscreen, setFullscreen] = useState(false),
    [actions, setActions] = useState(0);
  const moved = useRef(false);
  const routes = useMemo(
      () => allPaths(start, end, vertices, edges),
      [start, end, vertices, edges],
    ),
    best = routes[0] ?? { nodes: [], cost: 0 },
    nextBest = routes.find((r) => r.cost > best.cost) ?? routes[1] ?? best;
  const bestPathKey = best.nodes.join(",");
  const act = (fn: () => void) => {
    fn();
    setActions((n) => n + 1);
    onInteraction();
  };
  const reset = () => {
    setVertices(initialVertices);
    setEdges(initialEdges);
    setStart("A");
    setEnd("E");
    setSelectedPath(["A", "B", "E"]);
    setSelectedEdge("AB");
    setDragging(null);
    setZoom(100);
    setTab("Interact");
    setPanel("Select");
    setPractice(["A", "B", "E"]);
    setGraded(null);
    setSolution(false);
    setSaved(false);
    setShared(false);
    setFullscreen(false);
    setActions(0);
  };
  useEffect(reset, [resetToken]);
  useEffect(() => {
    setSelectedPath(bestPathKey ? bestPathKey.split(",") : []);
  }, [bestPathKey]);
  const weight = (a: string, b: string) =>
    edges.find((e) => edgeKey(e.a, e.b) === edgeKey(a, b))?.weight;
  const routeCost = (nodes: string[]) =>
    nodes
      .slice(1)
      .reduce((sum, node, i) => sum + (weight(nodes[i], node) ?? 99), 0);
  const updateWeight = (key: string, value: number) =>
    act(() =>
      setEdges((es) =>
        es.map((e) =>
          edgeKey(e.a, e.b) === key ? { ...e, weight: value } : e,
        ),
      ),
    );
  const moveVertex = (event: PointerEvent<SVGSVGElement>) => {
    if (!dragging) return;
    const box = event.currentTarget.getBoundingClientRect(),
      x = Math.max(
        28,
        Math.min(512, ((event.clientX - box.left) / box.width) * 540),
      ),
      y = Math.max(
        28,
        Math.min(372, ((event.clientY - box.top) / box.height) * 400),
      );
    moved.current = true;
    setVertices((vs) =>
      vs.map((v) => (v.id === dragging ? { ...v, x, y } : v)),
    );
    onInteraction();
  };
  const quick = [...["A,B,E", "A,D,E", "A,B,C,E", "A,D,B,E"]]
    .map((text) => text.split(","))
    .filter(
      (nodes) =>
        nodes[0] === start && nodes.at(-1) === end && routeCost(nodes) < 90,
    );
  const practiceCost = routeCost(practice),
    practiceValid =
      practiceCost < 90 && practice[0] === "A" && practice.at(-1) === "E",
    practiceCorrect =
      practiceValid &&
      practiceCost === allPaths("A", "E", vertices, edges)[0]?.cost;
  return (
    <section
      className={`wg567-page cs378-page ${fullscreen ? "fullscreen" : ""}`}
      data-testid="discrete-mockup-0624"
      data-object-model="dedicated-weighted-drag-graph-dijkstra-route-model"
      data-edge-count={edges.length}
      data-cheapest-path={best.nodes.join(",")}
      data-cheapest-cost={best.cost}
      data-selected-edge={selectedEdge}
      data-selected-path={selectedPath.join(",")}
      data-positions={vertices
        .map((v) => `${v.id}:${Math.round(v.x)},${Math.round(v.y)}`)
        .join(";")}
      data-zoom={zoom}
      data-graded={graded === null ? "" : graded}
      data-saved={saved}
      data-shared={shared}
      data-actions={actions}
    >
      <header className="wg567-hero">
        <aside>
          <button
            onClick={() =>
              act(() => {
                void navigator.clipboard
                  ?.writeText(window.location.href)
                  .catch(() => undefined);
                setShared(true);
              })
            }
          >
            <Share2 />
            Share
          </button>
          <button
            onClick={() =>
              act(() => {
                localStorage.setItem(
                  "lesson-567-weights",
                  JSON.stringify(edges),
                );
                setSaved(true);
              })
            }
          >
            <Save />
            {saved ? "Saved" : "Save Progress"}
          </button>
        </aside>
        <small>DISCRETE AND APPLIED MATHEMATICS</small>
        <h1>Weighted Graphs</h1>
        <p>
          <b>Objective:</b> Represent costs or distances on edges and find the
          least-cost path.
        </p>
        <dl>
          <span>
            Level: <b>Intermediate–Advanced</b>
          </span>
          <span>
            Topic: <b>Graphs & Networks</b>
          </span>
          <span>
            Lab: <b>Discrete Math Lab</b>
          </span>
          <span>
            Estimated time: <b>6–10 min</b>
          </span>
        </dl>
        {shared && <output>Share link ready</output>}
      </header>
      <nav className="wg567-tabs">
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
        <div className="wg567-tab-note" role="status">
          <b>{tab}</b> {tabText[tab]}
        </div>
      )}
      <section className="wg567-observe">
        <main>
          <header>
            <h3>
              <i>1</i> Observe <small>See the weighted network.</small>
            </h3>
          </header>
          <div className="wg567-stage">
            <WeightedGraph
              vertices={vertices}
              edges={edges}
              selectedPath={selectedPath}
              selectedEdge={selectedEdge}
              zoom={zoom}
              dragging={dragging}
              setDragging={setDragging}
              moved={moved}
              moveVertex={moveVertex}
              onEdge={(key) =>
                act(() => {
                  setSelectedEdge(key);
                  setPanel("Edit");
                })
              }
            />
            <div className="wg567-canvas-tools">
              <button
                onClick={() => act(() => setZoom((v) => Math.max(70, v - 10)))}
              >
                <ZoomOut />
              </button>
              <input
                aria-label="Graph zoom"
                type="range"
                min="70"
                max="140"
                value={zoom}
                onChange={(e) => act(() => setZoom(Number(e.target.value)))}
              />
              <button
                onClick={() => act(() => setZoom((v) => Math.min(140, v + 10)))}
              >
                <ZoomIn />
              </button>
              <button onClick={() => act(() => setVertices(initialVertices))}>
                Reset View
              </button>
              <button onClick={() => act(() => setFullscreen((v) => !v))}>
                <Maximize2 />
              </button>
            </div>
          </div>
          <section className="wg567-picker">
            <nav>
              <button
                className={panel === "Select" ? "active" : ""}
                onClick={() => act(() => setPanel("Select"))}
              >
                Select
              </button>
              <button
                className={panel === "Edit" ? "active" : ""}
                onClick={() => act(() => setPanel("Edit"))}
              >
                Edit
              </button>
            </nav>
            {panel === "Select" ? (
              <>
                <p>Choose start and end</p>
                <label>
                  Start
                  <select
                    aria-label="Start vertex"
                    value={start}
                    onChange={(e) => act(() => setStart(e.target.value))}
                  >
                    {vertices.map((v) => (
                      <option key={v.id}>{v.id}</option>
                    ))}
                  </select>
                </label>
                <label>
                  End
                  <select
                    aria-label="End vertex"
                    value={end}
                    onChange={(e) => act(() => setEnd(e.target.value))}
                  >
                    {vertices.map((v) => (
                      <option key={v.id}>{v.id}</option>
                    ))}
                  </select>
                </label>
                <b>Highlight a path</b>
                {quick.map((nodes) => (
                  <button
                    key={nodes.join("")}
                    onClick={() => act(() => setSelectedPath(nodes))}
                  >
                    {nodes.join(" → ")}
                  </button>
                ))}
              </>
            ) : (
              <>
                <p>Edit selected edge</p>
                <b>
                  {selectedEdge[0]} — {selectedEdge[1]}
                </b>
                <input
                  aria-label="Selected edge weight"
                  type="range"
                  min="1"
                  max="10"
                  value={
                    edges.find((e) => edgeKey(e.a, e.b) === selectedEdge)
                      ?.weight ?? 1
                  }
                  onChange={(e) =>
                    updateWeight(selectedEdge, Number(e.target.value))
                  }
                />
              </>
            )}
          </section>
        </main>
        <aside>
          <h3>Route Comparison</h3>
          <p>Select a path to see its total cost.</p>
          {quick.map((nodes) => {
            const cost = routeCost(nodes),
              isBest = cost === best.cost;
            return (
              <button
                className={
                  selectedPath.join("") === nodes.join("") ? "active" : ""
                }
                key={nodes.join("")}
                onClick={() => act(() => setSelectedPath(nodes))}
              >
                <span>{nodes.join(" → ")}</span>
                <small>
                  {nodes
                    .slice(1)
                    .map((n, i) => weight(nodes[i], n))
                    .join(" + ")}{" "}
                  = {cost}
                </small>
                <b>{cost}</b>
                {isBest && <em>cheapest</em>}
              </button>
            );
          })}
          <section>
            <b>Cheapest path</b>
            <strong>{best.nodes.join(" → ")}</strong>
            <span>
              Total cost <output>{best.cost}</output>
            </span>
          </section>
        </aside>
      </section>
      <section className="wg567-manipulate">
        <header>
          <h3>
            <i>2</i> Manipulate{" "}
            <small>Change edge weights and see totals update instantly.</small>
          </h3>
        </header>
        <main>
          <div>
            {edges.map((e) => (
              <label key={edgeKey(e.a, e.b)}>
                <b>
                  {e.a} — {e.b}
                </b>
                <span>{e.weight}</span>
                <input
                  aria-label={`${e.a}-${e.b} weight`}
                  type="range"
                  min="1"
                  max="10"
                  value={e.weight}
                  onChange={(event) =>
                    updateWeight(edgeKey(e.a, e.b), Number(event.target.value))
                  }
                />
                <output>{e.weight}</output>
              </label>
            ))}
          </div>
          <aside>
            <Lightbulb />
            <b>Tip: Lower costs are cheaper.</b>
            <p>Try changing weights to see how the cheapest path changes.</p>
          </aside>
          <section>
            <h3>Live summary</h3>
            <p>
              Cheapest path <b>{best.nodes.join(" → ")}</b>
            </p>
            <p>
              Total cost <b>{best.cost}</b>
            </p>
            <p>
              Next best <b>{nextBest.nodes.join(" → ")}</b>
            </p>
            <p>
              Next cost <b>{nextBest.cost}</b>
            </p>
          </section>
        </main>
      </section>
      <section className="wg567-theory">
        <article>
          <h3>
            <i>3</i> Notice the pattern
          </h3>
          <p>✓ The path with the smallest sum is chosen.</p>
          <p>✓ Adding edges never reduces a path's cost.</p>
          <p>✓ Direct but expensive edges may not be best.</p>
          <p>
            <Lightbulb /> Look for shortcuts with low total cost.
          </p>
        </article>
        <article>
          <h3>
            <i>4</i> Understand the rule
          </h3>
          <b>Key Rule (Shortest Path)</b>
          <p>The least-cost path has the minimum total edge weight.</p>
          <output>cost(P) = Σ w(vᵢ, vᵢ₊₁)</output>
        </article>
        <article>
          <h3>⚠ Common Misconception</h3>
          <p>Fewer edges does not always mean less cost.</p>
          <p>
            <b>Always compare total cost, not edge count.</b>
          </p>
        </article>
      </section>
      <section className="wg567-practice">
        <h3>
          <i>5</i> Try independently{" "}
          <small>Find the cheapest path from A to E in the graph shown.</small>
        </h3>
        <MiniGraph edges={edges} />
        <div>
          <b>Your path</b>
          <section>
            {practice.map((value, index) => (
              <select
                aria-label={`Practice vertex ${index + 1}`}
                key={index}
                value={value}
                onChange={(e) => {
                  const next = [...practice];
                  next[index] = e.target.value;
                  act(() => {
                    setPractice(next);
                    setGraded(null);
                  });
                }}
              >
                {vertices.map((v) => (
                  <option key={v.id}>{v.id}</option>
                ))}
              </select>
            ))}
          </section>
          {graded !== null && (
            <strong className={graded ? "correct" : "wrong"}>
              {graded ? "✓ Correct!" : "Try another connected route."}
            </strong>
          )}
          <p>
            Total cost <output>{practiceValid ? practiceCost : "—"}</output>
          </p>
        </div>
        <aside>
          <h3>How did you do?</h3>
          <p>✓ Found the cheapest path</p>
          <p>✓ Calculated the total cost</p>
          <p>○ Explained your choice</p>
          <button onClick={() => act(() => setGraded(practiceCorrect))}>
            Check Answer
          </button>
          <button onClick={() => act(() => setSolution((v) => !v))}>
            {solution ? best.nodes.join(" → ") : "Show solution"}
          </button>
        </aside>
      </section>
      <nav className="wg567-adjacent">
        <button>
          Previous
          <br />
          <b>Directed Graphs</b>
        </button>
        <span>
          Lesson progress <progress value="33" max="100" />
          33%
        </span>
        <button>
          Next
          <br />
          <b>Degree of a Vertex</b>
        </button>
      </nav>
    </section>
  );
}
function WeightedGraph({
  vertices,
  edges,
  selectedPath,
  selectedEdge,
  zoom,
  dragging,
  setDragging,
  moved,
  moveVertex,
  onEdge,
}: {
  vertices: Vertex[];
  edges: Edge[];
  selectedPath: string[];
  selectedEdge: string;
  zoom: number;
  dragging: string | null;
  setDragging: (id: string | null) => void;
  moved: { current: boolean };
  moveVertex: (e: PointerEvent<SVGSVGElement>) => void;
  onEdge: (key: string) => void;
}) {
  const chosen = new Set(
    selectedPath.slice(1).map((n, i) => edgeKey(selectedPath[i], n)),
  );
  return (
    <svg
      className="wg567-graph"
      viewBox="0 0 540 400"
      onPointerMove={moveVertex}
      onPointerUp={() => setDragging(null)}
      onPointerLeave={() => setDragging(null)}
    >
      <g
        transform={`translate(270 200) scale(${zoom / 100}) translate(-270 -200)`}
      >
        {edges.map((e) => {
          const a = vertices.find((v) => v.id === e.a)!,
            b = vertices.find((v) => v.id === e.b)!,
            key = edgeKey(e.a, e.b);
          return (
            <g
              key={key}
              data-testid={`weighted-edge-${key}`}
              className={`edge ${chosen.has(key) ? "chosen" : ""} ${selectedEdge === key ? "selected" : ""}`}
              onClick={() => onEdge(key)}
            >
              <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} />
              <text x={(a.x + b.x) / 2} y={(a.y + b.y) / 2 - 7}>
                {e.weight}
              </text>
            </g>
          );
        })}
        {vertices.map((v) => (
          <g
            key={v.id}
            data-testid={`weighted-vertex-${v.id}`}
            transform={`translate(${v.x} ${v.y})`}
            onPointerDown={(e) => {
              moved.current = false;
              setDragging(v.id);
              e.currentTarget.setPointerCapture(e.pointerId);
            }}
            className={dragging === v.id ? "dragging" : ""}
          >
            <circle r="23" fill={v.color} />
            <text textAnchor="middle" dy="5">
              {v.id}
            </text>
          </g>
        ))}
      </g>
    </svg>
  );
}
function MiniGraph({ edges }: { edges: Edge[] }) {
  return (
    <svg className="wg567-mini" viewBox="0 0 300 190">
      <WeightedGraph
        vertices={initialVertices.map((v) => ({
          ...v,
          x: v.x * 0.5 + 10,
          y: v.y * 0.45 + 8,
        }))}
        edges={edges}
        selectedPath={[]}
        selectedEdge=""
        zoom={100}
        dragging={null}
        setDragging={() => {}}
        moved={{ current: false }}
        moveVertex={() => {}}
        onEdge={() => {}}
      />
    </svg>
  );
}
