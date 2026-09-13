import { describe, expect, it } from "vitest";
import {
  chordLengthFromCentral,
  chordThroughPoint,
  lineCircleIntersection,
  nearlyEqual,
  powerOfPoint,
  sectorArea,
  tangentContactPoints,
  tangentLength,
  vec,
} from "./circleMath";
import { circleModeUrl, parseCircleMode } from "./circleMode";

describe("circle math", () => {
  it("computes chord length from a central angle", () => {
    expect(chordLengthFromCentral(5, Math.PI)).toBeCloseTo(10, 8);
    expect(chordLengthFromCentral(5, Math.PI / 3)).toBeCloseTo(5, 8);
  });

  it("keeps radius perpendicular to a tangent from an external point", () => {
    const O = vec(0, 0);
    const P = vec(8, 0);
    const contacts = tangentContactPoints(O, 5, P);
    expect(contacts).toHaveLength(2);
    for (const T of contacts) {
      expect(Math.hypot(T.x, T.y)).toBeCloseTo(5, 8);
      expect(T.x * (T.x - P.x) + T.y * (T.y - P.y)).toBeCloseTo(0, 8);
      expect(tangentLength(5, 8)).toBeCloseTo(Math.hypot(T.x - P.x, T.y - P.y), 8);
    }
  });

  it("verifies intersecting-chords products equal the power of P", () => {
    const O = vec(0, 0);
    const P = vec(1.2, 0.4);
    const first = chordThroughPoint(O, 5, P, 0.4);
    const second = chordThroughPoint(O, 5, P, 1.1);
    expect(first && second).toBeTruthy();
    const left = first!.pa * first!.pb;
    const right = second!.pa * second!.pb;
    expect(left).toBeCloseTo(right, 8);
    expect(left).toBeCloseTo(Math.abs(powerOfPoint(O, 5, P)), 8);
  });

  it("computes sector area as a fraction of the disk", () => {
    expect(sectorArea(5, 90)).toBeCloseTo((Math.PI * 25) / 4, 8);
    expect(sectorArea(5, 360)).toBeCloseTo(Math.PI * 25, 8);
  });

  it("intersects a diameter line with the circle twice", () => {
    const hits = lineCircleIntersection(vec(-8, 0), vec(8, 0), vec(0, 0), 5);
    expect(hits).toHaveLength(2);
    expect(hits.map((p) => p.x).sort((a, b) => a - b)).toEqual([-5, 5]);
  });

  it("treats nearly-equal display checks as tolerant rounding", () => {
    expect(nearlyEqual(5.99, 6, 0.08)).toBe(true);
  });
});

describe("circle mode aliases", () => {
  it("normalizes legacy and canonical query values", () => {
    expect(parseCircleMode(null)).toBe("chords");
    expect(parseCircleMode("Tangents")).toBe("tangents");
    expect(parseCircleMode("tangents")).toBe("tangents");
    expect(parseCircleMode("Power of a Point")).toBe("power");
    expect(parseCircleMode("Power%20of%20a%20Point")).toBe("power");
    expect(parseCircleMode("Arcs & Sectors")).toBe("arcs");
    expect(parseCircleMode("Arcs%20%26%20Sectors")).toBe("arcs");
    expect(circleModeUrl("power")).toBe("Power of a Point");
    expect(circleModeUrl("arcs")).toBe("Arcs & Sectors");
  });
});
