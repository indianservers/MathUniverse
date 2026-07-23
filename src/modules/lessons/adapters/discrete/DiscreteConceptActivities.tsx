import { useEffect, useMemo, useState } from "react";
import SliderControl from "../../../../components/ui/SliderControl";
import {
  combinations,
  factorial,
  inclusionExclusion,
  pascalRow,
  permutations,
  pigeonholeLoad,
} from "../../../../modules/combinatorics/combinatoricsEngine";
import {
  sampleGraph,
  type GraphProject,
} from "../../../../modules/graph-theory/graphTheoryEngine";
import { createLessonInteractionEvent } from "../../engine/lessonInteraction";
import { deriveDiscreteGraphResult } from "../../engine/discreteConceptModels";
import type { LessonAdapterProps } from "../../types";
import type { DiscreteLessonMode } from "../../presets/discreteLessonPresets";

type Props = Pick<LessonAdapterProps, "resetToken" | "onInteraction"> & {
  mode: DiscreteLessonMode;
};

export function CountingConceptActivity({
  mode,
  resetToken,
  onInteraction,
}: Props) {
  const [n, setN] = useState(5),
    [r, setR] = useState(2);
  useEffect(() => {
    setN(5);
    setR(2);
  }, [resetToken]);
  const value = count(mode, n, Math.min(r, n));
  const prompt = promptFor(mode, n, Math.min(r, n));
  const emit = (
    controlId: string,
    before: number,
    after: number,
    nextN: number,
    nextR: number,
  ) => {
    const next = count(mode, nextN, Math.min(nextR, nextN));
    onInteraction(
      createLessonInteractionEvent({
        controlId,
        kind: "slider",
        before,
        after: {
          value: after,
          challengePrompt: promptFor(mode, nextN, Math.min(nextR, nextN)),
          challengeExpected: String(next),
          challengeHint: "Use the displayed counting model.",
          challengeKind: "numeric",
        },
        affectedOutputs: ["discrete-result"],
      }),
    );
  };
  return (
    <div className="grid gap-3 xl:grid-cols-[minmax(0,1fr)_280px]">
      <div className="grid min-h-64 place-items-center rounded-xl bg-slate-950 p-5 text-white">
        <div className="text-center">
          <p className="text-xs font-black uppercase text-cyan-300">
            {mode.replaceAll("-", " ")}
          </p>
          <output className="mt-3 block break-all font-mono text-5xl font-black">
            {String(value)}
          </output>
          <p className="mt-3 text-sm text-slate-300">
            {formula(mode, n, Math.min(r, n))}
          </p>
        </div>
      </div>
      <div className="space-y-3">
        <SliderControl
          density="compact"
          label="n / objects"
          value={n}
          min={2}
          max={10}
          step={1}
          onChange={(v) => {
            setN(v);
            emit("primary-control", n, v, v, r);
          }}
        />
        <SliderControl
          density="compact"
          label="r / groups"
          value={Math.min(r, n)}
          min={1}
          max={n}
          step={1}
          onChange={(v) => {
            setR(v);
            emit("primary-control", r, v, n, v);
          }}
        />
        <p className="status-good">{prompt}</p>
      </div>
    </div>
  );
}

