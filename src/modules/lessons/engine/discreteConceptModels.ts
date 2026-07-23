import { adjacencyMatrix, connectedComponents, degreeMap, dijkstra, eulerCircuitPath, graphGirth, hamiltonianCycle, isBipartite, kruskal, maxFlowMinCut, planarityObstructionHint, type AlgorithmStep, type GraphProject } from "../../../modules/graph-theory/graphTheoryEngine";
import type { DiscreteLessonMode } from "../presets/discreteLessonPresets";

export type DiscreteGraphResult = {
  label: string;
  value: string;
  prompt: string;
  expected: string;
  hint: string;
  steps: AlgorithmStep[];
  highlightedEdges: string[];
};

export function deriveDiscreteGraphResult(mode: DiscreteLessonMode, graph: GraphProject, start: string): DiscreteGraphResult {
  const target = graph.nodes.at(-1)?.id ?? start;
  const degrees = degreeMap(graph);
  const base = (label: string, value: string, prompt: string, expected = value, hint = "Read the current graph summary.", steps: AlgorithmStep[] = [], highlightedEdges: string[] = []): DiscreteGraphResult => ({ label, value, prompt, expected, hint, steps, highlightedEdges });
  if (mode === "graph-builder") return base("Graph size", `${graph.nodes.length} vertices, ${graph.edges.length} edges`, "How many edges are currently in the graph?", String(graph.edges.length), "Count the visible edges.");
  if (mode === "directed") {
    const directed = graph.edges.filter((edge) => edge.directed || graph.directed).length;
    return base("Directed edges", String(directed), "How many edges are currently directed?", String(directed));
  }
  if (mode === "weighted") {
    const total = graph.edges.reduce((sum, edge) => sum + edge.weight, 0);
    return base("Total edge weight", String(total), "What is the total of the displayed edge weights?", String(total), "Add the edge labels.");
  }
  if (mode === "degree") {
    const degree = degrees.get(start) ?? 0;
    return base(`Degree of ${start}`, String(degree), `What is the degree of vertex ${start}?`, String(degree), "Count edges incident to the selected vertex.");
  }
  if (mode === "paths-cycles") {
    const girth = graphGirth(graph);
    return base("Shortest cycle", girth === null ? "none" : String(girth), "What is the length of the shortest cycle?", girth === null ? "none" : String(girth), "Follow the smallest closed path.");
  }
  if (mode === "components") {
    const count = connectedComponents(graph).length;
    return base("Connected components", String(count), "How many connected components are visible?", String(count));
  }
  if (mode === "euler") {
    const result = eulerCircuitPath(graph);
    return base("Euler circuit", result.exists ? "exists" : "does not exist", "Does the current graph have an Euler circuit?", result.exists ? "exists" : "does not exist", "Check connectivity and whether every degree is even.", result.steps);
  }
  if (mode === "hamiltonian" || mode === "tsp") {
    const result = hamiltonianCycle(graph);
    return base("Hamiltonian cycle", result.exists ? result.path.join(" → ") : "none", "Does the current graph contain a Hamiltonian cycle?", result.exists ? "yes" : "no", "A Hamiltonian cycle visits every vertex exactly once and returns.", [], pathEdges(graph, result.path));
  }
  if (mode === "tree") {
    const isTree = connectedComponents(graph).length === 1 && graph.edges.length === graph.nodes.length - 1;
    return base("Tree test", isTree ? "tree" : "not a tree", "Is the current graph a tree?", isTree ? "yes" : "no", "A tree is connected and has |V|−1 edges.");
  }
  if (mode === "mst") {
    const result = kruskal(graph);
    const weight = graph.edges.filter((edge) => result.tree.includes(edge.id)).reduce((sum, edge) => sum + edge.weight, 0);
    return base("Minimum spanning-tree weight", String(weight), "What is the current minimum spanning-tree weight?", String(weight), "Add the highlighted chosen edge weights.", result.steps, result.tree);
  }
  if (mode === "shortest-path") {
    const result = dijkstra(graph, start);
    const distance = result.dist[target];
    return base(`Distance ${start} → ${target}`, Number.isFinite(distance) ? String(distance) : "unreachable", `What is the shortest distance from ${start} to ${target}?`, Number.isFinite(distance) ? String(distance) : "unreachable", "Use the settled distance labels.", result.steps);
  }
  if (mode === "bipartite") {
    const result = isBipartite(graph);
    return base("Bipartite test", result.bipartite ? "bipartite" : "not bipartite", "Is the current graph bipartite?", result.bipartite ? "yes" : "no", "Try separating vertices into two sets with no internal edge.");
  }
  if (mode === "planar") {
    const result = planarityObstructionHint(graph);
    return base("Planarity obstruction", result.obstruction, "Which obstruction is currently detected?", result.obstruction, result.note);
  }
  if (mode === "flow") {
    const result = maxFlowMinCut({ ...graph, directed: true }, start, target);
    return base("Maximum flow", String(result.value), `What is the maximum flow from ${start} to ${target}?`, String(result.value), "Sum the augmenting-path bottlenecks.", result.augmentingPaths.map((path) => ({ label: "Augment flow", activeNodes: path.path, activeEdges: pathEdges(graph, path.path), note: `Add bottleneck ${path.bottleneck}.` })), result.cutEdges);
  }
  if (mode === "adjacency") {
    const matrix = adjacencyMatrix(graph);
    const ones = matrix.matrix.flat().filter((value: number) => value !== 0).length;
    return base("Non-zero adjacency entries", String(ones), "How many non-zero entries are in the adjacency matrix?", String(ones), "Count the marked matrix cells.");
  }
  return base("Graph state", `${graph.nodes.length}/${graph.edges.length}`, "How many edges are shown?", String(graph.edges.length));
}

function pathEdges(graph: GraphProject, path: string[]) {
  return path.slice(1).flatMap((to, index) => graph.edges.find((edge) => (edge.source === path[index] && edge.target === to) || (!graph.directed && edge.source === to && edge.target === path[index]))?.id ?? []);
}
