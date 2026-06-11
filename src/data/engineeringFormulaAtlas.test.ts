import { readFile } from "node:fs/promises";
import { describe, expect, it } from "vitest";
import { engineeringMathDomains } from "./engineeringMathBlueprint";
import { engineeringFormulaAtlas, formulaAtlasSummary, formulasForDomain } from "./engineeringFormulaAtlas";

describe("engineering formula atlas", () => {
  it("covers every engineering math domain with formula cards", () => {
    const coveredDomains = new Set(engineeringFormulaAtlas.map((formula) => formula.domainId));
    expect(engineeringMathDomains.every((domain) => coveredDomains.has(domain.id))).toBe(true);
    expect(formulaAtlasSummary().coveredDomainCount).toBe(engineeringMathDomains.length);
  });

  it("gives each domain a useful formula set", () => {
    engineeringMathDomains.forEach((domain) => {
      const formulas = formulasForDomain(domain.id);
      expect(formulas.length).toBeGreaterThanOrEqual(4);
      expect(formulas.every((formula) => formula.symbols.length > 0)).toBe(true);
      expect(formulas.every((formula) => formula.prerequisites.length > 0)).toBe(true);
      expect(formulas.every((formula) => formula.useCase.length > 20)).toBe(true);
    });
  });

  it("keeps every formula route-backed into the app", () => {
    expect(engineeringFormulaAtlas.every((formula) => formula.route.startsWith("/"))).toBe(true);
    expect(engineeringFormulaAtlas.every((formula) => formula.route.includes("/formulas"))).toBe(true);
    expect(formulaAtlasSummary().routeCount).toBe(engineeringFormulaAtlas.length);
    expect(formulaAtlasSummary().prerequisiteCount).toBeGreaterThan(10);
  });

  it("finds selected-domain formula cards", () => {
    const calculus = formulasForDomain("engineering-calculus");
    const vectorFields = formulasForDomain("vector-calculus-fields");
    expect(calculus.some((formula) => formula.title.includes("Jacobian"))).toBe(true);
    expect(vectorFields.some((formula) => formula.title === "Stokes theorem")).toBe(true);
  });

  it("renders formula intelligence on the Engineering Mathematics hub", async () => {
    const source = await readFile("src/pages/EngineeringMath.tsx", "utf8");
    expect(source).toContain("Formula Intelligence");
    expect(source).toContain("formulasForDomain");
    expect(source).toContain("formulaAtlasSummary");
  });
});
