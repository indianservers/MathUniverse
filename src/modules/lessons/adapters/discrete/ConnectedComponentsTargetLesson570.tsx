import { CheckCircle2, CirclePlus, RotateCcw, Shuffle } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { PointerEvent } from "react";
import type { LessonAdapterProps } from "../../types";
import "../geometry3d/CoordinateSystemTargetLesson378.css";
import "./ConnectedComponentsTargetLesson570.css";

type Vertex = { id: string; x: number; y: number };
type Edge = { a: string; b: string; weight: number };
type Drag = { ids: string[]; x: number; y: number } | null;
const initialVertices: Vertex[] = [
  { id: "A", x: 75, y: 145 },
  { id: "B", x: 205, y: 75 },
  { id: "C", x: 205, y: 265 },
  { id: "D", x: 390, y: 110 },
  { id: "E", x: 535, y: 110 },
  { id: "F", x: 465, y: 265 },
  { id: "G", x: 345, y: 360 },
];
const initialEdges: Edge[] = [
  { a: "A", b: "B", weight: 2 },
  { a: "A", b: "C", weight: 1 },
  { a: "B", b: "C", weight: 3 },
  { a: "D", b: "E", weight: 2 },
  { a: "D", b: "F", weight: 1 },
  { a: "E", b: "F", weight: 2 },
];
const colors = ["#ef9418", "#1197b4", "#8652df", "#e64da8", "#2b7bd5"];
const key = (a: string, b: string) => [a, b].sort().join("");
function components(vertices: Vertex[], edges: Edge[]) {
  const unseen = new Set(vertices.map((v) => v.id)),
    groups: string[][] = [];
  while (unseen.size) {
    const start = [...unseen][0],
      queue = [start],
      group: string[] = [];
    unseen.delete(start);
    while (queue.length) {
      const at = queue.shift()!;
      group.push(at);
      for (const edge of edges.filter((e) => e.a === at || e.b === at)) {
        const next = edge.a === at ? edge.b : edge.a;
        if (unseen.has(next)) {
          unseen.delete(next);
          queue.push(next);
        }
      }
    }
    groups.push(group.sort());
  }
  return groups.sort((a, b) => b.length - a.length || a[0].localeCompare(b[0]));
}
const tabCopy: Record<string, string> = {
  Learn:
    "A connected component is a maximal group in which every pair is joined by a path.",
  "Worked Example":
    "Run a graph search from each unseen vertex to reveal one component at a time.",
  Formula: "The components form a disjoint partition V(G)=C₁ ⊔ C₂ ⊔ ··· ⊔ Cₖ.",
  Practice: "Predict the component count, then change edges and recompute.",
};

