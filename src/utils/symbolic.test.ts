import { describe, expect, it } from "vitest";
import { symbolicDerivative, symbolicExpand, symbolicFactor, symbolicIntegral, symbolicSimplify, symbolicSolve, trySymbolic } from "./symbolic";

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
});
