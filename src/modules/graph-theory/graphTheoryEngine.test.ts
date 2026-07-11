import { describe, expect, it } from "vitest";
import {
  clusteringCoefficients,
  graphDistanceMetrics,
  graphGirth,
  maxFlowMinCut,
  planarityObstructionHint,
  sampleGraph,
  type GraphProject,
} from "./graphTheoryEngine";

describe("graph theory advanced utilities", () => {
  it("computes radius, diameter, center, clustering, and girth for the sample graph", () => {
    const distance = graphDistanceMetrics(sampleGraph);
    const clustering = clusteringCoefficients(sampleGraph);

    expect(distance.radius).toBeGreaterThan(0);
    expect(distance.diameter).toBeGreaterThanOrEqual(distance.radius);
    expect(distance.center.length).toBeGreaterThan(0);
    expect(clustering.average).toBeGreaterThanOrEqual(0);
    expect(clustering.average).toBeLessThanOrEqual(1);
    expect(graphGirth(sampleGraph)).toBe(3);
  });

  it("finds max-flow value and cut for a small directed network", () => {
    const project: GraphProject = {
      directed: true,
      nodes: [
        { id: "S", label: "S", x: 0, y: 0 },
        { id: "A", label: "A", x: 0, y: 0 },
        { id: "B", label: "B", x: 0, y: 0 },
        { id: "T", label: "T", x: 0, y: 0 },
      ],
      edges: [
        { id: "S-A", source: "S", target: "A", weight: 3 },
        { id: "S-B", source: "S", target: "B", weight: 2 },
        { id: "A-B", source: "A", target: "B", weight: 1 },
        { id: "A-T", source: "A", target: "T", weight: 2 },
        { id: "B-T", source: "B", target: "T", weight: 3 },
      ],
    };

    const flow = maxFlowMinCut(project, "S", "T");

    expect(flow.value).toBe(5);
    expect(flow.augmentingPaths.length).toBeGreaterThan(0);
    expect(flow.cutEdges.length).toBeGreaterThan(0);
  });

  it("detects direct K5 and K3,3 planarity obstruction patterns", () => {
    const k5Nodes = ["A", "B", "C", "D", "E"].map((id) => ({ id, label: id, x: 0, y: 0 }));
    const k5Edges = k5Nodes.flatMap((source, sourceIndex) =>
      k5Nodes.slice(sourceIndex + 1).map((target) => ({ id: `${source.id}-${target.id}`, source: source.id, target: target.id, weight: 1 }))
    );

    expect(planarityObstructionHint({ directed: false, nodes: k5Nodes, edges: k5Edges }).obstruction).toBe("K5");

    const k33Nodes = ["A", "B", "C", "D", "E", "F"].map((id) => ({ id, label: id, x: 0, y: 0 }));
    const left = ["A", "B", "C"];
    const right = ["D", "E", "F"];
    const k33Edges = left.flatMap((source) => right.map((target) => ({ id: `${source}-${target}`, source, target, weight: 1 })));

    expect(planarityObstructionHint({ directed: false, nodes: k33Nodes, edges: k33Edges }).obstruction).toBe("K3,3");
  });
});
