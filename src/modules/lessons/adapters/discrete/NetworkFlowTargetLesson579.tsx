import {
  Check,
  Lightbulb,
  Play,
  RotateCcw,
  Shuffle,
  TriangleAlert,
} from "lucide-react";
import { useEffect, useState } from "react";
import type { PointerEvent } from "react";
import type { LessonAdapterProps } from "../../types";
import "../geometry3d/CoordinateSystemTargetLesson378.css";
import "./NetworkFlowTargetLesson579.css";

type Vertex = { id: string; x: number; y: number };
type Edge = { id: string; a: string; b: string; capacity: number };
type Flow = Record<string, number>;
type Arc = {
  from: string;
  to: string;
  edge: string;
  residual: number;
  forward: boolean;
};
const vertices: Vertex[] = [
  { id: "S", x: 30, y: 180 },
  { id: "A", x: 170, y: 65 },
  { id: "B", x: 170, y: 295 },
  { id: "C", x: 375, y: 65 },
  { id: "D", x: 375, y: 295 },
  { id: "T", x: 535, y: 180 },
];
const edges: Edge[] = [
  { id: "sa", a: "S", b: "A", capacity: 3 },
  { id: "sb", a: "S", b: "B", capacity: 2 },
  { id: "ab", a: "A", b: "B", capacity: 4 },
  { id: "ac", a: "A", b: "C", capacity: 2 },
  { id: "ad", a: "A", b: "D", capacity: 2 },
  { id: "bd", a: "B", b: "D", capacity: 5 },
  { id: "cd", a: "C", b: "D", capacity: 1 },
  { id: "ct", a: "C", b: "T", capacity: 3 },
  { id: "dt", a: "D", b: "T", capacity: 3 },
];
const maxFlow: Flow = {
    sa: 3,
    sb: 2,
    ab: 0,
    ac: 2,
    ad: 1,
    bd: 2,
    cd: 0,
    ct: 2,
    dt: 3,
  },
  zeroFlow = () => Object.fromEntries(edges.map((e) => [e.id, 0]));
function residualArcs(es: Edge[], flow: Flow) {
  return es
    .flatMap<Arc>((e) => [
      {
        from: e.a,
        to: e.b,
        edge: e.id,
        residual: e.capacity - (flow[e.id] ?? 0),
        forward: true,
      },
      {
        from: e.b,
        to: e.a,
        edge: e.id,
        residual: flow[e.id] ?? 0,
        forward: false,
      },
    ])
    .filter((a) => a.residual > 0);
}
function findPath(es: Edge[], flow: Flow, source = "S", sink = "T") {
  const arcs = residualArcs(es, flow),
    prev = new Map<string, Arc>(),
    seen = new Set([source]),
    q = [source];
  while (q.length && !seen.has(sink)) {
    const at = q.shift()!;
    for (const arc of arcs.filter((a) => a.from === at)) {
      if (seen.has(arc.to)) continue;
      seen.add(arc.to);
      prev.set(arc.to, arc);
      q.push(arc.to);
    }
  }
  if (!seen.has(sink)) return [];
  const path: Arc[] = [];
  let at = sink;
  while (at !== source) {
    const arc = prev.get(at)!;
    path.unshift(arc);
    at = arc.from;
  }
  return path;
}
function augment(es: Edge[], flow: Flow, path: Arc[]) {
  const bottleneck = Math.min(...path.map((a) => a.residual)),
    next = { ...flow };
  for (const arc of path)
    next[arc.edge] =
      (next[arc.edge] ?? 0) + (arc.forward ? bottleneck : -bottleneck);
  return { flow: next, bottleneck };
}
function solve(es: Edge[]) {
  let flow = zeroFlow(),
    guard = 0;
  const steps: { path: string; bottleneck: number; value: number }[] = [];
  while (guard++ < 100) {
    const path = findPath(es, flow);
    if (!path.length) break;
    const out = augment(es, flow, path);
    flow = out.flow;
    steps.push({
      path: [path[0].from, ...path.map((a) => a.to)].join("–"),
      bottleneck: out.bottleneck,
      value: flowValue(es, flow),
    });
  }
  return { flow, steps, value: flowValue(es, flow) };
}
function flowValue(es: Edge[], flow: Flow) {
  return (
    es.filter((e) => e.a === "S").reduce((s, e) => s + (flow[e.id] ?? 0), 0) -
    es.filter((e) => e.b === "S").reduce((s, e) => s + (flow[e.id] ?? 0), 0)
  );
}
function balance(id: string, es: Edge[], flow: Flow) {
  const input = es
      .filter((e) => e.b === id)
      .reduce((s, e) => s + (flow[e.id] ?? 0), 0),
    output = es
      .filter((e) => e.a === id)
      .reduce((s, e) => s + (flow[e.id] ?? 0), 0);
  return { input, output, ok: input === output };
}
const challengeEdges: Edge[] = [
  { id: "su", a: "S", b: "U", capacity: 4 },
  { id: "sv", a: "S", b: "V", capacity: 2 },
  { id: "uv", a: "U", b: "V", capacity: 1 },
  { id: "ut", a: "U", b: "T", capacity: 3 },
  { id: "vt", a: "V", b: "T", capacity: 5 },
];
const challengeVertices: Vertex[] = [
  { id: "S", x: 25, y: 100 },
  { id: "U", x: 145, y: 35 },
  { id: "V", x: 145, y: 165 },
  { id: "T", x: 275, y: 100 },
];

