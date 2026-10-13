import { describe, expect, it } from 'vitest';
import { challengeMatches, equationModes, equationSolution, evaluateSides, initialEquation, parseEquation, transformEquation, type EquationModel } from './equationsDashboardMath';

describe('equation dashboard transformations', () => {
  it('solves the four reference examples', () => {
    expect(equationSolution(initialEquation('Linear')).roots).toEqual([-6]);
    expect(equationSolution(initialEquation('Quadratic')).roots.sort()).toEqual([-1, -2 / 3].sort());
    expect(equationSolution(initialEquation('Absolute Value')).none).toBe(true);
    expect(equationSolution(initialEquation('Inequalities'))).toMatchObject({ boundary: -2, relation: '>' });
  });
  for (const mode of equationModes) {
    it(`preserves ${mode} solutions under constant operations`, () => {
      let model = initialEquation(mode);
      const before = equationSolution(model);
      for (const [operation, operand] of [['Add', '5'], ['Subtract', '-3'], ['Multiply', '-2'], ['Divide', '4']] as const) {
        const result = transformEquation(model, operation, operand);
        expect(result.ok).toBe(true);
        if (result.ok) model = result.model;
        const after = equationSolution(model);
        expect(after.roots.slice().sort()).toEqual(before.roots.slice().sort());
        expect(after.none).toBe(before.none);
        expect(after.relation === '>' || after.relation === '=').toBe(true);
      }
    });
  }
  it('subtracts a negative operand with its actual mathematical sign', () => {
    const result = transformEquation(initialEquation('Linear'), 'Subtract', '-2x');
    expect(result.ok && result.model.left[1]).toBe(5);
    expect(result.ok && result.model.right[1]).toBe(4);
  });
  it('flips negative inequalities and respects inclusive boundaries', () => {
    const model = { ...initialEquation('Inequalities'), relation: '>=' as const };
    const result = transformEquation(model, 'Divide', '-3');
    expect(result.ok && result.flipped).toBe(true);
    expect(result.ok && result.model.relation).toBe('<=');
    if (result.ok) { expect(equationSolution(result.model).boundary).toBeCloseTo(-2); expect(equationSolution(result.model).relation).toBe('>='); }
  });
  it('rejects zero scales and variable divisors', () => {
    for (const operation of ['Multiply', 'Divide'] as const) for (const value of ['0', 'x', 'bad']) expect(transformEquation(initialEquation('Linear'), operation, value).ok).toBe(false);
  });
  it('keeps absolute transformations outside the bars', () => {
    const model = { ...initialEquation('Absolute Value'), right: [0, 0, 7] } as EquationModel;
    const added = transformEquation(model, 'Add', '4');
    expect(added.ok && added.model.left).toEqual(model.left);
    expect(added.ok && added.model.offset).toBe(4);
    const scaled = added.ok ? transformEquation(added.model, 'Multiply', '-2') : added;
    expect(scaled.ok && equationSolution(scaled.model).roots).toEqual([-4, 2 / 3]);
    if (scaled.ok) for (const x of equationSolution(scaled.model).roots) { const [left, right] = evaluateSides(scaled.model, x); expect(left).toBeCloseTo(right); }
    expect(transformEquation(model, 'Subtract', '2x').ok).toBe(false);
  });
  it('normalizes both sides of a quadratic', () => {
    const result = parseEquation('3x² + 5x + 4 = 2', 'Quadratic');
    expect(result.ok && equationSolution(result.model).roots.sort()).toEqual([-1, -2 / 3].sort());
    expect(parseEquation('x^3 = 2', 'Quadratic').ok).toBe(false);
  });
  it('distinguishes identities, contradictions, and degenerate quadratics', () => {
    for (const [text, expected] of [['0x = 0', 'all'], ['0x = 1', 'none']] as const) {
      const parsed = parseEquation(text, 'Linear'); expect(parsed.ok && equationSolution(parsed.model)[expected]).toBe(true);
    }
    const linear = parseEquation('0x² + 2x + 6 = 0', 'Quadratic');
    expect(linear.ok && equationSolution(linear.model).roots).toEqual([-3]);
    const constant = parseEquation('|0x + 3| = 3', 'Absolute Value'); expect(constant.ok && equationSolution(constant.model).all).toBe(true);
  });
  it('makes one-sided exploration visibly change the solution', () => {
    const result = transformEquation(initialEquation('Linear'), 'Add', '1', false);
    expect(result.ok && equationSolution(result.model).roots).toEqual([-7]);
  });
  it('checks inequality solution sets rather than accepting just a boundary', () => {
    const original = initialEquation('Inequalities');
    expect(challengeMatches('-2', original)).toBe(false);
    expect(challengeMatches('x >= -2', original)).toBe(false);
    expect(challengeMatches('x > -2', original)).toBe(true);
    expect(challengeMatches('-x < 2', original)).toBe(true);
    expect(challengeMatches('x=-6', initialEquation('Linear'))).toBe(true);
    expect(challengeMatches('No real solution', initialEquation('Absolute Value'))).toBe(true);
  });
});
