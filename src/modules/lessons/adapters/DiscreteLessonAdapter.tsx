import AdapterFrame from "../components/AdapterFrame";
import type { LessonAdapterProps } from "../types";
import {
  discreteLessonPreset,
  type DiscreteLessonMode,
} from "../presets/discreteLessonPresets";
import {
  AdditionalDiscreteConceptActivity,
  CountingConceptActivity,
  GraphConceptActivity,
} from "./discrete/DiscreteConceptActivities";
import {
  GraphColouringActivity,
  LogicalConnectivesActivity,
  PowerSetActivity,
  QuantifiersActivity,
  SetBuilderActivity,
  SetOperationsActivity,
  TruthTableActivity,
} from "./discrete/DiscreteP0Activities";
import FundamentalCountingTargetLesson556 from "./discrete/FundamentalCountingTargetLesson556";
import FactorialsTargetLesson557 from "./discrete/FactorialsTargetLesson557";
import PermutationsTargetLesson558 from "./discrete/PermutationsTargetLesson558";
import RepeatedPermutationsTargetLesson559 from "./discrete/RepeatedPermutationsTargetLesson559";
import CircularPermutationsTargetLesson560 from "./discrete/CircularPermutationsTargetLesson560";
import CombinationsTargetLesson561 from "./discrete/CombinationsTargetLesson561";
import PascalTriangleTargetLesson562 from "./discrete/PascalTriangleTargetLesson562";
import InclusionExclusionTargetLesson563 from "./discrete/InclusionExclusionTargetLesson563";
import PigeonholeTargetLesson564 from "./discrete/PigeonholeTargetLesson564";
import VertexEdgeBuilderTargetLesson565 from "./discrete/VertexEdgeBuilderTargetLesson565";
import DirectedGraphsTargetLesson566 from "./discrete/DirectedGraphsTargetLesson566";
import WeightedGraphsTargetLesson567 from "./discrete/WeightedGraphsTargetLesson567";
import VertexDegreeTargetLesson568 from "./discrete/VertexDegreeTargetLesson568";
import PathsCyclesTargetLesson569 from "./discrete/PathsCyclesTargetLesson569";
import ConnectedComponentsTargetLesson570 from "./discrete/ConnectedComponentsTargetLesson570";
import EulerPathsTargetLesson571 from "./discrete/EulerPathsTargetLesson571";
import HamiltonianPathsTargetLesson572 from "./discrete/HamiltonianPathsTargetLesson572";
import TreesTargetLesson573 from "./discrete/TreesTargetLesson573";
import MinimumSpanningTreeTargetLesson574 from "./discrete/MinimumSpanningTreeTargetLesson574";
import ShortestPathTargetLesson575 from "./discrete/ShortestPathTargetLesson575";
import GraphColouringTargetLesson576 from "./discrete/GraphColouringTargetLesson576";
import BipartiteGraphsTargetLesson577 from "./discrete/BipartiteGraphsTargetLesson577";
import PlanarGraphsTargetLesson578 from "./discrete/PlanarGraphsTargetLesson578";
import NetworkFlowTargetLesson579 from "./discrete/NetworkFlowTargetLesson579";
import TravellingSalespersonTargetLesson580 from "./discrete/TravellingSalespersonTargetLesson580";
import AdjacencyMatrixTargetLesson581 from "./discrete/AdjacencyMatrixTargetLesson581";
import SetBuilderTargetLesson582 from "./discrete/SetBuilderTargetLesson582";
import SetOperationsTargetLesson583 from "./discrete/SetOperationsTargetLesson583";
import ComplementTargetLesson584 from "./discrete/ComplementTargetLesson584";
import CartesianProductTargetLesson585 from "./discrete/CartesianProductTargetLesson585";
import PowerSetsTargetLesson586 from "./discrete/PowerSetsTargetLesson586";

const countingModes = new Set<DiscreteLessonMode>([
  "product",
  "factorial",
  "permutation",
  "repeated-permutation",
  "circular-permutation",
  "combination",
  "pascal",
  "inclusion-exclusion",
  "pigeonhole",
]);
const graphModes = new Set<DiscreteLessonMode>([
  "graph-builder",
  "directed",
  "weighted",
  "degree",
  "paths-cycles",
  "components",
  "euler",
  "hamiltonian",
  "tree",
  "mst",
  "shortest-path",
  "bipartite",
  "planar",
  "flow",
  "tsp",
  "adjacency",
]);

