import { polynomialFromRoots } from './algebraEnhancementEngine';
import { addPolynomials, formatAlgebraNumber, multiplyPolynomials } from './algebraStudioMath';
export const polynomialModes = ['Roots', 'Factors', 'Division', 'End Behavior', 'Multiplicity'] as const;
export type RootFactor = { id: number; value: number; multiplicity: number };
export const rootColors = ['#ff4265', '#008fff', '#00b5a0', '#9445ff', '#ff9c16'];
export const initialRoots = (): RootFactor[] => [-3, -1, 2, 4].map((value, index) => ({ id: index + 1, value, multiplicity: 1 }));
export const pn = (value: number) => Number.isFinite(value) ? formatAlgebraNumber(Math.abs(value) < 1e-10 ? 0 : value) : 'undefined';
export function coefficientsFromFactors(roots: RootFactor[], leading: number) {
  return polynomialFromRoots(roots.flatMap(root => Array.from({ length: root.multiplicity }, () => root.value))).map(value => value * leading);
}
export const polynomialAt = (coefficients: number[], x: number) => coefficients.reduce((value, c) => value * x + c, 0);
export const factorText = (root: number) => root === 0 ? 'x' : `(x ${root < 0 ? '+' : '−'} ${pn(Math.abs(root))})`;
export function groupedRoots(roots: RootFactor[]) {
  const groups: RootFactor[] = [];
  for (const root of roots) {
    const existing = groups.find(item => Math.abs(item.value - root.value) < 1e-10);
    if (existing) existing.multiplicity += root.multiplicity;
    else groups.push({ ...root });
  }
  return groups;
}
export function factoredText(roots: RootFactor[], leading: number, latex = false) {
  if (!leading || !roots.length) return pn(leading);
  return `${leading === 1 ? '' : leading === -1 ? '−' : pn(leading)}${groupedRoots(roots).map(root => `${factorText(root.value)}${root.multiplicity > 1 ? latex ? `^{${root.multiplicity}}` : `^${root.multiplicity}` : ''}`).join('')}`;
}
export function expandedText(coefficients: number[]) {
  const terms = coefficients.flatMap((value, i) => {
    if (Math.abs(value) < 1e-10) return [];
    const power = coefficients.length - i - 1;
    const monomial = power ? `x${power > 1 ? `^{${power}}` : ''}` : '';
    return [{ sign: value < 0 ? '−' : '+', body: `${power && Math.abs(value) === 1 ? '' : pn(Math.abs(value))}${monomial}` }];
  });
  return terms.map((term, i) => `${i ? ` ${term.sign} ` : term.sign === '−' ? '−' : ''}${term.body}`).join('') || '0';
}
export function endBehavior(degree: number, leading: number) {
  if (!leading) return { leftUp: false, rightUp: false, text: 'Zero polynomial', left: '0', right: '0', special: true };
  if (!degree) return { leftUp: false, rightUp: false, text: 'Constant polynomial', left: pn(leading), right: pn(leading), special: true };
  const rightUp = leading > 0, leftUp = degree % 2 === 0 ? rightUp : !rightUp;
  return { leftUp, rightUp, text: leftUp === rightUp ? rightUp ? 'Both ends rise.' : 'Both ends fall.' : leftUp ? 'Left rises; right falls.' : 'Left falls; right rises.', left: leftUp ? '+∞' : '−∞', right: rightUp ? '+∞' : '−∞', special: false };
}
export function divideCoefficients(numerator: number[], divisor: number[]) {
  const trim = (coefficients: number[]) => { const first = coefficients.findIndex(value => Math.abs(value) > 1e-12); return first < 0 ? [0] : coefficients.slice(first); };
  const denominator = trim(divisor);
  if (denominator.length === 1 && Math.abs(denominator[0]) < 1e-12) return { ok: false as const, error: 'A zero polynomial cannot be a divisor.' };
  const remainder = trim(numerator).slice();
  const quotientLength = Math.max(1, remainder.length - denominator.length + 1);
  const quotient = Array(quotientLength).fill(0) as number[];
  const steps: { term: number; power: number; remainder: number[] }[] = [];
  while (remainder.length >= denominator.length && remainder.some(v => Math.abs(v) > 1e-10)) {
    const power = remainder.length - denominator.length;
    const term = remainder[0] / denominator[0];
    quotient[quotient.length - 1 - power] = term;
    denominator.forEach((c, i) => { remainder[i] -= term * c; });
    remainder.shift();
    while (remainder.length > 1 && Math.abs(remainder[0]) < 1e-10) remainder.shift();
    steps.push({ term, power, remainder: remainder.length ? remainder.slice() : [0] });
  }
  return { ok: true as const, quotient: trim(quotient), remainder: trim(remainder.length ? remainder : [0]), steps };
}
export function parseDivisor(text: string) {
  const normalized = text.replace(/−/g, '-').replace(/²/g, '^2').replace(/³/g, '^3').replace(/\s/g, '').toLowerCase();
  const raw = normalized.match(/(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?|x|[()+\-*/^]/g) ?? [];
  if (!raw.length || normalized.length > 300 || raw.join('') !== normalized) return { ok: false as const, error: 'Use a polynomial in x with nonnegative integer powers.' };
  const isNumber = (token: string | undefined) => token !== undefined && /^(?:\d|\.)/.test(token);
  const tokens: string[] = [];
  raw.forEach((token, i) => { const previous = raw[i - 1]; if ((previous === 'x' || previous === ')' || isNumber(previous)) && (token === 'x' || token === '(' || isNumber(token))) tokens.push('*'); tokens.push(token); });
  let index = 0;
  const trim = (p: number[]) => { const first = p.findIndex(v => v !== 0); const result = first < 0 ? [0] : p.slice(first); if (result.length > 9 || !result.every(Number.isFinite)) throw new Error('Use a polynomial divisor of degree at most 8 with finite coefficients.'); return result; };
  const atom = (): number[] => {
    const token = tokens[index++];
    if (token === 'x') return [1, 0];
    if (token === '(') { const p = sum(); if (tokens[index++] !== ')') throw new Error('Close each parenthesis.'); return p; }
    if (isNumber(token)) return trim([Number(token)]);
    throw new Error('Enter a polynomial such as x + 1 or x² − 1.');
  };
  const power = (): number[] => { const base = atom(); if (tokens[index] !== '^') return base; index++; const exponent = unary(); if (exponent.length !== 1 || !Number.isInteger(exponent[0]) || exponent[0] < 0 || exponent[0] > 8) throw new Error('Use nonnegative integer powers up to 8.'); let p = [1]; for (let n = 0; n < exponent[0]; n++) p = trim(multiplyPolynomials(p, base)); return p; };
  const unary = (): number[] => { if (tokens[index] === '+') { index++; return unary(); } if (tokens[index] === '-') { index++; return unary().map(v => -v); } return power(); };
  const product = (): number[] => { let p = unary(); while (tokens[index] === '*' || tokens[index] === '/') { const op = tokens[index++], q = unary(); if (op === '*') p = trim(multiplyPolynomials(p, q)); else { if (q.length !== 1 || q[0] === 0) throw new Error('Divide only by a nonzero constant inside a polynomial.'); p = trim(p.map(v => v / q[0])); } } return p; };
  const sum = (): number[] => { let p = product(); while (tokens[index] === '+' || tokens[index] === '-') { const op = tokens[index++], q = product(); p = trim(addPolynomials(p, op === '-' ? q.map(v => -v) : q)); } return p; };
  try { const coefficients = trim(sum()); if (index !== tokens.length) throw new Error('Check the polynomial syntax.'); if (coefficients.length === 1 && coefficients[0] === 0) throw new Error('A zero polynomial cannot be a divisor.'); return { ok: true as const, coefficients }; } catch (error) { return { ok: false as const, error: error instanceof Error ? error.message : 'Could not parse the divisor.' }; }
}
