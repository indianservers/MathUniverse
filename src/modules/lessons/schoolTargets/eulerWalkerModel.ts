import { odeMethodComparison } from "../../../studios/calculus/calculusEnhancementEngine";

export const eulerStepSizes = [0.5, 0.25, 0.1] as const;
export type EulerStepSize = typeof eulerStepSizes[number];
export function eulerWalk(h: EulerStepSize) {
  const count = Math.round(1 / h);
  return Array.from({ length: count + 1 }, (_, n) => {
    const x = n / count;
    const y = n === 0 ? 1 : odeMethodComparison((_x, value) => value, 0, 1, x, n).euler;
    return { n, x, y, slope: y, next: n === count ? null : y * (1 + h), exact: Math.exp(x), error: y - Math.exp(x) };
  });
}
export function checkEulerPractice(first: string, second: string) {
  return [first.trim() !== "" && Math.abs(Number(first) - 1.25) < 0.00005, second.trim() !== "" && Math.abs(Number(second) - 1.5625) < 0.00005];
}
