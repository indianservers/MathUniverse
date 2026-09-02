import { Check, Redo2, RotateCcw, Share2, Undo2 } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import type { PointerEvent } from "react";
import type { LessonAdapterProps } from "../../types";
import "../geometry3d/CoordinateSystemTargetLesson378.css";
import "./PlanarGraphsTargetLesson578.css";

type Vertex = { id: string; x: number; y: number };
type Edge = { a: string; b: string };
type Graph = { kind: "k5" | "k33" | "k4"; vertices: Vertex[]; edges: Edge[] };
type Snapshot = { vertices: Vertex[]; edges: Edge[] };
const pentagon: Vertex[] = [
    { id: "A", x: 70, y: 100 },
    { id: "B", x: 285, y: 35 },
    { id: "C", x: 500, y: 100 },
    { id: "D", x: 145, y: 300 },
    { id: "E", x: 425, y: 300 },
  ],
  k5Edges: Edge[] = [];
for (let i = 0; i < 5; i++)
  for (let j = i + 1; j < 5; j++)
    k5Edges.push({ a: "ABCDE"[i], b: "ABCDE"[j] });
const k33Vertices: Vertex[] = [
    { id: "A", x: 120, y: 65 },
    { id: "B", x: 120, y: 175 },
    { id: "C", x: 120, y: 285 },
    { id: "D", x: 460, y: 65 },
    { id: "E", x: 460, y: 175 },
    { id: "F", x: 460, y: 285 },
  ],
  k33Edges: Edge[] = ["A", "B", "C"].flatMap((a) =>
    ["D", "E", "F"].map((b) => ({ a, b })),
  );
const k4Vertices: Vertex[] = [
    { id: "A", x: 110, y: 70 },
    { id: "B", x: 460, y: 70 },
    { id: "C", x: 460, y: 300 },
    { id: "D", x: 285, y: 175 },
  ],
  k4Edges: Edge[] = [];
for (let i = 0; i < 4; i++)
  for (let j = i + 1; j < 4; j++) k4Edges.push({ a: "ABCD"[i], b: "ABCD"[j] });
const makeGraph = (kind: Graph["kind"]): Graph =>
  kind === "k5"
    ? { kind, vertices: pentagon, edges: k5Edges }
    : kind === "k33"
      ? { kind, vertices: k33Vertices, edges: k33Edges }
      : { kind, vertices: k4Vertices, edges: k4Edges };
