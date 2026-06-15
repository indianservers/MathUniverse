import { describe, expect, it } from "vitest";
import {
  degToRad,
  formatTrigValue,
  getExactTrigValues,
  getQuadrant,
  normalizeDegrees,
  radToDeg,
  safeTan,
} from "./UnitCircleMasterVisualizer";

describe("UnitCircleMasterVisualizer math helpers", () => {
  it("converts and normalizes angles safely", () => {
    expect(radToDeg(degToRad(180))).toBeCloseTo(180);
    expect(normalizeDegrees(-45)).toBe(315);
    expect(normalizeDegrees(405)).toBe(45);
    expect(normalizeDegrees(720)).toBe(0);
  });

  it("detects quadrants and axes from normalized degrees", () => {
    expect(getQuadrant(0)).toBe("axis");
    expect(getQuadrant(30)).toBe("I");
    expect(getQuadrant(120)).toBe("II");
    expect(getQuadrant(225)).toBe("III");
    expect(getQuadrant(315)).toBe("IV");
    expect(getQuadrant(270)).toBe("axis");
  });

  it("keeps tangent finite or undefined without NaN and Infinity text", () => {
    expect(safeTan(degToRad(45))).toBeCloseTo(1);
    expect(safeTan(degToRad(90))).toBeNull();
    expect(safeTan(degToRad(270))).toBeNull();
    expect(formatTrigValue(safeTan(degToRad(90)))).toBe("undefined");
    expect(formatTrigValue(Number.POSITIVE_INFINITY)).toBe("undefined");
    expect(formatTrigValue(Number.NaN)).toBe("undefined");
  });

  it("returns exact values for special snap angles", () => {
    expect(getExactTrigValues(30)).toMatchObject({ radians: "pi/6", sin: "1/2", cos: "sqrt(3)/2" });
    expect(getExactTrigValues(45)).toMatchObject({ radians: "pi/4", tan: "1" });
    expect(getExactTrigValues(90)).toMatchObject({ radians: "pi/2", tan: "undefined" });
    expect(getExactTrigValues(360)).toMatchObject({ radians: "2pi", cos: "1" });
    expect(getExactTrigValues(120)).toBeNull();
  });
});
