export const defaultFrequencyData = [1, 2, 2, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 5, 6, 6, 7, 8, 9];
export const challengeData = [2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 4, 5, 5, 6, 7];
export interface FrequencyRow { value: number; frequency: number; relative: number; tally: string; }
export function frequencyRows(data: number[]): FrequencyRow[] {
  const counts = new Map<number, number>();
  data.filter(Number.isFinite).forEach(value => counts.set(value, (counts.get(value) ?? 0) + 1));
  const total = data.filter(Number.isFinite).length;
  return [...counts.entries()].sort((a, b) => a[0] - b[0]).map(([value, frequency]) => ({
    value, frequency, relative: total ? frequency / total : 0, tally: "|||||".repeat(Math.floor(frequency / 5)) + "|".repeat(frequency % 5),
  }));
}
export function relativeTotal(rows: FrequencyRow[]): number { return rows.reduce((sum, row) => sum + row.relative, 0); }
export function modeOf(rows: FrequencyRow[]): number | null { return rows.length ? rows.reduce((best, row) => row.frequency > best.frequency ? row : best).value : null; }
export function medianOf(data: number[]): number | null {
  const values = data.filter(Number.isFinite).sort((a, b) => a - b);
  if (!values.length) return null;
  const middle = Math.floor(values.length / 2);
  return values.length % 2 ? values[middle] : (values[middle - 1] + values[middle]) / 2;
}
export function rangeOf(data: number[]): number | null {
  const values = data.filter(Number.isFinite);
  return values.length ? Math.max(...values) - Math.min(...values) : null;
}
export function meanOf(data: number[]): number | null {
  const values = data.filter(Number.isFinite);
  return values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : null;
}
export function repairedChallenge(data: number[], proposed: Record<number, number>): boolean {
  const expected = frequencyRows(data);
  return expected.length === Object.keys(proposed).length && expected.every(row => proposed[row.value] === row.frequency);
}
