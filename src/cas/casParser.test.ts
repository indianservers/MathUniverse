import { describe, expect, it } from "vitest";

import { hasBalancedCasDelimiters, parseCasInput, splitCasArguments } from "./casParser";

describe("casParser", () => {
  it("parses nested command arguments without splitting inner commas", () => {
    const parsed = parseCasInput("Substitute[x^2+a, a=3, b=(1,2)]");

    expect(parsed.normalizedName).toBe("Substitute");
    expect(parsed.args).toEqual(["x^2+a", "a=3", "b=(1,2)"]);
    expect(parsed.errors).toEqual([]);
  });

  it("supports natural commands and bare expressions", () => {
    expect(parseCasInput("solve x^2-4=0").normalizedName).toBe("Solve");
    expect(parseCasInput("x+x").normalizedName).toBe("Evaluate");
    expect(parseCasInput("a := 3").syntax).toBe("assignment");
  });

  it("does not warn for implemented commands and reports delimiter errors", () => {
    const implemented = parseCasInput("Mean[2,4,6]");
    const broken = parseCasInput("Factor[(x+1]");

    expect(implemented.warnings).toEqual([]);
    expect(broken.errors.join(" ")).toContain("Unbalanced");
  });

  it("adds typo suggestions and command arity errors", () => {
    const typo = parseCasInput("Derivitive[x^2]");
    const emptyFactor = parseCasInput("Factor[]");
    const missingSubstitution = parseCasInput("Substitute[x^2+a]");

    expect(typo.errors.join(" ")).toContain("Unknown CAS command");
    expect(typo.warnings.join(" ")).toContain("Derivative");
    expect(emptyFactor.errors.join(" ")).toContain("Factor expects 1 argument");
    expect(missingSubstitution.errors.join(" ")).toContain("at least one assignment");
  });

  it("exports reusable argument and delimiter helpers", () => {
    expect(splitCasArguments("x^2, [1,2,3], f(a,b)")).toEqual(["x^2", "[1,2,3]", "f(a,b)"]);
    expect(hasBalancedCasDelimiters("Factor[(x+1)]")).toBe(true);
    expect(hasBalancedCasDelimiters("Factor[(x+1]")).toBe(false);
  });
});
