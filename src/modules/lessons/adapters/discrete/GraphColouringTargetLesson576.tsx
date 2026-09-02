import { Check, Info, Lightbulb, RotateCcw, Shuffle } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import type { PointerEvent } from "react";
import type { LessonAdapterProps } from "../../types";
import "../geometry3d/CoordinateSystemTargetLesson378.css";
import "./GraphColouringTargetLesson576.css";

type Vertex = { id: string; x: number; y: number };
type Edge = [string, string];
type Assignment = Record<string, number>;

const palette = ["#10a8bf", "#ffa30a", "#8d43ed", "#11ad62"];
const vertices: Vertex[] = [
  { id: "A", x: 110, y: 120 },
  { id: "B", x: 300, y: 55 },
  { id: "C", x: 480, y: 120 },
  { id: "D", x: 175, y: 315 },
  { id: "E", x: 410, y: 315 },
];
const baseEdges: Edge[] = [
  ["A", "B"],
  ["A", "D"],
  ["B", "C"],
  ["B", "D"],
  ["B", "E"],
  ["C", "E"],
  ["D", "E"],
];
const alternateEdges: Edge[] = [
  ["A", "B"],
  ["A", "C"],
  ["A", "D"],
  ["B", "C"],
  ["B", "E"],
  ["C", "D"],
  ["D", "E"],
];
const orders = [
  "A → B → C → D → E",
  "B → A → C → E → D",
  "C → B → A → D → E",
  "A → D → E → B → C",
  "A → C → B → E → D",
];
const orderIds = (order: string) => order.split(" → ");
const edgeKey = ([a, b]: Edge) => [a, b].sort().join("");
const adjacent = (id: string, edges: Edge[]) =>
  edges
    .filter(([a, b]) => a === id || b === id)
    .map(([a, b]) => (a === id ? b : a));
function greedy(order: string[], edges: Edge[]) {
  const result: Assignment = {};
  for (const id of order) {
    const unavailable = new Set(
      adjacent(id, edges)
        .map((n) => result[n])
        .filter((n) => n !== undefined),
    );
    let colour = 0;
    while (unavailable.has(colour)) colour += 1;
    result[id] = colour;
  }
  return result;
}
function conflictKeys(assignment: Assignment, edges: Edge[]) {
  return edges
    .filter(
      ([a, b]) =>
        assignment[a] !== undefined && assignment[a] === assignment[b],
    )
    .map(edgeKey);
}
const usedCount = (assignment: Assignment) =>
  new Set(Object.values(assignment)).size;
// This is the target's demonstrated optimal colouring: C and D may share a
// colour because they are not adjacent, as may A and E.
const initialAssignment: Assignment = { A: 0, B: 1, C: 2, D: 2, E: 0 };
const challengeVertices: Vertex[] = [
  { id: "A", x: 125, y: 35 },
  { id: "B", x: 55, y: 150 },
  { id: "C", x: 200, y: 150 },
  { id: "D", x: 335, y: 150 },
];
const challengeEdges: Edge[] = [
  ["A", "B"],
  ["A", "C"],
  ["B", "C"],
  ["C", "D"],
];
const initialChallenge: Assignment = { A: 0, B: 1, C: 2, D: 0 };