function discreteGuidanceFor(mode: DiscreteLessonMode) {
  const guidance: Record<string, [string, string, string]> = {
    product: [
      "Fundamental Counting Principle",
      "Multiply choices across completed stages.",
      "Do not add stage counts.",
    ],
    factorial: [
      "Factorials",
      "n! counts arrangements of n distinct objects.",
      "Remember that 0! equals 1.",
    ],
    permutation: [
      "Permutations",
      "Use permutations when order matters.",
      "AB and BA are different.",
    ],
    "repeated-permutation": [
      "Permutations with Repetition",
      "Keep choices available again when repeats are allowed.",
      "Do not decrease choices.",
    ],
    "circular-permutation": [
      "Circular Permutations",
      "Fix one object to remove repeated rotations.",
      "Rotated seating orders are the same.",
    ],
    combination: [
      "Combinations",
      "Use combinations when order does not matter.",
      "The group is what matters.",
    ],
    pascal: [
      "Pascal's Triangle",
      "Each inside entry is the sum of the two above.",
      "Rows give binomial coefficients.",
    ],
    "inclusion-exclusion": [
      "Inclusion-Exclusion",
      "Subtract the overlap once.",
      "This prevents double-counting.",
    ],
    pigeonhole: [
      "Pigeonhole Principle",
      "More objects than boxes forces sharing.",
      "Compare objects with boxes.",
    ],
    "graph-builder": [
      "Vertex and Edge Builder",
      "Vertices are points; edges are connections.",
      "Build only the intended relationships.",
    ],
    directed: [
      "Directed Graphs",
      "Follow arrow direction.",
      "One-way relationships need directed edges.",
    ],
    weighted: [
      "Weighted Graphs",
      "Read edge weights before comparing paths.",
      "Fewest edges may not be cheapest.",
    ],
    degree: [
      "Degree of a Vertex",
      "Count incident edges.",
      "Loops need special care.",
    ],
    "paths-cycles": [
      "Paths and Cycles",
      "Each consecutive vertex pair needs an edge.",
      "Cycles return to the start.",
    ],
    components: [
      "Connected Components",
      "A path can connect vertices indirectly.",
      "Components are separate connected pieces.",
    ],
    euler: [
      "Euler Paths and Circuits",
      "Use every edge exactly once.",
      "Euler is about edges.",
    ],
    hamiltonian: [
      "Hamiltonian Paths and Cycles",
      "Visit every vertex exactly once.",
      "Hamiltonian is about vertices.",
    ],
    tree: [
      "Trees",
      "A tree is connected with no cycles.",
      "Finite trees have edges = vertices - 1.",
    ],
    mst: [
      "Minimum Spanning Tree",
      "Connect all vertices with minimum total weight.",
      "Avoid cycles.",
    ],
    "shortest-path": [
      "Shortest Path",
      "Minimise total weight between chosen vertices.",
      "Do not choose only by edge count.",
    ],
    bipartite: [
      "Bipartite Graphs",
      "Split vertices into two groups.",
      "Edges only cross between groups.",
    ],
    planar: [
      "Planar Graphs",
      "Look for any drawing without crossings.",
      "One crossed drawing is not enough.",
    ],
    flow: [
      "Network Flow",
      "Respect capacities and conserve flow.",
      "Flow cannot exceed edge capacity.",
    ],
    tsp: [
      "Travelling Salesperson",
      "Visit each city once and return to start.",
      "It is a shortest tour problem.",
    ],
    adjacency: [
      "Adjacency Matrix",
      "Use row and column vertex labels.",
      "The matrix is square.",
    ],
    complement: [
      "Complement",
      "Start with the universal set.",
      "The complement depends on the universe.",
    ],
    "cartesian-product": [
      "Cartesian Product",
      "Pair every element of A with every element of B.",
      "Cartesian products use ordered pairs.",
    ],
    proof: [
      "Proof Methods",
      "Choose direct proof, contradiction, contrapositive, or induction to match the statement.",
      "One example is not a proof for every case.",
    ],
  };
  return (
    guidance[mode] ?? [
      "Discrete Mathematics",
      "Use the exact finite structure.",
      "Check order, repetition, overlap, and connections.",
    ]
  );
}

