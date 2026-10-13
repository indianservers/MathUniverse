import { describe, expect, it } from 'vitest';
import { baseValue, continuityAt, contains, inverseValue, piecewiseAt, properties, safeExpression, transformedValue, type Parameters, type Piece } from './functionsDashboardMath';
const p: Parameters = { family: 'x^2', a: 1.5, h: 2, k: -1 };
const pieces: Piece[] = [{ id: 1, expression: '1.5x - 1', min: null, max: 2, includeMin: true, includeMax: false }, { id: 2, expression: 'x^2', min: 2, max: null, includeMin: true, includeMax: false }];
describe('functions reference models', () => {
  it('evaluates both pieces and honors the closed boundary', () => {
    expect(piecewiseAt(pieces, 1).value).toBe(.5);
    expect(piecewiseAt(pieces, 2).value).toBe(4);
    expect(contains(pieces[0], 2)).toBe(false);
    expect(continuityAt(pieces, 2)).toEqual({ left: 2, right: 4, value: 4, continuous: false });
  });
  it('detects a continuous join after editing the rule', () => {
    const joined = [{ ...pieces[0], expression: '1.5x + 1' }, pieces[1]];
    expect(continuityAt(joined, 2).continuous).toBe(true);
  });
  it('rejects ambiguous and uncovered boundary values', () => {
    expect(piecewiseAt([{ ...pieces[0], includeMax: true }, pieces[1]], 2).overlap).toBe(true);
    expect(piecewiseAt([pieces[0], { ...pieces[1], includeMin: false }], 2).value).toBeNaN();
    expect(continuityAt([pieces[0], { ...pieces[1], includeMin: false }], 2).continuous).toBe(false);
  });
  it('handles bounded extra pieces and invalid expressions', () => {
    const bounded = { ...pieces[1], max: 4, includeMax: false };
    expect(contains(bounded, 3)).toBe(true);
    expect(contains(bounded, 4)).toBe(false);
    expect(safeExpression('invalid(x)')(2)).toBeNaN();
    expect(safeExpression('1/x')(0)).toBeNaN();
  });
  it('matches the transformed parabola and its domain/range', () => {
    expect(transformedValue(p, 2)).toBe(-1);
    expect(transformedValue(p, 0)).toBe(5);
    expect(properties(p)).toEqual({ domain: '(−∞, ∞)', range: '[-1, ∞)' });
  });
  it('reflects the selected inverse branch and rejects inputs outside its range', () => {
    expect(inverseValue(p, -1, 'right')).toBe(2);
    expect(inverseValue(p, 5, 'right')).toBe(4);
    expect(inverseValue(p, 5, 'left')).toBe(0);
    expect(inverseValue(p, -2, 'right')).toBeNaN();
    expect(inverseValue({ ...p, a: 0 }, 2, 'right')).toBeNaN();
  });
  for (const family of ['x', 'x^3', '2^x', 'sqrt(x)', '1/x', 'log(x)', 'sin(x)', 'abs(x)'] as const) it(`checks ${family} inverse round trips`, () => {
    const params = { ...p, family }; const x = family === 'sin(x)' ? 2.5 : 3;
    expect(inverseValue(params, transformedValue(params, x), 'right')).toBeCloseTo(x);
  });
  it('composition order changes the reference output', () => {
    const f = { ...p, h: 0, k: 0 }, g: Parameters = { family: 'x', a: 1, h: 0, k: -1 };
    expect(transformedValue(f, transformedValue(g, 2))).toBe(1.5);
    expect(transformedValue(g, transformedValue(f, 2))).toBe(5);
  });
  it('reports excluded exponential and reciprocal range endpoints', () => {
    expect(properties({ ...p, family: '2^x' }).range).toBe('(-1, ∞)');
    expect(properties({ ...p, family: '1/x' }).range).toBe('ℝ ∖ {-1}');
    expect(baseValue('log(x)', -1)).toBeNaN();
    expect(baseValue('sqrt(x)', -1)).toBeNaN();
  });
});