export function GraphConceptActivity({
  mode,
  resetToken,
  onInteraction,
}: Props) {
  const [graph, setGraph] = useState<GraphProject>(() =>
      initialDiscreteGraph(mode),
    ),
    [start, setStart] = useState("A"),
    [step, setStep] = useState(0);
  useEffect(() => {
    setGraph(initialDiscreteGraph(mode));
    setStart("A");
    setStep(0);
  }, [mode, resetToken]);
  const result = useMemo(
    () => deriveDiscreteGraphResult(mode, graph, start),
    [graph, mode, start],
  );
  const active =
    result.steps[Math.min(step, Math.max(0, result.steps.length - 1))];
  const emit = (
    controlId: string,
    before: unknown,
    nextGraph: GraphProject,
    nextStart = start,
  ) => {
    const next = deriveDiscreteGraphResult(mode, nextGraph, nextStart);
    onInteraction(
      createLessonInteractionEvent({
        controlId,
        kind: "selection",
        before,
        after: {
          challengePrompt: next.prompt,
          challengeExpected: next.expected,
          challengeHint: next.hint,
          challengeKind: Number.isFinite(Number(next.expected))
            ? "numeric"
            : "keywords",
          value: next.value,
        },
        affectedOutputs: ["discrete-result"],
      }),
    );
  };
  const toggleEdge = () => {
    const next = toggleDiscreteConceptGraph(mode, graph);
    setGraph(next);
    setStep(0);
    emit("primary-control", graph.edges.length, next);
  };
  const changeWeight = (value: number) => {
    const next = {
      ...graph,
      edges: graph.edges.map((edge, index) =>
        index === 0 ? { ...edge, weight: value } : edge,
      ),
    };
    setGraph(next);
    setStep(0);
    emit("primary-control", graph.edges[0]?.weight, next);
  };
  const editLabel = graphEditLabel(mode, graph);
  return (
    <div className="grid gap-3 xl:grid-cols-[minmax(0,1fr)_300px]">
      <div className="rounded-xl bg-slate-950 p-2">
        <svg
          viewBox="0 0 460 300"
          className="h-[280px] w-full"
          role="img"
          aria-label={`${result.label}: ${result.value}`}
        >
          {graph.edges.map((edge) => {
            const a = graph.nodes.find((node) => node.id === edge.source)!,
              b = graph.nodes.find((node) => node.id === edge.target)!,
              highlight =
                active?.activeEdges.includes(edge.id) ||
                result.highlightedEdges.includes(edge.id);
            return (
              <g key={edge.id}>
                <line
                  x1={a.x + 20}
                  y1={a.y + 10}
                  x2={b.x + 20}
                  y2={b.y + 10}
                  stroke={highlight ? "#f59e0b" : "#64748b"}
                  strokeWidth={highlight ? 6 : 3}
                />
                <text
                  x={(a.x + b.x) / 2 + 20}
                  y={(a.y + b.y) / 2 + 4}
                  fill="white"
                  fontSize="12"
                >
                  {edge.weight}
                </text>
              </g>
            );
          })}
          {graph.nodes.map((node) => (
            <g
              key={node.id}
              role="button"
              tabIndex={0}
              aria-label={`Select vertex ${node.id}`}
              onClick={() => {
                const before = start;
                setStart(node.id);
                setStep(0);
                emit("primary-control", before, graph, node.id);
              }}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  setStart(node.id);
                  setStep(0);
                  emit("primary-control", start, graph, node.id);
                }
              }}
              className="cursor-pointer outline-none focus-visible:[filter:drop-shadow(0_0_7px_#fbbf24)]"
            >
              <circle
                cx={node.x + 20}
                cy={node.y + 10}
                r="22"
                fill={node.id === start ? "#f59e0b" : "#0891b2"}
                stroke="white"
                strokeWidth="3"
              />
              <text
                x={node.x + 20}
                y={node.y + 15}
                textAnchor="middle"
                fill="white"
                fontWeight="900"
              >
                {node.id}
              </text>
            </g>
          ))}
        </svg>
      </div>
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            className="action-secondary justify-center"
            onClick={toggleEdge}
          >
            {editLabel}
          </button>
          <button
            type="button"
            className="action-secondary justify-center"
            disabled={!result.steps.length}
            onClick={() => {
              setStep(
                (value) => (value + 1) % Math.max(1, result.steps.length),
              );
              emit("primary-control", step, graph);
            }}
          >
            Step algorithm
          </button>
        </div>
        <SliderControl
          density="compact"
          label="First edge weight"
          value={graph.edges[0]?.weight ?? 1}
          min={1}
          max={9}
          step={1}
          onChange={changeWeight}
        />
        <p className="status-good">
          {result.label}: {result.value}
        </p>
        <p className="rounded-xl bg-slate-100 p-2 text-xs dark:bg-white/10">
          {active?.note ?? result.hint}
        </p>
      </div>
    </div>
  );
}

