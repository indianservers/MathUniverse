import { describe, expect, it } from "vitest";
import {
  evaluateArithmeticExpression,
  expandedForm,
  formatNumberBySystem,
  numberName,
  operateDecimals,
  operateFractions,
  roundToPlace,
  simplifyFraction,
} from "./grade7MathUtils";

describe("Grade 7 NCERT math utilities", () => {
  it("formats large numbers in Indian and international systems", () => {
    expect(formatNumberBySystem(45678901, "indian")).toBe("4,56,78,901");
    expect(formatNumberBySystem(12345678, "international")).toBe("12,345,678");
    expect(expandedForm(9040)).toBe("9,000 + 40");
    expect(numberName(1000000, "indian")).toContain("lakh");
    expect(roundToPlace(45678901, "thousand")).toBe(45679000);
  });

  it("evaluates supported arithmetic expressions without unsafe eval", () => {
    expect(evaluateArithmeticExpression("8 + 4 * 3").value).toBe(20);
    expect(evaluateArithmeticExpression("(8 + 4) * 3").value).toBe(36);
    expect(evaluateArithmeticExpression("40 / 5 * 2").value).toBe(16);
    expect(() => evaluateArithmeticExpression("alert(1)")).toThrow();
  });

  it("handles textbook decimal operations", () => {
    expect(operateDecimals(3.4, 2.75, "add")).toBe(6.15);
    expect(operateDecimals(10.5, 3.25, "subtract")).toBe(7.25);
    expect(operateDecimals(1.2, 0.3, "multiply")).toBe(0.36);
    expect(operateDecimals(4.8, 1.2, "divide")).toBe(4);
  });

  it("handles fraction arithmetic and simplification", () => {
    expect(operateFractions({ numerator: 1, denominator: 2 }, { numerator: 1, denominator: 3 }, "add").result).toEqual({ numerator: 5, denominator: 6 });
    expect(operateFractions({ numerator: 2, denominator: 3 }, { numerator: 3, denominator: 5 }, "multiply").result).toEqual({ numerator: 2, denominator: 5 });
    expect(operateFractions({ numerator: 4, denominator: 5 }, { numerator: 2, denominator: 3 }, "divide").result).toEqual({ numerator: 6, denominator: 5 });
    expect(simplifyFraction({ numerator: 18, denominator: 24 })).toEqual({ numerator: 3, denominator: 4 });
  });
});
