import { describe, expect, it } from "vitest";
import { recognizeMathInput } from "./mathRecognizer";

describe("math recognizer subsystem", () => {
  it("returns an auditable recognition result", () => {
    const result = recognizeMathInput("sqrt(34) + tan(45)", "Expression Evaluation");
    expect(result.possibleProblemType).toBe("Expression Evaluation");
    expect(result.categories).toEqual(expect.arrayContaining(["power-root", "trigonometry", "arithmetic", "number", "grouping"]));
    expect(result.level).toBe("intermediate");
    expect(result.suggestions).toContain("Trig numeric input is interpreted in degrees unless radians are specified.");
    expect(result.audit.totalTokens).toBeGreaterThan(0);
    expect(result.audit.recognitionRate).toBeGreaterThan(0.9);
    expect(result.audit.detectedFunctions).toEqual(expect.arrayContaining(["sqrt", "tan"]));
  });

  it("captures unknown segments in the audit", () => {
    const result = recognizeMathInput("apple mango banana", "Unsupported");
    expect(result.audit.unknownTokens).toBe(3);
    expect(result.audit.unmatchedSegments).toEqual(expect.arrayContaining(["apple", "mango", "banana"]));
    expect(result.suggestions).toContain("Some words were not recognized as math keywords. Try a clearer mathematical expression.");
  });

  it("ignores filler words while still warning about real unknown terms", () => {
    const statistical = recognizeMathInput("mean of 4, 6, 8, 10", "Statistics");
    expect(statistical.audit.unmatchedSegments).not.toContain("of");
    expect(statistical.suggestions).not.toContain("Some words were not recognized as math keywords. Try a clearer mathematical expression.");

    const unclear = recognizeMathInput("please solve apple x", "Linear Equation");
    expect(unclear.audit.unmatchedSegments).toContain("apple");
    expect(unclear.audit.unmatchedSegments).not.toContain("please");
    expect(unclear.suggestions).toContain("Some words were not recognized as math keywords. Try a clearer mathematical expression.");
  });
});
