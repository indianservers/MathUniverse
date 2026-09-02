import {
  CheckCircle2,
  HelpCircle,
  Lightbulb,
  Plus,
  RotateCcw,
  ShieldCheck,
  Trash2,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import type { PointerEvent } from "react";
import type { LessonAdapterProps } from "../../types";
import "../geometry3d/CoordinateSystemTargetLesson378.css";
import "./TreesTargetLesson573.css";

type Node = { id: string; x: number; y: number };
type Edge = { a: string; b: string };
const initialNodes: Node[] = [
  { id: "A", x: 290, y: 45 },
  { id: "B", x: 150, y: 125 },
  { id: "C", x: 430, y: 125 },
  { id: "D", x: 85, y: 220 },
  { id: "E", x: 220, y: 220 },
  { id: "F", x: 220, y: 320 },
  { id: "G", x: 365, y: 220 },
  { id: "H", x: 500, y: 220 },
];
const initialEdges: Edge[] = [
  { a: "A", b: "B" },
  { a: "A", b: "C" },
  { a: "B", b: "D" },
  { a: "B", b: "E" },
  { a: "E", b: "F" },
  { a: "C", b: "G" },
  { a: "C", b: "H" },
];
const key = (a: string, b: string) => [a, b].sort().join("");
function analyze(nodes: Node[], edges: Edge[], root: string) {
  const depth: Record<string, number> = { [root]: 0 },
    parent: Record<string, string | null> = { [root]: null },
    queue = [root],
    seen = new Set([root]);
  while (queue.length) {
    const at = queue.shift()!;
    for (const e of edges.filter((edge) => edge.a === at || edge.b === at)) {
      const next = e.a === at ? e.b : e.a;
      if (!seen.has(next)) {
        seen.add(next);
        parent[next] = at;
        depth[next] = depth[at] + 1;
        queue.push(next);
      }
    }
  }
  const connected = seen.size === nodes.length,
    acyclic = connected
      ? edges.length === nodes.length - 1
      : edges.length < nodes.length,
    children = Object.fromEntries(nodes.map((n) => [n.id, 0]));
  Object.entries(parent).forEach(([id, p]) => {
    if (id !== root && p) children[p]++;
  });
  const leaves = nodes
      .filter((n) => n.id !== root && children[n.id] === 0)
      .map((n) => n.id)
      .sort(),
    height = Math.max(0, ...Object.values(depth));
  return {
    depth,
    parent,
    connected,
    acyclic,
    isTree: connected && acyclic && edges.length === nodes.length - 1,
    leaves,
    height,
  };
}
function descendants(id: string, parent: Record<string, string | null>) {
  const found = new Set([id]);
  let changed = true;
  while (changed) {
    changed = false;
    for (const [child, p] of Object.entries(parent))
      if (p && found.has(p) && !found.has(child)) {
        found.add(child);
        changed = true;
      }
  }
  return found;
}
const challengeSets = [
  {
    nodes: [
      { id: "A", x: 280, y: 35 },
      { id: "B", x: 135, y: 105 },
      { id: "C", x: 420, y: 105 },
      { id: "D", x: 60, y: 195 },
      { id: "E", x: 210, y: 195 },
      { id: "F", x: 165, y: 285 },
      { id: "G", x: 260, y: 285 },
      { id: "H", x: 360, y: 195 },
      { id: "I", x: 495, y: 195 },
    ],
    edges: [
      { a: "A", b: "B" },
      { a: "A", b: "C" },
      { a: "B", b: "D" },
      { a: "B", b: "E" },
      { a: "E", b: "F" },
      { a: "E", b: "G" },
      { a: "C", b: "H" },
      { a: "C", b: "I" },
    ],
  },
  {
    nodes: [
      { id: "A", x: 280, y: 35 },
      { id: "B", x: 130, y: 120 },
      { id: "C", x: 430, y: 120 },
      { id: "D", x: 65, y: 230 },
      { id: "E", x: 195, y: 230 },
      { id: "F", x: 365, y: 230 },
      { id: "G", x: 495, y: 230 },
    ],
    edges: [
      { a: "A", b: "B" },
      { a: "A", b: "C" },
      { a: "B", b: "D" },
      { a: "B", b: "E" },
      { a: "C", b: "F" },
      { a: "C", b: "G" },
    ],
  },
];
const tabCopy: Record<string, string> = {
  Learn: "A finite tree is connected and acyclic.",
  "Worked Example": "Root the graph, then calculate depth, leaves, and height.",
  Formula: "Every finite tree satisfies e = n - 1.",
  Practice: "Build and verify a tree before answering its counts.",
};

export default function TreesTargetLesson573({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [nodes, setNodes] = useState(initialNodes),
    [edges, setEdges] = useState(initialEdges),
    [root, setRoot] = useState("A"),
    [selected, setSelected] = useState("B"),
    [action, setAction] = useState<"child" | "root-edge">("child"),
    [preventCycles, setPreventCycles] = useState(true),
    [tab, setTab] = useState("Interact"),
    [message, setMessage] = useState(
      "Select a node, then add a child to grow the tree.",
    ),
    [dragging, setDragging] = useState<string | null>(null),
    [round, setRound] = useState(0),
    [answers, setAnswers] = useState({ n: "9", e: "8", rule: "8" }),
    [graded, setGraded] = useState<boolean | null>(true),
    [hint, setHint] = useState(false),
    [actions, setActions] = useState(0);
  const moved = useRef(false),
    analysis = useMemo(() => analyze(nodes, edges, root), [nodes, edges, root]),
    challenge = challengeSets[round % challengeSets.length];
  const act = (fn: () => void) => {
    fn();
    setActions((n) => n + 1);
    onInteraction();
  };
  const reset = () => {
    setNodes(initialNodes);
    setEdges(initialEdges);
    setRoot("A");
    setSelected("B");
    setAction("child");
    setPreventCycles(true);
    setTab("Interact");
    setMessage("Select a node, then add a child to grow the tree.");
    setDragging(null);
    setRound(0);
    setAnswers({ n: "9", e: "8", rule: "8" });
    setGraded(true);
    setHint(false);
    setActions(0);
  };
  useEffect(reset, [resetToken]);
  const add = () =>
    act(() => {
      if (action === "root-edge") {
        if (selected === root) {
          setMessage("Choose a non-root node before connecting to the root.");
          return;
        }
        if (edges.some((e) => key(e.a, e.b) === key(selected, root))) {
          setMessage(`${selected} is already connected to root ${root}.`);
          return;
        }
        if (preventCycles) {
          setMessage(
            `Blocked ${selected}-${root}: that edge would create a cycle.`,
          );
          return;
        }
        setEdges((current) => [...current, { a: selected, b: root }]);
        setMessage(
          `Added ${selected}-${root}. The graph now contains a cycle.`,
        );
        return;
      }
      const id = String.fromCharCode(65 + nodes.length),
        parent = nodes.find((n) => n.id === selected)!;
      setNodes((current) => [
        ...current,
        {
          id,
          x: Math.min(540, parent.x + 55),
          y: Math.min(355, parent.y + 85),
        },
      ]);
      setEdges((current) => [...current, { a: selected, b: id }]);
      setSelected(id);
      setMessage(`Added child ${id} to ${selected}.`);
    });
  const remove = () =>
    act(() => {
      if (!nodes.some((n) => n.id === selected)) return;
      const removeIds = descendants(selected, analysis.parent);
      setNodes((current) => current.filter((n) => !removeIds.has(n.id)));
      setEdges((current) =>
        current.filter((e) => !removeIds.has(e.a) && !removeIds.has(e.b)),
      );
      if (removeIds.has(root)) {
        const next = nodes.find((n) => !removeIds.has(n.id))?.id ?? "A";
        setRoot(next);
      }
      setSelected(root);
      setMessage(`Removed ${[...removeIds].join(", ")} and incident edges.`);
    });
  const move = (event: PointerEvent<SVGSVGElement>) => {
    if (!dragging) return;
    const box = event.currentTarget.getBoundingClientRect(),
      x = Math.max(
        22,
        Math.min(558, ((event.clientX - box.left) / box.width) * 580),
      ),
      y = Math.max(
        22,
        Math.min(348, ((event.clientY - box.top) / box.height) * 370),
      );
    moved.current = true;
    setNodes((current) =>
      current.map((n) => (n.id === dragging ? { ...n, x, y } : n)),
    );
    onInteraction();
  };
  const choose = (id: string) => {
    if (moved.current) {
      moved.current = false;
      return;
    }
    act(() => {
      setSelected(id);
      setMessage(
        `${id} selected at level ${analysis.depth[id] ?? "unreachable"}.`,
      );
    });
  };
  const clear = () =>
    act(() => {
      setNodes([{ id: "A", x: 290, y: 45 }]);
      setEdges([]);
      setRoot("A");
      setSelected("A");
      setMessage("Cleared to a single-node tree.");
    });
  const check = () =>
    act(() =>
      setGraded(
        Number(answers.n) === challenge.nodes.length &&
          Number(answers.e) === challenge.edges.length &&
          Number(answers.rule) === challenge.nodes.length - 1,
      ),
    );
  return (
    <section
      className="tr573-page cs378-page"
      data-testid="discrete-mockup-0630"
      data-object-model="dedicated-rooted-tree-invariant-builder-model"
      data-vertex-count={nodes.length}
      data-edge-count={edges.length}
      data-height={analysis.height}
      data-leaves={analysis.leaves.join(",")}
      data-root={root}
      data-selected={selected}
      data-connected={analysis.connected}
      data-acyclic={analysis.acyclic}
      data-is-tree={analysis.isTree}
      data-prevent-cycles={preventCycles}
      data-positions={nodes
        .map((n) => `${n.id}:${Math.round(n.x)},${Math.round(n.y)}`)
        .join(";")}
      data-graded={graded === null ? "" : graded}
      data-actions={actions}
    >
      <header className="tr573-hero">
        <div>
          <small>DISCRETE AND APPLIED MATHEMATICS</small>
          <small>COMBINATORICS, GRAPH THEORY AND LOGIC</small>
          <h1>Trees – discrete lab</h1>
          <p>Explore acyclic networks.</p>
          <b>Learning objective</b>
          <p>
            Observe and construct trees; identify leaves and height; verify that
            a tree with n vertices has exactly n − 1 edges.
          </p>
        </div>
        <dl>
          <span>
            ▥ <b>Level</b>
            <small>Intermediate–Advanced</small>
          </span>
          <span>
            ◷ <b>Time</b>
            <small>6–10 min</small>
          </span>
          <span>
            ⚒ <b>Tools</b>
            <small>Discrete Math Lab</small>
          </span>
          <span>
            ♧ <b>Skills</b>
            <small>Trees, acyclicity, leaves, height</small>
          </span>
        </dl>
      </header>
      <nav className="tr573-tabs">
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
        <p className="tr573-tab-note">
          <b>{tab}</b> {tabCopy[tab]}
        </p>
      )}
      <section className="tr573-lab">
        <main>
          <header>
            <div>
              <h3>1. OBSERVE &amp; MANIPULATE</h3>
              <p>
                Build a tree. Click a node and choose “Add child” to grow the
                tree.
              </p>
            </div>
            <button onClick={() => act(reset)}>
              <RotateCcw />
              Reset
            </button>
            <button onClick={clear}>
              <Trash2 />
              Clear
            </button>
          </header>
          <svg
            className="tr573-tree"
            viewBox="0 0 580 370"
            role="img"
            aria-label="Interactive rooted tree"
            onPointerMove={move}
            onPointerUp={() => setDragging(null)}
            onPointerLeave={() => setDragging(null)}
          >
            {edges.map((e) => {
              const a = nodes.find((n) => n.id === e.a)!,
                b = nodes.find((n) => n.id === e.b)!;
              return a && b ? (
                <line
                  key={key(e.a, e.b)}
                  className={analysis.acyclic ? "" : "cycle"}
                  x1={a.x}
                  y1={a.y}
                  x2={b.x}
                  y2={b.y}
                />
              ) : null;
            })}
            {[0, 1, 2, 3].map((level) => (
              <g className="level" key={level}>
                <line
                  x1="405"
                  y1={45 + level * 90}
                  x2="555"
                  y2={45 + level * 90}
                />
                <text x="560" y={49 + level * 90}>
                  Level {level}
                </text>
              </g>
            ))}
            {nodes.map((n) => (
              <g
                key={n.id}
                data-testid={`tree-node-${n.id}`}
                className={`${n.id === root ? "root " : ""}${n.id === selected ? "selected" : ""}`}
                onPointerDown={(event) => {
                  setDragging(n.id);
                  event.currentTarget.setPointerCapture(event.pointerId);
                }}
                onClick={() => choose(n.id)}
              >
                <circle cx={n.x} cy={n.y} r="22" />
                <text x={n.x} y={n.y + 5}>
                  {n.id}
                </text>
              </g>
            ))}
          </svg>
          <div className="tr573-tools">
            <button onClick={add}>
              <Plus /> {action === "child" ? "Add child" : "Connect root"}
            </button>
            <select
              aria-label="Tree action"
              value={action}
              onChange={(e) => setAction(e.target.value as typeof action)}
            >
              <option value="child">New child</option>
              <option value="root-edge">Connect to root</option>
            </select>
            <button onClick={remove}>
              <Trash2 />
              Remove node
            </button>
            <button
              onClick={() =>
                act(() => {
                  setRoot(selected);
                  setMessage(`${selected} is now the root.`);
                })
              }
            >
              ⇆ Change root
            </button>
            <label>
              Prevent cycles
              <input
                aria-label="Prevent cycles"
                type="checkbox"
                checked={preventCycles}
                onChange={() => act(() => setPreventCycles((v) => !v))}
              />
            </label>
            <HelpCircle />
          </div>
          <p role="status">{message}</p>
        </main>
        <aside>
          <h3>TREE SUMMARY</h3>
          <dl>
            <span>
              Vertices (n)<b>{nodes.length}</b>
            </span>
            <span>
              Edges (e)<b>{edges.length}</b>
            </span>
            <span>
              n − 1
              <b>
                {Math.max(0, nodes.length - 1)}{" "}
                {edges.length === nodes.length - 1 && "✓"}
              </b>
            </span>
            <span>
              Leaves<b>{analysis.leaves.join(", ") || "–"}</b>
            </span>
            <span>
              Height<b>{analysis.height}</b>
            </span>
            <span>
              Root<b>{root}</b>
            </span>
          </dl>
          <output className={analysis.isTree ? "good" : "bad"}>
            <b>{analysis.isTree ? "Valid tree" : "Not a tree"}</b>
            <small>
              {analysis.connected ? "Connected" : "Disconnected"} and{" "}
              {analysis.acyclic ? "acyclic" : "cyclic"}.
            </small>
          </output>
          <output>
            <ShieldCheck />
            <b>Cycle prevention is {preventCycles ? "ON" : "OFF"}</b>
            <small>
              {preventCycles
                ? "Any edge that creates a cycle will be blocked."
                : "Cross-edges may create a cycle."}
            </small>
          </output>
        </aside>
      </section>
      <section className="tr573-middle">
        <article>
          <h3>2. NOTICE THE PATTERN</h3>
          <p>
            For a tree with n vertices, the number of edges is always n − 1.
          </p>
          <table>
            <thead>
              <tr>
                <th>n (vertices)</th>
                <th>e (edges)</th>
                <th>n − 1</th>
                <th>Match?</th>
              </tr>
            </thead>
            <tbody>
              {[2, 3, 4, 5, 6, 7, 8].map((n) => (
                <tr key={n}>
                  <td>{n}</td>
                  <td>{n - 1}</td>
                  <td>{n - 1}</td>
                  <td>✓</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p>Try adding or removing nodes to see the pattern hold.</p>
        </article>
        <article>
          <h3>3. WORKED EXAMPLE</h3>
          <p>
            Given the tree below, find n, e, leaves, height, and verify e = n −
            1.
          </p>
          <div>
            <StaticTree />
            <ul>
              <li>Vertices (n) = 6</li>
              <li>Edges (e) = 5</li>
              <li>Leaves = U, V, W</li>
              <li>Height = 2</li>
              <li>
                <b>n − 1 = 6 − 1 = 5 = e ✓</b>
              </li>
            </ul>
          </div>
        </article>
      </section>
      <section className="tr573-lower">
        <article>
          <h3>4. UNDERSTAND THE RULE</h3>
          <strong>
            <b>Key Rule (Tree Edge Rule)</b>If a graph is a tree with n (≥ 1)
            vertices, then it has exactly n − 1 edges.
          </strong>
          <h4>Definitions</h4>
          <ul>
            <li>
              <b>Tree:</b> a connected, acyclic graph.
            </li>
            <li>
              <b>Leaf:</b> a vertex with degree 1.
            </li>
            <li>
              <b>Height:</b> longest root-to-leaf edge count.
            </li>
          </ul>
          <aside>
            <b>Common Misconception</b>
            <p>
              A connected graph with n vertices and at least n edges must
              contain a cycle.
            </p>
          </aside>
        </article>
        <article>
          <h3>5. TRY INDEPENDENTLY</h3>
          <p>
            Build a tree with exactly {challenge.nodes.length} vertices, then
            answer the questions.
          </p>
          <div>
            <section>
              <h4>Challenge</h4>
              <p>
                Create your own tree with {challenge.nodes.length} vertices.
              </p>
              <ChallengeTree nodes={challenge.nodes} edges={challenge.edges} />
              <nav>
                <button onClick={check}>
                  <CheckCircle2 />
                  Check
                </button>
                <button
                  onClick={() =>
                    act(() => {
                      setAnswers({
                        n: String(challenge.nodes.length),
                        e: String(challenge.edges.length),
                        rule: String(challenge.nodes.length - 1),
                      });
                      setGraded(null);
                    })
                  }
                >
                  <RotateCcw />
                  Reset
                </button>
                <button
                  onClick={() =>
                    act(() => {
                      setRound((r) => r + 1);
                      const next =
                        challengeSets[(round + 1) % challengeSets.length];
                      setAnswers({
                        n: String(next.nodes.length),
                        e: String(next.edges.length),
                        rule: String(next.nodes.length - 1),
                      });
                      setGraded(null);
                    })
                  }
                >
                  New tree
                </button>
                <button onClick={() => act(() => setHint((v) => !v))}>
                  <Lightbulb />
                  Hint
                </button>
              </nav>
            </section>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                check();
              }}
            >
              <h4>Your answers</h4>
              {(
                [
                  ["n", "Vertices (n)"],
                  ["e", "Edges (e)"],
                  ["rule", "n − 1"],
                ] as const
              ).map(([id, label]) => (
                <label key={id}>
                  {label}
                  <input
                    aria-label={`Tree challenge ${id}`}
                    value={answers[id]}
                    onChange={(e) =>
                      setAnswers((a) => ({ ...a, [id]: e.target.value }))
                    }
                  />
                </label>
              ))}
              <output
                className={graded ? "good" : graded === false ? "bad" : ""}
              >
                <b>
                  {graded
                    ? "Correct!"
                    : graded === false
                      ? "Check the three counts."
                      : "Ready to check"}
                </b>
                <small>e = n − 1 {graded && "holds."}</small>
              </output>
              {hint && (
                <p>Count nodes first; every finite tree has one fewer edge.</p>
              )}
            </form>
          </div>
        </article>
      </section>
      <nav className="tr573-adjacent">
        <a href="/lessons/discrete-and-applied-mathematics/572-hamiltonian-paths-and-cycles">
          ←{" "}
          <span>
            Previous<b>Hamiltonian Paths and Cycles</b>
          </span>
        </a>
        <a href="/lessons/discrete-and-applied-mathematics/574-minimum-spanning-tree">
          <span>
            Next<b>Minimum Spanning Tree</b>
          </span>{" "}
          →
        </a>
      </nav>
    </section>
  );
}

function StaticTree() {
  const nodes = [
      { id: "R", x: 280, y: 35 },
      { id: "S", x: 140, y: 140 },
      { id: "T", x: 420, y: 140 },
      { id: "U", x: 50, y: 270 },
      { id: "V", x: 220, y: 270 },
      { id: "W", x: 490, y: 270 },
    ],
    edges = [
      { a: "R", b: "S" },
      { a: "R", b: "T" },
      { a: "S", b: "U" },
      { a: "S", b: "V" },
      { a: "T", b: "W" },
    ];
  return <ChallengeTree nodes={nodes} edges={edges} />;
}
function ChallengeTree({ nodes, edges }: { nodes: Node[]; edges: Edge[] }) {
  return (
    <svg
      className="tr573-small-tree"
      viewBox="0 0 560 320"
      role="img"
      aria-label="Tree example"
    >
      {edges.map((e) => {
        const a = nodes.find((n) => n.id === e.a)!,
          b = nodes.find((n) => n.id === e.b)!;
        return <line key={key(e.a, e.b)} x1={a.x} y1={a.y} x2={b.x} y2={b.y} />;
      })}
      {nodes.map((n) => (
        <g key={n.id}>
          <circle cx={n.x} cy={n.y} r="20" />
          <text x={n.x} y={n.y + 5}>
            {n.id}
          </text>
        </g>
      ))}
    </svg>
  );
}
