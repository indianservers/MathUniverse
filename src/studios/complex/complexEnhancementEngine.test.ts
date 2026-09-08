import { describe, expect, it } from "vitest";
import * as c from "./complexEnhancementEngine";
const z = { re: 1, im: 1 };

describe("Complex enhancement engine", () => {
  it("covers arithmetic, forms, loci, powers, roots, and unity", () => {
    expect(c.draggableArithmetic(z, { re: 1, im: -1 }).product).toEqual({ re: 2, im: 0 });
    expect(c.synchronizeForms(z).polar.modulus).toBeCloseTo(Math.sqrt(2));
    expect(c.locus("circle", 2)).toHaveLength(36);
    expect(c.deMoivre(z, 2).re).toBeCloseTo(0);
    expect(c.deMoivre(z, 2).im).toBeCloseTo(2);
    expect(c.nthRoots({ re: 1, im: 0 }, 4)).toHaveLength(4);
    expect(c.rootsOfUnity(3).reduce((sum, value) => c.add(sum, value), { re: 0, im: 0 }).re).toBeCloseTo(0);
  });
  it("covers mappings and complex analysis", () => {
    expect(c.mobius(z, { re: 1, im: 0 }, { re: 0, im: 0 }, { re: 0, im: 0 }, { re: 1, im: 0 })).toEqual(z);
    expect(c.mappedGrid((value) => c.multiply(value, value)).horizontal).toHaveLength(5);
    expect(c.cauchyRiemann((value) => c.multiply(value, value), z).analyticCandidate).toBe(true);
    expect(c.complexDerivative((value) => c.multiply(value, value), z).residual).toBeLessThan(1e-4);
    const integral = c.contourIntegral((value) => c.divide({ re: 1, im: 0 }, value), (t) => ({ re: Math.cos(2 * Math.PI * t), im: Math.sin(2 * Math.PI * t) }));
    expect(integral.im).toBeCloseTo(2 * Math.PI, 3);
    expect(c.simpleResidue(() => ({ re: 1, im: 0 }), () => ({ re: 2, im: 0 }), z)).toEqual({ re: .5, im: 0 });
  });
  it("covers branches, sphere, dynamics, phasors, roots and Fourier", () => {
    expect(c.zeroPoleMap([{ z, multiplicity: 2 }], []).totalZeroOrder).toBe(2);
    expect(c.principalLog({ re: -1, im: 0 }).onBranchCut).toBe(true);
    expect(c.stereographicProjection({ re: 0, im: 0 }).z).toBe(-1);
    expect(c.mandelbrot({ re: 2, im: 2 }).escaped).toBe(true);
    expect(c.julia(z, { re: -.4, im: .6 }, 10).orbit.length).toBeGreaterThan(1);
    expect(c.eulerPhasor(2, Math.PI / 2).value.im).toBeCloseTo(2);
    const roots = c.polynomialRoots([{ re: 1, im: 0 }, { re: 0, im: 0 }, { re: -1, im: 0 }]);
    expect(roots.some((root) => Math.abs(root.re - 1) < 1e-5)).toBe(true);
    expect(c.discreteFourier([1, 1, 1, 1])[0].re).toBe(4);
  });
  it("covers applications, precision, and quaternion bridge", () => {
    expect(c.seriesImpedance(10, 1, 1, 1).z).toEqual({ re: 10, im: 0 });
    expect(c.quantumInterference([{ re: 1, im: 0 }, { re: -1, im: 0 }]).probability).toBe(0);
    expect(c.conformalRegion((value) => value, [{ re: 0, im: 0 }, { re: 1, im: 0 }, { re: 1, im: 1 }, { re: 0, im: 1 }]).orientation).toBe(1);
    expect(c.rootSensitivity(z, { re: .01, im: 0 }).absoluteChange).toBe(.01);
    expect(c.quaternionRotation([0, 0, 1], Math.PI).z).toBeCloseTo(1);
  });
});
