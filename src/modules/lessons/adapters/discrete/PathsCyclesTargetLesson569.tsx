import { CheckCircle2, Lightbulb, RotateCcw, Undo2 } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import type { PointerEvent } from "react";
import type { LessonAdapterProps } from "../../types";
import "../geometry3d/CoordinateSystemTargetLesson378.css";
import "./PathsCyclesTargetLesson569.css";
type Vertex = { id: string; x: number; y: number; color: string };
type Edge = { a: string; b: string; weight: number };
type Graph = { vertices: Vertex[]; edges: Edge[] };
const baseVertices: Vertex[] = [
  { id: "A", x: 95, y: 135, color: "#ee951b" },
  { id: "B", x: 285, y: 65, color: "#1597b0" },
  { id: "C", x: 485, y: 135, color: "#1597b0" },
  { id: "D", x: 155, y: 345, color: "#1597b0" },
  { id: "E", x: 420, y: 345, color: "#1597b0" },
];
const graphs: Record<string, Graph> = {
  "Graph 1": {
    vertices: baseVertices,
    edges: [
      { a: "A", b: "B", weight: 2 },
      { a: "B", b: "C", weight: 3 },
      { a: "C", b: "E", weight: 1 },
      { a: "E", b: "D", weight: 5 },
      { a: "D", b: "A", weight: 1 },
      { a: "E", b: "A", weight: 2 },
    ],
  },
  "Graph 2": {
    vertices: baseVertices,
    edges: [
      { a: "A", b: "B", weight: 2 },
      { a: "B", b: "D", weight: 2 },
      { a: "D", b: "E", weight: 3 },
      { a: "E", b: "A", weight: 1 },
      { a: "B", b: "C", weight: 2 },
      { a: "C", b: "E", weight: 2 },
    ],
  },
  "Graph 3": {
    vertices: baseVertices,
    edges: [
      { a: "A", b: "B", weight: 1 },
      { a: "B", b: "C", weight: 1 },
      { a: "C", b: "A", weight: 1 },
      { a: "B", b: "D", weight: 2 },
      { a: "D", b: "E", weight: 2 },
      { a: "E", b: "C", weight: 2 },
    ],
  },
};
const key = (a: string, b: string) => [a, b].sort().join("");
const tabCopy: Record<string, string> = {
  Learn:
    "A walk may repeat vertices and edges; trails do not repeat edges; paths do not repeat vertices.",
  "Worked Example":
    "Compare every simple cycle total to identify the shortest cycle.",
  Formula:
    "Length is the sum of edge weights along consecutive adjacent vertices.",
  Practice: "Enter a closed sequence beginning and ending at A.",
};
function classify(walk: string[], edges: Edge[]) {
  const used = walk.slice(1).map((v, i) => key(walk[i], v)),
    valid = used.every((k) => edges.some((e) => key(e.a, e.b) === k)),
    closed = walk.length > 2 && walk[0] === walk.at(-1),
    trail = valid && new Set(used).size === used.length,
    path =
      valid &&
      new Set(closed ? walk.slice(0, -1) : walk).size ===
        (closed ? walk.length - 1 : walk.length),
    cycle = closed && trail && path;
  return { valid, closed, trail, path: !closed && path, cycle, used };
}
function cycleSearch(start: string, graph: Graph) {
  const found: { nodes: string[]; length: number }[] = [];
  const visit = (
    at: string,
    path: string[],
    used: Set<string>,
    length: number,
  ) => {
    for (const edge of graph.edges.filter((e) => e.a === at || e.b === at)) {
      const next = edge.a === at ? edge.b : edge.a,
        k = key(at, next);
      if (used.has(k)) continue;
      if (next === start && path.length >= 3) {
        found.push({ nodes: [...path, start], length: length + edge.weight });
        continue;
      }
      if (path.includes(next)) continue;
      visit(next, [...path, next], new Set([...used, k]), length + edge.weight);
    }
  };
  visit(start, [start], new Set(), 0);
  return (
    found.sort(
      (a, b) =>
        a.length - b.length || a.nodes.join("").localeCompare(b.nodes.join("")),
    )[0] ?? { nodes: [], length: 0 }
  );
}
export default function PathsCyclesTargetLesson569({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [graphName, setGraphName] = useState("Graph 1"),
    [vertices, setVertices] = useState(baseVertices),
    [walk, setWalk] = useState(["A", "B", "C"]),
    [dragging, setDragging] = useState<string | null>(null),
    [message, setMessage] = useState("Valid step: C is adjacent to B."),
    [tab, setTab] = useState("Interact"),
    [answer, setAnswer] = useState(""),
    [graded, setGraded] = useState<boolean | null>(null),
    [showSolution, setShowSolution] = useState(false),
    [actions, setActions] = useState(0);
  const moved = useRef(false),
    edges = graphs[graphName].edges,
    classification = useMemo(() => classify(walk, edges), [walk, edges]),
    length = classification.used.reduce(
      (sum, k) => sum + (edges.find((e) => key(e.a, e.b) === k)?.weight ?? 0),
      0,
    ),
    shortest = useMemo(
      () => cycleSearch("A", { vertices, edges }),
      [vertices, edges],
    );
  const act = (fn: () => void) => {
    fn();
    setActions((n) => n + 1);
    onInteraction();
  };
  const reset = () => {
    setGraphName("Graph 1");
    setVertices(baseVertices);
    setWalk(["A", "B", "C"]);
    setDragging(null);
    setMessage("Valid step: C is adjacent to B.");
    setTab("Interact");
    setAnswer("");
    setGraded(null);
    setShowSolution(false);
    setActions(0);
  };
  useEffect(reset, [resetToken]);
  const choose = (id: string) => {
    if (moved.current) {
      moved.current = false;
      return;
    }
    const last = walk.at(-1)!,
      edge = edges.find((e) => key(e.a, e.b) === key(last, id));
    if (!edge) {
      act(() =>
        setMessage(
          `${id} is not adjacent to ${last}. Choose a connected vertex.`,
        ),
      );
      return;
    }
    act(() => {
      setWalk((w) => [...w, id]);
      setMessage(`Valid step: ${id} is adjacent to ${last}.`);
      setGraded(null);
    });
  };
  const move = (event: PointerEvent<SVGSVGElement>) => {
    if (!dragging) return;
    const box = event.currentTarget.getBoundingClientRect(),
      x = Math.max(
        28,
        Math.min(542, ((event.clientX - box.left) / box.width) * 570),
      ),
      y = Math.max(
        28,
        Math.min(392, ((event.clientY - box.top) / box.height) * 420),
      );
    moved.current = true;
    setVertices((vs) =>
      vs.map((v) => (v.id === dragging ? { ...v, x, y } : v)),
    );
    onInteraction();
  };
  const closeCycle = () =>
    act(() => {
      const current = walk.at(-1)!;
      if (edges.some((e) => key(e.a, e.b) === key(current, "A"))) {
        setWalk((w) => [...w, "A"]);
        setMessage("Cycle closed at A.");
        return;
      }
      const queue: [[string, string[]]] = [[current, [current]]],
        seen = new Set([current]);
      let route: string[] = [];
      while (queue.length) {
        const [at, path] = queue.shift()!;
        if (at === "A") {
          route = path;
          break;
        }
        for (const e of edges.filter((e) => e.a === at || e.b === at)) {
          const n = e.a === at ? e.b : e.a;
          if (!seen.has(n)) {
            seen.add(n);
            queue.push([n, [...path, n]]);
          }
        }
      }
      setWalk((w) => [...w, ...route.slice(1)]);
      setMessage("Closed by the shortest available route to A.");
    });
  const changeGraph = (name: string) =>
    act(() => {
      setGraphName(name);
      setVertices(graphs[name].vertices);
      setWalk(["A"]);
      setMessage("Start at A, then choose an adjacent vertex.");
    });
  const parse = (value: string) =>
      value
        .toUpperCase()
        .split(/[^A-Z]+/)
        .filter(Boolean),
    checkAnswer = () =>
      act(() => {
        const nodes = parse(answer),
          c = classify(nodes, edges),
          cost = c.used.reduce(
            (s, k) => s + (edges.find((e) => key(e.a, e.b) === k)?.weight ?? 0),
            0,
          );
        setGraded(c.cycle && nodes[0] === "A" && cost === shortest.length);
      });
  return (
    <section
      className="pc569-page cs378-page"
      data-testid="discrete-mockup-0626"
      data-object-model="dedicated-weighted-walk-trail-path-cycle-model"
      data-graph={graphName}
      data-walk={walk.join(",")}
      data-current={walk.at(-1)}
      data-length={length}
      data-edges-used={classification.used.length}
      data-valid={classification.valid}
      data-trail={classification.trail}
      data-path={classification.path}
      data-cycle={classification.cycle}
      data-shortest-cycle={shortest.nodes.join(",")}
      data-shortest-cycle-length={shortest.length}
      data-positions={vertices
        .map((v) => `${v.id}:${Math.round(v.x)},${Math.round(v.y)}`)
        .join(";")}
      data-graded={graded === null ? "" : graded}
      data-actions={actions}
    >
      <header className="pc569-hero">
        <small>LESSON 569</small>
        <h1>Paths and Cycles</h1>
        <p>Trace routes in a graph and close cycles.</p>
        <dl>
          <span>
            Subject: <b>Discrete & Applied Mathematics</b>
          </span>
          <span>
            Topic: <b>Graph Theory</b>
          </span>
          <span>
            Level: <b>Intermediate–Advanced</b>
          </span>
          <span>
            Time: <b>6–10 min</b>
          </span>
        </dl>
        <section>
          <article>
            <b>Objective</b>
            <p>
              Trace sequences of adjacent vertices, identify paths, trails and
              cycles, and find the shortest cycle.
            </p>
          </article>
          <article>
            <b>Lesson progress</b>
            <progress value="20" max="100" />
            <strong>20%</strong>
          </article>
        </section>
      </header>
      <nav className="pc569-tabs">
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
        <div className="pc569-tab-note" role="status">
          <b>{tab}</b>
          {tabCopy[tab]}
        </div>
      )}
      <section className="pc569-lab">
        <main>
          <header>
            <h2>1. Observe & Manipulate</h2>
            <p>Click vertices in order to trace a walk. Start at A.</p>
            <select
              aria-label="Graph variant"
              value={graphName}
              onChange={(e) => changeGraph(e.target.value)}
            >
              {Object.keys(graphs).map((name) => (
                <option key={name}>{name}</option>
              ))}
            </select>
            <button onClick={reset}>
              <RotateCcw />
              Reset
            </button>
          </header>
          <PathGraph
            vertices={vertices}
            edges={edges}
            walk={walk}
            dragging={dragging}
            setDragging={setDragging}
            choose={choose}
            move={move}
          />
          <section className="pc569-walk">
            <b>Your walk</b>
            {walk.map((v, i) => (
              <span key={`${v}${i}`}>
                {i > 0 && "→"}
                <i className={v === "A" ? "start" : ""}>{v}</i>
              </span>
            ))}
            {[0, 1].map((i) => (
              <i className="empty" key={i} />
            ))}
            <button
              onClick={() =>
                act(() => setWalk((w) => (w.length > 1 ? w.slice(0, -1) : w)))
              }
            >
              <Undo2 />
              Undo
            </button>
          </section>
          <section
            className={classification.valid ? "pc569-valid" : "pc569-invalid"}
          >
            <CheckCircle2 />
            <div>
              <b>{message}</b>
              <p>
                {classification.cycle
                  ? "A closed cycle is complete."
                  : "Continue or close the cycle."}
              </p>
            </div>
            <span>
              Length<b>{length}</b>
            </span>
            <span>
              Edges used<b>{classification.used.length}</b>
            </span>
          </section>
          <footer>
            <b>Quick actions</b>
            <button onClick={closeCycle}>
              <RotateCcw />
              Close cycle to A
            </button>
            <button
              onClick={() =>
                act(() => {
                  setWalk(shortest.nodes);
                  setMessage(
                    `Shortest cycle found with length ${shortest.length}.`,
                  );
                })
              }
            >
              Find shortest cycle
            </button>
            <button
              onClick={() =>
                act(() =>
                  setMessage(
                    classification.cycle
                      ? "Valid cycle."
                      : classification.path
                        ? "Valid path."
                        : classification.trail
                          ? "Valid trail."
                          : "Valid walk.",
                  ),
                )
              }
            >
              Check walk
            </button>
          </footer>
        </main>
        <aside>
          <article>
            <h3>Live readout</h3>
            <p>
              Start vertex <b>A</b>
            </p>
            <p>
              Current vertex <b>{walk.at(-1)}</b>
            </p>
            <p>
              Status{" "}
              <b>
                {classification.cycle
                  ? "Cycle"
                  : classification.path
                    ? "Path"
                    : classification.trail
                      ? "Trail"
                      : "Open walk"}
              </b>
            </p>
            <p>
              Length so far <b>{length}</b>
            </p>
            <p>
              Edges used <b>{classification.used.length}</b>
            </p>
            <p>
              Vertices visited <b>{[...new Set(walk)].join(", ")}</b>
            </p>
          </article>
          <article>
            <h3>Compare these concepts</h3>
            <p>
              <i /> <b>Walk</b>
              <small>
                A sequence of adjacent vertices. Vertices and edges may repeat.
              </small>
            </p>
            <p>
              <i /> <b>Trail</b>
              <small>A walk with no repeated edges.</small>
            </p>
            <p>
              <i /> <b>Path</b>
              <small>A walk with no repeated vertices.</small>
            </p>
            <p>
              <i /> <b>Cycle</b>
              <small>A closed path with at least one edge.</small>
            </p>
          </article>
        </aside>
      </section>
      <section className="pc569-theory">
        <article>
          <h2>2. Notice the pattern</h2>
          <p>Try closing a cycle.</p>
          <section>
            <b>Example walk completed:</b>
            <output>A → B → C → E → D → A</output>
            <p>
              Is it a cycle? <b>Yes</b>
            </p>
            <p>
              Is it a trail? <b>Yes</b>
            </p>
            <p>
              Is it a path? <b>Yes</b>
            </p>
            <aside>
              Length (total weight)
              <br />2 + 3 + 1 + 5 + 1 = 12
            </aside>
          </section>
        </article>
        <article>
          <h2>3. Understand the rule</h2>
          <aside>
            <Lightbulb />
            <b>Key rule</b>
            <p>
              A cycle is a closed path that starts and ends at the same vertex
              without repeating any other vertex.
            </p>
          </aside>
          <aside>
            <b>Common mistake</b>
            <p>
              Skipping edges or repeating a vertex breaks the definition of a
              cycle.
            </p>
          </aside>
        </article>
      </section>
      <section className="pc569-bottom">
        <article>
          <h2>Worked Example</h2>
          <p>Find the shortest cycle in Graph 1.</p>
          <div>
            <section>
              <b>Solution</b>
              <p>Check small cycles:</p>
              <ul>
                <li>A → B → C → E → A = 8</li>
                <li>A → D → E → A = 8</li>
                <li>A → B → C → E → D → A = 12</li>
              </ul>
              <strong>
                Shortest cycle: {shortest.nodes.join(" → ")} with length{" "}
                {shortest.length}.
              </strong>
            </section>
            <MiniGraph edges={edges} highlight={shortest.nodes} />
          </div>
        </article>
        <article>
          <h2>Try it yourself</h2>
          <p>
            <b>Challenge:</b> Find the shortest cycle.
          </p>
          <MiniGraph edges={edges} highlight={[]} />
          <label>
            Enter your answer (sequence starting at A):
            <input
              aria-label="Cycle answer"
              value={answer}
              onChange={(e) =>
                act(() => {
                  setAnswer(e.target.value);
                  setGraded(null);
                })
              }
              placeholder="e.g., A → B → C → E → A"
            />
          </label>
          <button onClick={checkAnswer}>Submit</button>
          {graded !== null && (
            <strong className={graded ? "correct" : "wrong"}>
              {graded
                ? `Correct — length ${shortest.length}.`
                : "That is not a shortest valid cycle."}
            </strong>
          )}
          <button onClick={() => act(() => setShowSolution((v) => !v))}>
            {showSolution ? shortest.nodes.join(" → ") : "Show solution"}
          </button>
        </article>
      </section>
      <nav className="pc569-adjacent">
        <button>
          Previous Lesson
          <br />
          <b>Degree of a Vertex</b>
        </button>
        <button>Back to Lesson List</button>
        <button>
          Next Lesson
          <br />
          <b>Connected Components</b>
        </button>
      </nav>
    </section>
  );
}
function PathGraph({
  vertices,
  edges,
  walk,
  dragging,
  setDragging,
  choose,
  move,
}: {
  vertices: Vertex[];
  edges: Edge[];
  walk: string[];
  dragging: string | null;
  setDragging: (id: string | null) => void;
  choose: (id: string) => void;
  move: (e: PointerEvent<SVGSVGElement>) => void;
}) {
  const used = new Set(walk.slice(1).map((v, i) => key(walk[i], v)));
  return (
    <svg
      className="pc569-graph"
      viewBox="0 0 570 420"
      onPointerMove={move}
      onPointerUp={() => setDragging(null)}
      onPointerLeave={() => setDragging(null)}
    >
      {edges.map((e) => {
        const a = vertices.find((v) => v.id === e.a)!,
          b = vertices.find((v) => v.id === e.b)!,
          k = key(e.a, e.b);
        return (
          <g className={used.has(k) ? "used" : ""} key={k}>
            <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} />
            <text x={(a.x + b.x) / 2} y={(a.y + b.y) / 2 - 8}>
              {e.weight}
            </text>
          </g>
        );
      })}
      {vertices.map((v) => (
        <g
          data-testid={`path-vertex-${v.id}`}
          key={v.id}
          transform={`translate(${v.x} ${v.y})`}
          className={`${walk.includes(v.id) ? "visited" : ""} ${dragging === v.id ? "dragging" : ""}`}
          onPointerDown={(e) => {
            setDragging(v.id);
            e.currentTarget.setPointerCapture(e.pointerId);
          }}
          onClick={() => choose(v.id)}
        >
          <circle r="23" fill={v.color} />
          <text textAnchor="middle" dy="5">
            {v.id}
          </text>
        </g>
      ))}
    </svg>
  );
}
function MiniGraph({
  edges,
  highlight,
}: {
  edges: Edge[];
  highlight: string[];
}) {
  const used = new Set(highlight.slice(1).map((v, i) => key(highlight[i], v))),
    vs = baseVertices.map((v) => ({
      ...v,
      x: v.x * 0.36 + 8,
      y: v.y * 0.32 + 5,
    }));
  return (
    <svg className="pc569-mini" viewBox="0 0 220 145">
      {edges.map((e) => {
        const a = vs.find((v) => v.id === e.a)!,
          b = vs.find((v) => v.id === e.b)!;
        return (
          <line
            className={used.has(key(e.a, e.b)) ? "used" : ""}
            key={key(e.a, e.b)}
            x1={a.x}
            y1={a.y}
            x2={b.x}
            y2={b.y}
          />
        );
      })}
      {vs.map((v) => (
        <g key={v.id}>
          <circle cx={v.x} cy={v.y} r="10" />
          <text x={v.x} y={v.y + 3} textAnchor="middle">
            {v.id}
          </text>
        </g>
      ))}
    </svg>
  );
}
