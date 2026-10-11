import { describe, expect, it } from "vitest";
import { angleChord, angleFromChord } from "./copyAngleMath";

describe("compass angle construction", () => {
  it("copies acute, right and obtuse angles at different compass radii", () => {
    for (const angle of [15, 36, 72, 90, 108, 150]) {
      for (const radius of [1.5, 2.5, 3.5]) {
        expect(angleFromChord(angleChord(angle, radius), radius)).toBeCloseTo(
          angle,
          10,
        );
      }
    }
  });
  it("distinguishes a wrong radius from a congruent construction", () => {
    const chord = angleChord(60, 2.5);
    expect(angleFromChord(chord, 3)).toBeLessThan(60);
    expect(angleFromChord(chord, 2)).toBeGreaterThan(60);
  });
  it("rejects impossible intersections and includes the diameter boundary", () => {
    expect(angleFromChord(5.1, 2.5)).toBeNull();
    expect(angleFromChord(5, 2.5)).toBe(180);
    expect(angleFromChord(1, 0)).toBeNull();
  });
});
