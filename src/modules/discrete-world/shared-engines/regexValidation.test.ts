import { describe, expect, it } from "vitest";
import { regexToNfa, simulateAutomaton } from "./automataEngine";

describe("regex syntax validation", () => {
  it.each(["(", "a)", "()", "|a", "a|", "*a", "a?"])(
    "rejects malformed or unsupported %s",
    (pattern) => {
      expect(() => regexToNfa(pattern)).toThrow();
    },
  );
  it("still constructs valid nested union and star expressions", () => {
    const machine = regexToNfa("a(b|c)*");
    expect(simulateAutomaton(machine, "abcb").accepted).toBe(true);
    expect(simulateAutomaton(machine, "ba").accepted).toBe(false);
  });
});
