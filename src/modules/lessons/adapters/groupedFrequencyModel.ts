export const groupedData = Array.from({ length: 20 }, (_, index) => index + 2);
export interface GroupRow { lower: number; upper: number; frequency: number; width: number; midpoint: number; }
export function groupRows(data: number[], boundaries: number[]): GroupRow[] {
  const sorted = [...boundaries].sort((a, b) => a - b);
  return sorted.slice(0, -1).map((lower, index) => { const upper = sorted[index + 1]; const last = index === sorted.length - 2; const frequency = data.filter(value => value >= lower && (last ? value <= upper : value < upper)).length; return { lower, upper, frequency, width: upper - lower, midpoint: (lower + upper) / 2 }; });
}
export function validBoundaries(boundaries: number[]) { return boundaries.length > 1 && boundaries.every((value, index) => index === 0 || value > boundaries[index - 1]); }
export function boundaryChecks(rows: GroupRow[], data: number[]) { return { noGaps: rows.length > 0 && rows[0].lower <= Math.min(...data) && rows[rows.length - 1].upper >= Math.max(...data) && rows.every((row, index) => index === rows.length - 1 || row.upper === rows[index + 1].lower), noOverlaps: rows.every(row => row.width > 0), total: rows.reduce((sum, row) => sum + row.frequency, 0) === data.length }; }
export function selfCheckFrequencies(values: number[], starts: number[], width: number) { return starts.map(start => values.filter(value => value >= start && value < start + width).length); }
