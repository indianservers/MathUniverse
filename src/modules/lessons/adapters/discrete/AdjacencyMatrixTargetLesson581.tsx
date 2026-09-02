import { AlertTriangle, Check, Lightbulb, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import type { PointerEvent } from "react";
import type { LessonAdapterProps } from "../../types";
import "../geometry3d/CoordinateSystemTargetLesson378.css";
import "./AdjacencyMatrixTargetLesson581.css";

type Point = { id: string; x: number; y: number };
const ids = ["A", "B", "C", "D", "E"];
const initialPoints: Point[] = [
  { id: "A", x: 80, y: 130 },
  { id: "B", x: 245, y: 55 },
  { id: "C", x: 440, y: 130 },
  { id: "D", x: 145, y: 315 },
  { id: "E", x: 380, y: 315 },
];
const initial = ["AB", "AD", "BC", "BD", "BE", "CE", "DE"];
const edgeKey = (a: string, b: string) => `${a}${b}`;
const undirectedKey = (a: string, b: string) => [a, b].sort().join("");
function hasEdge(edges: string[], a: string, b: string, symmetric: boolean) {
  return symmetric
    ? edges.includes(undirectedKey(a, b))
    : edges.includes(edgeKey(a, b));
}
function degrees(edges: string[], symmetric: boolean) {
  return Object.fromEntries(
    ids.map((id) => [
      id,
      ids.reduce(
        (sum, other) => sum + Number(hasEdge(edges, id, other, symmetric)),
        0,
      ),
    ]),
  ) as Record<string, number>;
}
function Matrix({
  edges,
  symmetric,
  selected,
  onCell,
  compact = false,
}: {
  edges: string[];
  symmetric: boolean;
  selected: string | null;
  onCell?: (a: string, b: string) => void;
  compact?: boolean;
}) {
  const deg = degrees(edges, symmetric);
  return (
    <table className={compact ? "am581-matrix compact" : "am581-matrix"}>
      <thead>
        <tr>
          <th />
          {ids.map((id) => (
            <th key={id}>{id}</th>
          ))}
          <th>Degree</th>
        </tr>
      </thead>
      <tbody>
        {ids.map((a) => (
          <tr key={a} className={selected === a ? "selected" : ""}>
            <th>{a}</th>
            {ids.map((b) => (
              <td key={b} className={a === b ? "diagonal" : ""}>
                <button
                  aria-label={`Matrix ${a} ${b}`}
                  disabled={a === b}
                  onClick={() => onCell?.(a, b)}
                >
                  {hasEdge(edges, a, b, symmetric) ? 1 : 0}
                </button>
              </td>
            ))}
            <td className="degree">{deg[a]}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default function AdjacencyMatrixTargetLesson581({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [edges, setEdges] = useState(initial),
    [points, setPoints] = useState(initialPoints),
    [symmetric, setSymmetric] = useState(true),
    [selected, setSelected] = useState<string | null>(null),
    [dragging, setDragging] = useState<string | null>(null),
    [tab, setTab] = useState("Interact"),
    [challenge, setChallenge] = useState(initial),
    [graded, setGraded] = useState<boolean | null>(null),
    [revealed, setRevealed] = useState(false),
    [actions, setActions] = useState(0);
  const deg = degrees(edges, symmetric),
    edgeCount = symmetric ? edges.length : edges.length,
    sum = Object.values(deg).reduce((a, b) => a + b, 0),
    matrix = ids
      .map((a) =>
        ids.map((b) => Number(hasEdge(edges, a, b, symmetric))).join(""),
      )
      .join(";");
  const act = (fn: () => void) => {
      fn();
      setActions((n) => n + 1);
      onInteraction();
    },
    reset = () => {
      setEdges(initial);
      setPoints(initialPoints);
      setSymmetric(true);
      setSelected(null);
      setDragging(null);
      setTab("Interact");
      setChallenge(initial);
      setGraded(null);
      setRevealed(false);
      setActions(0);
    };
  useEffect(reset, [resetToken]);
  const toggle = (a: string, b: string, practice = false) =>
      act(() => {
        const key = symmetric ? undirectedKey(a, b) : edgeKey(a, b),
          setter = practice ? setChallenge : setEdges;
        setter((current) =>
          current.includes(key)
            ? current.filter((edge) => edge !== key)
            : [...current, key],
        );
        if (!practice) setSelected(a);
        if (practice) setGraded(null);
      }),
    move = (event: PointerEvent<SVGSVGElement>) => {
      if (!dragging) return;
      const box = event.currentTarget.getBoundingClientRect(),
        x = ((event.clientX - box.left) / box.width) * 520,
        y = ((event.clientY - box.top) / box.height) * 370;
      setPoints((current) =>
        current.map((point) =>
          point.id === dragging
            ? {
                ...point,
                x: Math.max(25, Math.min(495, x)),
                y: Math.max(25, Math.min(345, y)),
              }
            : point,
        ),
      );
      onInteraction();
    };
  return (
    <section
      className="am581-page cs378-page"
      data-testid="discrete-mockup-0638"
      data-object-model="dedicated-synchronized-graph-adjacency-matrix-model"
      data-edges={edges.slice().sort().join(",")}
      data-edge-count={edgeCount}
      data-degrees={ids.map((id) => deg[id]).join(",")}
      data-degree-sum={sum}
      data-symmetric={symmetric}
      data-matrix={matrix}
      data-selected={selected ?? ""}
      data-positions={points
        .map((p) => `${p.id}:${Math.round(p.x)},${Math.round(p.y)}`)
        .join(";")}
      data-challenge-edges={challenge.slice().sort().join(",")}
      data-graded={graded === null ? "" : graded}
      data-revealed={revealed}
      data-actions={actions}
    >
      <header className="am581-hero">
        <span>DISCRETE AND APPLIED MATHEMATICS</span>
        <h1>581 Adjacency Matrix</h1>
        <p>Convert between graphs and adjacency matrices.</p>
        <dl>
          <b>Level: Intermediate-Advanced</b>
          <b>Module: Discrete Math Lab</b>
          <b>Time: 6-10 min</b>
          <b>Tools: Graph + Matrix Editor</b>
        </dl>
        <strong>
          Objective:{" "}
          <i>
            Represent a graph with an adjacency matrix and understand how matrix
            entries correspond to edges and degrees.
          </i>
        </strong>
      </header>
      <nav className="am581-tabs">
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
        <p className="am581-note">
          <b>{tab}:</b> Entry Aij is 1 exactly when vertex i is adjacent to
          vertex j.
        </p>
      )}
      <section className="am581-lab">
        <header>
          <h3>
            <i>1</i> Observe &amp; Manipulate
          </h3>
          <p>Edit the graph or the matrix. They stay in sync.</p>
        </header>
        <div>
          <article>
            <header>
              <b>Graph controls</b>
              <label>
                <input
                  aria-label="Undirected symmetric"
                  type="checkbox"
                  checked={symmetric}
                  onChange={() =>
                    act(() => {
                      setSymmetric((value) => !value);
                      setEdges(initial);
                    })
                  }
                />{" "}
                Undirected (symmetric)
              </label>
              <button onClick={() => act(() => setEdges([]))}>
                <Trash2 /> Clear
              </button>
            </header>
            <svg
              viewBox="0 0 520 370"
              role="img"
              aria-label={`${edgeCount}-edge graph`}
              onPointerMove={move}
              onPointerUp={() => setDragging(null)}
              onPointerLeave={() => setDragging(null)}
            >
              {edges.map((edge) => {
                const a = points.find((p) => p.id === edge[0])!,
                  b = points.find((p) => p.id === edge[1])!;
                return (
                  <g key={edge} onClick={() => toggle(edge[0], edge[1])}>
                    <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} />
                    <text x={(a.x + b.x) / 2} y={(a.y + b.y) / 2 - 7}>
                      1
                    </text>
                  </g>
                );
              })}
              {points.map((point) => (
                <g
                  key={point.id}
                  data-testid={`matrix-vertex-${point.id}`}
                  className={selected === point.id ? "selected" : ""}
                  onClick={() => act(() => setSelected(point.id))}
                  onPointerDown={(event) => {
                    setDragging(point.id);
                    event.currentTarget.setPointerCapture(event.pointerId);
                  }}
                >
                  <circle cx={point.x} cy={point.y} r="23" />
                  <text x={point.x} y={point.y + 5}>
                    {point.id}
                  </text>
                </g>
              ))}
            </svg>
            <p>
              Drag nodes to rearrange. Click a node to highlight its row/column.
            </p>
          </article>
          <article className="am581-editor">
            <header>
              <b>Matrix editor</b>
              <span>1 = edge present &nbsp;&nbsp; 0 = no edge</span>
            </header>
            <Matrix
              edges={edges}
              symmetric={symmetric}
              selected={selected}
              onCell={toggle}
            />
            <footer>
              Diagonal is 0 (no self-loops) <b>Total edges = {edgeCount}</b>
            </footer>
          </article>
        </div>
      </section>
      <section className="am581-stats">
        <span>
          <Check />
          <b>Symmetric:</b> Aij = Aji
        </span>
        <span>
          <b>Vertices (n): {ids.length}</b>
        </span>
        <span>
          <b>Sum of degrees: {sum}</b> (= 2 x edges)
        </span>
      </section>
      <section className="am581-theory">
        <article>
          <h3>
            <i>2</i> Notice the Pattern
          </h3>
          <p>Each row sum equals the degree.</p>
          <dl>
            {ids.map((id) => (
              <span key={id}>
                deg({id}) = <b>{deg[id]}</b> (= row {id} sum)
              </span>
            ))}
          </dl>
          <strong>
            Handshaking Lemma check:
            <br />
            {ids.map((id) => deg[id]).join(" + ")} = {sum} = 2 x {edgeCount}
          </strong>
        </article>
        <article>
          <h3>
            <i>3</i> Understand the Rule
          </h3>
          <b>Adjacency Matrix (Undirected Graph)</b>
          <p>Aij = 1 if vi is adjacent to vj; otherwise 0.</p>
          <ul>
            <li>A is an n x n zero-one matrix.</li>
            <li>A is symmetric: Aij = Aji.</li>
            <li>Diagonal entries are 0.</li>
            <li>Row sum = degree of the vertex.</li>
          </ul>
        </article>
        <article className="am581-warning">
          <h3>Common Misconception</h3>
          <strong>
            <AlertTriangle /> Mistake: Putting 1s on the diagonal for
            self-connections.
          </strong>
          <p>In a simple graph there are no self-loops, so Aii = 0.</p>
          <aside>
            <Lightbulb /> Toggle symmetric mode to keep both matrix entries
            synchronized.
          </aside>
        </article>
      </section>
      <section className="am581-bottom">
        <article>
          <h3>
            <i>4</i> Worked Example (Correct)
          </h3>
          <p>Example graph and its adjacency matrix:</p>
          <Matrix edges={initial} symmetric selected={null} compact />
          <aside>
            <b>Verification:</b>
            <p>Symmetric: yes</p>
            <p>Row sums: [2, 4, 2, 3, 3]</p>
            <p>Sum = 14 = 2 x 7 edges</p>
          </aside>
        </article>
        <article>
          <h3>
            <i>5</i> Try Independently
          </h3>
          <p>
            <b>Challenge:</b> Add one new edge so A and C each have degree 3.
          </p>
          <p>Make exactly one new 1 and keep the matrix symmetric.</p>
          <Matrix
            edges={challenge}
            symmetric
            selected={null}
            onCell={(a, b) => toggle(a, b, true)}
            compact
          />
          <div>
            <button
              onClick={() =>
                act(() => {
                  const d = degrees(challenge, true);
                  setGraded(
                    challenge.length === initial.length + 1 &&
                      d.A === 3 &&
                      d.C === 3,
                  );
                })
              }
            >
              Check My Answer
            </button>
            <button
              onClick={() =>
                act(() => {
                  setChallenge([...initial, "AC"]);
                  setRevealed(true);
                  setGraded(true);
                })
              }
            >
              Reveal Answer
            </button>
          </div>
          <output>
            {graded === true
              ? "Correct: add edge A-C."
              : graded === false
                ? "Not yet. Add exactly A-C."
                : ""}
          </output>
          <small>
            The original mockup's all-degree-3 request is impossible because B
            already has degree 4.
          </small>
        </article>
      </section>
      <nav className="am581-adjacent">
        <a href="/lessons/discrete-and-applied-mathematics/580-travelling-salesperson">
          &lt;-{" "}
          <span>
            Previous lesson<b>Travelling Salesperson</b>
          </span>
        </a>
        <a href="/lessons/discrete-and-applied-mathematics/582-set-builder">
          <span>
            Next lesson<b>Set Builder</b>
          </span>{" "}
          -&gt;
        </a>
      </nav>
    </section>
  );
}
