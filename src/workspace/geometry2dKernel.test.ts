import { describe, expect, it } from "vitest";
import {
  circle,
  conic,
  intersectObjects,
  line,
  parseConicEquation,
  point,
  polygonArea,
  polygonPerimeter,
  proofHintsForRelation,
  ray,
  relationBetween,
  segment,
} from "./geometry2dKernel";

describe("geometry 2D kernel", () => {
  it("respects segment and ray boundaries during intersections", () => {
    const hit = intersectObjects(segment(point(0, 0), point(2, 0)), line(point(1, -1), point(1, 1)));
    const miss = intersectObjects(segment(point(0, 0), point(0.5, 0)), line(point(1, -1), point(1, 1)));
    const rayHit = intersectObjects(ray(point(0, 0), point(1, 0)), line(point(2, -1), point(2, 1)));

    expect(hit).toHaveLength(1);
    expect(hit[0].x).toBeCloseTo(1);
    expect(hit[0].y).toBeCloseTo(0);
    expect(hit[0].source).toBe("line-line");
    expect(miss).toHaveLength(0);
    expect(rayHit).toHaveLength(1);
  });

  it("finds line-circle intersections and tangent multiplicity", () => {
    const hits = intersectObjects(line(point(-3, 0), point(3, 0)), circle(point(0, 0), 2));
    const tangent = intersectObjects(line(point(-3, 2), point(3, 2)), circle(point(0, 0), 2));

    expect(hits.map((hit) => Math.round(hit.x))).toEqual([-2, 2]);
    expect(tangent).toHaveLength(1);
    expect(tangent[0].multiplicity).toBe(2);
  });

  it("parses conics and intersects a line with an ellipse", () => {
    const ellipse = parseConicEquation("x^2/9+y^2/4=1");
    expect(ellipse?.type).toBe("ellipse");

    const hits = intersectObjects(line(point(-5, 0), point(5, 0)), ellipse!);
    expect(hits.map((hit) => Math.round(hit.x))).toEqual([-3, 3]);
  });

  it("checks relations and proof hints", () => {
    const relation = relationBetween(line(point(0, 0), point(1, 1)), line(point(0, 1), point(1, 2)));
    expect(relation.relation).toBe("parallel");
    expect(proofHintsForRelation(relation)[0]).toContain("slopes");
  });

  it("handles conic-conic numeric intersections and polygon measures", () => {
    const first = conic([1, 0, 1, 0, 0, -4]);
    const second = conic([1, 0, 1, -2, 0, -3]);
    const hits = intersectObjects(first, second);

    expect(hits.length).toBeGreaterThanOrEqual(1);
    expect(polygonArea([point(0, 0), point(4, 0), point(4, 3)])).toBe(6);
    expect(polygonPerimeter([point(0, 0), point(4, 0), point(4, 3)])).toBe(12);
  });
});
