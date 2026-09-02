import { Expand, Play, RotateCcw, Shuffle } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import type { PointerEvent } from "react";
import type { LessonAdapterProps } from "../../types";
import "../geometry3d/CoordinateSystemTargetLesson378.css";
import "./ShortestPathTargetLesson575.css";

type Vertex = { id: string; x: number; y: number };
type Edge = { a: string; b: string; weight: number };
type Snapshot = {
  current: string | null;
  visited: string[];
  dist: Record<string, number>;
  pred: Record<string, string | null>;
  log: string;
};
const initialVertices: Vertex[] = [
  { id: "A", x: 90, y: 115 },
  { id: "B", x: 285, y: 55 },
  { id: "C", x: 495, y: 105 },
  { id: "D", x: 165, y: 315 },
  { id: "E", x: 430, y: 315 },
];
const baseEdges: Edge[] = [
  { a: "A", b: "B", weight: 2 },
  { a: "B", b: "C", weight: 3 },
  { a: "C", b: "E", weight: 1 },
  { a: "D", b: "E", weight: 5 },
  { a: "A", b: "D", weight: 1 },
  { a: "B", b: "D", weight: 4 },
  { a: "B", b: "E", weight: 2 },
];
const alternateEdges: Edge[] = [
  { a: "A", b: "B", weight: 4 },
  { a: "B", b: "C", weight: 1 },
  { a: "C", b: "E", weight: 2 },
  { a: "D", b: "E", weight: 2 },
  { a: "A", b: "D", weight: 3 },
  { a: "B", b: "D", weight: 1 },
  { a: "B", b: "E", weight: 5 },
];
const key = (a: string, b: string) => [a, b].sort().join("");
function dijkstra(ids: string[], edges: Edge[], source: string) {
  const dist = Object.fromEntries(
      ids.map((id) => [id, id === source ? 0 : Infinity]),
    ),
    pred = Object.fromEntries(ids.map((id) => [id, null])) as Record<
      string,
      string | null
    >,
    visited: string[] = [],
    steps: Snapshot[] = [
      {
        current: null,
        visited: [],
        dist: { ...dist },
        pred: { ...pred },
        log: `Initialize: d(${source})=0, others = ∞`,
      },
    ];
  while (visited.length < ids.length) {
    const current = ids
      .filter((id) => !visited.includes(id))
      .sort((a, b) => dist[a] - dist[b] || a.localeCompare(b))[0];
    if (!current || !Number.isFinite(dist[current])) break;
    const updates: string[] = [];
    for (const edge of edges.filter(
      (e) => e.a === current || e.b === current,
    )) {
      const next = edge.a === current ? edge.b : edge.a;
      if (visited.includes(next)) continue;
      const candidate = dist[current] + edge.weight;
      if (candidate < dist[next]) {
        dist[next] = candidate;
        pred[next] = current;
        updates.push(`${next}=${candidate} (via ${current})`);
      }
    }
    visited.push(current);
    steps.push({
      current,
      visited: [...visited],
      dist: { ...dist },
      pred: { ...pred },
      log: `Pick ${current} (${dist[current]}). ${updates.length ? `Update ${updates.join(", ")}` : "No shorter updates"}`,
    });
  }
  return steps;
}
function pathTo(target: string, pred: Record<string, string | null>) {
  const path: string[] = [];
  let at: string | null = target,
    guard = 0;
  while (at && guard++ < 20) {
    path.unshift(at);
    at = pred[at];
  }
  return path;
}
const tabCopy: Record<string, string> = {
  Learn:
    "Dijkstra finalizes unvisited vertices in increasing tentative distance.",
  "Worked Example": "Relax each neighbor using d(v) ← min(d(v), d(u)+w(u,v)).",
  Formula: "For non-negative weights, each finalized distance is shortest.",
  Practice: "Compare complete path costs, not just edge counts.",
};

