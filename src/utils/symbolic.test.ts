import { describe, expect, it } from "vitest";
import { symbolicDefiniteIntegral, symbolicDerivative, symbolicExpand, symbolicFactor, symbolicIntegral, symbolicLimit, symbolicPartialFractions, symbolicPolynomialDivide, symbolicSimplify, symbolicSolve, symbolicSubstitute, symbolicSystemSolve, symbolicTangentLine, symbolicVerifyIdentity, trySymbolic } from "./symbolic";

describe("symbolic math engine", () => {
  it("expands, factors, and simplifies polynomial expressions", () => {
    const expanded = symbolicExpand("(x+2)*(x+3)").result;
    expect(expanded).toContain("x^2");
    expect(expanded).toContain("5*x");
    expect(expanded).toContain("6");
    expect(symbolicFactor("x^2-5*x+6").result).toContain("x");
    expect(symbolicSimplify("x+x+2").result).toContain("2*x");
  });

  it("derives and integrates common classroom expressions", () => {
    expect(symbolicDerivative("x^3-2*x").result).toContain("3*x^2");
    expect(symbolicIntegral("3*x^2").result).toContain("x^3");
    expect(symbolicIntegral("3*x^2").result).toContain("+C");
  });

  it("solves quadratics and safely reports unsupported symbolic work", () => {
    const solved = symbolicSolve("x^2-5*x+6=0").result;
    expect(solved).toContain("2");
    expect(solved).toContain("3");
    expect(trySymbolic(() => symbolicSolve("x+"))).toBeNull();
  });

  it("solves with domain and extraneous-root guardrails", () => {
    const rational = symbolicSolve("(x^2-1)/(x-1)=0");
    expect(rational.result).toBe("x = -1");
    expect(rational.restrictions).toContain("x-1 != 0 for denominators");
    expect(Array.isArray(rational.verification) ? rational.verification.join(" ") : "").toContain("Rejected x = 1");

    const logarithmic = symbolicSolve("log(x-1)=0");
    expect(logarithmic.result).toBe("x = 2");
    expect(logarithmic.restrictions).toContain("x-1 > 0 for logarithms");
    expect(Array.isArray(logarithmic.verification) ? logarithmic.verification.join(" ") : "").toContain("Verified x = 2");

    const absolute = symbolicSolve("abs(x-3)=2");
    expect(absolute.result).toContain("1");
    expect(absolute.result).toContain("5");
  });

  it("handles deeper CAS operations for limits, systems, substitution, division, and partial fractions", () => {
    expect(symbolicLimit("sin(x)/x", "x", "0").result).toBe("1");
    expect(symbolicSystemSolve(["x+y=5", "x-y=1"], ["x", "y"]).result).toContain("x = 3");
    expect(symbolicSubstitute("x^2+a", [{ name: "a", value: "3" }, { name: "x", value: "2" }]).result).toBe("7");
    expect(symbolicPolynomialDivide("x^3-1", "x-1").result).toContain("x^2");
    expect(symbolicPartialFractions("(3*x+5)/((x+1)(x+2))").result).toContain("/(x+");
  });

  it("accepts student-style notation and common exact identities", () => {
    expect(symbolicSimplify("√(12)+√(27)").result).toBe("5*sqrt(3)");
    expect(symbolicSimplify("2π").result).toBe("2*pi");
    expect(symbolicSimplify("6 ÷ 3 + 2 × x").result).toContain("2*x");
    expect(symbolicSimplify("sin^2(x)+cos^2(x)").result).toBe("1");
  });

  it("computes definite integrals and tangent lines", () => {
    expect(symbolicDefiniteIntegral("x^2", "0", "2").result).toBe("8/3");
    const tangent = symbolicTangentLine("x^2", "3");
    expect(tangent.result).toBe("y = -9+6*x");
    expect(tangent.steps).toContain("Evaluate the slope: f'(3) = 6.");
  });

  it("verifies identities with exact and numeric fallback checks", () => {
    const exact = symbolicVerifyIdentity("x^2+2*x+1", "(x+1)^2");
    expect(exact.verification.equivalent).toBe(true);
    expect(exact.verification.method).toBe("exact");

    const trig = symbolicVerifyIdentity("tan(x)", "sin(x)/cos(x)");
    expect(trig.verification.equivalent).toBe(true);
    expect(trig.verification.method).toBe("numeric-sampling");

    const falseIdentity = symbolicVerifyIdentity("x+1", "x+2");
    expect(falseIdentity.verification.equivalent).toBe(false);
  });
});