function Graph({
  points,
  edges,
  assignment,
  conflicts,
  selected,
  onColour,
  onMove,
  compact = false,
}: {
  points: Vertex[];
  edges: Edge[];
  assignment: Assignment;
  conflicts: string[];
  selected: number;
  onColour: (id: string) => void;
  onMove?: (id: string, x: number, y: number) => void;
  compact?: boolean;
}) {
  const [dragging, setDragging] = useState<string | null>(null);
  const moved = useRef(false);
  const viewW = compact ? 390 : 590,
    viewH = compact ? 190 : 380;
  const move = (event: PointerEvent<SVGSVGElement>) => {
    if (!dragging || !onMove) return;
    const box = event.currentTarget.getBoundingClientRect();
    const x = Math.max(
      25,
      Math.min(viewW - 25, ((event.clientX - box.left) / box.width) * viewW),
    );
    const y = Math.max(
      25,
      Math.min(viewH - 25, ((event.clientY - box.top) / box.height) * viewH),
    );
    moved.current = true;
    onMove(dragging, x, y);
  };
  return (
    <svg
      viewBox={`0 0 ${viewW} ${viewH}`}
      role="img"
      aria-label={`${points.length} vertex graph with ${conflicts.length} colour conflicts`}
      onPointerMove={move}
      onPointerUp={() => setDragging(null)}
      onPointerLeave={() => setDragging(null)}
    >
      {edges.map((edge) => {
        const a = points.find((v) => v.id === edge[0])!,
          b = points.find((v) => v.id === edge[1])!,
          conflict = conflicts.includes(edgeKey(edge));
        return (
          <line
            key={edgeKey(edge)}
            className={conflict ? "conflict" : ""}
            x1={a.x}
            y1={a.y}
            x2={b.x}
            y2={b.y}
          />
        );
      })}
      {points.map((v) => (
        <g
          key={v.id}
          role="button"
          tabIndex={0}
          data-testid={`${compact ? "challenge" : "colour"}-vertex-${v.id}`}
          aria-label={`Colour vertex ${v.id} with colour ${selected + 1}`}
          onPointerDown={(e) => {
            if (onMove) {
              moved.current = false;
              setDragging(v.id);
              e.currentTarget.setPointerCapture(e.pointerId);
            }
          }}
          onClick={() => {
            if (moved.current) {
              moved.current = false;
              return;
            }
            onColour(v.id);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              onColour(v.id);
            }
          }}
        >
          <circle
            cx={v.x}
            cy={v.y}
            r={compact ? 18 : 27}
            fill={
              assignment[v.id] === undefined
                ? "#41506b"
                : palette[assignment[v.id]]
            }
          />
          <text x={v.x} y={v.y + (compact ? 5 : 6)}>
            {v.id}
          </text>
        </g>
      ))}
    </svg>
  );
}

function Palette({
  selected,
  onSelect,
}: {
  selected: number;
  onSelect: (n: number) => void;
}) {
  return (
    <div className="gc576-palette" aria-label="Four colour palette">
      {palette.map((colour, index) => (
        <button
          key={colour}
          type="button"
          aria-label={`Select colour ${index + 1}`}
          aria-pressed={selected === index}
          style={{ background: colour }}
          onClick={() => onSelect(index)}
        >
          {selected === index && <Check />}
        </button>
      ))}
    </div>
  );
}