export default function ShortestPathTargetLesson575({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [vertices, setVertices] = useState(initialVertices),
    [variant, setVariant] = useState<"base" | "alternate">("base"),
    [source, setSource] = useState("A"),
    [target, setTarget] = useState("E"),
    [step, setStep] = useState(1),
    [mode, setMode] = useState<"step" | "auto">("step"),
    [speed, setSpeed] = useState(500),
    [showDistances, setShowDistances] = useState(true),
    [showPred, setShowPred] = useState(true),
    [highlight, setHighlight] = useState(false),
    [tab, setTab] = useState("Interact"),
    [expanded, setExpanded] = useState(false),
    [dragging, setDragging] = useState<string | null>(null),
    [answer, setAnswer] = useState(""),
    [graded, setGraded] = useState<boolean | null>(null),
    [actions, setActions] = useState(0);
  const moved = useRef(false),
    edges = variant === "base" ? baseEdges : alternateEdges,
    ids = useMemo(() => vertices.map((v) => v.id), [vertices]),
    steps = useMemo(() => dijkstra(ids, edges, source), [ids, edges, source]),
    snapshot = steps[Math.min(step, steps.length - 1)],
    final = steps.at(-1)!,
    shortest = pathTo(target, final.pred),
    pathKeys = new Set(shortest.slice(1).map((id, i) => key(shortest[i], id))),
    targetDistance = snapshot.dist[target],
    done = step >= steps.length - 1;
  const act = (fn: () => void) => {
    fn();
    setActions((n) => n + 1);
    onInteraction();
  };
  const resetRun = () => {
    setStep(1);
    setMode("step");
    setHighlight(false);
  };
  const reset = () => {
    setVertices(initialVertices);
    setVariant("base");
    setSource("A");
    setTarget("E");
    setStep(1);
    setMode("step");
    setSpeed(500);
    setShowDistances(true);
    setShowPred(true);
    setHighlight(false);
    setTab("Interact");
    setExpanded(false);
    setDragging(null);
    setAnswer("");
    setGraded(null);
    setActions(0);
  };
  useEffect(reset, [resetToken]);
  useEffect(() => {
    if (mode !== "auto" || done) return;
    const timer = setTimeout(() => {
      setStep((n) => Math.min(steps.length - 1, n + 1));
      onInteraction();
    }, speed);
    return () => clearTimeout(timer);
  }, [mode, done, speed, steps.length, onInteraction]);
  const move = (event: PointerEvent<SVGSVGElement>) => {
    if (!dragging) return;
    const box = event.currentTarget.getBoundingClientRect(),
      x = Math.max(
        24,
        Math.min(556, ((event.clientX - box.left) / box.width) * 580),
      ),
      y = Math.max(
        24,
        Math.min(346, ((event.clientY - box.top) / box.height) * 370),
      );
    moved.current = true;
    setVertices((vs) =>
      vs.map((v) => (v.id === dragging ? { ...v, x, y } : v)),
    );
    onInteraction();
  };
  const changeEndpoints = (kind: "source" | "target", value: string) =>
    act(() => {
      if (kind === "source") setSource(value);
      else setTarget(value);
      resetRun();
    });
  const newGraph = () =>
    act(() => {
      setVariant((v) => (v === "base" ? "alternate" : "base"));
      setVertices(initialVertices);
      resetRun();
    });
  const challengeCorrect = answer === "A-B-C" || answer === "A-B-E-C";
  return (
    <section
      className={`sp575-page cs378-page ${expanded ? "expanded" : ""}`}
      data-testid="discrete-mockup-0632"
      data-object-model="dedicated-dijkstra-relaxation-state-model"
      data-source={source}
      data-target={target}
      data-step={step}
      data-current={snapshot.current ?? ""}
      data-visited={snapshot.visited.join(",")}
      data-distances={ids.map((id) => `${id}:${snapshot.dist[id]}`).join(",")}
      data-predecessors={ids
        .map((id) => `${id}:${snapshot.pred[id] ?? "-"}`)
        .join(",")}
      data-target-distance={targetDistance}
      data-final-distance={final.dist[target]}
      data-shortest-path={shortest.join(",")}
      data-done={done}
      data-variant={variant}
      data-positions={vertices
        .map((v) => `${v.id}:${Math.round(v.x)},${Math.round(v.y)}`)
        .join(";")}
      data-graded={graded === null ? "" : graded}
      data-actions={actions}
    >
      <header className="sp575-hero">
        <h1>
          <b>575</b> Shortest Path
        </h1>
        <p>
          <b>Objective:</b> Find the least-cost route between two vertices in a
          weighted graph using Dijkstra’s algorithm.
        </p>
        <dl>
          <span>
            ⌘ <b>Topic:</b> Graph Theory
          </span>
          <span>
            ◉ <b>Skills:</b> Shortest path, Dijkstra’s algorithm
          </span>
          <span>
            ♧ <b>Level:</b> Intermediate–Advanced
          </span>
          <span>
            ◷ <b>Time:</b> 6–10 min
          </span>
        </dl>
      </header>
      <nav className="sp575-tabs">
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
        <p className="sp575-tab-note">
          <b>{tab}</b> {tabCopy[tab]}
        </p>
      )}
      <section className="sp575-lab">
        <header>
          <h3>1. OBSERVE → MANIPULATE</h3>
          <p>
            Use the controls to explore how Dijkstra’s algorithm finds the
            shortest path.
          </p>
          <button onClick={() => act(resetRun)}>
            <RotateCcw />
            Reset
          </button>
          <button onClick={newGraph}>
            <Shuffle />
            New graph
          </button>
          <button
            aria-label="Toggle fullscreen"
            onClick={() => act(() => setExpanded((v) => !v))}
          >
            <Expand />
          </button>
        </header>
        <div>
          <aside>
            <h3>Graph setup</h3>
            <label>
              Source
              <select
                aria-label="Shortest path source"
                value={source}
                onChange={(e) => changeEndpoints("source", e.target.value)}
              >
                {ids.map((id) => (
                  <option key={id}>{id}</option>
                ))}
              </select>
            </label>
            <label>
              Target
              <select
                aria-label="Shortest path target"
                value={target}
                onChange={(e) => changeEndpoints("target", e.target.value)}
              >
                {ids.map((id) => (
                  <option key={id}>{id}</option>
                ))}
              </select>
            </label>
            <button
              onClick={() =>
                act(() => {
                  setSource("A");
                  setTarget("E");
                  resetRun();
                })
              }
            >
              Use example (A → E)
            </button>
            <h3>Algorithm controls</h3>
            <div className="sp575-mode">
              <button
                className={mode === "step" ? "active" : ""}
                onClick={() => act(() => setMode("step"))}
              >
                Step
              </button>
              <button
                className={mode === "auto" ? "active" : ""}
                onClick={() => act(() => setMode("auto"))}
              >
                Auto
              </button>
            </div>
            <label>
              Speed <span>{speed} ms</span>
              <input
                aria-label="Dijkstra speed"
                type="range"
                min="150"
                max="1000"
                step="50"
                value={speed}
                onChange={(e) => setSpeed(Number(e.target.value))}
              />
            </label>
            <button
              className="next"
              disabled={done}
              onClick={() =>
                act(() => setStep((n) => Math.min(steps.length - 1, n + 1)))
              }
            >
              Next step <Play />
            </button>
            <button
              onClick={() =>
                act(() => {
                  setStep(steps.length - 1);
                  setHighlight(true);
                })
              }
            >
              Run to completion »
            </button>
            <h3>View options</h3>
            <label>
              <input
                aria-label="Show tentative distances"
                type="checkbox"
                checked={showDistances}
                onChange={() => act(() => setShowDistances((v) => !v))}
              />
              Show tentative distances
            </label>
            <label>
              <input
                aria-label="Show predecessors"
                type="checkbox"
                checked={showPred}
                onChange={() => act(() => setShowPred((v) => !v))}
              />
              Show predecessors
            </label>
            <label>
              <input
                aria-label="Highlight shortest path"
                type="checkbox"
                checked={highlight}
                onChange={() => act(() => setHighlight((v) => !v))}
              />
              Highlight shortest path
            </label>
          </aside>
          <main>
            <section className="sp575-canvas">
              <header>
                <b>
                  Step {step} of {steps.length - 1}
                </b>
                <span>
                  Current vertex <strong>{snapshot.current ?? "–"}</strong>
                </span>
                <nav>
                  <i />
                  Visited <i />
                  Frontier <i />
                  Unvisited
                </nav>
              </header>
              <svg
                viewBox="0 0 580 370"
                role="img"
                aria-label="Dijkstra weighted graph"
                onPointerMove={move}
                onPointerUp={() => setDragging(null)}
                onPointerLeave={() => setDragging(null)}
              >
                {edges.map((edge) => {
                  const a = vertices.find((v) => v.id === edge.a)!,
                    b = vertices.find((v) => v.id === edge.b)!,
                    active = highlight && pathKeys.has(key(edge.a, edge.b));
                  return (
                    <g
                      key={key(edge.a, edge.b)}
                      className={active ? "path" : ""}
                    >
                      <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} />
                      <text x={(a.x + b.x) / 2 + 8} y={(a.y + b.y) / 2 - 5}>
                        {edge.weight}
                      </text>
                    </g>
                  );
                })}
                {vertices.map((v) => {
                  const visited = snapshot.visited.includes(v.id),
                    frontier = !visited && Number.isFinite(snapshot.dist[v.id]);
                  return (
                    <g
                      key={v.id}
                      data-testid={`shortest-vertex-${v.id}`}
                      className={`${visited ? "visited" : frontier ? "frontier" : "unvisited"} ${snapshot.current === v.id ? "current" : ""}`}
                      onPointerDown={(e) => {
                        setDragging(v.id);
                        e.currentTarget.setPointerCapture(e.pointerId);
                      }}
                      onClick={() => {
                        if (moved.current) moved.current = false;
                      }}
                    >
                      <circle cx={v.x} cy={v.y} r="24" />
                      <text x={v.x} y={v.y - 2}>
                        {v.id}
                      </text>
                      {showDistances && (
                        <text className="distance" x={v.x} y={v.y + 15}>
                          {Number.isFinite(snapshot.dist[v.id])
                            ? snapshot.dist[v.id]
                            : "∞"}
                        </text>
                      )}
                    </g>
                  );
                })}
              </svg>
            </section>
            <section className="sp575-state">
              <table>
                <thead>
                  <tr>
                    <th>Vertex</th>
                    {ids.map((id) => (
                      <th key={id}>{id}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th>Tentative distance d(·)</th>
                    {ids.map((id) => (
                      <td key={id}>
                        {Number.isFinite(snapshot.dist[id])
                          ? snapshot.dist[id]
                          : "∞"}
                      </td>
                    ))}
                  </tr>
                  {showPred && (
                    <tr>
                      <th>Predecessor π(·)</th>
                      {ids.map((id) => (
                        <td key={id}>{snapshot.pred[id] ?? "—"}</td>
                      ))}
                    </tr>
                  )}
                  <tr>
                    <th>Status</th>
                    {ids.map((id) => (
                      <td key={id}>
                        <i
                          className={
                            snapshot.visited.includes(id)
                              ? "visited"
                              : Number.isFinite(snapshot.dist[id])
                                ? "frontier"
                                : "unvisited"
                          }
                        />
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
              <aside>
                <h3>Algorithm log</h3>
                {steps
                  .slice(0, step + 1)
                  .slice(-3)
                  .map((item, i) => (
                    <p key={i}>• {item.log}</p>
                  ))}
              </aside>
            </section>
          </main>
        </div>
      </section>
      <section className="sp575-theory">
        <article>
          <h3>2. NOTICE THE PATTERN</h3>
          <ul>
            <li>
              Vertices become “visited” in order of smallest tentative distance.
            </li>
            <li>When a vertex is visited, its distance is final.</li>
            <li>Only neighbours of the current vertex are updated.</li>
          </ul>
        </article>
        <article>
          <h3>3. UNDERSTAND THE RULE</h3>
          <b>Dijkstra’s Algorithm (non-negative edge weights)</b>
          <ol>
            <li>Set d(s)=0, d(v)=∞ for all v ≠ s.</li>
            <li>Choose the unvisited vertex u with smallest d(u).</li>
            <li>
              For each unvisited neighbour v, update:
              <strong>
                If d(u)+w(u,v)&lt;d(v), then d(v)←d(u)+w(u,v) and π(v)←u.
              </strong>
            </li>
            <li>Stop when the target is visited.</li>
          </ol>
        </article>
      </section>
      <section className="sp575-worked">
        <article>
          <h3>4. WORKED EXAMPLE (A → E)</h3>
          <table>
            <thead>
              <tr>
                <th>Step</th>
                <th>Picked</th>
                {ids.map((id) => (
                  <th key={id}>d({id})</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {dijkstra(ids, baseEdges, "A").map((s, i) => (
                <tr key={i}>
                  <td>{i}</td>
                  <td>{s.current ?? "—"}</td>
                  {ids.map((id) => (
                    <td key={id}>
                      {Number.isFinite(s.dist[id]) ? s.dist[id] : "∞"}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          <p>
            Shortest path: <b>A → B → E</b>
            <span>
              Total cost: <b>4</b>
            </span>
          </p>
        </article>
        <div>
          <article>
            <h3>Key definition</h3>
            <p>
              The shortest path between s and t is a path of minimum total
              weight from s to t.
            </p>
          </article>
          <article>
            <h3>Common misconception</h3>
            <b>✕ Greedy trap: Always take the locally smallest edge.</b>
            <p>
              It may lead to a longer overall route. Dijkstra compares complete
              tentative totals.
            </p>
          </article>
        </div>
      </section>
      <section className="sp575-practice">
        <div>
          <h3>5. TRY INDEPENDENTLY</h3>
          <p>
            <b>Challenge:</b> Find the shortest path from A to C.
          </p>
          <MiniGraph />
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            act(() => setGraded(challengeCorrect));
          }}
        >
          {[
            ["A-B-C", "A → B → C, cost 5"],
            ["A-D-C", "A → D → C, cost 4"],
            ["A-B-E-C", "A → B → E → C, cost 5"],
            ["A-D-E-C", "A → D → E → C, cost 7"],
          ].map(([value, label]) => (
            <label key={value}>
              <input
                type="radio"
                name="shortest-answer"
                value={value}
                checked={answer === value}
                onChange={(e) => setAnswer(e.target.value)}
              />
              {label}
            </label>
          ))}
          <button type="submit">Check answer</button>
          <output
            className={graded ? "correct" : graded === false ? "wrong" : ""}
          >
            {graded
              ? "Correct: this route has the minimum cost 5."
              : graded === false
                ? "Not yet. Add every edge weight in the route."
                : "Hint: Use the simulator to verify your answer."}
          </output>
        </form>
      </section>
      <nav className="sp575-adjacent">
        <a href="/lessons/discrete-and-applied-mathematics/574-minimum-spanning-tree">
          ←{" "}
          <span>
            Previous Lesson<b>Minimum Spanning Tree</b>
          </span>
        </a>
        <p>
          Lesson progress <b>1/5</b>
        </p>
        <a href="/lessons/discrete-and-applied-mathematics/576-graph-colouring">
          <span>
            Next Lesson<b>Graph Colouring</b>
          </span>{" "}
          →
        </a>
      </nav>
    </section>
  );
}
function MiniGraph() {
  return (
    <svg
      className="sp575-mini"
      viewBox="0 0 300 170"
      role="img"
      aria-label="Shortest path challenge graph"
    >
      {baseEdges.map((e) => {
        const a = initialVertices.find((v) => v.id === e.a)!,
          b = initialVertices.find((v) => v.id === e.b)!,
          sx = (x: number) => 20 + x * 0.48,
          sy = (y: number) => 5 + y * 0.43;
        return (
          <g key={key(e.a, e.b)}>
            <line x1={sx(a.x)} y1={sy(a.y)} x2={sx(b.x)} y2={sy(b.y)} />
            <text x={(sx(a.x) + sx(b.x)) / 2} y={(sy(a.y) + sy(b.y)) / 2 - 3}>
              {e.weight}
            </text>
          </g>
        );
      })}
      {initialVertices.map((v) => {
        const x = 20 + v.x * 0.48,
          y = 5 + v.y * 0.43;
        return (
          <g key={v.id}>
            <circle cx={x} cy={y} r="13" />
            <text x={x} y={y + 4}>
              {v.id}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
