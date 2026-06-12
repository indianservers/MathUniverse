import { describe, expect, it } from "vitest";
import { circle, distanceBetween, line, point } from "./geometry2dKernel";
import { line3, plane3, point3, vector3 } from "./geometry3dKernel";
import { solveExact2D, solveExact2DWithDiagnostics, solveExact3D } from "./constructionKernels";

describe("exact construction kernels", () => {
  it("solves dependent 2D midpoint, fixed-distance, and intersection constraints", () => {
    const solved = solveExact2D({
      points: {
        A: point(0, 0),
        B: point(4, 0),
        M: point(0, 0),
        P: point(5, 0),
        X: point(0, 0),
      },
      objects: {
        horizontal: line(point(0, 0), point(4, 0)),
        vertical: line(point(2, -2), point(2, 2)),
        c: circle(point(0, 0), 2),
      },
      constraints: [
        { id: "mid", type: "midpoint", target: "M", a: "A", b: "B" },
        { id: "fixed", type: "fixed-distance", target: "P", anchor: "A", distance: 2 },
        { id: "hit", type: "intersection", target: "X", first: "horizontal", second: "vertical" },
      ],
    });

    expect(solved.points.M.x).toBe(2);
    expect(solved.points.P.x).toBe(2);
    expect(solved.points.X.x).toBe(2);
    expect(solved.points.X.y).toBeCloseTo(0);
  });

  it("solves shared 3D line-plane constraints", () => {
    const solved = solveExact3D({
      points: { X: point3(0, 0, 0) },
      objects: {
        l: line3(point3(0, 0, -2), vector3(0, 0, 1)),
        p: plane3(point3(0, 0, 1), vector3(0, 0, 1)),
      },
      constraints: [{ id: "i", type: "line-plane-intersection", target: "X", line: "l", plane: "p" }],
    });

    expect(solved.points.X.z).toBe(1);
  });

  it("solves GeoGebra-style 2D relation constraints", () => {
    const solved = solveExact2D({
      points: {
        A: point(0, 0),
        B: point(4, 0),
        C: point(0, 3),
        D: point(0, 9),
        E: point(3, 3),
        T: point(2, 0),
      },
      objects: {
        reference: line(point(0, 0), point(4, 0)),
        parallel: line(point(0, 3), point(1, 4)),
        perpendicular: line(point(0, 3), point(1, 4)),
        c: circle(point(0, 0), 2),
        tangent: line(point(2, 0), point(2, 1)),
      },
      constraints: [
        { id: "parallel", type: "parallel", target: "parallel", reference: "reference", through: "C" },
        { id: "perpendicular", type: "perpendicular", target: "perpendicular", reference: "reference", through: "C" },
        { id: "equal", type: "equal-length", target: "D", anchor: "C", a: "A", b: "B" },
        { id: "tangent", type: "tangent", target: "tangent", circle: "c", at: "T" },
        { id: "angle", type: "angle", target: "E", vertex: "C", reference: "D", degrees: 90 },
      ],
    });

    expect(solved.objects.parallel.kind).toBe("line");
    if (solved.objects.parallel.kind === "line") expect(solved.objects.parallel.b.y).toBeCloseTo(solved.objects.parallel.a.y);
    expect(solved.objects.perpendicular.kind).toBe("line");
    if (solved.objects.perpendicular.kind === "line") expect(solved.objects.perpendicular.b.x).toBeCloseTo(solved.objects.perpendicular.a.x);
    expect(distanceBetween(solved.points.C, solved.points.D)).toBeCloseTo(4);
    expect(solved.objects.tangent.kind).toBe("line");
    if (solved.objects.tangent.kind === "line") expect(solved.objects.tangent.a.x).toBeCloseTo(solved.objects.tangent.b.x);
    expect(solved.points.E.x).toBeCloseTo(-3);
    expect(solved.points.E.y).toBeCloseTo(3);
  });

  it("reports invalid or undefined constraints without throwing", () => {
    const solved = solveExact2DWithDiagnostics({
      points: { X: point(0, 0) },
      objects: {
        a: line(point(0, 0), point(1, 0)),
        b: line(point(0, 1), point(1, 1)),
      },
      constraints: [
        { id: "missing", type: "midpoint", target: "M", a: "A", b: "B" },
        { id: "parallel-hit", type: "intersection", target: "X", first: "a", second: "b" },
      ],
    });

    expect(solved.valid).toBe(false);
    expect(solved.diagnostics.some((item) => item.constraintId === "missing" && item.severity === "error")).toBe(true);
    expect(solved.diagnostics.some((item) => item.constraintId === "parallel-hit" && item.severity === "warning")).toBe(true);
  });
});
