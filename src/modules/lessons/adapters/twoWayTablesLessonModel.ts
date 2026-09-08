export type TwoWayCounts = { rr: number; rb: number; br: number; bb: number };
export type ConditionalFocus = "blueGivenRed" | "redGivenBlue" | "blueGivenBlue" | "redGivenRed";
export const defaultTwoWayCounts: TwoWayCounts = { rr: 3, rb: 3, br: 2, bb: 2 };

export function sanitizeCount(value: number) { return Math.max(0, Math.round(Number.isFinite(value) ? value : 0)); }
export function twoWaySummary(counts: TwoWayCounts) {
  const firstRed = counts.rr + counts.rb;
  const firstBlue = counts.br + counts.bb;
  const secondRed = counts.rr + counts.br;
  const secondBlue = counts.rb + counts.bb;
  const total = firstRed + firstBlue;
  const divide = (part: number, whole = total) => whole === 0 ? 0 : part / whole;
  const independenceDifference = Math.abs(divide(counts.rr) - divide(firstRed) * divide(secondRed));
  return { firstRed, firstBlue, secondRed, secondBlue, total, divide, independenceDifference, independent: total > 0 && independenceDifference < 0.00001 };
}
export function conditionalValue(counts: TwoWayCounts, focus: ConditionalFocus) {
  const summary = twoWaySummary(counts);
  if (focus === "blueGivenRed") return summary.divide(counts.rb, summary.firstRed);
  if (focus === "redGivenBlue") return summary.divide(counts.br, summary.firstBlue);
  if (focus === "blueGivenBlue") return summary.divide(counts.bb, summary.firstBlue);
  return summary.divide(counts.rr, summary.firstRed);
}
export function focusCell(focus: ConditionalFocus) {
  return focus === "blueGivenRed" ? "rb" : focus === "redGivenBlue" ? "br" : focus === "blueGivenBlue" ? "bb" : "rr";
}
