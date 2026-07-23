import { describe, expect, it } from "vitest";
import {
  deriveMatrixConceptModel,
  matrixConceptConfigs,
} from "./matrixConceptModels";
import type { MatrixLessonMode } from "../presets/matrixLessonPresets";

describe("matrix concept models", () => {
  it("derives a result, challenge, and representation for every non-eigen mode", () => {
    for (const [mode, config] of Object.entries(matrixConceptConfigs)) {
      const result = deriveMatrixConceptModel(
        mode as Exclude<MatrixLessonMode, "eigen-directions">,
        config.defaults,
      );
      expect(result.prompt.length, mode).toBeGreaterThan(20);
      expect(result.expected.length, mode).toBeGreaterThan(0);
      expect(result.steps.length, mode).toBeGreaterThan(0);
      expect(result.summary, mode).toContain(result.display);
    }
  });

  it("supports both matrix addition and subtraction", () => {
    const add = deriveMatrixConceptModel("addition-subtraction", {
      a: 2,
      b: 1,
      c: 1,
      d: 2,
      k: 1,
    });
    const subtract = deriveMatrixConceptModel("addition-subtraction", {
      a: 2,
      b: 1,
      c: 1,
      d: 2,
      k: -1,
    });
    expect(add.value).toBe(4);
    expect(subtract.value).toBe(0);
  });

  it("handles invertible and singular matrices without fabricated inverses", () => {
    const invertible = deriveMatrixConceptModel("inverse", {
      a: 2,
      b: 1,
      c: 1,
      d: 2,
      k: 0,
    });
    const singular = deriveMatrixConceptModel("inverse", {
      a: 1,
      b: 2,
      c: 2,
      d: 4,
      k: 0,
    });
    expect(invertible.value).toBeCloseTo(2 / 3);
    expect(singular.value).toBe("singular");
    expect(singular.resultMatrix).toEqual([]);
  });

  it("classifies independence and span dimension from the active columns", () => {
    const independent = deriveMatrixConceptModel("linear-independence", {
      a: 1,
      b: 0,
      c: 0,
      d: 1,
      k: 0,
    });
    const dependent = deriveMatrixConceptModel("basis-dimension", {
      a: 1,
      b: 2,
      c: 2,
      d: 4,
      k: 0,
    });
    expect(independent.value).toBe("independent");
    expect(dependent.value).toBe(1);
  });

  it("produces an orthogonal second direction with Gram–Schmidt", () => {
    const result = deriveMatrixConceptModel("gram-schmidt", {
      a: 1,
      b: 1,
      c: 1,
      d: 0,
      k: 0,
    });
    const [[e1x, e2x], [e1y, e2y]] = result.resultMatrix;
    expect(e1x * e2x + e1y * e2y).toBeCloseTo(0, 10);
  });

  it("computes a least-squares prediction from the displayed observations", () => {
    const result = deriveMatrixConceptModel("least-squares", {
      a: 2,
      b: 3,
      c: 5,
      d: 3,
      k: 0,
    });
    expect(result.value).toBeCloseTo(19 / 3, 10);
  });
});
