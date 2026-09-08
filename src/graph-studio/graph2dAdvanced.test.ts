import { describe, expect, it } from "vitest";
import { regressionModel } from "./dataAnalysis";
import { sampleAdvancedGraphExpression } from "./advancedGraphLayers";
import {
  buildTransformationExpression,
  detectGraphAsymptotes,
  precisionSnapX,
  sampleTaylorPolynomial,
} from "./graph2dAdvanced";

describe("Graph Studio 2D advanced workflows", () => {
  it("fits quadratic and exponential models with fit statistics", () => {
    const quadratic = regressionModel(
      [-2, -1, 0, 1, 2].map((x) => ({ x, y: 2 * x * x + 3 * x + 1 })),
      "quadratic",
    );
    const exponential = regressionModel(
      [0, 1, 2, 3].map((x) => ({ x, y: 2 * Math.exp(0.5 * x) })),
      "exponential",
    );
    expect(quadratic?.rSquared).toBeCloseTo(1, 8);
    expect(quadratic?.coefficients).toEqual(
      expect.arrayContaining([
        expect.closeTo(1),
        expect.closeTo(3),
        expect.closeTo(2),
      ]),
    );
    expect(exponential?.rmse).toBeLessThan(1e-8);
  });

  it("builds Taylor overlays and transformation expressions", () => {
    const taylor = sampleTaylorPolynomial("sin(x)", 0, 5, -1, 1, 101);
    const middle = taylor.points[50];
    expect(middle.y).toBeCloseTo(0, 5);
    expect(buildTransformationExpression("x^2", 2, 1, 3, -1)).toContain(
      "x-(3)",
    );
  });

  it("samples cobweb and bounded parametric layers", () => {
    const cobweb = sampleAdvancedGraphExpression(
      "cobweb(0.2,3.2*prev*(1-prev),8)",
      -2,
      2,
    );
    const parametric = sampleAdvancedGraphExpression(
      "param(3*cos(t),2*sin(t),0,2*pi)",
      -4,
      4,
    );
    expect(cobweb?.family).toBe("cobweb");
    expect(cobweb?.points.length).toBe(17);
    expect(parametric?.points).toHaveLength(720);
  });

  it("detects asymptotes and snaps to nearby features", () => {
    const points = Array.from({ length: 201 }, (_, index) => {
      const x = -5 + index / 20;
      const y = Math.abs(x - 1) < 1e-8 ? null : 1 / (x - 1);
      return { x, y, valid: y !== null };
    });
    expect(
      detectGraphAsymptotes(points, -5, 5).vertical.some(
        (x) => Math.abs(x - 1) < 0.1,
      ),
    ).toBe(true);
    expect(precisionSnapX(1.04, [{ x: 1 }], 10)).toBe(1);
  });
});
