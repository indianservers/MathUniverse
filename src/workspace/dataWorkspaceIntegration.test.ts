import { describe, expect, it } from "vitest";
import { createCasWorkspaceObject, createProbabilityWorkspaceObject, createSpreadsheetWorkspaceObjects, createStatisticsWorkspaceObject } from "./dataWorkspaceIntegration";

describe("data workspace integration", () => {
  it("creates linked spreadsheet and statistics objects", () => {
    const bundle = createSpreadsheetWorkspaceObjects([
      ["x", "y"],
      ["1", "2"],
      ["2", "=A2+B2"],
    ], { range: "A2:B3" });

    expect(bundle.diagnostics).toHaveLength(0);
    expect(bundle.objects).toHaveLength(2);
    expect(bundle.objects[1].dependencies?.[0].id).toBe(bundle.objects[0].id);
  });

  it("creates CAS and probability objects as algebra-compatible workspace objects", () => {
    const cas = createCasWorkspaceObject("Factor", "x^2-5*x+6");
    const stats = createStatisticsWorkspaceObject([1, 2, 2, 5]);
    const probability = createProbabilityWorkspaceObject("dice-probability", { outcome: 7, diceCount: 2 });

    expect(cas.kind).toBe("equation");
    expect(cas.value).toContain("x");
    expect(stats.metadata?.mean).toBe(2.5);
    expect(probability.value).toContain("P=");
  });
});
