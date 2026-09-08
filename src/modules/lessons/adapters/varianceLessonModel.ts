export const varianceDefault = [2, 3, 4, 4, 5, 6, 7, 8, 10];
export function mean(values: number[]) { return values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : null; }
export function variance(values: number[], sample = true) { const average = mean(values); const divisor = values.length - (sample ? 1 : 0); return average === null || divisor <= 0 ? null : values.reduce((sum, value) => sum + (value - average) ** 2, 0) / divisor; }
export function standardDeviation(values: number[], sample = true) { const value = variance(values, sample); return value === null ? null : Math.sqrt(value); }
export function varianceAnswer(values: number[], answer: string, sample = true) { const parsed = Number(answer); const expected = variance(values, sample); return expected !== null && Number.isFinite(parsed) && Math.abs(parsed - expected) < .01; }
