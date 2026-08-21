import { describe, expect, it, vi } from "vitest";
import { MathDependencyGraph } from "./dependencyGraph";

describe("reactive mathematical dependency graph", () => {
  it("recomputes dependents in order and supports undo/redo", () => {
    const graph = new MathDependencyGraph(); graph.define("a=2", "a-id"); graph.define("b=a+3", "b-id"); graph.define("f(x)=x^2+b", "f-id");
    expect(graph.evaluateExpression("f(a)").exactForm).toBe("9");
    graph.define("a=4"); expect(graph.evaluateExpression("f(a)").exactForm).toBe("23");
    expect(graph.undo()).toBe(true); expect(graph.evaluateExpression("f(a)").exactForm).toBe("9");
    expect(graph.redo()).toBe(true); expect(graph.evaluateExpression("f(a)").exactForm).toBe("23");
  });
  it("detects cycles deterministically", () => { const graph = new MathDependencyGraph(); graph.define("a=b+1", "a"); graph.define("b=a-1", "b"); expect(graph.getSnapshot().diagnostics).toMatchObject([{ code: "CIRCULAR_DEPENDENCY", details: { nodeIds: ["a", "b"] } }]); });
  it("batches edits and publishes changes", () => { const graph = new MathDependencyGraph(); const listener = vi.fn(); graph.subscribe(listener); graph.beginTransaction(); graph.define("x=2"); graph.define("y=x^2"); graph.commitTransaction(); expect(graph.evaluateExpression("y").exactForm).toBe("4"); expect(graph.undo()).toBe(true); expect(graph.getSnapshot().records).toHaveLength(0); expect(listener).toHaveBeenCalled(); });
});
