import { describe, expect, it } from "vitest";
import { adaptiveSampleExplicit } from "./adaptiveGraph";

const viewport = { xMin: -5, xMax: 5, yMin: -10, yMax: 10, pixelWidth: 800, pixelHeight: 500 };

describe("adaptive graph sampling", () => {
  it("refines curved functions and declares its numerical evidence", () => {
    const result = adaptiveSampleExplicit((x) => x * x, viewport, "HIGH_ACCURACY");
    expect(result.segments[0].points.length).toBeGreaterThan(20);
    expect(result.evidence).toMatchObject({ method: "ADAPTIVE_SUBDIVISION", profile: "HIGH_ACCURACY", convergence: "CONVERGED" });
    expect(result.evidence.evaluations).toBeGreaterThan(0);
  });

  it("does not bridge an undefined rational discontinuity", () => {
    const result = adaptiveSampleExplicit((x) => 1 / (x - 1), viewport);
    expect(result.segments.length).toBeGreaterThan(1);
    expect(result.segments.every((segment) => !(segment.points[0].x < 1 && segment.points.at(-1)!.x > 1))).toBe(true);
  });

  it("supports cancellable stale calculations", () => {
    const result = adaptiveSampleExplicit(Math.sin, viewport, "BALANCED", { cancelled: true });
    expect(result.evidence.convergence).toBe("CANCELLED");
    expect(result.diagnostics.some((entry) => entry.code === "SAMPLING_CANCELLED")).toBe(true);
  });
});
