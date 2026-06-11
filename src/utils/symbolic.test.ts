import { describe, expect, it } from "vitest";
import { symbolicDerivative, symbolicExpand, symbolicFactor, symbolicIntegral, symbolicLimit, symbolicPartialFractions, symbolicPolynomialDivide, symbolicSimplify, symbolicSolve, symbolicSubstitute, symbolicSystemSolve, trySymbolic } from "./symbolic";

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

  it("handles deeper CAS operations for limits, systems, substitution, division, and partial fractions", () => {
    expect(symbolicLimit("sin(x)/x", "x", "0").result).toBe("1");
    expect(symbolicSystemSolve(["x+y=5", "x-y=1"], ["x", "y"]).result).toContain("x = 3");
    expect(symbolicSubstitute("x^2+a", [{ name: "a", value: "3" }, { name: "x", value: "2" }]).result).toBe("7");
    expect(symbolicPolynomialDivide("x^3-1", "x-1").result).toContain("x^2");
    expect(symbolicPartialFractions("(3*x+5)/((x+1)(x+2))").result).toContain("/(x+");
  });
});
