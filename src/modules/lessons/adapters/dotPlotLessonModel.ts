import { quartiles } from "./quartilesLessonModel";
export const dotDefault = [2, 2, 3, 4, 4, 4, 5, 5, 5, 6, 7];
export function dotCounts(values: number[]) { return values.reduce<Record<number, number>>((out, value) => { out[value] = (out[value] ?? 0) + 1; return out; }, {}); }
export function dotMode(values: number[]) { const counts = dotCounts(values); const max = Math.max(0, ...Object.values(counts)); return Object.keys(counts).map(Number).filter(value => counts[value] === max).sort((a, b) => a - b); }
export function dotMedian(values: number[]) { const data = [...values].sort((a, b) => a - b); if (!data.length) return null; const i = Math.floor(data.length / 2); return data.length % 2 ? data[i] : (data[i - 1] + data[i]) / 2; }
export function dotIqr(values: number[]) { return quartiles(values)?.iqr ?? null; }
