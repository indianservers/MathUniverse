export interface WeightedRow { value: number; weight: number; }
export const weightedDefault: WeightedRow[] = [{ value: 2, weight: 2 }, { value: 4, weight: 3 }, { value: 6, weight: 2 }, { value: 8, weight: 3 }];
export function weightedSum(rows: WeightedRow[]) { return rows.reduce((sum, row) => sum + row.value * row.weight, 0); }
export function totalWeight(rows: WeightedRow[]) { return rows.reduce((sum, row) => sum + row.weight, 0); }
export function weightedMean(rows: WeightedRow[]) { const weight = totalWeight(rows); return weight ? weightedSum(rows) / weight : null; }
export function ordinaryMean(rows: WeightedRow[]) { return rows.length ? rows.reduce((sum, row) => sum + row.value, 0) / rows.length : null; }
export function weightedAnswer(rows: WeightedRow[], answer: string) { const value = Number(answer); const expected = weightedMean(rows); return expected !== null && Number.isFinite(value) && Math.abs(value - expected) < .005; }
