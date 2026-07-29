import { describe, expect, it } from "vitest";
import { createSolutionSequence, orderMathElements, verifySolutionSequence, verifyTransition } from "./boardWorkVerification";
import type { MathExpressionElement } from "./types";

function expression(id: string, latex: string, y: number): MathExpressionElement {
  return { id, type: "math-expression", latex, sourceStrokeIds: [], bounds: { x: 20, y, width: 160, height: 50 }, createdAt: new Date().toISOString(), recognitionConfidence: 0.9 };
}

describe("Board work verification", () => {
  it("orders lines spatially and creates sequence relationships", () => {
    const inputs = [expression("third", "x=5", 200), expression("first", "3x+7=22", 20), expression("second", "3x=15", 110)];
    expect(orderMathElements(inputs).map((item) => item.id)).toEqual(["first", "second", "third"]);
    const created = createSolutionSequence(inputs);
    expect(created.sequence.orderedStepIds).toHaveLength(3);
    expect(created.relationships[1].type).toBe("next-step-of");
  });

  it("accepts equivalent alternative expression transformations", async () => {
    const result = await verifyTransition("x+x", "2*x");
    expect(result.valid).toBe(true);
  });

  it("finds the first invalid equation step without independently blaming later work", async () => {
    const inputs = [expression("a", "3x+7=22", 20), expression("b", "3x=15", 100), expression("c", "x=6", 180)];
    const created = createSolutionSequence(inputs);
    const result = await verifySolutionSequence(created.sequence, created.steps);
    expect(result.overallStatus).toBe("incorrect");
    expect(result.firstInvalidStepId).toBe(created.steps[2].id);
    expect(result.verifiedSteps[1].status).toBe("valid");
  });

  it("treats low-confidence recognition as ambiguous", async () => {
    const inputs = [expression("a", "x+x", 20), { ...expression("b", "2x", 100), recognitionConfidence: 0.2 }];
    const created = createSolutionSequence(inputs);
    const result = await verifySolutionSequence(created.sequence, created.steps);
    expect(result.overallStatus).toBe("ambiguous");
    expect(result.verifiedSteps[1].recognitionIssue).toBe(true);
  });
});
