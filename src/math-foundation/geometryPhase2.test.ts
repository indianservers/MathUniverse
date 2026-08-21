import { describe, expect, it } from "vitest";
import { circle, line, point } from "../workspace/geometry2dKernel";
import { applyAffine, composeAffine, constructCircumcircle, dilationMatrix, intersectGeometry, inverseAffine, reflectionAcrossLineMatrix, rotationMatrix, translationMatrix } from "./geometryPhase2";

describe("phase 2 geometry invariants", () => {
  it("constructs a circumcircle and exposes its construction identity", () => {
    const result = constructCircumcircle(point(0, 0), point(4, 0), point(0, 3));
    expect(result.status).toBe("EXACT");
    expect(result.value?.center).toEqual({ x: 2, y: 1.5 });
    expect(result.value?.radius).toBeCloseTo(2.5, 10);
    expect(result.value?.algebraicEquation).toContain("^2");
  });

  it("fails deterministically for collinear circumcircle inputs", () => {
    const result = constructCircumcircle(point(0, 0), point(1, 1), point(2, 2));
    expect(result.status).toBe("DEGENERATE");
    expect(result.diagnostics[0].code).toBe("COLLINEAR_CIRCUMCIRCLE_INPUT");
  });

  it("distinguishes parallel, coincident, and multiple intersections", () => {
    expect(intersectGeometry(line(point(0, 0), point(1, 0)), line(point(0, 1), point(1, 1))).status).toBe("NO_SOLUTION");
    expect(intersectGeometry(line(point(0, 0), point(1, 0)), line(point(2, 0), point(3, 0))).status).toBe("INFINITE");
    expect(intersectGeometry(line(point(-2, 0), point(2, 0)), circle(point(0, 0), 1)).status).toBe("MULTIPLE");
  });

  it("composes and inverts affine transformations", () => {
    const matrix = composeAffine(translationMatrix(3, -2), composeAffine(rotationMatrix(Math.PI / 2), dilationMatrix(2)));
    const transformed = applyAffine(matrix, point(1, 2));
    const inverse = inverseAffine(matrix);
    expect(inverse.status).toBe("EXACT");
    expect(applyAffine(inverse.value!, transformed).x).toBeCloseTo(1, 10);
    expect(applyAffine(inverse.value!, transformed).y).toBeCloseTo(2, 10);
    const reflected = applyAffine(reflectionAcrossLineMatrix(0), point(2, 3));
    expect(reflected).toEqual({ x: 2, y: -3 });
  });
});
