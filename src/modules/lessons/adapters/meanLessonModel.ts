export const meanDefault = [2, 3, 4, 4, 5, 6, 7, 8, 9];
export function meanValue(values: number[]): number | null { return values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : null; }
export function deviations(values: number[]) { const mean = meanValue(values) ?? 0; return values.map(value => value - mean); }
export function sumDeviation(values: number[]) { return deviations(values).reduce((sum, value) => sum + value, 0); }
export function meanPractice(values: number[]) { return meanValue(values); }
export function isMeanAnswer(values: number[], answer: number | string) { const parsed = typeof answer === "string" ? Number(answer) : answer; return Number.isFinite(parsed) && Math.abs(parsed - (meanValue(values) ?? NaN)) < 0.005; }
