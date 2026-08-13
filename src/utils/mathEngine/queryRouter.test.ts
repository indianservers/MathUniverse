import { describe, expect, it } from "vitest";
import { routeQuery } from "./queryRouter";

describe("Math Lab smart engine routing", () => {
  it.each([
    ["plot sin(x)", "plot", "/workspace/graph"],
    ["solve x^2 - 4 = 0", "solve", "/problem-solver"],
    ["differentiate x^3", "differentiate", "/problem-solver"],
    ["area under the curve x^2", "integrate", "/problem-solver"],
    ["area of a circle radius 5", "geometry", "/workspace/geometry"],
    ["3D surface z = sin(x*y)", "threeD", "/workspace/3d"],
    ["truth table for p and q", "logic", "/mathematical-logic"],
    ["mean of 2, 4, 8", "statistics", "/probability-statistics"],
    ["determinant of a matrix", "matrix", "/matrices"],
    ["convert 5 kilometres to metres", "units", "/unit-converter"],
    ["Dijkstra shortest path", "graphTheory", "/graph-theory"],
  ] as const)("routes %s to its respective engine", (query, intent, route) => {
    const result = routeQuery(query);
    expect(result.intent).toBe(intent);
    expect(result.route).toBe(route);
    expect(result.route).not.toMatch(/math-lab\/(equation-solver|geometry)$/);
  });

  it("keeps the original query for a prefilled destination", () => {
    const result = routeQuery("factor x^2 - 9");
    expect(result.originalQuery).toBe("factor x^2 - 9");
    expect(result.expression).toBe("x^2 - 9");
    expect(result.operation).toBe("factor");
  });
});
