import { describe, expect, it } from "vitest";
import { evaluateExpression, evaluateExpressionDetailed } from "./calculator";

describe("scientific calculator accuracy contract", () => {
  it("publishes precedence and angle conventions through golden expressions", () => {
    expect(evaluateExpression("-2^2", "RAD")).toBe("-4");
    expect(evaluateExpression("2^-2", "RAD")).toBe("0.25");
    expect(evaluateExpression("2^3^2", "RAD")).toBe("512");
    expect(evaluateExpression("sin(30)", "DEG")).toBe("0.5");
  });

  it("returns specific real-domain errors", () => {
    expect(() => evaluateExpression("sqrt(-1)", "RAD")).toThrow(/undefined.*real-number/);
    expect(() => evaluateExpression("ln(0)", "RAD")).toThrow(/undefined/);
    expect(() => evaluateExpression("asin(2)", "RAD")).toThrow(/-1 to 1/);
    expect(() => evaluateExpression("tan(90)", "DEG")).toThrow(/undefined.*DEG/);
    expect(() => evaluateExpression("1/0", "RAD")).toThrow(/undefined/);
  });

  it("labels exact values separately from decimal approximations", () => {
    expect(evaluateExpressionDetailed("sqrt(144)", "RAD").accuracy).toBe("exact");
    expect(evaluateExpressionDetailed("sqrt(2)", "RAD").accuracy).toBe("approximate");
    expect(evaluateExpressionDetailed("1/3", "RAD").accuracy).toBe("approximate");
    expect(evaluateExpressionDetailed("factorial(6)", "RAD").accuracy).toBe("exact");
  });
});
