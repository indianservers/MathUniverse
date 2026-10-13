import { answersMatchChallenge, formatAlgebraNumber, parseBalanceOperand, polynomialCoefficients, solveAbsoluteEquation, solveQuadraticEquation, describeLinearSolution, formatInequalitySolution } from './algebraStudioMath';

export type EquationMode = 'Linear' | 'Quadratic' | 'Absolute Value' | 'Inequalities';
export type Relation = '=' | '<' | '<=' | '>' | '>=';
export type Polynomial = [number, number, number];
export type EquationModel = { left: Polynomial; right: Polynomial; relation: Relation; absolute: boolean; scale: number; offset: number };
export type Operation = 'Add' | 'Subtract' | 'Multiply' | 'Divide';
export const equationModes: EquationMode[] = ['Linear', 'Quadratic', 'Absolute Value', 'Inequalities'];
export function equationNumber(value: number): string {
  for (let denominator = 1; denominator <= 24; denominator++) {
    const numerator = Math.round(value * denominator);
    if (Math.abs(value - numerator / denominator) < 1e-9) return denominator === 1 ? String(numerator) : `${numerator}/${denominator}`;
  }
  return formatAlgebraNumber(value);
}
export const initialEquation = (mode: EquationMode): EquationModel => ({ left: mode === 'Quadratic' ? [3, 5, 2] : [0, 3, 5], right: mode === 'Linear' ? [0, 2, -1] : [0, 0, mode === 'Quadratic' ? 0 : -1], relation: mode === 'Inequalities' ? '>' : '=', absolute: mode === 'Absolute Value', scale: 1, offset: 0 });
export function polynomialText(poly: Polynomial): string {
  const terms = poly.flatMap((n, i) => {
    if (Math.abs(n) < 1e-10) return [];
    const variable = i === 0 ? 'x²' : i === 1 ? 'x' : '';
    return [{ negative: n < 0, text: `${variable && Math.abs(n) === 1 ? '' : equationNumber(Math.abs(n))}${variable}` }];
  });
  return terms.map((term, i) => `${term.negative ? (i ? ' − ' : '−') : i ? ' + ' : ''}${term.text}`).join('') || '0';
}
export function equationText(model: EquationModel): string {
  const inner = polynomialText(model.left);
  const left = model.absolute ? `${model.scale === 1 ? '' : formatAlgebraNumber(model.scale)}|${inner}|${model.offset ? `${model.offset < 0 ? ' − ' : ' + '}${formatAlgebraNumber(Math.abs(model.offset))}` : ''}` : inner;
  return `${left} ${model.relation.replace('<=', '≤').replace('>=', '≥')} ${polynomialText(model.right)}`;
}
export function transformEquation(model: EquationModel, operation: Operation, operand: string, both = true): { ok: true; model: EquationModel; flipped: boolean } | { ok: false; error: string } {
  const parsed = parseBalanceOperand(operand);
  if (!parsed.ok) return parsed;
  const { x, n } = parsed.term;
  const next = { ...model, left: [...model.left] as Polynomial, right: [...model.right] as Polynomial };
  if (operation === 'Add' || operation === 'Subtract') {
    if (model.absolute && x) return { ok: false, error: 'Use a constant outside the absolute value. Changing its inside is a new equation.' };
    const sign = operation === 'Add' ? 1 : -1;
    if (model.absolute) next.offset += sign * n;
    else { next.left[1] += sign * x; next.left[2] += sign * n; }
    if (both) { next.right[1] += sign * x; next.right[2] += sign * n; }
    return { ok: true, model: next, flipped: false };
  }
  if (x || Math.abs(n) < 1e-10) return { ok: false, error: 'Multiply or divide by a nonzero constant to preserve the solution set.' };
  const scale = operation === 'Multiply' ? n : 1 / n;
  if (model.absolute) { next.scale *= scale; next.offset *= scale; }
  else next.left = next.left.map(v => v * scale) as Polynomial;
  if (both) next.right = next.right.map(v => v * scale) as Polynomial;
  const flipped = both && scale < 0 && model.relation !== '=';
  if (flipped) next.relation = ({ '<': '>', '<=': '>=', '>': '<', '>=': '<=' } as Record<string, Relation>)[model.relation];
  return { ok: true, model: next, flipped };
}
export function equationSolution(model: EquationModel) {
  const p = model.left.map((v, i) => v - model.right[i]) as Polynomial;
  if (model.absolute) {
    const solution = solveAbsoluteEquation(model.left[1], model.left[2], (model.right[2] - model.offset) / model.scale);
    return { text: solution.kind === 'finite' ? solution.values.map(x => `x = ${equationNumber(x)}`).join('; ') : solution.text, roots: solution.values, all: solution.kind === 'all', none: solution.kind === 'none', boundary: undefined as number | undefined, relation: model.relation, discriminant: undefined as number | undefined };
  }
  if (model.relation !== '=') {
    const solution = formatInequalitySolution(p[1], p[2], model.relation, 0);
    return { text: solution.kind === 'interval' ? `x ${solution.relation.replace('<=', '≤').replace('>=', '≥')} ${equationNumber(solution.boundary)}` : solution.text, roots: solution.kind === 'interval' ? [solution.boundary] : [], all: solution.kind === 'constant' && solution.truth, none: solution.kind === 'constant' && !solution.truth, boundary: solution.kind === 'interval' ? solution.boundary : undefined, relation: solution.kind === 'interval' ? solution.relation : model.relation, discriminant: undefined as number | undefined };
  }
  if (Math.abs(p[0]) > 1e-10) {
    const solution = solveQuadraticEquation(...p);
    const roots = solution.roots.filter(root => Math.abs(root.imaginary) < 1e-10).map(root => root.real);
    return { text: roots.length ? roots.map(x => `x = ${equationNumber(x)}`).join('; ') : solution.text, roots, all: false, none: roots.length === 0, boundary: undefined as number | undefined, relation: model.relation, discriminant: p[1] ** 2 - 4 * p[0] * p[2] };
  }
  const solution = describeLinearSolution(p[1], p[2], 0, 0);
  return { text: solution.text, roots: solution.kind === 'one' ? [solution.value] : [], all: solution.kind === 'all', none: solution.kind === 'none', boundary: undefined as number | undefined, relation: model.relation, discriminant: undefined as number | undefined };
}
export function parseEquation(text: string, mode: EquationMode): { ok: true; model: EquationModel } | { ok: false; error: string } {
  const normalized = text.replace(/−/g, '-').replace(/²/g, '^2').replace(/≤/g, '<=').replace(/≥/g, '>=').replace(/abs\(([^)]+)\)/i, '|$1|');
  const match = normalized.match(/^(.+?)\s*(<=|>=|=|<|>)\s*(.+)$/);
  if (!match || (mode === 'Inequalities' ? match[2] === '=' : match[2] !== '=')) return { ok: false, error: mode === 'Inequalities' ? 'Enter an inequality such as 3x + 5 > -1.' : 'Enter an equation with an equals sign.' };
  const read = (part: string): Polynomial | undefined => {
    const parsed = polynomialCoefficients(part);
    if (!parsed.ok || !parsed.coeffs.every(Number.isFinite) || parsed.degree > (mode === 'Quadratic' ? 2 : 1)) return undefined;
    const padded = [0, 0, 0, ...parsed.coeffs];
    return padded.slice(-3) as Polynomial;
  };
  const inside = mode === 'Absolute Value' ? match[1].trim().match(/^\|(.+)\|$/)?.[1] : match[1];
  const left = inside ? read(inside) : undefined;
  const right = read(match[3]);
  if (!left || !right || (mode === 'Absolute Value' && (right[0] || right[1]))) return { ok: false, error: mode === 'Absolute Value' ? 'Use |ax + b| = a constant, such as |3x + 5| = 7.' : 'Use a polynomial of the degree shown by this mode.' };
  return { ok: true, model: { left, right, relation: match[2] as Relation, absolute: mode === 'Absolute Value', scale: 1, offset: 0 } };
}
export function evaluateSides(model: EquationModel, x: number) {
  const evaluate = (p: Polynomial) => p[0] * x * x + p[1] * x + p[2];
  return [model.absolute ? model.scale * Math.abs(evaluate(model.left)) + model.offset : evaluate(model.left), evaluate(model.right)];
}
export function challengeMatches(answer: string, original: EquationModel): boolean {
  const solution = equationSolution(original);
  const clean = answer.trim().toLowerCase();
  if (solution.all) return ['all real values', 'all real numbers', 'all reals', 'r', 'ℝ'].includes(clean);
  if (solution.none) return ['no solution', 'no real solution', 'none', '∅'].includes(clean);
  if (solution.boundary !== undefined) {
    const parsed = parseEquation(answer, 'Inequalities');
    if (!parsed.ok) return false;
    const entered = equationSolution(parsed.model);
    return entered.boundary !== undefined && Math.abs(entered.boundary - solution.boundary) < 1e-7 && entered.relation === solution.relation;
  }
  return solution.roots.some(root => answersMatchChallenge(answer.replace(/^\s*x\s*=\s*/i, ''), root));
}
