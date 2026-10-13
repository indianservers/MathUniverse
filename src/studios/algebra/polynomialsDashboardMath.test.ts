import { describe, expect, it } from 'vitest';
import { coefficientsFromFactors, divideCoefficients, endBehavior, groupedRoots, initialRoots, parseDivisor, polynomialAt } from './polynomialsDashboardMath';
import { fitPolynomial } from './PolynomialsGraph';
const coefficients = coefficientsFromFactors(initialRoots(), .08);
describe('polynomial dashboard models', () => {
  it('expands the stated roots and leading coefficient correctly', () => {
    [.08, -.16, -1.04, 1.12, 1.92].forEach((n, i) => expect(coefficients[i]).toBeCloseTo(n));
    for (const root of initialRoots()) expect(polynomialAt(coefficients, root.value)).toBeCloseTo(0);
    expect(polynomialAt(coefficients, 0)).toBeCloseTo(1.92);
  });
  it('combines repeated roots and counts actual degree', () => {
    const roots = initialRoots(); roots[1].value = -3; roots[0].multiplicity = 2;
    expect(groupedRoots(roots)[0].multiplicity).toBe(3);
    expect(coefficientsFromFactors(roots, .08)).toHaveLength(6);
  });
  it('changes crossing to touching with even multiplicity', () => {
    const one = [{ id: 1, value: 2, multiplicity: 1 }], two = [{ ...one[0], multiplicity: 2 }];
    expect(polynomialAt(coefficientsFromFactors(one, 1), 1.9)).toBeLessThan(0);
    expect(polynomialAt(coefficientsFromFactors(one, 1), 2.1)).toBeGreaterThan(0);
    expect(polynomialAt(coefficientsFromFactors(two, 1), 1.9)).toBeGreaterThan(0);
    expect(polynomialAt(coefficientsFromFactors(two, 1), 2.1)).toBeGreaterThan(0);
  });
  it('matches the reference synthetic division quotient and zero remainder', () => {
    const result = divideCoefficients(coefficients, [1, 1]); expect(result.ok).toBe(true);
    if (result.ok) { [.08, -.24, -.8, 1.92].forEach((n, i) => expect(result.quotient[i]).toBeCloseTo(n)); expect(result.remainder[0]).toBeCloseTo(0); }
  });
  it('satisfies the remainder theorem for a non-root divisor', () => {
    const result = divideCoefficients(coefficients, [1, -1]);
    expect(result.ok && result.remainder[0]).toBeCloseTo(polynomialAt(coefficients, 1));
  });
  for (const denominator of [[1, 0, -1], [2, 2], [3], [1, 0, 0, 0, 0, 1]]) it(`checks the long-division identity for ${denominator}`, () => {
    const result = divideCoefficients(coefficients, denominator); expect(result.ok).toBe(true);
    if (result.ok) for (const x of [-4, -1, 0, 1.5, 5]) expect(polynomialAt(denominator, x) * polynomialAt(result.quotient, x) + polynomialAt(result.remainder, x)).toBeCloseTo(polynomialAt(coefficients, x), 7);
  });
  it('rejects zero or invalid divisors', () => {
    expect(divideCoefficients(coefficients, [0]).ok).toBe(false);
    expect(parseDivisor('0').ok).toBe(false);
    expect(parseDivisor('sin(x)').ok).toBe(false);
    expect(parseDivisor('1/x').ok).toBe(false);
    expect(parseDivisor('x/(x+1)').ok).toBe(false);
    expect(parseDivisor('x^0.5').ok).toBe(false);
    expect(parseDivisor('x^2-1').ok).toBe(true);
  });
  it('reports all four parity/sign cases and constant/zero exceptions', () => {
    expect(endBehavior(4, .08).text).toBe('Both ends rise.');
    expect(endBehavior(4, -.08).text).toBe('Both ends fall.');
    expect(endBehavior(3, .08).text).toBe('Left falls; right rises.');
    expect(endBehavior(3, -.08).text).toBe('Left rises; right falls.');
    expect(endBehavior(4, 0).text).toBe('Zero polynomial');
    expect(endBehavior(0, .08).text).toBe('Constant polynomial');
  });
  it('parses polynomial structure, implicit multiplication and decimal coefficients', () => {
    const decimal = parseDivisor('0.08x^3 - 0.24x^2 - 0.8x + 1.92');
    expect(decimal.ok && decimal.coefficients).toEqual([.08, -.24, -.8, 1.92]);
    const product = parseDivisor('(x+1)(x-2)'); expect(product.ok && product.coefficients).toEqual([1, -1, -2]);
    expect(parseDivisor('x^8 + 1').ok).toBe(true);
    expect(parseDivisor('x^9 + 1').ok).toBe(false);
    expect(parseDivisor('(x+1').ok).toBe(false);
    expect(parseDivisor('x/0').ok).toBe(false);
    const signed = parseDivisor('-x^2 + 1'); expect(signed.ok && signed.coefficients).toEqual([-1, 0, 1]);
  });
  it('keeps zoom fitting finite for repeated, empty, and zero roots', () => {
    for (const roots of [initialRoots(), [], [{ id: 1, value: 0, multiplicity: 4 }]]) for (const leading of [0, .08, -.08]) {
      const view = fitPolynomial(roots, leading); expect(Object.values(view).every(Number.isFinite)).toBe(true); expect(view.xmax).toBeGreaterThan(view.xmin); expect(view.ymax).toBeGreaterThan(view.ymin);
    }
  });
});