export function AdditionalDiscreteConceptActivity({
  mode,
  resetToken,
  onInteraction,
}: Props) {
  const [selected, setSelected] = useState([1, 3, 5]),
    [rightSize, setRightSize] = useState(2),
    [proof, setProof] = useState("direct");
  useEffect(() => {
    setSelected([1, 3, 5]);
    setRightSize(2);
    setProof("direct");
  }, [resetToken]);
  const universe = [1, 2, 3, 4, 5, 6],
    complement = universe.filter((value) => !selected.includes(value)),
    right = ["x", "y", "z"].slice(0, rightSize),
    pairs = selected.flatMap((a) => right.map((b) => `(${a},${b})`));
  const emit = (
    before: unknown,
    after: Record<string, unknown>,
    expected: string,
    prompt: string,
  ) =>
    onInteraction(
      createLessonInteractionEvent({
        controlId: "primary-control",
        kind: "selection",
        before,
        after: {
          ...after,
          challengePrompt: prompt,
          challengeExpected: expected,
          challengeHint: "Use the active set or proof representation.",
          challengeKind: Number.isFinite(Number(expected))
            ? "numeric"
            : "keywords",
        },
        affectedOutputs: ["discrete-result"],
      }),
    );
  if (mode === "proof")
    return (
      <div className="grid gap-3 xl:grid-cols-[minmax(0,1fr)_280px]">
        <div className="rounded-xl bg-slate-950 p-5 text-white">
          <p className="font-mono text-lg font-black">
            Claim: the sum of two even integers is even.
          </p>
          <ol className="mt-5 space-y-2 text-sm">
            <li className="rounded-lg bg-white/10 p-2">
              1. Let a=2m and b=2n.
            </li>
            <li className="rounded-lg bg-white/10 p-2">2. a+b=2m+2n=2(m+n).</li>
            <li className="rounded-lg bg-emerald-400/20 p-2">
              3. Therefore a+b is even.
            </li>
          </ol>
        </div>
        <div className="space-y-3">
          <label className="block text-xs font-black text-slate-500">
            Proof method
            <select
              className="lesson-input mt-1"
              value={proof}
              onChange={(event) => {
                const next = event.target.value;
                setProof(next);
                emit(
                  proof,
                  { proof: next },
                  next,
                  "Which proof method is selected?",
                );
              }}
            >
              <option value="direct">Direct proof</option>
              <option value="contradiction">Contradiction</option>
              <option value="induction">Induction</option>
            </select>
          </label>
          <p className="status-good">Selected method: {proof}</p>
        </div>
      </div>
    );
  const toggle = (value: number) => {
    const next = selected.includes(value)
      ? selected.filter((item) => item !== value)
      : [...selected, value].sort();
    setSelected(next);
    const output =
      mode === "complement"
        ? universe.filter((item) => !next.includes(item))
        : next.flatMap((a) => right.map((b) => `(${a},${b})`));
    emit(
      selected,
      { selected: next, result: output },
      String(output.length),
      mode === "complement"
        ? "How many elements are in Aᶜ?"
        : "How many ordered pairs are in A×B?",
    );
  };
  return (
    <div className="grid gap-3 xl:grid-cols-[minmax(0,1fr)_280px]">
      <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-900">
        <p className="font-mono text-lg font-black">
          {mode === "complement"
            ? `Aᶜ = {${complement.join(", ")}}`
            : `A×B = {${pairs.join(", ")}}`}
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {(mode === "complement" ? complement : pairs).map((item) => (
            <span
              key={String(item)}
              className="rounded-lg bg-cyan-100 px-3 py-2 font-mono text-sm text-cyan-950"
            >
              {item}
            </span>
          ))}
        </div>
      </div>
      <div className="space-y-3">
        <p className="text-xs font-black text-slate-500">Toggle members of A</p>
        <div className="grid grid-cols-3 gap-2">
          {universe.map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => toggle(value)}
              className={
                selected.includes(value)
                  ? "min-h-11 rounded-xl bg-cyan-500 font-black text-white"
                  : "min-h-11 rounded-xl bg-slate-100 font-black dark:bg-white/10"
              }
            >
              {value}
            </button>
          ))}
        </div>
        {mode === "cartesian-product" ? (
          <SliderControl
            density="compact"
            label="Size of B"
            value={rightSize}
            min={1}
            max={3}
            step={1}
            onChange={(value) => {
              const before = rightSize;
              setRightSize(value);
              const nextRight = ["x", "y", "z"].slice(0, value),
                nextPairs = selected.flatMap((a) =>
                  nextRight.map((b) => `(${a},${b})`),
                );
              emit(
                before,
                { rightSize: value, result: nextPairs },
                String(nextPairs.length),
                "How many ordered pairs are in A×B?",
              );
            }}
          />
        ) : null}
        <p className="status-good">
          Cardinality:{" "}
          {mode === "complement" ? complement.length : pairs.length}
        </p>
      </div>
    </div>
  );
}

