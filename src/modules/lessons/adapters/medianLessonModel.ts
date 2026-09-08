export const medianDefault = [8, 1, 7, 3, 9, 5, 2];
export function sorted(values: number[]) { return [...values].sort((a, b) => a - b); }
export function medianValue(values: number[]): number | null { const data = sorted(values); if (!data.length) return null; const middle = Math.floor(data.length / 2); return data.length % 2 ? data[middle] : (data[middle - 1] + data[middle]) / 2; }
export function isMedianAnswer(values: number[], answer: string | number) { const parsed = Number(answer); const expected = medianValue(values); return expected !== null && Number.isFinite(parsed) && Math.abs(parsed - expected) < 0.005; }
