import { describe, expect, it } from "vitest";
import {
  deriveSequenceConceptModel,
  sequenceConceptConfigs,
} from "./sequenceConceptModels";
import type { SequenceLessonMode } from "../presets/sequenceLessonPresets";

describe("sequence concept models", () => {
  it("produces terms, partial sums, and an active challenge for all 13 modes", () => {
    for (const [mode, config] of Object.entries(sequenceConceptConfigs)) {
      const result = deriveSequenceConceptModel(
        mode as SequenceLessonMode,
        config.defaults,
      );
      expect(result.terms.length, mode).toBeGreaterThan(0);
      expect(result.partialSums, mode).toHaveLength(result.terms.length);
      expect(result.prompt.length, mode).toBeGreaterThan(20);
      expect(result.expected.length, mode).toBeGreaterThan(0);
      expect(result.summary, mode).toContain(result.display);
    }
  });

  it("uses the arithmetic nth-term and sum formulas", () => {
    const term = deriveSequenceConceptModel("arithmetic-sequence", {
      a: 2,
      b: 3,
      n: 8,
    });
    const sum = deriveSequenceConceptModel("arithmetic-series", {
      a: 2,
      b: 3,
      n: 8,
    });
    expect(term.value).toBe(23);
    expect(sum.value).toBe(100);
  });

  it("classifies geometric convergence including zero and oscillating edge cases", () => {
    expect(
      deriveSequenceConceptModel("convergence", {
        a: 4,
        b: 0.5,
        n: 10,
      }).value,
    ).toBe("convergent");
    expect(
      deriveSequenceConceptModel("convergence", {
        a: 4,
        b: -1,
        n: 10,
      }).value,
    ).toBe("divergent");
    expect(
      deriveSequenceConceptModel("convergence", {
        a: 0,
        b: 2,
        n: 10,
      }).value,
    ).toBe("convergent");
  });

  it("improves the exponential Taylor approximation when degree increases", () => {
    const low = deriveSequenceConceptModel("taylor-maclaurin", {
      a: 1,
      b: 0,
      n: 2,
    });
    const high = deriveSequenceConceptModel("taylor-maclaurin", {
      a: 1,
      b: 0,
      n: 8,
    });
    expect(Math.abs(Number(high.value) - Math.E)).toBeLessThan(
      Math.abs(Number(low.value) - Math.E),
    );
  });

  it("uses generalized binomial coefficients for non-integer exponents", () => {
    const result = deriveSequenceConceptModel("binomial-series", {
      a: 0.5,
      b: 0.4,
      n: 8,
    });
    expect(Number(result.value)).toBeCloseTo(Math.sqrt(1.4), 4);
  });
});
