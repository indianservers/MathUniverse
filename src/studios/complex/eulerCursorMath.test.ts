import { describe, it, expect } from "vitest";
import {
  cursorAngle,
  normalizedCursorAngle,
  nearestProjectedAngle,
} from "./eulerCursorMath";
describe("Euler cursor mapping", () => {
  it("maps four quadrants correctly", () => {
    expect(normalizedCursorAngle(1, 0)).toBe(0);
    expect(normalizedCursorAngle(0, 1)).toBe(90);
    expect(normalizedCursorAngle(-1, 0)).toBe(180);
    expect(normalizedCursorAngle(0, -1)).toBe(270);
  });
  it("preserves the nearest revolution across the seam", () => {
    expect(cursorAngle(1, 0.01, 359, 0)).toBeGreaterThan(360);
    expect(cursorAngle(1, -0.01, 361, 0)).toBeLessThan(360);
  });
  it("snaps to landmarks", () =>
    expect(cursorAngle(Math.cos(0.7), Math.sin(0.7), 40, 45)).toBe(45));
  it("bounds the available two turns", () => {
    expect(cursorAngle(1, 0.01, 720, 0)).toBe(720);
    expect(cursorAngle(1, -0.01, 0, 0)).toBe(0);
  });
  it("finds the projected helix point", () => {
    const project = (d: number) => {
      const t = (d * Math.PI) / 180;
      return [
        370 - 90 * Math.cos(t) + 90 * Math.sin(t),
        290 + 35 * Math.cos(t) + 35 * Math.sin(t) - 30 * t,
      ];
    };
    const p = project(120);
    expect(nearestProjectedAngle(p[0], p[1], project)).toBe(120);
  });
});
