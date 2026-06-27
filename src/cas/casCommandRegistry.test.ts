import { describe, expect, it } from "vitest";

import { casCommandArgumentRange, casCommandCatalog, casCommandRegistrySummary, normalizeCasCommandName, resolveCasCommandSpec, searchCasCommands, suggestCasCommands, validateCasCommandArguments } from "./casCommandRegistry";

describe("casCommandRegistry", () => {
  it("tracks implemented, partial, and planned CAS command coverage", () => {
    const summary = casCommandRegistrySummary();

    expect(summary.total).toBeGreaterThan(50);
    expect(summary.implemented).toBeGreaterThan(10);
    expect(summary.planned).toBe(0);
    expect(summary.byCategory.Calculus.total).toBeGreaterThan(10);
    expect(summary.byCategory.Calculus.implemented).toBeGreaterThan(10);
    expect(summary.byCategory["Equation Solving"].implemented).toBeGreaterThan(5);
    expect(summary.byCategory["Linear Algebra"].implemented).toBeGreaterThan(9);
  });

  it("normalizes GeoGebra-style aliases and searches metadata", () => {
    expect(normalizeCasCommandName("Diff")).toBe("Derivative");
    expect(normalizeCasCommandName("IntegralBetween")).toBe("DefiniteIntegral");
    expect(normalizeCasCommandName("IntegralSymbolic")).toBe("Integral");
    expect(normalizeCasCommandName("Invert")).toBe("Inverse");
    expect(normalizeCasCommandName("ReducedRowEchelonForm")).toBe("RREF");
    expect(normalizeCasCommandName("Identity")).toBe("IdentityMatrix");
    expect(resolveCasCommandSpec("NSolve")?.support).toBe("implemented");
    expect(searchCasCommands("laplace").map((item) => item.name)).toContain("Laplace");
  });

  it("keeps commands discoverable with examples and signatures", () => {
    expect(casCommandCatalog.every((command) => command.signature && command.description && command.examples.length)).toBe(true);
  });

  it("suggests close commands and validates argument counts", () => {
    expect(suggestCasCommands("Derivitive").map((command) => command.name)).toContain("Derivative");
    expect(casCommandArgumentRange("Solve")?.label).toBe("1 to 2 arguments");
    expect(validateCasCommandArguments("Factor", []).errors[0]).toContain("Factor expects 1 argument");
    expect(validateCasCommandArguments("Substitute", ["x^2"]).errors[0]).toContain("at least one assignment");
    expect(validateCasCommandArguments("Determinant", ["[1,2]", "[3,4]"]).errors).toEqual([]);
  });
});
