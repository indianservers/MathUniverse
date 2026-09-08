import { describe, expect, it } from "vitest";
import {
  recurrenceClosedForm,
  recurrenceInitialForState,
  recurrenceModellingAnalysis,
} from "./recurrenceModellingLessonModel";

describe("recurrence modelling model", () => {
  it("iterates the target population recurrence", () => {
    const result = recurrenceModellingAnalysis(1.1, 0, 50000, 10);
    expect(result.values).toEqual([
      50000, 55000, 60500, 66550, 73205, 80525.5, 88578.05, 97435.855,
      107179.4405, 117897.38455, 129687.123005,
    ]);
    expect(result.selectedClosed).toBe(129687.123005);
    expect(result.exactMatch).toBe(true);
    expect(result.equilibrium).toBe(0);
    expect(result.stable).toBe(false);
  });

  it("handles affine recurrences and the r = 1 special case", () => {
    const savings = recurrenceModellingAnalysis(1.05, 1000, 10000, 10),
      linear = recurrenceModellingAnalysis(1, 20, 200, 10);
    expect(savings.values[1]).toBe(11500);
    expect(savings.selectedRecursive).toBe(savings.selectedClosed);
    expect(linear.values[10]).toBe(400);
    expect(recurrenceClosedForm(200, 1, 20, 10)).toBe(400);
    expect(linear.equilibrium).toBeNull();
  });

  it("calculates stable equilibrium and drag inversion", () => {
    const medication = recurrenceModellingAnalysis(0.72, 20, 200, 10);
    expect(medication.stable).toBe(true);
    expect(medication.equilibrium).toBeCloseTo(71.428571, 5);
    expect(recurrenceInitialForState(400, 1, 20, 10)).toBe(200);
    expect(recurrenceInitialForState(50, 0, 20, 3)).toBeNull();
  });

  it("bounds hostile parameters", () => {
    const result = recurrenceModellingAnalysis(Infinity, Infinity, -10, 1000);
    expect(result.r).toBe(1);
    expect(result.k).toBe(0);
    expect(result.initial).toBe(0);
    expect(result.selectedN).toBe(10);
    expect(result.values.every(Number.isFinite)).toBe(true);
  });
});
