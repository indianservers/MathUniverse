import {
  CheckCircle2,
  Lightbulb,
  RotateCcw,
  Trash2,
  Undo2,
  XCircle,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { PointerEvent } from "react";
import type { LessonAdapterProps } from "../../types";
import "../geometry3d/CoordinateSystemTargetLesson378.css";
import "./HamiltonianPathsTargetLesson572.css";

type Vertex = { id: string; x: number; y: number };
type Edge = { a: string; b: string; weight: number };
const initialVertices: Vertex[] = [
  { id: "A", x: 105, y: 105 },
  { id: "B", x: 285, y: 40 },
  { id: "C", x: 470, y: 105 },
  { id: "D", x: 165, y: 330 },
  { id: "E", x: 405, y: 330 },
];
const cycleEdges: Edge[] = [
  { a: "A", b: "B", weight: 2 },
  { a: "B", b: "C", weight: 3 },
  { a: "C", b: "E", weight: 4 },
  { a: "E", b: "D", weight: 5 },
  { a: "D", b: "A", weight: 1 },
];
const denseEdges: Edge[] = [
  ...cycleEdges,
  { a: "A", b: "C", weight: 2 },
  { a: "B", b: "D", weight: 2 },
];
const practiceVertices: Vertex[] = [
  { id: "A", x: 25, y: 25 },
  { id: "B", x: 155, y: 25 },
  { id: "C", x: 155, y: 155 },
  { id: "D", x: 25, y: 155 },
  { id: "E", x: 90, y: 90 },
];
const practiceEdges: Edge[] = [
  { a: "A", b: "B", weight: 1 },
  { a: "B", b: "C", weight: 1 },
  { a: "C", b: "D", weight: 1 },
  { a: "D", b: "A", weight: 1 },
  { a: "A", b: "E", weight: 1 },
  { a: "B", b: "E", weight: 1 },
  { a: "C", b: "E", weight: 1 },
  { a: "D", b: "E", weight: 1 },
];
const key = (a: string, b: string) => [a, b].sort().join("");
const adjacent = (a: string, b: string, edges: Edge[]) =>
  edges.some((e) => key(e.a, e.b) === key(a, b));
function canFinish(route: string[], vertices: Vertex[], edges: Edge[]) {
  if (!route.length) return true;
  const visit = (at: string, seen: Set<string>): boolean => {
    if (seen.size === vertices.length) return true;
    return vertices.some(
      (v) =>
        !seen.has(v.id) &&
        adjacent(at, v.id, edges) &&
        visit(v.id, new Set([...seen, v.id])),
    );
  };
  return visit(route.at(-1)!, new Set(route));
}
function parseRoute(value: string) {
  return value.toUpperCase().match(/[A-E]/g) ?? [];
}
const tabCopy: Record<string, string> = {
  Learn: "Hamiltonian routes focus on visiting every vertex exactly once.",
  "Worked Example":
    "Check adjacency and uniqueness at every step before closing a cycle.",
  Formula:
    "A Hamiltonian path has |visited vertices| = |V|; a cycle also returns to its start.",
  Practice: "Enter a vertex sequence and validate every consecutive edge.",
};

function StaticGraph({
  vertices,
  edges,
  route = [],
}: {
  vertices: Vertex[];
  edges: Edge[];
  route?: string[];
}) {
  const used = new Set(route.slice(1).map((v, i) => key(route[i], v)));
  return (
    <svg
      className="ha572-graph"
      viewBox="0 0 575 390"
      role="img"
      aria-label="Hamiltonian graph"
    >
      {edges.map((e) => {
        const a = vertices.find((v) => v.id === e.a)!,
          b = vertices.find((v) => v.id === e.b)!;
        return (
          <g
            key={key(e.a, e.b)}
            className={used.has(key(e.a, e.b)) ? "used" : ""}
          >
            <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} />
            <text x={(a.x + b.x) / 2 + 8} y={(a.y + b.y) / 2 - 5}>
              {e.weight}
            </text>
          </g>
        );
      })}
      {vertices.map((v) => (
        <g key={v.id} className={route.includes(v.id) ? "visited" : ""}>
          <circle cx={v.x} cy={v.y} r="22" />
          <text x={v.x} y={v.y + 5}>
            {v.id}
          </text>
        </g>
      ))}
    </svg>
  );
}