export default function GraphColouringTargetLesson576({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [points, setPoints] = useState(vertices),
    [edgeVariant, setEdgeVariant] = useState<"base" | "alternate">("base"),
    [assignment, setAssignment] = useState<Assignment>(initialAssignment),
    [selected, setSelected] = useState(0),
    [order, setOrder] = useState(orders[0]),
    [tab, setTab] = useState("Interact"),
    [challenge, setChallenge] = useState<Assignment>(initialChallenge),
    [challengeSelected, setChallengeSelected] = useState(0),
    [graded, setGraded] = useState<boolean | null>(null),
    [actions, setActions] = useState(0);
  const edges = edgeVariant === "base" ? baseEdges : alternateEdges;
  const conflicts = useMemo(
    () => conflictKeys(assignment, edges),
    [assignment, edges],
  );
  const challengeConflicts = useMemo(
    () => conflictKeys(challenge, challengeEdges),
    [challenge],
  );
  const complete = Object.keys(assignment).length === points.length,
    valid = complete && conflicts.length === 0;
  const challengeComplete =
    Object.keys(challenge).length === challengeVertices.length;
  const challengeValid =
    challengeComplete &&
    challengeConflicts.length === 0 &&
    usedCount(challenge) === 3;
  const act = (fn: () => void) => {
    fn();
    setActions((n) => n + 1);
    onInteraction();
  };
  const reset = () => {
    setPoints(vertices);
    setEdgeVariant("base");
    setAssignment(initialAssignment);
    setSelected(0);
    setOrder(orders[0]);
    setTab("Interact");
    setChallenge(initialChallenge);
    setChallengeSelected(0);
    setGraded(null);
    setActions(0);
  };
  useEffect(reset, [resetToken]);
  const applyGreedy = (value: string, nextEdges = edges) => {
    setOrder(value);
    setAssignment(greedy(orderIds(value), nextEdges));
  };
  const colour = (id: string) =>
    act(() => setAssignment((a) => ({ ...a, [id]: selected })));
  const colourChallenge = (id: string) =>
    act(() => {
      setChallenge((a) => ({ ...a, [id]: challengeSelected }));
      setGraded(null);
    });
  return (
    <section
      className="gc576-page cs378-page"
      data-testid="discrete-mockup-0633"
      data-object-model="dedicated-greedy-vertex-colouring-conflict-chromatic-model"
      data-conflict-count={conflicts.length}
      data-colour-count={usedCount(assignment)}
      data-valid={valid}
      data-order={orderIds(order).join(",")}
      data-edge-count={edges.length}
      data-edge-variant={edgeVariant}
      data-positions={points
        .map((v) => `${v.id}:${Math.round(v.x)},${Math.round(v.y)}`)
        .join(";")}
      data-chromatic-number="3"
      data-challenge-valid={challengeValid}
      data-actions={actions}
    >
      <header className="gc576-hero">
        <p>
          <b>DISCRETE AND APPLIED MATHEMATICS</b>
          <b>COMBINATORICS, GRAPH THEORY AND LOGIC</b>
        </p>
        <h1>Graph Colouring</h1>
        <h2>
          <b>Objective:</b> Colour the vertices of a graph so that no two
          adjacent vertices share the same colour.
        </h2>
        <dl>
          <span>
            ♧ <b>Level:</b> Intermediate – Advanced
          </span>
          <span>
            ϟ <b>Topic:</b> Discrete Math
          </span>
          <span>
            ♧ <b>Subtopic:</b> Graph Theory
          </span>
          <span>
            ◷ <b>Time:</b> 6–10 min
          </span>
        </dl>
      </header>
      <nav className="gc576-tabs">
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
        <aside className="gc576-tab-note">
          <b>{tab}:</b>{" "}
          {tab === "Formula"
            ? "χ(G) is the minimum number of colours in any proper colouring."
            : "Adjacent vertices must receive different colours."}
        </aside>
      )}
      <section className="gc576-lab">
        <header>
          <h3>1. OBSERVE &amp; MANIPULATE</h3>
          <p>
            Colour the graph. Adjacent vertices cannot share the same colour.
          </p>
          <button
            onClick={() =>
              act(() => {
                const next =
                  orders[(orders.indexOf(order) + 1) % orders.length];
                applyGreedy(next);
              })
            }
          >
            Compare orders
          </button>
          <Info />
        </header>
        <div className="gc576-work">
          <div className="gc576-canvas">
            <Graph
              points={points}
              edges={edges}
              assignment={assignment}
              conflicts={conflicts}
              selected={selected}
              onColour={colour}
              onMove={(id, x, y) => {
                setPoints((vs) =>
                  vs.map((v) => (v.id === id ? { ...v, x, y } : v)),
                );
                onInteraction();
              }}
            />
          </div>
          <aside>
            <h4>PALETTE (4 colours)</h4>
            <Palette
              selected={selected}
              onSelect={(n) => act(() => setSelected(n))}
            />
            <label>
              Greedy order
              <select
                aria-label="Greedy colouring order"
                value={order}
                onChange={(e) => act(() => applyGreedy(e.target.value))}
              >
                {orders.map((o) => (
                  <option key={o}>{o}</option>
                ))}
              </select>
            </label>
            <div className="gc576-actions">
              <button onClick={() => act(() => setAssignment({}))}>
                Reset colours
              </button>
              <button
                onClick={() =>
                  act(() => {
                    const next = edgeVariant === "base" ? "alternate" : "base";
                    const nextEdges =
                      next === "base" ? baseEdges : alternateEdges;
                    setEdgeVariant(next);
                    setPoints(vertices);
                    applyGreedy(order, nextEdges);
                  })
                }
              >
                <Shuffle /> New graph
              </button>
            </div>
            <article className={conflicts.length ? "bad" : "good"}>
              <b>
                {conflicts.length
                  ? `${conflicts.length} Conflict${conflicts.length === 1 ? "" : "s"}`
                  : "No Conflicts"}
              </b>
              <p>
                {conflicts.length
                  ? "Adjacent vertices share a colour."
                  : "Great! All adjacent vertices are different."}
              </p>
            </article>
            <article className="number">
              <b>Chromatic number χ(G)</b>
              <strong>3</strong>
            </article>
          </aside>
        </div>
        <p className="gc576-tip">
          <Lightbulb /> Click a vertex to colour it. Drag vertices to rearrange
          the graph. If two adjacent vertices share a colour, their edge flashes
          red.
        </p>
        <dl className="gc576-metrics">
          <span>
            Vertices |V|<b>{points.length}</b>
          </span>
          <span>
            Edges |E|<b>{edges.length}</b>
          </span>
          <span>
            Conflicts<b>{conflicts.length}</b>
          </span>
          <span>
            Colours used<b>{usedCount(assignment)}</b>
          </span>
        </dl>
      </section>
      <section className="gc576-learning">
        <article>
          <h3>2. NOTICE THE PATTERN</h3>
          <p>Try different orders and strategies.</p>
          <table>
            <thead>
              <tr>
                <th>Greedy Order</th>
                <th>Colours Used</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o, i) => (
                <tr
                  key={o}
                  className={order === o ? "selected" : ""}
                  onClick={() => act(() => applyGreedy(o))}
                >
                  <td>{o}</td>
                  <td className={i === 3 ? "warn" : ""}>
                    {[3, 3, 3, 3, 4][i]}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p>Greedy colouring can use more colours in unlucky orders.</p>
          <aside>
            <b>⚠ Common misconception</b>
            <p>
              Using a greedy order always gives the minimum number of colours.
            </p>
          </aside>
        </article>
        <article>
          <h3>3. UNDERSTAND THE RULE</h3>
          <p>Key definition and rule.</p>
          <section>
            <b>Definition (Proper Vertex Colouring)</b>
            <p>
              A colouring of a graph G = (V, E) is proper if u and v have
              different colours for every edge uv ∈ E.
            </p>
            <b>Key rule</b>
            <p>
              The <i>chromatic number χ(G)</i> is the minimum number of colours
              needed for a proper vertex colouring of G.
            </p>
          </section>
          <section>
            <b>Quick facts</b>
            <p>• χ(G) ≥ 1 for any graph G.</p>
            <p>• If G has a triangle, then χ(G) ≥ 3.</p>
            <p>• χ(Kₙ) = n (complete graph on n vertices).</p>
          </section>
        </article>
        <article>
          <h3>
            4. WORKED EXAMPLE <small>(This Graph)</small>
          </h3>
          <p>One optimal colouring using 3 colours.</p>
          <div className="gc576-mini">
            <Graph
              points={vertices.map((v) => ({
                ...v,
                x: v.x * 0.52 + 8,
                y: v.y * 0.4 + 4,
              }))}
              edges={baseEdges}
              assignment={initialAssignment}
              conflicts={[]}
              selected={0}
              onColour={() => {}}
              compact
            />
          </div>
          <p>
            <b>Colours:</b> {`{1, 2, 3}`}
          </p>
          <p>
            <b>Assignment:</b> <i>A</i>=1, <i>B</i>=2, <i>C</i>=3, <i>D</i>=3,{" "}
            <i>E</i>=1
          </p>
          <p>All adjacent vertices have different colours.</p>
          <p>Therefore, χ(G) = 3.</p>
        </article>
      </section>
      <section className="gc576-practice">
        <header>
          <h3>5. TRY INDEPENDENTLY</h3>
          <p>
            <b>Challenge:</b> Triangle with a tail
          </p>
          <p>Colour the graph below. What is its chromatic number?</p>
        </header>
        <div className="gc576-challenge">
          <Graph
            points={challengeVertices}
            edges={challengeEdges}
            assignment={challenge}
            conflicts={challengeConflicts}
            selected={challengeSelected}
            onColour={colourChallenge}
            compact
          />
        </div>
        <div className="gc576-challenge-controls">
          <h4>PALETTE (4 colours)</h4>
          <Palette
            selected={challengeSelected}
            onSelect={(n) => act(() => setChallengeSelected(n))}
          />
          <div className="gc576-challenge-actions">
            <button
              onClick={() =>
                act(() => {
                  setChallenge(initialChallenge);
                  setGraded(null);
                })
              }
            >
              <RotateCcw /> Reset
            </button>
            <button onClick={() => act(() => setGraded(challengeValid))}>
              Check my answer
            </button>
          </div>
        </div>
        <aside>
          <h4>Your result</h4>
          <b className={challengeConflicts.length ? "bad-text" : "good-text"}>
            {challengeConflicts.length
              ? `${challengeConflicts.length} Conflicts`
              : challengeComplete
                ? "No Conflicts"
                : "Colour all vertices"}
          </b>
          <p>
            Chromatic number
            <strong>
              {challengeComplete && !challengeConflicts.length
                ? usedCount(challenge)
                : "?"}
            </strong>
          </p>
          {graded !== null && (
            <output>
              {graded
                ? "Correct: a triangle needs 3 colours."
                : "Not yet: use exactly 3 colours with no conflicts."}
            </output>
          )}
          <section>
            <Lightbulb />
            <b>Hint</b>
            <p>A triangle needs 3 colours. What about the extra vertex?</p>
          </section>
        </aside>
      </section>
      <nav className="gc576-adjacent">
        <a href="/lessons/discrete-and-applied-mathematics/575-shortest-path">
          ←{" "}
          <span>
            Previous Lesson<b>Shortest Path</b>
          </span>
        </a>
        <a href="/lessons/discrete-and-applied-mathematics/577-bipartite-graphs">
          <span>
            Next Lesson<b>Bipartite Graphs</b>
          </span>{" "}
          →
        </a>
      </nav>
    </section>
  );
}