export default function NetworkFlowTargetLesson579({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [points, setPoints] = useState(vertices),
    [flow, setFlow] = useState<Flow>(maxFlow),
    [selected, setSelected] = useState("ac"),
    [highlight, setHighlight] = useState<Arc[]>([]),
    [labels, setLabels] = useState(true),
    [tab, setTab] = useState("Interact"),
    [dragging, setDragging] = useState<string | null>(null),
    [answer, setAnswer] = useState(""),
    [graded, setGraded] = useState<boolean | null>(null),
    [variant, setVariant] = useState(0),
    [actions, setActions] = useState(0);
  const usedEdges = variant
      ? edges.map((e) =>
          e.id === "ac"
            ? { ...e, capacity: 4 }
            : e.id === "bd"
              ? { ...e, capacity: 3 }
              : e,
        )
      : edges,
    current = usedEdges.find((e) => e.id === selected)!,
    balances = Object.fromEntries(
      ["A", "B", "C", "D"].map((id) => [id, balance(id, usedEdges, flow)]),
    ),
    validCapacity = usedEdges.every(
      (e) => (flow[e.id] ?? 0) >= 0 && (flow[e.id] ?? 0) <= e.capacity,
    ),
    conserved = Object.values(balances).every((v) => v.ok),
    valid = validCapacity && conserved,
    value = flowValue(usedEdges, flow),
    solution = solve(usedEdges),
    augmenting = findPath(usedEdges, flow),
    maximum = valid && !augmenting.length && value === solution.value;
  const act = (fn: () => void) => {
      fn();
      setActions((n) => n + 1);
      onInteraction();
    },
    reset = () => {
      setPoints(vertices);
      setFlow(maxFlow);
      setSelected("ac");
      setHighlight([]);
      setLabels(true);
      setTab("Interact");
      setDragging(null);
      setAnswer("");
      setGraded(null);
      setVariant(0);
      setActions(0);
    };
  useEffect(reset, [resetToken]);
  const changeFlow = (n: number) =>
      act(() => {
        setFlow((f) => ({
          ...f,
          [selected]: Math.max(0, Math.min(current.capacity, n)),
        }));
        setHighlight([]);
      }),
    find = () => act(() => setHighlight(findPath(usedEdges, flow))),
    auto = () =>
      act(() => {
        setFlow(solve(usedEdges).flow);
        setHighlight([]);
      }),
    move = (e: PointerEvent<SVGSVGElement>) => {
      if (!dragging) return;
      const b = e.currentTarget.getBoundingClientRect(),
        x = Math.max(25, Math.min(545, ((e.clientX - b.left) / b.width) * 570)),
        y = Math.max(25, Math.min(335, ((e.clientY - b.top) / b.height) * 360));
      setPoints((vs) =>
        vs.map((v) => (v.id === dragging ? { ...v, x, y } : v)),
      );
      onInteraction();
    };
  return (
    <section
      className="nf579-page cs378-page"
      data-testid="discrete-mockup-0636"
      data-object-model="dedicated-residual-edmonds-karp-capacity-conservation-model"
      data-flow-value={value}
      data-max-flow={solution.value}
      data-valid={valid}
      data-conserved={conserved}
      data-maximum={maximum}
      data-selected-edge={selected}
      data-selected-flow={flow[selected] ?? 0}
      data-residual-path={
        augmenting.length
          ? [augmenting[0].from, ...augmenting.map((a) => a.to)].join(",")
          : ""
      }
      data-highlighted-path={
        highlight.length
          ? [highlight[0].from, ...highlight.map((a) => a.to)].join(",")
          : ""
      }
      data-variant={variant}
      data-positions={points
        .map((v) => `${v.id}:${Math.round(v.x)},${Math.round(v.y)}`)
        .join(";")}
      data-graded={graded === null ? "" : graded}
      data-actions={actions}
    >
      <header className="nf579-hero">
        <b>DISCRETE AND APPLIED MATHEMATICS</b>
        <h1>Network Flow</h1>
        <p>
          <b>Objective:</b> Maximize flow from source to sink without exceeding
          capacities and while conserving flow at intermediate nodes.
        </p>
        <dl>
          <span>
            ♧ Level: <b>Intermediate–Advanced</b>
          </span>
          <span>
            ♧ Topic: <b>Graph Theory</b>
          </span>
          <span>
            ◷ Est. time: <b>6–10 min</b>
          </span>
          <span>
            ♧ Lab: <b>Discrete Math Lab</b>
          </span>
        </dl>
      </header>
      <nav className="nf579-tabs">
        {["Interact", "Learn", "Worked Example", "Formula", "Practice"].map(
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
      {tab !== "Interact" && (
        <p className="nf579-note">
          <b>{tab}:</b> Residual capacity is the extra flow an edge can still
          carry.
        </p>
      )}
      <section className="nf579-lab">
        <header>
          <h3>
            <i>1</i> Observe &amp; Manipulate
          </h3>
          <p>
            Drag on edges to send flow. Respect capacities and conserve flow at
            intermediate nodes.
          </p>
          <button onClick={() => act(reset)}>
            <RotateCcw />
            Reset
          </button>
          <button
            onClick={() =>
              act(() => {
                const next = variant ? 0 : 1,
                  set = next
                    ? edges.map((e) =>
                        e.id === "ac"
                          ? { ...e, capacity: 4 }
                          : e.id === "bd"
                            ? { ...e, capacity: 3 }
                            : e,
                      )
                    : edges;
                setVariant(next);
                setFlow(solve(set).flow);
                setHighlight([]);
              })
            }
          >
            <Shuffle />
            New network
          </button>
        </header>
        <div>
          <main>
            <div className="nf579-canvas">
              <nav>
                <span>━ Flow (f)</span>
                <span>━ Capacity (c)</span>
                <span>--- Augmenting path</span>
              </nav>
              <svg
                viewBox="0 0 570 360"
                onPointerMove={move}
                onPointerUp={() => setDragging(null)}
                onPointerLeave={() => setDragging(null)}
                role="img"
                aria-label={`Flow network with value ${value}`}
              >
                <defs>
                  <marker
                    id="nf-arrow"
                    markerWidth="8"
                    markerHeight="8"
                    refX="7"
                    refY="4"
                    orient="auto"
                  >
                    <path d="M0 0L8 4L0 8z" />
                  </marker>
                </defs>
                {usedEdges.map((e) => {
                  const a = points.find((v) => v.id === e.a)!,
                    b = points.find((v) => v.id === e.b)!,
                    active = highlight.some((x) => x.edge === e.id),
                    has = (flow[e.id] ?? 0) > 0;
                  return (
                    <g
                      key={e.id}
                      data-testid={`flow-edge-${e.id}`}
                      className={`${selected === e.id ? "selected" : ""} ${active ? "augmenting" : ""}`}
                      onClick={() => act(() => setSelected(e.id))}
                    >
                      <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} />
                      {has && (
                        <line
                          className="flow"
                          x1={a.x}
                          y1={a.y}
                          x2={b.x}
                          y2={b.y}
                        />
                      )}{" "}
                      {labels && (
                        <text x={(a.x + b.x) / 2} y={(a.y + b.y) / 2 - 8}>
                          {flow[e.id] ?? 0} / {e.capacity}
                        </text>
                      )}
                    </g>
                  );
                })}
                {points.map((v) => (
                  <g
                    key={v.id}
                    data-testid={`flow-vertex-${v.id}`}
                    className={
                      v.id === "S" ? "source" : v.id === "T" ? "sink" : ""
                    }
                    onPointerDown={(e) => {
                      setDragging(v.id);
                      e.currentTarget.setPointerCapture(e.pointerId);
                    }}
                  >
                    <circle cx={v.x} cy={v.y} r="24" />
                    <text x={v.x} y={v.y + 5}>
                      {v.id}
                    </text>
                  </g>
                ))}
              </svg>
              <p>
                <Lightbulb />
                Tip: An augmenting path has unused capacity in the forward
                direction.
              </p>
            </div>
            <section className="nf579-balance">
              <h4>Conservation at intermediate nodes (inflow = outflow)</h4>
              <div>
                {["A", "C", "D"].map((id) => (
                  <span key={id}>
                    Node {id}
                    <b>
                      in = {balances[id].input} / out = {balances[id].output}
                    </b>
                    <i className={balances[id].ok ? "ok" : "bad"}>
                      {balances[id].ok ? "✓" : "×"}
                    </i>
                  </span>
                ))}
              </div>
            </section>
          </main>
          <aside>
            <section>
              <header>
                <b>Controls</b>
                <label>
                  Show labels{" "}
                  <input
                    type="checkbox"
                    checked={labels}
                    onChange={() => act(() => setLabels((v) => !v))}
                  />
                </label>
              </header>
              <p>Drag on an edge to change flow f</p>
              <div>
                <b>{flow[selected] ?? 0}</b>
                <input
                  aria-label="Selected edge flow"
                  type="range"
                  min="0"
                  max={current.capacity}
                  value={flow[selected] ?? 0}
                  onChange={(e) => changeFlow(Number(e.target.value))}
                />
                <b>c</b>
                <input
                  aria-label="Selected edge capacity"
                  value={current.capacity}
                  readOnly
                />
              </div>
            </section>
            <section>
              <h4>Quick actions</h4>
              <div>
                <button onClick={find}>♧ Find augmenting path</button>
                <button onClick={auto}>
                  <Play />
                  Auto augment (max flow)
                </button>
              </div>
            </section>
            <section>
              <h4>Current status</h4>
              <dl>
                <span>
                  Current flow value |f|<b>{value}</b>
                </span>
                <span>
                  Max possible flow<b>{solution.value}</b>
                </span>
                <span>
                  Is this maximum?<b>{maximum ? "Yes ✓" : "No"}</b>
                </span>
              </dl>
            </section>
            <section>
              <h4>Legend</h4>
              <p>f / c = flow / capacity</p>
              <p>Blue edges carry flow &gt; 0</p>
              <p>Dashed = augmenting path</p>
            </section>
          </aside>
        </div>
      </section>
      <section className="nf579-theory">
        <article>
          <h3>
            <i>2</i> Notice the pattern
          </h3>
          <p>All intermediate nodes conserve flow.</p>
          <p>
            Increasing flow requires residual capacity along a path from source
            to sink.
          </p>
          <strong>
            <Check />
            <span>
              All intermediate nodes balance.
              <br />A valid flow that cannot be increased has no augmenting
              path.
            </span>
          </strong>
        </article>
        <article>
          <h3>
            <i>3</i> Understand the rule
          </h3>
          <p>A flow f is a function on directed edges satisfying:</p>
          <p>
            • <b>Capacity:</b> 0 ≤ f(e) ≤ c(e)
          </p>
          <p>
            • <b>Conservation:</b> For all v ∉ {`{s, t}`}, Σ f(u,v) = Σ f(v,w).
          </p>
          <p>
            • <b>Objective:</b> Maximize |f| = Σ f(s,v).
          </p>
        </article>
        <article>
          <h3>
            <TriangleAlert />
            Common misconception
          </h3>
          <p>Thinking “more flow everywhere” works.</p>
          <p>
            <b>Wrong:</b> You must respect capacities and conservation at every
            intermediate node.
          </p>
          <p>Check balances and look for an augmenting path instead.</p>
        </article>
      </section>
      <section className="nf579-worked">
        <article>
          <h3>
            Worked Example <small>(This network)</small>
          </h3>
          <p>One valid sequence of augmentations:</p>
          {solution.steps.map((s, i) => (
            <p key={s.path}>
              <i>{i + 1}</i> Path: {s.path}
              <span>Bottleneck: {s.bottleneck}</span>
              <b>|f| = {s.value}</b>
            </p>
          ))}
          <strong>Final flow value: |f| = {solution.value} (maximum)</strong>
          <p>
            A minimum cut is S = {`{s, A, B, D}`}, T = {`{C, t}`}.
            <br />
            Cut edges have total capacity {solution.value}.
            <br />
            Cut capacity = Maximum flow = {solution.value}.
          </p>
        </article>
        <article>
          <h3>Key Rule (Max-Flow Min-Cut Theorem)</h3>
          <p>
            The maximum value of a flow equals the minimum capacity of an s–t
            cut.
          </p>
          <strong>max |f| = min c(S,T)</strong>
          <p>Where c(S,T) is the sum of capacities crossing the cut.</p>
          <p>
            In this example: max flow = {solution.value} = min cut capacity.
          </p>
        </article>
      </section>
      <section className="nf579-practice">
        <div>
          <h3>
            <i>5</i>Try independently
          </h3>
          <p>
            Your turn: For the network below, find the maximum flow value from s
            to t.
          </p>
          <svg viewBox="0 0 300 200">
            {challengeEdges.map((e) => {
              const a = challengeVertices.find((v) => v.id === e.a)!,
                b = challengeVertices.find((v) => v.id === e.b)!;
              return (
                <g key={e.id}>
                  <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} />
                  <text x={(a.x + b.x) / 2} y={(a.y + b.y) / 2 - 5}>
                    {e.capacity}
                  </text>
                </g>
              );
            })}
            {challengeVertices.map((v) => (
              <g
                key={v.id}
                className={v.id === "S" ? "source" : v.id === "T" ? "sink" : ""}
              >
                <circle cx={v.x} cy={v.y} r="14" />
                <text x={v.x} y={v.y + 4}>
                  {v.id}
                </text>
              </g>
            ))}
          </svg>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            act(() =>
              setGraded(Number(answer) === solve(challengeEdges).value),
            );
          }}
        >
          <label>
            Submit your answer
            <input
              aria-label="Maximum flow challenge answer"
              type="number"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Enter maximum flow"
            />
          </label>
          <button>Check</button>
          <output className={graded ? "good" : graded === false ? "bad" : ""}>
            {graded
              ? "Correct: maximum flow is 6."
              : graded === false
                ? "Not yet. Check both source edges."
                : ""}
          </output>
        </form>
        <aside>
          <Lightbulb />
          <b>Hint</b>
          <p>
            Try sending flow along s–u–t first, then use the remaining capacity
            through v.
          </p>
        </aside>
      </section>
      <nav className="nf579-adjacent">
        <a href="/lessons/discrete-and-applied-mathematics/578-planar-graphs">
          ←{" "}
          <span>
            Previous lesson<b>Planar Graphs</b>
          </span>
        </a>
        <a href="/lessons/discrete-and-applied-mathematics/580-travelling-salesperson">
          <span>
            Next lesson<b>Travelling Salesperson</b>
          </span>{" "}
          →
        </a>
      </nav>
    </section>
  );
}