export default function HamiltonianPathsTargetLesson572({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [vertices, setVertices] = useState(initialVertices),
    [edges, setEdges] = useState(cycleEdges),
    [route, setRoute] = useState(["A", "B", "C"]);
  const [tab, setTab] = useState("Interact"),
    [showSteps, setShowSteps] = useState(true),
    [answer, setAnswer] = useState(""),
    [graded, setGraded] = useState<boolean | null>(null),
    [hint, setHint] = useState(false),
    [message, setMessage] = useState(
      "Continue from C to an unvisited adjacent vertex.",
    ),
    [actions, setActions] = useState(0),
    [dragging, setDragging] = useState<string | null>(null);
  const moved = useRef(false),
    start = route[0],
    current = route.at(-1),
    unique = new Set(route),
    allVisited = initialVertices.every((v) => unique.has(v.id)),
    returns = route.length > 1 && current === start,
    isPath = allVisited && unique.size === initialVertices.length,
    isCycle = isPath && returns,
    valid =
      route.slice(1).every((v, i) => adjacent(route[i], v, edges)) &&
      new Set(returns ? route.slice(0, -1) : route).size ===
        (returns ? route.length - 1 : route.length),
    completable =
      valid && canFinish(returns ? route.slice(0, -1) : route, vertices, edges);
  const act = (fn: () => void) => {
    fn();
    setActions((n) => n + 1);
    onInteraction();
  };
  const reset = () => {
    setVertices(initialVertices);
    setEdges(cycleEdges);
    setRoute(["A", "B", "C"]);
    setTab("Interact");
    setShowSteps(true);
    setAnswer("");
    setGraded(null);
    setHint(false);
    setMessage("Continue from C to an unvisited adjacent vertex.");
    setDragging(null);
    setActions(0);
  };
  useEffect(reset, [resetToken]);
  const choose = (id: string) => {
    if (moved.current) {
      moved.current = false;
      return;
    }
    const from = route.at(-1)!;
    if (id === start && allVisited && adjacent(from, id, edges))
      return act(() => {
        setRoute((r) => [...r, id]);
        setMessage(
          "Hamiltonian cycle complete: every vertex was visited once before returning.",
        );
      });
    if (route.includes(id))
      return act(() =>
        setMessage(
          `${id} was already visited. Hamiltonian routes cannot revisit vertices.`,
        ),
      );
    if (!adjacent(from, id, edges))
      return act(() => setMessage(`${id} is not adjacent to ${from}.`));
    act(() => {
      const next = [...route, id];
      setRoute(next);
      setMessage(
        next.length === vertices.length
          ? "Every vertex is now visited exactly once."
          : `Visited ${id}. Continue from this vertex.`,
      );
    });
  };
  const move = (event: PointerEvent<SVGSVGElement>) => {
    if (!dragging) return;
    const box = event.currentTarget.getBoundingClientRect(),
      x = Math.max(
        25,
        Math.min(550, ((event.clientX - box.left) / box.width) * 575),
      ),
      y = Math.max(
        25,
        Math.min(365, ((event.clientY - box.top) / box.height) * 390),
      );
    moved.current = true;
    setVertices((vs) =>
      vs.map((v) => (v.id === dragging ? { ...v, x, y } : v)),
    );
    onInteraction();
  };
  const randomize = () =>
    act(() => {
      setEdges((current) =>
        current.length === cycleEdges.length ? denseEdges : cycleEdges,
      );
      setRoute(["A"]);
      setMessage("New graph loaded. Build a route from A.");
    });
  const checkPractice = () =>
    act(() => {
      const parsed = parseRoute(answer),
        uniqueAnswer = new Set(parsed),
        ok =
          parsed.length === practiceVertices.length &&
          uniqueAnswer.size === practiceVertices.length &&
          parsed
            .slice(1)
            .every((v, i) => adjacent(parsed[i], v, practiceEdges));
      setGraded(ok);
    });
  const routeText = route.join(" → ");
  return (
    <section
      className="ha572-page cs378-page"
      data-testid="discrete-mockup-0629"
      data-object-model="dedicated-hamiltonian-vertex-route-search-model"
      data-route={route.join(",")}
      data-visited-count={Math.min(unique.size, vertices.length)}
      data-valid={valid}
      data-can-complete={completable}
      data-is-path={isPath && !returns}
      data-is-cycle={isCycle}
      data-edge-count={edges.length}
      data-positions={vertices
        .map((v) => `${v.id}:${Math.round(v.x)},${Math.round(v.y)}`)
        .join(";")}
      data-graded={graded === null ? "" : graded}
      data-actions={actions}
    >
      <header className="ha572-hero">
        <div>
          <h1>Hamiltonian Paths and Cycles</h1>
          <p>
            <b>Objective:</b> Visit every vertex exactly once. Hamiltonian path
            visits all vertices; Hamiltonian cycle returns to start.
          </p>
          <dl>
            <span>
              ◉ <b>Level:</b> Intermediate
            </span>
            <span>
              ▣ <b>Topic:</b> Graph Theory
            </span>
            <span>
              ◷ <b>Time:</b> 6–10 min
            </span>
            <span>
              ◇ <b>Type:</b> Explore &amp; Practice
            </span>
          </dl>
        </div>
        <aside>
          <b>Quick idea</b>
          <Lightbulb />
          <p>
            Hamiltonian = vertex-focused.
            <br />
            Each vertex appears exactly once.
          </p>
        </aside>
      </header>
      <nav className="ha572-tabs">
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
        <p className="ha572-tab-note">
          <b>{tab}</b> {tabCopy[tab]}
        </p>
      )}
      <section className="ha572-sequence">
        {[
          ["1", "Observe", "See the graph"],
          ["2", "Manipulate", "Build a route"],
          ["3", "Notice", "Spot the pattern"],
          ["4", "Understand", "Learn the rule"],
          ["5", "Try", "Do it yourself"],
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
      <section className="ha572-builder">
        <h2>Hamiltonian Route Builder</h2>
        <div>
          <main>
            <svg
              className="ha572-graph"
              viewBox="0 0 575 390"
              role="img"
              aria-label="Interactive Hamiltonian route graph"
              onPointerMove={move}
              onPointerUp={() => setDragging(null)}
              onPointerLeave={() => setDragging(null)}
            >
              {edges.map((e) => {
                const a = vertices.find((v) => v.id === e.a)!,
                  b = vertices.find((v) => v.id === e.b)!,
                  used = route
                    .slice(1)
                    .some((v, i) => key(route[i], v) === key(e.a, e.b));
                return (
                  <g key={key(e.a, e.b)} className={used ? "used" : ""}>
                    <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} />
                    <text x={(a.x + b.x) / 2 + 8} y={(a.y + b.y) / 2 - 5}>
                      {e.weight}
                    </text>
                  </g>
                );
              })}
              {vertices.map((v) => (
                <g
                  key={v.id}
                  data-testid={`hamiltonian-vertex-${v.id}`}
                  className={`${route.includes(v.id) ? "visited " : ""}${current === v.id ? "current" : ""}`}
                  onPointerDown={(event) => {
                    setDragging(v.id);
                    event.currentTarget.setPointerCapture(event.pointerId);
                  }}
                  onClick={() => choose(v.id)}
                >
                  <circle cx={v.x} cy={v.y} r="22" />
                  <text x={v.x} y={v.y + 5}>
                    {v.id}
                  </text>
                </g>
              ))}
            </svg>
            <footer>
              Click a vertex to continue the route.{" "}
              <span>
                <i /> Start <i /> Visited <i /> Available <i /> Unavailable
              </span>
            </footer>
          </main>
          <aside>
            <header>
              <h3>Your route</h3>
              <button
                onClick={() =>
                  act(() => {
                    setRoute(["A"]);
                    setMessage("Route cleared. Continue from A.");
                  })
                }
              >
                Clear <Trash2 />
              </button>
            </header>
            <div className="ha572-route">
              {route.map((id, i) => (
                <span key={`${id}-${i}`}>
                  {id}
                  {i < route.length - 1 && <i>→</i>}
                </span>
              ))}
            </div>
            <output
              className={isPath ? "good" : !completable ? "bad" : "neutral"}
            >
              {isCycle ? (
                <>
                  <CheckCircle2 />
                  <b>Hamiltonian cycle!</b>
                </>
              ) : isPath ? (
                <>
                  <CheckCircle2 />
                  <b>Hamiltonian path!</b>
                </>
              ) : !completable ? (
                <>
                  <XCircle />
                  <b>Dead end!</b>
                </>
              ) : (
                <>
                  <Lightbulb />
                  <b>Route in progress</b>
                </>
              )}
              <small>{message}</small>
            </output>
            <dl>
              <span>
                Vertices visited
                <b>
                  {Math.min(unique.size, vertices.length)} / {vertices.length}
                </b>
              </span>
              <span>
                Valid so far<b>{valid ? "Yes" : "No"}</b>
              </span>
              <span>
                Can complete?<b>{completable ? "Yes" : "No"}</b>
              </span>
            </dl>
            <div className="ha572-actions">
              <button
                onClick={() =>
                  act(() =>
                    setRoute((r) => (r.length > 1 ? r.slice(0, -1) : r)),
                  )
                }
              >
                <Undo2 /> Undo last step
              </button>
              <button disabled={!isPath}>✓ Check route</button>
            </div>
          </aside>
        </div>
      </section>
      <section className="ha572-analysis">
        <article>
          <h3>Try different routes</h3>
          {[
            ["A", "B", "C", "E", "D"],
            ["A", "B", "C", "E", "D", "A"],
            ["A", "D", "E", "C", "B"],
            ["A", "B", "C", "A", "D"],
          ].map((r, i) => (
            <button
              key={i}
              onClick={() =>
                act(() => {
                  setRoute(r);
                  setMessage(
                    i === 3
                      ? "A is revisited before all vertices are visited."
                      : "Example route loaded.",
                  );
                })
              }
            >
              <span>
                {r.join(" → ")}
                <small>
                  {i === 1
                    ? "Hamiltonian cycle"
                    : i === 3
                      ? "Dead end"
                      : "Hamiltonian path"}
                </small>
              </span>
              {i === 3 ? <XCircle /> : <CheckCircle2 />}
            </button>
          ))}
          <button onClick={randomize}>
            <RotateCcw /> Randomize graph
          </button>
        </article>
        <article>
          <h3>Route details (current)</h3>
          <p>{routeText}</p>
          <dl>
            <span>
              Length (edges)<b>{Math.max(0, route.length - 1)}</b>
            </span>
            <span>
              Unique vertices
              <b>
                {Math.min(unique.size, vertices.length)} / {vertices.length}
              </b>
            </span>
            <span>
              Returns to start?<b>{returns ? "Yes" : "No"}</b>
            </span>
          </dl>
          <strong>
            {isCycle
              ? "This is a Hamiltonian cycle"
              : isPath
                ? "This is a Hamiltonian path"
                : completable
                  ? "This route can still be completed"
                  : "This route cannot be completed"}
            <small>
              {isPath ? "All vertices visited exactly once." : message}
            </small>
          </strong>
          <label>
            Show step-by-step order
            <input
              aria-label="Show step-by-step order"
              type="checkbox"
              checked={showSteps}
              onChange={() => act(() => setShowSteps((v) => !v))}
            />
          </label>
        </article>
        <article>
          <h3>Contrast: Euler vs Hamiltonian</h3>
          <div>
            <b>Hamiltonian (vertex rule)</b>
            <ul>
              <li>Visit every vertex exactly once.</li>
              <li>Edges may repeat (not required here).</li>
              <li>Focus: vertices.</li>
            </ul>
          </div>
          <div>
            <b>Eulerian (edge rule)</b>
            <ul>
              <li>Use every edge exactly once.</li>
              <li>Vertices may repeat.</li>
              <li>Focus: edges.</li>
            </ul>
          </div>
          <p>
            <b>Key difference:</b> Vertex rule vs Edge rule.
          </p>
        </article>
      </section>
      <section className="ha572-worked">
        <article>
          <h3>Worked Example</h3>
          <p>Find a Hamiltonian cycle in the given graph.</p>
          <div>
            <StaticGraph
              vertices={initialVertices}
              edges={cycleEdges}
              route={["A", "B", "C", "E", "D", "A"]}
            />
            <aside>
              <b>Solution</b>
              <p>One Hamiltonian cycle is:</p>
              <strong>A → B → C → E → D → A</strong>
              <p>
                All vertices appear exactly once before returning to the start.
              </p>
              <b>Length (edges) = 5</b>
            </aside>
          </div>
        </article>
        <article>
          <h3>Key Rule / Definition</h3>
          <div>
            <b>Hamiltonian Path</b>
            <p>A path in a graph that visits every vertex exactly once.</p>
          </div>
          <div>
            <b>Hamiltonian Cycle</b>
            <p>
              A cycle that visits every vertex exactly once and returns to the
              starting vertex.
            </p>
          </div>
          <strong>
            |{"{"}visited vertices{"}"}| = |V|
          </strong>
        </article>
      </section>
      <section className="ha572-challenge">
        <article>
          <h3>⚠ Common Misconception</h3>
          <b>Wrong: Visiting all vertices is the same as using all edges.</b>
          <p>
            Not always! You may visit every vertex without using every edge.
          </p>
          <p>
            Hamiltonian is about <b>vertices</b>, not edges.
          </p>
        </article>
        <article>
          <div>
            <h3>Your Turn (Challenge)</h3>
            <p>Find one Hamiltonian path in the graph.</p>
            <svg
              viewBox="0 0 180 180"
              role="img"
              aria-label="Hamiltonian practice graph"
            >
              {practiceEdges.map((e) => {
                const a = practiceVertices.find((v) => v.id === e.a)!,
                  b = practiceVertices.find((v) => v.id === e.b)!;
                return (
                  <line
                    key={key(e.a, e.b)}
                    x1={a.x}
                    y1={a.y}
                    x2={b.x}
                    y2={b.y}
                  />
                );
              })}
              {practiceVertices.map((v) => (
                <g key={v.id}>
                  <circle cx={v.x} cy={v.y} r="13" />
                  <text x={v.x} y={v.y + 4}>
                    {v.id}
                  </text>
                </g>
              ))}
            </svg>
          </div>
          <form
            onSubmit={(event) => {
              event.preventDefault();
              checkPractice();
            }}
          >
            <label>
              Enter your route
              <input
                aria-label="Hamiltonian challenge route"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Click vertices in order"
              />
            </label>
            <p>
              Your route: <b>{parseRoute(answer).join(" → ") || "–"}</b>
            </p>
            <button type="submit">Check</button>
            {graded !== null && (
              <output className={graded ? "correct" : "wrong"}>
                {graded
                  ? "Correct Hamiltonian path."
                  : "Route must visit A–E once using real edges."}
              </output>
            )}
          </form>
          <aside>
            <h3>Hint</h3>
            <p>
              Start anywhere.
              <br />
              Use each vertex exactly once.
            </p>
            <button onClick={() => act(() => setHint((v) => !v))}>
              Show answer
            </button>
            {hint && <b>A → B → E → D → C</b>}
          </aside>
        </article>
      </section>
      <nav className="ha572-adjacent">
        <a href="/lessons/discrete-and-applied-mathematics/571-euler-paths-and-circuits">
          ←{" "}
          <span>
            Previous Lesson<b>Euler Paths and Circuits</b>
          </span>
        </a>
        <p>
          <b>25</b> of 85 Lessons
          <i />
        </p>
        <a href="/lessons/discrete-and-applied-mathematics/573-trees">
          <span>
            Next Lesson<b>Trees</b>
          </span>{" "}
          →
        </a>
      </nav>
    </section>
  );
}
