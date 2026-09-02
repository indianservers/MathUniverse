import { CheckCircle2, Lightbulb, RotateCcw } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { PointerEvent } from "react";
import type { LessonAdapterProps } from "../../types";
import "../geometry3d/CoordinateSystemTargetLesson378.css";
import "./VertexDegreeTargetLesson568.css";

type Vertex = { id: string; x: number; y: number; color: string };
type Edge = { a: string; b: string; count: number };
const initialVertices: Vertex[] = [
  { id: "A", x: 75, y: 110, color: "#ee9415" },
  { id: "B", x: 285, y: 75, color: "#1598b0" },
  { id: "C", x: 500, y: 110, color: "#1598b0" },
  { id: "D", x: 145, y: 340, color: "#1598b0" },
  { id: "E", x: 420, y: 340, color: "#1598b0" },
];
const initialEdges: Edge[] = [
  { a: "A", b: "B", count: 2 },
  { a: "B", b: "C", count: 3 },
  { a: "B", b: "D", count: 4 },
  { a: "B", b: "E", count: 2 },
  { a: "A", b: "D", count: 1 },
  { a: "C", b: "E", count: 1 },
  { a: "D", b: "E", count: 5 },
  { a: "B", b: "B", count: 1 },
];
const key = (a: string, b: string) => [a, b].sort().join("");
const tabCopy: Record<string, string> = {
  Learn:
    "An incident edge contributes one at each endpoint; a loop contributes two at its vertex.",
  "Worked Example":
    "Count each ordinary endpoint once and each loop endpoint twice.",
  Formula: "Handshake Lemma: Σdeg(v)=2|E|, including loops and parallel edges.",
  Practice: "Compute W, X, Y, and Z, then verify the total degree sum.",
};
export default function VertexDegreeTargetLesson568({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [vertices, setVertices] = useState(initialVertices),
    [edges, setEdges] = useState(initialEdges),
    [selected, setSelected] = useState("B"),
    [showLoops, setShowLoops] = useState(true),
    [loopVertex, setLoopVertex] = useState("B"),
    [pair, setPair] = useState("AC"),
    [dragging, setDragging] = useState<string | null>(null),
    [tab, setTab] = useState("Interact"),
    [answers, setAnswers] = useState(["", "", "", ""]),
    [graded, setGraded] = useState<boolean | null>(null),
    [hint, setHint] = useState(false),
    [actions, setActions] = useState(0);
  const degree = useMemo(
      () =>
        Object.fromEntries(
          vertices.map((v) => [
            v.id,
            edges.reduce(
              (sum, e) =>
                sum +
                (e.a === v.id && e.b === v.id
                  ? e.count * 2
                  : e.a === v.id || e.b === v.id
                    ? e.count
                    : 0),
              0,
            ),
          ]),
        ),
      [vertices, edges],
    ),
    edgeCount = edges.reduce((sum, e) => sum + e.count, 0),
    degreeSum = Object.values(degree).reduce((a, b) => a + b, 0),
    loops = edges.filter((e) => e.a === e.b).reduce((s, e) => s + e.count, 0),
    verified = degreeSum === 2 * edgeCount;
  const act = (fn: () => void) => {
    fn();
    setActions((n) => n + 1);
    onInteraction();
  };
  const reset = () => {
    setVertices(initialVertices);
    setEdges(initialEdges);
    setSelected("B");
    setShowLoops(true);
    setLoopVertex("B");
    setPair("AC");
    setDragging(null);
    setTab("Interact");
    setAnswers(["", "", "", ""]);
    setGraded(null);
    setHint(false);
    setActions(0);
  };
  useEffect(reset, [resetToken]);
  const addLoop = () =>
    act(() =>
      setEdges((es) => {
        const found = es.find((e) => e.a === loopVertex && e.b === loopVertex);
        return found
          ? es.map((e) => (e === found ? { ...e, count: e.count + 1 } : e))
          : [...es, { a: loopVertex, b: loopVertex, count: 1 }];
      }),
    );
  const alterPair = (delta: number) =>
    act(() =>
      setEdges((es) => {
        const a = pair[0],
          b = pair[1],
          found = es.find((e) => key(e.a, e.b) === key(a, b));
        if (delta > 0)
          return found
            ? es.map((e) => (e === found ? { ...e, count: e.count + 1 } : e))
            : [...es, { a, b, count: 1 }];
        if (!found) return es;
        return found.count === 1
          ? es.filter((e) => e !== found)
          : es.map((e) => (e === found ? { ...e, count: e.count - 1 } : e));
      }),
    );
  const move = (event: PointerEvent<SVGSVGElement>) => {
    if (!dragging) return;
    const box = event.currentTarget.getBoundingClientRect(),
      x = Math.max(
        30,
        Math.min(530, ((event.clientX - box.left) / box.width) * 570),
      ),
      y = Math.max(
        30,
        Math.min(390, ((event.clientY - box.top) / box.height) * 420),
      );
    setVertices((vs) =>
      vs.map((v) => (v.id === dragging ? { ...v, x, y } : v)),
    );
    onInteraction();
  };
  const challenge = [2, 5, 2, 3],
    check = () =>
      act(() => setGraded(answers.every((a, i) => Number(a) === challenge[i])));
  return (
    <section
      className="vd568-page cs378-page"
      data-testid="discrete-mockup-0625"
      data-object-model="dedicated-multigraph-degree-loop-handshake-model"
      data-selected={selected}
      data-selected-degree={degree[selected]}
      data-edge-count={edgeCount}
      data-degree-sum={degreeSum}
      data-loops={loops}
      data-verified={verified}
      data-show-loops={showLoops}
      data-positions={vertices
        .map((v) => `${v.id}:${Math.round(v.x)},${Math.round(v.y)}`)
        .join(";")}
      data-graded={graded === null ? "" : graded}
      data-actions={actions}
    >
      <header className="vd568-hero">
        <small>DISCRETE AND APPLIED MATHEMATICS</small>
        <h1>Degree of a Vertex</h1>
        <p>
          Measure connectivity by counting incident edges. Loops count twice.
        </p>
        <dl>
          <span>
            Level<b>Intermediate–Advanced</b>
          </span>
          <span>
            Subject<b>Discrete Math</b>
          </span>
          <span>
            Duration<b>6–10 min</b>
          </span>
          <span>
            Skills<b>Graph theory, Counting</b>
          </span>
          <span>
            Tags<b>degree, incident edges, loops</b>
          </span>
        </dl>
      </header>
      <nav className="vd568-tabs">
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
        <div className="vd568-tab-note" role="status">
          <b>{tab}</b>
          {tabCopy[tab]}
        </div>
      )}
      <section className="vd568-lab">
        <header>
          <b>1. OBSERVE & MANIPULATE</b>
          <p>
            Click or tap any vertex to see its degree. Toggle loops and edges to
            explore.
          </p>
        </header>
        <main>
          <div>
            <DegreeGraph
              vertices={vertices}
              edges={edges}
              selected={selected}
              showLoops={showLoops}
              dragging={dragging}
              setDragging={setDragging}
              onSelect={(id) => act(() => setSelected(id))}
              move={move}
            />
            <p>
              <b>Tip:</b> A loop contributes 2 to the degree of its incident
              vertex.
            </p>
          </div>
          <aside>
            <h3>
              Selected vertex{" "}
              <b
                style={{
                  background: vertices.find((v) => v.id === selected)?.color,
                }}
              >
                {selected}
              </b>
            </h3>
            <h4>
              Incident edges <small>(count loops twice)</small>
            </h4>
            {edges
              .filter((e) => e.a === selected || e.b === selected)
              .map((e) => (
                <p key={`${e.a}${e.b}`}>
                  <i />
                  {e.a === e.b ? `Loop at ${selected}` : `${e.a} — ${e.b}`}
                  <b>{e.a === e.b ? e.count * 2 : e.count}</b>
                </p>
              ))}
            <output>
              Degree of {selected}
              <strong>{degree[selected]}</strong>
            </output>
          </aside>
          <section>
            <h3>Graph controls</h3>
            <label>
              Show loops{" "}
              <input
                type="checkbox"
                checked={showLoops}
                onChange={(e) => act(() => setShowLoops(e.target.checked))}
              />
            </label>
            <b>Add loop at:</b>
            <div className="vd568-vertices">
              {vertices.map((v) => (
                <button
                  className={loopVertex === v.id ? "active" : ""}
                  key={v.id}
                  onClick={() => act(() => setLoopVertex(v.id))}
                >
                  {v.id}
                </button>
              ))}
            </div>
            <button onClick={addLoop}>Add loop</button>
            <b>Add / remove edge</b>
            <select
              aria-label="Select edge pair"
              value={pair}
              onChange={(e) => act(() => setPair(e.target.value))}
            >
              {vertices.flatMap((v, i) =>
                vertices.slice(i + 1).map((w) => (
                  <option key={`${v.id}${w.id}`} value={`${v.id}${w.id}`}>
                    {v.id} — {w.id}
                  </option>
                )),
              )}
            </select>
            <div>
              <button onClick={() => alterPair(1)}>Add</button>
              <button onClick={() => alterPair(-1)}>Remove</button>
            </div>
            <button onClick={reset}>
              <RotateCcw />
              Reset graph
            </button>
          </section>
        </main>
      </section>
      <section className="vd568-summary">
        <article>
          <h3>Check the Handshaking Lemma</h3>
          <p>The sum of all vertex degrees equals twice the number of edges.</p>
          <output>
            Σ degrees = <b>{degreeSum}</b> &nbsp; 2 × |E| ={" "}
            <b>{2 * edgeCount}</b>
          </output>
          {verified && (
            <strong>
              <CheckCircle2 /> Verified!
            </strong>
          )}
        </article>
        <article>
          <h3>Degrees of all vertices</h3>
          <div>
            {vertices.map((v) => (
              <p className={v.id === selected ? "active" : ""} key={v.id}>
                deg({v.id}) = <b>{degree[v.id]}</b>
              </p>
            ))}
          </div>
        </article>
        <article>
          <h3>Graph summary</h3>
          <p>
            Vertices (|V|) = <b>{vertices.length}</b>
          </p>
          <p>
            Edges (|E|) = <b>{edgeCount}</b>
          </p>
          <p>
            Loops = <b>{loops}</b>
          </p>
        </article>
      </section>
      <section className="vd568-pattern">
        <article>
          <h3>2. NOTICE THE PATTERN</h3>
          <p>
            As you select different vertices, what do you notice about how
            degrees are computed?
          </p>
          <output>
            Each incident edge contributes 1 to the degree. Each loop
            contributes 2.
          </output>
        </article>
        <article>
          <h3>3. UNDERSTAND THE RULE</h3>
          <p>This leads to a fundamental rule about any undirected graph.</p>
          <output>
            <b>Handshaking Lemma:</b> Σ deg(v) = 2|E|
          </output>
        </article>
      </section>
      <section className="vd568-worked">
        <article>
          <h3>4. WORKED EXAMPLE</h3>
          <p>Compute degrees and verify the handshaking lemma.</p>
          <div className="vd568-example-body">
            <ExampleGraph />
            <table>
              <thead>
                <tr>
                  <th>Vertex</th>
                  <th>Incident edges</th>
                  <th>Degree</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>P</td>
                  <td>P-Q, P-S</td>
                  <td>2</td>
                </tr>
                <tr>
                  <td>Q</td>
                  <td>Q-P, Q-R, Q-S, loop at Q</td>
                  <td>
                    5<br />
                    <small>(loop counts 2)</small>
                  </td>
                </tr>
                <tr>
                  <td>R</td>
                  <td>R-Q, R-S</td>
                  <td>2</td>
                </tr>
                <tr>
                  <td>S</td>
                  <td>S-P, S-Q, S-R</td>
                  <td>3</td>
                </tr>
              </tbody>
            </table>
          </div>
          <output>
            Σ degrees = 2 + 5 + 2 + 3 = 12
            <br />
            Edges = 6 ⇒ 2|E| = 12 &nbsp; ✓ Verified
          </output>
        </article>
        <article>
          <h3>5. KEY RULE / DEFINITION</h3>
          <p>
            <b>Degree of a vertex:</b> The number of edges incident to the
            vertex, where a loop contributes 2.
          </p>
          <output>deg(v) = # incident edges + 2 × # loops at v</output>
          <hr />
          <p>
            <b>Handshaking Lemma:</b>
          </p>
          <output>Σ deg(v) = 2|E|</output>
          <aside>
            <b>Common Misconception</b>
            <p>A loop counts once.</p>
            <strong>Correct: A loop counts twice.</strong>
          </aside>
        </article>
      </section>
      <section className="vd568-challenge">
        <h3>6. TRY INDEPENDENTLY (CHALLENGE)</h3>
        <ChallengeGraph />
        <main>
          <b>
            Compute the degree of each vertex and verify the handshaking lemma.
          </b>
          <div>
            {["W", "X", "Y", "Z"].map((v, i) => (
              <label key={v}>
                deg({v}) ={" "}
                <input
                  aria-label={`Degree ${v}`}
                  value={answers[i]}
                  onChange={(e) => {
                    const next = [...answers];
                    next[i] = e.target.value;
                    act(() => {
                      setAnswers(next);
                      setGraded(null);
                    });
                  }}
                />
              </label>
            ))}
          </div>
          <button onClick={check}>Check Answers</button>
          <button onClick={() => act(() => setHint((v) => !v))}>
            <Lightbulb />
            Hint
          </button>
          {graded !== null && (
            <strong className={graded ? "correct" : "wrong"}>
              {graded
                ? "Correct — degree sum 12 = 2 × 6."
                : "Count the loop at X twice."}
            </strong>
          )}
          {hint && <p>The loop adds 2 to deg(X).</p>}
        </main>
        <aside>
          <h3>When you're ready...</h3>
          <p>
            Try adding a loop or an edge in the Interact tab and repeat the
            challenge!
          </p>
          <button onClick={() => act(() => setTab("Interact"))}>
            Go to Interact →
          </button>
        </aside>
      </section>
      <nav className="vd568-adjacent">
        <button>
          Previous Lesson
          <br />
          <b>Weighted Graphs</b>
        </button>
        <button>
          Next Lesson
          <br />
          <b>Paths and Cycles</b>
        </button>
      </nav>
    </section>
  );
}
function DegreeGraph({
  vertices,
  edges,
  selected,
  showLoops,
  dragging,
  setDragging,
  onSelect,
  move,
}: {
  vertices: Vertex[];
  edges: Edge[];
  selected: string;
  showLoops: boolean;
  dragging: string | null;
  setDragging: (id: string | null) => void;
  onSelect: (id: string) => void;
  move: (e: PointerEvent<SVGSVGElement>) => void;
}) {
  return (
    <svg
      className="vd568-graph"
      viewBox="0 0 570 420"
      onPointerMove={move}
      onPointerUp={() => setDragging(null)}
      onPointerLeave={() => setDragging(null)}
    >
      {edges
        .filter((e) => showLoops || e.a !== e.b)
        .map((e) => {
          const a = vertices.find((v) => v.id === e.a)!,
            b = vertices.find((v) => v.id === e.b)!;
          if (e.a === e.b)
            return (
              <g key={`loop${e.a}`}>
                <ellipse cx={a.x} cy={a.y - 38} rx="27" ry="38" />
                <text x={a.x + 34} y={a.y - 63}>
                  {e.count}
                </text>
              </g>
            );
          return (
            <g key={key(e.a, e.b)}>
              <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} />
              <text x={(a.x + b.x) / 2} y={(a.y + b.y) / 2 - 7}>
                {e.count}
              </text>
            </g>
          );
        })}
      {vertices.map((v) => (
        <g
          data-testid={`degree-vertex-${v.id}`}
          key={v.id}
          transform={`translate(${v.x} ${v.y})`}
          className={`${selected === v.id ? "selected" : ""} ${dragging === v.id ? "dragging" : ""}`}
          onPointerDown={(e) => {
            setDragging(v.id);
            e.currentTarget.setPointerCapture(e.pointerId);
          }}
          onClick={() => onSelect(v.id)}
        >
          <circle r="24" fill={v.color} />
          <text textAnchor="middle" dy="5">
            {v.id}
          </text>
        </g>
      ))}
    </svg>
  );
}
function ExampleGraph() {
  return (
    <svg className="vd568-example" viewBox="0 0 240 170">
      <path d="M25 35L125 35L205 55M25 35L125 140M125 35L125 140M205 55L125 140" />
      <ellipse cx="125" cy="13" rx="20" ry="25" />
      <g>
        <circle cx="25" cy="35" r="13" />
        <circle cx="125" cy="35" r="13" />
        <circle cx="205" cy="55" r="13" />
        <circle cx="125" cy="140" r="13" />
      </g>
      <g className="labels">
        <text x="25" y="39">
          P
        </text>
        <text x="125" y="39">
          Q
        </text>
        <text x="205" y="59">
          R
        </text>
        <text x="125" y="144">
          S
        </text>
      </g>
    </svg>
  );
}
function ChallengeGraph() {
  return (
    <svg className="vd568-example" viewBox="0 0 240 170">
      <path d="M25 80L125 30L215 80M25 80L125 145M125 30L125 145M215 80L125 145" />
      <ellipse cx="125" cy="8" rx="20" ry="25" />
      <g>
        <circle cx="25" cy="80" r="13" />
        <circle cx="125" cy="30" r="13" />
        <circle cx="215" cy="80" r="13" />
        <circle cx="125" cy="145" r="13" />
      </g>
      <g className="labels">
        <text x="25" y="84">
          W
        </text>
        <text x="125" y="34">
          X
        </text>
        <text x="215" y="84">
          Y
        </text>
        <text x="125" y="149">
          Z
        </text>
      </g>
    </svg>
  );
}
