import { describe, expect, it } from "vitest";
import {
  allSceneIntersections,
  createCircleObject,
  createLineObject,
  createPointObject,
  createPolygonObject,
  generateLocus,
  measureGeometry2D,
  snapPointToGeometry,
  solveGeometry2DScene,
  transformGeometryObject,
  type Geometry2DScene,
} from "./geometry2dWorkspaceEngine";

describe("geometry 2D workspace engine", () => {
  it("creates dependency-aware objects and measurements", () => {
    const a = createPointObject("A", "A", 0, 0);
    const b = createPointObject("B", "B", 3, 4);
    const segment = createLineObject("s", "s", a, b, "segment");
    const circle = createCircleObject("c", "c", a, b);
    const polygon = createPolygonObject("tri", "tri", [a, b, createPointObject("C", "C", 3, 0)]);
    const scene: Geometry2DScene = { objects: [a, b, segment, circle, polygon], constraints: [] };
    const measurements = measureGeometry2D(scene);

    expect(segment.parents).toEqual(["A", "B"]);
    expect(measurements.find((item) => item.label === "s")?.value).toBe(5);
    expect(measurements.find((item) => item.label === "area tri")?.value).toBe(6);
    expect(measurements.some((item) => item.kind === "equation")).toBe(true);
  });

  it("solves exact midpoint constraints through the shared kernel", () => {
    const a = createPointObject("A", "A", 0, 0);
    const b = createPointObject("B", "B", 4, 0);
    const m = createPointObject("M", "M", 0, 0);
    const solved = solveGeometry2DScene({
      objects: [a, b, m],
      constraints: [{ id: "mid", type: "midpoint", target: "M", a: "A", b: "B" }],
    });

    const midpoint = solved.objects.find((object) => object.id === "M");
    expect(midpoint?.kind).toBe("point");
    if (midpoint?.kind === "point") expect(midpoint.point.x).toBe(2);
  });

  it("snaps to points, midpoints, objects, and intersections", () => {
    const a = createPointObject("A", "A", 0, 0);
    const b = createPointObject("B", "B", 10, 0);
    const c = createPointObject("C", "C", 5, -5);
    const d = createPointObject("D", "D", 5, 5);
    const horizontal = createLineObject("h", "h", a, b, "line");
    const vertical = createLineObject("v", "v", c, d, "line");
    const scene: Geometry2DScene = { objects: [a, b, c, d, horizontal, vertical], constraints: [] };

    expect(snapPointToGeometry({ x: 0.2, y: 0.1 }, scene, { gridSize: 1 }).kind).toBe("point");
    expect(snapPointToGeometry({ x: 5.1, y: 0.2 }, scene, { gridSize: 1 }).kind).toBe("intersection");
    expect(allSceneIntersections(scene)).toHaveLength(1);
  });

  it("transforms objects and creates loci", () => {
    const p = createPointObject("P", "P", 1, 0);
    const rotated = transformGeometryObject(p, { type: "rotate", center: { x: 0, y: 0 }, degrees: 90 });
    const mirrored = transformGeometryObject(p, { type: "mirror", a: { x: 0, y: 0 }, b: { x: 0, y: 1 } });
    const locus = generateLocus("locus", "locus", p, { center: { x: 0, y: 0 }, radius: 2, samples: 16 });

    expect(rotated.kind).toBe("point");
    if (rotated.kind === "point") expect(rotated.point.y).toBeCloseTo(1);
    expect(mirrored.kind).toBe("point");
    if (mirrored.kind === "point") expect(mirrored.point.x).toBeCloseTo(-1);
    expect(locus.kind).toBe("locus");
    if (locus.kind === "locus") expect(locus.points).toHaveLength(17);
  });
});