export default function ConnectedComponentsTargetLesson570({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [vertices, setVertices] = useState(initialVertices),
    [edges, setEdges] = useState(initialEdges);
  const [mode, setMode] = useState<"select" | "add" | "remove">("select"),
    [edgeStart, setEdgeStart] = useState<string | null>(null);
  const [from, setFrom] = useState("A"),
    [to, setTo] = useState("F"),
    [drag, setDrag] = useState<Drag>(null);
  const [tab, setTab] = useState("Interact"),
    [prediction, setPrediction] = useState(4),
    [graded, setGraded] = useState<boolean | null>(true);
  const [challengeRound, setChallengeRound] = useState(0),
    [actions, setActions] = useState(0);
  const groups = useMemo(() => components(vertices, edges), [vertices, edges]);
  const groupOf = (id: string) =>
    groups.findIndex((group) => group.includes(id));
  const reachable = groupOf(from) === groupOf(to);
  const act = (fn: () => void) => {
    fn();
    setActions((n) => n + 1);
    onInteraction();
  };
  const reset = () => {
    setVertices(initialVertices);
    setEdges(initialEdges);
    setMode("select");
    setEdgeStart(null);
    setFrom("A");
    setTo("F");
    setDrag(null);
    setTab("Interact");
    setPrediction(4);
    setGraded(true);
    setChallengeRound(0);
    setActions(0);
  };
  useEffect(reset, [resetToken]);
  const vertexClick = (id: string) => {
    if (mode !== "add") return;
    if (!edgeStart) {
      act(() => setEdgeStart(id));
      return;
    }
    if (
      edgeStart !== id &&
      !edges.some((e) => key(e.a, e.b) === key(edgeStart, id))
    )
      act(() =>
        setEdges((current) => [...current, { a: edgeStart, b: id, weight: 1 }]),
      );
    setEdgeStart(null);
  };
  const remove = (a: string, b: string) => {
    if (mode === "remove")
      act(() =>
        setEdges((current) =>
          current.filter((e) => key(e.a, e.b) !== key(a, b)),
        ),
      );
  };
  const pointer = (event: PointerEvent<SVGSVGElement>) => {
    if (!drag) return;
    const box = event.currentTarget.getBoundingClientRect(),
      x = ((event.clientX - box.left) / box.width) * 600,
      y = ((event.clientY - box.top) / box.height) * 410,
      dx = x - drag.x,
      dy = y - drag.y;
    setVertices((current) =>
      current.map((v) =>
        drag.ids.includes(v.id) ? { ...v, x: v.x + dx, y: v.y + dy } : v,
      ),
    );
    setDrag({ ...drag, x, y });
    onInteraction();
  };
  const startDrag = (event: PointerEvent<SVGRectElement>, ids: string[]) => {
    const svg = event.currentTarget.ownerSVGElement!,
      box = svg.getBoundingClientRect();
    setDrag({
      ids,
      x: ((event.clientX - box.left) / box.width) * 600,
      y: ((event.clientY - box.top) / box.height) * 410,
    });
    event.currentTarget.setPointerCapture(event.pointerId);
  };
  const randomize = () =>
    act(() => {
      setEdges(
        challengeRound % 2 === 0
          ? [
              { a: "A", b: "B", weight: 1 },
              { a: "B", b: "D", weight: 1 },
              { a: "C", b: "E", weight: 1 },
              { a: "E", b: "F", weight: 1 },
            ]
          : initialEdges,
      );
      setChallengeRound((round) => round + 1);
    });
  const addIsolated = () =>
    act(() => {
      const id = String.fromCharCode(65 + vertices.length);
      setVertices((current) => [...current, { id, x: 545, y: 350 }]);
    });
  return (
    <section
      className="cc570-page cs378-page"
      data-testid="discrete-mockup-0627"
      data-object-model="dedicated-component-partition-reachability-cluster-drag-model"
      data-component-count={groups.length}
      data-component-sizes={groups.map((g) => g.length).join(",")}
      data-components={groups.map((g) => g.join("")).join("|")}
      data-reachable={reachable}
      data-mode={mode}
      data-edge-count={edges.length}
      data-positions={vertices
        .map((v) => `${v.id}:${Math.round(v.x)},${Math.round(v.y)}`)
        .join(";")}
      data-graded={graded === null ? "" : graded}
      data-actions={actions}
    >
      <header className="cc570-hero">
        <small>DISCRETE AND APPLIED MATHEMATICS</small>
        <h1>Connected Components</h1>
        <p>
          <b>Objective:</b> Identify connected components of an undirected graph
          and test reachability.
        </p>
        <dl>
          <span>
            Skill level<b>Intermediate</b>
          </span>
          <span>
            Estimated time<b>6–10 min</b>
          </span>
          <span>
            Topics<b>Graphs, Connectivity</b>
          </span>
        </dl>
      </header>
      <nav className="cc570-tabs">
        {["Interact", "Learn", "Worked Example", "Formula", "Practice"].map(
          (name) => (
            <button
              className={tab === name ? "active" : ""}
              key={name}
              onClick={() => act(() => setTab(name))}
            >
              {name}
            </button>
          ),
        )}
      </nav>
      {tab !== "Interact" && (
        <div className="cc570-tab-note" role="status">
          <b>{tab}</b>
          {tabCopy[tab]}
        </div>
      )}
      <section className="cc570-lab">
        <main>
          <header>
            <b>1. OBSERVE & MANIPULATE</b>
            <p>
              Drag clusters or add/remove edges. Components update
              automatically.
            </p>
          </header>
          <ComponentGraph
            vertices={vertices}
            edges={edges}
            groups={groups}
            mode={mode}
            edgeStart={edgeStart}
            startDrag={startDrag}
            pointer={pointer}
            setDrag={setDrag}
            vertexClick={vertexClick}
            remove={remove}
          />
          <p>Drag a cluster (inside dashed boundary) to move it.</p>
        </main>
        <aside>
          <h3>EDGE CONTROLS</h3>
          <div>
            <button
              className={mode === "add" ? "active" : ""}
              onClick={() => act(() => setMode("add"))}
            >
              ⌁ Add edge
            </button>
            <button
              className={mode === "remove" ? "active" : ""}
              onClick={() => act(() => setMode("remove"))}
            >
              ✂ Remove edge
            </button>
          </div>
          <p>
            Click{" "}
            {mode === "remove"
              ? "an edge to remove it"
              : "two vertices to connect them"}
            .
          </p>
          <hr />
          <h3>READOUTS</h3>
          <output>
            Connected components<strong>{groups.length}</strong>
          </output>
          <h4>Component sizes</h4>
          <div className="cc570-sizes">
            {groups.map((group, i) => (
              <b style={{ background: colors[i] }} key={group.join("")}>
                {group.length}
              </b>
            ))}
          </div>
          <hr />
          <h3>REACHABILITY TEST</h3>
          <section>
            <label>
              From
              <select
                aria-label="Reachability from"
                value={from}
                onChange={(e) => act(() => setFrom(e.target.value))}
              >
                {vertices.map((v) => (
                  <option key={v.id}>{v.id}</option>
                ))}
              </select>
            </label>
            <label>
              To
              <select
                aria-label="Reachability to"
                value={to}
                onChange={(e) => act(() => setTo(e.target.value))}
              >
                {vertices.map((v) => (
                  <option key={v.id}>{v.id}</option>
                ))}
              </select>
            </label>
          </section>
          <article className={reachable ? "yes" : "no"}>
            {reachable ? <CheckCircle2 /> : "×"}
            <b>{reachable ? "Reachable" : "Not reachable"}</b>
            <p>
              {from} and {to} are {reachable ? "in the same" : "in different"}{" "}
              components.
            </p>
          </article>
        </aside>
      </section>
      <section className="cc570-quick">
        <article>
          <b>Quick actions</b>
          <div>
            <button onClick={reset}>
              <RotateCcw />
              Reset graph
            </button>
            <button onClick={randomize}>
              <Shuffle />
              Random graph
            </button>
            <button onClick={addIsolated}>
              <CirclePlus />
              Add isolated node
            </button>
          </div>
        </article>
        <article>
          <b>
            Component legend <small>(auto-colored)</small>
          </b>
          <div>
            {groups.map((group, i) => (
              <span key={group.join("")}>
                <i style={{ background: colors[i] }} />
                Component {i + 1}
              </span>
            ))}
          </div>
        </article>
      </section>
      <section className="cc570-theory">
        <article>
          <h3>2. NOTICE THE PATTERN</h3>
          <p>• Vertices A, B, C reach each other.</p>
          <p>• Vertices D, E, F reach each other.</p>
          <p>• Vertex G is alone.</p>
          <p>• No vertex in one group can reach a vertex in another group.</p>
          <p>Each group is a connected component.</p>
        </article>
        <article>
          <h3>3. UNDERSTAND THE RULE</h3>
          <p>
            Two vertices u and v are in the same connected component if there
            exists a path between them.
          </p>
          <p>
            <b>Definition:</b> A connected component is a maximal set of
            vertices such that every pair is connected by a path.
          </p>
          <p>
            <b>Key fact:</b> Components partition the vertex set.
          </p>
          <output>
            V(G) = C₁ ⊔ C₂ ⊔ ··· ⊔ Cₖ<small>(disjoint union)</small>
          </output>
        </article>
        <article>
          <h3>4. WORKED EXAMPLE</h3>
          <p>Find the connected components.</p>
          <MiniComponents />
          <p>
            <b>Solution:</b>
          </p>
          <p>Components are {`{A,B,C}, {D,E,F}, {G}`}.</p>
          <p>Total components = 3.</p>
        </article>
      </section>
      <section className="cc570-misconception">
        <article>
          <h3>⚠ COMMON MISCONCEPTION</h3>
          <p>
            <b>Having an edge between components makes them one component.</b>
          </p>
          <p>
            Reality: A component has no edges connecting it to any other
            component.
          </p>
        </article>
        <article>
          <b>Example: If we add an edge between C and D, components change.</b>
          <MiniComponents bridge />
        </article>
      </section>
      <section className="cc570-challenge">
        <h3>5. TRY INDEPENDENTLY</h3>
        <p>
          Predict the number of connected components, then check by manipulating
          the graph.
        </p>
        <ChallengeGraph />
        <main>
          <b>Your answer</b>
          <label>
            Predicted number of components
            <input
              aria-label="Predicted components"
              type="number"
              min="1"
              max="8"
              value={prediction}
              onChange={(e) =>
                act(() => {
                  setPrediction(Number(e.target.value));
                  setGraded(null);
                })
              }
            />
          </label>
          <button onClick={() => act(() => setGraded(prediction === 4))}>
            Check answer
          </button>
          <button
            onClick={() =>
              act(() => {
                setChallengeRound((round) => round + 1);
                setPrediction(challengeRound % 2 === 0 ? 3 : 4);
                setGraded(null);
              })
            }
          >
            New challenge
          </button>
        </main>
        <aside className={graded ? "correct" : ""}>
          <b>Result</b>
          {graded !== null && <h3>{graded ? "✓ Correct!" : "Try again"}</h3>}
          <p>There are 4 connected components.</p>
          <p>Components:</p>
          <div>
            <b>3</b>
            <b>3</b>
            <b>1</b>
            <b>1</b>
          </div>
          <p>Sizes: 3, 3, 1, 1</p>
        </aside>
      </section>
      <nav className="cc570-adjacent">
        <button>
          Previous
          <br />
          <b>Paths and Cycles</b>
        </button>
        <button>
          Next
          <br />
          <b>Euler Paths and Circuits</b>
        </button>
      </nav>
    </section>
  );
}

function ComponentGraph({
  vertices,
  edges,
  groups,
  mode,
  edgeStart,
  startDrag,
  pointer,
  setDrag,
  vertexClick,
  remove,
}: {
  vertices: Vertex[];
  edges: Edge[];
  groups: string[][];
  mode: string;
  edgeStart: string | null;
  startDrag: (e: PointerEvent<SVGRectElement>, ids: string[]) => void;
  pointer: (e: PointerEvent<SVGSVGElement>) => void;
  setDrag: (d: Drag) => void;
  vertexClick: (id: string) => void;
  remove: (a: string, b: string) => void;
}) {
  return (
    <svg
      className="cc570-graph"
      viewBox="0 0 600 410"
      onPointerMove={pointer}
      onPointerUp={() => setDrag(null)}
      onPointerLeave={() => setDrag(null)}
    >
      {groups.map((group, i) => {
        const points = vertices.filter((v) => group.includes(v.id)),
          minX = Math.min(...points.map((v) => v.x)) - 40,
          maxX = Math.max(...points.map((v) => v.x)) + 40,
          minY = Math.min(...points.map((v) => v.y)) - 40,
          maxY = Math.max(...points.map((v) => v.y)) + 40;
        return (
          <rect
            data-testid={`component-boundary-${group[0]}`}
            key={group.join("")}
            x={minX}
            y={minY}
            width={maxX - minX}
            height={maxY - minY}
            rx="55"
            className={`boundary c${i}`}
            onPointerDown={(e) => startDrag(e, group)}
          />
        );
      })}
      {edges.map((edge) => {
        const a = vertices.find((v) => v.id === edge.a)!,
          b = vertices.find((v) => v.id === edge.b)!;
        return (
          <g
            data-testid={`component-edge-${key(edge.a, edge.b)}`}
            key={key(edge.a, edge.b)}
            onClick={() => remove(edge.a, edge.b)}
            className={mode === "remove" ? "removable" : ""}
          >
            <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} />
            <text x={(a.x + b.x) / 2} y={(a.y + b.y) / 2 - 7}>
              {edge.weight}
            </text>
          </g>
        );
      })}
      {vertices.map((v) => {
        const i = groups.findIndex((group) => group.includes(v.id));
        return (
          <g
            data-testid={`component-vertex-${v.id}`}
            className={edgeStart === v.id ? "selected" : ""}
            key={v.id}
            transform={`translate(${v.x} ${v.y})`}
            onClick={() => vertexClick(v.id)}
          >
            <circle r="23" fill={colors[i]} />
            <text textAnchor="middle" dy="5">
              {v.id}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
function MiniComponents({ bridge = false }: { bridge?: boolean }) {
  return (
    <svg className="cc570-mini" viewBox="0 0 250 110">
      <path d="M20 55L70 20L70 90L20 55M145 25L205 25L175 90L145 25" />
      <path d="M70 90L145 25" className={bridge ? "bridge" : "hidden"} />
      {[
        [20, 55, "A", 0],
        [70, 20, "B", 0],
        [70, 90, "C", 0],
        [145, 25, "D", 1],
        [205, 25, "E", 1],
        [175, 90, "F", 1],
        [235, 90, "G", 2],
      ].map(([x, y, t, c]) => (
        <g key={String(t)}>
          <circle
            cx={Number(x)}
            cy={Number(y)}
            r="10"
            fill={colors[Number(c)]}
          />
          <text x={Number(x)} y={Number(y) + 3}>
            {t}
          </text>
        </g>
      ))}
    </svg>
  );
}
function ChallengeGraph() {
  return (
    <svg className="cc570-challenge-graph" viewBox="0 0 300 130">
      <path d="M20 65L65 20L95 90L20 65M145 25L180 80L235 105M145 25L235 105" />
      {[
        [20, 65, "A", 0],
        [65, 20, "B", 0],
        [95, 90, "C", 0],
        [145, 25, "D", 1],
        [180, 80, "E", 1],
        [235, 105, "F", 1],
        [250, 25, "G", 2],
        [285, 30, "H", 3],
      ].map(([x, y, t, c]) => (
        <g key={String(t)}>
          <circle
            cx={Number(x)}
            cy={Number(y)}
            r="11"
            fill={colors[Number(c)]}
          />
          <text x={Number(x)} y={Number(y) + 3}>
            {t}
          </text>
        </g>
      ))}
    </svg>
  );
}
