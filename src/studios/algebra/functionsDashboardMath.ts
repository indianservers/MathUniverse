import { compileFunctionExpression } from '../../utils/functionParser';
import { formatAlgebraNumber } from './algebraStudioMath';
export const functionModes = ['Families', 'Transformations', 'Composition', 'Inverse', 'Piecewise'] as const;
export const families = ['x^2', 'x', 'x^3', '2^x', 'sin(x)', 'abs(x)', 'sqrt(x)', '1/x', 'log(x)'] as const;
export type Family = typeof families[number];
export type Parameters = { family: Family; a: number; h: number; k: number };
export type Piece = { id: number; expression: string; min: number | null; max: number | null; includeMin: boolean; includeMax: boolean };
export const familyNames: Record<Family, string> = { 'x^2': 'Quadratic', x: 'Linear', 'x^3': 'Cubic', '2^x': 'Exponential', 'sin(x)': 'Sine', 'abs(x)': 'Absolute value', 'sqrt(x)': 'Square root', '1/x': 'Reciprocal', 'log(x)': 'Logarithmic' };
export const pretty = (text: string) => text.replace(/\^2/g, '²').replace(/\^3/g, '³').replace(/\*/g, '·').replace(/sqrt\(([^)]+)\)/g, '√($1)').replace(/abs\(([^)]+)\)/g, '|$1|');
export const num = (n: number) => Number.isFinite(n) ? formatAlgebraNumber(n) : 'undefined';
export function baseValue(family: Family, x: number): number {
  switch (family) { case 'x^2': return x * x; case 'x': return x; case 'x^3': return x ** 3; case '2^x': return 2 ** x; case 'sin(x)': return Math.sin(x); case 'abs(x)': return Math.abs(x); case 'sqrt(x)': return x >= 0 ? Math.sqrt(x) : NaN; case '1/x': return Math.abs(x) > 1e-12 ? 1 / x : NaN; case 'log(x)': return x > 0 ? Math.log10(x) : NaN; }
}
export const transformedValue = (p: Parameters, x: number) => p.a === 0 ? p.k : p.a * baseValue(p.family, x - p.h) + p.k;
export function transformedText(p: Parameters) {
  if (!p.a) return num(p.k);
  const inner = p.h ? `(x ${p.h < 0 ? '+' : '−'} ${num(Math.abs(p.h))})` : 'x';
  const parent = pretty(p.family.replaceAll('x', inner));
  return `${p.a === 1 ? '' : p.a === -1 ? '−' : num(p.a)}${p.family === 'x' && p.a !== 1 && p.a !== -1 && p.h ? '·' : ''}${parent}${p.k ? ` ${p.k < 0 ? '−' : '+'} ${num(Math.abs(p.k))}` : ''}`;
}
export function inverseValue(p: Parameters, x: number, branch: 'right' | 'left') {
  if (!p.a) return NaN;
  const y = (x - p.k) / p.a;
  const sign = branch === 'right' ? 1 : -1;
  switch (p.family) { case 'x^2': return y >= 0 ? p.h + sign * Math.sqrt(y) : NaN; case 'abs(x)': return y >= 0 ? p.h + sign * y : NaN; case 'x': return p.h + y; case 'x^3': return p.h + Math.cbrt(y); case '2^x': return y > 0 ? p.h + Math.log2(y) : NaN; case 'sqrt(x)': return y >= 0 ? p.h + y * y : NaN; case 'sin(x)': return Math.abs(y) <= 1 ? p.h + Math.asin(y) : NaN; case '1/x': return y ? p.h + 1 / y : NaN; case 'log(x)': return p.h + 10 ** y; }
}
export function inverseText(p: Parameters, branch: 'right' | 'left') {
  if (!p.a) return 'No inverse: constant function';
  const y = `(x ${p.k < 0 ? '+' : '−'} ${num(Math.abs(p.k))})/${num(p.a)}`;
  const prefix = p.h ? `${num(p.h)} + ` : '';
  const sign = branch === 'left' ? '−' : '';
  const inner: Record<Family, string> = { 'x^2': `${sign}√(${y})`, 'abs(x)': `${sign}(${y})`, x: y, 'x^3': `∛(${y})`, '2^x': `log₂(${y})`, 'sin(x)': `arcsin(${y})`, 'sqrt(x)': `(${y})²`, '1/x': `1/(${y})`, 'log(x)': `10^(${y})` };
  return prefix + inner[p.family];
}
export function properties(p: Parameters) {
  const bounded = ['x^2', 'abs(x)', 'sqrt(x)'].includes(p.family);
  const domain = p.a === 0 ? '(−∞, ∞)' : p.family === 'sqrt(x)' ? `[${num(p.h)}, ∞)` : p.family === 'log(x)' ? `(${num(p.h)}, ∞)` : p.family === '1/x' ? `ℝ ∖ {${num(p.h)}}` : '(−∞, ∞)';
  const range = p.a === 0 ? `{${num(p.k)}}` : bounded ? p.a > 0 ? `[${num(p.k)}, ∞)` : `(−∞, ${num(p.k)}]` : p.family === '2^x' ? p.a > 0 ? `(${num(p.k)}, ∞)` : `(−∞, ${num(p.k)})` : p.family === '1/x' ? `ℝ ∖ {${num(p.k)}}` : p.family === 'sin(x)' ? `[${num(p.k - Math.abs(p.a))}, ${num(p.k + Math.abs(p.a))}]` : '(−∞, ∞)';
  return { domain, range };
}
export function safeExpression(expression: string): (x: number) => number {
  try { const fn = compileFunctionExpression(expression); return x => { try { const y = fn(x); return typeof y === 'number' && Number.isFinite(y) ? y : NaN; } catch { return NaN; } }; } catch { return () => NaN; }
}
export const contains = (piece: Piece, x: number) => (piece.min === null || (piece.includeMin ? x >= piece.min : x > piece.min)) && (piece.max === null || (piece.includeMax ? x <= piece.max : x < piece.max));
export function piecewiseAt(pieces: Piece[], x: number) {
  const matches = pieces.filter(piece => contains(piece, x));
  return { matches, value: matches.length === 1 ? safeExpression(matches[0].expression)(x) : NaN, overlap: matches.length > 1 };
}
export function intervalText(piece: Piece) {
  if (piece.min === null && piece.max === null) return 'all real x';
  if (piece.min === null) return `x ${piece.includeMax ? '≤' : '<'} ${num(piece.max!)}`;
  if (piece.max === null) return `x ${piece.includeMin ? '≥' : '>'} ${num(piece.min)}`;
  return `${num(piece.min)} ${piece.includeMin ? '≤' : '<'} x ${piece.includeMax ? '≤' : '<'} ${num(piece.max)}`;
}
export function continuityAt(pieces: Piece[], boundary: number) {
  const fromLeft = pieces.filter(p => contains(p, boundary - 1e-6));
  const fromRight = pieces.filter(p => contains(p, boundary + 1e-6));
  const limit = (p: Piece | undefined) => { if (!p) return NaN; return safeExpression(p.expression)(boundary); };
  const left = fromLeft.length === 1 ? limit(fromLeft[0]) : NaN;
  const right = fromRight.length === 1 ? limit(fromRight[0]) : NaN;
  const value = piecewiseAt(pieces, boundary).value;
  const continuous = [left, right, value].every(Number.isFinite) && Math.abs(left - right) < 1e-7 && Math.abs(left - value) < 1e-7;
  return { left, right, value, continuous };
}
