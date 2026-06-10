import { describe, expect, it } from "vitest";
import { buildDynamicObjectGraph, extractDefinitionDependencies, graphHealthSummary } from "./dynamicObjectKernel";

describe("dynamic object kernel", () => {
  it("extracts formula dependencies without math built-ins", () => {
    expect(extractDefinitionDependencies("g(x)=f(x)+sin(x)+a")).toEqual(["f", "a"]);
  });

  it("orders dependencies before dependent objects and marks dirty chains", () => {
    const graph = buildDynamicObjectGraph([
      { id: "a", name: "a", kind: "slider", definition: "Slider[-5,5]" },
      { id: "f", name: "f", kind: "function", definition: "f(x)=a*x^2" },
      { id: "p", name: "P", kind: "point", definition: "P=(a, f(a))", dependencies: ["a", "f"] },
    ], ["a"]);

    expect(graph.order.indexOf("a")).toBeLessThan(graph.order.indexOf("f"));
    expect(graph.order.indexOf("f")).toBeLessThan(graph.order.indexOf("p"));
    expect(graph.dirty).toEqual(expect.arrayContaining(["a", "f", "P"]));
    expect(graphHealthSummary(graph).ready).toBe(true);
  });

  it("honors explicit empty dependencies for inspector-only object definitions", () => {
    const graph = buildDynamicObjectGraph([
      {
        id: "solid",
        name: "solid",
        kind: "solid",
        definition: "pos=(3, 0, 2.6), rot=(0, 0, 0), scale=1",
        dependencies: [],
      },
    ]);

    expect(graph.missingDependencies).toEqual([]);
    expect(graphHealthSummary(graph).ready).toBe(true);
  });

  it("detects circular and missing dependencies", () => {
    const graph = buildDynamicObjectGraph([
      { id: "a", name: "a", kind: "function", definition: "b+1" },
      { id: "b", name: "b", kind: "function", definition: "a+1" },
      { id: "c", name: "c", kind: "function", definition: "missing+1" },
    ]);

    expect(graph.cycles.flat()).toEqual(expect.arrayContaining(["a", "b"]));
    expect(graph.missingDependencies).toContainEqual({ object: "c", dependency: "missing" });
    expect(graphHealthSummary(graph).ready).toBe(false);
  });
});