const key = (e: Edge) => [e.a, e.b].sort().join("");
function orient(a: Vertex, b: Vertex, c: Vertex) {
  return (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x);
}
function intersects(e1: Edge, e2: Edge, vs: Vertex[]) {
  if ([e1.a, e1.b].some((id) => id === e2.a || id === e2.b)) return false;
  const a = vs.find((v) => v.id === e1.a)!,
    b = vs.find((v) => v.id === e1.b)!,
    c = vs.find((v) => v.id === e2.a)!,
    d = vs.find((v) => v.id === e2.b)!;
  return (
    orient(a, b, c) * orient(a, b, d) < 0 &&
    orient(c, d, a) * orient(c, d, b) < 0
  );
}
function crossingPairs(edges: Edge[], vs: Vertex[]) {
  const out: string[] = [];
  for (let i = 0; i < edges.length; i++)
    for (let j = i + 1; j < edges.length; j++)
      if (intersects(edges[i], edges[j], vs))
        out.push(`${key(edges[i])}/${key(edges[j])}`);
  return out;
}
function connected(vs: Vertex[], es: Edge[]) {
  if (!vs.length) return true;
  const seen = new Set([vs[0].id]),
    q = [vs[0].id];
  while (q.length) {
    const at = q.shift()!;
    for (const e of es.filter((x) => x.a === at || x.b === at)) {
      const n = e.a === at ? e.b : e.a;
      if (!seen.has(n)) {
        seen.add(n);
        q.push(n);
      }
    }
  }
  return seen.size === vs.length;
}
function nonplanarReason(graph: Graph) {
  const v = graph.vertices.length,
    e = graph.edges.length;
  if (v >= 3 && e > 3 * v - 6) return `E = ${e} exceeds 3V − 6 = ${3 * v - 6}`;
  const bipartite = graph.kind === "k33";
  if (bipartite && e > 2 * v - 4)
    return `Bipartite bound: E = ${e} exceeds 2V − 4 = ${2 * v - 4}`;
  return "";
}
const clone = (s: Snapshot): Snapshot => ({
  vertices: s.vertices.map((v) => ({ ...v })),
  edges: s.edges.map((e) => ({ ...e })),
});
function GraphSvg({
  vertices,
  edges,
  crossings,
  labels = true,
  onDown,
}: {
  vertices: Vertex[];
  edges: Edge[];
  crossings: string[];
  labels?: boolean;
  onDown?: (id: string) => void;
}) {
  const crossed = new Set(crossings.flatMap((p) => p.split("/")));
  return (
    <>
      {edges.map((e) => {
        const a = vertices.find((v) => v.id === e.a)!,
          b = vertices.find((v) => v.id === e.b)!;
        return (
          <g key={key(e)}>
            <line
              className={crossed.has(key(e)) ? "crossed" : ""}
              x1={a.x}
              y1={a.y}
              x2={b.x}
              y2={b.y}
            />
            {labels && (
              <text
                className="edge-name"
                x={(a.x + b.x) / 2}
                y={(a.y + b.y) / 2 - 5}
              >
                {e.a}
                {e.b}
              </text>
            )}
          </g>
        );
      })}
      {vertices.map((v, i) => (
        <g
          key={v.id}
          data-testid={`planar-vertex-${v.id}`}
          onMouseDown={() => onDown?.(v.id)}
        >
          <circle cx={v.x} cy={v.y} r="22" className={i === 0 ? "first" : ""} />
          <text x={v.x} y={v.y + 5}>
            {v.id}
          </text>
        </g>
      ))}
    </>
  );
}

