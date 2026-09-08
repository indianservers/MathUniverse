import { describe, expect, it } from "vitest";
import {
  DEFAULT_INEQUALITY_RULES,
  inequalityLabel,
  inequalityPointFromPixels,
  inequalitySystemResult,
} from "./inequalityGrapherLesson42Model";

describe("inequality grapher lesson 42 model", () => {
  it("keeps the displayed point and verdict mathematically consistent", () => {
    const system = inequalitySystemResult(DEFAULT_INEQUALITY_RULES, 2, 2);
    expect(system.satisfies).toBe(true);
    expect(system.results.map((result) => result.rhs)).toEqual([2.6, 1]);
  });

  it("rejects the inconsistent point printed in the source mockup", () => {
    expect(
      inequalitySystemResult(DEFAULT_INEQUALITY_RULES, 1, 2).satisfies,
    ).toBe(false);
  });

  it("derives notation and snapped graph coordinates", () => {
    expect(inequalityLabel(DEFAULT_INEQUALITY_RULES[0])).toBe("y ≤ 0.8x + 1");
    expect(inequalityLabel(DEFAULT_INEQUALITY_RULES[1])).toBe("y > -0.5x + 2");
    expect(inequalityPointFromPixels(448, 227)).toEqual({ x: 2, y: 2 });
  });
});
