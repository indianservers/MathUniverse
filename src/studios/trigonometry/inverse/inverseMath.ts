export type InverseKind = 'arcsin' | 'arccos' | 'arctan';
export const inverseKinds: InverseKind[] = ['arcsin', 'arccos', 'arctan'];
export const titles = { arcsin: 'Arcsin', arccos: 'Arccos', arctan: 'Arctan' };
export const colors = { arcsin: '#e92265', arccos: '#087cff', arctan: '#008c69' };
export const ranges = { arcsin: '[−π/2, π/2]', arccos: '[0, π]', arctan: '(−π/2, π/2)' };
export const bounds = { arcsin: [-Math.PI / 2, Math.PI / 2], arccos: [0, Math.PI], arctan: [-Math.PI / 2, Math.PI / 2] };
export const forwardNames = { arcsin: 'sin', arccos: 'cos', arctan: 'tan' };
export const clamp = (x: number, min: number, max: number) => Math.max(min, Math.min(max, x));
export const degrees = (x: number) => x * 180 / Math.PI;
export const radians = (x: number) => x * Math.PI / 180;
export const format = (x: number, digits = 4) => Number.isFinite(x) ? (Math.abs(x) < 1e-12 ? 0 : x).toFixed(digits) : 'undefined';
export function inverseValue(kind: InverseKind, x: number): number | null {
  if (!Number.isFinite(x) || (kind !== 'arctan' && Math.abs(x) > 1)) return null;
  const result = kind === 'arcsin' ? Math.asin(x) : kind === 'arccos' ? Math.acos(x) : Math.atan(x);
  // Finite inputs never attain the tangent branch endpoints (even at floating-point extremes).
  return kind === 'arctan' ? clamp(result, -Math.PI / 2 + Number.EPSILON, Math.PI / 2 - Number.EPSILON) : result;
}
export function forwardValue(kind: InverseKind, theta: number): number | null {
  if (!Number.isFinite(theta) || (kind === 'arctan' && Math.abs(Math.cos(theta)) < 1e-12)) return null;
  return kind === 'arcsin' ? Math.sin(theta) : kind === 'arccos' ? Math.cos(theta) : Math.tan(theta);
}
export function composition(kind: InverseKind, reverse: boolean, input: number) {
  const intermediate = reverse ? forwardValue(kind, input) : inverseValue(kind, input);
  // Direct compositions simplify exactly to x on their domain. Avoid cancellation
  // error from tan(atan(x)) at large finite ratios while keeping the computed angle.
  const output = intermediate === null ? null : reverse ? inverseValue(kind, clampForDomain(kind, intermediate)) : input;
  return { intermediate, output, identity: output !== null && Math.abs(output - input) < 1e-9 };
}
function clampForDomain(kind: InverseKind, x: number) { return kind === 'arctan' ? x : clamp(x, -1, 1); }
export function piLabel(theta: number): string {
  if (Math.abs(theta) < 1e-9) return '0';
  for (const d of [1, 2, 3, 4, 6, 12]) {
    const n = Math.round(theta / Math.PI * d);
    if (Math.abs(theta - n * Math.PI / d) < 1e-8) return `${n < 0 ? '−' : ''}${Math.abs(n) === 1 ? '' : Math.abs(n)}π${d === 1 ? '' : `/${d}`}`;
  }
  return `${format(theta)} rad`;
}
export function legacyInverseRoute(mode: string | null): string | null {
  const normalized = mode?.toLowerCase().replace(/[\s_-]+/g, '');
  const map: Record<string, string> = { arcsin: 'arcsin', arccos: 'arccos', arctan: 'arctan', principalvalues: 'principal-values', compositions: 'compositions' };
  return normalized && map[normalized] ? `/trigonometry/inverse/${map[normalized]}` : null;
}
