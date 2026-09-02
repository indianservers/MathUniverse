import { CheckCircle2, Lightbulb, RotateCcw } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { LessonAdapterProps } from "../../types";
import "../geometry3d/CoordinateSystemTargetLesson378.css";
import "./EulerPathsTargetLesson571.css";

type Vertex = { id: string; x: number; y: number };
type Edge = { a: string; b: string; weight: number };
const vertices: Vertex[] = [
  { id: "A", x: 105, y: 110 },
  { id: "B", x: 285, y: 45 },
  { id: "C", x: 470, y: 110 },
  { id: "D", x: 170, y: 330 },
  { id: "E", x: 405, y: 330 },
];
const circuitEdges: Edge[] = [
  { a: "A", b: "B", weight: 2 },
  { a: "B", b: "C", weight: 3 },
  { a: "C", b: "E", weight: 4 },
  { a: "E", b: "D", weight: 5 },
  { a: "D", b: "A", weight: 1 },
];
const pathEdges: Edge[] = [...circuitEdges, { a: "A", b: "C", weight: 6 }];
const practiceVertices: Vertex[] = [
  { id: "A", x: 30, y: 25 },
  { id: "B", x: 230, y: 25 },
  { id: "C", x: 230, y: 150 },
  { id: "D", x: 30, y: 150 },
  { id: "E", x: 130, y: 88 },
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
const edgeKey = (a: string, b: string) => [a, b].sort().join("");
const degrees = (items: Vertex[], edges: Edge[]) =>
  Object.fromEntries(
    items.map((v) => [
      v.id,
      edges.filter((e) => e.a === v.id || e.b === v.id).length,
    ]),
  );
const kindFor = (items: Vertex[], edges: Edge[]) => {
  const values = degrees(items, edges),
    odd = items.filter((v) => values[v.id] % 2).map((v) => v.id);
  return {
    values,
    odd,
    kind: odd.length === 0 ? "circuit" : odd.length === 2 ? "path" : "none",
  };
};
const tabCopy: Record<string, string> = {
  Learn: "Euler trails use every edge exactly once. Vertices may be revisited.",
  "Worked Example":
    "Track consumed edges, not merely the sequence of vertices.",
  Formula:
    "A connected graph has an Euler circuit with 0 odd vertices and an Euler path with exactly 2.",
  Practice: "Count odd-degree vertices before attempting a traversal.",
};

function Graph({
  edges,
  walk = [],
  used = [],
  onVertex,
}: {
  edges: Edge[];
  walk?: string[];
  used?: string[];
  onVertex?: (id: string) => void;
}) {
  const usedSet = new Set(used);
  return (
    <svg
      className="eu571-graph"
      viewBox="0 0 575 390"
      role="img"
      aria-label="Euler traversal graph"
    >
      {edges.map((edge) => {
        const a = vertices.find((v) => v.id === edge.a)!,
          b = vertices.find((v) => v.id === edge.b)!,
          active = usedSet.has(edgeKey(edge.a, edge.b));
        return (
          <g key={edgeKey(edge.a, edge.b)} className={active ? "used" : ""}>
            <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} />
            <text x={(a.x + b.x) / 2 + 8} y={(a.y + b.y) / 2 - 5}>
              {edge.weight}
            </text>
          </g>
        );
      })}
      {vertices.map((v) => (
        <g
          key={v.id}
          data-testid={`euler-vertex-${v.id}`}
          className={walk.at(-1) === v.id ? "current" : ""}
          onClick={() => onVertex?.(v.id)}
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

export default function EulerPathsTargetLesson571({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [variant, setVariant] = useState<"circuit" | "path">("circuit"),
    [start, setStart] = useState("A"),
    [walk, setWalk] = useState<string[]>(["A"]);
  const [tab, setTab] = useState("Interact"),
    [answer, setAnswer] = useState(""),
    [graded, setGraded] = useState<boolean | null>(null),
    [hint, setHint] = useState(false),
    [message, setMessage] = useState(
      "Choose an adjacent vertex to consume the first edge.",
    ),
    [actions, setActions] = useState(0);
  const edges = variant === "circuit" ? circuitEdges : pathEdges;
  const analysis = useMemo(() => kindFor(vertices, edges), [edges]);
  const used = walk.slice(1).map((id, index) => edgeKey(walk[index], id));
  const complete =
    used.length === edges.length && new Set(used).size === edges.length;
  const act = (fn: () => void) => {
    fn();
    setActions((n) => n + 1);
    onInteraction();
  };
  const resetPath = (nextStart = start) => {
    setStart(nextStart);
    setWalk([nextStart]);
    setMessage("Choose an adjacent vertex to consume the first edge.");
  };
  const reset = () => {
    setVariant("circuit");
    setStart("A");
    setWalk(["A"]);
    setTab("Interact");
    setAnswer("");
    setGraded(null);
    setHint(false);
    setMessage("Choose an adjacent vertex to consume the first edge.");
    setActions(0);
  };
  useEffect(reset, [resetToken]);
  const choose = (id: string) => {
    const from = walk.at(-1)!;
    if (id === from) return;
    const key = edgeKey(from, id),
      exists = edges.some((e) => edgeKey(e.a, e.b) === key);
    if (!exists)
      return act(() => setMessage(`${id} is not adjacent to ${from}.`));
    if (used.includes(key))
      return act(() => setMessage(`Edge ${from}-${id} has already been used.`));
    act(() => {
      setWalk((current) => [...current, id]);
      setMessage(
        used.length + 1 === edges.length
          ? "Every edge has been used exactly once."
          : `Consumed edge ${from}-${id}.`,
      );
    });
  };
  const newGraph = () =>
    act(() => {
      const next = variant === "circuit" ? "path" : "circuit";
      setVariant(next);
      const nextAnalysis = kindFor(
        vertices,
        next === "circuit" ? circuitEdges : pathEdges,
      );
      const nextStart = nextAnalysis.odd[0] ?? "A";
      setStart(nextStart);
      setWalk([nextStart]);
      setMessage("New graph loaded. Count its odd-degree vertices.");
    });
  const practice = kindFor(practiceVertices, practiceEdges);
  const check = () =>
    act(() => {
      const normalized = answer.trim().toUpperCase();
      setGraded(
        practice.kind === "none" &&
          ["NONE", "NO PATH", "IMPOSSIBLE"].includes(normalized),
      );
    });
  return (
    <section
      className="eu571-page cs378-page"
      data-testid="discrete-mockup-0628"
      data-object-model="dedicated-euler-edge-consumption-degree-model"
      data-edge-count={edges.length}
      data-used-count={used.length}
      data-walk={walk.join(",")}
      data-euler-kind={analysis.kind}
      data-odd-count={analysis.odd.length}
      data-complete={complete}
      data-variant={variant}
      data-graded={graded === null ? "" : graded}
      data-actions={actions}
    >
      <header className="eu571-hero">
        <div>
          <small>DISCRETE AND APPLIED MATHEMATICS</small>
          <small>COMBINATORICS, GRAPH THEORY AND LOGIC</small>
        </div>
        <h1>
          <b>571</b> Euler Paths and Circuits
        </h1>
        <p>Traverse every edge exactly once.</p>
        <dl>
          <span>
            ♙ <b>Level:</b> Intermediate–Advanced
          </span>
          <span>
            ♢ <b>Type:</b> Interactive Lab
          </span>
          <span>
            ◷ <b>Duration:</b> 6–10 min
          </span>
          <span>
            ⌘ <b>Focus:</b> Euler paths, circuits
          </span>
        </dl>
      </header>
      <nav className="eu571-tabs">
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
        <p className="eu571-tab-note" role="status">
          <b>{tab}</b> {tabCopy[tab]}
        </p>
      )}
      <section className="eu571-lab">
        <header>
          <div>
            <h3>OBSERVE &amp; MANIPULATE</h3>
            <p>
              Click a vertex to start, then click adjacent vertices to traverse
              every edge exactly once.
            </p>
          </div>
          <button onClick={newGraph}>
            <RotateCcw /> New Graph
          </button>
        </header>
        <div className="eu571-lab-grid">
          <main>
            <Graph edges={edges} walk={walk} used={used} onVertex={choose} />
            <footer>
              This graph has{" "}
              <b>
                {analysis.odd.length} odd-degree{" "}
                {analysis.odd.length === 1 ? "vertex" : "vertices"}
                {analysis.odd.length ? `: ${analysis.odd.join(", ")}` : ""}.
              </b>
              <strong>
                {analysis.kind === "circuit"
                  ? "An Euler circuit exists (start and end at the same vertex)."
                  : analysis.kind === "path"
                    ? "An Euler path exists (start at one odd vertex, end at the other)."
                    : "No Euler path exists."}
              </strong>
            </footer>
          </main>
          <aside>
            <h3>LAB CONTROLS</h3>
            <b>Start vertex</b>
            <div className="eu571-starts">
              {vertices.map((v) => (
                <button
                  key={v.id}
                  aria-label={`Start at ${v.id}`}
                  className={start === v.id ? "active" : ""}
                  onClick={() => act(() => resetPath(v.id))}
                >
                  {v.id}
                </button>
              ))}
            </div>
            <button
              className="eu571-reset"
              onClick={() => act(() => resetPath())}
            >
              <RotateCcw /> Reset Path
            </button>
            <hr />
            <h3>Traversal status</h3>
            <dl className="eu571-status">
              <span>
                Edges used{" "}
                <b>
                  {used.length} / {edges.length}
                </b>
              </span>
              <span>
                Current vertex <b>{walk.at(-1)}</b>
              </span>
              <span>
                Path so far <b>{walk.join(" → ")}</b>
              </span>
            </dl>
            <p role="status">{message}</p>
            <h3>Vertex degrees</h3>
            <dl className="eu571-degrees">
              {vertices.map((v) => (
                <span key={v.id}>
                  <b>{v.id}</b>
                  <i>{analysis.values[v.id]}</i>
                  <em className={analysis.values[v.id] % 2 ? "odd" : ""}>
                    {analysis.values[v.id] % 2 ? "odd" : "even"}
                  </em>
                </span>
              ))}
            </dl>
          </aside>
        </div>
      </section>
      <section className="eu571-sequence">
        <h3>LEARNING SEQUENCE</h3>
        <div>
          {[
            ["1", "Observe", "Explore the graph and its vertex degrees."],
            [
              "2",
              "Manipulate",
              "Click through vertices to traverse every edge exactly once.",
            ],
            [
              "3",
              "Notice",
              "When does a traversal succeed? What do you notice about odd degree vertices?",
            ],
            [
              "4",
              "Understand",
              "Learn the rule that determines when an Euler path or circuit exists.",
            ],
            ["5", "Try", "Solve a new graph to apply what you learned."],
          ].map((item) => (
            <article key={item[0]}>
              <h4>
                <b>{item[0]}</b>
                {item[1]}
              </h4>
              <p>{item[2]}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="eu571-theory">
        <article>
          <h3>WORKED EXAMPLE (CORRECT TRAVERSAL)</h3>
          <p>One valid Euler circuit starting and ending at A.</p>
          <Graph
            edges={circuitEdges}
            walk={["A", "B", "C", "E", "D", "A"]}
            used={circuitEdges.map((e) => edgeKey(e.a, e.b))}
          />
          <p>
            <b>Traversal order:</b> A → B → C → E → D → A
          </p>
          <p>
            <b>Edges used:</b> 1 → 2 → 3 → 4 → 5 (all once) ✓
          </p>
          <strong>
            <CheckCircle2 /> Success! You used every edge exactly once.
          </strong>
        </article>
        <div>
          <article>
            <h3>THE RULE</h3>
            <p>Let G be a connected undirected graph with n ≥ 2 vertices.</p>
            <strong>
              Euler circuit (closed path) exists ⇔<br />
              Every vertex has even degree.
            </strong>
            <strong>
              Euler path (open path) exists ⇔<br />
              Exactly two vertices have odd degree.
            </strong>
          </article>
          <article className="eu571-warning">
            <h3>COMMON MISCONCEPTION</h3>
            <b>
              If more than two vertices have odd degree, no Euler path exists.
            </b>
            <p>
              Euler trails concern edges; vertices may be visited more than
              once.
            </p>
          </article>
        </div>
      </section>
      <section className="eu571-practice">
        <div>
          <h3>TRY IT (YOUR TURN)</h3>
          <p>Determine whether an Euler path exists in the graph at right.</p>
          <ul>
            <li>Find the odd-degree vertices.</li>
            <li>Use every edge exactly once.</li>
            <li>If impossible, answer “none”.</li>
          </ul>
        </div>
        <svg
          viewBox="0 0 260 175"
          role="img"
          aria-label="Practice graph with four odd-degree vertices"
        >
          {practiceEdges.map((e) => {
            const a = practiceVertices.find((v) => v.id === e.a)!,
              b = practiceVertices.find((v) => v.id === e.b)!;
            return (
              <line
                key={edgeKey(e.a, e.b)}
                x1={a.x}
                y1={a.y}
                x2={b.x}
                y2={b.y}
              />
            );
          })}
          {practiceVertices.map((v) => (
            <g key={v.id}>
              <circle cx={v.x} cy={v.y} r="6" />
              <text x={v.x} y={v.y - 10}>
                {v.id}
              </text>
            </g>
          ))}
        </svg>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            check();
          }}
        >
          <label>
            Your answer (vertex order)
            <input
              aria-label="Euler practice answer"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="e.g., A → E → B ... or none"
            />
          </label>
          <button type="submit">
            <CheckCircle2 /> Check Answer
          </button>
          <button type="button" onClick={() => act(() => setHint((v) => !v))}>
            <Lightbulb /> Show Hint
          </button>
          {hint && (
            <p>
              Degrees are A=3, B=3, C=3, D=3, E=4. Count the odd vertices first.
            </p>
          )}
          {graded !== null && (
            <output className={graded ? "correct" : "wrong"}>
              {graded
                ? "Correct: four odd vertices means no Euler path exists."
                : "Not yet. Count the odd-degree vertices before tracing."}
            </output>
          )}
        </form>
      </section>
      <nav className="eu571-adjacent">
        <a href="/lessons/discrete-and-applied-mathematics/570-connected-components">
          ←{" "}
          <span>
            Previous<b>Connected Components</b>
          </span>
        </a>
        <a href="/lessons/discrete-and-applied-mathematics/572-hamiltonian-paths-and-cycles">
          <span>
            Next<b>Hamiltonian Paths and Cycles</b>
          </span>{" "}
          →
        </a>
      </nav>
    </section>
  );
}
