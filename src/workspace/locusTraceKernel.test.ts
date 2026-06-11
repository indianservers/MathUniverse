import { describe, expect, it } from "vitest";
import { appendTraceSample, nextTraceLabel, seedTraceSamples, traceDefinition } from "./locusTraceKernel";

describe("locusTraceKernel", () => {
  it("seeds a trace with a rounded first point", () => {
    expect(seedTraceSamples({ x: 10.123, y: 20.987 })).toEqual([{ x: 10.12, y: 20.99 }]);
  });

  it("dedupes tiny pointer movement", () => {
    const first = appendTraceSample([], { x: 0, y: 0 });
    const next = appendTraceSample(first, { x: 1, y: 1 });
    expect(next).toBe(first);
  });

  it("keeps trace paths bounded", () => {
    const samples = Array.from({ length: 8 }).reduce(
      (current: { x: number; y: number }[], _, index) => appendTraceSample(current, { x: index * 3, y: 0 }, { maxSamples: 4 }),
      [] as { x: number; y: number }[],
    );
    expect(samples).toEqual([{ x: 12, y: 0 }, { x: 15, y: 0 }, { x: 18, y: 0 }, { x: 21, y: 0 }]);
  });

  it("names trace objects for the source point", () => {
    expect(nextTraceLabel(0, "A")).toBe("trace(A)");
    expect(nextTraceLabel(2, "A")).toBe("trace(A) 3");
    expect(traceDefinition(12, "A")).toBe("Trace(A, 12 samples)");
  });
});