export default function DiscreteLessonAdapter(props: LessonAdapterProps) {
  if (props.lesson.id === 556)
    return <FundamentalCountingTargetLesson556 {...props} />;
  if (props.lesson.id === 557) return <FactorialsTargetLesson557 {...props} />;
  if (props.lesson.id === 558)
    return <PermutationsTargetLesson558 {...props} />;
  if (props.lesson.id === 559)
    return <RepeatedPermutationsTargetLesson559 {...props} />;
  if (props.lesson.id === 560)
    return <CircularPermutationsTargetLesson560 {...props} />;
  if (props.lesson.id === 561)
    return <CombinationsTargetLesson561 {...props} />;
  if (props.lesson.id === 562)
    return <PascalTriangleTargetLesson562 {...props} />;
  if (props.lesson.id === 563)
    return <InclusionExclusionTargetLesson563 {...props} />;
  if (props.lesson.id === 564) return <PigeonholeTargetLesson564 {...props} />;
  if (props.lesson.id === 565)
    return <VertexEdgeBuilderTargetLesson565 {...props} />;
  if (props.lesson.id === 566)
    return <DirectedGraphsTargetLesson566 {...props} />;
  if (props.lesson.id === 567)
    return <WeightedGraphsTargetLesson567 {...props} />;
  if (props.lesson.id === 568)
    return <VertexDegreeTargetLesson568 {...props} />;
  if (props.lesson.id === 569) return <PathsCyclesTargetLesson569 {...props} />;
  if (props.lesson.id === 570)
    return <ConnectedComponentsTargetLesson570 {...props} />;
  if (props.lesson.id === 571) return <EulerPathsTargetLesson571 {...props} />;
  if (props.lesson.id === 572)
    return <HamiltonianPathsTargetLesson572 {...props} />;
  if (props.lesson.id === 573) return <TreesTargetLesson573 {...props} />;
  if (props.lesson.id === 574)
    return <MinimumSpanningTreeTargetLesson574 {...props} />;
  if (props.lesson.id === 575)
    return <ShortestPathTargetLesson575 {...props} />;
  if (props.lesson.id === 576)
    return <GraphColouringTargetLesson576 {...props} />;
  if (props.lesson.id === 577)
    return <BipartiteGraphsTargetLesson577 {...props} />;
  if (props.lesson.id === 578)
    return <PlanarGraphsTargetLesson578 {...props} />;
  if (props.lesson.id === 579) return <NetworkFlowTargetLesson579 {...props} />;
  if (props.lesson.id === 580)
    return <TravellingSalespersonTargetLesson580 {...props} />;
  if (props.lesson.id === 581)
    return <AdjacencyMatrixTargetLesson581 {...props} />;
  if (props.lesson.id === 582) return <SetBuilderTargetLesson582 {...props} />;
  if (props.lesson.id === 583)
    return <SetOperationsTargetLesson583 {...props} />;
  if (props.lesson.id === 584) return <ComplementTargetLesson584 {...props} />;
  if (props.lesson.id === 585)
    return <CartesianProductTargetLesson585 {...props} />;
  if (props.lesson.id === 586) return <PowerSetsTargetLesson586 {...props} />;
  const mode = discreteLessonPreset(props.lesson.id).mode;
  const guidance = discreteGuidanceFor(mode);
  let activity = specialActivity(props.lesson.preset.id, props);
  if (!activity && countingModes.has(mode))
    activity = <CountingConceptActivity mode={mode} {...props} />;
  if (!activity && graphModes.has(mode))
    activity = <GraphConceptActivity mode={mode} {...props} />;
  if (
    !activity &&
    (
      ["complement", "cartesian-product", "proof"] as DiscreteLessonMode[]
    ).includes(mode)
  )
    activity = <AdditionalDiscreteConceptActivity mode={mode} {...props} />;
  if (!activity)
    throw new Error(`Unsupported discrete preset ${props.lesson.preset.id}`);
  return (
    <AdapterFrame
      title={`${props.lesson.title} - discrete lab`}
      footer="The visible controls, derived state, algorithm steps, and challenge use this lesson's explicit discrete preset."
    >
      <div className="mb-3 rounded-xl bg-slate-100 p-3 text-sm font-semibold text-slate-700 dark:bg-white/10 dark:text-slate-100">
        <p>{guidance[0]}</p>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-300">
          {guidance[1]}
        </p>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-300">
          {guidance[2]}
        </p>
      </div>
      {activity}
    </AdapterFrame>
  );
}

function specialActivity(
  id: string,
  props: Pick<LessonAdapterProps, "resetToken" | "onInteraction">,
) {
  if (id === "discrete.graph-colouring")
    return <GraphColouringActivity {...props} />;
  if (id === "discrete.set-builder") return <SetBuilderActivity {...props} />;
  if (id === "discrete.set-operations")
    return <SetOperationsActivity {...props} />;
  if (id === "discrete.power-set") return <PowerSetActivity {...props} />;
  if (id === "discrete.truth-table") return <TruthTableActivity {...props} />;
  if (id === "discrete.logical-connectives")
    return <LogicalConnectivesActivity {...props} />;
  if (id === "discrete.quantifiers") return <QuantifiersActivity {...props} />;
  return null;
}
