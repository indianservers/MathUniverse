import { describe, expect, it } from "vitest";
import {
  allSceneIntersections,
  createCircleObject,
  createLineObject,
  createPointObject,
  createPolygonObject,
  dragGeometryPoint,
  generateLocus,
  measureGeometry2D,
  snapPointToGeometry,
  solveGeometry2DScene,
  solveGeometry2DSceneWithDiagnostics,
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

  it("recomputes parent-based objects after point dragging", () => {
    const a = createPointObject("A", "A", 0, 0);
    const b = createPointObject("B", "B", 4, 0);
    const segment = createLineObject("segment-id", "AB", a, b, "segment");
    const circle = createCircleObject("circle-id", "c", a, b);
    const polygon = createPolygonObject("poly-id", "tri", [a, b, createPointObject("C", "C", 0, 3)]);
    const dragged = dragGeometryPoint({ objects: [a, b, segment, circle, polygon], constraints: [] }, "B", { x: 0, y: 4 });

    const nextSegment = dragged.objects.find((object) => object.id === "segment-id");
    const nextCircle = dragged.objects.find((object) => object.id === "circle-id");
    const nextPolygon = dragged.objects.find((object) => object.id === "poly-id");
    expect(dragged.valid).toBe(true);
    expect(nextSegment?.kind).toBe("segment");
    if (nextSegment?.kind === "segment") expect(nextSegment.object.b.y).toBe(4);
    expect(nextCircle?.kind).toBe("circle");
    if (nextCircle?.kind === "circle") expect(nextCircle.object.radius).toBe(4);
    expect(nextPolygon?.kind).toBe("polygon");
    if (nextPolygon?.kind === "polygon") expect(nextPolygon.points[1].y).toBe(4);
  });

  it("projects points onto supported objects and surfaces diagnostics", () => {
    const p = createPointObject("P", "P", 4, 0);
    const center = createPointObject("O", "O", 0, 0);
    const edge = createPointObject("A", "A", 2, 0);
    const c = createCircleObject("circle-id", "c", center, edge);
    const solved = solveGeometry2DSceneWithDiagnostics({
      objects: [p, center, edge, c],
      constraints: [
        { id: "on-circle", type: "on-object", target: "P", object: "circle-id" },
        { id: "missing", type: "on-line", target: "Q", line: "ghost" },
      ],
    }, "P");

    const projected = solved.objects.find((object) => object.id === "P");
    expect(solved.valid).toBe(false);
    expect(projected?.kind).toBe("point");
    if (projected?.kind === "point") expect(projected.point.x).toBeCloseTo(2);
    expect(solved.diagnostics.some((item) => item.constraintId === "missing")).toBe(true);
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
