export const rangeDefault = [2, 3, 4, 5, 6, 7, 8, 10];
export function minValue(values: number[]) { return values.length ? Math.min(...values) : null; }
export function maxValue(values: number[]) { return values.length ? Math.max(...values) : null; }
export function rangeValue(values: number[]) { const min = minValue(values); const max = maxValue(values); return min === null || max === null ? null : max - min; }
export function rangeAnswer(values: number[], answer: string) { const parsed = Number(answer); const expected = rangeValue(values); return expected !== null && Number.isFinite(parsed) && parsed === expected; }
