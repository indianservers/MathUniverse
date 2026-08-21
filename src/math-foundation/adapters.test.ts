import { describe, expect, it } from "vitest";
import { adaptFunctionTable, adaptGeometryPoint, adaptGraph2d, adaptGraph3d } from "./adapters";
import { MathDependencyGraph } from "./dependencyGraph";

describe("universal module adapters", () => {
  it("feeds result, graph, table, and geometry from one graph", () => { const graph = new MathDependencyGraph(); graph.define("a=2", "a"); graph.define("b=a+3", "b"); graph.define("f(x)=x^2+b", "f"); graph.define("P=(a,f(a))", "p"); expect(adaptGraph2d(graph, "f").status).toBe("SUPPORTED"); expect(adaptFunctionTable(graph, "f").data?.rows.find((row) => row.input === 2)?.exact).toBe("9"); expect(adaptGeometryPoint(graph, "p").data).toMatchObject({ x: 2, y: 9 }); graph.define("a=3"); expect(adaptGeometryPoint(graph, "p").data).toMatchObject({ x: 3, y: 15 }); });
  it("reports unsupported 3D conversion honestly", () => { const graph = new MathDependencyGraph(); graph.define("f(x)=x^2", "f"); expect(adaptGraph3d(graph, "f")).toMatchObject({ status: "UNSUPPORTED", diagnostics: [{ code: "UNSUPPORTED_ADAPTER_INPUT" }] }); });
});
