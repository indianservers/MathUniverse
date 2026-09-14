import { describe, expect, it } from "vitest";
import { sampleExplicitAdaptive } from "./adaptiveSampler";

describe("adaptiveSampler", () => {
  it("puts extra samples around a sharp bend and keeps a smooth line sparse", () => {
    const sharp = sampleExplicitAdaptive((x) => Math.abs(x), -2, 2, 4, 40);
    const nearZero = sharp.filter((point) => Math.abs(point.x) < 0.2).length;
    const smooth = sampleExplicitAdaptive((x) => 2 * x + 1, -2, 2, 8, 40);

    expect(nearZero).toBeGreaterThan(5);
    expect(smooth.length).toBeLessThan(sharp.length);
  });

  it("splits at a vertical asymptote instead of connecting branches", () => {
    const samples = sampleExplicitAdaptive((x) => 1 / x, -1, 1, 20, 48);
    const invalid = samples.filter((point) => !point.valid);

    expect(invalid.length).toBeGreaterThan(0);
    expect(samples.filter((point) => point.valid && point.y !== null && point.y > 0).length).toBeGreaterThan(4);
    expect(samples.filter((point) => point.valid && point.y !== null && point.y < 0).length).toBeGreaterThan(4);
  });
});
