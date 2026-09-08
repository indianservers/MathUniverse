export type BallColor = "R" | "B";
export type DrawPath = "RR" | "RB" | "BR" | "BB";
export const EXPERIMENT_BALLS = ["R1", "R2", "R3", "B1", "B2"] as const;
export type BallId = typeof EXPERIMENT_BALLS[number];
export function pathProbability(first: number, second: number, total: number, same: boolean, replacement: boolean) {
  const next = second - (!replacement && same ? 1 : 0), remaining = total - (replacement ? 0 : 1);
  if (total < 1 || remaining < 1 || first < 0 || next < 0) return { numerator: 0, denominator: 1, value: 0 };
  return { numerator: first * next, denominator: total * remaining, value: first / total * (next / remaining) };
}
export function multiplicationTree(replacement = false) {
  return (["RR", "RB", "BR", "BB"] as DrawPath[]).map(path => {
    const first = path[0] === "R" ? 3 : 2, second = path[1] === "R" ? 3 : 2;
    return { path, first, second: second - (!replacement && path[0] === path[1] ? 1 : 0), remaining: replacement ? 5 : 4, ...pathProbability(first, second, 5, path[0] === path[1], replacement) };
  });
}
export function drawBall(draws: BallId[], id: BallId, replacement: boolean): BallId[] {
  if (draws.length >= 2 || !replacement && draws.includes(id)) return draws;
  return [...draws, id];
}
export function reducedProbability(n: number, d: number) {
  const gcd = (a: number, b: number): number => b ? gcd(b, a % b) : a;
  const divisor = gcd(n, d);
  return `${n / divisor}/${d / divisor}`;
}
export function checkProbabilityInput(input: string, expected: number) {
  const parts = input.trim().split("/");
  if (parts.length > 2 || parts.some(part => !/^\d+(\.\d+)?$/.test(part.trim()))) return false;
  const value = parts.length === 2 ? Number(parts[0]) / Number(parts[1]) : Number(parts[0]);
  return Number.isFinite(value) && Math.abs(value - expected) < .00001;
}
