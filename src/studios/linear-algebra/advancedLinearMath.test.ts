import { describe, expect, it } from "vitest";
import {
  cayleyHamilton,
  classifyQuadratic,
  cubicRoots,
  det,
  diagonal3Presets,
  diagonalize2,
  inverse,
  inverseFromCayley,
  jordanCheck,
  jordanPresets,
  leastSquaresQr,
  luFactor,
  matrixPower2,
  multiplicity3,
  multiply,
  powerCoefficients2,
  powerCoefficients3,
  principalAxes,
  qrFactor,
  similarMatrix,
  svd2,
  trace,
} from "./advancedLinearMath";

describe("advanced linear algebra identities", () => {
  const rotation = [[0, -1], [1, 0]];
  const shear = [[1, 1], [0, 1]];
  const diagonal = [[1, 0, 0], [0, 2, 0], [0, 0, 3]];

  it("checks Cayley–Hamilton, powers, and the inverse formula", () => {
    expect(cayleyHamilton(shear).zero).toBe(true);
    expect(cayleyHamilton(diagonal).zero).toBe(true);
    const coefficients = powerCoefficients2(trace(shear), det(shear), 4);
    const powered = matrixPower2(shear, 4);
    expect(powered[0][1]).toBeCloseTo(4);
    expect(coefficients.alpha).toBeCloseTo(powered[0][1]);
    const inverseShear = inverseFromCayley(shear);
    expect(inverseShear?.inverse).toEqual([[1, -1], [0, 1]]);
    expect(inverseFromCayley([[1, 2], [2, 4]])).toBeNull();
    const cubic = powerCoefficients3(6, 11, 6, 3);
    const cube = [[1, 0, 0], [0, 8, 0], [0, 0, 27]];
    const rebuilt = [
      [cubic.alpha + cubic.gamma, 0, 0],
      [0, cubic.alpha * 4 + cubic.beta * 2 + cubic.gamma, 0],
      [0, 0, cubic.alpha * 9 + cubic.beta * 3 + cubic.gamma],
    ];
    expect(rebuilt[1][1]).toBeCloseTo(cube[1][1]);
  });

  it("classifies diagonalizable and defective matrices", () => {
    const distinct = diagonalize2([[2, 0], [0, 5]]);
    expect(distinct.diagonalizable).toBe(true);
    expect(distinct.rebuilt?.[0][0]).toBeCloseTo(2);
    const repeated = diagonalize2([[4, 0], [0, 4]]);
    expect(repeated.diagonalizable).toBe(true);
    expect(repeated.geometric).toEqual([2]);
    const defective = diagonalize2([[2, 1], [0, 2]]);
    expect(defective.diagonalizable).toBe(false);
    expect(defective.geometric).toEqual([1]);
    expect(diagonalize2(rotation).diagonalizable).toBe(false);
    const roots = cubicRoots(-6, 11, -6).map((root) => root.real).sort((a, b) => a - b);
    expect(roots[0]).toBeCloseTo(1);
    expect(roots[2]).toBeCloseTo(3);
    for (const preset of diagonal3Presets) {
      expect(multiplicity3(preset.matrix, preset.eigenvalues[0])).toBe(preset.geometric[0]);
      expect(preset.diagonalizable).toBe(preset.geometric[0] >= preset.algebraic[0] && preset.geometric.every((value, index) => value >= preset.algebraic[index]));
    }
  });

  it("classifies quadratic forms and rotates to principal axes", () => {
    expect(classifyQuadratic(2, 0, 3).type).toBe("positive definite");
    expect(classifyQuadratic(1, 2, 1).type).toBe("indefinite");
    expect(classifyQuadratic(1, 1, 1).type).toBe("positive semidefinite");
    expect(classifyQuadratic(1, 1, 1).sylvester).toMatch(/does not classify/i);
    const axes = principalAxes(2, 1, 2);
    expect(axes.orthonormal).toBe(true);
    const diagonals = [axes.canonical?.[0][0] ?? 0, axes.canonical?.[1][1] ?? 0].sort((left, right) => left - right);
    expect(diagonals[0]).toBeCloseTo(1);
    expect(diagonals[1]).toBeCloseTo(3);
    expect(axes.canonical?.[0][1]).toBeCloseTo(0);
  });

  it("factors LU, QR, and SVD and preserves similarity invariants", () => {
    const pivoted = luFactor([[0, 2], [1, 3]]);
    expect(pivoted.matches).toBe(true);
    expect(pivoted.steps.some((step) => step.startsWith("Swap"))).toBe(true);
    const singular = luFactor([[1, 2], [2, 4]]);
    expect(singular.singular).toBe(true);
    const qr = qrFactor([[1, 1], [0, 1]]);
    expect(qr.orthonormal).toBe(true);
    expect(qr.matches).toBe(true);
    const fit = leastSquaresQr([[1, 0], [1, 1]], [0, 2]);
    expect(fit?.solution[1]).toBeCloseTo(2);
    const svd = svd2([[3, 0], [0, 1]]);
    expect(svd?.matches).toBe(true);
    expect(svd?.singular[0]).toBeCloseTo(3);
    expect(svd?.rank).toBe(2);
    const similar = similarMatrix([[2, 0], [0, 3]], [[1, 1], [0, 1]]);
    expect(similar?.sameTrace).toBe(true);
    expect(similar?.sameDeterminant).toBe(true);
    expect(similar?.samePolynomial).toBe(true);
    expect(similarMatrix([[2, 0], [0, 3]], [[1, 2], [2, 4]])).toBeNull();
    expect(inverse([[1, 2], [2, 4]])).toBeNull();
    for (const preset of jordanPresets) {
      const check = jordanCheck(preset);
      expect(check.geometric).toBe(1);
      expect(check.diagonalizable).toBe(false);
      if (preset.matrix.length === 2) expect(check.matches).toBe(true);
    }
    expect(multiply(inverse([[1, 1], [0, 1]]) ?? [], [[1, 1], [0, 1]])[0][1]).toBeCloseTo(0);
  });
});