function cloneGraph(): GraphProject {
  return {
    directed: sampleGraph.directed,
    nodes: sampleGraph.nodes.map((node) => ({ ...node })),
    edges: sampleGraph.edges.map((edge) => ({ ...edge })),
  };
}
export function initialDiscreteGraph(mode: DiscreteLessonMode): GraphProject {
  const graph = cloneGraph();
  if (["paths-cycles", "euler", "hamiltonian", "tsp"].includes(mode))
    return {
      ...graph,
      edges: [
        edge(graph, "A-B"),
        edge(graph, "B-C"),
        edge(graph, "C-E"),
        edge(graph, "D-E"),
        edge(graph, "A-D"),
      ],
    };
  if (mode === "tree")
    return {
      ...graph,
      edges: [
        edge(graph, "A-B"),
        edge(graph, "B-C"),
        edge(graph, "A-D"),
        edge(graph, "B-E"),
      ],
    };
  if (mode === "bipartite")
    return {
      ...graph,
      edges: [
        edge(graph, "A-B"),
        edge(graph, "A-D"),
        edge(graph, "B-C"),
        edge(graph, "D-E"),
      ],
    };
  return graph;
}
export function toggleDiscreteConceptGraph(
  mode: DiscreteLessonMode,
  graph: GraphProject,
): GraphProject {
  if (mode === "components") {
    const isolated = graph.edges.every(
      (item) => item.source !== "E" && item.target !== "E",
    );
    return {
      ...graph,
      edges: isolated
        ? cloneGraph().edges
        : graph.edges.filter(
            (item) => item.source !== "E" && item.target !== "E",
          ),
    };
  }
  if (mode === "planar") {
    return graph.edges.length === 10
      ? cloneGraph()
      : { ...graph, edges: completeEdges(graph) };
  }
  if (mode === "hamiltonian" || mode === "tsp") {
    const exists = graph.edges.some((item) => item.id === "A-B");
    return {
      ...graph,
      edges: exists
        ? graph.edges.filter((item) => item.id !== "A-B")
        : [...graph.edges, edge(cloneGraph(), "A-B")],
    };
  }
  const exists = graph.edges.some((item) => item.id === "ae");
  return {
    ...graph,
    edges: exists
      ? graph.edges.filter((item) => item.id !== "ae")
      : [
          ...graph.edges,
          {
            id: "ae",
            source: "A",
            target: "E",
            weight: mode === "mst" ? 0 : 3,
            directed: mode === "directed" || mode === "flow",
          },
        ],
  };
}
function graphEditLabel(mode: DiscreteLessonMode, graph: GraphProject) {
  if (mode === "components")
    return graph.edges.some((edge) => edge.source === "E" || edge.target === "E")
      ? "Isolate E"
      : "Reconnect E";
  if (mode === "planar")
    return graph.edges.length === 10 ? "Reset graph" : "Build K5";
  if (mode === "hamiltonian" || mode === "tsp")
    return graph.edges.some((edge) => edge.id === "A-B")
      ? "Remove A–B"
      : "Restore A–B";
  return graph.edges.some((edge) => edge.id === "ae")
    ? "Remove A–E"
    : "Add A–E";
}
function edge(graph: GraphProject, id: string) {
  return { ...graph.edges.find((item) => item.id === id)! };
}
function completeEdges(graph: GraphProject) {
  const result: GraphProject["edges"] = [];
  for (let left = 0; left < graph.nodes.length; left += 1)
    for (let right = left + 1; right < graph.nodes.length; right += 1)
      result.push({
        id: `${graph.nodes[left].id}-${graph.nodes[right].id}`,
        source: graph.nodes[left].id,
        target: graph.nodes[right].id,
        weight: 1,
      });
  return result;
}
function count(mode: DiscreteLessonMode, n: number, r: number) {
  if (mode === "product") return BigInt(n * r);
  if (mode === "factorial") return factorial(n);
  if (mode === "permutation") return permutations(n, r);
  if (mode === "repeated-permutation") return permutations(n, r, true);
  if (mode === "circular-permutation") return factorial(n - 1);
  if (mode === "combination") return combinations(n, r);
  if (mode === "pascal")
    return pascalRow(n).reduce((sum, value) => sum + value, 0n);
  if (mode === "inclusion-exclusion")
    return BigInt(
      inclusionExclusion(n + r, n, r, Math.min(n, r), 0, 0, 0).union,
    );
  return BigInt(pigeonholeLoad(n, r));
}
function formula(mode: DiscreteLessonMode, n: number, r: number) {
  if (mode === "product") return `${n} stages × ${r} choices`;
  if (mode === "factorial") return `${n}!`;
  if (mode === "permutation") return `P(${n},${r})`;
  if (mode === "repeated-permutation") return `${n}^${r}`;
  if (mode === "circular-permutation") return `(${n}−1)!`;
  if (mode === "combination") return `C(${n},${r})`;
  if (mode === "pascal") return `sum of Pascal row ${n}`;
  if (mode === "inclusion-exclusion") return "|A∪B∪C|";
  return `ceil(${n}/${r})`;
}
function promptFor(mode: DiscreteLessonMode, n: number, r: number) {
  return `For this ${mode.replaceAll("-", " ")} model with n=${n} and r=${r}, what count is shown?`;
}
