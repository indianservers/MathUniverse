import { describe, expect, it } from "vitest";
import {
  createTransformGizmo,
  cylinder3,
  intersect3,
  line3,
  object3Measurement,
  parsePlaneEquation,
  plane3,
  point3,
  snap3,
  sphere3,
  vector3,
} from "./geometry3dKernel";

describe("geometry 3D kernel", () => {
  it("finds line-plane intersections", () => {
    const hit = intersect3(line3(point3(0, 0, -2), vector3(0, 0, 1)), plane3(point3(0, 0, 1), vector3(0, 0, 1)));

    expect(hit).toHaveLength(1);
    expect(hit[0].kind).toBe("point");
    if (hit[0].kind === "point") expect(hit[0].point.z).toBeCloseTo(1);
  });

  it("finds plane-plane intersection lines", () => {
    const hit = intersect3(plane3(point3(0, 0, 0), vector3(1, 0, 0)), plane3(point3(0, 0, 0), vector3(0, 1, 0)));

    expect(hit).toHaveLength(1);
    expect(hit[0].kind).toBe("line");
    if (hit[0].kind === "line") expect(Math.abs(hit[0].line.direction.z)).toBeCloseTo(1);
  });

  it("creates sphere-plane circular slices", () => {
    const hit = intersect3(sphere3(point3(0, 0, 0), 3), plane3(point3(0, 0, 1), vector3(0, 0, 1)));

    expect(hit).toHaveLength(1);
    expect(hit[0].kind).toBe("circle");
    if (hit[0].kind === "circle") {
      expect(hit[0].center.z).toBeCloseTo(1);
      expect(hit[0].radius).toBeCloseTo(Math.sqrt(8));
    }
  });

  it("parses planes, measures solids, and creates transform handles", () => {
    const plane = parsePlaneEquation("z=2");
    const measurement = object3Measurement(cylinder3(point3(0, 0, 0), 2, 5));
    const handles = createTransformGizmo("scale");

    expect(plane?.point.z).toBe(2);
    expect(measurement.volume).toBeCloseTo(Math.PI * 20);
    expect(handles.map((handle) => handle.axis)).toEqual(["uniform", "x", "y", "z"]);
    expect(snap3(2.62, 0.25)).toBe(2.5);
  });
});
