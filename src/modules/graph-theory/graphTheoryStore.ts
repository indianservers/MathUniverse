import { create } from "zustand";
import { persist } from "zustand/middleware";
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
        const id = String.fromCharCode(65 + state.nodes.length);
        return { nodes: [...state.nodes, { id, label: id, x: 100 + state.nodes.length * 35, y: 120 }] };
      }),
      addEdge: (source, target) => set((state) => ({
        edges: [...state.edges, { id: `${source}-${target}-${Date.now()}`, source, target, weight: 1, directed: state.directed }],
      })),
      setDirected: (directed) => set({ directed }),
      setSelectedAlgorithm: (selectedAlgorithm) => set({ selectedAlgorithm, stepIndex: 0 }),
      setStepIndex: (stepIndex) => set({ stepIndex }),
      setChallengeMode: (challengeMode) => set({ challengeMode }),
      loadProject: (project) => set({ ...project, stepIndex: 0 }),
    }),
    { name: "math-universe-graph-theory-project" }
  )
);
