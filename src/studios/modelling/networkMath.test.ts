import { describe, expect, it } from "vitest";
import { sampleGraph } from "../../modules/graph-theory/graphTheoryEngine";
import { shortestRoute, trafficGraph } from "./networkMath";

describe("modelling network math", () => {
  it("uses Graph Theory Dijkstra on the city graph", () => {
    const route = shortestRoute(sampleGraph, "A", "E");
    expect(route.path[0]).toBe("A");
    expect(route.path.at(-1)).toBe("E");
    expect(route.dist).toBe(4);
  });

  it("drops a road when closures are high", () => {
    const open = trafficGraph(0, 0);
    const closed = trafficGraph(0, 0.4);
    expect(closed.edges.length).toBeLessThan(open.edges.length);
  });
});
