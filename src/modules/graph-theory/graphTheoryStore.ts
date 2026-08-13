import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { sampleGraph, type GraphEdge, type GraphNode, type GraphProject } from "./graphTheoryEngine";

export type GraphAlgorithmName = "BFS" | "DFS" | "Dijkstra" | "Kruskal" | "Prim" | "Topological Sort";

type GraphTheoryState = GraphProject & {
  selectedAlgorithm: GraphAlgorithmName;
  stepIndex: number;
  challengeMode: boolean;
  setNodes: (nodes: GraphNode[]) => void;
  setEdges: (edges: GraphEdge[]) => void;
  addNode: () => void;
  addEdge: (source: string, target: string) => void;
  setDirected: (directed: boolean) => void;
  setSelectedAlgorithm: (algorithm: GraphTheoryState["selectedAlgorithm"]) => void;
  setStepIndex: (step: number) => void;
  setChallengeMode: (enabled: boolean) => void;
  loadProject: (project: GraphProject) => void;
  resetProject: () => void;
};

export const useGraphTheoryStore = create<GraphTheoryState>()(
  persist(
    (set) => ({
      ...sampleGraph,
      selectedAlgorithm: "BFS",
      stepIndex: 0,
      challengeMode: false,
      setNodes: (nodes) => set({ nodes }),
      setEdges: (edges) => set({ edges }),
      addNode: () => set((state) => {
        const existing = new Set(state.nodes.map((node) => node.id));
        const index = nextNodeIndex(existing);
        const id = `node-${index + 1}`;
        const label = spreadsheetLabel(index);
        const offset = state.nodes.length;
        return { nodes: [...state.nodes, { id, label, x: 120 + (offset % 10) * 48, y: 110 + Math.floor(offset / 10) * 42 }] };
      }),
      addEdge: (source, target) => set((state) => ({
        edges: [...state.edges, { id: `${source}-${target}-${Date.now()}`, source, target, weight: 1, directed: state.directed }],
      })),
      setDirected: (directed) => set({ directed }),
      setSelectedAlgorithm: (selectedAlgorithm) => set({ selectedAlgorithm, stepIndex: 0 }),
      setStepIndex: (stepIndex) => set({ stepIndex }),
      setChallengeMode: (challengeMode) => set({ challengeMode }),
      loadProject: (project) => set({ ...project, stepIndex: 0 }),
      resetProject: () => set({ ...sampleGraph, stepIndex: 0 }),
    }),
    { name: "math-universe-graph-theory-project", storage: createJSONStorage(() => localStorage) }
  )
);

function nextNodeIndex(existing: Set<string>) {
  let index = 0;
  while (existing.has(`node-${index + 1}`) || existing.has(spreadsheetLabel(index))) index += 1;
  return index;
}

function spreadsheetLabel(index: number) {
  let value = index + 1;
  let label = "";
  while (value > 0) {
    value -= 1;
    label = String.fromCharCode(65 + (value % 26)) + label;
    value = Math.floor(value / 26);
  }
  return label;
}