export default function PlanarGraphsTargetLesson578({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [graph, setGraph] = useState(() => makeGraph("k5")),
    [history, setHistory] = useState<Snapshot[]>([]),
    [future, setFuture] = useState<Snapshot[]>([]),
    [dragging, setDragging] = useState<string | null>(null),
    [tool, setTool] = useState("move"),
    [selected, setSelected] = useState<string | null>(null),
    [showCrossings, setShowCrossings] = useState(true),
    [showFaces, setShowFaces] = useState(true),
    [showLabels, setShowLabels] = useState(false),
    [tab, setTab] = useState("INTERACT"),
    [answer, setAnswer] = useState({ v: "4", e: "6", f: "4", sum: "2" }),
    [graded, setGraded] = useState<boolean | null>(true),
    [actions, setActions] = useState(0);
  const moved = useRef(false),
    crossings = useMemo(
      () => crossingPairs(graph.edges, graph.vertices),
      [graph],
    ),
    reason = nonplanarReason(graph),
    isPlanar =
      !reason &&
      crossings.length === 0 &&
      connected(graph.vertices, graph.edges),
    faces = isPlanar
      ? graph.edges.length - graph.vertices.length + 2
      : Math.max(1, graph.edges.length - graph.vertices.length + 1),
    euler = graph.vertices.length - graph.edges.length + faces;
  const act = (fn: () => void) => {
      fn();
      setActions((n) => n + 1);
      onInteraction();
    },
    record = () => {
      setHistory((h) => [...h, clone(graph)]);
      setFuture([]);
    },
    load = (kind: Graph["kind"]) =>
      act(() => {
        setGraph(makeGraph(kind));
        setHistory([]);
        setFuture([]);
        setSelected(null);
      }),
    reset = () => {
      setGraph(makeGraph("k5"));
      setHistory([]);
      setFuture([]);
      setDragging(null);
      setTool("move");
      setSelected(null);
      setShowCrossings(true);
      setShowFaces(true);
      setShowLabels(false);
      setTab("INTERACT");
      setAnswer({ v: "4", e: "6", f: "4", sum: "2" });
      setGraded(true);
      setActions(0);
    };
  useEffect(reset, [resetToken]);
  const move = (e: PointerEvent<SVGSVGElement>) => {
      if (!dragging || tool !== "move") return;
      const b = e.currentTarget.getBoundingClientRect(),
        x = Math.max(24, Math.min(546, ((e.clientX - b.left) / b.width) * 570)),
        y = Math.max(24, Math.min(336, ((e.clientY - b.top) / b.height) * 360));
      moved.current = true;
      setGraph((g) => ({
        ...g,
        vertices: g.vertices.map((v) =>
          v.id === dragging ? { ...v, x, y } : v,
        ),
      }));
      onInteraction();
    },
    down = (id: string) => {
      if (tool === "delete") {
        record();
        act(() =>
          setGraph((g) => ({
            ...g,
            vertices: g.vertices.filter((v) => v.id !== id),
            edges: g.edges.filter((x) => x.a !== id && x.b !== id),
          })),
        );
        return;
      }
      if (tool === "edge") {
        if (!selected) {
          setSelected(id);
          return;
        }
        if (
          selected !== id &&
          !graph.edges.some((x) => key(x) === key({ a: selected, b: id }))
        ) {
          record();
          act(() =>
            setGraph((g) => ({
              ...g,
              edges: [...g.edges, { a: selected, b: id }],
            })),
          );
        }
        setSelected(null);
        return;
      }
      if (tool === "move") {
        record();
        moved.current = false;
        setDragging(id);
      }
    };
  const undo = () => {
      const prev = history.at(-1);
      if (!prev) return;
      act(() => {
        setFuture((f) => [clone(graph), ...f]);
        setGraph((g) => ({ ...g, ...clone(prev) }));
        setHistory((h) => h.slice(0, -1));
      });
    },
    redo = () => {
      const next = future[0];
      if (!next) return;
      act(() => {
        setHistory((h) => [...h, clone(graph)]);
        setGraph((g) => ({ ...g, ...clone(next) }));
        setFuture((f) => f.slice(1));
      });
    };
  const challengeCorrect =
    answer.v === "4" &&
    answer.e === "6" &&
    answer.f === "4" &&
    answer.sum === "2";
  return (
    <section
      className="pl578-page cs378-page"
      data-testid="discrete-mockup-0635"
      data-object-model="dedicated-segment-crossing-planarity-euler-history-model"
      data-kind={graph.kind}
      data-vertex-count={graph.vertices.length}
      data-edge-count={graph.edges.length}
      data-crossing-count={crossings.length}
      data-planar={isPlanar}
      data-faces={faces}
      data-euler={euler}
      data-reason={reason}
      data-positions={graph.vertices
        .map((v) => `${v.id}:${Math.round(v.x)},${Math.round(v.y)}`)
        .join(";")}
      data-history={history.length}
      data-graded={graded === null ? "" : graded}
      data-actions={actions}
    >
      <header className="pl578-hero">
        <span>578</span>
        <div>
          <h1>Planar Graphs – discrete lab</h1>
          <p>
            <b>Objective:</b> Untangle a crossing-free drawing and verify
            Euler’s formula V − E + F = 2.
          </p>
          <dl>
            <i>
              ♧ Level: <b>Intermediate–Advanced</b>
            </i>
            <i>
              ▣ Subject: <b>Discrete Mathematics</b>
            </i>
            <i>
              ♧ Topic: <b>Planar Graphs</b>
            </i>
            <i>
              ◷ Est. time: <b>6–10 min</b>
            </i>
          </dl>
        </div>
        <button onClick={() => act(reset)}>
          <RotateCcw />
          Reset
        </button>
        <button
          onClick={() =>
            act(() =>
              navigator.clipboard?.writeText(
                `${graph.kind}: V=${graph.vertices.length}, E=${graph.edges.length}, crossings=${crossings.length}`,
              ),
            )
          }
        >
          <Share2 />
          Share
        </button>
      </header>
      <nav className="pl578-tabs">
        {["INTERACT", "LEARN", "WORKED EXAMPLE", "FORMULA", "PRACTICE"].map(
          (n) => (
            <button
              key={n}
              className={tab === n ? "active" : ""}
              onClick={() => act(() => setTab(n))}
            >
              {n}
            </button>
          ),
        )}
      </nav>
      {tab !== "INTERACT" && (
        <p className="pl578-note">
          <b>{tab}:</b> A connected planar embedding satisfies V − E + F = 2.
        </p>
      )}
      <section className="pl578-lab">
        <main>
          <p>
            Drag vertices to inspect crossings, then verify Euler’s formula.
          </p>
          <div className="pl578-canvas">
            <b>Drag any vertex (circle) to a new spot.</b>
            <svg
              viewBox="0 0 570 360"
              onPointerMove={move}
              onPointerUp={() => setDragging(null)}
              onPointerLeave={() => setDragging(null)}
            >
              <GraphSvg
                vertices={graph.vertices}
                edges={graph.edges}
                crossings={showCrossings ? crossings : []}
                labels={showLabels}
                onDown={down}
              />
              {showFaces && isPlanar && (
                <text className="face-count" x="285" y="190">
                  F = {faces}
                </text>
              )}
            </svg>
            <nav>
              {[
                ["select", "Select", "⌁"],
                ["move", "Move", "☝"],
                ["vertex", "Add Vertex", "+"],
                ["edge", "Add Edge", "↗"],
                ["delete", "Delete", "×"],
              ].map(([id, label, icon]) => (
                <button
                  key={id}
                  className={tool === id ? "active" : ""}
                  onClick={() =>
                    act(() => {
                      setTool(id);
                      setSelected(null);
                      if (id === "vertex") {
                        record();
                        const name = String.fromCharCode(
                          65 + graph.vertices.length,
                        );
                        setGraph((g) => ({
                          ...g,
                          vertices: [
                            ...g.vertices,
                            { id: name, x: 285, y: 180 },
                          ],
                        }));
                      }
                    })
                  }
                >
                  <i>{icon}</i>
                  {label}
                </button>
              ))}
              <button onClick={undo} disabled={!history.length}>
                <Undo2 />
                Undo
              </button>
              <button onClick={redo} disabled={!future.length}>
                <Redo2 />
                Redo
              </button>
            </nav>
          </div>
        </main>
        <aside>
          <header>
            <b>
              Graph:{" "}
              {graph.kind === "k5"
                ? "K₅"
                : graph.kind === "k33"
                  ? "K₃,₃"
                  : "K₄"}
            </b>
            <select
              aria-label="Planar graph choice"
              value={graph.kind}
              onChange={(e) => load(e.target.value as Graph["kind"])}
            >
              <option value="k5">Change graph</option>
              <option value="k33">K₃,₃</option>
              <option value="k4">K₄ planar</option>
            </select>
          </header>
          <h3>Graph stats</h3>
          <dl>
            <span>
              V (vertices)<b>{graph.vertices.length}</b>
            </span>
            <span>
              E (edges)<b>{graph.edges.length}</b>
            </span>
            <span>
              F (faces)<b>{faces}</b>
            </span>
          </dl>
          <h3>Euler check</h3>
          <p className="formula">
            V − E + F = 2 <Check />
          </p>
          <strong>
            {graph.vertices.length} − {graph.edges.length} + {faces} = {euler}
          </strong>
          <output className={isPlanar ? "good" : "bad"}>
            {isPlanar
              ? "Equal to 2 — planar embedding"
              : "Not a planar embedding"}
          </output>
          {reason && (
            <small>
              {reason}. This graph cannot be untangled in the plane.
            </small>
          )}
          <h3>View options</h3>
          <label>
            Show crossings
            <input
              type="checkbox"
              checked={showCrossings}
              onChange={() => act(() => setShowCrossings((v) => !v))}
            />
          </label>
          <label>
            Show faces
            <input
              type="checkbox"
              checked={showFaces}
              onChange={() => act(() => setShowFaces((v) => !v))}
            />
          </label>
          <label>
            Show edge labels
            <input
              type="checkbox"
              checked={showLabels}
              onChange={() => act(() => setShowLabels((v) => !v))}
            />
          </label>
          <h3>Graph library</h3>
          <div>
            <button
              className={graph.kind === "k5" ? "active" : ""}
              onClick={() => load("k5")}
            >
              K₅
            </button>
            <button
              className={graph.kind === "k33" ? "active" : ""}
              onClick={() => load("k33")}
            >
              K₃,₃
            </button>
            <button
              className={graph.kind === "k4" ? "active" : ""}
              onClick={() => load("k4")}
            >
              K₄
            </button>
          </div>
        </aside>
      </section>
      <section className="pl578-theory">
        <article>
          <h3>Notice the pattern</h3>
          <p>Untangle a planar graph. What pattern do you observe?</p>
          <ul>
            <li>No crossings remain.</li>
            <li>The region outside counts as one face.</li>
            <li>When planar, V − E + F equals 2.</li>
          </ul>
        </article>
        <article>
          <h3>Worked example (correct)</h3>
          <p>K₄ drawn without crossings</p>
          <svg viewBox="0 0 570 360">
            <GraphSvg
              vertices={k4Vertices}
              edges={k4Edges}
              crossings={[]}
              labels={false}
            />
          </svg>
          <table>
            <tbody>
              <tr>
                <th>V</th>
                <th>E</th>
                <th>F</th>
                <th>V−E+F</th>
              </tr>
              <tr>
                <td>4</td>
                <td>6</td>
                <td>4</td>
                <td>2 ✓</td>
              </tr>
            </tbody>
          </table>
        </article>
        <article>
          <h3>Key rule / definition</h3>
          <p>
            A planar graph can be drawn on the plane without any edge crossings.
          </p>
          <hr />
          <h3>Euler’s Formula</h3>
          <p>For any connected planar graph,</p>
          <strong>V − E + F = 2</strong>
          <p>F includes the unbounded outer face.</p>
        </article>
      </section>
      <section className="pl578-bottom">
        <article>
          <h3>Common misconception</h3>
          <p>
            If one drawing has crossings, the graph is not necessarily
            nonplanar. But K₅ and K₃,₃ are provably nonplanar.
          </p>
          <MiniNonPlanar />
        </article>
        <article>
          <h3>Try it (challenge)</h3>
          <p>For planar K₄, record V, E, F and verify Euler’s formula.</p>
          <svg viewBox="0 0 570 360">
            <GraphSvg
              vertices={k4Vertices}
              edges={k4Edges}
              crossings={[]}
              labels={false}
            />
          </svg>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              act(() => setGraded(challengeCorrect));
            }}
          >
            {(["v", "e", "f", "sum"] as const).map((name, i) => (
              <label key={name}>
                {["V", "E", "F", "V − E + F"][i]} ={" "}
                <input
                  aria-label={`Planar challenge ${name}`}
                  value={answer[name]}
                  onChange={(e) =>
                    setAnswer((a) => ({ ...a, [name]: e.target.value }))
                  }
                />
              </label>
            ))}
            <button>Check result</button>
            <output className={graded ? "good" : graded === false ? "bad" : ""}>
              {graded
                ? "Correct! Well done."
                : graded === false
                  ? "Check the outer face too."
                  : "Ready to verify"}
            </output>
          </form>
        </article>
      </section>
      <nav className="pl578-adjacent">
        <a href="/lessons/discrete-and-applied-mathematics/577-bipartite-graphs">
          ←{" "}
          <span>
            PREVIOUS LESSON<b>Bipartite Graphs</b>
          </span>
        </a>
        <p>
          Lesson progress
          <br />
          ●—●—○—○—○
        </p>
        <a href="/lessons/discrete-and-applied-mathematics/579-network-flow">
          <span>
            NEXT LESSON<b>Network Flow</b>
          </span>{" "}
          →
        </a>
      </nav>
    </section>
  );
}
function MiniNonPlanar() {
  return (
    <svg viewBox="0 0 570 360">
      <GraphSvg
        vertices={pentagon}
        edges={k5Edges}
        crossings={crossingPairs(k5Edges, pentagon)}
        labels={false}
      />
      <text className="cross-mark" x="285" y="185">
        ×
      </text>
    </svg>
  );
}
