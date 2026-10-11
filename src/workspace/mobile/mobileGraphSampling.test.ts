import { describe, it, expect } from "vitest";
import { createGraph3DSurface } from "../../graph-studio/graph3dSurfaceModel";
import { sampleMobileLayer } from "./mobileGraphSampling";
describe("mobile background sampling", () => {
  it("samples explicit surfaces with variables and domain restrictions", () => {
    const surface = { ...createGraph3DSurface("x^2+y^2"), adaptive: false, domainPredicate: "x>=0" };
    const layer = sampleMobileLayer(surface, { surfaces: [surface], variables: [], xRange: 3, yRange: 3, resolution: 20 });
    expect(layer.samples.grid.flat().some(p => p.x < 0 && !p.valid)).toBe(true);
    expect(layer.samples.grid.flat().some(p => p.x >= 0 && p.valid && p.z !== null)).toBe(true);
  });
  it("samples a parametric curve independently of the UI", () => {
    const surface = { ...createGraph3DSurface(), kind: "curve" as const, components: { x: "cos(t)", y: "sin(t)", z: "t" } };
    const layer = sampleMobileLayer(surface, { surfaces: [surface], variables: [], xRange: 3, yRange: 3, resolution: 20 });
    expect(layer.advanced.error).toBeUndefined();expect(layer.advanced.curve!.length).toBeGreaterThan(100);
  });
});
