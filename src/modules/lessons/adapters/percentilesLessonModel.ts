export const percentileDefault = [2, 3, 4, 4, 5, 6, 7, 8, 10];
export function ordered(values: number[]) { return [...values].sort((a, b) => a - b); }
export function percentileRank(percent: number, values: number[]) { const data = ordered(values); if (!data.length) return null; const rank = percent / 100 * (data.length + 1); if (rank <= 1) return data[0]; if (rank >= data.length) return data[data.length - 1]; const lower = Math.floor(rank); return data[lower - 1] + (rank - lower) * (data[lower] - data[lower - 1]); }
export function percentileOfValue(value: number, values: number[]) { const data = ordered(values); const position = data.findIndex(item => item >= value); return position < 0 ? 100 : position / (data.length + 1) * 100; }
export function percentileAnswer(percent: number, values: number[], answer: string) { const expected = percentileRank(percent, values); return expected !== null && Math.abs(Number(answer) - expected) < .01; }
