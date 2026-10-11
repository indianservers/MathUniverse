import { describe, it, expect } from "vitest";
import { circuitValues, circuitSignal } from "./wavesReferenceMath";
describe("circuit physics", () => {
  it("computes the bypassed capacitor RL circuit", () => {
    const q = circuitValues(50, 0.1, 0, 40);
    expect(q.xl).toBeCloseTo(10 * Math.PI);
    expect(q.xc).toBe(0);
    expect(q.magnitude).toBeCloseTo(Math.hypot(40, 10 * Math.PI));
    expect(q.phase).toBeGreaterThan(0);
  });
  it("computes capacitive current lead and power factor", () => {
    const q = circuitValues(50, 0.1, 0.0001, 40);
    expect(q.x).toBeLessThan(0);
    expect((q.phase! * 180) / Math.PI).toBeCloseTo(-0.5947, 3);
    expect(q.powerFactor).toBeCloseTo(0.999946, 5);
  });
  it("has unity power factor at resonance", () => {
    const w = 2 * Math.PI * 50;
    const q = circuitValues(50, 0.1, 1 / (w * w * 0.1), 40);
    expect(q.x).toBeCloseTo(0);
    expect(q.phase).toBeCloseTo(0);
    expect(q.powerFactor).toBeCloseTo(1);
  });
  it("handles an ideal short without a fictitious phase", () => {
    const q = circuitValues(50, 0, 0, 0);
    expect(q.magnitude).toBe(0);
    expect(q.phase).toBeNull();
    expect(q.powerFactor).toBeNull();
    expect(q.current).toBeNull();
  });
  it("makes current lag voltage for positive impedance phase", () => {
    const phase = Math.PI / 3;
    expect(circuitSignal(phase, phase).current).toBeCloseTo(1);
    expect(circuitSignal(0, phase).current).toBeCloseTo(0.5);
    expect(circuitSignal(0, phase).voltage).toBe(1);
  });
});
