import { describe, expect, it } from "vitest";
import { circle, line, point } from "./geometry2dKernel";
import { line3, plane3, point3, vector3 } from "./geometry3dKernel";
import { solveExact2D, solveExact3D } from "./constructionKernels";

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
});
