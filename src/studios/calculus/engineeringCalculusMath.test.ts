import { describe, expect, it } from "vitest";
import {
  annulusInertia,
  boxTriple,
  cylinderVolume,
  diskInertia,
  foliumPoint,
  lagrangeCircle,
  lagrangeLine,
  logarithmicLimit,
  polarPoint,
  raabeLimit,
  ratioLimit,
  rationalCurve,
  rationalDerivative,
  rationalObliqueGap,
  rectangleCentroid,
  rectangleInertia,
  rightTriangleCentroid,
  runNamedTest,
  semicubical,
  seriesCases,
  sphereVolume,
  splitRegionOrder,
  taylorExp,
  taylorPolynomialExpansion,
  taylorTrig,
  triangleInertia,
  triangleOrder,
  variableDensityCentroid,
} from "./engineeringCalculusMath";

const series = (id: string) => seriesCases.find((item) => item.id === id)!;

describe("engineering calculus identities", () => {
  it("keeps inconclusive convergence tests inconclusive", () => {
    expect(runNamedTest(series("harmonic"), "nth").verdict).toBe("inconclusive");
    expect(runNamedTest(series("harmonic"), "ratio").verdict).toBe("inconclusive");
    expect(runNamedTest(series("geometric"), "limit-comparison").verdict).toBe("inconclusive");
    expect(runNamedTest(series("p2"), "limit-comparison").verdict).toBe("converges");
    expect(runNamedTest(series("alternating-harmonic"), "limit-comparison").verdict).toBe("not-applicable");
    expect(runNamedTest(series("harmonic"), "integral").verdict).toBe("diverges");
    expect(runNamedTest(series("p2"), "ratio").verdict).toBe("inconclusive");
    expect(runNamedTest(series("p2"), "raabe").verdict).toBe("converges");
    expect(raabeLimit(series("p2")).value).toBeGreaterThan(1.5);
    expect(runNamedTest(series("geometric"), "ratio").verdict).toBe("converges");
    expect(ratioLimit(series("geometric")).value).toBeCloseTo(0.5, 1);
    expect(runNamedTest(series("factorial"), "ratio").verdict).toBe("converges");
    expect(runNamedTest(series("sqrt"), "log").verdict).toBe("diverges");
    expect(logarithmicLimit(series("p2")).value).toBeGreaterThan(1.5);
    expect(runNamedTest(series("alternating-harmonic"), "alternating").verdict).toBe("converges");
    expect(runNamedTest(series("alternating-harmonic"), "absolute").verdict).toBe("diverges");
    expect(runNamedTest(series("alternating-p"), "absolute").verdict).toBe("converges");
    expect(runNamedTest(series("geometric"), "alternating").verdict).toBe("not-applicable");
  });

  it("traces validated curves and polar radii", () => {
    expect(rationalCurve(0)).toBeCloseTo(0);
    expect(rationalDerivative(0)).toBe(0);
    expect(rationalDerivative(2)).toBeCloseTo(4 / 9);
    expect(rationalObliqueGap(10)).toBeCloseTo(10 / 99);
    expect(Number.isNaN(rationalCurve(1))).toBe(true);
    const cusp = semicubical(0);
    expect(cusp?.upper).toBe(0);
    expect(cusp?.slope).toBe(0);
    expect(semicubical(-1)).toBeNull();
    expect(foliumPoint(1)).toEqual({ x: 1.5, y: 1.5 });
    expect(polarPoint(0, "cardioid")).toBe(2);
    expect(polarPoint(Math.PI, "cardioid")).toBeCloseTo(0);
    expect(polarPoint(Math.PI, "limacon")).toBeCloseTo(-1);
    expect(polarPoint(0, "rose")).toBeCloseTo(1);
    expect(polarPoint(Math.PI / 4, "lemniscate")).toBeCloseTo(0);
  });

  it("matches Taylor, Lagrange, order reversal, and inertia formulas", () => {
    const exp = taylorExp(0, 0, 0.1, -0.05);
    expect(exp.quadratic).toBeCloseTo(Math.exp(0.05), 4);
    const trig = taylorTrig(0, 0, 0.2, 0.1);
    expect(trig.linear).toBeCloseTo(0.2);
    expect(trig.hessian[0][0]).toBeCloseTo(0);
    const poly = taylorPolynomialExpansion(1, 0, 0.3, -0.2);
    expect(poly.quadratic).toBeCloseTo(poly.f);
    const circle = lagrangeCircle(1);
    expect(circle.max.value).toBeCloseTo(Math.sqrt(2));
    expect(circle.max.x).toBeCloseTo(circle.max.y);
    expect(lagrangeLine()).toEqual({ x: 0.5, y: 0.5, value: 0.5, lambda: 1 });
    expect(triangleOrder().equal).toBe(true);
    expect(splitRegionOrder().equal).toBe(true);
    expect(rectangleCentroid(4, 2)).toEqual({ x: 2, y: 1, area: 8 });
    expect(variableDensityCentroid(2, 1, 0).x).toBeCloseTo(1);
    expect(rightTriangleCentroid()).toEqual({ x: 2 / 3, y: 1 / 3, area: 0.5 });
    expect(rectangleInertia(2, 3, 1).ix).toBeCloseTo(18);
    expect(diskInertia(2, 1).io).toBeCloseTo(0.5 * Math.PI * 16);
    expect(annulusInertia(1, 2, 1).io).toBeCloseTo(0.5 * Math.PI * (16 - 1));
    expect(triangleInertia().io).toBeCloseTo(1 / 3);
    expect(boxTriple(2, 2, 2).volume).toBe(8);
    expect(cylinderVolume(1, 2)).toBeCloseTo(2 * Math.PI);
    expect(sphereVolume(1)).toBeCloseTo((4 / 3) * Math.PI);
  });
});
