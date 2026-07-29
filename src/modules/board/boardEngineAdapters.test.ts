import { describe, expect, it } from "vitest";
import {
  executeBoardAction,
  normalizeBoardEngineError,
  verifyBoardExpressions,
} from "./boardEngineAdapters";
import { analyzeBoardExpression } from "./boardMathAnalyzer";

describe("Board existing-engine adapters", () => {
  it("translates factor and solve requests into the certified solver/CAS", async () => {
    const analysis = analyzeBoardExpression("x^2-5x+6");
    const factored = await executeBoardAction({ action: "factor", analysis, parameters: { variable: "x" } });
    const roots = await executeBoardAction({ action: "find-roots", analysis, parameters: { variable: "x" } });
    expect(factored.exactOutputLatex?.replace(/\s/g, "")).toMatch(/\(x-2\).*\(x-3\)|\(x-3\).*\(x-2\)/);
    expect(roots.exactOutputLatex).toContain("2");
    expect(factored.engine.underlyingEngine).toBeTruthy();
  });

  it("builds an interactive graph configuration through graphSampler", async () => {
    const analysis = analyzeBoardExpression("f(x)=x^2-4");
    const graph = await executeBoardAction({ action: "plot-2d", analysis, parameters: { xMin: -5, xMax: 5, yMin: -5, yMax: 10 } });
    expect(graph.graph?.series?.[0].points.length).toBe(500);
    expect(graph.graph?.workspaceRoute).toContain("/workspace/graph");
    expect(graph.engine.underlyingEngine).toContain("FunctionGraphCanvas");
  });

  it("reuses the equation's zero-form for factor and graph workflows", async () => {
    const analysis = analyzeBoardExpression("x^2-5x+6=0");
    const factored = await executeBoardAction({ action: "factor", analysis, parameters: { variable: "x" } });
    const graph = await executeBoardAction({ action: "plot-2d", analysis, parameters: { xMin: -2, xMax: 7 } });
    expect(factored.exactOutputLatex?.replace(/\s/g, "")).toMatch(/\(x-2\).*\(x-3\)|\(x-3\).*\(x-2\)/);
    expect(graph.graph?.expression).not.toContain("=");
    expect(graph.graph?.series?.[0].points.length).toBe(500);
  });

  it("routes implicit equations and geometry to existing workspaces", async () => {
    const analysis = analyzeBoardExpression("x^2+y^2=1");
    const graph = await executeBoardAction({ action: "plot-implicit", analysis, parameters: {} });
    const geometry = await executeBoardAction({ action: "geometry", analysis, parameters: {} });
    expect(graph.workspaceRoute).toContain("/workspace/graph");
    expect(geometry.workspaceRoute).toBe("/workspace/geometry");
  });

  it("translates reviewed datasets into the existing statistics solver", async () => {
    const analysis = analyzeBoardExpression("4,7,7,8,10,12");
    const result = await executeBoardAction({ action: "statistics", analysis, parameters: { population: true } });
    expect(result.plainTextOutput).toContain("mean");
    expect(result.plainTextOutput).toContain("median");
    expect(result.engine.underlyingEngine).toContain("statistics solver");
  });

  it("verifies mathematical equivalence with symbolic verification", async () => {
    const verification = await verifyBoardExpressions("(x+1)^2", "x^2+2*x+1");
    expect(verification.status).toBe("verified");
  });

  it("normalizes cancellation, timeout, singular, and parsing errors", () => {
    expect(normalizeBoardEngineError(new DOMException("cancelled", "AbortError")).code).toBe("CANCELLED");
    expect(normalizeBoardEngineError(new Error("engine timeout")).code).toBe("TIMEOUT");
    expect(normalizeBoardEngineError(new Error("singular matrix")).code).toBe("SINGULAR_MATRIX");
    expect(normalizeBoardEngineError(new Error("invalid expression parse")).code).toBe("PARSING_ERROR");
  });

  it("supports cancellation before execution", async () => {
    const controller = new AbortController();
    controller.abort();
    await expect(executeBoardAction({
      action: "factor",
      analysis: analyzeBoardExpression("x^2-1"),
      parameters: {},
      signal: controller.signal,
    })).rejects.toMatchObject({ name: "AbortError" });
  });
});
